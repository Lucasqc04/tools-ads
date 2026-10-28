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
  name: 'Baixar Vídeo de Link Público (X e Pinterest)',
  shortDescription:
    'Cole o link de um post público do X (Twitter) ou do Pinterest, escolha a qualidade e salve o vídeo no aparelho, sem cadastro.',
  primaryKeyword: 'baixar vídeo online grátis',
  secondaryKeywords: [
    'baixar vídeo pelo link',
    'baixador de vídeos online',
    'salvar vídeo do twitter e pinterest',
    'baixar vídeo sem aplicativo',
    'extrair áudio mp3 de vídeo',
  ],
  searchIntent:
    'Pessoas que têm o link de um vídeo público e querem salvar o arquivo no celular ou no computador, escolhendo a qualidade.',
  seoTitle: 'Baixar Vídeo Online Grátis | X (Twitter) e Pinterest',
  seoDescription:
    'Cole o link de um vídeo público do X ou do Pinterest, veja as qualidades disponíveis e baixe direto no navegador. Grátis, sem cadastro e sem instalar nada.',
  h1: 'Baixar Vídeo Online Grátis: Cole o Link e Escolha a Qualidade',
  intro:
    'Cole o link de um post público do X (Twitter) ou do Pinterest, veja as qualidades realmente disponíveis e salve o vídeo no aparelho. Sem cadastro e sem instalar aplicativo.',
  contentBlocks: [
    {
      title: 'Como baixar um vídeo pelo link',
      paragraphs: [
        'Esta ferramenta serve para quem já tem o endereço de um vídeo publicado de forma aberta e quer guardar uma cópia no celular ou no computador. Você cola o link, a plataforma é reconhecida automaticamente e a página lista somente as versões que o post realmente oferece, como 270p, 360p, 720p ou 1080p quando existirem.',
        'O processo é curto: copie o link do post, cole no campo, toque em analisar, escolha a qualidade e baixe. Para vídeos do X, o arquivo MP4 é transferido direto do servidor de mídia da plataforma para o seu navegador e salvo no aparelho, com barra de progresso e botão de cancelar.',
      ],
      list: [
        'Copie o link do post no aplicativo ou no site.',
        'Cole no campo e toque em analisar link.',
        'Confira miniatura, título, duração e qualidades encontradas.',
        'Escolha a qualidade e baixe o MP4, ou extraia só o áudio em MP3 quando disponível.',
      ],
    },
    {
      title: 'Plataformas aceitas e o que cada uma entrega',
      paragraphs: [
        'Hoje funcionam links públicos do X (x.com e twitter.com) e de pins de vídeo do Pinterest (incluindo links curtos pin.it). Cada plataforma tem uma página própria com instruções e limitações específicas, e todas usam a mesma ferramenta.',
        'No X, a página mostra várias qualidades em MP4 e permite converter o áudio para MP3 no próprio navegador. No Pinterest, o vídeo é localizado e aberto em uma nova aba, porque o servidor de mídia deles não permite que outra página leia o arquivo; dali você salva pelo menu do player.',
        'Plataformas que exigem login para exibir o vídeo, como Instagram e Facebook, ou que protegem o arquivo de forma que o navegador não consegue baixá-lo, como TikTok, não são oferecidas. Preferimos não listar um serviço do que prometer algo que não funciona.',
      ],
    },
    {
      title: 'Limitações, privacidade e uso responsável',
      paragraphs: [
        'Só funcionam posts públicos. Vídeos de contas protegidas, posts apagados, conteúdo que exige login ou restrito por idade não podem ser acessados, e a ferramenta não tenta contornar nenhuma dessas proteções nem remove DRM.',
        'O link que você cola é enviado ao nosso servidor apenas para localizar o endereço do arquivo; o vídeo em si não passa pelo site e nada é armazenado. A conversão para MP3 acontece no seu dispositivo. Baixe somente conteúdo que você tem direito de salvar, como material seu, com permissão do autor ou de uso pessoal permitido, e respeite os direitos autorais.',
      ],
    },
  ],
  faq: [
    {
      question: 'Quais plataformas funcionam?',
      answer:
        'Posts públicos com vídeo do X (Twitter) e pins de vídeo do Pinterest. Instagram, Facebook, TikTok e Reddit não estão disponíveis porque exigem login ou bloqueiam o download direto pelo navegador.',
    },
    {
      question: 'É grátis e precisa de cadastro?',
      answer: 'É grátis, sem cadastro e sem instalar nada. Funciona no navegador do celular e do computador.',
    },
    {
      question: 'O vídeo passa pelo servidor do site?',
      answer:
        'Não. O servidor só recebe o link para descobrir onde o arquivo está. O download vai direto da plataforma para o seu navegador, e nada fica guardado.',
    },
    {
      question: 'Por que o Pinterest apenas abre o vídeo em outra aba?',
      answer:
        'O servidor de vídeos do Pinterest não autoriza que outras páginas leiam o arquivo. Por isso mostramos o arquivo real em uma nova aba, onde você salva pelo menu do player ou com o botão direito.',
    },
    {
      question: 'Posso baixar vídeos privados ou apagados?',
      answer: 'Não. Apenas conteúdo público e ainda disponível. A ferramenta não contorna login, contas privadas ou proteções das plataformas.',
    },
  ],
};

