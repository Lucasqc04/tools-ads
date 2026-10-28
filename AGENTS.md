# AGENTS.md - Regras do Site de Tools

Este arquivo consolida as regras obrigatorias do projeto para agentes de codigo. Foi convertido de regras-de-negocio.txt e deve ser lido antes de alteracoes relevantes, especialmente ao criar ou modificar ferramentas.

Este documento define os padrões obrigatórios para criação de qualquer nova ferramenta no site.

> NOTA IMPORTANTE: TODO O CONTEÚDO DESTE DOCUMENTO É OBRIGATÓRIO.
Todas as seções, estruturas e itens descritos aqui são requisitos mínimos — nada neste arquivo é "opcional" por padrão. Siga à risca para manter consistência e aprovação de SEO/Ads.

O objetivo é:
- Maximizar SEO no Google
- Garantir compatibilidade com Google AdSense
- Manter consistência entre todas as tools
- Garantir UX limpa, rápida e útil
- Evitar conteúdo raso (thin content)

## 1. PRINCÍPIO FUNDAMENTAL

Cada ferramenta deve ser tratada como:

> UMA LANDING PAGE INDEPENDENTE

Isso significa:
- Deve rankear sozinha no Google
- Deve fazer sentido sem o usuário visitar a home
- Deve ter conteúdo suficiente sem depender de outras páginas

## 2. ESTRUTURA OBRIGATÓRIA DE CADA TOOL

Toda ferramenta DEVE seguir esta estrutura:

1. TÍTULO PRINCIPAL (H1)
2. DESCRIÇÃO CURTA (logo abaixo do título)
3. ACESSO CLARO À TOOL (interface funcional na mesma rota)
4. BLOCO DE CONTEÚDO EXPLICATIVO
5. FAQ
6. LINKS INTERNOS (discretos)
7. RODAPÉ

NUNCA criar página apenas com input + botão.

### 2.1. PADRÃO DE EXPERIÊNCIA: PÁGINA E MODO FOCO

Por padrão, toda ferramenta deve ter uma página de entrada enxuta e um modo de uso focado, ambos na mesma rota e URL canônica:

- Na entrada, mostrar navegação discreta, H1, uma descrição curta e uma ação principal clara, como “Usar ferramenta” ou “Começar agora”.
- Ao acionar essa ação, mudar a interface para o modo foco: priorizar a ferramenta, ocupar melhor a largura disponível e ocultar temporariamente o conteúdo editorial que não ajuda na tarefa naquele momento.
- Oferecer uma ação visível para voltar às informações da página. Sempre que possível, preservar o estado e os dados já inseridos ao alternar os modos.
- A troca de modo deve acontecer na mesma rota, sem redirecionar para uma segunda página ou criar outra URL indexável.
- O modo focado pode ser compartilhado com o parâmetro `?expanded=1`. Esse parâmetro representa apenas estado de interface: não deve alterar title, description, canonical, hreflang, indexação ou sitemap. O canonical deve continuar apontando para a rota sem o parâmetro, e qualquer outro parâmetro funcional da ferramenta deve ser preservado.
- A ferramenta e o conteúdo SEO devem pertencer à mesma página. A página de entrada não pode ser apenas uma chamada para uma ferramenta que só existe em outra rota.
- Manter H1, introdução e conteúdo explicativo no HTML inicial renderizado no servidor. O texto longo deve ficar abaixo da área inicial da ferramenta ou em seções recolhíveis, sem dominar a primeira tela.
- Não é obrigatório envolver a interface inteira da ferramenta em um card. Usar a largura disponível de forma responsiva e aplicar superfícies apenas onde ajudarem a organizar controles ou resultados.

Ferramentas realmente simples podem abrir diretamente com a interface, sem uma etapa redundante de “Começar agora”, quando a tarefa couber com clareza na primeira tela, tiver poucos controles e não precisar de uma área separada para etapas, previews ou resultados. Ferramentas com múltiplas etapas, upload, controles avançados ou resultados que precisem de mais espaço devem usar o modo foco. Essa exceção não remove título, descrição, conteúdo explicativo, FAQ, metadados ou os demais requisitos da página.

