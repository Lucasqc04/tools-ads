import { notFound } from 'next/navigation';
import { ToolPageShell } from '@/components/tools/tool-page-shell';
import { CryptoUnitConverterTool } from '@/components/tools/crypto-unit-converter';
import { CryptoConversionLinks } from '@/components/tools/crypto-conversion-links';
import { JsonLd } from '@/components/shared/json-ld';
import {
  getFeaturedCryptoConversionPages,
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

const toolSlug = 'crypto-unit-converter';
const tool = getToolBySlug(toolSlug);

export const metadata = buildMetadata({
  title: tool?.seoTitle ?? 'Conversor de Unidades Cripto',
  description:
    tool?.seoDescription ??
    'Converta unidades de BTC, ETH e USDT localmente no navegador.',
  path: tool?.canonicalPath ?? '/tools/crypto-unit-converter',
  keywords: tool
    ? [tool.primaryKeyword, ...tool.secondaryKeywords]
    : ['conversor de satoshi', 'btc para satoshi'],
});

export default function CryptoUnitConverterPage() {
  if (!tool) {
    notFound();
  }

  const related = getRelatedTools(tool.id);
  const featuredConversionLinks = getFeaturedCryptoConversionPages(4).map((page) =>
    toCryptoConversionLink(page, 'ptBr'),
  );

  return (
    <>
      <JsonLd data={buildToolWebPageJsonLd({ name: tool.name, description: tool.seoDescription, path: tool.canonicalPath, keywords: [tool.primaryKeyword, ...tool.secondaryKeywords] })} />
      <JsonLd data={buildSoftwareApplicationJsonLd({ name: tool.name, description: tool.seoDescription, path: tool.canonicalPath, category: 'FinanceApplication' })} />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Ferramentas', path: '/tools' },
          { name: tool.name, path: tool.canonicalPath },
        ])}
      />
      <JsonLd data={buildFaqJsonLd(tool.faq)} />

      <ToolPageShell
        tool={tool}
        relatedTools={related}
        toolUi={<CryptoUnitConverterTool />}
        afterToolSection={
          <CryptoConversionLinks
            title="Conversões populares"
            description="Páginas específicas de alta intenção para consultas diretas como gwei para ETH, sat para BTC e lamport para SOL."
            links={featuredConversionLinks}
          />
        }
      />
    </>
  );
}
