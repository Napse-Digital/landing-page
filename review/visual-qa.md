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
- O fundo das ondas desaparece gradualmente sobre o campo global, sem halo independente atrás do personagem.

## Automated checks — PASS
- Commit validado: `cc2da6f113126879af15e5112ed35d931f008f83`.
- GitHub Actions: validação estrutural e sintaxe JavaScript aprovadas no [run 25](https://github.com/Napse-Digital/landing-page/actions/runs/46058174688).
- Vercel Preview: deployment `dpl_4e9njvYvuE5rvQpJnW2XMrTAwJDu` em estado `READY` para o mesmo commit.

## Browser review — pendente
A compilação e os testes estruturais não substituem inspeção visual. Revisar no Preview:
- 1440×900, 1024×768, 768×1024 e 390×844.
- Recorte, escala, encaixe à direita e distância entre personagem e texto.
- Transparência da logo no header e footer, sem halo opaco perceptível.
- Continuidade do background nas transições da hero para a seção de contexto.
- Leitura do orbe/N e posicionamento dos quatro nós, sobretudo em mobile.
- Menu, FAQ, foco de teclado, reduced motion, console e rede.

A revisão visual manual ainda não foi concluída. A branch `main` permanece inalterada; não foi solicitada publicação em produção.
