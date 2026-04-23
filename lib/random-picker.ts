export type PickerSeparatorMode =
  | 'auto'
  | 'newline'
  | 'comma'
  | 'space'
  | 'tab'
  | 'dot'
  | 'pipe'
  | 'slash'
  | 'semicolon';

export type PickerDrawMode =
  | 'simple'
  | 'without-repetition'
  | 'with-repetition'
  | 'shuffle';

export type ParsedPickerItem = {
  id: string;
  label: string;
  normalized: string;
  weight: number;
  numericValue: number | null;
};

export type ParsePickerItemsOptions = {
  separatorMode: PickerSeparatorMode;
  trimSpaces: boolean;
  ignoreEmpty: boolean;
  removeDuplicates: boolean;
  parseWeights: boolean;
};

export type ParsePickerItemsResult = {
  items: ParsedPickerItem[];
  detectedSeparator: Exclude<PickerSeparatorMode, 'auto'>;
  rawTokens: string[];
};

export type DrawPickerResultsOptions = {
  items: ParsedPickerItem[];
  mode: PickerDrawMode;
  requestedCount: number;
  weighted: boolean;
  shuffleBeforeDraw: boolean;
  blockedNormalizedLabels?: Set<string>;
};

export type DrawPickerResultsResult = {
  results: ParsedPickerItem[];
  poolSize: number;
  seed: string;
  algorithm: string;
  generatedAtIso: string;
};

export type PickerDistributionEntry = {
  label: string;
  hits: number;
  share: number;
};

const UINT32_MAX_PLUS_ONE = 0x1_0000_0000;

const separatorOrder: Exclude<PickerSeparatorMode, 'auto'>[] = [
  'newline',
  'comma',
  'semicolon',
  'pipe',
  'tab',
  'slash',
  'dot',
  'space',
];

const normalizeWhitespace = (value: string): string => value.replace(/\s+/g, ' ');

const normalizeLabel = (value: string): string =>
  value
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

const parseLocaleNumber = (value: string): number | null => {
  const sanitized = value
    .trim()
    .replace(/\s+/g, '')
    .replace(/\.(?=\d{3}(\D|$))/g, '')
    .replace(',', '.');

  const parsed = Number(sanitized);

  if (!Number.isFinite(parsed)) {
    return null;
  }

  return parsed;
};

const parseNumericLabel = (value: string): number | null => {
  const numericMatch = value.trim().match(/^[-+]?(?:\d+|\d*[.,]\d+)$/);

  if (!numericMatch) {
    return null;
  }

  return parseLocaleNumber(value);
};

const getRandomUint32 = (): number => {
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const random = new Uint32Array(1);
    crypto.getRandomValues(random);
    return random[0] ?? 0;
  }

  return Math.floor(Math.random() * UINT32_MAX_PLUS_ONE);
};

const getRandomFloatUnit = (): number => getRandomUint32() / UINT32_MAX_PLUS_ONE;

const getRandomIndex = (maxExclusive: number): number => {
  if (!Number.isFinite(maxExclusive) || maxExclusive <= 1) {
    return 0;
  }

  const safeMax = Math.floor(maxExclusive);
  const limit = Math.floor(UINT32_MAX_PLUS_ONE / safeMax) * safeMax;

  let random = getRandomUint32();
  while (random >= limit) {
    random = getRandomUint32();
  }

  return random % safeMax;
};

const createSeedStamp = (): string => {
  const chunks = Array.from({ length: 4 }, () =>
    getRandomUint32().toString(16).padStart(8, '0'),
  );

  return chunks.join('-');
};

const autoDetectSeparator = (
  rawValue: string,
): Exclude<PickerSeparatorMode, 'auto'> => {
  const trimmed = rawValue.trim();

  if (!trimmed) {
    return 'newline';
  }

  if (/\r?\n/.test(trimmed)) {
    return 'newline';
  }

  if (trimmed.includes(',')) {
    return 'comma';
  }

  if (trimmed.includes(';')) {
    return 'semicolon';
  }

  if (trimmed.includes('|')) {
    return 'pipe';
  }

  if (trimmed.includes('\t')) {
    return 'tab';
  }

  if (trimmed.includes('/')) {
    return 'slash';
  }

  if (trimmed.includes('.')) {
    return 'dot';
  }

  return 'space';
};

