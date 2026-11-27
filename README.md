# Napse Digital Solutions — Landing Page

Homepage institucional estática da Napse Digital Solutions. Este repositório contém código e assets web; posicionamento, identidade e fundamentos permanecem em [napse-foundations](https://github.com/Napse-Digital/napse-foundations).

## Executar localmente

```bash
python -m http.server 4173
```

Abra `http://localhost:4173`.

## Direção visual

A página volta ao campo verde contínuo que já existia na primeira versão. O hero segue a composição da referência: navegação no topo, texto à esquerda, personagem à direita, ondas luminosas, blur atmosférico, botão primário menta e CTA secundário contornado.

O verde continua como ambiente global. O branco aparece apenas em cards funcionais (capacidades, controle, arquitetura e FAQ). Todo card branco usa títulos em Ink, corpo em Body e acentos verdes. Não há seções editoriais inteiras em branco.

Manrope é usada nos títulos e Inter no corpo/interface. Os títulos sobre fundo verde são claros; a tipografia em superfícies brancas é escura.

## Conteúdo

A seção 03 foi reescrita como **“Autonomia exige contexto, limites e avaliação”**. Ela apresenta três elementos reais da engenharia de agentes: informação relevante, ações delimitadas e critérios verificáveis. Não há promessa de ativos ou componentes reutilizáveis para projetos futuros.

Não são inventados clientes, métricas, integrações ativas, certificações, cases, disponibilidade 24/7 ou uma plataforma pronta. A primeira conversa é gratuita; diagnósticos técnicos aprofundados podem ter escopo e condições próprios.

## Assets

O personagem usa um derivado com fundo removido e canal alfa preservado. O master original permanece na identidade da Napse. O lockup oficial atual continua sem redesenho; o arquivo PNG transparente adicional enviado na conversa precisa estar disponível como arquivo para ser adicionado ao repositório — não foi aplicado nenhum recorte artificial nele.

Todos os paths locais são relativos. O domínio final ainda não foi informado; nenhum canonical/URL absoluta foi inventado.

## Motion e 3D

Animações de entrada, movimento muito lento do personagem e das ondas, órbitas e traçados de diagrama são sutis e respeitam `prefers-reduced-motion`. Há uma cena Three.js no diagrama de arquitetura, carregada dinamicamente e com fallback HTML/CSS.

## Validar

```bash
python tools/validate-site.py
node --check script.js
```

A CI executa as validações estruturais e a verificação de sintaxe. A revisão visual completa exige o preview de navegador/hosting depois de receber a configuração Vercel.
