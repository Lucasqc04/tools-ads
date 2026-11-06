import type { AppLocale } from '@/lib/i18n/config';
import type { ContentBlock, FaqItem } from '@/types/content';

export type VideoDownloaderLocaleContent = {
  name: string;
  shortDescription: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  searchIntent: string;
  seoTitle: string;
  seoDescription: string;
  h1: string;
  intro: string;
  contentBlocks: ContentBlock[];
  faq: FaqItem[];
};

const ptBr: VideoDownloaderLocaleContent = {
  name: 'Baixar Vídeos do X e Mídia do Pinterest',
  shortDescription:
    'Cole um link público do X ou um pin do Pinterest para abrir e salvar vídeos e imagens no celular ou computador, sem cadastro.',
  primaryKeyword: 'baixar vídeo online grátis',
  secondaryKeywords: [
    'baixar vídeo pelo link',
    'baixador de vídeos online',
    'salvar vídeo do twitter e pinterest',
    'baixar vídeo sem aplicativo',
    'extrair áudio mp3 de vídeo',
    'baixar imagem do pinterest',
  ],
  searchIntent:
    'Pessoas que querem salvar um vídeo público do X ou uma imagem ou vídeo de um pin público do Pinterest.',
  seoTitle: 'Baixar Vídeos do X e Pinterest e Imagens de Pins',
  seoDescription:
    'Cole um link público do X ou Pinterest para abrir vídeos e imagens no navegador. Grátis, sem cadastro e sem instalar nada.',
  h1: 'Baixar Vídeos do X e Pinterest e Imagens de Pins',
  intro:
    'Cole o link de um post público do X ou pin do Pinterest para salvar vídeos e imagens no aparelho. No X, escolha entre as qualidades disponíveis. Sem cadastro e sem instalar aplicativo.',
  contentBlocks: [
    {
      title: 'Como salvar um vídeo ou imagem pelo link',
      paragraphs: [
        'Esta ferramenta serve para quem já tem o link de um vídeo público do X ou de um pin público do Pinterest e quer salvar o arquivo no celular ou computador. No X, a ferramenta lista as qualidades de vídeo disponíveis. No Pinterest, ela reconhece pins de vídeo e imagem quando a plataforma publica um arquivo acessível.',
        'Copie o link do post ou pin, cole no campo e toque em analisar. Para vídeos do X, escolha a qualidade e baixe o MP4 direto no navegador. No Pinterest, abra o arquivo em uma nova aba e salve pelo menu do navegador ou do player.',
      ],
      list: [
        'Copie o link do post no aplicativo ou no site.',
        'Cole no campo e toque em analisar link.',
        'Confira a prévia e o formato de mídia encontrado.',
        'Para vídeos, escolha uma qualidade e baixe o MP4. No Pinterest, abra a mídia e salve pelo navegador.',
      ],
    },
    {
      title: 'Plataformas aceitas e o que cada uma entrega',
      paragraphs: [
        'Hoje funcionam links públicos do X (x.com e twitter.com) e pins públicos de vídeo ou imagem do Pinterest, inclusive links curtos pin.it. Cada plataforma tem uma página própria com instruções e limitações específicas, e todas usam a mesma ferramenta.',
        'No X, a página mostra as qualidades MP4 disponíveis e permite extrair o áudio para MP3 no próprio navegador. No Pinterest, o arquivo do pin abre em uma nova aba porque o servidor de mídia não permite que outra página leia o conteúdo; salve a imagem pelo menu do navegador ou o vídeo pelo menu do player.',
        'Pins privados, apagados ou sem um arquivo público acessível não funcionam. Instagram, Facebook, TikTok e Reddit também não estão disponíveis. A ferramenta não tenta contornar login nem proteções das plataformas.',
      ],
    },
    {
      title: 'Limitações, privacidade e uso responsável',
      paragraphs: [
        'Só funcionam posts e pins públicos que ainda estejam disponíveis. Conteúdo protegido, apagado ou que exige login não pode ser acessado; a ferramenta não contorna essas proteções nem remove DRM. Se o post tiver mais de um vídeo, só o primeiro aparece na lista, e o download dentro do navegador é limitado a arquivos de até 1 GB.',
        'O link que você cola é enviado ao nosso servidor para localizar a mídia pública; o arquivo de vídeo ou imagem abre direto da plataforma e não é armazenado pela ferramenta. A conversão para MP3 acontece no seu dispositivo. Salve somente conteúdo que você tem direito de usar e respeite os direitos autorais.',
      ],
    },
  ],
  faq: [
    {
      question: 'Quais plataformas e tipos de mídia funcionam?',
      answer:
        'Vídeos públicos do X (Twitter) e pins públicos de vídeo ou imagem do Pinterest, quando a plataforma expõe o arquivo. Instagram, Facebook, TikTok e Reddit não estão disponíveis.',
    },
    {
      question: 'É grátis e precisa de cadastro?',
      answer: 'É grátis, sem cadastro e sem instalar nada. Funciona no navegador do celular e do computador.',
    },
    {
      question: 'A mídia passa pelo servidor do site?',
      answer:
        'O link é enviado ao servidor para localizar a mídia pública. O arquivo abre direto da plataforma no seu navegador; o vídeo ou a imagem não passa pelo site nem entra nos eventos de análise.',
    },
    {
      question: 'Por que o Pinterest abre a mídia em outra aba?',
      answer:
        'Os servidores de mídia do Pinterest não deixam outras páginas lerem o arquivo diretamente. Abrimos a mídia em uma nova aba para você salvar pelo menu do navegador ou do player.',
    },
    {
      question: 'Posso abrir mídia de posts privados ou apagados?',
      answer: 'Não. Apenas conteúdo público e ainda disponível. A ferramenta não contorna login, contas privadas ou proteções das plataformas.',
    },
  ],
};

