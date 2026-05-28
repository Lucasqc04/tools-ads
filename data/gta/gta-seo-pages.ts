import { localizePath, locales, type AppLocale } from '@/lib/i18n/config';
import { gtaGameNames, type GtaCheatCategory, type GtaGameId } from '@/data/gta/gta-cheats';
import type { ContentBlock, FaqItem } from '@/types/content';

export type GtaToolPageType = 'game' | 'intent';

export type GtaSeoPage = {
  id: string;
  type: GtaToolPageType;
  slugs: Record<AppLocale, string>;
  game?: GtaGameId;
  category?: GtaCheatCategory;
};

export const gtaToolSlugByLocale: Record<AppLocale, string> = {
  'pt-br': 'codigos-gta',
  en: 'gta-cheat-codes',
  es: 'codigos-gta',
};

export const gtaToolRouteSlugs = ['codigos-gta', 'gta-cheat-codes'] as const;

const gamePages: GtaSeoPage[] = [
  {
    id: 'gta-san-andreas',
    type: 'game',
    game: 'gta-san-andreas',
    slugs: {
      'pt-br': 'codigos-gta-san-andreas',
      en: 'gta-san-andreas-cheats',
      es: 'codigos-gta-san-andreas',
    },
  },
  {
    id: 'gta-v',
    type: 'game',
    game: 'gta-v',
    slugs: {
      'pt-br': 'codigos-gta-5',
      en: 'gta-5-cheat-codes',
      es: 'codigos-gta-5',
    },
  },
  {
    id: 'gta-iv',
    type: 'game',
    game: 'gta-iv',
    slugs: {
      'pt-br': 'codigos-gta-4',
      en: 'gta-4-cheats',
      es: 'codigos-gta-4',
    },
  },
  {
    id: 'gta-iii',
    type: 'game',
    game: 'gta-iii',
    slugs: {
      'pt-br': 'codigos-gta-3',
      en: 'gta-3-cheats',
      es: 'codigos-gta-3',
    },
  },
  {
    id: 'gta-vice-city',
    type: 'game',
    game: 'gta-vice-city',
    slugs: {
      'pt-br': 'codigos-gta-vice-city',
      en: 'gta-vice-city-cheats',
      es: 'codigos-gta-vice-city',
    },
  },
];

const intentPages: GtaSeoPage[] = [
  {
    id: 'cars',
    type: 'intent',
    category: 'spawn-veiculos',
    slugs: {
      'pt-br': 'codigos-carros-gta',
      en: 'gta-car-cheats',
      es: 'codigos-coches-gta',
    },
  },
  {
    id: 'weapons',
    type: 'intent',
    category: 'armas',
    slugs: {
      'pt-br': 'codigos-armas-gta',
      en: 'gta-weapon-cheats',
      es: 'codigos-armas-gta',
    },
  },
  {
    id: 'police',
    type: 'intent',
    category: 'policia',
    slugs: {
      'pt-br': 'codigos-policia-gta',
      en: 'gta-police-cheats',
      es: 'codigos-policia-gta',
    },
  },
  {
    id: 'tank',
    type: 'intent',
    category: 'spawn-veiculos',
    slugs: {
      'pt-br': 'codigos-tanque-gta',
      en: 'gta-tank-cheats',
      es: 'codigos-tanque-gta',
    },
  },
  {
    id: 'helicopter',
    type: 'intent',
    category: 'spawn-veiculos',
    slugs: {
      'pt-br': 'codigos-helicoptero-gta',
      en: 'gta-helicopter-cheats',
      es: 'codigos-helicoptero-gta',
    },
  },
  {
    id: 'weather',
    type: 'intent',
    category: 'clima',
    slugs: {
      'pt-br': 'codigos-clima-gta',
      en: 'gta-weather-cheats',
      es: 'codigos-clima-gta',
    },
  },
  {
    id: 'health',
    type: 'intent',
    category: 'vida-armadura',
    slugs: {
      'pt-br': 'codigos-vida-gta',
      en: 'gta-health-cheats',
      es: 'codigos-vida-gta',
    },
  },
  {
    id: 'money',
    type: 'intent',
    category: 'dinheiro',
    slugs: {
      'pt-br': 'codigos-dinheiro-gta',
      en: 'gta-money-cheats',
      es: 'codigos-dinero-gta',
    },
  },
];

