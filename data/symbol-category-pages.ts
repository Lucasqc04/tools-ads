import {
  getSymbolCategoryById,
  symbolCategories,
  type SymbolCategory,
} from '@/lib/symbols-to-copy';
import { localizePath, type AppLocale } from '@/lib/i18n/config';
import type { ContentBlock, FaqItem } from '@/types/content';

export type SymbolCategoryPage = {
  categoryId: string;
  categoryLabel: string;
  featured: boolean;
  slugPtBr: string;
  slugEn: string;
  slugEs: string;
  slugZh: string;
};

export type SymbolCategoryResolution = {
  page: SymbolCategoryPage;
  sourceLocale: AppLocale;
};

export type LocalizedSymbolCategoryContent = {
  title: string;
  intro: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  contentBlocks: ContentBlock[];
  faq: FaqItem[];
};

export type SymbolCategoryLinkItem = {
  slug: string;
  path: string;
  name: string;
  description: string;
};

const FEATURED_CATEGORY_IDS = new Set(['arrows', 'hearts', 'stars', 'math']);

const toPtBrSlug = (category: SymbolCategory): string =>
  `simbolos-de-${category.slugWordByLocale['pt-br']}`;

const toEnSlug = (category: SymbolCategory): string =>
  `${category.slugWordByLocale.en}-symbols`;

const toEsSlug = (category: SymbolCategory): string =>
  `simbolos-de-${category.slugWordByLocale.es}`;

const toZhSlug = (category: SymbolCategory): string =>
  `${category.slugWordByLocale.en}-symbols`;

const buildPage = (category: SymbolCategory): SymbolCategoryPage => ({
  categoryId: category.id,
  categoryLabel: category.labelByLocale['pt-br'],
  featured: FEATURED_CATEGORY_IDS.has(category.id),
  slugPtBr: toPtBrSlug(category),
  slugEn: toEnSlug(category),
  slugEs: toEsSlug(category),
  slugZh: toZhSlug(category),
});

export const symbolCategoryPages: SymbolCategoryPage[] = symbolCategories.map(buildPage);

const pageMaps: Record<AppLocale, Map<string, SymbolCategoryPage>> = {
  'pt-br': new Map(symbolCategoryPages.map((page) => [page.slugPtBr, page])),
  en: new Map(symbolCategoryPages.map((page) => [page.slugEn, page])),
  es: new Map(symbolCategoryPages.map((page) => [page.slugEs, page])),
  zh: new Map(symbolCategoryPages.map((page) => [page.slugZh, page])),
};

export const getSymbolCategoryResolutionBySlug = (
  slug: string,
): SymbolCategoryResolution | undefined => {
  for (const sourceLocale of ['pt-br', 'en', 'es', 'zh'] as const) {
    const page = pageMaps[sourceLocale].get(slug);
    if (page) {
      return { page, sourceLocale };
    }
  }

  return undefined;
};

export const getSymbolCategorySlugByLocale = (
  page: SymbolCategoryPage,
  locale: AppLocale,
): string => {
  if (locale === 'en') {
    return page.slugEn;
  }

  if (locale === 'es') {
    return page.slugEs;
  }

  if (locale === 'zh') {
    return page.slugZh;
  }

  return page.slugPtBr;
};

export const getSymbolCategoryPathByLocale = (
  page: SymbolCategoryPage,
  locale: AppLocale,
): string => localizePath(locale, `/${getSymbolCategorySlugByLocale(page, locale)}`);

export const getSymbolCategoryLocalePathMap = (
  page: SymbolCategoryPage,
): Record<AppLocale, string> => ({
  'pt-br': getSymbolCategoryPathByLocale(page, 'pt-br'),
  en: getSymbolCategoryPathByLocale(page, 'en'),
  es: getSymbolCategoryPathByLocale(page, 'es'),
  zh: getSymbolCategoryPathByLocale(page, 'zh'),
});

