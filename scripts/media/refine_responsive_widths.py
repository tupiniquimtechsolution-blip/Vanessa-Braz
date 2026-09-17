#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import re
from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[2]
MEDIA_TS = ROOT / "src/lib/media.ts"
PUBLIC = ROOT / "apps/web/public"
RESPONSIVE_DIR = PUBLIC / "media/optimized/web/responsive"
WIDTHS = (320, 480)
QUALITY = 82

ASSET_RE = re.compile(
    r'\{\n(?P<indent>\s+)"src": "(?P<src>/media/optimized/web/[^\"]+\.webp)",\n'
    r'(?P=indent)"srcSet": "(?P<srcset>[^\"]+)",\n'
    r'(?P=indent)"width": (?P<width>\d+),\n'
    r'(?P=indent)"height": (?P<height>\d+),',
    re.MULTILINE,
)


@dataclass
class Asset:
    index: int
    src: str
    srcset: str
    width: int
    height: int
    span: tuple[int, int]


def fs_path(public_url: str) -> Path:
    return PUBLIC / public_url.lstrip("/")


def responsive_url(src: str, width: int) -> str:
    p = Path(src)
    return f"/media/optimized/web/responsive/{p.stem}-{width}w.webp"


def parse_srcset(srcset: str) -> dict[int, str]:
    out: dict[int, str] = {}
    for part in srcset.split(","):
        piece = part.strip()
        if not piece:
            continue
        url, descriptor = piece.rsplit(" ", 1)
        if descriptor.endswith("w"):
            out[int(descriptor[:-1])] = url
    return out


def format_srcset(entries: dict[int, str]) -> str:
    return ", ".join(f"{entries[w]} {w}w" for w in sorted(entries))


def load_assets(text: str) -> list[Asset]:
    assets: list[Asset] = []
    for idx, match in enumerate(ASSET_RE.finditer(text)):
        assets.append(
            Asset(
                index=idx,
                src=match.group("src"),
                srcset=match.group("srcset"),
                width=int(match.group("width")),
                height=int(match.group("height")),
                span=match.span("srcset"),
            )
        )
    if len(assets) != 40:
        raise SystemExit(f"expected 40 image asset records in media.ts; found {len(assets)}")
    return assets


def generate_candidate(asset: Asset, target_width: int) -> tuple[str, Path, int, int, int]:
    src_path = fs_path(asset.src)
    if not src_path.is_file():
        raise SystemExit(f"missing main WEB-v2 asset: {src_path}")
    url = responsive_url(asset.src, target_width)
    out_path = fs_path(url)
    out_path.parent.mkdir(parents=True, exist_ok=True)

    with Image.open(src_path) as raw:
        image = ImageOps.exif_transpose(raw).convert("RGB")
        if target_width >= image.width:
            raise ValueError("candidate width must be smaller than source width")
        target_height = max(1, round(image.height * target_width / image.width))
        resized = image.resize((target_width, target_height), Image.Resampling.LANCZOS)
        resized.save(out_path, format="WEBP", quality=QUALITY, method=6)
    return url, out_path, target_width, target_height, out_path.stat().st_size


