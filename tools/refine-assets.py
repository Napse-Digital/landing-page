#!/usr/bin/env python3
"""Rebuild clean transparent Napse web assets from the preserved source masters."""
from __future__ import annotations
from pathlib import Path
from PIL import Image
from rembg import remove, new_session
import io

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path("../napse-foundations/assets")
OUT = ROOT / "assets"
OUT.mkdir(exist_ok=True)

def open_rgba(path: Path) -> Image.Image:
    with Image.open(path) as image:
        return image.convert("RGBA")

def remove_background(image: Image.Image, session) -> Image.Image:
    result = remove(
        image,
        session=session,
        alpha_matting=True,
        alpha_matting_foreground_threshold=240,
        alpha_matting_background_threshold=12,
        alpha_matting_erode_size=10,
    )
    return result.convert("RGBA")

def trim_alpha(image: Image.Image, threshold: int = 10, pad: int = 8) -> Image.Image:
    alpha = image.getchannel("A").point(lambda value: 255 if value > threshold else 0)
    bbox = alpha.getbbox()
    if not bbox:
        raise RuntimeError("Background removal produced an empty alpha mask")
    x0, y0, x1, y1 = bbox
    return image.crop((max(0, x0-pad), max(0, y0-pad), min(image.width, x1+pad), min(image.height, y1+pad)))

def save_webp(image: Image.Image, path: Path) -> None:
    image.save(path, "WEBP", lossless=True, quality=100, method=6, exact=True)
    with Image.open(path) as check:
        if check.mode != "RGBA":
            raise RuntimeError(f"{path.name}: alpha channel was not preserved ({check.mode})")
        if check.getchannel("A").getextrema()[0] != 0:
            raise RuntimeError(f"{path.name}: transparent background not found")

def main() -> None:
    foundation = Path("../napse-foundations/assets")
    character_path = foundation / "image(6).png"
    logo_path = foundation / "image(7).png"
    if not character_path.is_file() or not logo_path.is_file():
        raise FileNotFoundError("Could not locate original Napse character and lockup in napse-foundations/assets")

    session = new_session("isnet-general-use")

    character = open_rgba(character_path)
    print("Character master:", character.size, character.mode, "alpha:", character.getchannel("A").getextrema())
    character_clean = remove_background(character, session)
    # Keep the full portrait canvas to preserve the intended head-to-jacket framing.
    # This avoids destructive cropping and gives CSS predictable proportions.
    save_webp(character_clean, OUT / "hero-character-cutout.webp")
    print("Character output:", (OUT / "hero-character-cutout.webp").stat().st_size, "bytes",
          "alpha:", character_clean.getchannel("A").getextrema())

    logo = open_rgba(logo_path)
    print("Logo master:", logo.size, logo.mode, "alpha:", logo.getchannel("A").getextrema())
    # The supplied lockup already contains the official artwork; remove only the external
    # canvas/background and crop the transparent perimeter without redrawing any marks.
    if logo.getchannel("A").getextrema()[0] == 255:
        logo_clean = remove_background(logo, session)
    else:
        logo_clean = logo
    logo_clean = trim_alpha(logo_clean, threshold=18, pad=8)
    save_webp(logo_clean, OUT / "brand-lockup-clean.webp")
    print("Logo output:", logo_clean.size, (OUT / "brand-lockup-clean.webp").stat().st_size, "bytes",
          "alpha:", logo_clean.getchannel("A").getextrema())

if __name__ == "__main__":
    main()
