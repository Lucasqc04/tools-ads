# Auditoria de consumo — Vercel Fluid Active CPU

**Projeto:** `tools-ads` (`tools.lucasqc.com`)

**Data da auditoria:** 06/11/2026
**Escopo da auditoria original:** análise somente leitura do código local e das métricas Vercel disponíveis. Nenhum deploy, alteração de ambiente ou teste contra produção foi feito.

### Atualização pós-auditoria — 06/11/2026

Após a auditoria, foram feitas mudanças no workspace, ainda não publicadas: a rota server-side de compressão de vídeo foi removida e vídeos de até 512 MB passaram a usar FFmpeg.wasm no navegador; a rota de fallback HEIC no servidor foi removida e o conversor agora depende do suporte HEIC/HEIF do navegador; o e-mail temporário deixou de consultar mensagens automaticamente e passou a exigir atualização manual com intervalo mínimo de 10 segundos na interface. O README também passou a orientar contra polling e processamento pesado em Functions sem limites.

As seções distinguem a linha de base, a amostra de Functions das últimas 12 horas e as alterações locais ainda não publicadas. Nenhum número abaixo mede o efeito das mudanças locais. A rota `/api/ffmpeg` continua servindo recursos do FFmpeg.wasm com cache; ela não comprime nem recebe vídeos. É necessário medir novamente após o deploy para avaliar Active CPU e invocações.

**Complemento com dados de produção fornecidos após a auditoria:** no painel de ISR das últimas 12 horas, `/[locale]/[platformPageSlug]` aparece com 9,6 mil unidades de leitura (cerca de 56% das unidades exibidas), 235 unidades de escrita e 600 caminhos únicos; `/[locale]/tools/[toolAliasSlug]` aparece com 1,7 mil unidades de leitura e zero de escrita. O painel informou zero revalidações por tempo e por tag. A lista do deployment mostra 3.549 Functions, 401 Static Assets, alguns artefatos de Function com 5,1 MB e um Wasm de 21,6 MB. São dados informados pelo responsável, não observados independentemente nesta sessão.

**Checagem read-only de cache em produção (06/11/2026):** uma página conhecida de `platformPageSlug` respondeu primeiro com `x-vercel-cache: PRERENDER`; uma repetição respondeu `HIT` (idade 179 s). Isso confirma cache CDN para esse caminho amostrado, não para todas as páginas. Um slug inexistente respondeu 404, casou com `/[locale]/[platformPageSlug]` e retornou `MISS`; isso é compatível com execução sob demanda no primeiro miss, mas não mede Active CPU nem comprova que esse padrão explique os 600 caminhos únicos. Não foi feito teste de carga.

**Ação local pós-investigação:** as tools interativas dos aliases simples e do conjunto front-only agora são carregadas com `next/dynamic` no navegador (`ssr: false`) por `components/tools/platform-alias-tool-router.tsx` e `components/tools/front-only-tool-client-router.tsx`. O `ToolPageShell` continua renderizando no servidor H1, introdução, conteúdo, FAQ e metadata. O build local passou de 1,37 MB para 433 KB de First Load JS em `/[locale]/[platformPageSlug]` e de 401 KB para 160 KB em `/[locale]/tools/[toolAliasSlug]`. Os traces locais das Functions passaram de 10,41 MB/134 arquivos para 5,24 MB/78 arquivos e de 6,91 MB/82 arquivos para 2,87 MB/60 arquivos, respectivamente. São artefatos locais do build, não a medição dos pacotes publicados pela Vercel nem Active CPU; a redução esperada é menor pacote e menos SSR de tool nos misses/regenerações, sem quantificação de CPU mensal. O Wasm/ONNX permanece fora dos traces server e é asset estático do navegador.

O build atual gerou 3.458 páginas estáticas e listou home e catálogo com os quatro locales como SSG. Após a mudança, a busca não depende de query no servidor. No smoke check local, abrir `?search=bitcoin` mostrou 5 resultados; digitar `json` atualizou a URL para `?search=json` e mostrou 10 resultados sem navegação da página. Uma revisão visual anterior verificou HTML SEO e ausência de overflow em 1280, 375 e 320 px; esta mudança não altera layout. O servidor Next local retorna 404 para `/_vercel/insights/script.js` porque o script de Analytics é provisionado na Vercel; não houve outro erro no fluxo do filtro. O build passou com warnings já existentes em outras ferramentas/dependências, sem erro. As mudanças ainda não foram publicadas. `dynamicParams=true` foi mantido para preservar redirects de aliases legados; correlacionar 404s e cache antes de mudar essa política.

**Atualização com relatório de Functions fornecido em 06/11/2026:** a tabela de Production das últimas 12 horas mostra 802 invocações e aproximadamente 51,6 s de Active CPU, em sete rotas. O maior valor foi `/[locale]/[platformPageSlug]` (~19 s/82 invocações); home e catálogo somaram ~21 s/566 invocações. Preview teve zero invocações. Middleware teve cerca de 3,4 mil invocações, mas o painel Hobby não apresentou CPU utilizável. Estes dados são do relatório fornecido pelo responsável; não há ranking equivalente para os 30 dias.

**Correlação com alterações recentes:** os picos diários informados começam em 25/10; os recursos de screen sharing e transferência P2P foram introduzidos em 27–28/10, e a integração de webcam em 29/10. Há sobreposição temporal parcial, mas os picos de 25–26/10 precedem esses recursos e não há valores diários nem rotas correlacionadas. Na janela de 12 horas, as APIs de screenshare e webcam não aparecem (exceto `/api/screenshare/config`, uma chamada), portanto polling não explica o consumo observado nesse recorte. É suspeita histórica, não causa comprovada.

O deployment mais recente observado usa `b353709` (06/11, 02:30), que adicionou 17 imports de componentes de ferramentas ao catch-all `app/[locale]/[platformPageSlug]/page.tsx`. Essa rota liderou o Active CPU das últimas 12 horas. A coincidência torna o bundle/SSR de páginas não pré-geradas uma suspeita plausível para parte dos ~19 s, não para as 3h49 do mês. A divisão client-only já aplicada localmente remove essas importações do caminho server e reduziu o trace local dessa Function; medir em produção após publicar é necessário para confirmar o efeito.

Outras mudanças recentes não têm a mesma evidência de CPU server: o simulador de post/carrossel do Instagram (`11e06e1`, 05/11, +6.815 linhas) executa edição e renderização de mídia no navegador e usa uma página própria; compartilhar resultados de vídeo (`928424c`, 05/11) também é fluxo client-side. O downloader teve 119 chamadas e ~5 s de Active CPU no recorte; não há polling automático no botão de análise, que aborta uma análise anterior e fica desabilitado enquanto trabalha. Os POSTs repetidos vistos em 30 minutos podem ser usos independentes; não há evidência de duplicação do mesmo cliente.

**Ação local adicional:** home e catálogo agora não leem `searchParams` no Server Component. O filtro continua lendo/escrevendo a query string no navegador e usa `history.replaceState`, sem pedir navegação RSC ao servidor a cada digitação/filtro. O objetivo é permitir prerender/cache das páginas e remover chamadas server-side de uma interação que já é local. O painel registrou ~21 s de CPU/12 h nessas duas rotas; esse é o teto de referência (~21 min/30 dias no mesmo ritmo) caso todas as chamadas relacionadas deixem de executar. A economia real depende do cache, das visitas diretas e de revalidações; será confirmada só após publicar.

**Ação local adicional:** no fluxo `transfer`, roster agora vem junto do polling de sinais a cada 3 s (host) ou 4 s (viewer), sem a chamada separada a `/peers` ou `/participants`; sinais continuam a cada 1,2 s. Para um host e um viewer, o código reduz teoricamente cerca de 35 chamadas serverless/min (141 para 106, incluindo heartbeat), mantendo as cadências visíveis. O painel recente não mostra tráfego dessas APIs, então o efeito mensal esperado é baixo ou nulo se não houver sessões.

