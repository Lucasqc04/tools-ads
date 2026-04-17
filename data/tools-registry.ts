import {
  cryptoConverterContentBlocks,
  cryptoConverterFaq,
  cryptoConverterIntro,
} from '@/data/content/crypto-unit-converter';
import {
  devUtilityContentBlocks,
  devUtilityFaq,
  devUtilityIntro,
} from '@/data/content/html-pdf-json';
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
      'Converta satoshi, gwei, wei, lamport, sun, lovelace e outras unidades on-chain sem API externa.',
    category: 'crypto',
    primaryKeyword: 'conversor de unidades cripto',
    secondaryKeywords: [
      'btc para satoshi',
      'gwei para eth',
      'wei para eth',
      'lamport para sol',
      'trx para sun',
      'conversor unidades bitcoin',
      'conversor unidades ethereum',
    ],
    searchIntent:
      'Usuários e devs que querem converter subunidades cripto com precisão sem depender de cotação de mercado.',
    seoTitle:
      'Conversor de Satoshi, Gwei, Wei, Lamport e Unidades Cripto',
    seoDescription:
      'Converta unidades de BTC, ETH, USDT, USDC, SOL, TRX, XRP, ADA e mais ativos localmente no navegador, com precisão e sem envio de dados.',
    h1: 'Conversor de Unidades Cripto (Satoshi, Gwei, Wei, Lamport e mais)',
    intro: cryptoConverterIntro,
    canonicalPath: '/tools/crypto-unit-converter',
    faq: cryptoConverterFaq,
    contentBlocks: cryptoConverterContentBlocks,
    relatedToolIds: ['html-pdf-json', 'qr-code-generator'],
  },
  {
    id: 'html-pdf-json',
    slug: 'html-pdf-json',
    name: 'HTML Viewer + PDF Viewer + JSON Formatter',
    shortDescription:
      'Visualize HTML com sandbox, abra PDF local e formate JSON no navegador.',
    category: 'dev',
    primaryKeyword: 'formatador json online',
    secondaryKeywords: [
      'visualizador html online',
      'abrir pdf no navegador',
      'json minify online',
      'json pretty print',
    ],
    searchIntent:
      'Desenvolvedores e profissionais que precisam inspecionar conteúdo técnico localmente.',
    seoTitle:
      'HTML Viewer, PDF Viewer e Formatador JSON | Ferramenta Online',
    seoDescription:
      'Use um utilitário 3 em 1 para visualizar HTML em sandbox, abrir PDF localmente e formatar ou minificar JSON com validação.',
    h1: 'Utilitário Dev: HTML Viewer, PDF Viewer e JSON Formatter',
    intro: devUtilityIntro,
    canonicalPath: '/tools/html-pdf-json',
    faq: devUtilityFaq,
    contentBlocks: devUtilityContentBlocks,
    relatedToolIds: ['crypto-unit-converter', 'qr-code-generator'],
  },
  {
    id: 'qr-code-generator',
    slug: 'qr-code-generator',
    name: 'Gerador de QR Code com Logo',
    shortDescription:
      'Crie QR Code grátis a partir de texto ou URL, sem cadastro, com logo e download em vários formatos.',
    category: 'utility',
    primaryKeyword: 'gerador de qr code',
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
      'Usuários que querem gerar QR Code rápido, personalizar visual e baixar imagem para uso comercial ou operacional.',
    seoTitle: 'Gerador de QR Code Grátis e Sem Cadastro | PNG, PDF e SVG',
    seoDescription:
      'Gere QR Code online grátis, sem cadastro, sem login e sem pagar nada. Personalize cores, adicione logo central e exporte em PNG, JPEG, WEBP, SVG e PDF.',
    h1: 'Gerador de QR Code Grátis, Sem Cadastro e com Download',
    intro: qrCodeGeneratorIntro,
    canonicalPath: '/tools/qr-code-generator',
    faq: qrCodeGeneratorFaq,
    contentBlocks: qrCodeGeneratorContentBlocks,
    relatedToolIds: ['crypto-unit-converter', 'html-pdf-json'],
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
  | 'html-pdf-json'
  | 'qr-code-generator';

const localizableToolIds = new Set<LocalizableToolId>([
  'crypto-unit-converter',
  'html-pdf-json',
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
