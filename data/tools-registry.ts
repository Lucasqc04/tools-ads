import {
  bitcoinWalletContentBlocks,
  bitcoinWalletFaq,
  bitcoinWalletIntro,
} from '@/data/content/bitcoin-wallet';
import {
  base64ImageViewerContentBlocks,
  base64ImageViewerFaq,
  base64ImageViewerIntro,
} from '@/data/content/base64-image-viewer';
import {
  cpfGeneratorContentBlocks,
  cpfGeneratorFaq,
  cpfGeneratorIntro,
} from '@/data/content/cpf-generator';
import {
  fakePersonGeneratorContentBlocks,
  fakePersonGeneratorFaq,
  fakePersonGeneratorIntro,
} from '@/data/content/fake-person-generator';
import {
  emailTemporarioContentBlocks,
  emailTemporarioFaq,
  emailTemporarioIntro,
} from '@/data/content/email-temporario';
import {
  cs2CrosshairCodesContentBlocks,
  cs2CrosshairCodesFaq,
  cs2CrosshairCodesIntro,
  getCs2CrosshairCodesContent,
} from '@/data/content/cs2-crosshair-codes';
import { getCs2ToolContent } from '@/data/content/cs2-tools';
import { getCs2CrosshairToolBasePathForLocale } from '@/data/cs2/crosshair-pages';
import {
  getCs2ToolBasePathForLocale,
  isCs2ToolId,
  type Cs2ToolId,
} from '@/data/cs2/tools';
import {
  gtaCheatsContentBlocks,
  gtaCheatsFaq,
  gtaCheatsIntro,
  getGtaCheatsContent,
} from '@/data/content/gta-cheat-codes';
import { getGtaToolBasePathForLocale } from '@/data/gta/gta-seo-pages';
import {
  descobrirIpPublicoContentBlocks,
  descobrirIpPublicoFaq,
  descobrirIpPublicoIntro,
} from '@/data/content/descobrir-ip-publico';
import {
  compoundInterestContentBlocks,
  compoundInterestFaq,
  compoundInterestIntro,
} from '@/data/content/compound-interest';
import {
  imageToBase64ContentBlocks,
  imageToBase64Faq,
  imageToBase64Intro,
} from '@/data/content/image-to-base64';
import {
  passwordGeneratorContentBlocks,
  passwordGeneratorFaq,
  passwordGeneratorIntro,
} from '@/data/content/password-generator';
import {
  cryptoConverterContentBlocks,
  cryptoConverterFaq,
  cryptoConverterIntro,
} from '@/data/content/crypto-unit-converter';
import {
  htmlViewerContentBlocks,
  htmlViewerFaq,
  htmlViewerIntro,
} from '@/data/content/html-viewer';
import {
  markdownEditorContentBlocks,
  markdownEditorFaq,
  markdownEditorIntro,
} from '@/data/content/markdown-editor';
import {
  imageConverterContentBlocks,
  imageConverterFaq,
  imageConverterIntro,
} from '@/data/content/image-converter';
import {
  imageCompressionContentBlocks,
  imageCompressionFaq,
  imageCompressionIntro,
} from '@/data/content/image-compression';
import {
  instagramImageOptimizerContentBlocks,
  instagramImageOptimizerFaq,
  instagramImageOptimizerIntro,
} from '@/data/content/instagram-image-optimizer';
import { getInstagramPostSimulatorContent } from '@/data/content/instagram-post-simulator';
import {
  backgroundRemoverContentBlocks,
  backgroundRemoverFaq,
  backgroundRemoverIntro,
} from '@/data/content/remover-fundo-imagem';
import {
  invisibleCharacterContentBlocks,
  invisibleCharacterFaq,
  invisibleCharacterIntro,
} from '@/data/content/invisible-character';
import { getNicknameSymbolGeneratorContent } from '@/data/content/nickname-symbol-generator';
import { getSymbolsToCopyContent } from '@/data/content/symbols-to-copy';
import { getMultiplicationTableQuizContent } from '@/data/content/multiplication-table-quiz';
import { getKeyboardShortcutsContent } from '@/data/content/keyboard-shortcuts';
import { getGamerUsernameGeneratorContent } from '@/data/content/gamer-username-generator';
import {
  videoCompressionContentBlocks,
  videoCompressionFaq,
  videoCompressionIntro,
} from '@/data/content/video-compression';
import {
  getVideoDownloaderContent,
  videoDownloaderContentBlocks,
  videoDownloaderFaq,
  videoDownloaderIntro,
} from '@/data/content/video-downloader';
import {
  audioEditorContentBlocks,
  audioEditorFaq,
  audioEditorIntro,
} from '@/data/content/audio-editor';
import {
  timelapseCreatorContentBlocks,
  timelapseCreatorFaq,
  timelapseCreatorIntro,
} from '@/data/content/timelapse-creator';
import {
  audioBlasterContentBlocks,
  audioBlasterFaq,
  audioBlasterIntro,
} from '@/data/content/audio-blaster';
import {
  audioVideoTranscriptionContentBlocks,
  audioVideoTranscriptionFaq,
  audioVideoTranscriptionIntro,
} from '@/data/content/audio-video-transcription';
import {
  jsonFormatterContentBlocks,
  jsonFormatterFaq,
  jsonFormatterIntro,
} from '@/data/content/json-formatter';
import {
  csvViewerContentBlocks,
  csvViewerFaq,
  csvViewerIntro,
} from '@/data/content/csv-viewer';
import { getZplLabelEditorContent } from '@/data/content/zpl-label-editor';
import {
  dataConverterContentBlocks,
  dataConverterFaq,
  dataConverterIntro,
  getDataConverterContent,
} from '@/data/content/data-converter';
import {
  textDiffContentBlocks,
  textDiffFaq,
  textDiffIntro,
} from '@/data/content/text-diff';
import {
  openGraphPreviewContentBlocks,
  openGraphPreviewFaq,
  openGraphPreviewIntro,
} from '@/data/content/open-graph-preview';
import {
  qrCodeGeneratorContentBlocks,
  qrCodeGeneratorFaq,
  qrCodeGeneratorIntro,
} from '@/data/content/qr-code-generator';
import {
  authenticatorCodeGeneratorContentBlocks,
  authenticatorCodeGeneratorFaq,
  authenticatorCodeGeneratorIntro,
} from '@/data/content/authenticator-code-generator';
import {
  getTransferContent,
  transferContentBlocks,
  transferFaq,
  transferIntro,
} from '@/data/content/transfer';
import { getShareScreenContent } from '@/data/content/share-screen';
import { getCelularWebcamContent } from '@/data/content/celular-como-webcam';
import {
  sorteadorContentBlocks,
  sorteadorFaq,
  sorteadorIntro,
} from '@/data/content/sorteador';
import {
  characterCounterContentBlocks,
  characterCounterFaq,
  characterCounterIntro,
  getCharacterCounterContent,
} from '@/data/content/character-counter';
import {
  getJwtDecoderContent,
  jwtDecoderContentBlocks,
  jwtDecoderFaq,
  jwtDecoderIntro,
} from '@/data/content/jwt-decoder';
import {
  getRegexTesterContent,
  regexTesterContentBlocks,
  regexTesterFaq,
  regexTesterIntro,
} from '@/data/content/regex-tester';
import {
  getUuidNanoIdContent,
  uuidNanoIdContentBlocks,
  uuidNanoIdFaq,
  uuidNanoIdIntro,
} from '@/data/content/uuid-nanoid-generator';
import {
  getUnixTimestampContent,
  unixTimestampContentBlocks,
  unixTimestampFaq,
  unixTimestampIntro,
} from '@/data/content/unix-timestamp-converter';
import {
  getUrlEncoderDecoderContent,
  urlEncoderDecoderContentBlocks,
  urlEncoderDecoderFaq,
  urlEncoderDecoderIntro,
} from '@/data/content/url-encoder-decoder';
import {
  getSlugGeneratorContent,
  slugGeneratorContentBlocks,
  slugGeneratorFaq,
  slugGeneratorIntro,
} from '@/data/content/slug-generator';
import {
  getRemoveAccentsContent,
  removeAccentsContentBlocks,
  removeAccentsFaq,
  removeAccentsIntro,
} from '@/data/content/remove-accents';
import {
  getUniversalConverterContent,
} from '@/data/content/universal-converter';
import {
  getWhatsAppTelegramLinkContent,
  whatsappTelegramLinkContentBlocks,
  whatsappTelegramLinkFaq,
  whatsappTelegramLinkIntro,
} from '@/data/content/whatsapp-telegram-link-generator';
import {
  getCssGeneratorContent,
  cssGeneratorContentBlocks,
  cssGeneratorFaq,
  cssGeneratorIntro,
} from '@/data/content/css-generator';
import {
  getColorConverterContent,
  colorConverterContentBlocks,
  colorConverterFaq,
  colorConverterIntro,
} from '@/data/content/color-converter';
import {
  getImageColorExtractorContent,
  imageColorExtractorContentBlocks,
  imageColorExtractorFaq,
  imageColorExtractorIntro,
} from '@/data/content/image-color-extractor';
import {
  getPixDecoderContent,
  pixDecoderContentBlocks,
  pixDecoderFaq,
  pixDecoderIntro,
} from '@/data/content/pix-decoder';
import {
  getLightningDecoderContent,
  lightningDecoderContentBlocks,
  lightningDecoderFaq,
  lightningDecoderIntro,
} from '@/data/content/lightning-decoder';
import {
  codeConverterContentBlocks,
  codeConverterFaq,
  codeConverterIntro,
  getCodeConverterContent,
} from '@/data/content/code-converter';
import {
  frontOnlyToolSeeds,
  getFrontOnlyToolContent,
  isFrontOnlyToolId,
} from '@/data/content/front-only-tool-suite';
import { getToolTranslation } from '@/data/i18n/tool-translations';
import { localizePath, type AppLocale } from '@/lib/i18n/config';
import type { ToolDefinition } from '@/types/tool';

const cs2ToolIds: Cs2ToolId[] = [
  'cs2-practice-commands',
  'cs2-practice-config',
  'cs2-grenade-practice-commands',
  'cs2-smoke-practice-commands',
  'cs2-bot-commands',
  'cs2-radar-settings',
  'cs2-hud-commands',
  'cs2-hud-color',
  'cs2-viewmodel-generator',
  'cs2-fps-commands',
  'cs2-autoexec-generator',
  'cs2-competitive-config',
  'cs2-tournament-safe-config',
  'cs2-fun-commands',
];

const cs2ToolRelatedById: Record<Cs2ToolId, string[]> = {
  'cs2-practice-commands': [
    'cs2-practice-config',
    'cs2-grenade-practice-commands',
    'cs2-autoexec-generator',
    'cs2-crosshair-codes',
  ],
  'cs2-practice-config': [
    'cs2-practice-commands',
    'cs2-smoke-practice-commands',
    'cs2-bot-commands',
    'cs2-autoexec-generator',
  ],
  'cs2-grenade-practice-commands': [
    'cs2-smoke-practice-commands',
    'cs2-practice-commands',
    'cs2-practice-config',
    'cs2-autoexec-generator',
  ],
  'cs2-smoke-practice-commands': [
    'cs2-grenade-practice-commands',
    'cs2-practice-config',
    'cs2-practice-commands',
    'cs2-autoexec-generator',
  ],
  'cs2-bot-commands': [
    'cs2-practice-commands',
    'cs2-practice-config',
    'cs2-fun-commands',
    'cs2-autoexec-generator',
  ],
  'cs2-radar-settings': [
    'cs2-competitive-config',
    'cs2-viewmodel-generator',
    'cs2-hud-commands',
    'cs2-crosshair-codes',
  ],
  'cs2-hud-commands': [
    'cs2-hud-color',
    'cs2-competitive-config',
    'cs2-viewmodel-generator',
    'cs2-radar-settings',
  ],
  'cs2-hud-color': [
    'cs2-hud-commands',
    'cs2-competitive-config',
    'cs2-autoexec-generator',
    'cs2-radar-settings',
  ],
  'cs2-viewmodel-generator': [
    'cs2-radar-settings',
    'cs2-hud-commands',
    'cs2-competitive-config',
    'cs2-crosshair-codes',
  ],
  'cs2-fps-commands': [
    'cs2-competitive-config',
    'cs2-autoexec-generator',
    'cs2-hud-commands',
    'cs2-viewmodel-generator',
  ],
  'cs2-autoexec-generator': [
    'cs2-practice-config',
    'cs2-competitive-config',
    'cs2-tournament-safe-config',
    'cs2-fun-commands',
  ],
  'cs2-competitive-config': [
    'cs2-tournament-safe-config',
    'cs2-radar-settings',
    'cs2-viewmodel-generator',
    'cs2-crosshair-codes',
  ],
  'cs2-tournament-safe-config': [
    'cs2-competitive-config',
    'cs2-radar-settings',
    'cs2-viewmodel-generator',
    'cs2-hud-commands',
  ],
  'cs2-fun-commands': [
    'cs2-practice-commands',
    'cs2-bot-commands',
    'cs2-practice-config',
    'cs2-autoexec-generator',
  ],
};

