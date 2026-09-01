import {
  countShortcuts,
  getShortcutAppById,
  shortcutApps,
  type ShortcutApp,
} from '@/lib/keyboard-shortcuts';
import { localizePath, type AppLocale } from '@/lib/i18n/config';
import type { ContentBlock, FaqItem } from '@/types/content';

export type KeyboardShortcutsAppPage = {
  appId: string;
  appLabel: string;
  featured: boolean;
  slugPtBr: string;
  slugEn: string;
  slugEs: string;
};

export type KeyboardShortcutsAppResolution = {
  page: KeyboardShortcutsAppPage;
  sourceLocale: AppLocale;
};

export type LocalizedKeyboardShortcutsAppContent = {
  title: string;
  intro: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  contentBlocks: ContentBlock[];
  faq: FaqItem[];
};

export type KeyboardShortcutsAppLinkItem = {
  slug: string;
  path: string;
  name: string;
  description: string;
};

const FEATURED_APP_IDS = new Set(['windows', 'macos', 'vscode', 'excel']);

const toPtBrSlug = (app: ShortcutApp): string =>
  `atalhos-de-teclado-${app.slugWordByLocale['pt-br']}`;

const toEnSlug = (app: ShortcutApp): string =>
  `${app.slugWordByLocale.en}-keyboard-shortcuts`;

const toEsSlug = (app: ShortcutApp): string =>
  `atajos-de-teclado-${app.slugWordByLocale.es}`;

const buildPage = (app: ShortcutApp): KeyboardShortcutsAppPage => ({
  appId: app.id,
  appLabel: app.labelByLocale['pt-br'],
  featured: FEATURED_APP_IDS.has(app.id),
  slugPtBr: toPtBrSlug(app),
  slugEn: toEnSlug(app),
  slugEs: toEsSlug(app),
});

export const keyboardShortcutsAppPages: KeyboardShortcutsAppPage[] =
  shortcutApps.map(buildPage);

const pageMaps: Record<AppLocale, Map<string, KeyboardShortcutsAppPage>> = {
  'pt-br': new Map(keyboardShortcutsAppPages.map((page) => [page.slugPtBr, page])),
  en: new Map(keyboardShortcutsAppPages.map((page) => [page.slugEn, page])),
  es: new Map(keyboardShortcutsAppPages.map((page) => [page.slugEs, page])),
  zh: new Map(keyboardShortcutsAppPages.map((page) => [page.slugEn, page])),
};

export const getKeyboardShortcutsAppResolutionBySlug = (
  slug: string,
): KeyboardShortcutsAppResolution | undefined => {
  for (const sourceLocale of ['pt-br', 'en', 'es'] as const) {
    const page = pageMaps[sourceLocale].get(slug);
    if (page) {
      return { page, sourceLocale };
    }
  }

  return undefined;
};

export const getKeyboardShortcutsAppSlugByLocale = (
  page: KeyboardShortcutsAppPage,
  locale: AppLocale,
): string => {
  if (locale === 'en') {
    return page.slugEn;
  }

  if (locale === 'es') {
    return page.slugEs;
  }

  return page.slugPtBr;
};

export const getKeyboardShortcutsAppPathByLocale = (
  page: KeyboardShortcutsAppPage,
  locale: AppLocale,
): string => localizePath(locale, `/${getKeyboardShortcutsAppSlugByLocale(page, locale)}`);

export const getKeyboardShortcutsAppLocalePathMap = (
  page: KeyboardShortcutsAppPage,
): Record<AppLocale, string> => ({
  'pt-br': getKeyboardShortcutsAppPathByLocale(page, 'pt-br'),
  en: getKeyboardShortcutsAppPathByLocale(page, 'en'),
  es: getKeyboardShortcutsAppPathByLocale(page, 'es'),
  zh: getKeyboardShortcutsAppPathByLocale(page, 'en'),
});