const splitBySeparator = (
  rawValue: string,
  separator: Exclude<PickerSeparatorMode, 'auto'>,
): string[] => {
  if (!rawValue) {
    return [];
  }

  switch (separator) {
    case 'newline':
      return rawValue.split(/\r?\n/);
    case 'comma':
      return rawValue.split(',');
    case 'space':
      return rawValue.split(/\s+/);
    case 'tab':
      return rawValue.split('\t');
    case 'dot':
      return rawValue.split('.');
    case 'pipe':
      return rawValue.split('|');
    case 'slash':
      return rawValue.split('/');
    case 'semicolon':
      return rawValue.split(';');
    default:
      return [rawValue];
  }
};

const parseWeightToken = (
  value: string,
  parseWeights: boolean,
): {
  label: string;
  weight: number;
} => {
  if (!parseWeights) {
    return {
      label: value,
      weight: 1,
    };
  }

  const bracketPattern = /^(.*?)[\s]*[\(\[]\s*([0-9]+(?:[.,][0-9]+)?)\s*x\s*[\)\]]\s*$/i;
  const xPattern = /^(.*?)\s*x\s*([0-9]+(?:[.,][0-9]+)?)\s*$/i;
  const starPattern = /^(.*?)\s*\*\s*([0-9]+(?:[.,][0-9]+)?)\s*$/i;
  const colonPattern = /^(.*?)\s*:\s*([0-9]+(?:[.,][0-9]+)?)\s*$/i;

  const matcher = [bracketPattern, xPattern, starPattern, colonPattern]
    .map((pattern) => value.match(pattern))
    .find((match): match is RegExpMatchArray => Boolean(match));

  if (!matcher) {
    return {
      label: value,
      weight: 1,
    };
  }

  const parsedWeight = parseLocaleNumber(matcher[2] ?? '');

  if (!parsedWeight || parsedWeight <= 0) {
    return {
      label: value,
      weight: 1,
    };
  }

  const label = (matcher[1] ?? value).trim();

  return {
    label,
    weight: parsedWeight,
  };
};

export const parsePickerItems = (
  rawValue: string,
  options: ParsePickerItemsOptions,
): ParsePickerItemsResult => {
  const detectedSeparator =
    options.separatorMode === 'auto' ? autoDetectSeparator(rawValue) : options.separatorMode;

  const tokens = splitBySeparator(rawValue, detectedSeparator);

  const mapByNormalized = new Map<string, ParsedPickerItem>();
  const parsedItems: ParsedPickerItem[] = [];

  tokens.forEach((rawToken, index) => {
    const base = options.trimSpaces ? normalizeWhitespace(rawToken).trim() : rawToken;

    if (options.ignoreEmpty && !base.trim()) {
      return;
    }

    const weighted = parseWeightToken(base, options.parseWeights);
    const finalLabel = options.trimSpaces
      ? normalizeWhitespace(weighted.label).trim()
      : weighted.label;

    if (options.ignoreEmpty && !finalLabel.trim()) {
      return;
    }

    const normalized = normalizeLabel(finalLabel);
    const nextItem: ParsedPickerItem = {
      id: `${normalized}-${index}`,
      label: finalLabel,
      normalized,
      weight: weighted.weight,
      numericValue: parseNumericLabel(finalLabel),
    };

    if (!options.removeDuplicates) {
      parsedItems.push(nextItem);
      return;
    }

    const existing = mapByNormalized.get(normalized);
    if (!existing) {
      mapByNormalized.set(normalized, nextItem);
      return;
    }

    existing.weight += nextItem.weight;
  });

  const items = options.removeDuplicates ? Array.from(mapByNormalized.values()) : parsedItems;

  return {
    items,
    detectedSeparator,
    rawTokens: tokens,
  };
};

const shuffleItems = <T,>(items: T[]): T[] => {
  const output = [...items];

  for (let index = output.length - 1; index > 0; index -= 1) {
    const randomIndex = getRandomIndex(index + 1);
    const current = output[index];
    output[index] = output[randomIndex] as T;
    output[randomIndex] = current as T;
  }

  return output;
};

