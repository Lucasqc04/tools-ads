import {
  getAssetById,
  getUnitById,
  type CryptoAssetId,
  type UnitDefinition,
} from '@/lib/crypto-units';
import { localizePath, type AppLocale } from '@/lib/i18n/config';
import type { ContentBlock, FaqItem } from '@/types/content';

type CryptoConversionSeed = {
  assetId: CryptoAssetId;
  fromUnitId: string;
  toUnitId: string;
  featured?: boolean;
};

export type CryptoSlugVariant = 'technical' | 'ptBr';

export type CryptoConversionPage = {
  slug: string;
  path: string;
  slugTechnical: string;
  pathTechnical: string;
  slugPtBr: string;
  pathPtBr: string;
  assetId: CryptoAssetId;
  assetName: string;
  fromUnitId: string;
  toUnitId: string;
  fromLabel: string;
  toLabel: string;
  title: string;
  intro: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  contentBlocks: ContentBlock[];
  faq: FaqItem[];
  featured: boolean;
};

export type LocalizedCryptoConversionContent = {
  title: string;
  intro: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  contentBlocks: ContentBlock[];
  faq: FaqItem[];
};

export type CryptoConversionLinkItem = {
  slug: string;
  path: string;
  fromLabel: string;
  toLabel: string;
  assetName: string;
};

const BASE_PATH = '/tools/crypto-unit-converter';

const conversionSeeds: CryptoConversionSeed[] = [
  { assetId: 'BTC', fromUnitId: 'sat', toUnitId: 'btc', featured: true },
  { assetId: 'BTC', fromUnitId: 'btc', toUnitId: 'sat', featured: true },
  { assetId: 'BTC', fromUnitId: 'msat', toUnitId: 'sat', featured: true },

  { assetId: 'ETH', fromUnitId: 'gwei', toUnitId: 'eth', featured: true },
  { assetId: 'ETH', fromUnitId: 'wei', toUnitId: 'eth', featured: true },
  { assetId: 'ETH', fromUnitId: 'eth', toUnitId: 'gwei', featured: true },

  { assetId: 'SOL', fromUnitId: 'lamport', toUnitId: 'sol', featured: true },
  { assetId: 'SOL', fromUnitId: 'sol', toUnitId: 'lamport', featured: true },

  { assetId: 'TRX', fromUnitId: 'trx', toUnitId: 'sun', featured: true },
  { assetId: 'TRX', fromUnitId: 'sun', toUnitId: 'trx', featured: true },

  { assetId: 'XRP', fromUnitId: 'xrp', toUnitId: 'drop', featured: true },
  { assetId: 'XRP', fromUnitId: 'drop', toUnitId: 'xrp', featured: true },

  { assetId: 'ADA', fromUnitId: 'ada', toUnitId: 'lovelace', featured: true },
  { assetId: 'ADA', fromUnitId: 'lovelace', toUnitId: 'ada', featured: true },

  { assetId: 'LTC', fromUnitId: 'litoshi', toUnitId: 'ltc', featured: true },

  { assetId: 'USDT', fromUnitId: 'usdt', toUnitId: 'micro-usdt', featured: true },
  { assetId: 'USDC', fromUnitId: 'usdc', toUnitId: 'micro-usdc', featured: true },

  { assetId: 'BNB', fromUnitId: 'gwei', toUnitId: 'bnb' },
  { assetId: 'AVAX', fromUnitId: 'navax', toUnitId: 'avax' },
  { assetId: 'DOT', fromUnitId: 'dot', toUnitId: 'planck' },
  { assetId: 'ATOM', fromUnitId: 'atom', toUnitId: 'uatom' },
  { assetId: 'XMR', fromUnitId: 'xmr', toUnitId: 'piconero' },
  { assetId: 'TON', fromUnitId: 'ton', toUnitId: 'nanoton' },
];

const sanitizeSlugToken = (value: string): string =>
  value
    .trim()
    .replace(/μ/g, 'u')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const toTechnicalSlug = (fromUnitId: string, toUnitId: string): string =>
  `${fromUnitId}-to-${toUnitId}`;

