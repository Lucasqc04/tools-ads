import type { AppLocale } from '@/lib/i18n/config';
import type { ContentBlock, FaqItem } from '@/types/content';

export type InstagramPostSimulatorContent = {
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

const ptBr: InstagramPostSimulatorContent = {
  name: 'Simulador de Post e Carrossel do Instagram',
  shortDescription:
    'Monte um post, carrossel ou Reel e veja como ele aparece no feed, na grade do perfil e em um iPhone simulado, sem enviar arquivos.',
  primaryKeyword: 'simulador de post do instagram',
  secondaryKeywords: [
    'prévia de carrossel do instagram',
    'simulador de feed do instagram',
    'prévia de grade do perfil instagram',
    'carrossel contínuo instagram',
    'capa de reel no instagram',
  ],
  searchIntent:
    'Pessoas que querem ver como uma foto, um carrossel ou um Reel vai ficar no feed e no perfil antes de publicar, com cortes, legenda e ordem dos slides conferidos.',
  seoTitle: 'Simulador de Post do Instagram | Carrossel, Feed e Perfil',
  seoDescription:
    'Simule posts, carrosséis e Reels no feed, na grade do perfil e em um iPhone. Confira cortes, legenda e slides antes de publicar. Arquivos não saem do navegador.',
  h1: 'Simulador de Post e Carrossel do Instagram',
  intro:
    'Escolha fotos ou vídeos, ajuste o enquadramento de cada slide e veja a publicação dentro de um iPhone, no feed ou na grade do perfil. Tudo acontece no seu navegador.',
  contentBlocks: [
    {
      title: 'Veja o post como outras pessoas vão ver',
      paragraphs: [
        'Um post bonito no computador pode ficar diferente no celular. A legenda é cortada no feed, a grade do perfil recorta a imagem em 3:4 e cada slide de um carrossel precisa de um enquadramento que funcione com os vizinhos. Este simulador mostra essas diferenças antes de você publicar.',
        'Você monta a publicação em quatro etapas: escolhe as mídias, define o formato e o enquadramento, escreve a legenda e o nome de usuário e, por fim, confere a prévia dentro de um iPhone 17 Pro. Você pode alternar entre feed, perfil e Reels, com aparência clara ou escura.',
      ],
    },
    {
      title: 'Carrossel com até 20 fotos e vídeos',
      paragraphs: [
        'Um carrossel pode ter de 1 a 20 itens, misturando fotos e vídeos. Arraste os cartões para reordenar ou use os botões de mover, que funcionam também com toque e teclado. A primeira mídia é a capa que aparece no feed e na grade do perfil.',
        'Todos os slides usam o mesmo formato (1:1, 4:5, 3:4 ou 1,91:1). Cada um tem zoom e posição próprios. Você também pode aplicar brilho, contraste e saturação, e levar o mesmo ajuste a todos os slides de uma vez.',
      ],
      list: [
        'Fotos em JPG, PNG e WebP são as mais estáveis em qualquer navegador.',
        'Vídeos aparecem na prévia com o enquadramento escolhido, mas o download entrega o arquivo original.',
        'Até 20 itens por carrossel, como no aplicativo.',
      ],
    },
    {
      title: 'Carrossel contínuo e capa de Reel',
      paragraphs: [
        'No carrossel contínuo, uma imagem larga atravessa vários slides, e a pessoa tem a sensação de que a arte continua ao deslizar. Escolha de 2 a 20 slides, o formato 4:5 ou 3:4 e ajuste a posição da imagem sobre o conjunto. As divisões aparecem no editor e cada slide é exportado com 1080 px de largura, sem espaços entre eles.',
        'Para Reels, use um único vídeo vertical e escolha a capa em um quadro do vídeo ou importe uma imagem. A ferramenta mostra como essa capa aparece no feed, na grade (3:4) e no Reel (9:16), para evitar que o rosto ou um texto fique cortado.',
      ],
    },
    {
      title: 'Privacidade e limites da simulação',
      paragraphs: [
        'As fotos e os vídeos são lidos e processados pelo próprio navegador. Eles não são enviados para os servidores do site, e a ferramenta não se conecta à API do Instagram. Nenhuma publicação real é criada: o botão de finalizar apenas mostra a prévia.',
        'A simulação é uma aproximação visual. Cores, tipografia, ícones e comportamento de rolagem seguem referências do Instagram para iPhone, mas podem diferir da versão instalada no seu aparelho. Filtros são nomes próprios da ferramenta e não reproduzem os filtros oficiais. O aplicativo também pode recomprimir arquivos ao publicar.',
      ],
    },
  ],
  faq: [
    {
      question: 'Os meus arquivos são enviados para algum servidor?',
      answer:
        'Não. Fotos e vídeos são lidos e processados no navegador. Esta ferramenta não tem upload de mídia e não usa a API do Instagram.',
    },
    {
      question: 'Esta ferramenta publica o post no Instagram?',
      answer:
        'Não. Ao finalizar, a prévia do feed aparece na tela, mas nada é enviado. Para publicar, use o aplicativo oficial do Instagram.',
    },
    {
      question: 'Quantas fotos e vídeos cabem em um carrossel?',
      answer:
        'Até 20 itens entre fotos e vídeos, o mesmo limite atual do aplicativo. Um carrossel contínuo pode ter de 2 a 20 slides.',
    },
    {
      question: 'A prévia da grade do perfil é fiel?',
      answer:
        'A grade mostra a capa em 3:4 e permite ajustar a posição sem alterar o post. A aparência é uma aproximação e pode variar conforme a versão do aplicativo.',
    },
    {
      question: 'Funciona no celular?',
      answer:
        'Sim. No celular, o editor e a prévia alternam em duas telas, e o iPhone simulado se ajusta à largura da tela. Vídeos e HEIC dependem do que o navegador consegue reproduzir.',
    },
  ],
};

const en: InstagramPostSimulatorContent = {
  name: 'Instagram Post and Carousel Simulator',
  shortDescription:
    'Build a post, carousel or Reel and see how it appears in the feed, on the profile grid and inside a simulated iPhone, without uploading files.',
  primaryKeyword: 'instagram post simulator',
  secondaryKeywords: [
    'instagram carousel preview',
    'instagram feed preview tool',
    'instagram grid preview',
    'continuous carousel instagram',
    'instagram reel cover preview',
  ],
  searchIntent:
    'People who want to see how a photo, carousel or Reel will look in the feed and on the profile before publishing, with crops, captions and slide order checked.',
  seoTitle: 'Instagram Post Simulator | Carousel, Feed and Profile Preview',
  seoDescription:
    'Preview Instagram posts, carousels and Reels in the feed, on the profile grid and inside an iPhone. Check crops, captions and slides before publishing. Files stay in your browser.',
  h1: 'Instagram Post and Carousel Simulator',
  intro:
    'Choose photos or videos, adjust the framing of each slide and see the post inside an iPhone, in the feed or on the profile grid. Everything happens in your browser.',
  contentBlocks: [
    {
      title: 'See the post the way other people will see it',
      paragraphs: [
        'A post that looks great on a computer can look different on a phone. Captions are cut short in the feed, the profile grid crops images to 3:4, and every carousel slide needs framing that works next to its neighbors. This simulator shows those differences before you publish.',
        'You build the post in four steps: pick the media, set the format and framing, write the caption and username, and finally check the preview inside an iPhone 17 Pro. You can switch between feed, profile and Reels, in light or dark appearance.',
      ],
    },
    {
      title: 'A carousel with up to 20 photos and videos',
      paragraphs: [
        'A carousel can hold from 1 to 20 items, mixing photos and videos. Drag the cards to reorder them, or use the move buttons, which also work with touch and keyboard. The first item is the cover shown in the feed and on the profile grid.',
        'Every slide shares the same format (1:1, 4:5, 3:4 or 1.91:1), while each one keeps its own zoom and position. You can also adjust brightness, contrast and saturation, and apply the same adjustment to all slides at once.',
      ],
      list: [
        'JPG, PNG and WebP photos are the most consistent across browsers.',
        'Videos appear in the preview with the framing you choose, but the download gives you the original file.',
        'Up to 20 items per carousel, the same limit as the app.',
      ],
    },
    {
      title: 'Continuous carousel and Reel cover',
      paragraphs: [
        'In a continuous carousel, one wide image runs across several slides, so the artwork seems to continue as people swipe. Choose from 2 to 20 slides, the 4:5 or 3:4 format, and position the image across the set. Dividers appear in the editor, and each slide exports at 1080 px wide with no gaps between them.',
        'For Reels, use one vertical video and choose the cover from a frame or import an image. The tool shows how that cover appears in the feed, in the grid (3:4) and in the Reel (9:16), so a face or a line of text does not get cut off unexpectedly.',
      ],
    },
    {
      title: 'Privacy and limits of the simulation',
      paragraphs: [
        'Photos and videos are read and processed by your own browser. They are not sent to the site servers, and the tool does not connect to the Instagram API. No real post is created: the finish button only shows the preview.',
        'The simulation is a visual approximation. Colors, typography, icons and scrolling follow Instagram for iPhone references, but they may differ from the version installed on your device. Filters are names created for this tool and do not reproduce Instagram’s official filters. The app may also recompress files when you publish.',
      ],
    },
  ],
  faq: [
    {
      question: 'Are my files sent to a server?',
      answer:
        'No. Photos and videos are read and processed in your browser. This tool has no media upload and does not use the Instagram API.',
    },
    {
      question: 'Does this tool publish the post on Instagram?',
      answer:
        'No. When you finish, the feed preview appears on screen, but nothing is sent. To publish, use the official Instagram app.',
    },
    {
      question: 'How many photos and videos fit in a carousel?',
      answer:
        'Up to 20 items, mixing photos and videos, which is the current app limit. A continuous carousel can have from 2 to 20 slides.',
    },
    {
      question: 'Is the profile grid preview accurate?',
      answer:
        'The grid shows the cover in 3:4 and lets you adjust its position without changing the post. The appearance is an approximation and can vary with the app version.',
    },
    {
      question: 'Does it work on a phone?',
      answer:
        'Yes. On a phone, the editor and the preview switch between two views, and the simulated iPhone fits the screen width. Video and HEIC support depend on what your browser can play.',
    },
  ],
};

const es: InstagramPostSimulatorContent = {
  name: 'Simulador de Publicación y Carrusel de Instagram',
  shortDescription:
    'Arma una publicación, un carrusel o un Reel y mira cómo se ve en el feed, en la cuadrícula del perfil y dentro de un iPhone simulado, sin subir archivos.',
  primaryKeyword: 'simulador de publicación de instagram',
  secondaryKeywords: [
    'vista previa de carrusel de instagram',
    'simulador de feed de instagram',
    'vista previa de cuadrícula de instagram',
    'carrusel continuo instagram',
    'portada de reel instagram',
  ],
  searchIntent:
    'Personas que quieren ver cómo quedará una foto, un carrusel o un Reel en el feed y en el perfil antes de publicar, revisando recortes, pie de foto y orden de los slides.',
  seoTitle: 'Simulador de Publicación de Instagram | Carrusel, Feed y Perfil',
  seoDescription:
    'Simula publicaciones, carruseles y Reels en el feed, en la cuadrícula del perfil y dentro de un iPhone. Revisa recortes, pie y slides antes de publicar. Los archivos no salen del navegador.',
  h1: 'Simulador de Publicación y Carrusel de Instagram',
  intro:
    'Elige fotos o videos, ajusta el encuadre de cada slide y mira la publicación dentro de un iPhone, en el feed o en la cuadrícula del perfil. Todo ocurre en tu navegador.',
  contentBlocks: [
    {
      title: 'Mira la publicación como la verán otras personas',
      paragraphs: [
        'Una publicación que se ve bien en la computadora puede verse distinta en el celular. El pie de foto se corta en el feed, la cuadrícula del perfil recorta la imagen a 3:4 y cada slide de un carrusel necesita un encuadre que funcione junto a sus vecinos. Este simulador muestra esas diferencias antes de publicar.',
        'Armas la publicación en cuatro pasos: eliges los medios, defines el formato y el encuadre, escribes el pie y el nombre de usuario, y por último revisas la vista previa dentro de un iPhone 17 Pro. Puedes cambiar entre feed, perfil y Reels, con apariencia clara u oscura.',
      ],
    },
    {
      title: 'Carrusel con hasta 20 fotos y videos',
      paragraphs: [
        'Un carrusel puede tener de 1 a 20 elementos, mezclando fotos y videos. Arrastra las tarjetas para reordenarlas o usa los botones de mover, que también funcionan con toque y teclado. El primer elemento es la portada que aparece en el feed y en la cuadrícula del perfil.',
        'Todos los slides comparten el mismo formato (1:1, 4:5, 3:4 o 1,91:1), y cada uno conserva su propio zoom y posición. También puedes ajustar brillo, contraste y saturación, y aplicar el mismo ajuste a todos los slides de una vez.',
      ],
      list: [
        'Las fotos en JPG, PNG y WebP son las más estables en cualquier navegador.',
        'Los videos aparecen en la vista previa con el encuadre elegido, pero la descarga entrega el archivo original.',
        'Hasta 20 elementos por carrusel, el mismo límite de la aplicación.',
      ],
    },
    {
      title: 'Carrusel continuo y portada de Reel',
      paragraphs: [
        'En un carrusel continuo, una imagen ancha atraviesa varios slides y la pieza parece continuar al deslizar. Elige de 2 a 20 slides, el formato 4:5 o 3:4 y ajusta la posición de la imagen sobre el conjunto. Las divisiones aparecen en el editor y cada slide se exporta con 1080 px de ancho, sin espacios entre ellos.',
        'Para los Reels, usa un video vertical y elige la portada en un cuadro del video o importa una imagen. La herramienta muestra cómo se ve esa portada en el feed, en la cuadrícula (3:4) y en el Reel (9:16), para evitar que un rostro o un texto queden cortados.',
      ],
    },
    {
      title: 'Privacidad y límites de la simulación',
      paragraphs: [
        'Las fotos y los videos son leídos y procesados por tu propio navegador. No se envían a los servidores del sitio y la herramienta no se conecta a la API de Instagram. No se crea ninguna publicación real: el botón de finalizar solo muestra la vista previa.',
        'La simulación es una aproximación visual. Colores, tipografía, íconos y desplazamiento siguen referencias de Instagram para iPhone, pero pueden diferir de la versión instalada en tu dispositivo. Los filtros son nombres propios de la herramienta y no reproducen los filtros oficiales. La aplicación también puede recomprimir los archivos al publicar.',
      ],
    },
  ],
  faq: [
    {
      question: '¿Mis archivos se envían a algún servidor?',
      answer:
        'No. Las fotos y los videos se leen y procesan en el navegador. Esta herramienta no tiene subida de medios y no usa la API de Instagram.',
    },
    {
      question: '¿Esta herramienta publica la publicación en Instagram?',
      answer:
        'No. Al finalizar, aparece la vista previa del feed en pantalla, pero no se envía nada. Para publicar, usa la aplicación oficial de Instagram.',
    },
    {
      question: '¿Cuántas fotos y videos caben en un carrusel?',
      answer:
        'Hasta 20 elementos entre fotos y videos, el límite actual de la aplicación. Un carrusel continuo puede tener de 2 a 20 slides.',
    },
    {
      question: '¿La vista previa de la cuadrícula del perfil es fiel?',
      answer:
        'La cuadrícula muestra la portada en 3:4 y permite ajustar la posición sin cambiar la publicación. La apariencia es una aproximación y puede variar según la versión de la aplicación.',
    },
    {
      question: '¿Funciona en el celular?',
      answer:
        'Sí. En el celular, el editor y la vista previa se alternan en dos pantallas, y el iPhone simulado se ajusta al ancho de la pantalla. El soporte de videos y HEIC depende de lo que tu navegador pueda reproducir.',
    },
  ],
};

const contentByLocale: Record<AppLocale, InstagramPostSimulatorContent> = {
  'pt-br': ptBr,
  en,
  es,
  // Sem tradução chinesa desta ferramenta ainda: usa o inglês, com aviso de rollout na página.
  zh: en,
};

export const getInstagramPostSimulatorContent = (locale: AppLocale): InstagramPostSimulatorContent =>
  contentByLocale[locale];