const buildCs2ToolDefinition = (id: Cs2ToolId): ToolDefinition => {
  const ptBrContent = getCs2ToolContent(id, 'pt-br');
  const slugEn = getCs2ToolBasePathForLocale(id, 'en').replace('/tools/', '');

  return {
    id,
    slug: slugEn,
    name: ptBrContent.name,
    shortDescription: ptBrContent.shortDescription,
    category: 'gaming',
    primaryKeyword: ptBrContent.primaryKeyword,
    secondaryKeywords: ptBrContent.secondaryKeywords,
    searchIntent: ptBrContent.searchIntent,
    seoTitle: ptBrContent.seoTitle,
    seoDescription: ptBrContent.seoDescription,
    h1: ptBrContent.h1,
    intro: ptBrContent.intro,
    canonicalPath: getCs2ToolBasePathForLocale(id, 'en'),
    canonicalPathByLocale: {
      'pt-br': getCs2ToolBasePathForLocale(id, 'pt-br'),
      en: getCs2ToolBasePathForLocale(id, 'en'),
      es: getCs2ToolBasePathForLocale(id, 'es'),
    },
    faq: ptBrContent.faq,
    contentBlocks: ptBrContent.contentBlocks,
    relatedToolIds: cs2ToolRelatedById[id],
  };
};

const cs2ToolDefinitions: ToolDefinition[] = cs2ToolIds.map((id) => buildCs2ToolDefinition(id));

const frontOnlyToolDefinitions: ToolDefinition[] = frontOnlyToolSeeds.map((tool) => {
  const ptBrContent = tool.content['pt-br'];

  return {
    id: tool.id,
    slug: tool.slug,
    name: ptBrContent.name,
    shortDescription: ptBrContent.shortDescription,
    category: tool.category,
    primaryKeyword: ptBrContent.primaryKeyword,
    secondaryKeywords: ptBrContent.secondaryKeywords,
    searchIntent: ptBrContent.searchIntent,
    seoTitle: ptBrContent.seoTitle,
    seoDescription: ptBrContent.seoDescription,
    h1: ptBrContent.h1,
    intro: ptBrContent.intro,
    canonicalPath: `/tools/${tool.slug}`,
    faq: ptBrContent.faq,
    contentBlocks: ptBrContent.contentBlocks,
    relatedToolIds: tool.relatedToolIds,
  };
});

