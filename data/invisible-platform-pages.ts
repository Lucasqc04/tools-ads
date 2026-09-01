import {
  compatibilityLabelByLocale,
  getInvisibleCombinationById,
  getInvisiblePlatformBySlug,
  invisiblePlatforms,
  type InvisiblePlatform,
} from '@/lib/invisible-character';
import { localizePath, type AppLocale } from '@/lib/i18n/config';
import type { ContentBlock, FaqItem } from '@/types/content';

export type InvisiblePlatformSlugVariant = 'ptBr' | 'en' | 'es' | 'zh';

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
  slugZh: string;
  pathPtBr: string;
  pathEn: string;
  pathEs: string;
  pathZh: string;
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

const toZhSlug = (platformSlug: string): string => `invisible-character-${platformSlug}`;

const buildPage = (platform: InvisiblePlatform): InvisiblePlatformPage => {
  const slugPtBr = toPtBrSlug(platform.slug);
  const slugEn = toEnSlug(platform.slug);
  const slugEs = toEsSlug(platform.slug);
  const slugZh = toZhSlug(platform.slug);

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
    slugZh,
    pathPtBr: `/${slugPtBr}`,
    pathEn: `/${slugEn}`,
    pathEs: `/${slugEs}`,
    pathZh: `/${slugZh}`,
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

const zhSlugMap = new Map(invisiblePlatformPages.map((page) => [page.slugZh, page]));

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

  const zh = zhSlugMap.get(slug);
  if (zh) {
    return { page: zh, variant: 'zh' };
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

  if (variant === 'zh') {
    return page.pathZh;
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

  if (locale === 'zh') {
    return 'zh';
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

  if (variant === 'zh') {
    return page.slugZh;
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
  zh: getInvisiblePlatformPathByLocale(page, 'zh'),
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
  zh: {
    game: '在线游戏',
    social: '社交平台',
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

  if (locale === 'zh') {
    return [
      ...localizedHints,
      `${platform.name} 隐藏字符`,
      `${platform.name} 隐藏昵称`,
      '空白字符复制',
      '隐藏字符生成器',
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
          `This page is optimized for ${categoryLabel} workflows. Start with the recommended pattern, then use the 20 ready-to-copy variants if validation fails.`,
          platformHint,
        ],
        list: [
          'Copy a predefined invisible sequence.',
          'Generate variants before, after, between, around, or without a visible nickname.',
          'Paste into the target profile field and validate.',
          'If blocked, switch to another sequence and retry.',
        ],
      },
      {
        title: 'Why this page is different from generic lists',
        paragraphs: [
          'Instead of showing only one blank character, this page combines game-specific recommendations, nickname generation, a Unicode matrix, and invisible character detection.',
          'Use the detector to inspect incoming text, confirm whether hidden Unicode characters are present, and copy a cleaned version before you save your profile name.',
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
          `Esta pagina esta orientada a ${categoryLabel}. Empieza con el patron recomendado y usa las 20 variantes listas si la validacion falla.`,
          platformHint,
        ],
        list: [
          'Copia una secuencia invisible de la lista.',
          'Genera variantes antes, despues, entre letras, alrededor o sin nickname visible.',
          'Pega en el campo del juego o red social y valida.',
          'Si bloquea, cambia de secuencia y vuelve a intentar.',
        ],
      },
      {
        title: 'Ventajas practicas frente a una lista generica',
        paragraphs: [
          'En lugar de mostrar un solo espacio en blanco, esta pagina combina contexto de la plataforma, recomendaciones, matriz Unicode, generador de variantes y detector de caracteres invisibles.',
          'Asi puedes probar alternativas, limpiar texto oculto y reducir intentos fallidos al editar tu perfil.',
        ],
      },
    ];
  }

  if (locale === 'zh') {
    return [
      {
        title: `${platform.name} 隐藏字符怎么用最有效`,
        paragraphs: [
          `${platform.name} 对用户名和显示名称有自己的一套验证规则,结果可能因账号地区、账号年限、防作弊策略和游戏版本而不同。`,
          `当前兼容情况:${compatibilityLabel}。建议先尝试的组合:${recommendedLabel}。`,
        ],
      },
      {
        title: '如何安全测试后再确定昵称',
        paragraphs: [
          `本页面已针对${categoryLabel}场景优化。先使用推荐组合,如果验证失败,可以尝试下方20个现成的隐藏字符变体。`,
          platformHint,
        ],
        list: [
          '复制一个现成的隐藏字符组合。',
          '在昵称前面、后面、中间或完全替代昵称,生成不同的变体。',
          '粘贴到目标资料字段中并进行验证。',
          '如果被拦截,更换另一种组合再次尝试。',
        ],
      },
      {
        title: '为什么这个页面比普通列表更实用',
        paragraphs: [
          '这里不只是提供一个空白字符,而是结合了针对具体游戏或平台的建议、昵称生成器、Unicode 字符表以及隐藏字符检测工具。',
          '你可以用检测工具查看文本中是否包含隐藏的 Unicode 字符,并在保存昵称前先复制一份清理后的版本。',
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
        `Esta pagina foi otimizada para ${categoryLabel}. Comece pelo padrao recomendado e use as 20 variantes prontas se a validacao falhar.`,
        platformHint,
      ],
      list: [
        'Copie um caractere ou combinacao invisivel pronta.',
        'Gere variantes antes, depois, entre letras, em volta ou sem nickname visivel.',
        'Cole no campo do perfil e valide.',
        'Se bloquear, troque o padrao e teste novamente.',
      ],
    },
    {
      title: 'Por que esta pagina e mais util que uma lista generica',
      paragraphs: [
        'Aqui voce nao recebe apenas uma lista estatica: ha recomendacao por plataforma, gerador de variantes, matriz Unicode e detector de caracteres invisiveis para auditoria.',
        'Esse contexto reduz tentativa e erro, permite limpar texto oculto e oferece alternativas quando jogos e redes sociais mudam seus filtros.',
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
          'Many validators enforce minimum length or block specific Unicode points. Testing multiple ready variants can bypass strict single-char checks.',
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
          'Muchos validadores exigen longitud minima o bloquean puntos Unicode especificos. Probar varias variantes listas suele mejorar el resultado.',
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

  if (locale === 'zh') {
    return [
      {
        question: `隐藏昵称在 ${platform.name} 上有效吗?`,
        answer: `是否有效取决于当前的验证规则。${platform.name} 的兼容程度为:${compatibilityLabelByLocale.zh[platform.compatibility]}。`,
      },
      {
        question: '为什么单个隐藏字符会失败,而多个组合却能通过?',
        answer:
          '很多验证机制要求昵称达到最小长度,或者会拦截特定的 Unicode 字符。尝试多个现成的组合通常能提高通过率。',
      },
      {
        question: '这个工具免费吗?',
        answer: '是的,复制、生成和测试隐藏字符完全免费,无需注册。',
      },
      {
        question: '我输入的内容会发送到服务器吗?',
        answer: '默认不会。字符的生成和检测都在你的浏览器本地完成。',
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
        'Muitos validadores exigem tamanho minimo de nickname ou bloqueiam pontos Unicode isolados. Testar varias variantes prontas pode aumentar a taxa de aprovacao.',
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

  if (locale === 'zh') {
    return {
      title: '隐藏字符生成器',
      intro: '为游戏和社交平台复制或生成隐藏文本。',
      seoTitle: '隐藏字符复制粘贴',
      seoDescription: '为游戏和社交应用生成多种 Unicode 隐藏字符模式的隐藏名称。',
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
      intro: `Copy and generate invisible nicknames for ${platform.name} with 20 ready variants, Unicode options, detector, and compatibility testing flows.`,
      seoTitle: `Invisible Character for ${platform.name} | Copy and Paste`,
      seoDescription: `Copy invisible character for ${platform.name}, generate 20 nickname variants, inspect Unicode, and test patterns that may pass validation. Current compatibility: ${compatibilityLabel}.`,
      keywords,
      contentBlocks: buildContentBlocks('en', platform),
      faq: buildFaq('en', platform),
    };
  }

  if (locale === 'es') {
    return {
      title: `Caracter Invisible para ${platform.name} (Copiar y Pegar)`,
      intro: `Copia y genera nombres invisibles para ${platform.name} con 20 variantes listas, patrones Unicode, detector y pruebas por validacion.`,
      seoTitle: `Caracter Invisible para ${platform.name} | Copiar y Pegar`,
      seoDescription: `Copia caracter invisible para ${platform.name}, genera 20 variantes de nickname, inspecciona Unicode y prueba patrones que pueden pasar validacion. Compatibilidad actual: ${compatibilityLabel}.`,
      keywords,
      contentBlocks: buildContentBlocks('es', platform),
      faq: buildFaq('es', platform),
    };
  }

  if (locale === 'zh') {
    return {
      title: `${platform.name} 隐藏字符(复制粘贴)`,
      intro: `为 ${platform.name} 复制或生成隐藏昵称,提供20个现成变体、Unicode 选项、检测工具和兼容性测试流程。`,
      seoTitle: `${platform.name} 隐藏字符 | 复制粘贴`,
      seoDescription: `复制适用于 ${platform.name} 的隐藏字符,生成20个昵称变体,查看 Unicode 字符,并测试可能通过验证的组合。当前兼容情况:${compatibilityLabel}。`,
      keywords,
      contentBlocks: buildContentBlocks('zh', platform),
      faq: buildFaq('zh', platform),
    };
  }

  return {
    title: `Caractere Invisivel para ${platform.name} (Copiar e Colar)`,
    intro: `Copie e gere nome invisivel para ${platform.name} com 20 variantes prontas, padroes Unicode, detector e fluxo de teste por validacao.`,
    seoTitle: `Caractere Invisivel para ${platform.name} | Copiar e Colar`,
    seoDescription: `Copie caractere invisivel para ${platform.name}, gere 20 variantes de nickname, inspecione Unicode e teste combinacoes que podem passar na validacao. Compatibilidade atual: ${compatibilityLabel}.`,
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
