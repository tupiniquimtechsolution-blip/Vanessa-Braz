#!/usr/bin/env python3
"""Deterministic, non-generative media optimization for Vanessa Braz.

Phase WEB-v2 goals:
- source media is immutable;
- EXIF orientation is normalized before measuring/rendering;
- the WEB variant never upscales and never exceeds a 1280 px long edge;
- WEB encoding is adaptive (82/78/74, with 70 only as a last candidate);
- WEB is recommended only when it saves at least 10% versus the source;
- current enhanced derivatives are preserved byte-for-byte in this phase;
- exact duplicate sources share WEB derivatives while all source paths remain traceable.
"""

from __future__ import annotations

import argparse
import hashlib
import io
import json
import re
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from PIL import Image, ImageFilter, ImageOps

REPO_ROOT = Path(__file__).resolve().parents[2]
SOURCE_ROOT = REPO_ROOT / "apps/web/public/media/source/images"
OUTPUT_ROOT = REPO_ROOT / "apps/web/public/media/optimized"
MANIFEST_ROOT = OUTPUT_ROOT / "manifests"
SUPPORTED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
WEB_QUALITIES = (82, 78, 74)
WEB_FALLBACK_QUALITY = 70
WEB_MAX_LONG_EDGE = 1280
WEB_MIN_SAVING_PERCENT = 10.0
RESPONSIVE_WIDTHS = (640, 960, 1280)


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def safe_slug(value: str) -> str:
    normalized = re.sub(r"[^a-zA-Z0-9._-]+", "-", value).strip("-._")
    return normalized[:120] or "image"


def ensure_inside(path: Path, root: Path) -> None:
    try:
        path.resolve().relative_to(root.resolve())
    except ValueError as exc:
        raise SystemExit(f"Unsafe path outside {root}: {path}") from exc


def flatten_for_web(image: Image.Image) -> Image.Image:
    if image.mode in {"RGBA", "LA"}:
        rgba = image.convert("RGBA")
        background = Image.new("RGBA", rgba.size, (255, 255, 255, 0))
        background.alpha_composite(rgba)
        return background
    if image.mode == "P":
        if "transparency" in image.info:
            return image.convert("RGBA")
        return image.convert("RGB")
    if image.mode not in {"RGB", "RGBA"}:
        return image.convert("RGB")
    return image


def resize_long_edge_no_upscale(image: Image.Image, target_long_edge: int) -> tuple[Image.Image, bool]:
    width, height = image.size
    long_edge = max(width, height)
    if long_edge <= 0:
        raise ValueError("Invalid image dimensions")
    target = min(int(target_long_edge), WEB_MAX_LONG_EDGE)
    if long_edge <= target:
        return image.copy(), False
    scale = target / long_edge
    new_size = (max(1, round(width * scale)), max(1, round(height * scale)))
    return image.resize(new_size, Image.Resampling.LANCZOS), True


def resize_width_no_upscale(image: Image.Image, target_width: int) -> tuple[Image.Image, bool] | None:
    width, height = image.size
    if target_width > width:
        return None
    scale = target_width / width
    target_height = max(1, round(height * scale))
    # Every WEB derivative, including responsive candidates, obeys the 1280 px long-edge cap.
    if max(target_width, target_height) > WEB_MAX_LONG_EDGE:
        return None
    if target_width == width:
        return image.copy(), False
    return image.resize((target_width, target_height), Image.Resampling.LANCZOS), True


def conservative_sharpen(image: Image.Image) -> Image.Image:
    """Mild sharpening only after downsampling; never changes scene content."""
    if image.mode == "RGBA":
        alpha = image.getchannel("A")
        rgb = image.convert("RGB").filter(
            ImageFilter.UnsharpMask(radius=0.8, percent=85, threshold=4)
        )
        rgba = rgb.convert("RGBA")
        rgba.putalpha(alpha)
        return rgba
    return image.filter(ImageFilter.UnsharpMask(radius=0.8, percent=85, threshold=4))


def render_web_image(image: Image.Image, long_edge: int) -> Image.Image:
    rendered, resized_flag = resize_long_edge_no_upscale(image, long_edge)
    return conservative_sharpen(rendered) if resized_flag else rendered


def encode_webp(image: Image.Image, quality: int) -> bytes:
    buffer = io.BytesIO()
    image.save(buffer, "WEBP", quality=int(quality), method=6, exact=True)
    return buffer.getvalue()


