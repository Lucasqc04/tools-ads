import Link from 'next/link';
import { AdSlotTop } from '@/components/ads/ad-slot-top';
import { Container } from '@/components/layout/container';
import { ToolCard } from '@/components/tools/tool-card';
import { getLocalizedToolsRegistry } from '@/data/tools-registry';
import { buildLocalePathMap, localizePath } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import { resolveLocale } from '@/lib/i18n/resolve-locale';
import { buildLocalizedMetadata } from '@/lib/seo';

import type { Metadata } from 'next';

type HomePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

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

export default async function HomePage({ params }: HomePageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = getDictionary(locale);
  const tools = getLocalizedToolsRegistry(locale);

  return (
    <Container className="py-10 md:py-14">
      <section className="max-w-reading space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
          {dictionary.home.h1}
        </h1>
        <p className="text-lg leading-8 text-slate-700">{dictionary.home.intro}</p>
      </section>

      <div className="mt-6">
        <AdSlotTop />
      </div>

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

        <div className="grid gap-4 md:grid-cols-2">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} locale={locale} />
          ))}
        </div>
      </section>

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
