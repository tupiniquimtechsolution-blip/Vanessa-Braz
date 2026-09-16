#!/usr/bin/env python3
from __future__ import annotations

import argparse
import hashlib
import json
import re
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
MANIFEST_DIR = ROOT / "apps/web/public/media/optimized/manifests"
AUDIT_DIR = ROOT / "apps/web/public/media/optimized/audit"
EXPECTED_IMAGES = 157


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as fh:
        for chunk in iter(lambda: fh.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def rel(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


def pct(delta: int, base: int) -> float:
    return round((delta / base) * 100, 2) if base else 0.0


def parse_frontend_media(path: Path) -> dict[str, list[str]]:
    text = path.read_text(encoding="utf-8")
    categories: dict[str, list[str]] = {"hero": [], "gallery": [], "details": [], "environment": []}
    current: str | None = None
    for raw in text.splitlines():
        line = raw.strip()
        m = re.match(r"(hero|gallery|details|environment):\s*\[", line)
        if m:
            current = m.group(1)
            continue
        if current and line.startswith("],"):
            current = None
            continue
        if current:
            m = re.search(r"image\('([^']+)'\)", line)
            if m:
                categories[current].append(m.group(1))
    return categories


def choose_variant(category: str, item: dict) -> tuple[str, str]:
    web = item["variants"]["web"]
    enhanced = item["variants"]["enhanced"]
    if category == "hero":
        # Enhanced is reserved for the hero only when it provides useful headroom
        # and remains reasonably sized. All other current frontend uses prefer web.
        if max(enhanced["width"], enhanced["height"]) >= 2160 and enhanced["size_bytes"] <= 1_250_000:
            return "enhanced", "hero: extra resolution is useful and file stays under 1.25 MB"
    return "web", "default: optimized web variant is sufficient"


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--frontend-media", default="src/lib/media.ts")
    parser.add_argument("--frontend-ref", default="working-tree")
    args = parser.parse_args()

    manifest_paths = sorted(MANIFEST_DIR.glob("batch-*.json"))
    if not manifest_paths:
        raise SystemExit("No manifests found")

    manifests = [json.loads(p.read_text(encoding="utf-8")) for p in manifest_paths]
    items: list[dict] = []
    for manifest in manifests:
        if manifest.get("source_count") != len(manifest.get("items", [])):
            raise SystemExit(f"source_count mismatch in {manifest.get('batch_id')}")
        for item in manifest["items"]:
            item = dict(item)
            item["batch_id"] = manifest["batch_id"]
            items.append(item)

    issues: list[dict] = []
    warnings: list[dict] = []
    source_path_seen: set[str] = set()
    variant_path_seen: set[str] = set()
    source_sha_groups: dict[str, list[str]] = defaultdict(list)
    web_sha_groups: dict[str, list[str]] = defaultdict(list)
    enhanced_sha_groups: dict[str, list[str]] = defaultdict(list)

    total_source = total_web = total_enhanced = 0
    web_larger_count = 0
    web_larger_20_count = 0
    enhanced_scale_values: list[float] = []

    for item in items:
        source = item["source_path"]
        source_sha_groups[item["source_sha256"]].append(source)
        if source in source_path_seen:
            issues.append({"type": "duplicate_source_path", "path": source})
        source_path_seen.add(source)

        sw, sh = item["source_width"], item["source_height"]
        source_bytes = item["source_size_bytes"]
        total_source += source_bytes

        source_file = ROOT / source
        if not source_file.is_file():
            issues.append({"type": "missing_source_file", "path": source})
        elif sha256_file(source_file) != item["source_sha256"]:
            issues.append({"type": "source_sha_mismatch", "path": source})

        for variant_name in ("web", "enhanced"):
            variant = item["variants"][variant_name]
            vp = variant["path"]
            if vp in variant_path_seen:
                issues.append({"type": "duplicate_variant_path", "path": vp})
            variant_path_seen.add(vp)

            vf = ROOT / vp
            if not vf.is_file():
                issues.append({"type": "missing_variant_file", "variant": variant_name, "path": vp})
            elif sha256_file(vf) != variant["sha256"]:
                issues.append({"type": "variant_sha_mismatch", "variant": variant_name, "path": vp})

            vw, vh = variant["width"], variant["height"]
            src_ratio = sw / sh
            variant_ratio = vw / vh
            if abs(src_ratio - variant_ratio) > 0.002:
                issues.append({"type": "aspect_ratio_changed", "source": source, "variant": variant_name})

            if variant_name == "web":
                total_web += variant["size_bytes"]
                web_sha_groups[variant["sha256"]].append(vp)
                if max(vw, vh) > 1920:
                    issues.append({"type": "web_dimension_over_limit", "path": vp, "width": vw, "height": vh})
                if vw > sw or vh > sh:
                    issues.append({"type": "web_unexpected_upscale", "source": source, "path": vp})
                if max(sw, sh) <= 1920 and (vw != sw or vh != sh):
                    warnings.append({"type": "web_dimensions_changed_below_limit", "source": source, "source_dims": [sw, sh], "web_dims": [vw, vh]})
                diff = variant["size_bytes"] - source_bytes
                if diff > 0:
                    web_larger_count += 1
                    if diff / source_bytes > 0.20:
                        web_larger_20_count += 1
                        warnings.append({
                            "type": "web_over_20_percent_larger",
                            "source": source,
                            "source_bytes": source_bytes,
                            "web_bytes": variant["size_bytes"],
                            "delta_percent": pct(diff, source_bytes),
                        })
            else:
                total_enhanced += variant["size_bytes"]
                enhanced_sha_groups[variant["sha256"]].append(vp)
                if max(vw, vh) > 3840:
                    issues.append({"type": "enhanced_dimension_over_limit", "path": vp, "width": vw, "height": vh})
                scale_w, scale_h = vw / sw, vh / sh
                enhanced_scale_values.extend([scale_w, scale_h])
                if scale_w > 2.001 or scale_h > 2.001:
                    issues.append({"type": "enhanced_scale_over_2x", "source": source, "path": vp, "scale": [scale_w, scale_h]})

    duplicate_sources = [
        {"sha256": sha, "paths": paths}
        for sha, paths in source_sha_groups.items()
        if len(paths) > 1
    ]
    duplicate_web = [
        {"sha256": sha, "paths": paths}
        for sha, paths in web_sha_groups.items()
        if len(paths) > 1
    ]
    duplicate_enhanced = [
        {"sha256": sha, "paths": paths}
        for sha, paths in enhanced_sha_groups.items()
        if len(paths) > 1
    ]

    frontend_path = Path(args.frontend_media)
    if not frontend_path.is_absolute():
        frontend_path = ROOT / frontend_path
    frontend_categories = parse_frontend_media(frontend_path)
    by_name = {Path(item["source_path"]).name: item for item in items}
    frontend_map: list[dict] = []
    frontend_missing: list[dict] = []

    for category, names in frontend_categories.items():
        for position, name in enumerate(names, start=1):
            item = by_name.get(name)
            if not item:
                frontend_missing.append({"category": category, "position": position, "source_name": name})
                continue
            selected, reason = choose_variant(category, item)
            frontend_map.append({
                "category": category,
                "position": position,
                "source_name": name,
                "source_path": item["source_path"],
                "batch_id": item["batch_id"],
                "recommended_variant": selected,
                "recommendation_reason": reason,
                "web": item["variants"]["web"],
                "enhanced": item["variants"]["enhanced"],
                "fallback": f"/media/source/images/{name}",
                "publication_gate": "manual authorization required if an identifiable person appears",
            })

    if frontend_missing:
        issues.extend({"type": "frontend_source_missing_from_manifests", **x} for x in frontend_missing)

    audit = {
        "generated_at_utc": datetime.now(timezone.utc).isoformat(),
        "media_branch_reference": "media/automated-image-pipeline",
        "frontend_ref": args.frontend_ref,
        "manifest_files": [rel(p) for p in manifest_paths],
        "manifest_count": len(manifests),
        "source_items": len(items),
        "expected_source_items": EXPECTED_IMAGES,
        "complete_157": len(items) == EXPECTED_IMAGES,
        "unique_source_paths": len(source_path_seen),
        "duplicate_source_content_groups": duplicate_sources,
        "duplicate_web_content_groups": duplicate_web,
        "duplicate_enhanced_content_groups": duplicate_enhanced,
        "bytes": {
            "source_total": total_source,
            "web_total": total_web,
            "enhanced_total": total_enhanced,
            "web_vs_source_delta_percent": pct(total_web - total_source, total_source),
            "enhanced_vs_source_delta_percent": pct(total_enhanced - total_source, total_source),
        },
        "web_files_larger_than_source": web_larger_count,
        "web_files_over_20_percent_larger_than_source": web_larger_20_count,
        "enhanced_max_scale": round(max(enhanced_scale_values), 4) if enhanced_scale_values else None,
        "frontend": {
            "media_file": str(frontend_path),
            "uses": sum(len(v) for v in frontend_categories.values()),
            "mapped": len(frontend_map),
            "missing": frontend_missing,
        },
        "issues": issues,
        "warnings": warnings,
        "status": "PASS" if len(items) == EXPECTED_IMAGES and not issues else "FAIL",
    }

    AUDIT_DIR.mkdir(parents=True, exist_ok=True)
    (AUDIT_DIR / "manifest-audit.json").write_text(json.dumps(audit, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (AUDIT_DIR / "frontend-media-map.json").write_text(json.dumps(frontend_map, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    md = [
        "# Media Audit — Vanessa Braz",
        "",
        f"- Status estrutural: **{audit['status']}**",
        f"- Manifests: **{len(manifests)}**",
        f"- Derivados auditados: **{len(items)} / {EXPECTED_IMAGES}**",
        f"- Usos atuais do frontend mapeados: **{len(frontend_map)} / {audit['frontend']['uses']}**",
        f"- Grupos de conteúdo original duplicado: **{len(duplicate_sources)}**",
        f"- Web maiores que o JPEG original: **{web_larger_count}**",
        f"- Web >20% maiores que o original: **{web_larger_20_count}**",
        f"- Peso total source: **{total_source / 1024 / 1024:.2f} MiB**",
        f"- Peso total web: **{total_web / 1024 / 1024:.2f} MiB** ({audit['bytes']['web_vs_source_delta_percent']:+.2f}%)",
        f"- Peso total enhanced: **{total_enhanced / 1024 / 1024:.2f} MiB** ({audit['bytes']['enhanced_vs_source_delta_percent']:+.2f}%)",
        "",
        "## Regra de integração proposta",
        "",
        "- `hero`: usar `enhanced` somente quando o arquivo ficar <= 1.25 MB e trouxer resolução útil; fallback no original.",
        "- `gallery`, `details`, `environment`: usar `web` por padrão; `enhanced` somente após gate visual explícito.",
        "- Não publicar imagem com pessoa identificável sem confirmação de autorização; presença no repositório não é consentimento.",
        "- Não remover nem substituir `media/source`.",
        "",
        "## Duplicatas exatas por conteúdo",
        "",
    ]
    if duplicate_sources:
        for group in duplicate_sources:
            md.append(f"- `{group['sha256'][:12]}…`: " + "; ".join(f"`{p}`" for p in group["paths"]))
    else:
        md.append("- Nenhuma.")

    md.extend(["", "## Mapeamento atual do frontend", ""])
    for row in frontend_map:
        selected = row[row["recommended_variant"]]
        md.append(
            f"- **{row['category']} #{row['position']}** `{row['source_name']}` → "
            f"`/{selected['path'].split('apps/web/public/', 1)[1]}` (**{row['recommended_variant']}**, "
            f"{selected['width']}×{selected['height']}, {selected['size_bytes'] / 1024:.1f} KiB)"
        )

    if issues:
        md.extend(["", "## Bloqueios estruturais", ""])
        for issue in issues:
            md.append(f"- `{issue['type']}` — `{json.dumps(issue, ensure_ascii=False)}`")

    md.extend([
        "",
        "## Gate visual ainda necessário",
        "",
        "Este relatório valida estrutura, hash, dimensões, peso e mapeamento. Ele **não** aprova aparência visual. "
        "Antes da integração, comparar original × web × enhanced para halos, oversharpening, pele artificial, mudança de cor, cabelo/detalhes e artefatos de reamostragem.",
        "",
    ])
    (AUDIT_DIR / "MEDIA_AUDIT.md").write_text("\n".join(md), encoding="utf-8")

    print(json.dumps({
        "status": audit["status"],
        "manifests": len(manifests),
        "items": len(items),
        "frontend_mapped": len(frontend_map),
        "frontend_total": audit["frontend"]["uses"],
        "duplicate_groups": len(duplicate_sources),
        "issues": len(issues),
        "warnings": len(warnings),
        "web_total_bytes": total_web,
        "source_total_bytes": total_source,
    }, indent=2))

    return 0 if audit["status"] == "PASS" else 2


if __name__ == "__main__":
    raise SystemExit(main())
