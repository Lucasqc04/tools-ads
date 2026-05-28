import type { AppLocale } from '@/lib/i18n/config';
import type { ContentBlock, FaqItem } from '@/types/content';

export type GtaCheatsUiCopy = {
  searchLabel: string;
  searchPlaceholder: string;
  gameLabel: string;
  categoryLabel: string;
  platformLabel: string;
  gameAll: string;
  categoryAll: string;
  platformAll: string;
  copyButton: string;
  copiedButton: string;
  resultCount: string;
  noResults: string;
  warningTitle: string;
  warningBody: string;
  noteLabel: string;
  needsValidationLabel: string;
  categoryValues: Record<string, string>;
  gameValues: Record<string, string>;
  platformValues: Record<string, string>;
};

export type GtaCheatsLocaleContent = {
  name: string;
  shortDescription: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  searchIntent: string;
  seoTitle: string;
  seoDescription: string;
  h1: string;
  intro: string;
  contentBlocks: ContentBlock[];
  faq: FaqItem[];
  ui: GtaCheatsUiCopy;
};

const uiByLocale: Record<AppLocale, GtaCheatsUiCopy> = {
  'pt-br': {
    searchLabel: 'Buscar codigo',
    searchPlaceholder: 'Ex.: tanque, helicoptero, policia, vida, armas, clima',
    gameLabel: 'Jogo',
    categoryLabel: 'Categoria',
    platformLabel: 'Plataforma',
    gameAll: 'Todos os jogos',
    categoryAll: 'Todas as categorias',
    platformAll: 'Todas as plataformas',
    copyButton: 'Copiar codigo',
    copiedButton: 'Copiado',
    resultCount: 'resultado(s)',
    noResults: 'Nenhum codigo encontrado com esses filtros.',
    warningTitle: 'Aviso de uso',
    warningBody:
      'Cheats sao para single-player/story mode. Em geral, podem desativar conquistas/trofeus na sessao e nao funcionam no GTA Online.',
    noteLabel: 'Observacao',
    needsValidationLabel: 'Revisao recomendada',
    categoryValues: {
      armas: 'Armas',
      'vida-armadura': 'Vida/Armadura',
      policia: 'Policia',
      veiculos: 'Veiculos',
      'spawn-veiculos': 'Spawn de veiculos',
      clima: 'Clima',
      mundo: 'Mundo',
      npc: 'NPC/Pedestres',
      skins: 'Skins',
      tema: 'Tema',
      movimento: 'Movimento',
      combate: 'Combate',
      dinheiro: 'Dinheiro',
      habilidade: 'Habilidade',
      equipamento: 'Equipamento',
      player: 'Player',
      musica: 'Musica',
      episodes: 'Episodes',
    },
    gameValues: {
      'gta-san-andreas': 'GTA San Andreas',
      'gta-v': 'GTA V',
      'gta-iv': 'GTA IV',
      'gta-iii': 'GTA III',
      'gta-vice-city': 'GTA Vice City',
    },
    platformValues: {
      all: 'Todas',
      pc: 'PC',
      phone: 'Telefone',
      playstation: 'PlayStation',
      xbox: 'Xbox',
      switch: 'Switch',
    },
  },
  en: {
    searchLabel: 'Search cheat code',
    searchPlaceholder: 'e.g. tank, helicopter, police, health, weapons, weather',
    gameLabel: 'Game',
    categoryLabel: 'Category',
    platformLabel: 'Platform',
    gameAll: 'All games',
    categoryAll: 'All categories',
    platformAll: 'All platforms',
    copyButton: 'Copy code',
    copiedButton: 'Copied',
    resultCount: 'result(s)',
    noResults: 'No cheat codes found for the selected filters.',
    warningTitle: 'Usage warning',
    warningBody:
      'Cheats are for single-player/story mode. They can disable achievements/trophies in-session and do not work in GTA Online.',
    noteLabel: 'Note',
    needsValidationLabel: 'Validation recommended',
    categoryValues: {
      armas: 'Weapons',
      'vida-armadura': 'Health/Armor',
      policia: 'Police',
      veiculos: 'Vehicles',
      'spawn-veiculos': 'Vehicle spawn',
      clima: 'Weather',
      mundo: 'World',
      npc: 'NPC/Pedestrians',
      skins: 'Skins',
      tema: 'Theme',
      movimento: 'Movement',
      combate: 'Combat',
      dinheiro: 'Money',
      habilidade: 'Ability',
      equipamento: 'Equipment',
      player: 'Player',
      musica: 'Music',
      episodes: 'Episodes',
    },
    gameValues: {
      'gta-san-andreas': 'GTA San Andreas',
      'gta-v': 'GTA V',
      'gta-iv': 'GTA IV',
      'gta-iii': 'GTA III',
      'gta-vice-city': 'GTA Vice City',
    },
    platformValues: {
      all: 'All',
      pc: 'PC',
      phone: 'Phone',
      playstation: 'PlayStation',
      xbox: 'Xbox',
      switch: 'Switch',
    },
  },
  es: {
    searchLabel: 'Buscar codigo',
    searchPlaceholder: 'Ej.: tanque, helicoptero, policia, vida, armas, clima',
    gameLabel: 'Juego',
    categoryLabel: 'Categoria',
    platformLabel: 'Plataforma',
    gameAll: 'Todos los juegos',
    categoryAll: 'Todas las categorias',
    platformAll: 'Todas las plataformas',
    copyButton: 'Copiar codigo',
    copiedButton: 'Copiado',
    resultCount: 'resultado(s)',
    noResults: 'No se encontraron codigos con esos filtros.',
    warningTitle: 'Aviso de uso',
    warningBody:
      'Los cheats son para single-player/story mode. Pueden desactivar logros/trofeos en la sesion y no funcionan en GTA Online.',
    noteLabel: 'Nota',
    needsValidationLabel: 'Validacion recomendada',
    categoryValues: {
      armas: 'Armas',
      'vida-armadura': 'Vida/Armadura',
      policia: 'Policia',
      veiculos: 'Vehiculos',
      'spawn-veiculos': 'Generar vehiculos',
      clima: 'Clima',
      mundo: 'Mundo',
      npc: 'NPC/Peatones',
      skins: 'Skins',
      tema: 'Tema',
      movimento: 'Movimiento',
      combate: 'Combate',
      dinheiro: 'Dinero',
      habilidade: 'Habilidad',
      equipamento: 'Equipo',
      player: 'Jugador',
      musica: 'Musica',
      episodes: 'Episodes',
    },
    gameValues: {
      'gta-san-andreas': 'GTA San Andreas',
      'gta-v': 'GTA V',
      'gta-iv': 'GTA IV',
      'gta-iii': 'GTA III',
      'gta-vice-city': 'GTA Vice City',
    },
    platformValues: {
      all: 'Todas',
      pc: 'PC',
      phone: 'Telefono',
      playstation: 'PlayStation',
      xbox: 'Xbox',
      switch: 'Switch',
    },
  },
};

