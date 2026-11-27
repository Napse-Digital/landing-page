# Napse Digital Solutions — Landing Page

Implementação estática da homepage institucional da **Napse Digital Solutions**. Este repositório contém somente o código e os assets da landing page. Posicionamento, copy de referência, identidade e fundamentos permanecem em [napse-foundations](https://github.com/Napse-Digital/napse-foundations).

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
│   ├── overrides.css
│   └── revamp.css
├── assets/
│   ├── hero-character.webp
│   ├── brand-lockup.webp
│   ├── waves.webp
│   ├── continuous-background-*.svg
│   ├── og-cover.jpg
│   ├── favicon.png
│   └── asset-manifest.json
├── tools/validate-site.py
└── review/
    ├── visual-direction-v2.md
    └── visual-qa.md
```

## Direção visual v2

A página passa a combinar:
- hero escuro com o personagem original e as ondas verdes como atmosfera;
- seções editoriais em White e Canvas;
- botões verde escuro com texto branco nas superfícies claras;
- painel de engenharia e CTA final em Deep Forest/Dark Emerald;
- tipografia Manrope + Inter, com hierarquia e espaçamento refinados;
- transições entre seções por superfícies intencionais, linhas e ritmo editorial.

O lockup e o personagem oficiais foram preservados. O nome do arquivo do lockup foi alinhado ao manifesto: `assets/brand-lockup.webp`. Os caminhos HTML são relativos, para funcionar na raiz e em subpaths.

## Animação e 3D

As animações de entrada são habilitadas progressivamente com IntersectionObserver. O personagem tem movimento vertical de baixa amplitude e os elementos orbitais/diagramáticos se movimentam lentamente. Todas as animações respeitam `prefers-reduced-motion`.

Há uma única cena Three.js no diagrama de arquitetura, carregada de forma dinâmica a partir de `three@0.187.0` (CDN jsDelivr). O objeto é decorativo e não representa um sistema conectado ou uma visualização operacional. Caso a biblioteca, WebGL ou a rede não estejam disponíveis, o diagrama HTML/CSS permanece como fallback. A cena pausa fora da viewport e quando a aba perde visibilidade.

## Ativos

- `hero-character.webp`: personagem fornecido, com canal alfa preservado.
- `brand-lockup.webp`: lockup horizontal oficial, sem reconstrução do wordmark.
- `waves.webp`: ondas originais no formato nativo, usadas apenas como atmosfera do hero.
- `favicon.png`: recorte do emblema oficial.

Os PNGs mestres permanecem preservados em `napse-foundations/assets/`; este repositório contém os derivados otimizados. Os SVGs de background contínuo permanecem no repositório como estudos/ativos anteriores, mas não são mais aplicados como background global na direção v2.

## Conteúdo e limites comerciais

A página comunica engenharia e implantação sob medida, não uma plataforma ou catálogo pronto. Não são inventados clientes, métricas, cases, integrações ativas, certificações, depoimentos, avaliações, disponibilidade 24/7 ou autonomia sem erros.

A primeira conversa pelo WhatsApp é gratuita; diagnóstico técnico aprofundado pode ter escopo e condições próprios. O cliente mantém regras e operação empresarial; Napse responde pela engenharia e manutenção técnica quando contratada.

Todos os CTAs de conversão apontam para:

`https://wa.me/5518991657817`

O domínio oficial de produção ainda não foi confirmado. Por isso não foi inventado canonical, sitemap absoluto ou URL absoluta para Open Graph.

## Validar

```bash
python tools/validate-site.py
```

A validação verifica paths de assets, lockup e personagem, links internos, CTAs, presença da cena 3D com fallback, tokens de marca, breakpoints, foco visível, navegação por teclado e movimento reduzido.

## Fonte de verdade

- [Creative Engineering Spec](https://github.com/Napse-Digital/napse-foundations/blob/main/design/creative-engineering-spec.md)
- [Button Color Matrix](https://github.com/Napse-Digital/napse-foundations/blob/main/design/button-color-matrix.md)
- [UI Kit](https://github.com/Napse-Digital/napse-foundations/blob/main/design/ui-kit.md)
- [Responsive Guidelines](https://github.com/Napse-Digital/napse-foundations/blob/main/design/responsive-guidelines.md)
- [Motion Guidelines](https://github.com/Napse-Digital/napse-foundations/blob/main/design/motion-guidelines.md)
- [Interaction Spec](https://github.com/Napse-Digital/napse-foundations/blob/main/ux/interaction-spec.md)
- [Landing implementation handoff](https://github.com/Napse-Digital/napse-foundations/blob/main/references/landing-page-handoff.md)