const toEnglishPhrase = (word: string): string =>
  word
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const buildKeywords = (locale: AppLocale, category: SymbolCategory): string[] => {
  const word = category.slugWordByLocale[locale];

  if (locale === 'en') {
    return [
      `${word} symbols`,
      `${word} symbols copy and paste`,
      `${word} symbol to copy`,
      `copy paste ${word} symbols`,
      'symbols to copy and paste',
    ];
  }

  if (locale === 'es') {
    return [
      `simbolos de ${word}`,
      `simbolos ${word} copiar y pegar`,
      `simbolo de ${word} para copiar`,
      `copiar y pegar simbolos de ${word}`,
      'simbolos para copiar y pegar',
    ];
  }

  if (locale === 'zh') {
    return [
      `${word} 符号`,
      `${word} 符号复制粘贴`,
      `复制 ${word} 符号`,
      `${word} 符号大全`,
      '可复制符号大全',
    ];
  }

  return [
    `simbolos de ${word}`,
    `simbolos ${word} copiar e colar`,
    `simbolo de ${word} para copiar`,
    `copiar e colar simbolos de ${word}`,
    'simbolos para copiar e colar',
  ];
};

const buildContentBlocks = (locale: AppLocale, category: SymbolCategory): ContentBlock[] => {
  const label = category.labelByLocale[locale];
  const sampleSymbols = category.symbols.slice(0, 8).join(' ');

  if (locale === 'en') {
    const enPhrase = toEnglishPhrase(category.slugWordByLocale.en);

    return [
      {
        title: `${enPhrase} symbols ready to copy`,
        paragraphs: [
          `This page opens the symbol catalog with the ${label} category already selected, including characters like ${sampleSymbols}. Click any symbol to copy it instantly, or search for another category using the box at the top.`,
          'Switch the format toggle to copy the raw character, the HTML entity, or the Unicode codepoint, and use the sequence builder to combine several symbols into one string before copying everything at once.',
        ],
      },
      {
        title: `Where to use ${enPhrase.toLowerCase()} symbols`,
        paragraphs: [
          `${enPhrase} symbols are plain Unicode text, so they work anywhere text is accepted: social media bios and posts, usernames, spreadsheets, presentations, documents, and website source code.`,
        ],
        list: [
          'Copy one symbol at a time with a single click.',
          'Build a sequence combining several symbols before copying.',
          'Save favorites for quick access next time.',
          'Switch to HTML entity format for website code.',
        ],
      },
      {
        title: 'Font and device compatibility',
        paragraphs: [
          `Most ${enPhrase.toLowerCase()} symbols are part of the standard Unicode set and display consistently across modern browsers, phones, and apps. A few less common characters may render differently depending on the active font — try a nearby alternative from the same category if one doesn't display correctly.`,
        ],
      },
      {
        title: 'Local and private',
        paragraphs: [
          'Search, favorites, history, and copying all run locally in your browser. No typed text or selected symbol is sent to a server.',
        ],
      },
    ];
  }

  if (locale === 'es') {
    return [
      {
        title: `Símbolos de ${label.toLowerCase()} listos para copiar`,
        paragraphs: [
          `Esta página abre el catálogo de símbolos con la categoría ${label} ya seleccionada, incluyendo caracteres como ${sampleSymbols}. Haz clic en cualquier símbolo para copiarlo al instante, o busca otra categoría usando el cuadro de arriba.`,
          'Cambia el formato para copiar el carácter puro, la entidad HTML o el codepoint Unicode, y usa el armador de secuencias para combinar varios símbolos en una sola cadena antes de copiar todo de una vez.',
        ],
      },
      {
        title: `Dónde usar símbolos de ${label.toLowerCase()}`,
        paragraphs: [
          `Los símbolos de ${label.toLowerCase()} son texto Unicode normal, así que funcionan en cualquier lugar que acepte texto: bios y posts de redes sociales, nombres de usuario, hojas de cálculo, presentaciones, documentos y código fuente de sitios web.`,
        ],
        list: [
          'Copia un símbolo a la vez con un solo clic.',
          'Arma una secuencia combinando varios símbolos antes de copiar.',
          'Guarda favoritos para acceso rápido la próxima vez.',
          'Cambia al formato de entidad HTML para código de sitios web.',
        ],
      },
      {
        title: 'Compatibilidad con fuentes y dispositivos',
        paragraphs: [
          `La mayoría de los símbolos de ${label.toLowerCase()} forman parte del estándar Unicode y se muestran de forma consistente en navegadores, celulares y apps modernas. Algunos caracteres menos comunes pueden verse distintos según la fuente activa: prueba una alternativa cercana de la misma categoría si uno no se muestra bien.`,
        ],
      },
      {
        title: 'Local y privado',
        paragraphs: [
          'La búsqueda, los favoritos, el historial y la copia funcionan completamente en tu navegador. Ningún texto escrito ni símbolo seleccionado se envía a un servidor.',
        ],
      },
    ];
  }

  if (locale === 'zh') {
    return [
      {
        title: `可直接复制的${label}符号`,
        paragraphs: [
          `本页面会打开符号目录,并已默认选中「${label}」分类,包含 ${sampleSymbols} 等字符。点击任意符号即可立即复制,也可以使用顶部的搜索框查找其他分类。`,
          '切换格式按钮可以复制原始字符、HTML 实体或 Unicode 编码点,还可以使用组合序列功能,将多个符号合并成一个字符串后一次性复制。',
        ],
      },
      {
        title: `${label}符号可以用在哪里`,
        paragraphs: [
          `${label}符号是普通的 Unicode 文本,因此适用于任何支持文本的地方:社交媒体简介和帖子、用户名、电子表格、演示文稿、文档,以及网站源代码。`,
        ],
        list: [
          '点击一次即可复制单个符号。',
          '在复制前先组合多个符号形成一个序列。',
          '保存收藏,方便下次快速使用。',
          '切换为 HTML 实体格式,用于网站代码。',
        ],
      },
      {
        title: '字体与设备兼容性',
        paragraphs: [
          `大多数${label}符号都属于标准 Unicode 字符集,在现代浏览器、手机和应用中显示效果一致。少数不常见的字符可能会因当前字体而显示不同——如果某个符号显示不正常,可以尝试同一分类中相近的替代符号。`,
        ],
      },
      {
        title: '本地处理,保护隐私',
        paragraphs: [
          '搜索、收藏、历史记录和复制操作都在你的浏览器本地完成。输入的文字或选中的符号都不会发送到服务器。',
        ],
      },
    ];
  }

  return [
    {
      title: `Símbolos de ${label.toLowerCase()} prontos para copiar`,
      paragraphs: [
        `Esta página abre o catálogo de símbolos com a categoria ${label} já selecionada, incluindo caracteres como ${sampleSymbols}. Clique em qualquer símbolo para copiar instantaneamente, ou busque outra categoria usando o campo no topo.`,
        'Alterne o formato para copiar o caractere puro, a entidade HTML ou o codepoint Unicode, e use o montador de sequência para combinar vários símbolos em uma única string antes de copiar tudo de uma vez.',
      ],
    },
    {
      title: `Onde usar símbolos de ${label.toLowerCase()}`,
      paragraphs: [
        `Símbolos de ${label.toLowerCase()} são texto Unicode comum, então funcionam em qualquer lugar que aceite texto: bio e posts de redes sociais, nome de usuário, planilhas, apresentações, documentos e código-fonte de sites.`,
      ],
      list: [
        'Copie um símbolo por vez com um único clique.',
        'Monte uma sequência combinando vários símbolos antes de copiar.',
        'Salve favoritos para acesso rápido na próxima vez.',
        'Alterne para o formato de entidade HTML para código de sites.',
      ],
    },
    {
      title: 'Compatibilidade de fonte e dispositivo',
      paragraphs: [
        `A maioria dos símbolos de ${label.toLowerCase()} faz parte do padrão Unicode e é exibida de forma consistente em navegadores, celulares e aplicativos modernos. Alguns caracteres menos comuns podem aparecer diferente dependendo da fonte ativa — teste uma alternativa próxima da mesma categoria se algum não aparecer corretamente.`,
      ],
    },
    {
      title: 'Local e privado',
      paragraphs: [
        'A busca, os favoritos, o histórico e a cópia funcionam inteiramente no seu navegador. Nenhum texto digitado ou símbolo selecionado é enviado para um servidor.',
      ],
    },
  ];
};