const contentByLocale: Record<AppLocale, GtaCheatsLocaleContent> = {
  'pt-br': {
    name: 'Codigos GTA (San Andreas, V, IV, III e Vice City)',
    shortDescription:
      'Busque e copie codigos GTA por jogo, categoria e plataforma com filtros inteligentes em pt-br/en/es.',
    primaryKeyword: 'codigos gta',
    secondaryKeywords: [
      'codigos gta san andreas',
      'codigos gta 5',
      'gta cheat codes',
      'codigos armas gta',
      'codigos tanque gta',
    ],
    searchIntent:
      'Usuarios que querem achar e copiar rapidamente cheats de GTA por jogo e intencao (carro, tanque, helicoptero, policia, vida, armas e clima).',
    seoTitle: 'Codigos GTA: San Andreas, GTA 5, GTA 4, GTA 3 e Vice City',
    seoDescription:
      'Copie codigos GTA por jogo com busca inteligente, filtros por categoria/plataforma e avisos de compatibilidade para single-player.',
    h1: 'Codigos GTA por jogo, categoria e plataforma',
    intro:
      'Encontre codigos para GTA San Andreas, GTA V, GTA IV, GTA III e GTA Vice City. Filtre por categoria, busque por termos comuns e copie o codigo certo em segundos.',
    contentBlocks: [
      {
        title: 'Como usar esta tool de cheats GTA',
        paragraphs: [
          'A pagina foi montada para buscas reais: carro, tanque, helicoptero, policia, vida, armas, clima, moto e dinheiro. Em vez de listas longas sem organizacao, voce escolhe jogo, categoria e plataforma antes de copiar.',
          'A base prioriza codigo textual de PC e numero de telefone quando existe. Isso deixa o fluxo mais rapido para quem joga no teclado e para quem usa o celular in-game no GTA V e GTA IV.',
        ],
      },
      {
        title: 'Single-player only e limites importantes',
        paragraphs: [
          'Cheats sao para single-player/story mode. Em geral, podem desativar conquistas/trofeus durante a sessao e nao funcionam no GTA Online.',
          'Antes de testar sequencias de spawn, clima e caos, faca save manual. Assim voce consegue experimentar sem comprometer uma run principal.',
        ],
        list: [
          'Nao usar no GTA Online.',
          'Pode desativar achievements/trofeus na sessao.',
          'Alguns codigos variam por versao/remaster.',
        ],
      },
      {
        title: 'Busca inteligente multi-idioma',
        paragraphs: [
          'O motor de busca normaliza acentos e aceita termos em portugues, ingles e espanhol no mesmo indice. Tambem expande sinonimos como carro/car/coche, tanque/tank/rhino e policia/police.',
          'Isso melhora o encontro de resultados mesmo quando o usuario nao sabe o nome exato do cheat ou pesquisa em outro idioma.',
        ],
      },
    ],
    faq: [
      {
        question: 'Esses codigos funcionam no GTA Online?',
        answer: 'Nao. A ferramenta e focada em single-player/story mode.',
      },
      {
        question: 'Cheats desativam conquistas?',
        answer:
          'Podem desativar conquistas/trofeus na sessao atual. Salve o jogo antes de usar cheats.',
      },
      {
        question: 'A busca entende termos como tanque e helicoptero?',
        answer: 'Sim. A busca usa sinonimos e indexacao multi-idioma para localizar melhor os codigos.',
      },
      {
        question: 'Tem codigos para GTA San Andreas, GTA 5, GTA 4, GTA 3 e Vice City?',
        answer: 'Sim. A base cobre os cinco jogos e permite filtrar por jogo em um clique.',
      },
      {
        question: 'A tool e gratuita?',
        answer: 'Sim. O uso e gratuito e sem cadastro.',
      },
    ],
    ui: uiByLocale['pt-br'],
  },
  en: {
    name: 'GTA Cheat Codes (San Andreas, V, IV, III, Vice City)',
    shortDescription:
      'Search and copy GTA cheats by game, category, and platform with multilingual smart matching.',
    primaryKeyword: 'gta cheat codes',
    secondaryKeywords: [
      'gta san andreas cheats',
      'gta 5 cheat codes',
      'gta iv cheats',
      'gta tank cheat',
      'gta weapon cheats',
    ],
    searchIntent:
      'Players who want fast cheat lookup by game and intent terms such as car, tank, helicopter, police, health, and weapons.',
    seoTitle: 'GTA Cheat Codes: San Andreas, GTA 5, GTA 4, GTA 3, Vice City',
    seoDescription:
      'Copy GTA cheat codes with smart search, game/category/platform filters, and clear single-player compatibility warnings.',
    h1: 'GTA cheat codes by game, category, and platform',
    intro:
      'Find cheats for GTA San Andreas, GTA V, GTA IV, GTA III, and GTA Vice City. Filter by category, search with intent terms, and copy the exact code quickly.',
    contentBlocks: [
      {
        title: 'A practical GTA cheat search workflow',
        paragraphs: [
          'The tool is designed for real search behavior. Players usually type intent words like tank, helicopter, police, health, weather, or bike rather than official cheat names.',
          'Instead of forcing one giant list, the interface lets you filter by game, category, and platform first, then run a smart query across multilingual keywords.',
        ],
      },
      {
        title: 'Single-player scope and achievement warning',
        paragraphs: [
          'These cheats are for single-player/story mode. In many cases, enabling cheats can disable achievements or trophies for the current session.',
          'Keep a manual save before testing chaos-heavy or vehicle spawn chains so your main progression remains clean.',
        ],
        list: [
          'No GTA Online support.',
          'Session achievements/trophies may be affected.',
          'Some codes vary by edition/remaster.',
        ],
      },
      {
        title: 'Multilingual search and synonym expansion',
        paragraphs: [
          'The search normalizes accents and matches Portuguese, English, and Spanish terms in one index. It also expands synonyms like car/carro/coche and tank/tanque/rhino.',
          'This reduces false negatives when players search in mixed language terms or with shorthand words.',
        ],
      },
    ],
    faq: [
      {
        question: 'Do these cheats work in GTA Online?',
        answer: 'No. The tool is focused on single-player/story mode only.',
      },
      {
        question: 'Can cheat usage disable achievements?',
        answer:
          'Yes, often for the current play session. Create a manual save before using cheats.',
      },
      {
        question: 'Can I search for terms like tank or helicopter?',
        answer: 'Yes. Smart matching includes multilingual synonyms and intent-based lookup.',
      },
      {
        question: 'Which games are included?',
        answer: 'GTA San Andreas, GTA V, GTA IV, GTA III, and GTA Vice City.',
      },
    ],
    ui: uiByLocale.en,
  },
  es: {
    name: 'Codigos GTA (San Andreas, V, IV, III y Vice City)',
    shortDescription:
      'Busca y copia codigos GTA por juego, categoria y plataforma con busqueda inteligente multilenguaje.',
    primaryKeyword: 'codigos gta',
    secondaryKeywords: [
      'codigos gta san andreas',
      'codigos gta 5',
      'gta cheat codes',
      'codigos armas gta',
      'codigos tanque gta',
    ],
    searchIntent:
      'Jugadores que necesitan encontrar cheats por juego e intencion como coche, tanque, helicoptero, policia, vida y armas.',
    seoTitle: 'Codigos GTA: San Andreas, GTA 5, GTA 4, GTA 3 y Vice City',
    seoDescription:
      'Copia codigos GTA con busqueda inteligente, filtros por juego/categoria/plataforma y advertencias de compatibilidad para single-player.',
    h1: 'Codigos GTA por juego, categoria y plataforma',
    intro:
      'Encuentra codigos para GTA San Andreas, GTA V, GTA IV, GTA III y GTA Vice City. Filtra por categoria, busca por intencion y copia el codigo correcto en segundos.',
    contentBlocks: [
      {
        title: 'Como usar esta herramienta de cheats GTA',
        paragraphs: [
          'La herramienta esta orientada a consultas reales: coche, tanque, helicoptero, policia, vida, armas, clima, moto y dinero. Asi encuentras el codigo mas rapido sin revisar listas caoticas.',
          'La base prioriza codigos de PC y numeros de telefono cuando existen. En GTA V y GTA IV esto acelera mucho el flujo para activar cheats en free roam.',
        ],
      },
      {
        title: 'Solo single-player y advertencia de logros',
        paragraphs: [
          'Los cheats son para single-player/story mode. En muchos casos pueden desactivar logros/trofeos en la sesion y no funcionan en GTA Online.',
          'Guarda partida manual antes de probar combinaciones de spawns o caos, para no afectar una progresion importante.',
        ],
        list: [
          'No usar en GTA Online.',
          'Puede afectar logros/trofeos de la sesion.',
          'Algunos codigos cambian por version/remaster.',
        ],
      },
      {
        title: 'Busqueda inteligente en tres idiomas',
        paragraphs: [
          'El buscador normaliza acentos y acepta portugues, ingles y espanol en el mismo indice. Tambien expande sinonimos como coche/car/carro y tanque/tank/rhino.',
          'Esto mejora resultados cuando el usuario no recuerda el nombre exacto del cheat o mezcla terminos de varios idiomas.',
        ],
      },
    ],
    faq: [
      {
        question: 'Estos codigos funcionan en GTA Online?',
        answer: 'No. Esta herramienta esta enfocada en single-player/story mode.',
      },
      {
        question: 'Los cheats pueden desactivar logros?',
        answer:
          'Si, en muchos casos para la sesion actual. Haz guardado manual antes de activar codigos.',
      },
      {
        question: 'La busqueda entiende terminos como tanque y helicoptero?',
        answer: 'Si. Incluye sinonimos multilenguaje para encontrar codigos mas rapido.',
      },
      {
        question: 'Que juegos incluye?',
        answer: 'GTA San Andreas, GTA V, GTA IV, GTA III y GTA Vice City.',
      },
    ],
    ui: uiByLocale.es,
  },
};

export const getGtaCheatsContent = (locale: AppLocale): GtaCheatsLocaleContent =>
  contentByLocale[locale];

export const gtaCheatsIntro = contentByLocale['pt-br'].intro;
export const gtaCheatsFaq = contentByLocale['pt-br'].faq;
export const gtaCheatsContentBlocks = contentByLocale['pt-br'].contentBlocks;
