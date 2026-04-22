import {
  compatibilityLabelByLocale,
  getInvisibleCombinationById,
  getInvisiblePlatformBySlug,
  invisiblePlatforms,
  type InvisiblePlatform,
} from '@/lib/invisible-character';
import { localizePath, type AppLocale } from '@/lib/i18n/config';
import type { ContentBlock, FaqItem } from '@/types/content';

export type InvisiblePlatformSlugVariant = 'ptBr' | 'en' | 'es';

export type InvisiblePlatformPage = {
  slug: string;
  platformId: string;
  platformSlug: string;
  platformName: string;
  category: InvisiblePlatform['category'];
  compatibility: InvisiblePlatform['compatibility'];
  featured: boolean;
  recommendedCombinationId: string;
  slugPtBr: string;
  slugEn: string;
  slugEs: string;
  pathPtBr: string;
  pathEn: string;
  pathEs: string;
};

export type LocalizedInvisiblePlatformContent = {
  title: string;
  intro: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  contentBlocks: ContentBlock[];
  faq: FaqItem[];
};

export type InvisiblePlatformLinkItem = {
  slug: string;
  path: string;
  name: string;
  compatibilityLabel: string;
  categoryLabel: string;
};

const toPtBrSlug = (platformSlug: string): string => `caractere-invisivel-${platformSlug}`;

const toEnSlug = (platformSlug: string): string => `invisible-character-${platformSlug}`;

const toEsSlug = (platformSlug: string): string => `caracter-invisible-${platformSlug}`;

const buildPage = (platform: InvisiblePlatform): InvisiblePlatformPage => {
  const slugPtBr = toPtBrSlug(platform.slug);
  const slugEn = toEnSlug(platform.slug);
  const slugEs = toEsSlug(platform.slug);

  return {
    slug: slugPtBr,
    platformId: platform.id,
    platformSlug: platform.slug,
    platformName: platform.name,
    category: platform.category,
    compatibility: platform.compatibility,
    featured: platform.featured,
    recommendedCombinationId: platform.recommendedCombinationId,
    slugPtBr,
    slugEn,
    slugEs,
    pathPtBr: `/${slugPtBr}`,
    pathEn: `/${slugEn}`,
    pathEs: `/${slugEs}`,
  };
};

export const invisiblePlatformPages: InvisiblePlatformPage[] = invisiblePlatforms.map((platform) =>
  buildPage(platform),
);

const ptBrSlugMap = new Map(
  invisiblePlatformPages.map((page) => [page.slugPtBr, page]),
);

const enSlugMap = new Map(invisiblePlatformPages.map((page) => [page.slugEn, page]));

const esSlugMap = new Map(invisiblePlatformPages.map((page) => [page.slugEs, page]));

export const getInvisiblePlatformResolutionBySlug = (
  slug: string,
): { page: InvisiblePlatformPage; variant: InvisiblePlatformSlugVariant } | undefined => {
  const ptBr = ptBrSlugMap.get(slug);
  if (ptBr) {
    return { page: ptBr, variant: 'ptBr' };
  }

  const en = enSlugMap.get(slug);
  if (en) {
    return { page: en, variant: 'en' };
  }

  const es = esSlugMap.get(slug);
  if (es) {
    return { page: es, variant: 'es' };
  }

  return undefined;
};

export const getInvisiblePlatformPageBySlug = (
  slug: string,
): InvisiblePlatformPage | undefined => getInvisiblePlatformResolutionBySlug(slug)?.page;

export const getInvisiblePlatformPathByVariant = (
  page: InvisiblePlatformPage,
  variant: InvisiblePlatformSlugVariant,
): string => {
  if (variant === 'en') {
    return page.pathEn;
  }

  if (variant === 'es') {
    return page.pathEs;
  }

  return page.pathPtBr;
};

