import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/shared/json-ld';
import { Cs2CrosshairCodesTool } from '@/components/tools/cs2-crosshair-codes-tool';
import { ToolPageShell } from '@/components/tools/tool-page-shell';
import { getCs2CrosshairLocalePathMap } from '@/data/cs2/crosshair-pages';
import { getCs2CrosshairCodesContent } from '@/data/content/cs2-crosshair-codes';
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
import { localizePath, type AppLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import { buildLocalizedMetadata } from '@/lib/seo';
import type { ToolDefinition } from '@/types/tool';

const toolSlug = 'cs2-crosshair-codes';

export const buildCs2CrosshairCodesMetadata = (locale: AppLocale): Metadata => {
  const content = getCs2CrosshairCodesContent(locale);

  return buildLocalizedMetadata({
    locale,
    title: content.seoTitle,
    description: content.seoDescription,
    localePaths: getCs2CrosshairLocalePathMap(),
    keywords: [content.primaryKeyword, ...content.secondaryKeywords],
  });
};

export function Cs2CrosshairCodesPage({ locale }: Readonly<{ locale: AppLocale }>) {
  const dictionary = getDictionary(locale);
  const content = getCs2CrosshairCodesContent(locale);
  const tool = getLocalizedToolBySlug(locale, toolSlug);

  if (!tool) {
    notFound();
  }

  const relatedTools = getLocalizedRelatedTools(locale, tool.id);

  const localizedTool: ToolDefinition = {
    ...tool,
    ...content,
    canonicalPath: getCs2CrosshairLocalePathMap()[locale],
  };

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
          category: 'UtilitiesApplication',
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
        toolUi={<Cs2CrosshairCodesTool locale={locale} />}
      />
    </>
  );
}
