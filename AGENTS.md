# Landing Page — Agent Instructions

This repository contains the production implementation of the Napse Digital Solutions homepage. Brand, positioning, content and design foundations remain documented in [napse-foundations](https://github.com/Napse-Digital/napse-foundations). The latest user-approved direction for the visual implementation is the v2 hybrid system described in [review/visual-direction-v2.md](./review/visual-direction-v2.md).

## Visual system

- Use a hybrid composition: dark atmospheric hero, light editorial content sections, a dark architecture feature panel, a dark final CTA and footer.
- Preserve the supplied character and the official horizontal lockup. Do not redraw either asset.
- Use relative local paths such as `./assets/hero-character.webp`; root-absolute `/assets/...` paths are not allowed.
- Hero waves are an atmosphere layer inside the hero only. Do not stretch or tile them through the page.
- Alternate White and Canvas surfaces intentionally to establish editorial rhythm. Section boundaries must be deliberate, never accidental blank gaps or broken wrappers.
- Use the 14 official Design Kit v1 color values only.
- Manrope for headings, Inter for body/UI.
- Light-surface primary CTA: Dark Emerald `#1E443A` with White text.
- Dark-surface primary CTA: Pale Mint `#B2D6C9` with Ink `#10201C`.
- Maintain clear contrast; never use white-on-white or pale-mint-on-pale-mint.

## Motion and 3D

- Motion must be subtle and purposeful: reveal, low-amplitude character drift, orbit movement, and interface feedback.
- Respect `prefers-reduced-motion`; content must remain visible and functional.
- The one approved Three.js scene is the decorative architecture visual. Keep its static HTML/CSS fallback functional.
- Use one renderer, cap pixel ratio, animate only while visible, stop when the page is hidden/offscreen, and release resources.
- Do not add other canvases, particle fields or framework layers without a clear user request and measurable visual benefit.
- Three.js is loaded from the pinned CDN version documented in `script.js`. If it fails, the diagram fallback remains.

## Content and claims

- All conversion CTAs use exactly `https://wa.me/5518991657817`.
- The first conversation is free. Deep technical discovery may have separate scope and terms.
- The client owns business rules and business operations; Napse owns engineering and technical maintenance when contracted.
- Do not claim customers, case studies, testimonials, metrics, certifications, live integrations, 24/7 operations, a ready-made platform/catalog or autonomous error-free operation without evidence.
- Do not invent the production domain or canonical URL.
- The copy remains subject to editorial review; do not describe it as finally approved.

## Code quality and validation

- Keep the implementation static-first; no framework/build step is required.
- Preserve relative paths for assets, stylesheets, and scripts.
- Keep assets local except for the pinned Three.js module and hosted font files; both require graceful visual fallbacks.
- Preserve semantic headings, keyboard navigation, visible focus, skip navigation and 44px minimum touch targets.
- Run `python tools/validate-site.py` after changes.
- For final visual approval, review the deployed preview at 1440, 1024, 768, 390 and 320 px; test image loading, section rhythm, mobile navigation, reduced motion and the Three.js fallback.
