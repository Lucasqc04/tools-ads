import type { Metadata } from 'next';
import { Container } from '@/components/layout/container';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { buildLocalePathMap, localizePath } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import { resolveLocale } from '@/lib/i18n/resolve-locale';
import { buildLocalizedMetadata } from '@/lib/seo';

type PrivacyPolicyPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: PrivacyPolicyPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = getDictionary(locale);

  return buildLocalizedMetadata({
    locale,
    title: dictionary.seo.privacy.title,
    description: dictionary.seo.privacy.description,
    localePaths: buildLocalePathMap('/privacy-policy'),
    keywords: dictionary.seo.privacy.keywords,
  });
}

export default async function PrivacyPolicyPage({ params }: PrivacyPolicyPageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = getDictionary(locale);

  return (
    <Container className="py-8 md:py-10">
      <Breadcrumbs
        items={[
          { name: dictionary.common.home, href: localizePath(locale, '/') },
          { name: dictionary.common.privacyPolicy },
        ]}
      />
      <article className="prose-lite max-w-reading space-y-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          {dictionary.privacy.h1}
        </h1>
        <p>{dictionary.privacy.intro}</p>

        {/* Ads temporariamente desativados
        <div className="flex justify-center py-2">
          <MediumRectangleAd />
        </div>
        */}

        {dictionary.privacy.sections.map((section) => (
          <section key={section.title} className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              {section.title}
            </h2>
            <p>{section.body}</p>
          </section>
        ))}
      </article>
    </Container>
  );
}
