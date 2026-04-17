import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/shared/json-ld';
import { CryptoConversionLinks } from '@/components/tools/crypto-conversion-links';
import { CryptoUnitConverterTool } from '@/components/tools/crypto-unit-converter';
import { ToolPageShell } from '@/components/tools/tool-page-shell';
import {
  getCryptoConversionPathByVariant,
  getCryptoConversionResolutionBySlug,
  getCryptoConversionStaticParams,
  getRelatedCryptoConversionPages,
  toCryptoConversionLink,
} from '@/data/crypto-conversion-pages';
import { getRelatedTools, getToolBySlug } from '@/data/tools-registry';
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildSoftwareApplicationJsonLd,
  buildToolWebPageJsonLd,
} from '@/lib/json-ld';
import { buildMetadata } from '@/lib/seo';
import { makeAbsoluteUrl } from '@/lib/site-config';
import type { ToolDefinition } from '@/types/tool';

export const dynamicParams = false;

export function generateStaticParams() {
  return getCryptoConversionStaticParams();
}

type ConversionLandingPageProps = {
  params: Promise<{
    conversionSlug: string;
  }>;
};

export async function generateMetadata({
  params,
}: ConversionLandingPageProps): Promise<Metadata> {
  const { conversionSlug } = await params;
  const resolution = getCryptoConversionResolutionBySlug(conversionSlug);

  if (!resolution) {
    return buildMetadata({
      title: 'Conversão cripto não encontrada',
      description:
        'A conversão solicitada não está disponível no momento. Consulte outras opções de conversor de unidades cripto.',
      path: '/tools/crypto-unit-converter',
      keywords: ['conversor de unidades cripto'],
    });
  }

  const conversionPage = resolution.page;

  const metadata = buildMetadata({
    title: conversionPage.seoTitle,
    description: conversionPage.seoDescription,
    path: conversionPage.pathTechnical,
    keywords: conversionPage.keywords,
  });

  return {
    ...metadata,
    alternates: {
      canonical: makeAbsoluteUrl(conversionPage.pathTechnical),
      languages: {
        'pt-BR': makeAbsoluteUrl(conversionPage.pathPtBr),
      },
    },
  };
}

export default async function ConversionLandingPage({
  params,
}: ConversionLandingPageProps) {
  const { conversionSlug } = await params;

  const resolution = getCryptoConversionResolutionBySlug(conversionSlug);
  const baseTool = getToolBySlug('crypto-unit-converter');

  if (!resolution || !baseTool) {
    notFound();
  }

  const conversionPage = resolution.page;
  const slugVariant = resolution.variant;
  const currentPath = getCryptoConversionPathByVariant(conversionPage, slugVariant);

  const relatedTools = getRelatedTools(baseTool.id);
  const relatedConversions = getRelatedCryptoConversionPages(conversionPage.slug, 4).map(
    (page) => toCryptoConversionLink(page, slugVariant),
  );

  const landingTool: ToolDefinition = {
    ...baseTool,
    name: conversionPage.title,
    h1: conversionPage.title,
    intro: conversionPage.intro,
    seoTitle: conversionPage.seoTitle,
    seoDescription: conversionPage.seoDescription,
    canonicalPath: conversionPage.pathTechnical,
    primaryKeyword: conversionPage.keywords[0] ?? baseTool.primaryKeyword,
    secondaryKeywords: conversionPage.keywords.slice(1),
    searchIntent:
      'Usuários que buscam conversão direta entre duas unidades técnicas de um mesmo ativo cripto.',
    contentBlocks: conversionPage.contentBlocks,
    faq: conversionPage.faq,
  };

  return (
    <>
      <JsonLd
        data={buildToolWebPageJsonLd({
          name: landingTool.name,
          description: landingTool.seoDescription,
          path: landingTool.canonicalPath,
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
          { name: 'Home', path: '/' },
          { name: 'Ferramentas', path: '/tools' },
          { name: 'Conversor de Unidades Cripto', path: '/tools/crypto-unit-converter' },
          {
            name: `${conversionPage.fromLabel} para ${conversionPage.toLabel}`,
            path: currentPath,
          },
        ])}
      />

      <JsonLd data={buildFaqJsonLd(landingTool.faq)} />

      <ToolPageShell
        tool={landingTool}
        relatedTools={relatedTools}
        toolUi={
          <CryptoUnitConverterTool
            initialAssetId={conversionPage.assetId}
            initialFromUnitId={conversionPage.fromUnitId}
            initialToUnitId={conversionPage.toUnitId}
          />
        }
        afterToolSection={
          <CryptoConversionLinks
            title="Outras conversões relacionadas"
            description="Links internos leves para combinações próximas e úteis do mesmo contexto técnico."
            links={relatedConversions}
          />
        }
      />
    </>
  );
}