- TRADUÇÕES (OBRIGATÓRIO): Toda nova ferramenta deve fornecer traduções obrigatórias para pelo menos as seguintes localidades: `pt-br`, `en` e `es`. Isso inclui: strings de UI, `h1`, `intro`, `seoTitle`, `seoDescription`, `contentBlocks` e `faq`. As traduções devem ser registradas no sistema de i18n do projeto (por exemplo `data/i18n/tool-translations.ts`) e/ou em arquivos de conteúdo localizados em `data/content/` seguindo o padrão do projeto.

## 3. SEO - REGRAS OBRIGATÓRIAS

Cada página deve conter:

- 1 H1 único e claro
- Subtítulos (H2, H3) bem organizados
- Texto original (mínimo recomendado: 300–800 palavras)
- Meta title otimizado
- Meta description clara
- URL amigável (slug simples e direto)

EXEMPLO:
✔ /btc-para-satoshis
✔ /remover-objeto-imagem
✖ /page?id=123

Palavras-chave:
- Deve haver uma keyword principal
- Deve haver variações naturais no texto
- NÃO fazer keyword stuffing

Conteúdo:
- Explicar o que a ferramenta faz
- Explicar quando usar
- Explicar exemplos reais
- Explicar limitações

Proibido:
- conteúdo genérico vazio
- lorem ipsum
- texto duplicado entre páginas
- páginas extremamente curtas

## 4. UX (EXPERIÊNCIA DO USUÁRIO)

A página deve:

- carregar rápido
- funcionar bem no mobile
- ter layout limpo
- ter foco na ação principal
- não ter scroll horizontal (nunca)

Regra obrigatória de responsividade:
- a página deve abrir corretamente em 320px e 375px de largura
- nenhum bloco pode ultrapassar a viewport horizontalmente
- previews e tabelas devem se adaptar com max-width: 100%
- se houver conteúdo grande, o ajuste deve ser interno ao componente, nunca no body

Evitar:
- excesso de menus
- header gigante
- poluição visual
- excesso de anúncios

Permitir:
- logo simples clicável
- navegação mínima
- foco total na ferramenta

## 5. GOOGLE ADS / ADSENSE

Cada página deve ser preparada para anúncios, mas sem exagero.

Posições recomendadas:
- 1 anúncio no topo
- 1 anúncio após a ferramenta
- 1 anúncio após conteúdo

Proibido:
- colocar anúncios antes do conteúdo carregado
- excesso de anúncios
- layout que engane o usuário

IMPORTANTE:
A página deve ter conteúdo real além de anúncios.

## 6. LINKS INTERNOS

Cada página deve ter links internos leves, por exemplo:

- "Outras ferramentas úteis"
- 2 a 4 links no máximo

Evitar:
- lista gigante de links
- navegação pesada

Objetivo:
- ajudar o Google a rastrear o site
- melhorar SEO sem atrapalhar UX

## 7. FAQ (OBRIGATÓRIO)

Toda tool deve conter FAQ com 3 a 5 perguntas.

Exemplo:
- O que essa ferramenta faz?
- É gratuita?
- Precisa enviar dados?
- Funciona no celular?

Objetivo:
- aumentar SEO
- pegar buscas long-tail
- melhorar entendimento do usuário

## 8. SEGURANÇA E PRIVACIDADE

Sempre deixar claro quando:

- dados não são enviados para servidor
- processamento é local (frontend)

Isso aumenta:
- confiança
- aprovação no AdSense

## 9. PERFORMANCE (IMPORTANTE)

Evitar:
- JS desnecessário
- re-renderizações pesadas
- dependências grandes

Priorizar:
- componentes server quando possível
- lazy loading
- carregamento rápido

## 10. PADRÃO VISUAL

Toda tool deve seguir padrão:

- título claro e responsivo
- descrição curta, sem ocupar a maior parte da primeira tela
- ferramenta fácil de encontrar e usar, com modo foco conforme a seção 2.1
- área da ferramenta dimensionada para seus controles, sem exigir um card centralizado como moldura
- espaçamento consistente
- botões claros
- inputs bem definidos

Priorizar uma primeira tela compacta, especialmente no mobile. Não colocar grandes blocos de texto antes da ação principal e não comprimir uma ferramenta larga dentro de cards estreitos ou de cards aninhados. O conteúdo explicativo, exemplos e FAQ continuam na mesma página, abaixo da ferramenta ou em seções recolhíveis.

## 11. PADRÃO DE COMPONENTES

Sempre reutilizar:

