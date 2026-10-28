import type { VideoPlatformId } from '@/lib/video-downloader/types';
import type { ContentBlock, FaqItem } from '@/types/content';
import type { AppLocale } from '@/lib/i18n/config';

export type VideoDownloaderPlatformContent = {
  title: string;
  intro: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  placeholder: string;
  /** Short line shown next to the input, specific to what this platform delivers. */
  hint: string;
  contentBlocks: ContentBlock[];
  faq: FaqItem[];
};

type PlatformContentMap = Record<VideoPlatformId, Record<AppLocale, VideoDownloaderPlatformContent>>;

const twitterPt: VideoDownloaderPlatformContent = {
  title: 'Baixar Vídeo do Twitter (X) em MP4',
  intro:
    'Cole o link de um post público do X ou Twitter e baixe o vídeo ou GIF em MP4, escolhendo entre as qualidades que o post tem. O arquivo vem direto da plataforma para o seu navegador.',
  seoTitle: 'Baixar Vídeo do Twitter (X) Grátis | MP4 e MP3',
  seoDescription:
    'Baixe vídeos e GIFs do Twitter (X) pelo link, escolha a qualidade em MP4 ou extraia o áudio em MP3. Grátis, sem cadastro e direto no navegador.',
  keywords: ['baixar video do twitter', 'baixar video do x', 'download twitter video', 'salvar gif do twitter', 'extrair audio do twitter'],
  placeholder: 'https://x.com/usuario/status/1234567890',
  hint: 'Aceita links x.com e twitter.com, inclusive com /video/1 no final.',
  contentBlocks: [
    {
      title: 'Como baixar um vídeo do Twitter (X)',
      paragraphs: [
        'No aplicativo ou no site do X, abra o post com o vídeo, toque em compartilhar e escolha copiar link. Cole o endereço no campo acima e toque em analisar. A página lê os dados públicos do post e mostra a miniatura, o autor, a duração e as versões em MP4 que o X publicou para aquele vídeo.',
        'Escolha a qualidade e toque em baixar. O arquivo é transferido direto do servidor de vídeo do X para o seu navegador, com barra de progresso, e salvo no aparelho. Você pode cancelar no meio sem deixar nada guardado.',
      ],
      list: [
        'Cada vídeo costuma ter versões de 270p a 720p; vídeos enviados em alta podem ter 1080p ou mais.',
        'Posts com GIF animado são entregues como MP4 sem áudio.',
        'O botão de MP3 converte o som no seu dispositivo, sem enviar o vídeo a nenhum servidor.',
      ],
    },
    {
      title: 'Qual qualidade escolher',
      paragraphs: [
        'A lista mostra apenas as versões que o X realmente oferece para o post, da maior para a menor. Para assistir em tela cheia ou editar, use a maior resolução; para mandar por mensagem ou economizar plano de dados, uma versão de 360p ou 480p costuma bastar e gera arquivos bem menores.',
        'O tamanho exibido ao lado de cada qualidade é uma estimativa feita com a taxa de bits e a duração. O tamanho final real aparece durante o download.',
      ],
    },
    {
      title: 'O que não funciona e por quê',
      paragraphs: [
        'Posts de contas protegidas, tweets apagados e conteúdo que o X exige login para mostrar não podem ser acessados. Quando o post tem mais de um vídeo, a ferramenta usa o primeiro. Transmissões ao vivo em andamento e vídeos que só existem em lista de reprodução HLS não são oferecidos para download.',
        'Baixe somente vídeos que você tem direito de salvar. A ferramenta usa apenas as informações públicas do post e não contorna nenhuma proteção.',
      ],
    },
  ],
  faq: [
    {
      question: 'Funciona com links twitter.com e x.com?',
      answer: 'Sim. Os dois domínios são aceitos, inclusive links copiados do celular com parâmetros extras e terminados em /video/1.',
    },
    {
      question: 'Consigo baixar só o áudio do vídeo?',
      answer:
        'Sim. Depois de analisar o link, use a opção de extrair áudio em MP3. A conversão acontece no seu navegador e o primeiro uso carrega o conversor, o que pode levar alguns instantes.',
    },
    {
      question: 'Por que o GIF vem sem som?',
      answer: 'O X guarda GIFs como vídeos MP4 curtos sem faixa de áudio. Por isso o arquivo baixado também não tem som.',
    },
    {
      question: 'Por que aparece que o post não está disponível?',
      answer: 'O post pode ter sido apagado, ser de uma conta protegida ou exigir login para ser exibido. Nesses casos não há como acessar o vídeo.',
    },
  ],
};