const en: VideoDownloaderLocaleContent = {
  name: 'Public Video Downloader (X and Pinterest)',
  shortDescription:
    'Paste the link of a public X (Twitter) or Pinterest post, pick a quality and save the video to your device, with no sign-up.',
  primaryKeyword: 'online video downloader',
  secondaryKeywords: [
    'download video from link',
    'save twitter and pinterest videos',
    'video downloader no app',
    'download video free no sign up',
    'extract mp3 from video',
  ],
  searchIntent:
    'People who have the link to a public video and want to save the file on their phone or computer, choosing the quality.',
  seoTitle: 'Free Online Video Downloader | X (Twitter) and Pinterest',
  seoDescription:
    'Paste the link of a public X or Pinterest video, see the qualities that are really available and download it in your browser. Free, no sign-up and nothing to install.',
  h1: 'Free Online Video Downloader: Paste the Link and Pick the Quality',
  intro:
    'Paste the link of a public X (Twitter) or Pinterest post, see the qualities that are actually available and save the video to your device. No sign-up, no app to install.',
  contentBlocks: [
    {
      title: 'How to download a video from its link',
      paragraphs: [
        'This tool is for people who already have the address of an openly published video and want to keep a copy on their phone or computer. You paste the link, the platform is recognised automatically, and the page lists only the versions the post really offers, such as 270p, 360p, 720p or 1080p when they exist.',
        'The flow is short: copy the post link, paste it, tap analyze, choose a quality and download. For X videos the MP4 is transferred straight from the platform media server to your browser and saved on your device, with a progress bar and a cancel button.',
      ],
      list: [
        'Copy the post link from the app or the website.',
        'Paste it into the field and tap analyze link.',
        'Check the thumbnail, title, duration and the qualities found.',
        'Pick a quality and download the MP4, or extract only the audio as MP3 when available.',
      ],
    },
    {
      title: 'Supported platforms and what each one delivers',
      paragraphs: [
        'Public links from X (x.com and twitter.com) and Pinterest video pins (including pin.it short links) work today. Each platform has its own page with specific instructions and limitations, and all of them run the same tool.',
        'On X, the page shows several MP4 qualities and can convert the audio to MP3 inside your browser. On Pinterest, the video is located and opened in a new tab, because their media server does not let other pages read the file; from there you save it with the player menu.',
        'Platforms that require login to show the video, such as Instagram and Facebook, or that protect the file so a browser cannot download it, such as TikTok, are not offered. We would rather leave a service out than promise something that does not work.',
      ],
    },
    {
      title: 'Limits, privacy and responsible use',
      paragraphs: [
        'Only public posts work. Videos from protected accounts, deleted posts, content behind a login or age-restricted content cannot be reached, and the tool does not try to bypass those protections or remove DRM.',
        'The link you paste is sent to our server only to find the address of the file; the video itself does not pass through the site and nothing is stored. MP3 conversion happens on your device. Download only content you have the right to save, such as your own material, content you have permission to use or personal use that is allowed, and respect copyright.',
      ],
    },
  ],
  faq: [
    {
      question: 'Which platforms work?',
      answer:
        'Public posts with video from X (Twitter) and Pinterest video pins. Instagram, Facebook, TikTok and Reddit are not available because they require login or block direct downloads from a browser.',
    },
    {
      question: 'Is it free and do I need an account?',
      answer: 'It is free, with no sign-up and nothing to install. It works in phone and desktop browsers.',
    },
    {
      question: 'Does the video go through the site server?',
      answer:
        'No. The server only receives the link to find where the file is. The download goes straight from the platform to your browser, and nothing is kept.',
    },
    {
      question: 'Why does Pinterest only open the video in another tab?',
      answer:
        'Pinterest video servers do not allow other pages to read the file. We show the real file in a new tab, where you save it from the player menu or with a right click.',
    },
    {
      question: 'Can I download private or deleted videos?',
      answer: 'No. Only public content that is still available. The tool does not bypass logins, private accounts or platform protections.',
    },
  ],
};