- AdSlot (anúncios)
- FAQ component
- Tool container
- Buttons
- Inputs

## 12. CONTEÚDO EXPLICATIVO (CRÍTICO)

Após a ferramenta, SEMPRE adicionar:

- explicação detalhada
- exemplos de uso
- contexto real

Isso é o que diferencia:

❌ site que não rankeia  
✅ site que ganha tráfego

## 13. NOMES E SLUGS

Regras:
- usar hífen (-)
- usar termos simples
- evitar palavras técnicas demais

Exemplos:
✔ btc-para-sats
✔ formatador-json
✔ remover-objeto-imagem

## 14. EXPANSÃO FUTURA

Toda nova tool deve:

- seguir este padrão
- não quebrar layout existente
- não duplicar código
- ser adicionada facilmente ao sistema

## 15. O QUE NÃO FAZER

- criar páginas sem conteúdo
- criar páginas só com tool
- copiar conteúdo
- exagerar em anúncios
- criar navegação confusa
- ignorar SEO
- ignorar mobile

## 16. CHECKLIST FINAL (OBRIGATÓRIO)

Antes de considerar a tool pronta:

[ ] Tem H1 claro
[ ] Tem meta title
[ ] Tem meta description
[ ] Tem conteúdo explicativo
[ ] Tem FAQ
[ ] Tem links internos
[ ] Funciona no mobile
[ ] Não tem scroll horizontal no mobile (320px/375px)
[ ] Está rápida
[ ] Tem estrutura limpa
[ ] Está pronta para ads
[ ] Não é thin content

## 17. ESTRUTURA PADRÃO DO PROJETO E COMO CRIAR NOVAS TOOLS

Toda nova ferramenta criada neste projeto DEVE respeitar a arquitetura existente do site.

O objetivo é:
- manter consistência
- facilitar manutenção
- facilitar SEO
- facilitar expansão futura
- evitar duplicação de código
- garantir que cada tool siga o mesmo padrão de qualidade

### 17.1. PRINCÍPIO DE ORGANIZAÇÃO

Este projeto separa responsabilidades em camadas:

- app/ = rotas e páginas
- components/ = componentes visuais reutilizáveis
- lib/ = lógica, cálculos, validações e helpers
- data/ = conteúdo estático, textos e registro das tools
- types/ = tipos TypeScript
- public/ = arquivos estáticos

NUNCA misturar tudo em um único arquivo grande sem necessidade.

A regra é:
- interface visual deve ficar nas páginas e componentes
- lógica deve ficar em lib/
- conteúdo textual deve ficar em data/content/
- cadastro central da tool deve ficar em data/tools-registry.ts

### 17.2. TODA TOOL NOVA DEVE TER ESTES ELEMENTOS

Ao criar uma nova ferramenta, normalmente devem ser criados ou atualizados os seguintes arquivos:

1. Registro da tool
   - arquivo: data/tools-registry.ts
   - função: cadastrar nome, slug, descrição curta, categoria, links relacionados e demais metadados estruturais

2. Conteúdo textual da tool
   - arquivo: data/content/nome-da-tool.ts
   - função: armazenar título, descrição, blocos explicativos, FAQ, exemplos e textos auxiliares

3. Lógica da ferramenta
   - arquivo: lib/nome-da-tool.ts
   - função: armazenar cálculos, transformações, parse, validações e regras puras de negócio

4. Página da ferramenta
   - arquivo: app/ferramentas/slug-da-tool/page.tsx
   - função: montar a página usando os componentes padrão do projeto e conectar a interface com a lógica

5. Metadata SEO
   - no próprio page.tsx ou no padrão adotado pelo projeto
   - função: definir title, description, canonical, open graph e demais metadados

### 17.3. FLUXO OBRIGATÓRIO PARA CRIAR UMA NOVA TOOL

Sempre seguir esta ordem:

PASSO 1:
Definir claramente:
- nome da ferramenta
- slug da rota
- keyword principal
- palavras-chave secundárias
- intenção de busca
- problema real que a tool resolve
- público-alvo

PASSO 2:
Cadastrar a nova tool no tools-registry.ts

PASSO 3:
Criar o conteúdo textual em data/content/
Esse conteúdo deve incluir:
- título principal
- descrição curta
- explicação do que a tool faz
- quando usar
- exemplos reais
- limitações
- FAQ com 3 a 5 perguntas