const twitterEn: VideoDownloaderPlatformContent = {
  title: 'Download Twitter (X) Videos as MP4',
  intro:
    'Paste the link of a public X or Twitter post and download the video or GIF as MP4, choosing from the qualities the post has. The file comes straight from the platform to your browser.',
  seoTitle: 'Free Twitter (X) Video Downloader | MP4 and MP3',
  seoDescription:
    'Download Twitter (X) videos and GIFs from the link, pick the MP4 quality or extract the audio as MP3. Free, no sign-up and right in your browser.',
  keywords: ['download twitter video', 'twitter video downloader', 'x video downloader', 'save twitter gif', 'extract audio from twitter video'],
  placeholder: 'https://x.com/username/status/1234567890',
  hint: 'Accepts x.com and twitter.com links, including ones ending in /video/1.',
  contentBlocks: [
    {
      title: 'How to download a Twitter (X) video',
      paragraphs: [
        'In the X app or website, open the post with the video, tap share and choose copy link. Paste the address in the field above and tap analyze. The page reads the post public data and shows the thumbnail, author, duration and the MP4 versions X published for that video.',
        'Pick a quality and tap download. The file is transferred straight from the X video server to your browser, with a progress bar, and saved on your device. You can cancel midway without leaving anything behind.',
      ],
      list: [
        'Each video usually has versions from 270p to 720p; clips uploaded in high quality can offer 1080p or more.',
        'Posts with an animated GIF are delivered as an MP4 without audio.',
        'The MP3 button converts the sound on your device, without sending the video to any server.',
      ],
    },
    {
      title: 'Which quality to choose',
      paragraphs: [
        'The list shows only the versions X really offers for the post, from largest to smallest. To watch full screen or edit, use the highest resolution; to send in a message or save mobile data, a 360p or 480p version is usually enough and produces much smaller files.',
        'The size shown next to each quality is an estimate based on bitrate and duration. The real final size appears during the download.',
      ],
    },
    {
      title: 'What does not work and why',
      paragraphs: [
        'Posts from protected accounts, deleted tweets and content X requires a login to show cannot be reached. When a post has more than one video, the tool uses the first. Ongoing live broadcasts and videos that only exist as an HLS playlist are not offered for download.',
        'Download only videos you have the right to save. The tool uses just the public information of the post and does not bypass any protection.',
      ],
    },
  ],
  faq: [
    {
      question: 'Does it work with twitter.com and x.com links?',
      answer: 'Yes. Both domains are accepted, including links copied from a phone with extra parameters or ending in /video/1.',
    },
    {
      question: 'Can I download only the audio?',
      answer:
        'Yes. After analyzing the link, use the extract audio (MP3) option. The conversion runs in your browser and the first use loads the converter, which can take a moment.',
    },
    {
      question: 'Why does the GIF have no sound?',
      answer: 'X stores GIFs as short MP4 videos with no audio track, so the downloaded file has no sound either.',
    },
    {
      question: 'Why does it say the post is unavailable?',
      answer: 'The post may have been deleted, belong to a protected account or require a login to be displayed. In those cases the video cannot be reached.',
    },
  ],
};

