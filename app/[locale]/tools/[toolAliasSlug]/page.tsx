import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { JsonLd } from '@/components/shared/json-ld';
import {
  getFrontOnlyToolSoftwareCategory,
  isFrontOnlyToolSlug,
  renderFrontOnlyToolUi,
} from '@/components/tools/front-only-tool-router';
import {
  buildCs2ToolMetadata,
  Cs2GenericToolPage,
} from '@/components/tools/cs2-generic-page';
import { ToolPageShell } from '@/components/tools/tool-page-shell';
import { frontOnlyToolSeeds } from '@/data/content/front-only-tool-suite';
import { getInvisiblePlatformResolutionBySlug } from '@/data/invisible-platform-pages';
import { getToolAliasPageBySlug } from '@/data/tool-alias-pages';
import {
  getLocalizedRelatedTools,
  getLocalizedToolBySlug,
  getToolBySlug,
  getToolLocalePathMap,
} from '@/data/tools-registry';
import {
  getCs2ToolIdBySlug,
  getCs2ToolPathForLocale,
  getCs2ToolSlugForLocale,
  cs2ToolConfigs,
} from '@/data/cs2/tools';
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildSoftwareApplicationJsonLd,
  buildToolWebPageJsonLd,
} from '@/lib/json-ld';
import { buildLocalePathMap, locales, localizePath } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import { resolveLocale } from '@/lib/i18n/resolve-locale';
import { buildLocalizedMetadata } from '@/lib/seo';

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    [
      ...cs2ToolConfigs.map((tool) => ({
        locale,
        toolAliasSlug: tool.slugByLocale[locale],
      })),
      ...frontOnlyToolSeeds.map((tool) => ({
        locale,
        toolAliasSlug: tool.slug,
      })),
    ],
  );
}

type ToolAliasRoutePageProps = Readonly<{
  params: Promise<{
    locale: string;
    toolAliasSlug: string;
  }>;
}>;

export async function generateMetadata({
  params,
}: ToolAliasRoutePageProps): Promise<Metadata> {
  const { locale: localeParam, toolAliasSlug } = await params;
  const locale = resolveLocale(localeParam);

  const cs2ToolId = getCs2ToolIdBySlug(toolAliasSlug);
  if (cs2ToolId) {
    return buildCs2ToolMetadata(locale, cs2ToolId);
  }

  if (isFrontOnlyToolSlug(toolAliasSlug)) {
    const baseTool = getToolBySlug(toolAliasSlug);
    const localizedTool = getLocalizedToolBySlug(locale, toolAliasSlug);

    if (baseTool && localizedTool) {
      return buildLocalizedMetadata({
        locale,
        title: localizedTool.seoTitle,
        description: localizedTool.seoDescription,
        localePaths: getToolLocalePathMap(baseTool),
        keywords: [localizedTool.primaryKeyword, ...localizedTool.secondaryKeywords],
      });
    }
  }

  const dictionary = getDictionary(locale);

  return buildLocalizedMetadata({
    locale,
    title: `${dictionary.common.tools} | ${dictionary.seo.siteDefaultTitle}`,
    description: dictionary.seo.tools.description,
    localePaths: buildLocalePathMap('/tools'),
    keywords: dictionary.seo.tools.keywords,
  });
}

export default async function ToolAliasRoutePage({ params }: ToolAliasRoutePageProps) {
  const { locale: localeParam, toolAliasSlug } = await params;
  const locale = resolveLocale(localeParam);

  const cs2ToolId = getCs2ToolIdBySlug(toolAliasSlug);
  if (cs2ToolId) {
    const canonicalSlug = getCs2ToolSlugForLocale(cs2ToolId, locale);

    if (toolAliasSlug !== canonicalSlug) {
      redirect(getCs2ToolPathForLocale(cs2ToolId, locale));
    }

    return <Cs2GenericToolPage locale={locale} toolId={cs2ToolId} />;
  }

  if (isFrontOnlyToolSlug(toolAliasSlug)) {
    const tool = getLocalizedToolBySlug(locale, toolAliasSlug);
    const toolUi = renderFrontOnlyToolUi(toolAliasSlug, locale);

    if (!tool || !toolUi) {
      notFound();
    }

    const related = getLocalizedRelatedTools(locale, tool.id);
    const dictionary = getDictionary(locale);

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
            category: getFrontOnlyToolSoftwareCategory(toolAliasSlug) ?? 'UtilitiesApplication',
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
          toolUi={toolUi}
        />
      </>
    );
  }

  const hasToolAlias = Boolean(getToolAliasPageBySlug(toolAliasSlug));
  const hasInvisibleLanding = Boolean(getInvisiblePlatformResolutionBySlug(toolAliasSlug));

  if (!hasToolAlias && !hasInvisibleLanding) {
    notFound();
  }

  redirect(`/${locale}/${toolAliasSlug}`);
}
