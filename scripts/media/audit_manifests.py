#!/usr/bin/env python3
from __future__ import annotations

import argparse
import hashlib
import json
import re
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
MANIFEST_DIR = ROOT / "apps/web/public/media/optimized/manifests"
AUDIT_DIR = ROOT / "apps/web/public/media/optimized/audit"
EXPECTED_IMAGES = 157
EXPECTED_MANIFESTS = 7
EXPECTED_FRONTEND_USES = 40
OLD_WEB_TOTAL_BYTES = 16029752
BASELINE_AUDIT_SHA = "4976289c95086a5b9a39b49441a4828324bac421"
MIN_SAVING_PERCENT = 10.0
WEB_MAX_LONG_EDGE = 1280
ALLOWED_QUALITIES = {82, 78, 74, 70}
HERO_ENHANCED_NAMES = {
    "WhatsApp Image 2026-09-12 at 10.23.51.jpeg",
    "WhatsApp Image 2026-09-12 at 10.24.30.jpeg",
}


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


def mib(value: int) -> float:
    return round(value / 1024 / 1024, 2)


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


def verify_file(meta: dict, kind: str, issues: list[dict]) -> None:
    path = ROOT / meta["path"]
    if not path.is_file():
        issues.append({"type": f"missing_{kind}_file", "path": meta["path"]})
        return
    if path.stat().st_size != int(meta["size_bytes"]):
        issues.append({"type": f"{kind}_size_mismatch", "path": meta["path"]})
    actual_sha = sha256_file(path)
    if actual_sha != meta["sha256"]:
        issues.append({"type": f"{kind}_sha_mismatch", "path": meta["path"]})


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--frontend-media", default="src/lib/media.ts")
    parser.add_argument("--frontend-ref", default="working-tree")
    args = parser.parse_args()

    manifest_paths = sorted(MANIFEST_DIR.glob("batch-*.json"))
    manifests = [json.loads(p.read_text(encoding="utf-8")) for p in manifest_paths]
    issues: list[dict] = []
    warnings: list[dict] = []

    if len(manifests) != EXPECTED_MANIFESTS:
        issues.append({"type": "manifest_count_mismatch", "expected": EXPECTED_MANIFESTS, "actual": len(manifests)})

    items: list[dict] = []
    for manifest in manifests:
        if manifest.get("web_schema_version") != 2:
            issues.append({"type": "web_schema_version_mismatch", "batch": manifest.get("batch_id")})
        if manifest.get("source_count") != len(manifest.get("items", [])):
            issues.append({"type": "source_count_mismatch", "batch": manifest.get("batch_id")})
        for item in manifest.get("items", []):
            row = dict(item)
            row["batch_id"] = manifest.get("batch_id")
            items.append(row)

    if len(items) != EXPECTED_IMAGES:
        issues.append({"type": "source_total_mismatch", "expected": EXPECTED_IMAGES, "actual": len(items)})

    source_paths: set[str] = set()
    source_sha_groups: dict[str, list[str]] = defaultdict(list)
    web_path_owners: dict[str, list[str]] = defaultdict(list)
    enhanced_path_owners: dict[str, list[str]] = defaultdict(list)
    quality_counts: Counter[int] = Counter()

    total_source = total_web = total_enhanced = 0
    web_recommended = original_recommended = 0
    web_smaller = web_larger = web_gt20_larger = 0

    for item in items:
        source = item.get("source_path")
        if not source or source in source_paths:
            issues.append({"type": "duplicate_or_missing_source_path", "path": source})
            continue
        source_paths.add(source)

        source_file = ROOT / source
        if not source_file.is_file():
            issues.append({"type": "missing_source_file", "path": source})
            continue
        actual_source_sha = sha256_file(source_file)
        if actual_source_sha != item.get("source_sha256"):
            issues.append({"type": "source_sha_mismatch", "path": source})
        source_size = source_file.stat().st_size
        if source_size != int(item.get("source_size_bytes", -1)):
            issues.append({"type": "source_size_mismatch", "path": source})
        total_source += source_size
        source_sha_groups[item["source_sha256"]].append(source)

        sw, sh = int(item["source_width"]), int(item["source_height"])
        web = item.get("variants", {}).get("web")
        enhanced = item.get("variants", {}).get("enhanced")
        if not web or not enhanced:
            issues.append({"type": "missing_variant_metadata", "source": source})
            continue

        verify_file(web, "web", issues)
        verify_file(enhanced, "enhanced", issues)
        web_path_owners[web["path"]].append(source)
        enhanced_path_owners[enhanced["path"]].append(source)

        ww, wh = int(web["width"]), int(web["height"])
        ew, eh = int(enhanced["width"]), int(enhanced["height"])
        if max(ww, wh) > WEB_MAX_LONG_EDGE:
            issues.append({"type": "web_dimension_over_limit", "source": source, "dims": [ww, wh]})
        if ww > sw or wh > sh:
            issues.append({"type": "web_upscale_detected", "source": source, "source_dims": [sw, sh], "web_dims": [ww, wh]})
        if abs((sw / sh) - (ww / wh)) > 0.002:
            issues.append({"type": "web_aspect_ratio_changed", "source": source})
        if abs((sw / sh) - (ew / eh)) > 0.002:
            issues.append({"type": "enhanced_aspect_ratio_changed", "source": source})

        web_size = int(web["size_bytes"])
        enhanced_size = int(enhanced["size_bytes"])
        total_web += web_size
        total_enhanced += enhanced_size
        if web_size < source_size:
            web_smaller += 1
        elif web_size > source_size:
            web_larger += 1
            if (web_size - source_size) / source_size > 0.20:
                web_gt20_larger += 1

        saving_bytes = source_size - web_size
        saving_percent = (saving_bytes / source_size * 100) if source_size else 0.0
        if int(item.get("saving_bytes", 10**18)) != saving_bytes:
            issues.append({"type": "saving_bytes_mismatch", "source": source})
        if abs(float(item.get("saving_percent", 9999)) - round(saving_percent, 2)) > 0.01:
            issues.append({"type": "saving_percent_mismatch", "source": source})

        selected_quality = int(item.get("selected_quality", -1))
        quality_counts[selected_quality] += 1
        if selected_quality not in ALLOWED_QUALITIES:
            issues.append({"type": "invalid_selected_quality", "source": source, "quality": selected_quality})

        recommendation = item.get("recommended_variant")
        recommended_path = item.get("recommended_path")
        if recommendation == "web":
            web_recommended += 1
            if saving_percent + 1e-9 < MIN_SAVING_PERCENT:
                issues.append({"type": "web_recommended_below_10_percent", "source": source, "saving_percent": round(saving_percent, 2)})
            if recommended_path != web["path"]:
                issues.append({"type": "web_recommended_path_mismatch", "source": source})
            if not (ROOT / recommended_path).is_file():
                issues.append({"type": "recommended_file_missing", "source": source, "path": recommended_path})
        elif recommendation == "original":
            original_recommended += 1
            if saving_percent >= MIN_SAVING_PERCENT:
                issues.append({"type": "original_recommended_despite_10_percent_web_saving", "source": source, "saving_percent": round(saving_percent, 2)})
            if recommended_path != source:
                issues.append({"type": "original_recommended_path_mismatch", "source": source})
        else:
            issues.append({"type": "invalid_recommended_variant", "source": source, "value": recommendation})

        canonical = item.get("canonical_source")
        if not canonical:
            issues.append({"type": "missing_canonical_source", "source": source})

        for candidate in item.get("responsive_candidates", []):
            verify_file(candidate, "responsive", issues)
            cw, ch = int(candidate["width"]), int(candidate["height"])
            if cw > sw or ch > sh or max(cw, ch) > WEB_MAX_LONG_EDGE:
                issues.append({"type": "responsive_dimension_invalid", "source": source, "dims": [cw, ch]})
            if int(candidate.get("quality", -1)) not in ALLOWED_QUALITIES:
                issues.append({"type": "responsive_quality_invalid", "source": source, "quality": candidate.get("quality")})

    duplicate_sources = [
        {"sha256": sha, "canonical_source": sorted(paths)[0], "paths": sorted(paths)}
        for sha, paths in source_sha_groups.items() if len(paths) > 1
    ]
    if len(duplicate_sources) != 2:
        issues.append({"type": "duplicate_group_count_mismatch", "expected": 2, "actual": len(duplicate_sources)})
    for group in duplicate_sources:
        canonical = group["canonical_source"]
        for source in group["paths"]:
            row = next((x for x in items if x.get("source_path") == source), None)
            if row and row.get("canonical_source") != canonical:
                issues.append({"type": "canonical_source_mismatch", "source": source, "expected": canonical, "actual": row.get("canonical_source")})

    # Shared WEB paths are legal only for byte-identical source groups.
    for path, owners in web_path_owners.items():
        if len(owners) > 1:
            hashes = {next(x for x in items if x["source_path"] == owner)["source_sha256"] for owner in owners}
            if len(hashes) != 1:
                issues.append({"type": "web_path_shared_across_different_sources", "path": path, "owners": owners})

    frontend_path = Path(args.frontend_media)
    if not frontend_path.is_absolute():
        frontend_path = ROOT / frontend_path
    categories = parse_frontend_media(frontend_path)
    frontend_uses = sum(len(v) for v in categories.values())
    if frontend_uses != EXPECTED_FRONTEND_USES:
        issues.append({"type": "frontend_usage_count_mismatch", "expected": EXPECTED_FRONTEND_USES, "actual": frontend_uses})

    by_name = {Path(item["source_path"]).name: item for item in items}
    frontend_map: list[dict] = []
    frontend_web = frontend_original = enhanced_candidates = 0
    for category, names in categories.items():
        for position, name in enumerate(names, start=1):
            item = by_name.get(name)
            if not item:
                issues.append({"type": "frontend_source_missing_from_manifests", "category": category, "position": position, "source_name": name})
                continue
            recommended = item["recommended_variant"]
            if recommended == "web":
                frontend_web += 1
            else:
                frontend_original += 1
            enhanced_candidate = category == "hero" and name in HERO_ENHANCED_NAMES
            if enhanced_candidate:
                enhanced_candidates += 1
            frontend_map.append({
                "category": category,
                "position": position,
                "source_name": name,
                "source_path": item["source_path"],
                "batch_id": item["batch_id"],
                "recommended_variant": recommended,
                "recommended_path": item["recommended_path"],
                "reason": item["reason"],
                "saving_bytes": item["saving_bytes"],
                "saving_percent": item["saving_percent"],
                "selected_quality": item["selected_quality"],
                "web": item["variants"]["web"],
                "responsive_candidates": item.get("responsive_candidates", []),
                "enhanced": item["variants"]["enhanced"],
                "enhanced_candidate_after_visual_gate": enhanced_candidate,
                "fallback": f"/media/source/images/{name}",
                "publication_gate": "manual authorization required if an identifiable person appears",
            })

    if len(frontend_map) != EXPECTED_FRONTEND_USES:
        issues.append({"type": "frontend_mapped_count_mismatch", "expected": EXPECTED_FRONTEND_USES, "actual": len(frontend_map)})
    if enhanced_candidates != 2:
        issues.append({"type": "hero_enhanced_candidate_count_mismatch", "expected": 2, "actual": enhanced_candidates})

    total_saving_vs_old_web = pct(OLD_WEB_TOTAL_BYTES - total_web, OLD_WEB_TOTAL_BYTES)
    audit = {
        "generated_at_utc": datetime.now(timezone.utc).isoformat(),
        "media_branch_reference": "media/automated-image-pipeline",
        "baseline_audit_sha": BASELINE_AUDIT_SHA,
        "frontend_ref": args.frontend_ref,
        "manifest_files": [rel(p) for p in manifest_paths],
        "manifest_count": len(manifests),
        "source_items": len(items),
        "expected_source_items": EXPECTED_IMAGES,
        "unique_source_paths": len(source_paths),
        "duplicate_source_content_groups": duplicate_sources,
        "bytes": {
            "source_total": total_source,
            "old_web_total": OLD_WEB_TOTAL_BYTES,
            "new_web_total": total_web,
            "enhanced_total": total_enhanced,
            "total_saving_percent_vs_old_web": total_saving_vs_old_web,
            "new_web_vs_source_delta_percent": pct(total_web - total_source, total_source),
        },
        "recommendations": {
            "web": web_recommended,
            "original": original_recommended,
        },
        "web_comparison": {
            "smaller_count": web_smaller,
            "larger_count": web_larger,
            "over_20_percent_larger_count": web_gt20_larger,
        },
        "quality_counts": {str(q): quality_counts.get(q, 0) for q in (82, 78, 74, 70)},
        "frontend": {
            "uses": frontend_uses,
            "mapped": len(frontend_map),
            "web_recommended": frontend_web,
            "original_recommended": frontend_original,
            "enhanced_candidates": enhanced_candidates,
        },
        "issues": issues,
        "warnings": warnings,
        "status": "PASS" if not issues else "FAIL",
    }

    AUDIT_DIR.mkdir(parents=True, exist_ok=True)
    (AUDIT_DIR / "manifest-audit.json").write_text(json.dumps(audit, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (AUDIT_DIR / "frontend-media-map.json").write_text(json.dumps(frontend_map, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    md = [
        "# Media Audit — Vanessa Braz — WEB-v2",
        "",
        f"- Status: **{audit['status']}**",
        f"- Manifests: **{len(manifests)} / {EXPECTED_MANIFESTS}**",
        f"- Sources auditados: **{len(items)} / {EXPECTED_IMAGES}**",
        f"- Frontend mapeado: **{len(frontend_map)} / {EXPECTED_FRONTEND_USES}**",
        f"- Source total: **{mib(total_source):.2f} MiB**",
        f"- WEB antigo: **{mib(OLD_WEB_TOTAL_BYTES):.2f} MiB**",
        f"- WEB novo: **{mib(total_web):.2f} MiB**",
        f"- Economia vs WEB antigo: **{total_saving_vs_old_web:.2f}%**",
        f"- Recomendado WEB: **{web_recommended}**",
        f"- Recomendado ORIGINAL: **{original_recommended}**",
        f"- WEB menor que source: **{web_smaller}**",
        f"- WEB maior que source: **{web_larger}**",
        f"- WEB >20% maior: **{web_gt20_larger}**",
        f"- Qualidades: **q82={quality_counts.get(82, 0)}, q78={quality_counts.get(78, 0)}, q74={quality_counts.get(74, 0)}, q70={quality_counts.get(70, 0)}**",
        f"- Frontend: **web={frontend_web}, original={frontend_original}, enhanced candidates={enhanced_candidates}**",
        f"- Duplicatas exatas: **{len(duplicate_sources)} grupos**",
        "",
        "## Política",
        "",
        "- `recommended_variant=web` somente com economia >=10% contra o source.",
        "- Caso contrário, `recommended_variant=original`; um derivado maior nunca é chamado de otimizado.",
        "- WEB nunca faz upscale e respeita long edge máximo de 1280 px.",
        "- `enhanced` foi preservado; apenas os dois heros definidos permanecem candidatos e ainda exigem gate visual.",
        "- Imagens com pessoas identificáveis continuam pendentes de autorização de publicação.",
        "",
        "## Duplicatas e canonical_source",
        "",
    ]
    for group in duplicate_sources:
        md.append(f"- `{group['sha256'][:12]}…` → canonical `{group['canonical_source']}`; paths: " + "; ".join(f"`{p}`" for p in group["paths"]))

    md.extend(["", "## Mapeamento atual do frontend", ""])
    for row in frontend_map:
        md.append(
            f"- **{row['category']} #{row['position']}** `{row['source_name']}` → **{row['recommended_variant']}** "
            f"({row['saving_percent']:+.2f}%, q{row['selected_quality']})"
            + ("; enhanced candidato após gate visual" if row["enhanced_candidate_after_visual_gate"] else "")
        )

    if issues:
        md.extend(["", "## Bloqueios", ""])
        for issue in issues:
            md.append(f"- `{issue['type']}` — `{json.dumps(issue, ensure_ascii=False)}`")

    md.extend([
        "",
        "## Gate visual ainda necessário",
        "",
        "Esta auditoria aprova somente integridade, peso, hashes, dimensões e regras de recomendação. "
        "Antes de integrar, comparar original × web × enhanced para cor, pele, cabelo, halos, oversharpening e artefatos.",
        "",
    ])
    (AUDIT_DIR / "MEDIA_AUDIT.md").write_text("\n".join(md), encoding="utf-8")

    print(json.dumps({
        "status": audit["status"],
        "source_total_mib": mib(total_source),
        "old_web_total_mib": mib(OLD_WEB_TOTAL_BYTES),
        "new_web_total_mib": mib(total_web),
        "total_saving_percent": total_saving_vs_old_web,
        "web_recommended_count": web_recommended,
        "original_recommended_count": original_recommended,
        "web_smaller_count": web_smaller,
        "web_larger_count": web_larger,
        "web_gt20_larger_count": web_gt20_larger,
        "quality_82_count": quality_counts.get(82, 0),
        "quality_78_count": quality_counts.get(78, 0),
        "quality_74_count": quality_counts.get(74, 0),
        "quality_70_count": quality_counts.get(70, 0),
        "frontend_usage_count": frontend_uses,
        "frontend_web_recommended": frontend_web,
        "frontend_original_recommended": frontend_original,
        "frontend_enhanced_candidates": enhanced_candidates,
        "duplicate_groups": len(duplicate_sources),
        "issues": len(issues),
    }, indent=2))
    return 0 if audit["status"] == "PASS" else 2


if __name__ == "__main__":
    raise SystemExit(main())
