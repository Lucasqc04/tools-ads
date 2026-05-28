import type { AppLocale } from '@/lib/i18n/config';
import type { ContentBlock, FaqItem } from '@/types/content';

export const colorConverterIntro =
  'Converta cores entre HEX, RGB, HSL, HSV, CMYK e outros formatos, veja preview ao vivo, copie CSS pronto e compare contraste entre cores.';

export const colorConverterContentBlocks: ContentBlock[] = [
  {
    title: 'Conversor de cores com preview e múltiplos formatos',
    paragraphs: [
      'Esta ferramenta converte cores automaticamente entre os formatos mais usados em CSS, design, frontend e branding. Basta inserir uma cor em qualquer formato e todos os equivalentes aparecem instantaneamente.',
      'Além da conversão pura, você pode comparar contraste entre cores, gerar escalas de tonalidade estilo Tailwind, encontrar cores complementares, análogas e triádicas, e copiar o código CSS pronto para uso.',
    ],
  },
  {
    title: 'Formatos suportados e quando usar cada um',
    paragraphs: [
      'HEX é o formato mais comum em CSS e design. RGB é nativo dos monitores e útil para manipulação programática. HSL facilita ajustes intuitivos de tonalidade, saturação e luminosidade. HSV é usado em softwares de edição como Photoshop. CMYK é voltado para impressão.',
      'A ferramenta converte entre todos esses formatos e também mostra o nome CSS mais próximo e a classe Tailwind aproximada quando disponível.',
    ],
    list: [
      'HEX: #7c3aed — formato padrão em CSS e design tools.',
      'RGB: rgb(124, 58, 237) — modelo nativo de telas digitais.',
      'HSL: hsl(262, 83%, 58%) — ideal para ajustar tonalidade e saturação.',
      'HSV: hsv(262, 75%, 93%) — usado em softwares de edição de imagem.',
      'CMYK: cmyk(47%, 75%, 0%, 7%) — aproximação para impressão.',
    ],
  },
  {
    title: 'Contraste e acessibilidade',
    paragraphs: [
      'A seção de contraste permite verificar se a combinação de cor de texto com cor de fundo atende critérios de legibilidade. O cálculo segue a fórmula de luminância relativa usada nas diretrizes WCAG.',
      'A ferramenta sugere automaticamente se você deve usar texto claro ou escuro sobre a cor escolhida, facilitando decisões de UI e acessibilidade.',
    ],
  },
  {
    title: 'Privacidade e processamento local',
    paragraphs: [
      'Toda a conversão acontece localmente no navegador. Nenhuma cor, dado ou imagem é enviado para servidor. Você pode usar a ferramenta offline após carregar a página.',
    ],
  },
];

export const colorConverterFaq: FaqItem[] = [
  {
    question: 'O que é uma cor HEX?',
    answer:
      'HEX é uma representação hexadecimal de cor usada em CSS e design. Começa com # seguido de 6 caracteres (ou 3 abreviados). Exemplo: #7c3aed representa um roxo vibrante.',
  },
  {
    question: 'Qual a diferença entre RGB e HSL?',
    answer:
      'RGB define cor por vermelho, verde e azul (modelo de tela). HSL define por tonalidade, saturação e luminosidade, sendo mais intuitivo para ajustes visuais.',
  },
  {
    question: 'Posso copiar a cor em CSS?',
    answer:
      'Sim. Cada formato tem botão de copiar individual. Você também pode copiar como variável CSS ou copiar todos os formatos de uma vez.',
  },
  {
    question: 'A ferramenta funciona no celular?',
    answer:
      'Sim. A interface é totalmente responsiva e funciona em qualquer dispositivo com navegador moderno.',
  },
  {
    question: 'A cor é enviada para algum servidor?',
    answer:
      'Não. Todo o processamento é local no navegador. Nenhum dado sai do seu dispositivo.',
  },
  {
    question: 'O CMYK gerado é exato?',
    answer:
      'Não. A conversão de RGB para CMYK é uma aproximação matemática. Para resultados exatos de impressão, consulte o perfil ICC do equipamento.',
  },
  {
    question: 'Como escolher uma cor de texto com bom contraste?',
    answer:
      'Use a seção de contraste da ferramenta. Ela calcula a razão de contraste e indica se a combinação atende os critérios WCAG para legibilidade.',
  },
];

// --- Localized content ---

