#!/usr/bin/env python3
"""Structural checks for the Napse continuous green-field landing page."""
from __future__ import annotations
from html.parser import HTMLParser
from pathlib import Path
import re

ROOT=Path(__file__).resolve().parents[1]
HTML=ROOT/"index.html"
EXPECTED_WA="https://wa.me/5518991657817"
TOKENS={x.upper() for x in [
 "#081715","#1E443A","#305B4F","#556A65","#6D9E8F","#9BC7B8",
 "#B2D6C9","#348C6F","#F0F4F2","#FFFFFF","#10201C","#53615C",
 "#7C8984","#DCE7E2"
]}
STYLESHEETS=[ROOT/"styles.css",ROOT/"styles"/"sections.css",ROOT/"styles"/"responsive.css",ROOT/"styles"/"overrides.css",ROOT/"styles"/"green-refinement.css"]
ASSETS=["assets/hero-character-cutout.webp","assets/brand-lockup.webp","assets/waves.webp","assets/continuous-background-desktop.svg","assets/continuous-background-tablet.svg","assets/continuous-background-mobile.svg","assets/favicon.png"]
class Parser(HTMLParser):
 def __init__(self):
  super().__init__(); self.ids=set(); self.hrefs=[]; self.srcs=[]; self.sections=0; self.h1=0; self.wa=[]; self.lang=None; self.canvases=0; self.styles=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=="html": self.lang=a.get("lang")
  if "id" in a: self.ids.add(a["id"])
  if tag=="section": self.sections+=1
  if tag=="h1": self.h1+=1
  if tag=="canvas": self.canvases+=1
  href=a.get("href"); src=a.get("src")
  if href:
   self.hrefs.append(href)
   if a.get("rel")=="stylesheet": self.styles.append(href)
   if href.startswith("https://wa.me/"): self.wa.append(href)
  if src:
   self.srcs.append(src)
   if src.startswith("https://wa.me/"): self.wa.append(src)
def fail(message):
 print("FAIL:",message); raise SystemExit(1)
if not HTML.is_file(): fail("index.html missing")
html=HTML.read_text(encoding="utf-8"); parser=Parser(); parser.feed(html)
if parser.lang!="pt-BR": fail("language must be pt-BR")
if parser.h1!=1: fail(f"expected one H1, found {parser.h1}")
if parser.sections!=9: fail(f"expected nine sections, found {parser.sections}")
if parser.canvases!=1 or 'id="architecture-canvas"' not in html: fail("expected one architecture canvas")
if "brand-lockup-cropped.webp" in html or "brand-lockup-clean.webp" in html: fail("stale/reworked logo path remains; use supplied clean brand asset")
if re.search(r'(?:src|href)="/assets/',html): fail("asset paths must be relative")
if not parser.wa or len(parser.wa)<4 or any(x!=EXPECTED_WA for x in parser.wa): fail("WhatsApp destinations are inconsistent")
for href in parser.hrefs:
 if href.startswith("#") and href!="#":
  if href[1:] not in parser.ids: fail("missing anchor target: "+href)
 elif href.startswith("./") and not href.startswith("./#"):
  if not (ROOT/href[2:]).is_file(): fail("local href does not exist: "+href)
for src in parser.srcs:
 if src.startswith("./") and not (ROOT/src[2:]).is_file(): fail("local src does not exist: "+src)
for href in parser.styles:
 if href.startswith("./") and not (ROOT/href[2:]).is_file(): fail("stylesheet does not exist: "+href)
for asset in ASSETS:
 if not (ROOT/asset).is_file(): fail("required asset missing: "+asset)
for path in STYLESHEETS:
 if not path.is_file(): fail("stylesheet missing: "+str(path.relative_to(ROOT)))
css="\n".join(path.read_text(encoding="utf-8") for path in STYLESHEETS)
colors={x.upper() for x in re.findall(r"#[0-9A-Fa-f]{6}",css)}
if colors-TOKENS: fail("unapproved palette colors: "+", ".join(sorted(colors-TOKENS)))
for name in ("continuous-background-desktop.svg","continuous-background-tablet.svg","continuous-background-mobile.svg"):
 if name not in css: fail("missing continuous background mapping: "+name)
if ".section {" not in css or "background: transparent" not in css: fail("section wrappers must be transparent")
if "background:var(--card-bg)" not in css or "color:var(--card-text)" not in css: fail("white cards must use dark text")
if "Autonomia exige" not in html or "guardrail-card" not in html: fail("section 03 has not been rewritten")
if "componentes reutilizáveis" in html.lower() or "próximo projeto" in html.lower(): fail("obsolete component-reuse proposition remains")
if "prefers-reduced-motion" not in css: fail("reduced motion missing")
if "focus-visible" not in css or "skip-link" not in html: fail("keyboard focus/skip navigation missing")
script=(ROOT/"script.js").read_text(encoding="utf-8")
if "three@0.187.0/build/three.module.js" not in script: fail("pinned Three.js scene missing")
if "canvas.hidden = true" not in script: fail("3D fallback missing")
if "mix-blend-mode:normal" not in css: fail("asset blend mode must preserve transparent edges")
print("PASS: Napse green-field visual checks")
print(f" - sections: {parser.sections}; WhatsApp CTAs: {len(parser.wa)}")
print(" - transparent hero derivative and logo paths: resolved")
print(" - continuous SVG green background: desktop/tablet/mobile")
print(" - functional white cards with dark typography")
print(" - section 03: context, boundaries and evaluation")
print(" - animation, reduced motion and accessible focus")
print(" - one Three.js architecture scene with static fallback")
print(" - approved Design Kit v1 color palette only")