const buildFaq = (locale: AppLocale, category: SymbolCategory): FaqItem[] => {
  const label = category.labelByLocale[locale];

  if (locale === 'en') {
    const enPhrase = toEnglishPhrase(category.slugWordByLocale.en);

    return [
      {
        question: `How do I copy a ${enPhrase.toLowerCase()} symbol?`,
        answer: `Click the symbol you want inside the ${label} category. It copies automatically to your clipboard.`,
      },
      {
        question: 'Can I copy more than one symbol at once?',
        answer: 'Yes. Turn on the sequence builder, click symbols in order, then copy the full sequence.',
      },
      {
        question: 'Can I copy the HTML entity instead of the character?',
        answer: 'Yes. Use the format toggle to switch between raw character, HTML entity, and Unicode codepoint.',
      },
      {
        question: 'Is any of my data sent to a server?',
        answer: 'No. Search, favorites, history, and copying all run locally in your browser.',
      },
    ];
  }

  if (locale === 'es') {
    return [
      {
        question: `¿Cómo copio un símbolo de ${label.toLowerCase()}?`,
        answer: `Haz clic en el símbolo que quieras dentro de la categoría ${label}. Se copia automáticamente a tu portapapeles.`,
      },
      {
        question: '¿Puedo copiar más de un símbolo a la vez?',
        answer: 'Sí. Activa el armador de secuencias, haz clic en los símbolos en orden y copia la secuencia completa.',
      },
      {
        question: '¿Puedo copiar la entidad HTML en lugar del carácter?',
        answer: 'Sí. Usa el selector de formato para alternar entre carácter puro, entidad HTML y codepoint Unicode.',
      },
      {
        question: '¿Se envía algún dato mío a un servidor?',
        answer: 'No. La búsqueda, los favoritos, el historial y la copia funcionan completamente en tu navegador.',
      },
    ];
  }

  if (locale === 'zh') {
    return [
      {
        question: `如何复制${label}符号?`,
        answer: `在「${label}」分类中点击你想要的符号,它会自动复制到剪贴板。`,
      },
      {
        question: '可以一次复制多个符号吗?',
        answer: '可以。开启组合序列功能,按顺序点击符号,然后复制完整的序列。',
      },
      {
        question: '可以复制 HTML 实体而不是字符本身吗?',
        answer: '可以。使用格式切换按钮,在原始字符、HTML 实体和 Unicode 编码点之间切换。',
      },
      {
        question: '我的数据会被发送到服务器吗?',
        answer: '不会。搜索、收藏、历史记录和复制操作都在你的浏览器本地完成。',
      },
    ];
  }

  return [
    {
      question: `Como copio um símbolo de ${label.toLowerCase()}?`,
      answer: `Clique no símbolo desejado dentro da categoria ${label}. Ele é copiado automaticamente para a área de transferência.`,
    },
    {
      question: 'Posso copiar mais de um símbolo de uma vez?',
      answer: 'Sim. Ative o montador de sequência, clique nos símbolos na ordem desejada e copie a sequência completa.',
    },
    {
      question: 'Posso copiar a entidade HTML em vez do caractere?',
      answer: 'Sim. Use o botão de formato para alternar entre caractere puro, entidade HTML e codepoint Unicode.',
    },
    {
      question: 'Algum dado meu é enviado para um servidor?',
      answer: 'Não. A busca, os favoritos, o histórico e a cópia funcionam inteiramente no seu navegador.',
    },
  ];
};