export const getPreferredInvisiblePlatformSlugVariant = (
  locale: AppLocale,
): InvisiblePlatformSlugVariant => {
  if (locale === 'en') {
    return 'en';
  }

  if (locale === 'es') {
    return 'es';
  }

  return 'ptBr';
};

export const getInvisiblePlatformSlugByLocale = (
  page: InvisiblePlatformPage,
  locale: AppLocale,
): string => {
  const variant = getPreferredInvisiblePlatformSlugVariant(locale);

  if (variant === 'en') {
    return page.slugEn;
  }

  if (variant === 'es') {
    return page.slugEs;
  }

  return page.slugPtBr;
};

export const getInvisiblePlatformPathByLocale = (
  page: InvisiblePlatformPage,
  locale: AppLocale,
): string => localizePath(locale, getInvisiblePlatformPathByVariant(page, getPreferredInvisiblePlatformSlugVariant(locale)));

export const getInvisiblePlatformLocalePathMap = (
  page: InvisiblePlatformPage,
): Record<AppLocale, string> => ({
  'pt-br': getInvisiblePlatformPathByLocale(page, 'pt-br'),
  en: getInvisiblePlatformPathByLocale(page, 'en'),
  es: getInvisiblePlatformPathByLocale(page, 'es'),
});

const categoryLabelByLocale: Record<AppLocale, Record<InvisiblePlatform['category'], string>> = {
  'pt-br': {
    game: 'Jogo online',
    social: 'Rede social',
  },
  en: {
    game: 'Online game',
    social: 'Social network',
  },
  es: {
    game: 'Juego online',
    social: 'Red social',
  },
};

const buildKeywords = (
  locale: AppLocale,
  platform: InvisiblePlatform,
): string[] => {
  const localizedHints = platform.seoKeywordHints?.[locale] ?? [];

  if (locale === 'en') {
    return [
      ...localizedHints,
      `invisible character ${platform.name.toLowerCase()}`,
      `invisible username ${platform.name.toLowerCase()}`,
      'blank character copy paste',
      'invisible username generator',
    ];
  }

  if (locale === 'es') {
    return [
      ...localizedHints,
      `caracter invisible ${platform.name.toLowerCase()}`,
      `nombre invisible ${platform.name.toLowerCase()}`,
      'letra invisible copiar',
      'caracter invisible para juegos',
    ];
  }

  return [
    ...localizedHints,
    `caractere invisivel ${platform.name.toLowerCase()}`,
    `espaco invisivel ${platform.name.toLowerCase()}`,
    `nome invisivel ${platform.name.toLowerCase()}`,
    'letra invisivel copiar',
    'caractere invisivel para jogos',
  ];
};