PASSO 4:
Criar a lógica em lib/ quando houver cálculo, transformação, parsing, validação ou regra de negócio

PASSO 5:
Criar a página em app/ferramentas/slug/page.tsx

PASSO 6:
Montar a página usando os componentes padrão do projeto, sempre que possível:
- ToolLayout
- ToolHero
- ToolContent
- ToolFaq
- RelatedTools
- AdSlotTop
- AdSlotInContent
- AdSlotFooter

PASSO 7:
Adicionar metadados SEO

PASSO 8:
Revisar mobile, performance, usabilidade e consistência visual

### 17.4. PADRÃO VISUAL E ESTRUTURAL DE CADA TOOL

Cada página de ferramenta deve seguir, em geral, esta ordem visual:

1. Breadcrumbs ou navegação discreta
2. Hero compacto da ferramenta
   - H1
   - descrição curta
   - ação principal para abrir o modo foco, quando aplicável
3. Ferramenta funcional na mesma rota, em área ampla e responsiva
4. Primeiro espaço de anúncio discreto, sem confusão com controles ou navegação
5. Conteúdo explicativo, exemplos e limitações
6. FAQ
7. Links internos leves para ferramentas relacionadas
8. Segundo espaço de anúncio discreto
9. Rodapé

O modo foco deve privilegiar a tarefa e reduzir distrações. Ao voltar, restaurar a página informativa sem exigir outra navegação. Ferramentas simples podem mostrar sua interface diretamente, sem modo foco, quando uma etapa extra não trouxer benefício real.

A página NÃO deve parecer vazia.
A página NÃO deve parecer apenas um formulário.
A página NÃO deve depender da home para fazer sentido.

### 17.5. REGRA DE REUTILIZAÇÃO

Antes de criar qualquer componente novo, verificar se já existe algo reutilizável em:

- components/ui/
- components/shared/
- components/tools/

Antes de criar lógica nova, verificar se já existe helper semelhante em:
- lib/

Antes de criar textos diretamente no page.tsx, verificar se o conteúdo deveria ficar em:
- data/content/

Evitar duplicação.
Evitar copiar e colar blocos inteiros entre ferramentas.

### 17.6. REGRA DE SEO ESTRUTURAL

Toda nova tool deve ser criada para poder rankear sozinha.

Isso significa:
- rota amigável
- metadata própria
- conteúdo original
- FAQ própria
- texto suficiente
- links internos discretos
- headings bem definidos

A home e a página /ferramentas ajudam, mas NÃO podem ser a única porta de entrada.

Cada ferramenta deve ser boa o suficiente para receber tráfego direto do Google.

### 17.7. REGRA DE ADSENSE E MONETIZAÇÃO

A estrutura da página deve prever anúncios, mas os anúncios nunca podem ser o conteúdo principal.

Toda ferramenta deve ter:
- conteúdo útil real
- contexto
- explicações
- boa experiência mobile
- aparência profissional

Os componentes de anúncio devem ser mantidos separados em components/ads/
Nunca espalhar lógica de anúncio de forma desorganizada pela página.

### 17.8. REGRA DE CONSISTÊNCIA ENTRE TOOLS

Mesmo que os assuntos sejam diferentes, todas as ferramentas devem transmitir a sensação de pertencer ao mesmo projeto.

Isso deve acontecer através de:
- tipografia consistente
- espaçamento consistente
- componentes reutilizados
- padrão de hero
- padrão de FAQ
- padrão de conteúdo
- padrão de links relacionados
- padrão de anúncios

Cada tool pode ter foco isolado, mas não deve parecer feita em outro site.

### 17.9. O QUE A IA DEVE FAZER SEMPRE AO GERAR UMA NOVA TOOL

Ao criar uma nova ferramenta, a IA deve:

- ler este documento antes de gerar qualquer código
- respeitar a arquitetura existente
- cadastrar a tool no registry
- criar conteúdo útil e original
- criar FAQ
- criar estrutura SEO-friendly
- prever área de ads
- manter consistência com as outras tools
- evitar thin content
- evitar soluções improvisadas
- evitar poluir a interface

### 17.10. O QUE A IA NÃO DEVE FAZER

A IA NÃO deve:

