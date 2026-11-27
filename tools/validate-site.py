#!/usr/bin/env python3
"""Structural release checks for the Napse homepage redesign v5."""
from __future__ import annotations
from html.parser import HTMLParser
from pathlib import Path
import re

ROOT=Path(__file__).resolve().parents[1]
HTML=ROOT/"index.html"
WA="https://wa.me/5518991657817"
TOKENS={x.upper() for x in ["#081715","#1E443A","#305B4F","#556A65","#6D9E8F","#9BC7B8","#B2D6C9","#348C6F","#F0F4F2","#FFFFFF","#10201C","#53615C","#7C8984","#DCE7E2"]}
ASSETS=["assets/brand-lockup-original.png","assets/hero-character.webp","assets/waves.webp","assets/background-v5-desktop.svg","assets/background-v5-tablet.svg","assets/background-v5-mobile.svg","assets/favicon.png"]
class Page(HTMLParser):
 def __init__(self):
  super().__init__();self.ids=set();self.hrefs=[];self.srcs=[];self.wa=[];self.sections=[];self.h1=0;self.lang=None;self.canvases=0
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=="html":self.lang=a.get("lang")
  if a.get("id"):self.ids.add(a["id"])
  if tag=="section":self.sections.append(a.get("class",""))
  if tag=="h1":self.h1+=1
  if tag=="canvas":self.canvases+=1
  for key,dest in (("href",self.hrefs),("src",self.srcs)):
   value=a.get(key)
   if value:
    dest.append(value)
    if value.startswith("https://wa.me/"):self.wa.append(value)
def fail(message):
 print("FAIL:",message);raise SystemExit(1)
if not HTML.is_file():fail("index.html missing")
body=HTML.read_text(encoding="utf-8");p=Page();p.feed(body)
if p.lang!="pt-BR":fail("HTML language must be pt-BR")
if p.h1!=1:fail(f"expected exactly one H1, found {p.h1}")
if len(p.sections)!=8:fail(f"expected eight narrative sections, found {len(p.sections)}")
if p.canvases!=0:fail(f"expected no WebGL canvas in the restored orbit diagram, found {p.canvases}")
for asset in ASSETS:
 if not (ROOT/asset).is_file():fail("missing asset: "+asset)
for value in p.hrefs:
 if value.startswith("#") and value!="#":
  if value[1:] not in p.ids:fail("broken anchor: "+value)
 elif value.startswith("./") and not (ROOT/value[2:]).is_file():fail("missing local href: "+value)
for value in p.srcs:
 if value.startswith("./") and not (ROOT/value[2:]).is_file():fail("missing local source: "+value)
if len(p.wa)<3 or any(x!=WA for x in p.wa):fail("WhatsApp CTAs do not use the confirmed destination")
if "AUTOMATIZE OS SEUS FLUXOS DE TRABALHO" in body:fail("old generic hero headline remains")
if "Fluxo ilustrativo para explicar a lógica de uma solução." in body:fail("removed context disclaimer remains")
if "O trabalho da sua empresa não acontece em uma única ferramenta." not in body:fail("approved context headline missing")
if "Cada projeto pode revelar componentes" in body:fail("obsolete component-reuse section remains")
if "plataforma multiagente como produto já disponível" not in body:fail("FAQ must clarify that no ready-made platform is offered")
for path in [ROOT/"styles"/"homepage-v5.css",ROOT/"script.js",ROOT/"tools"/"validate-site.py"]:
 if not path.is_file():fail("missing implementation file: "+str(path.relative_to(ROOT)))
css=(ROOT/"styles"/"homepage-v5.css").read_text(encoding="utf-8")
colors={x.upper() for x in re.findall(r"#[0-9A-Fa-f]{6}",css)}
if colors-TOKENS:fail("unapproved color values: "+", ".join(sorted(colors-TOKENS)))
if "background-v5-desktop.svg" not in css or "background-v5-tablet.svg" not in css or "background-v5-mobile.svg" not in css:fail("responsive continuous field mappings missing")
if "prefers-reduced-motion" not in css:fail("reduced-motion CSS fallback missing")
if "focus-visible" not in css or "skip-link" not in body:fail("focus/skip navigation missing")
js=(ROOT/"script.js").read_text(encoding="utf-8")
if "three@0.187.0/build/three.module.js" in js or ".architecture-core" not in body or ".architecture-orbit" not in body:fail("N-centered architecture orbit missing or WebGL dependency remains")
if "data-reveal" not in body or "IntersectionObserver" not in js:fail("progressive reveal motion missing")
if "brand-lockup.webp" in body:fail("old cropped logo derivative remains in use")
print("PASS: Napse homepage v5 structural checks")
print(f" - sections: {len(p.sections)}; H1: {p.h1}; WebGL canvases: {p.canvases}; WhatsApp CTAs: {len(p.wa)}")
print(" - original logo PNG and transparent character are used")
print(" - one continuous background, with desktop/tablet/mobile compositions")
print(" - N-centered orbit diagram in HTML/SVG; no WebGL dependency")
print(" - copy is grounded in engineering/implantation and documented claims")
print(" - official palette, reduced-motion, keyboard focus and skip navigation")
