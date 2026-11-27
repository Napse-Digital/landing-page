# Landing Page — Agent Instructions

This repository is the production implementation of the Napse Digital Solutions landing page. Brand and design source of truth lives in [napse-foundations](https://github.com/Napse-Digital/napse-foundations).

## Non-negotiable visual rules

- Preserve one continuous page-wide background from header to footer.
- Do not assign independent opaque background images/colors to individual sections.
- Never introduce white gaps, blank strips, seams, wrapper edges or hard horizontal cuts between sections.
- The original wave image is a hero atmosphere layer which fades into the long SVG field. Do not tile it or stretch it to page height.
- Keep the SVG/CSS fallback complete. Do not introduce Three.js solely to decorate; use one global shared scene only if a measured visual improvement justifies it.
- Preserve the supplied character and official brand lockup. Never replace or redraw either.
- Use only the 14 official Design Kit v1 color values. Do not introduce extra accent hues.
- Manrope for headings, Inter for body/UI.
- Dark-surface primary CTA: Pale Mint `#B2D6C9` / Ink `#10201C`.
- Light-surface primary CTA (only if intentionally added): Deep Forest `#081715` / White `#FFFFFF`.
- No white-on-white or pale-mint-on-pale-mint buttons.
- Keep layout editorial and restrained; avoid turning every section into a card.

## Content and claims

- All conversion CTAs use exactly `https://wa.me/5518991657817`.
- The first conversation is free. Deep technical discovery may have separate scope and terms.
- The client owns business rules and business operations; Napse owns engineering and technical maintenance when contracted.
- Do not claim customer logos, case studies, testimonials, metrics, certifications, live integrations, 24/7 operations, a ready-made platform/catalog or autonomous error-free operation without evidence.
- Do not invent the production domain or canonical URL.
- The copy v2 in napse-foundations remains a proposed draft; preserve wording without implying final editorial approval.

## Code quality

- Keep the implementation static-first unless a concrete requirement justifies a dependency.
- Preserve relative asset paths so GitHub Pages/project subpaths work.
- Keep assets local and avoid external private image URLs.
- Respect `prefers-reduced-motion`, keyboard navigation and visible focus.
- Maintain semantic headings, accessible names, skip navigation and 44px minimum touch targets.
- Every new external dependency must have a reason and a static fallback where relevant.
- Run `python tools/validate-site.py` after content, asset or path changes.
- For visual changes, rerun browser QA at 1440×900, 1024×768, 768×1024, 390×844 and 320×740. Check full-page section transitions, not just the hero.