const twitterEs: VideoDownloaderPlatformContent = {
  title: 'Descargar Videos de Twitter (X) en MP4',
  intro:
    'Pega el enlace de una publicación pública de X o Twitter y descarga el video o GIF en MP4, eligiendo entre las calidades que tenga. El archivo llega directo de la plataforma a tu navegador.',
  seoTitle: 'Descargar Videos de Twitter (X) Gratis | MP4 y MP3',
  seoDescription:
    'Descarga videos y GIF de Twitter (X) con el enlace, elige la calidad en MP4 o extrae el audio en MP3. Gratis, sin registro y directo en el navegador.',
  keywords: ['descargar video de twitter', 'descargar video de x', 'guardar gif de twitter', 'bajar videos de twitter', 'extraer audio de twitter'],
  placeholder: 'https://x.com/usuario/status/1234567890',
  hint: 'Acepta enlaces de x.com y twitter.com, incluso los que terminan en /video/1.',
  contentBlocks: [
    {
      title: 'Cómo descargar un video de Twitter (X)',
      paragraphs: [
        'En la app o la web de X, abre la publicación con el video, pulsa compartir y elige copiar enlace. Pega la dirección en el campo de arriba y pulsa analizar. La página lee los datos públicos de la publicación y muestra la miniatura, el autor, la duración y las versiones MP4 que X publicó para ese video.',
        'Elige una calidad y pulsa descargar. El archivo se transfiere directo del servidor de video de X a tu navegador, con barra de progreso, y se guarda en el dispositivo. Puedes cancelar a mitad sin dejar nada guardado.',
      ],
      list: [
        'Cada video suele tener versiones de 270p a 720p; los subidos en alta calidad pueden ofrecer 1080p o más.',
        'Las publicaciones con GIF animado se entregan como MP4 sin audio.',
        'El botón de MP3 convierte el sonido en tu dispositivo, sin enviar el video a ningún servidor.',
      ],
    },
    {
      title: 'Qué calidad elegir',
      paragraphs: [
        'La lista muestra solo las versiones que X realmente ofrece para la publicación, de mayor a menor. Para verlo en pantalla completa o editarlo usa la mayor resolución; para enviarlo por mensaje o ahorrar datos, una versión de 360p o 480p suele bastar y genera archivos mucho más pequeños.',
        'El tamaño junto a cada calidad es una estimación basada en la tasa de bits y la duración. El tamaño final real aparece durante la descarga.',
      ],
    },
    {
      title: 'Qué no funciona y por qué',
      paragraphs: [
        'Las publicaciones de cuentas protegidas, los tuits borrados y el contenido que X solo muestra con sesión iniciada no son accesibles. Si la publicación tiene más de un video, se usa el primero. Las transmisiones en vivo en curso y los videos que solo existen como lista HLS no se ofrecen para descargar.',
        'Descarga solo videos que tengas derecho a guardar. La herramienta usa únicamente la información pública de la publicación y no elude ninguna protección.',
      ],
    },
  ],
  faq: [
    {
      question: '¿Funciona con enlaces de twitter.com y x.com?',
      answer: 'Sí. Se aceptan ambos dominios, incluso enlaces copiados desde el móvil con parámetros extra o terminados en /video/1.',
    },
    {
      question: '¿Puedo descargar solo el audio?',
      answer:
        'Sí. Tras analizar el enlace, usa la opción de extraer audio en MP3. La conversión se hace en tu navegador y el primer uso carga el conversor, lo que puede tardar un momento.',
    },
    {
      question: '¿Por qué el GIF no tiene sonido?',
      answer: 'X guarda los GIF como videos MP4 cortos sin pista de audio, así que el archivo descargado tampoco tiene sonido.',
    },
    {
      question: '¿Por qué dice que la publicación no está disponible?',
      answer: 'Puede haberse borrado, ser de una cuenta protegida o exigir inicio de sesión para mostrarse. En esos casos no se puede acceder al video.',
    },
  ],
};

const pinterestPt: VideoDownloaderPlatformContent = {
  title: 'Baixar Vídeo do Pinterest pelo Link do Pin',
  intro:
    'Cole o link de um pin de vídeo do Pinterest, inclusive links curtos pin.it, e abra o arquivo MP4 original para salvar no aparelho. Funciona com pins públicos, sem cadastro.',
  seoTitle: 'Baixar Vídeo do Pinterest Grátis | Link do Pin em MP4',
  seoDescription:
    'Encontre o arquivo de vídeo de um pin público do Pinterest pelo link, inclusive pin.it, e salve o MP4 no celular ou computador. Grátis e sem cadastro.',
  keywords: ['baixar video do pinterest', 'download pinterest video', 'salvar video do pin', 'baixar pin pin.it', 'pinterest video mp4'],
  placeholder: 'https://www.pinterest.com/pin/1234567890123/',
  hint: 'Aceita links de pin do Pinterest e links curtos pin.it.',
  contentBlocks: [
    {
      title: 'Como salvar o vídeo de um pin',
      paragraphs: [
        'No Pinterest, abra o pin com vídeo, toque nos três pontos ou em compartilhar e copie o link. Cole aqui e toque em analisar. A página lê os dados públicos do pin, mostra miniatura, título, autor e duração, e localiza o arquivo MP4 que o Pinterest publica para aquele vídeo.',
        'Ao tocar em abrir vídeo, o arquivo original abre em uma nova aba. De lá, use o menu do player (três pontos, opção de download) ou o botão direito do mouse com salvar vídeo como. No celular, toque e segure o vídeo ou use o menu de compartilhar do navegador.',
      ],
      list: [
        'Links curtos pin.it são resolvidos automaticamente para o pin original.',
        'Links de países diferentes, como br.pinterest.com, funcionam normalmente.',
        'Cada pin de vídeo normalmente tem uma única versão MP4, geralmente em 720p.',
      ],
    },
    {
      title: 'Por que o vídeo abre em outra aba',
      paragraphs: [
        'O servidor de vídeos do Pinterest não autoriza que outras páginas leiam o arquivo dentro do navegador. Por isso esta ferramenta não consegue baixar o vídeo direto para a memória como faz com outras plataformas, nem converter para MP3 aqui. Também não passamos o arquivo pelo nosso servidor para contornar isso, porque o objetivo é não armazenar nem retransmitir vídeos de terceiros.',
        'O link aberto aponta para o arquivo real publicado pelo Pinterest, não para uma cópia. Se o endereço deixar de existir porque o autor apagou o pin, o vídeo some junto.',
      ],
    },
    {
      title: 'Limitações dos pins',
      paragraphs: [
        'Funciona apenas com pins que contêm vídeo e são públicos. Pins de imagem, pins de ideias com várias páginas, pins de contas ou quadros secretos e conteúdo removido retornam que nenhum vídeo foi encontrado.',
        'Muitos vídeos do Pinterest foram criados por terceiros e têm direitos autorais. Salve apenas o que você pode usar, como seus próprios pins ou material com autorização do autor.',
      ],
    },
  ],
  faq: [
    {
      question: 'Funciona com links curtos pin.it?',
      answer: 'Sim. O link curto é resolvido para o pin original e só então o vídeo é procurado.',
    },
    {
      question: 'Por que o vídeo não baixa direto?',
      answer:
        'O Pinterest não permite que outras páginas leiam o arquivo no navegador. Por isso o MP4 abre em uma nova aba e você o salva pelo menu do player ou pelo botão direito.',
    },
    {
      question: 'Por que aparece que não há vídeo no link?',
      answer: 'O pin provavelmente é uma imagem, um pin de ideias ou está privado ou removido. Só pins públicos com vídeo funcionam.',
    },
    {
      question: 'Posso escolher a qualidade?',
      answer: 'Só quando o pin oferece mais de uma versão. A maioria publica um único MP4, e a ferramenta mostra exatamente o que foi encontrado.',
    },
  ],
};

