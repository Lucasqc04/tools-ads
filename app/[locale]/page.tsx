import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { ToolCatalogExplorer } from '@/components/tools/tool-catalog-explorer';
import { getLocalizedToolsRegistry } from '@/data/tools-registry';
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
    technical: 'Tecnicas',
    gaming: 'Jogos',
    utility: 'Utilitarios',
    crypto: 'Cripto',
    dev: 'Dev',
    documents: 'Documentos e Midia',
  },
  en: {
    all: 'All categories',
    technical: 'Technical',
    gaming: 'Gaming',
    utility: 'Utilities',
    crypto: 'Crypto',
    dev: 'Dev',
    documents: 'Documents and Media',
  },
  es: {
    all: 'Todas las categorias',
    technical: 'Tecnicas',
    gaming: 'Juegos',
    utility: 'Utilidades',
    crypto: 'Cripto',
    dev: 'Dev',
    documents: 'Documentos y Media',
  },
} satisfies Record<string, Record<ToolCategoryFilter, string>>;

const gameLabels = {
  'pt-br': {
    all: 'Todos os jogos',
    cs2: 'Counter-Strike 2',
    gta: 'GTA',
    other: 'Outros jogos',
  },
  en: {
    all: 'All games',
    cs2: 'Counter-Strike 2',
    gta: 'GTA',
    other: 'Other games',
  },
  es: {
    all: 'Todos los juegos',
    cs2: 'Counter-Strike 2',
    gta: 'GTA',
    other: 'Otros juegos',
  },
} satisfies Record<string, Record<ToolGameFilter, string>>;

const sectionLabels = {
  'pt-br': {
    technical: 'Ferramentas tecnicas',
    gaming: 'Ferramentas de jogos',
    utility: 'Ferramentas utilitarias',
  },
  en: {
    technical: 'Technical tools',
    gaming: 'Gaming tools',
    utility: 'Utility tools',
  },
  es: {
    technical: 'Herramientas tecnicas',
    gaming: 'Herramientas de juegos',
    utility: 'Herramientas utilitarias',
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

  const labelsCategory = categoryLabels[locale];
  const labelsGame = gameLabels[locale];
  const labelsSection = sectionLabels[locale];

  return (
    <Container className="py-10 md:py-14">
      <section className="max-w-reading space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
          {dictionary.home.h1}
        </h1>
        <p className="text-lg leading-8 text-slate-700">{dictionary.home.intro}</p>
      </section>

      <section className="mt-10" aria-labelledby="featured-tools-title">
        <div className="mb-5 flex items-end justify-between gap-3">
          <h2
            id="featured-tools-title"
            className="text-2xl font-bold tracking-tight text-slate-900"
          >
            {dictionary.home.featuredToolsTitle}
          </h2>
          <Link href={localizePath(locale, '/tools')} className="text-sm font-semibold">
            {dictionary.home.viewAllTools}
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
          compactGamingWhenIdle
        />
      </section>

      {/* Ads temporariamente desativados
      <div className="mt-10 flex justify-center">
        <MediumRectangleAd />
      </div>
      */}

      <section className="prose-lite mt-12 max-w-reading space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          {dictionary.home.growthTitle}
        </h2>
        <p>{dictionary.home.growthParagraphs[0]}</p>
        <p>{dictionary.home.growthParagraphs[1]}</p>
      </section>
    </Container>
  );
}
