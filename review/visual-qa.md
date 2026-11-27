# Visual QA — Hero, transição e diagrama interativo

## Alterações implementadas nesta revisão
- O grid de duas colunas da hero foi preservado; a camada visual do personagem foi retirada do fluxo da coluna e ancorada independentemente à parede direita do grid.
- A altura da camada visual ultrapassa a base do grid, sem alterar a largura reservada ao texto.
- Uma máscara de opacidade gradual aplicada somente à base dissolve o término da imagem no Deep Forest; a silhueta principal não recebe blur ou filtro.
- A transição da hero para a seção de contexto usa uma dissolução mais longa no campo de fundo e uma pequena sobreposição vertical da primeira seção.
- Os três princípios da hero ficam em uma única linha em desktop; layouts estreitos podem quebrar a linha para evitar overflow.
- O diagrama mantém o núcleo central, substitui nós quadrados por esferas e adiciona órbitas e conexões.
- O diagrama aceita arraste por ponteiro/toque horizontal e rotação por setas do teclado; há inércia leve, rotação autônoma discreta e suporte a prefers-reduced-motion.
- A logo foi mantida intocada nesta rodada.

## Validação automatizada
- A validação estrutural e sintática precisa ser confirmada pelo CI no commit desta revisão.
- A disponibilidade de WebGL/CDN e o fallback SVG precisam ser inspecionados no Preview.

## Revisão visual manual pendente
Validar 1440×900, 1024×768, 768×1024 e 390×844:
- Personagem alinhado à parede direita, sem corte horizontal visível na base.
- Dissolução da base sem apagar detalhes relevantes da jaqueta.
- Texto e imagem sem sobreposição indevida.
- Transição hero → contexto sem linha de corte ou faixa de cor.
- Três princípios em linha onde houver largura útil; sem overflow em tablet/mobile.
- Esferas, órbitas, conexões e controle por arraste/setas no painel de arquitetura.
- Comportamento com WebGL indisponível, CDN indisponível e movimento reduzido.
- Console, rede, menu, FAQ, foco de teclado e links.

A logo permanece como estava. A branch `main` não foi alterada nesta revisão; não houve merge ou publicação em produção.
