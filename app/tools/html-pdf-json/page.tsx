import { notFound } from 'next/navigation';
import { ToolPageShell } from '@/components/tools/tool-page-shell';
import { HtmlPdfJsonTool } from '@/components/tools/html-pdf-json-tool';
import { JsonLd } from '@/components/shared/json-ld';
import { getRelatedTools, getToolBySlug } from '@/data/tools-registry';
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildSoftwareApplicationJsonLd,
  buildToolWebPageJsonLd,
} from '@/lib/json-ld';
import { buildMetadata } from '@/lib/seo';

const toolSlug = 'html-pdf-json';
const tool = getToolBySlug(toolSlug);

export const metadata = buildMetadata({
  title: tool?.seoTitle ?? 'HTML Viewer, PDF Viewer e JSON Formatter',
  description:
    tool?.seoDescription ??
    'Visualize HTML, abra PDF local e formate JSON sem enviar arquivos para servidor.',
  path: tool?.canonicalPath ?? '/tools/html-pdf-json',
  keywords: tool
    ? [tool.primaryKeyword, ...tool.secondaryKeywords]
    : ['formatador json online', 'visualizador html'],
});

export default function HtmlPdfJsonPage() {
  if (!tool) {
    notFound();
  }

  const related = getRelatedTools(tool.id);

  return (
    <>
      <JsonLd data={buildToolWebPageJsonLd({ name: tool.name, description: tool.seoDescription, path: tool.canonicalPath, keywords: [tool.primaryKeyword, ...tool.secondaryKeywords] })} />
      <JsonLd data={buildSoftwareApplicationJsonLd({ name: tool.name, description: tool.seoDescription, path: tool.canonicalPath, category: 'DeveloperApplication' })} />
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
        toolUi={<HtmlPdfJsonTool />}
      />
    </>
  );
}
