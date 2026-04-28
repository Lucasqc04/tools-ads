import type { Metadata } from 'next';
import { Container } from '@/components/layout/container';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { ToolCard } from '@/components/tools/tool-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getLocalizedToolsRegistry } from '@/data/tools-registry';
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
  }>;
};

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
}: ToolsIndexPageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = getDictionary(locale);

  const resolvedSearchParams = await searchParams;
  const query =
    typeof resolvedSearchParams?.search === 'string'
      ? resolvedSearchParams.search.trim()
      : '';
  const normalizedQuery = query.toLowerCase();

  const tools = getLocalizedToolsRegistry(locale);

  const filteredTools = normalizedQuery
    ? tools.filter((tool) => {
        const haystack = [
          tool.name,
          tool.shortDescription,
          tool.primaryKeyword,
          ...tool.secondaryKeywords,
        ]
          .join(' ')
          .toLowerCase();

        return haystack.includes(normalizedQuery);
      })
    : tools;

  const querySuffix = query
    ? locale === 'pt-br'
      ? ` para "${query}"`
      : locale === 'es'
        ? ` para "${query}"`
        : ` for "${query}"`
    : '';

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
        <div className="flex gap-2">
          <Input
            id="search-tools"
            name="search"
            defaultValue={query}
            placeholder={dictionary.toolsIndex.searchPlaceholder}
          />
          <Button type="submit" variant="secondary">
            {dictionary.toolsIndex.searchButton}
          </Button>
        </div>
      </form>

      <p className="mt-4 text-sm text-slate-600">
        {filteredTools.length} {dictionary.toolsIndex.resultsLabel}
        {querySuffix}.
      </p>

      <section
        className="mt-6 grid gap-4 md:grid-cols-2"
        aria-label="Available tools"
      >
        {filteredTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} locale={locale} />
        ))}
      </section>

      {/* Ads temporariamente desativados
      <div className="mt-8 flex justify-center">
        <MediumRectangleAd />
      </div>
      */}

      {!filteredTools.length ? (
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