- criar uma página gigante e desorganizada
- colocar toda lógica dentro do page.tsx se puder separar
- repetir textos genéricos iguais em várias tools
- ignorar tools-registry
- ignorar data/content
- criar páginas sem FAQ
- criar páginas sem explicação
- inventar estrutura diferente sem necessidade
- quebrar o padrão visual do projeto
- criar rotas confusas
- focar só na tool e esquecer SEO
- focar só em SEO e esquecer UX

### 17.11. CHECKLIST ESPECÍFICO DE NOVA TOOL

Antes de finalizar uma nova ferramenta, verificar:

[ ] A tool foi adicionada no tools-registry.ts
[ ] A tool tem slug amigável
[ ] A tool tem conteúdo em data/content/
[ ] A tool tem lógica separada em lib/ quando necessário
[ ] A página foi criada em app/ferramentas/slug/page.tsx
[ ] A página usa componentes padrão do projeto
[ ] A página tem FAQ
[ ] A página tem conteúdo explicativo
[ ] A página tem links internos leves
[ ] A página tem metadata própria
[ ] A página está boa no mobile
[ ] A página não gera scroll horizontal no mobile
[ ] A página está preparada para ads
[ ] A página parece parte do mesmo site

## 18. PALAVRAS-CHAVE (KEYWORD STRATEGY)

Palavras-chave são a base do SEO.

Cada ferramenta criada DEVE ser pensada a partir de uma intenção de busca real.

### 18.1. PRINCÍPIO FUNDAMENTAL

Cada página deve responder uma pergunta ou ação específica do usuário.

A keyword não é apenas uma palavra — é uma intenção.

Exemplos:

❌ “qr code”
✔ “gerar qr code grátis”
✔ “criar qr code pix”
✔ “qr code para pagamento”

### 18.2. TIPOS DE KEYWORDS

1. Head keywords (genéricas):

* ex: “qr code”, “bitcoin”
* alta concorrência
* difícil de rankear

2. Middle keywords:

* ex: “qr code generator online”
* concorrência média

3. Long tail keywords (PRIORIDADE):

* ex: “gerar qr code pix grátis”
* ex: “converter bitcoin para real hoje”
* baixa concorrência
* alta conversão

Regra:
Sempre priorizar long tail keywords.

### 18.3. REGRA OBRIGATÓRIA

Cada tool deve ter:

* 1 keyword principal
* 3 a 5 keywords secundárias

Essas keywords devem ser definidas ANTES da criação da página.

### 18.4. ONDE USAR A KEYWORD

A keyword principal deve aparecer:

* no <title>
* no H1
* na URL (slug)
* no primeiro parágrafo
* naturalmente ao longo do conteúdo

As keywords secundárias devem aparecer de forma natural no texto.

### 18.5. PROIBIDO

* keyword stuffing (repetição forçada)
* textos artificiais
* repetir a mesma frase várias vezes
* conteúdo sem sentido só para SEO

### 18.6. SLUG (URL) OTIMIZADO

O slug deve refletir a keyword principal.

Exemplos:

✔ /gerar-qr-code-gratis
✔ /btc-para-brl
✔ /converter-usdt-real

Evitar:

✖ /tool-1
✖ /page?id=123
✖ /util123

### 18.7. INTENÇÃO DE BUSCA (CRÍTICO)

Antes de criar qualquer tool, definir:

* O usuário quer aprender?
* O usuário quer converter?
* O usuário quer gerar algo?

A página deve resolver exatamente isso.

### 18.8. MULTI IDIOMA

Cada idioma deve ter sua própria keyword:

Português:

* “gerar qr code grátis”

Inglês:

* “free qr code generator”

Espanhol:

* “generar código qr gratis”

NUNCA traduzir palavra por palavra sem adaptação.

### 18.9. ESCALA (PROGRAMMATIC SEO)

Criar variações baseadas em keywords:

* /btc-para-brl

* /btc-para-usd

* /btc-para-eur

* /qr-code-pix

* /qr-code-bitcoin

* /qr-code-wifi

Cada página deve ter conteúdo próprio e não ser duplicada.

### 18.10. CHECKLIST DE KEYWORD

Antes de criar uma nova tool:

[ ] Existe uma keyword clara?
[ ] Existe volume de busca?
[ ] A intenção está bem definida?
[ ] A URL representa a keyword?
[ ] O conteúdo responde a busca?
[ ] Existem variações naturais no texto?

