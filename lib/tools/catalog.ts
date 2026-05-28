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

const normalize = (value: string): string => value.trim().toLowerCase();

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

const matchesSearch = (tool: ToolDefinition, normalizedQuery: string): boolean => {
  if (!normalizedQuery) {
    return true;
  }

  const haystack = [
    tool.name,
    tool.shortDescription,
    tool.primaryKeyword,
    ...tool.secondaryKeywords,
  ]
    .join(' ')
    .toLowerCase();

  return haystack.includes(normalizedQuery);
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

const matchesGame = (tool: ToolDefinition, game: ToolGameFilter): boolean => {
  if (game === 'all') {
    return true;
  }

  return getToolGameGroup(tool) === game;
};

export const filterToolsCatalog = (
  tools: ToolDefinition[],
  filters: ToolCatalogFilters,
): ToolDefinition[] => {
  const normalizedQuery = normalize(filters.query);

  return tools.filter((tool) => {
    if (!matchesSearch(tool, normalizedQuery)) {
      return false;
    }

    if (!matchesCategory(tool, filters.category)) {
      return false;
    }

    if (!matchesGame(tool, filters.game)) {
      return false;
    }

    return true;
  });
};

export const isToolCategoryFilter = (value: string): value is ToolCategoryFilter =>
  [
    'all',
    'technical',
    'gaming',
    'utility',
    'crypto',
    'dev',
    'documents',
  ].includes(value);

export const isToolGameFilter = (value: string): value is ToolGameFilter =>
  ['all', 'cs2', 'gta', 'other'].includes(value);

export const isTechnicalToolCategory = (category: ToolCategory): boolean =>
  technicalCategories.has(category);
