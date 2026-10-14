import type { Metadata } from 'next';
import { Container } from '@/components/layout/container';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { ToolCatalogExplorer } from '@/components/tools/tool-catalog-explorer';
import { getLocalizedToolsRegistry } from '@/data/tools-registry';
import {
  isToolCategoryFilter,
  isToolGameFilter,
  type ToolCategoryFilter,
  type ToolGameFilter,
} from '@/lib/tools/catalog';
import { buildLocalePathMap, localizePath } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import { getVercelToolPopularity } from '@/lib/analytics/vercel-tool-popularity';
import { resolveLocale } from '@/lib/i18n/resolve-locale';
import { buildLocalizedMetadata } from '@/lib/seo';

type ToolsIndexPageProps = {
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
}: ToolsIndexPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = getDictionary(locale);

  return buildLocalizedMetadata({
    locale,
    title: dictionary.seo.tools.title,
    description: dictionary.seo.tools.description,
    localePaths: buildLocalePathMap('/tools'),
    keywords: dictionary.seo.tools.keywords,
  });
}

export default async function ToolsIndexPage({
  params,
  searchParams,
}: Readonly<ToolsIndexPageProps>) {
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
    <Container className="py-6 md:py-10">
      <Breadcrumbs
        items={[
          { name: dictionary.common.home, href: localizePath(locale, '/') },
          { name: dictionary.common.tools },
        ]}
      />

      <header className="max-w-reading space-y-2">
        <h1 className="text-2xl font-bold leading-tight tracking-tight text-slate-900 md:text-4xl">
          {dictionary.toolsIndex.h1}
        </h1>
        <p className="text-sm leading-6 text-slate-700 md:text-base md:leading-7">
          {dictionary.toolsIndex.intro}
        </p>
      </header>

      <div className="mt-5" aria-label="Available tools">
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
          showSearchLabel
          showQuerySuffix
        />
      </div>

      {/* Ads temporariamente desativados
      <div className="mt-8 flex justify-center">
        <MediumRectangleAd />
      </div>
      */}

    </Container>
  );
}
