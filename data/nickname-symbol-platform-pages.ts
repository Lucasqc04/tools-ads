import {
  getNicknameFrameById,
  getNicknameSymbolPlatformBySlug,
  nicknameSymbolPlatforms,
  type NicknameSymbolPlatform,
} from '@/lib/nickname-symbol-generator';
import { localizePath, type AppLocale } from '@/lib/i18n/config';
import type { ContentBlock, FaqItem } from '@/types/content';

export type NicknameSymbolPlatformPage = {
  platformId: string;
  platformSlug: string;
  platformName: string;
  featured: boolean;
  slugPtBr: string;
  slugEn: string;
  slugEs: string;
};

export type NicknameSymbolPlatformResolution = {
  page: NicknameSymbolPlatformPage;
  sourceLocale: AppLocale;
};

export type LocalizedNicknameSymbolPlatformContent = {
  title: string;
  intro: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  contentBlocks: ContentBlock[];
  faq: FaqItem[];
};

export type NicknameSymbolPlatformLinkItem = {
  slug: string;
  path: string;
  name: string;
  description: string;
};

const toPtBrSlug = (platformSlug: string): string =>
  `simbolos-para-nickname-${platformSlug}`;

const toEnSlug = (platformSlug: string): string => `${platformSlug}-name-symbols`;

const toEsSlug = (platformSlug: string): string =>
  `simbolos-para-nombre-${platformSlug}`;

const buildPage = (platform: NicknameSymbolPlatform): NicknameSymbolPlatformPage => ({
  platformId: platform.id,
  platformSlug: platform.slug,
  platformName: platform.name,
  featured: platform.featured,
  slugPtBr: toPtBrSlug(platform.slug),
  slugEn: toEnSlug(platform.slug),
  slugEs: toEsSlug(platform.slug),
});

export const nicknameSymbolPlatformPages: NicknameSymbolPlatformPage[] =
  nicknameSymbolPlatforms.map(buildPage);

const pageMaps: Record<AppLocale, Map<string, NicknameSymbolPlatformPage>> = {
  'pt-br': new Map(nicknameSymbolPlatformPages.map((page) => [page.slugPtBr, page])),
  en: new Map(nicknameSymbolPlatformPages.map((page) => [page.slugEn, page])),
  es: new Map(nicknameSymbolPlatformPages.map((page) => [page.slugEs, page])),
};

export const getNicknameSymbolPlatformResolutionBySlug = (
  slug: string,
): NicknameSymbolPlatformResolution | undefined => {
  for (const sourceLocale of ['pt-br', 'en', 'es'] as const) {
    const page = pageMaps[sourceLocale].get(slug);
    if (page) {
      return { page, sourceLocale };
    }
  }

  return undefined;
};