const pinterestEn: VideoDownloaderPlatformContent = {
  title: 'Download Pinterest Videos from the Pin Link',
  intro:
    'Paste the link of a Pinterest video pin, including pin.it short links, and open the original MP4 file to save it on your device. Works with public pins, no sign-up.',
  seoTitle: 'Free Pinterest Video Downloader | Pin Link to MP4',
  seoDescription:
    'Find the video file of a public Pinterest pin from its link, including pin.it, and save the MP4 on your phone or computer. Free and no sign-up.',
  keywords: ['download pinterest video', 'pinterest video downloader', 'save pinterest pin video', 'pin.it video download', 'pinterest video mp4'],
  placeholder: 'https://www.pinterest.com/pin/1234567890123/',
  hint: 'Accepts Pinterest pin links and pin.it short links.',
  contentBlocks: [
    {
      title: 'How to save a pin video',
      paragraphs: [
        'On Pinterest, open the pin with the video, tap the three dots or share and copy the link. Paste it here and tap analyze. The page reads the public data of the pin, shows thumbnail, title, author and duration, and locates the MP4 file Pinterest publishes for that video.',
        'When you tap open video, the original file opens in a new tab. From there, use the player menu (three dots, download option) or right click and save video as. On a phone, press and hold the video or use the browser share menu.',
      ],
      list: [
        'pin.it short links are resolved automatically to the original pin.',
        'Links from other countries, such as br.pinterest.com, work normally.',
        'A video pin normally has a single MP4 version, usually at 720p.',
      ],
    },
    {
      title: 'Why the video opens in another tab',
      paragraphs: [
        'Pinterest video servers do not allow other pages to read the file inside the browser. That is why this tool cannot pull the video straight into memory the way it does for other platforms, nor convert it to MP3 here. We also do not route the file through our server to get around this, because the goal is not to store or relay third-party videos.',
        'The link that opens points to the real file published by Pinterest, not to a copy. If the address stops existing because the author deleted the pin, the video disappears with it.',
      ],
    },
    {
      title: 'Limits of pins',
      paragraphs: [
        'It only works with public pins that contain video. Image pins, multi-page idea pins, pins from secret accounts or boards and removed content return that no video was found.',
        'Many Pinterest videos were created by others and are protected by copyright. Save only what you can use, such as your own pins or material with the author permission.',
      ],
    },
  ],
  faq: [
    {
      question: 'Does it work with pin.it short links?',
      answer: 'Yes. The short link is resolved to the original pin and only then is the video looked up.',
    },
    {
      question: 'Why does the video not download directly?',
      answer:
        'Pinterest does not let other pages read the file in the browser. The MP4 therefore opens in a new tab and you save it from the player menu or with a right click.',
    },
    {
      question: 'Why does it say there is no video in the link?',
      answer: 'The pin is probably an image, an idea pin, or it is private or removed. Only public pins with video work.',
    },
    {
      question: 'Can I choose the quality?',
      answer: 'Only when the pin offers more than one version. Most publish a single MP4, and the tool shows exactly what was found.',
    },
  ],
};