export const toolsRegistry: ToolDefinition[] = [
  {
    id: 'bitcoin-wallet',
    slug: 'bitcoin-wallet',
    name: 'Carteira Bitcoin Testnet e Mainnet',
    shortDescription:
      'Gere carteira Bitcoin, importe seed/WIF, veja saldo e UTXOs e envie BTC em testnet ou mainnet, com a assinatura feita no navegador.',
    category: 'crypto',
    primaryKeyword: 'carteira bitcoin testnet e mainnet',
    secondaryKeywords: [
      'gerar carteira bitcoin online',
      'importar seed bitcoin',
      'importar wif bitcoin',
      'enviar bitcoin testnet',
      'enviar bitcoin mainnet',
      'wallet bitcoin no navegador',
      'bitcoin wallet tool',
      'bip39 bitcoin wallet',
      'bip84 segwit wallet',
      'mempool api bitcoin tool',
      'consultar utxos bitcoin',
      'saldo bitcoin testnet',
    ],
    searchIntent:
      'Usuários e devs que precisam criar ou importar carteira Bitcoin e enviar transações com assinatura local no navegador.',
    seoTitle:
      'Carteira Bitcoin Testnet/Mainnet | Gerar, Importar e Enviar BTC',
    seoDescription:
      'Crie carteira Bitcoin com seed BIP39, importe WIF, consulte saldo e UTXOs e envie BTC em testnet ou mainnet com assinatura local. Grátis, sem cadastro.',
    h1: 'Carteira Bitcoin Testnet e Mainnet com Envio Local de BTC',
    intro: bitcoinWalletIntro,
    canonicalPath: '/tools/bitcoin-wallet',
    faq: bitcoinWalletFaq,
    contentBlocks: bitcoinWalletContentBlocks,
    relatedToolIds: ['bitcoin-fee-calculator', 'bitcoin-address-tx-decoder', 'crypto-unit-converter'],
  },
  {
    id: 'crypto-unit-converter',
    slug: 'crypto-unit-converter',
    name: 'Conversor de Unidades Cripto',
    shortDescription:
      'Converta satoshi, gwei, wei, lamport, sun, lovelace e outras unidades on-chain grátis, sem cadastro e sem login.',
    category: 'crypto',
    primaryKeyword: 'conversor de unidades cripto gratis',
    secondaryKeywords: [
      'btc para satoshi',
      'gwei para eth',
      'wei para eth',
      'lamport para sol',
      'trx para sun',
      'conversor cripto sem cadastro',
      'conversor cripto sem login',
      'conversor de satoshi gratis',
      'conversor unidades bitcoin',
      'conversor unidades ethereum',
    ],
    searchIntent:
      'Usuários e devs que querem converter subunidades cripto com precisão, rápido, grátis e sem cadastro.',
    seoTitle:
      'Conversor de Satoshi, Gwei, Wei e Lamport Grátis | Sem Cadastro',
    seoDescription:
      'Converta unidades de BTC, ETH, USDT, USDC, SOL, TRX, XRP, ADA e mais ativos localmente no navegador, grátis, sem cadastro e sem login.',
    h1: 'Conversor de Unidades Cripto Grátis, Sem Cadastro e Sem Login',
    intro: cryptoConverterIntro,
    canonicalPath: '/tools/crypto-unit-converter',
    faq: cryptoConverterFaq,
    contentBlocks: cryptoConverterContentBlocks,
    relatedToolIds: ['bitcoin-fee-calculator', 'bitcoin-wallet', 'lightning-decoder'],
  },
  {
    id: 'html-viewer',
    slug: 'html-viewer',
    name: 'HTML Viewer com CSS e JS',
    shortDescription:
      'Visualize HTML com suporte a CSS/JS, tela cheia e multiarquivos, grátis, sem cadastro e sem login.',
    category: 'dev',
    primaryKeyword: 'html viewer online gratis',
    secondaryKeywords: [
      'visualizador html online',
      'preview html css js',
      'editor html com js',
      'testar html online',
      'html viewer sem cadastro',
      'html viewer sem login',
      'html sandbox viewer',
    ],
    searchIntent:
      'Usuários e devs que precisam renderizar HTML com CSS/JS rápido, grátis e sem login.',
    seoTitle:
      'HTML Viewer Online Grátis | CSS, JS, Tela Cheia e Sem Cadastro',
    seoDescription:
      'Cole HTML, CSS e JavaScript ou envie múltiplos arquivos para renderizar em sandbox, grátis, sem cadastro, sem login e com abertura em nova aba.',
    h1: 'HTML Viewer Grátis com CSS, JS, Tela Cheia e Sem Cadastro',
    intro: htmlViewerIntro,
    canonicalPath: '/tools/html-viewer',
    faq: htmlViewerFaq,
    contentBlocks: htmlViewerContentBlocks,
    relatedToolIds: ['json-formatter', 'image-converter'],
  },
  {
    id: 'markdown-editor',
    slug: 'markdown-editor',
    name: 'Editor e Visualizador de Markdown',
    shortDescription:
      'Edite, visualize e exporte Markdown online com upload de .md, modo tela cheia e saida em MD, HTML, PNG e PDF.',
    category: 'dev',
    primaryKeyword: 'editor markdown online gratis',
    secondaryKeywords: [
      'visualizador markdown online',
      'editor md com preview',
      'abrir arquivo markdown',
      'markdown para html online',
      'markdown exportar pdf',
      'markdown exportar imagem',
      'markdown sem cadastro',
      'markdown sem login',
      'markdown editor fullscreen',
    ],
    searchIntent:
      'Usuarios, devs e times de conteudo que precisam editar Markdown com preview imediato e exportacao em formatos diferentes sem instalar aplicativos.',
    seoTitle:
      'Editor Markdown Online Gratis | Preview, Upload .md e Exportar PDF/PNG',
    seoDescription:
      'Use o editor e visualizador de Markdown para abrir .md, editar em tela cheia, inserir titulos/listas/codigo e exportar em MD, HTML, PNG e PDF.',
    h1: 'Editor e Visualizador de Markdown Online com Preview em Tempo Real',
    intro: markdownEditorIntro,
    canonicalPath: '/tools/markdown-editor',
    faq: markdownEditorFaq,
    contentBlocks: markdownEditorContentBlocks,
    relatedToolIds: ['html-viewer', 'json-formatter', 'image-converter'],
  },
  {
    id: 'json-formatter',
    slug: 'json-formatter',
    name: 'JSON Formatter e Minifier',
    shortDescription:
      'Formate, minifique e valide JSON grátis, sem cadastro e sem login, com feedback de erro e cópia rápida.',
    category: 'dev',
    primaryKeyword: 'formatador json online gratis',
    secondaryKeywords: [
      'json minify online',
      'json pretty print',
      'validar json online',
      'formatador json sem cadastro',
      'formatador json sem login',
      'json formatter browser',
    ],
    searchIntent:
      'Desenvolvedores e analistas que precisam validar e ajustar payloads JSON rápido, grátis e sem cadastro.',
    seoTitle: 'JSON Formatter Online Grátis | Minify, Validação e Sem Cadastro',
    seoDescription:
      'Cole JSON para formatar, minificar e validar sintaxe no navegador, grátis, sem cadastro e sem login.',
    h1: 'JSON Formatter Grátis, Sem Cadastro e Sem Login',
    intro: jsonFormatterIntro,
    canonicalPath: '/tools/json-formatter',
    faq: jsonFormatterFaq,
    contentBlocks: jsonFormatterContentBlocks,
    relatedToolIds: ['html-viewer', 'image-converter'],
  },
  {
    id: 'csv-viewer',
    slug: 'csv-viewer',
    name: 'Visualizador e Conversor de CSV',
    shortDescription:
      'Cole CSV ou envie arquivo para visualizar tabela, detectar separador, ajustar delimitador e exportar XLSX.',
    category: 'dev',
    primaryKeyword: 'visualizador de csv online',
    secondaryKeywords: [
      'csv para xlsx',
      'abrir arquivo csv online',
      'detectar separador csv',
      'converter delimitador csv',
      'visualizar tabela csv',
      'csv com ponto e virgula',
      'csv com tab',
      'ferramenta csv sem cadastro',
    ],
    searchIntent:
      'Usuarios e devs que precisam abrir, validar e converter CSV em tabela rapidamente, com suporte a separadores diferentes e exportacao XLSX.',
    seoTitle: 'Visualizador de CSV Online | Detectar Separador e Exportar XLSX',
    seoDescription:
      'Cole ou envie CSV para visualizar tabela, detectar delimitador automaticamente, trocar separador e exportar em XLSX. Gratis, sem cadastro e sem login.',
    h1: 'Visualizador de CSV Online com Deteccao de Separador e Exportacao XLSX',
    intro: csvViewerIntro,
    canonicalPath: '/tools/csv-viewer',
    faq: csvViewerFaq,
    contentBlocks: csvViewerContentBlocks,
    relatedToolIds: ['json-formatter', 'conversor-universal', 'contador-de-caracteres'],
  },
  {
    id: 'zpl-label-editor',
    slug: 'editor-etiquetas-zpl',
    category: 'documents',
    ...getZplLabelEditorContent('pt-br'),
    canonicalPath: '/tools/editor-etiquetas-zpl',
    relatedToolIds: ['pdf-organizer', 'image-converter', 'csv-viewer'],
  },
  {
    id: 'data-converter',
    slug: 'data-converter',
    name: 'Conversor de JSON, SQL, XLSX, CSV e TSV',
    shortDescription:
      'Converta dados tabulares entre JSON, SQL INSERT, XLSX, CSV e TSV com colar, upload, deteccao automatica e processamento local.',
    category: 'dev',
    primaryKeyword: 'conversor json csv xlsx online',
    secondaryKeywords: [
      'converter json para csv',
      'converter csv para json',
      'xlsx para json online',
      'sql insert para csv',
      'csv para sql insert',
      'tsv para xlsx',
    ],
    searchIntent:
      'Usuarios, analistas e devs que precisam transformar dados tabulares entre formatos comuns de planilha, API e banco de dados sem instalar software.',
    seoTitle: 'Conversor JSON, CSV, XLSX, TSV e SQL Online | Sem Cadastro',
    seoDescription:
      'Cole ou envie arquivo para converter JSON, SQL INSERT, XLSX, CSV e TSV no navegador. Detecta formato automaticamente e exporta para planilha ou texto.',
    h1: 'Conversor de JSON, SQL, XLSX, CSV e TSV Online',
    intro: dataConverterIntro,
    canonicalPath: '/tools/data-converter',
    faq: dataConverterFaq,
    contentBlocks: dataConverterContentBlocks,
    relatedToolIds: ['csv-viewer', 'json-formatter', 'conversor-universal', 'html-viewer'],
  },
  {
    id: 'text-diff',
    slug: 'text-diff',
    name: 'Comparador de Textos e Diff Online',
    shortDescription:
      'Compare duas versoes de texto com diff visual, resumo executivo, metricas e modo para listas.',
    category: 'dev',
    primaryKeyword: 'comparador de textos online',
    secondaryKeywords: [
      'diff online',
      'comparar dois textos',
      'comparar contratos online',
      'comparar listas',
      'comparar codigo online',
      'comparador de diferencas de texto',
      'texto antes e depois',
      'diff por linha',
    ],
    searchIntent:
      'Usuarios, devs e times de conteudo que precisam identificar mudancas entre versoes de texto com clareza e rapidez.',
    seoTitle: 'Comparador de Textos e Diff Online | Compare Versoes com Resumo',
    seoDescription:
      'Compare dois textos online com diff por palavra, linha ou paragrafo, veja adicoes/remocoes, resumo executivo e exporte relatorio. Gratis e sem cadastro.',
    h1: 'Comparador de Textos e Diff Online para Versoes, Contratos e Conteudo',
    intro: textDiffIntro,
    canonicalPath: '/tools/text-diff',
    faq: textDiffFaq,
    contentBlocks: textDiffContentBlocks,
    relatedToolIds: ['json-formatter', 'markdown-editor', 'contador-de-caracteres', 'regex-tester'],
  },
  {
    id: 'open-graph-preview',
    slug: 'open-graph-preview',
    name: 'Open Graph Preview e Gerador de Meta Tags',
    shortDescription:
      'Informe a URL de uma página pública, veja o preview do link nas redes sociais, confira as tags OG/Twitter e copie snippets HTML e Next.js.',
    category: 'dev',
    primaryKeyword: 'open graph preview',
    secondaryKeywords: [
      'preview de link',
      'validador open graph',
      'twitter card preview',
      'gerador de meta tags',
      'preview whatsapp link',
      'meta tags nextjs',
      'open graph tester',
      'linkedin link preview',
    ],
    searchIntent:
      'Devs e profissionais de marketing que precisam validar como um link aparece em plataformas sociais antes de publicar.',
    seoTitle: 'Open Graph Preview Online | Testar Link e Copiar Meta Tags',
    seoDescription:
      'Veja como uma URL pública aparece no WhatsApp, Facebook, LinkedIn e X, confira as tags Open Graph e Twitter Card e copie meta tags HTML ou metadata Next.js.',
    h1: 'Open Graph Preview Online: Veja como seu Link Aparece nas Redes',
    intro: openGraphPreviewIntro,
    canonicalPath: '/tools/open-graph-preview',
    faq: openGraphPreviewFaq,
    contentBlocks: openGraphPreviewContentBlocks,
    relatedToolIds: ['gerador-link-whatsapp-telegram', 'html-viewer', 'url-encoder-decoder', 'dns-lookup'],
  },
  {
    id: 'cpf-generator',
    slug: 'cpf-generator',
    name: 'Criador de CPF Válido',
    shortDescription:
      'Gere CPFs de teste com dígitos verificadores corretos, com ou sem pontuação, em lotes de até 100 e com cópia rápida. Grátis e sem cadastro.',
    category: 'utility',
    primaryKeyword: 'gerador de cpf valido gratis',
    secondaryKeywords: [
      'criador de cpf válido',
      'gerar cpf para teste',
      'cpf válido com pontuação',
      'cpf válido sem pontuação',
      'gerador de cpf sem cadastro',
      'gerador de cpf sem login',
      'cpf para homologação',
      'gerar cpf em lote',
    ],
    searchIntent:
      'Usuários e devs que precisam gerar CPF válido para testes de formulário, integração e QA sem cadastro.',
    seoTitle: 'Gerador de CPF Válido Grátis | Com ou Sem Pontuação',
    seoDescription:
      'Gere CPFs válidos para testes de formulários e sistemas, com ou sem pontuação, em lote e com cópia rápida. Números sorteados, sem consulta à Receita.',
    h1: 'Gerador de CPF Válido Grátis, Sem Cadastro e Com Cópia Rápida',
    intro: cpfGeneratorIntro,
    canonicalPath: '/tools/cpf-generator',
    faq: cpfGeneratorFaq,
    contentBlocks: cpfGeneratorContentBlocks,
    relatedToolIds: ['gerador-pessoa-fake', 'gerador-cnpj', 'pix-decoder'],
  },
  {
    id: 'gerador-pessoa-fake',
    slug: 'gerador-pessoa-fake',
    name: 'Gerador de Pessoa Fake para Testes',
    shortDescription:
      'Gere perfis fictícios coerentes, com CPF válido, RG, e-mail, telefone, endereço, idade e nascimento, para desenvolvimento e QA.',
    category: 'utility',
    primaryKeyword: 'gerador de pessoa fake',
    secondaryKeywords: [
      'gerador de dados fake',
      'gerador de dados para teste',
      'fake data generator brasil',
      'gerador de identidade ficticia',
      'gerar cpf valido com nome',
      'gerador de cpf e rg',
      'gerador de usuario fake',
      'gerador de dados completos pessoa',
      'fake user generator brazil',
      'gerador de cadastro de teste',
      'dados ficticios para homologacao',
    ],
    searchIntent:
      'Devs, QAs e analistas que precisam gerar pessoas fictícias coerentes para testar formulários, APIs, bancos de dados e automações.',
    seoTitle:
      'Gerador de Pessoa Fake para Testes | CPF, RG, E-mail e Endereço',
    seoDescription:
      'Crie pessoas fictícias coerentes para testes, com CPF válido, RG, idade, nascimento, estado, cidade, DDD, CEP e exportação em JSON, CSV e SQL.',
    h1: 'Gerador de Pessoa Fake para Testes com CPF, RG e Endereço Coerente',
    intro: fakePersonGeneratorIntro,
    canonicalPath: '/tools/gerador-pessoa-fake',
    faq: fakePersonGeneratorFaq,
    contentBlocks: fakePersonGeneratorContentBlocks,
    relatedToolIds: ['cpf-generator', 'gerador-cnpj', 'json-formatter'],
  },
  {
    id: 'password-generator',
    slug: 'password-generator',
    name: 'Gerador de Senha Forte',
    shortDescription:
      'Crie senha forte com tamanho personalizado e combinação de letras, números e símbolos, grátis e sem cadastro.',
    category: 'utility',
    primaryKeyword: 'gerador de senha forte gratis',
    secondaryKeywords: [
      'gerador de senha segura online',
      'criar senha aleatoria',
      'gerar senha com simbolos',
      'senha com letras e numeros',
      'gerador de senha sem cadastro',
      'gerador de senha sem login',
      'senha forte para contas',
      'password generator online',
    ],
    searchIntent:
      'Usuários que precisam gerar senha forte rapidamente para contas pessoais, profissionais e testes de sistema.',
    seoTitle: 'Gerador de Senha Forte Grátis | Letras, Números e Símbolos',
    seoDescription:
      'Gere uma senha forte com o tamanho e os caracteres que quiser, atualizada na hora e criada no navegador. Grátis, sem cadastro e sem login.',
    h1: 'Gerador de Senha Forte Grátis, Sem Cadastro e Com Cópia Rápida',
    intro: passwordGeneratorIntro,
    canonicalPath: '/tools/password-generator',
    faq: passwordGeneratorFaq,
    contentBlocks: passwordGeneratorContentBlocks,
    relatedToolIds: ['authenticator-code-generator', 'gerador-de-uuid-e-nanoid', 'gerador-pessoa-fake'],
  },
  {
    id: 'base64-image-viewer',
    slug: 'base64-image-viewer',
    name: 'Leitor de Base64 para Imagem',
    shortDescription:
      'Cole Base64, veja a imagem na hora e baixe em varios formatos, gratis, sem cadastro e sem login.',
    category: 'dev',
    primaryKeyword: 'leitor de base64 para imagem online',
    secondaryKeywords: [
      'converter base64 em imagem',
      'visualizar base64 imagem',
      'decodificar base64 de imagem',
      'base64 para png',
      'base64 para jpeg',
      'base64 image viewer',
      'abrir base64 em imagem',
      'download de imagem base64',
    ],
    searchIntent:
      'Usuarios e devs que precisam colar Base64 e visualizar imagem imediatamente para validar e baixar em formatos diferentes.',
    seoTitle: 'Leitor de Base64 para Imagem Online | Preview e Download',
    seoDescription:
      'Cole Base64 e visualize imagem em tempo real. Baixe em varios formatos com conversao local, gratis, sem cadastro e sem login.',
    h1: 'Leitor de Base64 para Imagem Grátis com Preview Instantaneo',
    intro: base64ImageViewerIntro,
    canonicalPath: '/tools/base64-image-viewer',
    faq: base64ImageViewerFaq,
    contentBlocks: base64ImageViewerContentBlocks,
    relatedToolIds: ['image-to-base64', 'image-converter', 'html-viewer'],
  },
  {
    id: 'image-to-base64',
    slug: 'image-to-base64',
    name: 'Gerador de Base64 por Imagem',
    shortDescription:
      'Converta imagem para Base64 com preview, copia em um clique e opcao de data URL ou Base64 puro.',
    category: 'dev',
    primaryKeyword: 'gerador de base64 por imagem online',
    secondaryKeywords: [
      'imagem para base64',
      'converter imagem em base64',
      'gerar data url de imagem',
      'copiar base64 da imagem',
      'image to base64 converter',
      'jpg para base64',
      'png para base64',
      'base64 encoder imagem',
    ],
    searchIntent:
      'Usuarios e devs que precisam transformar imagem em Base64 rapidamente para usar em APIs, HTML e testes de integracao.',
    seoTitle: 'Gerador de Base64 por Imagem | Converter Imagem para Base64',
    seoDescription:
      'Envie imagem e gere Base64 automaticamente com preview, copia rapida e modo data URL. Gratis, sem cadastro e sem login.',
    h1: 'Gerador de Base64 por Imagem Grátis com Preview e Copia Rapida',
    intro: imageToBase64Intro,
    canonicalPath: '/tools/image-to-base64',
    faq: imageToBase64Faq,
    contentBlocks: imageToBase64ContentBlocks,
    relatedToolIds: ['base64-image-viewer', 'image-converter', 'json-formatter'],
  },
  {
    id: 'image-converter',
    slug: 'image-converter',
    name: 'Conversor de Imagem e PDF',
    shortDescription:
      'Converta imagens entre PNG, JPEG, WEBP e AVIF, ou entre imagem e PDF, direto no navegador e sem cadastro.',
    category: 'documents',
    primaryKeyword: 'conversor de imagem para pdf gratis',
    secondaryKeywords: [
      'png para jpeg',
      'jpg para pdf',
      'pdf para png',
      'webp para jpg',
      'heic para jpg',
      'tiff para png',
      'avif para png',
      'svg para png',
      'psd para png',
      'conversor de formatos de imagem',
      'conversor de imagem sem cadastro',
      'conversor pdf sem login',
      'converter pdf para imagem online',
    ],
    searchIntent:
      'Usuários que precisam converter arquivos visuais entre formatos de imagem e PDF rápido, grátis e sem cadastro.',
    seoTitle:
      'Conversor de Imagem e PDF Grátis | PNG, JPEG, WEBP e AVIF',
    seoDescription:
      'Converta imagem para PNG, JPEG, WEBP ou AVIF, imagem para PDF e PDF para imagem no navegador, sem cadastro. Escolha a qualidade e baixe na hora.',
    h1: 'Conversor de Imagem e PDF Grátis, sem Cadastro',
    intro: imageConverterIntro,
    canonicalPath: '/tools/image-converter',
    faq: imageConverterFaq,
    contentBlocks: imageConverterContentBlocks,
    relatedToolIds: ['image-compression', 'redimensionar-imagem', 'pdf-organizer', 'image-to-base64'],
  },
  {
    id: 'image-compression',
    slug: 'image-compression',
    name: 'Compressor de Imagem em Lote',
    shortDescription:
      'Comprima várias imagens de uma vez, ajuste o nível de compressão e compare o antes e o depois antes de baixar.',
    category: 'documents',
    primaryKeyword: 'comprimir imagem online gratis',
    secondaryKeywords: [
      'compressor de imagem online',
      'reduzir tamanho de imagem',
      'comprimir foto sem perder muita qualidade',
      'compressao de imagem em lote',
      'jpeg compressor online',
      'webp compressor online',
      'reduzir kb da imagem',
      'otimizar imagem para site',
      'compressor de imagem sem cadastro',
      'compressor de imagem sem login',
    ],
    searchIntent:
      'Usuários que precisam reduzir o tamanho de imagens com controle de compressão e prévia antes do download.',
    seoTitle:
      'Compressor de Imagem Online Grátis em Lote | Reduzir Tamanho',
    seoDescription:
      'Comprima várias imagens de uma vez, escolha o nível de compressão e compare antes e depois. Grátis, sem cadastro e direto no navegador.',
    h1: 'Compressor de Imagem em Lote Grátis, com Prévia do Resultado',
    intro: imageCompressionIntro,
    canonicalPath: '/tools/image-compression',
    faq: imageCompressionFaq,
    contentBlocks: imageCompressionContentBlocks,
    relatedToolIds: ['image-converter', 'redimensionar-imagem', 'exif-viewer', 'video-compression'],
  },
  {
    id: 'instagram-image-optimizer',
    slug: 'instagram-image-optimizer',
    name: 'Otimizador de Imagem para Instagram',
    shortDescription:
      'Prepare fotos para Feed, Carrossel, Story ou capa de Reel com corte ajustável, comparação e download em lote.',
    category: 'documents',
    primaryKeyword: 'otimizar imagem para instagram',
    secondaryKeywords: [
      'redimensionar foto para instagram',
      'tamanho de imagem para instagram',
      'cortar foto para story instagram',
      'preparar imagem para carrossel instagram',
      'imagem 3:4 para instagram',
    ],
    searchIntent:
      'Pessoas que precisam ajustar o enquadramento e as dimensões de fotos para publicações do Instagram antes de baixar e publicar manualmente.',
    seoTitle:
      'Otimizador de Imagem para Instagram | Corte, Feed e Story',
    seoDescription:
      'Ajuste fotos para Feed, Carrossel, Story e capa de Reel. Reposicione o corte, compare antes e depois e baixe imagens processadas no navegador.',
    h1: 'Otimizador de Imagem para Instagram com Corte e Preview',
    intro: instagramImageOptimizerIntro,
    canonicalPath: '/tools/instagram-image-optimizer',
    faq: instagramImageOptimizerFaq,
    contentBlocks: instagramImageOptimizerContentBlocks,
    relatedToolIds: ['image-compression', 'image-converter', 'redimensionar-imagem'],
  },
  {
    id: 'instagram-post-simulator',
    slug: 'simulador-post-instagram',
    ...getInstagramPostSimulatorContent('pt-br'),
    category: 'documents',
    canonicalPath: '/tools/simulador-post-instagram',
    relatedToolIds: ['instagram-image-optimizer', 'image-compression', 'video-compression'],
  },
  {
    id: 'remover-fundo-imagem',
    slug: 'remover-fundo-imagem',
    name: 'Removedor de Fundo de Imagem por Chroma Key',
    shortDescription:
      'Remova fundo verde, magenta, branco ou cor manual de imagens e baixe PNG transparente no tamanho original.',
    category: 'documents',
    primaryKeyword: 'remover fundo de imagem chroma key',
    secondaryKeywords: [
      'remover fundo verde de imagem',
      'remover fundo magenta de imagem',
      'remover fundo branco de imagem',
      'chroma key online',
      'imagem png transparente',
      'remover background de foto',
      'recorte chroma key gratis',
      'remover fundo sem perder qualidade',
      'transparent background png',
      'removedor de fundo online sem cadastro',
    ],
    searchIntent:
      'Usuários que precisam remover o fundo chroma de uma imagem e baixar PNG transparente sem reduzir a resolução.',
    seoTitle:
      'Remover Fundo de Imagem Chroma Key Online | PNG Transparente',
    seoDescription:
      'Remova fundo verde, magenta, branco ou manual de imagens, compare 3 recortes e baixe PNG transparente no tamanho original.',
    h1: 'Remover Fundo de Imagem por Chroma Key e Baixar PNG Transparente',
    intro: backgroundRemoverIntro,
    canonicalPath: '/tools/remover-fundo-imagem',
    faq: backgroundRemoverFaq,
    contentBlocks: backgroundRemoverContentBlocks,
    relatedToolIds: ['image-converter', 'image-compression', 'redimensionar-imagem', 'image-color-extractor'],
  },
  {
    id: 'video-compression',
    slug: 'video-compression',
    name: 'Compressor de Vídeo Online',
    shortDescription:
      'Comprima vídeos em lote, ajuste o nível de compressão e compare o resultado em MP4 antes de baixar.',
    category: 'documents',
    primaryKeyword: 'comprimir video online gratis',
    secondaryKeywords: [
      'compressor de video online',
      'reduzir tamanho de video',
      'comprimir mp4 online',
      'reduzir mb de video',
      'compressao de video em lote',
      'compressor de video rapido',
      'otimizar video para upload',
      'comprimir video sem cadastro',
      'comprimir video sem login',
      'diminuir tamanho do video para whatsapp',
    ],
    searchIntent:
      'Usuários que querem reduzir o tamanho de vídeos com controle de compressão e prévia antes do download.',
    seoTitle:
      'Compressor de Vídeo Online Grátis | Reduzir Tamanho de MP4',
    seoDescription:
      'Comprima vídeos de até 10 GB, escolha o nível de compressão e compare antes e depois. Grátis, sem cadastro. Acima de 512 MB, tudo no seu aparelho.',
    h1: 'Compressor de Vídeo Online Grátis, com Prévia antes de Baixar',
    intro: videoCompressionIntro,
    canonicalPath: '/tools/video-compression',
    faq: videoCompressionFaq,
    contentBlocks: videoCompressionContentBlocks,
    relatedToolIds: ['extrair-audio-de-video', 'timelapse-creator', 'transcricao-de-audio-e-video'],
  },
  {
    id: 'video-downloader',
    slug: 'video-downloader',
    name: 'Baixar Vídeos do X e Mídia do Pinterest',
    shortDescription:
      'Cole um link público do X ou um pin do Pinterest para abrir e salvar vídeos e imagens no celular ou computador, sem cadastro.',
    category: 'utility',
    primaryKeyword: 'baixar vídeo online grátis',
    secondaryKeywords: [
      'baixar vídeo pelo link',
      'baixador de vídeos online',
      'salvar vídeo do twitter e pinterest',
      'baixar vídeo sem aplicativo',
      'extrair áudio mp3 de vídeo',
      'baixar imagem do pinterest',
    ],
    searchIntent:
      'Pessoas que querem salvar um vídeo público do X ou uma imagem ou vídeo de um pin público do Pinterest.',
    seoTitle: 'Baixar Vídeos do X e Pinterest e Imagens de Pins',
    seoDescription:
      'Cole um link público do X ou Pinterest para abrir vídeos e imagens no navegador. Grátis, sem cadastro e sem instalar nada.',
    h1: 'Baixar Vídeos do X e Pinterest e Imagens de Pins',
    intro: videoDownloaderIntro,
    canonicalPath: '/tools/video-downloader',
    faq: videoDownloaderFaq,
    contentBlocks: videoDownloaderContentBlocks,
    relatedToolIds: ['video-compression', 'extrair-audio-de-video', 'image-converter', 'transcricao-de-audio-e-video'],
  },
  {
    id: 'extrair-audio-de-video',
    slug: 'extrair-audio-de-video',
    name: 'Editor de Áudio e Extrator de Áudio de Vídeo',
    shortDescription:
      'Extraia o áudio de vídeos, abra áudios ou links diretos, corte pela forma de onda e baixe cada trecho em MP3, WAV, M4A, OGG ou WEBM.',
    category: 'documents',
    primaryKeyword: 'extrair audio de video online gratis',
    secondaryKeywords: [
      'editor de audio online',
      'cortar audio online',
      'extrair mp3 de video',
      'separar audio de video',
      'waveform editor online',
      'baixar audio de video em mp3',
      'recortar mp3 online',
      'editor de audio sem cadastro',
      'extrair som de video para jogo',
      'importar audio por url',
      'audio cutter online',
    ],
    searchIntent:
      'Usuários que precisam extrair sons específicos de vídeos ou áudios, recortar pela onda sonora e baixar trechos separados sem instalar um editor pesado.',
    seoTitle:
      'Extrair Áudio de Vídeo Online Grátis | Cortar e Baixar em MP3',
    seoDescription:
      'Extraia o áudio de um vídeo, corte trechos na forma de onda e baixe em MP3, WAV, M4A, OGG ou WEBM. Grátis, sem cadastro e direto no navegador.',
    h1: 'Extrair Áudio de Vídeo Online e Cortar Trechos pela Forma de Onda',
    intro: audioEditorIntro,
    canonicalPath: '/tools/extrair-audio-de-video',
    faq: audioEditorFaq,
    contentBlocks: audioEditorContentBlocks,
    relatedToolIds: [
      'transcricao-de-audio-e-video',
      'audio-blaster',
      'video-compression',
    ],
  },
  {
    id: 'timelapse-creator',
    slug: 'criador-de-timelapse',
    name: 'Criador de Timelapse Online',
    shortDescription:
      'Transforme vídeos longos em timelapses, acelere ou desacelere cada trecho e exporte MP4 ou WebM no navegador.',
    category: 'documents',
    primaryKeyword: 'criador de timelapse online gratis',
    secondaryKeywords: [
      'acelerar video online',
      'transformar video em timelapse',
      'mudar velocidade do video por trecho',
      'desacelerar parte do video',
      'editor de velocidade de video online',
    ],
    searchIntent:
      'Pessoas que querem transformar gravações longas em timelapses ou ajustar a velocidade de partes específicas de um vídeo.',
    seoTitle: 'Criador de Timelapse Online | Ajuste a Velocidade por Trecho',
    seoDescription:
      'Crie timelapse com vídeos longos, divida a linha do tempo, acelere ou desacelere trechos e exporte MP4 ou WebM direto no navegador.',
    h1: 'Crie um Timelapse e Ajuste a Velocidade de Cada Trecho',
    intro: timelapseCreatorIntro,
    canonicalPath: '/tools/criador-de-timelapse',
    faq: timelapseCreatorFaq,
    contentBlocks: timelapseCreatorContentBlocks,
    relatedToolIds: ['video-compression', 'extrair-audio-de-video', 'transcricao-de-audio-e-video'],
  },
  {
    id: 'audio-blaster',
    slug: 'estourador-de-audio',
    name: 'Estourador de Áudio Online',
    shortDescription:
      'Envie um áudio ou grave pelo microfone, aplique clipping, saturação, foldback, bitcrush ou efeito de rádio e ouça antes de baixar.',
    category: 'documents',
    primaryKeyword: 'estourar audio online para meme',
    secondaryKeywords: [
      'distorcer audio online',
      'audio estourado para meme',
      'efeito clipping de audio',
      'bitcrush de audio online',
      'efeito de voz de radio online',
    ],
    searchIntent:
      'Pessoas que querem saturar ou distorcer intencionalmente uma fala, efeito ou música curta para criar memes e efeitos cômicos.',
    seoTitle: 'Estourador de Áudio Online | Clipping, Bitcrush e Rádio',
    seoDescription:
      'Envie ou grave áudio no navegador, aplique clipping, drive, foldback, bitcrush ou efeito de rádio e exporte WAV ou MP3 localmente.',
    h1: 'Estoure Áudio para Memes com Clipping e Bitcrush',
    intro: audioBlasterIntro,
    canonicalPath: '/tools/estourador-de-audio',
    faq: audioBlasterFaq,
    contentBlocks: audioBlasterContentBlocks,
    relatedToolIds: ['extrair-audio-de-video', 'transcricao-de-audio-e-video'],
  },
  {
    id: 'transcricao-de-audio-e-video',
    slug: 'transcricao-de-audio-e-video',
    name: 'Transcrição de Áudio e Vídeo para Texto',
    shortDescription:
      'Transcreva áudio e vídeo, revise trechos com timestamp e gere um vídeo com legendas personalizadas direto no navegador.',
    category: 'documents',
    primaryKeyword: 'transcrever audio e video para texto',
    secondaryKeywords: [
      'audio para texto online',
      'video para texto online',
      'transcricao automatica de audio',
      'gerar legenda srt automatica',
      'whisper no navegador',
      'transcrever video para texto gratis',
      'converter audio em texto',
      'legendar video online',
      'adicionar legenda ao video',
      'gerar video com legenda embutida',
      'editar legenda com timestamp',
      'transcricao offline no navegador',
      'audio to text sem upload',
    ],
    searchIntent:
      'Usuários que precisam transcrever reuniões, aulas, entrevistas ou vídeos, corrigir os trechos reconhecidos e exportar um vídeo com legendas sem enviar a mídia para servidores externos.',
    seoTitle: 'Transcrição de Áudio e Vídeo com Legendas Personalizadas',
    seoDescription:
      'Transcreva áudio e vídeo no navegador, corrija os trechos e gere um vídeo com legendas ajustáveis. Exporte SRT ou VTT sem enviar sua mídia.',
    h1: 'Transcreva Áudio e Vídeo e Gere Legendas Online',
    intro: audioVideoTranscriptionIntro,
    canonicalPath: '/tools/transcricao-de-audio-e-video',
    faq: audioVideoTranscriptionFaq,
    contentBlocks: audioVideoTranscriptionContentBlocks,
    relatedToolIds: ['extrair-audio-de-video', 'video-compression', 'markdown-editor'],
  },
  {
    id: 'qr-code-generator',
    slug: 'qr-code-generator',
    name: 'Gerador de QR Code com Logo',
    shortDescription:
      'Crie QR Code grátis a partir de texto ou URL, sem cadastro, com logo e download em vários formatos.',
    category: 'utility',
    primaryKeyword: 'gerador de qr code gratis sem cadastro',
    secondaryKeywords: [
      'gerador de qr code gratis',
      'gerar qr code sem cadastro',
      'qr code sem login',
      'qr code com logo',
      'gerar qr code online',
      'gerador de qr code ilimitado',
      'qr code png',
      'qr code em pdf',
      'qr code personalizado',
    ],
    searchIntent:
      'Usuários que querem gerar QR Code rápido, grátis, sem cadastro, sem login, personalizar visual e baixar imagem.',
    seoTitle: 'Gerador de QR Code Grátis, sem Cadastro | PNG, SVG e PDF',
    seoDescription:
      'Gere QR Code grátis e sem cadastro a partir de texto, link ou Pix. Personalize as cores, coloque um logo no centro e baixe em PNG, JPEG, WEBP, SVG ou PDF.',
    h1: 'Gerador de QR Code Grátis, sem Cadastro e com Logo',
    intro: qrCodeGeneratorIntro,
    canonicalPath: '/tools/qr-code-generator',
    faq: qrCodeGeneratorFaq,
    contentBlocks: qrCodeGeneratorContentBlocks,
    relatedToolIds: ['qr-code-wifi-vcard-evento', 'qr-code-scanner', 'gerador-link-whatsapp-telegram', 'image-converter'],
  },
  {
    id: 'authenticator-code-generator',
    slug: 'authenticator-code-generator',
    name: 'Gerador de Código Authenticator para Testes',
    shortDescription:
      'Leia QR Code ou cole chave Base32/otpauth para gerar códigos TOTP localmente, acompanhar a expiração e copiar com um toque.',
    category: 'dev',
    primaryKeyword: 'gerador de codigo authenticator para testes',
    secondaryKeywords: [
      'gerar codigo totp online',
      'ler qr code authenticator',
      'colar chave base32 authenticator',
      'gerador de codigo 2fa para qa',
      'codigo google authenticator para teste',
      'otpauth totp generator',
      'testar codigo de dois fatores',
    ],
    searchIntent:
      'Desenvolvedores e equipes de QA que precisam validar fluxo TOTP com QR Code, chave Base32 ou link otpauth sem cadastrar uma conta de teste em um aplicativo autenticador.',
    seoTitle: 'Gerador de Código Authenticator para Testes | TOTP, QR e Base32',
    seoDescription:
      'Leia QR Code de authenticator ou cole chave Base32/otpauth para gerar código TOTP no navegador, ver expiração, copiar e salvar apenas para testes locais.',
    h1: 'Gerador de Código Authenticator para Testes com QR Code e TOTP',
    intro: authenticatorCodeGeneratorIntro,
    canonicalPath: '/tools/authenticator-code-generator',
    faq: authenticatorCodeGeneratorFaq,
    contentBlocks: authenticatorCodeGeneratorContentBlocks,
    relatedToolIds: ['qr-code-scanner', 'password-generator', 'jwt-decoder', 'email-temporario'],
  },
  ...frontOnlyToolDefinitions,
  {
    id: 'transfer',
    slug: 'transfer',
    name: 'Transferência Entre Dispositivos',
    shortDescription:
      'Passe links, textos curtos, Pix e JSON do celular para o PC por QR Code, ou crie uma sala por link para enviar arquivos direto entre os navegadores.',
    category: 'utility',
    primaryKeyword: 'transferir arquivo entre celular e pc por qr code',
    secondaryKeywords: [
      'transferir texto por qr code',
      'transferência entre dispositivos no navegador',
      'enviar arquivo de celular para pc sem cabo',
      'webrtc datachannel transferência',
      'copiar link do celular para pc',
      'pix por qr code entre dispositivos',
      'transferir json entre dispositivos',
      'transferir comando de terminal por qr code',
      'p2p browser file transfer',
      'device to device transfer online',
    ],
    searchIntent:
      'Pessoas que precisam passar um texto curto por QR Code ou enviar arquivos entre celular e PC, sem cabo, sem login e sem passar o arquivo por um servidor.',
    seoTitle: 'Transferir Arquivos Entre Celular e PC por QR Code e Link',
    seoDescription:
      'Envie texto curto por QR Code ou arquivos por uma sala com link entre celular e PC, direto entre os navegadores. Grátis e sem cadastro.',
    h1: 'Transferir Arquivos e Texto Entre Celular e PC por QR Code ou Link',
    intro: transferIntro,
    canonicalPath: '/tools/transfer',
    faq: transferFaq,
    contentBlocks: transferContentBlocks,
    relatedToolIds: ['qr-code-generator', 'pix-decoder', 'gerador-link-whatsapp-telegram'],
  },
  {
    id: 'share-screen',
    slug: 'share-screen',
    ...getShareScreenContent('pt-br'),
    category: 'utility',
    canonicalPath: '/tools/share-screen',
    relatedToolIds: ['transfer', 'qr-code-generator', 'video-compression'],
  },
  {
    id: 'celular-como-webcam',
    slug: 'celular-como-webcam',
    ...getCelularWebcamContent('pt-br'),
    category: 'utility',
    canonicalPath: '/tools/celular-como-webcam',
    relatedToolIds: ['share-screen', 'transfer', 'qr-code-generator'],
  },
  {
    id: 'gerador-link-whatsapp-telegram',
    slug: 'gerador-link-whatsapp-telegram',
    name: 'Gerador de Link com Mensagem para WhatsApp e Telegram',
    shortDescription:
      'Gere links wa.me e t.me com mensagem pronta a partir de um número com código do país ou de um @nick, sem cadastro.',
    category: 'utility',
    primaryKeyword: 'gerador de link whatsapp com mensagem',
    secondaryKeywords: [
      'link whatsapp com texto pronto',
      'wa.me com mensagem',
      'gerar link telegram com mensagem',
      't.me com mensagem',
      'link de contato whatsapp',
      'link de contato telegram',
      'click to chat whatsapp',
    ],
    searchIntent:
      'Usuarios que precisam criar links de contato para WhatsApp e Telegram com mensagem pronta para acelerar o primeiro atendimento.',
    seoTitle: 'Gerador de Link WhatsApp e Telegram com Mensagem Pronta',
    seoDescription:
      'Crie links wa.me e t.me com mensagem pronta a partir de um número com código do país ou de um @nick. Gere no navegador, copie e use em botões, bio e anúncios.',
    h1: 'Gerador de Link para WhatsApp e Telegram com Mensagem Pronta',
    intro: whatsappTelegramLinkIntro,
    canonicalPath: '/tools/gerador-link-whatsapp-telegram',
    faq: whatsappTelegramLinkFaq,
    contentBlocks: whatsappTelegramLinkContentBlocks,
    relatedToolIds: ['qr-code-generator', 'url-encoder-decoder', 'open-graph-preview', 'qr-code-wifi-vcard-evento'],
  },
  {
    id: 'sorteador',
    slug: 'sorteador',
    name: 'Sorteador Online Completo',
    shortDescription:
      'Sorteie nomes, números ou equipes a partir de uma lista, com roleta, contagem regressiva, CSV e link para compartilhar.',
    category: 'utility',
    primaryKeyword: 'sorteador online',
    secondaryKeywords: [
      'sortear nomes online',
      'sorteador de numeros',
      'roleta online de nomes',
      'random picker online',
      'wheel picker online',
      'sortear lista online',
      'sorteio aleatorio gratis',
      'sortear 3 nomes online',
      'sortear sem repetir',
      'sorteador com tempo',
      'roleta com nomes gratis',
    ],
    searchIntent:
      'Usuarios que querem sortear nomes, numeros ou listas completas de forma rapida, com transparencia e opcoes avancadas de configuracao.',
    seoTitle:
      'Sorteador Online de Nomes, Números e Equipes | Com Roleta',
    seoDescription:
      'Sorteie nomes, números ou equipes online: cole a lista, use roleta e contagem regressiva, baixe o resultado em CSV e compartilhe a configuração por link.',
    h1: 'Sorteador Online de Nomes, Números e Equipes com Roleta',
    intro: sorteadorIntro,
    canonicalPath: '/tools/sorteador',
    faq: sorteadorFaq,
    contentBlocks: sorteadorContentBlocks,
    relatedToolIds: ['gerador-de-uuid-e-nanoid', 'password-generator', 'gerador-pessoa-fake'],
  },
  {
    id: 'contador-de-caracteres',
    slug: 'contador-de-caracteres',
    name: 'Contador de Caracteres e Palavras Online',
    shortDescription:
      'Conte caracteres, palavras, linhas, frases, parágrafos, emojis e hashtags, e confira limites de SEO, Instagram, X, WhatsApp e outras plataformas.',
    category: 'utility',
    primaryKeyword: 'contador de caracteres e palavras online',
    secondaryKeywords: [
      'contador de caracteres',
      'contador de palavras',
      'contador de linhas',
      'contador para instagram',
      'contador para x twitter',
      'tempo de leitura texto',
      'contador de hashtags',
      'detector de caracteres invisiveis',
    ],
    searchIntent:
      'Usuarios que precisam analisar texto de forma completa para SEO, social media, estudos, redacao e tarefas tecnicas.',
    seoTitle: 'Contador de Caracteres e Palavras Online | Limites por Rede',
    seoDescription:
      'Conte caracteres, palavras, linhas, frases, emojis e hashtags, veja se o texto cabe nos limites de SEO, Instagram, X e WhatsApp e exporte as métricas.',
    h1: 'Contador de Caracteres e Palavras Online',
    intro: characterCounterIntro,
    canonicalPath: '/tools/contador-de-caracteres',
    faq: characterCounterFaq,
    contentBlocks: characterCounterContentBlocks,
    relatedToolIds: ['remover-acentos', 'gerador-de-slug', 'invisible-character', 'markdown-editor'],
  },
  {
    id: 'jwt-decoder',
    slug: 'jwt-decoder',
    name: 'JWT Decoder Online',
    shortDescription:
      'Decodifique JWT e visualize header, payload e assinatura com JSON legivel, claims comuns e alerta de expiracao.',
    category: 'dev',
    primaryKeyword: 'jwt decoder online',
    secondaryKeywords: [
      'decodificar jwt',
      'jwt payload decoder',
      'ler token jwt',
      'jwt exp iat nbf',
      'jwt debugger',
    ],
    searchIntent:
      'Devs que precisam inspecionar conteudo de token JWT para debug de autenticacao e integracoes.',
    seoTitle: 'JWT Decoder Online | Header, Payload, Signature e Claims',
    seoDescription:
      'Cole seu token JWT e veja header, payload e signature com JSON formatado, claims comuns e aviso de expiracao.',
    h1: 'JWT Decoder Online com Header, Payload e Claims',
    intro: jwtDecoderIntro,
    canonicalPath: '/tools/jwt-decoder',
    faq: jwtDecoderFaq,
    contentBlocks: jwtDecoderContentBlocks,
    relatedToolIds: ['json-formatter', 'base64-image-viewer', 'conversor-unix-timestamp', 'url-encoder-decoder'],
  },
  {
    id: 'regex-tester',
    slug: 'regex-tester',
    name: 'Regex Studio: Testador, Gerador e Explicador',
    shortDescription:
      'Teste, gere, explique, valide, extraia e substitua com regex. Biblioteca de padrões, construtor visual, diagnóstico e snippets em 7 linguagens.',
    category: 'dev',
    primaryKeyword: 'regex tester online',
    secondaryKeywords: [
      'testar regex online',
      'gerador de regex',
      'explicador de regex',
      'regex javascript online',
      'validar email regex',
      'extrair dados regex',
      'regex cpf cnpj',
      'regex telefone brasileiro',
      'regex replace online',
      'construtor de regex visual',
      'regex para python java php',
      'testador de expressao regular',
    ],
    searchIntent:
      'Devs e estudantes que querem testar, gerar, explicar, validar e extrair dados com expressoes regulares.',
    seoTitle: 'Regex Studio Online | Testador, Gerador e Explicador de Regex',
    seoDescription:
      'Teste, gere, explique e valide regex online. Biblioteca de padrões, construtor visual, extração de dados, substituição, diagnóstico e código para JS, Python, PHP, Java, C# e Go.',
    h1: 'Regex Studio: Testador, Gerador e Explicador de Expressões Regulares',
    intro: regexTesterIntro,
    canonicalPath: '/tools/regex-tester',
    faq: regexTesterFaq,
    contentBlocks: regexTesterContentBlocks,
    relatedToolIds: ['contador-de-caracteres', 'json-formatter', 'url-encoder-decoder', 'remover-acentos'],
  },
  {
    id: 'gerador-de-uuid-e-nanoid',
    slug: 'gerador-de-uuid-e-nanoid',
    name: 'Gerador de UUID, ULID, KSUID, CUID2 e NanoID',
    shortDescription:
      'Gere UUID v1 a v7, NanoID, ULID, KSUID, CUID2 e ObjectId em lote, com cópia rápida e exportação em TXT ou CSV.',
    category: 'dev',
    primaryKeyword: 'gerador de uuid ulid ksuid cuid2 e nanoid online',
    secondaryKeywords: [
      'uuid v7 generator',
      'uuid v1 v3 v4 v5 v6 v7',
      'gerar nanoid',
      'gerar ulid',
      'gerar ksuid',
    ],
    searchIntent:
      'Desenvolvedores que precisam gerar identificadores unicos para APIs, bancos de dados, eventos e dados de teste.',
    seoTitle: 'Gerador de UUID v1-v7, ULID, KSUID, CUID2 e NanoID Online',
    seoDescription:
      'Gere até 500 IDs por vez no navegador: UUID v1 a v7, NanoID com alfabeto próprio, ULID, KSUID, CUID2 e ObjectId. Copie ou exporte em TXT e CSV.',
    h1: 'Gerador de UUID, ULID, KSUID, CUID2 e NanoID Online',
    intro: uuidNanoIdIntro,
    canonicalPath: '/tools/gerador-de-uuid-e-nanoid',
    faq: uuidNanoIdFaq,
    contentBlocks: uuidNanoIdContentBlocks,
    relatedToolIds: ['password-generator', 'conversor-unix-timestamp', 'jwt-decoder', 'gerador-de-slug'],
  },
  {
    id: 'conversor-unix-timestamp',
    slug: 'conversor-unix-timestamp',
    name: 'Conversor Unix Timestamp',
    shortDescription:
      'Converta Unix timestamp para data legivel e data para timestamp em segundos e milissegundos com UTC e horario local.',
    category: 'dev',
    primaryKeyword: 'conversor unix timestamp online',
    secondaryKeywords: [
      'timestamp para data',
      'data para timestamp',
      'epoch converter',
      'timestamp segundos milissegundos',
      'converter exp jwt',
    ],
    searchIntent:
      'Usuarios tecnicos que precisam interpretar timestamps em logs, APIs, JWT e banco de dados.',
    seoTitle: 'Conversor Unix Timestamp Online | Data, UTC e Epoch',
    seoDescription:
      'Converta timestamp Unix para data local/UTC e converta data para timestamp em segundos e milissegundos.',
    h1: 'Conversor Unix Timestamp para Data e Data para Timestamp',
    intro: unixTimestampIntro,
    canonicalPath: '/tools/conversor-unix-timestamp',
    faq: unixTimestampFaq,
    contentBlocks: unixTimestampContentBlocks,
    relatedToolIds: ['jwt-decoder', 'json-formatter', 'url-encoder-decoder', 'html-viewer'],
  },
  {
    id: 'url-encoder-decoder',
    slug: 'url-encoder-decoder',
    name: 'URL Encoder e Decoder',
    shortDescription:
      'Codifique e decodifique URL completa ou parametros, parse query string e reconstrua links com seguranca.',
    category: 'dev',
    primaryKeyword: 'url encoder e decoder online',
    secondaryKeywords: [
      'encode url',
      'decode url',
      'query param encoder',
      'query string decode',
      'utm encoder',
    ],
    searchIntent:
      'Devs, analistas e marketing que precisam tratar links e parametros para APIs, redirects e campanhas.',
    seoTitle: 'URL Encoder e Decoder Online | Encode e Decode de URL',
    seoDescription:
      'Ferramenta para encode/decode de URL, parametro e query string com tabela de parametros e reconstruir URL final.',
    h1: 'URL Encoder e Decoder Online',
    intro: urlEncoderDecoderIntro,
    canonicalPath: '/tools/url-encoder-decoder',
    faq: urlEncoderDecoderFaq,
    contentBlocks: urlEncoderDecoderContentBlocks,
    relatedToolIds: ['regex-tester', 'json-formatter', 'gerador-de-slug', 'jwt-decoder'],
  },
  {
    id: 'gerador-de-slug',
    slug: 'gerador-de-slug',
    name: 'Gerador de Slug para URL',
    shortDescription:
      'Transforme títulos e frases em slugs limpos para URL, com opção de separador, limite de tamanho e prévia da URL final.',
    category: 'utility',
    primaryKeyword: 'gerador de slug para url',
    secondaryKeywords: [
      'slug generator',
      'criar slug online',
      'url amigavel',
      'slug wordpress',
      'slug nextjs',
    ],
    searchIntent:
      'Criadores de conteudo e desenvolvedores que precisam padronizar URLs limpas para blogs, CMS e e-commerce.',
    seoTitle: 'Gerador de Slug para URL Online | Criar Slug Amigável',
    seoDescription:
      'Gere o slug de um título: a ferramenta tira acentos e símbolos, escolhe hífen ou underscore, limita o tamanho e monta a URL completa com prefixo.',
    h1: 'Gerador de Slug para URL',
    intro: slugGeneratorIntro,
    canonicalPath: '/tools/gerador-de-slug',
    faq: slugGeneratorFaq,
    contentBlocks: slugGeneratorContentBlocks,
    relatedToolIds: ['remover-acentos', 'url-encoder-decoder', 'contador-de-caracteres', 'gerador-de-uuid-e-nanoid'],
  },
  {
    id: 'remover-acentos',
    slug: 'remover-acentos',
    name: 'Remover Acentos de Texto',
    shortDescription:
      'Remova acentos, til e cedilha de um texto para padronizar nomes de arquivo, planilhas, URLs e sistemas.',
    category: 'utility',
    primaryKeyword: 'remover acentos de texto online',
    secondaryKeywords: [
      'tirar acento',
      'remover cedilha',
      'texto sem acento',
      'normalizar texto',
      'gerar texto para slug',
    ],
    searchIntent:
      'Usuarios que precisam normalizar textos para planilhas, integracoes, identificadores e URL.',
    seoTitle: 'Remover Acentos de Texto Online | Tirar Cedilha e Til',
    seoDescription:
      'Tire acentos, til e cedilha de um texto colado, escolha maiúsculas ou minúsculas, limpe símbolos e emojis, troque espaços por hífen ou underscore e copie o resultado.',
    h1: 'Remover Acentos de Texto Online',
    intro: removeAccentsIntro,
    canonicalPath: '/tools/remover-acentos',
    faq: removeAccentsFaq,
    contentBlocks: removeAccentsContentBlocks,
    relatedToolIds: ['gerador-de-slug', 'url-encoder-decoder', 'contador-de-caracteres', 'invisible-character'],
  },
  {
    id: 'conversor-universal',
    slug: 'conversor-universal',
    name: 'Conversor Universal de Texto, Codigos, Hashes, Cifras e Bases',
    shortDescription:
      'Central unica para converter texto, codigos, hashes, cifras classicas e bases numericas com validacao, lote e multiplas saidas.',
    category: 'dev',
    primaryKeyword: 'conversor universal de texto codigo hash cifras e bases',
    secondaryKeywords: [
      'texto para binario',
      'binario para texto',
      'texto para sha256',
      'gerador md5 online',
      'conversor de bases',
      'cifra de cesar online',
      'texto para morse',
      'url encode decode',
    ],
    searchIntent:
      'Usuarios tecnicos e estudantes que precisam converter formatos em uma central unica com validacao clara e fluxo rapido.',
    seoTitle: 'Conversor Universal de Texto, Codigo, Hash e Cifras Online',
    seoDescription:
      'Converta texto, hashes, cifras classicas, encodings web e bases numericas com presets, lote e processamento local no navegador.',
    h1: 'Conversor Universal de Texto, Codigo, Hash e Cifras',
    intro: 'Converta formatos tecnicos em uma central unica com filtros, presets e validacao de entrada.',
    canonicalPath: '/tools/conversor-universal',
    faq: getUniversalConverterContent('pt-br').faq,
    contentBlocks: getUniversalConverterContent('pt-br').contentBlocks,
    relatedToolIds: ['url-encoder-decoder', 'gerador-de-slug', 'remover-acentos', 'json-formatter'],
  },
  {
    id: 'calculadora-juros-compostos',
    slug: 'calculadora-juros-compostos',
    name: 'Calculadora de Juros Compostos',
    shortDescription:
      'Simule juros compostos com aporte mensal, descubra o aporte para uma meta e a taxa necessária, com gráfico, tabela e comparação com juros simples.',
    category: 'utility',
    primaryKeyword: 'calculadora de juros compostos',
    secondaryKeywords: [
      'simulador de juros compostos',
      'juros compostos online',
      'calculadora de investimento com aporte mensal',
      'quanto rende por mes',
      'quanto preciso investir por mes',
      'descobrir taxa de juros necessaria',
      'simulador de rendimento mensal',
      'calculadora juros compostos mensal',
      'calculadora juros compostos anual',
      'como calcular juros compostos',
      'juros simples vs compostos',
    ],
    searchIntent:
      'Usuários que precisam calcular crescimento de patrimônio com juros compostos e comparar cenários para investimento, meta financeira e planejamento de prazo.',
    seoTitle:
      'Calculadora de Juros Compostos | Simulador com Aporte Mensal',
    seoDescription:
      'Calcule juros compostos com valor inicial, aporte mensal, taxa e prazo. Veja valor final, juros, gráfico, tabela, comparação com juros simples e metas.',
    h1: 'Calculadora de Juros Compostos Online com Aporte Mensal',
    intro: compoundInterestIntro,
    canonicalPath: '/tools/calculadora-juros-compostos',
    faq: compoundInterestFaq,
    contentBlocks: compoundInterestContentBlocks,
    relatedToolIds: ['conversor-universal', 'csv-viewer', 'crypto-unit-converter'],
  },
  {
    id: 'invisible-character',
    slug: 'invisible-character',
    name: 'Caractere Invisivel para Jogos',
    shortDescription:
      'Copie e gere caractere invisivel para jogos e redes sociais, com variacoes 2, 3 e 4 chars, detector Unicode e paginas por plataforma.',
    category: 'utility',
    primaryKeyword: 'caractere invisivel free fire',
    secondaryKeywords: [
      'espaco invisivel free fire',
      'nick invisivel free fire',
      'nome invisivel cod mobile',
      'nick invisivel discord',
      'letra invisivel copiar',
      'caractere invisivel para jogos',
      'invisible character free fire',
      'invisible name cod mobile',
      'invisible text discord',
      'blank character copy paste',
      'invisible username generator',
    ],
    searchIntent:
      'Usuarios que querem copiar ou gerar nome invisivel para jogos e redes sociais com mais chance de passar em validacoes de nickname.',
    seoTitle:
      'Caractere Invisivel para Free Fire, COD e Discord | Copiar e Colar',
    seoDescription:
      'Copie caractere invisivel e gere nome invisivel para Free Fire, COD Mobile, Discord e outras plataformas. Teste combinacoes 2, 3 e 4 caracteres.',
    h1: 'Caractere Invisivel para Jogos (Free Fire, COD, Discord e mais)',
    intro: invisibleCharacterIntro,
    canonicalPath: '/tools/invisible-character',
    faq: invisibleCharacterFaq,
    contentBlocks: invisibleCharacterContentBlocks,
    relatedToolIds: ['nickname-symbol-generator', 'gamer-username-generator', 'qr-code-generator', 'password-generator'],
  },
  {
    id: 'nickname-symbol-generator',
    slug: 'nickname-symbol-generator',
    name: getNicknameSymbolGeneratorContent('pt-br').name,
    shortDescription: getNicknameSymbolGeneratorContent('pt-br').shortDescription,
    category: 'gaming',
    primaryKeyword: getNicknameSymbolGeneratorContent('pt-br').primaryKeyword,
    secondaryKeywords: getNicknameSymbolGeneratorContent('pt-br').secondaryKeywords,
    searchIntent: getNicknameSymbolGeneratorContent('pt-br').searchIntent,
    seoTitle: getNicknameSymbolGeneratorContent('pt-br').seoTitle,
    seoDescription: getNicknameSymbolGeneratorContent('pt-br').seoDescription,
    h1: getNicknameSymbolGeneratorContent('pt-br').h1,
    intro: getNicknameSymbolGeneratorContent('pt-br').intro,
    canonicalPath: '/tools/nickname-symbol-generator',
    faq: getNicknameSymbolGeneratorContent('pt-br').faq,
    contentBlocks: getNicknameSymbolGeneratorContent('pt-br').contentBlocks,
    relatedToolIds: ['invisible-character', 'cs2-crosshair-codes', 'symbols-to-copy'],
  },
  {
    id: 'symbols-to-copy',
    slug: 'symbols-to-copy',
    name: getSymbolsToCopyContent('pt-br').name,
    shortDescription: getSymbolsToCopyContent('pt-br').shortDescription,
    category: 'utility',
    primaryKeyword: getSymbolsToCopyContent('pt-br').primaryKeyword,
    secondaryKeywords: getSymbolsToCopyContent('pt-br').secondaryKeywords,
    searchIntent: getSymbolsToCopyContent('pt-br').searchIntent,
    seoTitle: getSymbolsToCopyContent('pt-br').seoTitle,
    seoDescription: getSymbolsToCopyContent('pt-br').seoDescription,
    h1: getSymbolsToCopyContent('pt-br').h1,
    intro: getSymbolsToCopyContent('pt-br').intro,
    canonicalPath: '/tools/symbols-to-copy',
    faq: getSymbolsToCopyContent('pt-br').faq,
    contentBlocks: getSymbolsToCopyContent('pt-br').contentBlocks,
    relatedToolIds: ['nickname-symbol-generator', 'invisible-character', 'contador-de-caracteres'],
  },
  {
    id: 'gamer-username-generator',
    slug: 'gamer-username-generator',
    name: getGamerUsernameGeneratorContent('pt-br').name,
    shortDescription: getGamerUsernameGeneratorContent('pt-br').shortDescription,
    category: 'gaming',
    primaryKeyword: getGamerUsernameGeneratorContent('pt-br').primaryKeyword,
    secondaryKeywords: getGamerUsernameGeneratorContent('pt-br').secondaryKeywords,
    searchIntent: getGamerUsernameGeneratorContent('pt-br').searchIntent,
    seoTitle: getGamerUsernameGeneratorContent('pt-br').seoTitle,
    seoDescription: getGamerUsernameGeneratorContent('pt-br').seoDescription,
    h1: getGamerUsernameGeneratorContent('pt-br').h1,
    intro: getGamerUsernameGeneratorContent('pt-br').intro,
    canonicalPath: '/tools/gamer-username-generator',
    faq: getGamerUsernameGeneratorContent('pt-br').faq,
    contentBlocks: getGamerUsernameGeneratorContent('pt-br').contentBlocks,
    relatedToolIds: ['nickname-symbol-generator', 'invisible-character', 'password-generator'],
  },
  {
    id: 'multiplication-table-quiz',
    slug: 'multiplication-table-quiz',
    name: getMultiplicationTableQuizContent('pt-br').name,
    shortDescription: getMultiplicationTableQuizContent('pt-br').shortDescription,
    category: 'utility',
    primaryKeyword: getMultiplicationTableQuizContent('pt-br').primaryKeyword,
    secondaryKeywords: getMultiplicationTableQuizContent('pt-br').secondaryKeywords,
    searchIntent: getMultiplicationTableQuizContent('pt-br').searchIntent,
    seoTitle: getMultiplicationTableQuizContent('pt-br').seoTitle,
    seoDescription: getMultiplicationTableQuizContent('pt-br').seoDescription,
    h1: getMultiplicationTableQuizContent('pt-br').h1,
    intro: getMultiplicationTableQuizContent('pt-br').intro,
    canonicalPath: '/tools/multiplication-table-quiz',
    faq: getMultiplicationTableQuizContent('pt-br').faq,
    contentBlocks: getMultiplicationTableQuizContent('pt-br').contentBlocks,
    relatedToolIds: ['calculadora-juros-compostos', 'sorteador', 'contador-de-caracteres'],
  },
  {
    id: 'keyboard-shortcuts',
    slug: 'keyboard-shortcuts',
    name: getKeyboardShortcutsContent('pt-br').name,
    shortDescription: getKeyboardShortcutsContent('pt-br').shortDescription,
    category: 'dev',
    primaryKeyword: getKeyboardShortcutsContent('pt-br').primaryKeyword,
    secondaryKeywords: getKeyboardShortcutsContent('pt-br').secondaryKeywords,
    searchIntent: getKeyboardShortcutsContent('pt-br').searchIntent,
    seoTitle: getKeyboardShortcutsContent('pt-br').seoTitle,
    seoDescription: getKeyboardShortcutsContent('pt-br').seoDescription,
    h1: getKeyboardShortcutsContent('pt-br').h1,
    intro: getKeyboardShortcutsContent('pt-br').intro,
    canonicalPath: '/tools/keyboard-shortcuts',
    faq: getKeyboardShortcutsContent('pt-br').faq,
    contentBlocks: getKeyboardShortcutsContent('pt-br').contentBlocks,
    relatedToolIds: ['regex-tester', 'json-formatter', 'markdown-editor'],
  },
  {
    id: 'cs2-crosshair-codes',
    slug: 'cs2-crosshair-codes',
    name: 'Codigos de Mira CS2 de Pro Players',
    shortDescription:
      'Encontre codigos de mira CS2 e CS:GO de jogadores profissionais, filtre por time/pais/funcao e copie em um clique.',
    category: 'gaming',
    primaryKeyword: 'codigos de mira cs2',
    secondaryKeywords: [
      'codigo de mira cs go',
      'miras de pro players cs2',
      'cs2 crosshair codes',
      'crosshair code csgo',
      'mira yuurih cs2',
    ],
    searchIntent:
      'Jogadores de Counter-Strike que querem copiar codigos de mira de pro players e ajustar rapidamente para seu proprio estilo.',
    seoTitle: 'Codigos de Mira CS2 e CS:GO de Pro Players | Copiar Crosshair',
    seoDescription:
      'Copie codigos de mira CS2/CS:GO de jogadores profissionais, filtre por time, pais e funcao e veja como importar no Counter-Strike 2.',
    h1: 'Codigos de Mira CS2 e CS:GO de Pro Players',
    intro: cs2CrosshairCodesIntro,
    canonicalPath: '/tools/cs2-crosshair-codes',
    canonicalPathByLocale: {
      'pt-br': getCs2CrosshairToolBasePathForLocale('pt-br'),
      en: getCs2CrosshairToolBasePathForLocale('en'),
      es: getCs2CrosshairToolBasePathForLocale('es'),
    },
    faq: cs2CrosshairCodesFaq,
    contentBlocks: cs2CrosshairCodesContentBlocks,
    relatedToolIds: ['invisible-character', 'json-formatter', 'sorteador'],
  },
  ...cs2ToolDefinitions,
  {
    id: 'gta-cheat-codes',
    slug: 'gta-cheat-codes',
    name: 'Codigos GTA (San Andreas, V, IV, III e Vice City)',
    shortDescription:
      'Busque e copie codigos GTA por jogo, categoria e plataforma com filtros inteligentes em pt-br/en/es.',
    category: 'gaming',
    primaryKeyword: 'codigos gta',
    secondaryKeywords: [
      'gta cheat codes',
      'codigos gta san andreas',
      'codigos gta 5',
      'codigos gta 4',
      'codigos gta vice city',
    ],
    searchIntent:
      'Jogadores que querem encontrar e copiar cheats GTA por jogo, categoria e plataforma com busca semantica rapida.',
    seoTitle: 'Codigos GTA: San Andreas, GTA 5, GTA 4, GTA 3 e Vice City',
    seoDescription:
      'Copie codigos GTA para single-player/story mode com filtros por jogo e categoria, busca inteligente e avisos de compatibilidade.',
    h1: 'Codigos GTA por jogo, categoria e plataforma',
    intro: gtaCheatsIntro,
    canonicalPath: '/tools/gta-cheat-codes',
    canonicalPathByLocale: {
      'pt-br': getGtaToolBasePathForLocale('pt-br'),
      en: getGtaToolBasePathForLocale('en'),
      es: getGtaToolBasePathForLocale('es'),
    },
    faq: gtaCheatsFaq,
    contentBlocks: gtaCheatsContentBlocks,
    relatedToolIds: ['cs2-crosshair-codes', 'sorteador', 'qr-code-generator'],
  },
  {
    id: 'descobrir-ip-publico',
    slug: 'descobrir-ip-publico',
    name: 'Descobrir IP Público e Informações',
    shortDescription:
      'Descubra seu IP público, provedor (ISP) e informações básicas de dispositivo e localização aproximada.',
    category: 'utility',
    primaryKeyword: 'descobrir ip publico',
    secondaryKeywords: [
      'meu ip',
      'ip publico',
      'qual meu ip',
      'descobrir ip isp',
      'ip info',
    ],
    searchIntent:
      'Usuarios que precisam saber o IP publico atual, provedor e detalhes basicos do dispositivo para diagnostico e configuracao de rede.',
    seoTitle: 'Descobrir IP Público | ISP, Localização e Dispositivo',
    seoDescription:
      'Veja seu IP público, provedor (ISP), cidade e país estimados, além do navegador e do sistema. A consulta vai direto do seu navegador a um serviço de IP.',
    h1: 'Descubra seu IP Público e Informações do Dispositivo',
    intro: descobrirIpPublicoIntro,
    canonicalPath: '/tools/descobrir-ip-publico',
    faq: descobrirIpPublicoFaq,
    contentBlocks: descobrirIpPublicoContentBlocks,
    relatedToolIds: ['dns-lookup', 'email-temporario', 'password-generator'],
  },
  {
    id: 'email-temporario',
    slug: 'email-temporario',
    name: 'E-mail Temporário',
    shortDescription:
      'Gere um e-mail descartável para receber mensagens por 1 hora, com inbox temporária e expiração automática.',
    category: 'utility',
    primaryKeyword: 'e-mail temporario gratis',
    secondaryKeywords: [
      'email temporario',
      'correio temporario',
      'inbox descartavel',
      'gerar email descartavel',
      'temp mail gratis',
      'email para teste',
      'email para cadastro rapido',
      'protecao contra spam',
    ],
    searchIntent:
      'Usuarios e times tecnicos que precisam receber e-mails por tempo limitado para testes, cadastros simples e protecao de privacidade.',
    seoTitle: 'E-mail Temporário Grátis | Inbox Descartável por 1 Hora',
    seoDescription:
      'Crie um e-mail temporário grátis, sem cadastro, e receba mensagens por 1 hora com leitura isolada. Ideal para testes e cadastros rápidos, não para contas importantes.',
    h1: 'E-mail Temporário Grátis, sem Cadastro',
    intro: emailTemporarioIntro,
    canonicalPath: '/tools/email-temporario',
    faq: emailTemporarioFaq,
    contentBlocks: emailTemporarioContentBlocks,
    relatedToolIds: ['password-generator', 'gerador-pessoa-fake', 'authenticator-code-generator'],
  },
  {
    id: 'css-generator',
    slug: 'css-generator',
    name: 'Gerador Visual de CSS',
    shortDescription:
      'Crie gradientes, sombras, bordas, border-radius, glassmorphism, filtros e animações com sliders e copie o CSS pronto.',
    category: 'dev',
    primaryKeyword: 'gerador de css visual online',
    secondaryKeywords: [
      'gerador de gradiente css',
      'gerador de sombra css',
      'gerador border-radius',
      'gerador glassmorphism',
      'gerador box-shadow',
      'css generator online',
      'gerador de botao css',
      'gerador neumorphism',
    ],
    searchIntent:
      'Desenvolvedores e designers que precisam criar efeitos CSS visualmente sem memorizar propriedades e valores.',
    seoTitle: 'Gerador Visual de CSS Online | Gradiente, Sombra, Glass, Radius',
    seoDescription:
      'Crie CSS visual com sliders: gradientes, box-shadow, border-radius, glassmorphism, filtros, transforms e animações. Preview ao vivo e código pronto para copiar.',
    h1: 'Gerador Visual de CSS com Preview em Tempo Real',
    intro: cssGeneratorIntro,
    canonicalPath: '/tools/css-generator',
    faq: cssGeneratorFaq,
    contentBlocks: cssGeneratorContentBlocks,
    relatedToolIds: ['json-formatter', 'html-viewer', 'image-converter'],
  },
  {
    id: 'color-converter',
    slug: 'color-converter',
    name: 'Conversor HEX, RGB e HSL',
    shortDescription:
      'Converta cores entre HEX, RGB, HSL, HSV, CMYK e outros formatos, veja preview ao vivo, copie CSS pronto e compare contraste entre cores.',
    category: 'dev',
    primaryKeyword: 'conversor hex rgb hsl online',
    secondaryKeywords: [
      'hex para rgb',
      'rgb para hex',
      'hex para hsl',
      'hsl para hex',
      'rgb para hsl',
      'conversor de cores',
      'color converter online',
      'conversor rgba',
      'gerador escala tailwind',
      'verificador de contraste',
    ],
    searchIntent:
      'Desenvolvedores e designers que precisam converter cores entre HEX, RGB, HSL e outros formatos com preview e código CSS pronto.',
    seoTitle: 'Conversor HEX, RGB, HSL Online | Converter Cores CSS',
    seoDescription:
      'Converta cores entre HEX, RGB, HSL, HSV e CMYK online. Preview ao vivo, contraste, escala Tailwind e código CSS pronto para copiar.',
    h1: 'Conversor de Cores HEX, RGB, HSL, HSV e CMYK Online',
    intro: colorConverterIntro,
    canonicalPath: '/tools/color-converter',
    faq: colorConverterFaq,
    contentBlocks: colorConverterContentBlocks,
    relatedToolIds: ['image-color-extractor', 'css-generator', 'image-converter'],
  },
  {
    id: 'image-color-extractor',
    slug: 'image-color-extractor',
    name: 'Extrator de Cores de Imagem',
    shortDescription:
      'Extraia as cores predominantes de uma imagem ou logo e copie a paleta em CSS, SCSS, JSON ou Tailwind, direto no navegador.',
    category: 'dev',
    primaryKeyword: 'extrair cores de imagem online',
    secondaryKeywords: [
      'gerador de paleta de cores',
      'extrator de cores de foto',
      'color palette from image',
      'cores predominantes imagem',
      'paleta de cores css',
      'extrair cor de logo',
      'paleta de cores tailwind',
      'gerador tema cores',
      'image color picker online',
    ],
    searchIntent:
      'Designers e desenvolvedores que precisam extrair uma paleta de cores de uma imagem ou logo para usar em CSS, Tailwind ou design systems.',
    seoTitle: 'Extrator de Cores de Imagem Online | Gerador de Paleta',
    seoDescription:
      'Extraia cores de qualquer imagem online. Gere paletas, copie CSS, JSON ou Tailwind config. Processamento 100% local no navegador.',
    h1: 'Extrator de Cores de Imagem e Gerador de Paleta Online',
    intro: imageColorExtractorIntro,
    canonicalPath: '/tools/image-color-extractor',
    faq: imageColorExtractorFaq,
    contentBlocks: imageColorExtractorContentBlocks,
    relatedToolIds: ['color-converter', 'css-generator', 'image-converter'],
  },
  {
    id: 'lightning-decoder',
    slug: 'lightning-decoder',
    name: 'Lightning Decoder',
    shortDescription:
      'Decodifique BOLT11, BOLT12, LNURL e Lightning Address, veja os campos agrupados, exporte JSON ou TXT e gere QR Code em PNG ou SVG, tudo no navegador.',
    category: 'crypto',
    primaryKeyword: 'lightning decoder bolt11 lnurl online',
    secondaryKeywords: [
      'decoder lightning network',
      'decode bolt11 invoice',
      'decode bolt12 offer',
      'decoder lnurl',
      'lightning address decoder',
      'lightning invoice parser',
      'bitcoin lightning tools',
      'lightning qr code generator',
      'bolt11 parser online',
      'lnurl decoder online',
    ],
    searchIntent:
      'Usuários e desenvolvedores que precisam decodificar payloads Lightning (BOLT11, BOLT12, LNURL e Lightning Address) com visual técnico e exportação.',
    seoTitle: 'Lightning Decoder | BOLT11, BOLT12, LNURL e Lightning Address',
    seoDescription:
      'Decodifique BOLT11, BOLT12, LNURL e Lightning Address, veja os campos agrupados, exporte JSON ou TXT e gere QR Code. Tudo no navegador.',
    h1: 'Lightning Decoder Online com QR Code e Exportação',
    intro: lightningDecoderIntro,
    canonicalPath: '/tools/lightning-decoder',
    faq: lightningDecoderFaq,
    contentBlocks: lightningDecoderContentBlocks,
    relatedToolIds: ['bitcoin-address-tx-decoder', 'qr-code-generator', 'crypto-unit-converter'],
  },
  {
    id: 'pix-decoder',
    slug: 'pix-decoder',
    name: 'Validador e Gerador de Pix',
    shortDescription:
      'Gere, valide e decodifique Pix Copia e Cola: veja os campos EMV, confira o CRC16 e baixe o QR Code. Tudo no navegador.',
    category: 'utility',
    primaryKeyword: 'gerador pix copia e cola online',
    secondaryKeywords: [
      'validar pix copia e cola',
      'decoder pix emv',
      'decodificar pix',
      'gerador qr code pix',
      'pix qr code decoder',
      'calcular crc pix',
      'corrigir crc pix',
      'extrair dados pix',
      'br code pix',
      'pix emv decoder',
    ],
    searchIntent:
      'Desenvolvedores, lojistas e usuários que precisam gerar, validar, decodificar ou corrigir payloads Pix Copia e Cola (BR Code EMV).',
    seoTitle: 'Gerador e Validador de Pix Copia e Cola Online | Decoder EMV',
    seoDescription:
      'Gere, valide e decodifique Pix Copia e Cola: veja os campos EMV, confira o CRC16 e baixe o QR Code. Tudo no navegador, sem enviar dados.',
    h1: 'Validador e Gerador de Pix Copia e Cola Online',
    intro: pixDecoderIntro,
    canonicalPath: '/tools/pix-decoder',
    faq: pixDecoderFaq,
    contentBlocks: pixDecoderContentBlocks,
    relatedToolIds: ['validar-boleto', 'qr-code-generator', 'cpf-generator'],
  },
  {
    id: 'code-converter',
    slug: 'code-converter',
    name: 'Conversor Educacional de Código',
    shortDescription:
      'Converta código entre Pascal, C, Java e Pseudocódigo com explicações de sintaxe, exemplos prontos e análise estrutural — tudo 100% local no navegador.',
    category: 'dev',
    primaryKeyword: 'conversor de código pascal c java pseudocódigo online',
    secondaryKeywords: [
      'converter pascal para c',
      'pseudocódigo para java',
      'conversor educacional de código',
      'pascal para java online',
      'conversor de pseudocódigo',
      'converter c para pascal',
      'code converter online',
      'pascal to c converter',
      'converter pseudocodigo para c',
    ],
    searchIntent:
      'Estudantes e professores que precisam converter código entre Pascal, C, Java e Pseudocódigo para fins educacionais.',
    seoTitle: 'Conversor de Código Educacional | Pascal, C, Java e Pseudocódigo',
    seoDescription:
      'Converta código entre Pascal, C, Java e Pseudocódigo de forma educacional. Veja explicações de sintaxe, exemplos prontos e análise estrutural — tudo 100% local no navegador.',
    h1: 'Conversor Educacional de Código — Pascal, C, Java e Pseudocódigo',
    intro: codeConverterIntro,
    canonicalPath: '/tools/code-converter',
    faq: codeConverterFaq,
    contentBlocks: codeConverterContentBlocks,
    relatedToolIds: ['json-formatter', 'text-diff', 'regex-tester'],
  },
];

