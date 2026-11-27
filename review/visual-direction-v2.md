# Napse Landing Page — Direção visual v2

**Status:** implementada em branch principal para revisão visual do responsável. Não publicada na Vercel.

## 1. Diagnóstico da primeira versão

- O HTML procurava `brand-lockup-cropped.webp`, arquivo inexistente no repositório. O ativo real, presente no manifesto, é `brand-lockup.webp`.
- As referências HTML usavam caminhos `/assets/...`; isso os torna dependentes da raiz do domínio e frágeis em previews/subpaths. Foram normalizados para caminhos relativos `./assets/...`.
- O campo escuro estava aplicado praticamente à página inteira. Isso reduzia o contraste editorial e se afastava da referência de superfícies claras e botões verdes.
- Não havia animações de entrada por scroll nem um elemento tridimensional renderizado em tempo real. Os círculos/orbitas existentes eram CSS 2D.
- Manrope e Inter já eram as famílias definidas; o problema era a aplicação da hierarquia, densidade e contraste tipográfico, não necessariamente a escolha das famílias.

## 2. Direção escolhida

Composição híbrida:
- **Hero:** Deep Forest, ondas originais, blur volumétrico e personagem oficial como protagonista.
- **Seções editoriais:** alternância deliberada entre White e Canvas, com texto Ink/Body e acentos Accent.
- **Ações:** Dark Emerald com texto White nas superfícies claras; Pale Mint com Ink sobre superfícies escuras.
- **Áreas de ênfase:** painel de arquitetura e CTA final permanecem escuros.
- **Separação:** alternância de superfície, bordas de baixo contraste, alinhamento e respiro. Sem divisórias pesadas ou cartões redundantes.

A solução não tenta reproduzir cada detalhe da referência externa; traduz a linguagem visual para a identidade própria da Napse e para os limites reais da oferta.

## 3. Prompt de direção visual

> Repaginar a homepage da Napse Digital Solutions com uma estética de engenharia tecnológica premium, editorial e contemporânea. Usar superfícies brancas e off-white como base das seções informativas, verde institucional como cor primária de ação e Deep Forest/Dark Emerald como contraste em áreas de destaque.
>
> Preservar o personagem 3D e o lockup oficiais. O hero deve continuar cinematográfico, com o personagem em destaque, atmosfera esmeralda, blur volumétrico e ondas integradas ao fundo. Não transformar o personagem em uma ilustração genérica nem simular que o PNG é um modelo 3D interativo.
>
> Melhorar a tipografia, a hierarquia, o ritmo vertical e a composição editorial. Introduzir separadores sutis entre seções, diagramas mais expressivos e elementos visuais que expliquem processos, conexões e arquitetura.
>
> Adicionar animações discretas de entrada durante a rolagem, transições suaves, microinterações e um elemento 3D real com Three.js em uma única área da página. O elemento 3D deve ter propósito visual, iluminação esmeralda, movimento lento e fallback estático. Não usar efeitos apenas para demonstrar tecnologia.
>
> Manter performance, acessibilidade, responsividade e suporte a `prefers-reduced-motion`. Nenhuma animação pode impedir leitura ou navegação. Não inventar clientes, métricas, depoimentos, integrações ativas ou funcionalidades já disponíveis.

## 4. Alterações aplicadas

| Área | Alteração |
|---|---|
| Assets | Logo corrigido, referências relativas, favicon declarado |
| Hero | Blur e ondas preservados, iluminação e composição refinadas |
| Base cromática | Branco/Canvas nas áreas editoriais |
| Botões | Verde escuro e texto branco nas áreas claras |
| Tipografia | Hierarquia, pesos, line-height e tracking revistos |
| Separação | Alternância de superfícies, bordas leves e ritmo vertical |
| Motion | Scroll reveal, flutuação de baixa amplitude e microinterações |
| 3D | Cena Three.js única no diagrama de arquitetura, fallback HTML/CSS |
| Acessibilidade | Reduced motion, navegação e foco preservados |
| Conteúdo | Sem inclusão de claims, métricas ou prova social inventados |

## 5. O que foi preservado

- estrutura editorial de nove seções;
- copy comercial e limites de alegações;
- personagem e lockup oficiais;
- paleta oficial do Design Kit v1;
- CTA do WhatsApp;
- navegação mobile com gestão de foco;
- ausência de domínio canônico inventado.

## 6. Verificação e pendências

A validação estrutural é executada por GitHub Actions via `python tools/validate-site.py`. A validação do render real em Vercel permanece deliberadamente pendente até o responsável fornecer o projeto/domínio de preview. O review visual final deve observar 1440, 1024, 768, 390 e 320 px, especialmente as imagens, o carregamento Three.js, o crop do personagem e o comportamento do fallback.