const en: VideoDownloaderLocaleContent = {
  name: 'Download X Videos and Pinterest Media',
  shortDescription:
    'Paste a public X link or Pinterest pin link to open and save videos and images on your device, with no sign-up.',
  primaryKeyword: 'online video downloader',
  secondaryKeywords: [
    'download video from link',
    'save twitter and pinterest videos',
    'video downloader no app',
    'download video free no sign up',
    'extract mp3 from video',
    'download pinterest image',
  ],
  searchIntent:
    'People who want to save a public X video or a public Pinterest video or image pin.',
  seoTitle: 'Download X and Pinterest Videos and Pinterest Images',
  seoDescription:
    'Paste a public X or Pinterest link to open videos and images in your browser. Free, no sign-up and nothing to install.',
  h1: 'Download X and Pinterest Videos and Pinterest Images',
  intro:
    'Paste a public X post or Pinterest pin link to save videos and images on your device. Choose from the video qualities available on X. No sign-up or app to install.',
  contentBlocks: [
    {
      title: 'How to save a video or image from its link',
      paragraphs: [
        'This tool is for people who have a public X video link or Pinterest pin link and want to save the file on a phone or computer. On X, it lists the video qualities available for that post. On Pinterest, it recognizes public video and image pins when the platform exposes a downloadable file.',
        'Copy the post or pin link, paste it and tap analyze. For X videos, choose a quality and download the MP4 in your browser. Pinterest files open in a new tab, where you save them from the browser or player menu.',
      ],
      list: [
        'Copy the post link from the app or the website.',
        'Paste it into the field and tap analyze link.',
        'Check the preview and the media format found.',
        'For videos, pick a quality and download the MP4. On Pinterest, open the media and save it from your browser.',
      ],
    },
    {
      title: 'Supported platforms and what each one delivers',
      paragraphs: [
        'Public links from X (x.com and twitter.com) and Pinterest video or image pins, including pin.it short links, work when the platform exposes a public file. Each platform has its own page with specific instructions and limitations.',
        'On X, the page shows available MP4 qualities and can extract audio as MP3 in your browser. Pinterest media opens in a new tab because its media server does not let other pages read the file; save images from the browser menu and videos from the player menu.',
        'Private, deleted or unavailable pins do not work. Instagram, Facebook, TikTok and Reddit are also not supported. The tool does not bypass logins or platform protections.',
      ],
    },
    {
      title: 'Limits, privacy and responsible use',
      paragraphs: [
        'Only public posts and pins that are still available work. Protected, deleted or login-required content cannot be reached; the tool does not bypass those protections or remove DRM.',
        'The link you paste is sent to our server to locate public media; the video or image file opens directly from the platform and is not stored by the tool. MP3 conversion happens on your device. Save only content you have the right to use and respect copyright.',
      ],
    },
  ],
  faq: [
    {
      question: 'Which platforms and media types work?',
      answer:
        'Public X (Twitter) videos and public Pinterest video or image pins, when Pinterest exposes a public file. Instagram, Facebook, TikTok and Reddit are not supported.',
    },
    {
      question: 'Is it free and do I need an account?',
      answer: 'It is free, with no sign-up and nothing to install. It works in phone and desktop browsers.',
    },
    {
      question: 'Does the media go through the site server?',
      answer:
        'The link is sent to the server to locate public media. The file opens directly from the platform in your browser; the video or image does not pass through the site or enter analytics events.',
    },
    {
      question: 'Why does Pinterest open media in another tab?',
      answer:
        'Pinterest media servers do not let other pages read the file directly. We open the media in a new tab so you can save it from the browser or player menu.',
    },
    {
      question: 'Can I open media from private or deleted posts?',
      answer: 'No. Only public content that is still available. The tool does not bypass logins, private accounts or platform protections.',
    },
  ],
};