const buildKeywords = (locale: AppLocale, app: ShortcutApp): string[] => {
  const label = app.labelByLocale[locale];

  if (locale === 'en') {
    return [
      `${label} keyboard shortcuts`,
      `${label} shortcuts`,
      `${label} shortcuts cheat sheet`,
      `${label} keyboard shortcuts list`,
      'keyboard shortcuts',
    ];
  }

  if (locale === 'es') {
    return [
      `atajos de teclado ${label}`,
      `atajos de ${label}`,
      `lista de atajos de ${label}`,
      `combinaciones de teclas ${label}`,
      'atajos de teclado',
    ];
  }

  return [
    `atalhos de teclado ${label}`,
    `atalhos do ${label}`,
    `lista de atalhos do ${label}`,
    `teclas de atalho ${label}`,
    'atalhos de teclado',
  ];
};

const buildContentBlocks = (locale: AppLocale, app: ShortcutApp): ContentBlock[] => {
  const label = app.labelByLocale[locale];
  const total = countShortcuts(app);
  const osNote = app.hasOsVariants;

  if (locale === 'en') {
    return [
      {
        title: `${label} keyboard shortcuts, organized by category`,
        paragraphs: [
          `This page opens the shortcuts hub with ${label} already selected, showing ${total} shortcuts grouped by category.${osNote ? ' Switch between Windows and Mac to see the right key combination for your keyboard.' : ''}`,
          'Use the search box to filter by action, and scan each category instead of a single giant list to find what you need faster.',
        ],
      },
      {
        title: `Getting comfortable with ${label} shortcuts`,
        paragraphs: [
          `Start with the shortcuts you use most often in ${label} and add a few new ones each week instead of trying to memorize everything at once. Repetition in real tasks is what makes a shortcut become automatic.`,
        ],
        list: [
          'Bookmark this page for quick reference while you work.',
          'Focus on the category that matches your current task.',
          'Practice one new shortcut at a time until it feels automatic.',
        ],
      },
      {
        title: 'Local and private',
        paragraphs: [
          'Search and navigation between apps run entirely in your browser. No data is sent to a server.',
        ],
      },
    ];
  }

  if (locale === 'es') {
    return [
      {
        title: `Atajos de teclado de ${label}, organizados por categoría`,
        paragraphs: [
          `Esta página abre la central de atajos con ${label} ya seleccionado, mostrando ${total} atajos agrupados por categoría.${osNote ? ' Alterna entre Windows y Mac para ver la combinación correcta para tu teclado.' : ''}`,
          'Usa el cuadro de búsqueda para filtrar por acción, y revisa cada categoría en vez de una lista gigante para encontrar lo que necesitas más rápido.',
        ],
      },
      {
        title: `Cómo dominar los atajos de ${label}`,
        paragraphs: [
          `Empieza por los atajos que más usas en ${label} y agrega algunos nuevos cada semana en vez de intentar memorizar todo de una vez. La repetición en tareas reales es lo que hace que un atajo se vuelva automático.`,
        ],
        list: [
          'Guarda esta página como favorita para consultarla mientras trabajas.',
          'Enfócate en la categoría que corresponde a tu tarea actual.',
          'Practica un atajo nuevo a la vez hasta que se vuelva automático.',
        ],
      },
      {
        title: 'Local y privado',
        paragraphs: [
          'La búsqueda y la navegación entre apps funcionan completamente en tu navegador. Ningún dato se envía a un servidor.',
        ],
      },
    ];
  }

  return [
    {
      title: `Atalhos de teclado do ${label}, organizados por categoria`,
      paragraphs: [
        `Esta página abre a central de atalhos com o ${label} já selecionado, mostrando ${total} atalhos agrupados por categoria.${osNote ? ' Alterne entre Windows e Mac para ver a combinação correta para o seu teclado.' : ''}`,
        'Use o campo de busca para filtrar por ação, e percorra cada categoria em vez de uma lista gigante para encontrar o que precisa mais rápido.',
      ],
    },
    {
      title: `Como se acostumar com os atalhos do ${label}`,
      paragraphs: [
        `Comece pelos atalhos que você mais usa no ${label} e adicione alguns novos por semana em vez de tentar decorar tudo de uma vez. A repetição em tarefas reais é o que faz um atalho virar automático.`,
      ],
      list: [
        'Salve esta página para consultar rapidamente durante o trabalho.',
        'Foque na categoria que corresponde à sua tarefa atual.',
        'Pratique um atalho novo por vez até ficar automático.',
      ],
    },
    {
      title: 'Local e privado',
      paragraphs: [
        'A busca e a navegação entre aplicativos acontecem inteiramente no seu navegador. Nenhum dado é enviado para um servidor.',
      ],
    },
  ];
};

