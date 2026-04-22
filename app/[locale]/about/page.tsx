import type { Metadata } from 'next';
import { MediumRectangleAd } from '@/components/ads/network-ads';
import { Container } from '@/components/layout/container';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { buildLocalePathMap, localizePath } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import { resolveLocale } from '@/lib/i18n/resolve-locale';
import { buildLocalizedMetadata } from '@/lib/seo';

type AboutPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = getDictionary(locale);

  return buildLocalizedMetadata({
    locale,
    title: dictionary.seo.about.title,
    description: dictionary.seo.about.description,
    localePaths: buildLocalePathMap('/about'),
    keywords: dictionary.seo.about.keywords,
  });
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = getDictionary(locale);

  return (
    <Container className="py-8 md:py-10">
      <Breadcrumbs
        items={[
          { name: dictionary.common.home, href: localizePath(locale, '/') },
          { name: dictionary.common.about },
        ]}
      />
      <article className="prose-lite max-w-reading space-y-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          {dictionary.about.h1}
        </h1>
        <p>{dictionary.about.intro}</p>

        <div className="flex justify-center py-2">
          <MediumRectangleAd />
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          {dictionary.about.principlesTitle}
        </h2>
        <ul>
          {dictionary.about.principles.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          {dictionary.about.qualityTitle}
        </h2>
        <p>{dictionary.about.qualityParagraph}</p>
      </article>
    </Container>
  );
}
