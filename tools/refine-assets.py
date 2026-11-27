#!/usr/bin/env python3
"""Create clean transparent cut-outs from the currently committed Napse web assets."""
from __future__ import annotations
from pathlib import Path
from PIL import Image
from rembg import remove, new_session

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"

def open_rgba(path: Path) -> Image.Image:
    with Image.open(path) as image:
        return image.convert("RGBA")

def extract_foreground(image: Image.Image, session) -> Image.Image:
    return remove(
        image,
        session=session,
        alpha_matting=True,
        alpha_matting_foreground_threshold=240,
        alpha_matting_background_threshold=12,
        alpha_matting_erode_size=10,
    ).convert("RGBA")

def trim_alpha(image: Image.Image, threshold: int = 16, pad: int = 10) -> Image.Image:
    binary = image.getchannel("A").point(lambda value: 255 if value > threshold else 0)
    bbox = binary.getbbox()
    if not bbox:
        raise RuntimeError("Foreground extraction produced an empty alpha mask")
    x0, y0, x1, y1 = bbox
    return image.crop((max(0,x0-pad), max(0,y0-pad), min(image.width,x1+pad), min(image.height,y1+pad)))

def save_webp(image: Image.Image, destination: Path) -> None:
    image.save(destination, "WEBP", lossless=True, quality=100, method=6, exact=True)
    with Image.open(destination) as check:
        if check.mode != "RGBA" or check.getchannel("A").getextrema()[0] != 0:
            raise RuntimeError(f"Transparent alpha was not preserved in {destination.name}")

def main() -> None:
    character_source = ASSETS / "hero-character.webp"
    logo_source = ASSETS / "brand-lockup.webp"
    if not character_source.is_file() or not logo_source.is_file():
        raise FileNotFoundError("Expected committed hero-character.webp and brand-lockup.webp")

    session = new_session("isnet-general-use")
    character = open_rgba(character_source)
    print("Character source:", character.size, "alpha:", character.getchannel("A").getextrema())
    character_cutout = extract_foreground(character, session)
    # Keep the portrait canvas and original character proportions intact.
    save_webp(character_cutout, ASSETS / "hero-character-cutout.webp")
    print("Character cut-out:", character_cutout.size, "alpha:", character_cutout.getchannel("A").getextrema())

    logo = open_rgba(logo_source)
    print("Logo source:", logo.size, "alpha:", logo.getchannel("A").getextrema())
    logo_cutout = trim_alpha(extract_foreground(logo, session), threshold=18, pad=8)
    save_webp(logo_cutout, ASSETS / "brand-lockup-clean.webp")
    print("Logo cut-out:", logo_cutout.size, "alpha:", logo_cutout.getchannel("A").getextrema())

if __name__ == "__main__":
    main()