const buildFaq = (locale: AppLocale, app: ShortcutApp): FaqItem[] => {
  const label = app.labelByLocale[locale];

  if (locale === 'en') {
    return [
      {
        question: `Does this cover ${label} shortcuts for both Windows and Mac?`,
        answer: app.hasOsVariants
          ? `Yes. Use the Windows/Mac toggle to see the right combination for ${label} on your system.`
          : `${label} shortcuts shown here are the same regardless of your operating system.`,
      },
      {
        question: `Can I search for a specific ${label} shortcut?`,
        answer: `Yes. Use the search box to filter ${label} shortcuts by action.`,
      },
      {
        question: 'Is any of my data sent to a server?',
        answer: 'No. Search and navigation run entirely in your browser.',
      },
    ];
  }

  if (locale === 'es') {
    return [
      {
        question: `¿Cubre atajos de ${label} para Windows y Mac?`,
        answer: app.hasOsVariants
          ? `Sí. Usa el interruptor Windows/Mac para ver la combinación correcta de ${label} en tu sistema.`
          : `Los atajos de ${label} mostrados aquí son los mismos sin importar tu sistema operativo.`,
      },
      {
        question: `¿Puedo buscar un atajo específico de ${label}?`,
        answer: `Sí. Usa el cuadro de búsqueda para filtrar los atajos de ${label} por acción.`,
      },
      {
        question: '¿Se envía algún dato mío a un servidor?',
        answer: 'No. La búsqueda y la navegación funcionan completamente en tu navegador.',
      },
    ];
  }

  return [
    {
      question: `Cobre atalhos do ${label} para Windows e Mac?`,
      answer: app.hasOsVariants
        ? `Sim. Use a alternância Windows/Mac para ver a combinação correta do ${label} no seu sistema.`
        : `Os atalhos do ${label} mostrados aqui são os mesmos independentemente do seu sistema operacional.`,
    },
    {
      question: `Posso buscar um atalho específico do ${label}?`,
      answer: `Sim. Use o campo de busca para filtrar os atalhos do ${label} por ação.`,
    },
    {
      question: 'Algum dado meu é enviado para um servidor?',
      answer: 'Não. A busca e a navegação funcionam inteiramente no seu navegador.',
    },
  ];
};

const buildFallbackContent = (locale: AppLocale): LocalizedKeyboardShortcutsAppContent => {
  const fallback = {
    'pt-br': {
      title: 'Central de Atalhos de Teclado',
      intro: 'Consulte atalhos de teclado por aplicativo.',
      seoTitle: 'Central de Atalhos de Teclado',
      seoDescription: 'Consulte atalhos de teclado organizados por aplicativo.',
    },
    en: {
      title: 'Keyboard Shortcuts Hub',
      intro: 'Look up keyboard shortcuts by app.',
      seoTitle: 'Keyboard Shortcuts Hub',
      seoDescription: 'Look up keyboard shortcuts organized by app.',
    },
    es: {
      title: 'Central de Atajos de Teclado',
      intro: 'Consulta atajos de teclado por aplicación.',
      seoTitle: 'Central de Atajos de Teclado',
      seoDescription: 'Consulta atajos de teclado organizados por aplicación.',
    },
    zh: {
      title: 'Keyboard Shortcuts Hub',
      intro: 'Look up keyboard shortcuts by app.',
      seoTitle: 'Keyboard Shortcuts Hub',
      seoDescription: 'Look up keyboard shortcuts organized by app.',
    },
  }[locale];

  return { ...fallback, keywords: [], contentBlocks: [], faq: [] };
};

