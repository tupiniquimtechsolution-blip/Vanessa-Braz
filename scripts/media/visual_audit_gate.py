#!/usr/bin/env python3
from __future__ import annotations

import argparse
import hashlib
import json
import math
import os
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps, ImageStat

try:
    import cv2
except Exception:
    cv2 = None

ROOT = Path(__file__).resolve().parents[2]
AUDIT_ROOT = ROOT / "apps/web/public/media/optimized/audit"
VISUAL_ROOT = AUDIT_ROOT / "visual"
MAP_PATH = AUDIT_ROOT / "frontend-media-map.json"
MANIFEST_DIR = ROOT / "apps/web/public/media/optimized/manifests"
MANUAL_DECISIONS = VISUAL_ROOT / "manual-decisions.json"
EXPECTED_USES = 40
HERO_NAMES = {
    "WhatsApp Image 2026-09-12 at 10.23.51.jpeg",
    "WhatsApp Image 2026-09-12 at 10.24.30.jpeg",
}
DEFECT_KEYS = [
    "compression_artifacts",
    "banding",
    "blocking",
    "halo",
    "oversharpening",
    "plastic_skin",
    "hair_detail_loss",
    "fine_detail_loss",
    "color_shift",
    "contrast_shift",
    "noise_amplification",
    "edge_ringing",
    "resampling_artifacts",
]
SEVERITIES = {"none", "minor", "visible", "severe"}
STATUSES = {"PASS", "REVIEW", "FAIL"}


