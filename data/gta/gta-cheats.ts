import type { AppLocale } from '@/lib/i18n/config';

export type GtaGameId =
  | 'gta-san-andreas'
  | 'gta-v'
  | 'gta-iv'
  | 'gta-iii'
  | 'gta-vice-city';

export type GtaCheatCategory =
  | 'armas'
  | 'vida-armadura'
  | 'policia'
  | 'veiculos'
  | 'spawn-veiculos'
  | 'clima'
  | 'mundo'
  | 'npc'
  | 'skins'
  | 'tema'
  | 'movimento'
  | 'combate'
  | 'dinheiro'
  | 'habilidade'
  | 'equipamento'
  | 'player'
  | 'musica'
  | 'episodes';

export type GtaCheatCodes = {
  pc?: string;
  pcPhrase?: string;
  pcCode?: string;
  phone?: string;
  playstation?: string;
  xbox?: string;
  switch?: string;
};

export type GtaCheatEntry = {
  id: string;
  game: GtaGameId;
  category: GtaCheatCategory;
  names: {
    'pt-br': string;
    en: string;
    es: string;
  };
  codes: GtaCheatCodes;
  keywords: {
    'pt-br': string[];
    en: string[];
    es: string[];
  };
  note?: string;
  needsValidation?: boolean;
  support: {
    singlePlayerOnly: true;
    storyModeOnly: boolean;
    gtaOnlineSupported: false;
  };
};

const supportStoryModeOnly = {
  singlePlayerOnly: true,
  storyModeOnly: true,
  gtaOnlineSupported: false,
} as const;

const supportSinglePlayer = {
  singlePlayerOnly: true,
  storyModeOnly: false,
  gtaOnlineSupported: false,
} as const;

const entry = (item: GtaCheatEntry): GtaCheatEntry => item;

export const gtaGameNames: Record<GtaGameId, Record<AppLocale, string>> = {
  'gta-san-andreas': {
    'pt-br': 'GTA San Andreas',
    en: 'GTA San Andreas',
    es: 'GTA San Andreas',
  },
  'gta-v': {
    'pt-br': 'GTA V',
    en: 'GTA V',
    es: 'GTA V',
  },
  'gta-iv': {
    'pt-br': 'GTA IV',
    en: 'GTA IV',
    es: 'GTA IV',
  },
  'gta-iii': {
    'pt-br': 'GTA III',
    en: 'GTA III',
    es: 'GTA III',
  },
  'gta-vice-city': {
    'pt-br': 'GTA Vice City',
    en: 'GTA Vice City',
    es: 'GTA Vice City',
  },
};

