import type { ToolCategory, ToolDefinition } from '@/types/tool';

export type ToolCategoryFilter =
  | 'all'
  | 'technical'
  | 'gaming'
  | 'utility'
  | 'crypto'
  | 'dev'
  | 'documents';

export type ToolGameFilter = 'all' | 'cs2' | 'gta' | 'other';

export type ToolCatalogFilters = {
  query: string;
  category: ToolCategoryFilter;
  game: ToolGameFilter;
};

const technicalCategories = new Set<ToolCategory>(['crypto', 'dev', 'documents']);

const normalize = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();

const editDistance = (left: string, right: string, limit: number): number => {
  if (Math.abs(left.length - right.length) > limit) {
    return limit + 1;
  }

  const rows = Array.from({ length: left.length + 1 }, () =>
    Array<number>(right.length + 1).fill(limit + 1),
  );

  for (let row = 0; row <= Math.min(left.length, limit); row += 1) rows[row][0] = row;
  for (let column = 0; column <= Math.min(right.length, limit); column += 1) {
    rows[0][column] = column;
  }

  for (let row = 1; row <= left.length; row += 1) {
    const start = Math.max(1, row - limit);
    const end = Math.min(right.length, row + limit);
    let rowMinimum = limit + 1;

    for (let column = start; column <= end; column += 1) {
      const substitutionCost = left[row - 1] === right[column - 1] ? 0 : 1;
      let distance = Math.min(
        rows[row - 1][column] + 1,
        rows[row][column - 1] + 1,
        rows[row - 1][column - 1] + substitutionCost,
      );

      if (
        row > 1 &&
        column > 1 &&
        left[row - 1] === right[column - 2] &&
        left[row - 2] === right[column - 1]
      ) {
        distance = Math.min(distance, rows[row - 2][column - 2] + 1);
      }

      rows[row][column] = distance;
      rowMinimum = Math.min(rowMinimum, distance);
    }

    if (rowMinimum > limit) {
      return limit + 1;
    }
  }

  return rows[left.length][right.length];
};

const getSearchFields = (tool: ToolDefinition): Array<{ value: string; weight: number }> => [
  { value: tool.name, weight: 32 },
  { value: tool.primaryKeyword, weight: 24 },
  { value: tool.slug, weight: 10 },
  { value: tool.id, weight: 10 },
  ...tool.secondaryKeywords.map((value) => ({ value, weight: 14 })),
  { value: tool.shortDescription, weight: 7 },
];

export const getToolSearchScore = (tool: ToolDefinition, query: string): number => {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) {
    return 0;
  }

  const fields = getSearchFields(tool).map(({ value, weight }) => ({
    value: normalize(value),
    weight,
  }));
  const exactField = fields.find((field) => field.value === normalizedQuery);
  const queryTerms = normalizedQuery.split(' ');

  if (queryTerms.length === 1 && exactField) {
    return 100 + exactField.weight;
  }

  let score = 0;

  for (const term of queryTerms) {
    let bestMatch = 0;

    for (const field of fields) {
      if (field.value.includes(normalizedQuery)) {
        bestMatch = Math.max(bestMatch, 70 + field.weight);
      }

      for (const word of field.value.split(' ')) {
        if (!word) continue;

        if (word === term) {
          bestMatch = Math.max(bestMatch, 58 + field.weight);
        } else if (word.startsWith(term)) {
          bestMatch = Math.max(bestMatch, 45 + field.weight);
        } else if (word.includes(term)) {
          bestMatch = Math.max(bestMatch, 35 + field.weight);
        } else if (term.length >= 3 && word.length >= 3) {
          const distanceLimit = Math.min(term.length, word.length) >= 7 ? 2 : 1;
          const distance = editDistance(term, word, distanceLimit);
          if (distance <= distanceLimit) {
            bestMatch = Math.max(bestMatch, 28 + field.weight - distance * 4);
          }
        }
      }
    }

    if (bestMatch === 0) {
      return 0;
    }

    score += bestMatch;
  }

  return score;
};

export const getToolGameGroup = (tool: ToolDefinition): ToolGameFilter | null => {
  if (tool.category !== 'gaming') {
    return null;
  }

  if (tool.id === 'gta-cheat-codes') {
    return 'gta';
  }

  if (tool.id === 'cs2-crosshair-codes' || tool.id.startsWith('cs2-')) {
    return 'cs2';
  }

  return 'other';
};

const matchesCategory = (tool: ToolDefinition, category: ToolCategoryFilter): boolean => {
  if (category === 'all') {
    return true;
  }

  if (category === 'technical') {
    return technicalCategories.has(tool.category);
  }

  return tool.category === category;
};

const matchesGame = (tool: ToolDefinition, game: ToolGameFilter): boolean =>
  game === 'all' || getToolGameGroup(tool) === game;

export const filterToolsCatalog = (
  tools: ToolDefinition[],
  filters: ToolCatalogFilters,
): ToolDefinition[] =>
  tools.filter((tool) => {
    if (filters.query && getToolSearchScore(tool, filters.query) === 0) {
      return false;
    }

    return matchesCategory(tool, filters.category) && matchesGame(tool, filters.game);
  });

export const sortToolsCatalog = (
  tools: ToolDefinition[],
  query: string,
  popularity: Readonly<Record<string, number>> = {},
): ToolDefinition[] =>
  [...tools].sort((left, right) => {
    const searchDifference =
      (query ? getToolSearchScore(right, query) : 0) -
      (query ? getToolSearchScore(left, query) : 0);

    if (searchDifference !== 0) {
      return searchDifference;
    }

    const popularityDifference = (popularity[right.id] ?? 0) - (popularity[left.id] ?? 0);
    return popularityDifference || left.name.localeCompare(right.name);
  });

export const isToolCategoryFilter = (value: string): value is ToolCategoryFilter =>
  ['all', 'technical', 'gaming', 'utility', 'crypto', 'dev', 'documents'].includes(value);

export const isToolGameFilter = (value: string): value is ToolGameFilter =>
  ['all', 'cs2', 'gta', 'other'].includes(value);

export const isTechnicalToolCategory = (category: ToolCategory): boolean =>
  technicalCategories.has(category);