def adaptive_encode(image: Image.Image, source_size: int) -> tuple[bytes, int, list[dict[str, Any]]]:
    """Choose the highest quality candidate meeting the 10% saving gate.

    82/78/74 are always tested. Quality 70 is tested only if none of those
    reaches the gate. If even q70 does not reach the gate, q70 is retained as
    an audit derivative but ORIGINAL becomes the recommendation.
    """
    evaluations: list[dict[str, Any]] = []
    encoded: dict[int, bytes] = {}

    for quality in WEB_QUALITIES:
        data = encode_webp(image, quality)
        encoded[quality] = data
        saving_percent = ((source_size - len(data)) / source_size * 100) if source_size else 0.0
        evaluations.append({
            "quality": quality,
            "size_bytes": len(data),
            "saving_percent": round(saving_percent, 2),
        })

    passing = [row for row in evaluations if row["saving_percent"] >= WEB_MIN_SAVING_PERCENT]
    if passing:
        selected_quality = max(row["quality"] for row in passing)
        return encoded[selected_quality], selected_quality, evaluations

    data70 = encode_webp(image, WEB_FALLBACK_QUALITY)
    encoded[WEB_FALLBACK_QUALITY] = data70
    saving70 = ((source_size - len(data70)) / source_size * 100) if source_size else 0.0
    evaluations.append({
        "quality": WEB_FALLBACK_QUALITY,
        "size_bytes": len(data70),
        "saving_percent": round(saving70, 2),
    })
    return data70, WEB_FALLBACK_QUALITY, evaluations


def write_bytes(path: Path, data: bytes) -> dict[str, Any]:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(data)
    return {
        "path": path.relative_to(REPO_ROOT).as_posix(),
        "size_bytes": len(data),
        "sha256": sha256_bytes(data),
    }


def all_source_files() -> list[Path]:
    return sorted(
        path
        for path in SOURCE_ROOT.rglob("*")
        if path.is_file() and path.suffix.lower() in SUPPORTED_EXTENSIONS
    )


def build_canonical_map() -> tuple[dict[str, str], dict[str, list[str]]]:
    groups: dict[str, list[str]] = defaultdict(list)
    for path in all_source_files():
        groups[sha256_file(path)].append(path.relative_to(REPO_ROOT).as_posix())
    canonical = {sha: sorted(paths)[0] for sha, paths in groups.items()}
    return canonical, groups


def load_existing_manifest(batch_id: str) -> dict[str, dict[str, Any]]:
    path = MANIFEST_ROOT / f"{batch_id}.json"
    if not path.is_file():
        return {}
    manifest = json.loads(path.read_text(encoding="utf-8"))
    return {item["source_path"]: item for item in manifest.get("items", [])}


def validate_preserved_variant(variant: dict[str, Any], variant_name: str) -> dict[str, Any]:
    path = REPO_ROOT / variant["path"]
    if not path.is_file():
        raise SystemExit(f"Missing preserved {variant_name} derivative: {variant['path']}")
    actual_sha = sha256_file(path)
    if actual_sha != variant["sha256"]:
        raise SystemExit(f"Preserved {variant_name} hash mismatch: {variant['path']}")
    if path.stat().st_size != variant["size_bytes"]:
        raise SystemExit(f"Preserved {variant_name} size mismatch: {variant['path']}")
    return dict(variant)


