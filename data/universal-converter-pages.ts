import type { AppLocale } from '@/lib/i18n/config';
import { localizePath } from '@/lib/i18n/config';
import type { ContentBlock, FaqItem } from '@/types/content';
import {
  getUniversalConversionById,
  type UniversalConversionId,
} from '@/lib/universal-converter';

export type UniversalConversionLandingPage = {
  slug: string;
  conversionId: UniversalConversionId;
  h1ByLocale: Record<AppLocale, string>;
  introByLocale: Record<AppLocale, string>;
  seoTitleByLocale: Record<AppLocale, string>;
  seoDescriptionByLocale: Record<AppLocale, string>;
  primaryKeywordByLocale: Record<AppLocale, string>;
  secondaryKeywordsByLocale: Record<AppLocale, string[]>;
  searchIntentByLocale: Record<AppLocale, string>;
  exampleInput: string;
  contentBlocksByLocale: Record<AppLocale, ContentBlock[]>;
  faqByLocale: Record<AppLocale, FaqItem[]>;
};

const buildBlocks = (
  locale: AppLocale,
  fromLabel: string,
  toLabel: string,
  dedicatedToolSlug?: string,
): ContentBlock[] => {
  if (locale === 'en') {
    return [
      {
        title: `How ${fromLabel} to ${toLabel} conversion works`,
        paragraphs: [
          `This page opens the universal converter already configured for ${fromLabel} to ${toLabel}. Paste input, convert, and copy the result with one click.`,
          'Validation runs before output generation, so malformed values show clear errors instead of silent failures.',
        ],
      },
      {
        title: 'When to use this conversion',
        paragraphs: [
          `Use this route when you need a focused workflow for ${fromLabel} to ${toLabel}, including batch mode and multi-output support when available.`,
          'The same conversion engine is available on the main universal page, but this dedicated landing keeps intent-specific SEO and UX.',
        ],
      },
      {
        title: 'Limits and privacy',
        paragraphs: [
          'Processing happens locally in-browser whenever supported by the algorithm. Hash outputs are one-way by design and cannot be reversed to original text.',
          dedicatedToolSlug
            ? `There is also a dedicated tool at /tools/${dedicatedToolSlug} for deeper controls.`
            : 'Some educational ciphers are included for study and debugging, not modern security.',
        ],
      },
    ];
  }

  if (locale === 'es') {
    return [
      {
        title: `Como funciona ${fromLabel} para ${toLabel}`,
        paragraphs: [
          `Esta pagina abre el conversor universal ya configurado para ${fromLabel} a ${toLabel}. Pega la entrada, convierte y copia el resultado rapido.`,
          'La validacion ocurre antes de generar salida, mostrando errores claros cuando el formato es invalido.',
        ],
      },
      {
        title: 'Cuando usar esta conversion',
        paragraphs: [
          `Usa esta ruta cuando necesitas un flujo directo de ${fromLabel} a ${toLabel}, con soporte para lote y multiples salidas cuando aplica.`,
          'La misma logica existe en la pagina principal del conversor universal, pero aqui el foco es una intencion especifica.',
        ],
      },
      {
        title: 'Limites y privacidad',
        paragraphs: [
          'El procesamiento ocurre localmente en el navegador cuando el algoritmo lo permite. Hashes son de una sola via y no se revierten a texto original.',
          dedicatedToolSlug
            ? `Tambien existe herramienta dedicada en /tools/${dedicatedToolSlug} para controles avanzados.`
            : 'Cifras clasicas son educativas y no equivalen a seguridad moderna.',
        ],
      },
    ];
  }

  return [
    {
      title: `Como funciona a conversao de ${fromLabel} para ${toLabel}`,
      paragraphs: [
        `Esta pagina abre o conversor universal ja configurado para ${fromLabel} -> ${toLabel}. Cole a entrada, converta e copie o resultado rapidamente.`,
        'A validacao acontece antes do processamento para evitar saidas silenciosas com formato incorreto.',
      ],
    },
    {
      title: 'Quando usar esta rota especifica',
      paragraphs: [
        `Use esta landing quando a intencao de busca for exatamente ${fromLabel} para ${toLabel}, com suporte a lote e multiplas saidas quando disponivel.`,
        'O motor e o mesmo da ferramenta universal principal, mas aqui o fluxo ja chega pre-configurado para acelerar uso e SEO sem query string.',
      ],
    },
    {
      title: 'Limites e privacidade',
      paragraphs: [
        'O processamento ocorre localmente no navegador sempre que o algoritmo permite. Hashes sao de mao unica e nao podem ser revertidos para o texto original.',
        dedicatedToolSlug
          ? `Tambem existe ferramenta dedicada em /tools/${dedicatedToolSlug} para fluxo especializado.`
          : 'Cifras classicas presentes nesta central sao educativas e nao substituem criptografia moderna.',
      ],
    },
  ];
};

