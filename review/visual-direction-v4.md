# Napse homepage — direção de revisão (v4)

## Direção aprovada pelo responsável
A homepage volta ao fundo verde contínuo da primeira versão. A nova referência de hero deve ser seguida na composição: logo no topo esquerdo, navegação central, CTA menta no topo direito; selo; headline em caixa alta à esquerda; personagem grande à direita; ondas luminosas integradas no mesmo ambiente; benefícios com ícones; dois CTAs.

Não alternar seções inteiras em branco. O branco deve aparecer apenas em cards funcionais, com tipografia escura. Os componentes sobre o fundo verde usam tipografia clara; os cards brancos usam Ink/Body e acentos Accent.

## Hero e assets
O personagem é um PNG/WebP raster fornecido, não um objeto 3D. Seu fundo original precisa ser removido para não criar uma placa verde/halo rectangular sobre o campo global. Não usar mix-blend-screen como substituto de um alpha correto.

O logo deve ser usado a partir do arquivo transparente fornecido pelo responsável. Não aplicar rembg, threshold agressivo, filtros CSS ou sombras que criem halos. O upload mais recente aparece visualmente na conversa, mas não foi disponibilizado como arquivo copiável no ambiente do repositório. Por isso, ele ainda não foi inserido; nenhum novo recorte foi criado nem aplicado ao logo. O HTML mantém temporariamente o asset anterior `brand-lockup.webp` até que o PNG transparente esteja acessível como arquivo.

## Fundo
- Restaurar os três SVGs contínuos desktop/tablet/mobile que já existiam.
- Preservar o wave asset original no topo do campo.
- Não criar um background independente por seção.
- Elementos de conteúdo permanecem transparentes, exceto cards.

## Cards e contraste
- Cards de capacidades: branco, radius moderado, texto Ink, corpo Body, ícones Accent.
- Arquitetura: card branco sobre o campo verde; painel/diagrama interno claro com elementos de conexão verdes e núcleo Deep Forest.
- Seção 03: três cards brancos com a mesma relação tipográfica.
- FAQ: um card branco contendo todas as perguntas, evitando linhas soltas sobre o verde.
- Os demais elementos de texto fora de cards permanecem claros sobre o campo verde.

## Seção 03
Remover “Cada projeto pode revelar componentes para o próximo”. Substituir por “Autonomia exige contexto, limites e avaliação”, explicando contexto, permissões/limites de ação e critérios verificáveis.

## Motion
- reveal ao entrar na viewport;
- personagem com movimento vertical de 8px / 13s;
- deriva suave das ondas e órbitas longas;
- traçados animados no diagrama;
- microinterações de botão/card.
- uma única cena Three.js no diagrama, com fallback estático.
- movimento reduzido desativa todas as animações.

## Critérios de revisão
1. Hero reproduz a referência de composição em 1440 px.
2. Personagem sem fundo/retângulo nem halo retangular.
3. Fundo verde contínuo até o rodapé.
4. Branco apenas em cards e com texto escuro.
5. Seção 03 fala de contexto, limites e avaliação.
6. Animações são perceptíveis, discretas e não afetam leitura.
7. Cena 3D aparece sem esconder os elementos fallback se WebGL falhar.
8. Revisão manual em 1440, 1024, 768, 390 e 320 px.
