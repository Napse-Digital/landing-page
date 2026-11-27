# Visual QA — Homepage Redesign v2

## Alterações narrativas aplicadas
- Hero explicita estratégia, engenharia e implantação de IA.
- Contexto operacional substituído por um fluxo ilustrativo: entrada, contexto, regras/decisão, ação e exceção.
- Capacidades descritas por tarefas que podem executar e seus limites.
- Jornada reescrita como Discovery, estratégia/arquitetura, Build/integração, Go-live/avaliação e operação/evolução.
- Etapas descrevem saídas possíveis, sempre condicionadas ao escopo.
- Metadados SEO/OG alinhados ao posicionamento.
- Blueprint de referência: `Napse-Digital/napse-foundations/references/homepage-redesign-blueprint-v2-runflow-alignment.md`.

## Automated checks
- Existing structural validator covers eight narrative sections, one H1, anchors, assets, official palette, responsive background variants, reduced motion, focus, CTA destination, one 3D canvas and SVG fallback.
- Existing JavaScript syntax check remains configured in GitHub Actions.
- The validator has not yet been observed running against the latest v2 commit. Do not claim CI passed for v2 until a run is verified.

## Browser review status: BLOCKED

The Vercel URL could not be fetched from the current browser environment, and this review branch has not been redeployed. The following must be checked once a browser preview is available:
- Full-page render at 1440×900, 1024×768, 768×1024 and 390×844.
- Hero composition, official logo proportions and character alpha edges.
- Background continuity at each section boundary.
- Typography hierarchy, actual contrast and line breaks.
- Operational flow readability and architecture diagram/Three.js framing; SVG fallback if WebGL is unavailable.
- Navigation, FAQ, keyboard focus and reduced-motion behavior.
- Console/network errors, image/font loading and layout shifts.

A passing structural check is not visual approval or production deployment. Main branch remains untouched; no production deploy was requested or performed.
