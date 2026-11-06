import type { AppLocale } from '@/lib/i18n/config';
import type { ContentBlock, FaqItem } from '@/types/content';

export const colorConverterIntro =
  'Digite uma cor em HEX, RGB, HSL, HSV, CMYK ou pelo nome CSS e veja todos os formatos, um preview, o contraste com outra cor e uma escala de tons.';

export const colorConverterContentBlocks: ContentBlock[] = [
  {
    title: 'O que você pode digitar e o que a ferramenta mostra',
    paragraphs: [
      'No campo da cor, digite um valor em HEX (#7c3aed, com 3, 6 ou 8 dígitos, com ou sem #), rgb(124, 58, 237) ou rgba(), hsl(262, 83%, 58%) ou hsla(), hsv(), cmyk() ou o nome de uma cor CSS em inglês, como tomato. Também dá para escolher a cor no seletor ao lado. Os números das funções devem ser inteiros e separados por vírgula: a sintaxe moderna com espaços, como rgb(124 58 237), e formatos como oklch ou lab não são reconhecidos.',
      'Para a cor #7c3aed, a ferramenta mostra HEX #7c3aed, RGB rgb(124, 58, 237), HSL hsl(262, 83%, 58%), HSV hsv(262, 76%, 93%) e CMYK cmyk(48%, 76%, 0%, 7%), além de HEX8, RGBA e HSLA. Cada linha tem um botão para copiar, e "Copiar todos" copia a lista inteira. Quando a cor tem um nome CSS exato, o nome aparece no preview, e a classe Tailwind mais próxima é indicada quando a diferença é pequena.',
    ],
  },
  {
    title: 'Contraste, escala de tons e paletas',
    paragraphs: [
      'No bloco de contraste, informe a cor do fundo e a ferramenta calcula a razão de contraste entre as duas cores, pela fórmula de luminância relativa das diretrizes WCAG, e mostra o selo AAA (7:1 ou mais), AA (4,5:1 ou mais) ou Fail. Esses limites são os de texto normal: texto grande aceita 3:1, algo que a ferramenta não indica separadamente.',
      'A escala de tons gera 11 variações da mesma matiz e saturação (de 50 a 950, como nas escalas do Tailwind) ao variar só a luminosidade, e as paletas mostram a cor complementar, três cores análogas e uma tríade. Clique em uma amostra para copiar o HEX. O botão de favoritar guarda a cor para você reutilizar depois.',
    ],
    list: [
      'HEX: formato padrão em CSS e em ferramentas de design.',
      'RGB: vermelho, verde e azul, de 0 a 255, o modelo das telas.',
      'HSL: matiz, saturação e luminosidade, bom para clarear ou escurecer uma cor.',
      'HSV: matiz, saturação e valor, usado em seletores de cor de editores de imagem.',
      'CMYK: uma aproximação matemática para impressão.',
    ],
  },
  {
    title: 'Limites e privacidade',
    paragraphs: [
      'A conversão é feita no navegador e as cores digitadas não são enviadas ao nosso servidor. As cores favoritas ficam salvas só no armazenamento local deste navegador.',
      'O CMYK é calculado a partir do RGB e não considera perfis de cor de impressão: use-o como referência, e não para fechar um arquivo gráfico. Valores aproximados na volta (por exemplo, de HSL para HEX) podem diferir em uma unidade por causa do arredondamento.',
    ],
  },
];

export const colorConverterFaq: FaqItem[] = [
  {
    question: 'Qual a diferença entre RGB e HSL?',
    answer:
      'RGB define a cor pela mistura de vermelho, verde e azul, o modelo das telas. HSL a define por matiz, saturação e luminosidade, o que facilita clarear, escurecer ou dessaturar uma cor sem trocar os três números.',
  },
  {
    question: 'Posso copiar a cor para usar em CSS?',
    answer:
      'Sim. Cada formato (HEX, HEX8, RGB, RGBA, HSL, HSLA, HSV e CMYK) tem um botão de copiar, e "Copiar todos" copia a lista. HEX, RGB e HSL funcionam direto em CSS. HSV e CMYK não são valores de CSS.',
  },
  {
    question: 'O CMYK gerado é exato?',
    answer:
      'Não. A conversão de RGB para CMYK é uma aproximação matemática, sem perfil de cor de impressão. Para resultados fiéis na gráfica, confirme com o perfil ICC do equipamento.',
  },
  {
    question: 'Como saber se o texto tem bom contraste?',
    answer:
      'Digite a cor do texto no campo principal e a do fundo no bloco de contraste. A ferramenta mostra a razão de contraste e o selo WCAG: AAA a partir de 7:1, AA a partir de 4,5:1 e Fail abaixo disso, considerando texto normal.',
  },
  {
    question: 'A cor que eu digito é enviada para algum servidor?',
    answer:
      'Não. A conversão acontece no navegador. Só as cores favoritas ficam salvas no armazenamento local do seu navegador, e você pode removê-las a qualquer momento.',
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
      'Converta cores entre HEX, RGB, HSL, HSV e CMYK online, veja o preview, o contraste WCAG e uma escala de tons, e copie cada formato.',
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
  zh: {
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
};

export function getColorConverterContent(locale: AppLocale): ColorConverterLocaleContent {
  return contentByLocale[locale];
}
