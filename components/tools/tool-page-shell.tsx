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
      title: 'Tarefas específicas com esta ferramenta',
      description: 'Atalhos para usos frequentes com o mesmo fluxo completo.',
    },
    en: {
      title: 'Specific tasks with this tool',
      description: 'Shortcuts to common tasks using the same complete workflow.',
    },
    es: {
      title: 'Tareas específicas con esta herramienta',
      description: 'Atajos para usos frecuentes con el mismo flujo completo.',
    },
    zh: {
      title: '使用该工具的具体任务',
      description: '针对常见用途的快捷入口,使用相同的完整流程。',
    },
  };
  const trustNoteByToolId: Partial<Record<string, Record<AppLocale, { title: string; text: string }>>> = {
    'video-downloader': {
      'pt-br': {
        title: 'Privacidade da mídia',
        text: 'O link é enviado ao servidor para localizar a mídia pública. O vídeo ou a imagem abre direto da plataforma no seu navegador e não é incluído nos eventos de análise.',
      },
      en: {
        title: 'Media privacy',
        text: 'The link is sent to the server to locate public media. The video or image opens directly from the platform in your browser and is not included in analytics events.',
      },
      es: {
        title: 'Privacidad del contenido',
        text: 'El enlace se envía al servidor para localizar contenido público. El video o la imagen se abre directamente desde la plataforma en tu navegador y no se incluye en los eventos de análisis.',
      },
      zh: {
        title: 'Media privacy',
        text: 'The link is sent to the server to locate public media. The video or image opens directly from the platform in your browser and is not included in analytics events.',
      },
    },
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
    'instagram-post-simulator': {
      'pt-br': {
        title: 'Privacidade e simulação',
        text: 'Fotos e vídeos são lidos e processados apenas no seu navegador e não são enviados aos servidores do site. Esta ferramenta não publica nada no Instagram nem se conecta à API da plataforma. Não é oficial nem afiliada à Meta.',
      },
      en: {
        title: 'Privacy and simulation',
        text: 'Photos and videos are read and processed only in your browser and are not sent to the site servers. This tool publishes nothing to Instagram and does not connect to the platform API. It is not official and is not affiliated with Meta.',
      },
      es: {
        title: 'Privacidad y simulación',
        text: 'Las fotos y los videos se leen y procesan solo en tu navegador y no se envían a los servidores del sitio. Esta herramienta no publica nada en Instagram ni se conecta a la API de la plataforma. No es oficial ni está afiliada a Meta.',
      },
      zh: {
        title: 'Privacy and simulation',
        text: 'Photos and videos are read and processed only in your browser and are not sent to the site servers. This tool publishes nothing to Instagram and does not connect to the platform API. It is not official and is not affiliated with Meta.',
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
    'image-converter': {
      'pt-br': {
        title: 'Privacidade e conversão de imagem',
        text: 'As imagens são processadas no navegador e não são enviadas ao servidor. Arquivos HEIC ou HEIF só podem ser convertidos se o navegador conseguir abri-los.',
      },
      en: {
        title: 'Privacy and image conversion',
        text: 'Images are processed in your browser and are not sent to the server. HEIC or HEIF files can only be converted if your browser can open them.',
      },
      es: {
        title: 'Privacidad y conversión de imágenes',
        text: 'Las imágenes se procesan en el navegador y no se envían al servidor. Los archivos HEIC o HEIF solo se pueden convertir si el navegador puede abrirlos.',
      },
      zh: {
        title: '图片转换与隐私',
        text: '图像在浏览器中处理，不会发送到服务器。只有浏览器能够打开 HEIC 或 HEIF 文件时，才能转换这些格式。',
      },
    },
    'video-compression': {
      'pt-br': {
        title: 'Privacidade e compressão de vídeo',
        text: 'Os vídeos são processados no navegador e não são enviados ao servidor. O tempo de processamento depende do tamanho do arquivo e do aparelho.',
      },
      en: {
        title: 'Privacy and video compression',
        text: 'Videos are processed in your browser and are not sent to the server. Processing time depends on the file size and your device.',
      },
      es: {
        title: 'Privacidad y compresión de video',
        text: 'Los videos se procesan en el navegador y no se envían al servidor. El tiempo de procesamiento depende del tamaño del archivo y del dispositivo.',
      },
      zh: {
        title: '视频压缩与隐私',
        text: '视频在浏览器中处理，不会发送到服务器。处理时间取决于文件大小和设备性能。',
      },
    },
    'open-graph-preview': {
      'pt-br': {
        title: 'Privacidade e análise de links',
        text: 'A URL informada é enviada ao servidor do site, que busca a página e seus metadados. Ações de copiar ou baixar imagens também podem buscar o arquivo indicado pela página. Use apenas URLs que você tenha autorização para consultar.',
      },
      en: {
        title: 'Privacy and link inspection',
        text: 'The URL you enter is sent to the site server, which fetches the page and its metadata. Copying or downloading images may also fetch the asset referenced by the page. Only use URLs you are authorized to inspect.',
      },
      es: {
        title: 'Privacidad y análisis de enlaces',
        text: 'La URL que ingresas se envía al servidor del sitio, que obtiene la página y sus metadatos. Al copiar o descargar imágenes también se puede solicitar el archivo indicado por la página. Usa solo URLs que tengas autorización para consultar.',
      },
      zh: {
        title: '链接分析与隐私',
        text: '你输入的网址会发送到网站服务器,以获取网页和元数据。复制或下载图片时,服务器也可能获取网页引用的资源。请仅检查你有权访问的网址。',
      },
    },
    'email-temporario': {
      'pt-br': {
        title: 'Privacidade do e-mail temporário',
        text: 'O endereço e as mensagens da caixa temporária são processados no servidor e ficam armazenados até a expiração configurada ou a exclusão manual. O token de acesso fica salvo neste navegador. Não use a caixa para mensagens confidenciais, senhas ou recuperação de contas.',
      },
      en: {
        title: 'Temporary email privacy',
        text: 'The temporary inbox address and messages are processed on the server and stored until the configured expiry or manual deletion. The access token is saved in this browser. Do not use this inbox for confidential messages, passwords, or account recovery.',
      },
      es: {
        title: 'Privacidad del correo temporal',
        text: 'La dirección y los mensajes de la bandeja temporal se procesan en el servidor y se guardan hasta el vencimiento configurado o su eliminación manual. El token de acceso se guarda en este navegador. No uses esta bandeja para mensajes confidenciales, contraseñas ni recuperación de cuentas.',
      },
      zh: {
        title: '临时邮箱隐私',
        text: '临时邮箱地址和邮件在服务器上处理,并保存至设定的过期时间或手动删除。访问令牌保存在此浏览器中。请勿用此邮箱接收机密邮件、密码或账户恢复信息。',
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