export const getNicknameSymbolPlatformSlugByLocale = (
  page: NicknameSymbolPlatformPage,
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

export const getNicknameSymbolPlatformPathByLocale = (
  page: NicknameSymbolPlatformPage,
  locale: AppLocale,
): string => localizePath(locale, `/${getNicknameSymbolPlatformSlugByLocale(page, locale)}`);

export const getNicknameSymbolPlatformLocalePathMap = (
  page: NicknameSymbolPlatformPage,
): Record<AppLocale, string> => ({
  'pt-br': getNicknameSymbolPlatformPathByLocale(page, 'pt-br'),
  en: getNicknameSymbolPlatformPathByLocale(page, 'en'),
  es: getNicknameSymbolPlatformPathByLocale(page, 'es'),
});

const buildKeywords = (
  locale: AppLocale,
  platform: NicknameSymbolPlatform,
): string[] => {
  const name = platform.name.toLowerCase();

  if (locale === 'en') {
    return [
      `${name} name symbols`,
      `${name} symbols copy and paste`,
      `${name} nickname generator`,
      `symbols for ${name} name`,
      'gaming name symbols generator',
    ];
  }

  if (locale === 'es') {
    return [
      `simbolos para nombre ${name}`,
      `simbolos ${name} copiar y pegar`,
      `generador de nickname ${name}`,
      `nombre gamer con simbolos ${name}`,
      'generador de simbolos para juegos',
    ];
  }

  return [
    `simbolos para nickname ${name}`,
    `simbolos ${name} copiar e colar`,
    `gerador de nick ${name}`,
    `nome gamer com simbolos ${name}`,
    'gerador de simbolos para jogos',
  ];
};

const recommendedFrameLabels = (
  platform: NicknameSymbolPlatform,
  locale: AppLocale,
): string =>
  platform.recommendedFrameIds
    .slice(0, 4)
    .map((frameId) => getNicknameFrameById(frameId)?.labelByLocale[locale])
    .filter(Boolean)
    .join(', ');

const buildContentBlocks = (
  locale: AppLocale,
  platform: NicknameSymbolPlatform,
): ContentBlock[] => {
  const frames = recommendedFrameLabels(platform, locale);
  const guidance = platform.guidanceByLocale[locale];
  const context = platform.contextByLocale[locale];

  if (locale === 'en') {
    return [
      {
        title: `${platform.name} name symbols with a live preview`,
        paragraphs: [
          `This version opens the gaming symbol generator with ${platform.name} selected. Type a base name and compare the recommended ${frames} frames before copying anything. ${guidance}`,
          `${context} The personalized preview combines your chosen left symbol, right symbol, and Unicode letter style, while the ready-made list provides shorter alternatives when the first result feels crowded.`,
        ],
      },
      {
        title: `How to build a readable ${platform.name} nickname`,
        paragraphs: [
          'Start with a short base name and add one decoration at a time. Compare the original lettering with small caps or another Unicode style, then check the final character count. Short text symbols generally remain easier to recognize than layered emoji or several complex frames.',
          `Copy the finished name and paste it into the real ${platform.name} profile field before confirming a change. If the platform rejects it or shows blank squares, return to the original letter style, remove one side of the frame, or choose a minimal preset.`,
        ],
        list: [
          'Enter a base nickname instead of generating a random identity.',
          'Try the platform presets first, then customize both sides.',
          'Check readability in the places where other players see the name.',
          'Keep a plain backup version before saving the change.',
        ],
      },
      {
        title: 'Why Unicode support can change',
        paragraphs: [
          `The output is text made from Unicode characters, not an image. ${platform.name}, its linked account system, the device, and the active font can each affect whether a glyph is accepted and displayed. A symbol visible in the browser may still become a square or disappear in the game.`,
          'The generator therefore treats every platform preset as a practical starting point rather than a guarantee. Validation rules and fonts can change after updates, so the final check must always happen inside the game.',
        ],
      },
      {
        title: 'Private local generation',
        paragraphs: [
          'The name, style transformation, symbol selection, preview, and variant list are generated locally in your browser. No account connection or mandatory sign-up is required.',
          `This independent tool is not affiliated with ${platform.name} or its publisher and cannot reserve or check name availability. Follow the game’s community rules and avoid misleading impersonation.`,
        ],
      },
    ];
  }

  if (locale === 'es') {
    return [
      {
        title: `Simbolos para nombre de ${platform.name} con preview`,
        paragraphs: [
          `Esta version abre el generador con ${platform.name} seleccionado. Escribe un nombre base y compara los marcos recomendados: ${frames}. ${guidance}`,
          `${context} El preview combina simbolo izquierdo, simbolo derecho y estilo Unicode, mientras la lista preparada ofrece alternativas mas cortas si el primer resultado queda cargado.`,
        ],
      },
      {
        title: `Como crear un nickname legible para ${platform.name}`,
        paragraphs: [
          'Empieza con un nombre corto y agrega una decoracion cada vez. Compara las letras originales con small caps u otro estilo Unicode y revisa el total de caracteres. Los simbolos de texto cortos suelen ser mas legibles que varios emoji o marcos complejos.',
          `Copia el resultado y pegalo en el campo real de ${platform.name} antes de confirmar. Si la plataforma lo rechaza o muestra cuadrados vacios, vuelve a las letras originales, elimina un lado del marco o usa un preset minimalista.`,
        ],
        list: [
          'Escribe un nickname base en lugar de depender de un nombre aleatorio.',
          'Prueba primero los presets del juego y despues personaliza ambos lados.',
          'Comprueba la lectura donde otros jugadores veran el nombre.',
          'Guarda una version simple antes de confirmar el cambio.',
        ],
      },
      {
        title: 'Por que puede cambiar el soporte Unicode',
        paragraphs: [
          `El resultado es texto Unicode, no una imagen. ${platform.name}, la cuenta vinculada, el dispositivo y la fuente activa pueden cambiar la aceptacion y visualizacion de cada glifo. Un simbolo visible en el navegador puede convertirse en un cuadrado dentro del juego.`,
          'Por eso los presets son puntos de partida, no garantias. Las reglas y fuentes pueden cambiar con actualizaciones, y la comprobacion final siempre debe ocurrir dentro del juego.',
        ],
      },
      {
        title: 'Generacion local y privada',
        paragraphs: [
          'El nombre, la transformacion de letras, la seleccion de simbolos, el preview y las variantes se generan localmente en el navegador. No necesitas conectar una cuenta ni registrarte.',
          `Esta herramienta independiente no esta afiliada a ${platform.name} ni a su publisher y no puede reservar o comprobar disponibilidad. Respeta las reglas de la comunidad y evita suplantaciones enganosas.`,
        ],
      },
    ];
  }

  return [
    {
      title: `Simbolos para nickname de ${platform.name} com preview`,
      paragraphs: [
        `Esta versao abre o gerador com ${platform.name} selecionado. Digite um nome base e compare primeiro as molduras recomendadas: ${frames}. ${guidance}`,
        `${context} O preview personalizado combina simbolo esquerdo, simbolo direito e estilo Unicode, enquanto a lista pronta oferece alternativas mais curtas quando o primeiro resultado fica carregado.`,
      ],
    },
    {
      title: `Como montar um nickname legivel para ${platform.name}`,
      paragraphs: [
        'Comece com um nome curto e adicione uma decoracao por vez. Compare as letras originais com small caps ou outro estilo Unicode e confira o total de caracteres. Simbolos de texto curtos normalmente continuam mais reconheciveis que varios emoji ou molduras complexas empilhadas.',
        `Copie o resultado e cole no campo real de ${platform.name} antes de confirmar. Se a plataforma rejeitar ou mostrar quadrados vazios, volte ao estilo original, remova um lado da moldura ou escolha um preset minimalista.`,
      ],
      list: [
        'Digite um nickname base em vez de depender de um nome aleatorio.',
        'Teste primeiro os presets do jogo e depois personalize os dois lados.',
        'Confira a leitura nos locais em que outros jogadores verao o nome.',
        'Guarde uma versao simples antes de confirmar a alteracao.',
      ],
    },
    {
      title: 'Por que o suporte a Unicode pode mudar',
      paragraphs: [
        `O resultado e texto formado por caracteres Unicode, nao uma imagem. ${platform.name}, a conta vinculada, o aparelho e a fonte ativa podem afetar a aceitacao e a exibicao de cada glifo. Um simbolo visivel no navegador ainda pode virar quadrado ou desaparecer no jogo.`,
        'Por isso os presets sao pontos de partida praticos, nao garantias. Regras e fontes podem mudar depois de atualizacoes, entao a verificacao final precisa acontecer dentro do jogo.',
      ],
    },
    {
      title: 'Geracao local e privada',
      paragraphs: [
        'O nome, a transformacao de letras, a selecao de simbolos, o preview e as variantes sao gerados localmente no navegador. Nao e necessario conectar conta nem fazer cadastro.',
        `Esta ferramenta independente nao e afiliada a ${platform.name} nem ao publisher e nao consegue reservar ou verificar disponibilidade. Respeite as regras da comunidade e evite imitacao enganosa.`,
      ],
    },
  ];
};

const buildFaq = (
  locale: AppLocale,
  platform: NicknameSymbolPlatform,
): FaqItem[] => {
  if (locale === 'en') {
    return [
      {
        question: `Which symbols work in ${platform.name} names?`,
        answer: `${platform.guidanceByLocale.en} Start with the recommended short frames and validate the result inside the game.`,
      },
      {
        question: `Can this generator check ${platform.name} name availability?`,
        answer: 'No. It creates variations locally, while availability and acceptance depend on the platform and your account.',
      },
      {
        question: 'Why does a symbol show as a square?',
        answer: 'The active game or device font may not contain that Unicode glyph. Try original lettering and a simpler text symbol.',
      },
      {
        question: 'Is the entered name uploaded?',
        answer: 'No. The generator and preview run locally in your browser by default.',
      },
    ];
  }

  if (locale === 'es') {
    return [
      {
        question: `¿Que simbolos funcionan en nombres de ${platform.name}?`,
        answer: `${platform.guidanceByLocale.es} Empieza con marcos cortos y valida el resultado dentro del juego.`,
      },
      {
        question: `¿El generador comprueba disponibilidad en ${platform.name}?`,
        answer: 'No. Crea variaciones localmente, pero la disponibilidad y aceptacion dependen de la plataforma y de tu cuenta.',
      },
      {
        question: '¿Por que un simbolo aparece como cuadrado?',
        answer: 'La fuente del juego o dispositivo puede no incluir ese glifo Unicode. Prueba letras originales y un simbolo mas simple.',
      },
      {
        question: '¿El nombre se envia a un servidor?',
        answer: 'No. El generador y el preview funcionan localmente en el navegador.',
      },
    ];
  }

  return [
    {
      question: `Quais simbolos funcionam no nome de ${platform.name}?`,
      answer: `${platform.guidanceByLocale['pt-br']} Comece pelas molduras curtas recomendadas e valide o resultado dentro do jogo.`,
    },
    {
      question: `O gerador verifica disponibilidade no ${platform.name}?`,
      answer: 'Nao. Ele cria variacoes localmente, mas disponibilidade e aceitacao dependem da plataforma e da sua conta.',
    },
    {
      question: 'Por que um simbolo aparece como quadrado?',
      answer: 'A fonte ativa do jogo ou aparelho pode nao conter aquele glifo Unicode. Teste letras originais e um simbolo mais simples.',
    },
    {
      question: 'O nome digitado e enviado para servidor?',
      answer: 'Nao. O gerador e o preview funcionam localmente no navegador por padrao.',
    },
  ];
};

const buildFallbackContent = (
  locale: AppLocale,
): LocalizedNicknameSymbolPlatformContent => {
  const fallback = {
    'pt-br': {
      title: 'Gerador de Simbolos para Nickname',
      intro: 'Crie um nickname gamer com simbolos e molduras Unicode.',
      seoTitle: 'Gerador de Simbolos para Nickname',
      seoDescription: 'Crie nomes gamer com simbolos Unicode prontos para copiar.',
    },
    en: {
      title: 'Gaming Name Symbol Generator',
      intro: 'Create a gaming name with Unicode symbols and frames.',
      seoTitle: 'Gaming Name Symbol Generator',
      seoDescription: 'Create gaming names with Unicode symbols ready to copy.',
    },
    es: {
      title: 'Generador de Simbolos para Nombres',
      intro: 'Crea un nombre gamer con simbolos y marcos Unicode.',
      seoTitle: 'Generador de Simbolos para Nombres',
      seoDescription: 'Crea nombres gamer con simbolos Unicode listos para copiar.',
    },
  }[locale];

  return { ...fallback, keywords: [], contentBlocks: [], faq: [] };
};

export const getLocalizedNicknameSymbolPlatformContent = (
  page: NicknameSymbolPlatformPage,
  locale: AppLocale,
): LocalizedNicknameSymbolPlatformContent => {
  const platform = getNicknameSymbolPlatformBySlug(page.platformSlug);
  if (!platform) {
    return buildFallbackContent(locale);
  }

  const keywords = buildKeywords(locale, platform);

  if (locale === 'en') {
    return {
      title: `${platform.name} Name Symbols Generator`,
      intro: `Create ${platform.name} names with Unicode symbols, recommended frames, styled letters, a live preview, and copy-ready variations.`,
      seoTitle: `${platform.name} Name Symbols | Generator and Copy Paste`,
      seoDescription: `Generate ${platform.name} names with symbols, frames, and Unicode letters. Preview character count, copy ready nicknames, and test game-focused presets.`,
      keywords,
      contentBlocks: buildContentBlocks(locale, platform),
      faq: buildFaq(locale, platform),
    };
  }

  if (locale === 'es') {
    return {
      title: `Simbolos para Nombre de ${platform.name}`,
      intro: `Crea nombres de ${platform.name} con simbolos Unicode, marcos recomendados, letras estilizadas, preview y variaciones listas para copiar.`,
      seoTitle: `Simbolos para Nombre ${platform.name} | Generador Online`,
      seoDescription: `Genera nombres de ${platform.name} con simbolos, marcos y letras Unicode. Mira el total de caracteres, copia nicknames y prueba presets.`,
      keywords,
      contentBlocks: buildContentBlocks(locale, platform),
      faq: buildFaq(locale, platform),
    };
  }

  return {
    title: `Simbolos para Nickname de ${platform.name}`,
    intro: `Crie nomes de ${platform.name} com simbolos Unicode, molduras recomendadas, letras estilizadas, preview e variacoes prontas para copiar.`,
    seoTitle: `Simbolos para Nickname ${platform.name} | Gerador Online`,
    seoDescription: `Gere nomes de ${platform.name} com simbolos, molduras e letras Unicode. Veja o total de caracteres, copie nicknames e teste presets.`,
    keywords,
    contentBlocks: buildContentBlocks(locale, platform),
    faq: buildFaq(locale, platform),
  };
};

export const toLocalizedNicknameSymbolPlatformLink = (
  page: NicknameSymbolPlatformPage,
  locale: AppLocale,
): NicknameSymbolPlatformLinkItem => {
  const platform = getNicknameSymbolPlatformBySlug(page.platformSlug);

  return {
    slug: getNicknameSymbolPlatformSlugByLocale(page, locale),
    path: getNicknameSymbolPlatformPathByLocale(page, locale),
    name: page.platformName,
    description:
      platform?.guidanceByLocale[locale] ??
      (locale === 'en'
        ? 'Open the game preset.'
        : locale === 'es'
          ? 'Abre el preset del juego.'
          : 'Abra o preset do jogo.'),
  };
};

export const getFeaturedNicknameSymbolPlatformPages = (
  limit = 6,
): NicknameSymbolPlatformPage[] =>
  nicknameSymbolPlatformPages.filter((page) => page.featured).slice(0, limit);

export const getRelatedNicknameSymbolPlatformPages = (
  platformId: string,
  limit = 4,
): NicknameSymbolPlatformPage[] =>
  nicknameSymbolPlatformPages
    .filter((page) => page.platformId !== platformId)
    .sort((a, b) => Number(b.featured) - Number(a.featured))
    .slice(0, limit);

export const getNicknameSymbolPlatformStaticParamsByLocale = (
  locale: AppLocale,
): Array<{ platformPageSlug: string }> =>
  nicknameSymbolPlatformPages.map((page) => ({
    platformPageSlug: getNicknameSymbolPlatformSlugByLocale(page, locale),
  }));
