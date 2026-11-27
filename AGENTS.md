# Landing Page — Agent Instructions

## Source of truth
Follow Napse Foundations, especially the homepage redesign blueprint, Creative Engineering Spec, Claims Register, UI Kit, Responsive Guidelines, Motion Guidelines, Interaction Spec and Landing Handoff.

## Non-negotiable design rules
- Continuous Deep Forest background across the entire page.
- Official transparent lockup PNG and supplied humanoid character remain the brand assets.
- Keep the hero composition: brand/header, left copy, right character, emerald waves.
- Use Manrope headings and Inter body/UI. Preserve the Design Kit v1 colors exactly.
- Prefer editorial columns, lists, timelines and diagrams over repeated cards.
- Cards only when they group a real unit; avoid nested containers and generic icon tiles.
- Buttons follow the surface color matrix.
- No section-level background resets, seams or white strips.

## Commercial truth
- Napse develops and implements agents, automation, integrations/workflows and bespoke systems.
- Client owns business rules, decisions and operation of the business process.
- Napse owns technical engineering and maintenance/evolution only when contracted.
- Initial conversation is free; deeper technical diagnosis may have separate scope/conditions.
- No invented clients, logos, cases, metrics, testimonials, ratings, certifications, live integrations or ready-made platform/catalog.
- Do not imply automation is error-free, autonomous without limits or monitored 24/7.

## Motion and 3D
- Motion supports continuity and feedback, not decoration.
- Character is a raster asset, not an interactive 3D model.
- Keep one purposeful Three.js flow illustration in the architecture section with a semantic SVG fallback.
- Cap DPR, pause offscreen/hidden, dispose resources and respect reduced motion.
- Scroll reveals must degrade to visible content if JS/IntersectionObserver is unavailable.

## Validation
- Run python tools/validate-site.py and node --check script.js.
- Review 1440x900, 1024x768, 768x1024 and 390x844 in a browser.
- Check full-page continuity, image transparency, logo proportions, menu, FAQ, reduced motion, WebGL fallback and console/network errors.
