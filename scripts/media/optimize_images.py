#!/usr/bin/env python3
"""Deterministic batch image optimization for Vanessa Braz media.

This script intentionally does NOT perform generative editing or pretend that
resampling creates new photographic detail. It produces web-ready derivatives
and an optional conservative high-resolution derivative while preserving the
source files unchanged.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from PIL import Image, ImageFilter, ImageOps

REPO_ROOT = Path(__file__).resolve().parents[2]
SOURCE_ROOT = REPO_ROOT / "apps/web/public/media/source/images"
OUTPUT_ROOT = REPO_ROOT / "apps/web/public/media/optimized"
SUPPORTED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


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


def resized(image: Image.Image, target_long_edge: int, max_scale: float | None) -> Image.Image:
    width, height = image.size
    long_edge = max(width, height)
    if long_edge <= 0:
        raise ValueError("Invalid image dimensions")

    scale = target_long_edge / long_edge
    if max_scale is None:
        scale = min(scale, 1.0)
    else:
        scale = min(scale, max_scale)

    # Do not create an unnecessary new image if dimensions already match.
    if abs(scale - 1.0) < 0.0001:
        return image.copy()

    new_size = (
        max(1, round(width * scale)),
        max(1, round(height * scale)),
    )
    return image.resize(new_size, Image.Resampling.LANCZOS)


def conservative_sharpen(image: Image.Image) -> Image.Image:
    """Apply mild post-resize sharpening without changing scene content."""
    if image.mode == "RGBA":
        rgb = image.convert("RGB").filter(
            ImageFilter.UnsharpMask(radius=1.0, percent=105, threshold=3)
        )
        rgb = rgb.convert("RGBA")
        rgb.putalpha(image.getchannel("A"))
        return rgb
    return image.filter(ImageFilter.UnsharpMask(radius=1.0, percent=105, threshold=3))


def write_webp(image: Image.Image, path: Path, quality: int) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, "WEBP", quality=quality, method=6, exact=True)


def process_variant(
    base_image: Image.Image,
    output_path: Path,
    *,
    long_edge: int,
    quality: int,
    max_scale: float | None,
) -> dict[str, Any]:
    rendered = resized(base_image, long_edge, max_scale)
    rendered = conservative_sharpen(rendered)
    write_webp(rendered, output_path, quality)
    return {
        "path": output_path.relative_to(REPO_ROOT).as_posix(),
        "width": rendered.width,
        "height": rendered.height,
        "size_bytes": output_path.stat().st_size,
        "sha256": sha256_file(output_path),
    }


def collect_sources(config: dict[str, Any]) -> list[Path]:
    source_cfg = config.get("source", {})
    source_root = REPO_ROOT / source_cfg.get(
        "root", "apps/web/public/media/source/images"
    )
    ensure_inside(source_root, SOURCE_ROOT)

    extensions = {
        ext.lower() if str(ext).startswith(".") else f".{str(ext).lower()}"
        for ext in source_cfg.get("extensions", sorted(SUPPORTED_EXTENSIONS))
    }
    unsupported = extensions - SUPPORTED_EXTENSIONS
    if unsupported:
        raise SystemExit(f"Unsupported extensions requested: {sorted(unsupported)}")

    files = sorted(
        path
        for path in source_root.rglob("*")
        if path.is_file() and path.suffix.lower() in extensions
    )
    offset = int(source_cfg.get("offset", 0))
    limit = int(source_cfg.get("limit", 20))
    if offset < 0 or limit < 1 or limit > 50:
        raise SystemExit("source.offset must be >= 0 and source.limit must be between 1 and 50")
    return files[offset : offset + limit]


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
    if not web_enabled and not enhanced_enabled:
        raise SystemExit("At least one output variant must be enabled")

    results: list[dict[str, Any]] = []
    for index, source in enumerate(sources, start=1):
        ensure_inside(source, SOURCE_ROOT)
        source_hash = sha256_file(source)
        output_name = f"{safe_slug(source.stem)}-{source_hash[:8]}.webp"
        item: dict[str, Any] = {
            "source_path": source.relative_to(REPO_ROOT).as_posix(),
            "source_sha256": source_hash,
            "source_size_bytes": source.stat().st_size,
            "variants": {},
        }

        with Image.open(source) as opened:
            base = ImageOps.exif_transpose(opened)
            base.load()
            base = flatten_for_web(base)
            item["source_width"] = base.width
            item["source_height"] = base.height

            if web_enabled:
                item["variants"]["web"] = process_variant(
                    base,
                    OUTPUT_ROOT / "web" / output_name,
                    long_edge=int(web_cfg.get("long_edge", 1920)),
                    quality=int(web_cfg.get("quality", 86)),
                    max_scale=None,
                )

            if enhanced_enabled:
                item["variants"]["enhanced"] = process_variant(
                    base,
                    OUTPUT_ROOT / "enhanced" / output_name,
                    long_edge=int(enhanced_cfg.get("long_edge", 3840)),
                    quality=int(enhanced_cfg.get("quality", 92)),
                    max_scale=float(enhanced_cfg.get("max_scale", 2.0)),
                )

        results.append(item)
        print(f"[{index}/{len(sources)}] {source.name}")

    manifest = {
        "batch_id": batch_id,
        "generated_at_utc": datetime.now(timezone.utc).isoformat(),
        "processor": "Pillow/LANCZOS + conservative UnsharpMask",
        "generative_ai": False,
        "note": (
            "Enhanced output is deterministic resampling, not AI super-resolution. "
            "It must not be described as recovered photographic detail."
        ),
        "source_count": len(results),
        "items": results,
    }
    manifest_path = OUTPUT_ROOT / "manifests" / f"{batch_id}.json"
    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    manifest_path.write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Manifest: {manifest_path.relative_to(REPO_ROOT)}")


if __name__ == "__main__":
    main()
