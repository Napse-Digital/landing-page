# Napse Digital Solutions — Landing Page

Implementação estática da homepage institucional da **Napse Digital Solutions**. Este repositório contém somente o código e os assets da landing page. Posicionamento, copy de referência, identidade, tokens, UX e decisões de design permanecem em [napse-foundations](https://github.com/Napse-Digital/napse-foundations).

## Executar localmente

A página não exige framework nem etapa de build. Com Python 3:

```bash
python -m http.server 4173
```

Abra `http://localhost:4173`.

## Estrutura

```text
landing-page/
├── index.html
├── script.js
├── styles.css
├── styles/
│   ├── sections.css
│   ├── responsive.css
│   └── overrides.css
├── assets/
│   ├── hero-character.webp
│   ├── brand-lockup.webp
│   ├── waves.webp
│   ├── continuous-background-desktop.svg
│   ├── continuous-background-tablet.svg
│   ├── continuous-background-mobile.svg
│   ├── og-cover.jpg
│   ├── favicon.png
│   ├── asset-manifest.json
│   └── SOURCE-CHECKSUMS.sha256.txt
├── tools/validate-site.py
├── review/visual-qa.md
└── .github/workflows/validate.yml
```

## Background contínuo

O site utiliza um único campo visual por trás de header, hero, todas as seções e footer. O campo é composto por:
1. SVG vetorial longo com curvas, gradientes e luzes em coordenadas contínuas;
2. ondas originais otimizadas em WebP, restritas ao topo e dissolvidas por máscara no campo vetorial;
3. transparência nos wrappers das seções, evitando fundos independentes e faixas de corte.

Há três composições SVG por viewport. Nenhuma imagem é repetida como tile ou esticada ao longo da página. O SVG é o fallback completo; Three.js/GLSL não foi adicionado porque não demonstrou benefício suficiente sobre a solução vetorial/CSS.

## Marca e assets

- O lockup oficial foi preservado; somente padding transparente ao redor foi aparado.
- O personagem original foi preservado em resolução integral; o derivado aplica feather de alpha na lateral e na base para integrá-lo ao campo visual.
- O background de ondas mantém sua proporção e resolução nativas.
- Os PNGs mestres ficam preservados em `napse-foundations/assets/`; este repositório contém apenas os derivados otimizados.
- Os derivados são reproduzíveis por `napse-foundations/tools/export-web-assets.py`.

## Sistema visual

Cores limitadas ao Design Kit v1: Deep Forest, Dark Emerald, Forest, Muted Green, Sage, Mint, Pale Mint, Accent, Canvas, White, Ink, Body, Muted e Line. Não há cores adicionais fora dos tokens.

Manrope é usada em headings e Inter em corpo/interface, com fallbacks de sistema. CTAs sobre fundo escuro usam Pale Mint com texto Ink. Secundários são transparentes e subordinados. A homepage não introduz superfícies brancas que interrompam o campo global.

## Conteúdo e limites comerciais

A copy v2 do repositório de fundamentos permanece proposta editorial e deve ser revisada antes da publicação final. A página comunica engenharia e implantação sob medida, não uma plataforma ou catálogo pronto.

Não são inventados clientes, métricas, cases, integrações ativas, certificações, depoimentos, avaliações, disponibilidade 24/7 ou autonomia sem erros. A primeira conversa pelo WhatsApp é gratuita; diagnóstico técnico aprofundado pode ter escopo e condições próprios. O cliente mantém regras e operação empresarial; Napse responde pela engenharia e manutenção técnica quando contratada.

Todos os CTAs de conversão apontam para:

`https://wa.me/5518991657817`

O domínio oficial de produção ainda não foi confirmado. Por isso não foi inventado canonical, sitemap absoluto ou URL absoluta para Open Graph. A arte `assets/og-cover.jpg` está preparada para uso quando o domínio for definido.

## Validar

```bash
python tools/validate-site.py
```

A validação verifica integridade dos links/ativos locais, os cinco CTAs de WhatsApp, tokens da marca, presença do background global e breakpoints. O browser QA registrado em `review/visual-qa.md` foi executado com Chromium/Playwright em 1440, 1024, 768, 390 e 320 pixels.

## Fonte de verdade visual

- [Creative Engineering Spec](https://github.com/Napse-Digital/napse-foundations/blob/main/design/creative-engineering-spec.md)
- [Background Continuity System](https://github.com/Napse-Digital/napse-foundations/blob/main/design/background-continuity-system.md)
- [Button Color Matrix](https://github.com/Napse-Digital/napse-foundations/blob/main/design/button-color-matrix.md)
- [UI Kit](https://github.com/Napse-Digital/napse-foundations/blob/main/design/ui-kit.md)
- [Responsive Guidelines](https://github.com/Napse-Digital/napse-foundations/blob/main/design/responsive-guidelines.md)
- [Motion Guidelines](https://github.com/Napse-Digital/napse-foundations/blob/main/design/motion-guidelines.md)
- [Interaction Spec](https://github.com/Napse-Digital/napse-foundations/blob/main/ux/interaction-spec.md)
- [Landing implementation handoff](https://github.com/Napse-Digital/napse-foundations/blob/main/references/landing-page-handoff.md)

`AGENTS.md` registra as regras que devem ser preservadas em futuras alterações.