export const gtaSeoPages: GtaSeoPage[] = [...gamePages, ...intentPages];

const bySlug = new Map<string, GtaSeoPage>(
  gtaSeoPages.flatMap((item) => Object.values(item.slugs).map((slug) => [slug, item] as const)),
);

export const getGtaToolSlugForLocale = (locale: AppLocale): string => gtaToolSlugByLocale[locale];

export const getGtaToolBasePathForLocale = (locale: AppLocale): string =>
  `/tools/${getGtaToolSlugForLocale(locale)}`;

export const getGtaToolPathForLocale = (locale: AppLocale): string =>
  localizePath(locale, getGtaToolBasePathForLocale(locale));

export const getGtaToolLocalePathMap = (): Record<AppLocale, string> => ({
  'pt-br': getGtaToolPathForLocale('pt-br'),
  en: getGtaToolPathForLocale('en'),
  es: getGtaToolPathForLocale('es'),
});

export const getGtaSeoPageBySlug = (slug: string): GtaSeoPage | undefined => bySlug.get(slug);

export const getGtaSeoPathByLocale = (page: GtaSeoPage, locale: AppLocale): string =>
  localizePath(locale, `/${page.slugs[locale]}`);

export const getGtaSeoLocalePathMap = (page: GtaSeoPage): Record<AppLocale, string> => ({
  'pt-br': getGtaSeoPathByLocale(page, 'pt-br'),
  en: getGtaSeoPathByLocale(page, 'en'),
  es: getGtaSeoPathByLocale(page, 'es'),
});

export const getGtaSeoStaticParamsByLocale = (
  locale: AppLocale,
): Array<{ platformPageSlug: string }> => {
  return gtaSeoPages.map((page) => ({
    platformPageSlug: page.slugs[locale],
  }));
};

const categoryLabelByLocale: Record<AppLocale, Record<GtaCheatCategory, string>> = {
  'pt-br': {
    armas: 'armas',
    'vida-armadura': 'vida e armadura',
    policia: 'policia',
    veiculos: 'veiculos',
    'spawn-veiculos': 'spawn de veiculos',
    clima: 'clima',
    mundo: 'mundo',
    npc: 'NPCs e pedestres',
    skins: 'skins e personagem',
    tema: 'temas',
    movimento: 'movimento',
    combate: 'combate',
    dinheiro: 'dinheiro',
    habilidade: 'habilidade',
    equipamento: 'equipamento',
    player: 'player',
    musica: 'musica',
    episodes: 'episodes',
  },
  en: {
    armas: 'weapons',
    'vida-armadura': 'health and armor',
    policia: 'police and wanted',
    veiculos: 'vehicles',
    'spawn-veiculos': 'vehicle spawns',
    clima: 'weather',
    mundo: 'world effects',
    npc: 'NPC and pedestrian cheats',
    skins: 'skins and character',
    tema: 'themes',
    movimento: 'movement',
    combate: 'combat',
    dinheiro: 'money',
    habilidade: 'abilities',
    equipamento: 'equipment',
    player: 'player',
    musica: 'music',
    episodes: 'episodes',
  },
  es: {
    armas: 'armas',
    'vida-armadura': 'vida y armadura',
    policia: 'policia y busqueda',
    veiculos: 'vehiculos',
    'spawn-veiculos': 'generacion de vehiculos',
    clima: 'clima',
    mundo: 'efectos del mundo',
    npc: 'NPC y peatones',
    skins: 'skins y personaje',
    tema: 'temas',
    movimento: 'movimiento',
    combate: 'combate',
    dinheiro: 'dinero',
    habilidade: 'habilidad',
    equipamento: 'equipo',
    player: 'jugador',
    musica: 'musica',
    episodes: 'episodes',
  },
};

