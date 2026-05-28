import {
  gtaCheats,
  gtaGameNames,
  type GtaCheatCategory,
  type GtaCheatEntry,
  type GtaGameId,
} from '@/data/gta/gta-cheats';

export type GtaPlatformFilter =
  | 'all'
  | 'pc'
  | 'phone'
  | 'playstation'
  | 'xbox'
  | 'switch';

export type GtaCheatFilters = {
  game: GtaGameId | 'all';
  category: GtaCheatCategory | 'all';
  platform: GtaPlatformFilter;
  query: string;
};

const synonymEntries: Array<[string, string[]]> = [
  ['carro', ['car', 'coche', 'vehicle', 'veiculo']],
  ['car', ['carro', 'coche', 'vehicle', 'veiculo']],
  ['coche', ['carro', 'car', 'vehicle', 'veiculo']],
  ['moto', ['bike', 'motorcycle']],
  ['bike', ['moto', 'motorcycle']],
  ['motorcycle', ['moto', 'bike']],
  ['policia', ['police']],
  ['police', ['policia']],
  ['helicoptero', ['helicopter', 'heli']],
  ['helicopter', ['helicoptero', 'heli']],
  ['heli', ['helicopter', 'helicoptero']],
  ['tanque', ['tank', 'rhino']],
  ['tank', ['tanque', 'rhino']],
  ['rhino', ['tank', 'tanque']],
  ['vida', ['health', 'cura']],
  ['health', ['vida', 'cura']],
  ['cura', ['vida', 'health']],
  ['armadura', ['armor', 'armour', 'colete']],
  ['armor', ['armadura', 'armour', 'colete']],
  ['armour', ['armadura', 'armor', 'colete']],
  ['colete', ['armadura', 'armor', 'armour']],
  ['armas', ['weapons', 'guns']],
  ['weapons', ['armas', 'guns']],
  ['guns', ['armas', 'weapons']],
  ['clima', ['weather', 'tiempo']],
  ['weather', ['clima', 'tiempo']],
  ['tiempo', ['clima', 'weather']],
  ['dinheiro', ['money', 'cash', 'dinero']],
  ['money', ['dinheiro', 'cash', 'dinero']],
  ['cash', ['dinheiro', 'money', 'dinero']],
  ['dinero', ['dinheiro', 'money', 'cash']],
  ['pedestre', ['pedestrian', 'npc', 'peaton', 'peatones']],
  ['pedestrian', ['pedestre', 'npc', 'peaton', 'peatones']],
  ['npc', ['pedestre', 'pedestrian', 'peaton', 'peatones']],
  ['peaton', ['pedestre', 'pedestrian', 'npc', 'peatones']],
  ['peatones', ['pedestre', 'pedestrian', 'npc', 'peaton']],
];

const synonymMap = new Map<string, string[]>(synonymEntries);

export const normalizeGtaSearchValue = (value: string): string =>
  value
    .normalize('NFD')
    .replaceAll(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replaceAll(/[^a-z0-9\s-]/g, ' ')
    .replaceAll(/\s+/g, ' ')
    .trim();

const tokenize = (value: string): string[] =>
  normalizeGtaSearchValue(value)
    .split(' ')
    .map((item) => item.trim())
    .filter(Boolean);

const getPlatformStrings = (entry: GtaCheatEntry): string[] => {
  const values: string[] = [];

  if (entry.codes.pc) {
    values.push(entry.codes.pc, 'pc');
  }
  if (entry.codes.pcCode) {
    values.push(entry.codes.pcCode, 'pc code');
  }
  if (entry.codes.pcPhrase) {
    values.push(entry.codes.pcPhrase, 'pc phrase');
  }
  if (entry.codes.phone) {
    values.push(entry.codes.phone, 'phone', 'telefone');
  }
  if (entry.codes.playstation) {
    values.push(entry.codes.playstation, 'playstation', 'ps');
  }
  if (entry.codes.xbox) {
    values.push(entry.codes.xbox, 'xbox');
  }
  if (entry.codes.switch) {
    values.push(entry.codes.switch, 'switch');
  }

  return values;
};

const hasPlatform = (entry: GtaCheatEntry, platform: GtaPlatformFilter): boolean => {
  if (platform === 'all') {
    return true;
  }

  if (platform === 'pc') {
    return Boolean(entry.codes.pc || entry.codes.pcCode || entry.codes.pcPhrase);
  }

  if (platform === 'phone') {
    return Boolean(entry.codes.phone);
  }

  if (platform === 'playstation') {
    return Boolean(entry.codes.playstation);
  }

  if (platform === 'xbox') {
    return Boolean(entry.codes.xbox);
  }

  return Boolean(entry.codes.switch);
};

const expandTokensWithSynonyms = (tokens: string[]): string[] => {
  const bucket = new Set<string>(tokens);

  tokens.forEach((token) => {
    const synonyms = synonymMap.get(token);
    if (synonyms) {
      synonyms.forEach((item) => bucket.add(item));
    }
  });

  return Array.from(bucket);
};

const buildSearchHaystack = (entry: GtaCheatEntry): string => {
  const values = [
    entry.names['pt-br'],
    entry.names.en,
    entry.names.es,
    entry.game,
    gtaGameNames[entry.game]['pt-br'],
    gtaGameNames[entry.game].en,
    gtaGameNames[entry.game].es,
    entry.category,
    ...entry.keywords['pt-br'],
    ...entry.keywords.en,
    ...entry.keywords.es,
    ...getPlatformStrings(entry),
    entry.note ?? '',
  ];

  return normalizeGtaSearchValue(values.join(' '));
};

export const filterGtaCheats = (
  entries: GtaCheatEntry[],
  filters: GtaCheatFilters,
): GtaCheatEntry[] => {
  const queryTokens = tokenize(filters.query);
  const expandedTokens = expandTokensWithSynonyms(queryTokens);

  return entries.filter((entry) => {
    if (filters.game !== 'all' && entry.game !== filters.game) {
      return false;
    }

    if (filters.category !== 'all' && entry.category !== filters.category) {
      return false;
    }

    if (!hasPlatform(entry, filters.platform)) {
      return false;
    }

    if (!expandedTokens.length) {
      return true;
    }

    const haystack = buildSearchHaystack(entry);
    return expandedTokens.every((token) => haystack.includes(token));
  });
};

export const getGtaGames = (): GtaGameId[] =>
  Array.from(new Set(gtaCheats.map((item) => item.game)));

export const getGtaCategories = (): GtaCheatCategory[] =>
  Array.from(new Set(gtaCheats.map((item) => item.category)));

export const getCheatPrimaryCode = (entry: GtaCheatEntry): string =>
  entry.codes.pcCode ?? entry.codes.pcPhrase ?? entry.codes.pc ?? entry.codes.phone ?? '';

export const getGtaCheatsByGame = (game: GtaGameId): GtaCheatEntry[] =>
  gtaCheats.filter((item) => item.game === game);
