# Homepage Redesign v1 — implementação

**Status:** implementação para revisão; não publicada na Vercel.

## Fonte estratégica
A narrativa deriva do documento [Homepage Redesign Blueprint v1](https://github.com/Napse-Digital/napse-foundations/blob/main/references/homepage-redesign-blueprint-v1.md), criado após revisão do briefing, content architecture, homepage-content v2, claims, SEO, brand, Creative Engineering Spec, UI Kit, background, motion, responsive, visual QA, interaction spec e handoff.

## Mudanças estruturais
- H1 alinhado ao posicionamento: engenharia de IA para transformar processos em capacidades operacionais.
- Contexto operacional apresentado por sinais editoriais, sem simular cases.
- Capacidades organizadas como disciplinas de engenharia em linhas editoriais, não quatro cards idênticos.
- Arquitetura em um único painel claro com diagrama conceitual, rótulo de não-realização e cena 3D de fluxo.
- Processo representado como timeline conectada.
- Responsabilidades do cliente e da Napse separadas sem duplicar o conteúdo.
- FAQ responde dúvidas sobre escopo, integração, plataforma, operação e custos de diagnóstico.
- CTA descreve a conversa inicial gratuita e diagnóstico aprofundado com escopo próprio.

## Sistema visual
- Deep Forest contínuo por toda a homepage, com SVGs responsivos próprios.
- Waves originais restritas à atmosfera da hero, com máscara de transição.
- Personagem usa o recorte transparente revisado.
- Logo passa a usar o PNG RGBA original vindo do Foundations, sem recorte, reconstrução ou filtros.
- Superfície branca de arquitetura com texto Ink/Body.
- Tipografia Manrope/Inter, tokens oficiais e botões por superfície.
- Sem cards repetitivos, badges decorativos ou provas sociais inventadas.

## 3D e motion
Uma cena Three.js na arquitetura demonstra entradas, agente/orquestração e sistemas/ações. Um SVG semântico permanece como fallback. A cena pausa fora da viewport e em aba oculta, limita pixel ratio e desativa movimento em reduced-motion. Scroll reveals são progressivos e não escondem conteúdo sem suporte.

## Verificação
A CI verifica estrutura, oito seções, links/asset paths, CTA, paleta, movimento reduzido, acessibilidade básica, cena 3D e fallback. A CI não substitui QA visual no navegador.

## Pendências para aprovação
- Visual de browser nos quatro viewports de Foundations.
- Confirmar o domínio de produção para retirar noindex e configurar canonical.
- Revisão editorial final e validação de copy.
- Confirmar a Vercel preview após atualização da branch.
