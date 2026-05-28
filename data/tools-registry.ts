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
  invisibleCharacterContentBlocks,
  invisibleCharacterFaq,
  invisibleCharacterIntro,
} from '@/data/content/invisible-character';
import {
  videoCompressionContentBlocks,
  videoCompressionFaq,
  videoCompressionIntro,
} from '@/data/content/video-compression';
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

export const toolsRegistry: ToolDefinition[] = [
  {
    id: 'bitcoin-wallet',
    slug: 'bitcoin-wallet',
    name: 'Carteira Bitcoin Testnet e Mainnet',
    shortDescription:
      'Gere carteira Bitcoin, importe seed/WIF, veja saldo e UTXOs e envie BTC em testnet ou mainnet usando mempool API.',
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
      'Usuarios e devs que precisam criar ou importar carteira Bitcoin e enviar transacoes com processamento local no navegador.',
    seoTitle:
      'Carteira Bitcoin Testnet/Mainnet | Gerar, Importar e Enviar BTC',
    seoDescription:
      'Crie carteira Bitcoin com seed BIP39, importe WIF, consulte saldo e UTXOs e envie BTC em testnet ou mainnet com assinatura local. Gratis, sem cadastro.',
    h1: 'Carteira Bitcoin Testnet e Mainnet com Envio Local de BTC',
    intro: bitcoinWalletIntro,
    canonicalPath: '/tools/bitcoin-wallet',
    faq: bitcoinWalletFaq,
    contentBlocks: bitcoinWalletContentBlocks,
    relatedToolIds: ['crypto-unit-converter', 'json-formatter', 'qr-code-generator'],
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
    relatedToolIds: ['image-converter', 'html-viewer', 'json-formatter'],
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
      'Veja preview de links para redes sociais, valide tags OG/Twitter e gere snippets HTML e Next.js.',
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
    seoTitle: 'Open Graph Preview Online | Testar Link e Gerar Meta Tags',
    seoDescription:
      'Visualize previews de link para Facebook, LinkedIn, WhatsApp e X, valide Open Graph/Twitter Card e gere meta tags HTML e metadata Next.js.',
    h1: 'Open Graph Preview Online com Diagnostico e Gerador de Meta Tags',
    intro: openGraphPreviewIntro,
    canonicalPath: '/tools/open-graph-preview',
    faq: openGraphPreviewFaq,
    contentBlocks: openGraphPreviewContentBlocks,
    relatedToolIds: ['json-formatter', 'html-viewer', 'markdown-editor', 'url-encoder-decoder'],
  },
  {
    id: 'cpf-generator',
    slug: 'cpf-generator',
    name: 'Criador de CPF Válido',
    shortDescription:
      'Gere CPF válido para testes com opção com ou sem pontuação, grátis, sem cadastro e com cópia rápida.',
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
      'Crie CPF válido online para testes com opção com ou sem pontuação, geração em lote e cópia rápida, grátis, sem cadastro e sem login.',
    h1: 'Gerador de CPF Válido Grátis, Sem Cadastro e Com Cópia Rápida',
    intro: cpfGeneratorIntro,
    canonicalPath: '/tools/cpf-generator',
    faq: cpfGeneratorFaq,
    contentBlocks: cpfGeneratorContentBlocks,
    relatedToolIds: ['gerador-pessoa-fake', 'json-formatter', 'qr-code-generator'],
  },
  {
    id: 'gerador-pessoa-fake',
    slug: 'gerador-pessoa-fake',
    name: 'Gerador de Pessoa Fake para Testes',
    shortDescription:
      'Gere identidade ficticia coerente com CPF valido, RG, email, telefone, endereco, idade e nascimento para desenvolvimento e QA.',
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
      'Devs, QAs e analistas que precisam gerar pessoas ficticias coerentes para testar formularios, APIs, banco de dados e automacoes.',
    seoTitle:
      'Gerador de Pessoa Fake para Testes | CPF, RG, Email, Telefone e Endereco',
    seoDescription:
      'Crie pessoas ficticias coerentes para testes com CPF valido, RG, idade, nascimento, estado, cidade, DDD, CEP e exportacao em JSON, CSV e SQL.',
    h1: 'Gerador de Pessoa Fake para Testes com CPF, RG e Endereco Coerente',
    intro: fakePersonGeneratorIntro,
    canonicalPath: '/tools/gerador-pessoa-fake',
    faq: fakePersonGeneratorFaq,
    contentBlocks: fakePersonGeneratorContentBlocks,
    relatedToolIds: ['cpf-generator', 'json-formatter', 'password-generator'],
  },
  {
    id: 'password-generator',
    slug: 'password-generator',
    name: 'Gerador de Senha Forte',
    shortDescription:
      'Crie senha forte com tamanho personalizado e combinacao de letras, numeros e simbolos, gratis e sem cadastro.',
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
      'Usuarios que precisam gerar senha forte rapidamente para contas pessoais, profissionais e testes de sistema.',
    seoTitle: 'Gerador de Senha Forte Gratis | Com Letras, Numeros e Simbolos',
    seoDescription:
      'Gere senha forte online com tamanho personalizado, escolha de caracteres, regeneracao automatica e botao de copiar. Gratis, sem cadastro e sem login.',
    h1: 'Gerador de Senha Forte Gratis, Sem Cadastro e Com Copia Rapida',
    intro: passwordGeneratorIntro,
    canonicalPath: '/tools/password-generator',
    faq: passwordGeneratorFaq,
    contentBlocks: passwordGeneratorContentBlocks,
    relatedToolIds: ['cpf-generator', 'json-formatter', 'qr-code-generator'],
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
      'Converta mais de 20 formatos de imagem e PDF no navegador, grátis, sem cadastro, sem login e com download imediato.',
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
      'Conversor de Imagem e PDF Grátis (20+ formatos) | Sem Cadastro',
    seoDescription:
      'Converta imagens e PDFs online com processamento local, sem cadastro, sem login e com fluxo rápido para desktop e mobile.',
    h1: 'Conversor de Imagem e PDF Grátis, Sem Cadastro, Sem Login e Rápido',
    intro: imageConverterIntro,
    canonicalPath: '/tools/image-converter',
    faq: imageConverterFaq,
    contentBlocks: imageConverterContentBlocks,
    relatedToolIds: ['html-viewer', 'qr-code-generator'],
  },
  {
    id: 'image-compression',
    slug: 'image-compression',
    name: 'Compressor de Imagem em Lote',
    shortDescription:
      'Comprima varias imagens online, ajuste nivel de compressao, veja estimativa de tamanho e preview antes de baixar.',
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
      'Usuarios que precisam reduzir tamanho de imagem rapido, com controle de compressao e preview antes do download.',
    seoTitle:
      'Compressor de Imagem Online Gratis em Lote | Reduzir Tamanho com Preview',
    seoDescription:
      'Comprima varias imagens de uma vez com controle de nivel, estimativa de tamanho final, preview antes/depois e download rapido. Gratis, sem cadastro e sem login.',
    h1: 'Compressor de Imagem em Lote Gratis com Preview e Controle de Compressao',
    intro: imageCompressionIntro,
    canonicalPath: '/tools/image-compression',
    faq: imageCompressionFaq,
    contentBlocks: imageCompressionContentBlocks,
    relatedToolIds: ['image-converter', 'image-to-base64', 'video-compression'],
  },
  {
    id: 'video-compression',
    slug: 'video-compression',
    name: 'Compressor de Video Online',
    shortDescription:
      'Comprima videos online em lote, ajuste nivel, veja estimativa de tamanho e preview antes de baixar.',
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
      'Usuarios que querem reduzir tamanho de video com controle de compressao, mantendo preview antes do download.',
    seoTitle:
      'Compressor de Video Online Gratis | Reduzir Tamanho',
    seoDescription:
      'Comprima varios videos online com controle de nivel, estimativa de tamanho final, preview antes/depois e download local. Gratis, sem cadastro e sem login.',
    h1: 'Compressor de Video Online Gratis com Preview Antes do Download',
    intro: videoCompressionIntro,
    canonicalPath: '/tools/video-compression',
    faq: videoCompressionFaq,
    contentBlocks: videoCompressionContentBlocks,
    relatedToolIds: ['image-compression', 'image-converter'],
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
    seoTitle: 'Gerador de QR Code Grátis, Sem Cadastro e Sem Login | PNG, PDF e SVG',
    seoDescription:
      'Gere QR Code online grátis, sem cadastro, sem login e sem pagar nada. Personalize cores, adicione logo central e exporte em PNG, JPEG, WEBP, SVG e PDF.',
    h1: 'Gerador de QR Code Grátis, Sem Cadastro, Sem Login e com Download',
    intro: qrCodeGeneratorIntro,
    canonicalPath: '/tools/qr-code-generator',
    faq: qrCodeGeneratorFaq,
    contentBlocks: qrCodeGeneratorContentBlocks,
    relatedToolIds: ['image-converter', 'json-formatter'],
  },
  {
    id: 'gerador-link-whatsapp-telegram',
    slug: 'gerador-link-whatsapp-telegram',
    name: 'Gerador de Link com Mensagem para WhatsApp e Telegram',
    shortDescription:
      'Gere link pronto para WhatsApp e Telegram com mensagem predefinida usando numero ou @nick.',
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
      'Crie link de WhatsApp e Telegram com mensagem pronta. Informe numero ou @nick, personalize o texto e copie o link final.',
    h1: 'Gerador de Link para WhatsApp e Telegram com Mensagem Pronta',
    intro: whatsappTelegramLinkIntro,
    canonicalPath: '/tools/gerador-link-whatsapp-telegram',
    faq: whatsappTelegramLinkFaq,
    contentBlocks: whatsappTelegramLinkContentBlocks,
    relatedToolIds: ['qr-code-generator', 'url-encoder-decoder', 'open-graph-preview'],
  },
  {
    id: 'sorteador',
    slug: 'sorteador',
    name: 'Sorteador Online Completo',
    shortDescription:
      'Sortear nomes e numeros online com parsing inteligente, roleta visual, multiplos resultados e compartilhamento por link.',
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
      'Sorteador Online Completo | Sortear Nomes, Numeros e Roleta',
    seoDescription:
      'Use o sorteador online para nomes e numeros com auto-deteccao de separador, sorteio com/sem repeticao, roleta animada, CSV e link compartilhavel.',
    h1: 'Sorteador Online de Nomes e Numeros com Modo Roleta',
    intro: sorteadorIntro,
    canonicalPath: '/tools/sorteador',
    faq: sorteadorFaq,
    contentBlocks: sorteadorContentBlocks,
    relatedToolIds: ['calculadora-juros-compostos', 'password-generator', 'qr-code-generator'],
  },
  {
    id: 'contador-de-caracteres',
    slug: 'contador-de-caracteres',
    name: 'Contador de Caracteres e Palavras Online',
    shortDescription:
      'Conte caracteres, palavras, linhas, frases, paragrafos, emojis e limites para SEO, redes sociais, redacao e programacao.',
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
    seoTitle:
      'Contador de Caracteres e Palavras Online | SEO, Instagram, X, YouTube e Redacao',
    seoDescription:
      'Ferramenta completa para contar caracteres, palavras, linhas, frases, emojis, hashtags e limites por plataforma com analise e exportacao.',
    h1: 'Contador de Caracteres e Palavras Online',
    intro: characterCounterIntro,
    canonicalPath: '/tools/contador-de-caracteres',
    faq: characterCounterFaq,
    contentBlocks: characterCounterContentBlocks,
    relatedToolIds: ['markdown-editor', 'json-formatter', 'invisible-character', 'sorteador'],
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
    name: 'Regex Tester Online',
    shortDescription:
      'Teste regex em tempo real com flags, destaque de matches, grupos capturados e preview de substituicao.',
    category: 'dev',
    primaryKeyword: 'regex tester online',
    secondaryKeywords: [
      'testar regex',
      'regex javascript online',
      'regex replace tester',
      'regex groups',
      'validar expressao regular',
    ],
    searchIntent:
      'Devs e estudantes que precisam validar expressoes regulares, capturas e substituicoes em texto real.',
    seoTitle: 'Regex Tester Online | Matches, Grupos e Replace',
    seoDescription:
      'Ferramenta para testar regex com flags, destaque visual de matches, grupos capturados, posicoes e replace preview.',
    h1: 'Regex Tester Online com Matches e Substituicao',
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
      'Gere UUID v1-v7, NanoID, ULID, KSUID, CUID2 e ObjectId em lote com copia rapida e exportacao TXT/CSV.',
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
      'Crie IDs com UUID (todas as versoes), NanoID, ULID, KSUID, CUID2 e ObjectId. Copie e exporte em TXT e CSV.',
    h1: 'Gerador de UUID, ULID, KSUID, CUID2 e NanoID Online',
    intro: uuidNanoIdIntro,
    canonicalPath: '/tools/gerador-de-uuid-e-nanoid',
    faq: uuidNanoIdFaq,
    contentBlocks: uuidNanoIdContentBlocks,
    relatedToolIds: ['password-generator', 'json-formatter', 'base64-image-viewer', 'conversor-unix-timestamp'],
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
      'Converta titulos e frases em slugs amigaveis com controle de separador, limite de tamanho e preview da URL final.',
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
    seoTitle: 'Gerador de Slug para URL Online | Criar Slug Amigavel',
    seoDescription:
      'Gere slug para URL removendo acentos e simbolos, ajuste separador, limite tamanho e copie URL completa.',
    h1: 'Gerador de Slug para URL',
    intro: slugGeneratorIntro,
    canonicalPath: '/tools/gerador-de-slug',
    faq: slugGeneratorFaq,
    contentBlocks: slugGeneratorContentBlocks,
    relatedToolIds: ['remover-acentos', 'url-encoder-decoder', 'contador-de-caracteres', 'json-formatter'],
  },
  {
    id: 'remover-acentos',
    slug: 'remover-acentos',
    name: 'Remover Acentos de Texto',
    shortDescription:
      'Remova acentos, cedilha e caracteres especiais para padronizar texto em URLs, arquivos e sistemas.',
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
    seoTitle: 'Remover Acentos de Texto Online | Texto Sem Acentuacao',
    seoDescription:
      'Converta texto com acentos para versao normalizada com opcoes de caixa, simbolos, emojis e modo slug.',
    h1: 'Remover Acentos de Texto Online',
    intro: removeAccentsIntro,
    canonicalPath: '/tools/remover-acentos',
    faq: removeAccentsFaq,
    contentBlocks: removeAccentsContentBlocks,
    relatedToolIds: ['gerador-de-slug', 'url-encoder-decoder', 'contador-de-caracteres', 'markdown-editor'],
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
      'Simule juros compostos com aporte mensal, descubra aporte para meta e taxa necessaria com grafico, tabela e comparacao com juros simples.',
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
      'Usuarios que precisam calcular crescimento de patrimonio com juros compostos e comparar cenarios para investimento, meta financeira e planejamento de prazo.',
    seoTitle:
      'Calculadora de Juros Compostos Online | Simulador com Aporte Mensal',
    seoDescription:
      'Calcule juros compostos com valor inicial, aporte mensal, taxa e prazo. Veja valor final, juros totais, grafico, tabela, comparacao com juros simples e metas.',
    h1: 'Calculadora de Juros Compostos Online com Aporte Mensal',
    intro: compoundInterestIntro,
    canonicalPath: '/tools/calculadora-juros-compostos',
    faq: compoundInterestFaq,
    contentBlocks: compoundInterestContentBlocks,
    relatedToolIds: ['sorteador', 'crypto-unit-converter', 'json-formatter'],
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
    relatedToolIds: ['qr-code-generator', 'password-generator', 'json-formatter'],
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
      'Descubra seu IP publico, provedor (ISP), cidade aproximada, pais e informacoes do dispositivo. Consulta via servico publico, sem passar pelo nosso servidor.',
    h1: 'Descubra seu IP Público e Informações do Dispositivo',
    intro: descobrirIpPublicoIntro,
    canonicalPath: '/tools/descobrir-ip-publico',
    faq: descobrirIpPublicoFaq,
    contentBlocks: descobrirIpPublicoContentBlocks,
    relatedToolIds: ['json-formatter', 'qr-code-generator'],
  },
  {
    id: 'email-temporario',
    slug: 'email-temporario',
    name: 'E-mail Temporario',
    shortDescription:
      'Gere e-mail descartavel para receber mensagens por 1 hora, com inbox temporaria e expiracao automatica.',
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
    seoTitle: 'E-mail Temporário Grátis',
    seoDescription:
      'Crie um e-mail temporario gratis para receber mensagens por tempo limitado. Inbox descartavel para testes, cadastros rapidos e privacidade.',
    h1: 'E-mail Temporário',
    intro: emailTemporarioIntro,
    canonicalPath: '/tools/email-temporario',
    faq: emailTemporarioFaq,
    contentBlocks: emailTemporarioContentBlocks,
    relatedToolIds: ['password-generator', 'gerador-pessoa-fake', 'descobrir-ip-publico'],
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
  | 'video-compression'
  | 'qr-code-generator'
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
  'video-compression',
  'qr-code-generator',
  'sorteador',
  'calculadora-juros-compostos',
  'invisible-character',
  'descobrir-ip-publico',
  'email-temporario',
]);

const isLocalizableToolId = (toolId: string): toolId is LocalizableToolId =>
  localizableToolIds.has(toolId as LocalizableToolId);

const localizeTool = (tool: ToolDefinition, locale: AppLocale): ToolDefinition => {
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