def rel(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as fh:
        for chunk in iter(lambda: fh.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def kib(value: int) -> float:
    return round(value / 1024.0, 1)


def open_rgb(path: Path) -> Image.Image:
    with Image.open(path) as im:
        return ImageOps.exif_transpose(im).convert("RGB")


def resize_exact(im: Image.Image, size: tuple[int, int]) -> Image.Image:
    if im.size == size:
        return im.copy()
    return im.resize(size, Image.Resampling.LANCZOS)


def image_arrays(reference: Image.Image, candidate: Image.Image) -> tuple[np.ndarray, np.ndarray]:
    ref = np.asarray(reference, dtype=np.float32)
    cand = np.asarray(candidate, dtype=np.float32)
    return ref, cand


def edge_energy(gray: np.ndarray) -> float:
    dx = np.abs(np.diff(gray, axis=1)).mean() if gray.shape[1] > 1 else 0.0
    dy = np.abs(np.diff(gray, axis=0)).mean() if gray.shape[0] > 1 else 0.0
    return float((dx + dy) / 2.0)


def block_boundary_energy(gray: np.ndarray, step: int = 8) -> float:
    values: list[float] = []
    for x in range(step, gray.shape[1], step):
        values.append(float(np.abs(gray[:, x] - gray[:, x - 1]).mean()))
    for y in range(step, gray.shape[0], step):
        values.append(float(np.abs(gray[y, :] - gray[y - 1, :]).mean()))
    return float(np.mean(values)) if values else 0.0


def highpass_std(im: Image.Image) -> float:
    base = np.asarray(im.convert("L"), dtype=np.float32)
    blur = np.asarray(im.convert("L").filter(ImageFilter.GaussianBlur(1.2)), dtype=np.float32)
    return float(np.std(base - blur))


def compare_metrics(reference: Image.Image, candidate: Image.Image) -> dict:
    if reference.size != candidate.size:
        candidate = resize_exact(candidate, reference.size)
    ref, cand = image_arrays(reference, candidate)
    diff = cand - ref
    absdiff = np.abs(diff)
    mae = float(absdiff.mean())
    rmse = float(np.sqrt(np.mean(diff * diff)))
    psnr = 99.0 if rmse == 0 else float(20.0 * math.log10(255.0 / rmse))

    ref_gray = 0.299 * ref[:, :, 0] + 0.587 * ref[:, :, 1] + 0.114 * ref[:, :, 2]
    cand_gray = 0.299 * cand[:, :, 0] + 0.587 * cand[:, :, 1] + 0.114 * cand[:, :, 2]
    ref_std = float(np.std(ref_gray))
    cand_std = float(np.std(cand_gray))
    contrast_ratio = cand_std / ref_std if ref_std > 1e-6 else 1.0

    ref_edge = edge_energy(ref_gray)
    cand_edge = edge_energy(cand_gray)
    edge_ratio = cand_edge / ref_edge if ref_edge > 1e-6 else 1.0

    ref_block = block_boundary_energy(ref_gray)
    cand_block = block_boundary_energy(cand_gray)
    block_delta = cand_block - ref_block

    ref_mean = ref.mean(axis=(0, 1))
    cand_mean = cand.mean(axis=(0, 1))
    mean_rgb_shift = float(np.linalg.norm(cand_mean - ref_mean))

    hp_ref = highpass_std(reference)
    hp_cand = highpass_std(candidate)
    highpass_ratio = hp_cand / hp_ref if hp_ref > 1e-6 else 1.0

    return {
        "mae": round(mae, 4),
        "rmse": round(rmse, 4),
        "psnr_db": round(psnr, 3),
        "mean_rgb_shift": round(mean_rgb_shift, 4),
        "contrast_ratio": round(contrast_ratio, 4),
        "edge_ratio": round(edge_ratio, 4),
        "block_boundary_delta": round(block_delta, 4),
        "highpass_ratio": round(highpass_ratio, 4),
    }


def level(value: float, minor: float, visible: float, severe: float, *, absolute: bool = True) -> str:
    v = abs(value) if absolute else value
    if v >= severe:
        return "severe"
    if v >= visible:
        return "visible"
    if v >= minor:
        return "minor"
    return "none"


def defects_from_metrics(metrics: dict, person_detected: bool) -> dict[str, str]:
    psnr = metrics["psnr_db"]
    mae = metrics["mae"]
    edge_ratio = metrics["edge_ratio"]
    contrast_ratio = metrics["contrast_ratio"]
    color_shift = metrics["mean_rgb_shift"]
    block_delta = metrics["block_boundary_delta"]
    hp_ratio = metrics["highpass_ratio"]

    compression = "none" if psnr >= 36 and mae <= 3.0 else "minor" if psnr >= 32 and mae <= 5.0 else "visible" if psnr >= 28 else "severe"
    blocking = level(block_delta, 0.7, 1.8, 3.5)
    color = level(color_shift, 1.5, 4.0, 8.0)
    contrast = level(contrast_ratio - 1.0, 0.03, 0.08, 0.15)
    over = max(edge_ratio - 1.0, hp_ratio - 1.0)
    under = max(1.0 - edge_ratio, 1.0 - hp_ratio)
    oversharp = level(over, 0.05, 0.12, 0.22, absolute=False)
    fine_loss = level(under, 0.05, 0.12, 0.22, absolute=False)
    noise = level(hp_ratio - 1.0, 0.08, 0.18, 0.30, absolute=False)
    banding = "none" if compression == "none" else "minor" if compression == "minor" else "visible" if compression == "visible" else "severe"
    plastic = fine_loss if person_detected else "none"
    hair_loss = fine_loss if person_detected else "none"
    halo = oversharp
    ringing = oversharp
    resampling = "minor" if fine_loss == "minor" or oversharp == "minor" else "visible" if fine_loss == "visible" or oversharp == "visible" else "severe" if fine_loss == "severe" or oversharp == "severe" else "none"

    return {
        "compression_artifacts": compression,
        "banding": banding,
        "blocking": blocking,
        "halo": halo,
        "oversharpening": oversharp,
        "plastic_skin": plastic,
        "hair_detail_loss": hair_loss,
        "fine_detail_loss": fine_loss,
        "color_shift": color,
        "contrast_shift": contrast,
        "noise_amplification": noise,
        "edge_ringing": ringing,
        "resampling_artifacts": resampling,
    }


def suggested_status(metrics: dict, defects: dict[str, str]) -> str:
    if any(v == "severe" for v in defects.values()):
        return "FAIL"
    if metrics["psnr_db"] < 28 or metrics["mae"] > 8 or metrics["mean_rgb_shift"] > 8:
        return "FAIL"
    if any(v == "visible" for v in defects.values()):
        return "REVIEW"
    if metrics["psnr_db"] < 31 or metrics["mae"] > 6 or metrics["mean_rgb_shift"] > 5:
        return "REVIEW"
    return "PASS"


def detect_person(im: Image.Image) -> dict:
    if cv2 is None:
        return {"detected": False, "method": "opencv_unavailable", "faces": 0, "people": 0}
    arr = np.asarray(im.convert("RGB"))
    bgr = cv2.cvtColor(arr, cv2.COLOR_RGB2BGR)
    gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)
    faces_total = 0
    for cascade_name in ("haarcascade_frontalface_default.xml", "haarcascade_profileface.xml"):
        cascade = cv2.CascadeClassifier(cv2.data.haarcascades + cascade_name)
        faces = cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(40, 40))
        faces_total += len(faces)
    people = 0
    try:
        hog = cv2.HOGDescriptor()
        hog.setSVMDetector(cv2.HOGDescriptor_getDefaultPeopleDetector())
        small = bgr
        if max(bgr.shape[:2]) > 900:
            scale = 900 / max(bgr.shape[:2])
            small = cv2.resize(bgr, None, fx=scale, fy=scale)
        rects, _ = hog.detectMultiScale(small, winStride=(8, 8), padding=(8, 8), scale=1.05)
        people = len(rects)
    except Exception:
        people = 0
    return {"detected": bool(faces_total or people), "method": "opencv_face_hog", "faces": int(faces_total), "people": int(people)}


