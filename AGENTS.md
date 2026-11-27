# Landing Page — Agent Instructions

## Visual system
- Use the continuous Deep Forest / emerald page background from the original landing.
- Hero must follow the approved reference: brand in the top-left, navigation centered, mint CTA top-right, uppercase copy left, official character right, emerald wave light behind the character.
- Do not show the rectangular/green source background behind the character. Use the clean transparent character derivative.
- Keep white only for useful cards. White cards always use Ink/Body text with green accents.
- The architecture card is white against the green field; its diagram uses dark typography and green lines.
- Preserve the 14 official Design Kit v1 tokens and Manrope/Inter typography.
- Do not reconstruct a user-provided logo or remove its background with a crude CSS blend.

## Motion and 3D
- Use restrained reveals, low-amplitude character float, slow atmosphere drift and small interaction feedback.
- Respect prefers-reduced-motion.
- Keep exactly one Three.js scene in the architecture visual with a static fallback.
- Pause when off-screen or hidden and dispose WebGL resources.

## Content and claims
- Section 03 is about agent execution controls: context, limits/permissions and evaluation.
- Do not reintroduce claims about reusable components or automatic value in future projects.
- Do not invent customers, cases, metrics, integrations, certifications, 24/7 availability or a ready-made product.
- WhatsApp CTAs must use https://wa.me/5518991657817.
- No production domain/canonical without confirmation.

## Validation
- Run python tools/validate-site.py and node --check script.js.
- Review at 1440, 1024, 768, 390 and 320 px, including hero image edges, cards, menu, FAQ, reduced motion and 3D fallback.
