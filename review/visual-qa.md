# Visual QA — Green field revision

## Structural gates
- Nine homepage sections; one H1.
- Relative local image/style paths; hero cut-out, lockup, waves, three continuous background SVGs and favicon exist.
- Approved WhatsApp destination across CTAs.
- Exactly one Three.js canvas in architecture diagram with static fallback.
- Section 03 rewritten around context, permissions/limits and evaluation.
- White cards use dark typography; page uses continuous green background.
- Only Design Kit v1 colors.
- Reduced motion, focus-visible and skip navigation are present.
- CI validates JavaScript syntax and asset references.

## Asset review completed
- The transparent character derivative was composited on Deep Forest and inspected. No rectangular source background or light halo is visible in the dark-field preview: `review/hero-character-dark-preview.jpg`.
- The compressed transparent WebP is approximately 262 KB and preserves its alpha channel.
- The separately supplied transparent logo image is not yet available as a file in the repository tooling; the current HTML still references the previous `brand-lockup.webp`. It has not been processed or redrawn.

## Visual review still pending
No Vercel preview URL supplied yet. Review 1440×900, 1024×768, 768×1024, 390×844 and 320×740. Confirm cutout alpha edges, logo transparency, hero composition, contrast on white cards, scroll reveals, motion timing, Three.js fallback, mobile menu and FAQ.

The structural CI is not a substitute for human visual approval. No deployment or visual sign-off is claimed.
