# Visual QA — Revisão editorial e visual

## Escopo implementado nesta revisão
- O título da seção de contexto foi restaurado para “O trabalho da sua empresa não acontece em uma única ferramenta.”
- Removida a ressalva redundante abaixo do fluxo de contexto.
- Restauradas as quatro descrições anteriores das capacidades.
- Restaurados o parágrafo e a nota conceitual anteriores da seção de arquitetura.
- O diagrama foi restaurado como orbe central com N, órbitas e nós para processos, dados, sistemas e canais.
- Removida a cena Three.js; a arquitetura agora usa HTML/SVG sem dependência WebGL.
- O hero usa o derivado com alfa suavizado `hero-character.webp`, alinhado à direita e à base.
- O logo oficial PNG permanece sem reconstrução; o tratamento alfa reduz o halo semitransparente.
- O fundo das ondas passa a desaparecer gradualmente sobre o campo global, sem um halo independente atrás do personagem.

## Automated checks
- O validador verifica oito seções narrativas, um H1, âncoras, assets, paleta oficial, variantes de background, reduced motion, foco, CTA e presença do orbe.
- O teste JavaScript verifica a sintaxe de `script.js`.
- O teste estrutural precisa ser confirmado no novo commit via GitHub Actions antes de ser marcado como aprovado.

## Browser review
A revisão de navegador ainda é necessária no Preview atualizado:
- 1440×900, 1024×768, 768×1024 e 390×844.
- Recorte, escala, encaixe à direita e distância entre personagem e texto.
- Transparência da logo no header e footer, sem halo opaco perceptível.
- Continuidade do background nas transições da hero para a seção de contexto.
- Leitura do orbe/N e posicionamento dos quatro nós, sobretudo em mobile.
- Menu, FAQ, foco de teclado, reduced motion, console e rede.

Build concluído na Vercel não equivale a aprovação visual. A branch `main` permanece inalterada; não foi solicitada publicação em produção.
