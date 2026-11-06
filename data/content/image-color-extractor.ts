import type { AppLocale } from '@/lib/i18n/config';
import type { ContentBlock, FaqItem } from '@/types/content';

export const imageColorExtractorIntro =
  'Envie uma imagem ou logo, veja as cores predominantes em HEX, RGB e HSL e copie a paleta como variáveis CSS, SCSS, JSON ou Tailwind. A análise é feita no seu navegador.';

export const imageColorExtractorContentBlocks: ContentBlock[] = [
  {
    title: 'Como extrair a paleta de uma imagem',
    paragraphs: [
      'Envie uma imagem em JPG, PNG, WebP, GIF, SVG ou BMP (uma por vez) e a ferramenta mostra as cores mais presentes, cada uma com valores em HEX, RGB e HSL e a porcentagem aproximada de pixels. Use o controle deslizante para pedir de 3 a 16 cores (o padrão é 8) e clique em extrair para refazer a análise.',
      'Por padrão, tons quase brancos e quase pretos são ignorados, porque costumam ser fundo ou sombra e não a identidade da imagem. Desmarque “Ignorar brancos” ou “Ignorar pretos” se o branco ou o preto fazem parte do que você quer. Pixels bem transparentes também ficam de fora.',
    ],
  },
  {
    title: 'Como ler o resultado e quais são os limites',
    paragraphs: [
      'Para ser rápido, o programa reduz a imagem para no máximo 400 pixels no lado maior, analisa uma amostra dos pixels, agrupa tons parecidos e junta os que ficam muito próximos. Por isso os valores são aproximados: o HEX exibido pode ser um tom vizinho da cor exata do arquivo. Se você precisa do valor exato de um logo, confirme com o arquivo original ou com o manual da marca.',
      'A porcentagem indica a fatia aproximada da imagem analisada que aquela cor ocupa. Como brancos, pretos e áreas transparentes podem ser ignorados, a soma das porcentagens pode ficar abaixo de 100%. Fotos com muitos tons, como paisagens, geram paletas diferentes conforme a quantidade de cores pedida.',
    ],
  },
  {
    title: 'Copiar a paleta para CSS, Tailwind e outros formatos',
    paragraphs: [
      'Cada botão de exportação copia o código para a área de transferência. Clicar em uma cor da paleta copia só o HEX. A seta ao lado de cada cor abre o Conversor de Cores com aquele valor, para você ver outros formatos e variações.',
    ],
    list: [
      'Variáveis CSS: bloco :root com --color-1, --color-2 e assim por diante.',
      'JSON: lista com HEX, RGB, HSL e porcentagem de cada cor.',
      'Tailwind config: trecho para theme.extend.colors com os nomes palette-1, palette-2 etc. Renomeie conforme o seu projeto.',
      'SCSS: variáveis $color-1, $color-2 e assim por diante.',
      'Lista HEX: um código por linha.',
    ],
  },
  {
    title: 'Privacidade',
    paragraphs: [
      'A imagem é lida e analisada no seu navegador, com a API Canvas, e não é enviada a nenhum servidor. Depois que a página carrega, a análise não depende de conexão com a internet.',
    ],
  },
];

export const imageColorExtractorFaq: FaqItem[] = [
  {
    question: 'A imagem é enviada para algum servidor?',
    answer:
      'Não. A análise acontece no navegador, com a API Canvas, e a imagem não sai do seu dispositivo.',
  },
  {
    question: 'Quais formatos de imagem são aceitos?',
    answer:
      'JPG, PNG, WebP, GIF, SVG e BMP, uma imagem por vez. Em fotos tiradas pelo celular, escolha o arquivo da galeria ou use a câmera, se o navegador oferecer essa opção.',
  },
  {
    question: 'Quantas cores posso extrair e por que brancos e pretos somem?',
    answer:
      'De 3 a 16 cores. Por padrão, tons quase brancos e quase pretos são ignorados para destacar as cores da imagem. Desmarque as opções “Ignorar brancos” e “Ignorar pretos” e clique em extrair para incluí-los.',
  },
  {
    question: 'O HEX extraído é exatamente a cor do arquivo?',
    answer:
      'Nem sempre. A ferramenta analisa uma versão reduzida da imagem e agrupa tons parecidos, então o resultado é aproximado. As porcentagens mostram a fatia aproximada de cada cor entre os pixels analisados.',
  },
  {
    question: 'Como uso a paleta no CSS ou no Tailwind?',
    answer:
      'Clique em “Variáveis CSS” ou em “Tailwind Config” para copiar o código e cole no seu projeto. No Tailwind, os nomes saem como palette-1, palette-2 e assim por diante; renomeie conforme o seu projeto.',
  },
];