const toPtBrSlug = (fromUnit: UnitDefinition, toUnit: UnitDefinition): string => {
  const fromToken = sanitizeSlugToken(fromUnit.label);
  const toToken = sanitizeSlugToken(toUnit.label);
  return `${fromToken}-para-${toToken}`;
};

const formatBigIntFraction = (unit: UnitDefinition): string => {
  const denominator = unit.factorDenominator ?? 1n;
  if (denominator === 1n) {
    return unit.factorNumerator.toString();
  }

  return `${unit.factorNumerator.toString()}/${denominator.toString()}`;
};

const buildPtBrContentBlocks = (
  assetName: string,
  assetDecimals: number,
  fromUnit: UnitDefinition,
  toUnit: UnitDefinition,
): ContentBlock[] => {
  const fromFactor = formatBigIntFraction(fromUnit);
  const toFactor = formatBigIntFraction(toUnit);

  return [
    {
      title: `Quando usar ${fromUnit.label} para ${toUnit.label}`,
      paragraphs: [
        `Esta página resolve a conversão de ${fromUnit.label} para ${toUnit.label} dentro de ${assetName}, sem depender de cotação de mercado. É útil para conferência técnica, integração de carteiras e validação de valores exibidos em explorers.`,
        'O cálculo acontece no navegador e usa fatores fixos de unidade. Isso mantém consistência para debugging de payloads e elimina ruído de APIs externas de preço.',
      ],
    },
    {
      title: 'Fórmula de conversão e precisão',
      paragraphs: [
        `A conversão usa aritmética racional: valor_em_destino = valor_em_origem × fator(${fromUnit.label}) ÷ fator(${toUnit.label}).`,
        `Para este caso, fator(${fromUnit.label}) = ${fromFactor} e fator(${toUnit.label}) = ${toFactor}. O ativo trabalha com ${assetDecimals} casas decimais de precisão base.`,
      ],
    },
    {
      title: 'Boas práticas para evitar erro de unidade',
      paragraphs: [
        'Sempre valide se os dois lados da conversão pertencem ao mesmo ativo. Conversão de unidade não é troca de ativo.',
        'Em fluxos de smart contract, guarde o valor mínimo da unidade em logs e converta para unidade humana apenas na camada de apresentação.',
      ],
      list: [
        'Use a unidade mínima para cálculos internos.',
        'Exiba unidade legível apenas no front-end.',
        'Revise casas decimais do token/rede antes da liquidação.',
      ],
    },
  ];
};

const buildPtBrFaq = (
  assetName: string,
  assetDecimals: number,
  fromUnit: UnitDefinition,
  toUnit: UnitDefinition,
): FaqItem[] => {
  const faq: FaqItem[] = [
    {
      question: `Como converter ${fromUnit.label} para ${toUnit.label}?`,
      answer: `Digite o valor em ${fromUnit.label}, selecione ${toUnit.label} como destino e o resultado é calculado automaticamente com fatores fixos do ativo ${assetName}.`,
    },
    {
      question: 'Essa página usa preço de mercado?',
      answer:
        'Não. A ferramenta não faz cotação entre moedas. Ela converte apenas unidades internas do mesmo ativo.',
    },
    {
      question: `Qual a precisão considerada para ${assetName}?`,
      answer: `A conversão respeita a escala técnica do ativo, com referência de ${assetDecimals} casas decimais na unidade principal.`,
    },
    {
      question: 'Os dados digitados são enviados para servidor?',
      answer:
        'Não. O processamento é local no navegador para reduzir latência e preservar privacidade.',
    },
  ];

  if (fromUnit.isOffchain || toUnit.isOffchain) {
    faq.push({
      question: 'Conversões off-chain valem para liquidação on-chain?',
      answer:
        'Não necessariamente. Unidades off-chain, como msat na Lightning, são úteis para roteamento/cálculo de canais e não equivalem a uma unidade de liquidação on-chain direta.',
    });
  }

  return faq;
};

