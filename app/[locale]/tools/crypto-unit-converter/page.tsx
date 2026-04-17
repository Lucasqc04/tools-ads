import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ToolPageShell } from '@/components/tools/tool-page-shell';
import { CryptoUnitConverterTool } from '@/components/tools/crypto-unit-converter';
import { CryptoConversionLinks } from '@/components/tools/crypto-conversion-links';
import { JsonLd } from '@/components/shared/json-ld';
import {
  getFeaturedCryptoConversionPages,
  toLocalizedCryptoConversionLink,
} from '@/data/crypto-conversion-pages';
import {
  getLocalizedRelatedTools,
  getLocalizedToolBySlug,
} from '@/data/tools-registry';
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildSoftwareApplicationJsonLd,
  buildToolWebPageJsonLd,
} from '@/lib/json-ld';
import { buildLocalePathMap, localizePath } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import { resolveLocale } from '@/lib/i18n/resolve-locale';
import { buildLocalizedMetadata } from '@/lib/seo';

const toolSlug = 'crypto-unit-converter';

type CryptoUnitConverterPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: CryptoUnitConverterPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = getDictionary(locale);
  const tool = getLocalizedToolBySlug(locale, toolSlug);

  return buildLocalizedMetadata({
    locale,
    title: tool?.seoTitle ?? dictionary.seo.cryptoFallback.title,
    description: tool?.seoDescription ?? dictionary.seo.cryptoFallback.description,
    localePaths: buildLocalePathMap('/tools/crypto-unit-converter'),
    keywords: tool
      ? [tool.primaryKeyword, ...tool.secondaryKeywords]
      : dictionary.seo.cryptoFallback.keywords,
  });
}

export default async function CryptoUnitConverterPage({
  params,
}: CryptoUnitConverterPageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = getDictionary(locale);

  const tool = getLocalizedToolBySlug(locale, toolSlug);

  if (!tool) {
    notFound();
  }

  const related = getLocalizedRelatedTools(locale, tool.id);
  const featuredConversionLinks = getFeaturedCryptoConversionPages(4).map((page) =>
    toLocalizedCryptoConversionLink(page, locale),
  );

  return (
    <>
      <JsonLd
        data={buildToolWebPageJsonLd({
          name: tool.name,
          description: tool.seoDescription,
          path: tool.canonicalPath,
          locale,
          keywords: [tool.primaryKeyword, ...tool.secondaryKeywords],
        })}
      />
      <JsonLd
        data={buildSoftwareApplicationJsonLd({
          name: tool.name,
          description: tool.seoDescription,
          path: tool.canonicalPath,
          category: 'FinanceApplication',
        })}
      />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: dictionary.common.home, path: localizePath(locale, '/') },
          { name: dictionary.common.tools, path: localizePath(locale, '/tools') },
          { name: tool.name, path: tool.canonicalPath },
        ])}
      />
      <JsonLd data={buildFaqJsonLd(tool.faq)} />

      <ToolPageShell
        locale={locale}
        tool={tool}
        relatedTools={related}
        toolUi={<CryptoUnitConverterTool locale={locale} />}
        afterToolSection={
          <CryptoConversionLinks
            title={dictionary.toolShell.cryptoPopularTitle}
            description={dictionary.toolShell.cryptoPopularDescription}
            fromToConnector={dictionary.qrToolUi.fromToConnector}
            links={featuredConversionLinks}
          />
        }
      />
    </>
  );
}