export type GtaSeoLocalizedContent = {
  title: string;
  intro: string;
  seoTitle: string;
  seoDescription: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  contentBlocks: ContentBlock[];
  faq: FaqItem[];
};

const getIntentKeyword = (locale: AppLocale, page: GtaSeoPage): string => {
  if (page.type === 'game' && page.game) {
    if (locale === 'pt-br') return `codigos ${gtaGameNames[page.game]['pt-br']}`;
    if (locale === 'en') return `${gtaGameNames[page.game].en} cheat codes`;
    return `codigos ${gtaGameNames[page.game].es}`;
  }

  const category = page.category ? categoryLabelByLocale[locale][page.category] : 'cheats';

  if (locale === 'pt-br') return `codigos GTA de ${category}`;
  if (locale === 'en') return `GTA ${category} cheats`;
  return `codigos GTA de ${category}`;
};

export const getLocalizedGtaSeoContent = (
  page: GtaSeoPage,
  locale: AppLocale,
): GtaSeoLocalizedContent => {
  const keyword = getIntentKeyword(locale, page);
  const gameLabel = page.game ? gtaGameNames[page.game][locale] : null;
  const categoryLabel = page.category ? categoryLabelByLocale[locale][page.category] : null;

  if (locale === 'pt-br') {
    const title = gameLabel
      ? `Codigos de ${gameLabel}`
      : `Codigos GTA: ${categoryLabel ?? 'filtros especificos'}`;

    return {
      title,
      intro: gameLabel
        ? `Copie codigos do ${gameLabel} com foco em PC e telefone quando disponivel. Filtre por categoria e busque termos como tanque, helicoptero, policia, vida e armas.`
        : `Encontre codigos GTA por intencao de busca (${categoryLabel}). Use filtros por jogo e plataforma para copiar rapidamente os cheats certos para o modo historia.`,
      seoTitle: `${title} | PC e Phone Cheats`,
      seoDescription:
        'Lista organizada de cheats GTA para modo historia/single-player com busca inteligente, filtros por jogo/plataforma e avisos de compatibilidade.',
      primaryKeyword: keyword,
      secondaryKeywords: [
        'codigos gta pc',
        'cheats gta story mode',
        'codigo tanque gta',
        'codigo helicoptero gta',
      ],
      contentBlocks: [
        {
          title: 'Como usar os codigos GTA com seguranca',
          paragraphs: [
            'Esta pagina organiza cheats para GTA San Andreas, GTA V, GTA IV, GTA III e GTA Vice City com foco em uso rapido no modo historia. Cada item mostra codigo principal, plataforma e observacoes de versao.',
            'Use os filtros para reduzir erros: escolha jogo, categoria e plataforma antes de copiar. Em GTA V, quando houver codigo de telefone, voce pode acionar pelo celular in-game alem do codigo textual de PC.',
          ],
        },
        {
          title: 'Single-player only: aviso importante',
          paragraphs: [
            'Os codigos aqui sao para single-player/story mode. Em geral, cheats podem desativar conquistas/trofeus na sessao atual e nao funcionam no GTA Online.',
            'Se estiver em campanha e quiser preservar progresso sem impacto, faca save manual antes de testar combinacoes de cheats mais agressivas.',
          ],
          list: [
            'Nao funciona no GTA Online.',
            'Pode bloquear achievements/trofeus na sessao.',
            'Alguns cheats exigem estado especifico do jogo (ex.: veiculo desbloqueado).',
          ],
        },
        {
          title: 'Busca inteligente e filtros por intencao',
          paragraphs: [
            'A busca aceita termos em portugues, ingles e espanhol e aplica sinonimos como carro/car/coche, policia/police, vida/health, tanque/tank/rhino e moto/bike.',
            'Isso ajuda a encontrar codigos mesmo quando a consulta nao bate exatamente com o nome do cheat no jogo.',
          ],
        },
      ],
      faq: [
        {
          question: 'Esses codigos funcionam no GTA Online?',
          answer: 'Nao. Eles sao voltados para single-player/story mode e nao devem ser usados no GTA Online.',
        },
        {
          question: 'Cheats podem desativar conquistas?',
          answer:
            'Sim, em muitos casos os cheats desativam achievements/trofeus para a sessao atual. Salve manualmente antes de testar.',
        },
        {
          question: 'Posso buscar por termos como tanque e helicoptero?',
          answer:
            'Sim. A busca entende sinonimos e localiza cheats por jogo, categoria e plataforma.',
        },
        {
          question: 'Quais plataformas estao cobertas?',
          answer:
            'A base prioriza codigos PC e numeros de telefone quando existirem. Campos para PlayStation/Xbox/Switch podem ser preenchidos em expansoes futuras.',
        },
      ],
    };
  }

  if (locale === 'en') {
    const title = gameLabel
      ? `${gameLabel} cheat codes`
      : `GTA cheats: ${categoryLabel ?? 'filtered intent'}`;

    return {
      title,
      intro: gameLabel
        ? `Copy ${gameLabel} cheats with PC-first coverage and phone numbers when available. Filter by category and search terms like tank, helicopter, police, health, and weapons.`
        : `Find GTA cheats by search intent (${categoryLabel}). Filter by game and platform to copy the right story-mode code faster.`,
      seoTitle: `${title} | PC and Phone Codes`,
      seoDescription:
        'Structured GTA cheat code list for story mode/single-player with smart search, game/platform filters, and compatibility warnings.',
      primaryKeyword: keyword,
      secondaryKeywords: [
        'gta pc cheats',
        'gta story mode cheats',
        'gta tank cheat',
        'gta helicopter cheat',
      ],
      contentBlocks: [
        {
          title: 'Use GTA cheats with less trial and error',
          paragraphs: [
            'This page groups cheats across GTA San Andreas, GTA V, GTA IV, GTA III, and GTA Vice City. Each result includes code format and platform hints so you can copy quickly.',
            'Use filters first (game/category/platform) and then search by intent. This avoids mixing similar cheat names from different titles.',
          ],
        },
        {
          title: 'Story mode only and achievement warning',
          paragraphs: [
            'These cheats are intended for single-player/story mode. In many cases, enabling cheats disables achievements/trophies for the current session.',
            'Keep a manual save before enabling chaos or spawn-heavy cheats, especially when testing multiple combinations in sequence.',
          ],
          list: [
            'No GTA Online support.',
            'Achievements/trophies may be disabled in-session.',
            'Some cheats require unlocked content state.',
          ],
        },
        {
          title: 'Smart search with multilingual synonyms',
          paragraphs: [
            'The search index handles Portuguese, English, and Spanish terms with normalized matching and synonyms (car/carro/coche, tank/rhino, health/vida, police/policia).',
            'This lets players find relevant codes even when query language differs from the cheat display name.',
          ],
        },
      ],
      faq: [
        {
          question: 'Do these cheats work in GTA Online?',
          answer: 'No. They are designed for single-player/story mode and should not be used in GTA Online.',
        },
        {
          question: 'Can cheats disable achievements?',
          answer:
            'Yes, often for the current session. Keep a manual save before activating cheats if you are progressing campaign content.',
        },
        {
          question: 'Can I search with terms like tank or helicopter?',
          answer:
            'Yes. The search supports intent terms and multilingual synonyms, then filters by game and platform.',
        },
        {
          question: 'Which platforms are included?',
          answer:
            'The seed prioritizes PC text codes and phone numbers where available. Extra console button combos can be added in the same data model.',
        },
      ],
    };
  }

  const title = gameLabel
    ? `Codigos de ${gameLabel}`
    : `Codigos GTA: ${categoryLabel ?? 'busqueda especifica'}`;

  return {
    title,
    intro: gameLabel
      ? `Copia codigos de ${gameLabel} con enfoque en PC y numeros de telefono cuando existan. Filtra por categoria y busca terminos como tanque, helicoptero, policia, vida y armas.`
      : `Encuentra codigos GTA por intencion de busqueda (${categoryLabel}). Usa filtros por juego y plataforma para copiar mas rapido el cheat correcto en modo historia.`,
    seoTitle: `${title} | Codigos PC y telefono`,
    seoDescription:
      'Listado estructurado de codigos GTA para modo historia/single-player con busqueda inteligente, filtros por juego/plataforma y avisos de compatibilidad.',
    primaryKeyword: keyword,
    secondaryKeywords: [
      'codigos gta pc',
      'cheats gta modo historia',
      'codigo tanque gta',
      'codigo helicoptero gta',
    ],
    contentBlocks: [
      {
        title: 'Como usar codigos GTA con menos errores',
        paragraphs: [
          'La pagina agrupa cheats de GTA San Andreas, GTA V, GTA IV, GTA III y GTA Vice City con formato claro por plataforma y categoria.',
          'Primero filtra por juego/categoria/plataforma y despues usa la busqueda por intencion para evitar mezclar codigos similares entre titulos distintos.',
        ],
      },
      {
        title: 'Solo modo historia y advertencia de logros',
        paragraphs: [
          'Estos codigos son para single-player/story mode. En muchos casos, activar cheats deshabilita logros/trofeos durante la sesion actual.',
          'Guarda partida manual antes de probar combinaciones de caos, spawns o cambios de mundo para evitar perder progreso deseado.',
        ],
        list: [
          'No funciona en GTA Online.',
          'Puede desactivar logros/trofeos en la sesion.',
          'Algunos codigos dependen de desbloqueos previos.',
        ],
      },
      {
        title: 'Busqueda inteligente con sinonimos',
        paragraphs: [
          'El indice acepta consultas en portugues, ingles y espanol con normalizacion y sinonimos como coche/car/carro, police/policia, tank/rhino y health/vida.',
          'Asi puedes encontrar codigos aunque tu termino no coincida exactamente con el nombre visible del cheat.',
        ],
      },
    ],
    faq: [
      {
        question: 'Estos codigos funcionan en GTA Online?',
        answer: 'No. Estan pensados para single-player/story mode y no deben usarse en GTA Online.',
      },
      {
        question: 'Los cheats pueden desactivar logros?',
        answer:
          'Si, en muchos casos para la sesion actual. Haz guardado manual antes de activar codigos.',
      },
      {
        question: 'Puedo buscar por tanque, helicoptero o armas?',
        answer:
          'Si. La busqueda acepta sinonimos y se combina con filtros de juego, categoria y plataforma.',
      },
      {
        question: 'Que plataformas estan cubiertas?',
        answer:
          'La base prioriza codigos de PC y telefono cuando existen. Tambien hay campos preparados para PlayStation, Xbox y Switch.',
      },
    ],
  };
};

