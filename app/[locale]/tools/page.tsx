import type { Metadata } from 'next';
import { Container } from '@/components/layout/container';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { ToolCatalogSections } from '@/components/tools/tool-catalog-sections';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { getLocalizedToolsRegistry } from '@/data/tools-registry';
import {
  filterToolsCatalog,
  isToolCategoryFilter,
  isToolGameFilter,
  type ToolCategoryFilter,
  type ToolGameFilter,
} from '@/lib/tools/catalog';
import { buildLocalePathMap, localizePath } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
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

  const filteredTools = filterToolsCatalog(tools, {
    query,
    category,
    game,
  });

  const labelsCategory = categoryLabels[locale];
  const labelsGame = gameLabels[locale];
  const labelsSection = sectionLabels[locale];
  const shouldCompactGaming = !query && category === 'all' && game === 'all';

  let querySuffix = '';
  if (query) {
    querySuffix = locale === 'en' ? ` for "${query}"` : ` para "${query}"`;
  }

  return (
    <Container className="py-8 md:py-10">
      <Breadcrumbs
        items={[
          { name: dictionary.common.home, href: localizePath(locale, '/') },
          { name: dictionary.common.tools },
        ]}
      />

      <header className="max-w-reading space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          {dictionary.toolsIndex.h1}
        </h1>
        <p className="text-base leading-7 text-slate-700 md:text-lg">
          {dictionary.toolsIndex.intro}
        </p>
      </header>

      <form method="get" className="mt-6 flex flex-col gap-2 md:max-w-lg">
        <label htmlFor="search-tools" className="text-sm font-semibold text-slate-800">
          {dictionary.toolsIndex.searchLabel}
        </label>
        <div className="flex flex-col gap-2 md:flex-row">
          <Input
            id="search-tools"
            name="search"
            defaultValue={query}
            placeholder={dictionary.toolsIndex.searchPlaceholder}
          />
          <Select name="category" defaultValue={category}>
            <option value="all">{labelsCategory.all}</option>
            <option value="technical">{labelsCategory.technical}</option>
            <option value="gaming">{labelsCategory.gaming}</option>
            <option value="utility">{labelsCategory.utility}</option>
            <option value="crypto">{labelsCategory.crypto}</option>
            <option value="dev">{labelsCategory.dev}</option>
            <option value="documents">{labelsCategory.documents}</option>
          </Select>
          <Select name="game" defaultValue={game}>
            <option value="all">{labelsGame.all}</option>
            <option value="cs2">{labelsGame.cs2}</option>
            <option value="gta">{labelsGame.gta}</option>
            <option value="other">{labelsGame.other}</option>
          </Select>
          <Button type="submit" variant="secondary">
            {dictionary.toolsIndex.searchButton}
          </Button>
        </div>
      </form>

      <p className="mt-4 text-sm text-slate-600">
        {filteredTools.length} {dictionary.toolsIndex.resultsLabel}
        {querySuffix}.
      </p>

      <div className="mt-6" aria-label="Available tools">
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
      </div>

      {/* Ads temporariamente desativados
      <div className="mt-8 flex justify-center">
        <MediumRectangleAd />
      </div>
      */}

      {filteredTools.length === 0 ? (
        <p className="mt-4 text-sm text-slate-700">
          {dictionary.toolsIndex.emptyMessage}{' '}
          {dictionary.toolsIndex.emptyHints.map((hint, index) => (
            <span key={hint} className="font-semibold">
              {index > 0 ? ', ' : ''}
              {hint}
            </span>
          ))}
          .
        </p>
      ) : null}
    </Container>
  );
}