const buildContentBlocks = (
  locale: AppLocale,
  platform: InvisiblePlatform,
): ContentBlock[] => {
  const recommended = getInvisibleCombinationById(platform.recommendedCombinationId);
  const recommendedLabel = recommended?.label ?? 'Combinacao recomendada';
  const compatibilityLabel = compatibilityLabelByLocale[locale][platform.compatibility];
  const categoryLabel = categoryLabelByLocale[locale][platform.category];
  const platformHint = platform.validationHint[locale];

  if (locale === 'en') {
    return [
      {
        title: `Invisible character for ${platform.name}: what works best`,
        paragraphs: [
          `${platform.name} uses its own validation flow for usernames and display names. Results can vary by account age, region, anti-abuse rules, and game version.`,
          `Current scenario: ${compatibilityLabel}. Recommended test pattern: ${recommendedLabel}.`,
        ],
      },
      {
        title: 'How to test safely before finalizing your nickname',
        paragraphs: [
          `This page is optimized for ${categoryLabel} workflows. Always test 1 pattern, then 2, 3, and 4-character variants if validation fails.`,
          platformHint,
        ],
        list: [
          'Copy a predefined invisible sequence.',
          'Try a 2, 3, or 4-character generated nickname.',
          'Paste into the target profile field and validate.',
          'If blocked, switch to another sequence and retry.',
        ],
      },
      {
        title: 'Why this page is different from generic lists',
        paragraphs: [
          'Instead of showing only one blank character, this page combines game-specific recommendations, pattern generation, and invisible character detection.',
          'Use the detector to inspect incoming text and confirm whether hidden Unicode characters are present before you save your profile name.',
        ],
      },
    ];
  }

  if (locale === 'es') {
    return [
      {
        title: `Caracter invisible para ${platform.name}: que suele funcionar`,
        paragraphs: [
          `${platform.name} aplica validaciones propias para nombre de usuario y nombre visible. El resultado puede cambiar por region, cuenta y actualizaciones.`,
          `Estado actual: ${compatibilityLabel}. Patron recomendado: ${recommendedLabel}.`,
        ],
      },
      {
        title: 'Como probar sin perder tiempo',
        paragraphs: [
          `Esta pagina esta orientada a ${categoryLabel}. Si falla, prueba variantes de 2, 3 y 4 caracteres invisibles.`,
          platformHint,
        ],
        list: [
          'Copia una secuencia invisible de la lista.',
          'Genera un nombre con 2, 3 o 4 caracteres.',
          'Pega en el campo del juego o red social y valida.',
          'Si bloquea, cambia de secuencia y vuelve a intentar.',
        ],
      },
      {
        title: 'Ventaja SEO y uso real',
        paragraphs: [
          'Esta pagina evita contenido generico: trae contexto por plataforma, recomendaciones dinamicas y detector de caracteres invisibles.',
          'Asi mejoras tasa de acierto y reduces intentos fallidos al editar tu perfil.',
        ],
      },
    ];
  }

  return [
    {
      title: `Caractere invisivel para ${platform.name}: o que tende a funcionar`,
      paragraphs: [
        `${platform.name} possui validacoes proprias para nickname e nome de exibicao. O resultado pode mudar conforme regiao, tipo de conta, versao do app e regras anti-abuso.`,
        `Cenario atual: ${compatibilityLabel}. Padrao recomendado para começar: ${recommendedLabel}.`,
      ],
    },
    {
      title: 'Como usar sem perder tempo com tentativa e erro',
      paragraphs: [
        `Esta pagina foi otimizada para ${categoryLabel}. Se 1 padrao falhar, teste variacoes com 2, 3 e 4 caracteres invisiveis em sequencia.`,
        platformHint,
      ],
      list: [
        'Copie um caractere ou combinacao invisivel pronta.',
        'Gere automaticamente um nome invisivel com 2, 3 ou 4 caracteres.',
        'Cole no campo do perfil e valide.',
        'Se bloquear, troque o padrao e teste novamente.',
      ],
    },
    {
      title: 'Por que esta pagina rankeia melhor que listas genericas',
      paragraphs: [
        'Aqui voce nao recebe apenas uma lista estatica: ha recomendacao por plataforma, gerador de padroes e detector de caracteres invisiveis para auditoria.',
        'Esse contexto reduz erro operacional, melhora UX e aumenta chance de sucesso em jogos e redes sociais com filtros variaveis.',
      ],
    },
  ];
};

