import { removeAccentsText } from '@/lib/remove-accents';

export type DiffMode = 'character' | 'word' | 'line' | 'paragraph' | 'list';

export type DiffOptions = {
  mode: DiffMode;
  ignoreCase: boolean;
  ignoreAccents: boolean;
  ignoreExtraSpaces: boolean;
  ignorePunctuation: boolean;
  ignoreLineBreaks: boolean;
};

export type DiffOpType = 'equal' | 'add' | 'remove';

export type DiffOperation = {
  type: DiffOpType;
  value: string;
  indexA: number;
  indexB: number;
};

export type TextQuickStats = {
  characters: number;
  words: number;
  lines: number;
  paragraphs: number;
  readingMinutes: number;
};

export type DiffMetrics = {
  similarityPercent: number;
  addedUnits: number;
  removedUnits: number;
  changedLines: number;
  charDiff: number;
  wordDiff: number;
  paragraphDiff: number;
};

export type ListCompareResult = {
  common: string[];
  onlyA: string[];
  onlyB: string[];
  duplicatedA: string[];
  duplicatedB: string[];
};

export type TextDiffResult = {
  operations: DiffOperation[];
  statsA: TextQuickStats;
  statsB: TextQuickStats;
  metrics: DiffMetrics;
  executiveSummary: string;
  normalizedA: string;
  normalizedB: string;
  listCompare?: ListCompareResult;
};

const punctuationRegex = /[.,!?;:()[\]{}"'`´~^]/g;

const normalizeSpaces = (value: string): string =>
  value
    .replaceAll(/\t+/g, ' ')
    .replaceAll(/\s+/g, ' ')
    .trim();

export const normalizeDiffInput = (input: string, options: DiffOptions): string => {
  let output = input.replaceAll('\r\n', '\n').replaceAll('\r', '\n');

  if (options.ignoreCase) {
    output = output.toLowerCase();
  }

  if (options.ignoreAccents) {
    output = removeAccentsText(output, {
      mode: 'keep-case',
      removeSymbols: false,
      removePunct: false,
      removeEmojis: false,
      collapseSpaces: false,
      spaceReplacement: 'none',
      toSlug: false,
    }).value;
  }

  if (options.ignorePunctuation) {
    output = output.replaceAll(punctuationRegex, '');
  }

  if (options.ignoreLineBreaks) {
    output = output.replaceAll('\n', ' ');
  }

  if (options.ignoreExtraSpaces) {
    output = normalizeSpaces(output);
  }

  return output;
};

const tokenizeByMode = (text: string, mode: DiffMode): string[] => {
  if (!text.trim()) {
    return [];
  }

  if (mode === 'character') {
    return Array.from(text);
  }

  if (mode === 'word') {
    return text.split(/(\s+)/).filter((part) => part.length > 0);
  }

  if (mode === 'line' || mode === 'list') {
    return text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
  }

  return text
    .split(/\n\s*\n/g)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
};

const buildFallbackDiff = (tokensA: string[], tokensB: string[]): DiffOperation[] => {
  const operations: DiffOperation[] = [];

  tokensA.forEach((value, index) => {
    operations.push({ type: 'remove', value, indexA: index, indexB: -1 });
  });

  tokensB.forEach((value, index) => {
    operations.push({ type: 'add', value, indexA: -1, indexB: index });
  });

  return operations;
};

const buildDiffOperations = (tokensA: string[], tokensB: string[]): DiffOperation[] => {
  const rows = tokensA.length;
  const cols = tokensB.length;

  if (rows * cols > 250000) {
    return buildFallbackDiff(tokensA, tokensB);
  }

  const matrix = Array.from({ length: rows + 1 }, () => Array<number>(cols + 1).fill(0));

  for (let i = 1; i <= rows; i += 1) {
    for (let j = 1; j <= cols; j += 1) {
      if (tokensA[i - 1] === tokensB[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1] + 1;
      } else {
        matrix[i][j] = Math.max(matrix[i - 1][j], matrix[i][j - 1]);
      }
    }
  }

  const operations: DiffOperation[] = [];
  let i = rows;
  let j = cols;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && tokensA[i - 1] === tokensB[j - 1]) {
      operations.push({
        type: 'equal',
        value: tokensA[i - 1],
        indexA: i - 1,
        indexB: j - 1,
      });
      i -= 1;
      j -= 1;
      continue;
    }

    if (j > 0 && (i === 0 || matrix[i][j - 1] >= matrix[i - 1][j])) {
      operations.push({
        type: 'add',
        value: tokensB[j - 1],
        indexA: -1,
        indexB: j - 1,
      });
      j -= 1;
      continue;
    }

    if (i > 0) {
      operations.push({
        type: 'remove',
        value: tokensA[i - 1],
        indexA: i - 1,
        indexB: -1,
      });
      i -= 1;
    }
  }

  return operations.reverse();
};

