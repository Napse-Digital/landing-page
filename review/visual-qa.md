# Visual QA — Ajustes de composição hero e arquitetura

## Alterações nesta revisão
- O personagem da hero usa o arquivo `hero-character-cutout.webp`, sem o derivado com feathering aplicado nas bordas.
- A imagem está dimensionada para caber integralmente no quadro, alinhada à parede direita da coluna visual, sem transformações que provoquem crop.
- Removida a camada adicional de halo da hero.
- Aumentado o espaço vertical antes da legenda “Da necessidade à solução em produção”.
- Retirada a versão do diagrama com o N central.
- Restaurada a cena 3D anterior, com geometria central, nós de entrada/saída e conexões, mantendo SVG semântico como fallback.
- Painel “Arquitetura em contexto” alterado para a superfície verde da paleta Napse.
- Removido o filtro alfa aplicado à logo atual; a substituição pelo arquivo mestre transparente correto permanece pendente do envio do usuário.

## Validação automatizada
- Validador estrutural atualizado para conferir o asset de personagem, uma cena de arquitetura e seu SVG fallback.
- Sintaxe JavaScript e teste estrutural precisam ser confirmados via CI no commit desta revisão.

## Revisão visual manual pendente
- 1440×900, 1024×768, 768×1024 e 390×844.
- Personagem completo, sem corte de cabeça/jaqueta, alinhado à borda direita e sem halo desfocado.
- Respiro da legenda inferior.
- Painel verde, hierarquia tipográfica e contraste.
- Comportamento da cena 3D e fallback estático.
- Logo: substituir após o recebimento do PNG RGBA com transparência real ou SVG oficial.
- Console, rede, menu, FAQ, teclado e reduced motion.

A branch `main` não foi alterada nesta revisão. Não houve publicação em produção.