const buildFaq = (locale: AppLocale): FaqItem[] => {
  if (locale === 'en') {
    return [
      { question: 'Is this conversion local?', answer: 'Yes. Processing runs in-browser whenever the algorithm supports it.' },
      { question: 'Can I reverse any output?', answer: 'No. Hash outputs are one-way and cannot be reversed.' },
      { question: 'Can I run batch conversions?', answer: 'Yes. The universal converter supports line-by-line batch mode for compatible conversions.' },
      { question: 'Is there a dedicated tool for some formats?', answer: 'Yes. Some formats also have dedicated pages linked as related tools.' },
    ];
  }

  if (locale === 'es') {
    return [
      { question: 'Esta conversion es local?', answer: 'Si. El procesamiento corre en navegador cuando el algoritmo lo permite.' },
      { question: 'Puedo revertir cualquier salida?', answer: 'No. Los hashes son de una sola via.' },
      { question: 'Se puede convertir por lote?', answer: 'Si. El conversor universal permite modo lote para conversiones compatibles.' },
      { question: 'Hay herramientas dedicadas para algunos formatos?', answer: 'Si. Algunas conversiones tambien tienen pagina dedicada.' },
    ];
  }

  return [
    { question: 'Essa conversao roda localmente?', answer: 'Sim. O processamento e local no navegador sempre que o algoritmo suporta.' },
    { question: 'Da para reverter qualquer resultado?', answer: 'Nao. Hashes sao unidirecionais e nao voltam para texto original.' },
    { question: 'Posso converter em lote?', answer: 'Sim. O conversor universal oferece modo lote para conversoes compativeis.' },
    { question: 'Existe ferramenta dedicada para alguns formatos?', answer: 'Sim. Algumas conversoes tem pagina propria e link relacionado.' },
  ];
};

const landing = (
  slug: string,
  conversionId: UniversalConversionId,
  exampleInput: string,
): UniversalConversionLandingPage => {
  const conversion = getUniversalConversionById(conversionId);
  if (!conversion) {
    throw new Error(`Conversao inexistente: ${conversionId}`);
  }

  const fromLabel = conversion.from;
  const toLabel = conversion.to;

  return {
    slug,
    conversionId,
    h1ByLocale: {
      'pt-br': `${fromLabel} para ${toLabel} online`,
      en: `${fromLabel} to ${toLabel} online`,
      es: `${fromLabel} a ${toLabel} online`,
    },
    introByLocale: {
      'pt-br': `Converta ${fromLabel} para ${toLabel} usando o motor universal de conversoes, com validacao clara e copia rapida do resultado.`,
      en: `Convert ${fromLabel} to ${toLabel} using the universal conversion engine with clear validation and quick copy output.`,
      es: `Convierte ${fromLabel} a ${toLabel} usando el motor universal con validacion clara y copia rapida.`,
    },
    seoTitleByLocale: {
      'pt-br': `${fromLabel} para ${toLabel} Online | Conversor Universal`,
      en: `${fromLabel} to ${toLabel} Online | Universal Converter`,
      es: `${fromLabel} a ${toLabel} Online | Conversor Universal`,
    },
    seoDescriptionByLocale: {
      'pt-br': `Ferramenta para ${fromLabel} para ${toLabel} com conversao local, validacao de entrada e suporte a lote quando aplicavel.`,
      en: `Tool for ${fromLabel} to ${toLabel} with local conversion, input validation, and batch mode when available.`,
      es: `Herramienta para ${fromLabel} a ${toLabel} con conversion local, validacion y modo lote cuando aplica.`,
    },
    primaryKeywordByLocale: {
      'pt-br': `${fromLabel} para ${toLabel}`,
      en: `${fromLabel} to ${toLabel}`,
      es: `${fromLabel} a ${toLabel}`,
    },
    secondaryKeywordsByLocale: {
      'pt-br': [
        `converter ${fromLabel} para ${toLabel}`,
        `${fromLabel} para ${toLabel} online`,
        `ferramenta ${fromLabel} ${toLabel}`,
      ],
      en: [
        `convert ${fromLabel} to ${toLabel}`,
        `${fromLabel} to ${toLabel} converter`,
        `${fromLabel} to ${toLabel} tool`,
      ],
      es: [
        `convertir ${fromLabel} a ${toLabel}`,
        `${fromLabel} a ${toLabel} online`,
        `herramienta ${fromLabel} ${toLabel}`,
      ],
    },
    searchIntentByLocale: {
      'pt-br': `Usuarios que precisam converter ${fromLabel} para ${toLabel} rapidamente sem depender de instalacao.`,
      en: `Users looking to convert ${fromLabel} to ${toLabel} quickly without installing software.`,
      es: `Usuarios que necesitan convertir ${fromLabel} a ${toLabel} rapidamente sin instalar software.`,
    },
    exampleInput,
    contentBlocksByLocale: {
      'pt-br': buildBlocks('pt-br', fromLabel, toLabel, conversion.existingDedicatedToolSlug),
      en: buildBlocks('en', fromLabel, toLabel, conversion.existingDedicatedToolSlug),
      es: buildBlocks('es', fromLabel, toLabel, conversion.existingDedicatedToolSlug),
    },
    faqByLocale: {
      'pt-br': buildFaq('pt-br'),
      en: buildFaq('en'),
      es: buildFaq('es'),
    },
  };
};