export const getToolBySlug = (slug: string): ToolDefinition | undefined =>
  toolsRegistry.find((tool) => tool.slug === slug);

export const getToolById = (id: string): ToolDefinition | undefined =>
  toolsRegistry.find((tool) => tool.id === id);

export const getRelatedTools = (toolId: string): ToolDefinition[] => {
  const currentTool = getToolById(toolId);

  if (!currentTool) {
    return [];
  }

  return currentTool.relatedToolIds
    .map((relatedId) => getToolById(relatedId))
    .filter((tool): tool is ToolDefinition => Boolean(tool));
};

const getToolBaseCanonicalPathByLocale = (
  tool: ToolDefinition,
  locale: AppLocale,
): string => tool.canonicalPathByLocale?.[locale] ?? tool.canonicalPath;

export const getToolCanonicalPathByLocale = (
  tool: ToolDefinition,
  locale: AppLocale,
): string => localizePath(locale, getToolBaseCanonicalPathByLocale(tool, locale));

export const getToolLocalePathMap = (
  tool: ToolDefinition,
): Record<AppLocale, string> => ({
  'pt-br': getToolCanonicalPathByLocale(tool, 'pt-br'),
  en: getToolCanonicalPathByLocale(tool, 'en'),
  es: getToolCanonicalPathByLocale(tool, 'es'),
  zh: getToolCanonicalPathByLocale(tool, 'zh'),
});

