import { generateUsername } from '@/lib/gamer-username-generator';
import {
  getNicknameSymbolPlatformBySlug,
  nicknameSymbolPlatforms,
  type NicknameSymbolPlatform,
} from '@/lib/nickname-symbol-generator';
import { localizePath, type AppLocale } from '@/lib/i18n/config';
import type { ContentBlock, FaqItem } from '@/types/content';

export type GamerUsernamePlatformPage = {
  gameId: string;
  gameSlug: string;
  gameName: string;
  featured: boolean;
  slugPtBr: string;
  slugEn: string;
  slugEs: string;
};

export type GamerUsernamePlatformResolution = {
  page: GamerUsernamePlatformPage;
  sourceLocale: AppLocale;
};

export type LocalizedGamerUsernamePlatformContent = {
  title: string;
  intro: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  contentBlocks: ContentBlock[];
  faq: FaqItem[];
};

export type GamerUsernamePlatformLinkItem = {
  slug: string;
  path: string;
  name: string;
  description: string;
};

const toPtBrSlug = (platformSlug: string): string => `gerador-de-nick-${platformSlug}`;
const toEnSlug = (platformSlug: string): string => `${platformSlug}-username-generator`;
const toEsSlug = (platformSlug: string): string => `generador-de-nombre-${platformSlug}`;

const buildPage = (platform: NicknameSymbolPlatform): GamerUsernamePlatformPage => ({
  gameId: platform.id,
  gameSlug: platform.slug,
  gameName: platform.name,
  featured: platform.featured,
  slugPtBr: toPtBrSlug(platform.slug),
  slugEn: toEnSlug(platform.slug),
  slugEs: toEsSlug(platform.slug),
});

export const gamerUsernamePlatformPages: GamerUsernamePlatformPage[] =
  nicknameSymbolPlatforms.map(buildPage);

const pageMaps: Record<AppLocale, Map<string, GamerUsernamePlatformPage>> = {
  'pt-br': new Map(gamerUsernamePlatformPages.map((page) => [page.slugPtBr, page])),
  en: new Map(gamerUsernamePlatformPages.map((page) => [page.slugEn, page])),
  es: new Map(gamerUsernamePlatformPages.map((page) => [page.slugEs, page])),
};

export const getGamerUsernamePlatformResolutionBySlug = (
  slug: string,
): GamerUsernamePlatformResolution | undefined => {
  for (const sourceLocale of ['pt-br', 'en', 'es'] as const) {
    const page = pageMaps[sourceLocale].get(slug);
    if (page) {
      return { page, sourceLocale };
    }
  }

  return undefined;
};