// --- Localized content ---

type ImageColorExtractorLocaleContent = {
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

const contentByLocale: Record<AppLocale, ImageColorExtractorLocaleContent> = {
  'pt-br': {
    name: 'Extrator de Cores de Imagem',
    shortDescription: imageColorExtractorIntro,
    primaryKeyword: 'extrair cores de imagem online',
    secondaryKeywords: [
      'gerador de paleta de cores',
      'extrator de cores de foto',
      'color palette from image',
      'cores predominantes imagem',
      'paleta de cores css',
      'extrair cor de logo',
      'paleta de cores tailwind',
      'gerador tema cores',
      'image color picker online',
    ],
    searchIntent:
      'Designers e desenvolvedores que precisam extrair uma paleta de cores de uma imagem ou logo para usar em CSS, Tailwind ou design systems.',
    seoTitle: 'Extrator de Cores de Imagem Online | Gerador de Paleta',
    seoDescription:
      'Extraia cores de qualquer imagem online. Gere paletas, copie CSS, JSON ou Tailwind config. Processamento 100% local no navegador.',
    h1: 'Extrator de Cores de Imagem e Gerador de Paleta Online',
    intro: imageColorExtractorIntro,
    contentBlocks: imageColorExtractorContentBlocks,
    faq: imageColorExtractorFaq,
  },
  en: {
    name: 'Image Color Extractor',
    shortDescription:
      'Extract colors from any image directly in the browser, generate palettes, copy CSS variables and create themes for your projects — all locally.',
    primaryKeyword: 'extract colors from image online',
    secondaryKeywords: [
      'color palette generator',
      'image color picker',
      'dominant colors from photo',
      'css color palette',
      'extract colors from logo',
      'tailwind color palette',
      'theme color generator',
      'color palette from image',
      'image to palette',
    ],
    searchIntent:
      'Designers and developers who need to extract a color palette from an image or logo for use in CSS, Tailwind or design systems.',
    seoTitle: 'Image Color Extractor Online | Palette Generator',
    seoDescription:
      'Extract colors from any image online. Generate palettes, copy CSS, JSON or Tailwind config. 100% local browser processing.',
    h1: 'Image Color Extractor & Palette Generator Online',
    intro:
      'Extract colors from any image directly in the browser, generate palettes, copy CSS variables and create themes for your projects — all locally.',
    contentBlocks: [
      {
        title: '100% local color extraction',
        paragraphs: [
          'This tool analyzes uploaded images and automatically extracts the most dominant colors. All processing happens in the browser using Canvas, with no data sent to any server.',
          'You can adjust the number of extracted colors, filter whites/blacks, and export the palette in multiple formats used in CSS, Tailwind and design tools.',
        ],
      },
      {
        title: 'Available export formats',
        paragraphs: [
          'The tool offers multiple export formats for immediate use in real projects.',
        ],
        list: [
          'CSS Variables: --color-1: #7c3aed; ready to paste in :root.',
          'JSON: array with hex, rgb and hsl for each color.',
          'Tailwind config: theme.extend.colors with automatic names.',
          'Sass/SCSS: variables $color-1: #7c3aed.',
          'HEX list: simple list of hex codes.',
        ],
      },
      {
        title: 'Design systems and themes',
        paragraphs: [
          'By extracting colors from a brand image or reference photo, you can quickly generate a base color set for a design system. The tool suggests name and weight (light, main, dark) for direct use in components.',
          'Each extracted color can be opened directly in the Color Converter to explore variations, check contrast and generate scales.',
        ],
      },
      {
        title: 'Privacy and security',
        paragraphs: [
          'No image leaves your device. Processing happens via the browser Canvas API. The tool works offline after initial load.',
        ],
      },
    ],
    faq: [
      { question: 'Is the image sent to a server?', answer: 'No. All processing is local in the browser using Canvas API. No image leaves your device.' },
      { question: 'What image formats are supported?', answer: 'JPG, PNG, WebP, GIF, SVG and BMP. Any format the browser can render.' },
      { question: 'Can I adjust how many colors are extracted?', answer: 'Yes. Use the slider to select from 3 to 16 colors. More colors generate more detailed palettes.' },
      { question: 'What do the percentages on colors mean?', answer: 'They represent the approximate proportion of pixels of that color in the image. Higher percentage colors are more dominant.' },
      { question: 'How to export the palette as CSS?', answer: 'Click the export button and choose "CSS Variables". The code will be copied to your clipboard ready to paste.' },
      { question: 'Can I use extracted colors in Tailwind?', answer: 'Yes. Use the "Tailwind Config" export to generate a snippet that can be pasted directly in tailwind.config.ts extend.colors.' },
      { question: 'Does it work on mobile?', answer: 'Yes. You can upload photos from gallery or take camera photos. The interface is responsive for any screen.' },
    ],
  },
  es: {
    name: 'Extractor de Colores de Imagen',
    shortDescription:
      'Extrae colores de cualquier imagen directamente en el navegador, genera paletas, copia variables CSS y crea temas para tus proyectos — todo localmente.',
    primaryKeyword: 'extraer colores de imagen online',
    secondaryKeywords: [
      'generador de paleta de colores',
      'extractor de colores de foto',
      'colores dominantes imagen',
      'paleta de colores css',
      'extraer color de logo',
      'paleta de colores tailwind',
      'generador tema colores',
      'image color picker online',
      'paleta de colores de imagen',
    ],
    searchIntent:
      'Diseñadores y desarrolladores que necesitan extraer una paleta de colores de una imagen o logo para usar en CSS, Tailwind o design systems.',
    seoTitle: 'Extractor de Colores de Imagen Online | Generador de Paleta',
    seoDescription:
      'Extrae colores de cualquier imagen online. Genera paletas, copia CSS, JSON o Tailwind config. Procesamiento 100% local en el navegador.',
    h1: 'Extractor de Colores de Imagen y Generador de Paleta Online',
    intro:
      'Extrae colores de cualquier imagen directamente en el navegador, genera paletas, copia variables CSS y crea temas para tus proyectos — todo localmente.',
    contentBlocks: [
      {
        title: 'Extracción de colores con procesamiento 100% local',
        paragraphs: [
          'Esta herramienta analiza imágenes subidas y extrae automáticamente los colores más predominantes. Todo el procesamiento ocurre en el navegador usando Canvas, sin enviar datos al servidor.',
          'Puedes ajustar la cantidad de colores extraídos, filtrar blancos/negros, y exportar la paleta en diversos formatos usados en CSS, Tailwind y herramientas de diseño.',
        ],
      },
      {
        title: 'Formatos de exportación disponibles',
        paragraphs: [
          'La herramienta ofrece múltiples formatos de exportación para facilitar el uso inmediato de la paleta en proyectos reales.',
        ],
        list: [
          'Variables CSS: --color-1: #7c3aed; listo para copiar en :root.',
          'JSON: array con hex, rgb y hsl de cada color.',
          'Tailwind config: theme.extend.colors con nombres automáticos.',
          'Sass/SCSS: variables $color-1: #7c3aed.',
          'HEX lista: lista simple de códigos hex.',
        ],
      },
      {
        title: 'Uso en design systems y temas',
        paragraphs: [
          'Al extraer colores de una imagen de marca o foto de referencia, puedes generar rápidamente un conjunto de colores base para un design system. La herramienta sugiere nombre y peso (light, main, dark) para uso directo en componentes.',
          'Cada color extraído puede abrirse directamente en el Conversor de Colores para explorar variaciones, verificar contraste y generar escalas.',
        ],
      },
      {
        title: 'Privacidad y seguridad',
        paragraphs: [
          'Ninguna imagen sale de tu dispositivo. El procesamiento ocurre vía Canvas API del navegador. La herramienta funciona offline después de la carga inicial.',
        ],
      },
    ],
    faq: [
      { question: '¿La imagen se envía a algún servidor?', answer: 'No. Todo el procesamiento es local en el navegador usando Canvas API. Ninguna imagen sale de tu dispositivo.' },
      { question: '¿Qué formatos de imagen se aceptan?', answer: 'JPG, PNG, WebP, GIF, SVG y BMP. Cualquier formato que el navegador pueda renderizar.' },
      { question: '¿Puedo ajustar cuántos colores se extraen?', answer: 'Sí. Usa el control deslizante para seleccionar de 3 a 16 colores. Más colores generan paletas más detalladas.' },
      { question: '¿Qué significan los porcentajes en los colores?', answer: 'Representan la proporción aproximada de píxeles de ese color en la imagen. Los colores con mayor porcentaje son más predominantes.' },
      { question: '¿Cómo exportar la paleta como CSS?', answer: 'Haz clic en el botón de exportación y elige "Variables CSS". El código se copiará al portapapeles listo para pegar.' },
      { question: '¿Puedo usar colores extraídos en Tailwind?', answer: 'Sí. Usa la exportación "Tailwind Config" para generar un snippet que se puede pegar directamente en tailwind.config.ts extend.colors.' },
      { question: '¿Funciona en el celular?', answer: 'Sí. Puedes subir fotos de la galería o tomar fotos de la cámara. La interfaz es responsiva para cualquier pantalla.' },
    ],
  },
  zh: {
    name: 'Image Color Extractor',
    shortDescription:
      'Extract colors from any image directly in the browser, generate palettes, copy CSS variables and create themes for your projects — all locally.',
    primaryKeyword: 'extract colors from image online',
    secondaryKeywords: [
      'color palette generator',
      'image color picker',
      'dominant colors from photo',
      'css color palette',
      'extract colors from logo',
      'tailwind color palette',
      'theme color generator',
      'color palette from image',
      'image to palette',
    ],
    searchIntent:
      'Designers and developers who need to extract a color palette from an image or logo for use in CSS, Tailwind or design systems.',
    seoTitle: 'Image Color Extractor Online | Palette Generator',
    seoDescription:
      'Extract colors from any image online. Generate palettes, copy CSS, JSON or Tailwind config. 100% local browser processing.',
    h1: 'Image Color Extractor & Palette Generator Online',
    intro:
      'Extract colors from any image directly in the browser, generate palettes, copy CSS variables and create themes for your projects — all locally.',
    contentBlocks: [
      {
        title: '100% local color extraction',
        paragraphs: [
          'This tool analyzes uploaded images and automatically extracts the most dominant colors. All processing happens in the browser using Canvas, with no data sent to any server.',
          'You can adjust the number of extracted colors, filter whites/blacks, and export the palette in multiple formats used in CSS, Tailwind and design tools.',
        ],
      },
      {
        title: 'Available export formats',
        paragraphs: [
          'The tool offers multiple export formats for immediate use in real projects.',
        ],
        list: [
          'CSS Variables: --color-1: #7c3aed; ready to paste in :root.',
          'JSON: array with hex, rgb and hsl for each color.',
          'Tailwind config: theme.extend.colors with automatic names.',
          'Sass/SCSS: variables $color-1: #7c3aed.',
          'HEX list: simple list of hex codes.',
        ],
      },
      {
        title: 'Design systems and themes',
        paragraphs: [
          'By extracting colors from a brand image or reference photo, you can quickly generate a base color set for a design system. The tool suggests name and weight (light, main, dark) for direct use in components.',
          'Each extracted color can be opened directly in the Color Converter to explore variations, check contrast and generate scales.',
        ],
      },
      {
        title: 'Privacy and security',
        paragraphs: [
          'No image leaves your device. Processing happens via the browser Canvas API. The tool works offline after initial load.',
        ],
      },
    ],
    faq: [
      { question: 'Is the image sent to a server?', answer: 'No. All processing is local in the browser using Canvas API. No image leaves your device.' },
      { question: 'What image formats are supported?', answer: 'JPG, PNG, WebP, GIF, SVG and BMP. Any format the browser can render.' },
      { question: 'Can I adjust how many colors are extracted?', answer: 'Yes. Use the slider to select from 3 to 16 colors. More colors generate more detailed palettes.' },
      { question: 'What do the percentages on colors mean?', answer: 'They represent the approximate proportion of pixels of that color in the image. Higher percentage colors are more dominant.' },
      { question: 'How to export the palette as CSS?', answer: 'Click the export button and choose "CSS Variables". The code will be copied to your clipboard ready to paste.' },
      { question: 'Can I use extracted colors in Tailwind?', answer: 'Yes. Use the "Tailwind Config" export to generate a snippet that can be pasted directly in tailwind.config.ts extend.colors.' },
      { question: 'Does it work on mobile?', answer: 'Yes. You can upload photos from gallery or take camera photos. The interface is responsive for any screen.' },
    ],
  },
};

export function getImageColorExtractorContent(locale: AppLocale): ImageColorExtractorLocaleContent {
  return contentByLocale[locale];
}
