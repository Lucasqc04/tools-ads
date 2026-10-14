'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { ToolCard } from '@/components/tools/tool-card';
import { ToolCatalogSections } from '@/components/tools/tool-catalog-sections';
import type { AppLocale } from '@/lib/i18n/config';
import { localizePath } from '@/lib/i18n/config';
import {
  filterToolsCatalog,
  sortToolsCatalog,
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
  labelsCategory: Record<ToolCategoryFilter, string> & { allShort: string };
  labelsGame: Record<ToolGameFilter, string> & { allShort: string };
  labelsSection: {
    technical: string;
    gaming: string;
    utility: string;
  };
  searchLabel: string;
  searchPlaceholder: string;
  resultsLabel: {
    singular: string;
    plural: string;
    catalog: string;
    showing: string;
  };
  emptyMessage: string;
  emptyHints: string[];
  sectionHeadingLevel?: 2 | 3;
  showSearchLabel?: boolean;
  showQuerySuffix?: boolean;
  isHome?: boolean;
  popularity?: Readonly<Record<string, number>>;
  viewAllLabel?: string;
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
  sectionHeadingLevel = 2,
  showSearchLabel = false,
  showQuerySuffix = false,
  isHome = false,
  popularity,
  viewAllLabel,
}: ToolCatalogExplorerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<ToolCategoryFilter>(initialCategory);
  const [game, setGame] = useState<ToolGameFilter>(
    initialCategory === 'all' || initialCategory === 'gaming' ? initialGame : 'all',
  );

  const trimmedQuery = query.trim();
  const filteredTools = useMemo(
    () => filterToolsCatalog(tools, { query: trimmedQuery, category, game }),
    [tools, trimmedQuery, category, game],
  );
  const sortedTools = useMemo(
    () => sortToolsCatalog(filteredTools, trimmedQuery, popularity),
    [filteredTools, trimmedQuery, popularity],
  );
  const visibleLimit = isHome ? (trimmedQuery ? 12 : 8) : sortedTools.length;
  const visibleTools = sortedTools.slice(0, visibleLimit);

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

  const showGameFilter = category === 'all' || category === 'gaming';
  const querySuffix =
    showQuerySuffix && trimmedQuery
      ? locale === 'en'
        ? ` for "${trimmedQuery}"`
        : ` para "${trimmedQuery}"`
      : '';

  const handleCategoryChange = (value: string) => {
    const nextCategory = value as ToolCategoryFilter;
    setCategory(nextCategory);
    if (nextCategory !== 'all' && nextCategory !== 'gaming') {
      setGame('all');
    }
  };

  const fullCatalogParams = new URLSearchParams();
  if (trimmedQuery) fullCatalogParams.set('search', trimmedQuery);
  if (category !== 'all') fullCatalogParams.set('category', category);
  if (game !== 'all') fullCatalogParams.set('game', game);
  const fullCatalogQuery = fullCatalogParams.toString();
  const fullCatalogPath = localizePath(locale, '/tools');
  const fullCatalogHref = fullCatalogQuery
    ? `${fullCatalogPath}?${fullCatalogQuery}`
    : fullCatalogPath;

  return (
    <div className="space-y-5 md:space-y-7">
      <div className="space-y-2">
        {showSearchLabel ? (
          <label htmlFor="search-tools" className="block text-sm font-semibold text-slate-800">
            {searchLabel}
          </label>
        ) : null}
        <div
          className={
            showGameFilter
              ? 'grid grid-cols-2 gap-2 lg:grid-cols-[minmax(0,1.4fr)_minmax(190px,0.8fr)_minmax(180px,0.75fr)]'
              : 'grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(240px,0.55fr)]'
          }
        >
          <Input
            id="search-tools"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder}
            autoComplete="off"
            aria-label={showSearchLabel ? undefined : searchLabel}
            className={showGameFilter ? 'col-span-2 lg:col-span-1' : undefined}
          />
          <Select
            value={category}
            onChange={(event) => handleCategoryChange(event.target.value)}
            aria-label={labelsCategory.all}
          >
            <option value="all">{labelsCategory.allShort}</option>
            <option value="technical">{labelsCategory.technical}</option>
            <option value="gaming">{labelsCategory.gaming}</option>
            <option value="utility">{labelsCategory.utility}</option>
            <option value="crypto">{labelsCategory.crypto}</option>
            <option value="dev">{labelsCategory.dev}</option>
            <option value="documents">{labelsCategory.documents}</option>
          </Select>
          {showGameFilter ? (
            <Select
              value={game}
              onChange={(event) => setGame(event.target.value as ToolGameFilter)}
              aria-label={labelsGame.all}
            >
              <option value="all">{labelsGame.allShort}</option>
              <option value="cs2">{labelsGame.cs2}</option>
              <option value="gta">{labelsGame.gta}</option>
              <option value="other">{labelsGame.other}</option>
            </Select>
          ) : null}
        </div>
      </div>

      <p className="text-sm text-slate-600" aria-live="polite" aria-atomic="true">
        {isHome && filteredTools.length > visibleTools.length ? (
          <>
            <strong className="text-slate-900">{visibleTools.length}</strong> {resultsLabel.showing}{' '}
            <strong className="text-slate-900">{filteredTools.length}</strong> {resultsLabel.plural}
          </>
        ) : (
          <>
            <strong className="text-slate-900">{filteredTools.length}</strong>{' '}
            {filteredTools.length === 1 ? resultsLabel.singular : resultsLabel.plural}
          </>
        )}
        {querySuffix}.
      </p>

      {isHome ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {visibleTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} locale={locale} headingLevel={3} />
          ))}
        </div>
      ) : (
        <ToolCatalogSections
          tools={visibleTools}
          locale={locale}
          headingLevel={sectionHeadingLevel}
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
      )}

      {filteredTools.length === 0 ? (
        <p className="text-sm text-slate-700" role="status">
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

      {isHome &&
      (trimmedQuery || category !== 'all' || game !== 'all') &&
      filteredTools.length > visibleTools.length &&
      viewAllLabel ? (
        <Link
          href={fullCatalogHref}
          className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 transition-colors hover:text-brand-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
        >
          {viewAllLabel}
          <span aria-hidden="true">↗</span>
        </Link>
      ) : null}
    </div>
  );
}