type ColorConverterLocaleContent = {
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

const contentByLocale: Record<AppLocale, ColorConverterLocaleContent> = {
  'pt-br': {
    name: 'Conversor HEX, RGB e HSL',
    shortDescription: colorConverterIntro,
    primaryKeyword: 'conversor hex rgb hsl online',
    secondaryKeywords: [
      'hex para rgb',
      'rgb para hex',
      'hex para hsl',
      'hsl para hex',
      'rgb para hsl',
      'conversor de cores',
      'color converter online',
      'conversor rgba',
      'gerador escala tailwind',
      'verificador de contraste',
    ],
    searchIntent:
      'Desenvolvedores e designers que precisam converter cores entre HEX, RGB, HSL e outros formatos com preview e código CSS pronto.',
    seoTitle: 'Conversor HEX, RGB, HSL Online | Converter Cores CSS',
    seoDescription:
      'Converta cores entre HEX, RGB, HSL, HSV e CMYK online. Preview ao vivo, contraste, escala Tailwind e código CSS pronto para copiar.',
    h1: 'Conversor de Cores HEX, RGB, HSL, HSV e CMYK Online',
    intro: colorConverterIntro,
    contentBlocks: colorConverterContentBlocks,
    faq: colorConverterFaq,
  },
  en: {
    name: 'HEX, RGB & HSL Color Converter',
    shortDescription:
      'Convert colors between HEX, RGB, HSL, HSV, CMYK and other formats, see live preview, copy CSS code and compare contrast.',
    primaryKeyword: 'hex rgb hsl color converter online',
    secondaryKeywords: [
      'hex to rgb',
      'rgb to hex',
      'hex to hsl',
      'hsl to hex',
      'rgb to hsl',
      'color converter',
      'rgba converter',
      'tailwind color scale',
      'contrast checker',
      'css color tool',
    ],
    searchIntent:
      'Developers and designers who need to convert colors between HEX, RGB, HSL and other formats with preview and ready CSS code.',
    seoTitle: 'HEX, RGB, HSL Color Converter Online | CSS Color Tool',
    seoDescription:
      'Convert colors between HEX, RGB, HSL, HSV and CMYK online. Live preview, contrast check, Tailwind scale and ready-to-copy CSS code.',
    h1: 'HEX, RGB, HSL, HSV & CMYK Color Converter Online',
    intro:
      'Convert colors between HEX, RGB, HSL, HSV, CMYK and other formats, see live preview, copy CSS code and compare contrast between colors.',
    contentBlocks: [
      {
        title: 'Color converter with preview and multiple formats',
        paragraphs: [
          'This tool automatically converts colors between the most common formats used in CSS, design, frontend and branding. Simply enter a color in any format and all equivalents appear instantly.',
          'Beyond pure conversion, you can compare contrast between colors, generate Tailwind-style shade scales, find complementary, analogous and triadic colors, and copy ready-to-use CSS code.',
        ],
      },
      {
        title: 'Supported formats and when to use each',
        paragraphs: [
          'HEX is the most common format in CSS and design. RGB is native to monitors and useful for programmatic manipulation. HSL makes intuitive adjustments to hue, saturation and lightness easier. HSV is used in editing software like Photoshop. CMYK is meant for print.',
          'The tool converts between all these formats and also shows the closest CSS color name and approximate Tailwind class when available.',
        ],
        list: [
          'HEX: #7c3aed — standard format in CSS and design tools.',
          'RGB: rgb(124, 58, 237) — native model for digital screens.',
          'HSL: hsl(262, 83%, 58%) — ideal for adjusting hue and saturation.',
          'HSV: hsv(262, 75%, 93%) — used in image editing software.',
          'CMYK: cmyk(47%, 75%, 0%, 7%) — approximation for print.',
        ],
      },
      {
        title: 'Contrast and accessibility',
        paragraphs: [
          'The contrast section lets you check if text/background color combinations meet readability criteria. The calculation follows the relative luminance formula used in WCAG guidelines.',
          'The tool automatically suggests whether you should use light or dark text on the chosen color, making UI and accessibility decisions easier.',
        ],
      },
      {
        title: 'Privacy and local processing',
        paragraphs: [
          'All conversion happens locally in the browser. No color, data or image is sent to any server. You can use the tool offline after loading the page.',
        ],
      },
    ],
    faq: [
      { question: 'What is a HEX color?', answer: 'HEX is a hexadecimal color representation used in CSS and design. It starts with # followed by 6 characters (or 3 abbreviated). Example: #7c3aed represents a vibrant purple.' },
      { question: 'What is the difference between RGB and HSL?', answer: 'RGB defines color by red, green and blue (screen model). HSL defines by hue, saturation and lightness, being more intuitive for visual adjustments.' },
      { question: 'Can I copy the color in CSS?', answer: 'Yes. Each format has an individual copy button. You can also copy as a CSS variable or copy all formats at once.' },
      { question: 'Does the tool work on mobile?', answer: 'Yes. The interface is fully responsive and works on any device with a modern browser.' },
      { question: 'Is color data sent to a server?', answer: 'No. All processing is local in the browser. No data leaves your device.' },
      { question: 'Is the CMYK conversion exact?', answer: 'No. RGB to CMYK conversion is a mathematical approximation. For exact print results, consult the equipment ICC profile.' },
      { question: 'How to choose text color with good contrast?', answer: 'Use the contrast section. It calculates the contrast ratio and indicates if the combination meets WCAG criteria for readability.' },
    ],
  },
  es: {
    name: 'Conversor HEX, RGB y HSL',
    shortDescription:
      'Convierte colores entre HEX, RGB, HSL, HSV, CMYK y otros formatos, ve una vista previa en vivo, copia código CSS y compara contraste.',
    primaryKeyword: 'conversor hex rgb hsl online',
    secondaryKeywords: [
      'hex a rgb',
      'rgb a hex',
      'hex a hsl',
      'hsl a hex',
      'rgb a hsl',
      'conversor de colores',
      'convertidor de colores online',
      'conversor rgba',
      'escala colores tailwind',
      'verificador de contraste',
    ],
    searchIntent:
      'Desarrolladores y diseñadores que necesitan convertir colores entre HEX, RGB, HSL y otros formatos con vista previa y código CSS listo.',
    seoTitle: 'Conversor HEX, RGB, HSL Online | Convertir Colores CSS',
    seoDescription:
      'Convierte colores entre HEX, RGB, HSL, HSV y CMYK online. Vista previa en vivo, contraste, escala Tailwind y código CSS listo para copiar.',
    h1: 'Conversor de Colores HEX, RGB, HSL, HSV y CMYK Online',
    intro:
      'Convierte colores entre HEX, RGB, HSL, HSV, CMYK y otros formatos, ve vista previa en vivo, copia código CSS y compara contraste entre colores.',
    contentBlocks: [
      {
        title: 'Conversor de colores con vista previa y múltiples formatos',
        paragraphs: [
          'Esta herramienta convierte colores automáticamente entre los formatos más usados en CSS, diseño, frontend y branding. Solo ingresa un color en cualquier formato y todos los equivalentes aparecen al instante.',
          'Además de la conversión, puedes comparar contraste entre colores, generar escalas de tonalidad estilo Tailwind, encontrar colores complementarios, análogos y triádicos, y copiar el código CSS listo para usar.',
        ],
      },
      {
        title: 'Formatos soportados y cuándo usar cada uno',
        paragraphs: [
          'HEX es el formato más común en CSS y diseño. RGB es nativo de los monitores y útil para manipulación programática. HSL facilita ajustes intuitivos de tono, saturación y luminosidad. HSV se usa en software de edición como Photoshop. CMYK está orientado a impresión.',
          'La herramienta convierte entre todos estos formatos y también muestra el nombre CSS más cercano y la clase Tailwind aproximada cuando está disponible.',
        ],
        list: [
          'HEX: #7c3aed — formato estándar en CSS y herramientas de diseño.',
          'RGB: rgb(124, 58, 237) — modelo nativo de pantallas digitales.',
          'HSL: hsl(262, 83%, 58%) — ideal para ajustar tono y saturación.',
          'HSV: hsv(262, 75%, 93%) — usado en software de edición de imagen.',
          'CMYK: cmyk(47%, 75%, 0%, 7%) — aproximación para impresión.',
        ],
      },
      {
        title: 'Contraste y accesibilidad',
        paragraphs: [
          'La sección de contraste permite verificar si la combinación de color de texto con color de fondo cumple criterios de legibilidad. El cálculo sigue la fórmula de luminancia relativa usada en las directrices WCAG.',
          'La herramienta sugiere automáticamente si debes usar texto claro u oscuro sobre el color elegido, facilitando decisiones de UI y accesibilidad.',
        ],
      },
      {
        title: 'Privacidad y procesamiento local',
        paragraphs: [
          'Toda la conversión ocurre localmente en el navegador. Ningún color, dato o imagen se envía al servidor. Puedes usar la herramienta offline después de cargar la página.',
        ],
      },
    ],
    faq: [
      { question: '¿Qué es un color HEX?', answer: 'HEX es una representación hexadecimal de color usada en CSS y diseño. Comienza con # seguido de 6 caracteres (o 3 abreviados). Ejemplo: #7c3aed representa un púrpura vibrante.' },
      { question: '¿Cuál es la diferencia entre RGB y HSL?', answer: 'RGB define color por rojo, verde y azul (modelo de pantalla). HSL define por tono, saturación y luminosidad, siendo más intuitivo para ajustes visuales.' },
      { question: '¿Puedo copiar el color en CSS?', answer: 'Sí. Cada formato tiene un botón de copiar individual. También puedes copiar como variable CSS o copiar todos los formatos a la vez.' },
      { question: '¿Funciona en el celular?', answer: 'Sí. La interfaz es totalmente responsiva y funciona en cualquier dispositivo con navegador moderno.' },
      { question: '¿Se envía el color a algún servidor?', answer: 'No. Todo el procesamiento es local en el navegador. Ningún dato sale de tu dispositivo.' },
      { question: '¿El CMYK generado es exacto?', answer: 'No. La conversión de RGB a CMYK es una aproximación matemática. Para resultados exactos de impresión, consulta el perfil ICC del equipo.' },
      { question: '¿Cómo elegir un color de texto con buen contraste?', answer: 'Usa la sección de contraste. Calcula la relación de contraste e indica si la combinación cumple los criterios WCAG de legibilidad.' },
    ],
  },
};

export function getColorConverterContent(locale: AppLocale): ColorConverterLocaleContent {
  return contentByLocale[locale];
}