export const gtaCheats: GtaCheatEntry[] = [
  entry({
    id: 'sa-health-armor-money',
    game: 'gta-san-andreas',
    category: 'vida-armadura',
    names: {
      'pt-br': 'Vida, armadura e $250.000',
      en: 'Health, armor and $250,000',
      es: 'Vida, armadura y $250,000',
    },
    codes: { pcPhrase: 'INEEDSOMEHELP', pcCode: 'HESOYAM' },
    keywords: {
      'pt-br': ['vida', 'armadura', 'dinheiro', 'cura'],
      en: ['health', 'armor', 'money', 'heal'],
      es: ['vida', 'armadura', 'dinero', 'curar'],
    },
    support: supportSinglePlayer,
  }),
  entry({
    id: 'sa-weapons-1',
    game: 'gta-san-andreas',
    category: 'armas',
    names: {
      'pt-br': 'Armas set 1',
      en: 'Weapon set 1',
      es: 'Armas set 1',
    },
    codes: { pcPhrase: 'THUGSARMOURY', pcCode: 'LXGIWYL' },
    keywords: {
      'pt-br': ['armas', 'arma', 'municao'],
      en: ['weapons', 'guns', 'ammo'],
      es: ['armas', 'municion'],
    },
    support: supportSinglePlayer,
  }),
  entry({
    id: 'sa-weapons-2',
    game: 'gta-san-andreas',
    category: 'armas',
    names: {
      'pt-br': 'Armas set 2',
      en: 'Weapon set 2',
      es: 'Armas set 2',
    },
    codes: { pcPhrase: 'PROFESSIONALSKIT', pcCode: 'KJKSZPJ' },
    keywords: {
      'pt-br': ['armas', 'profissional'],
      en: ['weapons', 'professional'],
      es: ['armas', 'profesional'],
    },
    support: supportSinglePlayer,
  }),
  entry({
    id: 'sa-weapons-3',
    game: 'gta-san-andreas',
    category: 'armas',
    names: {
      'pt-br': 'Armas set 3',
      en: 'Weapon set 3',
      es: 'Armas set 3',
    },
    codes: { pcPhrase: 'NUTTERSTOYS', pcCode: 'UZUMYMW' },
    keywords: {
      'pt-br': ['armas', 'pesadas'],
      en: ['weapons', 'heavy'],
      es: ['armas', 'pesadas'],
    },
    support: supportSinglePlayer,
  }),
  entry({
    id: 'sa-infinite-ammo',
    game: 'gta-san-andreas',
    category: 'armas',
    names: {
      'pt-br': 'Municao infinita / sem recarregar',
      en: 'Infinite ammo / no reload',
      es: 'Municion infinita / sin recargar',
    },
    codes: { pcPhrase: 'FULLCLIP', pcCode: 'WANRLTW' },
    keywords: {
      'pt-br': ['municao', 'infinita', 'sem recarregar'],
      en: ['ammo', 'infinite', 'no reload'],
      es: ['municion', 'infinita', 'sin recargar'],
    },
    support: supportSinglePlayer,
  }),
  entry({
    id: 'sa-super-jump',
    game: 'gta-san-andreas',
    category: 'movimento',
    names: {
      'pt-br': 'Super pulo',
      en: 'Super jump',
      es: 'Super salto',
    },
    codes: { pcPhrase: 'KANGAROO', pcCode: 'LFGMHAL' },
    keywords: {
      'pt-br': ['pulo', 'super pulo'],
      en: ['jump', 'super jump'],
      es: ['salto', 'super salto'],
    },
    support: supportSinglePlayer,
  }),
  entry({
    id: 'sa-jetpack',
    game: 'gta-san-andreas',
    category: 'equipamento',
    names: {
      'pt-br': 'Jetpack',
      en: 'Jetpack',
      es: 'Jetpack',
    },
    codes: { pcPhrase: 'ROCKETMAN', pcCode: 'YECGAA' },
    keywords: {
      'pt-br': ['jetpack', 'voar'],
      en: ['jetpack', 'fly'],
      es: ['jetpack', 'volar'],
    },
    support: supportSinglePlayer,
  }),
  entry({
    id: 'sa-parachute',
    game: 'gta-san-andreas',
    category: 'equipamento',
    names: {
      'pt-br': 'Paraquedas',
      en: 'Parachute',
      es: 'Paracaidas',
    },
    codes: { pcPhrase: 'LETSGOBASEJUMPING', pcCode: 'AIYPWZQP' },
    keywords: {
      'pt-br': ['paraquedas'],
      en: ['parachute'],
      es: ['paracaidas'],
    },
    support: supportSinglePlayer,
  }),
  entry({
    id: 'sa-invulnerable',
    game: 'gta-san-andreas',
    category: 'vida-armadura',
    names: {
      'pt-br': 'Quase invulneravel a tiro/fogo',
      en: 'Immune to guns and fire',
      es: 'Inmune a balas y fuego',
    },
    codes: { pcPhrase: 'NOONECANHURTME', pcCode: 'BAGUVIX' },
    keywords: {
      'pt-br': ['invencivel', 'vida', 'tiro', 'fogo'],
      en: ['invincible', 'guns', 'fire'],
      es: ['invencible', 'balas', 'fuego'],
    },
    support: supportSinglePlayer,
  }),
  entry({
    id: 'sa-wanted-6-stars',
    game: 'gta-san-andreas',
    category: 'policia',
    names: {
      'pt-br': '6 estrelas de procurado',
      en: 'Six-star wanted level',
      es: 'Seis estrellas de busqueda',
    },
    codes: { pcPhrase: 'BRINGITON', pcCode: 'LJSPQK' },
    keywords: {
      'pt-br': ['policia', '6 estrelas', 'procurado'],
      en: ['police', 'six stars', 'wanted'],
      es: ['policia', 'seis estrellas', 'busqueda'],
    },
    support: supportSinglePlayer,
  }),
  entry({
    id: 'sa-remove-wanted',
    game: 'gta-san-andreas',
    category: 'policia',
    names: {
      'pt-br': 'Remover procurado',
      en: 'Remove wanted level',
      es: 'Quitar busqueda',
    },
    codes: { pcPhrase: 'TURNDOWNTHEHEAT', pcCode: 'ASNAEB' },
    keywords: {
      'pt-br': ['policia', 'tirar estrela'],
      en: ['police', 'remove wanted'],
      es: ['policia', 'quitar busqueda'],
    },
    support: supportSinglePlayer,
  }),
  entry({
    id: 'sa-spawn-hunter',
    game: 'gta-san-andreas',
    category: 'spawn-veiculos',
    names: {
      'pt-br': 'Spawn Hunter helicoptero',
      en: 'Spawn Hunter helicopter',
      es: 'Generar helicoptero Hunter',
    },
    codes: { pc: 'OHDUDE' },
    keywords: {
      'pt-br': ['helicoptero', 'hunter', 'heli'],
      en: ['helicopter', 'hunter', 'heli'],
      es: ['helicoptero', 'hunter'],
    },
    support: supportSinglePlayer,
  }),
  entry({
    id: 'sa-spawn-hydra',
    game: 'gta-san-andreas',
    category: 'spawn-veiculos',
    names: {
      'pt-br': 'Spawn Hydra jato',
      en: 'Spawn Hydra jet',
      es: 'Generar jet Hydra',
    },
    codes: { pc: 'JUMPJET' },
    keywords: {
      'pt-br': ['aviao', 'jato', 'hydra'],
      en: ['jet', 'hydra', 'plane'],
      es: ['jet', 'hydra', 'avion'],
    },
    support: supportSinglePlayer,
  }),
  entry({
    id: 'sa-spawn-rhino',
    game: 'gta-san-andreas',
    category: 'spawn-veiculos',
    names: {
      'pt-br': 'Spawn Rhino tank',
      en: 'Spawn Rhino tank',
      es: 'Generar tanque Rhino',
    },
    codes: { pcPhrase: 'TIMETOKICKASS', pcCode: 'AIWPRTON' },
    keywords: {
      'pt-br': ['tanque', 'rhino'],
      en: ['tank', 'rhino'],
      es: ['tanque', 'rhino'],
    },
    support: supportSinglePlayer,
  }),
  entry({
    id: 'sa-flying-cars',
    game: 'gta-san-andreas',
    category: 'veiculos',
    names: {
      'pt-br': 'Carros voam',
      en: 'Flying cars',
      es: 'Coches vuelan',
    },
    codes: { pcPhrase: 'CHITTYCHITTYBANGBANG', pcCode: 'RIPAZHA' },
    keywords: {
      'pt-br': ['carro', 'voar'],
      en: ['flying cars', 'car'],
      es: ['coches', 'volar'],
    },
    support: supportSinglePlayer,
  }),
  entry({
    id: 'sa-cars-nitro',
    game: 'gta-san-andreas',
    category: 'veiculos',
    names: {
      'pt-br': 'Todos carros com nitro',
      en: 'All cars have nitro',
      es: 'Todos los coches con nitro',
    },
    codes: { pcPhrase: 'SPEEDFREAK', pcCode: 'COXEFGU' },
    keywords: {
      'pt-br': ['nitro', 'carro', 'velocidade'],
      en: ['nitro', 'cars', 'speed'],
      es: ['nitro', 'coches', 'velocidad'],
    },
    support: supportSinglePlayer,
  }),
  entry({
    id: 'sa-gangs-everywhere',
    game: 'gta-san-andreas',
    category: 'npc',
    names: {
      'pt-br': 'Gangues em todo lugar',
      en: 'Gang members everywhere',
      es: 'Pandilleros por todos lados',
    },
    codes: { pcPhrase: 'ONLYHOMIESALLOWED', pcCode: 'MROEMZH' },
    keywords: {
      'pt-br': ['gangue', 'npc', 'rua'],
      en: ['gangs', 'gang members'],
      es: ['pandillas', 'pandilleros'],
    },
    support: supportSinglePlayer,
  }),
  entry({
    id: 'sa-ped-chaos',
    game: 'gta-san-andreas',
    category: 'npc',
    names: {
      'pt-br': 'Pedestres caoticos',
      en: 'Pedestrian chaos',
      es: 'Caos de peatones',
    },
    codes: { pcPhrase: 'ROUGHNEIGHBOURHOOD', pcCode: 'AJLOJYQY' },
    keywords: {
      'pt-br': ['pedestre', 'caos'],
      en: ['pedestrians', 'chaos'],
      es: ['peatones', 'caos'],
    },
    support: supportSinglePlayer,
  }),
  entry({
    id: 'sa-sunny-weather',
    game: 'gta-san-andreas',
    category: 'clima',
    names: {
      'pt-br': 'Clima ensolarado',
      en: 'Sunny weather',
      es: 'Clima soleado',
    },
    codes: { pcPhrase: 'PLEASANTLYWARM', pcCode: 'AFZLLQLL' },
    keywords: {
      'pt-br': ['clima', 'sol'],
      en: ['weather', 'sunny'],
      es: ['clima', 'sol'],
    },
    support: supportSinglePlayer,
  }),
  entry({
    id: 'sa-rain-weather',
    game: 'gta-san-andreas',
    category: 'clima',
    names: {
      'pt-br': 'Clima chuvoso',
      en: 'Rainy weather',
      es: 'Clima lluvioso',
    },
    codes: { pcPhrase: 'STAYINANDWATCHTV', pcCode: 'AUIFRVQS' },
    keywords: {
      'pt-br': ['clima', 'chuva'],
      en: ['weather', 'rain'],
      es: ['clima', 'lluvia'],
    },
    support: supportSinglePlayer,
  }),
  entry({
    id: 'sa-fast-gameplay',
    game: 'gta-san-andreas',
    category: 'mundo',
    names: {
      'pt-br': 'Gameplay rapido',
      en: 'Faster gameplay',
      es: 'Juego mas rapido',
    },
    codes: { pcPhrase: 'SPEEDITUP', pcCode: 'PPGWJHT' },
    keywords: {
      'pt-br': ['rapido', 'velocidade'],
      en: ['speed', 'fast'],
      es: ['rapido', 'velocidad'],
    },
    support: supportSinglePlayer,
  }),

  entry({
    id: 'v-invincibility',
    game: 'gta-v',
    category: 'vida-armadura',
    names: {
      'pt-br': 'Invencibilidade por 5 minutos',
      en: 'Invincibility for 5 minutes',
      es: 'Invencibilidad por 5 minutos',
    },
    codes: { pc: 'PAINKILLER', phone: '1-999-724-654-5537 / 1-999-PAINKILLER' },
    keywords: {
      'pt-br': ['vida', 'invencivel', 'invencibilidade', 'god mode'],
      en: ['invincibility', 'invincible', 'god mode'],
      es: ['invencibilidad', 'invencible', 'modo dios'],
    },
    note: 'Dura cerca de 5 minutos. Nao funciona no GTA Online.',
    support: supportStoryModeOnly,
  }),
  entry({
    id: 'v-max-health-armor',
    game: 'gta-v',
    category: 'vida-armadura',
    names: {
      'pt-br': 'Vida e armadura no maximo',
      en: 'Max health and armor',
      es: 'Vida y armadura al maximo',
    },
    codes: { pc: 'TURTLE', phone: '1-999-887-853 / 1-999-TURTLE' },
    keywords: {
      'pt-br': ['vida', 'armadura', 'colete', 'cura'],
      en: ['health', 'armor', 'heal'],
      es: ['vida', 'armadura', 'curar'],
    },
    support: supportStoryModeOnly,
  }),
  entry({
    id: 'v-weapon-ammo',
    game: 'gta-v',
    category: 'armas',
    names: {
      'pt-br': 'Armas e municao',
      en: 'Weapons and ammo',
      es: 'Armas y municion',
    },
    codes: { pc: 'TOOLUP', phone: '1-999-866-587 / 1-999-TOOLUP' },
    keywords: {
      'pt-br': ['arma', 'armas', 'municao', 'kit armas'],
      en: ['weapons', 'guns', 'ammo'],
      es: ['armas', 'municion'],
    },
    support: supportStoryModeOnly,
  }),
  entry({
    id: 'v-raise-wanted',
    game: 'gta-v',
    category: 'policia',
    names: {
      'pt-br': 'Aumentar nivel de procurado',
      en: 'Raise wanted level',
      es: 'Subir nivel de busqueda',
    },
    codes: { pc: 'FUGITIVE', phone: '1-999-3844-8483 / 1-999-FUGITIVE' },
    keywords: {
      'pt-br': ['policia', 'procurado', 'estrela'],
      en: ['police', 'wanted', 'stars'],
      es: ['policia', 'busqueda', 'estrellas'],
    },
    support: supportStoryModeOnly,
  }),
  entry({
    id: 'v-lower-wanted',
    game: 'gta-v',
    category: 'policia',
    names: {
      'pt-br': 'Diminuir nivel de procurado',
      en: 'Lower wanted level',
      es: 'Bajar nivel de busqueda',
    },
    codes: { pc: 'LAWYERUP', phone: '1-999-5299-3787 / 1-999-LAWYERUP' },
    keywords: {
      'pt-br': ['policia', 'tirar estrela', 'remover procurado'],
      en: ['police', 'lower wanted', 'remove stars'],
      es: ['policia', 'quitar estrellas'],
    },
    support: supportStoryModeOnly,
  }),
  entry({
    id: 'v-fast-run',
    game: 'gta-v',
    category: 'movimento',
    names: {
      'pt-br': 'Correr mais rapido',
      en: 'Fast run',
      es: 'Correr mas rapido',
    },
    codes: { pc: 'CATCHME', phone: '1-999-228-8463 / 1-999-CATCHME' },
    keywords: {
      'pt-br': ['correr', 'velocidade'],
      en: ['run', 'speed'],
      es: ['correr', 'velocidad'],
    },
    support: supportStoryModeOnly,
  }),
  entry({
    id: 'v-fast-swim',
    game: 'gta-v',
    category: 'movimento',
    names: {
      'pt-br': 'Nadar mais rapido',
      en: 'Fast swim',
      es: 'Nadar mas rapido',
    },
    codes: { pc: 'GOTGILLS', phone: '1-999-468-44557 / 1-999-GOTGILLS' },
    keywords: {
      'pt-br': ['nadar', 'agua'],
      en: ['swim', 'water'],
      es: ['nadar', 'agua'],
    },
    support: supportStoryModeOnly,
  }),
  entry({
    id: 'v-super-jump',
    game: 'gta-v',
    category: 'movimento',
    names: {
      'pt-br': 'Super pulo',
      en: 'Super jump',
      es: 'Super salto',
    },
    codes: { pc: 'HOPTOIT', phone: '1-999-467-8648 / 1-999-HOPTOIT' },
    keywords: {
      'pt-br': ['pulo', 'salto', 'super pulo'],
      en: ['jump', 'super jump'],
      es: ['salto', 'super salto'],
    },
    support: supportStoryModeOnly,
  }),
  entry({
    id: 'v-explosive-ammo',
    game: 'gta-v',
    category: 'combate',
    names: {
      'pt-br': 'Municao explosiva',
      en: 'Explosive ammo',
      es: 'Municion explosiva',
    },
    codes: { pc: 'HIGHEX', phone: '1-999-444-439 / 1-999-HIGHEX' },
    keywords: {
      'pt-br': ['municao explosiva', 'bala explosiva'],
      en: ['explosive ammo', 'explosive bullets'],
      es: ['municion explosiva', 'balas explosivas'],
    },
    support: supportStoryModeOnly,
  }),
  entry({
    id: 'v-flaming-bullets',
    game: 'gta-v',
    category: 'combate',
    names: {
      'pt-br': 'Balas incendiarias',
      en: 'Flaming bullets',
      es: 'Balas incendiarias',
    },
    codes: { pc: 'INCENDIARY', phone: '1-999-462-363-4279 / 1-999-INCENDIARY' },
    keywords: {
      'pt-br': ['fogo', 'incendiario', 'bala de fogo'],
      en: ['fire bullets', 'incendiary'],
      es: ['balas incendiarias', 'fuego'],
    },
    support: supportStoryModeOnly,
  }),
  entry({
    id: 'v-change-weather',
    game: 'gta-v',
    category: 'clima',
    names: {
      'pt-br': 'Mudar clima',
      en: 'Change weather',
      es: 'Cambiar clima',
    },
    codes: { pc: 'MAKEITRAIN', phone: '1-999-625-348-7246 / 1-999-MAKEITRAIN' },
    keywords: {
      'pt-br': ['clima', 'chuva', 'tempo', 'neve'],
      en: ['weather', 'rain', 'climate'],
      es: ['clima', 'lluvia', 'tiempo'],
    },
    support: supportStoryModeOnly,
  }),
  entry({
    id: 'v-moon-gravity',
    game: 'gta-v',
    category: 'mundo',
    names: {
      'pt-br': 'Gravidade lunar',
      en: 'Moon gravity',
      es: 'Gravedad lunar',
    },
    codes: { pc: 'FLOATER', phone: '1-999-356-2837 / 1-999-FLOATER' },
    keywords: {
      'pt-br': ['gravidade', 'lua'],
      en: ['gravity', 'moon'],
      es: ['gravedad', 'luna'],
    },
    support: supportStoryModeOnly,
  }),
  entry({
    id: 'v-skyfall',
    game: 'gta-v',
    category: 'mundo',
    names: {
      'pt-br': 'Skyfall / cair do ceu',
      en: 'Skyfall',
      es: 'Caer del cielo',
    },
    codes: { pc: 'SKYFALL', phone: '1-999-759-3255 / 1-999-SKYFALL' },
    keywords: {
      'pt-br': ['cair do ceu', 'skyfall'],
      en: ['skyfall', 'fall'],
      es: ['caer del cielo', 'skyfall'],
    },
    support: supportStoryModeOnly,
  }),
  entry({
    id: 'v-director-mode',
    game: 'gta-v',
    category: 'mundo',
    names: {
      'pt-br': 'Director mode',
      en: 'Director mode',
      es: 'Modo director',
    },
    codes: { pc: 'JRTALENT', phone: '1-999-578-25368 / 1-999-JRTALENT' },
    keywords: {
      'pt-br': ['diretor', 'modo diretor'],
      en: ['director', 'director mode'],
      es: ['director', 'modo director'],
    },
    support: supportStoryModeOnly,
  }),
  entry({
    id: 'v-spawn-buzzard',
    game: 'gta-v',
    category: 'spawn-veiculos',
    names: {
      'pt-br': 'Spawn Buzzard helicoptero',
      en: 'Spawn Buzzard helicopter',
      es: 'Generar helicoptero Buzzard',
    },
    codes: { pc: 'BUZZOFF', phone: '1-999-289-9633 / 1-999-BUZZOFF' },
    keywords: {
      'pt-br': ['helicoptero', 'buzzard', 'heli'],
      en: ['helicopter', 'buzzard', 'heli'],
      es: ['helicoptero', 'buzzard'],
    },
    support: supportStoryModeOnly,
  }),
  entry({
    id: 'v-spawn-pcj-600',
    game: 'gta-v',
    category: 'spawn-veiculos',
    names: {
      'pt-br': 'Spawn PCJ-600 moto',
      en: 'Spawn PCJ-600 bike',
      es: 'Generar moto PCJ-600',
    },
    codes: { pc: 'ROCKET', phone: '1-999-762-538 / 1-999-ROCKET' },
    keywords: {
      'pt-br': ['moto', 'bike', 'pcj'],
      en: ['bike', 'motorcycle', 'pcj'],
      es: ['moto', 'pcj'],
    },
    support: supportStoryModeOnly,
  }),
  entry({
    id: 'v-spawn-sanchez',
    game: 'gta-v',
    category: 'spawn-veiculos',
    names: {
      'pt-br': 'Spawn Sanchez moto',
      en: 'Spawn Sanchez dirt bike',
      es: 'Generar moto Sanchez',
    },
    codes: { pc: 'OFFROAD', phone: '1-999-633-7623 / 1-999-OFFROAD' },
    keywords: {
      'pt-br': ['moto', 'sanchez', 'offroad'],
      en: ['bike', 'sanchez', 'offroad'],
      es: ['moto', 'sanchez', 'offroad'],
    },
    support: supportStoryModeOnly,
  }),
  entry({
    id: 'v-spawn-bmx',
    game: 'gta-v',
    category: 'spawn-veiculos',
    names: {
      'pt-br': 'Spawn BMX',
      en: 'Spawn BMX',
      es: 'Generar BMX',
    },
    codes: { pc: 'BANDIT', phone: '1-999-226-348 / 1-999-BANDIT' },
    keywords: {
      'pt-br': ['bike', 'bicicleta', 'bmx'],
      en: ['bike', 'bmx'],
      es: ['bicicleta', 'bmx'],
    },
    support: supportStoryModeOnly,
  }),
  entry({
    id: 'v-spawn-rapid-gt',
    game: 'gta-v',
    category: 'spawn-veiculos',
    names: {
      'pt-br': 'Spawn Rapid GT',
      en: 'Spawn Rapid GT',
      es: 'Generar Rapid GT',
    },
    codes: { pc: 'RAPIDGT', phone: '1-999-727-4348 / 1-999-RAPIDGT' },
    keywords: {
      'pt-br': ['carro', 'esportivo', 'rapid gt'],
      en: ['car', 'sports', 'rapid gt'],
      es: ['coche', 'deportivo', 'rapid gt'],
    },
    support: supportStoryModeOnly,
  }),
  entry({
    id: 'v-spawn-trashmaster',
    game: 'gta-v',
    category: 'spawn-veiculos',
    names: {
      'pt-br': 'Spawn Trashmaster',
      en: 'Spawn Trashmaster',
      es: 'Generar camion de basura',
    },
    codes: { pc: 'TRASHED', phone: '1-999-872-7433 / 1-999-TRASHED' },
    keywords: {
      'pt-br': ['caminhao', 'lixo', 'trashmaster'],
      en: ['truck', 'trashmaster', 'garbage'],
      es: ['camion', 'basura', 'trashmaster'],
    },
    support: supportStoryModeOnly,
  }),
  entry({
    id: 'v-spawn-dodo',
    game: 'gta-v',
    category: 'spawn-veiculos',
    names: {
      'pt-br': 'Spawn Dodo aviao',
      en: 'Spawn Dodo plane',
      es: 'Generar avion Dodo',
    },
    codes: { pc: 'EXTINCT', phone: '1-999-398-4628 / 1-999-EXTINCT' },
    keywords: {
      'pt-br': ['aviao', 'dodo', 'voar'],
      en: ['plane', 'dodo', 'fly'],
      es: ['avion', 'dodo', 'volar'],
    },
    note: 'Pode exigir desbloqueio por evento no modo historia.',
    support: supportStoryModeOnly,
  }),

  entry({
    id: 'iv-health-armor-ammo',
    game: 'gta-iv',
    category: 'vida-armadura',
    names: {
      'pt-br': 'Vida, armadura e municao',
      en: 'Health, armor and ammo',
      es: 'Vida, armadura y municion',
    },
    codes: { phone: '482-555-0100' },
    keywords: {
      'pt-br': ['vida', 'armadura', 'municao'],
      en: ['health', 'armor', 'ammo'],
      es: ['vida', 'armadura', 'municion'],
    },
    support: supportSinglePlayer,
  }),
  entry({
    id: 'iv-armor',
    game: 'gta-iv',
    category: 'vida-armadura',
    names: {
      'pt-br': 'Armadura',
      en: 'Armor',
      es: 'Armadura',
    },
    codes: { phone: '362-555-0100' },
    keywords: {
      'pt-br': ['armadura', 'colete'],
      en: ['armor', 'armour'],
      es: ['armadura'],
    },
    support: supportSinglePlayer,
  }),
  entry({
    id: 'iv-weapons-1',
    game: 'gta-iv',
    category: 'armas',
    names: {
      'pt-br': 'Armas pacote 1',
      en: 'Weapons pack 1',
      es: 'Armas paquete 1',
    },
    codes: { phone: '486-555-0150' },
    keywords: {
      'pt-br': ['arma', 'armas'],
      en: ['weapons', 'guns'],
      es: ['armas'],
    },
    support: supportSinglePlayer,
  }),
  entry({
    id: 'iv-weapons-2',
    game: 'gta-iv',
    category: 'armas',
    names: {
      'pt-br': 'Armas pacote 2',
      en: 'Weapons pack 2',
      es: 'Armas paquete 2',
    },
    codes: { phone: '486-555-0100' },
    keywords: {
      'pt-br': ['arma', 'armas'],
      en: ['weapons', 'guns'],
      es: ['armas'],
    },
    support: supportSinglePlayer,
  }),
  entry({
    id: 'iv-remove-wanted',
    game: 'gta-iv',
    category: 'policia',
    names: {
      'pt-br': 'Remover nivel de procurado',
      en: 'Remove wanted level',
      es: 'Quitar nivel de busqueda',
    },
    codes: { phone: '267-555-0100' },
    keywords: {
      'pt-br': ['policia', 'procurado', 'tirar estrela'],
      en: ['police', 'wanted', 'remove'],
      es: ['policia', 'busqueda', 'quitar'],
    },
    support: supportSinglePlayer,
  }),
  entry({
    id: 'iv-raise-wanted',
    game: 'gta-iv',
    category: 'policia',
    names: {
      'pt-br': 'Aumentar nivel de procurado',
      en: 'Raise wanted level',
      es: 'Subir nivel de busqueda',
    },
    codes: { phone: '267-555-0150' },
    keywords: {
      'pt-br': ['policia', 'procurado', 'estrela'],
      en: ['police', 'wanted', 'raise'],
      es: ['policia', 'busqueda', 'subir'],
    },
    support: supportSinglePlayer,
  }),
  entry({
    id: 'iv-change-weather',
    game: 'gta-iv',
    category: 'clima',
    names: {
      'pt-br': 'Mudar clima/hora',
      en: 'Change weather/time',
      es: 'Cambiar clima/hora',
    },
    codes: { phone: '468-555-0100' },
    keywords: {
      'pt-br': ['clima', 'tempo', 'chuva', 'hora'],
      en: ['weather', 'time'],
      es: ['clima', 'tiempo', 'hora'],
    },
    support: supportSinglePlayer,
  }),
  entry({
    id: 'iv-spawn-annihilator',
    game: 'gta-iv',
    category: 'spawn-veiculos',
    names: {
      'pt-br': 'Spawn Annihilator helicoptero',
      en: 'Spawn Annihilator helicopter',
      es: 'Generar helicoptero Annihilator',
    },
    codes: { phone: '359-555-0100' },
    keywords: {
      'pt-br': ['helicoptero', 'annihilator', 'heli'],
      en: ['helicopter', 'annihilator'],
      es: ['helicoptero', 'annihilator'],
    },
    support: supportSinglePlayer,
  }),
  entry({
    id: 'iv-spawn-nrg900',
    game: 'gta-iv',
    category: 'spawn-veiculos',
    names: {
      'pt-br': 'Spawn NRG-900 moto',
      en: 'Spawn NRG-900 bike',
      es: 'Generar moto NRG-900',
    },
    codes: { phone: '625-555-0100' },
    keywords: {
      'pt-br': ['moto', 'nrg'],
      en: ['bike', 'motorcycle', 'nrg'],
      es: ['moto', 'nrg'],
    },
    support: supportSinglePlayer,
  }),
  entry({
    id: 'iv-spawn-sanchez',
    game: 'gta-iv',
    category: 'spawn-veiculos',
    names: {
      'pt-br': 'Spawn Sanchez moto',
      en: 'Spawn Sanchez bike',
      es: 'Generar moto Sanchez',
    },
    codes: { phone: '625-555-0150' },
    keywords: {
      'pt-br': ['moto', 'sanchez'],
      en: ['bike', 'sanchez'],
      es: ['moto', 'sanchez'],
    },
    support: supportSinglePlayer,
  }),
  entry({
    id: 'iv-episodes-apc',
    game: 'gta-iv',
    category: 'episodes',
    names: {
      'pt-br': 'Spawn APC tanque (Episodes)',
      en: 'Spawn APC tank (Episodes)',
      es: 'Generar tanque APC (Episodes)',
    },
    codes: { phone: '272-555-8265' },
    keywords: {
      'pt-br': ['tanque', 'apc', 'episodes'],
      en: ['tank', 'apc', 'episodes'],
      es: ['tanque', 'apc', 'episodes'],
    },
    note: 'Episodes from Liberty City / TBOGT.',
    support: supportSinglePlayer,
  }),
  entry({
    id: 'iv-episodes-explosive-sniper',
    game: 'gta-iv',
    category: 'episodes',
    names: {
      'pt-br': 'Balas explosivas de sniper (Episodes)',
      en: 'Explosive sniper bullets (Episodes)',
      es: 'Balas explosivas de francotirador (Episodes)',
    },
    codes: { phone: '486-555-2526' },
    keywords: {
      'pt-br': ['sniper', 'explosiva', 'episodes'],
      en: ['sniper', 'explosive bullets', 'episodes'],
      es: ['francotirador', 'explosivas', 'episodes'],
    },
    note: 'Episodes from Liberty City / TBOGT.',
    support: supportSinglePlayer,
  }),

  entry({
    id: 'iii-all-weapons',
    game: 'gta-iii',
    category: 'armas',
    names: {
      'pt-br': 'Todas as armas',
      en: 'All weapons',
      es: 'Todas las armas',
    },
    codes: { pc: 'GUNSGUNSGUNS' },
    keywords: {
      'pt-br': ['armas', 'arma', 'municao'],
      en: ['weapons', 'guns'],
      es: ['armas'],
    },
    support: supportSinglePlayer,
  }),
  entry({
    id: 'iii-change-outfit',
    game: 'gta-iii',
    category: 'skins',
    names: {
      'pt-br': 'Trocar roupa/personagem',
      en: 'Change outfit/skin',
      es: 'Cambiar ropa/personaje',
    },
    codes: { pc: 'ILIKEDRESSINGUP' },
    keywords: {
      'pt-br': ['roupa', 'skin', 'personagem'],
      en: ['skin', 'outfit', 'character'],
      es: ['ropa', 'skin', 'personaje'],
    },
    support: supportSinglePlayer,
  }),
  entry({
    id: 'iii-full-armor',
    game: 'gta-iii',
    category: 'vida-armadura',
    names: {
      'pt-br': 'Armadura completa',
      en: 'Full armor',
      es: 'Armadura completa',
    },
    codes: { pc: 'TORTOISE / TURTOISE' },
    keywords: {
      'pt-br': ['armadura', 'colete'],
      en: ['armor', 'armour'],
      es: ['armadura'],
    },
    note: 'Algumas versoes aceitam TURTOISE; outras usam TORTOISE.',
    needsValidation: true,
    support: supportSinglePlayer,
  }),
  entry({
    id: 'iii-full-health',
    game: 'gta-iii',
    category: 'vida-armadura',
    names: {
      'pt-br': 'Vida completa',
      en: 'Full health',
      es: 'Vida completa',
    },
    codes: { pc: 'GESUNDHEIT' },
    keywords: {
      'pt-br': ['vida', 'cura', 'health'],
      en: ['health', 'heal'],
      es: ['vida', 'curar'],
    },
    support: supportSinglePlayer,
  }),
  entry({
    id: 'iii-money-250k',
    game: 'gta-iii',
    category: 'dinheiro',
    names: {
      'pt-br': 'Dinheiro $250.000',
      en: 'Money $250,000',
      es: 'Dinero $250,000',
    },
    codes: { pc: 'IFIWEREARICHMAN' },
    keywords: {
      'pt-br': ['dinheiro', 'grana', 'money'],
      en: ['money', 'cash'],
      es: ['dinero', 'plata'],
    },
    support: supportSinglePlayer,
  }),
  entry({
    id: 'iii-raise-wanted',
    game: 'gta-iii',
    category: 'policia',
    names: {
      'pt-br': 'Aumentar procurado',
      en: 'Raise wanted level',
      es: 'Subir busqueda',
    },
    codes: { pc: 'MOREPOLICEPLEASE' },
    keywords: {
      'pt-br': ['policia', 'procurado', 'estrela'],
      en: ['police', 'wanted', 'raise'],
      es: ['policia', 'busqueda'],
    },
    support: supportSinglePlayer,
  }),
  entry({
    id: 'iii-lower-wanted',
    game: 'gta-iii',
    category: 'policia',
    names: {
      'pt-br': 'Diminuir procurado',
      en: 'Lower wanted level',
      es: 'Bajar busqueda',
    },
    codes: { pc: 'NOPOLICEPLEASE' },
    keywords: {
      'pt-br': ['policia', 'tirar estrela'],
      en: ['police', 'wanted', 'lower'],
      es: ['policia', 'quitar busqueda'],
    },
    support: supportSinglePlayer,
  }),
  entry({
    id: 'iii-spawn-rhino',
    game: 'gta-iii',
    category: 'spawn-veiculos',
    names: {
      'pt-br': 'Spawn Rhino tank',
      en: 'Spawn Rhino tank',
      es: 'Generar tanque Rhino',
    },
    codes: { pc: 'GIVEUSATANK' },
    keywords: {
      'pt-br': ['tanque', 'rhino'],
      en: ['tank', 'rhino'],
      es: ['tanque', 'rhino'],
    },
    support: supportSinglePlayer,
  }),
  entry({
    id: 'iii-flying-cars',
    game: 'gta-iii',
    category: 'veiculos',
    names: {
      'pt-br': 'Carros voam',
      en: 'Flying vehicles',
      es: 'Vehiculos vuelan',
    },
    codes: { pc: 'CHITTYCHITTYBB' },
    keywords: {
      'pt-br': ['carro', 'voar'],
      en: ['car', 'flying'],
      es: ['coche', 'volar'],
    },
    support: supportSinglePlayer,
  }),
  entry({
    id: 'iii-explode-cars',
    game: 'gta-iii',
    category: 'veiculos',
    names: {
      'pt-br': 'Destruir todos os carros',
      en: 'Destroy all cars',
      es: 'Destruir todos los coches',
    },
    codes: { pc: 'BANGBANGBANG' },
    keywords: {
      'pt-br': ['carro', 'explodir', 'destruir'],
      en: ['cars', 'explode', 'destroy'],
      es: ['coches', 'explotar', 'destruir'],
    },
    support: supportSinglePlayer,
  }),
  entry({
    id: 'iii-fast-time',
    game: 'gta-iii',
    category: 'mundo',
    names: {
      'pt-br': 'Gameplay rapido',
      en: 'Fast motion',
      es: 'Movimiento rapido',
    },
    codes: { pc: 'TIMEFLIESWHENYOU' },
    keywords: {
      'pt-br': ['rapido', 'tempo'],
      en: ['fast', 'speed'],
      es: ['rapido', 'velocidad'],
    },
    support: supportSinglePlayer,
  }),

  entry({
    id: 'vc-full-health',
    game: 'gta-vice-city',
    category: 'player',
    names: {
      'pt-br': 'Vida completa',
      en: 'Full health',
      es: 'Vida completa',
    },
    codes: { pc: 'ASPIRINE' },
    keywords: {
      'pt-br': ['vida', 'cura'],
      en: ['health', 'heal'],
      es: ['vida', 'curar'],
    },
    support: supportSinglePlayer,
  }),
  entry({
    id: 'vc-full-armor',
    game: 'gta-vice-city',
    category: 'player',
    names: {
      'pt-br': 'Armadura completa',
      en: 'Full armor',
      es: 'Armadura completa',
    },
    codes: { pc: 'PRECIOUSPROTECTION' },
    keywords: {
      'pt-br': ['armadura', 'colete'],
      en: ['armor', 'armour'],
      es: ['armadura'],
    },
    support: supportSinglePlayer,
  }),
  entry({
    id: 'vc-weapons-light',
    game: 'gta-vice-city',
    category: 'armas',
    names: {
      'pt-br': 'Armas leves',
      en: 'Basic/light weapons',
      es: 'Armas ligeras',
    },
    codes: { pc: 'THUGSTOOLS' },
    keywords: {
      'pt-br': ['arma', 'armas', 'leve'],
      en: ['weapons', 'light'],
      es: ['armas', 'ligeras'],
    },
    support: supportSinglePlayer,
  }),
  entry({
    id: 'vc-weapons-medium',
    game: 'gta-vice-city',
    category: 'armas',
    names: {
      'pt-br': 'Armas medias',
      en: 'Intermediate weapons',
      es: 'Armas medias',
    },
    codes: { pc: 'PROFESSIONALTOOLS' },
    keywords: {
      'pt-br': ['arma', 'armas', 'media'],
      en: ['weapons', 'medium'],
      es: ['armas', 'medias'],
    },
    support: supportSinglePlayer,
  }),
  entry({
    id: 'vc-weapons-heavy',
    game: 'gta-vice-city',
    category: 'armas',
    names: {
      'pt-br': 'Armas pesadas',
      en: 'Heavy weapons',
      es: 'Armas pesadas',
    },
    codes: { pc: 'NUTTERTOOLS' },
    keywords: {
      'pt-br': ['arma', 'armas', 'pesada'],
      en: ['weapons', 'heavy'],
      es: ['armas', 'pesadas'],
    },
    support: supportSinglePlayer,
  }),
  entry({
    id: 'vc-raise-wanted',
    game: 'gta-vice-city',
    category: 'policia',
    names: {
      'pt-br': 'Aumentar procurado',
      en: 'Raise wanted level',
      es: 'Subir busqueda',
    },
    codes: { pc: 'YOUWONTTAKEMEALIVE' },
    keywords: {
      'pt-br': ['policia', 'procurado', 'estrela'],
      en: ['police', 'wanted', 'raise'],
      es: ['policia', 'busqueda', 'subir'],
    },
    support: supportSinglePlayer,
  }),
  entry({
    id: 'vc-lower-wanted',
    game: 'gta-vice-city',
    category: 'policia',
    names: {
      'pt-br': 'Diminuir procurado',
      en: 'Lower wanted level',
      es: 'Bajar busqueda',
    },
    codes: { pc: 'LEAVEMEALONE' },
    keywords: {
      'pt-br': ['policia', 'tirar policia'],
      en: ['police', 'wanted', 'lower'],
      es: ['policia', 'quitar busqueda'],
    },
    support: supportSinglePlayer,
  }),
  entry({
    id: 'vc-amphibious-cars',
    game: 'gta-vice-city',
    category: 'veiculos',
    names: {
      'pt-br': 'Carros andam na agua',
      en: 'Amphibious cars',
      es: 'Coches anfibios',
    },
    codes: { pc: 'SEAWAYS' },
    keywords: {
      'pt-br': ['carro', 'agua', 'mar'],
      en: ['car', 'water', 'amphibious'],
      es: ['coche', 'agua'],
    },
    support: supportSinglePlayer,
  }),
  entry({
    id: 'vc-flying-cars',
    game: 'gta-vice-city',
    category: 'veiculos',
    names: {
      'pt-br': 'Carros voam',
      en: 'Flying vehicles',
      es: 'Vehiculos vuelan',
    },
    codes: { pc: 'COMEFLYWITHME' },
    keywords: {
      'pt-br': ['carro', 'voar'],
      en: ['cars', 'flying'],
      es: ['coches', 'volar'],
    },
    support: supportSinglePlayer,
  }),
  entry({
    id: 'vc-spawn-rhino',
    game: 'gta-vice-city',
    category: 'spawn-veiculos',
    names: {
      'pt-br': 'Spawn Rhino tank',
      en: 'Spawn Rhino tank',
      es: 'Generar tanque Rhino',
    },
    codes: { pc: 'PANZER' },
    keywords: {
      'pt-br': ['tanque', 'rhino'],
      en: ['tank', 'rhino'],
      es: ['tanque', 'rhino'],
    },
    support: supportSinglePlayer,
  }),
  entry({
    id: 'vc-spawn-trashmaster',
    game: 'gta-vice-city',
    category: 'spawn-veiculos',
    names: {
      'pt-br': 'Spawn Trashmaster',
      en: 'Spawn Trashmaster',
      es: 'Generar camion de basura',
    },
    codes: { pc: 'RUBBISHCAR' },
    keywords: {
      'pt-br': ['caminhao', 'lixo'],
      en: ['trash', 'truck'],
      es: ['basura', 'camion'],
    },
    support: supportSinglePlayer,
  }),
  entry({
    id: 'vc-ped-riot',
    game: 'gta-vice-city',
    category: 'npc',
    names: {
      'pt-br': 'Motim/riot',
      en: 'Riot',
      es: 'Disturbios',
    },
    codes: { pc: 'FIGHTFIGHTFIGHT' },
    keywords: {
      'pt-br': ['riot', 'caos', 'pedestres'],
      en: ['riot', 'chaos', 'pedestrians'],
      es: ['disturbios', 'caos', 'peatones'],
    },
    support: supportSinglePlayer,
  }),
  entry({
    id: 'vc-armed-pedestrians',
    game: 'gta-vice-city',
    category: 'npc',
    names: {
      'pt-br': 'Pedestres armados',
      en: 'Armed pedestrians',
      es: 'Peatones armados',
    },
    codes: { pc: 'OURGODGIVENRIGHTTOBEARARMS' },
    keywords: {
      'pt-br': ['npc', 'pedestre', 'armas'],
      en: ['pedestrians', 'weapons'],
      es: ['peatones', 'armas'],
    },
    support: supportSinglePlayer,
  }),
  entry({
    id: 'vc-sunny-weather',
    game: 'gta-vice-city',
    category: 'clima',
    names: {
      'pt-br': 'Clima ensolarado',
      en: 'Sunny weather',
      es: 'Clima soleado',
    },
    codes: { pc: 'ALOVELYDAY' },
    keywords: {
      'pt-br': ['clima', 'sol'],
      en: ['weather', 'sunny'],
      es: ['clima', 'sol'],
    },
    support: supportSinglePlayer,
  }),
  entry({
    id: 'vc-rain-weather',
    game: 'gta-vice-city',
    category: 'clima',
    names: {
      'pt-br': 'Clima chuvoso/tempestade',
      en: 'Rainy/stormy weather',
      es: 'Lluvia/tormenta',
    },
    codes: { pc: 'CATSANDDOGS' },
    keywords: {
      'pt-br': ['clima', 'chuva', 'tempestade'],
      en: ['weather', 'rain', 'storm'],
      es: ['clima', 'lluvia', 'tormenta'],
    },
    support: supportSinglePlayer,
  }),
  entry({
    id: 'vc-fog-weather',
    game: 'gta-vice-city',
    category: 'clima',
    names: {
      'pt-br': 'Neblina',
      en: 'Foggy weather',
      es: 'Niebla',
    },
    codes: { pc: 'CANTSEEATHING' },
    keywords: {
      'pt-br': ['clima', 'neblina', 'nevoa'],
      en: ['weather', 'fog'],
      es: ['clima', 'niebla'],
    },
    support: supportSinglePlayer,
  }),
];

export const gtaCheatById = new Map(gtaCheats.map((item) => [item.id, item]));