const es: VideoDownloaderLocaleContent = {
  name: 'Descargar Videos de X y Contenido de Pinterest',
  shortDescription:
    'Pega un enlace público de X o un pin de Pinterest para abrir y guardar videos e imágenes, sin registro.',
  primaryKeyword: 'descargar videos online gratis',
  secondaryKeywords: [
    'descargar video con el enlace',
    'guardar videos de twitter y pinterest',
    'descargar video sin aplicación',
    'descargador de videos online',
    'extraer audio mp3 de un video',
    'descargar imagen de pinterest',
  ],
  searchIntent:
    'Personas que quieren guardar un video público de X o una imagen o video de un pin público de Pinterest.',
  seoTitle: 'Descargar Videos de X y Pinterest e Imágenes de Pinterest',
  seoDescription:
    'Pega un enlace público de X o Pinterest para abrir videos e imágenes en el navegador. Gratis, sin registro y sin instalar nada.',
  h1: 'Descargar Videos de X y Pinterest e Imágenes de Pinterest',
  intro:
    'Pega el enlace de una publicación pública de X o un pin de Pinterest para guardar videos e imágenes. En X puedes elegir entre las calidades disponibles. Sin registro ni aplicaciones.',
  contentBlocks: [
    {
      title: 'Cómo guardar un video o una imagen desde su enlace',
      paragraphs: [
        'Esta herramienta es para quien tiene un enlace público de video de X o un enlace de pin de Pinterest y quiere guardar el archivo en el móvil o el ordenador. En X, muestra las calidades disponibles. En Pinterest, reconoce pines públicos de video e imagen cuando la plataforma expone un archivo descargable.',
        'Copia el enlace del post o pin, pégalo y pulsa analizar. Para videos de X, elige una calidad y descarga el MP4 desde el navegador. Los archivos de Pinterest se abren en una pestaña nueva, donde puedes guardarlos desde el menú del navegador o del reproductor.',
      ],
      list: [
        'Copia el enlace de la publicación desde la app o la web.',
        'Pégalo en el campo y pulsa analizar enlace.',
        'Revisa la vista previa y el formato de contenido encontrado.',
        'Para videos, elige una calidad y descarga el MP4. En Pinterest, abre el contenido y guárdalo desde el navegador.',
      ],
    },
    {
      title: 'Plataformas compatibles y qué ofrece cada una',
      paragraphs: [
        'Funcionan enlaces públicos de X (x.com y twitter.com) y pines públicos de video o imagen de Pinterest, incluidos los enlaces cortos pin.it, cuando la plataforma expone un archivo público. Cada plataforma tiene sus propias instrucciones y limitaciones.',
        'En X, se muestran las calidades MP4 disponibles y puedes extraer el audio a MP3 en tu navegador. Los archivos de Pinterest se abren en una pestaña nueva porque su servidor multimedia no permite que otras páginas lean el contenido; guarda imágenes desde el menú del navegador y videos desde el reproductor.',
        'Los pines privados, borrados o no disponibles no funcionan. Instagram, Facebook, TikTok y Reddit tampoco son compatibles. La herramienta no elude inicios de sesión ni protecciones de las plataformas.',
      ],
    },
    {
      title: 'Límites, privacidad y uso responsable',
      paragraphs: [
        'Solo funcionan publicaciones y pines públicos que sigan disponibles. No se puede acceder a contenido protegido, borrado o que exige inicio de sesión; la herramienta no elude esas protecciones ni elimina DRM.',
        'El enlace se envía a nuestro servidor para localizar contenido público; el archivo de video o imagen se abre directamente desde la plataforma y la herramienta no lo almacena. La conversión a MP3 ocurre en tu dispositivo. Guarda solo contenido que tengas derecho a usar y respeta los derechos de autor.',
      ],
    },
  ],
  faq: [
    {
      question: '¿Qué plataformas y tipos de contenido funcionan?',
      answer:
        'Videos públicos de X (Twitter) y pines públicos de video o imagen de Pinterest, cuando la plataforma expone un archivo. Instagram, Facebook, TikTok y Reddit no son compatibles.',
    },
    {
      question: '¿Es gratis y necesito registrarme?',
      answer: 'Es gratis, sin registro y sin instalar nada. Funciona en el navegador del móvil y del ordenador.',
    },
    {
      question: '¿El contenido pasa por el servidor del sitio?',
      answer:
        'El enlace se envía al servidor para localizar contenido público. El archivo se abre directamente desde la plataforma en tu navegador; el video o la imagen no pasa por el sitio ni se incluye en los eventos de análisis.',
    },
    {
      question: '¿Por qué Pinterest abre el contenido en otra pestaña?',
      answer:
        'Los servidores de Pinterest no permiten que otras páginas lean el archivo directamente. Abrimos el contenido en una pestaña nueva para que lo guardes desde el menú del navegador o del reproductor.',
    },
    {
      question: '¿Puedo abrir contenido de publicaciones privadas o borradas?',
      answer: 'No. Solo contenido público que siga disponible. La herramienta no elude inicios de sesión, cuentas privadas ni protecciones de las plataformas.',
    },
  ],
};

const contentByLocale: Record<AppLocale, VideoDownloaderLocaleContent> = {
  'pt-br': ptBr,
  en,
  es,
  // No Chinese copy yet: the zh pages render English and show the "not translated" notice.
  zh: en,
};

export const getVideoDownloaderContent = (locale: AppLocale): VideoDownloaderLocaleContent =>
  contentByLocale[locale] ?? contentByLocale['pt-br'];

export const videoDownloaderIntro = ptBr.intro;
export const videoDownloaderContentBlocks = ptBr.contentBlocks;
export const videoDownloaderFaq = ptBr.faq;
