import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/shared/json-ld';
import { InvisibleCharacterTool } from '@/components/tools/invisible-character-tool';
import { InvisiblePlatformLinks } from '@/components/tools/invisible-platform-links';
import { ToolPageShell } from '@/components/tools/tool-page-shell';
import {
  getFeaturedInvisiblePlatformPages,
  toLocalizedInvisiblePlatformLink,
} from '@/data/invisible-platform-pages';
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

const toolSlug = 'invisible-character';

type InvisibleCharacterPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const platformSectionCopy: Record<AppLocale, { title: string; description: string }> = {
  'pt-br': {
    title: 'Paginas por jogo e rede social',
    description:
      'Acesse paginas especificas com SEO dedicado para Free Fire, COD, Discord e outras plataformas com regras proprias de validacao.',
  },
  en: {
    title: 'Pages by game and social platform',
    description:
      'Open dedicated SEO pages for Free Fire, COD, Discord, and other platforms with different nickname validation rules.',
  },
  es: {
    title: 'Paginas por juego y red social',
    description:
      'Abre paginas SEO dedicadas para Free Fire, COD, Discord y otras plataformas con reglas de validacion distintas.',
  },
};

export async function generateMetadata({
  params,
}: InvisibleCharacterPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = getDictionary(locale);
  const tool = getLocalizedToolBySlug(locale, toolSlug);

  return buildLocalizedMetadata({
    locale,
    title: tool?.seoTitle ?? `${dictionary.common.tools} | ${dictionary.seo.siteDefaultTitle}`,
    description: tool?.seoDescription ?? dictionary.seo.tools.description,
    localePaths: buildLocalePathMap('/tools/invisible-character'),
    keywords: tool
      ? [tool.primaryKeyword, ...tool.secondaryKeywords]
      : dictionary.seo.tools.keywords,
  });
}

export default async function InvisibleCharacterPage({
  params,
}: Readonly<InvisibleCharacterPageProps>) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = getDictionary(locale);
  const tool = getLocalizedToolBySlug(locale, toolSlug);

  if (!tool) {
    notFound();
  }

  const related = getLocalizedRelatedTools(locale, tool.id);
  const featuredLinks = getFeaturedInvisiblePlatformPages(8).map((page) =>
    toLocalizedInvisiblePlatformLink(page, locale),
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
        toolUi={<InvisibleCharacterTool locale={locale} />}
        afterToolSection={
          <InvisiblePlatformLinks
            title={platformSectionCopy[locale].title}
            description={platformSectionCopy[locale].description}
            links={featuredLinks}
          />
        }
      />
    </>
  );
}
