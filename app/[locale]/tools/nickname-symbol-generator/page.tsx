import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/shared/json-ld';
import { NicknameSymbolGeneratorTool } from '@/components/tools/nickname-symbol-generator-tool';
import { NicknameSymbolPlatformLinks } from '@/components/tools/nickname-symbol-platform-links';
import { ToolPageShell } from '@/components/tools/tool-page-shell';
import {
  getFeaturedNicknameSymbolPlatformPages,
  toLocalizedNicknameSymbolPlatformLink,
} from '@/data/nickname-symbol-platform-pages';
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
import { buildLocalePathMap, localizePath, type AppLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import { resolveLocale } from '@/lib/i18n/resolve-locale';
import { buildLocalizedMetadata } from '@/lib/seo';

const toolSlug = 'nickname-symbol-generator';

type NicknameSymbolGeneratorPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const platformSectionCopy: Record<AppLocale, { title: string; description: string }> = {
  'pt-br': {
    title: 'Simbolos e presets por jogo',
    description:
      'Abra a versao dedicada para iniciar com o jogo, as molduras e as orientacoes mais relevantes.',
  },
  en: {
    title: 'Game-specific symbols and presets',
    description:
      'Open a dedicated version with the game, recommended frames, and practical guidance ready.',
  },
  es: {
    title: 'Simbolos y presets por juego',
    description:
      'Abre una version dedicada con el juego, los marcos y las recomendaciones preparados.',
  },
  zh: {
    title: '按游戏分类的符号与预设',
    description: '打开专属版本,已为你准备好对应游戏、推荐边框和实用建议。',
  },
};

export async function generateMetadata({
  params,
}: NicknameSymbolGeneratorPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = getDictionary(locale);
  const tool = getLocalizedToolBySlug(locale, toolSlug);

  return buildLocalizedMetadata({
    locale,
    title: tool?.seoTitle ?? `${dictionary.common.tools} | ${dictionary.seo.siteDefaultTitle}`,
    description: tool?.seoDescription ?? dictionary.seo.tools.description,
    localePaths: buildLocalePathMap(`/tools/${toolSlug}`),
    keywords: tool
      ? [tool.primaryKeyword, ...tool.secondaryKeywords]
      : dictionary.seo.tools.keywords,
  });
}

export default async function NicknameSymbolGeneratorPage({
  params,
}: Readonly<NicknameSymbolGeneratorPageProps>) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = getDictionary(locale);
  const tool = getLocalizedToolBySlug(locale, toolSlug);

  if (!tool) {
    notFound();
  }

  const related = getLocalizedRelatedTools(locale, tool.id);
  const platformLinks = getFeaturedNicknameSymbolPlatformPages(8).map((page) =>
    toLocalizedNicknameSymbolPlatformLink(page, locale),
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
          category: 'UtilitiesApplication',
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
        toolUi={<NicknameSymbolGeneratorTool locale={locale} />}
        afterToolSection={
          <NicknameSymbolPlatformLinks
            title={platformSectionCopy[locale].title}
            description={platformSectionCopy[locale].description}
            links={platformLinks}
          />
        }
      />
    </>
  );
}