const es: VideoDownloaderLocaleContent = {
  name: 'Descargar Video de un Enlace Público (X y Pinterest)',
  shortDescription:
    'Pega el enlace de una publicación pública de X (Twitter) o Pinterest, elige la calidad y guarda el video en tu dispositivo, sin registro.',
  primaryKeyword: 'descargar videos online gratis',
  secondaryKeywords: [
    'descargar video con el enlace',
    'guardar videos de twitter y pinterest',
    'descargar video sin aplicación',
    'descargador de videos online',
    'extraer audio mp3 de un video',
  ],
  searchIntent:
    'Personas que tienen el enlace de un video público y quieren guardar el archivo en el móvil o el ordenador, eligiendo la calidad.',
  seoTitle: 'Descargar Videos Online Gratis | X (Twitter) y Pinterest',
  seoDescription:
    'Pega el enlace de un video público de X o Pinterest, mira las calidades realmente disponibles y descárgalo en el navegador. Gratis, sin registro y sin instalar nada.',
  h1: 'Descargar Videos Online Gratis: Pega el Enlace y Elige la Calidad',
  intro:
    'Pega el enlace de una publicación pública de X (Twitter) o Pinterest, mira las calidades que de verdad existen y guarda el video en tu dispositivo. Sin registro y sin instalar apps.',
  contentBlocks: [
    {
      title: 'Cómo descargar un video desde su enlace',
      paragraphs: [
        'Esta herramienta es para quien ya tiene la dirección de un video publicado de forma abierta y quiere conservar una copia en el móvil o el ordenador. Pegas el enlace, la plataforma se reconoce automáticamente y la página lista solo las versiones que la publicación ofrece de verdad, como 270p, 360p, 720p o 1080p cuando existen.',
        'El proceso es corto: copia el enlace, pégalo, pulsa analizar, elige la calidad y descarga. En los videos de X, el MP4 se transfiere directo del servidor de medios de la plataforma a tu navegador y se guarda en el dispositivo, con barra de progreso y botón para cancelar.',
      ],
      list: [
        'Copia el enlace de la publicación desde la app o la web.',
        'Pégalo en el campo y pulsa analizar enlace.',
        'Revisa la miniatura, el título, la duración y las calidades encontradas.',
        'Elige la calidad y descarga el MP4, o extrae solo el audio en MP3 cuando esté disponible.',
      ],
    },
    {
      title: 'Plataformas compatibles y qué ofrece cada una',
      paragraphs: [
        'Hoy funcionan enlaces públicos de X (x.com y twitter.com) y pines de video de Pinterest (incluidos los enlaces cortos pin.it). Cada plataforma tiene su propia página con instrucciones y limitaciones específicas, y todas usan la misma herramienta.',
        'En X, la página muestra varias calidades en MP4 y permite convertir el audio a MP3 en tu propio navegador. En Pinterest, el video se localiza y se abre en una pestaña nueva, porque su servidor de medios no deja que otras páginas lean el archivo; desde allí lo guardas con el menú del reproductor.',
        'Las plataformas que exigen inicio de sesión para mostrar el video, como Instagram y Facebook, o que protegen el archivo para que el navegador no pueda descargarlo, como TikTok, no se ofrecen. Preferimos no listar un servicio antes que prometer algo que no funciona.',
      ],
    },
    {
      title: 'Límites, privacidad y uso responsable',
      paragraphs: [
        'Solo funcionan publicaciones públicas. Los videos de cuentas protegidas, publicaciones borradas, contenido que exige inicio de sesión o con restricción de edad no son accesibles, y la herramienta no intenta eludir esas protecciones ni elimina DRM.',
        'El enlace que pegas se envía a nuestro servidor solo para localizar la dirección del archivo; el video en sí no pasa por el sitio y no se guarda nada. La conversión a MP3 ocurre en tu dispositivo. Descarga únicamente contenido que tengas derecho a guardar, como material propio, con permiso del autor o de uso personal permitido, y respeta los derechos de autor.',
      ],
    },
  ],
  faq: [
    {
      question: '¿Qué plataformas funcionan?',
      answer:
        'Publicaciones públicas con video de X (Twitter) y pines de video de Pinterest. Instagram, Facebook, TikTok y Reddit no están disponibles porque exigen inicio de sesión o bloquean la descarga directa desde el navegador.',
    },
    {
      question: '¿Es gratis y necesito registrarme?',
      answer: 'Es gratis, sin registro y sin instalar nada. Funciona en el navegador del móvil y del ordenador.',
    },
    {
      question: '¿El video pasa por el servidor del sitio?',
      answer:
        'No. El servidor solo recibe el enlace para descubrir dónde está el archivo. La descarga va directa de la plataforma a tu navegador y no se guarda nada.',
    },
    {
      question: '¿Por qué Pinterest solo abre el video en otra pestaña?',
      answer:
        'Los servidores de video de Pinterest no autorizan que otras páginas lean el archivo. Mostramos el archivo real en una pestaña nueva, donde lo guardas desde el menú del reproductor o con clic derecho.',
    },
    {
      question: '¿Puedo descargar videos privados o borrados?',
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
