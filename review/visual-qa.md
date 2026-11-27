# Visual QA — Proporção da hero, tipografia e interação por cursor

## Alterações implementadas nesta revisão
- Reduzida a escala da tipografia principal da hero e limitado o comprimento de linha para restaurar a hierarquia entre título, descrição e ações.
- Criada escala tipográfica compartilhada para títulos de seção e textos de apoio; reduzidos os tamanhos de títulos da primeira seção, arquitetura e FAQ.
- Reduzida a imagem do personagem e mantido o ancoramento independente à direita, agora contido na altura útil do grid para não alcançar a linha “Da necessidade à solução em produção”.
- Mantida a dissolução gradual inferior da imagem, sem blur na silhueta.
- Removida a sobreposição negativa entre hero e primeira seção; a transição fica a cargo do gradiente inferior existente da hero, evitando dupla faixa escura.
- Os três princípios continuam lado a lado em larguras maiores e quebram de forma responsiva em telas estreitas.
- A composição 3D mantém a esfera central e nós esféricos distribuídos pelas órbitas. A orientação e a iluminação acompanham suavemente a posição do cursor dentro do painel, sem exigir clique ou arraste.
- O diagrama mantém rotação autônoma discreta, suporte às setas do teclado, pausa fora da viewport e respeito a prefers-reduced-motion.
- Logo mantida intocada conforme orientação.

## Validação automatizada
- A validação estrutural, sintaxe JavaScript e build devem ser confirmados no commit desta revisão.
- Verificar carregamento do módulo Three.js/WebGL e fallback SVG no Preview.

## Revisão visual manual pendente
Conferir 1440×900, 1024×768, 768×1024 e 390×844:
- Proporção título/personagem e área livre entre a cópia e a imagem.
- Texto “Da necessidade à solução em produção” totalmente legível, sem cruzar a imagem.
- Hierarquia de H1, H2, texto de apoio, labels e metadados.
- Transição hero → primeira seção sem emenda ou faixa escura.
- Três princípios em linha em largura desktop e sem overflow em tablet/mobile.
- Perspectiva e iluminação respondendo ao cursor somente dentro do painel; sem interação por clique.
- Esferas e órbitas visíveis com movimento sutil, sem competir com o conteúdo.
- Fallback quando WebGL/CDN indisponível e estado com movimento reduzido.
- Console, rede, menu, FAQ, foco de teclado e links.

A logo permanece intocada. A branch `main` e a produção não foram alteradas nesta revisão.