const pinterestEs: VideoDownloaderPlatformContent = {
  title: 'Descargar Videos de Pinterest con el Enlace del Pin',
  intro:
    'Pega el enlace de un pin de video de Pinterest, incluidos los enlaces cortos pin.it, y abre el archivo MP4 original para guardarlo en tu dispositivo. Funciona con pines públicos, sin registro.',
  seoTitle: 'Descargar Videos de Pinterest Gratis | Enlace del Pin a MP4',
  seoDescription:
    'Encuentra el archivo de video de un pin público de Pinterest con su enlace, incluido pin.it, y guarda el MP4 en el móvil u ordenador. Gratis y sin registro.',
  keywords: ['descargar video de pinterest', 'bajar video de pinterest', 'guardar video de un pin', 'descargar pin.it', 'video de pinterest mp4'],
  placeholder: 'https://www.pinterest.com/pin/1234567890123/',
  hint: 'Acepta enlaces de pin de Pinterest y enlaces cortos pin.it.',
  contentBlocks: [
    {
      title: 'Cómo guardar el video de un pin',
      paragraphs: [
        'En Pinterest, abre el pin con video, pulsa los tres puntos o compartir y copia el enlace. Pégalo aquí y pulsa analizar. La página lee los datos públicos del pin, muestra miniatura, título, autor y duración, y localiza el archivo MP4 que Pinterest publica para ese video.',
        'Al pulsar abrir video, el archivo original se abre en una pestaña nueva. Desde allí usa el menú del reproductor (tres puntos, opción de descarga) o clic derecho y guardar video como. En el móvil, mantén pulsado el video o usa el menú de compartir del navegador.',
      ],
      list: [
        'Los enlaces cortos pin.it se resuelven automáticamente al pin original.',
        'Los enlaces de otros países, como es.pinterest.com, funcionan con normalidad.',
        'Un pin de video normalmente tiene una única versión MP4, casi siempre en 720p.',
      ],
    },
    {
      title: 'Por qué el video se abre en otra pestaña',
      paragraphs: [
        'Los servidores de video de Pinterest no permiten que otras páginas lean el archivo dentro del navegador. Por eso esta herramienta no puede traer el video directo a la memoria como hace con otras plataformas, ni convertirlo a MP3 aquí. Tampoco pasamos el archivo por nuestro servidor para evitarlo, porque el objetivo es no almacenar ni retransmitir videos de terceros.',
        'El enlace que se abre apunta al archivo real publicado por Pinterest, no a una copia. Si la dirección deja de existir porque el autor borró el pin, el video desaparece con él.',
      ],
    },
    {
      title: 'Límites de los pines',
      paragraphs: [
        'Solo funciona con pines públicos que contengan video. Los pines de imagen, los pines de ideas con varias páginas, los de cuentas o tableros secretos y el contenido eliminado indican que no se encontró video.',
        'Muchos videos de Pinterest fueron creados por terceros y tienen derechos de autor. Guarda solo lo que puedas usar, como tus propios pines o material con permiso del autor.',
      ],
    },
  ],
  faq: [
    {
      question: '¿Funciona con enlaces cortos pin.it?',
      answer: 'Sí. El enlace corto se resuelve al pin original y solo entonces se busca el video.',
    },
    {
      question: '¿Por qué el video no se descarga directamente?',
      answer:
        'Pinterest no permite que otras páginas lean el archivo en el navegador. Por eso el MP4 se abre en una pestaña nueva y lo guardas desde el menú del reproductor o con clic derecho.',
    },
    {
      question: '¿Por qué dice que no hay video en el enlace?',
      answer: 'Probablemente el pin es una imagen, un pin de ideas, o es privado o fue eliminado. Solo funcionan pines públicos con video.',
    },
    {
      question: '¿Puedo elegir la calidad?',
      answer: 'Solo cuando el pin ofrece más de una versión. La mayoría publica un único MP4 y la herramienta muestra exactamente lo que encontró.',
    },
  ],
};

export const videoDownloaderPlatformContent: PlatformContentMap = {
  twitter: { 'pt-br': twitterPt, en: twitterEn, es: twitterEs, zh: twitterEn },
  pinterest: { 'pt-br': pinterestPt, en: pinterestEn, es: pinterestEs, zh: pinterestEn },
};
