import type { ReactNode } from 'react';
import { ToolViewTracker } from '@/components/analytics/tool-view-tracker';
import { Container } from '@/components/layout/container';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { ContentBlocks } from '@/components/shared/content-blocks';
import { Faq } from '@/components/shared/faq';
import { RelatedTools } from '@/components/shared/related-tools';
import { TrustNote } from '@/components/shared/trust-note';
import { ZhTranslationNotice } from '@/components/shared/zh-translation-notice';
import { ToolAliasLinks } from '@/components/tools/tool-alias-links';
import { ToolPageExperience } from '@/components/tools/tool-page-experience';
import {
  getRelatedToolAliasPages,
  toLocalizedToolAliasLink,
} from '@/data/tool-alias-pages';
import { localizePath, type AppLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import type { ToolDefinition } from '@/types/tool';

type ToolPageShellProps = {
  tool: ToolDefinition;
  relatedTools: ToolDefinition[];
  toolUi: ReactNode;
  beforeToolSection?: ReactNode;
  afterToolSection?: ReactNode;
  afterContentSection?: ReactNode;
  locale?: AppLocale;
  enableFocusMode?: boolean;
};

export function ToolPageShell({
  tool,
  relatedTools,
  toolUi,
  beforeToolSection,
  afterToolSection,
  afterContentSection,
  locale = 'pt-br',
  enableFocusMode,
}: ToolPageShellProps) {
  const dictionary = getDictionary(locale);
  const toolsPrefix = `/${locale}/tools/`;
  const toolPathRemainder = tool.canonicalPath.startsWith(toolsPrefix)
    ? tool.canonicalPath.slice(toolsPrefix.length)
    : '';
  const isCanonicalToolRoute = Boolean(toolPathRemainder) && !toolPathRemainder.includes('/');
  const intentLinks = isCanonicalToolRoute && !afterToolSection
    ? getRelatedToolAliasPages(tool.slug, '', locale, 2).map((page) =>
        toLocalizedToolAliasLink(page, locale),
      )
    : [];

  const intentSectionCopy: Record<AppLocale, { title: string; description: string }> = {
    'pt-br': {
      title: 'Tarefas especificas com esta ferramenta',
      description: 'Atalhos para usos frequentes com o mesmo fluxo completo.',
    },
    en: {
      title: 'Specific tasks with this tool',
      description: 'Shortcuts to common tasks using the same complete workflow.',
    },
    es: {
      title: 'Tareas especificas con esta herramienta',
      description: 'Atajos para usos frecuentes con el mismo flujo completo.',
    },
    zh: {
      title: '使用该工具的具体任务',
      description: '针对常见用途的快捷入口,使用相同的完整流程。',
    },
  };
  const trustNoteByToolId: Partial<Record<string, Record<AppLocale, { title: string; text: string }>>> = {
    'celular-como-webcam': {
      'pt-br': {
        title: 'Privacidade da câmera',
        text: 'O servidor troca apenas mensagens temporárias para conectar o celular ao computador; vídeo e áudio seguem entre os navegadores e não são gravados. Os dados de pareamento expiram automaticamente. Em conexões diretas, os aparelhos podem conhecer o endereço IP um do outro.',
      },
      en: {
        title: 'Camera privacy',
        text: 'The server exchanges only temporary messages to connect your phone and computer; video and audio travel between browsers and are not recorded. Pairing data expires automatically. With a direct connection, devices may learn each other’s IP address.',
      },
      es: {
        title: 'Privacidad de la cámara',
        text: 'El servidor intercambia solo mensajes temporales para conectar el celular y la computadora; el video y el audio viajan entre los navegadores y no se graban. Los datos de emparejamiento vencen automáticamente. En una conexión directa, los dispositivos pueden conocer la dirección IP del otro.',
      },
      zh: {
        title: '摄像头隐私',
        text: '服务器只交换用于连接手机和电脑的临时消息；视频和音频在浏览器之间传输，不会被录制。配对数据会自动过期。直连时，设备可能会获知彼此的 IP 地址。',
      },
    },
    'zpl-label-editor': {
      'pt-br': {
        title: 'Privacidade e renderização de etiquetas',
        text: 'O lote e o rascunho ficam neste navegador. Para obter preview e PDF compatíveis com ZPL, a etiqueta em processamento é enviada ao renderizador; o conteúdo das etiquetas não é incluído nos eventos de análise.',
      },
      en: {
        title: 'Privacy and label rendering',
        text: 'The batch and draft stay in this browser. To produce ZPL-compatible previews and PDFs, the label being processed is sent to the renderer; label content is not included in analytics events.',
      },
      es: {
        title: 'Privacidad y renderización de etiquetas',
        text: 'El lote y borrador permanecen en este navegador. Para generar previews y PDF compatibles con ZPL, la etiqueta en proceso se envía al renderizador; el contenido no se incluye en eventos analíticos.',
      },
      zh: {
        title: 'Privacy and label rendering',
        text: 'The batch and draft stay in this browser. To produce ZPL-compatible previews and PDFs, the label being processed is sent to the renderer; label content is not included in analytics events.',
      },
    },
  };
  const trustNote = trustNoteByToolId[tool.id]?.[locale] ?? {
    title: dictionary.toolShell.trustTitle,
    text: dictionary.toolShell.trustText,
  };
  const shouldEnableFocusMode = enableFocusMode ?? tool.id !== 'descobrir-ip-publico';

  return (
    <Container className="py-5 md:py-8">
      <ToolViewTracker toolId={tool.id} locale={locale} />
      <ToolPageExperience
        toolName={tool.name}
        useToolTitle={dictionary.toolShell.useToolTitle}
        expandLabel={dictionary.toolShell.expandTool}
        backLabel={dictionary.toolShell.backToPage}
        enableFocusMode={shouldEnableFocusMode}
        breadcrumbs={
          <Breadcrumbs
            items={[
              { name: dictionary.common.home, href: localizePath(locale, '/') },
              { name: dictionary.common.tools, href: localizePath(locale, '/tools') },
              { name: tool.name },
            ]}
          />
        }
        header={
          <header className="max-w-reading space-y-2">
            <h1 className="text-2xl font-bold leading-tight tracking-tight text-slate-900 sm:text-3xl md:text-4xl">{tool.h1}</h1>
            <p className="text-sm leading-6 text-slate-700 md:text-base md:leading-7">{tool.intro}</p>
          </header>
        }
        beforeToolSection={
          <>
            <ZhTranslationNotice locale={locale} toolId={tool.id} />
            {beforeToolSection ? <div className="mt-6 md:mt-8">{beforeToolSection}</div> : null}
          </>
        }
        toolUi={toolUi}
        afterToolSection={afterToolSection}
        supportingContent={
          <>
            {/* Ads temporariamente desativados
            <div className="flex justify-center">
              <MediumRectangleAd />
            </div>
            */}

            <ContentBlocks
              blocks={tool.contentBlocks}
              title={dictionary.toolShell.contentTitle}
            />

            <Faq items={tool.faq} title={dictionary.toolShell.faqTitle} />

            <RelatedTools
              tools={relatedTools.slice(0, intentLinks.length ? 2 : 4)}
              locale={locale}
            />

            <ToolAliasLinks
              title={intentSectionCopy[locale].title}
              description={intentSectionCopy[locale].description}
              links={intentLinks}
            />

            {afterContentSection ? afterContentSection : null}

            <TrustNote
              title={trustNote.title}
              text={trustNote.text}
            />
          </>
        }
      />
    </Container>
  );
}