export const universalConversionLandingPages: UniversalConversionLandingPage[] = [
  landing('texto-para-binario', 'text-to-binary', 'Lucas'),
  landing('binario-para-texto', 'binary-to-text', '01001100 01110101 01100011 01100001 01110011'),
  landing('texto-para-hexadecimal', 'text-to-hex', 'Lucas'),
  landing('hexadecimal-para-texto', 'hex-to-text', '4c75636173'),
  landing('decimal-para-binario', 'decimal-to-binary', '255'),
  landing('binario-para-decimal', 'binary-to-decimal', '11111111'),
  landing('decimal-para-hexadecimal', 'decimal-to-hex', '255'),
  landing('hexadecimal-para-decimal', 'hex-to-decimal', 'ff'),
  landing('texto-para-morse', 'text-to-morse', 'sos teste'),
  landing('morse-para-texto', 'morse-to-text', '... --- ... / - . ... - .'),
  landing('texto-para-sha256', 'text-to-sha256', 'senha-segura'),
  landing('gerador-sha256', 'text-to-sha256', 'senha-segura'),
  landing('texto-para-md5', 'text-to-md5', 'senha-segura'),
  landing('gerador-md5', 'text-to-md5', 'senha-segura'),
  landing('texto-para-sha512', 'text-to-sha512', 'senha-segura'),
  landing('gerador-sha512', 'text-to-sha512', 'senha-segura'),
  landing('cifra-de-cesar', 'text-to-caesar', 'Mensagem secreta'),
  landing('decodificador-cifra-de-cesar', 'caesar-to-text', 'Phqvdjhp vhfuhwd'),
  landing('texto-para-rot13', 'text-to-rot13', 'mensagem'),
  landing('rot13-para-texto', 'rot13-to-text', 'zrafntrz'),
  landing('texto-para-ascii', 'text-to-ascii-dec', 'ABC'),
  landing('ascii-para-texto', 'ascii-dec-to-text', '65 66 67'),
  landing('texto-para-html-entities', 'text-to-html-entities', '<div>texto</div>'),
  landing('html-entities-para-texto', 'html-entities-to-text', '&lt;div&gt;texto&lt;/div&gt;'),
  landing('url-encode', 'text-to-url-encode', 'nome=Lucas Silva'),
  landing('url-decode', 'url-encode-to-text', 'nome%3DLucas%20Silva'),
  landing('conversor-de-bases', 'decimal-to-binary', '1024'),
  landing('conversor-de-cifras', 'text-to-caesar', 'texto de exemplo'),
];

const landingBySlug = new Map(universalConversionLandingPages.map((item) => [item.slug, item]));

export const getUniversalConversionLandingBySlug = (
  slug: string,
): UniversalConversionLandingPage | undefined => landingBySlug.get(slug);

export const getUniversalConversionResolutionBySlug = (
  slug: string,
): {
  page: UniversalConversionLandingPage;
  conversionId: UniversalConversionId;
} | undefined => {
  const page = getUniversalConversionLandingBySlug(slug);
  if (!page) {
    return undefined;
  }

  return {
    page,
    conversionId: page.conversionId,
  };
};

export const getLocalizedUniversalConversionLandingContent = (
  page: UniversalConversionLandingPage,
  locale: AppLocale,
) => ({
  h1: page.h1ByLocale[locale],
  intro: page.introByLocale[locale],
  seoTitle: page.seoTitleByLocale[locale],
  seoDescription: page.seoDescriptionByLocale[locale],
  primaryKeyword: page.primaryKeywordByLocale[locale],
  secondaryKeywords: page.secondaryKeywordsByLocale[locale],
  searchIntent: page.searchIntentByLocale[locale],
  exampleInput: page.exampleInput,
  contentBlocks: page.contentBlocksByLocale[locale],
  faq: page.faqByLocale[locale],
});

export const universalConversionAliasSlugs: string[] = universalConversionLandingPages.map(
  (item) => item.slug,
);

export type UniversalConversionLinkItem = {
  slug: string;
  path: string;
  label: string;
  context: string;
};

export const toLocalizedUniversalConversionLink = (
  page: UniversalConversionLandingPage,
  locale: AppLocale,
): UniversalConversionLinkItem => {
  const conversion = getUniversalConversionById(page.conversionId);
  const label = conversion?.labelByLocale[locale] ?? page.h1ByLocale[locale];

  return {
    slug: page.slug,
    path: localizePath(locale, `/${page.slug}`),
    label,
    context: page.introByLocale[locale],
  };
};

export const getFeaturedUniversalConversionPages = (
  limit = 12,
): UniversalConversionLandingPage[] => universalConversionLandingPages.slice(0, limit);

export const getRelatedUniversalConversionPages = (
  currentSlug: string,
  limit = 8,
): UniversalConversionLandingPage[] =>
  universalConversionLandingPages
    .filter((item) => item.slug !== currentSlug)
    .slice(0, limit);
