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

export type GtaCheatSource = {
  name: string;
  url: string;
};

export type GtaCheatEntry = {
  id: string;
  game: GtaGameId;
  category: GtaCheatCategory;
  names: {
    'pt-br': string;
    en: string;
    es: string;
    zh: string;
  };
  codes: GtaCheatCodes;
  keywords: {
    'pt-br': string[];
    en: string[];
    es: string[];
    zh: string[];
  };
  note?: string;
  needsValidation?: boolean;
  support: {
    singlePlayerOnly: true;
    storyModeOnly: boolean;
    gtaOnlineSupported: false;
  };
  sources?: GtaCheatSource[];
};

export const gtaGameNames: Record<GtaGameId, Record<AppLocale, string>> = {
  'gta-san-andreas': {
    'pt-br': 'GTA San Andreas',
    en: 'GTA San Andreas',
    es: 'GTA San Andreas',
    zh: 'GTA San Andreas',
  },
  'gta-v': {
    'pt-br': 'GTA V',
    en: 'GTA V',
    es: 'GTA V',
    zh: 'GTA V',
  },
  'gta-iv': {
    'pt-br': 'GTA IV',
    en: 'GTA IV',
    es: 'GTA IV',
    zh: 'GTA IV',
  },
  'gta-iii': {
    'pt-br': 'GTA III',
    en: 'GTA III',
    es: 'GTA III',
    zh: 'GTA III',
  },
  'gta-vice-city': {
    'pt-br': 'GTA Vice City',
    en: 'GTA Vice City',
    es: 'GTA Vice City',
    zh: 'GTA Vice City',
  },
};

export const gtaCategoryNames: Record<GtaCheatCategory, Record<AppLocale, string>> = {
  armas: { 'pt-br': 'Armas', en: 'Weapons', es: 'Armas',
  zh: 'Weapons', },
  'vida-armadura': { 'pt-br': 'Vida e armadura', en: 'Health and armor', es: 'Vida y armadura',
  zh: 'Health and armor', },
  policia: { 'pt-br': 'Polícia', en: 'Police', es: 'Policía',
  zh: 'Police', },
  veiculos: { 'pt-br': 'Veículos', en: 'Vehicles', es: 'Vehículos',
  zh: 'Vehicles', },
  'spawn-veiculos': { 'pt-br': 'Spawn de veículos', en: 'Vehicle spawns', es: 'Generar vehículos',
  zh: 'Vehicle spawns', },
  clima: { 'pt-br': 'Clima', en: 'Weather', es: 'Clima',
  zh: 'Weather', },
  mundo: { 'pt-br': 'Mundo', en: 'World', es: 'Mundo',
  zh: 'World', },
  npc: { 'pt-br': 'NPCs e pedestres', en: 'NPCs and pedestrians', es: 'NPCs y peatones',
  zh: 'NPCs and pedestrians', },
  skins: { 'pt-br': 'Skins/personagens', en: 'Skins/characters', es: 'Skins/personajes',
  zh: 'Skins/characters', },
  tema: { 'pt-br': 'Temas', en: 'Themes', es: 'Temas',
  zh: 'Themes', },
  movimento: { 'pt-br': 'Movimento', en: 'Movement', es: 'Movimiento',
  zh: 'Movement', },
  combate: { 'pt-br': 'Combate', en: 'Combat', es: 'Combate',
  zh: 'Combat', },
  dinheiro: { 'pt-br': 'Dinheiro', en: 'Money', es: 'Dinero',
  zh: 'Money', },
  habilidade: { 'pt-br': 'Habilidades', en: 'Skills', es: 'Habilidades',
  zh: 'Skills', },
  equipamento: { 'pt-br': 'Equipamentos', en: 'Equipment', es: 'Equipamiento',
  zh: 'Equipment', },
  player: { 'pt-br': 'Player', en: 'Player', es: 'Jugador',
  zh: 'Player', },
  musica: { 'pt-br': 'Música/rádio', en: 'Music/radio', es: 'Música/radio',
  zh: 'Music/radio', },
  episodes: { 'pt-br': 'Episodes/DLC', en: 'Episodes/DLC', es: 'Episodes/DLC',
  zh: 'Episodes/DLC', },
};