const buildFaq = (locale: AppLocale, platform: InvisiblePlatform): FaqItem[] => {
  if (locale === 'en') {
    return [
      {
        question: `Does invisible nickname work on ${platform.name}?`,
        answer: `It may work depending on current validation rules. Compatibility level for ${platform.name} is ${compatibilityLabelByLocale.en[platform.compatibility]}.`,
      },
      {
        question: 'Why does one invisible character fail but multiple can pass?',
        answer:
          'Many validators enforce minimum length or block specific Unicode points. Using 2-4 characters can bypass strict single-char checks.',
      },
      {
        question: 'Is this tool free?',
        answer:
          'Yes. You can copy, generate, and test invisible characters for free with no mandatory sign-up.',
      },
      {
        question: 'Are my inputs sent to a server?',
        answer: 'No by default. Character generation and detection run locally in your browser.',
      },
    ];
  }

  if (locale === 'es') {
    return [
      {
        question: `¿Funciona nombre invisible en ${platform.name}?`,
        answer: `Puede funcionar segun reglas actuales. Nivel de compatibilidad para ${platform.name}: ${compatibilityLabelByLocale.es[platform.compatibility]}.`,
      },
      {
        question: '¿Por que 1 caracter falla y 2 o 3 pueden pasar?',
        answer:
          'Muchos validadores exigen longitud minima o bloquean puntos Unicode especificos. Secuencias de 2-4 caracteres suelen mejorar el resultado.',
      },
      {
        question: '¿La herramienta es gratis?',
        answer: 'Si. Puedes copiar y generar caracteres invisibles gratis y sin registro obligatorio.',
      },
      {
        question: '¿Los datos se envian al servidor?',
        answer: 'No por defecto. La deteccion y generacion ocurren localmente en el navegador.',
      },
    ];
  }

  return [
    {
      question: `Nome invisivel funciona no ${platform.name}?`,
      answer: `Pode funcionar dependendo da validacao atual. Nivel de compatibilidade do ${platform.name}: ${compatibilityLabelByLocale['pt-br'][platform.compatibility]}.`,
    },
    {
      question: 'Por que 1 caractere invisivel falha e 2 ou 3 podem passar?',
      answer:
        'Muitos validadores exigem tamanho minimo de nickname ou bloqueiam pontos Unicode isolados. Usar sequencias de 2 a 4 caracteres pode aumentar a taxa de aprovacao.',
    },
    {
      question: 'Essa ferramenta de caractere invisivel e gratis?',
      answer:
        'Sim. Copiar, gerar e testar caractere invisivel e gratuito, sem cadastro obrigatorio.',
    },
    {
      question: 'Meu texto e enviado para servidor?',
      answer: 'Nao por padrao. A geracao e deteccao de invisiveis acontecem localmente no navegador.',
    },
  ];
};

const buildFallbackLocalizedContent = (
  locale: AppLocale,
): LocalizedInvisiblePlatformContent => {
  if (locale === 'en') {
    return {
      title: 'Invisible Character Generator',
      intro: 'Copy and generate invisible text for games and social networks.',
      seoTitle: 'Invisible Character Copy and Paste',
      seoDescription:
        'Generate invisible names with multiple Unicode patterns for games and social apps.',
      keywords: [],
      contentBlocks: [],
      faq: [],
    };
  }

  if (locale === 'es') {
    return {
      title: 'Generador de Caracter Invisible',
      intro: 'Copia y genera texto invisible para juegos y redes sociales.',
      seoTitle: 'Caracter Invisible Copiar y Pegar',
      seoDescription:
        'Genera nombres invisibles con multiples patrones Unicode para juegos y redes sociales.',
      keywords: [],
      contentBlocks: [],
      faq: [],
    };
  }

  return {
    title: 'Gerador de Caractere Invisivel',
    intro: 'Copie e gere texto invisivel para jogos e redes sociais.',
    seoTitle: 'Caractere Invisivel Copiar e Colar',
    seoDescription:
      'Gere nomes invisiveis com multiplos padroes Unicode para jogos e redes sociais.',
    keywords: [],
    contentBlocks: [],
    faq: [],
  };
};

