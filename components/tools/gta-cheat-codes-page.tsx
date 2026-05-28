import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/shared/json-ld';
import { GtaCheatCodesTool } from '@/components/tools/gta-cheat-codes-tool';
import { ToolAliasLinks } from '@/components/tools/tool-alias-links';
import { ToolPageShell } from '@/components/tools/tool-page-shell';
import { getGtaCheatsContent } from '@/data/content/gta-cheat-codes';
import {
  getGtaSeoPathByLocale,
  getGtaToolLocalePathMap,
  getLocalizedGtaSeoLabel,
  getRelatedGtaSeoPages,
} from '@/data/gta/gta-seo-pages';
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

const toolSlug = 'gta-cheat-codes';

const relatedGtaCopy: Record<AppLocale, { title: string; description: string }> = {
  'pt-br': {
    title: 'Paginas GTA por jogo e intencao',
    description:
      'Acesse atalhos por jogo e categorias buscadas com frequencia, como armas, policia, tanque e clima.',
  },
  en: {
    title: 'GTA pages by game and intent',
    description:
      'Open shortcuts by game and popular intents like weapons, police, tank, and weather.',
  },
  es: {
    title: 'Paginas GTA por juego e intencion',
    description:
      'Accede a atajos por juego e intenciones populares como armas, policia, tanque y clima.',
  },
};

export const buildGtaCheatCodesMetadata = (locale: AppLocale): Metadata => {
  const content = getGtaCheatsContent(locale);

  return buildLocalizedMetadata({
    locale,
    title: content.seoTitle,
    description: content.seoDescription,
    localePaths: getGtaToolLocalePathMap(),
    keywords: [content.primaryKeyword, ...content.secondaryKeywords],
  });
};

export function GtaCheatCodesPage({ locale }: Readonly<{ locale: AppLocale }>) {
  const dictionary = getDictionary(locale);
  const content = getGtaCheatsContent(locale);
  const tool = getLocalizedToolBySlug(locale, toolSlug);

  if (!tool) {
    notFound();
  }

  const relatedTools = getLocalizedRelatedTools(locale, tool.id);
  const relatedGtaLinks = getRelatedGtaSeoPages('gta-cheat-codes-root', 4).map((page) => ({
    slug: page.slugs[locale],
    path: getGtaSeoPathByLocale(page, locale),
    label: getLocalizedGtaSeoLabel(page, locale),
  }));

  const localizedTool: ToolDefinition = {
    ...tool,
    ...content,
    canonicalPath: getGtaToolLocalePathMap()[locale],
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
        toolUi={<GtaCheatCodesTool locale={locale} />}
        afterToolSection={
          <ToolAliasLinks
            title={relatedGtaCopy[locale].title}
            description={relatedGtaCopy[locale].description}
            links={relatedGtaLinks}
          />
        }
      />
    </>
  );
}