def fit(im: Image.Image, size: tuple[int, int]) -> Image.Image:
    canvas = Image.new("RGB", size, (245, 245, 245))
    contained = ImageOps.contain(im, size, Image.Resampling.LANCZOS)
    canvas.paste(contained, ((size[0] - contained.width) // 2, (size[1] - contained.height) // 2))
    return canvas


def evidence_block(asset: Asset, generated: dict[int, Path]) -> Image.Image:
    src_path = fs_path(asset.src)
    with Image.open(src_path) as raw:
        main = ImageOps.exif_transpose(raw).convert("RGB")

    panel_w = 220
    image_h = 180
    header_h = 48
    meta_h = 42
    rows = []
    for width in WIDTHS:
        if width not in generated:
            continue
        with Image.open(generated[width]) as raw:
            candidate = ImageOps.exif_transpose(raw).convert("RGB")
        reference = main.resize(candidate.size, Image.Resampling.LANCZOS)
        rows.append((width, reference, candidate, generated[width].stat().st_size))

    block_h = header_h + len(rows) * (image_h + meta_h + 12) + 10
    canvas = Image.new("RGB", (panel_w * 2 + 20, block_h), "white")
    draw = ImageDraw.Draw(canvas)
    font = ImageFont.load_default()
    draw.text((10, 10), f"asset #{asset.index + 1}: {Path(asset.src).name}"[:72], fill="black", font=font)
    y = header_h
    for width, reference, candidate, size_bytes in rows:
        canvas.paste(fit(reference, (panel_w, image_h)), (5, y))
        canvas.paste(fit(candidate, (panel_w, image_h)), (panel_w + 15, y))
        draw.text((8, y + image_h + 4), f"MAIN normalized to {width}w", fill="black", font=font)
        draw.text((panel_w + 18, y + image_h + 4), f"{width}w q{QUALITY} | {size_bytes/1024:.1f} KiB", fill="black", font=font)
        y += image_h + meta_h + 12
    return canvas


def write_contact_sheets(assets: list[Asset], generated_by_asset: dict[int, dict[int, Path]], out_dir: Path) -> list[str]:
    out_dir.mkdir(parents=True, exist_ok=True)
    # 2 hero, 4 gallery, 2 details, 2 environment according to canonical ordering.
    sample_indices = [0, 1, 2, 3, 4, 5, 22, 23, 32, 33]
    blocks = [evidence_block(assets[i], generated_by_asset[i]) for i in sample_indices]
    outputs: list[str] = []
    for sheet_idx in range(0, len(blocks), 5):
        chunk = blocks[sheet_idx:sheet_idx + 5]
        width = max(b.width for b in chunk)
        height = sum(b.height for b in chunk) + 12 * (len(chunk) - 1)
        sheet = Image.new("RGB", (width, height), (230, 230, 230))
        y = 0
        for block in chunk:
            sheet.paste(block, (0, y))
            y += block.height + 12
        path = out_dir / f"responsive-fine-contact-{sheet_idx // 5 + 1:02d}.jpg"
        sheet.save(path, format="JPEG", quality=82, optimize=True, progressive=True)
        outputs.append(str(path))
    return outputs


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--evidence-dir", default="/tmp/responsive-fine-evidence")
    args = parser.parse_args()

    text = MEDIA_TS.read_text(encoding="utf-8")
    assets = load_assets(text)
    replacements: list[tuple[int, int, str]] = []
    generated_records: list[dict] = []
    generated_by_asset: dict[int, dict[int, Path]] = {asset.index: {} for asset in assets}

    for asset in assets:
        entries = parse_srcset(asset.srcset)
        for width in WIDTHS:
            if width >= asset.width:
                continue
            url, path, w, h, size_bytes = generate_candidate(asset, width)
            entries[w] = url
            generated_by_asset[asset.index][w] = path
            generated_records.append({
                "asset_index": asset.index + 1,
                "main_src": asset.src,
                "candidate": url,
                "width": w,
                "height": h,
                "quality": QUALITY,
                "size_bytes": size_bytes,
            })
        replacements.append((asset.span[0], asset.span[1], format_srcset(entries)))

    updated = text
    for start, end, value in reversed(replacements):
        updated = updated[:start] + value + updated[end:]
    MEDIA_TS.write_text(updated, encoding="utf-8")

    evidence_dir = Path(args.evidence_dir)
    sheets = write_contact_sheets(assets, generated_by_asset, evidence_dir)
    report = {
        "status": "PREPARED_FOR_VISUAL_REVIEW",
        "asset_count": len(assets),
        "generated_candidate_count": len(generated_records),
        "widths": list(WIDTHS),
        "quality": QUALITY,
        "generated_total_bytes": sum(r["size_bytes"] for r in generated_records),
        "contact_sheets": sheets,
        "records": generated_records,
    }
    (evidence_dir / "responsive-fine-evidence.json").write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")

    doc = ROOT / "docs/MEDIA_RESPONSIVE_REFINEMENT.md"
    doc.write_text(
        "# MEDIA RESPONSIVE REFINEMENT\n\n"
        f"- Status: **PREPARED_FOR_VISUAL_REVIEW**\n"
        f"- Assets covered: **{len(assets)} / 40**\n"
        f"- New candidates generated: **{len(generated_records)}**\n"
        f"- Widths: **320w / 480w** when smaller than the main WEB-v2 asset\n"
        f"- Encoder: WebP q{QUALITY}, method 6, Lanczos downscale, no upscale\n"
        f"- Generated candidate bytes: **{sum(r['size_bytes'] for r in generated_records)}**\n\n"
        "These candidates are not visually approved merely because the workflow generated them. "
        "The equal-scale contact sheets uploaded by the workflow must be inspected before this refinement is accepted.\n\n"
        "Publication authorization remains a separate gate and is still PENDENTE_DE_CONFIRMACAO for the 40 current uses.\n",
        encoding="utf-8",
    )

    print(json.dumps({k: v for k, v in report.items() if k != "records"}, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