type LocalizableToolId =
  | 'bitcoin-wallet'
  | 'crypto-unit-converter'
  | 'html-viewer'
  | 'markdown-editor'
  | 'json-formatter'
  | 'csv-viewer'
  | 'text-diff'
  | 'open-graph-preview'
  | 'cpf-generator'
  | 'gerador-pessoa-fake'
  | 'password-generator'
  | 'base64-image-viewer'
  | 'image-to-base64'
  | 'image-converter'
  | 'image-compression'
  | 'instagram-image-optimizer'
  | 'remover-fundo-imagem'
  | 'video-compression'
  | 'extrair-audio-de-video'
  | 'timelapse-creator'
  | 'audio-blaster'
  | 'transcricao-de-audio-e-video'
  | 'qr-code-generator'
  | 'authenticator-code-generator'
  | 'sorteador'
  | 'calculadora-juros-compostos'
  | 'invisible-character'
  | 'descobrir-ip-publico'
  | 'email-temporario';


const localizableToolIds = new Set<LocalizableToolId>([
  'bitcoin-wallet',
  'crypto-unit-converter',
  'html-viewer',
  'markdown-editor',
  'json-formatter',
  'csv-viewer',
  'text-diff',
  'open-graph-preview',
  'cpf-generator',
  'gerador-pessoa-fake',
  'password-generator',
  'base64-image-viewer',
  'image-to-base64',
  'image-converter',
  'image-compression',
  'instagram-image-optimizer',
  'remover-fundo-imagem',
  'video-compression',
  'extrair-audio-de-video',
  'timelapse-creator',
  'audio-blaster',
  'transcricao-de-audio-e-video',
  'qr-code-generator',
  'authenticator-code-generator',
  'sorteador',
  'calculadora-juros-compostos',
  'invisible-character',
  'descobrir-ip-publico',
  'email-temporario',
]);