const buildConversionPage = (seed: CryptoConversionSeed): CryptoConversionPage | null => {
  const asset = getAssetById(seed.assetId);
  const fromUnit = getUnitById(seed.assetId, seed.fromUnitId);
  const toUnit = getUnitById(seed.assetId, seed.toUnitId);

  if (!fromUnit || !toUnit || fromUnit.id === toUnit.id) {
    return null;
  }

  const slugTechnical = toTechnicalSlug(seed.fromUnitId, seed.toUnitId);
  const slugPtBr = toPtBrSlug(fromUnit, toUnit);

  const pathTechnical = `${BASE_PATH}/${slugTechnical}`;
  const pathPtBr = `${BASE_PATH}/${slugPtBr}`;

  const seoTitle = `${fromUnit.label} para ${toUnit.label} (${asset.id}) | Conversor Online`;
  const seoDescription = `Converta ${fromUnit.label} para ${toUnit.label} no ativo ${asset.name} com cálculo local, sem API externa e com precisão técnica de unidades.`;

  const normalizedFrom = sanitizeSlugToken(fromUnit.label);
  const normalizedTo = sanitizeSlugToken(toUnit.label);

  return {
    slug: slugTechnical,
    path: pathTechnical,
    slugTechnical,
    pathTechnical,
    slugPtBr,
    pathPtBr,
    assetId: asset.id,
    assetName: asset.name,
    fromUnitId: fromUnit.id,
    toUnitId: toUnit.id,
    fromLabel: fromUnit.label,
    toLabel: toUnit.label,
    title: `Conversor de ${fromUnit.label} para ${toUnit.label}`,
    intro: `Faça a conversão de ${fromUnit.label} para ${toUnit.label} em ${asset.name} com atualização em tempo real, processamento local e sem depender de cotação.`,
    seoTitle,
    seoDescription,
    keywords: [
      `${normalizedFrom} para ${normalizedTo}`,
      `${normalizedFrom} to ${normalizedTo}`,
      `${asset.id.toLowerCase()} ${normalizedFrom} ${normalizedTo}`,
      `conversor ${asset.id.toLowerCase()} unidades`,
    ],
    contentBlocks: buildPtBrContentBlocks(asset.name, asset.decimals, fromUnit, toUnit),
    faq: buildPtBrFaq(asset.name, asset.decimals, fromUnit, toUnit),
    featured: seed.featured === true,
  };
};

const pages = conversionSeeds
  .map((seed) => buildConversionPage(seed))
  .filter((page): page is CryptoConversionPage => Boolean(page));

export const cryptoConversionPages: CryptoConversionPage[] = pages;

const technicalSlugMap = new Map(
  cryptoConversionPages.map((page) => [page.slugTechnical, page]),
);

const ptBrSlugMap = new Map(
  cryptoConversionPages.map((page) => [page.slugPtBr, page]),
);

export const getCryptoConversionResolutionBySlug = (
  slug: string,
): { page: CryptoConversionPage; variant: CryptoSlugVariant } | undefined => {
  const technical = technicalSlugMap.get(slug);
  if (technical) {
    return { page: technical, variant: 'technical' };
  }

  const ptBr = ptBrSlugMap.get(slug);
  if (ptBr) {
    return { page: ptBr, variant: 'ptBr' };
  }

  return undefined;
};

export const getCryptoConversionPageBySlug = (
  slug: string,
): CryptoConversionPage | undefined => getCryptoConversionResolutionBySlug(slug)?.page;

export const getCryptoConversionPathByVariant = (
  page: CryptoConversionPage,
  variant: CryptoSlugVariant,
): string => (variant === 'ptBr' ? page.pathPtBr : page.pathTechnical);

export const getPreferredCryptoSlugVariant = (locale: AppLocale): CryptoSlugVariant =>
  locale === 'pt-br' ? 'ptBr' : 'technical';

export const getCryptoConversionPathByLocale = (
  page: CryptoConversionPage,
  locale: AppLocale,
): string => {
  const basePath = getCryptoConversionPathByVariant(
    page,
    getPreferredCryptoSlugVariant(locale),
  );

  return localizePath(locale, basePath);
};