const pickWeightedIndex = (items: ParsedPickerItem[]): number => {
  const totalWeight = items.reduce((sum, item) => sum + Math.max(0, item.weight), 0);

  if (!Number.isFinite(totalWeight) || totalWeight <= 0) {
    return getRandomIndex(items.length);
  }

  let threshold = getRandomFloatUnit() * totalWeight;

  for (let index = 0; index < items.length; index += 1) {
    threshold -= Math.max(0, items[index]?.weight ?? 0);

    if (threshold <= 0) {
      return index;
    }
  }

  return items.length - 1;
};

const pickRandomItem = (
  items: ParsedPickerItem[],
  weighted: boolean,
): ParsedPickerItem | undefined => {
  if (!items.length) {
    return undefined;
  }

  if (!weighted) {
    return items[getRandomIndex(items.length)];
  }

  const index = pickWeightedIndex(items);
  return items[index];
};

export const drawPickerResults = (
  options: DrawPickerResultsOptions,
): DrawPickerResultsResult => {
  const blocked = options.blockedNormalizedLabels ?? new Set<string>();

  let pool = options.items.filter((item) => !blocked.has(item.normalized));

  if (options.shuffleBeforeDraw) {
    pool = shuffleItems(pool);
  }

  const safeCount = Math.max(1, Math.floor(options.requestedCount));
  const mode = options.mode === 'simple' ? 'without-repetition' : options.mode;
  const results: ParsedPickerItem[] = [];

  if (mode === 'shuffle') {
    results.push(...shuffleItems(pool));
  } else if (mode === 'with-repetition') {
    for (let index = 0; index < safeCount; index += 1) {
      const picked = pickRandomItem(pool, options.weighted);

      if (!picked) {
        break;
      }

      results.push(picked);
    }
  } else {
    const mutablePool = [...pool];
    const limit = Math.min(safeCount, mutablePool.length);

    for (let index = 0; index < limit; index += 1) {
      const picked = pickRandomItem(mutablePool, options.weighted);

      if (!picked) {
        break;
      }

      results.push(picked);

      const pickedIndex = mutablePool.findIndex((item) => item.id === picked.id);
      if (pickedIndex >= 0) {
        mutablePool.splice(pickedIndex, 1);
      }
    }
  }

  return {
    results,
    poolSize: pool.length,
    seed: createSeedStamp(),
    algorithm:
      'crypto.getRandomValues + unbiased index selection (rejection sampling) + optional weighted draw',
    generatedAtIso: new Date().toISOString(),
  };
};

export const simulatePickerDistribution = (
  items: ParsedPickerItem[],
  iterations: number,
  weighted: boolean,
): PickerDistributionEntry[] => {
  const safeIterations = Math.max(1, Math.floor(iterations));

  if (!items.length) {
    return [];
  }

  const counts = new Map<string, number>();

  for (let index = 0; index < safeIterations; index += 1) {
    const picked = pickRandomItem(items, weighted);

    if (!picked) {
      continue;
    }

    counts.set(picked.label, (counts.get(picked.label) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([label, hits]) => ({
      label,
      hits,
      share: hits / safeIterations,
    }))
    .sort((a, b) => b.hits - a.hits || a.label.localeCompare(b.label));
};

export const detectNumericOnlyItems = (items: ParsedPickerItem[]): boolean =>
  items.length > 0 && items.every((item) => item.numericValue !== null);

export const buildRangeItems = (
  start: number,
  end: number,
): ParsedPickerItem[] => {
  if (!Number.isFinite(start) || !Number.isFinite(end)) {
    return [];
  }

  const safeStart = Math.floor(start);
  const safeEnd = Math.floor(end);

  if (safeEnd < safeStart) {
    return [];
  }

  const output: ParsedPickerItem[] = [];

  for (let value = safeStart; value <= safeEnd; value += 1) {
    const label = String(value);
    output.push({
      id: `range-${value}`,
      label,
      normalized: normalizeLabel(label),
      weight: 1,
      numericValue: value,
    });
  }

  return output;
};

export const separatorLabelOrder = separatorOrder;