const buildLocalizedContentForPlatform = (
  locale: AppLocale,
  platform: InvisiblePlatform,
  keywords: string[],
): LocalizedInvisiblePlatformContent => {
  const compatibilityLabel = compatibilityLabelByLocale[locale][platform.compatibility];

  if (locale === 'en') {
    return {
      title: `Invisible Character for ${platform.name} (Copy and Paste)`,
      intro: `Copy and generate invisible nicknames for ${platform.name} with multiple Unicode options and compatibility testing flows.`,
      seoTitle: `Invisible Character for ${platform.name} | Copy and Paste`,
      seoDescription: `Copy invisible character for ${platform.name}, generate 2-4 character variants, and test Unicode patterns that may pass nickname validation. Current compatibility: ${compatibilityLabel}.`,
      keywords,
      contentBlocks: buildContentBlocks('en', platform),
      faq: buildFaq('en', platform),
    };
  }

  if (locale === 'es') {
    return {
      title: `Caracter Invisible para ${platform.name} (Copiar y Pegar)`,
      intro: `Copia y genera nombres invisibles para ${platform.name} con multiples patrones Unicode y pruebas por validacion.`,
      seoTitle: `Caracter Invisible para ${platform.name} | Copiar y Pegar`,
      seoDescription: `Copia caracter invisible para ${platform.name}, genera variantes con 2 a 4 caracteres y prueba secuencias Unicode que pueden pasar validacion. Compatibilidad actual: ${compatibilityLabel}.`,
      keywords,
      contentBlocks: buildContentBlocks('es', platform),
      faq: buildFaq('es', platform),
    };
  }

  return {
    title: `Caractere Invisivel para ${platform.name} (Copiar e Colar)`,
    intro: `Copie e gere nome invisivel para ${platform.name} com multiplos padroes Unicode e fluxo de teste por validacao.`,
    seoTitle: `Caractere Invisivel para ${platform.name} | Copiar e Colar`,
    seoDescription: `Copie caractere invisivel para ${platform.name}, gere variacoes com 2, 3 e 4 caracteres e teste combinacoes Unicode que podem passar na validacao. Compatibilidade atual: ${compatibilityLabel}.`,
    keywords,
    contentBlocks: buildContentBlocks('pt-br', platform),
    faq: buildFaq('pt-br', platform),
  };
};

export const getLocalizedInvisiblePlatformContent = (
  page: InvisiblePlatformPage,
  locale: AppLocale,
): LocalizedInvisiblePlatformContent => {
  const platform = getInvisiblePlatformBySlug(page.platformSlug);

  if (!platform) {
    return buildFallbackLocalizedContent(locale);
  }

  return buildLocalizedContentForPlatform(locale, platform, buildKeywords(locale, platform));
};

export const toLocalizedInvisiblePlatformLink = (
  page: InvisiblePlatformPage,
  locale: AppLocale,
): InvisiblePlatformLinkItem => ({
  slug: page.slug,
  path: getInvisiblePlatformPathByLocale(page, locale),
  name: page.platformName,
  compatibilityLabel: compatibilityLabelByLocale[locale][page.compatibility],
  categoryLabel: categoryLabelByLocale[locale][page.category],
});

export const getFeaturedInvisiblePlatformPages = (limit = 6): InvisiblePlatformPage[] =>
  invisiblePlatformPages.filter((page) => page.featured).slice(0, limit);

export const getRelatedInvisiblePlatformPages = (
  slug: string,
  limit = 6,
): InvisiblePlatformPage[] => {
  const current = getInvisiblePlatformPageBySlug(slug);

  if (!current) {
    return getFeaturedInvisiblePlatformPages(limit);
  }

  const sameCategory = invisiblePlatformPages.filter(
    (page) => page.slug !== current.slug && page.category === current.category,
  );

  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit);
  }

  const fallbacks = invisiblePlatformPages.filter(
    (page) => page.slug !== current.slug && page.featured,
  );

  return [...sameCategory, ...fallbacks].slice(0, limit);
};

export const getInvisiblePlatformStaticParamsByLocale = (
  locale: AppLocale,
): Array<{ platformPageSlug: string }> =>
  invisiblePlatformPages.map((page) => ({
    platformPageSlug: getInvisiblePlatformSlugByLocale(page, locale),
  }));
