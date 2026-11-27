# Visual QA — Homepage Redesign v1

## Automated checks
- Eight narrative sections, one H1 and valid internal anchors.
- Original logo PNG and transparent character asset paths resolve.
- Desktop/tablet/mobile global background assets exist and are linked.
- WhatsApp CTAs point to the approved destination.
- One purposeful Three.js canvas with static SVG fallback.
- Approved palette only; reduced motion, visible focus and skip navigation.
- JavaScript syntax checked in CI.

## Browser review required
The Vercel preview has not been redeployed from this commit. These items remain BLOCKED until a browser preview is available:
- Full-page review at 1440×900, 1024×768, 768×1024 and 390×844.
- Hero visual balance, official logo proportions and character alpha edges.
- Background continuity at every section transition.
- Card/surface contrast, typography hierarchy and line breaks.
- Architecture diagram legibility, Three.js render and SVG fallback.
- Navigation, FAQ, keyboard focus and reduced-motion behavior.
- Console/network errors and image/font loading.

A passing structural CI is not visual approval. No production deployment is claimed.