Esses números ajudam a priorizar cache e tamanho do deployment, mas **não medem Active CPU nem equivalem a invocações**. A Vercel define cada ISR Read/Write Unit como 8 KB de dados duráveis; aproximadamente, os valores informados representam 76,8 MB lidos na primeira rota, 13,6 MB na segunda e 1,88 MB escritos na primeira. Acertos no CDN são gratuitos; um miss no CDN pode buscar a cópia durável de ISR. Uma leitura durável, por si só, não prova que a página foi renderizada novamente. Ver [ISR Usage and Pricing](https://vercel.com/docs/incremental-static-regeneration/limits-and-pricing).

## 1. Resumo executivo

Não foi possível identificar qual rota consumiu mais Active CPU **nos últimos 30 dias**. Um relatório posterior do painel forneceu uma amostra de 12 horas por rota, mas não o histórico mensal. Nenhum endpoint pode ser declarado culpado pelo total de 30 dias com certeza.

Os dados mensais de Usage informados pelo responsável indicam 4h05 de CPU ativa para a equipe e 3h49 para `tools-ads` (aproximadamente 93,5% do total). Um relatório mais recente de Functions registra 802 invocações e ~51,6 s de Active CPU em 12 horas, com P75 geral de 110 ms e throttle P75 de 26,8%. São dados de painel fornecidos pelo solicitante, não reproduzidos independentemente nesta auditoria. Usando os valores mensais arredondados, a equipe precisa reduzir cerca de **5 minutos em 30 dias**; `tools-ads` está a aproximadamente 11 minutos da sua quota de 4h, se os demais projetos e o tráfego permanecerem iguais.

O recorte atual de 12 horas corresponde a cerca de **52 minutos por mês** se a taxa permanecer constante. O total mensal informado para `tools-ads` é 229 minutos, cerca de 4,4 vezes essa taxa recente. Portanto, o recorte não explica sozinho o pico mensal: o consumo pode ter sido maior em outros dias, e a CPU do Middleware não foi disponibilizada no painel.

O desbloqueio excepcional de 3× por 30 dias dá margem temporária para recuperar operação; ele não altera a meta estrutural de ficar abaixo das 4h do Hobby.

O painel de ISR mostra que `platformPageSlug` é a maior família de **leituras duráveis ISR** na janela, enquanto o relatório separado de Functions também a coloca em primeiro no Active CPU das últimas 12 horas (~19 s). Nenhum desses recortes indica a participação no total de 30 dias. `dynamicParams=true` permite resolução sob demanda de parâmetros não pré-gerados; os 600 caminhos únicos não informam se eram páginas conhecidas, miss de cache, 404 ou geração em runtime.

Na amostra recente, as maiores contribuições medidas foram páginas `platformPageSlug`, home e catálogo. Para a janela mensal, as hipóteses de polling em sessões P2P e processamento pesado seguem relevantes, mas sem medição histórica por rota:

1. **Página SEO catch-all:** liderou o recorte de 12 h com ~19 s/82 invocações e teve imports de 17 tools adicionados no deployment atual. O SSR/fallback em caminhos não pré-gerados é suspeito; não se sabe quanto das chamadas foram cache misses, bots ou parâmetros dinâmicos.
2. **Home e catálogo:** somaram ~21 s/566 invocações. O Server Component lia `searchParams` embora a filtragem fosse client-side e a UI chamasse `router.replace`. A query agora é mantida no histórico do navegador e não é lida pelo servidor; isso busca eliminar o trabalho de Function nessa interação.
3. **Polling P2P:** chamadas frequentes podem somar durante sessões longas; essas APIs não aparecem no recorte recente. O código de Transfer agora combina roster e sinais para reduzir uma Function a cada ciclo de roster.
4. **FFmpeg server-side e fallback HEIC:** eram operações potencialmente intensivas na linha de base, porém as rotas foram removidas do workspace e não aparecem no recorte recente. Volume/CPU anteriores não foram medidos.

Não há prova de que as páginas mais visitadas renderizem SSR a cada visita. No build local após esta mudança, home (`/[locale]`) e catálogo (`/[locale]/tools`) aparecem como SSG e listam `pt-br`, `en`, `es` e `zh`; foram geradas 3.458 páginas estáticas no total. A home e o catálogo já não leem `searchParams` no Server Component. A tabela de Functions da produção ainda mostra invocações dessas rotas, mas a conexão não informa se são cache miss, navegação RSC anterior, revalidação ou outro caminho. Confirmar comportamento depois de publicar. As rotas sob demanda identificadas no build são salas `/[locale]/share/[roomId]` e sessões de webcam `/[locale]/tools/celular-como-webcam/conectar/[sessionId]`.

**Conclusão:** a amostra de 12 horas agora identifica onde começar: a rota SEO, home e catálogo. O código foi ajustado localmente para reduzir bundles de servidor e evitar renderizações de catálogo ligadas a query; o fluxo Transfer também elimina o poll duplicado de roster. A amostra recente projeta ~52 min/mês, bem abaixo das 3h49 observadas, então os picos históricos e Middleware continuam sem explicação. Ficar abaixo de 4h é plausível — faltam cerca de 5 minutos no total da equipe —, mas precisa de comparação após publicar. Recomenda-se buscar até 3h30 por janela móvel para criar margem.

## 2. Diagnóstico do consumo atual

### O que a métrica significa

Active CPU é o tempo de CPU gasto enquanto o código executa. Esperas por rede, Redis ou outros serviços externos não são Active CPU, ainda que aumentem a duração total da requisição. Logo, duração de 12 s no extrator Open Graph ou espera no Labelary não equivale a 12 s de CPU. A documentação da Vercel define a métrica como tempo de execução ativa e exclui espera de I/O ([Fluid Compute pricing](https://vercel.com/docs/functions/usage-and-pricing)).

### Dados disponíveis

| Dado | Valor | Origem e interpretação |
|---|---:|---|
| CPU ativa da equipe | 4h05 / 4h | Informado pelo solicitante; excedente aproximado de 5 min. |
| CPU ativa de `tools-ads` | 3h49 | Informado pelo solicitante; cerca de 93% da equipe. |
| Outras aplicações | `apuracao-partido` 15m21s; `print3d-editor` 7s | Informado pelo solicitante. |
| Functions em Production | 802 invocações / ~51,6 s de Active CPU em 12h | Relatório mais recente do painel fornecido pelo solicitante; soma arredondada de sete rotas. |
| Active CPU P75 / throttle P75 | 110 ms / 26,8% | Relatório mais recente do painel; percentis não substituem CPU total. |
| Preview / Middleware | 0 Functions em Preview; ~3,4 mil invocações de Middleware Production | CPU do Middleware não estava disponível no painel Hobby; os dados de Functions não incluem sua atribuição. |
| Pageviews de produção | 7.070 | Vercel Web Analytics, aproximadamente 07/10–06/11/2026. Pageview não é invocação de Function. |
| Campo `visitors` do agregado | 5.106 | Vercel Analytics; não deve ser lido como visitantes únicos do mês, pois o identificador de visitante é rotacionado diariamente. |

### Audiência observada por rota

Agregado de Web Analytics de produção, na mesma janela aproximada de 30 dias. Ele mede navegações visíveis no navegador, não chamadas de API nem requests de bots. A Vercel informa que Web Analytics exclui tráfego automatizado ([Web Analytics](https://vercel.com/docs/analytics)).

| Rota observada | Pageviews | Leitura correta |
|---|---:|---|
| `/[locale]/[platformPageSlug]` | 3.764 | Mais pageviews. O build gera páginas estáticas para os slugs conhecidos; isso não prova 3.764 invocações serverless. |
| `/[locale]/tools/html-viewer` | 597 | Página de ferramenta; processamento principal no navegador. |
| `/[locale]/tools/[toolAliasSlug]` | 748 | Família de aliases de ferramentas, com slugs pré-gerados. |
| `/[locale]/tools/video-downloader` | 526 | Pageviews da UI; não equivale a chamadas de `/api/video-extractor`. |
| `/[locale]` | 295 | Home; status de cache/prerender precisa da validação indicada acima. |
| `/[locale]/tools` | 77 | Catálogo; status de cache/prerender precisa da validação indicada acima. |
| `/[locale]/tools/image-converter/[conversionSlug]` | 58 | Pageviews agregados da família na linha de base; não informa formato HEIC. O fallback HEIC server-side foi removido do workspace após a auditoria. O painel fornecido pelo solicitante mostra outro nome de parâmetro (`[converter]`), discrepância a confirmar. |
| `/[locale]/share/[roomId]` | 75 | Salas de compartilhamento indexadas como noindex; não informa quantos peers mantiveram conexão. |
| `/[locale]/tools/share-screen` | 38 | Entrada da ferramenta; sessões posteriores usam API e podem ser contadas separadamente. |
| `/[locale]/tools/email-temporario` | 31 | Pageviews da linha de base. No workspace atual, a atualização automática foi removida e a pessoa consulta manualmente, com intervalo mínimo de 10 s. |
| `/[locale]/tools/video-compression` | 15 | Poucos pageviews no agregado, mas não é contagem de uploads nem de chamadas FFmpeg. |
| `/[locale]/tools/open-graph-preview` | 4 | Pageviews baixos não excluem chamadas diretas ao endpoint. |

O período registrou referrers como Bing, DuckDuckGo, Reddit e Google, e tráfego em diversos países. Isso não mede bots: referrer, país e pageview não identificam crawler nem scraping. Não há evidência suficiente para bloquear crawlers legítimos.

### Acesso às métricas da Vercel

- O deployment de produção mais recente visto pela integração estava `READY` e usava o mesmo commit local `b3537090c64cb2103d2f9c0225d4a0a243b597f6` (deployment `dpl_9ipSzv8QmfnKpXFG7ivVDxT1fsym`). Isso torna a revisão do repositório representativa do código publicado naquele deployment.
- O schema de observabilidade expõe métricas de CPU de Function, contagem de invocações, duração e CPU de Middleware. A tentativa de agregar Active CPU por rota/projeto para 30 dias não retornou dados utilizáveis. A configuração consultada respondeu que Observability Plus não está habilitado; a documentação de Query descreve essa funcionalidade como dependente de plano/capacidade específica ([Vercel Query](https://vercel.com/docs/query)).
- A tentativa de consultar logs por sete dias foi recusada por retenção Hobby de uma hora. Uma consulta de contagem de logs de console em uma janela curta não retornou contagens; isso não comprova ausência de tráfego. A consulta de erros de runtime não encontrou erros na janela pedida, mas isso não mede CPU nem invocações.
- O usuário já observou lista de Functions e percentis no painel. Essas linhas de rota e percentis ajudam a localizar trabalho; sem contagem de CPU total por rota, não determinam quem compõe as 3h49. O dashboard da Vercel recomenda Insights de Functions para analisar CPU, throttling e rotas ([Observability Insights](https://vercel.com/docs/observability/insights)).

## 3. Inventário de ferramentas e rotas

O projeto usa App Router do Next.js 15.5.15, React 18 e TypeScript. A rota localizada passa pelo layout server `app/[locale]/layout.tsx`, que resolve idioma, monta cabeçalho/rodapé, JSON-LD, Google Tag Manager e Vercel Analytics. As páginas de ferramenta usam `ToolPageShell` e conteúdo/metadata da registry; o trabalho interativo fica majoritariamente em Client Components. Não encontrei uso de Server Actions (`'use server'`). Não encontrei `cookies()` ou `headers()` em páginas/layouts; o middleware lê esses dados por requisição.

O diretório `app/[locale]/tools/**` contém 71 módulos `page.tsx` (incluindo catálogo, redirecionamento e subrotas). A lista abaixo identifica os módulos e o componente interativo principal; `ToolPageShell` e o layout locale são compartilhados quando a página apresenta uma ferramenta.

| Rota sob `/[locale]/tools` | Componente/papel client | Perfil principal |
|---|---|---|
| `/` | `ToolCatalogExplorer` | Catálogo e filtros. |
| `/[toolAliasSlug]` | `renderFrontOnlyToolUi` / `Cs2GenericToolPage` | Aliases registrados; 120 slugs gerados no build; `dynamicParams=false`. |
| `/authenticator-code-generator` | `AuthenticatorCodeGeneratorTool` | TOTP/criptografia local no navegador. |
| `/base64-image-viewer` | `Base64ImageViewerTool` | Decodificação local. |
| `/bitcoin-wallet` | `BitcoinWalletTool` | Derivação/assinatura local; consultas de dados Bitcoin opcionais a provedores externos em `lib/bitcoin/mempool.ts`. |
| `/calculadora-juros-compostos` | `CompoundInterestTool` | Cálculo local. |
| `/celular-como-webcam` | `CelularComoWebcamTool` | WebRTC no navegador; API de sessão/sinalização. |
| `/celular-como-webcam/conectar/[sessionId]` | `CelularWebcamCamera` | Página de sessão dinâmica/noindex; API de sinalização/heartbeat e WebRTC peer-to-peer. |
| `/code-converter` | `CodeConverterTool` | Transformação local. |
| `/codigos-de-mira-cs2`, `/cs2-crosshair-codes` | `Cs2CrosshairCodesPage` | Conteúdo/catalogação local. |
| `/codigos-gta`, `/gta-cheat-codes` | `GtaCheatCodesPage` | Conteúdo/catalogação local. |
| `/comandos-de-practica-cs2`, `/comandos-de-treino-cs2`, `/cs2-practice-commands` | `Cs2GenericToolPage` | Conteúdo local/alias. |
| `/color-converter` | `ColorConverterTool` | Conversão local. |
| `/contador-de-caracteres` | `CharacterCounterTool` | Texto processado localmente. |
| `/conversor-universal` | `UniversalConverterTool` | Conversão local. |
| `/conversor-unix-timestamp` | `UnixTimestampConverterTool` | Conversão local; timer de relógio roda no cliente. |
| `/cpf-generator` | `CpfGeneratorTool` | Geração local; não envia CPF a servidor. |
| `/criador-de-timelapse` | `TimelapseCreatorTool` | Vídeo local com `mediabunny`/worker. |
| `/crypto-unit-converter`, `/crypto-unit-converter/[conversionSlug]` | `CryptoUnitConverterTool` | Conversão local; páginas de intenção estáticas, `dynamicParams=false` na variação. |
| `/css-generator` | `CssGeneratorTool` | Geração local. |
| `/csv-viewer` | `CsvViewerTool` | Parsing local de arquivo. |
| `/data-converter` | `DataConverterTool` | Conversão local. |
| `/descobrir-ip-publico` | `IpDiscoveryTool` | Fetch iniciado no navegador a serviços externos. |
| `/editor-etiquetas-zpl` | `ZplLabelEditorTool` | Preview chama `/api/zpl/render`, que consulta Labelary. |
| `/email-temporario` | `TempEmailTool` | `/api/tools/temp-email/{create,messages,delete}`; no workspace atual, `/messages` só é chamado após ação manual, com intervalo mínimo de 10 s. |
| `/estourador-de-audio` | `AudioBlasterTool` | Áudio local no navegador. |
| `/extrair-audio-de-video` | `AudioEditorTool` | FFmpeg.wasm local; `/api/ffmpeg` serve artefatos estáticos do runtime. |
| `/gamer-username-generator` | `GamerUsernameGeneratorTool` | Geração local. |
| `/gerador-de-slug` | `SlugGeneratorTool` | Transformação local. |
| `/gerador-de-uuid-e-nanoid` | `UuidNanoIdGeneratorTool` | Geração local com APIs do navegador. |
| `/gerador-link-whatsapp-telegram` | `WhatsAppTelegramLinkGeneratorTool` | Geração local. |
| `/gerador-pessoa-fake` | `FakePersonGeneratorTool` | Geração local/datasets locais. |
| `/html-pdf-json` | Redirect server para `/html-viewer` | Alias; sem UI própria. |
| `/html-viewer` | `HtmlViewerTool` | Preview/conversão local no navegador. |
| `/image-color-extractor` | `ImageColorExtractorTool` | Canvas no navegador. |
| `/image-compression` | `ImageCompressionTool` | `browser-image-compression` no navegador. |
| `/image-converter`, `/image-converter/[conversionSlug]` | `ImageConverterTool` | Conversão no navegador. Após a mudança local, HEIC/HEIF só funciona se o navegador conseguir decodificar; a rota de conversão server-side foi removida. Variações usam `dynamicParams=true`. |
| `/image-to-base64` | `ImageToBase64Tool` | FileReader/Canvas local. |
| `/instagram-image-optimizer` | `InstagramImageOptimizerTool` | Processamento local de imagem/Canvas. |
| `/invisible-character` | `InvisibleCharacterTool` | Texto local. |
| `/json-formatter` | `JsonFormatterTool` | Parsing/formatação local. |
| `/jwt-decoder` | `JwtDecoderTool` | Decodificação local; não valida assinatura remotamente. |
| `/keyboard-shortcuts` | `KeyboardShortcutsTool` | Conteúdo local. |
| `/lightning-decoder` | `LightningDecoderTool` | Decodificação local; possíveis consultas específicas disparadas pelo usuário. |
| `/markdown-editor` | `MarkdownEditorTool` | Editor/renderização local. |
| `/multiplication-table-quiz` | `MultiplicationTableQuizTool` | Quiz local. |
| `/nickname-symbol-generator` | `NicknameSymbolGeneratorTool` | Catálogo/generação local. |
| `/open-graph-preview` | `OpenGraphPreviewTool` | Fetch feito no servidor por `/api/tools/open-graph-preview` e proxy de assets. |
| `/password-generator` | `PasswordGeneratorTool` | Geração local. |
| `/pix-decoder` | `PixDecoderTool` | Parsing/decodificação local; não envia payload Pix a API. |
| `/qr-code-generator` | `QrCodeGeneratorTool` | Geração local no navegador. |
| `/regex-tester` | `RegexTesterTool` | Regex local no navegador. |
| `/remover-acentos` | `RemoveAccentsTool` | Transformação local. |
| `/remover-fundo-imagem` | `ChromaBackgroundRemoverTool` | Processamento local de imagem. |
| `/share-screen` | `ShareScreenTool` | `/api/screenshare/*` para signaling/Redis; mídia WebRTC é peer-to-peer. |
| `/simulador-post-instagram` | `InstagramPostSimulatorTool` | Simulação local. |
| `/sorteador` | `SorteadorTool` | Sorteio local. |
| `/symbols-to-copy` | `SymbolsToCopyTool` | Conteúdo/cópia local. |
| `/text-diff` | `TextDiffTool` | Diff de texto local. |
| `/transcricao-de-audio-e-video` | `AudioVideoTranscriptionTool` | Transformers/ONNX em worker do navegador; depende de baixar modelo no cliente. |
| `/transfer` | `TransferToolWrapper` | Compartilhamento via link com `/api/screenshare/*`; polling e WebRTC peer-to-peer. |
| `/url-encoder-decoder` | `UrlEncoderDecoderTool` | Transformação local. |
| `/video-compression` | `VideoCompressionTool` | No workspace atual, processamento com FFmpeg.wasm no navegador, sem envio dos vídeos para Function. A antiga rota server-side de FFmpeg foi removida; produção mantém a versão anterior até um deploy autorizado. |
| `/video-downloader`, `/video-downloader/[platformSlug]` | `VideoDownloaderTool` | `/api/video-extractor` consulta provedor externo; não transcodifica nem serve o arquivo de vídeo. Slugs de plataforma usam `dynamicParams=false`. |

### APIs e trabalho em servidor

| Endpoint(s) | Operação, chamadas ou dependências | CPU/volume/cache observado |
|---|---|---|
| `/api/video-compress` | **Baseline anterior:** recebia arquivo de até 512 MB e tentava até três perfis de FFmpeg. Rota removida do workspace; ainda existe no deployment atual até uma publicação. | Alto potencial por invocação na linha de base. Uploads e CPU não foram medidos. |
| `/api/convert/heic` | **Baseline anterior:** tentava `heif-convert` e depois `ffmpeg` em arquivos até 50 MB. Rota removida do workspace; ainda existe no deployment atual até uma publicação. | Alto potencial por arquivo na linha de base; volume HEIC desconhecido. |
| `/api/ffmpeg` | Lê `ffmpeg-core.js` ou `ffmpeg-core.wasm` do `node_modules` e responde com cache de um ano `immutable`. | Carga de leitura/servidor na primeira busca; resposta é cacheável no cliente/CDN. Não executa FFmpeg na Function. |
| `/api/video-extractor` | Valida URL e corpo, aplica limites locais por IP/concorrência e chama `extractVideo`/provedor; resposta contém metadados/URLs de mídia. | Parsing e validação parecem leves; espera de rede não é CPU ativa. Proteção 12/min e 6 concorrentes é por instância, não global. UI teve 526 pageviews, não são chamadas da API. |
| `/api/tools/open-graph-preview`, `/asset` | Busca URL pública validada, limita HTML a 2 MB, JSON a 1 MB e assets a limites definidos; timeout de 12 s; extrai metadados e busca manifesto. | CPU de parsing limitada; boa parte da duração é I/O. `no-store`; sem rate limit de aplicação encontrado. Página teve 4 pageviews, API pode ser chamada diretamente. |
| `/api/tools/temp-email/create`, `/messages`, `/delete` | Validação de token e operações no Redis. No workspace atual, `/messages` só é chamado após ação manual de atualizar, com intervalo mínimo de 10 s. | O volume da linha de base vinha de polling; após publicar, comparar requests agregadas. Trabalho de CPU por chamada provavelmente baixo. `no-store`. |
| `/api/screenshare/config`, `/rooms` e `/rooms/[roomId]/{close,handoff,heartbeat,join,kick-vote,leave,limits,participants,peers,screen,signals,transfer,transfer/respond}` | Sessões, autenticação/hash, limites e armazenamento/consulta Redis; rotas dinâmicas de estado. Signal GET oferece roster opcional integrado com `?roster=1`. Mídia não passa pela Function. | Polling pode multiplicar invocações; CPU por chamada desconhecida. Endpoint de configuração retorna STUN URLs/limite e é dinâmico embora o resultado derive de configuração do deployment. O helper `lib/screenshare/http.ts` aplica `no-store`; rotas de estado/no-store são corretamente dinâmicas. |
| `/api/webcam/sessions`, `/[sessionId]`, `/heartbeat`, `/ice`, `/signals` | Sessão e signaling WebRTC; câmera/áudio trafegam entre peers no navegador. | Polling em intervalos curtos; CPU por operação/volume não disponível. `force-dynamic` nas rotas de sessão. |
| `/api/zpl/render` | Valida ZPL até 3 MB e repassa a Labelary, timeout 15 s; resposta privada com cache de 5 min. | A duração pode refletir espera externa; validação é simples. O cliente usa debounce, mas frequência real não medida. Não encontrei rate limit de aplicação nessa rota. |
| `/api/webhooks/mailgun/inbound` | Verifica assinatura/HMAC, trata multipart e grava mensagem no Redis. Acionado pelo provedor de e-mail, não por polling público. | Volume desconhecido; parsing/hmac pode variar com tamanho do e-mail. Não há contagem da rota. |
| `/api/share` | Web Share Target, lê formulário e redireciona. | Operação simples. |

Não foram encontrados Server Actions. Não há evidência de que calculadoras, Pix, Bitcoin, JSON/JWT, QR, texto, conversões comuns ou a maior parte do processamento de mídia executem seu cálculo em Function. Dependências volumosas como `@ffmpeg/*`, `mediabunny`, `browser-image-compression`, `@huggingface/transformers`/ONNX, `pdfjs-dist` e `xlsx` são usadas no navegador/worker ou para servir assets; tamanho de bundle e CPU de navegador não são Active CPU da Vercel. Na linha de base, a exceção mais clara era `/api/video-compress`; ela foi removida do workspace e o deployment só deixa de executar FFmpeg server-side após publicar a versão atualizada.

## 4. Ranking das possíveis maiores consumidoras

O ranking abaixo é de **Active CPU observado nas últimas 12 horas**, Production. Não representa os 30 dias. A origem é o relatório do painel fornecido pelo responsável; valores estão arredondados.

| Rank | Ferramenta/rota | Active CPU / invocações | Evidência e leitura | Confiança |
|---:|---|---:|---|---|
| 1 | `/[locale]/[platformPageSlug]` | ~19 s / 82 | Maior contribuição na janela (~37%). O deployment `b353709` adicionou 17 imports de tools nessa rota. Código dividido localmente; os dados não dizem se as invocações foram miss, fallback, regeneração ou requests de bots. | Alta para a primeira posição nas 12h; baixa para atribuir a causa ao commit ou aos 30 dias. |
| 2 | `/[locale]` (home) | ~14 s / 313 | ~27% da CPU do recorte. O Server Component lia `searchParams` para inicializar um filtro que já opera no cliente. Alterado localmente para não depender da query no servidor. | Alta para contribuição nas 12h; média para a causa específica. |
| 3 | `/[locale]/tools` (catálogo) | ~7 s / 253 | ~14% do recorte. Mesmo padrão de busca/filtro local por query da home; alterado localmente para filtro no navegador e atualização via History API. | Alta para contribuição nas 12h; média para a causa específica. |
| 4 | `/[locale]/tools/image-converter/[conversionSlug]` | ~6 s / 32 | ~12% do recorte; conversão de imagem é client-side e a API HEIC foi removida do workspace. Invocações da página não provam execução de conversão no servidor. | Alta para CPU da rota nesta janela; baixa para causa. |
| 5 | `/api/video-extractor` | ~5 s / 119 | ~10% do recorte, ~42 ms médios. Logs de 30 min mostram POSTs repetidos, mas o cliente chama ao clicar em analisar, aborta análise anterior e não faz polling automático. Chamadas podem ser de usuários diferentes. | Alta para o total aproximado desta janela; baixa para abuso/duplicação ou contribuição mensal. |

As duas rotas restantes no painel foram `/api/webhooks/mailgun/inbound` (~370 ms/2 chamadas) e `/api/screenshare/config` (~230 ms/1 chamada).

### Suspeitas históricas que não aparecem no recorte recente

- **Transfer e screen share:** signals a cada 1,2 s, roster a cada 3/4 s e heartbeat a cada 20 s. Um host+viewer representa teoricamente ~141 requests/min na versão anterior. A janela recente não mostra requests das APIs de sessão; não há como atribuir parte dos picos mensais a esse polling. O workspace agora faz roster piggyback nos sinais, mantendo a cadência visível e removendo ~35 requests/min teóricos para uma sala com um host e um viewer.
- **Webcam:** sinais em cadência subsegundo durante conexão e ~1,8–2 s quando conectada; a janela recente não mostra `/api/webcam/*`. Os recursos entraram entre 27 e 29/10, período parcialmente coincidente com picos, mas também posterior aos picos de 25–26/10.
- **Vídeo server-side, fallback HEIC e polling de e-mail:** existiam no código anterior e foram removidos/reduzidos localmente. Não apareceram na tabela de Functions das últimas 12 horas. A CPU histórica dessas funcionalidades não foi medida.

`/api/video-extractor` pode explicar invocações/duração externa, mas aguardar o provedor não equivale a CPU ativa. Não recomendo bloquear crawlers nem atribuir os POSTs a scraping sem correlação por rota e classe de tráfego.

### Evidência de ISR por modelo de rota — 12 horas

Este é um ranking de leitura de cache durável, separado do ranking de Active CPU acima:

| Modelo de rota | Leituras ISR | Escritas ISR | Caminhos únicos | Interpretação limitada |
|---|---:|---:|---:|---|
| `/[locale]/[platformPageSlug]` | 9,6 mil unidades (~56% das exibidas) | 235 unidades | 600 | Maior volume de dados lidos do cache ISR no recorte. A métrica não informa quais slugs causaram as leituras nem se houve renderização. |
| `/[locale]/tools/[toolAliasSlug]` | 1,7 mil unidades | 0 | Não informado | Segundo modelo em leituras; zero unidades de escrita no recorte. |

As unidades são volume de dados em blocos de 8 KB, e não número de requests, caminhos ou gerações. O painel também mostrou zero revalidações por tempo ou tag. As 235 unidades de escrita não significam 235 revalidações ou 235 páginas regeneradas. A prioridade é correlacionar esses dados com cache status, invocações e Active CPU da Function.

## 5. Métricas reais disponíveis

1. **Consumo de conta/projeto:** 4h05 da equipe e 3h49 de `tools-ads` vieram de Usage para 30 dias. A amostra posterior de Functions traz 802 invocações, ~51,6 s de CPU, P75 de 110 ms e throttle de 26,8% em 12 horas; não foi usada para estimar os 30 dias.
2. **Vercel Web Analytics:** 7.070 pageviews de produção e rotas listadas acima. Isso mede navegação de navegador; não é acesso bruto, chamada API, tempo de CPU ou tráfego de bot. Analytics exclui processos automatizados conforme a documentação da Vercel.
3. **Vercel deployment:** produção recente `READY`, associada ao commit local atual. Confirma que o código revisado corresponde ao deployment observado; não confirma que não houve Preview/ambiente adicional contribuindo para quota.
4. **Vercel route CPU:** o relatório do painel fornecido pelo usuário mostra totais arredondados por rota para 12 horas (tabela acima). Agregação histórica de 30 dias por rota não está disponível no Hobby; a integração autenticada também não retornou essa consulta e informou Observability Plus desabilitado.
5. **Runtime logs:** retenção Hobby consultada é de uma hora; não há acesso retrospectivo suficiente para 30 dias. Consulta vazia de logs não representa ausência de requests.
6. **Painel de ISR, informado pelo usuário:** janela de 12 horas; 9,6 mil unidades lidas e 235 escritas em `platformPageSlug`, com 600 caminhos únicos; 1,7 mil unidades lidas e zero escritas em `toolAliasSlug`; zero revalidações por tempo/tag. O painel de ISR não forneceu CPU ativa por rota junto a esses dados.
7. **Inventário do deployment, informado pelo usuário:** 3.549 Functions, 401 Static Assets, alguns bundles de Function com 5,1 MB e um asset Wasm de 21,6 MB. É evidência de tamanho/armazenamento do deployment, não de invocações ou CPU por recurso. No build local revisado, o Wasm `ort-wasm-simd-threaded.jsep` foi emitido em `.next/static/media`; isso aponta para um asset estático do runtime de transcrição, não para execução de inferência na Function. A relação exata entre os bundles de 5,1 MB e cada rota ainda precisa ser confirmada na análise de output da Vercel.

Não se deve multiplicar P75 por invocações para produzir CPU total: o percentil não é média e não descreve a cauda. Também não se deve usar duração total como Active CPU. A Vercel mantém métricas distintas para CPU ativa e duração/recursos provisionados ([referência de cobrança](https://vercel.com/docs/functions/usage-and-pricing)).

## 6. Problemas encontrados na linha de base

### Graves para diagnóstico

- **CRÍTICO — quota ultrapassada, causa por rota desconhecida.** O excedente informado é de cerca de 5 minutos, mas falta breakdown de Active CPU por rota e de production versus Preview. Corrigir às cegas tem risco alto de não afetar o consumo.
- **ALTO na linha de base — endpoint de compressão podia executar CPU pesada por upload.** `app/api/video-compress/route.ts` usava `spawn` para FFmpeg; criava temporário, lia arquivo de até 512 MB e tentava três perfis. A rota foi removida do workspace após a auditoria; uso real e CPU histórica não foram medidos, e a versão em produção ainda precisa ser substituída.
- **ALTO na linha de base — rotas de arquivo não tinham proteção de frequência no handler.** As rotas server-side de vídeo e HEIC foram removidas do workspace; uma chamada direta a essas rotas só deixa de funcionar na produção após publicar. O extrator de vídeo ainda usa limite por instância, que serverless não compartilha globalmente; o proxy Open Graph mantém limites de tamanho/timeout e validação SSRF, mas não encontrei rate limit. É exposição potencial, não evidência de abuso.
- **MÉDIO, suspeita histórica — loops de polling geram invocações durante sessões.** `components/tools/transfer-link-room.tsx`, `components/tools/share-screen-tool.tsx`, `components/tools/celular-como-webcam-tool.tsx` e `components/tools/celular-webcam-camera.tsx` consultam sinais/estado via APIs. O código prova cadências; não prova volume de sessões. Essas APIs não aparecem na amostra recente, e espera Redis/HTTP não é CPU ativa.
- **MÉDIO na linha de base — conversão HEIC tinha fallback servidor com processos externos.** `app/api/convert/heic/route.ts` podia usar dois conversores em sequência. A rota foi removida do workspace; esse custo só deixa de existir em produção após publicar a versão atualizada.
- **MÉDIO na linha de base — polling de e-mail temporário.** `components/tools/temp-email-tool.tsx` consultava mensagens a cada 10 s quando a aba estava visível. No workspace atual a consulta é manual, com intervalo mínimo de 10 s; o impacto histórico não foi medido.
- **MÉDIO — alta leitura durável ISR em `platformPageSlug`.** O painel mostra 9,6 mil read units e 600 caminhos únicos em 12 horas, mas não expõe slug individual, cache status nem CPU da Function na mesma tabela. Isso comprova atividade de leitura ISR, não SSR repetitivo nem custo alto de Active CPU.
- **MÉDIO na linha de base — bundle da rota ampla incluía referências a tools não usadas em cada página.** Isso foi reduzido no workspace com roteadores `next/dynamic` client-only: First Load JS caiu para 433 KB em `platformPageSlug` e 160 KB em `[toolAliasSlug]`, e os traces locais também diminuíram (detalhes no complemento pós-auditoria). A economia mensal de Active CPU não está medida; páginas conhecidas são pré-renderizadas e misses ainda precisam ser correlacionados.
- **BAIXO para Active CPU — asset Wasm de transcrição.** O artefato de 21,6 MB é grande para storage/transferência inicial e merece confirmar seu carregamento e cache. O build local o emite como asset estático; o processamento de transcrição acontece no worker do navegador. Tamanho do arquivo, isoladamente, não explica CPU ativa do servidor.

### Renderização, cache, middleware e bots

- **Páginas pré-geradas:** o build local (`npm run build`, sem deploy) finalizou com sucesso e enumerou 3.458 páginas estáticas. O resumo marca `/[locale]/[platformPageSlug]`, as páginas canônicas de ferramentas, aliases e variações de intenção como SSG, salvo as rotas de sessão. A documentação do Next define `generateStaticParams` como geração antecipada; parâmetros omitidos com `dynamicParams=true` podem ser resolvidos sob demanda ([generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params), [route segment config](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config)).
- **Home e catálogo — alteração local:** o código não lê mais `searchParams` no server; o build lista `/[locale]` e `/[locale]/tools` como SSG para os quatro locales. `ToolCatalogExplorer` mantém filtros e URL no navegador. A produção ainda registra 566 invocações combinadas em 12 h; verificar após publicar se as chamadas por query param diminuem. A documentação do Next recomenda ler query no cliente quando ela só filtra dados já carregados e permite `history.replaceState` integrado ao Router ([Layouts and Pages](https://nextjs.org/docs/app/getting-started/layouts-and-pages), [Linking and Navigating](https://nextjs.org/docs/app/getting-started/linking-and-navigating)).
- **Famílias SEO:** `app/[locale]/[platformPageSlug]/page.tsx` gera muitos slugs e permite `dynamicParams=true`; o build gerou aproximadamente 1.812 páginas nessa família. A rota teve 3.764 pageviews. Slugs conhecidos são pré-gerados; requests para valores não listados podem cair no handler e em `notFound()`. Bots podem aumentar esse volume via caminhos inexistentes, mas os dados reais de request/user-agent não estão disponíveis. Não bloquear Googlebot/Bingbot; observar paths de erro e cache.
- **ISR das famílias SEO:** segundo o painel informado, `platformPageSlug` teve 9,6 mil unidades de leitura e 600 caminhos únicos em 12 horas; `toolAliasSlug` teve 1,7 mil. A primeira rota permite parâmetros não pré-gerados (`dynamicParams=true`), enquanto aliases usam `dynamicParams=false` e `generateStaticParams`. Sem a lista dos slugs e headers/cache status, não se sabe que parcela veio de páginas pré-geradas, cache misses CDN atendidos pelo cache durável, primeiras gerações sob demanda ou notFound.
- **Bundle e WASM:** na linha de base, `platformPageSlug` importava estaticamente componentes especializados. O workspace passou a encaminhar os aliases simples e front-only a roteadores client-only; os traces server locais caíram e não contêm Transformers/ONNX. A rota de transcrição cria o Worker quando a pessoa inicia a tarefa; o arquivo `ort-wasm-simd-threaded.jsep` segue em `.next/static/media` com cerca de 21 MB. Isso confirma asset do navegador, não execução de inferência na Function; confirmar o cache desse arquivo separadamente do bundle server.
- **Aliases de tool:** `[toolAliasSlug]` lista slugs no build e usa `dynamicParams=false`, portanto valor fora do conjunto deve retornar 404. São 120 páginas geradas nessa família.
- **Middleware:** `middleware.ts` casa com caminhos de página, exceto `/api`, `/_next` e caminhos que contenham ponto/extensão. Em cada navegação de página ele verifica host/locale e emite redirect apenas para host legado ou rota sem locale. Não faz fetch nem trabalho de negócio; custo provável por request é pequeno, embora possa somar em tráfego grande. Não roda nas APIs nem assets excluídos do matcher.
- **Metadata:** metadata vem de dicionários e conteúdo local, sem fetch remoto em `generateMetadata` identificado. Layout locale gera params para `pt-br`, `en`, `es`, `zh`; não há `force-dynamic`, `cookies()`/`headers()` ou `no-store` global em páginas públicas.
- **Revalidação:** `lib/analytics/vercel-tool-popularity.ts` consulta dados de popularidade com `next: { revalidate: 3600 }` quando há configuração de token; sem essa configuração, retorna um snapshot local. O fetch está sujeito ao cache/revalidação horária do Next, não a uma chamada por render. Não encontrei `revalidate` global nem revalidação curta nas páginas de ferramenta.
- **Cache:** `/api/ffmpeg` já usa cache público imutável de 1 ano; `/api/zpl/render` usa cache privado de 5 min. Endpoints de sessão, dados pessoais/temporários e processamento de arquivos usam `no-store`, apropriado para não expor dados. `/api/screenshare/config` força dynamic e herda `no-store` do helper `lib/screenshare/http.ts`, embora retorne configuração do deployment; pode aceitar cache público curto em uma resposta específica após confirmar que os valores podem ficar defasados por alguns minutos.
- **Bots:** Web Analytics não inclui automação; portanto não dá para distinguir crawlers, scraper ou hits de API sem interação. Vercel Runtime Logs da Hobby não cobrem a janela mensal. Não há prova de que crawlers legítimos causem consumo excessivo.
- **Sem evidência de loops globais:** timers de relógio, progresso, estatísticas WebRTC (`getStats`), animações e edição são `window.setInterval`/workers client-side e não geram Function por si só. São tráfego de servidor apenas quando o callback executa fetch para `/api/...`.

## 7. Correções recomendadas

| Prioridade | Ferramenta/Rota | Problema | Evidência | Impacto | Solução |
|---|---|---|---|---|---|
| P0 diagnóstico | Todas as Functions / Middleware | Usage mensal não tem breakdown por rota; CPU de Middleware também não aparece. | Functions: 12 h por rota. Usage: 30 dias só por projeto. Preview teve zero invocações; Middleware, ~3,4 mil invocações sem CPU. | **Impacto de diagnóstico alto; economia direta zero.** | Acompanhar as mesmas rotas após cada release e salvar totais por janela. Não converter P75, ISR reads ou duração em CPU. Reconsultar dashboard quando ampliar retenção/métricas. |
| P1 em andamento local | `/[locale]/[platformPageSlug]` | Maior CPU por rota no recorte e novo bundle server/client na versão publicada. | ~19 s/82 invocações (37% da CPU Functions em 12 h); `b353709` adicionou 17 imports de ferramentas nessa página. As páginas conhecidas são SSG; `dynamicParams=true` permite caminhos não pré-gerados. | **Contribuição recente comprovada; causa e participação mensal não.** | Imports de UI foram transferidos para roteadores client-only mantendo conteúdo SEO/metadata no server. Depois da publicação, correlacionar 404, cache miss, fallback e invocações; não desativar aliases sem mapear redirects legados. |
| P1 implementado localmente | `/[locale]` e `/[locale]/tools` | Filtro de busca local era enviado por `searchParams` ao Server Component, e `router.replace` podia refazer a navegação RSC a cada mudança. | ~21 s/566 invocações combinadas em 12 h; código dos dois pages aguardava query apesar da filtragem ocorrer em `ToolCatalogExplorer`. | Até ~21 min/30 dias no mesmo ritmo, se o trabalho de servidor desse recorte for eliminado; não é economia medida. | Queries de filtro agora são lidas no cliente e gravadas com `history.replaceState`; páginas deixam de depender de `searchParams` no server e podem ser pré-renderizadas. O build local confirmou SSG; comparar invocações/CPU após publicar. |
| P1 implementado localmente | `/transfer` — `/api/screenshare/rooms/[roomId]/signals`, `/peers`, `/participants` | A transferência consultava roster separadamente dos sinais. | Código: sinais a cada 1,2 s; roster a cada 3 s (host) ou 4 s (viewer); heartbeat a cada 20 s. Não aparecem chamadas das rotas de sessão no recorte de 12 h. | ~35 requests/min a menos para uma sala com um host e um viewer; economia de CPU não proporcional garantida e uso atual não medido. | `roster=1` passou a acompanhar o poll de sinais apenas na cadência original. Vídeo continua peer-to-peer; manter períodos e negociação. Medir após publicar. |
| P2 suspeita histórica | Webcam — `/api/webcam/sessions/*` | Polling pode gerar chamadas durante sessões, mas não aparece no período recente. | Intervalos de sinais ~0,85–0,9 s em espera e 1,8–2 s conectada; introdução do recurso entre 27–29/10 coincide só parcialmente com picos mensais. | Contribuição histórica possível; não mensurada. | Correlacionar com picos/dias e sessões quando houver logs; não aumentar backoff sem medir o impacto em conexão e reconexão. |
| Concluído no workspace; pendente de publicação | `/api/video-compress`, `/api/convert/heic` | Remoção local das rotas de conversão server-side; processamento de vídeo passou ao navegador e HEIC depende do decodificador do navegador. | Arquivos `route.ts` removidos; volume e CPU do baseline não foram medidos. O deployment atual mantém o código anterior até publicar. | Potencial alto por execução na linha de base; economia total desconhecida. | Publicar conforme o fluxo normal e depois confirmar que as rotas deixam de receber chamadas, verificando compatibilidade de vídeo e HEIC sem expor arquivos dos usuários. |
| P2 diagnóstico | `/[locale]/tools/[toolAliasSlug]` | Leituras duráveis sem escrita no recorte; a rota usa `dynamicParams=false`. | 1,7 mil ISR read units e zero write units em 12 h. | **Uso de cache comprovado; impacto em Active CPU não demonstrado.** | Verificar CDN hit ratio e distribuição de cache miss. Como aliases são enumerados no build, confirmar se os misses estão caindo no durable ISR cache, sem aumentar revalidação ou duplicar páginas. |
| P2 implementado localmente | `platformPageSlug` e `[toolAliasSlug]` | Imports server-side de vários Client Components aumentavam o trace e o First Load JS das rotas SEO. | Code split client-only: First Load JS local agora é 433 KB e 160 KB; traces locais são 5,24 MB/78 arquivos e 2,87 MB/60 arquivos. H1, introdução, conteúdo e FAQ seguem no HTML server. | Redução local de bundle comprovada; redução de Active CPU mensal ainda desconhecida porque a maioria dos caminhos é estática/cacheada e os misses não foram quantificados. | Após publicar, associar os tamanhos exibidos pela Vercel às rotas e medir CPU/invocações dos misses e regenerações. Manter o Wasm em asset estático cacheável e carregar worker/modelo apenas quando a transcrição começar. |
| P2 concluído no workspace; pendente de publicação | `/api/tools/temp-email/messages` | Polling automático removido; ação manual de atualizar respeita intervalo mínimo de 10 s. | `components/tools/temp-email-tool.tsx`; não há medição de volume anterior. | Reduz chamadas repetidas por caixa aberta; economia de CPU provavelmente pequena. | Após publicar, comparar requests agregadas do endpoint sem registrar token/endereço e confirmar que a ação manual continua funcionando. |
| P2 | `/api/screenshare/config` | Function dinâmica e `no-store` para resposta de configuração do deployment. | `force-dynamic`; `lib/screenshare/http.ts` define `Cache-Control: no-store, max-age=0`; resposta deriva de STUN URLs e limite de peers. | Baixo: evitar invocação repetida só ajuda se endpoint/CDN respeitar cache. | Se os valores forem públicos e puderem tolerar até 5 min de defasagem, sobrescrever o header somente nessa resposta para cache curto (sem alterar o helper compartilhado). Não cachear endpoints de sessão. |
| P2 | `/api/tools/open-graph-preview`, `/api/zpl/render`, `/api/video-extractor` | APIs podem ser chamadas diretamente; duas consultam serviços externos e podem gerar invocações sem navegação da ferramenta. | Open Graph e ZPL sem rate limit encontrado; extrator tem limites em memória por instância. Não há contagem real nem prova de abuso. | CPU provavelmente menor que os handlers FFmpeg; risco de volume/I/O externo permanece. | Medir primeiro. Se houver abuso, aplicar rate limit leve no handler com chave pseudonimizada/curta retenção e manter validação SSRF e resposta acessível a usuários legítimos. Para o extrator, não tratar o limite local atual como global. |

Não recomendo otimizar inicialmente `/api/video-extractor` com base na latência: chamadas de rede ao provedor não contam como Active CPU enquanto a Function aguarda. Também não recomendo mover Pix, Bitcoin, PDF, imagens, áudio ou vídeo para o servidor quando o código já processa localmente.

## 8. Estimativa de redução de CPU e grau de confiança

| Medida | Estimativa possível hoje | Confiança |
|---|---|---|
| Redução necessária para retornar a 4h, assumindo os números informados e o resto constante | ~5 min no total da equipe; `tools-ads` isolado está ~11 min abaixo de 4h. | Alta para a conta aritmética; valores-base arredondados/informados pelo usuário. |
| Home + catálogo | Até ~21 min/30 dias se todas as Functions que somaram ~21 s/12 h deixarem de executar. | Média como teto de referência; baixa como economia efetiva até comparar o deployment novo. |
| `platformPageSlug` code split | Nenhuma economia mensal de CPU inferível. Bundle e trace locais caíram, mas a execução cacheada/SSG não é proporcional ao tamanho do bundle. | Alta para a redução local de artefatos; baixa para Active CPU. |
| Poll de roster da Transfer | ~35 invocações/min a menos por sala com 1 host e 1 viewer na cadência medida; não converter diretamente em CPU. | Alta para conta teórica de requests; baixa para economia de CPU e uso real ausente no recorte. |
| Ritmo total de Functions nas últimas 12 h | ~52 min/30 dias se mantido; o total mensal Usage foi ~229 min. | Alta para aritmética baseada nos valores arredondados; não é previsão do consumo futuro. |
| Reduzir leituras duráveis ISR | Sem estimativa de Active CPU. O painel confirma volumes de 9,6 mil e 1,7 mil read units em 12 h, que representam dados lidos do cache durável, não renderizações. | Alta para volume ISR informado; nula para economia de CPU sem invocações/cpu correlacionadas. |
| Redução por mover compressão para cliente | Até o CPU atualmente consumido por `/api/video-compress` para uploads elegíveis; o total de uploads e o CPU por tentativa são desconhecidos. | Alta para existência do processamento server-side; baixa para redução mensal. |
| Redução com conversor HEIC local | Até o CPU de `/api/convert/heic`; quantidade de fallbacks desconhecida e dependência client-side pode aumentar bundle/memória. | Alta para código server; baixa para volume e resultado. |
| Vídeo / HEIC / e-mail | As rotas server-side de vídeo e HEIC foram removidas e o polling de e-mail virou ação manual; nenhum desses endpoints aparece nas Functions das últimas 12 h. | A existência do código custoso no baseline é comprovada; o impacto mensal anterior e a economia após publicação não são conhecidos. |

Estimativas percentuais por ferramenta seriam inventadas neste estágio. Como meta operacional após medir, reduzir no mínimo 5 min do total móvel; recomenda-se buscar **3h30 ou menos** para deixar 30 min de margem sob o limite, sem presumir que essa margem seja suficiente em picos futuros.

## 9. Riscos e impactos

- Reduzir polling pode atrasar sinalização, aprovação, reconexão ou atualização de participantes. Alterar intervalos sem medir sessões pode degradar uma função central do produto.
- Processamento local transfere custo para CPU, memória, bateria e compatibilidade do dispositivo. Nas mudanças locais não publicadas, todos os vídeos são processados no navegador e HEIC/HEIF depende do codec do navegador; informar o tempo esperado e orientar exportar JPEG quando HEIC não abrir.
- Reduzir leituras ISR pode baixar uso/custo do cache durável sem reduzir Active CPU se a resposta continuar sendo servida do cache. Separar sempre os dois indicadores.
- Apagar deployments antigos pode liberar Deployment Storage após a retenção de itens excluídos, mas não reduz leituras ISR nem CPU das rotas do deployment ativo.
- Não cachear respostas com tokens, endereços de e-mail temporário, dados de caixa, sinais de WebRTC, conteúdo de arquivo ou configuração privada. Cache de config só deve conter valores públicos e tolerar defasagem curta.
- Bloqueio amplo de crawlers prejudica SEO e não tem evidência que o justifique. Distinguir bot legítimo, request direto ao endpoint e tráfego anômalo antes de rate limit.
- Não registrar IP, token, URL submetida ao Open Graph, payload Pix, e-mail, nome de arquivo, dados de sessão ou corpo de arquivo. Para medir, usar somente rota template, método, status, ambiente, classificação de bot e duração/CPU agregadas.
- CPU de subprocessos FFmpeg é o foco de risco do endpoint; duração da chamada pode incluir leituras/gravações e espera. Confirmar no painel se e quanto o trabalho do subprocesso aparece em Active CPU; a documentação pública consultada define CPU de execução, mas não detalha separadamente contabilidade de child processes.

## 10. Plano de implementação por prioridade

1. **Manter baseline comparável:** guardar o recorte de 12 h por rota (já disponível no relatório) e o total móvel de 30 dias por projeto. Repetir depois de publicar, com Production e Preview separados; a CPU de Middleware continua sem medição utilizável no Hobby. Não inferir total a partir de P75.
2. **Resolver as leituras ISR:** extrair a lista dos 600 caminhos e comparar com `generateStaticParams`; agrupar por slug, status HTTP e cache status. Identificar miss do CDN versus leitura do cache ISR durável e comparar os grupos com invocações/CPU. Não tratar units como requests nem writes como quantidade de revalidações.
3. **Auditar o tamanho das Functions:** abrir a análise de output para associar cada artefato de 5,1 MB à rota; verificar se o worker/Transformers está no pacote server ou apenas nos assets do cliente. Confirmar quando o Wasm é requisitado e seu cache CDN.
4. **Validar endpoints após publicar:** confirmar ausência de novas chamadas a `/api/video-compress`, `/api/convert/heic` e polling automático de `/api/tools/temp-email/messages`; verificar sinais de webcam/screenshare somente se houver sessões ou CPU observável. O baseline de vídeo/HEIC não está disponível na janela de 12 h.
5. **Validar a mudança de polling:** em salas reais após publicar, conferir entrada/saída de peers, negociação e reconexão; comparar chamadas de signals/peers/participants por sessão. Não aumentar outros intervalos sem evidência de CPU ou volume.
6. **Revisar economia separadamente:** acompanhar Active CPU, invocações e ISR read/write units em janelas de 7 dias e 30 dias. Acompanhar Deployment Storage em métrica separada; exclusão de builds antigos não é uma correção para ISR Reads ou Active CPU.

## 11. Como verificar o resultado em produção

1. Registrar baseline com data/hora, ambiente, deployment e intervalo. Filtrar produção e excluir Preview na comparação. Separar Active CPU de duração/GB-hours; registrar invocações, total CPU, média por invocação, P75, throttle e erros por rota.
2. Começar pelas funções citadas no ranking. Somar CPU real da rota, não a latência. Se o painel fornecer apenas P75, pedir total de CPU ou invocações com distribuição; não converter percentil em soma.
3. Para as duas famílias ISR, registrar Read/Write Units separadamente da CPU. Obter cache status, status HTTP e caminho canônico para distinguir CDN hit, fallback ao cache durável, miss e renderização sob demanda; não interpretar as 600 URLs únicas como 600 regenerações.
4. Para tráfego automatizado, comparar request path/template, bot identificado, cache hit/miss e status. Usar amostragem baixa de logs apenas se necessário; omitir query strings e qualquer dado do usuário. Analytics não substitui logs de bot.
5. Para polling, compare chamadas de `signals`, `peers`, `participants`, `heartbeat` e webcam por janela; divida por sessões ativas apenas se houver contador sem identificador de usuário. Verifique que tráfego de mídia continua peer-to-peer.
6. Após publicar as mudanças locais, confirmar que `/api/video-compress` e `/api/convert/heic` não recebem novas chamadas. Para e-mail temporário, comparar leituras agregadas do endpoint antes/depois, sem guardar token/endereço.
7. Compare consumo diário/móvel de CPU do projeto com o baseline e a quota de 4h, incluindo outros projetos da equipe. O objetivo principal é manter o total abaixo de 4h por 30 dias, idealmente com margem; páginas vistas, ISR reads ou duração menor isoladamente não comprovam economia de Active CPU.

### Referências de código revisadas

- `middleware.ts`; `app/[locale]/layout.tsx`; `app/[locale]/page.tsx`; `app/[locale]/tools/page.tsx`.
- `app/[locale]/[platformPageSlug]/page.tsx`; `app/[locale]/tools/[toolAliasSlug]/page.tsx`; páginas de conversão de imagem, cripto e downloader.
- `components/tools/front-only-tool-router.tsx`; `components/tools/audio-video-transcription-tool.tsx`; `hooks/use-transcription.ts`; `lib/transcription/transcription-client.ts`; `lib/transcription/worker/transcription.worker.ts`; `next.config.mjs`.
- `app/api/video-compress/route.ts`; `lib/video-compression.ts`; `app/api/convert/heic/route.ts`; `lib/image-conversion.ts`.
- `components/tools/transfer-link-room.tsx`; `components/tools/share-screen-tool.tsx`; `components/tools/celular-como-webcam-tool.tsx`; `components/tools/celular-webcam-camera.tsx`.
- Rotas API em `app/api/screenshare`, `app/api/webcam`, `app/api/tools/temp-email`, `app/api/tools/open-graph-preview`, `app/api/video-extractor`, `app/api/zpl/render/route.ts` e `app/api/webhooks/mailgun/inbound/route.ts`.