Se qualquer resposta for “não”, a página não deve ser criada ainda.

## FIM DA SEÇÃO

## 19. SEO TÉCNICO (OBRIGATÓRIO)

Esta seção é técnica/interna. Não é conteúdo para o usuário final.

### 19.1. ROTA OBRIGATÓRIA: /sitemap.xml

O projeto DEVE manter a rota `sitemap.xml` ativa via App Router (`app/sitemap.ts`).

Regras:
- listar todas as páginas indexáveis
- incluir rotas institucionais
- incluir rotas de ferramentas
- incluir rotas dinâmicas de conversão (quando existirem)
- incluir versões por idioma quando aplicável
- evitar URLs duplicadas no sitemap

### 19.2. ROTA OBRIGATÓRIA: /robots.txt

O projeto DEVE manter a rota `robots.txt` ativa via App Router (`app/robots.ts`).

Regras:
- `User-agent: *`
- permitir rastreamento de páginas públicas
- bloquear apenas endpoints técnicos/internos (ex.: `/api/`)
- declarar sitemap absoluto (`https://dominio/sitemap.xml`)
- declarar `Host` canônico

### 19.3. PÁGINAS INDEXÁVEIS

Padrão obrigatório:
- páginas públicas devem sair com `index, follow`
- evitar `noindex` em páginas de ferramenta e institucionais
- canonical e hreflang devem ser consistentes quando houver multi-idioma

### 19.4. SSR / HTML RENDERIZADO

Padrão obrigatório:
- páginas de rota devem renderizar HTML no servidor (App Router)
- conteúdo principal (H1, descrição, FAQ, blocos explicativos) deve estar no HTML inicial
- componentes client-side devem ficar restritos à parte interativa da tool
- evitar páginas que dependam 100% de hidratação para mostrar conteúdo principal

### 19.5. REGRA DE COPY VISÍVEL AO CLIENTE (CRÍTICO)

Textos visíveis para usuários devem focar no produto e no benefício prático.

Permitido no copy público:
- gratuito
- sem cadastro
- rápido
- simples
- seguro/privado

Proibido no copy público:
- explicar SEO
- mencionar slug técnico
- mencionar indexação, crawl, rankeamento, tráfego orgânico
- explicar estratégia de posicionamento para buscadores

Esses temas podem existir apenas em documentação interna (como este arquivo), nunca como argumento de venda dentro da interface pública.

### 19.6. PÁGINAS IRMÃS INDEXÁVEIS (NOVO PADRÃO OBRIGATÓRIO)

Todas as ferramentas DEVEM possuir páginas irmãs com variações semânticas de busca.

Exemplos de formato:
- `/{locale}/formatar-json`
- `/{locale}/formatador-de-json`
- `/{locale}/nome-invisivel-cod-mobile`
- `/{locale}/nick-invisivel-cod`

Regras:
- as páginas irmãs devem ser rotas reais, pré-mapeadas e renderizadas no build
- não pode depender de parâmetro de query para “montar SEO” no runtime
- cada rota irmã deve responder com HTML completo (H1, intro, conteúdo e FAQ)
- cada rota irmã deve manter `index,follow`
- páginas irmãs devem compartilhar a mesma ferramenta funcional, porém com copy e keyword foco por intenção

### 19.7. PROIBIÇÃO DE GERAÇÃO SEO EM TEMPO DE REQUISIÇÃO

Para SEO, é proibido:
- criar páginas apenas em runtime sem estarem na malha de rotas estáticas
- depender de conteúdo que só existe após hidratação client-side
- deixar variações importantes fora de `generateStaticParams`

Padrão obrigatório:
- toda variação de slug deve estar listada em estruturas de dados versionadas
- toda variação deve ser resolvível no servidor sem fetch externo obrigatório
- toda variação deve aparecer no sitemap

### 19.8. MATRIZ DE COBERTURA (TOOLS x IDIOMAS x VARIAÇÕES)

Cada ferramenta deve atender os 3 eixos abaixo:
- eixo 1: rota canônica (`/{locale}/tools/{tool-slug}`)
- eixo 2: páginas irmãs de intenção (`/{locale}/{slug-variacao}`)
- eixo 3: páginas contextuais específicas (quando aplicável), como:
  - conversões (`pdf-para-jpeg`, `btc-para-satoshi`, etc.)
  - plataformas (`nome invisível` por jogo/rede social)