const isLocalizableToolId = (toolId: string): toolId is LocalizableToolId =>
  localizableToolIds.has(toolId as LocalizableToolId);

const localizeTool = (tool: ToolDefinition, locale: AppLocale): ToolDefinition => {
  if (tool.id === 'share-screen') {
    return {
      ...tool,
      ...getShareScreenContent(locale),
      canonicalPath: getToolCanonicalPathByLocale(tool, locale),
    };
  }

  if (tool.id === 'celular-como-webcam') {
    return {
      ...tool,
      ...getCelularWebcamContent(locale),
      canonicalPath: getToolCanonicalPathByLocale(tool, locale),
    };
  }

  if (tool.id === 'instagram-post-simulator') {
    return {
      ...tool,
      ...getInstagramPostSimulatorContent(locale),
      canonicalPath: getToolCanonicalPathByLocale(tool, locale),
    };
  }

  if (tool.id === 'zpl-label-editor') {
    const localized = getZplLabelEditorContent(locale);

    return {
      ...tool,
      ...localized,
      canonicalPath: getToolCanonicalPathByLocale(tool, locale),
    };
  }

  if (tool.id === 'nickname-symbol-generator') {
    const localized = getNicknameSymbolGeneratorContent(locale);

    return {
      ...tool,
      ...localized,
      canonicalPath: getToolCanonicalPathByLocale(tool, locale),
    };
  }

  if (tool.id === 'symbols-to-copy') {
    const localized = getSymbolsToCopyContent(locale);

    return {
      ...tool,
      ...localized,
      canonicalPath: getToolCanonicalPathByLocale(tool, locale),
    };
  }

  if (tool.id === 'gamer-username-generator') {
    const localized = getGamerUsernameGeneratorContent(locale);

    return {
      ...tool,
      ...localized,
      canonicalPath: getToolCanonicalPathByLocale(tool, locale),
    };
  }

  if (tool.id === 'multiplication-table-quiz') {
    const localized = getMultiplicationTableQuizContent(locale);

    return {
      ...tool,
      ...localized,
      canonicalPath: getToolCanonicalPathByLocale(tool, locale),
    };
  }

  if (tool.id === 'keyboard-shortcuts') {
    const localized = getKeyboardShortcutsContent(locale);

    return {
      ...tool,
      ...localized,
      canonicalPath: getToolCanonicalPathByLocale(tool, locale),
    };
  }

  if (tool.id === 'cs2-crosshair-codes') {
    const localized = getCs2CrosshairCodesContent(locale);

    return {
      ...tool,
      ...localized,
      canonicalPath: getToolCanonicalPathByLocale(tool, locale),
    };
  }

  if (tool.id === 'gta-cheat-codes') {
    const localized = getGtaCheatsContent(locale);

    return {
      ...tool,
      ...localized,
      canonicalPath: getToolCanonicalPathByLocale(tool, locale),
    };
  }

  if (tool.id === 'contador-de-caracteres') {
    const localized = getCharacterCounterContent(locale);

    return {
      ...tool,
      ...localized,
      canonicalPath: getToolCanonicalPathByLocale(tool, locale),
    };
  }

  if (tool.id === 'jwt-decoder') {
    const localized = getJwtDecoderContent(locale);

    return {
      ...tool,
      ...localized,
      canonicalPath: getToolCanonicalPathByLocale(tool, locale),
    };
  }

  if (tool.id === 'regex-tester') {
    const localized = getRegexTesterContent(locale);

    return {
      ...tool,
      ...localized,
      canonicalPath: getToolCanonicalPathByLocale(tool, locale),
    };
  }

  if (tool.id === 'gerador-de-uuid-e-nanoid') {
    const localized = getUuidNanoIdContent(locale);

    return {
      ...tool,
      ...localized,
      canonicalPath: getToolCanonicalPathByLocale(tool, locale),
    };
  }

  if (tool.id === 'conversor-unix-timestamp') {
    const localized = getUnixTimestampContent(locale);

    return {
      ...tool,
      ...localized,
      canonicalPath: getToolCanonicalPathByLocale(tool, locale),
    };
  }

  if (tool.id === 'video-downloader') {
    const localized = getVideoDownloaderContent(locale);

    return {
      ...tool,
      ...localized,
      canonicalPath: getToolCanonicalPathByLocale(tool, locale),
    };
  }

  if (tool.id === 'url-encoder-decoder') {
    const localized = getUrlEncoderDecoderContent(locale);

    return {
      ...tool,
      ...localized,
      canonicalPath: getToolCanonicalPathByLocale(tool, locale),
    };
  }

  if (tool.id === 'gerador-de-slug') {
    const localized = getSlugGeneratorContent(locale);

    return {
      ...tool,
      ...localized,
      canonicalPath: getToolCanonicalPathByLocale(tool, locale),
    };
  }

  if (tool.id === 'remover-acentos') {
    const localized = getRemoveAccentsContent(locale);

    return {
      ...tool,
      ...localized,
      canonicalPath: getToolCanonicalPathByLocale(tool, locale),
    };
  }

  if (tool.id === 'conversor-universal') {
    const localized = getUniversalConverterContent(locale);

    return {
      ...tool,
      ...localized,
      canonicalPath: getToolCanonicalPathByLocale(tool, locale),
    };
  }

  if (tool.id === 'gerador-link-whatsapp-telegram') {
    const localized = getWhatsAppTelegramLinkContent(locale);

    return {
      ...tool,
      ...localized,
      canonicalPath: getToolCanonicalPathByLocale(tool, locale),
    };
  }

  if (tool.id === 'css-generator') {
    const localized = getCssGeneratorContent(locale);

    return {
      ...tool,
      ...localized,
      canonicalPath: getToolCanonicalPathByLocale(tool, locale),
    };
  }

  if (tool.id === 'color-converter') {
    const localized = getColorConverterContent(locale);

    return {
      ...tool,
      ...localized,
      canonicalPath: getToolCanonicalPathByLocale(tool, locale),
    };
  }

  if (tool.id === 'image-color-extractor') {
    const localized = getImageColorExtractorContent(locale);

    return {
      ...tool,
      ...localized,
      canonicalPath: getToolCanonicalPathByLocale(tool, locale),
    };
  }

  if (tool.id === 'pix-decoder') {
    const localized = getPixDecoderContent(locale);

    return {
      ...tool,
      ...localized,
      canonicalPath: getToolCanonicalPathByLocale(tool, locale),
    };
  }

  if (tool.id === 'lightning-decoder') {
    const localized = getLightningDecoderContent(locale);

    return {
      ...tool,
      ...localized,
      canonicalPath: getToolCanonicalPathByLocale(tool, locale),
    };
  }

  if (tool.id === 'code-converter') {
    const localized = getCodeConverterContent(locale);

    return {
      ...tool,
      ...localized,
      canonicalPath: getToolCanonicalPathByLocale(tool, locale),
    };
  }

  if (tool.id === 'transfer') {
    const localized = getTransferContent(locale);

    return {
      ...tool,
      ...localized,
      canonicalPath: getToolCanonicalPathByLocale(tool, locale),
    };
  }

  if (tool.id === 'data-converter') {
    const localized = getDataConverterContent(locale);

    return {
      ...tool,
      ...localized,
      canonicalPath: getToolCanonicalPathByLocale(tool, locale),
    };
  }

  if (isFrontOnlyToolId(tool.id)) {
    const localized = getFrontOnlyToolContent(tool.id, locale);

    return {
      ...tool,
      ...localized,
      canonicalPath: getToolCanonicalPathByLocale(tool, locale),
    };
  }

  if (isCs2ToolId(tool.id)) {
    const localized = getCs2ToolContent(tool.id, locale);

    return {
      ...tool,
      ...localized,
      canonicalPath: getToolCanonicalPathByLocale(tool, locale),
    };
  }

  if (locale === 'pt-br') {
    return {
      ...tool,
      canonicalPath: getToolCanonicalPathByLocale(tool, locale),
    };
  }

  if (!isLocalizableToolId(tool.id)) {
    return {
      ...tool,
      canonicalPath: getToolCanonicalPathByLocale(tool, locale),
    };
  }

  const translation = getToolTranslation(locale, tool.id);

  return {
    ...tool,
    ...translation,
    canonicalPath: getToolCanonicalPathByLocale(tool, locale),
  };
};

export const getLocalizedToolsRegistry = (locale: AppLocale): ToolDefinition[] =>
  toolsRegistry.map((tool) => localizeTool(tool, locale));

export const getLocalizedToolBySlug = (
  locale: AppLocale,
  slug: string,
): ToolDefinition | undefined => {
  const baseTool = getToolBySlug(slug);

  if (!baseTool) {
    return undefined;
  }

  return localizeTool(baseTool, locale);
};

export const getLocalizedToolById = (
  locale: AppLocale,
  id: string,
): ToolDefinition | undefined => {
  const baseTool = getToolById(id);

  if (!baseTool) {
    return undefined;
  }

  return localizeTool(baseTool, locale);
};

export const getLocalizedRelatedTools = (
  locale: AppLocale,
  toolId: string,
): ToolDefinition[] =>
  getRelatedTools(toolId).map((tool) => localizeTool(tool, locale));
