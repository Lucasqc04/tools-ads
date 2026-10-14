import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { ToolCatalogExplorer } from '@/components/tools/tool-catalog-explorer';
import { getLocalizedToolsRegistry } from '@/data/tools-registry';
import { getVercelToolPopularity } from '@/lib/analytics/vercel-tool-popularity';
import { buildLocalePathMap, localizePath } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import { resolveLocale } from '@/lib/i18n/resolve-locale';
import { buildLocalizedMetadata } from '@/lib/seo';
import {
  isToolCategoryFilter,
  isToolGameFilter,
  type ToolCategoryFilter,
  type ToolGameFilter,
} from '@/lib/tools/catalog';

import type { Metadata } from 'next';

type HomePageProps = {
  params: Promise<{
    locale: string;
  }>;
  searchParams?: Promise<{
    search?: string;
    category?: string;
    game?: string;
  }>;
};

const categoryLabels = {
  'pt-br': {
    all: 'Todas as categorias',
    allShort: 'Categoria',
    technical: 'Técnicas',
    gaming: 'Jogos',
    utility: 'Utilitárias',
    crypto: 'Cripto',
    dev: 'Dev',
    documents: 'Docs e mídia',
  },
  en: {
    all: 'All categories',
    allShort: 'Category',
    technical: 'Technical',
    gaming: 'Gaming',
    utility: 'Utilities',
    crypto: 'Crypto',
    dev: 'Dev',
    documents: 'Docs/media',
  },
  es: {
    all: 'Todas las categorias',
    allShort: 'Categoría',
    technical: 'Técnicas',
    gaming: 'Juegos',
    utility: 'Utilidades',
    crypto: 'Cripto',
    dev: 'Dev',
    documents: 'Docs y medios',
  },
  zh: {
    all: '全部分类',
    allShort: '类别',
    technical: '技术工具',
    gaming: '游戏工具',
    utility: '实用工具',
    crypto: '加密货币',
    dev: '开发工具',
    documents: '文档与媒体',
  },
} satisfies Record<string, Record<ToolCategoryFilter, string> & { allShort: string }>;

const gameLabels = {
  'pt-br': {
    all: 'Todos os jogos',
    allShort: 'Jogo',
    cs2: 'Counter-Strike 2',
    gta: 'GTA',
    other: 'Outros jogos',
  },
  en: {
    all: 'All games',
    allShort: 'Game',
    cs2: 'Counter-Strike 2',
    gta: 'GTA',
    other: 'Other games',
  },
  es: {
    all: 'Todos los juegos',
    allShort: 'Juego',
    cs2: 'Counter-Strike 2',
    gta: 'GTA',
    other: 'Otros juegos',
  },
  zh: {
    all: '全部游戏',
    allShort: '游戏',
    cs2: 'Counter-Strike 2',
    gta: 'GTA',
    other: '其他游戏',
  },
} satisfies Record<string, Record<ToolGameFilter, string> & { allShort: string }>;

const sectionLabels = {
  'pt-br': {
    technical: 'Ferramentas técnicas',
    gaming: 'Ferramentas para jogos',
    utility: 'Ferramentas utilitárias',
  },
  en: {
    technical: 'Technical tools',
    gaming: 'Tools for games',
    utility: 'Everyday utilities',
  },
  es: {
    technical: 'Herramientas técnicas',
    gaming: 'Herramientas para juegos',
    utility: 'Utilidades cotidianas',
  },
  zh: {
    technical: '技术工具',
    gaming: '游戏工具',
    utility: '日常实用工具',
  },
} satisfies Record<string, { technical: string; gaming: string; utility: string }>;

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = getDictionary(locale);

  return buildLocalizedMetadata({
    locale,
    title: dictionary.seo.home.title,
    description: dictionary.seo.home.description,
    localePaths: buildLocalePathMap('/'),
    keywords: dictionary.seo.home.keywords,
  });
}

export default async function HomePage({
  params,
  searchParams,
}: Readonly<HomePageProps>) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = getDictionary(locale);

  const resolvedSearchParams = await searchParams;
  const query =
    typeof resolvedSearchParams?.search === 'string'
      ? resolvedSearchParams.search.trim()
      : '';
  const rawCategory =
    typeof resolvedSearchParams?.category === 'string'
      ? resolvedSearchParams.category
      : 'all';
  const rawGame =
    typeof resolvedSearchParams?.game === 'string' ? resolvedSearchParams.game : 'all';

  const category: ToolCategoryFilter = isToolCategoryFilter(rawCategory)
    ? rawCategory
    : 'all';
  const game: ToolGameFilter = isToolGameFilter(rawGame) ? rawGame : 'all';

  const tools = getLocalizedToolsRegistry(locale);
  const popularity = await getVercelToolPopularity(locale);

  const labelsCategory = categoryLabels[locale];
  const labelsGame = gameLabels[locale];
  const labelsSection = sectionLabels[locale];

  return (
    <Container className="py-4 md:py-8">
      <div className="max-w-4xl">
        <span
          aria-hidden="true"
          className="mb-3 block h-1 w-10 rounded-full bg-brand-600 md:mb-4"
        />
        <h1 className="max-w-4xl text-2xl font-bold leading-tight tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
          {dictionary.home.h1}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-5 text-slate-700 md:mt-3 md:text-base md:leading-7">
          {dictionary.home.intro}
        </p>
      </div>

      <section className="mt-6 md:mt-8" aria-labelledby="catalog-title">
        <div className="mb-3 flex flex-col gap-1.5 sm:flex-row sm:items-end sm:justify-between md:mb-4">
          <h2
            id="catalog-title"
            className="text-lg font-bold tracking-tight text-slate-900 md:text-xl"
          >
            {dictionary.home.catalogTitle}
          </h2>
          <Link
            href={localizePath(locale, '/tools')}
            className="inline-flex w-fit items-center gap-1 rounded-lg py-1 text-sm font-semibold text-brand-700 transition-colors hover:text-brand-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
          >
            {dictionary.home.viewAllTools}
            <span aria-hidden="true">↗</span>
          </Link>
        </div>

        <ToolCatalogExplorer
          tools={tools}
          locale={locale}
          initialQuery={query}
          initialCategory={category}
          initialGame={game}
          labelsCategory={labelsCategory}
          labelsGame={labelsGame}
          labelsSection={labelsSection}
          searchLabel={dictionary.toolsIndex.searchLabel}
          searchPlaceholder={dictionary.toolsIndex.searchPlaceholder}
          resultsLabel={dictionary.toolsIndex.resultsLabel}
          emptyMessage={dictionary.toolsIndex.emptyMessage}
          emptyHints={dictionary.toolsIndex.emptyHints}
          popularity={popularity}
          viewAllLabel={dictionary.home.viewAllTools}
          isHome
          sectionHeadingLevel={3}
        />
      </section>

      {/* Ads temporariamente desativados
      <div className="mt-10 flex justify-center">
        <MediumRectangleAd />
      </div>
      */}

      <section className="prose-lite mt-12 max-w-4xl border-t border-slate-200 pt-8 md:mt-14 md:pt-10">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
          {dictionary.home.guideTitle}
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2 md:gap-8">
          <p>{dictionary.home.guideParagraphs[0]}</p>
          <p>{dictionary.home.guideParagraphs[1]}</p>
        </div>
      </section>
    </Container>
  );
}