export const getCryptoConversionLocalePathMap = (
  page: CryptoConversionPage,
): Record<AppLocale, string> => ({
  'pt-br': getCryptoConversionPathByLocale(page, 'pt-br'),
  en: getCryptoConversionPathByLocale(page, 'en'),
  es: getCryptoConversionPathByLocale(page, 'es'),
});

const buildLocalizedContentBlocks = (
  locale: AppLocale,
  assetName: string,
  assetDecimals: number,
  fromUnit: UnitDefinition,
  toUnit: UnitDefinition,
): ContentBlock[] => {
  if (locale === 'pt-br') {
    return buildPtBrContentBlocks(assetName, assetDecimals, fromUnit, toUnit);
  }

  const fromFactor = formatBigIntFraction(fromUnit);
  const toFactor = formatBigIntFraction(toUnit);

  if (locale === 'es') {
    return [
      {
        title: `Cuándo usar ${fromUnit.label} a ${toUnit.label}`,
        paragraphs: [
          `Esta página resuelve la conversión de ${fromUnit.label} a ${toUnit.label} dentro de ${assetName}, sin depender de cotizaciones de mercado. Es útil para validación técnica e integración de wallets.`,
          'El cálculo se ejecuta en el navegador con factores fijos de unidad, lo que evita ruido de APIs de precio y mejora consistencia operativa.',
        ],
      },
      {
        title: 'Fórmula de conversión y precisión',
        paragraphs: [
          `La conversión usa aritmética racional: valor_destino = valor_origen × factor(${fromUnit.label}) ÷ factor(${toUnit.label}).`,
          `En este caso, factor(${fromUnit.label}) = ${fromFactor} y factor(${toUnit.label}) = ${toFactor}. El activo utiliza ${assetDecimals} decimales de referencia técnica.`,
        ],
      },
      {
        title: 'Buenas prácticas para evitar errores de unidad',
        paragraphs: [
          'Verifica siempre que ambos lados de la conversión pertenezcan al mismo activo. Convertir unidades no significa intercambiar monedas.',
          'En flujos de smart contracts, almacena unidades mínimas en logs y convierte a unidades legibles solo en la capa de presentación.',
        ],
        list: [
          'Usa la unidad mínima para cálculos internos.',
          'Muestra unidades legibles en el front-end.',
          'Revisa decimales del token/red antes de liquidar.',
        ],
      },
    ];
  }

  return [
    {
      title: `When to use ${fromUnit.label} to ${toUnit.label}`,
      paragraphs: [
        `This page converts ${fromUnit.label} to ${toUnit.label} within ${assetName} without market-rate dependency. It is useful for technical checks, wallet integrations, and explorer value validation.`,
        'The calculation runs in-browser with fixed unit factors, which keeps payload debugging consistent and avoids external pricing noise.',
      ],
    },
    {
      title: 'Conversion formula and precision',
      paragraphs: [
        `The conversion uses rational arithmetic: destination_value = source_value × factor(${fromUnit.label}) ÷ factor(${toUnit.label}).`,
        `For this pair, factor(${fromUnit.label}) = ${fromFactor} and factor(${toUnit.label}) = ${toFactor}. The asset uses ${assetDecimals} base decimal places.`,
      ],
    },
    {
      title: 'Best practices to avoid unit mistakes',
      paragraphs: [
        'Always validate that both units belong to the same asset. Unit conversion is not asset swapping.',
        'In smart contract flows, keep minimal units in logs and convert to human-readable values only at the presentation layer.',
      ],
      list: [
        'Use minimal units for internal math.',
        'Display readable units in the front-end layer.',
        'Check token/network decimals before settlement.',
      ],
    },
  ];
};