def focus_box(reference: Image.Image) -> tuple[float, float, float, float]:
    gray = np.asarray(reference.convert("L"), dtype=np.float32)
    h, w = gray.shape
    side = max(64, int(min(w, h) * 0.34))
    xs = np.linspace(0, max(0, w - side), 5).astype(int)
    ys = np.linspace(0, max(0, h - side), 5).astype(int)
    best = (0.0, max(0, (w - side) // 2), max(0, (h - side) // 2))
    for y in ys:
        for x in xs:
            patch = gray[y:y + side, x:x + side]
            score = edge_energy(patch) + float(np.std(patch)) * 0.15
            if score > best[0]:
                best = (score, x, y)
    _, x, y = best
    return (x / w, y / h, (x + side) / w, (y + side) / h)


def crop_normalized(im: Image.Image, box: tuple[float, float, float, float]) -> Image.Image:
    w, h = im.size
    l, t, r, b = box
    coords = (int(round(l * w)), int(round(t * h)), int(round(r * w)), int(round(b * h)))
    return im.crop(coords)


def fit_panel(im: Image.Image, size: tuple[int, int], bg=(248, 248, 248)) -> Image.Image:
    contained = ImageOps.contain(im, size, Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", size, bg)
    x = (size[0] - contained.width) // 2
    y = (size[1] - contained.height) // 2
    canvas.paste(contained, (x, y))
    return canvas


def draw_multiline(draw: ImageDraw.ImageDraw, xy: tuple[int, int], text: str, fill=(20, 20, 20), spacing=3) -> None:
    draw.multiline_text(xy, text, fill=fill, font=ImageFont.load_default(), spacing=spacing)


def variant_meta(label: str, im: Image.Image, size_bytes: int, quality: int | None, saving: float | None) -> str:
    q = "n/a" if quality is None else f"q{quality}"
    s = "n/a" if saving is None else f"save {saving:.2f}%"
    return f"{label}\n{im.width}x{im.height} | {kib(size_bytes):.1f} KiB\n{q} | {s}"


def make_item_block(row: dict, source: Image.Image, web: Image.Image, enhanced: Image.Image | None, detail_box: tuple[float, float, float, float], status: str) -> Image.Image:
    variants: list[tuple[str, Image.Image, int, int | None, float | None]] = [
        ("ORIGINAL", source, int((ROOT / row["source_path"]).stat().st_size), None, None),
        ("WEB", web, int(row["web"]["size_bytes"]), int(row["selected_quality"]), float(row["saving_percent"])),
    ]
    if enhanced is not None:
        variants.append(("ENHANCED", enhanced, int(row["enhanced"]["size_bytes"]), None, None))

    col_w = 290
    header_h = 56
    full_h = 235
    crop_h = 170
    meta_h = 60
    width = 18 + len(variants) * col_w
    height = header_h + full_h + crop_h + meta_h + 24
    canvas = Image.new("RGB", (width, height), (255, 255, 255))
    draw = ImageDraw.Draw(canvas)
    title = f"{row['category'].upper()} #{row['position']} | {row['source_name']} | {status}"
    draw_multiline(draw, (10, 8), title[:120])

    for idx, (label, im, size_bytes, quality, saving) in enumerate(variants):
        x = 10 + idx * col_w
        full = fit_panel(im, (270, 220))
        canvas.paste(full, (x, header_h))
        crop = crop_normalized(im, detail_box)
        crop = fit_panel(crop, (160, 160))
        canvas.paste(crop, (x + 55, header_h + full_h))
        meta = variant_meta(label, im, size_bytes, quality, saving)
        draw_multiline(draw, (x, header_h + full_h + crop_h), meta)
    return canvas


def save_contact_sheets(category: str, prepared_rows: list[dict]) -> list[str]:
    out_dir = VISUAL_ROOT / category
    out_dir.mkdir(parents=True, exist_ok=True)
    paths: list[str] = []
    chunk_size = 5
    for start in range(0, len(prepared_rows), chunk_size):
        chunk = prepared_rows[start:start + chunk_size]
        blocks = [r["block"] for r in chunk]
        width = max(b.width for b in blocks)
        height = sum(b.height for b in blocks) + 14 * (len(blocks) - 1)
        sheet = Image.new("RGB", (width, height), (238, 238, 238))
        y = 0
        for block in blocks:
            sheet.paste(block, (0, y))
            y += block.height + 14
        path = out_dir / f"{category}-contact-{start // chunk_size + 1:02d}.jpg"
        sheet.save(path, format="JPEG", quality=80, optimize=True, progressive=True)
        paths.append(rel(path))
    return paths


def responsive_sample(frontend_rows: list[dict]) -> list[dict]:
    selected: list[dict] = []
    for category, limit in (("hero", 2), ("gallery", 4), ("details", 2), ("environment", 2)):
        selected.extend([r for r in frontend_rows if r["category"] == category][:limit])
    out: list[dict] = []
    for row in selected:
        main = open_rgb(ROOT / row["web"]["path"])
        candidate_results: list[dict] = []
        for cand in row.get("responsive_candidates", []):
            if cand.get("reuses_main_web"):
                continue
            cand_img = open_rgb(ROOT / cand["path"])
            ref = resize_exact(main, cand_img.size)
            metrics = compare_metrics(ref, cand_img)
            defects = defects_from_metrics(metrics, False)
            candidate_results.append({
                "path": cand["path"],
                "width": cand["width"],
                "height": cand["height"],
                "quality": cand["quality"],
                "metrics": metrics,
                "defects": defects,
                "suggested_status": suggested_status(metrics, defects),
            })
        item_status = "PASS"
        if any(c["suggested_status"] == "FAIL" for c in candidate_results):
            item_status = "FAIL"
        elif any(c["suggested_status"] == "REVIEW" for c in candidate_results):
            item_status = "REVIEW"
        out.append({
            "category": row["category"],
            "position": row["position"],
            "source_name": row["source_name"],
            "status": item_status,
            "candidates": candidate_results,
        })
    return out


def generate_prepare(frontend_rows: list[dict]) -> dict:
    VISUAL_ROOT.mkdir(parents=True, exist_ok=True)
    prepared_by_category: dict[str, list[dict]] = {k: [] for k in ("hero", "gallery", "details", "environment")}
    records: list[dict] = []

    for row in frontend_rows:
        source_path = ROOT / row["source_path"]
        web_path = ROOT / row["web"]["path"]
        source = open_rgb(source_path)
        web = open_rgb(web_path)
        ref = resize_exact(source, web.size)
        person = detect_person(ref)
        metrics = compare_metrics(ref, web)
        defects = defects_from_metrics(metrics, person["detected"])
        status = suggested_status(metrics, defects)
        box = focus_box(ref)
        enhanced = None
        enhanced_metrics = None
        if row["category"] == "hero" and row["source_name"] in HERO_NAMES:
            enhanced = open_rgb(ROOT / row["enhanced"]["path"])
            enhanced_at_web = resize_exact(enhanced, web.size)
            enhanced_metrics = compare_metrics(ref, enhanced_at_web)

        block = make_item_block(row, source, web, enhanced, box, status)
        prepared_by_category[row["category"]].append({"block": block})
        records.append({
            "category": row["category"],
            "position": row["position"],
            "source_name": row["source_name"],
            "source_path": row["source_path"],
            "web_path": row["web"]["path"],
            "enhanced_path": row["enhanced"]["path"] if row["category"] == "hero" and row["source_name"] in HERO_NAMES else None,
            "source_dimensions": [source.width, source.height],
            "web_dimensions": [web.width, web.height],
            "source_size_bytes": source_path.stat().st_size,
            "web_size_bytes": web_path.stat().st_size,
            "selected_quality": row["selected_quality"],
            "saving_percent": row["saving_percent"],
            "detail_crop_normalized": [round(v, 6) for v in box],
            "person_presence_signal": person,
            "publication_authorization_status": "PENDENTE_DE_CONFIRMACAO" if person["detected"] else "NAO_APLICAVEL_POR_DETECCAO_AUTOMATICA",
            "metrics": metrics,
            "defects": defects,
            "suggested_status": status,
            "enhanced_metrics_at_web_scale": enhanced_metrics,
        })

    sheets: list[str] = []
    for category, rows in prepared_by_category.items():
        sheets.extend(save_contact_sheets(category, rows))

    responsive = responsive_sample(frontend_rows)
    precheck = {
        "generated_at_utc": datetime.now(timezone.utc).isoformat(),
        "phase": "PREPARE_VISUAL_EVIDENCE",
        "expected_uses": EXPECTED_USES,
        "actual_uses": len(records),
        "contact_sheets": sheets,
        "records": records,
        "responsive_sample": responsive,
        "manual_decisions_required": True,
        "status": "PASS" if len(records) == EXPECTED_USES else "FAIL",
    }
    (VISUAL_ROOT / "visual-precheck.json").write_text(json.dumps(precheck, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    md = [
        "# Visual Audit Precheck — Vanessa Braz",
        "",
        f"- Evidence rows: **{len(records)} / {EXPECTED_USES}**",
        f"- Contact sheets: **{len(sheets)}**",
        "- Final visual decisions: **PENDING MANUAL CONTACT-SHEET REVIEW**",
        "- `media/source`: untouched by this script.",
        "- `enhanced`: untouched by this script.",
        "",
        "## Suggested statuses from deterministic comparison",
        "",
    ]
    counts = Counter(r["suggested_status"] for r in records)
    md.append(f"PASS={counts['PASS']} REVIEW={counts['REVIEW']} FAIL={counts['FAIL']}")
    md.extend(["", "## Responsive sample", ""])
    rc = Counter(r["status"] for r in responsive)
    md.append(f"PASS={rc['PASS']} REVIEW={rc['REVIEW']} FAIL={rc['FAIL']}")
    md.extend(["", "These are precheck signals only. Final PASS/REVIEW/FAIL comes from `manual-decisions.json` after reviewing the generated contact sheets.", ""])
    (VISUAL_ROOT / "PRECHECK.md").write_text("\n".join(md), encoding="utf-8")
    return precheck


def validate_decisions(decisions: dict, precheck: dict) -> list[dict]:
    items = decisions.get("items", [])
    if len(items) != EXPECTED_USES:
        raise SystemExit(f"manual decisions must contain {EXPECTED_USES} items; got {len(items)}")
    key_to_pre = {(r["category"], r["position"], r["source_name"]): r for r in precheck["records"]}
    seen = set()
    for item in items:
        key = (item["category"], int(item["position"]), item["source_name"])
        if key not in key_to_pre:
            raise SystemExit(f"manual decision does not match frontend map: {key}")
        if key in seen:
            raise SystemExit(f"duplicate manual decision: {key}")
        seen.add(key)
        if item.get("visual_quality_status") not in STATUSES:
            raise SystemExit(f"invalid visual_quality_status for {key}")
        defects = item.get("defects", {})
        if set(defects) != set(DEFECT_KEYS):
            raise SystemExit(f"defect keys mismatch for {key}")
        if any(v not in SEVERITIES for v in defects.values()):
            raise SystemExit(f"invalid defect severity for {key}")
        if item.get("final_variant") not in {"web", "original", "enhanced"}:
            raise SystemExit(f"invalid final_variant for {key}")
        if item["visual_quality_status"] == "FAIL" and item["final_variant"] != "original":
            raise SystemExit(f"FAIL must fall back to original for {key}")
        if item["final_variant"] == "enhanced" and not (item["category"] == "hero" and item["source_name"] in HERO_NAMES):
            raise SystemExit(f"enhanced may only be selected for the two hero candidates: {key}")
    return items


def update_manifests(decision_items: list[dict]) -> None:
    decision_by_source = {item["source_name"]: item for item in decision_items}
    updated = 0
    for manifest_path in sorted(MANIFEST_DIR.glob("batch-*.json")):
        data = json.loads(manifest_path.read_text(encoding="utf-8"))
        changed = False
        for item in data.get("items", []):
            source_name = Path(item["source_path"]).name
            decision = decision_by_source.get(source_name)
            if not decision:
                continue
            item["visual_gate"] = {
                "visual_quality_status": decision["visual_quality_status"],
                "final_variant": decision["final_variant"],
                "publication_authorization_status": decision["publication_authorization_status"],
                "defects": decision["defects"],
                "review_note": decision.get("review_note", ""),
            }
            if decision["visual_quality_status"] == "FAIL":
                item["recommended_variant"] = "original"
                item["recommended_path"] = item["source_path"]
                item["reason"] = "visual gate FAIL: original retained"
            changed = True
            updated += 1
        if changed:
            manifest_path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    if updated != EXPECTED_USES:
        raise SystemExit(f"expected to add visual_gate to {EXPECTED_USES} frontend uses; updated={updated}")


def generate_final(decisions: dict, precheck: dict) -> dict:
    items = validate_decisions(decisions, precheck)
    update_manifests(items)

    status_counts = Counter(item["visual_quality_status"] for item in items)
    variant_counts = Counter(item["final_variant"] for item in items)
    publication_pending = sum(1 for item in items if item["publication_authorization_status"] == "PENDENTE_DE_CONFIRMACAO")

    hero1 = next(i for i in items if i["category"] == "hero" and int(i["position"]) == 1)
    hero2 = next(i for i in items if i["category"] == "hero" and int(i["position"]) == 2)

    responsive_decisions = decisions.get("responsive_sample", [])
    if len(responsive_decisions) != 10:
        raise SystemExit(f"responsive_sample decisions must contain 10 items; got {len(responsive_decisions)}")
    responsive_counts = Counter(r["status"] for r in responsive_decisions)
    if any(r["status"] not in STATUSES for r in responsive_decisions):
        raise SystemExit("invalid responsive status")

    gate = "PASS" if status_counts["REVIEW"] == 0 and status_counts["FAIL"] == 0 else "BLOCKED_FOR_MANUAL_REVIEW"
    final = {
        "generated_at_utc": datetime.now(timezone.utc).isoformat(),
        "total_uses": len(items),
        "pass_count": status_counts["PASS"],
        "review_count": status_counts["REVIEW"],
        "fail_count": status_counts["FAIL"],
        "hero_1_status": hero1["visual_quality_status"],
        "hero_1_final_variant": hero1["final_variant"],
        "hero_2_status": hero2["visual_quality_status"],
        "hero_2_final_variant": hero2["final_variant"],
        "web_final_count": variant_counts["web"],
        "original_final_count": variant_counts["original"],
        "enhanced_final_count": variant_counts["enhanced"],
        "responsive_sample_pass": responsive_counts["PASS"],
        "responsive_sample_review": responsive_counts["REVIEW"],
        "responsive_sample_fail": responsive_counts["FAIL"],
        "publication_authorization_pending_count": publication_pending,
        "visual_gate_status": gate,
        "items": items,
        "responsive_sample": responsive_decisions,
        "evidence": {
            "contact_sheets": precheck.get("contact_sheets", []),
            "precheck_path": rel(VISUAL_ROOT / "visual-precheck.json"),
        },
    }
    (VISUAL_ROOT / "visual-audit.json").write_text(json.dumps(final, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    md = [
        "# VISUAL_AUDIT — Vanessa Braz",
        "",
        f"TOTAL_USES={final['total_uses']}",
        f"PASS_COUNT={final['pass_count']}",
        f"REVIEW_COUNT={final['review_count']}",
        f"FAIL_COUNT={final['fail_count']}",
        "",
        f"HERO_1_STATUS={final['hero_1_status']}",
        f"HERO_1_FINAL_VARIANT={final['hero_1_final_variant']}",
        f"HERO_2_STATUS={final['hero_2_status']}",
        f"HERO_2_FINAL_VARIANT={final['hero_2_final_variant']}",
        "",
        f"WEB_FINAL_COUNT={final['web_final_count']}",
        f"ORIGINAL_FINAL_COUNT={final['original_final_count']}",
        f"ENHANCED_FINAL_COUNT={final['enhanced_final_count']}",
        "",
        f"RESPONSIVE_SAMPLE_PASS={final['responsive_sample_pass']}",
        f"RESPONSIVE_SAMPLE_REVIEW={final['responsive_sample_review']}",
        f"RESPONSIVE_SAMPLE_FAIL={final['responsive_sample_fail']}",
        "",
        f"PUBLICATION_AUTHORIZATION_PENDING_COUNT={final['publication_authorization_pending_count']}",
        f"VISUAL_GATE_STATUS={final['visual_gate_status']}",
        "",
        "## Notes",
        "",
        "- Visual quality and publication authorization are separate gates.",
        "- Enhanced is deterministic resampling and is not treated as recovered photographic detail.",
        "- Contact sheets are audit evidence only; they are not production assets.",
        "- Frontend, backend, media/source and enhanced production files are not modified by this gate.",
        "",
        "## Per-use decisions",
        "",
    ]
    for item in items:
        md.append(
            f"- {item['category']} #{item['position']} `{item['source_name']}` — "
            f"{item['visual_quality_status']} → `{item['final_variant']}`; "
            f"publication={item['publication_authorization_status']}"
        )
    (VISUAL_ROOT / "VISUAL_AUDIT.md").write_text("\n".join(md) + "\n", encoding="utf-8")
    return final


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--prepare-only", action="store_true")
    args = parser.parse_args()

    frontend_rows = json.loads(MAP_PATH.read_text(encoding="utf-8"))
    if len(frontend_rows) != EXPECTED_USES:
        raise SystemExit(f"frontend-media-map must contain {EXPECTED_USES} uses; got {len(frontend_rows)}")

    precheck = generate_prepare(frontend_rows)
    if precheck["status"] != "PASS":
        return 2

    if args.prepare_only or not MANUAL_DECISIONS.is_file():
        print(json.dumps({
            "status": "PREPARED",
            "uses": len(precheck["records"]),
            "contact_sheets": len(precheck["contact_sheets"]),
            "manual_decisions_required": True,
        }, indent=2))
        return 0

    decisions = json.loads(MANUAL_DECISIONS.read_text(encoding="utf-8"))
    final = generate_final(decisions, precheck)
    print(json.dumps({
        "status": "FINALIZED",
        "total_uses": final["total_uses"],
        "pass_count": final["pass_count"],
        "review_count": final["review_count"],
        "fail_count": final["fail_count"],
        "visual_gate_status": final["visual_gate_status"],
    }, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
