# Visual QA — Napse Landing v2

## Automated structural gates

The v2 validator checks:
- exactly one H1 and the complete nine-section narrative;
- corrected logo filename and relative asset paths;
- local existence of the logo, hero character, wave artwork and favicon;
- local stylesheet paths and internal anchors;
- all WhatsApp conversion destinations;
- exactly one Three.js canvas in the architecture visual;
- pinned Three.js release and static fallback;
- official Design Kit v1 colors only;
- responsive breakpoints, visible focus, skip navigation and reduced-motion handling.

## Not yet verified in a deployed browser

No public URL or Vercel project has been supplied. The following must be reviewed once a preview deployment exists:
- successful requests for logo, hero character, waves and favicon;
- full-page rendering at 1440×900, 1024×768, 768×1024, 390×844 and 320×740;
- hero crop and visual balance on tablet/mobile;
- scroll reveals and character motion;
- Three.js module availability, WebGL scene appearance and static fallback;
- mobile menu, FAQ, focus order and reduced-motion behavior.

The v2 branch is prepared for user review; this file does not claim production deployment or final visual approval.