const buildLocalizedFaq = (
  locale: AppLocale,
  assetName: string,
  assetDecimals: number,
  fromUnit: UnitDefinition,
  toUnit: UnitDefinition,
): FaqItem[] => {
  if (locale === 'pt-br') {
    return buildPtBrFaq(assetName, assetDecimals, fromUnit, toUnit);
  }

  const faq: FaqItem[] =
    locale === 'es'
      ? [
          {
            question: `¿Cómo convertir ${fromUnit.label} a ${toUnit.label}?`,
            answer: `Ingresa el valor en ${fromUnit.label}, selecciona ${toUnit.label} como destino y el cálculo se realiza automáticamente con factores fijos de ${assetName}.`,
          },
          {
            question: '¿Esta página usa precio de mercado?',
            answer:
              'No. La herramienta no cotiza entre monedas. Solo convierte unidades internas del mismo activo.',
          },
          {
            question: `¿Qué precisión aplica para ${assetName}?`,
            answer: `La conversión respeta la escala técnica del activo, con referencia de ${assetDecimals} decimales en la unidad principal.`,
          },
          {
            question: '¿Los datos se envían al servidor?',
            answer:
              'No. El procesamiento ocurre localmente en el navegador para reducir latencia y proteger privacidad.',
          },
        ]
      : [
          {
            question: `How do I convert ${fromUnit.label} to ${toUnit.label}?`,
            answer: `Enter the value in ${fromUnit.label}, select ${toUnit.label} as destination, and the result is calculated automatically with fixed ${assetName} unit factors.`,
          },
          {
            question: 'Does this page use market prices?',
            answer:
              'No. This tool does not quote between currencies. It only converts internal units of the same asset.',
          },
          {
            question: `What precision is considered for ${assetName}?`,
            answer: `The converter follows the asset technical scale, using ${assetDecimals} decimals as the primary reference.`,
          },
          {
            question: 'Is my input sent to a server?',
            answer:
              'No. Processing is local in your browser to keep latency low and privacy high.',
          },
        ];

  if (fromUnit.isOffchain || toUnit.isOffchain) {
    faq.push(
      locale === 'es'
        ? {
            question: '¿Las conversiones off-chain sirven para liquidación on-chain?',
            answer:
              'No siempre. Unidades off-chain como msat en Lightning son útiles para enrutamiento/cálculo y no equivalen a liquidación on-chain directa.',
          }
        : {
            question: 'Do off-chain conversions represent direct on-chain settlement?',
            answer:
              'Not always. Off-chain units such as msat in Lightning are useful for routing and channel math, but they are not a direct base-chain settlement unit.',
          },
    );
  }

  return faq;
};

