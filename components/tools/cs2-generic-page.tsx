import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/shared/json-ld';
import { Cs2ToolSuite } from '@/components/tools/cs2-tool-suite';
import { ToolPageShell } from '@/components/tools/tool-page-shell';
import { getCs2ToolLocalePathMap, type Cs2ToolId } from '@/data/cs2/tools';
import { getCs2ToolContent } from '@/data/content/cs2-tools';
import {
  getLocalizedRelatedTools,
  getLocalizedToolById,
} from '@/data/tools-registry';
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildSoftwareApplicationJsonLd,
  buildToolWebPageJsonLd,
} from '@/lib/json-ld';
import { localizePath, type AppLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import { buildLocalizedMetadata } from '@/lib/seo';
import { getCs2ToolConfigById } from '@/data/cs2/tools';
import type { ToolDefinition } from '@/types/tool';

export const buildCs2ToolMetadata = (locale: AppLocale, toolId: Cs2ToolId): Metadata => {
  const content = getCs2ToolContent(toolId, locale);

  return buildLocalizedMetadata({
    locale,
    title: content.seoTitle,
    description: content.seoDescription,
    localePaths: getCs2ToolLocalePathMap(toolId),
    keywords: [content.primaryKeyword, ...content.secondaryKeywords],
  });
};

export function Cs2GenericToolPage({ locale, toolId }: Readonly<{ locale: AppLocale; toolId: Cs2ToolId }>) {
  const dictionary = getDictionary(locale);
  const content = getCs2ToolContent(toolId, locale);
  const registryTool = getLocalizedToolById(locale, toolId);

  if (!registryTool) {
    notFound();
  }

  const relatedTools = getLocalizedRelatedTools(locale, toolId);
  const localizedTool: ToolDefinition = {
    ...registryTool,
    ...content,
    canonicalPath: getCs2ToolLocalePathMap(toolId)[locale],
  };

  const softwareCategory = getCs2ToolConfigById(toolId).softwareCategory;

  return (
    <>
      <JsonLd
        data={buildToolWebPageJsonLd({
          name: localizedTool.name,
          description: localizedTool.seoDescription,
          path: localizedTool.canonicalPath,
          locale,
          keywords: [localizedTool.primaryKeyword, ...localizedTool.secondaryKeywords],
        })}
      />

      <JsonLd
        data={buildSoftwareApplicationJsonLd({
          name: localizedTool.name,
          description: localizedTool.seoDescription,
          path: localizedTool.canonicalPath,
          category: softwareCategory,
        })}
      />

      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: dictionary.common.home, path: localizePath(locale, '/') },
          { name: dictionary.common.tools, path: localizePath(locale, '/tools') },
          { name: localizedTool.name, path: localizedTool.canonicalPath },
        ])}
      />

      <JsonLd data={buildFaqJsonLd(localizedTool.faq)} />

      <ToolPageShell
        locale={locale}
        tool={localizedTool}
        relatedTools={relatedTools}
        toolUi={<Cs2ToolSuite locale={locale} toolId={toolId} />}
      />
    </>
  );
}