const buildFallbackContent = (locale: AppLocale): LocalizedSymbolCategoryContent => {
  const fallback = {
    'pt-br': {
      title: 'Símbolos para Copiar e Colar',
      intro: 'Copie símbolos Unicode organizados por categoria.',
      seoTitle: 'Símbolos para Copiar e Colar',
      seoDescription: 'Copie símbolos Unicode prontos para colar em qualquer lugar.',
    },
    en: {
      title: 'Symbols to Copy and Paste',
      intro: 'Copy Unicode symbols organized by category.',
      seoTitle: 'Symbols to Copy and Paste',
      seoDescription: 'Copy Unicode symbols ready to paste anywhere.',
    },
    es: {
      title: 'Símbolos para Copiar y Pegar',
      intro: 'Copia símbolos Unicode organizados por categoría.',
      seoTitle: 'Símbolos para Copiar y Pegar',
      seoDescription: 'Copia símbolos Unicode listos para pegar donde quieras.',
    },
    zh: {
      title: '可复制符号大全',
      intro: '按分类浏览并复制 Unicode 符号。',
      seoTitle: '可复制符号大全',
      seoDescription: '复制现成的 Unicode 符号,随时粘贴到任何地方。',
    },
  }[locale];

  return { ...fallback, keywords: [], contentBlocks: [], faq: [] };
};

