import {
  cpfGeneratorContentBlocks,
  cpfGeneratorFaq,
  cpfGeneratorIntro,
} from '@/data/content/cpf-generator';
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
  imageConverterContentBlocks,
  imageConverterFaq,
  imageConverterIntro,
} from '@/data/content/image-converter';
import {
  jsonFormatterContentBlocks,
  jsonFormatterFaq,
  jsonFormatterIntro,
} from '@/data/content/json-formatter';
import {
  pdfViewerContentBlocks,
  pdfViewerFaq,
  pdfViewerIntro,
} from '@/data/content/pdf-viewer';
import {
  qrCodeGeneratorContentBlocks,
  qrCodeGeneratorFaq,
  qrCodeGeneratorIntro,
} from '@/data/content/qr-code-generator';
import { getToolTranslation } from '@/data/i18n/tool-translations';
import { localizePath, type AppLocale } from '@/lib/i18n/config';
import type { ToolDefinition } from '@/types/tool';

export const toolsRegistry: ToolDefinition[] = [
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
    relatedToolIds: ['pdf-viewer', 'json-formatter', 'image-converter'],
  },
  {
    id: 'pdf-viewer',
    slug: 'pdf-viewer',
    name: 'PDF Viewer Local',
    shortDescription:
      'Abra e visualize PDFs localmente no navegador, grátis, sem cadastro, sem login e com opção de nova aba.',
    category: 'documents',
    primaryKeyword: 'pdf viewer online gratis',
    secondaryKeywords: [
      'abrir pdf no navegador',
      'visualizar pdf online',
      'pdf preview local',
      'leitor de pdf online',
      'visualizador pdf sem cadastro',
      'abrir pdf sem login',
    ],
    searchIntent:
      'Usuários que precisam abrir e revisar PDFs rápido, grátis e sem cadastro.',
    seoTitle: 'PDF Viewer Online Grátis | Abrir PDF no Navegador Sem Cadastro',
    seoDescription:
      'Visualize arquivos PDF localmente no navegador, grátis, sem cadastro e sem login, com abertura em nova aba e layout responsivo.',
    h1: 'PDF Viewer Local Grátis, Sem Cadastro e Sem Login',
    intro: pdfViewerIntro,
    canonicalPath: '/tools/pdf-viewer',
    faq: pdfViewerFaq,
    contentBlocks: pdfViewerContentBlocks,
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
    relatedToolIds: ['html-viewer', 'pdf-viewer', 'image-converter'],
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
    relatedToolIds: ['json-formatter', 'qr-code-generator', 'image-converter'],
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
    relatedToolIds: ['pdf-viewer', 'html-viewer', 'qr-code-generator'],
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
    relatedToolIds: ['image-converter', 'pdf-viewer', 'json-formatter'],
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

type LocalizableToolId =
  | 'crypto-unit-converter'
  | 'html-viewer'
  | 'pdf-viewer'
  | 'json-formatter'
  | 'cpf-generator'
  | 'image-converter'
  | 'qr-code-generator';

const localizableToolIds = new Set<LocalizableToolId>([
  'crypto-unit-converter',
  'html-viewer',
  'pdf-viewer',
  'json-formatter',
  'cpf-generator',
  'image-converter',
  'qr-code-generator',
]);

const isLocalizableToolId = (toolId: string): toolId is LocalizableToolId =>
  localizableToolIds.has(toolId as LocalizableToolId);

const localizeTool = (tool: ToolDefinition, locale: AppLocale): ToolDefinition => {
  if (locale === 'pt-br') {
    return {
      ...tool,
      canonicalPath: localizePath(locale, tool.canonicalPath),
    };
  }

  if (!isLocalizableToolId(tool.id)) {
    return {
      ...tool,
      canonicalPath: localizePath(locale, tool.canonicalPath),
    };
  }

  const translation = getToolTranslation(locale, tool.id);

  return {
    ...tool,
    ...translation,
    canonicalPath: localizePath(locale, tool.canonicalPath),
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