export const getGamerUsernamePlatformSlugByLocale = (
  page: GamerUsernamePlatformPage,
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

export const getGamerUsernamePlatformPathByLocale = (
  page: GamerUsernamePlatformPage,
  locale: AppLocale,
): string => localizePath(locale, `/${getGamerUsernamePlatformSlugByLocale(page, locale)}`);

export const getGamerUsernamePlatformLocalePathMap = (
  page: GamerUsernamePlatformPage,
): Record<AppLocale, string> => ({
  'pt-br': getGamerUsernamePlatformPathByLocale(page, 'pt-br'),
  en: getGamerUsernamePlatformPathByLocale(page, 'en'),
  es: getGamerUsernamePlatformPathByLocale(page, 'es'),
});

const buildKeywords = (locale: AppLocale, gameName: string): string[] => {
  const name = gameName.toLowerCase();

  if (locale === 'en') {
    return [
      `${name} username generator`,
      `${name} name generator`,
      `random ${name} gamertag`,
      `${name} nickname generator`,
      'gamer username generator',
    ];
  }

  if (locale === 'es') {
    return [
      `generador de nombre ${name}`,
      `generador de nick ${name}`,
      `nombre aleatorio ${name}`,
      `generador de nickname ${name}`,
      'generador de nombre para juegos',
    ];
  }

  return [
    `gerador de nick ${name}`,
    `gerador de nome ${name}`,
    `nome aleatorio ${name}`,
    `gerador de nickname ${name}`,
    'gerador de nick para jogos',
  ];
};

const buildContentBlocks = (
  locale: AppLocale,
  platform: NicknameSymbolPlatform,
): ContentBlock[] => {
  const sample = generateUsername({ gameId: platform.id });

  if (locale === 'en') {
    return [
      {
        title: `${platform.name} username generator`,
        paragraphs: [
          `This page opens the username generator with a ${platform.name}-flavored word bank already selected, for example "${sample}". Click generate as many times as you want, pick a style (classic, leet speak, or symbols), and copy the result.`,
          `Once you find a name you like, favorite it to compare against other options, then confirm directly in ${platform.name} whether it's available before creating your account or changing your profile.`,
        ],
      },
      {
        title: `Tips for a good ${platform.name} name`,
        paragraphs: [
          'Shorter names tend to fit better in in-game UI and are easier for other players to remember and search for.',
        ],
        list: [
          'Reroll a few times before settling on a name.',
          'Try both the classic and leet speak styles for the same word combination.',
          'Keep a backup favorite in case your first choice is taken.',
          'Check the exact character limit inside the game.',
        ],
      },
      {
        title: 'Local and private',
        paragraphs: [
          `Name generation and favorites run locally in your browser. This independent tool is not affiliated with ${platform.name} or its publisher and cannot check name availability.`,
        ],
      },
    ];
  }

  if (locale === 'es') {
    return [
      {
        title: `Generador de nombre para ${platform.name}`,
        paragraphs: [
          `Esta página abre el generador con un banco de palabras con temática de ${platform.name} ya seleccionado, por ejemplo "${sample}". Haz clic en generar tantas veces como quieras, elige un estilo (clásico, leet speak o símbolos) y copia el resultado.`,
          `Cuando encuentres un nombre que te guste, guárdalo como favorito para comparar con otras opciones, y luego confirma directamente en ${platform.name} si está disponible antes de crear tu cuenta o cambiar tu perfil.`,
        ],
      },
      {
        title: `Consejos para un buen nombre de ${platform.name}`,
        paragraphs: [
          'Los nombres más cortos suelen verse mejor en la interfaz del juego y son más fáciles de recordar y buscar para otros jugadores.',
        ],
        list: [
          'Sortea varias veces antes de decidirte por un nombre.',
          'Prueba el estilo clásico y el leet speak con la misma combinación.',
          'Guarda un favorito de respaldo por si el primero ya está en uso.',
          'Revisa el límite exacto de caracteres dentro del juego.',
        ],
      },
      {
        title: 'Local y privado',
        paragraphs: [
          `La generación de nombres y los favoritos funcionan localmente en tu navegador. Esta herramienta independiente no está afiliada a ${platform.name} ni a su publisher y no puede comprobar disponibilidad.`,
        ],
      },
    ];
  }

  return [
    {
      title: `Gerador de nick para ${platform.name}`,
      paragraphs: [
        `Esta página abre o gerador com um banco de palavras com temática de ${platform.name} já selecionado, por exemplo "${sample}". Clique em gerar quantas vezes quiser, escolha um estilo (clássico, leet speak ou símbolos) e copie o resultado.`,
        `Ao encontrar um nome que goste, favorite para comparar com outras opções, e depois confirme diretamente no ${platform.name} se ele está disponível antes de criar sua conta ou alterar seu perfil.`,
      ],
    },
    {
      title: `Dicas para um bom nome de ${platform.name}`,
      paragraphs: [
        'Nomes mais curtos costumam caber melhor na interface do jogo e são mais fáceis de lembrar e buscar por outros jogadores.',
      ],
      list: [
        'Sorteie algumas vezes antes de decidir por um nome.',
        'Teste o estilo clássico e o leet speak com a mesma combinação.',
        'Guarde um favorito reserva caso o primeiro já esteja em uso.',
        'Confira o limite exato de caracteres dentro do jogo.',
      ],
    },
    {
      title: 'Local e privado',
      paragraphs: [
        `A geração de nomes e os favoritos funcionam localmente no seu navegador. Esta ferramenta independente não é afiliada ao ${platform.name} nem ao publisher e não consegue verificar disponibilidade.`,
      ],
    },
  ];
};

const buildFaq = (locale: AppLocale, platform: NicknameSymbolPlatform): FaqItem[] => {
  if (locale === 'en') {
    return [
      {
        question: `Does this check name availability in ${platform.name}?`,
        answer: `No. It generates word combinations locally; availability depends on ${platform.name} and your account.`,
      },
      {
        question: 'Can I change the style of the generated name?',
        answer: 'Yes. Choose between classic, leet speak, or symbol-decorated styles.',
      },
      {
        question: 'Is my data sent to a server?',
        answer: 'No. Generation and favorites run locally in your browser.',
      },
    ];
  }

  if (locale === 'es') {
    return [
      {
        question: `¿Comprueba la disponibilidad del nombre en ${platform.name}?`,
        answer: `No. Genera combinaciones de palabras localmente; la disponibilidad depende de ${platform.name} y de tu cuenta.`,
      },
      {
        question: '¿Puedo cambiar el estilo del nombre generado?',
        answer: 'Sí. Elige entre estilo clásico, leet speak o decorado con símbolos.',
      },
      {
        question: '¿Mis datos se envían a un servidor?',
        answer: 'No. La generación y los favoritos funcionan localmente en tu navegador.',
      },
    ];
  }

  return [
    {
      question: `Isso verifica disponibilidade do nome no ${platform.name}?`,
      answer: `Não. Ele gera combinações de palavras localmente; a disponibilidade depende do ${platform.name} e da sua conta.`,
    },
    {
      question: 'Posso mudar o estilo do nome gerado?',
      answer: 'Sim. Escolha entre estilo clássico, leet speak ou decorado com símbolos.',
    },
    {
      question: 'Meus dados são enviados para um servidor?',
      answer: 'Não. A geração e os favoritos funcionam localmente no seu navegador.',
    },
  ];
};

const buildFallbackContent = (locale: AppLocale): LocalizedGamerUsernamePlatformContent => {
  const fallback = {
    'pt-br': {
      title: 'Gerador de Nick para Jogos',
      intro: 'Gere um nickname aleatorio para o seu jogo.',
      seoTitle: 'Gerador de Nick para Jogos',
      seoDescription: 'Gere nicknames aleatorios prontos para copiar.',
    },
    en: {
      title: 'Gamer Username Generator',
      intro: 'Generate a random username for your game.',
      seoTitle: 'Gamer Username Generator',
      seoDescription: 'Generate random usernames ready to copy.',
    },
    es: {
      title: 'Generador de Nombre para Juegos',
      intro: 'Genera un nombre aleatorio para tu juego.',
      seoTitle: 'Generador de Nombre para Juegos',
      seoDescription: 'Genera nombres aleatorios listos para copiar.',
    },
  }[locale];

  return { ...fallback, keywords: [], contentBlocks: [], faq: [] };
};

export const getLocalizedGamerUsernamePlatformContent = (
  page: GamerUsernamePlatformPage,
  locale: AppLocale,
): LocalizedGamerUsernamePlatformContent => {
  const platform = getNicknameSymbolPlatformBySlug(page.gameSlug);
  if (!platform) {
    return buildFallbackContent(locale);
  }

  const keywords = buildKeywords(locale, platform.name);

  if (locale === 'en') {
    return {
      title: `${platform.name} Username Generator`,
      intro: `Generate random ${platform.name} usernames with a game-themed word bank, classic/leet/symbol styles, and one-click copy.`,
      seoTitle: `${platform.name} Username Generator | Free Random Names`,
      seoDescription: `Generate random ${platform.name} usernames with a themed word bank. Reroll, switch styles, favorite results, and copy instantly.`,
      keywords,
      contentBlocks: buildContentBlocks(locale, platform),
      faq: buildFaq(locale, platform),
    };
  }

  if (locale === 'es') {
    return {
      title: `Generador de Nombre para ${platform.name}`,
      intro: `Genera nombres aleatorios de ${platform.name} con un banco de palabras tematizado, estilos clásico/leet/símbolos y copia con un clic.`,
      seoTitle: `Generador de Nombre para ${platform.name} | Nombres Gratis`,
      seoDescription: `Genera nombres aleatorios de ${platform.name} con un banco de palabras tematizado. Sortea, cambia de estilo, guarda favoritos y copia al instante.`,
      keywords,
      contentBlocks: buildContentBlocks(locale, platform),
      faq: buildFaq(locale, platform),
    };
  }

  return {
    title: `Gerador de Nick para ${platform.name}`,
    intro: `Gere nicknames aleatorios de ${platform.name} com banco de palavras tematizado, estilos classico/leet/simbolos e copia com um clique.`,
    seoTitle: `Gerador de Nick para ${platform.name} | Nomes Gratis`,
    seoDescription: `Gere nicknames aleatorios de ${platform.name} com banco de palavras tematizado. Sorteie, troque de estilo, favorite resultados e copie na hora.`,
    keywords,
    contentBlocks: buildContentBlocks(locale, platform),
    faq: buildFaq(locale, platform),
  };
};

export const toLocalizedGamerUsernamePlatformLink = (
  page: GamerUsernamePlatformPage,
  locale: AppLocale,
): GamerUsernamePlatformLinkItem => ({
  slug: getGamerUsernamePlatformSlugByLocale(page, locale),
  path: getGamerUsernamePlatformPathByLocale(page, locale),
  name: page.gameName,
  description:
    locale === 'en'
      ? `Generate random usernames for ${page.gameName}.`
      : locale === 'es'
        ? `Genera nombres aleatorios para ${page.gameName}.`
        : `Gere nicknames aleatorios para ${page.gameName}.`,
});

export const getFeaturedGamerUsernamePlatformPages = (
  limit = 6,
): GamerUsernamePlatformPage[] =>
  gamerUsernamePlatformPages.filter((page) => page.featured).slice(0, limit);

export const getRelatedGamerUsernamePlatformPages = (
  gameId: string,
  limit = 4,
): GamerUsernamePlatformPage[] =>
  gamerUsernamePlatformPages
    .filter((page) => page.gameId !== gameId)
    .sort((a, b) => Number(b.featured) - Number(a.featured))
    .slice(0, limit);

export const getGamerUsernamePlatformStaticParamsByLocale = (
  locale: AppLocale,
): Array<{ platformPageSlug: string }> =>
  gamerUsernamePlatformPages.map((page) => ({
    platformPageSlug: getGamerUsernamePlatformSlugByLocale(page, locale),
  }));