export const getLocalizedSymbolCategoryContent = (
  page: SymbolCategoryPage,
  locale: AppLocale,
): LocalizedSymbolCategoryContent => {
  const category = getSymbolCategoryById(page.categoryId);
  if (!category) {
    return buildFallbackContent(locale);
  }

  const label = category.labelByLocale[locale];
  const keywords = buildKeywords(locale, category);

  if (locale === 'en') {
    const enPhrase = toEnglishPhrase(category.slugWordByLocale.en);

    return {
      title: `${enPhrase} Symbols to Copy and Paste`,
      intro: `Browse and copy ${enPhrase.toLowerCase()} symbols with search, sequence building, favorites, and copy as text, HTML entity, or codepoint.`,
      seoTitle: `${enPhrase} Symbols | Copy and Paste`,
      seoDescription: `Copy ${enPhrase.toLowerCase()} symbols ready to paste. Search, build sequences, save favorites, and switch between text, HTML entity, and codepoint format.`,
      keywords,
      contentBlocks: buildContentBlocks(locale, category),
      faq: buildFaq(locale, category),
    };
  }

  if (locale === 'es') {
    return {
      title: `Símbolos de ${label} para Copiar y Pegar`,
      intro: `Explora y copia símbolos de ${label.toLowerCase()} con búsqueda, armador de secuencias, favoritos y copia como texto, entidad HTML o codepoint.`,
      seoTitle: `Símbolos de ${label} | Copiar y Pegar`,
      seoDescription: `Copia símbolos de ${label.toLowerCase()} listos para pegar. Busca, arma secuencias, guarda favoritos y alterna entre texto, entidad HTML y codepoint.`,
      keywords,
      contentBlocks: buildContentBlocks(locale, category),
      faq: buildFaq(locale, category),
    };
  }

  if (locale === 'zh') {
    return {
      title: `${label}符号 - 复制粘贴`,
      intro: `浏览并复制${label}符号,支持搜索、组合序列、收藏,并可复制为文本、HTML 实体或编码点。`,
      seoTitle: `${label}符号 | 复制粘贴`,
      seoDescription: `复制现成的${label}符号。支持搜索、组合序列、保存收藏,并可在文本、HTML 实体和编码点格式之间切换。`,
      keywords,
      contentBlocks: buildContentBlocks(locale, category),
      faq: buildFaq(locale, category),
    };
  }

  return {
    title: `Símbolos de ${label} para Copiar e Colar`,
    intro: `Explore e copie símbolos de ${label.toLowerCase()} com busca, montador de sequência, favoritos e cópia como texto, entidade HTML ou codepoint.`,
    seoTitle: `Símbolos de ${label} | Copiar e Colar`,
    seoDescription: `Copie símbolos de ${label.toLowerCase()} prontos para colar. Busque, monte sequências, salve favoritos e alterne entre texto, entidade HTML e codepoint.`,
    keywords,
    contentBlocks: buildContentBlocks(locale, category),
    faq: buildFaq(locale, category),
  };
};

export const toLocalizedSymbolCategoryLink = (
  page: SymbolCategoryPage,
  locale: AppLocale,
): SymbolCategoryLinkItem => {
  const category = getSymbolCategoryById(page.categoryId);
  const label = category?.labelByLocale[locale] ?? page.categoryLabel;

  return {
    slug: getSymbolCategorySlugByLocale(page, locale),
    path: getSymbolCategoryPathByLocale(page, locale),
    name: label,
    description:
      locale === 'en'
        ? `Browse and copy ${label.toLowerCase()} symbols.`
        : locale === 'es'
          ? `Explora y copia símbolos de ${label.toLowerCase()}.`
          : locale === 'zh'
            ? `浏览并复制${label}符号。`
            : `Explore e copie símbolos de ${label.toLowerCase()}.`,
  };
};

export const getFeaturedSymbolCategoryPages = (limit = 6): SymbolCategoryPage[] =>
  symbolCategoryPages.filter((page) => page.featured).slice(0, limit);

export const getRelatedSymbolCategoryPages = (
  categoryId: string,
  limit = 4,
): SymbolCategoryPage[] =>
  symbolCategoryPages
    .filter((page) => page.categoryId !== categoryId)
    .sort((a, b) => Number(b.featured) - Number(a.featured))
    .slice(0, limit);

export const getSymbolCategoryStaticParamsByLocale = (
  locale: AppLocale,
): Array<{ platformPageSlug: string }> =>
  symbolCategoryPages.map((page) => ({
    platformPageSlug: getSymbolCategorySlugByLocale(page, locale),
  }));