Regra de escala:
- gerar dezenas de combinações por ferramenta com base em keyword primária + secundárias
- priorizar variações head, middle e long-tail
- manter slug limpo, semântico e coerente com a intenção de busca

### 19.9. SITEMAP E ROBOTS COM COBERTURA TOTAL

`sitemap.xml` deve incluir, sem exceção:
- rotas institucionais
- rotas canônicas de tools
- todas as páginas irmãs de intenção
- todas as páginas de conversão/variação contextual
- todas as versões por idioma

Regras adicionais:
- deduplicar URLs finais no sitemap
- manter `robots.txt` liberando rastreamento público
- bloquear apenas endpoints técnicos (ex.: `/api/`)

### 19.10. REGRA DE CANONICAL PARA PÁGINAS IRMÃS

Para páginas irmãs programáticas:
- não forçar redirect para uma única URL da ferramenta quando o objetivo é indexar múltiplas variações
- cada página irmã deve ter canonical coerente com a própria rota servida
- manter consistência de metadados (title, description, keywords) por variação

### 19.11. CHECKLIST DE PUBLICAÇÃO SEO PROGRAMÁTICO

Antes de publicar:
- [ ] todas as variações estão em arquivos de dados (fonte única)
- [ ] todas as variações entram em `generateStaticParams`
- [ ] todas as variações aparecem em `sitemap.xml`
- [ ] todas as variações retornam HTML SSR completo
- [ ] todas as variações estão com `index,follow`
- [ ] nenhuma variação depende de geração SEO dinâmica no runtime

## 20. ANALYTICS (TRACKING DE USO E CONVERSÃO) — OBRIGATÓRIO PARA TOOLS NOVAS

O projeto usa uma camada central de analytics que envia eventos para
`window.dataLayer` (consumido depois por GTM → GA4). Toda tool nova DEVE
implementar o tracking descrito aqui. Isso não é opcional.

Infraestrutura (não recriar, só reutilizar):
- `lib/analytics/track.ts` — `trackEvent(event, params)`
- `lib/analytics/tool-ids.ts` — `TOOL_ID` (constantes) e `toToolId()`
- `lib/analytics/events.ts` — tipos dos eventos/parâmetros
- `lib/analytics/index.ts` — reexporta tudo (`import { trackEvent, TOOL_ID } from '@/lib/analytics'`)
- `components/analytics/tool-view-tracker.tsx` — já disparado automaticamente
  pelo `ToolPageShell` (evento `tool_view`). Uma tool nova que usa
  `ToolPageShell` **não precisa fazer nada** para `tool_view`.

### 20.1. PASSO OBRIGATÓRIO AO CRIAR UMA TOOL NOVA

1. Adicionar o id da tool (mesmo `id` do `tools-registry.ts`/`Cs2ToolId`/
   `FrontOnlyToolId`, só trocando `-` por `_`) em `TOOL_ID` dentro de
   `lib/analytics/tool-ids.ts`.
2. No componente client da tool (`components/tools/nome-da-tool-tool.tsx`),
   importar `trackEvent` e `TOOL_ID` de `@/lib/analytics`.
3. Analisar o fluxo real da tool (não copiar cegamente de outra) e disparar,
   quando fizerem sentido:
   - `tool_started` — quando o usuário realmente começa a usar a tool (não a
     cada tecla digitada; uma vez por fluxo/execução).
   - `tool_completed` — quando o objetivo principal foi concluído com
     sucesso (não confundir "clicou em executar" com "terminou com sucesso").
   - `tool_error` — só erros relevantes do fluxo, com `error_type`
     normalizado (nunca stack trace ou mensagem crua).
   - `result_copied` / `result_downloaded` / `result_shared` — quando existir
     ação de copiar/baixar/compartilhar o resultado.
   - Eventos específicos (`parameter_changed`, `format_selected`,
     `mode_selected`, `file_uploaded`, `generation_started`) só quando
     realmente agregarem valor analítico — não crie um evento para cada
     clique/hover/foco de UI.
4. Sempre incluir `tool: TOOL_ID.suaTool` em todo evento. Incluir `locale`
   quando o componente já receber essa prop (não criar lógica nova só para
   isso).

### 20.2. REGRAS DE NOMENCLATURA