export const gtaCheats: GtaCheatEntry[] = 
[
  {
    "id": "sanandreas-health-armor-money",
    "game": "gta-san-andreas",
    "category": "vida-armadura",
    "names": {
      "pt-br": "Vida, armadura e $250.000",
      "en": "Health, armor and $250,000",
      "es": "Vida, armadura y $250,000",
      zh: "Health, armor and $250,000",
    },
    "codes": {
      "pcPhrase": "INEEDSOMEHELP",
      "pcCode": "HESOYAM"
    },
    "keywords": {
      "pt-br": [
        "vida",
        "armadura",
        "dinheiro",
        "cura",
        "colete",
        "Vida, armadura e $250.000",
        "INEEDSOMEHELP",
        "HESOYAM"
      ],
      "en": [
        "health",
        "armor",
        "money",
        "heal",
        "Health, armor and $250,000",
        "INEEDSOMEHELP",
        "HESOYAM"
      ],
      "es": [
        "vida",
        "armadura",
        "dinero",
        "curar",
        "Vida, armadura y $250,000",
        "INEEDSOMEHELP",
        "HESOYAM"
      ],
      zh: [
        "health",
        "armor",
        "money",
        "heal",
        "Health, armor and $250,000",
        "INEEDSOMEHELP",
        "HESOYAM"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-weapons-1",
    "game": "gta-san-andreas",
    "category": "armas",
    "names": {
      "pt-br": "Armas set 1",
      "en": "Weapon set 1",
      "es": "Armas set 1",
      zh: "Weapon set 1",
    },
    "codes": {
      "pcPhrase": "THUGSARMOURY",
      "pcCode": "LXGIWYL"
    },
    "keywords": {
      "pt-br": [
        "armas",
        "arma",
        "munição",
        "Armas set 1",
        "THUGSARMOURY",
        "LXGIWYL"
      ],
      "en": [
        "weapons",
        "guns",
        "ammo",
        "Weapon set 1",
        "THUGSARMOURY",
        "LXGIWYL"
      ],
      "es": [
        "armas",
        "munición",
        "Armas set 1",
        "THUGSARMOURY",
        "LXGIWYL"
      ],
      zh: [
        "weapons",
        "guns",
        "ammo",
        "Weapon set 1",
        "THUGSARMOURY",
        "LXGIWYL"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-weapons-2",
    "game": "gta-san-andreas",
    "category": "armas",
    "names": {
      "pt-br": "Armas set 2",
      "en": "Weapon set 2",
      "es": "Armas set 2",
      zh: "Weapon set 2",
    },
    "codes": {
      "pcPhrase": "PROFESSIONALSKIT",
      "pcCode": "KJKSZPJ"
    },
    "keywords": {
      "pt-br": [
        "armas",
        "profissional",
        "Armas set 2",
        "PROFESSIONALSKIT",
        "KJKSZPJ"
      ],
      "en": [
        "weapons",
        "professional",
        "Weapon set 2",
        "PROFESSIONALSKIT",
        "KJKSZPJ"
      ],
      "es": [
        "armas",
        "profesional",
        "Armas set 2",
        "PROFESSIONALSKIT",
        "KJKSZPJ"
      ],
      zh: [
        "weapons",
        "professional",
        "Weapon set 2",
        "PROFESSIONALSKIT",
        "KJKSZPJ"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-weapons-3",
    "game": "gta-san-andreas",
    "category": "armas",
    "names": {
      "pt-br": "Armas set 3",
      "en": "Weapon set 3",
      "es": "Armas set 3",
      zh: "Weapon set 3",
    },
    "codes": {
      "pcPhrase": "NUTTERSTOYS",
      "pcCode": "UZUMYMW"
    },
    "keywords": {
      "pt-br": [
        "armas",
        "pesadas",
        "Armas set 3",
        "NUTTERSTOYS",
        "UZUMYMW"
      ],
      "en": [
        "heavy weapons",
        "Weapon set 3",
        "NUTTERSTOYS",
        "UZUMYMW"
      ],
      "es": [
        "armas pesadas",
        "Armas set 3",
        "NUTTERSTOYS",
        "UZUMYMW"
      ],
      zh: [
        "heavy weapons",
        "Weapon set 3",
        "NUTTERSTOYS",
        "UZUMYMW"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-infinite-ammo",
    "game": "gta-san-andreas",
    "category": "armas",
    "names": {
      "pt-br": "Munição infinita / sem recarregar",
      "en": "Infinite ammo / no reload",
      "es": "Munición infinita / sin recargar",
      zh: "Infinite ammo / no reload",
    },
    "codes": {
      "pcPhrase": "FULLCLIP",
      "pcCode": "WANRLTW"
    },
    "keywords": {
      "pt-br": [
        "munição",
        "infinita",
        "sem recarregar",
        "Munição infinita / sem recarregar",
        "FULLCLIP",
        "WANRLTW"
      ],
      "en": [
        "ammo",
        "infinite",
        "no reload",
        "Infinite ammo / no reload",
        "FULLCLIP",
        "WANRLTW"
      ],
      "es": [
        "munición",
        "infinita",
        "sin recargar",
        "Munición infinita / sin recargar",
        "FULLCLIP",
        "WANRLTW"
      ],
      zh: [
        "ammo",
        "infinite",
        "no reload",
        "Infinite ammo / no reload",
        "FULLCLIP",
        "WANRLTW"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-adrenaline",
    "game": "gta-san-andreas",
    "category": "habilidade",
    "names": {
      "pt-br": "Efeito adrenalina",
      "en": "Adrenaline effect",
      "es": "Efecto adrenalina",
      zh: "Adrenaline effect",
    },
    "codes": {
      "pcPhrase": "TAKEACHILLPILL",
      "pcCode": "MUNASEF"
    },
    "keywords": {
      "pt-br": [
        "adrenalina",
        "câmera lenta",
        "Efeito adrenalina",
        "TAKEACHILLPILL",
        "MUNASEF"
      ],
      "en": [
        "adrenaline",
        "slow motion",
        "Adrenaline effect",
        "TAKEACHILLPILL",
        "MUNASEF"
      ],
      "es": [
        "adrenalina",
        "camara lenta",
        "Efecto adrenalina",
        "TAKEACHILLPILL",
        "MUNASEF"
      ],
      zh: [
        "adrenaline",
        "slow motion",
        "Adrenaline effect",
        "TAKEACHILLPILL",
        "MUNASEF"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-super-jump",
    "game": "gta-san-andreas",
    "category": "movimento",
    "names": {
      "pt-br": "Super pulo",
      "en": "Super jump",
      "es": "Super salto",
      zh: "Super jump",
    },
    "codes": {
      "pcPhrase": "KANGAROO",
      "pcCode": "LFGMHAL"
    },
    "keywords": {
      "pt-br": [
        "pulo",
        "salto",
        "Super pulo",
        "KANGAROO",
        "LFGMHAL"
      ],
      "en": [
        "jump",
        "Super jump",
        "KANGAROO",
        "LFGMHAL"
      ],
      "es": [
        "salto",
        "Super salto",
        "KANGAROO",
        "LFGMHAL"
      ],
      zh: [
        "jump",
        "Super jump",
        "KANGAROO",
        "LFGMHAL"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-suicide",
    "game": "gta-san-andreas",
    "category": "player",
    "names": {
      "pt-br": "Suicídio",
      "en": "Commit suicide",
      "es": "Suicidio",
      zh: "Commit suicide",
    },
    "codes": {
      "pcPhrase": "GOODBYECRUELWORLD",
      "pcCode": "SZCMAWO"
    },
    "keywords": {
      "pt-br": [
        "morrer",
        "suicidio",
        "Suicídio",
        "GOODBYECRUELWORLD",
        "SZCMAWO"
      ],
      "en": [
        "suicide",
        "die",
        "Commit suicide",
        "GOODBYECRUELWORLD",
        "SZCMAWO"
      ],
      "es": [
        "suicidio",
        "morir",
        "Suicidio",
        "GOODBYECRUELWORLD",
        "SZCMAWO"
      ],
      zh: [
        "suicide",
        "die",
        "Commit suicide",
        "GOODBYECRUELWORLD",
        "SZCMAWO"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-driveby-aim",
    "game": "gta-san-andreas",
    "category": "combate",
    "names": {
      "pt-br": "Mira completa dentro de veículos",
      "en": "Full weapon aiming in vehicles",
      "es": "Apuntado completo en vehículos",
      zh: "Full weapon aiming in vehicles",
    },
    "codes": {
      "pcPhrase": "IWANNADRIVEBY",
      "pcCode": "OUIQDMW"
    },
    "keywords": {
      "pt-br": [
        "carro",
        "veículo",
        "mira",
        "driveby",
        "Mira completa dentro de veículos",
        "IWANNADRIVEBY",
        "OUIQDMW"
      ],
      "en": [
        "vehicle",
        "aim",
        "driveby",
        "Full weapon aiming in vehicles",
        "IWANNADRIVEBY",
        "OUIQDMW"
      ],
      "es": [
        "vehiculo",
        "apuntar",
        "Apuntado completo en vehículos",
        "IWANNADRIVEBY",
        "OUIQDMW"
      ],
      zh: [
        "vehicle",
        "aim",
        "driveby",
        "Full weapon aiming in vehicles",
        "IWANNADRIVEBY",
        "OUIQDMW"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-hitman-weapons",
    "game": "gta-san-andreas",
    "category": "habilidade",
    "names": {
      "pt-br": "Habilidade hitman com todas as armas",
      "en": "Hitman skill rating with all weapons",
      "es": "Habilidad hitman con todas las armas",
      zh: "Hitman skill rating with all weapons",
    },
    "codes": {
      "pcPhrase": "PROFESSIONALKILLER",
      "pcCode": "NCSGDAG"
    },
    "keywords": {
      "pt-br": [
        "hitman",
        "habilidade",
        "armas",
        "Habilidade hitman com todas as armas",
        "PROFESSIONALKILLER",
        "NCSGDAG"
      ],
      "en": [
        "hitman",
        "weapon skill",
        "Hitman skill rating with all weapons",
        "PROFESSIONALKILLER",
        "NCSGDAG"
      ],
      "es": [
        "hitman",
        "habilidad",
        "Habilidad hitman con todas las armas",
        "PROFESSIONALKILLER",
        "NCSGDAG"
      ],
      zh: [
        "hitman",
        "weapon skill",
        "Hitman skill rating with all weapons",
        "PROFESSIONALKILLER",
        "NCSGDAG"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-infinite-lung",
    "game": "gta-san-andreas",
    "category": "habilidade",
    "names": {
      "pt-br": "Fôlego infinito",
      "en": "Infinite lung capacity",
      "es": "Capacidad pulmonar infinita",
      zh: "Infinite lung capacity",
    },
    "codes": {
      "pcPhrase": "MANFROMATLANTIS",
      "pcCode": "CVWKXAM"
    },
    "keywords": {
      "pt-br": [
        "fôlego",
        "oxigênio",
        "nadar",
        "Fôlego infinito",
        "MANFROMATLANTIS",
        "CVWKXAM"
      ],
      "en": [
        "lung",
        "oxygen",
        "swim",
        "Infinite lung capacity",
        "MANFROMATLANTIS",
        "CVWKXAM"
      ],
      "es": [
        "oxigeno",
        "nadar",
        "Capacidad pulmonar infinita",
        "MANFROMATLANTIS",
        "CVWKXAM"
      ],
      zh: [
        "lung",
        "oxygen",
        "swim",
        "Infinite lung capacity",
        "MANFROMATLANTIS",
        "CVWKXAM"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-max-driving",
    "game": "gta-san-andreas",
    "category": "habilidade",
    "names": {
      "pt-br": "Habilidade máxima de direção",
      "en": "Maximum driving skill",
      "es": "Habilidad máxima de conducción",
      zh: "Maximum driving skill",
    },
    "codes": {
      "pcPhrase": "NATURALTALENT",
      "pcCode": "VQIMAHA"
    },
    "keywords": {
      "pt-br": [
        "direção",
        "dirigir",
        "habilidade",
        "Habilidade máxima de direção",
        "NATURALTALENT",
        "VQIMAHA"
      ],
      "en": [
        "driving",
        "skill",
        "Maximum driving skill",
        "NATURALTALENT",
        "VQIMAHA"
      ],
      "es": [
        "conduccion",
        "habilidad",
        "Habilidad máxima de conducción",
        "NATURALTALENT",
        "VQIMAHA"
      ],
      zh: [
        "driving",
        "skill",
        "Maximum driving skill",
        "NATURALTALENT",
        "VQIMAHA"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-max-fat",
    "game": "gta-san-andreas",
    "category": "player",
    "names": {
      "pt-br": "Gordura máxima",
      "en": "Maximum fat",
      "es": "Grasa máxima",
      zh: "Maximum fat",
    },
    "codes": {
      "pcPhrase": "WHOATEALLTHEPIES",
      "pcCode": "BTCDBCB"
    },
    "keywords": {
      "pt-br": [
        "gordo",
        "gordura",
        "Gordura máxima",
        "WHOATEALLTHEPIES",
        "BTCDBCB"
      ],
      "en": [
        "fat",
        "Maximum fat",
        "WHOATEALLTHEPIES",
        "BTCDBCB"
      ],
      "es": [
        "grasa",
        "Grasa máxima",
        "WHOATEALLTHEPIES",
        "BTCDBCB"
      ],
      zh: [
        "fat",
        "Maximum fat",
        "WHOATEALLTHEPIES",
        "BTCDBCB"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-max-muscle",
    "game": "gta-san-andreas",
    "category": "player",
    "names": {
      "pt-br": "Músculo máximo",
      "en": "Maximum muscle",
      "es": "Músculo máximo",
      zh: "Maximum muscle",
    },
    "codes": {
      "pcPhrase": "BUFFMEUP",
      "pcCode": "JYSDSOD"
    },
    "keywords": {
      "pt-br": [
        "músculo",
        "forte",
        "Músculo máximo",
        "BUFFMEUP",
        "JYSDSOD"
      ],
      "en": [
        "muscle",
        "strong",
        "Maximum muscle",
        "BUFFMEUP",
        "JYSDSOD"
      ],
      "es": [
        "musculo",
        "fuerte",
        "Músculo máximo",
        "BUFFMEUP",
        "JYSDSOD"
      ],
      zh: [
        "muscle",
        "strong",
        "Maximum muscle",
        "BUFFMEUP",
        "JYSDSOD"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-max-respect",
    "game": "gta-san-andreas",
    "category": "player",
    "names": {
      "pt-br": "Respeito máximo",
      "en": "Maximum respect",
      "es": "Respeto máximo",
      zh: "Maximum respect",
    },
    "codes": {
      "pcPhrase": "WORSHIPME",
      "pcCode": "OGXSDAG"
    },
    "keywords": {
      "pt-br": [
        "respeito",
        "Respeito máximo",
        "WORSHIPME",
        "OGXSDAG"
      ],
      "en": [
        "respect",
        "Maximum respect",
        "WORSHIPME",
        "OGXSDAG"
      ],
      "es": [
        "respeto",
        "Respeto máximo",
        "WORSHIPME",
        "OGXSDAG"
      ],
      zh: [
        "respect",
        "Maximum respect",
        "WORSHIPME",
        "OGXSDAG"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-max-sex-appeal",
    "game": "gta-san-andreas",
    "category": "player",
    "names": {
      "pt-br": "Sex appeal máximo",
      "en": "Maximum sex appeal",
      "es": "Atractivo máximo",
      zh: "Maximum sex appeal",
    },
    "codes": {
      "pcPhrase": "HELLOLADIES",
      "pcCode": "EHIBXQS"
    },
    "keywords": {
      "pt-br": [
        "sex appeal",
        "atração",
        "Sex appeal máximo",
        "HELLOLADIES",
        "EHIBXQS"
      ],
      "en": [
        "sex appeal",
        "Maximum sex appeal",
        "HELLOLADIES",
        "EHIBXQS"
      ],
      "es": [
        "atractivo",
        "Atractivo máximo",
        "HELLOLADIES",
        "EHIBXQS"
      ],
      zh: [
        "sex appeal",
        "Maximum sex appeal",
        "HELLOLADIES",
        "EHIBXQS"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-max-stamina",
    "game": "gta-san-andreas",
    "category": "habilidade",
    "names": {
      "pt-br": "Stamina máxima",
      "en": "Maximum stamina",
      "es": "Resistencia máxima",
      zh: "Maximum stamina",
    },
    "codes": {
      "pcPhrase": "ICANGOALLNIGHT",
      "pcCode": "VKYPQCF"
    },
    "keywords": {
      "pt-br": [
        "stamina",
        "corrida",
        "resistência",
        "Stamina máxima",
        "ICANGOALLNIGHT",
        "VKYPQCF"
      ],
      "en": [
        "stamina",
        "run",
        "Maximum stamina",
        "ICANGOALLNIGHT",
        "VKYPQCF"
      ],
      "es": [
        "resistencia",
        "Resistencia máxima",
        "ICANGOALLNIGHT",
        "VKYPQCF"
      ],
      zh: [
        "stamina",
        "run",
        "Maximum stamina",
        "ICANGOALLNIGHT",
        "VKYPQCF"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-never-hungry",
    "game": "gta-san-andreas",
    "category": "player",
    "names": {
      "pt-br": "Nunca sentir fome",
      "en": "Never hungry",
      "es": "Nunca tener hambre",
      zh: "Never hungry",
    },
    "codes": {
      "pcPhrase": "IAMNEVERHUNGRY",
      "pcCode": "AEDUWNV"
    },
    "keywords": {
      "pt-br": [
        "fome",
        "comida",
        "Nunca sentir fome",
        "IAMNEVERHUNGRY",
        "AEDUWNV"
      ],
      "en": [
        "hungry",
        "food",
        "Never hungry",
        "IAMNEVERHUNGRY",
        "AEDUWNV"
      ],
      "es": [
        "hambre",
        "comida",
        "Nunca tener hambre",
        "IAMNEVERHUNGRY",
        "AEDUWNV"
      ],
      zh: [
        "hungry",
        "food",
        "Never hungry",
        "IAMNEVERHUNGRY",
        "AEDUWNV"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-jetpack",
    "game": "gta-san-andreas",
    "category": "equipamento",
    "names": {
      "pt-br": "Jetpack",
      "en": "Jetpack",
      "es": "Jetpack",
      zh: "Jetpack",
    },
    "codes": {
      "pcPhrase": "ROCKETMAN",
      "pcCode": "YECGAA"
    },
    "keywords": {
      "pt-br": [
        "jetpack",
        "voar",
        "Jetpack",
        "ROCKETMAN",
        "YECGAA"
      ],
      "en": [
        "jetpack",
        "fly",
        "Jetpack",
        "ROCKETMAN",
        "YECGAA"
      ],
      "es": [
        "jetpack",
        "volar",
        "Jetpack",
        "ROCKETMAN",
        "YECGAA"
      ],
      zh: [
        "jetpack",
        "fly",
        "Jetpack",
        "ROCKETMAN",
        "YECGAA"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-parachute",
    "game": "gta-san-andreas",
    "category": "equipamento",
    "names": {
      "pt-br": "Paraquedas",
      "en": "Parachute",
      "es": "Paracaídas",
      zh: "Parachute",
    },
    "codes": {
      "pcPhrase": "LETSGOBASEJUMPING",
      "pcCode": "AIYPWZQP"
    },
    "keywords": {
      "pt-br": [
        "paraquedas",
        "Paraquedas",
        "LETSGOBASEJUMPING",
        "AIYPWZQP"
      ],
      "en": [
        "parachute",
        "Parachute",
        "LETSGOBASEJUMPING",
        "AIYPWZQP"
      ],
      "es": [
        "paracaidas",
        "Paracaídas",
        "LETSGOBASEJUMPING",
        "AIYPWZQP"
      ],
      zh: [
        "parachute",
        "Parachute",
        "LETSGOBASEJUMPING",
        "AIYPWZQP"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-semi-invincible",
    "game": "gta-san-andreas",
    "category": "vida-armadura",
    "names": {
      "pt-br": "Quase invulnerável a tiros e fogo",
      "en": "Immune to guns and fire",
      "es": "Inmune a balas y fuego",
      zh: "Immune to guns and fire",
    },
    "codes": {
      "pcPhrase": "NOONECANHURTME",
      "pcCode": "BAGUVIX"
    },
    "keywords": {
      "pt-br": [
        "invencível",
        "vida",
        "tiro",
        "fogo",
        "Quase invulnerável a tiros e fogo",
        "NOONECANHURTME",
        "BAGUVIX"
      ],
      "en": [
        "invincible",
        "guns",
        "fire",
        "Immune to guns and fire",
        "NOONECANHURTME",
        "BAGUVIX"
      ],
      "es": [
        "invencible",
        "balas",
        "fuego",
        "Inmune a balas y fuego",
        "NOONECANHURTME",
        "BAGUVIX"
      ],
      zh: [
        "invincible",
        "guns",
        "fire",
        "Immune to guns and fire",
        "NOONECANHURTME",
        "BAGUVIX"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-super-punch",
    "game": "gta-san-andreas",
    "category": "combate",
    "names": {
      "pt-br": "Soco super forte",
      "en": "Super punch",
      "es": "Súper puñetazo",
      zh: "Super punch",
    },
    "codes": {
      "pcPhrase": "STINGLIKEABEE",
      "pcCode": "IAVENJQ"
    },
    "keywords": {
      "pt-br": [
        "soco",
        "porrada",
        "Soco super forte",
        "STINGLIKEABEE",
        "IAVENJQ"
      ],
      "en": [
        "punch",
        "melee",
        "Super punch",
        "STINGLIKEABEE",
        "IAVENJQ"
      ],
      "es": [
        "puñetazo",
        "golpe",
        "Súper puñetazo",
        "STINGLIKEABEE",
        "IAVENJQ"
      ],
      zh: [
        "punch",
        "melee",
        "Super punch",
        "STINGLIKEABEE",
        "IAVENJQ"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-skinny",
    "game": "gta-san-andreas",
    "category": "player",
    "names": {
      "pt-br": "Zerar gordura e músculo",
      "en": "Zero fat and muscle",
      "es": "Cero grasa y músculo",
      zh: "Zero fat and muscle",
    },
    "codes": {
      "pcPhrase": "LEANANDMEAN",
      "pcCode": "KVGYZQK"
    },
    "keywords": {
      "pt-br": [
        "magro",
        "zerar músculo",
        "Zerar gordura e músculo",
        "LEANANDMEAN",
        "KVGYZQK"
      ],
      "en": [
        "skinny",
        "zero fat",
        "Zero fat and muscle",
        "LEANANDMEAN",
        "KVGYZQK"
      ],
      "es": [
        "flaco",
        "cero grasa",
        "Cero grasa y músculo",
        "LEANANDMEAN",
        "KVGYZQK"
      ],
      zh: [
        "skinny",
        "zero fat",
        "Zero fat and muscle",
        "LEANANDMEAN",
        "KVGYZQK"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-wanted-6-stars",
    "game": "gta-san-andreas",
    "category": "policia",
    "names": {
      "pt-br": "6 estrelas de procurado",
      "en": "Six-star wanted level",
      "es": "Seis estrellas de búsqueda",
      zh: "Six-star wanted level",
    },
    "codes": {
      "pcPhrase": "BRINGITON",
      "pcCode": "LJSPQK"
    },
    "keywords": {
      "pt-br": [
        "polícia",
        "6 estrelas",
        "procurado",
        "6 estrelas de procurado",
        "BRINGITON",
        "LJSPQK"
      ],
      "en": [
        "police",
        "six stars",
        "wanted",
        "Six-star wanted level",
        "BRINGITON",
        "LJSPQK"
      ],
      "es": [
        "policia",
        "seis estrellas",
        "Seis estrellas de búsqueda",
        "BRINGITON",
        "LJSPQK"
      ],
      zh: [
        "police",
        "six stars",
        "wanted",
        "Six-star wanted level",
        "BRINGITON",
        "LJSPQK"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-wanted-remove",
    "game": "gta-san-andreas",
    "category": "policia",
    "names": {
      "pt-br": "Remover procurado",
      "en": "Remove wanted level",
      "es": "Quitar búsqueda",
      zh: "Remove wanted level",
    },
    "codes": {
      "pcPhrase": "TURNDOWNTHEHEAT",
      "pcCode": "ASNAEB"
    },
    "keywords": {
      "pt-br": [
        "tirar estrela",
        "polícia",
        "Remover procurado",
        "TURNDOWNTHEHEAT",
        "ASNAEB"
      ],
      "en": [
        "remove wanted",
        "police",
        "Remove wanted level",
        "TURNDOWNTHEHEAT",
        "ASNAEB"
      ],
      "es": [
        "quitar estrellas",
        "Quitar búsqueda",
        "TURNDOWNTHEHEAT",
        "ASNAEB"
      ],
      zh: [
        "remove wanted",
        "police",
        "Remove wanted level",
        "TURNDOWNTHEHEAT",
        "ASNAEB"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-wanted-raise-two",
    "game": "gta-san-andreas",
    "category": "policia",
    "names": {
      "pt-br": "Aumentar procurado em 2 estrelas",
      "en": "Raise wanted level by two",
      "es": "Subir búsqueda en dos estrellas",
      zh: "Raise wanted level by two",
    },
    "codes": {
      "pcPhrase": "TURNUPTHEHEAT",
      "pcCode": "OSRBLHH"
    },
    "keywords": {
      "pt-br": [
        "polícia",
        "aumentar estrela",
        "Aumentar procurado em 2 estrelas",
        "TURNUPTHEHEAT",
        "OSRBLHH"
      ],
      "en": [
        "raise wanted",
        "Raise wanted level by two",
        "TURNUPTHEHEAT",
        "OSRBLHH"
      ],
      "es": [
        "subir estrellas",
        "Subir búsqueda en dos estrellas",
        "TURNUPTHEHEAT",
        "OSRBLHH"
      ],
      zh: [
        "raise wanted",
        "Raise wanted level by two",
        "TURNUPTHEHEAT",
        "OSRBLHH"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-wanted-lock",
    "game": "gta-san-andreas",
    "category": "policia",
    "names": {
      "pt-br": "Travar nível de procurado",
      "en": "Lock wanted level",
      "es": "Bloquear nivel de búsqueda",
      zh: "Lock wanted level",
    },
    "codes": {
      "pcPhrase": "IDOASIPLEASE",
      "pcCode": "AEZAKMI"
    },
    "keywords": {
      "pt-br": [
        "não ganhar estrela",
        "travar procurado",
        "Travar nível de procurado",
        "IDOASIPLEASE",
        "AEZAKMI"
      ],
      "en": [
        "lock wanted",
        "never wanted",
        "Lock wanted level",
        "IDOASIPLEASE",
        "AEZAKMI"
      ],
      "es": [
        "bloquear busqueda",
        "Bloquear nivel de búsqueda",
        "IDOASIPLEASE",
        "AEZAKMI"
      ],
      zh: [
        "lock wanted",
        "never wanted",
        "Lock wanted level",
        "IDOASIPLEASE",
        "AEZAKMI"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-cars-nitro",
    "game": "gta-san-andreas",
    "category": "veiculos",
    "names": {
      "pt-br": "Todos os carros com nitro",
      "en": "All cars have nitro",
      "es": "Todos los coches con nitro",
      zh: "All cars have nitro",
    },
    "codes": {
      "pcPhrase": "SPEEDFREAK",
      "pcCode": "COXEFGU"
    },
    "keywords": {
      "pt-br": [
        "carro",
        "nitro",
        "Todos os carros com nitro",
        "SPEEDFREAK",
        "COXEFGU"
      ],
      "en": [
        "cars",
        "nitro",
        "All cars have nitro",
        "SPEEDFREAK",
        "COXEFGU"
      ],
      "es": [
        "coches",
        "nitro",
        "Todos los coches con nitro",
        "SPEEDFREAK",
        "COXEFGU"
      ],
      zh: [
        "cars",
        "nitro",
        "All cars have nitro",
        "SPEEDFREAK",
        "COXEFGU"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-bike-super-jump",
    "game": "gta-san-andreas",
    "category": "veiculos",
    "names": {
      "pt-br": "Super pulo com bicicletas",
      "en": "Super jump on bikes",
      "es": "Súper salto en bicicletas",
      zh: "Super jump on bikes",
    },
    "codes": {
      "pcPhrase": "CJPHONEHOME",
      "pcCode": "JHJOECW"
    },
    "keywords": {
      "pt-br": [
        "bike",
        "bicicleta",
        "pulo",
        "Super pulo com bicicletas",
        "CJPHONEHOME",
        "JHJOECW"
      ],
      "en": [
        "bike",
        "bicycle",
        "jump",
        "Super jump on bikes",
        "CJPHONEHOME",
        "JHJOECW"
      ],
      "es": [
        "bicicleta",
        "salto",
        "Súper salto en bicicletas",
        "CJPHONEHOME",
        "JHJOECW"
      ],
      zh: [
        "bike",
        "bicycle",
        "jump",
        "Super jump on bikes",
        "CJPHONEHOME",
        "JHJOECW"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-boats-fly",
    "game": "gta-san-andreas",
    "category": "veiculos",
    "names": {
      "pt-br": "Barcos voam",
      "en": "Boats can fly",
      "es": "Barcos vuelan",
      zh: "Boats can fly",
    },
    "codes": {
      "pcPhrase": "FLYINGFISH",
      "pcCode": "AFSNMSMW"
    },
    "keywords": {
      "pt-br": [
        "barco",
        "voar",
        "Barcos voam",
        "FLYINGFISH",
        "AFSNMSMW"
      ],
      "en": [
        "boat",
        "fly",
        "Boats can fly",
        "FLYINGFISH",
        "AFSNMSMW"
      ],
      "es": [
        "barco",
        "volar",
        "Barcos vuelan",
        "FLYINGFISH",
        "AFSNMSMW"
      ],
      zh: [
        "boat",
        "fly",
        "Boats can fly",
        "FLYINGFISH",
        "AFSNMSMW"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-cars-fly",
    "game": "gta-san-andreas",
    "category": "veiculos",
    "names": {
      "pt-br": "Carros voam",
      "en": "Cars can fly",
      "es": "Coches vuelan",
      zh: "Cars can fly",
    },
    "codes": {
      "pcPhrase": "CHITTYCHITTYBANGBANG",
      "pcCode": "RIPAZHA"
    },
    "keywords": {
      "pt-br": [
        "carro",
        "voar",
        "Carros voam",
        "CHITTYCHITTYBANGBANG",
        "RIPAZHA"
      ],
      "en": [
        "cars",
        "flying",
        "Cars can fly",
        "CHITTYCHITTYBANGBANG",
        "RIPAZHA"
      ],
      "es": [
        "coches",
        "volar",
        "Coches vuelan",
        "CHITTYCHITTYBANGBANG",
        "RIPAZHA"
      ],
      zh: [
        "cars",
        "flying",
        "Cars can fly",
        "CHITTYCHITTYBANGBANG",
        "RIPAZHA"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-car-invincible",
    "game": "gta-san-andreas",
    "category": "veiculos",
    "names": {
      "pt-br": "Seu carro fica invencível",
      "en": "Your car is invincible",
      "es": "Tu coche es invencible",
      zh: "Your car is invincible",
    },
    "codes": {
      "pcPhrase": "TOUCHMYCARYOUDIE",
      "pcCode": "JCNRUAD"
    },
    "keywords": {
      "pt-br": [
        "carro",
        "invencível",
        "Seu carro fica invencível",
        "TOUCHMYCARYOUDIE",
        "JCNRUAD"
      ],
      "en": [
        "car",
        "invincible",
        "Your car is invincible",
        "TOUCHMYCARYOUDIE",
        "JCNRUAD"
      ],
      "es": [
        "coche",
        "invencible",
        "Tu coche es invencible",
        "TOUCHMYCARYOUDIE",
        "JCNRUAD"
      ],
      zh: [
        "car",
        "invincible",
        "Your car is invincible",
        "TOUCHMYCARYOUDIE",
        "JCNRUAD"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-cars-float-away",
    "game": "gta-san-andreas",
    "category": "veiculos",
    "names": {
      "pt-br": "Carros flutuam quando batem",
      "en": "Cars float away when hit",
      "es": "Coches flotan al chocar",
      zh: "Cars float away when hit",
    },
    "codes": {
      "pcPhrase": "BUBBLECARS",
      "pcCode": "BSXSGGC"
    },
    "keywords": {
      "pt-br": [
        "carro",
        "flutuar",
        "bater",
        "Carros flutuam quando batem",
        "BUBBLECARS",
        "BSXSGGC"
      ],
      "en": [
        "cars",
        "float",
        "hit",
        "Cars float away when hit",
        "BUBBLECARS",
        "BSXSGGC"
      ],
      "es": [
        "coches",
        "flotar",
        "Coches flotan al chocar",
        "BUBBLECARS",
        "BSXSGGC"
      ],
      zh: [
        "cars",
        "float",
        "hit",
        "Cars float away when hit",
        "BUBBLECARS",
        "BSXSGGC"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-destroy-cars",
    "game": "gta-san-andreas",
    "category": "veiculos",
    "names": {
      "pt-br": "Explodir todos os carros",
      "en": "Destroy all cars",
      "es": "Destruir todos los coches",
      zh: "Destroy all cars",
    },
    "codes": {
      "pcPhrase": "ALLCARSGOBOOM",
      "pcCode": "CPKTNWT"
    },
    "keywords": {
      "pt-br": [
        "carro",
        "explodir",
        "destruir",
        "Explodir todos os carros",
        "ALLCARSGOBOOM",
        "CPKTNWT"
      ],
      "en": [
        "cars",
        "explode",
        "destroy",
        "Destroy all cars",
        "ALLCARSGOBOOM",
        "CPKTNWT"
      ],
      "es": [
        "coches",
        "explotar",
        "Destruir todos los coches",
        "ALLCARSGOBOOM",
        "CPKTNWT"
      ],
      zh: [
        "cars",
        "explode",
        "destroy",
        "Destroy all cars",
        "ALLCARSGOBOOM",
        "CPKTNWT"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-invisible-cars",
    "game": "gta-san-andreas",
    "category": "veiculos",
    "names": {
      "pt-br": "Carros invisíveis",
      "en": "Invisible cars",
      "es": "Coches invisibles",
      zh: "Invisible cars",
    },
    "codes": {
      "pcPhrase": "WHEELSONLYPLEASE",
      "pcCode": "XICWMD"
    },
    "keywords": {
      "pt-br": [
        "carro",
        "invisível",
        "Carros invisíveis",
        "WHEELSONLYPLEASE",
        "XICWMD"
      ],
      "en": [
        "invisible cars",
        "Invisible cars",
        "WHEELSONLYPLEASE",
        "XICWMD"
      ],
      "es": [
        "coches invisibles",
        "Coches invisibles",
        "WHEELSONLYPLEASE",
        "XICWMD"
      ],
      zh: [
        "invisible cars",
        "Invisible cars",
        "WHEELSONLYPLEASE",
        "XICWMD"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-perfect-handling",
    "game": "gta-san-andreas",
    "category": "veiculos",
    "names": {
      "pt-br": "Direção perfeita",
      "en": "Perfect handling",
      "es": "Conducción perfecta",
      zh: "Perfect handling",
    },
    "codes": {
      "pcPhrase": "STICKLIKEGLUE",
      "pcCode": "PGGOMOY"
    },
    "keywords": {
      "pt-br": [
        "carro",
        "dirigir",
        "controle",
        "Direção perfeita",
        "STICKLIKEGLUE",
        "PGGOMOY"
      ],
      "en": [
        "handling",
        "cars",
        "Perfect handling",
        "STICKLIKEGLUE",
        "PGGOMOY"
      ],
      "es": [
        "conduccion",
        "coches",
        "Conducción perfecta",
        "STICKLIKEGLUE",
        "PGGOMOY"
      ],
      zh: [
        "handling",
        "cars",
        "Perfect handling",
        "STICKLIKEGLUE",
        "PGGOMOY"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-spawn-bloodring-banger",
    "game": "gta-san-andreas",
    "category": "spawn-veiculos",
    "names": {
      "pt-br": "Spawn Bloodring Banger",
      "en": "Spawn Bloodring Banger",
      "es": "Generar Bloodring Banger",
      zh: "Spawn Bloodring Banger",
    },
    "codes": {
      "pcPhrase": "OLDSPEEDDEMON",
      "pcCode": "CQZIJMB"
    },
    "keywords": {
      "pt-br": [
        "carro",
        "bloodring",
        "Spawn Bloodring Banger",
        "OLDSPEEDDEMON",
        "CQZIJMB"
      ],
      "en": [
        "car",
        "bloodring",
        "Spawn Bloodring Banger",
        "OLDSPEEDDEMON",
        "CQZIJMB"
      ],
      "es": [
        "coche",
        "bloodring",
        "Generar Bloodring Banger",
        "OLDSPEEDDEMON",
        "CQZIJMB"
      ],
      zh: [
        "car",
        "bloodring",
        "Spawn Bloodring Banger",
        "OLDSPEEDDEMON",
        "CQZIJMB"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-spawn-caddy",
    "game": "gta-san-andreas",
    "category": "spawn-veiculos",
    "names": {
      "pt-br": "Spawn Caddy",
      "en": "Spawn Caddy",
      "es": "Generar Caddy",
      zh: "Spawn Caddy",
    },
    "codes": {
      "pcPhrase": "18HOLES",
      "pcCode": "RZHSUEW"
    },
    "keywords": {
      "pt-br": [
        "carrinho",
        "golf",
        "caddy",
        "Spawn Caddy",
        "18HOLES",
        "RZHSUEW"
      ],
      "en": [
        "golf",
        "caddy",
        "Spawn Caddy",
        "18HOLES",
        "RZHSUEW"
      ],
      "es": [
        "golf",
        "caddy",
        "Generar Caddy",
        "18HOLES",
        "RZHSUEW"
      ],
      zh: [
        "golf",
        "caddy",
        "Spawn Caddy",
        "18HOLES",
        "RZHSUEW"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-spawn-dozer",
    "game": "gta-san-andreas",
    "category": "spawn-veiculos",
    "names": {
      "pt-br": "Spawn Dozer",
      "en": "Spawn Dozer",
      "es": "Generar Dozer",
      zh: "Spawn Dozer",
    },
    "codes": {
      "pcPhrase": "ITSALLBULL",
      "pcCode": "EEGCYXT"
    },
    "keywords": {
      "pt-br": [
        "trator",
        "dozer",
        "Spawn Dozer",
        "ITSALLBULL",
        "EEGCYXT"
      ],
      "en": [
        "dozer",
        "tractor",
        "Spawn Dozer",
        "ITSALLBULL",
        "EEGCYXT"
      ],
      "es": [
        "tractor",
        "dozer",
        "Generar Dozer",
        "ITSALLBULL",
        "EEGCYXT"
      ],
      zh: [
        "dozer",
        "tractor",
        "Spawn Dozer",
        "ITSALLBULL",
        "EEGCYXT"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-spawn-hotring-1",
    "game": "gta-san-andreas",
    "category": "spawn-veiculos",
    "names": {
      "pt-br": "Spawn Hotring Racer 1",
      "en": "Spawn Hotring Racer 1",
      "es": "Generar Hotring Racer 1",
      zh: "Spawn Hotring Racer 1",
    },
    "codes": {
      "pcPhrase": "VROCKPOKEY",
      "pcCode": "PDNEJOH"
    },
    "keywords": {
      "pt-br": [
        "carro",
        "corrida",
        "hotring",
        "Spawn Hotring Racer 1",
        "VROCKPOKEY",
        "PDNEJOH"
      ],
      "en": [
        "race car",
        "hotring",
        "Spawn Hotring Racer 1",
        "VROCKPOKEY",
        "PDNEJOH"
      ],
      "es": [
        "coche",
        "carrera",
        "hotring",
        "Generar Hotring Racer 1",
        "VROCKPOKEY",
        "PDNEJOH"
      ],
      zh: [
        "race car",
        "hotring",
        "Spawn Hotring Racer 1",
        "VROCKPOKEY",
        "PDNEJOH"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-spawn-hotring-2",
    "game": "gta-san-andreas",
    "category": "spawn-veiculos",
    "names": {
      "pt-br": "Spawn Hotring Racer 2",
      "en": "Spawn Hotring Racer 2",
      "es": "Generar Hotring Racer 2",
      zh: "Spawn Hotring Racer 2",
    },
    "codes": {
      "pcPhrase": "JUSTTRYANDSTOPME",
      "pcCode": "VPJTQWV"
    },
    "keywords": {
      "pt-br": [
        "carro",
        "corrida",
        "hotring",
        "Spawn Hotring Racer 2",
        "JUSTTRYANDSTOPME",
        "VPJTQWV"
      ],
      "en": [
        "race car",
        "hotring",
        "Spawn Hotring Racer 2",
        "JUSTTRYANDSTOPME",
        "VPJTQWV"
      ],
      "es": [
        "coche",
        "carrera",
        "hotring",
        "Generar Hotring Racer 2",
        "JUSTTRYANDSTOPME",
        "VPJTQWV"
      ],
      zh: [
        "race car",
        "hotring",
        "Spawn Hotring Racer 2",
        "JUSTTRYANDSTOPME",
        "VPJTQWV"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-spawn-monster",
    "game": "gta-san-andreas",
    "category": "spawn-veiculos",
    "names": {
      "pt-br": "Spawn Monster Truck",
      "en": "Spawn Monster Truck",
      "es": "Generar Monster Truck",
      zh: "Spawn Monster Truck",
    },
    "codes": {
      "pcPhrase": "MONSTERMASH",
      "pcCode": "AGBDLCID"
    },
    "keywords": {
      "pt-br": [
        "monster truck",
        "caminhonete",
        "Spawn Monster Truck",
        "MONSTERMASH",
        "AGBDLCID"
      ],
      "en": [
        "monster truck",
        "Spawn Monster Truck",
        "MONSTERMASH",
        "AGBDLCID"
      ],
      "es": [
        "monster truck",
        "Generar Monster Truck",
        "MONSTERMASH",
        "AGBDLCID"
      ],
      zh: [
        "monster truck",
        "Spawn Monster Truck",
        "MONSTERMASH",
        "AGBDLCID"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-spawn-quad",
    "game": "gta-san-andreas",
    "category": "spawn-veiculos",
    "names": {
      "pt-br": "Spawn Quadbike",
      "en": "Spawn Quadbike",
      "es": "Generar quad",
      zh: "Spawn Quadbike",
    },
    "codes": {
      "pcPhrase": "FOURWHEELFUN",
      "pcCode": "AKJJYGLC"
    },
    "keywords": {
      "pt-br": [
        "quadriciclo",
        "quad",
        "Spawn Quadbike",
        "FOURWHEELFUN",
        "AKJJYGLC"
      ],
      "en": [
        "quadbike",
        "quad",
        "Spawn Quadbike",
        "FOURWHEELFUN",
        "AKJJYGLC"
      ],
      "es": [
        "quad",
        "Generar quad",
        "FOURWHEELFUN",
        "AKJJYGLC"
      ],
      zh: [
        "quadbike",
        "quad",
        "Spawn Quadbike",
        "FOURWHEELFUN",
        "AKJJYGLC"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-spawn-hunter",
    "game": "gta-san-andreas",
    "category": "spawn-veiculos",
    "names": {
      "pt-br": "Spawn Hunter helicóptero",
      "en": "Spawn Hunter helicopter",
      "es": "Generar helicóptero Hunter",
      zh: "Spawn Hunter helicopter",
    },
    "codes": {
      "pcPhrase": "OHDUDE"
    },
    "keywords": {
      "pt-br": [
        "helicóptero",
        "hunter",
        "Spawn Hunter helicóptero",
        "OHDUDE"
      ],
      "en": [
        "helicopter",
        "hunter",
        "Spawn Hunter helicopter",
        "OHDUDE"
      ],
      "es": [
        "helicoptero",
        "hunter",
        "Generar helicóptero Hunter",
        "OHDUDE"
      ],
      zh: [
        "helicopter",
        "hunter",
        "Spawn Hunter helicopter",
        "OHDUDE"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-spawn-hydra",
    "game": "gta-san-andreas",
    "category": "spawn-veiculos",
    "names": {
      "pt-br": "Spawn Hydra jato",
      "en": "Spawn Hydra jet",
      "es": "Generar jet Hydra",
      zh: "Spawn Hydra jet",
    },
    "codes": {
      "pcPhrase": "JUMPJET"
    },
    "keywords": {
      "pt-br": [
        "avião",
        "jato",
        "hydra",
        "Spawn Hydra jato",
        "JUMPJET"
      ],
      "en": [
        "jet",
        "plane",
        "hydra",
        "Spawn Hydra jet",
        "JUMPJET"
      ],
      "es": [
        "avion",
        "jet",
        "hydra",
        "Generar jet Hydra",
        "JUMPJET"
      ],
      zh: [
        "jet",
        "plane",
        "hydra",
        "Spawn Hydra jet",
        "JUMPJET"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-spawn-rancher",
    "game": "gta-san-andreas",
    "category": "spawn-veiculos",
    "names": {
      "pt-br": "Spawn Rancher",
      "en": "Spawn Rancher",
      "es": "Generar Rancher",
      zh: "Spawn Rancher",
    },
    "codes": {
      "pcPhrase": "DOUGHNUTHANDICAP",
      "pcCode": "JQNTDMH"
    },
    "keywords": {
      "pt-br": [
        "carro",
        "rancher",
        "Spawn Rancher",
        "DOUGHNUTHANDICAP",
        "JQNTDMH"
      ],
      "en": [
        "car",
        "rancher",
        "Spawn Rancher",
        "DOUGHNUTHANDICAP",
        "JQNTDMH"
      ],
      "es": [
        "coche",
        "rancher",
        "Generar Rancher",
        "DOUGHNUTHANDICAP",
        "JQNTDMH"
      ],
      zh: [
        "car",
        "rancher",
        "Spawn Rancher",
        "DOUGHNUTHANDICAP",
        "JQNTDMH"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-spawn-rhino",
    "game": "gta-san-andreas",
    "category": "spawn-veiculos",
    "names": {
      "pt-br": "Spawn Rhino tanque",
      "en": "Spawn Rhino tank",
      "es": "Generar tanque Rhino",
      zh: "Spawn Rhino tank",
    },
    "codes": {
      "pcPhrase": "TIMETOKICKASS",
      "pcCode": "AIWPRTON"
    },
    "keywords": {
      "pt-br": [
        "tanque",
        "rhino",
        "Spawn Rhino tanque",
        "TIMETOKICKASS",
        "AIWPRTON"
      ],
      "en": [
        "tank",
        "rhino",
        "Spawn Rhino tank",
        "TIMETOKICKASS",
        "AIWPRTON"
      ],
      "es": [
        "tanque",
        "rhino",
        "Generar tanque Rhino",
        "TIMETOKICKASS",
        "AIWPRTON"
      ],
      zh: [
        "tank",
        "rhino",
        "Spawn Rhino tank",
        "TIMETOKICKASS",
        "AIWPRTON"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-spawn-romero",
    "game": "gta-san-andreas",
    "category": "spawn-veiculos",
    "names": {
      "pt-br": "Spawn Romero",
      "en": "Spawn Romero",
      "es": "Generar Romero",
      zh: "Spawn Romero",
    },
    "codes": {
      "pcPhrase": "WHERESTHEFUNERAL",
      "pcCode": "AQTBCODX"
    },
    "keywords": {
      "pt-br": [
        "carro",
        "funerária",
        "romero",
        "Spawn Romero",
        "WHERESTHEFUNERAL",
        "AQTBCODX"
      ],
      "en": [
        "hearse",
        "romero",
        "Spawn Romero",
        "WHERESTHEFUNERAL",
        "AQTBCODX"
      ],
      "es": [
        "coche funebre",
        "romero",
        "Generar Romero",
        "WHERESTHEFUNERAL",
        "AQTBCODX"
      ],
      zh: [
        "hearse",
        "romero",
        "Spawn Romero",
        "WHERESTHEFUNERAL",
        "AQTBCODX"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-spawn-stretch",
    "game": "gta-san-andreas",
    "category": "spawn-veiculos",
    "names": {
      "pt-br": "Spawn Stretch limusine",
      "en": "Spawn Stretch limo",
      "es": "Generar limusina Stretch",
      zh: "Spawn Stretch limo",
    },
    "codes": {
      "pcPhrase": "CELEBRITYSTATUS",
      "pcCode": "KRIJEBR"
    },
    "keywords": {
      "pt-br": [
        "limusine",
        "limo",
        "Spawn Stretch limusine",
        "CELEBRITYSTATUS",
        "KRIJEBR"
      ],
      "en": [
        "limo",
        "limousine",
        "Spawn Stretch limo",
        "CELEBRITYSTATUS",
        "KRIJEBR"
      ],
      "es": [
        "limusina",
        "Generar limusina Stretch",
        "CELEBRITYSTATUS",
        "KRIJEBR"
      ],
      zh: [
        "limo",
        "limousine",
        "Spawn Stretch limo",
        "CELEBRITYSTATUS",
        "KRIJEBR"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-spawn-stuntplane",
    "game": "gta-san-andreas",
    "category": "spawn-veiculos",
    "names": {
      "pt-br": "Spawn Stuntplane",
      "en": "Spawn Stuntplane",
      "es": "Generar avión acrobático",
      zh: "Spawn Stuntplane",
    },
    "codes": {
      "pcPhrase": "FLYINGTOSTUNT",
      "pcCode": "URKQSRK"
    },
    "keywords": {
      "pt-br": [
        "avião",
        "stuntplane",
        "Spawn Stuntplane",
        "FLYINGTOSTUNT",
        "URKQSRK"
      ],
      "en": [
        "plane",
        "stunt",
        "Spawn Stuntplane",
        "FLYINGTOSTUNT",
        "URKQSRK"
      ],
      "es": [
        "avion",
        "acrobatico",
        "Generar avión acrobático",
        "FLYINGTOSTUNT",
        "URKQSRK"
      ],
      zh: [
        "plane",
        "stunt",
        "Spawn Stuntplane",
        "FLYINGTOSTUNT",
        "URKQSRK"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-spawn-tanker",
    "game": "gta-san-andreas",
    "category": "spawn-veiculos",
    "names": {
      "pt-br": "Spawn Tanker",
      "en": "Spawn Tanker",
      "es": "Generar camión cisterna",
      zh: "Spawn Tanker",
    },
    "codes": {
      "pcPhrase": "HITTHEROADJACK",
      "pcCode": "AMOMHRER"
    },
    "keywords": {
      "pt-br": [
        "caminhão",
        "tanker",
        "Spawn Tanker",
        "HITTHEROADJACK",
        "AMOMHRER"
      ],
      "en": [
        "truck",
        "tanker",
        "Spawn Tanker",
        "HITTHEROADJACK",
        "AMOMHRER"
      ],
      "es": [
        "camion",
        "tanker",
        "Generar camión cisterna",
        "HITTHEROADJACK",
        "AMOMHRER"
      ],
      zh: [
        "truck",
        "tanker",
        "Spawn Tanker",
        "HITTHEROADJACK",
        "AMOMHRER"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-spawn-trashmaster",
    "game": "gta-san-andreas",
    "category": "spawn-veiculos",
    "names": {
      "pt-br": "Spawn Trashmaster",
      "en": "Spawn Trashmaster",
      "es": "Generar camión de basura",
      zh: "Spawn Trashmaster",
    },
    "codes": {
      "pcPhrase": "TRUEGRIME",
      "pcCode": "UBHYZHQ"
    },
    "keywords": {
      "pt-br": [
        "caminhão",
        "lixo",
        "Spawn Trashmaster",
        "TRUEGRIME",
        "UBHYZHQ"
      ],
      "en": [
        "garbage truck",
        "Spawn Trashmaster",
        "TRUEGRIME",
        "UBHYZHQ"
      ],
      "es": [
        "basura",
        "camion",
        "Generar camión de basura",
        "TRUEGRIME",
        "UBHYZHQ"
      ],
      zh: [
        "garbage truck",
        "Spawn Trashmaster",
        "TRUEGRIME",
        "UBHYZHQ"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-spawn-vortex",
    "game": "gta-san-andreas",
    "category": "spawn-veiculos",
    "names": {
      "pt-br": "Spawn Vortex hovercraft",
      "en": "Spawn Vortex hovercraft",
      "es": "Generar Vortex hovercraft",
      zh: "Spawn Vortex hovercraft",
    },
    "codes": {
      "pcPhrase": "IWANTTOHOVER",
      "pcCode": "KGGGDKP"
    },
    "keywords": {
      "pt-br": [
        "vortex",
        "hovercraft",
        "barco",
        "Spawn Vortex hovercraft",
        "IWANTTOHOVER",
        "KGGGDKP"
      ],
      "en": [
        "vortex",
        "hovercraft",
        "Spawn Vortex hovercraft",
        "IWANTTOHOVER",
        "KGGGDKP"
      ],
      "es": [
        "vortex",
        "hovercraft",
        "Generar Vortex hovercraft",
        "IWANTTOHOVER",
        "KGGGDKP"
      ],
      zh: [
        "vortex",
        "hovercraft",
        "Spawn Vortex hovercraft",
        "IWANTTOHOVER",
        "KGGGDKP"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-gangs-everywhere",
    "game": "gta-san-andreas",
    "category": "npc",
    "names": {
      "pt-br": "Gangues em todo lugar",
      "en": "Gang members everywhere",
      "es": "Pandilleros por todos lados",
      zh: "Gang members everywhere",
    },
    "codes": {
      "pcPhrase": "ONLYHOMIESALLOWED",
      "pcCode": "MROEMZH"
    },
    "keywords": {
      "pt-br": [
        "gangue",
        "npc",
        "rua",
        "Gangues em todo lugar",
        "ONLYHOMIESALLOWED",
        "MROEMZH"
      ],
      "en": [
        "gangue",
        "npc",
        "rua",
        "Gang members everywhere",
        "ONLYHOMIESALLOWED",
        "MROEMZH"
      ],
      "es": [
        "gangue",
        "npc",
        "rua",
        "Pandilleros por todos lados",
        "ONLYHOMIESALLOWED",
        "MROEMZH"
      ],
      zh: [
        "gangue",
        "npc",
        "rua",
        "Gang members everywhere",
        "ONLYHOMIESALLOWED",
        "MROEMZH"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-gangs-rule",
    "game": "gta-san-andreas",
    "category": "npc",
    "names": {
      "pt-br": "Gangues dominam as ruas",
      "en": "Gangs rule the streets",
      "es": "Pandillas dominan las calles",
      zh: "Gangs rule the streets",
    },
    "codes": {
      "pcPhrase": "BETTERSTAYINDOORS",
      "pcCode": "BIFBUZZ"
    },
    "keywords": {
      "pt-br": [
        "gangue",
        "rua",
        "Gangues dominam as ruas",
        "BETTERSTAYINDOORS",
        "BIFBUZZ"
      ],
      "en": [
        "gangue",
        "rua",
        "Gangs rule the streets",
        "BETTERSTAYINDOORS",
        "BIFBUZZ"
      ],
      "es": [
        "gangue",
        "rua",
        "Pandillas dominan las calles",
        "BETTERSTAYINDOORS",
        "BIFBUZZ"
      ],
      zh: [
        "gangue",
        "rua",
        "Gangs rule the streets",
        "BETTERSTAYINDOORS",
        "BIFBUZZ"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-recruit-rocket",
    "game": "gta-san-andreas",
    "category": "npc",
    "names": {
      "pt-br": "Recrutar qualquer pessoa com lança-foguetes",
      "en": "Recruit anyone with rocket launcher",
      "es": "Reclutar a cualquiera con lanzacohetes",
      zh: "Recruit anyone with rocket launcher",
    },
    "codes": {
      "pcPhrase": "ROCKETMAYHEM",
      "pcCode": "ZSOXFSQ"
    },
    "keywords": {
      "pt-br": [
        "recrutar",
        "lança foguete",
        "Recrutar qualquer pessoa com lança-foguetes",
        "ROCKETMAYHEM",
        "ZSOXFSQ"
      ],
      "en": [
        "recrutar",
        "lança foguete",
        "Recruit anyone with rocket launcher",
        "ROCKETMAYHEM",
        "ZSOXFSQ"
      ],
      "es": [
        "recrutar",
        "lança foguete",
        "Reclutar a cualquiera con lanzacohetes",
        "ROCKETMAYHEM",
        "ZSOXFSQ"
      ],
      zh: [
        "recrutar",
        "lança foguete",
        "Recruit anyone with rocket launcher",
        "ROCKETMAYHEM",
        "ZSOXFSQ"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-recruit-ak",
    "game": "gta-san-andreas",
    "category": "npc",
    "names": {
      "pt-br": "Recrutar qualquer pessoa com AK-47",
      "en": "Recruit anyone with AK-47",
      "es": "Reclutar a cualquiera con AK-47",
      zh: "Recruit anyone with AK-47",
    },
    "codes": {
      "pcPhrase": "NOONECANSTOPUS",
      "pcCode": "BMTPWHR"
    },
    "keywords": {
      "pt-br": [
        "recrutar",
        "ak",
        "Recrutar qualquer pessoa com AK-47",
        "NOONECANSTOPUS",
        "BMTPWHR"
      ],
      "en": [
        "recrutar",
        "ak",
        "Recruit anyone with AK-47",
        "NOONECANSTOPUS",
        "BMTPWHR"
      ],
      "es": [
        "recrutar",
        "ak",
        "Reclutar a cualquiera con AK-47",
        "NOONECANSTOPUS",
        "BMTPWHR"
      ],
      zh: [
        "recrutar",
        "ak",
        "Recruit anyone with AK-47",
        "NOONECANSTOPUS",
        "BMTPWHR"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-recruit-pistol",
    "game": "gta-san-andreas",
    "category": "npc",
    "names": {
      "pt-br": "Recrutar qualquer pessoa com pistola",
      "en": "Recruit anyone with pistol",
      "es": "Reclutar a cualquiera con pistola",
      zh: "Recruit anyone with pistol",
    },
    "codes": {
      "pcPhrase": "WANNABEINMYGANG",
      "pcCode": "SJMAHPE"
    },
    "keywords": {
      "pt-br": [
        "recrutar",
        "pistola",
        "Recrutar qualquer pessoa com pistola",
        "WANNABEINMYGANG",
        "SJMAHPE"
      ],
      "en": [
        "recrutar",
        "pistola",
        "Recruit anyone with pistol",
        "WANNABEINMYGANG",
        "SJMAHPE"
      ],
      "es": [
        "recrutar",
        "pistola",
        "Reclutar a cualquiera con pistola",
        "WANNABEINMYGANG",
        "SJMAHPE"
      ],
      zh: [
        "recrutar",
        "pistola",
        "Recruit anyone with pistol",
        "WANNABEINMYGANG",
        "SJMAHPE"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-ped-chaos",
    "game": "gta-san-andreas",
    "category": "npc",
    "names": {
      "pt-br": "Pedestres caóticos",
      "en": "Pedestrian chaos",
      "es": "Caos de peatones",
      zh: "Pedestrian chaos",
    },
    "codes": {
      "pcPhrase": "ROUGHNEIGHBOURHOOD",
      "pcCode": "AJLOJYQY"
    },
    "keywords": {
      "pt-br": [
        "pedestre",
        "caos",
        "Pedestres caóticos",
        "ROUGHNEIGHBOURHOOD",
        "AJLOJYQY"
      ],
      "en": [
        "pedestre",
        "caos",
        "Pedestrian chaos",
        "ROUGHNEIGHBOURHOOD",
        "AJLOJYQY"
      ],
      "es": [
        "pedestre",
        "caos",
        "Caos de peatones",
        "ROUGHNEIGHBOURHOOD",
        "AJLOJYQY"
      ],
      zh: [
        "pedestre",
        "caos",
        "Pedestrian chaos",
        "ROUGHNEIGHBOURHOOD",
        "AJLOJYQY"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-elvis",
    "game": "gta-san-andreas",
    "category": "tema",
    "names": {
      "pt-br": "Pedestres viram Elvis",
      "en": "Pedestrians are Elvis",
      "es": "Peatones son Elvis",
      zh: "Pedestrians are Elvis",
    },
    "codes": {
      "pcPhrase": "BLUESUEDESHOES",
      "pcCode": "ASBHGRB"
    },
    "keywords": {
      "pt-br": [
        "elvis",
        "tema",
        "Pedestres viram Elvis",
        "BLUESUEDESHOES",
        "ASBHGRB"
      ],
      "en": [
        "elvis",
        "tema",
        "Pedestrians are Elvis",
        "BLUESUEDESHOES",
        "ASBHGRB"
      ],
      "es": [
        "elvis",
        "tema",
        "Peatones son Elvis",
        "BLUESUEDESHOES",
        "ASBHGRB"
      ],
      zh: [
        "elvis",
        "tema",
        "Pedestrians are Elvis",
        "BLUESUEDESHOES",
        "ASBHGRB"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-ped-riot",
    "game": "gta-san-andreas",
    "category": "npc",
    "names": {
      "pt-br": "Riot de pedestres",
      "en": "Pedestrian riot",
      "es": "Disturbios de peatones",
      zh: "Pedestrian riot",
    },
    "codes": {
      "pcPhrase": "STATEOFEMERGENCY",
      "pcCode": "IOJUFZN"
    },
    "keywords": {
      "pt-br": [
        "riot",
        "caos",
        "pedestre",
        "Riot de pedestres",
        "STATEOFEMERGENCY",
        "IOJUFZN"
      ],
      "en": [
        "riot",
        "caos",
        "pedestre",
        "Pedestrian riot",
        "STATEOFEMERGENCY",
        "IOJUFZN"
      ],
      "es": [
        "riot",
        "caos",
        "pedestre",
        "Disturbios de peatones",
        "STATEOFEMERGENCY",
        "IOJUFZN"
      ],
      zh: [
        "riot",
        "caos",
        "pedestre",
        "Pedestrian riot",
        "STATEOFEMERGENCY",
        "IOJUFZN"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-ped-attack",
    "game": "gta-san-andreas",
    "category": "npc",
    "names": {
      "pt-br": "Pedestres atacam você",
      "en": "Pedestrians attack you",
      "es": "Peatones te atacan",
      zh: "Pedestrians attack you",
    },
    "codes": {
      "pcPhrase": "STOPPICKINGONME",
      "pcCode": "BAGOWPG"
    },
    "keywords": {
      "pt-br": [
        "pedestre",
        "atacar",
        "Pedestres atacam você",
        "STOPPICKINGONME",
        "BAGOWPG"
      ],
      "en": [
        "pedestre",
        "atacar",
        "Pedestrians attack you",
        "STOPPICKINGONME",
        "BAGOWPG"
      ],
      "es": [
        "pedestre",
        "atacar",
        "Peatones te atacan",
        "STOPPICKINGONME",
        "BAGOWPG"
      ],
      zh: [
        "pedestre",
        "atacar",
        "Pedestrians attack you",
        "STOPPICKINGONME",
        "BAGOWPG"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-ped-attack-guns",
    "game": "gta-san-andreas",
    "category": "npc",
    "names": {
      "pt-br": "Pedestres atacam você com armas",
      "en": "Pedestrians attack you with guns",
      "es": "Peatones te atacan con armas",
      zh: "Pedestrians attack you with guns",
    },
    "codes": {
      "pcPhrase": "ATTACKOFTHEVILLAGEPEOPLE",
      "pcCode": "BGLUAWML"
    },
    "keywords": {
      "pt-br": [
        "pedestre",
        "armas",
        "Pedestres atacam você com armas",
        "ATTACKOFTHEVILLAGEPEOPLE",
        "BGLUAWML"
      ],
      "en": [
        "pedestre",
        "armas",
        "Pedestrians attack you with guns",
        "ATTACKOFTHEVILLAGEPEOPLE",
        "BGLUAWML"
      ],
      "es": [
        "pedestre",
        "armas",
        "Peatones te atacan con armas",
        "ATTACKOFTHEVILLAGEPEOPLE",
        "BGLUAWML"
      ],
      zh: [
        "pedestre",
        "armas",
        "Pedestrians attack you with guns",
        "ATTACKOFTHEVILLAGEPEOPLE",
        "BGLUAWML"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-ped-weapons",
    "game": "gta-san-andreas",
    "category": "npc",
    "names": {
      "pt-br": "Pedestres têm armas",
      "en": "Pedestrians have weapons",
      "es": "Peatones con armas",
      zh: "Pedestrians have weapons",
    },
    "codes": {
      "pcPhrase": "SURROUNDEDBYNUTTERS",
      "pcCode": "FOOOXFT"
    },
    "keywords": {
      "pt-br": [
        "pedestre",
        "armas",
        "Pedestres têm armas",
        "SURROUNDEDBYNUTTERS",
        "FOOOXFT"
      ],
      "en": [
        "pedestre",
        "armas",
        "Pedestrians have weapons",
        "SURROUNDEDBYNUTTERS",
        "FOOOXFT"
      ],
      "es": [
        "pedestre",
        "armas",
        "Peatones con armas",
        "SURROUNDEDBYNUTTERS",
        "FOOOXFT"
      ],
      zh: [
        "pedestre",
        "armas",
        "Pedestrians have weapons",
        "SURROUNDEDBYNUTTERS",
        "FOOOXFT"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-beach-theme",
    "game": "gta-san-andreas",
    "category": "tema",
    "names": {
      "pt-br": "Tema praia",
      "en": "Beach theme",
      "es": "Tema playa",
      zh: "Beach theme",
    },
    "codes": {
      "pcPhrase": "LIFESABEACH",
      "pcCode": "CIKGCGX"
    },
    "keywords": {
      "pt-br": [
        "praia",
        "biquíni",
        "Tema praia",
        "LIFESABEACH",
        "CIKGCGX"
      ],
      "en": [
        "praia",
        "biquíni",
        "Beach theme",
        "LIFESABEACH",
        "CIKGCGX"
      ],
      "es": [
        "praia",
        "biquíni",
        "Tema playa",
        "LIFESABEACH",
        "CIKGCGX"
      ],
      zh: [
        "praia",
        "biquíni",
        "Beach theme",
        "LIFESABEACH",
        "CIKGCGX"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-carnival-theme",
    "game": "gta-san-andreas",
    "category": "tema",
    "names": {
      "pt-br": "Tema carnaval/funhouse",
      "en": "Carnival theme",
      "es": "Tema carnaval",
      zh: "Carnival theme",
    },
    "codes": {
      "pcPhrase": "CRAZYTOWN",
      "pcCode": "PRIEBJ"
    },
    "keywords": {
      "pt-br": [
        "carnaval",
        "tema",
        "Tema carnaval/funhouse",
        "CRAZYTOWN",
        "PRIEBJ"
      ],
      "en": [
        "carnaval",
        "tema",
        "Carnival theme",
        "CRAZYTOWN",
        "PRIEBJ"
      ],
      "es": [
        "carnaval",
        "tema",
        "Tema carnaval",
        "CRAZYTOWN",
        "PRIEBJ"
      ],
      zh: [
        "carnaval",
        "tema",
        "Carnival theme",
        "CRAZYTOWN",
        "PRIEBJ"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-gimp-theme",
    "game": "gta-san-andreas",
    "category": "tema",
    "names": {
      "pt-br": "Tema gimp",
      "en": "Gimp theme",
      "es": "Tema gimp",
      zh: "Gimp theme",
    },
    "codes": {
      "pcPhrase": "LOVECONQUERSALL",
      "pcCode": "BEKKNQV"
    },
    "keywords": {
      "pt-br": [
        "gimp",
        "tema",
        "Tema gimp",
        "LOVECONQUERSALL",
        "BEKKNQV"
      ],
      "en": [
        "gimp",
        "tema",
        "Gimp theme",
        "LOVECONQUERSALL",
        "BEKKNQV"
      ],
      "es": [
        "gimp",
        "tema",
        "Tema gimp",
        "LOVECONQUERSALL",
        "BEKKNQV"
      ],
      zh: [
        "gimp",
        "tema",
        "Gimp theme",
        "LOVECONQUERSALL",
        "BEKKNQV"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-rural-theme",
    "game": "gta-san-andreas",
    "category": "tema",
    "names": {
      "pt-br": "Tema rural",
      "en": "Rural theme",
      "es": "Tema rural",
      zh: "Rural theme",
    },
    "codes": {
      "pcPhrase": "HICKSVILLE",
      "pcCode": "FVTMNBZ"
    },
    "keywords": {
      "pt-br": [
        "rural",
        "campo",
        "Tema rural",
        "HICKSVILLE",
        "FVTMNBZ"
      ],
      "en": [
        "rural",
        "campo",
        "Rural theme",
        "HICKSVILLE",
        "FVTMNBZ"
      ],
      "es": [
        "rural",
        "campo",
        "Tema rural",
        "HICKSVILLE",
        "FVTMNBZ"
      ],
      zh: [
        "rural",
        "campo",
        "Rural theme",
        "HICKSVILLE",
        "FVTMNBZ"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-triad-theme",
    "game": "gta-san-andreas",
    "category": "tema",
    "names": {
      "pt-br": "Tema ninja/triad",
      "en": "Triad theme",
      "es": "Tema ninja/triada",
      zh: "Triad theme",
    },
    "codes": {
      "pcPhrase": "NINJATOWN",
      "pcCode": "AFPHULTL"
    },
    "keywords": {
      "pt-br": [
        "ninja",
        "triad",
        "Tema ninja/triad",
        "NINJATOWN",
        "AFPHULTL"
      ],
      "en": [
        "ninja",
        "triad",
        "Triad theme",
        "NINJATOWN",
        "AFPHULTL"
      ],
      "es": [
        "ninja",
        "triad",
        "Tema ninja/triada",
        "NINJATOWN",
        "AFPHULTL"
      ],
      zh: [
        "ninja",
        "triad",
        "Triad theme",
        "NINJATOWN",
        "AFPHULTL"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-ghosttown",
    "game": "gta-san-andreas",
    "category": "mundo",
    "names": {
      "pt-br": "Poucos carros e pedestres",
      "en": "Traffic and pedestrians rarely spawn",
      "es": "Poco tráfico y peatones",
      zh: "Traffic and pedestrians rarely spawn",
    },
    "codes": {
      "pcPhrase": "GHOSTTOWN",
      "pcCode": "THGLOJ"
    },
    "keywords": {
      "pt-br": [
        "cidade vazia",
        "sem trânsito",
        "Poucos carros e pedestres",
        "GHOSTTOWN",
        "THGLOJ"
      ],
      "en": [
        "cidade vazia",
        "sem trânsito",
        "Traffic and pedestrians rarely spawn",
        "GHOSTTOWN",
        "THGLOJ"
      ],
      "es": [
        "cidade vazia",
        "sem trânsito",
        "Poco tráfico y peatones",
        "GHOSTTOWN",
        "THGLOJ"
      ],
      zh: [
        "cidade vazia",
        "sem trânsito",
        "Traffic and pedestrians rarely spawn",
        "GHOSTTOWN",
        "THGLOJ"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-aggressive-drivers",
    "game": "gta-san-andreas",
    "category": "veiculos",
    "names": {
      "pt-br": "Motoristas agressivos",
      "en": "Aggressive drivers",
      "es": "Conductores agresivos",
      zh: "Aggressive drivers",
    },
    "codes": {
      "pcPhrase": "ALLDRIVERSARECRIMINALS",
      "pcCode": "YLTEICZ"
    },
    "keywords": {
      "pt-br": [
        "trânsito",
        "motoristas",
        "Motoristas agressivos",
        "ALLDRIVERSARECRIMINALS",
        "YLTEICZ"
      ],
      "en": [
        "trânsito",
        "motoristas",
        "Aggressive drivers",
        "ALLDRIVERSARECRIMINALS",
        "YLTEICZ"
      ],
      "es": [
        "trânsito",
        "motoristas",
        "Conductores agresivos",
        "ALLDRIVERSARECRIMINALS",
        "YLTEICZ"
      ],
      zh: [
        "trânsito",
        "motoristas",
        "Aggressive drivers",
        "ALLDRIVERSARECRIMINALS",
        "YLTEICZ"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-green-lights",
    "game": "gta-san-andreas",
    "category": "veiculos",
    "names": {
      "pt-br": "Semáforos verdes",
      "en": "All green lights",
      "es": "Semáforos verdes",
      zh: "All green lights",
    },
    "codes": {
      "pcPhrase": "DONTTRYANDSTOPME",
      "pcCode": "ZEIIVG"
    },
    "keywords": {
      "pt-br": [
        "semaforo",
        "verde",
        "Semáforos verdes",
        "DONTTRYANDSTOPME",
        "ZEIIVG"
      ],
      "en": [
        "semaforo",
        "verde",
        "All green lights",
        "DONTTRYANDSTOPME",
        "ZEIIVG"
      ],
      "es": [
        "semaforo",
        "verde",
        "Semáforos verdes",
        "DONTTRYANDSTOPME",
        "ZEIIVG"
      ],
      zh: [
        "semaforo",
        "verde",
        "All green lights",
        "DONTTRYANDSTOPME",
        "ZEIIVG"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-black-cars",
    "game": "gta-san-andreas",
    "category": "veiculos",
    "names": {
      "pt-br": "Carros pretos",
      "en": "Black cars",
      "es": "Coches negros",
      zh: "Black cars",
    },
    "codes": {
      "pcPhrase": "SOLONGASITSBLACK",
      "pcCode": "IOWDLAC"
    },
    "keywords": {
      "pt-br": [
        "carro",
        "preto",
        "Carros pretos",
        "SOLONGASITSBLACK",
        "IOWDLAC"
      ],
      "en": [
        "carro",
        "preto",
        "Black cars",
        "SOLONGASITSBLACK",
        "IOWDLAC"
      ],
      "es": [
        "carro",
        "preto",
        "Coches negros",
        "SOLONGASITSBLACK",
        "IOWDLAC"
      ],
      zh: [
        "carro",
        "preto",
        "Black cars",
        "SOLONGASITSBLACK",
        "IOWDLAC"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-pink-cars",
    "game": "gta-san-andreas",
    "category": "veiculos",
    "names": {
      "pt-br": "Carros rosa",
      "en": "Pink cars",
      "es": "Coches rosas",
      zh: "Pink cars",
    },
    "codes": {
      "pcPhrase": "PINKISTHENEWCOOL",
      "pcCode": "LLQPFBN"
    },
    "keywords": {
      "pt-br": [
        "carro",
        "rosa",
        "Carros rosa",
        "PINKISTHENEWCOOL",
        "LLQPFBN"
      ],
      "en": [
        "carro",
        "rosa",
        "Pink cars",
        "PINKISTHENEWCOOL",
        "LLQPFBN"
      ],
      "es": [
        "carro",
        "rosa",
        "Coches rosas",
        "PINKISTHENEWCOOL",
        "LLQPFBN"
      ],
      zh: [
        "carro",
        "rosa",
        "Pink cars",
        "PINKISTHENEWCOOL",
        "LLQPFBN"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-cheap-cars",
    "game": "gta-san-andreas",
    "category": "veiculos",
    "names": {
      "pt-br": "Tráfego com carros simples",
      "en": "Cheap cars",
      "es": "Tráfico con coches simples",
      zh: "Cheap cars",
    },
    "codes": {
      "pcPhrase": "EVERYONEISPOOR",
      "pcCode": "BGKGTJH"
    },
    "keywords": {
      "pt-br": [
        "carro",
        "pobre",
        "barato",
        "Tráfego com carros simples",
        "EVERYONEISPOOR",
        "BGKGTJH"
      ],
      "en": [
        "carro",
        "pobre",
        "barato",
        "Cheap cars",
        "EVERYONEISPOOR",
        "BGKGTJH"
      ],
      "es": [
        "carro",
        "pobre",
        "barato",
        "Tráfico con coches simples",
        "EVERYONEISPOOR",
        "BGKGTJH"
      ],
      zh: [
        "carro",
        "pobre",
        "barato",
        "Cheap cars",
        "EVERYONEISPOOR",
        "BGKGTJH"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-sports-cars",
    "game": "gta-san-andreas",
    "category": "veiculos",
    "names": {
      "pt-br": "Tráfego com carros esportivos",
      "en": "Sports cars",
      "es": "Tráfico con coches deportivos",
      zh: "Sports cars",
    },
    "codes": {
      "pcPhrase": "EVERYONEISRICH",
      "pcCode": "GUSNDHE"
    },
    "keywords": {
      "pt-br": [
        "carro",
        "esportivo",
        "rico",
        "Tráfego com carros esportivos",
        "EVERYONEISRICH",
        "GUSNDHE"
      ],
      "en": [
        "carro",
        "esportivo",
        "rico",
        "Sports cars",
        "EVERYONEISRICH",
        "GUSNDHE"
      ],
      "es": [
        "carro",
        "esportivo",
        "rico",
        "Tráfico con coches deportivos",
        "EVERYONEISRICH",
        "GUSNDHE"
      ],
      zh: [
        "carro",
        "esportivo",
        "rico",
        "Sports cars",
        "EVERYONEISRICH",
        "GUSNDHE"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-slow-game",
    "game": "gta-san-andreas",
    "category": "mundo",
    "names": {
      "pt-br": "Gameplay lento",
      "en": "Decrease game speed",
      "es": "Juego lento",
      zh: "Decrease game speed",
    },
    "codes": {
      "pcPhrase": "SLOWITDOWN",
      "pcCode": "LIYOAAY"
    },
    "keywords": {
      "pt-br": [
        "lento",
        "velocidade",
        "Gameplay lento",
        "SLOWITDOWN",
        "LIYOAAY"
      ],
      "en": [
        "lento",
        "velocidade",
        "Decrease game speed",
        "SLOWITDOWN",
        "LIYOAAY"
      ],
      "es": [
        "lento",
        "velocidade",
        "Juego lento",
        "SLOWITDOWN",
        "LIYOAAY"
      ],
      zh: [
        "lento",
        "velocidade",
        "Decrease game speed",
        "SLOWITDOWN",
        "LIYOAAY"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-fast-game",
    "game": "gta-san-andreas",
    "category": "mundo",
    "names": {
      "pt-br": "Gameplay rápido",
      "en": "Increase game speed",
      "es": "Juego rápido",
      zh: "Increase game speed",
    },
    "codes": {
      "pcPhrase": "SPEEDITUP",
      "pcCode": "PPGWJHT"
    },
    "keywords": {
      "pt-br": [
        "rápido",
        "velocidade",
        "Gameplay rápido",
        "SPEEDITUP",
        "PPGWJHT"
      ],
      "en": [
        "rápido",
        "velocidade",
        "Increase game speed",
        "SPEEDITUP",
        "PPGWJHT"
      ],
      "es": [
        "rápido",
        "velocidade",
        "Juego rápido",
        "SPEEDITUP",
        "PPGWJHT"
      ],
      zh: [
        "rápido",
        "velocidade",
        "Increase game speed",
        "SPEEDITUP",
        "PPGWJHT"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-fast-time",
    "game": "gta-san-andreas",
    "category": "mundo",
    "names": {
      "pt-br": "Tempo passa mais rápido",
      "en": "Time moves faster",
      "es": "El tiempo pasa más rápido",
      zh: "Time moves faster",
    },
    "codes": {
      "pcPhrase": "TIMEJUSTFLIESBY",
      "pcCode": "YSOHNUL"
    },
    "keywords": {
      "pt-br": [
        "tempo",
        "relógio",
        "Tempo passa mais rápido",
        "TIMEJUSTFLIESBY",
        "YSOHNUL"
      ],
      "en": [
        "tempo",
        "relógio",
        "Time moves faster",
        "TIMEJUSTFLIESBY",
        "YSOHNUL"
      ],
      "es": [
        "tempo",
        "relógio",
        "El tiempo pasa más rápido",
        "TIMEJUSTFLIESBY",
        "YSOHNUL"
      ],
      zh: [
        "tempo",
        "relógio",
        "Time moves faster",
        "TIMEJUSTFLIESBY",
        "YSOHNUL"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-orange-sky",
    "game": "gta-san-andreas",
    "category": "mundo",
    "names": {
      "pt-br": "Tempo travado às 21h / céu laranja",
      "en": "Time locked to 9pm",
      "es": "Hora fija a las 21h",
      zh: "Time locked to 9pm",
    },
    "codes": {
      "pcPhrase": "DONTBRINGONTHENIGHT",
      "pcCode": "OFVIAC"
    },
    "keywords": {
      "pt-br": [
        "tempo",
        "noite",
        "céu laranja",
        "Tempo travado às 21h / céu laranja",
        "DONTBRINGONTHENIGHT",
        "OFVIAC"
      ],
      "en": [
        "tempo",
        "noite",
        "céu laranja",
        "Time locked to 9pm",
        "DONTBRINGONTHENIGHT",
        "OFVIAC"
      ],
      "es": [
        "tempo",
        "noite",
        "céu laranja",
        "Hora fija a las 21h",
        "DONTBRINGONTHENIGHT",
        "OFVIAC"
      ],
      zh: [
        "tempo",
        "noite",
        "céu laranja",
        "Time locked to 9pm",
        "DONTBRINGONTHENIGHT",
        "OFVIAC"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-midnight",
    "game": "gta-san-andreas",
    "category": "mundo",
    "names": {
      "pt-br": "Tempo travado à meia-noite",
      "en": "Time locked to midnight",
      "es": "Hora fija a medianoche",
      zh: "Time locked to midnight",
    },
    "codes": {
      "pcPhrase": "NIGHTPROWLER",
      "pcCode": "XJVSNAJ"
    },
    "keywords": {
      "pt-br": [
        "meia noite",
        "noite",
        "Tempo travado à meia-noite",
        "NIGHTPROWLER",
        "XJVSNAJ"
      ],
      "en": [
        "meia noite",
        "noite",
        "Time locked to midnight",
        "NIGHTPROWLER",
        "XJVSNAJ"
      ],
      "es": [
        "meia noite",
        "noite",
        "Hora fija a medianoche",
        "NIGHTPROWLER",
        "XJVSNAJ"
      ],
      zh: [
        "meia noite",
        "noite",
        "Time locked to midnight",
        "NIGHTPROWLER",
        "XJVSNAJ"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-cloudy",
    "game": "gta-san-andreas",
    "category": "clima",
    "names": {
      "pt-br": "Clima nublado",
      "en": "Cloudy weather",
      "es": "Clima nublado",
      zh: "Cloudy weather",
    },
    "codes": {
      "pcPhrase": "DULLDULLDAY",
      "pcCode": "ALNSFMZO"
    },
    "keywords": {
      "pt-br": [
        "clima",
        "nublado",
        "Clima nublado",
        "DULLDULLDAY",
        "ALNSFMZO"
      ],
      "en": [
        "clima",
        "nublado",
        "Cloudy weather",
        "DULLDULLDAY",
        "ALNSFMZO"
      ],
      "es": [
        "clima",
        "nublado",
        "Clima nublado",
        "DULLDULLDAY",
        "ALNSFMZO"
      ],
      zh: [
        "clima",
        "nublado",
        "Cloudy weather",
        "DULLDULLDAY",
        "ALNSFMZO"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-foggy",
    "game": "gta-san-andreas",
    "category": "clima",
    "names": {
      "pt-br": "Neblina",
      "en": "Foggy weather",
      "es": "Niebla",
      zh: "Foggy weather",
    },
    "codes": {
      "pcPhrase": "CANTSEEWHEREIMGOING",
      "pcCode": "CFVFGMJ"
    },
    "keywords": {
      "pt-br": [
        "clima",
        "neblina",
        "Neblina",
        "CANTSEEWHEREIMGOING",
        "CFVFGMJ"
      ],
      "en": [
        "clima",
        "neblina",
        "Foggy weather",
        "CANTSEEWHEREIMGOING",
        "CFVFGMJ"
      ],
      "es": [
        "clima",
        "neblina",
        "Niebla",
        "CANTSEEWHEREIMGOING",
        "CFVFGMJ"
      ],
      zh: [
        "clima",
        "neblina",
        "Foggy weather",
        "CANTSEEWHEREIMGOING",
        "CFVFGMJ"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-rainy",
    "game": "gta-san-andreas",
    "category": "clima",
    "names": {
      "pt-br": "Chuva",
      "en": "Rainy weather",
      "es": "Lluvia",
      zh: "Rainy weather",
    },
    "codes": {
      "pcPhrase": "STAYINANDWATCHTV",
      "pcCode": "AUIFRVQS"
    },
    "keywords": {
      "pt-br": [
        "clima",
        "chuva",
        "Chuva",
        "STAYINANDWATCHTV",
        "AUIFRVQS"
      ],
      "en": [
        "clima",
        "chuva",
        "Rainy weather",
        "STAYINANDWATCHTV",
        "AUIFRVQS"
      ],
      "es": [
        "clima",
        "chuva",
        "Lluvia",
        "STAYINANDWATCHTV",
        "AUIFRVQS"
      ],
      zh: [
        "clima",
        "chuva",
        "Rainy weather",
        "STAYINANDWATCHTV",
        "AUIFRVQS"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-sandstorm",
    "game": "gta-san-andreas",
    "category": "clima",
    "names": {
      "pt-br": "Tempestade de areia",
      "en": "Spawn sandstorm",
      "es": "Tormenta de arena",
      zh: "Spawn sandstorm",
    },
    "codes": {
      "pcPhrase": "SANDINMYEARS",
      "pcCode": "CWJXUOC"
    },
    "keywords": {
      "pt-br": [
        "clima",
        "areia",
        "Tempestade de areia",
        "SANDINMYEARS",
        "CWJXUOC"
      ],
      "en": [
        "clima",
        "areia",
        "Spawn sandstorm",
        "SANDINMYEARS",
        "CWJXUOC"
      ],
      "es": [
        "clima",
        "areia",
        "Tormenta de arena",
        "SANDINMYEARS",
        "CWJXUOC"
      ],
      zh: [
        "clima",
        "areia",
        "Spawn sandstorm",
        "SANDINMYEARS",
        "CWJXUOC"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-stormy",
    "game": "gta-san-andreas",
    "category": "clima",
    "names": {
      "pt-br": "Tempestade",
      "en": "Stormy weather",
      "es": "Tormenta",
      zh: "Stormy weather",
    },
    "codes": {
      "pcPhrase": "SCOTTISHSUMMER",
      "pcCode": "MGHXYRM"
    },
    "keywords": {
      "pt-br": [
        "clima",
        "tempestade",
        "Tempestade",
        "SCOTTISHSUMMER",
        "MGHXYRM"
      ],
      "en": [
        "clima",
        "tempestade",
        "Stormy weather",
        "SCOTTISHSUMMER",
        "MGHXYRM"
      ],
      "es": [
        "clima",
        "tempestade",
        "Tormenta",
        "SCOTTISHSUMMER",
        "MGHXYRM"
      ],
      zh: [
        "clima",
        "tempestade",
        "Stormy weather",
        "SCOTTISHSUMMER",
        "MGHXYRM"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-very-sunny",
    "game": "gta-san-andreas",
    "category": "clima",
    "names": {
      "pt-br": "Muito sol",
      "en": "Very sunny weather",
      "es": "Muy soleado",
      zh: "Very sunny weather",
    },
    "codes": {
      "pcPhrase": "TOODAMNHOT",
      "pcCode": "ICIKPYH"
    },
    "keywords": {
      "pt-br": [
        "clima",
        "sol",
        "Muito sol",
        "TOODAMNHOT",
        "ICIKPYH"
      ],
      "en": [
        "clima",
        "sol",
        "Very sunny weather",
        "TOODAMNHOT",
        "ICIKPYH"
      ],
      "es": [
        "clima",
        "sol",
        "Muy soleado",
        "TOODAMNHOT",
        "ICIKPYH"
      ],
      zh: [
        "clima",
        "sol",
        "Very sunny weather",
        "TOODAMNHOT",
        "ICIKPYH"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "sanandreas-sunny",
    "game": "gta-san-andreas",
    "category": "clima",
    "names": {
      "pt-br": "Clima ensolarado",
      "en": "Sunny weather",
      "es": "Clima soleado",
      zh: "Sunny weather",
    },
    "codes": {
      "pcPhrase": "PLEASANTLYWARM",
      "pcCode": "AFZLLQLL"
    },
    "keywords": {
      "pt-br": [
        "clima",
        "sol",
        "Clima ensolarado",
        "PLEASANTLYWARM",
        "AFZLLQLL"
      ],
      "en": [
        "clima",
        "sol",
        "Sunny weather",
        "PLEASANTLYWARM",
        "AFZLLQLL"
      ],
      "es": [
        "clima",
        "sol",
        "Clima soleado",
        "PLEASANTLYWARM",
        "AFZLLQLL"
      ],
      zh: [
        "clima",
        "sol",
        "Sunny weather",
        "PLEASANTLYWARM",
        "AFZLLQLL"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA San Andreas cheats",
        "url": "https://www.pcgamer.com/games/grand-theft-auto/san-andreas-cheats/"
      }
    ]
  },
  {
    "id": "vicecity-suicide",
    "game": "gta-vice-city",
    "category": "player",
    "names": {
      "pt-br": "Suicídio",
      "en": "Suicide",
      "es": "Suicidio",
      zh: "Suicide",
    },
    "codes": {
      "pc": "ICANTTAKEITANYMORE"
    },
    "keywords": {
      "pt-br": [
        "morrer",
        "suicidio",
        "Suicídio",
        "ICANTTAKEITANYMORE"
      ],
      "en": [
        "morrer",
        "suicidio",
        "Suicide",
        "ICANTTAKEITANYMORE"
      ],
      "es": [
        "morrer",
        "suicidio",
        "Suicidio",
        "ICANTTAKEITANYMORE"
      ],
      zh: [
        "morrer",
        "suicidio",
        "Suicide",
        "ICANTTAKEITANYMORE"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA Vice City cheats",
        "url": "https://www.pcgamer.com/gta-vice-city-cheats-pc/"
      }
    ]
  },
  {
    "id": "vicecity-ladies-man",
    "game": "gta-vice-city",
    "category": "player",
    "names": {
      "pt-br": "Atrair mulheres",
      "en": "Ladies' man",
      "es": "Atraer mujeres",
      zh: "Ladies' man",
    },
    "codes": {
      "pc": "FANNYMAGNET"
    },
    "keywords": {
      "pt-br": [
        "mulheres",
        "atrair",
        "Atrair mulheres",
        "FANNYMAGNET"
      ],
      "en": [
        "mulheres",
        "atrair",
        "Ladies' man",
        "FANNYMAGNET"
      ],
      "es": [
        "mulheres",
        "atrair",
        "Atraer mujeres",
        "FANNYMAGNET"
      ],
      zh: [
        "mulheres",
        "atrair",
        "Ladies' man",
        "FANNYMAGNET"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA Vice City cheats",
        "url": "https://www.pcgamer.com/gta-vice-city-cheats-pc/"
      }
    ]
  },
  {
    "id": "vicecity-armor",
    "game": "gta-vice-city",
    "category": "vida-armadura",
    "names": {
      "pt-br": "Armadura completa",
      "en": "Full armor",
      "es": "Armadura completa",
      zh: "Full armor",
    },
    "codes": {
      "pc": "PRECIOUSPROTECTION"
    },
    "keywords": {
      "pt-br": [
        "armadura",
        "colete",
        "Armadura completa",
        "PRECIOUSPROTECTION"
      ],
      "en": [
        "armadura",
        "colete",
        "Full armor",
        "PRECIOUSPROTECTION"
      ],
      "es": [
        "armadura",
        "colete",
        "Armadura completa",
        "PRECIOUSPROTECTION"
      ],
      zh: [
        "armadura",
        "colete",
        "Full armor",
        "PRECIOUSPROTECTION"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA Vice City cheats",
        "url": "https://www.pcgamer.com/gta-vice-city-cheats-pc/"
      }
    ]
  },
  {
    "id": "vicecity-health",
    "game": "gta-vice-city",
    "category": "vida-armadura",
    "names": {
      "pt-br": "Vida completa",
      "en": "Full health",
      "es": "Vida completa",
      zh: "Full health",
    },
    "codes": {
      "pc": "ASPIRINE"
    },
    "keywords": {
      "pt-br": [
        "vida",
        "cura",
        "Vida completa",
        "ASPIRINE"
      ],
      "en": [
        "vida",
        "cura",
        "Full health",
        "ASPIRINE"
      ],
      "es": [
        "vida",
        "cura",
        "Vida completa",
        "ASPIRINE"
      ],
      zh: [
        "vida",
        "cura",
        "Full health",
        "ASPIRINE"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA Vice City cheats",
        "url": "https://www.pcgamer.com/gta-vice-city-cheats-pc/"
      }
    ]
  },
  {
    "id": "vicecity-weapons-basic",
    "game": "gta-vice-city",
    "category": "armas",
    "names": {
      "pt-br": "Armas básicas",
      "en": "Basic weapons",
      "es": "Armas básicas",
      zh: "Basic weapons",
    },
    "codes": {
      "pc": "THUGSTOOLS"
    },
    "keywords": {
      "pt-br": [
        "armas",
        "leve",
        "Armas básicas",
        "THUGSTOOLS"
      ],
      "en": [
        "armas",
        "leve",
        "Basic weapons",
        "THUGSTOOLS"
      ],
      "es": [
        "armas",
        "leve",
        "Armas básicas",
        "THUGSTOOLS"
      ],
      zh: [
        "armas",
        "leve",
        "Basic weapons",
        "THUGSTOOLS"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA Vice City cheats",
        "url": "https://www.pcgamer.com/gta-vice-city-cheats-pc/"
      }
    ]
  },
  {
    "id": "vicecity-weapons-medium",
    "game": "gta-vice-city",
    "category": "armas",
    "names": {
      "pt-br": "Armas médias",
      "en": "Intermediate weapons",
      "es": "Armas intermedias",
      zh: "Intermediate weapons",
    },
    "codes": {
      "pc": "PROFESSIONALTOOLS"
    },
    "keywords": {
      "pt-br": [
        "armas",
        "media",
        "Armas médias",
        "PROFESSIONALTOOLS"
      ],
      "en": [
        "armas",
        "media",
        "Intermediate weapons",
        "PROFESSIONALTOOLS"
      ],
      "es": [
        "armas",
        "media",
        "Armas intermedias",
        "PROFESSIONALTOOLS"
      ],
      zh: [
        "armas",
        "media",
        "Intermediate weapons",
        "PROFESSIONALTOOLS"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA Vice City cheats",
        "url": "https://www.pcgamer.com/gta-vice-city-cheats-pc/"
      }
    ]
  },
  {
    "id": "vicecity-weapons-heavy",
    "game": "gta-vice-city",
    "category": "armas",
    "names": {
      "pt-br": "Armas pesadas",
      "en": "Advanced weapons",
      "es": "Armas pesadas",
      zh: "Advanced weapons",
    },
    "codes": {
      "pc": "NUTTERTOOLS"
    },
    "keywords": {
      "pt-br": [
        "armas",
        "pesadas",
        "Armas pesadas",
        "NUTTERTOOLS"
      ],
      "en": [
        "armas",
        "pesadas",
        "Advanced weapons",
        "NUTTERTOOLS"
      ],
      "es": [
        "armas",
        "pesadas",
        "Armas pesadas",
        "NUTTERTOOLS"
      ],
      zh: [
        "armas",
        "pesadas",
        "Advanced weapons",
        "NUTTERTOOLS"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA Vice City cheats",
        "url": "https://www.pcgamer.com/gta-vice-city-cheats-pc/"
      }
    ]
  },
  {
    "id": "vicecity-green-lights",
    "game": "gta-vice-city",
    "category": "veiculos",
    "names": {
      "pt-br": "Todos semáforos verdes",
      "en": "All traffic lights green",
      "es": "Todos los semáforos verdes",
      zh: "All traffic lights green",
    },
    "codes": {
      "pc": "GREENLIGHT"
    },
    "keywords": {
      "pt-br": [
        "semaforo",
        "verde",
        "trânsito",
        "Todos semáforos verdes",
        "GREENLIGHT"
      ],
      "en": [
        "semaforo",
        "verde",
        "trânsito",
        "All traffic lights green",
        "GREENLIGHT"
      ],
      "es": [
        "semaforo",
        "verde",
        "trânsito",
        "Todos los semáforos verdes",
        "GREENLIGHT"
      ],
      zh: [
        "semaforo",
        "verde",
        "trânsito",
        "All traffic lights green",
        "GREENLIGHT"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA Vice City cheats",
        "url": "https://www.pcgamer.com/gta-vice-city-cheats-pc/"
      }
    ]
  },
  {
    "id": "vicecity-amphibious-cars",
    "game": "gta-vice-city",
    "category": "veiculos",
    "names": {
      "pt-br": "Carros andam na água",
      "en": "Amphibious cars",
      "es": "Coches anfibios",
      zh: "Amphibious cars",
    },
    "codes": {
      "pc": "SEAWAYS"
    },
    "keywords": {
      "pt-br": [
        "carro",
        "água",
        "Carros andam na água",
        "SEAWAYS"
      ],
      "en": [
        "carro",
        "água",
        "Amphibious cars",
        "SEAWAYS"
      ],
      "es": [
        "carro",
        "água",
        "Coches anfibios",
        "SEAWAYS"
      ],
      zh: [
        "carro",
        "água",
        "Amphibious cars",
        "SEAWAYS"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA Vice City cheats",
        "url": "https://www.pcgamer.com/gta-vice-city-cheats-pc/"
      }
    ]
  },
  {
    "id": "vicecity-big-wheels",
    "game": "gta-vice-city",
    "category": "veiculos",
    "names": {
      "pt-br": "Rodas grandes",
      "en": "Big wheels",
      "es": "Ruedas grandes",
      zh: "Big wheels",
    },
    "codes": {
      "pc": "LOADSOFLITTLETHINGS"
    },
    "keywords": {
      "pt-br": [
        "carro",
        "roda",
        "Rodas grandes",
        "LOADSOFLITTLETHINGS"
      ],
      "en": [
        "carro",
        "roda",
        "Big wheels",
        "LOADSOFLITTLETHINGS"
      ],
      "es": [
        "carro",
        "roda",
        "Ruedas grandes",
        "LOADSOFLITTLETHINGS"
      ],
      zh: [
        "carro",
        "roda",
        "Big wheels",
        "LOADSOFLITTLETHINGS"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA Vice City cheats",
        "url": "https://www.pcgamer.com/gta-vice-city-cheats-pc/"
      }
    ]
  },
  {
    "id": "vicecity-black-cars",
    "game": "gta-vice-city",
    "category": "veiculos",
    "names": {
      "pt-br": "Carros pretos",
      "en": "Black cars",
      "es": "Coches negros",
      zh: "Black cars",
    },
    "codes": {
      "pc": "IWANTITPAINTEDBLACK"
    },
    "keywords": {
      "pt-br": [
        "carro",
        "preto",
        "Carros pretos",
        "IWANTITPAINTEDBLACK"
      ],
      "en": [
        "carro",
        "preto",
        "Black cars",
        "IWANTITPAINTEDBLACK"
      ],
      "es": [
        "carro",
        "preto",
        "Coches negros",
        "IWANTITPAINTEDBLACK"
      ],
      zh: [
        "carro",
        "preto",
        "Black cars",
        "IWANTITPAINTEDBLACK"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA Vice City cheats",
        "url": "https://www.pcgamer.com/gta-vice-city-cheats-pc/"
      }
    ]
  },
  {
    "id": "vicecity-flying-boats",
    "game": "gta-vice-city",
    "category": "veiculos",
    "names": {
      "pt-br": "Barcos voam",
      "en": "Flying boats",
      "es": "Barcos vuelan",
      zh: "Flying boats",
    },
    "codes": {
      "pc": "AIRSHIP"
    },
    "keywords": {
      "pt-br": [
        "barco",
        "voar",
        "Barcos voam",
        "AIRSHIP"
      ],
      "en": [
        "barco",
        "voar",
        "Flying boats",
        "AIRSHIP"
      ],
      "es": [
        "barco",
        "voar",
        "Barcos vuelan",
        "AIRSHIP"
      ],
      zh: [
        "barco",
        "voar",
        "Flying boats",
        "AIRSHIP"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA Vice City cheats",
        "url": "https://www.pcgamer.com/gta-vice-city-cheats-pc/"
      }
    ]
  },
  {
    "id": "vicecity-flying-cars",
    "game": "gta-vice-city",
    "category": "veiculos",
    "names": {
      "pt-br": "Carros voam",
      "en": "Flying vehicles",
      "es": "Vehículos vuelan",
      zh: "Flying vehicles",
    },
    "codes": {
      "pc": "COMEFLYWITHME"
    },
    "keywords": {
      "pt-br": [
        "carro",
        "voar",
        "Carros voam",
        "COMEFLYWITHME"
      ],
      "en": [
        "carro",
        "voar",
        "Flying vehicles",
        "COMEFLYWITHME"
      ],
      "es": [
        "carro",
        "voar",
        "Vehículos vuelan",
        "COMEFLYWITHME"
      ],
      zh: [
        "carro",
        "voar",
        "Flying vehicles",
        "COMEFLYWITHME"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA Vice City cheats",
        "url": "https://www.pcgamer.com/gta-vice-city-cheats-pc/"
      }
    ]
  },
  {
    "id": "vicecity-perfect-handling",
    "game": "gta-vice-city",
    "category": "veiculos",
    "names": {
      "pt-br": "Direção melhorada",
      "en": "Handling buff",
      "es": "Conducción mejorada",
      zh: "Handling buff",
    },
    "codes": {
      "pc": "GRIPISEVERYTHING"
    },
    "keywords": {
      "pt-br": [
        "carro",
        "controle",
        "dirigir",
        "Direção melhorada",
        "GRIPISEVERYTHING"
      ],
      "en": [
        "carro",
        "controle",
        "dirigir",
        "Handling buff",
        "GRIPISEVERYTHING"
      ],
      "es": [
        "carro",
        "controle",
        "dirigir",
        "Conducción mejorada",
        "GRIPISEVERYTHING"
      ],
      zh: [
        "carro",
        "controle",
        "dirigir",
        "Handling buff",
        "GRIPISEVERYTHING"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA Vice City cheats",
        "url": "https://www.pcgamer.com/gta-vice-city-cheats-pc/"
      }
    ]
  },
  {
    "id": "vicecity-invisible-cars",
    "game": "gta-vice-city",
    "category": "veiculos",
    "names": {
      "pt-br": "Carros invisíveis",
      "en": "Invisible cars",
      "es": "Coches invisibles",
      zh: "Invisible cars",
    },
    "codes": {
      "pc": "WHEELSAREALLINEED"
    },
    "keywords": {
      "pt-br": [
        "carro",
        "invisível",
        "Carros invisíveis",
        "WHEELSAREALLINEED"
      ],
      "en": [
        "carro",
        "invisível",
        "Invisible cars",
        "WHEELSAREALLINEED"
      ],
      "es": [
        "carro",
        "invisível",
        "Coches invisibles",
        "WHEELSAREALLINEED"
      ],
      zh: [
        "carro",
        "invisível",
        "Invisible cars",
        "WHEELSAREALLINEED"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA Vice City cheats",
        "url": "https://www.pcgamer.com/gta-vice-city-cheats-pc/"
      }
    ]
  },
  {
    "id": "vicecity-explode-cars",
    "game": "gta-vice-city",
    "category": "veiculos",
    "names": {
      "pt-br": "Explodir veículos próximos",
      "en": "Nearby vehicles explode",
      "es": "Explotar vehículos cercanos",
      zh: "Nearby vehicles explode",
    },
    "codes": {
      "pc": "BIGBANG"
    },
    "keywords": {
      "pt-br": [
        "carro",
        "explodir",
        "Explodir veículos próximos",
        "BIGBANG"
      ],
      "en": [
        "carro",
        "explodir",
        "Nearby vehicles explode",
        "BIGBANG"
      ],
      "es": [
        "carro",
        "explodir",
        "Explotar vehículos cercanos",
        "BIGBANG"
      ],
      zh: [
        "carro",
        "explodir",
        "Nearby vehicles explode",
        "BIGBANG"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA Vice City cheats",
        "url": "https://www.pcgamer.com/gta-vice-city-cheats-pc/"
      }
    ]
  },
  {
    "id": "vicecity-pink-cars",
    "game": "gta-vice-city",
    "category": "veiculos",
    "names": {
      "pt-br": "Carros rosa",
      "en": "Pink cars",
      "es": "Coches rosas",
      zh: "Pink cars",
    },
    "codes": {
      "pc": "AHAIRDRESSERSCAR"
    },
    "keywords": {
      "pt-br": [
        "carro",
        "rosa",
        "Carros rosa",
        "AHAIRDRESSERSCAR"
      ],
      "en": [
        "carro",
        "rosa",
        "Pink cars",
        "AHAIRDRESSERSCAR"
      ],
      "es": [
        "carro",
        "rosa",
        "Coches rosas",
        "AHAIRDRESSERSCAR"
      ],
      zh: [
        "carro",
        "rosa",
        "Pink cars",
        "AHAIRDRESSERSCAR"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA Vice City cheats",
        "url": "https://www.pcgamer.com/gta-vice-city-cheats-pc/"
      }
    ]
  },
  {
    "id": "vicecity-road-rage",
    "game": "gta-vice-city",
    "category": "veiculos",
    "names": {
      "pt-br": "Motoristas agressivos",
      "en": "Road rage",
      "es": "Conductores agresivos",
      zh: "Road rage",
    },
    "codes": {
      "pc": "MIAMITRAFFIC"
    },
    "keywords": {
      "pt-br": [
        "trânsito",
        "motorista",
        "agressivo",
        "Motoristas agressivos",
        "MIAMITRAFFIC"
      ],
      "en": [
        "trânsito",
        "motorista",
        "agressivo",
        "Road rage",
        "MIAMITRAFFIC"
      ],
      "es": [
        "trânsito",
        "motorista",
        "agressivo",
        "Conductores agresivos",
        "MIAMITRAFFIC"
      ],
      zh: [
        "trânsito",
        "motorista",
        "agressivo",
        "Road rage",
        "MIAMITRAFFIC"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA Vice City cheats",
        "url": "https://www.pcgamer.com/gta-vice-city-cheats-pc/"
      }
    ]
  },
  {
    "id": "vicecity-spawn-bloodring-alt",
    "game": "gta-vice-city",
    "category": "spawn-veiculos",
    "names": {
      "pt-br": "Spawn Bloodring Banger alternativo",
      "en": "Spawn alt Bloodring Banger",
      "es": "Generar Bloodring Banger alternativo",
      zh: "Spawn alt Bloodring Banger",
    },
    "codes": {
      "pc": "GETTHEREQUICKLY"
    },
    "keywords": {
      "pt-br": [
        "carro",
        "bloodring",
        "Spawn Bloodring Banger alternativo",
        "GETTHEREQUICKLY"
      ],
      "en": [
        "carro",
        "bloodring",
        "Spawn alt Bloodring Banger",
        "GETTHEREQUICKLY"
      ],
      "es": [
        "carro",
        "bloodring",
        "Generar Bloodring Banger alternativo",
        "GETTHEREQUICKLY"
      ],
      zh: [
        "carro",
        "bloodring",
        "Spawn alt Bloodring Banger",
        "GETTHEREQUICKLY"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA Vice City cheats",
        "url": "https://www.pcgamer.com/gta-vice-city-cheats-pc/"
      }
    ]
  },
  {
    "id": "vicecity-spawn-hotring-alt",
    "game": "gta-vice-city",
    "category": "spawn-veiculos",
    "names": {
      "pt-br": "Spawn Hotring Racer alternativo",
      "en": "Spawn alt Hotring Racer",
      "es": "Generar Hotring Racer alternativo",
      zh: "Spawn alt Hotring Racer",
    },
    "codes": {
      "pc": "GETTHEREAMAZINGLYFAST"
    },
    "keywords": {
      "pt-br": [
        "carro",
        "hotring",
        "corrida",
        "Spawn Hotring Racer alternativo",
        "GETTHEREAMAZINGLYFAST"
      ],
      "en": [
        "carro",
        "hotring",
        "corrida",
        "Spawn alt Hotring Racer",
        "GETTHEREAMAZINGLYFAST"
      ],
      "es": [
        "carro",
        "hotring",
        "corrida",
        "Generar Hotring Racer alternativo",
        "GETTHEREAMAZINGLYFAST"
      ],
      zh: [
        "carro",
        "hotring",
        "corrida",
        "Spawn alt Hotring Racer",
        "GETTHEREAMAZINGLYFAST"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA Vice City cheats",
        "url": "https://www.pcgamer.com/gta-vice-city-cheats-pc/"
      }
    ]
  },
  {
    "id": "vicecity-spawn-bloodring",
    "game": "gta-vice-city",
    "category": "spawn-veiculos",
    "names": {
      "pt-br": "Spawn Bloodring Banger",
      "en": "Spawn Bloodring Banger",
      "es": "Generar Bloodring Banger",
      zh: "Spawn Bloodring Banger",
    },
    "codes": {
      "pc": "TRAVELINSTYLE"
    },
    "keywords": {
      "pt-br": [
        "carro",
        "bloodring",
        "Spawn Bloodring Banger",
        "TRAVELINSTYLE"
      ],
      "en": [
        "carro",
        "bloodring",
        "Spawn Bloodring Banger",
        "TRAVELINSTYLE"
      ],
      "es": [
        "carro",
        "bloodring",
        "Generar Bloodring Banger",
        "TRAVELINSTYLE"
      ],
      zh: [
        "carro",
        "bloodring",
        "Spawn Bloodring Banger",
        "TRAVELINSTYLE"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA Vice City cheats",
        "url": "https://www.pcgamer.com/gta-vice-city-cheats-pc/"
      }
    ]
  },
  {
    "id": "vicecity-spawn-caddie",
    "game": "gta-vice-city",
    "category": "spawn-veiculos",
    "names": {
      "pt-br": "Spawn Caddie",
      "en": "Spawn Caddie",
      "es": "Generar Caddie",
      zh: "Spawn Caddie",
    },
    "codes": {
      "pc": "BETTERTHANWALKING"
    },
    "keywords": {
      "pt-br": [
        "caddy",
        "golf",
        "Spawn Caddie",
        "BETTERTHANWALKING"
      ],
      "en": [
        "caddy",
        "golf",
        "Spawn Caddie",
        "BETTERTHANWALKING"
      ],
      "es": [
        "caddy",
        "golf",
        "Generar Caddie",
        "BETTERTHANWALKING"
      ],
      zh: [
        "caddy",
        "golf",
        "Spawn Caddie",
        "BETTERTHANWALKING"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA Vice City cheats",
        "url": "https://www.pcgamer.com/gta-vice-city-cheats-pc/"
      }
    ]
  },
  {
    "id": "vicecity-spawn-hearse",
    "game": "gta-vice-city",
    "category": "spawn-veiculos",
    "names": {
      "pt-br": "Spawn Romero's Hearse",
      "en": "Spawn hearse",
      "es": "Generar coche fúnebre",
      zh: "Spawn hearse",
    },
    "codes": {
      "pc": "THELASTRIDE"
    },
    "keywords": {
      "pt-br": [
        "carro",
        "funerária",
        "Spawn Romero's Hearse",
        "THELASTRIDE"
      ],
      "en": [
        "carro",
        "funerária",
        "Spawn hearse",
        "THELASTRIDE"
      ],
      "es": [
        "carro",
        "funerária",
        "Generar coche fúnebre",
        "THELASTRIDE"
      ],
      zh: [
        "carro",
        "funerária",
        "Spawn hearse",
        "THELASTRIDE"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA Vice City cheats",
        "url": "https://www.pcgamer.com/gta-vice-city-cheats-pc/"
      }
    ]
  },
  {
    "id": "vicecity-spawn-hotring",
    "game": "gta-vice-city",
    "category": "spawn-veiculos",
    "names": {
      "pt-br": "Spawn Hotring Racer",
      "en": "Spawn Hotring Racer",
      "es": "Generar Hotring Racer",
      zh: "Spawn Hotring Racer",
    },
    "codes": {
      "pc": "GETTHEREVERYFASTINDEED"
    },
    "keywords": {
      "pt-br": [
        "carro",
        "corrida",
        "hotring",
        "Spawn Hotring Racer",
        "GETTHEREVERYFASTINDEED"
      ],
      "en": [
        "carro",
        "corrida",
        "hotring",
        "Spawn Hotring Racer",
        "GETTHEREVERYFASTINDEED"
      ],
      "es": [
        "carro",
        "corrida",
        "hotring",
        "Generar Hotring Racer",
        "GETTHEREVERYFASTINDEED"
      ],
      zh: [
        "carro",
        "corrida",
        "hotring",
        "Spawn Hotring Racer",
        "GETTHEREVERYFASTINDEED"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA Vice City cheats",
        "url": "https://www.pcgamer.com/gta-vice-city-cheats-pc/"
      }
    ]
  },
  {
    "id": "vicecity-spawn-limo",
    "game": "gta-vice-city",
    "category": "spawn-veiculos",
    "names": {
      "pt-br": "Spawn Love Fist Limo",
      "en": "Spawn limo",
      "es": "Generar limusina",
      zh: "Spawn limo",
    },
    "codes": {
      "pc": "ROCKANDROLLCAR"
    },
    "keywords": {
      "pt-br": [
        "limusine",
        "limo",
        "Spawn Love Fist Limo",
        "ROCKANDROLLCAR"
      ],
      "en": [
        "limusine",
        "limo",
        "Spawn limo",
        "ROCKANDROLLCAR"
      ],
      "es": [
        "limusine",
        "limo",
        "Generar limusina",
        "ROCKANDROLLCAR"
      ],
      zh: [
        "limusine",
        "limo",
        "Spawn limo",
        "ROCKANDROLLCAR"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA Vice City cheats",
        "url": "https://www.pcgamer.com/gta-vice-city-cheats-pc/"
      }
    ]
  },
  {
    "id": "vicecity-spawn-sabre",
    "game": "gta-vice-city",
    "category": "spawn-veiculos",
    "names": {
      "pt-br": "Spawn Sabre Turbo",
      "en": "Spawn Sabre Turbo",
      "es": "Generar Sabre Turbo",
      zh: "Spawn Sabre Turbo",
    },
    "codes": {
      "pc": "GETTHEREFAST"
    },
    "keywords": {
      "pt-br": [
        "carro",
        "sabre",
        "turbo",
        "Spawn Sabre Turbo",
        "GETTHEREFAST"
      ],
      "en": [
        "carro",
        "sabre",
        "turbo",
        "Spawn Sabre Turbo",
        "GETTHEREFAST"
      ],
      "es": [
        "carro",
        "sabre",
        "turbo",
        "Generar Sabre Turbo",
        "GETTHEREFAST"
      ],
      zh: [
        "carro",
        "sabre",
        "turbo",
        "Spawn Sabre Turbo",
        "GETTHEREFAST"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA Vice City cheats",
        "url": "https://www.pcgamer.com/gta-vice-city-cheats-pc/"
      }
    ]
  },
  {
    "id": "vicecity-spawn-rhino",
    "game": "gta-vice-city",
    "category": "spawn-veiculos",
    "names": {
      "pt-br": "Spawn Rhino tanque",
      "en": "Spawn tank",
      "es": "Generar tanque",
      zh: "Spawn tank",
    },
    "codes": {
      "pc": "PANZER"
    },
    "keywords": {
      "pt-br": [
        "tanque",
        "rhino",
        "Spawn Rhino tanque",
        "PANZER"
      ],
      "en": [
        "tanque",
        "rhino",
        "Spawn tank",
        "PANZER"
      ],
      "es": [
        "tanque",
        "rhino",
        "Generar tanque",
        "PANZER"
      ],
      zh: [
        "tanque",
        "rhino",
        "Spawn tank",
        "PANZER"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA Vice City cheats",
        "url": "https://www.pcgamer.com/gta-vice-city-cheats-pc/"
      }
    ]
  },
  {
    "id": "vicecity-spawn-trashmaster",
    "game": "gta-vice-city",
    "category": "spawn-veiculos",
    "names": {
      "pt-br": "Spawn Trashmaster",
      "en": "Spawn Trashmaster",
      "es": "Generar camión de basura",
      zh: "Spawn Trashmaster",
    },
    "codes": {
      "pc": "RUBBISHCAR"
    },
    "keywords": {
      "pt-br": [
        "caminhão",
        "lixo",
        "Spawn Trashmaster",
        "RUBBISHCAR"
      ],
      "en": [
        "caminhão",
        "lixo",
        "Spawn Trashmaster",
        "RUBBISHCAR"
      ],
      "es": [
        "caminhão",
        "lixo",
        "Generar camión de basura",
        "RUBBISHCAR"
      ],
      zh: [
        "caminhão",
        "lixo",
        "Spawn Trashmaster",
        "RUBBISHCAR"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA Vice City cheats",
        "url": "https://www.pcgamer.com/gta-vice-city-cheats-pc/"
      }
    ]
  },
  {
    "id": "vicecity-wanted-raise",
    "game": "gta-vice-city",
    "category": "policia",
    "names": {
      "pt-br": "Aumentar procurado em 2 estrelas",
      "en": "Increase wanted level by two",
      "es": "Subir búsqueda en dos estrellas",
      zh: "Increase wanted level by two",
    },
    "codes": {
      "pc": "YOUWONTTAKEMEALIVE"
    },
    "keywords": {
      "pt-br": [
        "polícia",
        "estrela",
        "procurado",
        "Aumentar procurado em 2 estrelas",
        "YOUWONTTAKEMEALIVE"
      ],
      "en": [
        "polícia",
        "estrela",
        "procurado",
        "Increase wanted level by two",
        "YOUWONTTAKEMEALIVE"
      ],
      "es": [
        "polícia",
        "estrela",
        "procurado",
        "Subir búsqueda en dos estrellas",
        "YOUWONTTAKEMEALIVE"
      ],
      zh: [
        "polícia",
        "estrela",
        "procurado",
        "Increase wanted level by two",
        "YOUWONTTAKEMEALIVE"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA Vice City cheats",
        "url": "https://www.pcgamer.com/gta-vice-city-cheats-pc/"
      }
    ]
  },
  {
    "id": "vicecity-wanted-lower",
    "game": "gta-vice-city",
    "category": "policia",
    "names": {
      "pt-br": "Zerar procurado",
      "en": "Lower wanted level to zero",
      "es": "Quitar búsqueda",
      zh: "Lower wanted level to zero",
    },
    "codes": {
      "pc": "LEAVEMEALONE"
    },
    "keywords": {
      "pt-br": [
        "polícia",
        "tirar estrela",
        "Zerar procurado",
        "LEAVEMEALONE"
      ],
      "en": [
        "polícia",
        "tirar estrela",
        "Lower wanted level to zero",
        "LEAVEMEALONE"
      ],
      "es": [
        "polícia",
        "tirar estrela",
        "Quitar búsqueda",
        "LEAVEMEALONE"
      ],
      zh: [
        "polícia",
        "tirar estrela",
        "Lower wanted level to zero",
        "LEAVEMEALONE"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA Vice City cheats",
        "url": "https://www.pcgamer.com/gta-vice-city-cheats-pc/"
      }
    ]
  },
  {
    "id": "vicecity-armed-female-peds",
    "game": "gta-vice-city",
    "category": "npc",
    "names": {
      "pt-br": "Mulheres pedestres armadas",
      "en": "Armed female pedestrians",
      "es": "Peatones mujeres armadas",
      zh: "Armed female pedestrians",
    },
    "codes": {
      "pc": "CHICKSWITHGUNS"
    },
    "keywords": {
      "pt-br": [
        "mulheres",
        "pedestres",
        "armas",
        "Mulheres pedestres armadas",
        "CHICKSWITHGUNS"
      ],
      "en": [
        "mulheres",
        "pedestres",
        "armas",
        "Armed female pedestrians",
        "CHICKSWITHGUNS"
      ],
      "es": [
        "mulheres",
        "pedestres",
        "armas",
        "Peatones mujeres armadas",
        "CHICKSWITHGUNS"
      ],
      zh: [
        "mulheres",
        "pedestres",
        "armas",
        "Armed female pedestrians",
        "CHICKSWITHGUNS"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA Vice City cheats",
        "url": "https://www.pcgamer.com/gta-vice-city-cheats-pc/"
      }
    ]
  },
  {
    "id": "vicecity-armed-peds",
    "game": "gta-vice-city",
    "category": "npc",
    "names": {
      "pt-br": "Pedestres armados",
      "en": "Armed pedestrians",
      "es": "Peatones armados",
      zh: "Armed pedestrians",
    },
    "codes": {
      "pc": "OURGODGIVENRIGHTTOBEARARMS"
    },
    "keywords": {
      "pt-br": [
        "pedestres",
        "armas",
        "Pedestres armados",
        "OURGODGIVENRIGHTTOBEARARMS"
      ],
      "en": [
        "pedestres",
        "armas",
        "Armed pedestrians",
        "OURGODGIVENRIGHTTOBEARARMS"
      ],
      "es": [
        "pedestres",
        "armas",
        "Peatones armados",
        "OURGODGIVENRIGHTTOBEARARMS"
      ],
      zh: [
        "pedestres",
        "armas",
        "Armed pedestrians",
        "OURGODGIVENRIGHTTOBEARARMS"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA Vice City cheats",
        "url": "https://www.pcgamer.com/gta-vice-city-cheats-pc/"
      }
    ]
  },
  {
    "id": "vicecity-hostile-peds",
    "game": "gta-vice-city",
    "category": "npc",
    "names": {
      "pt-br": "Pedestres hostis",
      "en": "Hostile pedestrians",
      "es": "Peatones hostiles",
      zh: "Hostile pedestrians",
    },
    "codes": {
      "pc": "NOBODYLIKESME"
    },
    "keywords": {
      "pt-br": [
        "pedestres",
        "hostil",
        "atacar",
        "Pedestres hostis",
        "NOBODYLIKESME"
      ],
      "en": [
        "pedestres",
        "hostil",
        "atacar",
        "Hostile pedestrians",
        "NOBODYLIKESME"
      ],
      "es": [
        "pedestres",
        "hostil",
        "atacar",
        "Peatones hostiles",
        "NOBODYLIKESME"
      ],
      zh: [
        "pedestres",
        "hostil",
        "atacar",
        "Hostile pedestrians",
        "NOBODYLIKESME"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA Vice City cheats",
        "url": "https://www.pcgamer.com/gta-vice-city-cheats-pc/"
      }
    ]
  },
  {
    "id": "vicecity-riot",
    "game": "gta-vice-city",
    "category": "npc",
    "names": {
      "pt-br": "Riot / caos de pedestres",
      "en": "Riot",
      "es": "Disturbios",
      zh: "Riot",
    },
    "codes": {
      "pc": "FIGHTFIGHTFIGHT"
    },
    "keywords": {
      "pt-br": [
        "riot",
        "caos",
        "pedestres",
        "Riot / caos de pedestres",
        "FIGHTFIGHTFIGHT"
      ],
      "en": [
        "riot",
        "caos",
        "pedestres",
        "Riot",
        "FIGHTFIGHTFIGHT"
      ],
      "es": [
        "riot",
        "caos",
        "pedestres",
        "Disturbios",
        "FIGHTFIGHTFIGHT"
      ],
      zh: [
        "riot",
        "caos",
        "pedestres",
        "Riot",
        "FIGHTFIGHTFIGHT"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA Vice City cheats",
        "url": "https://www.pcgamer.com/gta-vice-city-cheats-pc/"
      }
    ]
  },
  {
    "id": "vicecity-cloudy",
    "game": "gta-vice-city",
    "category": "clima",
    "names": {
      "pt-br": "Clima nublado",
      "en": "Cloudy weather",
      "es": "Clima nublado",
      zh: "Cloudy weather",
    },
    "codes": {
      "pc": "APLEASANTDAY"
    },
    "keywords": {
      "pt-br": [
        "clima",
        "nublado",
        "Clima nublado",
        "APLEASANTDAY"
      ],
      "en": [
        "clima",
        "nublado",
        "Cloudy weather",
        "APLEASANTDAY"
      ],
      "es": [
        "clima",
        "nublado",
        "Clima nublado",
        "APLEASANTDAY"
      ],
      zh: [
        "clima",
        "nublado",
        "Cloudy weather",
        "APLEASANTDAY"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA Vice City cheats",
        "url": "https://www.pcgamer.com/gta-vice-city-cheats-pc/"
      }
    ]
  },
  {
    "id": "vicecity-foggy",
    "game": "gta-vice-city",
    "category": "clima",
    "names": {
      "pt-br": "Neblina",
      "en": "Foggy weather",
      "es": "Niebla",
      zh: "Foggy weather",
    },
    "codes": {
      "pc": "CANTSEEATHING"
    },
    "keywords": {
      "pt-br": [
        "clima",
        "neblina",
        "Neblina",
        "CANTSEEATHING"
      ],
      "en": [
        "clima",
        "neblina",
        "Foggy weather",
        "CANTSEEATHING"
      ],
      "es": [
        "clima",
        "neblina",
        "Niebla",
        "CANTSEEATHING"
      ],
      zh: [
        "clima",
        "neblina",
        "Foggy weather",
        "CANTSEEATHING"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA Vice City cheats",
        "url": "https://www.pcgamer.com/gta-vice-city-cheats-pc/"
      }
    ]
  },
  {
    "id": "vicecity-quick-clock",
    "game": "gta-vice-city",
    "category": "mundo",
    "names": {
      "pt-br": "Tempo passa rápido",
      "en": "Quick clock",
      "es": "Reloj rápido",
      zh: "Quick clock",
    },
    "codes": {
      "pc": "LIFEISPASSINGMEBY"
    },
    "keywords": {
      "pt-br": [
        "tempo",
        "relógio",
        "Tempo passa rápido",
        "LIFEISPASSINGMEBY"
      ],
      "en": [
        "tempo",
        "relógio",
        "Quick clock",
        "LIFEISPASSINGMEBY"
      ],
      "es": [
        "tempo",
        "relógio",
        "Reloj rápido",
        "LIFEISPASSINGMEBY"
      ],
      zh: [
        "tempo",
        "relógio",
        "Quick clock",
        "LIFEISPASSINGMEBY"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA Vice City cheats",
        "url": "https://www.pcgamer.com/gta-vice-city-cheats-pc/"
      }
    ]
  },
  {
    "id": "vicecity-rainy",
    "game": "gta-vice-city",
    "category": "clima",
    "names": {
      "pt-br": "Chuva",
      "en": "Rainy weather",
      "es": "Lluvia",
      zh: "Rainy weather",
    },
    "codes": {
      "pc": "CATSANDDOGS"
    },
    "keywords": {
      "pt-br": [
        "clima",
        "chuva",
        "Chuva",
        "CATSANDDOGS"
      ],
      "en": [
        "clima",
        "chuva",
        "Rainy weather",
        "CATSANDDOGS"
      ],
      "es": [
        "clima",
        "chuva",
        "Lluvia",
        "CATSANDDOGS"
      ],
      zh: [
        "clima",
        "chuva",
        "Rainy weather",
        "CATSANDDOGS"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA Vice City cheats",
        "url": "https://www.pcgamer.com/gta-vice-city-cheats-pc/"
      }
    ]
  },
  {
    "id": "vicecity-slow-game",
    "game": "gta-vice-city",
    "category": "mundo",
    "names": {
      "pt-br": "Gameplay lento",
      "en": "Slow down gameplay",
      "es": "Juego lento",
      zh: "Slow down gameplay",
    },
    "codes": {
      "pc": "BOOOOOORING"
    },
    "keywords": {
      "pt-br": [
        "lento",
        "velocidade",
        "Gameplay lento",
        "BOOOOOORING"
      ],
      "en": [
        "lento",
        "velocidade",
        "Slow down gameplay",
        "BOOOOOORING"
      ],
      "es": [
        "lento",
        "velocidade",
        "Juego lento",
        "BOOOOOORING"
      ],
      zh: [
        "lento",
        "velocidade",
        "Slow down gameplay",
        "BOOOOOORING"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA Vice City cheats",
        "url": "https://www.pcgamer.com/gta-vice-city-cheats-pc/"
      }
    ]
  },
  {
    "id": "vicecity-fast-game",
    "game": "gta-vice-city",
    "category": "mundo",
    "names": {
      "pt-br": "Gameplay rápido",
      "en": "Speed up gameplay",
      "es": "Juego rápido",
      zh: "Speed up gameplay",
    },
    "codes": {
      "pc": "ONSPEED"
    },
    "keywords": {
      "pt-br": [
        "rápido",
        "velocidade",
        "Gameplay rápido",
        "ONSPEED"
      ],
      "en": [
        "rápido",
        "velocidade",
        "Speed up gameplay",
        "ONSPEED"
      ],
      "es": [
        "rápido",
        "velocidade",
        "Juego rápido",
        "ONSPEED"
      ],
      zh: [
        "rápido",
        "velocidade",
        "Speed up gameplay",
        "ONSPEED"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA Vice City cheats",
        "url": "https://www.pcgamer.com/gta-vice-city-cheats-pc/"
      }
    ]
  },
  {
    "id": "vicecity-sunny",
    "game": "gta-vice-city",
    "category": "clima",
    "names": {
      "pt-br": "Clima ensolarado",
      "en": "Sunny weather",
      "es": "Clima soleado",
      zh: "Sunny weather",
    },
    "codes": {
      "pc": "ALOVELYDAY"
    },
    "keywords": {
      "pt-br": [
        "clima",
        "sol",
        "Clima ensolarado",
        "ALOVELYDAY"
      ],
      "en": [
        "clima",
        "sol",
        "Sunny weather",
        "ALOVELYDAY"
      ],
      "es": [
        "clima",
        "sol",
        "Clima soleado",
        "ALOVELYDAY"
      ],
      zh: [
        "clima",
        "sol",
        "Sunny weather",
        "ALOVELYDAY"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA Vice City cheats",
        "url": "https://www.pcgamer.com/gta-vice-city-cheats-pc/"
      }
    ]
  },
  {
    "id": "vicecity-very-cloudy",
    "game": "gta-vice-city",
    "category": "clima",
    "names": {
      "pt-br": "Muito nublado",
      "en": "Very cloudy weather",
      "es": "Muy nublado",
      zh: "Very cloudy weather",
    },
    "codes": {
      "pc": "ABITDRIEG"
    },
    "keywords": {
      "pt-br": [
        "clima",
        "nublado",
        "Muito nublado",
        "ABITDRIEG"
      ],
      "en": [
        "clima",
        "nublado",
        "Very cloudy weather",
        "ABITDRIEG"
      ],
      "es": [
        "clima",
        "nublado",
        "Muy nublado",
        "ABITDRIEG"
      ],
      zh: [
        "clima",
        "nublado",
        "Very cloudy weather",
        "ABITDRIEG"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA Vice City cheats",
        "url": "https://www.pcgamer.com/gta-vice-city-cheats-pc/"
      }
    ]
  },
  {
    "id": "vicecity-skin-candy",
    "game": "gta-vice-city",
    "category": "skins",
    "names": {
      "pt-br": "Skin Candy Suxxx",
      "en": "Candy Suxxx skin",
      "es": "Skin Candy Suxxx",
      zh: "Candy Suxxx skin",
    },
    "codes": {
      "pc": "IWANTBIGTITS"
    },
    "keywords": {
      "pt-br": [
        "skin",
        "personagem",
        "Skin Candy Suxxx",
        "IWANTBIGTITS"
      ],
      "en": [
        "skin",
        "personagem",
        "Candy Suxxx skin",
        "IWANTBIGTITS"
      ],
      "es": [
        "skin",
        "personagem",
        "Skin Candy Suxxx",
        "IWANTBIGTITS"
      ],
      zh: [
        "skin",
        "personagem",
        "Candy Suxxx skin",
        "IWANTBIGTITS"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA Vice City cheats",
        "url": "https://www.pcgamer.com/gta-vice-city-cheats-pc/"
      }
    ]
  },
  {
    "id": "vicecity-skin-dick",
    "game": "gta-vice-city",
    "category": "skins",
    "names": {
      "pt-br": "Skin Dick",
      "en": "Dick skin",
      "es": "Skin Dick",
      zh: "Dick skin",
    },
    "codes": {
      "pc": "WELOVEOURDICK"
    },
    "keywords": {
      "pt-br": [
        "skin",
        "personagem",
        "Skin Dick",
        "WELOVEOURDICK"
      ],
      "en": [
        "skin",
        "personagem",
        "Dick skin",
        "WELOVEOURDICK"
      ],
      "es": [
        "skin",
        "personagem",
        "Skin Dick",
        "WELOVEOURDICK"
      ],
      zh: [
        "skin",
        "personagem",
        "Dick skin",
        "WELOVEOURDICK"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA Vice City cheats",
        "url": "https://www.pcgamer.com/gta-vice-city-cheats-pc/"
      }
    ]
  },
  {
    "id": "vicecity-skin-hilary",
    "game": "gta-vice-city",
    "category": "skins",
    "names": {
      "pt-br": "Skin Hilary",
      "en": "Hilary skin",
      "es": "Skin Hilary",
      zh: "Hilary skin",
    },
    "codes": {
      "pc": "ILOOKLIKEHILARY"
    },
    "keywords": {
      "pt-br": [
        "skin",
        "personagem",
        "Skin Hilary",
        "ILOOKLIKEHILARY"
      ],
      "en": [
        "skin",
        "personagem",
        "Hilary skin",
        "ILOOKLIKEHILARY"
      ],
      "es": [
        "skin",
        "personagem",
        "Skin Hilary",
        "ILOOKLIKEHILARY"
      ],
      zh: [
        "skin",
        "personagem",
        "Hilary skin",
        "ILOOKLIKEHILARY"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA Vice City cheats",
        "url": "https://www.pcgamer.com/gta-vice-city-cheats-pc/"
      }
    ]
  },
  {
    "id": "vicecity-skin-jezz",
    "game": "gta-vice-city",
    "category": "skins",
    "names": {
      "pt-br": "Skin Jezz",
      "en": "Jezz skin",
      "es": "Skin Jezz",
      zh: "Jezz skin",
    },
    "codes": {
      "pc": "ROCKANDROLLMAN"
    },
    "keywords": {
      "pt-br": [
        "skin",
        "personagem",
        "Skin Jezz",
        "ROCKANDROLLMAN"
      ],
      "en": [
        "skin",
        "personagem",
        "Jezz skin",
        "ROCKANDROLLMAN"
      ],
      "es": [
        "skin",
        "personagem",
        "Skin Jezz",
        "ROCKANDROLLMAN"
      ],
      zh: [
        "skin",
        "personagem",
        "Jezz skin",
        "ROCKANDROLLMAN"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA Vice City cheats",
        "url": "https://www.pcgamer.com/gta-vice-city-cheats-pc/"
      }
    ]
  },
  {
    "id": "vicecity-skin-ken",
    "game": "gta-vice-city",
    "category": "skins",
    "names": {
      "pt-br": "Skin Ken Rosenberg",
      "en": "Ken skin",
      "es": "Skin Ken",
      zh: "Ken skin",
    },
    "codes": {
      "pc": "MYSONISALAWYER"
    },
    "keywords": {
      "pt-br": [
        "skin",
        "personagem",
        "Skin Ken Rosenberg",
        "MYSONISALAWYER"
      ],
      "en": [
        "skin",
        "personagem",
        "Ken skin",
        "MYSONISALAWYER"
      ],
      "es": [
        "skin",
        "personagem",
        "Skin Ken",
        "MYSONISALAWYER"
      ],
      zh: [
        "skin",
        "personagem",
        "Ken skin",
        "MYSONISALAWYER"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA Vice City cheats",
        "url": "https://www.pcgamer.com/gta-vice-city-cheats-pc/"
      }
    ]
  },
  {
    "id": "vicecity-skin-lance",
    "game": "gta-vice-city",
    "category": "skins",
    "names": {
      "pt-br": "Skin Lance",
      "en": "Lance skin",
      "es": "Skin Lance",
      zh: "Lance skin",
    },
    "codes": {
      "pc": "LOOKLIKELANCE"
    },
    "keywords": {
      "pt-br": [
        "skin",
        "personagem",
        "Skin Lance",
        "LOOKLIKELANCE"
      ],
      "en": [
        "skin",
        "personagem",
        "Lance skin",
        "LOOKLIKELANCE"
      ],
      "es": [
        "skin",
        "personagem",
        "Skin Lance",
        "LOOKLIKELANCE"
      ],
      zh: [
        "skin",
        "personagem",
        "Lance skin",
        "LOOKLIKELANCE"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA Vice City cheats",
        "url": "https://www.pcgamer.com/gta-vice-city-cheats-pc/"
      }
    ]
  },
  {
    "id": "vicecity-skin-mercedes",
    "game": "gta-vice-city",
    "category": "skins",
    "names": {
      "pt-br": "Skin Mercedes",
      "en": "Mercedes skin",
      "es": "Skin Mercedes",
      zh: "Mercedes skin",
    },
    "codes": {
      "pc": "FOXYLITTLETHING"
    },
    "keywords": {
      "pt-br": [
        "skin",
        "personagem",
        "Skin Mercedes",
        "FOXYLITTLETHING"
      ],
      "en": [
        "skin",
        "personagem",
        "Mercedes skin",
        "FOXYLITTLETHING"
      ],
      "es": [
        "skin",
        "personagem",
        "Skin Mercedes",
        "FOXYLITTLETHING"
      ],
      zh: [
        "skin",
        "personagem",
        "Mercedes skin",
        "FOXYLITTLETHING"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA Vice City cheats",
        "url": "https://www.pcgamer.com/gta-vice-city-cheats-pc/"
      }
    ]
  },
  {
    "id": "vicecity-skin-phil",
    "game": "gta-vice-city",
    "category": "skins",
    "names": {
      "pt-br": "Skin Phil",
      "en": "Phil skin",
      "es": "Skin Phil",
      zh: "Phil skin",
    },
    "codes": {
      "pc": "ONEARMEDBANDIT"
    },
    "keywords": {
      "pt-br": [
        "skin",
        "personagem",
        "Skin Phil",
        "ONEARMEDBANDIT"
      ],
      "en": [
        "skin",
        "personagem",
        "Phil skin",
        "ONEARMEDBANDIT"
      ],
      "es": [
        "skin",
        "personagem",
        "Skin Phil",
        "ONEARMEDBANDIT"
      ],
      zh: [
        "skin",
        "personagem",
        "Phil skin",
        "ONEARMEDBANDIT"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA Vice City cheats",
        "url": "https://www.pcgamer.com/gta-vice-city-cheats-pc/"
      }
    ]
  },
  {
    "id": "vicecity-skin-pedestrian",
    "game": "gta-vice-city",
    "category": "skins",
    "names": {
      "pt-br": "Skin pedestre aleatório",
      "en": "Pedestrian skin",
      "es": "Skin peatón",
      zh: "Pedestrian skin",
    },
    "codes": {
      "pc": "STILLLIKEDRESSINGUP"
    },
    "keywords": {
      "pt-br": [
        "skin",
        "pedestre",
        "Skin pedestre aleatório",
        "STILLLIKEDRESSINGUP"
      ],
      "en": [
        "skin",
        "pedestre",
        "Pedestrian skin",
        "STILLLIKEDRESSINGUP"
      ],
      "es": [
        "skin",
        "pedestre",
        "Skin peatón",
        "STILLLIKEDRESSINGUP"
      ],
      zh: [
        "skin",
        "pedestre",
        "Pedestrian skin",
        "STILLLIKEDRESSINGUP"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA Vice City cheats",
        "url": "https://www.pcgamer.com/gta-vice-city-cheats-pc/"
      }
    ]
  },
  {
    "id": "vicecity-skin-ricardo",
    "game": "gta-vice-city",
    "category": "skins",
    "names": {
      "pt-br": "Skin Ricardo Diaz",
      "en": "Ricardo skin",
      "es": "Skin Ricardo",
      zh: "Ricardo skin",
    },
    "codes": {
      "pc": "CHEATSHAVEBEENCRACKED"
    },
    "keywords": {
      "pt-br": [
        "skin",
        "personagem",
        "Skin Ricardo Diaz",
        "CHEATSHAVEBEENCRACKED"
      ],
      "en": [
        "skin",
        "personagem",
        "Ricardo skin",
        "CHEATSHAVEBEENCRACKED"
      ],
      "es": [
        "skin",
        "personagem",
        "Skin Ricardo",
        "CHEATSHAVEBEENCRACKED"
      ],
      zh: [
        "skin",
        "personagem",
        "Ricardo skin",
        "CHEATSHAVEBEENCRACKED"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA Vice City cheats",
        "url": "https://www.pcgamer.com/gta-vice-city-cheats-pc/"
      }
    ]
  },
  {
    "id": "vicecity-skin-sonny",
    "game": "gta-vice-city",
    "category": "skins",
    "names": {
      "pt-br": "Skin Sonny Forelli",
      "en": "Sonny skin",
      "es": "Skin Sonny",
      zh: "Sonny skin",
    },
    "codes": {
      "pc": "IDONTHAVETHEMONEYSONNY"
    },
    "keywords": {
      "pt-br": [
        "skin",
        "personagem",
        "Skin Sonny Forelli",
        "IDONTHAVETHEMONEYSONNY"
      ],
      "en": [
        "skin",
        "personagem",
        "Sonny skin",
        "IDONTHAVETHEMONEYSONNY"
      ],
      "es": [
        "skin",
        "personagem",
        "Skin Sonny",
        "IDONTHAVETHEMONEYSONNY"
      ],
      zh: [
        "skin",
        "personagem",
        "Sonny skin",
        "IDONTHAVETHEMONEYSONNY"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA Vice City cheats",
        "url": "https://www.pcgamer.com/gta-vice-city-cheats-pc/"
      }
    ]
  },
  {
    "id": "vicecity-thick-arms",
    "game": "gta-vice-city",
    "category": "player",
    "names": {
      "pt-br": "Braços/pernas grossos",
      "en": "Thick arms/legs",
      "es": "Brazos/piernas gruesos",
      zh: "Thick arms/legs",
    },
    "codes": {
      "pc": "DEEPFRIEDMARSBARS"
    },
    "keywords": {
      "pt-br": [
        "corpo",
        "gordo",
        "Braços/pernas grossos",
        "DEEPFRIEDMARSBARS"
      ],
      "en": [
        "corpo",
        "gordo",
        "Thick arms/legs",
        "DEEPFRIEDMARSBARS"
      ],
      "es": [
        "corpo",
        "gordo",
        "Brazos/piernas gruesos",
        "DEEPFRIEDMARSBARS"
      ],
      zh: [
        "corpo",
        "gordo",
        "Thick arms/legs",
        "DEEPFRIEDMARSBARS"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA Vice City cheats",
        "url": "https://www.pcgamer.com/gta-vice-city-cheats-pc/"
      }
    ]
  },
  {
    "id": "vicecity-thin-arms",
    "game": "gta-vice-city",
    "category": "player",
    "names": {
      "pt-br": "Braços/pernas finos",
      "en": "Thin arms/legs",
      "es": "Brazos/piernas delgados",
      zh: "Thin arms/legs",
    },
    "codes": {
      "pc": "PROGRAMMER"
    },
    "keywords": {
      "pt-br": [
        "corpo",
        "magro",
        "Braços/pernas finos",
        "PROGRAMMER"
      ],
      "en": [
        "corpo",
        "magro",
        "Thin arms/legs",
        "PROGRAMMER"
      ],
      "es": [
        "corpo",
        "magro",
        "Brazos/piernas delgados",
        "PROGRAMMER"
      ],
      zh: [
        "corpo",
        "magro",
        "Thin arms/legs",
        "PROGRAMMER"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA Vice City cheats",
        "url": "https://www.pcgamer.com/gta-vice-city-cheats-pc/"
      }
    ]
  },
  {
    "id": "vicecity-smoke-cigarette",
    "game": "gta-vice-city",
    "category": "player",
    "names": {
      "pt-br": "Fumar cigarro",
      "en": "Smoke a cigarette",
      "es": "Fumar cigarrillo",
      zh: "Smoke a cigarette",
    },
    "codes": {
      "pc": "CERTAINDEATH"
    },
    "keywords": {
      "pt-br": [
        "cigarro",
        "fumar",
        "Fumar cigarro",
        "CERTAINDEATH"
      ],
      "en": [
        "cigarro",
        "fumar",
        "Smoke a cigarette",
        "CERTAINDEATH"
      ],
      "es": [
        "cigarro",
        "fumar",
        "Fumar cigarrillo",
        "CERTAINDEATH"
      ],
      zh: [
        "cigarro",
        "fumar",
        "Smoke a cigarette",
        "CERTAINDEATH"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA Vice City cheats",
        "url": "https://www.pcgamer.com/gta-vice-city-cheats-pc/"
      }
    ]
  },
  {
    "id": "vicecity-peds-enter-car",
    "game": "gta-vice-city",
    "category": "npc",
    "names": {
      "pt-br": "Pedestres entram no seu carro",
      "en": "Make pedestrians enter your car",
      "es": "Peatones entran en tu coche",
      zh: "Make pedestrians enter your car",
    },
    "codes": {
      "pc": "HOPINGIRL"
    },
    "keywords": {
      "pt-br": [
        "pedestre",
        "carro",
        "Pedestres entram no seu carro",
        "HOPINGIRL"
      ],
      "en": [
        "pedestre",
        "carro",
        "Make pedestrians enter your car",
        "HOPINGIRL"
      ],
      "es": [
        "pedestre",
        "carro",
        "Peatones entran en tu coche",
        "HOPINGIRL"
      ],
      zh: [
        "pedestre",
        "carro",
        "Make pedestrians enter your car",
        "HOPINGIRL"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "PC Gamer - GTA Vice City cheats",
        "url": "https://www.pcgamer.com/gta-vice-city-cheats-pc/"
      }
    ]
  },
  {
    "id": "iii-all-weapons",
    "game": "gta-iii",
    "category": "armas",
    "names": {
      "pt-br": "Todas as armas",
      "en": "All weapons",
      "es": "Todas las armas",
      zh: "All weapons",
    },
    "codes": {
      "pc": "GUNSGUNSGUNS"
    },
    "keywords": {
      "pt-br": [
        "armas",
        "Todas as armas",
        "GUNSGUNSGUNS"
      ],
      "en": [
        "armas",
        "All weapons",
        "GUNSGUNSGUNS"
      ],
      "es": [
        "armas",
        "Todas las armas",
        "GUNSGUNSGUNS"
      ],
      zh: [
        "armas",
        "All weapons",
        "GUNSGUNSGUNS"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA3.com - PC Version Cheats",
        "url": "https://www.gta3.com/pc-cheats/"
      }
    ]
  },
  {
    "id": "iii-money",
    "game": "gta-iii",
    "category": "dinheiro",
    "names": {
      "pt-br": "Dinheiro",
      "en": "Money",
      "es": "Dinero",
      zh: "Money",
    },
    "codes": {
      "pc": "IFIWEREARICHMAN"
    },
    "keywords": {
      "pt-br": [
        "dinheiro",
        "grana",
        "Dinheiro",
        "IFIWEREARICHMAN"
      ],
      "en": [
        "dinheiro",
        "grana",
        "Money",
        "IFIWEREARICHMAN"
      ],
      "es": [
        "dinheiro",
        "grana",
        "Dinero",
        "IFIWEREARICHMAN"
      ],
      zh: [
        "dinheiro",
        "grana",
        "Money",
        "IFIWEREARICHMAN"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA3.com - PC Version Cheats",
        "url": "https://www.gta3.com/pc-cheats/"
      }
    ]
  },
  {
    "id": "iii-health",
    "game": "gta-iii",
    "category": "vida-armadura",
    "names": {
      "pt-br": "Vida completa",
      "en": "Full health",
      "es": "Vida completa",
      zh: "Full health",
    },
    "codes": {
      "pc": "GESUNDHEIT"
    },
    "keywords": {
      "pt-br": [
        "vida",
        "cura",
        "Vida completa",
        "GESUNDHEIT"
      ],
      "en": [
        "vida",
        "cura",
        "Full health",
        "GESUNDHEIT"
      ],
      "es": [
        "vida",
        "cura",
        "Vida completa",
        "GESUNDHEIT"
      ],
      zh: [
        "vida",
        "cura",
        "Full health",
        "GESUNDHEIT"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA3.com - PC Version Cheats",
        "url": "https://www.gta3.com/pc-cheats/"
      }
    ]
  },
  {
    "id": "iii-raise-wanted",
    "game": "gta-iii",
    "category": "policia",
    "names": {
      "pt-br": "Aumentar procurado",
      "en": "More police",
      "es": "Más policía",
      zh: "More police",
    },
    "codes": {
      "pc": "MOREPOLICEPLEASE"
    },
    "keywords": {
      "pt-br": [
        "policia",
        "procurado",
        "Aumentar procurado",
        "MOREPOLICEPLEASE"
      ],
      "en": [
        "policia",
        "procurado",
        "More police",
        "MOREPOLICEPLEASE"
      ],
      "es": [
        "policia",
        "procurado",
        "Más policía",
        "MOREPOLICEPLEASE"
      ],
      zh: [
        "policia",
        "procurado",
        "More police",
        "MOREPOLICEPLEASE"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA3.com - PC Version Cheats",
        "url": "https://www.gta3.com/pc-cheats/"
      }
    ]
  },
  {
    "id": "iii-lower-wanted",
    "game": "gta-iii",
    "category": "policia",
    "names": {
      "pt-br": "Remover procurado",
      "en": "No police",
      "es": "Sin policía",
      zh: "No police",
    },
    "codes": {
      "pc": "NOPOLICEPLEASE"
    },
    "keywords": {
      "pt-br": [
        "policia",
        "tirar estrela",
        "Remover procurado",
        "NOPOLICEPLEASE"
      ],
      "en": [
        "policia",
        "tirar estrela",
        "No police",
        "NOPOLICEPLEASE"
      ],
      "es": [
        "policia",
        "tirar estrela",
        "Sin policía",
        "NOPOLICEPLEASE"
      ],
      zh: [
        "policia",
        "tirar estrela",
        "No police",
        "NOPOLICEPLEASE"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA3.com - PC Version Cheats",
        "url": "https://www.gta3.com/pc-cheats/"
      }
    ]
  },
  {
    "id": "iii-spawn-rhino",
    "game": "gta-iii",
    "category": "spawn-veiculos",
    "names": {
      "pt-br": "Spawn tanque",
      "en": "Spawn tank",
      "es": "Generar tanque",
      zh: "Spawn tank",
    },
    "codes": {
      "pc": "GIVEUSATANK"
    },
    "keywords": {
      "pt-br": [
        "tanque",
        "rhino",
        "Spawn tanque",
        "GIVEUSATANK"
      ],
      "en": [
        "tanque",
        "rhino",
        "Spawn tank",
        "GIVEUSATANK"
      ],
      "es": [
        "tanque",
        "rhino",
        "Generar tanque",
        "GIVEUSATANK"
      ],
      zh: [
        "tanque",
        "rhino",
        "Spawn tank",
        "GIVEUSATANK"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA3.com - PC Version Cheats",
        "url": "https://www.gta3.com/pc-cheats/"
      }
    ]
  },
  {
    "id": "iii-explode-cars",
    "game": "gta-iii",
    "category": "veiculos",
    "names": {
      "pt-br": "Explodir todos os carros",
      "en": "All cars explode",
      "es": "Todos los coches explotan",
      zh: "All cars explode",
    },
    "codes": {
      "pc": "BANGBANGBANG"
    },
    "keywords": {
      "pt-br": [
        "carro",
        "explodir",
        "Explodir todos os carros",
        "BANGBANGBANG"
      ],
      "en": [
        "carro",
        "explodir",
        "All cars explode",
        "BANGBANGBANG"
      ],
      "es": [
        "carro",
        "explodir",
        "Todos los coches explotan",
        "BANGBANGBANG"
      ],
      zh: [
        "carro",
        "explodir",
        "All cars explode",
        "BANGBANGBANG"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA3.com - PC Version Cheats",
        "url": "https://www.gta3.com/pc-cheats/"
      }
    ]
  },
  {
    "id": "iii-change-outfit",
    "game": "gta-iii",
    "category": "skins",
    "names": {
      "pt-br": "Trocar roupa/personagem",
      "en": "Change outfit",
      "es": "Cambiar ropa/personaje",
      zh: "Change outfit",
    },
    "codes": {
      "pc": "ILIKEDRESSINGUP"
    },
    "keywords": {
      "pt-br": [
        "skin",
        "roupa",
        "Trocar roupa/personagem",
        "ILIKEDRESSINGUP"
      ],
      "en": [
        "skin",
        "roupa",
        "Change outfit",
        "ILIKEDRESSINGUP"
      ],
      "es": [
        "skin",
        "roupa",
        "Cambiar ropa/personaje",
        "ILIKEDRESSINGUP"
      ],
      zh: [
        "skin",
        "roupa",
        "Change outfit",
        "ILIKEDRESSINGUP"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA3.com - PC Version Cheats",
        "url": "https://www.gta3.com/pc-cheats/"
      }
    ]
  },
  {
    "id": "iii-peds-mad",
    "game": "gta-iii",
    "category": "npc",
    "names": {
      "pt-br": "Todo mundo fica louco",
      "en": "Everyone goes mad",
      "es": "Todos se vuelven locos",
      zh: "Everyone goes mad",
    },
    "codes": {
      "pc": "ITSALLGOINGMAAAD"
    },
    "keywords": {
      "pt-br": [
        "pedestre",
        "caos",
        "Todo mundo fica louco",
        "ITSALLGOINGMAAAD"
      ],
      "en": [
        "pedestre",
        "caos",
        "Everyone goes mad",
        "ITSALLGOINGMAAAD"
      ],
      "es": [
        "pedestre",
        "caos",
        "Todos se vuelven locos",
        "ITSALLGOINGMAAAD"
      ],
      zh: [
        "pedestre",
        "caos",
        "Everyone goes mad",
        "ITSALLGOINGMAAAD"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA3.com - PC Version Cheats",
        "url": "https://www.gta3.com/pc-cheats/"
      }
    ]
  },
  {
    "id": "iii-peds-hate-you",
    "game": "gta-iii",
    "category": "npc",
    "names": {
      "pt-br": "Todos odeiam você",
      "en": "Everyone hates you",
      "es": "Todos te odian",
      zh: "Everyone hates you",
    },
    "codes": {
      "pc": "NOBODYLIKESME"
    },
    "keywords": {
      "pt-br": [
        "pedestre",
        "atacar",
        "Todos odeiam você",
        "NOBODYLIKESME"
      ],
      "en": [
        "pedestre",
        "atacar",
        "Everyone hates you",
        "NOBODYLIKESME"
      ],
      "es": [
        "pedestre",
        "atacar",
        "Todos te odian",
        "NOBODYLIKESME"
      ],
      zh: [
        "pedestre",
        "atacar",
        "Everyone hates you",
        "NOBODYLIKESME"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA3.com - PC Version Cheats",
        "url": "https://www.gta3.com/pc-cheats/"
      }
    ]
  },
  {
    "id": "iii-peds-weapons",
    "game": "gta-iii",
    "category": "npc",
    "names": {
      "pt-br": "Todos têm armas",
      "en": "Everyone has weapons",
      "es": "Todos tienen armas",
      zh: "Everyone has weapons",
    },
    "codes": {
      "pc": "WEAPONSFORALL"
    },
    "keywords": {
      "pt-br": [
        "pedestre",
        "armas",
        "Todos têm armas",
        "WEAPONSFORALL"
      ],
      "en": [
        "pedestre",
        "armas",
        "Everyone has weapons",
        "WEAPONSFORALL"
      ],
      "es": [
        "pedestre",
        "armas",
        "Todos tienen armas",
        "WEAPONSFORALL"
      ],
      zh: [
        "pedestre",
        "armas",
        "Everyone has weapons",
        "WEAPONSFORALL"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA3.com - PC Version Cheats",
        "url": "https://www.gta3.com/pc-cheats/"
      }
    ]
  },
  {
    "id": "iii-speed-time",
    "game": "gta-iii",
    "category": "mundo",
    "names": {
      "pt-br": "Tempo rápido",
      "en": "Speed up time",
      "es": "Acelerar tiempo",
      zh: "Speed up time",
    },
    "codes": {
      "pc": "TIMEFLIESWHENYOU"
    },
    "keywords": {
      "pt-br": [
        "tempo",
        "rápido",
        "Tempo rápido",
        "TIMEFLIESWHENYOU"
      ],
      "en": [
        "tempo",
        "rápido",
        "Speed up time",
        "TIMEFLIESWHENYOU"
      ],
      "es": [
        "tempo",
        "rápido",
        "Acelerar tiempo",
        "TIMEFLIESWHENYOU"
      ],
      zh: [
        "tempo",
        "rápido",
        "Speed up time",
        "TIMEFLIESWHENYOU"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA3.com - PC Version Cheats",
        "url": "https://www.gta3.com/pc-cheats/"
      }
    ]
  },
  {
    "id": "iii-slow-time",
    "game": "gta-iii",
    "category": "mundo",
    "names": {
      "pt-br": "Tempo lento",
      "en": "Slow down time",
      "es": "Ralentizar tiempo",
      zh: "Slow down time",
    },
    "codes": {
      "pc": "BOOOOORING"
    },
    "keywords": {
      "pt-br": [
        "tempo",
        "lento",
        "Tempo lento",
        "BOOOOORING"
      ],
      "en": [
        "tempo",
        "lento",
        "Slow down time",
        "BOOOOORING"
      ],
      "es": [
        "tempo",
        "lento",
        "Ralentizar tiempo",
        "BOOOOORING"
      ],
      zh: [
        "tempo",
        "lento",
        "Slow down time",
        "BOOOOORING"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA3.com - PC Version Cheats",
        "url": "https://www.gta3.com/pc-cheats/"
      }
    ]
  },
  {
    "id": "iii-armor",
    "game": "gta-iii",
    "category": "vida-armadura",
    "names": {
      "pt-br": "Armadura completa",
      "en": "Full armor",
      "es": "Armadura completa",
      zh: "Full armor",
    },
    "codes": {
      "pc": "TURTOISE"
    },
    "keywords": {
      "pt-br": [
        "armadura",
        "colete",
        "Armadura completa",
        "TURTOISE"
      ],
      "en": [
        "armadura",
        "colete",
        "Full armor",
        "TURTOISE"
      ],
      "es": [
        "armadura",
        "colete",
        "Armadura completa",
        "TURTOISE"
      ],
      zh: [
        "armadura",
        "colete",
        "Full armor",
        "TURTOISE"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA3.com - PC Version Cheats",
        "url": "https://www.gta3.com/pc-cheats/"
      }
    ],
    "note": "Algumas listas modernas também citam TORTOISE; GTA3.com lista TURTOISE."
  },
  {
    "id": "iii-clear-weather",
    "game": "gta-iii",
    "category": "clima",
    "names": {
      "pt-br": "Clima limpo",
      "en": "Clear weather",
      "es": "Clima despejado",
      zh: "Clear weather",
    },
    "codes": {
      "pc": "SKINCANCERFORME"
    },
    "keywords": {
      "pt-br": [
        "clima",
        "sol",
        "Clima limpo",
        "SKINCANCERFORME"
      ],
      "en": [
        "clima",
        "sol",
        "Clear weather",
        "SKINCANCERFORME"
      ],
      "es": [
        "clima",
        "sol",
        "Clima despejado",
        "SKINCANCERFORME"
      ],
      zh: [
        "clima",
        "sol",
        "Clear weather",
        "SKINCANCERFORME"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA3.com - PC Version Cheats",
        "url": "https://www.gta3.com/pc-cheats/"
      }
    ]
  },
  {
    "id": "iii-rain",
    "game": "gta-iii",
    "category": "clima",
    "names": {
      "pt-br": "Chuva",
      "en": "Rain",
      "es": "Lluvia",
      zh: "Rain",
    },
    "codes": {
      "pc": "ILIKESCOTLAND"
    },
    "keywords": {
      "pt-br": [
        "clima",
        "chuva",
        "Chuva",
        "ILIKESCOTLAND"
      ],
      "en": [
        "clima",
        "chuva",
        "Rain",
        "ILIKESCOTLAND"
      ],
      "es": [
        "clima",
        "chuva",
        "Lluvia",
        "ILIKESCOTLAND"
      ],
      zh: [
        "clima",
        "chuva",
        "Rain",
        "ILIKESCOTLAND"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA3.com - PC Version Cheats",
        "url": "https://www.gta3.com/pc-cheats/"
      }
    ]
  },
  {
    "id": "iii-thunderstorm",
    "game": "gta-iii",
    "category": "clima",
    "names": {
      "pt-br": "Tempestade",
      "en": "Thunderstorm",
      "es": "Tormenta",
      zh: "Thunderstorm",
    },
    "codes": {
      "pc": "ILOVESCOTLAND"
    },
    "keywords": {
      "pt-br": [
        "clima",
        "tempestade",
        "Tempestade",
        "ILOVESCOTLAND"
      ],
      "en": [
        "clima",
        "tempestade",
        "Thunderstorm",
        "ILOVESCOTLAND"
      ],
      "es": [
        "clima",
        "tempestade",
        "Tormenta",
        "ILOVESCOTLAND"
      ],
      zh: [
        "clima",
        "tempestade",
        "Thunderstorm",
        "ILOVESCOTLAND"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA3.com - PC Version Cheats",
        "url": "https://www.gta3.com/pc-cheats/"
      }
    ]
  },
  {
    "id": "iii-fog",
    "game": "gta-iii",
    "category": "clima",
    "names": {
      "pt-br": "Neblina",
      "en": "Fog",
      "es": "Niebla",
      zh: "Fog",
    },
    "codes": {
      "pc": "PEASOUP"
    },
    "keywords": {
      "pt-br": [
        "clima",
        "neblina",
        "Neblina",
        "PEASOUP"
      ],
      "en": [
        "clima",
        "neblina",
        "Fog",
        "PEASOUP"
      ],
      "es": [
        "clima",
        "neblina",
        "Niebla",
        "PEASOUP"
      ],
      zh: [
        "clima",
        "neblina",
        "Fog",
        "PEASOUP"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA3.com - PC Version Cheats",
        "url": "https://www.gta3.com/pc-cheats/"
      }
    ]
  },
  {
    "id": "iii-fast-weather",
    "game": "gta-iii",
    "category": "clima",
    "names": {
      "pt-br": "Clima muda rápido",
      "en": "Fast weather cycling",
      "es": "Clima cambia rápido",
      zh: "Fast weather cycling",
    },
    "codes": {
      "pc": "MADWEATHER"
    },
    "keywords": {
      "pt-br": [
        "clima",
        "rápido",
        "Clima muda rápido",
        "MADWEATHER"
      ],
      "en": [
        "clima",
        "rápido",
        "Fast weather cycling",
        "MADWEATHER"
      ],
      "es": [
        "clima",
        "rápido",
        "Clima cambia rápido",
        "MADWEATHER"
      ],
      zh: [
        "clima",
        "rápido",
        "Fast weather cycling",
        "MADWEATHER"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA3.com - PC Version Cheats",
        "url": "https://www.gta3.com/pc-cheats/"
      }
    ]
  },
  {
    "id": "iii-invisible-cars",
    "game": "gta-iii",
    "category": "veiculos",
    "names": {
      "pt-br": "Carros invisíveis",
      "en": "Invisible cars",
      "es": "Coches invisibles",
      zh: "Invisible cars",
    },
    "codes": {
      "pc": "ANICESETOFWHEELS"
    },
    "keywords": {
      "pt-br": [
        "carro",
        "invisivel",
        "Carros invisíveis",
        "ANICESETOFWHEELS"
      ],
      "en": [
        "carro",
        "invisivel",
        "Invisible cars",
        "ANICESETOFWHEELS"
      ],
      "es": [
        "carro",
        "invisivel",
        "Coches invisibles",
        "ANICESETOFWHEELS"
      ],
      zh: [
        "carro",
        "invisivel",
        "Invisible cars",
        "ANICESETOFWHEELS"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA3.com - PC Version Cheats",
        "url": "https://www.gta3.com/pc-cheats/"
      }
    ]
  },
  {
    "id": "iii-flying-cars",
    "game": "gta-iii",
    "category": "veiculos",
    "names": {
      "pt-br": "Carros voam",
      "en": "Flying cars",
      "es": "Coches vuelan",
      zh: "Flying cars",
    },
    "codes": {
      "pc": "CHITTYCHITTYBB"
    },
    "keywords": {
      "pt-br": [
        "carro",
        "voar",
        "Carros voam",
        "CHITTYCHITTYBB"
      ],
      "en": [
        "carro",
        "voar",
        "Flying cars",
        "CHITTYCHITTYBB"
      ],
      "es": [
        "carro",
        "voar",
        "Coches vuelan",
        "CHITTYCHITTYBB"
      ],
      zh: [
        "carro",
        "voar",
        "Flying cars",
        "CHITTYCHITTYBB"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA3.com - PC Version Cheats",
        "url": "https://www.gta3.com/pc-cheats/"
      }
    ]
  },
  {
    "id": "iii-great-steering",
    "game": "gta-iii",
    "category": "veiculos",
    "names": {
      "pt-br": "Direção melhorada",
      "en": "Great steering",
      "es": "Mejor conducción",
      zh: "Great steering",
    },
    "codes": {
      "pc": "CORNERSLIKEMAD"
    },
    "keywords": {
      "pt-br": [
        "carro",
        "direção",
        "Direção melhorada",
        "CORNERSLIKEMAD"
      ],
      "en": [
        "carro",
        "direção",
        "Great steering",
        "CORNERSLIKEMAD"
      ],
      "es": [
        "carro",
        "direção",
        "Mejor conducción",
        "CORNERSLIKEMAD"
      ],
      zh: [
        "carro",
        "direção",
        "Great steering",
        "CORNERSLIKEMAD"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA3.com - PC Version Cheats",
        "url": "https://www.gta3.com/pc-cheats/"
      }
    ]
  },
  {
    "id": "iii-detachable-limbs",
    "game": "gta-iii",
    "category": "mundo",
    "names": {
      "pt-br": "Membros destacáveis",
      "en": "Detachable limbs",
      "es": "Extremidades desprendibles",
      zh: "Detachable limbs",
    },
    "codes": {
      "pc": "NASTYLIMBSCHEAT"
    },
    "keywords": {
      "pt-br": [
        "membros",
        "gore",
        "Membros destacáveis",
        "NASTYLIMBSCHEAT"
      ],
      "en": [
        "membros",
        "gore",
        "Detachable limbs",
        "NASTYLIMBSCHEAT"
      ],
      "es": [
        "membros",
        "gore",
        "Extremidades desprendibles",
        "NASTYLIMBSCHEAT"
      ],
      zh: [
        "membros",
        "gore",
        "Detachable limbs",
        "NASTYLIMBSCHEAT"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA3.com - PC Version Cheats",
        "url": "https://www.gta3.com/pc-cheats/"
      }
    ],
    "note": "GTA3.com informa que isso já vem ativado por padrão no PC."
  },
  {
    "id": "iv-health-armor-ammo",
    "game": "gta-iv",
    "category": "vida-armadura",
    "names": {
      "pt-br": "Vida, armadura e munição",
      "en": "Health, armor and ammo",
      "es": "Vida, armadura y munición",
      zh: "Health, armor and ammo",
    },
    "codes": {
      "phone": "482-555-0100"
    },
    "keywords": {
      "pt-br": [
        "vida",
        "armadura",
        "munição",
        "Vida, armadura e munição",
        "482-555-0100"
      ],
      "en": [
        "vida",
        "armadura",
        "munição",
        "Health, armor and ammo",
        "482-555-0100"
      ],
      "es": [
        "vida",
        "armadura",
        "munição",
        "Vida, armadura y munición",
        "482-555-0100"
      ],
      zh: [
        "vida",
        "armadura",
        "munição",
        "Health, armor and ammo",
        "482-555-0100"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Wiki - Cheats in GTA IV",
        "url": "https://gta.fandom.com/wiki/Cheats_in_GTA_IV"
      }
    ]
  },
  {
    "id": "iv-health-armor",
    "game": "gta-iv",
    "category": "vida-armadura",
    "names": {
      "pt-br": "Vida e armadura",
      "en": "Health and armor",
      "es": "Vida y armadura",
      zh: "Health and armor",
    },
    "codes": {
      "phone": "362-555-0100"
    },
    "keywords": {
      "pt-br": [
        "vida",
        "armadura",
        "Vida e armadura",
        "362-555-0100"
      ],
      "en": [
        "vida",
        "armadura",
        "Health and armor",
        "362-555-0100"
      ],
      "es": [
        "vida",
        "armadura",
        "Vida y armadura",
        "362-555-0100"
      ],
      zh: [
        "vida",
        "armadura",
        "Health and armor",
        "362-555-0100"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Wiki - Cheats in GTA IV",
        "url": "https://gta.fandom.com/wiki/Cheats_in_GTA_IV"
      }
    ]
  },
  {
    "id": "iv-weapons-1",
    "game": "gta-iv",
    "category": "armas",
    "names": {
      "pt-br": "Armas pacote 1",
      "en": "Weapons pack 1",
      "es": "Armas paquete 1",
      zh: "Weapons pack 1",
    },
    "codes": {
      "phone": "486-555-0150"
    },
    "keywords": {
      "pt-br": [
        "armas",
        "Armas pacote 1",
        "486-555-0150"
      ],
      "en": [
        "armas",
        "Weapons pack 1",
        "486-555-0150"
      ],
      "es": [
        "armas",
        "Armas paquete 1",
        "486-555-0150"
      ],
      zh: [
        "armas",
        "Weapons pack 1",
        "486-555-0150"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Wiki - Cheats in GTA IV",
        "url": "https://gta.fandom.com/wiki/Cheats_in_GTA_IV"
      }
    ]
  },
  {
    "id": "iv-weapons-2",
    "game": "gta-iv",
    "category": "armas",
    "names": {
      "pt-br": "Armas pacote 2",
      "en": "Weapons pack 2",
      "es": "Armas paquete 2",
      zh: "Weapons pack 2",
    },
    "codes": {
      "phone": "486-555-0100"
    },
    "keywords": {
      "pt-br": [
        "armas",
        "Armas pacote 2",
        "486-555-0100"
      ],
      "en": [
        "armas",
        "Weapons pack 2",
        "486-555-0100"
      ],
      "es": [
        "armas",
        "Armas paquete 2",
        "486-555-0100"
      ],
      zh: [
        "armas",
        "Weapons pack 2",
        "486-555-0100"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Wiki - Cheats in GTA IV",
        "url": "https://gta.fandom.com/wiki/Cheats_in_GTA_IV"
      }
    ]
  },
  {
    "id": "iv-remove-wanted",
    "game": "gta-iv",
    "category": "policia",
    "names": {
      "pt-br": "Remover procurado",
      "en": "Remove wanted level",
      "es": "Quitar búsqueda",
      zh: "Remove wanted level",
    },
    "codes": {
      "phone": "267-555-0100"
    },
    "keywords": {
      "pt-br": [
        "polícia",
        "tirar estrela",
        "Remover procurado",
        "267-555-0100"
      ],
      "en": [
        "polícia",
        "tirar estrela",
        "Remove wanted level",
        "267-555-0100"
      ],
      "es": [
        "polícia",
        "tirar estrela",
        "Quitar búsqueda",
        "267-555-0100"
      ],
      zh: [
        "polícia",
        "tirar estrela",
        "Remove wanted level",
        "267-555-0100"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Wiki - Cheats in GTA IV",
        "url": "https://gta.fandom.com/wiki/Cheats_in_GTA_IV"
      }
    ]
  },
  {
    "id": "iv-raise-wanted",
    "game": "gta-iv",
    "category": "policia",
    "names": {
      "pt-br": "Aumentar procurado",
      "en": "Raise wanted level",
      "es": "Subir búsqueda",
      zh: "Raise wanted level",
    },
    "codes": {
      "phone": "267-555-0150"
    },
    "keywords": {
      "pt-br": [
        "polícia",
        "estrela",
        "Aumentar procurado",
        "267-555-0150"
      ],
      "en": [
        "polícia",
        "estrela",
        "Raise wanted level",
        "267-555-0150"
      ],
      "es": [
        "polícia",
        "estrela",
        "Subir búsqueda",
        "267-555-0150"
      ],
      zh: [
        "polícia",
        "estrela",
        "Raise wanted level",
        "267-555-0150"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Wiki - Cheats in GTA IV",
        "url": "https://gta.fandom.com/wiki/Cheats_in_GTA_IV"
      }
    ]
  },
  {
    "id": "iv-weather",
    "game": "gta-iv",
    "category": "clima",
    "names": {
      "pt-br": "Mudar clima e hora",
      "en": "Change weather/time",
      "es": "Cambiar clima/hora",
      zh: "Change weather/time",
    },
    "codes": {
      "phone": "468-555-0100"
    },
    "keywords": {
      "pt-br": [
        "clima",
        "hora",
        "Mudar clima e hora",
        "468-555-0100"
      ],
      "en": [
        "clima",
        "hora",
        "Change weather/time",
        "468-555-0100"
      ],
      "es": [
        "clima",
        "hora",
        "Cambiar clima/hora",
        "468-555-0100"
      ],
      zh: [
        "clima",
        "hora",
        "Change weather/time",
        "468-555-0100"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Wiki - Cheats in GTA IV",
        "url": "https://gta.fandom.com/wiki/Cheats_in_GTA_IV"
      }
    ]
  },
  {
    "id": "iv-song-info",
    "game": "gta-iv",
    "category": "musica",
    "names": {
      "pt-br": "Informação da música",
      "en": "Song information",
      "es": "Información de canción",
      zh: "Song information",
    },
    "codes": {
      "phone": "948-555-0100"
    },
    "keywords": {
      "pt-br": [
        "música",
        "rádio",
        "Informação da música",
        "948-555-0100"
      ],
      "en": [
        "música",
        "rádio",
        "Song information",
        "948-555-0100"
      ],
      "es": [
        "música",
        "rádio",
        "Información de canción",
        "948-555-0100"
      ],
      zh: [
        "música",
        "rádio",
        "Song information",
        "948-555-0100"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Wiki - Cheats in GTA IV",
        "url": "https://gta.fandom.com/wiki/Cheats_in_GTA_IV"
      }
    ]
  },
  {
    "id": "iv-spawn-annihilator",
    "game": "gta-iv",
    "category": "spawn-veiculos",
    "names": {
      "pt-br": "Spawn Annihilator helicóptero",
      "en": "Spawn Annihilator helicopter",
      "es": "Generar helicóptero Annihilator",
      zh: "Spawn Annihilator helicopter",
    },
    "codes": {
      "phone": "359-555-0100"
    },
    "keywords": {
      "pt-br": [
        "helicóptero",
        "annihilator",
        "Spawn Annihilator helicóptero",
        "359-555-0100"
      ],
      "en": [
        "helicóptero",
        "annihilator",
        "Spawn Annihilator helicopter",
        "359-555-0100"
      ],
      "es": [
        "helicóptero",
        "annihilator",
        "Generar helicóptero Annihilator",
        "359-555-0100"
      ],
      zh: [
        "helicóptero",
        "annihilator",
        "Spawn Annihilator helicopter",
        "359-555-0100"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Wiki - Cheats in GTA IV",
        "url": "https://gta.fandom.com/wiki/Cheats_in_GTA_IV"
      }
    ]
  },
  {
    "id": "iv-spawn-jetmax",
    "game": "gta-iv",
    "category": "spawn-veiculos",
    "names": {
      "pt-br": "Spawn Jetmax barco",
      "en": "Spawn Jetmax boat",
      "es": "Generar barco Jetmax",
      zh: "Spawn Jetmax boat",
    },
    "codes": {
      "phone": "938-555-0100"
    },
    "keywords": {
      "pt-br": [
        "barco",
        "jetmax",
        "Spawn Jetmax barco",
        "938-555-0100"
      ],
      "en": [
        "barco",
        "jetmax",
        "Spawn Jetmax boat",
        "938-555-0100"
      ],
      "es": [
        "barco",
        "jetmax",
        "Generar barco Jetmax",
        "938-555-0100"
      ],
      zh: [
        "barco",
        "jetmax",
        "Spawn Jetmax boat",
        "938-555-0100"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Wiki - Cheats in GTA IV",
        "url": "https://gta.fandom.com/wiki/Cheats_in_GTA_IV"
      }
    ]
  },
  {
    "id": "iv-spawn-nrg900",
    "game": "gta-iv",
    "category": "spawn-veiculos",
    "names": {
      "pt-br": "Spawn NRG-900 moto",
      "en": "Spawn NRG-900 bike",
      "es": "Generar moto NRG-900",
      zh: "Spawn NRG-900 bike",
    },
    "codes": {
      "phone": "625-555-0100"
    },
    "keywords": {
      "pt-br": [
        "moto",
        "nrg",
        "Spawn NRG-900 moto",
        "625-555-0100"
      ],
      "en": [
        "moto",
        "nrg",
        "Spawn NRG-900 bike",
        "625-555-0100"
      ],
      "es": [
        "moto",
        "nrg",
        "Generar moto NRG-900",
        "625-555-0100"
      ],
      zh: [
        "moto",
        "nrg",
        "Spawn NRG-900 bike",
        "625-555-0100"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Wiki - Cheats in GTA IV",
        "url": "https://gta.fandom.com/wiki/Cheats_in_GTA_IV"
      }
    ]
  },
  {
    "id": "iv-spawn-sanchez",
    "game": "gta-iv",
    "category": "spawn-veiculos",
    "names": {
      "pt-br": "Spawn Sanchez moto",
      "en": "Spawn Sanchez bike",
      "es": "Generar moto Sanchez",
      zh: "Spawn Sanchez bike",
    },
    "codes": {
      "phone": "625-555-0150"
    },
    "keywords": {
      "pt-br": [
        "moto",
        "sanchez",
        "Spawn Sanchez moto",
        "625-555-0150"
      ],
      "en": [
        "moto",
        "sanchez",
        "Spawn Sanchez bike",
        "625-555-0150"
      ],
      "es": [
        "moto",
        "sanchez",
        "Generar moto Sanchez",
        "625-555-0150"
      ],
      zh: [
        "moto",
        "sanchez",
        "Spawn Sanchez bike",
        "625-555-0150"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Wiki - Cheats in GTA IV",
        "url": "https://gta.fandom.com/wiki/Cheats_in_GTA_IV"
      }
    ]
  },
  {
    "id": "iv-spawn-cognoscenti",
    "game": "gta-iv",
    "category": "spawn-veiculos",
    "names": {
      "pt-br": "Spawn Cognoscenti",
      "en": "Spawn Cognoscenti",
      "es": "Generar Cognoscenti",
      zh: "Spawn Cognoscenti",
    },
    "codes": {
      "phone": "227-555-0142"
    },
    "keywords": {
      "pt-br": [
        "carro",
        "cognoscenti",
        "Spawn Cognoscenti",
        "227-555-0142"
      ],
      "en": [
        "carro",
        "cognoscenti",
        "Spawn Cognoscenti",
        "227-555-0142"
      ],
      "es": [
        "carro",
        "cognoscenti",
        "Generar Cognoscenti",
        "227-555-0142"
      ],
      zh: [
        "carro",
        "cognoscenti",
        "Spawn Cognoscenti",
        "227-555-0142"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Wiki - Cheats in GTA IV",
        "url": "https://gta.fandom.com/wiki/Cheats_in_GTA_IV"
      }
    ]
  },
  {
    "id": "iv-spawn-comet",
    "game": "gta-iv",
    "category": "spawn-veiculos",
    "names": {
      "pt-br": "Spawn Comet",
      "en": "Spawn Comet",
      "es": "Generar Comet",
      zh: "Spawn Comet",
    },
    "codes": {
      "phone": "227-555-0175"
    },
    "keywords": {
      "pt-br": [
        "carro",
        "comet",
        "Spawn Comet",
        "227-555-0175"
      ],
      "en": [
        "carro",
        "comet",
        "Spawn Comet",
        "227-555-0175"
      ],
      "es": [
        "carro",
        "comet",
        "Generar Comet",
        "227-555-0175"
      ],
      zh: [
        "carro",
        "comet",
        "Spawn Comet",
        "227-555-0175"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Wiki - Cheats in GTA IV",
        "url": "https://gta.fandom.com/wiki/Cheats_in_GTA_IV"
      }
    ]
  },
  {
    "id": "iv-spawn-supergt",
    "game": "gta-iv",
    "category": "spawn-veiculos",
    "names": {
      "pt-br": "Spawn SuperGT",
      "en": "Spawn SuperGT",
      "es": "Generar SuperGT",
      zh: "Spawn SuperGT",
    },
    "codes": {
      "phone": "227-555-0168"
    },
    "keywords": {
      "pt-br": [
        "carro",
        "supergt",
        "Spawn SuperGT",
        "227-555-0168"
      ],
      "en": [
        "carro",
        "supergt",
        "Spawn SuperGT",
        "227-555-0168"
      ],
      "es": [
        "carro",
        "supergt",
        "Generar SuperGT",
        "227-555-0168"
      ],
      zh: [
        "carro",
        "supergt",
        "Spawn SuperGT",
        "227-555-0168"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Wiki - Cheats in GTA IV",
        "url": "https://gta.fandom.com/wiki/Cheats_in_GTA_IV"
      }
    ]
  },
  {
    "id": "iv-spawn-turismo",
    "game": "gta-iv",
    "category": "spawn-veiculos",
    "names": {
      "pt-br": "Spawn Turismo",
      "en": "Spawn Turismo",
      "es": "Generar Turismo",
      zh: "Spawn Turismo",
    },
    "codes": {
      "phone": "227-555-0147"
    },
    "keywords": {
      "pt-br": [
        "carro",
        "turismo",
        "Spawn Turismo",
        "227-555-0147"
      ],
      "en": [
        "carro",
        "turismo",
        "Spawn Turismo",
        "227-555-0147"
      ],
      "es": [
        "carro",
        "turismo",
        "Generar Turismo",
        "227-555-0147"
      ],
      zh: [
        "carro",
        "turismo",
        "Spawn Turismo",
        "227-555-0147"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Wiki - Cheats in GTA IV",
        "url": "https://gta.fandom.com/wiki/Cheats_in_GTA_IV"
      }
    ]
  },
  {
    "id": "iv-spawn-fib-buffalo",
    "game": "gta-iv",
    "category": "spawn-veiculos",
    "names": {
      "pt-br": "Spawn FIB Buffalo",
      "en": "Spawn FIB Buffalo",
      "es": "Generar FIB Buffalo",
      zh: "Spawn FIB Buffalo",
    },
    "codes": {
      "phone": "227-555-0100"
    },
    "keywords": {
      "pt-br": [
        "carro",
        "polícia",
        "fib",
        "Spawn FIB Buffalo",
        "227-555-0100"
      ],
      "en": [
        "carro",
        "polícia",
        "fib",
        "Spawn FIB Buffalo",
        "227-555-0100"
      ],
      "es": [
        "carro",
        "polícia",
        "fib",
        "Generar FIB Buffalo",
        "227-555-0100"
      ],
      zh: [
        "carro",
        "polícia",
        "fib",
        "Spawn FIB Buffalo",
        "227-555-0100"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Wiki - Cheats in GTA IV",
        "url": "https://gta.fandom.com/wiki/Cheats_in_GTA_IV"
      }
    ]
  },
  {
    "id": "iv-spawn-burrito",
    "game": "gta-iv",
    "category": "episodes",
    "names": {
      "pt-br": "Spawn Burrito (Episodes)",
      "en": "Spawn Burrito (Episodes)",
      "es": "Generar Burrito (Episodes)",
      zh: "Spawn Burrito (Episodes)",
    },
    "codes": {
      "phone": "826-555-0150"
    },
    "keywords": {
      "pt-br": [
        "van",
        "burrito",
        "episodes",
        "Spawn Burrito (Episodes)",
        "826-555-0150"
      ],
      "en": [
        "van",
        "burrito",
        "episodes",
        "Spawn Burrito (Episodes)",
        "826-555-0150"
      ],
      "es": [
        "van",
        "burrito",
        "episodes",
        "Generar Burrito (Episodes)",
        "826-555-0150"
      ],
      zh: [
        "van",
        "burrito",
        "episodes",
        "Spawn Burrito (Episodes)",
        "826-555-0150"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Wiki - Cheats in GTA IV",
        "url": "https://gta.fandom.com/wiki/Cheats_in_GTA_IV"
      }
    ],
    "note": "The Lost and Damned / Episodes from Liberty City."
  },
  {
    "id": "iv-spawn-double-t",
    "game": "gta-iv",
    "category": "episodes",
    "names": {
      "pt-br": "Spawn Double T (Episodes)",
      "en": "Spawn Double T (Episodes)",
      "es": "Generar Double T (Episodes)",
      zh: "Spawn Double T (Episodes)",
    },
    "codes": {
      "phone": "245-555-0125"
    },
    "keywords": {
      "pt-br": [
        "moto",
        "double t",
        "episodes",
        "Spawn Double T (Episodes)",
        "245-555-0125"
      ],
      "en": [
        "moto",
        "double t",
        "episodes",
        "Spawn Double T (Episodes)",
        "245-555-0125"
      ],
      "es": [
        "moto",
        "double t",
        "episodes",
        "Generar Double T (Episodes)",
        "245-555-0125"
      ],
      zh: [
        "moto",
        "double t",
        "episodes",
        "Spawn Double T (Episodes)",
        "245-555-0125"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Wiki - Cheats in GTA IV",
        "url": "https://gta.fandom.com/wiki/Cheats_in_GTA_IV"
      }
    ],
    "note": "The Lost and Damned / Episodes from Liberty City."
  },
  {
    "id": "iv-spawn-hakuchou",
    "game": "gta-iv",
    "category": "episodes",
    "names": {
      "pt-br": "Spawn Hakuchou (Episodes)",
      "en": "Spawn Hakuchou (Episodes)",
      "es": "Generar Hakuchou (Episodes)",
      zh: "Spawn Hakuchou (Episodes)",
    },
    "codes": {
      "phone": "245-555-0199"
    },
    "keywords": {
      "pt-br": [
        "moto",
        "hakuchou",
        "episodes",
        "Spawn Hakuchou (Episodes)",
        "245-555-0199"
      ],
      "en": [
        "moto",
        "hakuchou",
        "episodes",
        "Spawn Hakuchou (Episodes)",
        "245-555-0199"
      ],
      "es": [
        "moto",
        "hakuchou",
        "episodes",
        "Generar Hakuchou (Episodes)",
        "245-555-0199"
      ],
      zh: [
        "moto",
        "hakuchou",
        "episodes",
        "Spawn Hakuchou (Episodes)",
        "245-555-0199"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Wiki - Cheats in GTA IV",
        "url": "https://gta.fandom.com/wiki/Cheats_in_GTA_IV"
      }
    ],
    "note": "The Lost and Damned / Episodes from Liberty City."
  },
  {
    "id": "iv-spawn-hexer",
    "game": "gta-iv",
    "category": "episodes",
    "names": {
      "pt-br": "Spawn Hexer (Episodes)",
      "en": "Spawn Hexer (Episodes)",
      "es": "Generar Hexer (Episodes)",
      zh: "Spawn Hexer (Episodes)",
    },
    "codes": {
      "phone": "245-555-0150"
    },
    "keywords": {
      "pt-br": [
        "moto",
        "hexer",
        "episodes",
        "Spawn Hexer (Episodes)",
        "245-555-0150"
      ],
      "en": [
        "moto",
        "hexer",
        "episodes",
        "Spawn Hexer (Episodes)",
        "245-555-0150"
      ],
      "es": [
        "moto",
        "hexer",
        "episodes",
        "Generar Hexer (Episodes)",
        "245-555-0150"
      ],
      zh: [
        "moto",
        "hexer",
        "episodes",
        "Spawn Hexer (Episodes)",
        "245-555-0150"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Wiki - Cheats in GTA IV",
        "url": "https://gta.fandom.com/wiki/Cheats_in_GTA_IV"
      }
    ],
    "note": "The Lost and Damned / Episodes from Liberty City."
  },
  {
    "id": "iv-spawn-innovation",
    "game": "gta-iv",
    "category": "episodes",
    "names": {
      "pt-br": "Spawn Innovation (Episodes)",
      "en": "Spawn Innovation (Episodes)",
      "es": "Generar Innovation (Episodes)",
      zh: "Spawn Innovation (Episodes)",
    },
    "codes": {
      "phone": "245-555-0100"
    },
    "keywords": {
      "pt-br": [
        "moto",
        "innovation",
        "episodes",
        "Spawn Innovation (Episodes)",
        "245-555-0100"
      ],
      "en": [
        "moto",
        "innovation",
        "episodes",
        "Spawn Innovation (Episodes)",
        "245-555-0100"
      ],
      "es": [
        "moto",
        "innovation",
        "episodes",
        "Generar Innovation (Episodes)",
        "245-555-0100"
      ],
      zh: [
        "moto",
        "innovation",
        "episodes",
        "Spawn Innovation (Episodes)",
        "245-555-0100"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Wiki - Cheats in GTA IV",
        "url": "https://gta.fandom.com/wiki/Cheats_in_GTA_IV"
      }
    ],
    "note": "The Lost and Damned / Episodes from Liberty City."
  },
  {
    "id": "iv-spawn-slamvan",
    "game": "gta-iv",
    "category": "episodes",
    "names": {
      "pt-br": "Spawn Slamvan (Episodes)",
      "en": "Spawn Slamvan (Episodes)",
      "es": "Generar Slamvan (Episodes)",
      zh: "Spawn Slamvan (Episodes)",
    },
    "codes": {
      "phone": "826-555-0100"
    },
    "keywords": {
      "pt-br": [
        "carro",
        "slamvan",
        "episodes",
        "Spawn Slamvan (Episodes)",
        "826-555-0100"
      ],
      "en": [
        "carro",
        "slamvan",
        "episodes",
        "Spawn Slamvan (Episodes)",
        "826-555-0100"
      ],
      "es": [
        "carro",
        "slamvan",
        "episodes",
        "Generar Slamvan (Episodes)",
        "826-555-0100"
      ],
      zh: [
        "carro",
        "slamvan",
        "episodes",
        "Spawn Slamvan (Episodes)",
        "826-555-0100"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Wiki - Cheats in GTA IV",
        "url": "https://gta.fandom.com/wiki/Cheats_in_GTA_IV"
      }
    ],
    "note": "The Lost and Damned / Episodes from Liberty City."
  },
  {
    "id": "iv-spawn-bullet-gt",
    "game": "gta-iv",
    "category": "episodes",
    "names": {
      "pt-br": "Spawn Bullet GT (TBoGT)",
      "en": "Spawn Bullet GT (TBoGT)",
      "es": "Generar Bullet GT (TBoGT)",
      zh: "Spawn Bullet GT (TBoGT)",
    },
    "codes": {
      "phone": "227-555-9666"
    },
    "keywords": {
      "pt-br": [
        "carro",
        "bullet gt",
        "episodes",
        "Spawn Bullet GT (TBoGT)",
        "227-555-9666"
      ],
      "en": [
        "carro",
        "bullet gt",
        "episodes",
        "Spawn Bullet GT (TBoGT)",
        "227-555-9666"
      ],
      "es": [
        "carro",
        "bullet gt",
        "episodes",
        "Generar Bullet GT (TBoGT)",
        "227-555-9666"
      ],
      zh: [
        "carro",
        "bullet gt",
        "episodes",
        "Spawn Bullet GT (TBoGT)",
        "227-555-9666"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Wiki - Cheats in GTA IV",
        "url": "https://gta.fandom.com/wiki/Cheats_in_GTA_IV"
      }
    ],
    "note": "The Ballad of Gay Tony."
  },
  {
    "id": "iv-spawn-apc",
    "game": "gta-iv",
    "category": "episodes",
    "names": {
      "pt-br": "Spawn APC tanque (TBoGT)",
      "en": "Spawn APC tank (TBoGT)",
      "es": "Generar tanque APC (TBoGT)",
      zh: "Spawn APC tank (TBoGT)",
    },
    "codes": {
      "phone": "272-555-8265"
    },
    "keywords": {
      "pt-br": [
        "tanque",
        "apc",
        "episodes",
        "Spawn APC tanque (TBoGT)",
        "272-555-8265"
      ],
      "en": [
        "tanque",
        "apc",
        "episodes",
        "Spawn APC tank (TBoGT)",
        "272-555-8265"
      ],
      "es": [
        "tanque",
        "apc",
        "episodes",
        "Generar tanque APC (TBoGT)",
        "272-555-8265"
      ],
      zh: [
        "tanque",
        "apc",
        "episodes",
        "Spawn APC tank (TBoGT)",
        "272-555-8265"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Wiki - Cheats in GTA IV",
        "url": "https://gta.fandom.com/wiki/Cheats_in_GTA_IV"
      }
    ],
    "note": "The Ballad of Gay Tony."
  },
  {
    "id": "iv-explosive-punches",
    "game": "gta-iv",
    "category": "episodes",
    "names": {
      "pt-br": "Soco explosivo do Luis (TBoGT)",
      "en": "Luis explosive punches (TBoGT)",
      "es": "Puñetazos explosivos de Luis (TBoGT)",
      zh: "Luis explosive punches (TBoGT)",
    },
    "codes": {
      "phone": "276-555-2666"
    },
    "keywords": {
      "pt-br": [
        "soco",
        "explosivo",
        "episodes",
        "Soco explosivo do Luis (TBoGT)",
        "276-555-2666"
      ],
      "en": [
        "soco",
        "explosivo",
        "episodes",
        "Luis explosive punches (TBoGT)",
        "276-555-2666"
      ],
      "es": [
        "soco",
        "explosivo",
        "episodes",
        "Puñetazos explosivos de Luis (TBoGT)",
        "276-555-2666"
      ],
      zh: [
        "soco",
        "explosivo",
        "episodes",
        "Luis explosive punches (TBoGT)",
        "276-555-2666"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Wiki - Cheats in GTA IV",
        "url": "https://gta.fandom.com/wiki/Cheats_in_GTA_IV"
      }
    ],
    "note": "The Ballad of Gay Tony."
  },
  {
    "id": "iv-spawn-buzzard",
    "game": "gta-iv",
    "category": "episodes",
    "names": {
      "pt-br": "Spawn Buzzard helicóptero (TBoGT)",
      "en": "Spawn Buzzard helicopter (TBoGT)",
      "es": "Generar helicóptero Buzzard (TBoGT)",
      zh: "Spawn Buzzard helicopter (TBoGT)",
    },
    "codes": {
      "phone": "359-555-2899"
    },
    "keywords": {
      "pt-br": [
        "helicóptero",
        "buzzard",
        "episodes",
        "Spawn Buzzard helicóptero (TBoGT)",
        "359-555-2899"
      ],
      "en": [
        "helicóptero",
        "buzzard",
        "episodes",
        "Spawn Buzzard helicopter (TBoGT)",
        "359-555-2899"
      ],
      "es": [
        "helicóptero",
        "buzzard",
        "episodes",
        "Generar helicóptero Buzzard (TBoGT)",
        "359-555-2899"
      ],
      zh: [
        "helicóptero",
        "buzzard",
        "episodes",
        "Spawn Buzzard helicopter (TBoGT)",
        "359-555-2899"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Wiki - Cheats in GTA IV",
        "url": "https://gta.fandom.com/wiki/Cheats_in_GTA_IV"
      }
    ],
    "note": "The Ballad of Gay Tony."
  },
  {
    "id": "iv-parachute",
    "game": "gta-iv",
    "category": "episodes",
    "names": {
      "pt-br": "Paraquedas (TBoGT)",
      "en": "Parachute (TBoGT)",
      "es": "Paracaídas (TBoGT)",
      zh: "Parachute (TBoGT)",
    },
    "codes": {
      "phone": "359-555-7272"
    },
    "keywords": {
      "pt-br": [
        "paraquedas",
        "episodes",
        "Paraquedas (TBoGT)",
        "359-555-7272"
      ],
      "en": [
        "paraquedas",
        "episodes",
        "Parachute (TBoGT)",
        "359-555-7272"
      ],
      "es": [
        "paraquedas",
        "episodes",
        "Paracaídas (TBoGT)",
        "359-555-7272"
      ],
      zh: [
        "paraquedas",
        "episodes",
        "Parachute (TBoGT)",
        "359-555-7272"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Wiki - Cheats in GTA IV",
        "url": "https://gta.fandom.com/wiki/Cheats_in_GTA_IV"
      }
    ],
    "note": "The Ballad of Gay Tony."
  },
  {
    "id": "iv-explosive-sniper",
    "game": "gta-iv",
    "category": "episodes",
    "names": {
      "pt-br": "Balas explosivas de sniper (TBoGT)",
      "en": "Explosive sniper rounds (TBoGT)",
      "es": "Balas explosivas de francotirador (TBoGT)",
      zh: "Explosive sniper rounds (TBoGT)",
    },
    "codes": {
      "phone": "486-555-2526"
    },
    "keywords": {
      "pt-br": [
        "sniper",
        "explosivo",
        "episodes",
        "Balas explosivas de sniper (TBoGT)",
        "486-555-2526"
      ],
      "en": [
        "sniper",
        "explosivo",
        "episodes",
        "Explosive sniper rounds (TBoGT)",
        "486-555-2526"
      ],
      "es": [
        "sniper",
        "explosivo",
        "episodes",
        "Balas explosivas de francotirador (TBoGT)",
        "486-555-2526"
      ],
      zh: [
        "sniper",
        "explosivo",
        "episodes",
        "Explosive sniper rounds (TBoGT)",
        "486-555-2526"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Wiki - Cheats in GTA IV",
        "url": "https://gta.fandom.com/wiki/Cheats_in_GTA_IV"
      }
    ],
    "note": "The Ballad of Gay Tony."
  },
  {
    "id": "iv-spawn-akuma",
    "game": "gta-iv",
    "category": "episodes",
    "names": {
      "pt-br": "Spawn Akuma moto (TBoGT)",
      "en": "Spawn Akuma bike (TBoGT)",
      "es": "Generar moto Akuma (TBoGT)",
      zh: "Spawn Akuma bike (TBoGT)",
    },
    "codes": {
      "phone": "625-555-0200"
    },
    "keywords": {
      "pt-br": [
        "moto",
        "akuma",
        "episodes",
        "Spawn Akuma moto (TBoGT)",
        "625-555-0200"
      ],
      "en": [
        "moto",
        "akuma",
        "episodes",
        "Spawn Akuma bike (TBoGT)",
        "625-555-0200"
      ],
      "es": [
        "moto",
        "akuma",
        "episodes",
        "Generar moto Akuma (TBoGT)",
        "625-555-0200"
      ],
      zh: [
        "moto",
        "akuma",
        "episodes",
        "Spawn Akuma bike (TBoGT)",
        "625-555-0200"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Wiki - Cheats in GTA IV",
        "url": "https://gta.fandom.com/wiki/Cheats_in_GTA_IV"
      }
    ],
    "note": "The Ballad of Gay Tony."
  },
  {
    "id": "iv-spawn-vader",
    "game": "gta-iv",
    "category": "episodes",
    "names": {
      "pt-br": "Spawn Vader moto (TBoGT)",
      "en": "Spawn Vader bike (TBoGT)",
      "es": "Generar moto Vader (TBoGT)",
      zh: "Spawn Vader bike (TBoGT)",
    },
    "codes": {
      "phone": "625-555-3273"
    },
    "keywords": {
      "pt-br": [
        "moto",
        "vader",
        "episodes",
        "Spawn Vader moto (TBoGT)",
        "625-555-3273"
      ],
      "en": [
        "moto",
        "vader",
        "episodes",
        "Spawn Vader bike (TBoGT)",
        "625-555-3273"
      ],
      "es": [
        "moto",
        "vader",
        "episodes",
        "Generar moto Vader (TBoGT)",
        "625-555-3273"
      ],
      zh: [
        "moto",
        "vader",
        "episodes",
        "Spawn Vader bike (TBoGT)",
        "625-555-3273"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Wiki - Cheats in GTA IV",
        "url": "https://gta.fandom.com/wiki/Cheats_in_GTA_IV"
      }
    ],
    "note": "The Ballad of Gay Tony."
  },
  {
    "id": "iv-spawn-floater",
    "game": "gta-iv",
    "category": "episodes",
    "names": {
      "pt-br": "Spawn Floater barco (TBoGT)",
      "en": "Spawn Floater boat (TBoGT)",
      "es": "Generar barco Floater (TBoGT)",
      zh: "Spawn Floater boat (TBoGT)",
    },
    "codes": {
      "phone": "938-555-0150"
    },
    "keywords": {
      "pt-br": [
        "barco",
        "floater",
        "episodes",
        "Spawn Floater barco (TBoGT)",
        "938-555-0150"
      ],
      "en": [
        "barco",
        "floater",
        "episodes",
        "Spawn Floater boat (TBoGT)",
        "938-555-0150"
      ],
      "es": [
        "barco",
        "floater",
        "episodes",
        "Generar barco Floater (TBoGT)",
        "938-555-0150"
      ],
      zh: [
        "barco",
        "floater",
        "episodes",
        "Spawn Floater boat (TBoGT)",
        "938-555-0150"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": false,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Wiki - Cheats in GTA IV",
        "url": "https://gta.fandom.com/wiki/Cheats_in_GTA_IV"
      }
    ],
    "note": "The Ballad of Gay Tony."
  },
  {
    "id": "v-invincibility",
    "game": "gta-v",
    "category": "vida-armadura",
    "names": {
      "pt-br": "Invencibilidade por 5 minutos",
      "en": "Invincibility for 5 minutes",
      "es": "Invencibilidad por 5 minutos",
      zh: "Invincibility for 5 minutes",
    },
    "codes": {
      "pc": "PAINKILLER",
      "phone": "1-999-724-654-5537 / 1-999-PAINKILLER"
    },
    "keywords": {
      "pt-br": [
        "vida",
        "invencível",
        "god mode",
        "Invencibilidade por 5 minutos",
        "PAINKILLER",
        "1-999-724-654-5537 / 1-999-PAINKILLER"
      ],
      "en": [
        "vida",
        "invencível",
        "god mode",
        "Invincibility for 5 minutes",
        "PAINKILLER",
        "1-999-724-654-5537 / 1-999-PAINKILLER"
      ],
      "es": [
        "vida",
        "invencível",
        "god mode",
        "Invencibilidad por 5 minutos",
        "PAINKILLER",
        "1-999-724-654-5537 / 1-999-PAINKILLER"
      ],
      zh: [
        "vida",
        "invencível",
        "god mode",
        "Invincibility for 5 minutes",
        "PAINKILLER",
        "1-999-724-654-5537 / 1-999-PAINKILLER"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": true,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Boom - GTA 5 cheats",
        "url": "https://www.gtaboom.com/every-gta-5-cheat-console-code-and-phone-number-0740"
      }
    ],
    "note": "Dura cerca de 5 minutos; não funciona no GTA Online."
  },
  {
    "id": "v-health-armor",
    "game": "gta-v",
    "category": "vida-armadura",
    "names": {
      "pt-br": "Vida e armadura no máximo",
      "en": "Max health and armor",
      "es": "Vida y armadura al máximo",
      zh: "Max health and armor",
    },
    "codes": {
      "pc": "TURTLE",
      "phone": "1-999-887-853 / 1-999-TURTLE"
    },
    "keywords": {
      "pt-br": [
        "vida",
        "armadura",
        "cura",
        "Vida e armadura no máximo",
        "TURTLE",
        "1-999-887-853 / 1-999-TURTLE"
      ],
      "en": [
        "vida",
        "armadura",
        "cura",
        "Max health and armor",
        "TURTLE",
        "1-999-887-853 / 1-999-TURTLE"
      ],
      "es": [
        "vida",
        "armadura",
        "cura",
        "Vida y armadura al máximo",
        "TURTLE",
        "1-999-887-853 / 1-999-TURTLE"
      ],
      zh: [
        "vida",
        "armadura",
        "cura",
        "Max health and armor",
        "TURTLE",
        "1-999-887-853 / 1-999-TURTLE"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": true,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Boom - GTA 5 cheats",
        "url": "https://www.gtaboom.com/every-gta-5-cheat-console-code-and-phone-number-0740"
      }
    ]
  },
  {
    "id": "v-recharge-ability",
    "game": "gta-v",
    "category": "habilidade",
    "names": {
      "pt-br": "Recarregar habilidade especial",
      "en": "Recharge special ability",
      "es": "Recargar habilidad especial",
      zh: "Recharge special ability",
    },
    "codes": {
      "pc": "POWERUP",
      "phone": "1-999-769-3787 / 1-999-POWERUP"
    },
    "keywords": {
      "pt-br": [
        "habilidade",
        "especial",
        "Recarregar habilidade especial",
        "POWERUP",
        "1-999-769-3787 / 1-999-POWERUP"
      ],
      "en": [
        "habilidade",
        "especial",
        "Recharge special ability",
        "POWERUP",
        "1-999-769-3787 / 1-999-POWERUP"
      ],
      "es": [
        "habilidade",
        "especial",
        "Recargar habilidad especial",
        "POWERUP",
        "1-999-769-3787 / 1-999-POWERUP"
      ],
      zh: [
        "habilidade",
        "especial",
        "Recharge special ability",
        "POWERUP",
        "1-999-769-3787 / 1-999-POWERUP"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": true,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Boom - GTA 5 cheats",
        "url": "https://www.gtaboom.com/every-gta-5-cheat-console-code-and-phone-number-0740"
      }
    ]
  },
  {
    "id": "v-weapons",
    "game": "gta-v",
    "category": "armas",
    "names": {
      "pt-br": "Armas e munição",
      "en": "Weapons and ammo",
      "es": "Armas y munición",
      zh: "Weapons and ammo",
    },
    "codes": {
      "pc": "TOOLUP",
      "phone": "1-999-866-587 / 1-999-TOOLUP"
    },
    "keywords": {
      "pt-br": [
        "arma",
        "armas",
        "munição",
        "Armas e munição",
        "TOOLUP",
        "1-999-866-587 / 1-999-TOOLUP"
      ],
      "en": [
        "arma",
        "armas",
        "munição",
        "Weapons and ammo",
        "TOOLUP",
        "1-999-866-587 / 1-999-TOOLUP"
      ],
      "es": [
        "arma",
        "armas",
        "munição",
        "Armas y munición",
        "TOOLUP",
        "1-999-866-587 / 1-999-TOOLUP"
      ],
      zh: [
        "arma",
        "armas",
        "munição",
        "Weapons and ammo",
        "TOOLUP",
        "1-999-866-587 / 1-999-TOOLUP"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": true,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Boom - GTA 5 cheats",
        "url": "https://www.gtaboom.com/every-gta-5-cheat-console-code-and-phone-number-0740"
      }
    ]
  },
  {
    "id": "v-raise-wanted",
    "game": "gta-v",
    "category": "policia",
    "names": {
      "pt-br": "Aumentar procurado",
      "en": "Raise wanted level",
      "es": "Subir búsqueda",
      zh: "Raise wanted level",
    },
    "codes": {
      "pc": "FUGITIVE",
      "phone": "1-999-3844-8483 / 1-999-FUGITIVE"
    },
    "keywords": {
      "pt-br": [
        "polícia",
        "estrela",
        "Aumentar procurado",
        "FUGITIVE",
        "1-999-3844-8483 / 1-999-FUGITIVE"
      ],
      "en": [
        "polícia",
        "estrela",
        "Raise wanted level",
        "FUGITIVE",
        "1-999-3844-8483 / 1-999-FUGITIVE"
      ],
      "es": [
        "polícia",
        "estrela",
        "Subir búsqueda",
        "FUGITIVE",
        "1-999-3844-8483 / 1-999-FUGITIVE"
      ],
      zh: [
        "polícia",
        "estrela",
        "Raise wanted level",
        "FUGITIVE",
        "1-999-3844-8483 / 1-999-FUGITIVE"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": true,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Boom - GTA 5 cheats",
        "url": "https://www.gtaboom.com/every-gta-5-cheat-console-code-and-phone-number-0740"
      }
    ]
  },
  {
    "id": "v-lower-wanted",
    "game": "gta-v",
    "category": "policia",
    "names": {
      "pt-br": "Diminuir procurado",
      "en": "Lower wanted level",
      "es": "Bajar búsqueda",
      zh: "Lower wanted level",
    },
    "codes": {
      "pc": "LAWYERUP",
      "phone": "1-999-5299-3787 / 1-999-LAWYERUP"
    },
    "keywords": {
      "pt-br": [
        "polícia",
        "tirar estrela",
        "Diminuir procurado",
        "LAWYERUP",
        "1-999-5299-3787 / 1-999-LAWYERUP"
      ],
      "en": [
        "polícia",
        "tirar estrela",
        "Lower wanted level",
        "LAWYERUP",
        "1-999-5299-3787 / 1-999-LAWYERUP"
      ],
      "es": [
        "polícia",
        "tirar estrela",
        "Bajar búsqueda",
        "LAWYERUP",
        "1-999-5299-3787 / 1-999-LAWYERUP"
      ],
      zh: [
        "polícia",
        "tirar estrela",
        "Lower wanted level",
        "LAWYERUP",
        "1-999-5299-3787 / 1-999-LAWYERUP"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": true,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Boom - GTA 5 cheats",
        "url": "https://www.gtaboom.com/every-gta-5-cheat-console-code-and-phone-number-0740"
      }
    ]
  },
  {
    "id": "v-explosive-ammo",
    "game": "gta-v",
    "category": "combate",
    "names": {
      "pt-br": "Munição explosiva",
      "en": "Explosive ammo",
      "es": "Munición explosiva",
      zh: "Explosive ammo",
    },
    "codes": {
      "pc": "HIGHEX",
      "phone": "1-999-444-439 / 1-999-HIGHEX"
    },
    "keywords": {
      "pt-br": [
        "munição",
        "explosiva",
        "Munição explosiva",
        "HIGHEX",
        "1-999-444-439 / 1-999-HIGHEX"
      ],
      "en": [
        "munição",
        "explosiva",
        "Explosive ammo",
        "HIGHEX",
        "1-999-444-439 / 1-999-HIGHEX"
      ],
      "es": [
        "munição",
        "explosiva",
        "Munición explosiva",
        "HIGHEX",
        "1-999-444-439 / 1-999-HIGHEX"
      ],
      zh: [
        "munição",
        "explosiva",
        "Explosive ammo",
        "HIGHEX",
        "1-999-444-439 / 1-999-HIGHEX"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": true,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Boom - GTA 5 cheats",
        "url": "https://www.gtaboom.com/every-gta-5-cheat-console-code-and-phone-number-0740"
      }
    ]
  },
  {
    "id": "v-explosive-melee",
    "game": "gta-v",
    "category": "combate",
    "names": {
      "pt-br": "Ataques corpo a corpo explosivos",
      "en": "Explosive melee attacks",
      "es": "Ataques cuerpo a cuerpo explosivos",
      zh: "Explosive melee attacks",
    },
    "codes": {
      "pc": "HOTHANDS",
      "phone": "1-999-4684-2637 / 1-999-HOTHANDS"
    },
    "keywords": {
      "pt-br": [
        "soco",
        "explosivo",
        "melee",
        "Ataques corpo a corpo explosivos",
        "HOTHANDS",
        "1-999-4684-2637 / 1-999-HOTHANDS"
      ],
      "en": [
        "soco",
        "explosivo",
        "melee",
        "Explosive melee attacks",
        "HOTHANDS",
        "1-999-4684-2637 / 1-999-HOTHANDS"
      ],
      "es": [
        "soco",
        "explosivo",
        "melee",
        "Ataques cuerpo a cuerpo explosivos",
        "HOTHANDS",
        "1-999-4684-2637 / 1-999-HOTHANDS"
      ],
      zh: [
        "soco",
        "explosivo",
        "melee",
        "Explosive melee attacks",
        "HOTHANDS",
        "1-999-4684-2637 / 1-999-HOTHANDS"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": true,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Boom - GTA 5 cheats",
        "url": "https://www.gtaboom.com/every-gta-5-cheat-console-code-and-phone-number-0740"
      }
    ]
  },
  {
    "id": "v-flaming-bullets",
    "game": "gta-v",
    "category": "combate",
    "names": {
      "pt-br": "Balas incendiárias",
      "en": "Flaming bullets",
      "es": "Balas incendiarias",
      zh: "Flaming bullets",
    },
    "codes": {
      "pc": "INCENDIARY",
      "phone": "1-999-462-363-4279 / 1-999-INCENDIARY"
    },
    "keywords": {
      "pt-br": [
        "fogo",
        "bala",
        "incendiária",
        "Balas incendiárias",
        "INCENDIARY",
        "1-999-462-363-4279 / 1-999-INCENDIARY"
      ],
      "en": [
        "fogo",
        "bala",
        "incendiária",
        "Flaming bullets",
        "INCENDIARY",
        "1-999-462-363-4279 / 1-999-INCENDIARY"
      ],
      "es": [
        "fogo",
        "bala",
        "incendiária",
        "Balas incendiarias",
        "INCENDIARY",
        "1-999-462-363-4279 / 1-999-INCENDIARY"
      ],
      zh: [
        "fogo",
        "bala",
        "incendiária",
        "Flaming bullets",
        "INCENDIARY",
        "1-999-462-363-4279 / 1-999-INCENDIARY"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": true,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Boom - GTA 5 cheats",
        "url": "https://www.gtaboom.com/every-gta-5-cheat-console-code-and-phone-number-0740"
      }
    ]
  },
  {
    "id": "v-slow-aim",
    "game": "gta-v",
    "category": "combate",
    "names": {
      "pt-br": "Mira em câmera lenta",
      "en": "Slow motion aim",
      "es": "Apuntado en cámara lenta",
      zh: "Slow motion aim",
    },
    "codes": {
      "pc": "DEADEYE",
      "phone": "1-999-332-3393 / 1-999-DEADEYE"
    },
    "keywords": {
      "pt-br": [
        "mira",
        "câmera lenta",
        "Mira em câmera lenta",
        "DEADEYE",
        "1-999-332-3393 / 1-999-DEADEYE"
      ],
      "en": [
        "mira",
        "câmera lenta",
        "Slow motion aim",
        "DEADEYE",
        "1-999-332-3393 / 1-999-DEADEYE"
      ],
      "es": [
        "mira",
        "câmera lenta",
        "Apuntado en cámara lenta",
        "DEADEYE",
        "1-999-332-3393 / 1-999-DEADEYE"
      ],
      zh: [
        "mira",
        "câmera lenta",
        "Slow motion aim",
        "DEADEYE",
        "1-999-332-3393 / 1-999-DEADEYE"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": true,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Boom - GTA 5 cheats",
        "url": "https://www.gtaboom.com/every-gta-5-cheat-console-code-and-phone-number-0740"
      }
    ]
  },
  {
    "id": "v-drunk",
    "game": "gta-v",
    "category": "player",
    "names": {
      "pt-br": "Modo bêbado",
      "en": "Drunk mode",
      "es": "Modo borracho",
      zh: "Drunk mode",
    },
    "codes": {
      "pc": "LIQUOR",
      "phone": "1-999-547-861 / 1-999-LIQUOR"
    },
    "keywords": {
      "pt-br": [
        "bêbado",
        "fun",
        "Modo bêbado",
        "LIQUOR",
        "1-999-547-861 / 1-999-LIQUOR"
      ],
      "en": [
        "bêbado",
        "fun",
        "Drunk mode",
        "LIQUOR",
        "1-999-547-861 / 1-999-LIQUOR"
      ],
      "es": [
        "bêbado",
        "fun",
        "Modo borracho",
        "LIQUOR",
        "1-999-547-861 / 1-999-LIQUOR"
      ],
      zh: [
        "bêbado",
        "fun",
        "Drunk mode",
        "LIQUOR",
        "1-999-547-861 / 1-999-LIQUOR"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": true,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Boom - GTA 5 cheats",
        "url": "https://www.gtaboom.com/every-gta-5-cheat-console-code-and-phone-number-0740"
      }
    ]
  },
  {
    "id": "v-fast-run",
    "game": "gta-v",
    "category": "movimento",
    "names": {
      "pt-br": "Correr mais rápido",
      "en": "Fast run",
      "es": "Correr más rápido",
      zh: "Fast run",
    },
    "codes": {
      "pc": "CATCHME",
      "phone": "1-999-228-8463 / 1-999-CATCHME"
    },
    "keywords": {
      "pt-br": [
        "correr",
        "velocidade",
        "Correr mais rápido",
        "CATCHME",
        "1-999-228-8463 / 1-999-CATCHME"
      ],
      "en": [
        "correr",
        "velocidade",
        "Fast run",
        "CATCHME",
        "1-999-228-8463 / 1-999-CATCHME"
      ],
      "es": [
        "correr",
        "velocidade",
        "Correr más rápido",
        "CATCHME",
        "1-999-228-8463 / 1-999-CATCHME"
      ],
      zh: [
        "correr",
        "velocidade",
        "Fast run",
        "CATCHME",
        "1-999-228-8463 / 1-999-CATCHME"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": true,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Boom - GTA 5 cheats",
        "url": "https://www.gtaboom.com/every-gta-5-cheat-console-code-and-phone-number-0740"
      }
    ]
  },
  {
    "id": "v-fast-swim",
    "game": "gta-v",
    "category": "movimento",
    "names": {
      "pt-br": "Nadar mais rápido",
      "en": "Fast swim",
      "es": "Nadar más rápido",
      zh: "Fast swim",
    },
    "codes": {
      "pc": "GOTGILLS",
      "phone": "1-999-468-44557 / 1-999-GOTGILLS"
    },
    "keywords": {
      "pt-br": [
        "nadar",
        "água",
        "Nadar mais rápido",
        "GOTGILLS",
        "1-999-468-44557 / 1-999-GOTGILLS"
      ],
      "en": [
        "nadar",
        "água",
        "Fast swim",
        "GOTGILLS",
        "1-999-468-44557 / 1-999-GOTGILLS"
      ],
      "es": [
        "nadar",
        "água",
        "Nadar más rápido",
        "GOTGILLS",
        "1-999-468-44557 / 1-999-GOTGILLS"
      ],
      zh: [
        "nadar",
        "água",
        "Fast swim",
        "GOTGILLS",
        "1-999-468-44557 / 1-999-GOTGILLS"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": true,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Boom - GTA 5 cheats",
        "url": "https://www.gtaboom.com/every-gta-5-cheat-console-code-and-phone-number-0740"
      }
    ]
  },
  {
    "id": "v-super-jump",
    "game": "gta-v",
    "category": "movimento",
    "names": {
      "pt-br": "Super pulo",
      "en": "Super jump",
      "es": "Súper salto",
      zh: "Super jump",
    },
    "codes": {
      "pc": "HOPTOIT",
      "phone": "1-999-467-8648 / 1-999-HOPTOIT"
    },
    "keywords": {
      "pt-br": [
        "pulo",
        "salto",
        "Super pulo",
        "HOPTOIT",
        "1-999-467-8648 / 1-999-HOPTOIT"
      ],
      "en": [
        "pulo",
        "salto",
        "Super jump",
        "HOPTOIT",
        "1-999-467-8648 / 1-999-HOPTOIT"
      ],
      "es": [
        "pulo",
        "salto",
        "Súper salto",
        "HOPTOIT",
        "1-999-467-8648 / 1-999-HOPTOIT"
      ],
      zh: [
        "pulo",
        "salto",
        "Super jump",
        "HOPTOIT",
        "1-999-467-8648 / 1-999-HOPTOIT"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": true,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Boom - GTA 5 cheats",
        "url": "https://www.gtaboom.com/every-gta-5-cheat-console-code-and-phone-number-0740"
      }
    ]
  },
  {
    "id": "v-moon-gravity",
    "game": "gta-v",
    "category": "mundo",
    "names": {
      "pt-br": "Gravidade lunar",
      "en": "Moon gravity",
      "es": "Gravedad lunar",
      zh: "Moon gravity",
    },
    "codes": {
      "pc": "FLOATER",
      "phone": "1-999-356-2837 / 1-999-FLOATER"
    },
    "keywords": {
      "pt-br": [
        "gravidade",
        "lua",
        "Gravidade lunar",
        "FLOATER",
        "1-999-356-2837 / 1-999-FLOATER"
      ],
      "en": [
        "gravidade",
        "lua",
        "Moon gravity",
        "FLOATER",
        "1-999-356-2837 / 1-999-FLOATER"
      ],
      "es": [
        "gravidade",
        "lua",
        "Gravedad lunar",
        "FLOATER",
        "1-999-356-2837 / 1-999-FLOATER"
      ],
      zh: [
        "gravidade",
        "lua",
        "Moon gravity",
        "FLOATER",
        "1-999-356-2837 / 1-999-FLOATER"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": true,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Boom - GTA 5 cheats",
        "url": "https://www.gtaboom.com/every-gta-5-cheat-console-code-and-phone-number-0740"
      }
    ]
  },
  {
    "id": "v-skyfall",
    "game": "gta-v",
    "category": "mundo",
    "names": {
      "pt-br": "Skyfall / cair do céu",
      "en": "Skyfall",
      "es": "Caer del cielo",
      zh: "Skyfall",
    },
    "codes": {
      "pc": "SKYFALL",
      "phone": "1-999-759-3255 / 1-999-SKYFALL"
    },
    "keywords": {
      "pt-br": [
        "cair do céu",
        "skyfall",
        "Skyfall / cair do céu",
        "SKYFALL",
        "1-999-759-3255 / 1-999-SKYFALL"
      ],
      "en": [
        "cair do céu",
        "skyfall",
        "Skyfall",
        "SKYFALL",
        "1-999-759-3255 / 1-999-SKYFALL"
      ],
      "es": [
        "cair do céu",
        "skyfall",
        "Caer del cielo",
        "SKYFALL",
        "1-999-759-3255 / 1-999-SKYFALL"
      ],
      zh: [
        "cair do céu",
        "skyfall",
        "Skyfall",
        "SKYFALL",
        "1-999-759-3255 / 1-999-SKYFALL"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": true,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Boom - GTA 5 cheats",
        "url": "https://www.gtaboom.com/every-gta-5-cheat-console-code-and-phone-number-0740"
      }
    ]
  },
  {
    "id": "v-change-weather",
    "game": "gta-v",
    "category": "clima",
    "names": {
      "pt-br": "Mudar clima",
      "en": "Change weather",
      "es": "Cambiar clima",
      zh: "Change weather",
    },
    "codes": {
      "pc": "MAKEITRAIN",
      "phone": "1-999-625-348-7246 / 1-999-MAKEITRAIN"
    },
    "keywords": {
      "pt-br": [
        "clima",
        "chuva",
        "Mudar clima",
        "MAKEITRAIN",
        "1-999-625-348-7246 / 1-999-MAKEITRAIN"
      ],
      "en": [
        "clima",
        "chuva",
        "Change weather",
        "MAKEITRAIN",
        "1-999-625-348-7246 / 1-999-MAKEITRAIN"
      ],
      "es": [
        "clima",
        "chuva",
        "Cambiar clima",
        "MAKEITRAIN",
        "1-999-625-348-7246 / 1-999-MAKEITRAIN"
      ],
      zh: [
        "clima",
        "chuva",
        "Change weather",
        "MAKEITRAIN",
        "1-999-625-348-7246 / 1-999-MAKEITRAIN"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": true,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Boom - GTA 5 cheats",
        "url": "https://www.gtaboom.com/every-gta-5-cheat-console-code-and-phone-number-0740"
      }
    ]
  },
  {
    "id": "v-slippery-cars",
    "game": "gta-v",
    "category": "veiculos",
    "names": {
      "pt-br": "Carros derrapam",
      "en": "Slippery cars",
      "es": "Coches resbaladizos",
      zh: "Slippery cars",
    },
    "codes": {
      "pc": "SNOWDAY",
      "phone": "1-999-766-9329 / 1-999-SNOWDAY"
    },
    "keywords": {
      "pt-br": [
        "carro",
        "gelo",
        "derrapar",
        "Carros derrapam",
        "SNOWDAY",
        "1-999-766-9329 / 1-999-SNOWDAY"
      ],
      "en": [
        "carro",
        "gelo",
        "derrapar",
        "Slippery cars",
        "SNOWDAY",
        "1-999-766-9329 / 1-999-SNOWDAY"
      ],
      "es": [
        "carro",
        "gelo",
        "derrapar",
        "Coches resbaladizos",
        "SNOWDAY",
        "1-999-766-9329 / 1-999-SNOWDAY"
      ],
      zh: [
        "carro",
        "gelo",
        "derrapar",
        "Slippery cars",
        "SNOWDAY",
        "1-999-766-9329 / 1-999-SNOWDAY"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": true,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Boom - GTA 5 cheats",
        "url": "https://www.gtaboom.com/every-gta-5-cheat-console-code-and-phone-number-0740"
      }
    ]
  },
  {
    "id": "v-slow-motion",
    "game": "gta-v",
    "category": "mundo",
    "names": {
      "pt-br": "Câmera lenta",
      "en": "Slow motion",
      "es": "Cámara lenta",
      zh: "Slow motion",
    },
    "codes": {
      "pc": "SLOWMO",
      "phone": "1-999-756-966 / 1-999-SLOWMO"
    },
    "keywords": {
      "pt-br": [
        "câmera lenta",
        "tempo",
        "Câmera lenta",
        "SLOWMO",
        "1-999-756-966 / 1-999-SLOWMO"
      ],
      "en": [
        "câmera lenta",
        "tempo",
        "Slow motion",
        "SLOWMO",
        "1-999-756-966 / 1-999-SLOWMO"
      ],
      "es": [
        "câmera lenta",
        "tempo",
        "Cámara lenta",
        "SLOWMO",
        "1-999-756-966 / 1-999-SLOWMO"
      ],
      zh: [
        "câmera lenta",
        "tempo",
        "Slow motion",
        "SLOWMO",
        "1-999-756-966 / 1-999-SLOWMO"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": true,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Boom - GTA 5 cheats",
        "url": "https://www.gtaboom.com/every-gta-5-cheat-console-code-and-phone-number-0740"
      }
    ]
  },
  {
    "id": "v-director-mode",
    "game": "gta-v",
    "category": "mundo",
    "names": {
      "pt-br": "Modo diretor",
      "en": "Director mode",
      "es": "Modo director",
      zh: "Director mode",
    },
    "codes": {
      "pc": "JRTALENT",
      "phone": "1-999-578-25368 / 1-999-JRTALENT"
    },
    "keywords": {
      "pt-br": [
        "diretor",
        "modo diretor",
        "Modo diretor",
        "JRTALENT",
        "1-999-578-25368 / 1-999-JRTALENT"
      ],
      "en": [
        "diretor",
        "modo diretor",
        "Director mode",
        "JRTALENT",
        "1-999-578-25368 / 1-999-JRTALENT"
      ],
      "es": [
        "diretor",
        "modo diretor",
        "Modo director",
        "JRTALENT",
        "1-999-578-25368 / 1-999-JRTALENT"
      ],
      zh: [
        "diretor",
        "modo diretor",
        "Director mode",
        "JRTALENT",
        "1-999-578-25368 / 1-999-JRTALENT"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": true,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Boom - GTA 5 cheats",
        "url": "https://www.gtaboom.com/every-gta-5-cheat-console-code-and-phone-number-0740"
      }
    ]
  },
  {
    "id": "v-black-cellphone",
    "game": "gta-v",
    "category": "mundo",
    "names": {
      "pt-br": "Black cellphone",
      "en": "Black cellphone",
      "es": "Teléfono negro",
      zh: "Black cellphone",
    },
    "codes": {
      "phone": "1-999-367-3767"
    },
    "keywords": {
      "pt-br": [
        "celular",
        "explosão",
        "black cellphone",
        "Black cellphone",
        "1-999-367-3767"
      ],
      "en": [
        "celular",
        "explosão",
        "black cellphone",
        "Black cellphone",
        "1-999-367-3767"
      ],
      "es": [
        "celular",
        "explosão",
        "black cellphone",
        "Teléfono negro",
        "1-999-367-3767"
      ],
      zh: [
        "celular",
        "explosão",
        "black cellphone",
        "Black cellphone",
        "1-999-367-3767"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": true,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Boom - GTA 5 cheats",
        "url": "https://www.gtaboom.com/every-gta-5-cheat-console-code-and-phone-number-0740"
      }
    ],
    "note": "Código por telefone; algumas listas não trazem equivalente textual de PC."
  },
  {
    "id": "v-spawn-bmx",
    "game": "gta-v",
    "category": "spawn-veiculos",
    "names": {
      "pt-br": "Spawn BMX",
      "en": "Spawn BMX",
      "es": "Generar BMX",
      zh: "Spawn BMX",
    },
    "codes": {
      "pc": "BANDIT",
      "phone": "1-999-226-348 / 1-999-BANDIT"
    },
    "keywords": {
      "pt-br": [
        "bicicleta",
        "bike",
        "bmx",
        "Spawn BMX",
        "BANDIT",
        "1-999-226-348 / 1-999-BANDIT"
      ],
      "en": [
        "bicicleta",
        "bike",
        "bmx",
        "Spawn BMX",
        "BANDIT",
        "1-999-226-348 / 1-999-BANDIT"
      ],
      "es": [
        "bicicleta",
        "bike",
        "bmx",
        "Generar BMX",
        "BANDIT",
        "1-999-226-348 / 1-999-BANDIT"
      ],
      zh: [
        "bicicleta",
        "bike",
        "bmx",
        "Spawn BMX",
        "BANDIT",
        "1-999-226-348 / 1-999-BANDIT"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": true,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Boom - GTA 5 cheats",
        "url": "https://www.gtaboom.com/every-gta-5-cheat-console-code-and-phone-number-0740"
      }
    ]
  },
  {
    "id": "v-spawn-buzzard",
    "game": "gta-v",
    "category": "spawn-veiculos",
    "names": {
      "pt-br": "Spawn Buzzard helicóptero",
      "en": "Spawn Buzzard helicopter",
      "es": "Generar helicóptero Buzzard",
      zh: "Spawn Buzzard helicopter",
    },
    "codes": {
      "pc": "BUZZOFF",
      "phone": "1-999-289-9633 / 1-999-BUZZOFF"
    },
    "keywords": {
      "pt-br": [
        "helicóptero",
        "buzzard",
        "Spawn Buzzard helicóptero",
        "BUZZOFF",
        "1-999-289-9633 / 1-999-BUZZOFF"
      ],
      "en": [
        "helicóptero",
        "buzzard",
        "Spawn Buzzard helicopter",
        "BUZZOFF",
        "1-999-289-9633 / 1-999-BUZZOFF"
      ],
      "es": [
        "helicóptero",
        "buzzard",
        "Generar helicóptero Buzzard",
        "BUZZOFF",
        "1-999-289-9633 / 1-999-BUZZOFF"
      ],
      zh: [
        "helicóptero",
        "buzzard",
        "Spawn Buzzard helicopter",
        "BUZZOFF",
        "1-999-289-9633 / 1-999-BUZZOFF"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": true,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Boom - GTA 5 cheats",
        "url": "https://www.gtaboom.com/every-gta-5-cheat-console-code-and-phone-number-0740"
      }
    ]
  },
  {
    "id": "v-spawn-caddy",
    "game": "gta-v",
    "category": "spawn-veiculos",
    "names": {
      "pt-br": "Spawn Caddy",
      "en": "Spawn Caddy",
      "es": "Generar Caddy",
      zh: "Spawn Caddy",
    },
    "codes": {
      "pc": "HOLEIN1",
      "phone": "1-999-4653-46-1 / 1-999-HOLEIN1"
    },
    "keywords": {
      "pt-br": [
        "golf",
        "caddy",
        "Spawn Caddy",
        "HOLEIN1",
        "1-999-4653-46-1 / 1-999-HOLEIN1"
      ],
      "en": [
        "golf",
        "caddy",
        "Spawn Caddy",
        "HOLEIN1",
        "1-999-4653-46-1 / 1-999-HOLEIN1"
      ],
      "es": [
        "golf",
        "caddy",
        "Generar Caddy",
        "HOLEIN1",
        "1-999-4653-46-1 / 1-999-HOLEIN1"
      ],
      zh: [
        "golf",
        "caddy",
        "Spawn Caddy",
        "HOLEIN1",
        "1-999-4653-46-1 / 1-999-HOLEIN1"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": true,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Boom - GTA 5 cheats",
        "url": "https://www.gtaboom.com/every-gta-5-cheat-console-code-and-phone-number-0740"
      }
    ]
  },
  {
    "id": "v-spawn-comet",
    "game": "gta-v",
    "category": "spawn-veiculos",
    "names": {
      "pt-br": "Spawn Comet",
      "en": "Spawn Comet",
      "es": "Generar Comet",
      zh: "Spawn Comet",
    },
    "codes": {
      "pc": "COMET",
      "phone": "1-999-266-38 / 1-999-COMET"
    },
    "keywords": {
      "pt-br": [
        "carro",
        "comet",
        "esportivo",
        "Spawn Comet",
        "COMET",
        "1-999-266-38 / 1-999-COMET"
      ],
      "en": [
        "carro",
        "comet",
        "esportivo",
        "Spawn Comet",
        "COMET",
        "1-999-266-38 / 1-999-COMET"
      ],
      "es": [
        "carro",
        "comet",
        "esportivo",
        "Generar Comet",
        "COMET",
        "1-999-266-38 / 1-999-COMET"
      ],
      zh: [
        "carro",
        "comet",
        "esportivo",
        "Spawn Comet",
        "COMET",
        "1-999-266-38 / 1-999-COMET"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": true,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Boom - GTA 5 cheats",
        "url": "https://www.gtaboom.com/every-gta-5-cheat-console-code-and-phone-number-0740"
      }
    ]
  },
  {
    "id": "v-spawn-duster",
    "game": "gta-v",
    "category": "spawn-veiculos",
    "names": {
      "pt-br": "Spawn Duster avião",
      "en": "Spawn Duster plane",
      "es": "Generar avión Duster",
      zh: "Spawn Duster plane",
    },
    "codes": {
      "pc": "FLYSPRAY",
      "phone": "1-999-359-77729 / 1-999-FLYSPRAY"
    },
    "keywords": {
      "pt-br": [
        "avião",
        "duster",
        "Spawn Duster avião",
        "FLYSPRAY",
        "1-999-359-77729 / 1-999-FLYSPRAY"
      ],
      "en": [
        "avião",
        "duster",
        "Spawn Duster plane",
        "FLYSPRAY",
        "1-999-359-77729 / 1-999-FLYSPRAY"
      ],
      "es": [
        "avião",
        "duster",
        "Generar avión Duster",
        "FLYSPRAY",
        "1-999-359-77729 / 1-999-FLYSPRAY"
      ],
      zh: [
        "avião",
        "duster",
        "Spawn Duster plane",
        "FLYSPRAY",
        "1-999-359-77729 / 1-999-FLYSPRAY"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": true,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Boom - GTA 5 cheats",
        "url": "https://www.gtaboom.com/every-gta-5-cheat-console-code-and-phone-number-0740"
      }
    ]
  },
  {
    "id": "v-spawn-limo",
    "game": "gta-v",
    "category": "spawn-veiculos",
    "names": {
      "pt-br": "Spawn limousine",
      "en": "Spawn limo",
      "es": "Generar limusina",
      zh: "Spawn limo",
    },
    "codes": {
      "pc": "VINEWOOD",
      "phone": "1-999-846-39663 / 1-999-VINEWOOD"
    },
    "keywords": {
      "pt-br": [
        "limusine",
        "limo",
        "Spawn limousine",
        "VINEWOOD",
        "1-999-846-39663 / 1-999-VINEWOOD"
      ],
      "en": [
        "limusine",
        "limo",
        "Spawn limo",
        "VINEWOOD",
        "1-999-846-39663 / 1-999-VINEWOOD"
      ],
      "es": [
        "limusine",
        "limo",
        "Generar limusina",
        "VINEWOOD",
        "1-999-846-39663 / 1-999-VINEWOOD"
      ],
      zh: [
        "limusine",
        "limo",
        "Spawn limo",
        "VINEWOOD",
        "1-999-846-39663 / 1-999-VINEWOOD"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": true,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Boom - GTA 5 cheats",
        "url": "https://www.gtaboom.com/every-gta-5-cheat-console-code-and-phone-number-0740"
      }
    ]
  },
  {
    "id": "v-spawn-pcj600",
    "game": "gta-v",
    "category": "spawn-veiculos",
    "names": {
      "pt-br": "Spawn PCJ-600 moto",
      "en": "Spawn PCJ-600 bike",
      "es": "Generar moto PCJ-600",
      zh: "Spawn PCJ-600 bike",
    },
    "codes": {
      "pc": "ROCKET",
      "phone": "1-999-762-538 / 1-999-ROCKET"
    },
    "keywords": {
      "pt-br": [
        "moto",
        "pcj",
        "Spawn PCJ-600 moto",
        "ROCKET",
        "1-999-762-538 / 1-999-ROCKET"
      ],
      "en": [
        "moto",
        "pcj",
        "Spawn PCJ-600 bike",
        "ROCKET",
        "1-999-762-538 / 1-999-ROCKET"
      ],
      "es": [
        "moto",
        "pcj",
        "Generar moto PCJ-600",
        "ROCKET",
        "1-999-762-538 / 1-999-ROCKET"
      ],
      zh: [
        "moto",
        "pcj",
        "Spawn PCJ-600 bike",
        "ROCKET",
        "1-999-762-538 / 1-999-ROCKET"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": true,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Boom - GTA 5 cheats",
        "url": "https://www.gtaboom.com/every-gta-5-cheat-console-code-and-phone-number-0740"
      }
    ]
  },
  {
    "id": "v-spawn-rapidgt",
    "game": "gta-v",
    "category": "spawn-veiculos",
    "names": {
      "pt-br": "Spawn Rapid GT",
      "en": "Spawn Rapid GT",
      "es": "Generar Rapid GT",
      zh: "Spawn Rapid GT",
    },
    "codes": {
      "pc": "RAPIDGT",
      "phone": "1-999-727-4348 / 1-999-RAPIDGT"
    },
    "keywords": {
      "pt-br": [
        "carro",
        "esportivo",
        "rapid gt",
        "Spawn Rapid GT",
        "RAPIDGT",
        "1-999-727-4348 / 1-999-RAPIDGT"
      ],
      "en": [
        "carro",
        "esportivo",
        "rapid gt",
        "Spawn Rapid GT",
        "RAPIDGT",
        "1-999-727-4348 / 1-999-RAPIDGT"
      ],
      "es": [
        "carro",
        "esportivo",
        "rapid gt",
        "Generar Rapid GT",
        "RAPIDGT",
        "1-999-727-4348 / 1-999-RAPIDGT"
      ],
      zh: [
        "carro",
        "esportivo",
        "rapid gt",
        "Spawn Rapid GT",
        "RAPIDGT",
        "1-999-727-4348 / 1-999-RAPIDGT"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": true,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Boom - GTA 5 cheats",
        "url": "https://www.gtaboom.com/every-gta-5-cheat-console-code-and-phone-number-0740"
      }
    ]
  },
  {
    "id": "v-spawn-sanchez",
    "game": "gta-v",
    "category": "spawn-veiculos",
    "names": {
      "pt-br": "Spawn Sanchez moto",
      "en": "Spawn Sanchez dirt bike",
      "es": "Generar moto Sanchez",
      zh: "Spawn Sanchez dirt bike",
    },
    "codes": {
      "pc": "OFFROAD",
      "phone": "1-999-633-7623 / 1-999-OFFROAD"
    },
    "keywords": {
      "pt-br": [
        "moto",
        "sanchez",
        "offroad",
        "Spawn Sanchez moto",
        "OFFROAD",
        "1-999-633-7623 / 1-999-OFFROAD"
      ],
      "en": [
        "moto",
        "sanchez",
        "offroad",
        "Spawn Sanchez dirt bike",
        "OFFROAD",
        "1-999-633-7623 / 1-999-OFFROAD"
      ],
      "es": [
        "moto",
        "sanchez",
        "offroad",
        "Generar moto Sanchez",
        "OFFROAD",
        "1-999-633-7623 / 1-999-OFFROAD"
      ],
      zh: [
        "moto",
        "sanchez",
        "offroad",
        "Spawn Sanchez dirt bike",
        "OFFROAD",
        "1-999-633-7623 / 1-999-OFFROAD"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": true,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Boom - GTA 5 cheats",
        "url": "https://www.gtaboom.com/every-gta-5-cheat-console-code-and-phone-number-0740"
      }
    ]
  },
  {
    "id": "v-spawn-stunt-plane",
    "game": "gta-v",
    "category": "spawn-veiculos",
    "names": {
      "pt-br": "Spawn Stunt Plane",
      "en": "Spawn Stunt Plane",
      "es": "Generar avión acrobático",
      zh: "Spawn Stunt Plane",
    },
    "codes": {
      "pc": "BARNSTORM",
      "phone": "1-999-227-678-676 / 1-999-BARNSTORM"
    },
    "keywords": {
      "pt-br": [
        "avião",
        "stunt",
        "Spawn Stunt Plane",
        "BARNSTORM",
        "1-999-227-678-676 / 1-999-BARNSTORM"
      ],
      "en": [
        "avião",
        "stunt",
        "Spawn Stunt Plane",
        "BARNSTORM",
        "1-999-227-678-676 / 1-999-BARNSTORM"
      ],
      "es": [
        "avião",
        "stunt",
        "Generar avión acrobático",
        "BARNSTORM",
        "1-999-227-678-676 / 1-999-BARNSTORM"
      ],
      zh: [
        "avião",
        "stunt",
        "Spawn Stunt Plane",
        "BARNSTORM",
        "1-999-227-678-676 / 1-999-BARNSTORM"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": true,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Boom - GTA 5 cheats",
        "url": "https://www.gtaboom.com/every-gta-5-cheat-console-code-and-phone-number-0740"
      }
    ]
  },
  {
    "id": "v-spawn-trashmaster",
    "game": "gta-v",
    "category": "spawn-veiculos",
    "names": {
      "pt-br": "Spawn Trashmaster",
      "en": "Spawn Trashmaster",
      "es": "Generar camión de basura",
      zh: "Spawn Trashmaster",
    },
    "codes": {
      "pc": "TRASHED",
      "phone": "1-999-872-7433 / 1-999-TRASHED"
    },
    "keywords": {
      "pt-br": [
        "caminhão",
        "lixo",
        "Spawn Trashmaster",
        "TRASHED",
        "1-999-872-7433 / 1-999-TRASHED"
      ],
      "en": [
        "caminhão",
        "lixo",
        "Spawn Trashmaster",
        "TRASHED",
        "1-999-872-7433 / 1-999-TRASHED"
      ],
      "es": [
        "caminhão",
        "lixo",
        "Generar camión de basura",
        "TRASHED",
        "1-999-872-7433 / 1-999-TRASHED"
      ],
      zh: [
        "caminhão",
        "lixo",
        "Spawn Trashmaster",
        "TRASHED",
        "1-999-872-7433 / 1-999-TRASHED"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": true,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Boom - GTA 5 cheats",
        "url": "https://www.gtaboom.com/every-gta-5-cheat-console-code-and-phone-number-0740"
      }
    ]
  },
  {
    "id": "v-spawn-duke-odeath",
    "game": "gta-v",
    "category": "spawn-veiculos",
    "names": {
      "pt-br": "Spawn Duke O'Death",
      "en": "Spawn Duke O'Death",
      "es": "Generar Duke O'Death",
      zh: "Spawn Duke O'Death",
    },
    "codes": {
      "pc": "DEATHCAR",
      "phone": "1-999-3328-4227 / 1-999-DEATHCAR"
    },
    "keywords": {
      "pt-br": [
        "carro",
        "duke",
        "deathcar",
        "Spawn Duke O'Death",
        "DEATHCAR",
        "1-999-3328-4227 / 1-999-DEATHCAR"
      ],
      "en": [
        "carro",
        "duke",
        "deathcar",
        "Spawn Duke O'Death",
        "DEATHCAR",
        "1-999-3328-4227 / 1-999-DEATHCAR"
      ],
      "es": [
        "carro",
        "duke",
        "deathcar",
        "Generar Duke O'Death",
        "DEATHCAR",
        "1-999-3328-4227 / 1-999-DEATHCAR"
      ],
      zh: [
        "carro",
        "duke",
        "deathcar",
        "Spawn Duke O'Death",
        "DEATHCAR",
        "1-999-3328-4227 / 1-999-DEATHCAR"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": true,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Boom - GTA 5 cheats",
        "url": "https://www.gtaboom.com/every-gta-5-cheat-console-code-and-phone-number-0740"
      }
    ],
    "note": "Pode exigir desbloqueio no modo história."
  },
  {
    "id": "v-spawn-dodo",
    "game": "gta-v",
    "category": "spawn-veiculos",
    "names": {
      "pt-br": "Spawn Dodo avião",
      "en": "Spawn Dodo plane",
      "es": "Generar avión Dodo",
      zh: "Spawn Dodo plane",
    },
    "codes": {
      "pc": "EXTINCT",
      "phone": "1-999-398-4628 / 1-999-EXTINCT"
    },
    "keywords": {
      "pt-br": [
        "avião",
        "dodo",
        "Spawn Dodo avião",
        "EXTINCT",
        "1-999-398-4628 / 1-999-EXTINCT"
      ],
      "en": [
        "avião",
        "dodo",
        "Spawn Dodo plane",
        "EXTINCT",
        "1-999-398-4628 / 1-999-EXTINCT"
      ],
      "es": [
        "avião",
        "dodo",
        "Generar avión Dodo",
        "EXTINCT",
        "1-999-398-4628 / 1-999-EXTINCT"
      ],
      zh: [
        "avião",
        "dodo",
        "Spawn Dodo plane",
        "EXTINCT",
        "1-999-398-4628 / 1-999-EXTINCT"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": true,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Boom - GTA 5 cheats",
        "url": "https://www.gtaboom.com/every-gta-5-cheat-console-code-and-phone-number-0740"
      }
    ],
    "note": "Pode exigir desbloqueio no modo história."
  },
  {
    "id": "v-spawn-kraken",
    "game": "gta-v",
    "category": "spawn-veiculos",
    "names": {
      "pt-br": "Spawn Kraken submarino",
      "en": "Spawn Kraken submarine",
      "es": "Generar submarino Kraken",
      zh: "Spawn Kraken submarine",
    },
    "codes": {
      "pc": "BUBBLES",
      "phone": "1-999-282-2537 / 1-999-BUBBLES"
    },
    "keywords": {
      "pt-br": [
        "submarino",
        "kraken",
        "Spawn Kraken submarino",
        "BUBBLES",
        "1-999-282-2537 / 1-999-BUBBLES"
      ],
      "en": [
        "submarino",
        "kraken",
        "Spawn Kraken submarine",
        "BUBBLES",
        "1-999-282-2537 / 1-999-BUBBLES"
      ],
      "es": [
        "submarino",
        "kraken",
        "Generar submarino Kraken",
        "BUBBLES",
        "1-999-282-2537 / 1-999-BUBBLES"
      ],
      zh: [
        "submarino",
        "kraken",
        "Spawn Kraken submarine",
        "BUBBLES",
        "1-999-282-2537 / 1-999-BUBBLES"
      ],
    },
    "support": {
      "singlePlayerOnly": true,
      "storyModeOnly": true,
      "gtaOnlineSupported": false
    },
    "sources": [
      {
        "name": "GTA Boom - GTA 5 cheats",
        "url": "https://www.gtaboom.com/every-gta-5-cheat-console-code-and-phone-number-0740"
      }
    ],
    "note": "Pode exigir desbloqueio no modo história."
  }
];

export const gtaCheatById = new Map(gtaCheats.map((item) => [item.id, item]));

export const gtaCheatsByGame = gtaCheats.reduce((acc, cheat) => {
  if (!acc[cheat.game]) acc[cheat.game] = [];
  acc[cheat.game]!.push(cheat);
  return acc;
}, {} as Partial<Record<GtaGameId, GtaCheatEntry[]>>);

const normalizeSearch = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

export function searchGtaCheats(params: {
  query?: string;
  game?: GtaGameId | 'all';
  category?: GtaCheatCategory | 'all';
  locale?: AppLocale;
}) {
  const locale = params.locale ?? 'pt-br';
  const query = normalizeSearch(params.query ?? '');

  return gtaCheats.filter((cheat) => {
    if (params.game && params.game !== 'all' && cheat.game !== params.game) return false;
    if (params.category && params.category !== 'all' && cheat.category !== params.category) return false;
    if (!query) return true;

    const searchable = [
      cheat.id,
      cheat.game,
      cheat.category,
      cheat.names['pt-br'],
      cheat.names.en,
      cheat.names.es,
      cheat.codes.pc,
      cheat.codes.pcPhrase,
      cheat.codes.pcCode,
      cheat.codes.phone,
      cheat.codes.playstation,
      cheat.codes.xbox,
      cheat.codes.switch,
      ...(cheat.keywords['pt-br'] ?? []),
      ...(cheat.keywords.en ?? []),
      ...(cheat.keywords.es ?? []),
      cheat.note,
      gtaGameNames[cheat.game]?.[locale],
      gtaCategoryNames[cheat.category]?.[locale],
    ]
      .filter(Boolean)
      .join(' ');

    return normalizeSearch(searchable).includes(query);
  });
}
