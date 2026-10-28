import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/shared/json-ld';
import { ToolPageShell } from '@/components/tools/tool-page-shell';
import { VideoDownloaderPlatformLinks } from '@/components/tools/video-downloader-platform-links';
import { VideoDownloaderTool } from '@/components/tools/video-downloader-tool';
import {
  getLocalizedVideoDownloaderPlatformContent,
  getVideoDownloaderPlatformLinks,
  getVideoDownloaderPlatformLocalePathMap,
  getVideoDownloaderPlatformPage,
  getVideoDownloaderPlatformPath,
  getVideoDownloaderStaticParams,
} from '@/data/video-downloader-pages';
import { getLocalizedRelatedTools, getLocalizedToolBySlug } from '@/data/tools-registry';
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildSoftwareApplicationJsonLd,
  buildToolWebPageJsonLd,
} from '@/lib/json-ld';
import { localizePath, locales, type AppLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import { resolveLocale } from '@/lib/i18n/resolve-locale';
import { buildLocalizedMetadata } from '@/lib/seo';
import type { ToolDefinition } from '@/types/tool';

// Only platforms with a verified extractor are listed; anything else is a real 404.
export const dynamicParams = false;

const toolSlug = 'video-downloader';

const localizedSearchIntent: Record<AppLocale, string> = {
  'pt-br': 'Pessoas que têm o link de um vídeo público desta plataforma e querem salvar o arquivo no aparelho.',
  en: 'People who have the link to a public video from this platform and want to save the file on their device.',
  es: 'Personas que tienen el enlace de un video público de esta plataforma y quieren guardar el archivo en su dispositivo.',
  zh: 'People who have the link to a public video from this platform and want to save the file on their device.',
};

const linksSectionCopy: Record<AppLocale, { title: string; description: string; general: string }> = {
  'pt-br': {
    title: 'Outras plataformas',
    description: 'A mesma ferramenta, com instruções específicas para cada serviço.',
    general: 'Ferramenta geral de download de vídeo',
  },
  en: {
    title: 'Other platforms',
    description: 'The same tool, with instructions specific to each service.',
    general: 'General video downloader',
  },
  es: {
    title: 'Otras plataformas',
    description: 'La misma herramienta, con instrucciones específicas para cada servicio.',
    general: 'Descargador de videos general',
  },
  zh: {
    title: 'Other platforms',
    description: 'The same tool, with instructions specific to each service.',
    general: 'General video downloader',
  },
};

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getVideoDownloaderStaticParams().map((item) => ({ locale, platformSlug: item.platformSlug })),
  );
}

type VideoDownloaderPlatformPageProps = Readonly<{
  params: Promise<{ locale: string; platformSlug: string }>;
}>;

export async function generateMetadata({ params }: VideoDownloaderPlatformPageProps): Promise<Metadata> {
  const { locale: localeParam, platformSlug } = await params;
  const locale = resolveLocale(localeParam);
  const page = getVideoDownloaderPlatformPage(platformSlug);

  if (!page) {
    notFound();
  }

  const content = getLocalizedVideoDownloaderPlatformContent(page, locale);

  return buildLocalizedMetadata({
    locale,
    title: content.seoTitle,
    description: content.seoDescription,
    localePaths: getVideoDownloaderPlatformLocalePathMap(page),
    keywords: content.keywords,
  });
}

export default async function VideoDownloaderPlatformPage({ params }: VideoDownloaderPlatformPageProps) {
  const { locale: localeParam, platformSlug } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = getDictionary(locale);
  const page = getVideoDownloaderPlatformPage(platformSlug);
  const baseTool = getLocalizedToolBySlug(locale, toolSlug);

  if (!page || !baseTool) {
    notFound();
  }

  const content = getLocalizedVideoDownloaderPlatformContent(page, locale);
  const canonicalPath = getVideoDownloaderPlatformPath(page, locale);
  const generalPath = localizePath(locale, '/tools/video-downloader');
  const copy = linksSectionCopy[locale];

  const landingTool: ToolDefinition = {
    ...baseTool,
    name: content.title,
    h1: content.title,
    intro: content.intro,
    seoTitle: content.seoTitle,
    seoDescription: content.seoDescription,
    canonicalPath,
    primaryKeyword: content.keywords[0] ?? baseTool.primaryKeyword,
    secondaryKeywords: content.keywords.slice(1),
    searchIntent: localizedSearchIntent[locale],
    contentBlocks: content.contentBlocks,
    faq: content.faq,
  };

  const links = [
    {
      slug: 'general',
      path: generalPath,
      name: baseTool.name,
      description: copy.general,
    },
    ...getVideoDownloaderPlatformLinks(locale, page.slug),
  ];

  return (
    <>
      <JsonLd
        data={buildToolWebPageJsonLd({
          name: landingTool.name,
          description: landingTool.seoDescription,
          path: landingTool.canonicalPath,
          locale,
          keywords: [landingTool.primaryKeyword, ...landingTool.secondaryKeywords],
        })}
      />
      <JsonLd
        data={buildSoftwareApplicationJsonLd({
          name: landingTool.name,
          description: landingTool.seoDescription,
          path: landingTool.canonicalPath,
          category: 'UtilitiesApplication',
        })}
      />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: dictionary.common.home, path: localizePath(locale, '/') },
          { name: dictionary.common.tools, path: localizePath(locale, '/tools') },
          { name: baseTool.name, path: generalPath },
          { name: page.name, path: canonicalPath },
        ])}
      />
      <JsonLd data={buildFaqJsonLd(landingTool.faq)} />

      <ToolPageShell
        locale={locale}
        tool={landingTool}
        relatedTools={getLocalizedRelatedTools(locale, baseTool.id)}
        toolUi={
          <VideoDownloaderTool
            locale={locale}
            platform={page.platformId}
            placeholder={content.placeholder}
            hint={content.hint}
          />
        }
        afterContentSection={
          <VideoDownloaderPlatformLinks title={copy.title} description={copy.description} links={links} />
        }
      />
    </>
  );
}
