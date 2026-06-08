'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { ToolCatalogSections } from '@/components/tools/tool-catalog-sections';
import type { AppLocale } from '@/lib/i18n/config';
import {
  filterToolsCatalog,
  type ToolCategoryFilter,
  type ToolGameFilter,
} from '@/lib/tools/catalog';
import type { ToolDefinition } from '@/types/tool';

type ToolCatalogExplorerProps = Readonly<{
  tools: ToolDefinition[];
  locale: AppLocale;
  initialQuery: string;
  initialCategory: ToolCategoryFilter;
  initialGame: ToolGameFilter;
  labelsCategory: Record<ToolCategoryFilter, string>;
  labelsGame: Record<ToolGameFilter, string>;
  labelsSection: {
    technical: string;
    gaming: string;
    utility: string;
  };
  searchLabel: string;
  searchPlaceholder: string;
  resultsLabel: string;
  emptyMessage: string;
  emptyHints: string[];
  showSearchLabel?: boolean;
  showQuerySuffix?: boolean;
  compactGamingWhenIdle?: boolean;
}>;

export function ToolCatalogExplorer({
  tools,
  locale,
  initialQuery,
  initialCategory,
  initialGame,
  labelsCategory,
  labelsGame,
  labelsSection,
  searchLabel,
  searchPlaceholder,
  resultsLabel,
  emptyMessage,
  emptyHints,
  showSearchLabel = false,
  showQuerySuffix = false,
  compactGamingWhenIdle = false,
}: ToolCatalogExplorerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<ToolCategoryFilter>(initialCategory);
  const [game, setGame] = useState<ToolGameFilter>(initialGame);

  const trimmedQuery = query.trim();

  const filteredTools = useMemo(
    () => filterToolsCatalog(tools, { query: trimmedQuery, category, game }),
    [tools, trimmedQuery, category, game],
  );

  useEffect(() => {
    const handle = window.setTimeout(() => {
      const params = new URLSearchParams();
      if (trimmedQuery) params.set('search', trimmedQuery);
      if (category !== 'all') params.set('category', category);
      if (game !== 'all') params.set('game', game);

      const queryString = params.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
    }, 180);

    return () => window.clearTimeout(handle);
  }, [trimmedQuery, category, game, pathname, router]);

  const shouldCompactGaming =
    compactGamingWhenIdle && !trimmedQuery && category === 'all' && game === 'all';

  const querySuffix =
    showQuerySuffix && trimmedQuery
      ? locale === 'en'
        ? ` for "${trimmedQuery}"`
        : ` para "${trimmedQuery}"`
      : '';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:max-w-3xl">
        {showSearchLabel ? (
          <label htmlFor="search-tools" className="text-sm font-semibold text-slate-800">
            {searchLabel}
          </label>
        ) : null}
        <div className="grid gap-2 lg:grid-cols-[minmax(0,1.35fr)_minmax(160px,0.6fr)_minmax(150px,0.55fr)]">
          <Input
            id="search-tools"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder}
            autoComplete="off"
          />
          <Select
            value={category}
            onChange={(event) => setCategory(event.target.value as ToolCategoryFilter)}
            aria-label={labelsCategory.all}
          >
            <option value="all">{labelsCategory.all}</option>
            <option value="technical">{labelsCategory.technical}</option>
            <option value="gaming">{labelsCategory.gaming}</option>
            <option value="utility">{labelsCategory.utility}</option>
            <option value="crypto">{labelsCategory.crypto}</option>
            <option value="dev">{labelsCategory.dev}</option>
            <option value="documents">{labelsCategory.documents}</option>
          </Select>
          <Select
            value={game}
            onChange={(event) => setGame(event.target.value as ToolGameFilter)}
            aria-label={labelsGame.all}
          >
            <option value="all">{labelsGame.all}</option>
            <option value="cs2">{labelsGame.cs2}</option>
            <option value="gta">{labelsGame.gta}</option>
            <option value="other">{labelsGame.other}</option>
          </Select>
        </div>
      </div>

      <p className="text-sm text-slate-600">
        <strong className="text-slate-900">{filteredTools.length}</strong>{' '}
        {resultsLabel}
        {querySuffix}.
      </p>

      <ToolCatalogSections
        tools={filteredTools}
        locale={locale}
        compactGaming={shouldCompactGaming}
        labelsCategory={{
          crypto: labelsCategory.crypto,
          dev: labelsCategory.dev,
          documents: labelsCategory.documents,
        }}
        labelsGame={{
          cs2: labelsGame.cs2,
          gta: labelsGame.gta,
          other: labelsGame.other,
        }}
        labelsSection={labelsSection}
      />

      {filteredTools.length === 0 ? (
        <p className="text-sm text-slate-700">
          {emptyMessage}{' '}
          {emptyHints.map((hint, index) => (
            <span key={hint} className="font-semibold">
              {index > 0 ? ', ' : ''}
              {hint}
            </span>
          ))}
          .
        </p>
      ) : null}
    </div>
  );
}