export const getLocalizedKeyboardShortcutsAppContent = (
  page: KeyboardShortcutsAppPage,
  locale: AppLocale,
): LocalizedKeyboardShortcutsAppContent => {
  const app = getShortcutAppById(page.appId);
  if (!app) {
    return buildFallbackContent(locale);
  }

  const label = app.labelByLocale[locale];
  const keywords = buildKeywords(locale, app);

  if (locale === 'en') {
    return {
      title: `${label} Keyboard Shortcuts`,
      intro: `Browse ${label} keyboard shortcuts by category, search by action, and switch between Windows and Mac when they differ.`,
      seoTitle: `${label} Keyboard Shortcuts | Full List`,
      seoDescription: `Look up ${label} keyboard shortcuts organized by category, searchable by action, with a Windows/Mac toggle.`,
      keywords,
      contentBlocks: buildContentBlocks(locale, app),
      faq: buildFaq(locale, app),
    };
  }

  if (locale === 'es') {
    return {
      title: `Atajos de Teclado de ${label}`,
      intro: `Explora los atajos de teclado de ${label} por categoría, busca por acción y alterna entre Windows y Mac cuando difieran.`,
      seoTitle: `Atajos de Teclado de ${label} | Lista Completa`,
      seoDescription: `Consulta los atajos de teclado de ${label} organizados por categoría, con búsqueda por acción y alternancia Windows/Mac.`,
      keywords,
      contentBlocks: buildContentBlocks(locale, app),
      faq: buildFaq(locale, app),
    };
  }

  return {
    title: `Atalhos de Teclado do ${label}`,
    intro: `Explore os atalhos de teclado do ${label} por categoria, busque por ação e alterne entre Windows e Mac quando houver diferença.`,
    seoTitle: `Atalhos de Teclado do ${label} | Lista Completa`,
    seoDescription: `Consulte os atalhos de teclado do ${label} organizados por categoria, com busca por ação e alternância Windows/Mac.`,
    keywords,
    contentBlocks: buildContentBlocks(locale, app),
    faq: buildFaq(locale, app),
  };
};

export const toLocalizedKeyboardShortcutsAppLink = (
  page: KeyboardShortcutsAppPage,
  locale: AppLocale,
): KeyboardShortcutsAppLinkItem => {
  const app = getShortcutAppById(page.appId);
  const label = app?.labelByLocale[locale] ?? page.appLabel;

  return {
    slug: getKeyboardShortcutsAppSlugByLocale(page, locale),
    path: getKeyboardShortcutsAppPathByLocale(page, locale),
    name: label,
    description:
      locale === 'en'
        ? `Browse ${label} keyboard shortcuts.`
        : locale === 'es'
          ? `Explora los atajos de teclado de ${label}.`
          : `Explore os atalhos de teclado do ${label}.`,
  };
};

export const getFeaturedKeyboardShortcutsAppPages = (
  limit = 6,
): KeyboardShortcutsAppPage[] =>
  keyboardShortcutsAppPages.filter((page) => page.featured).slice(0, limit);

export const getRelatedKeyboardShortcutsAppPages = (
  appId: string,
  limit = 4,
): KeyboardShortcutsAppPage[] =>
  keyboardShortcutsAppPages
    .filter((page) => page.appId !== appId)
    .sort((a, b) => Number(b.featured) - Number(a.featured))
    .slice(0, limit);

export const getKeyboardShortcutsAppStaticParamsByLocale = (
  locale: AppLocale,
): Array<{ platformPageSlug: string }> =>
  keyboardShortcutsAppPages.map((page) => ({
    platformPageSlug: getKeyboardShortcutsAppSlugByLocale(page, locale),
  }));
