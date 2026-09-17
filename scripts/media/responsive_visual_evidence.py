#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[2]
AUDIT_ROOT = ROOT / "apps/web/public/media/optimized/audit"
VISUAL_ROOT = AUDIT_ROOT / "visual"
OUT_DIR = VISUAL_ROOT / "responsive"
MAP_PATH = AUDIT_ROOT / "frontend-media-map.json"
EXPECTED = 10


def open_rgb(path: Path) -> Image.Image:
    with Image.open(path) as im:
        return ImageOps.exif_transpose(im).convert("RGB")


def fit_panel(im: Image.Image, size: tuple[int, int]) -> Image.Image:
    contained = ImageOps.contain(im, size, Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", size, (248, 248, 248))
    x = (size[0] - contained.width) // 2
    y = (size[1] - contained.height) // 2
    canvas.paste(contained, (x, y))
    return canvas


def resize_exact(im: Image.Image, size: tuple[int, int]) -> Image.Image:
    if im.size == size:
        return im.copy()
    return im.resize(size, Image.Resampling.LANCZOS)


def crop_center_square(im: Image.Image) -> Image.Image:
    side = max(1, min(im.width, im.height) // 3)
    left = (im.width - side) // 2
    top = (im.height - side) // 2
    return im.crop((left, top, left + side, top + side))


def draw_text(draw: ImageDraw.ImageDraw, xy: tuple[int, int], text: str) -> None:
    draw.multiline_text(xy, text, fill=(20, 20, 20), font=ImageFont.load_default(), spacing=3)


def selected_rows(rows: list[dict]) -> list[dict]:
    selected: list[dict] = []
    for category, limit in (("hero", 2), ("gallery", 4), ("details", 2), ("environment", 2)):
        selected.extend([r for r in rows if r.get("category") == category][:limit])
    if len(selected) != EXPECTED:
        raise SystemExit(f"expected {EXPECTED} responsive evidence rows, got {len(selected)}")
    return selected


def build_candidate_row(row: dict, candidate: dict) -> Image.Image:
    source = open_rgb(ROOT / row["source_path"])
    main = open_rgb(ROOT / row["web"]["path"])
    responsive = open_rgb(ROOT / candidate["path"])
    target = responsive.size
    source_eq = resize_exact(source, target)
    main_eq = resize_exact(main, target)

    variants = [
        ("ORIGINAL@VIEWPORT", source_eq, (ROOT / row["source_path"]).stat().st_size),
        ("MAIN-WEB@VIEWPORT", main_eq, row["web"]["size_bytes"]),
        (f"RESPONSIVE-{candidate['width']}w", responsive, candidate["size_bytes"]),
    ]

    col_w = 290
    header_h = 54
    full_h = 220
    crop_h = 160
    meta_h = 56
    canvas = Image.new("RGB", (20 + col_w * len(variants), header_h + full_h + crop_h + meta_h + 20), (255, 255, 255))
    draw = ImageDraw.Draw(canvas)
    draw_text(draw, (10, 8), f"{row['category'].upper()} #{row['position']} | {row['source_name']} | target={target[0]}x{target[1]}")

    for idx, (label, im, size_bytes) in enumerate(variants):
        x = 10 + idx * col_w
        canvas.paste(fit_panel(im, (270, 210)), (x, header_h))
        crop = crop_center_square(im)
        canvas.paste(fit_panel(crop, (150, 150)), (x + 60, header_h + full_h))
        q = candidate.get("quality") if label.startswith("RESPONSIVE") else row.get("selected_quality") if label.startswith("MAIN") else None
        q_text = "n/a" if q is None else f"q{q}"
        draw_text(draw, (x, header_h + full_h + crop_h), f"{label}\n{im.width}x{im.height} | {size_bytes/1024:.1f} KiB\n{q_text}")
    return canvas


def main() -> int:
    rows = json.loads(MAP_PATH.read_text(encoding="utf-8"))
    selected = selected_rows(rows)
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for old in OUT_DIR.glob("responsive-contact-*.jpg"):
        old.unlink()

    evidence: list[dict] = []
    blocks: list[Image.Image] = []

    for row in selected:
        candidates = [c for c in row.get("responsive_candidates", []) if not c.get("reuses_main_web")]
        if not candidates:
            raise SystemExit(f"no responsive candidates for {row['category']} #{row['position']} {row['source_name']}")
        candidate_entries = []
        for candidate in candidates:
            path = ROOT / candidate["path"]
            if not path.is_file():
                raise SystemExit(f"missing responsive candidate: {candidate['path']}")
            candidate_entries.append({
                "path": candidate["path"],
                "width": candidate["width"],
                "height": candidate["height"],
                "size_bytes": candidate["size_bytes"],
                "quality": candidate.get("quality"),
            })
            blocks.append(build_candidate_row(row, candidate))
        evidence.append({
            "category": row["category"],
            "position": row["position"],
            "source_name": row["source_name"],
            "candidates": candidate_entries,
            "visual_status": "REVIEW",
            "review_note": "Evidence only; compare equal-size ORIGINAL@VIEWPORT vs MAIN-WEB@VIEWPORT vs responsive derivative.",
        })

    chunk_size = 5
    sheet_paths: list[str] = []
    for start in range(0, len(blocks), chunk_size):
        chunk = blocks[start:start + chunk_size]
        width = max(b.width for b in chunk)
        height = sum(b.height for b in chunk) + 14 * (len(chunk) - 1)
        sheet = Image.new("RGB", (width, height), (238, 238, 238))
        y = 0
        for block in chunk:
            sheet.paste(block, (0, y))
            y += block.height + 14
        out = OUT_DIR / f"responsive-contact-{start // chunk_size + 1:02d}.jpg"
        sheet.save(out, "JPEG", quality=82, optimize=True, progressive=True)
        sheet_paths.append(out.relative_to(ROOT).as_posix())

    payload = {
        "status": "EVIDENCE_READY",
        "selected_uses": len(evidence),
        "comparison_rows": len(blocks),
        "contact_sheets": sheet_paths,
        "items": evidence,
    }
    (OUT_DIR / "responsive-evidence.json").write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(payload, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
