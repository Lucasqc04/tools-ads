import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/shared/json-ld';
import { ToolPageShell } from '@/components/tools/tool-page-shell';
import { VideoDownloaderPlatformLinks } from '@/components/tools/video-downloader-platform-links';
import { VideoDownloaderTool } from '@/components/tools/video-downloader-tool';
import { getVideoDownloaderPlatformLinks } from '@/data/video-downloader-pages';
import { getLocalizedRelatedTools, getLocalizedToolBySlug } from '@/data/tools-registry';
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

const toolSlug = 'video-downloader';

const platformsSectionCopy: Record<AppLocale, { title: string; description: string }> = {
  'pt-br': {
    title: 'Baixar vídeo por plataforma',
    description: 'Instruções e limitações específicas de cada serviço, usando a mesma ferramenta.',
  },
  en: {
    title: 'Download videos by platform',
    description: 'Instructions and limits specific to each service, using the same tool.',
  },
  es: {
    title: 'Descargar videos por plataforma',
    description: 'Instrucciones y límites específicos de cada servicio, con la misma herramienta.',
  },
  zh: {
    title: 'Download videos by platform',
    description: 'Instructions and limits specific to each service, using the same tool.',
  },
};

type VideoDownloaderPageProps = Readonly<{
  params: Promise<{ locale: string }>;
}>;

export async function generateMetadata({ params }: VideoDownloaderPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = getDictionary(locale);
  const tool = getLocalizedToolBySlug(locale, toolSlug);

  return buildLocalizedMetadata({
    locale,
    title: tool?.seoTitle ?? `${dictionary.common.tools} | ${dictionary.seo.siteDefaultTitle}`,
    description: tool?.seoDescription ?? dictionary.seo.tools.description,
    localePaths: buildLocalePathMap('/tools/video-downloader'),
    keywords: tool ? [tool.primaryKeyword, ...tool.secondaryKeywords] : dictionary.seo.tools.keywords,
  });
}

export default async function VideoDownloaderPage({ params }: VideoDownloaderPageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = getDictionary(locale);
  const tool = getLocalizedToolBySlug(locale, toolSlug);

  if (!tool) {
    notFound();
  }

  const related = getLocalizedRelatedTools(locale, tool.id);
  const sectionCopy = platformsSectionCopy[locale];

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
        toolUi={<VideoDownloaderTool locale={locale} />}
        afterContentSection={
          <VideoDownloaderPlatformLinks
            title={sectionCopy.title}
            description={sectionCopy.description}
            links={getVideoDownloaderPlatformLinks(locale)}
          />
        }
      />
    </>
  );
}
