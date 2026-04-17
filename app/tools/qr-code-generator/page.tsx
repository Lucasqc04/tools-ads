import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/shared/json-ld';
import { QrCodeGeneratorTool } from '@/components/tools/qr-code-generator';
import { ToolPageShell } from '@/components/tools/tool-page-shell';
import { getRelatedTools, getToolBySlug } from '@/data/tools-registry';
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildSoftwareApplicationJsonLd,
  buildToolWebPageJsonLd,
} from '@/lib/json-ld';
import { buildMetadata } from '@/lib/seo';

const toolSlug = 'qr-code-generator';
const tool = getToolBySlug(toolSlug);

export const metadata = buildMetadata({
  title: tool?.seoTitle ?? 'Gerador de QR Code Grátis e Sem Cadastro',
  description:
    tool?.seoDescription ??
    'Gere QR Code online grátis, sem cadastro e sem login, com logo central e exportação em PNG, JPEG, SVG e PDF.',
  path: tool?.canonicalPath ?? '/tools/qr-code-generator',
  keywords: tool
    ? [tool.primaryKeyword, ...tool.secondaryKeywords]
    : ['gerador de qr code gratis', 'qr code sem cadastro'],
});

export default function QrCodeGeneratorPage() {
  if (!tool) {
    notFound();
  }

  const related = getRelatedTools(tool.id);

  return (
    <>
      <JsonLd
        data={buildToolWebPageJsonLd({
          name: tool.name,
          description: tool.seoDescription,
          path: tool.canonicalPath,
          keywords: [tool.primaryKeyword, ...tool.secondaryKeywords],
        })}
      />

      <JsonLd
        data={buildSoftwareApplicationJsonLd({
          name: tool.name,
          description: tool.seoDescription,
          path: tool.canonicalPath,
          category: 'UtilitiesApplication',
        })}
      />

      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Ferramentas', path: '/tools' },
          { name: tool.name, path: tool.canonicalPath },
        ])}
      />

      <JsonLd data={buildFaqJsonLd(tool.faq)} />

      <ToolPageShell tool={tool} relatedTools={related} toolUi={<QrCodeGeneratorTool />} />
    </>
  );
}
