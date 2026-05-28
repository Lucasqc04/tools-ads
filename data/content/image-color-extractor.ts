import type { AppLocale } from '@/lib/i18n/config';
import type { ContentBlock, FaqItem } from '@/types/content';

export const imageColorExtractorIntro =
  'Extraia cores de qualquer imagem direto no navegador, gere paletas, copie variáveis CSS e crie temas para seus projetos — tudo localmente.';

export const imageColorExtractorContentBlocks: ContentBlock[] = [
  {
    title: 'Extração de cores com processamento 100% local',
    paragraphs: [
      'Esta ferramenta analisa imagens enviadas e extrai automaticamente as cores mais predominantes. Todo o processamento ocorre no navegador usando Canvas, sem enviar dados para servidor.',
      'Você pode ajustar a quantidade de cores extraídas, filtrar brancos/pretos, e exportar a paleta em diversos formatos usados em CSS, Tailwind e ferramentas de design.',
    ],
  },
  {
    title: 'Formatos de exportação disponíveis',
    paragraphs: [
      'A ferramenta oferece múltiplos formatos de exportação para facilitar o uso imediato da paleta em projetos reais.',
    ],
    list: [
      'Variáveis CSS: --color-1: #7c3aed; pronto para copiar no :root.',
      'JSON: array com hex, rgb e hsl de cada cor.',
      'Tailwind config: theme.extend.colors com nomes automáticos.',
      'Sass/SCSS: variáveis $color-1: #7c3aed.',
      'HEX lista: lista simples de códigos hex.',
    ],
  },
  {
    title: 'Uso em design systems e temas',
    paragraphs: [
      'Ao extrair cores de uma imagem de marca ou foto de referência, você pode gerar rapidamente um conjunto de cores base para um design system. A ferramenta sugere nome e peso (light, main, dark) para uso direto em componentes.',
      'Cada cor extraída pode ser aberta diretamente no Conversor de Cores para explorar variações, verificar contraste e gerar escalas.',
    ],
  },
  {
    title: 'Privacidade e segurança',
    paragraphs: [
      'Nenhuma imagem sai do seu dispositivo. O processamento acontece via Canvas API do navegador. A ferramenta funciona offline após o carregamento inicial.',
    ],
  },
];

export const imageColorExtractorFaq: FaqItem[] = [
  {
    question: 'A imagem é enviada para algum servidor?',
    answer:
      'Não. Todo processamento é local no navegador usando Canvas API. Nenhuma imagem sai do seu dispositivo.',
  },
  {
    question: 'Quais formatos de imagem são aceitos?',
    answer:
      'JPG, PNG, WebP, GIF, SVG e BMP. Qualquer formato que o navegador consiga renderizar.',
  },
  {
    question: 'Posso ajustar quantas cores são extraídas?',
    answer:
      'Sim. Use o controle deslizante para selecionar de 3 a 16 cores. Mais cores geram paletas mais detalhadas.',
  },
  {
    question: 'O que significam as porcentagens nas cores?',
    answer:
      'Representam a proporção aproximada de pixels daquela cor na imagem. Cores com maior porcentagem são mais predominantes.',
  },
  {
    question: 'Como exportar a paleta como CSS?',
    answer:
      'Clique no botão de exportação e escolha "Variáveis CSS". O código será copiado para a área de transferência pronto para colar no seu arquivo CSS.',
  },
  {
    question: 'Posso usar cores extraídas no Tailwind?',
    answer:
      'Sim. Use a exportação "Tailwind Config" para gerar um snippet que pode ser colado diretamente em tailwind.config.ts no extend.colors.',
  },
  {
    question: 'A ferramenta funciona no celular?',
    answer:
      'Sim. Você pode fazer upload de fotos da galeria ou tirar fotos da câmera. A interface é responsiva para qualquer tela.',
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
};

export function getImageColorExtractorContent(locale: AppLocale): ImageColorExtractorLocaleContent {
  return contentByLocale[locale];
}
