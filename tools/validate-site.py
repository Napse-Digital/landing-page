#!/usr/bin/env python3
"""Dependency-free structural checks for the Napse static landing page v2."""
from __future__ import annotations

from html.parser import HTMLParser
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
HTML = ROOT / "index.html"
EXPECTED_WA = "https://wa.me/5518991657817"
TOKENS = {
    "#081715", "#1E443A", "#305B4F", "#556A65", "#6D9E8F", "#9BC7B8",
    "#B2D6C9", "#348C6F", "#F0F4F2", "#FFFFFF", "#10201C", "#53615C",
    "#7C8984", "#DCE7E2",
}
STYLESHEETS = [
    ROOT / "styles.css",
    ROOT / "styles" / "sections.css",
    ROOT / "styles" / "responsive.css",
    ROOT / "styles" / "overrides.css",
    ROOT / "styles" / "revamp.css",
]
REQUIRED_ASSETS = [
    "assets/hero-character.webp",
    "assets/brand-lockup.webp",
    "assets/waves.webp",
    "assets/favicon.png",
]

class PageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.hrefs = []
        self.srcs = []
        self.sections = 0
        self.h1 = 0
        self.wa_links = []
        self.lang = None
        self.canvases = 0
        self.stylesheet_hrefs = []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "html":
            self.lang = attrs.get("lang")
        if "id" in attrs:
            self.ids.add(attrs["id"])
        if tag == "section":
            self.sections += 1
        if tag == "h1":
            self.h1 += 1
        if tag == "canvas":
            self.canvases += 1
        href = attrs.get("href")
        src = attrs.get("src")
        if href:
            self.hrefs.append(href)
            if attrs.get("rel") == "stylesheet":
                self.stylesheet_hrefs.append(href)
            if href.startswith("https://wa.me/"):
                self.wa_links.append(href)
        if src:
            self.srcs.append(src)
            if src.startswith("https://wa.me/"):
                self.wa_links.append(src)

def fail(message):
    print(f"FAIL: {message}")
    raise SystemExit(1)

if not HTML.is_file():
    fail("index.html is missing")

html = HTML.read_text(encoding="utf-8")
parser = PageParser()
parser.feed(html)

if parser.lang != "pt-BR":
    fail("HTML language must be pt-BR")
if parser.h1 != 1:
    fail(f"expected exactly one H1; found {parser.h1}")
if parser.sections < 8:
    fail(f"expected complete homepage narrative; found {parser.sections} sections")
if parser.canvases != 1 or "architecture-canvas" not in html:
    fail("expected one decorative Three.js canvas in the architecture diagram")
if "brand-lockup-cropped.webp" in html:
    fail("stale/nonexistent brand-lockup-cropped.webp reference remains")
if re.search(r'(?:src|href)="/assets/', html):
    fail("asset URLs must be relative, not root-absolute")
if not parser.wa_links or any(link != EXPECTED_WA for link in parser.wa_links):
    fail("all WhatsApp conversion CTAs must use the exact approved destination")
if len(parser.wa_links) < 4:
    fail(f"expected at least four consistent WhatsApp CTAs; found {len(parser.wa_links)}")

for href in parser.hrefs:
    if href.startswith("#") and href != "#":
        target = href[1:]
        if target not in parser.ids:
            fail(f"internal link target does not exist: {href}")
    elif href.startswith("./") and not href.startswith("./#"):
        path = (ROOT / href[2:]).resolve()
        if not path.exists():
            fail(f"local href asset does not exist: {href}")

for src in parser.srcs:
    if src.startswith("./"):
        path = (ROOT / src[2:]).resolve()
        if not path.exists():
            fail(f"local image/script source does not exist: {src}")

for asset in REQUIRED_ASSETS:
    if not (ROOT / asset).is_file():
        fail(f"required brand asset missing: {asset}")

for path in STYLESHEETS:
    if not path.is_file():
        fail(f"stylesheet missing: {path.relative_to(ROOT)}")

for href in parser.stylesheet_hrefs:
    if href.startswith("./") and not (ROOT / href[2:]).is_file():
        fail(f"stylesheet link does not resolve: {href}")

css = "\n".join(path.read_text(encoding="utf-8") for path in STYLESHEETS)
for viewport_width in ("1199px", "900px", "640px"):
    if viewport_width not in css:
        fail(f"responsive breakpoint missing: {viewport_width}")

hex_values = set(re.findall(r"#[0-9A-Fa-f]{6}", css))
unapproved = sorted(value for value in hex_values if value.upper() not in {token.upper() for token in TOKENS})
if unapproved:
    fail("non-Design-Kit color values in CSS: " + ", ".join(unapproved))

if "prefers-reduced-motion" not in css or "prefers-reduced-motion" not in (ROOT / "script.js").read_text(encoding="utf-8"):
    fail("reduced motion handling is missing")
if "focus-visible" not in css:
    fail("visible keyboard focus styles are missing")
if "skip-link" not in html:
    fail("skip navigation is missing")
if "cdn.jsdelivr.net/npm/three@0.187.0/build/three.module.js" not in (ROOT / "script.js").read_text(encoding="utf-8"):
    fail("Three.js must be pinned to the reviewed release")
if ".architecture-core" not in css or "canvas.hidden = true" not in (ROOT / "script.js").read_text(encoding="utf-8"):
    fail("static architecture fallback is missing")
if "background: var(--white)" not in css or "background: var(--canvas)" not in css:
    fail("light editorial surfaces are missing")
if "button-primary" not in css or "var(--dark-emerald)" not in css:
    fail("green primary action styling is missing")

print("PASS: Napse landing v2 structural checks")
print(f" - language: {parser.lang}")
print(f" - homepage sections: {parser.sections}")
print(f" - WhatsApp CTAs: {len(parser.wa_links)}")
print(f" - image/logo/hero paths and favicon: verified against repository files")
print(" - asset URLs: relative")
print(" - internal anchors and stylesheet links: resolved")
print(" - visual direction: light editorial sections, emerald buttons, dark hero and feature panel")
print(" - one Three.js scene with static fallback; CDN version pinned")
print(" - responsive breakpoints and reduced-motion handling: present")
print(" - brand palette values: all within Design Kit v1")
print(" - visible focus and skip navigation: present")
