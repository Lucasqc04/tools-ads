import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/shared/json-ld';
import { CryptoConversionLinks } from '@/components/tools/crypto-conversion-links';
import { CryptoUnitConverterTool } from '@/components/tools/crypto-unit-converter';
import { ToolPageShell } from '@/components/tools/tool-page-shell';
import {
  getCryptoConversionLocalePathMap,
  getCryptoConversionPathByVariant,
  getCryptoConversionResolutionBySlug,
  getCryptoConversionStaticParams,
  getLocalizedCryptoConversionContent,
  getRelatedCryptoConversionPages,
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
import { localizePath, locales } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import { resolveLocale } from '@/lib/i18n/resolve-locale';
import { buildLocalizedMetadata } from '@/lib/seo';
import type { ToolDefinition } from '@/types/tool';

export const dynamicParams = false;

export function generateStaticParams() {
  const slugs = getCryptoConversionStaticParams();

  return locales.flatMap((locale) =>
    slugs.map((item) => ({
      locale,
      conversionSlug: item.conversionSlug,
    })),
  );
}

type ConversionLandingPageProps = {
  params: Promise<{
    locale: string;
    conversionSlug: string;
  }>;
};

export async function generateMetadata({
  params,
}: ConversionLandingPageProps): Promise<Metadata> {
  const { locale: localeParam, conversionSlug } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = getDictionary(locale);
  const resolution = getCryptoConversionResolutionBySlug(conversionSlug);

  if (!resolution) {
    return buildLocalizedMetadata({
      locale,
      title: dictionary.seo.cryptoConversionNotFound.title,
      description: dictionary.seo.cryptoConversionNotFound.description,
      localePaths: {
        'pt-br': localizePath('pt-br', '/tools/crypto-unit-converter'),
        en: localizePath('en', '/tools/crypto-unit-converter'),
        es: localizePath('es', '/tools/crypto-unit-converter'),
      },
      keywords: dictionary.seo.cryptoConversionNotFound.keywords,
    });
  }

  const conversionPage = resolution.page;
  const localized = getLocalizedCryptoConversionContent(conversionPage, locale);

  return buildLocalizedMetadata({
    locale,
    title: localized.seoTitle,
    description: localized.seoDescription,
    localePaths: getCryptoConversionLocalePathMap(conversionPage),
    keywords: localized.keywords,
  });
}

export default async function ConversionLandingPage({
  params,
}: ConversionLandingPageProps) {
  const { locale: localeParam, conversionSlug } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = getDictionary(locale);

  const resolution = getCryptoConversionResolutionBySlug(conversionSlug);
  const baseTool = getLocalizedToolBySlug(locale, 'crypto-unit-converter');

  if (!resolution || !baseTool) {
    notFound();
  }

  const conversionPage = resolution.page;
  const localized = getLocalizedCryptoConversionContent(conversionPage, locale);

  const currentPath = localizePath(
    locale,
    getCryptoConversionPathByVariant(conversionPage, resolution.variant),
  );

  const relatedTools = getLocalizedRelatedTools(locale, baseTool.id);
  const relatedConversions = getRelatedCryptoConversionPages(conversionPage.slug, 4).map(
    (page) => toLocalizedCryptoConversionLink(page, locale),
  );

  const landingTool: ToolDefinition = {
    ...baseTool,
    name: localized.title,
    h1: localized.title,
    intro: localized.intro,
    seoTitle: localized.seoTitle,
    seoDescription: localized.seoDescription,
    canonicalPath: getCryptoConversionLocalePathMap(conversionPage)[locale],
    primaryKeyword: localized.keywords[0] ?? baseTool.primaryKeyword,
    secondaryKeywords: localized.keywords.slice(1),
    searchIntent: dictionary.toolShell.conversionSearchIntent,
    contentBlocks: localized.contentBlocks,
    faq: localized.faq,
  };

  return (
    <>
      <JsonLd
        data={buildToolWebPageJsonLd({
          name: landingTool.name,
          description: landingTool.seoDescription,
          path: landingTool.canonicalPath,
          locale,
          keywords: [landingTool.primaryKeyword, ...landingTool.secondaryKeywords],
        })}
      />

      <JsonLd
        data={buildSoftwareApplicationJsonLd({
          name: landingTool.name,
          description: landingTool.seoDescription,
          path: landingTool.canonicalPath,
          category: 'FinanceApplication',
        })}
      />

      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: dictionary.common.home, path: localizePath(locale, '/') },
          { name: dictionary.common.tools, path: localizePath(locale, '/tools') },
          {
            name: dictionary.toolShell.conversionBreadcrumbLabel,
            path: localizePath(locale, '/tools/crypto-unit-converter'),
          },
          {
            name: `${conversionPage.fromLabel} ${dictionary.qrToolUi.fromToConnector} ${conversionPage.toLabel}`,
            path: currentPath,
          },
        ])}
      />

      <JsonLd data={buildFaqJsonLd(landingTool.faq)} />

      <ToolPageShell
        locale={locale}
        tool={landingTool}
        relatedTools={relatedTools}
        toolUi={
          <CryptoUnitConverterTool
            locale={locale}
            initialAssetId={conversionPage.assetId}
            initialFromUnitId={conversionPage.fromUnitId}
            initialToUnitId={conversionPage.toUnitId}
          />
        }
        afterToolSection={
          <CryptoConversionLinks
            title={dictionary.toolShell.cryptoRelatedTitle}
            description={dictionary.toolShell.cryptoRelatedDescription}
            fromToConnector={dictionary.qrToolUi.fromToConnector}
            links={relatedConversions}
          />
        }
      />
    </>
  );
}
