# Visual QA — Homepage Redesign v1

## Automated checks
- Eight narrative sections, one H1 and valid internal anchors.
- Original logo PNG and transparent character asset paths resolve.
- Desktop/tablet/mobile global background assets exist and are linked.
- WhatsApp CTAs point to the confirmed destination.
- One purposeful Three.js flow scene with static SVG fallback.
- Official palette only; reduced motion, visible focus and skip navigation.
- JavaScript syntax checked in GitHub Actions.

## Browser review status: BLOCKED

The Vercel URL could not be fetched from the current browser environment, and this review branch has not been redeployed. The following must be checked once a browser preview is available:
- Full-page render at 1440×900, 1024×768, 768×1024 and 390×844.
- Hero composition, official logo proportions and character alpha edges.
- Background continuity at each section boundary.
- Typography hierarchy, actual contrast and line breaks.
- Architecture diagram and Three.js framing; SVG fallback if WebGL is unavailable.
- Navigation, FAQ, keyboard focus and reduced-motion behavior.
- Console/network errors, image/font loading and layout shifts.

Structural CI passed on commit `810e4dff4cc2a238323966ff8b48eb5cccd94ddd` before this review-only maintenance patch. A passing CI is not visual approval or production deployment.