export const getAllGtaSeoSlugs = (): string[] => {
  const slugs = new Set<string>();

  gtaSeoPages.forEach((page) => {
    locales.forEach((locale) => {
      slugs.add(page.slugs[locale]);
    });
  });

  return Array.from(slugs);
};

export const getLocalizedGtaSeoLabel = (page: GtaSeoPage, locale: AppLocale): string => {
  const gameLabel = page.game ? gtaGameNames[page.game][locale] : undefined;
  const categoryLabel = page.category ? categoryLabelByLocale[locale][page.category] : undefined;

  if (locale === 'pt-br') {
    return gameLabel
      ? `Codigos de ${gameLabel}`
      : `Codigos GTA ${categoryLabel ? `de ${categoryLabel}` : 'por intencao'}`;
  }

  if (locale === 'en') {
    return gameLabel
      ? `${gameLabel} cheat codes`
      : `GTA ${categoryLabel ?? 'intent'} cheats`;
  }

  return gameLabel
    ? `Codigos de ${gameLabel}`
    : `Codigos GTA ${categoryLabel ? `de ${categoryLabel}` : 'por intencion'}`;
};

export const getRelatedGtaSeoPages = (
  currentId: string,
  limit = 4,
): GtaSeoPage[] => gtaSeoPages.filter((page) => page.id !== currentId).slice(0, limit);