export const getLocalizedCryptoConversionContent = (
  page: CryptoConversionPage,
  locale: AppLocale,
): LocalizedCryptoConversionContent => {
  const asset = getAssetById(page.assetId);
  const fromUnit = getUnitById(page.assetId, page.fromUnitId);
  const toUnit = getUnitById(page.assetId, page.toUnitId);

  if (!fromUnit || !toUnit) {
    return {
      title: page.title,
      intro: page.intro,
      seoTitle: page.seoTitle,
      seoDescription: page.seoDescription,
      keywords: page.keywords,
      contentBlocks: page.contentBlocks,
      faq: page.faq,
    };
  }

  const normalizedFrom = sanitizeSlugToken(fromUnit.label);
  const normalizedTo = sanitizeSlugToken(toUnit.label);

  if (locale === 'pt-br') {
    return {
      title: `Conversor de ${fromUnit.label} para ${toUnit.label}`,
      intro: `Faça a conversão de ${fromUnit.label} para ${toUnit.label} em ${asset.name} com atualização em tempo real, processamento local e sem depender de cotação.`,
      seoTitle: `${fromUnit.label} para ${toUnit.label} (${asset.id}) | Conversor Online`,
      seoDescription: `Converta ${fromUnit.label} para ${toUnit.label} no ativo ${asset.name} com cálculo local, sem API externa e com precisão técnica de unidades.`,
      keywords: [
        `${normalizedFrom} para ${normalizedTo}`,
        `${normalizedFrom} to ${normalizedTo}`,
        `${asset.id.toLowerCase()} ${normalizedFrom} ${normalizedTo}`,
        `conversor ${asset.id.toLowerCase()} unidades`,
      ],
      contentBlocks: buildLocalizedContentBlocks(
        'pt-br',
        asset.name,
        asset.decimals,
        fromUnit,
        toUnit,
      ),
      faq: buildLocalizedFaq('pt-br', asset.name, asset.decimals, fromUnit, toUnit),
    };
  }

  if (locale === 'es') {
    return {
      title: `Conversor de ${fromUnit.label} a ${toUnit.label}`,
      intro: `Convierte ${fromUnit.label} a ${toUnit.label} en ${asset.name} en tiempo real, con procesamiento local y sin depender de cotizaciones.`,
      seoTitle: `${fromUnit.label} a ${toUnit.label} (${asset.id}) | Conversor Online`,
      seoDescription: `Convierte ${fromUnit.label} a ${toUnit.label} en ${asset.name} con cálculo local, sin API externa y con precisión técnica de unidades.`,
      keywords: [
        `${normalizedFrom} a ${normalizedTo}`,
        `${normalizedFrom} to ${normalizedTo}`,
        `${asset.id.toLowerCase()} ${normalizedFrom} ${normalizedTo}`,
        `conversor ${asset.id.toLowerCase()} unidades`,
      ],
      contentBlocks: buildLocalizedContentBlocks(
        'es',
        asset.name,
        asset.decimals,
        fromUnit,
        toUnit,
      ),
      faq: buildLocalizedFaq('es', asset.name, asset.decimals, fromUnit, toUnit),
    };
  }

  return {
    title: `${fromUnit.label} to ${toUnit.label} Converter`,
    intro: `Convert ${fromUnit.label} to ${toUnit.label} in ${asset.name} with real-time local processing and no market-rate dependency.`,
    seoTitle: `${fromUnit.label} to ${toUnit.label} (${asset.id}) | Online Converter`,
    seoDescription: `Convert ${fromUnit.label} to ${toUnit.label} in ${asset.name} with local calculation, no external API, and precise unit math.`,
    keywords: [
      `${normalizedFrom} to ${normalizedTo}`,
      `${normalizedFrom} converter`,
      `${asset.id.toLowerCase()} ${normalizedFrom} ${normalizedTo}`,
      `${asset.id.toLowerCase()} unit converter`,
    ],
    contentBlocks: buildLocalizedContentBlocks('en', asset.name, asset.decimals, fromUnit, toUnit),
    faq: buildLocalizedFaq('en', asset.name, asset.decimals, fromUnit, toUnit),
  };
};

export const toCryptoConversionLink = (
  page: CryptoConversionPage,
  variant: CryptoSlugVariant,
): CryptoConversionLinkItem => ({
  slug: page.slug,
  path: getCryptoConversionPathByVariant(page, variant),
  fromLabel: page.fromLabel,
  toLabel: page.toLabel,
  assetName: page.assetName,
});

export const toLocalizedCryptoConversionLink = (
  page: CryptoConversionPage,
  locale: AppLocale,
): CryptoConversionLinkItem => ({
  slug: page.slug,
  path: getCryptoConversionPathByLocale(page, locale),
  fromLabel: page.fromLabel,
  toLabel: page.toLabel,
  assetName: page.assetName,
});

export const getCryptoConversionStaticParams = (): Array<{ conversionSlug: string }> =>
  cryptoConversionPages.flatMap((page) => [
    { conversionSlug: page.slugTechnical },
    { conversionSlug: page.slugPtBr },
  ]);

export const getFeaturedCryptoConversionPages = (
  limit = 4,
): CryptoConversionPage[] =>
  cryptoConversionPages.filter((page) => page.featured).slice(0, limit);

export const getRelatedCryptoConversionPages = (
  slug: string,
  limit = 4,
): CryptoConversionPage[] => {
  const current = getCryptoConversionPageBySlug(slug);

  if (!current) {
    return getFeaturedCryptoConversionPages(limit);
  }

  const sameAsset = cryptoConversionPages.filter(
    (page) => page.slug !== slug && page.assetId === current.assetId,
  );

  if (sameAsset.length >= limit) {
    return sameAsset.slice(0, limit);
  }

  const fallbacks = cryptoConversionPages.filter(
    (page) => page.slug !== slug && page.assetId !== current.assetId && page.featured,
  );

  return [...sameAsset, ...fallbacks].slice(0, limit);
};