const countWords = (text: string): number => text.match(/[\p{L}\p{N}_'-]+/gu)?.length ?? 0;

const countParagraphs = (text: string): number =>
  text
    .split(/\n\s*\n/g)
    .map((part) => part.trim())
    .filter(Boolean).length;

const computeQuickStats = (text: string): TextQuickStats => {
  const words = countWords(text);
  const lines = text.length ? text.split('\n').length : 0;

  return {
    characters: text.length,
    words,
    lines,
    paragraphs: countParagraphs(text),
    readingMinutes: Number((words / 220).toFixed(2)),
  };
};

export const compareLists = (textA: string, textB: string): ListCompareResult => {
  const listA = tokenizeByMode(textA, 'list');
  const listB = tokenizeByMode(textB, 'list');

  const countMap = (list: string[]) => {
    const map = new Map<string, number>();
    list.forEach((item) => map.set(item, (map.get(item) ?? 0) + 1));
    return map;
  };

  const mapA = countMap(listA);
  const mapB = countMap(listB);

  const common = Array.from(mapA.keys()).filter((item) => mapB.has(item));
  const onlyA = Array.from(mapA.keys()).filter((item) => !mapB.has(item));
  const onlyB = Array.from(mapB.keys()).filter((item) => !mapA.has(item));

  return {
    common,
    onlyA,
    onlyB,
    duplicatedA: Array.from(mapA.entries())
      .filter(([, count]) => count > 1)
      .map(([item]) => item),
    duplicatedB: Array.from(mapB.entries())
      .filter(([, count]) => count > 1)
      .map(([item]) => item),
  };
};

const computeMetrics = (
  operations: DiffOperation[],
  statsA: TextQuickStats,
  statsB: TextQuickStats,
): DiffMetrics => {
  const addedUnits = operations.filter((item) => item.type === 'add').length;
  const removedUnits = operations.filter((item) => item.type === 'remove').length;
  const commonUnits = operations.filter((item) => item.type === 'equal').length;
  const totalUnits = commonUnits + addedUnits + removedUnits;

  const similarityPercent = totalUnits
    ? Number(((commonUnits / totalUnits) * 100).toFixed(2))
    : 100;

  return {
    similarityPercent,
    addedUnits,
    removedUnits,
    changedLines: Math.max(addedUnits, removedUnits),
    charDiff: statsB.characters - statsA.characters,
    wordDiff: statsB.words - statsA.words,
    paragraphDiff: statsB.paragraphs - statsA.paragraphs,
  };
};

const buildExecutiveSummary = (metrics: DiffMetrics): string => {
  const growth = metrics.charDiff >= 0 ? `+${metrics.charDiff}` : `${metrics.charDiff}`;

  return [
    `Similaridade geral de ${metrics.similarityPercent}% entre as versoes.`,
    `Foram adicionadas ${metrics.addedUnits} unidades e removidas ${metrics.removedUnits}.`,
    `O tamanho final variou ${growth} caracteres e ${metrics.wordDiff} palavras.`,
  ].join(' ');
};

export const compareTexts = (textA: string, textB: string, options: DiffOptions): TextDiffResult => {
  const normalizedA = normalizeDiffInput(textA, options);
  const normalizedB = normalizeDiffInput(textB, options);

  const tokensA = tokenizeByMode(normalizedA, options.mode);
  const tokensB = tokenizeByMode(normalizedB, options.mode);

  const operations = buildDiffOperations(tokensA, tokensB);
  const statsA = computeQuickStats(normalizedA);
  const statsB = computeQuickStats(normalizedB);
  const metrics = computeMetrics(operations, statsA, statsB);

  return {
    operations,
    statsA,
    statsB,
    metrics,
    executiveSummary: buildExecutiveSummary(metrics),
    normalizedA,
    normalizedB,
    listCompare: options.mode === 'list' ? compareLists(normalizedA, normalizedB) : undefined,
  };
};

export const buildDiffReport = (result: TextDiffResult): string => {
  const header = [
    `Similaridade: ${result.metrics.similarityPercent}%`,
    `Adicoes: ${result.metrics.addedUnits}`,
    `Remocoes: ${result.metrics.removedUnits}`,
    `Diferenca de caracteres: ${result.metrics.charDiff}`,
    `Diferenca de palavras: ${result.metrics.wordDiff}`,
    '',
    'Resumo:',
    result.executiveSummary,
    '',
    'Alteracoes:',
  ];

  const operations = result.operations
    .filter((item) => item.type !== 'equal')
    .map((item) => `${item.type === 'add' ? '+' : '-'} ${item.value}`);

  return [...header, ...operations].join('\n');
};