def load_web_cache() -> dict[str, dict[str, Any]]:
    """Load already-produced WEB-v2 records so exact duplicates can reuse files."""
    cache: dict[str, dict[str, Any]] = {}
    for path in sorted(MANIFEST_ROOT.glob("batch-*.json")):
        try:
            manifest = json.loads(path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            continue
        if manifest.get("web_schema_version") != 2:
            continue
        for item in manifest.get("items", []):
            web = item.get("variants", {}).get("web")
            if not web or "selected_quality" not in item:
                continue
            web_path = REPO_ROOT / web.get("path", "")
            if not web_path.is_file() or sha256_file(web_path) != web.get("sha256"):
                continue
            cache.setdefault(item["source_sha256"], {
                "web": dict(web),
                "selected_quality": item["selected_quality"],
                "encoding_candidates": item.get("encoding_candidates", []),
                "responsive_candidates": item.get("responsive_candidates", []),
            })
    return cache


def collect_sources(config: dict[str, Any]) -> list[Path]:
    source_cfg = config.get("source", {})
    source_root = REPO_ROOT / source_cfg.get("root", "apps/web/public/media/source/images")
    ensure_inside(source_root, SOURCE_ROOT)
    extensions = {
        ext.lower() if str(ext).startswith(".") else f".{str(ext).lower()}"
        for ext in source_cfg.get("extensions", sorted(SUPPORTED_EXTENSIONS))
    }
    unsupported = extensions - SUPPORTED_EXTENSIONS
    if unsupported:
        raise SystemExit(f"Unsupported extensions requested: {sorted(unsupported)}")
    files = sorted(
        path for path in source_root.rglob("*")
        if path.is_file() and path.suffix.lower() in extensions
    )
    offset = int(source_cfg.get("offset", 0))
    limit = int(source_cfg.get("limit", 20))
    if offset < 0 or limit < 1 or limit > 50:
        raise SystemExit("source.offset must be >= 0 and source.limit must be between 1 and 50")
    return files[offset : offset + limit]


def make_responsive_candidates(
    base: Image.Image,
    *,
    source_size: int,
    output_stem: str,
    main_web: dict[str, Any],
    selected_quality: int,
    configured_widths: list[int],
) -> list[dict[str, Any]]:
    candidates: list[dict[str, Any]] = []
    seen_dims: set[tuple[int, int]] = set()
    main_dims = (main_web["width"], main_web["height"])

    for target_width in sorted(set(configured_widths)):
        if target_width not in RESPONSIVE_WIDTHS:
            continue
        resized_result = resize_width_no_upscale(base, target_width)
        if resized_result is None:
            continue
        rendered, resized_flag = resized_result
        if resized_flag:
            rendered = conservative_sharpen(rendered)
        dims = (rendered.width, rendered.height)
        if dims in seen_dims:
            continue
        seen_dims.add(dims)

        if dims == main_dims:
            candidates.append({
                "path": main_web["path"],
                "width": main_web["width"],
                "height": main_web["height"],
                "size_bytes": main_web["size_bytes"],
                "sha256": main_web["sha256"],
                "quality": selected_quality,
                "reuses_main_web": True,
            })
            continue

        data, quality, _ = adaptive_encode(rendered, source_size)
        saving_percent = ((source_size - len(data)) / source_size * 100) if source_size else 0.0
        # Smaller responsive assets are only kept when they provide material transfer benefit.
        if saving_percent < WEB_MIN_SAVING_PERCENT:
            continue
        output = OUTPUT_ROOT / "web" / "responsive" / f"{output_stem}-{rendered.width}w.webp"
        meta = write_bytes(output, data)
        meta.update({
            "width": rendered.width,
            "height": rendered.height,
            "quality": quality,
            "reuses_main_web": False,
        })
        candidates.append(meta)

    return candidates


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--batch", required=True, help="Path to batch JSON manifest")
    args = parser.parse_args()

    batch_path = (REPO_ROOT / args.batch).resolve()
    ensure_inside(batch_path, REPO_ROOT / "media-batches")
    config = json.loads(batch_path.read_text(encoding="utf-8"))
    batch_id = safe_slug(str(config.get("batch_id") or batch_path.stem))
    sources = collect_sources(config)
    if not sources:
        raise SystemExit("Batch selected no source images")

    web_cfg = config.get("web", {})
    enhanced_cfg = config.get("enhanced", {})
    web_enabled = bool(web_cfg.get("enabled", True))
    enhanced_enabled = bool(enhanced_cfg.get("enabled", True))
    if not web_enabled:
        raise SystemExit("WEB-v2 phase requires web.enabled=true")
    if not enhanced_enabled:
        raise SystemExit("Current enhanced metadata must remain enabled/preserved in this phase")

    web_long_edge = min(int(web_cfg.get("long_edge", WEB_MAX_LONG_EDGE)), WEB_MAX_LONG_EDGE)
    responsive_widths = [int(v) for v in web_cfg.get("responsive_widths", RESPONSIVE_WIDTHS)]
    min_saving_percent = float(web_cfg.get("min_saving_percent", WEB_MIN_SAVING_PERCENT))
    if min_saving_percent != WEB_MIN_SAVING_PERCENT:
        raise SystemExit("WEB-v2 requires min_saving_percent=10.0 in this phase")

    previous_items = load_existing_manifest(batch_id)
    canonical_by_sha, duplicate_groups = build_canonical_map()
    web_cache = load_web_cache()
    results: list[dict[str, Any]] = []

    for index, source in enumerate(sources, start=1):
        ensure_inside(source, SOURCE_ROOT)
        source_hash = sha256_file(source)
        source_rel = source.relative_to(REPO_ROOT).as_posix()
        source_size = source.stat().st_size
        canonical_source = canonical_by_sha[source_hash]
        canonical_stem = Path(canonical_source).stem
        output_stem = f"{safe_slug(canonical_stem)}-{source_hash[:8]}"
        output_path = OUTPUT_ROOT / "web" / f"{output_stem}.webp"

        previous = previous_items.get(source_rel)
        if not previous or "enhanced" not in previous.get("variants", {}):
            raise SystemExit(f"Enhanced metadata missing; refusing regeneration in WEB-only phase: {source_rel}")
        preserved_enhanced = validate_preserved_variant(previous["variants"]["enhanced"], "enhanced")

        with Image.open(source) as opened:
            base = ImageOps.exif_transpose(opened)
            base.load()
            base = flatten_for_web(base)
            source_width, source_height = base.size

            cached = web_cache.get(source_hash)
            if cached:
                web_meta = dict(cached["web"])
                selected_quality = int(cached["selected_quality"])
                encoding_candidates = list(cached.get("encoding_candidates", []))
                responsive_candidates = list(cached.get("responsive_candidates", []))
            else:
                rendered = render_web_image(base, web_long_edge)
                data, selected_quality, encoding_candidates = adaptive_encode(rendered, source_size)
                web_meta = write_bytes(output_path, data)
                web_meta.update({
                    "width": rendered.width,
                    "height": rendered.height,
                    "quality": selected_quality,
                })
                responsive_candidates = make_responsive_candidates(
                    base,
                    source_size=source_size,
                    output_stem=output_stem,
                    main_web=web_meta,
                    selected_quality=selected_quality,
                    configured_widths=responsive_widths,
                )
                web_cache[source_hash] = {
                    "web": dict(web_meta),
                    "selected_quality": selected_quality,
                    "encoding_candidates": list(encoding_candidates),
                    "responsive_candidates": list(responsive_candidates),
                }

        saving_bytes = source_size - int(web_meta["size_bytes"])
        saving_percent = (saving_bytes / source_size * 100) if source_size else 0.0
        recommended_variant = "web" if saving_percent >= WEB_MIN_SAVING_PERCENT else "original"
        recommended_path = web_meta["path"] if recommended_variant == "web" else source_rel
        reason = (
            f"web saves {saving_percent:.2f}% (>= {WEB_MIN_SAVING_PERCENT:.0f}% gate)"
            if recommended_variant == "web"
            else f"web saves only {saving_percent:.2f}% (< {WEB_MIN_SAVING_PERCENT:.0f}% gate); keep original"
        )

        item: dict[str, Any] = {
            "source_path": source_rel,
            "canonical_source": canonical_source,
            "source_sha256": source_hash,
            "source_size_bytes": source_size,
            "source_width": source_width,
            "source_height": source_height,
            "variants": {
                "web": web_meta,
                "enhanced": preserved_enhanced,
            },
            "recommended_variant": recommended_variant,
            "recommended_path": recommended_path,
            "reason": reason,
            "saving_bytes": saving_bytes,
            "saving_percent": round(saving_percent, 2),
            "selected_quality": selected_quality,
            "encoding_candidates": encoding_candidates,
            "responsive_candidates": responsive_candidates,
        }
        results.append(item)
        duplicate_note = " [shared canonical WEB]" if canonical_source != source_rel else ""
        print(
            f"[{index}/{len(sources)}] {source.name}: q{selected_quality}, "
            f"{saving_percent:+.2f}%, recommend={recommended_variant}{duplicate_note}"
        )

    manifest = {
        "batch_id": batch_id,
        "generated_at_utc": datetime.now(timezone.utc).isoformat(),
        "processor": "Pillow/LANCZOS + adaptive WebP; conservative sharpen only after downsample",
        "generative_ai": False,
        "web_schema_version": 2,
        "web_policy": {
            "max_long_edge": WEB_MAX_LONG_EDGE,
            "qualities": [*WEB_QUALITIES, WEB_FALLBACK_QUALITY],
            "quality_70_only_if_needed": True,
            "minimum_recommendation_saving_percent": WEB_MIN_SAVING_PERCENT,
            "responsive_widths": list(RESPONSIVE_WIDTHS),
            "no_upscale": True,
        },
        "enhanced_policy": "preserved byte-for-byte from previous manifest; not regenerated in WEB-v2 phase",
        "duplicate_policy": "exact source hashes share WEB derivatives; every source path remains a manifest item",
        "duplicate_content_groups_in_source": [
            {"sha256": sha, "canonical_source": canonical_by_sha[sha], "paths": sorted(paths)}
            for sha, paths in sorted(duplicate_groups.items()) if len(paths) > 1
        ],
        "source_count": len(results),
        "items": results,
    }
    manifest_path = MANIFEST_ROOT / f"{batch_id}.json"
    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    manifest_path.write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Manifest: {manifest_path.relative_to(REPO_ROOT)}")


if __name__ == "__main__":
    main()