- `snake_case` para nomes de evento e parâmetros.
- Identificador de tool é permanente e independente de idioma/tradução —
  nunca usar o título traduzido.
- Preferir parâmetros reutilizáveis entre tools (`tool`, `mode`, `format`,
  `field`, `error_type`, `action`, `method`) em vez de parâmetros
  específicos demais de uma única tool.

### 20.3. PRIVACIDADE — CRÍTICO

Nenhum dado inserido pelo usuário pode ir para o dataLayer. Isso inclui,
sem exceção: CPF/CNPJ, chave Pix ou payload Pix, endereço/hash de carteira
cripto, e-mail, telefone, nome, senha, token, conteúdo de arquivo, texto
digitado, resultado decodificado/gerado completo, IP. Envie só metadados
analíticos (tipo de resultado, formato, categoria de erro), nunca o
conteúdo em si.

### 20.4. COMPORTAMENTO

- `trackEvent` é best-effort: nunca usar `await`, nunca deixar analytics
  bloquear ou impedir uma ação (copiar, baixar, gerar, etc.).
- Tomar cuidado com Strict Mode / re-render / múltiplos cliques para não
  duplicar `tool_started`/`tool_completed` (usar `useRef`/estado para
  disparar só na transição real, não a cada render).

### 20.5. CHECKLIST DE ANALYTICS PARA NOVA TOOL

[ ] Id da tool adicionado em `lib/analytics/tool-ids.ts`
[ ] `tool_started` implementado no ponto real de início de uso
[ ] `tool_completed` implementado na conclusão real (sucesso)
[ ] `tool_error` implementado com `error_type` normalizado
[ ] Ações de copiar/baixar/compartilhar do resultado instrumentadas
[ ] Nenhum dado do usuário enviado ao dataLayer
[ ] Nenhum evento duplicado por re-render/Strict Mode/double click

## 21. PADRÃO VISUAL E CORES (OBRIGATÓRIO)

O visual das ferramentas deve seguir o design system que já existe no projeto.
Não criar paleta, tema ou estilo de componente por preferência individual.

Antes de implementar ou alterar uma interface:
- comparar com pelo menos uma ferramenta existente de fluxo ou categoria semelhante
- identificar os componentes compartilhados e os padrões de layout usados nela
- reaproveitar `Button`, `Input`, `Select`, upload e demais componentes existentes
- usar `Card` quando ele ajudar a agrupar conteúdo; não envolver automaticamente a ferramenta inteira em um card nem criar cards aninhados
- usar os tokens definidos em `tailwind.config.ts` e os estilos dos componentes em `components/ui/`

Regras de cor:
- `brand` é a cor de ação e seleção; usar seus tons já definidos em `tailwind.config.ts`
- `slate` é a escala de texto, fundo neutro e borda padrão
- cores semânticas de aviso, erro e sucesso só podem ser usadas para seus estados correspondentes e conforme exemplos existentes
- não introduzir cores de destaque, temas escuros, gradientes ou valores hex/RGB/HSL novos em uma ferramenta sem que o padrão visual existente do projeto já os use naquele contexto
- fundos escuros podem permanecer apenas em áreas de mídia ou superfícies cujo padrão existente justifique esse tratamento
- estados selecionados devem usar o tratamento existente, como `border-brand-300 bg-brand-50 text-brand-800`; controles desativados devem usar a aparência desativada do componente compartilhado
- manter contraste suficiente entre texto e fundo; não aplicar opacidade à área inteira para indicar que um fluxo ainda não começou

Regras de componentes e classes:
- preservar os estilos padrão dos componentes compartilhados; passar por `className` apenas classes adicionais sem conflito
- `lib/cn.ts` concatena classes, mas não resolve conflitos entre utilitários Tailwind; não combinar classes conflitantes como `bg-white` e `bg-slate-950`, `p-5` e `p-0`, ou `text-slate-900` e `text-white` no mesmo componente
- se um padrão visual realmente necessário ainda não existir, primeiro definir um token ou variante reutilizável no design system e documentá-lo; não improvisar o estilo em uma ferramenta isolada

Verificação visual obrigatória:
- conferir a interface em desktop e nas larguras de 375px e 320px
- confirmar que textos, labels, estados selecionados, campos, botões e mensagens de estado estão legíveis
- comparar a tela com a ferramenta de referência e corrigir diferenças de cor, espaçamento e controles antes de concluir

## FIM
