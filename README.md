# Napse Digital Solutions — Homepage

Homepage institucional estática da Napse Digital Solutions. A implementação segue o blueprint de redesign v1 e os documentos normativos de Napse Foundations.

## Direção implementada

A página é estruturada em torno da oferta de engenharia e implantação:
- hero e posicionamento;
- contexto de necessidades operacionais;
- capacidades de engenharia;
- arquitetura conceitual;
- processo de engenharia;
- divisão de responsabilidades;
- FAQ e CTA.

A página não apresenta categorias como produtos prontos nem inventa clientes, resultados, integrações ou métricas.

## Identidade e assets

- Fundo Deep Forest contínuo com três composições vetoriais responsivas.
- Hero com a imagem original de ondas como atmosfera, integrada ao campo global.
- Personagem com recorte transparente preservado.
- Logo oficial original PNG RGBA, copiado de Napse Foundations sem crop, redesenho ou filtro.
- Manrope nos títulos e Inter em texto/UI.
- Somente os tokens oficiais Design Kit v1.

## Arquitetura, motion e 3D

O diagrama da arquitetura é conceitual e rotulado como tal. Uma única cena Three.js representa o fluxo entre contexto, agentes e sistemas. O SVG permanece como fallback. A cena pausa fora da viewport/aba e respeita prefers-reduced-motion.

Scroll reveals são progressivos: o conteúdo continua visível sem JavaScript ou sem IntersectionObserver.

## Executar e validar

```bash
python -m http.server 4173
python tools/validate-site.py
node --check script.js
```

Abra http://localhost:4173.

## SEO e publicação

A página está em estado de revisão e usa noindex/nofollow até a confirmação do domínio oficial e da publicação de produção. Não inventar canonical ou metadados absolutos. O CTA confirmado é https://wa.me/5518991657817.

## Fonte de verdade

- [Napse Foundations](https://github.com/Napse-Digital/napse-foundations)
- [Homepage redesign blueprint v1](https://github.com/Napse-Digital/napse-foundations/blob/main/references/homepage-redesign-blueprint-v1.md)
- [Creative Engineering Spec](https://github.com/Napse-Digital/napse-foundations/blob/main/design/creative-engineering-spec.md)
- [Claims Register](https://github.com/Napse-Digital/napse-foundations/blob/main/content/claims-register.md)
- [Interaction Spec](https://github.com/Napse-Digital/napse-foundations/blob/main/ux/interaction-spec.md)
