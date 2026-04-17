import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { buildLocalePathMap, localizePath } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import { resolveLocale } from '@/lib/i18n/resolve-locale';
import { buildLocalizedMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site-config';

type ContactPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: ContactPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = getDictionary(locale);

  return buildLocalizedMetadata({
    locale,
    title: dictionary.seo.contact.title,
    description: dictionary.seo.contact.description,
    localePaths: buildLocalePathMap('/contact'),
    keywords: dictionary.seo.contact.keywords,
  });
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = getDictionary(locale);

  return (
    <Container className="py-8 md:py-10">
      <Breadcrumbs
        items={[
          { name: dictionary.common.home, href: localizePath(locale, '/') },
          { name: dictionary.common.contact },
        ]}
      />
      <article className="prose-lite max-w-reading space-y-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          {dictionary.contact.h1}
        </h1>
        <p>{dictionary.contact.intro}</p>

        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          {dictionary.contact.emailTitle}
        </h2>
        <p>
          <Link href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</Link>
        </p>

        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          {dictionary.contact.responseTimeTitle}
        </h2>
        <p>{dictionary.contact.responseTimeParagraph}</p>

        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          {dictionary.contact.bugReportTitle}
        </h2>
        <ul>
          {dictionary.contact.bugReportItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </article>
    </Container>
  );
}
