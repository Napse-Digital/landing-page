#!/usr/bin/env python3
"""Create a clean transparent cut-out of the supplied Napse character only."""
from __future__ import annotations
from pathlib import Path
from PIL import Image
from rembg import remove, new_session

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"

def main() -> None:
    source = ASSETS / "hero-character.webp"
    destination = ASSETS / "hero-character-cutout.webp"
    if not source.is_file():
        raise FileNotFoundError(source)

    with Image.open(source) as original:
        image = original.convert("RGBA")

    session = new_session("isnet-general-use")
    cutout = remove(
        image,
        session=session,
        alpha_matting=True,
        alpha_matting_foreground_threshold=240,
        alpha_matting_background_threshold=12,
        alpha_matting_erode_size=10,
    ).convert("RGBA")

    # Keep the original dimensions and framing; only replace its baked background
    # with alpha. A lossy WebP derivative keeps the page payload practical.
    cutout.save(destination, "WEBP", quality=91, method=6, exact=True, alpha_quality=100)
    with Image.open(destination) as check:
        if check.mode != "RGBA":
            raise RuntimeError("The character cut-out did not preserve its alpha channel")
        alpha_range = check.getchannel("A").getextrema()
        if alpha_range[0] != 0:
            raise RuntimeError("The character background was not made transparent")

    print(f"Character cut-out saved: {destination} ({destination.stat().st_size} bytes)")
    print(f"Alpha range: {alpha_range}")

    # Diagnostic preview: shows the actual transparency over the website's
    # Deep Forest field, not over an image viewer's default white background.
    preview_background = Image.new("RGBA", cutout.size, (8, 23, 21, 255))
    preview_background.alpha_composite(cutout)
    preview = preview_background.convert("RGB").resize((512, 768), Image.Resampling.LANCZOS)
    preview_path = ROOT / "review" / "hero-character-dark-preview.jpg"
    preview_path.parent.mkdir(parents=True, exist_ok=True)
    preview.save(preview_path, "JPEG", quality=90, optimize=True)
    print(f"Dark-field preview saved: {preview_path}")

if __name__ == "__main__":
    main()
