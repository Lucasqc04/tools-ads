import type { AppLocale } from '@/lib/i18n/config';
import type { ContentBlock, FaqItem } from '@/types/content';

export const cssGeneratorIntro =
  'Crie gradientes, sombras, bordas, border-radius, glassmorphism, filtros, transforms e animações CSS visualmente com sliders e copie o código pronto.';

export const cssGeneratorContentBlocks: ContentBlock[] = [
  {
    title: 'Gerador visual de CSS com preview em tempo real',
    paragraphs: [
      'Esta ferramenta permite criar efeitos CSS complexos sem precisar memorizar propriedades ou valores. Basta ajustar os sliders e ver o resultado ao vivo no preview à direita.',
      'Todos os efeitos populares estão disponíveis: box-shadow com múltiplas camadas, border-radius avançado com sintaxe elíptica, gradientes lineares, radiais e cônicos, glassmorphism com backdrop-filter, bordas com gradiente, transforms 3D, filtros de imagem e animações CSS.',
    ],
  },
  {
    title: 'Como usar o gerador de CSS visual',
    paragraphs: [
      'Escolha uma categoria no painel esquerdo (sombra, gradiente, border-radius, glassmorphism, bordas, texto, transforms, filtros ou animações). Cada categoria oferece sliders específicos para ajustar as propriedades CSS.',
      'O preview à direita atualiza em tempo real conforme você move os sliders. Você pode alterar o tipo de elemento (card, botão, input, badge) e o fundo do preview para testar diferentes cenários.',
      'Quando estiver satisfeito com o resultado, copie o código CSS gerado com um clique. O código está disponível em CSS puro, HTML + CSS, Tailwind aproximado e CSS variables.',
    ],
    list: [
      'Ajuste sombras com múltiplas camadas e direção de luz.',
      'Crie border-radius orgânico com sintaxe avançada.',
      'Gere gradientes com múltiplas cores e ângulo personalizado.',
      'Configure glassmorphism com blur, saturação e borda translúcida.',
      'Aplique transforms 3D, filtros e animações com presets.',
    ],
  },
  {
    title: 'Presets prontos para começar rápido',
    paragraphs: [
      'A ferramenta oferece dezenas de presets visuais para você começar sem configurar nada. Cards com sombra suave, botões com gradiente, efeitos glassmorphism, neumorphism e neon estão disponíveis com um clique.',
      'Cada preset pode ser personalizado depois. Carregue um preset como ponto de partida e ajuste os sliders conforme sua necessidade.',
    ],
  },
  {
    title: 'Privacidade e compatibilidade',
    paragraphs: [
      'Todo o processamento acontece localmente no navegador. Nenhum dado é enviado para servidor. Você pode usar a ferramenta offline depois de carregar a página.',
      'O CSS gerado é compatível com todos os navegadores modernos. Para propriedades como backdrop-filter, o prefixo -webkit- é incluído automaticamente para garantir suporte em Safari.',
    ],
  },
];

export const cssGeneratorFaq: FaqItem[] = [
  {
    question: 'Posso copiar o CSS gerado e usar no meu projeto?',
    answer:
      'Sim. O código CSS gerado é 100% funcional e pode ser copiado diretamente para qualquer projeto web, React, Next.js, Vue ou HTML puro.',
  },
  {
    question: 'O glassmorphism funciona em todos os navegadores?',
    answer:
      'O backdrop-filter funciona nos navegadores modernos (Chrome, Firefox, Safari, Edge). O prefixo -webkit-backdrop-filter é incluído automaticamente para Safari.',
  },
  {
    question: 'Posso gerar código Tailwind?',
    answer:
      'Sim. A ferramenta gera uma aproximação em classes Tailwind CSS. Nem todas as propriedades CSS têm equivalente exato em Tailwind, mas os valores mais comuns são convertidos.',
  },
  {
    question: 'A ferramenta salva meus estilos?',
    answer:
      'Sim. Você pode salvar presets no navegador via localStorage e exportar/importar configurações em JSON para compartilhar ou fazer backup.',
  },
  {
    question: 'Funciona no celular?',
    answer:
      'Sim. A interface é responsiva e adaptada para telas menores. No mobile, o preview aparece primeiro e os controles ficam em abas abaixo.',
  },
  {
    question: 'Preciso instalar algo ou criar conta?',
    answer:
      'Não. A ferramenta funciona diretamente no navegador, sem instalação, sem cadastro e sem envio de dados.',
  },
];

// --- Localized content ---

type CssGeneratorLocaleContent = {
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

const contentByLocale: Record<AppLocale, CssGeneratorLocaleContent> = {
  'pt-br': {
    name: 'Gerador Visual de CSS',
    shortDescription:
      'Crie gradientes, sombras, bordas, border-radius, glassmorphism, filtros e animações com sliders e copie o CSS pronto.',
    primaryKeyword: 'gerador de css visual online',
    secondaryKeywords: [
      'gerador de gradiente css',
      'gerador de sombra css',
      'gerador border-radius',
      'gerador glassmorphism',
      'gerador box-shadow',
      'css generator online',
      'gerador de botao css',
      'gerador neumorphism',
    ],
    searchIntent:
      'Desenvolvedores e designers que precisam criar efeitos CSS visualmente sem memorizar propriedades e valores.',
    seoTitle: 'Gerador Visual de CSS Online | Gradiente, Sombra, Glass, Radius',
    seoDescription:
      'Crie CSS visual com sliders: gradientes, box-shadow, border-radius, glassmorphism, filtros, transforms e animações. Preview ao vivo e código pronto para copiar.',
    h1: 'Gerador Visual de CSS com Preview em Tempo Real',
    intro: cssGeneratorIntro,
    contentBlocks: cssGeneratorContentBlocks,
    faq: cssGeneratorFaq,
  },
  en: {
    name: 'Visual CSS Generator',
    shortDescription:
      'Create gradients, shadows, borders, border-radius, glassmorphism, filters and animations with sliders and copy the CSS code.',
    primaryKeyword: 'visual css generator online',
    secondaryKeywords: [
      'css gradient generator',
      'css shadow generator',
      'border-radius generator',
      'glassmorphism generator',
      'box-shadow generator',
      'css button generator',
      'neumorphism generator',
      'css card generator',
    ],
    searchIntent:
      'Developers and designers who need to create CSS effects visually without memorizing properties and values.',
    seoTitle: 'Visual CSS Generator Online | Gradient, Shadow, Glass, Radius',
    seoDescription:
      'Create CSS visually with sliders: gradients, box-shadow, border-radius, glassmorphism, filters, transforms and animations. Live preview and ready-to-copy code.',
    h1: 'Visual CSS Generator with Live Preview',
    intro:
      'Create gradients, shadows, borders, border-radius, glassmorphism, filters, transforms and CSS animations visually with sliders and copy the ready-to-use code.',
    contentBlocks: [
      {
        title: 'Visual CSS generator with real-time preview',
        paragraphs: [
          'This tool lets you create complex CSS effects without memorizing properties or values. Just adjust the sliders and see the result live in the preview panel.',
          'All popular effects are available: box-shadow with multiple layers, advanced border-radius with elliptical syntax, linear, radial and conic gradients, glassmorphism with backdrop-filter, gradient borders, 3D transforms, image filters and CSS animations.',
        ],
      },
      {
        title: 'How to use the visual CSS generator',
        paragraphs: [
          'Choose a category in the left panel (shadow, gradient, border-radius, glassmorphism, borders, text, transforms, filters or animations). Each category offers specific sliders to adjust CSS properties.',
          'The preview on the right updates in real time as you move the sliders. You can change the element type (card, button, input, badge) and the preview background to test different scenarios.',
          'When satisfied with the result, copy the generated CSS code with one click. The code is available in pure CSS, HTML + CSS, approximate Tailwind and CSS variables.',
        ],
        list: [
          'Adjust shadows with multiple layers and light direction.',
          'Create organic border-radius with advanced syntax.',
          'Generate gradients with multiple colors and custom angle.',
          'Configure glassmorphism with blur, saturation and translucent border.',
          'Apply 3D transforms, filters and animations with presets.',
        ],
      },
      {
        title: 'Ready-made presets to start quickly',
        paragraphs: [
          'The tool offers dozens of visual presets to get you started without any configuration. Cards with soft shadows, gradient buttons, glassmorphism effects, neumorphism and neon are available with one click.',
          'Each preset can be customized afterwards. Load a preset as a starting point and adjust the sliders to your needs.',
        ],
      },
      {
        title: 'Privacy and compatibility',
        paragraphs: [
          'All processing happens locally in the browser. No data is sent to any server. You can use the tool offline after loading the page.',
          'The generated CSS is compatible with all modern browsers. For properties like backdrop-filter, the -webkit- prefix is automatically included for Safari support.',
        ],
      },
    ],
    faq: [
      {
        question: 'Can I copy the generated CSS and use it in my project?',
        answer:
          'Yes. The generated CSS code is 100% functional and can be copied directly to any web project, React, Next.js, Vue or plain HTML.',
      },
      {
        question: 'Does glassmorphism work in all browsers?',
        answer:
          'Backdrop-filter works in modern browsers (Chrome, Firefox, Safari, Edge). The -webkit-backdrop-filter prefix is automatically included for Safari.',
      },
      {
        question: 'Can I generate Tailwind code?',
        answer:
          'Yes. The tool generates an approximation in Tailwind CSS classes. Not all CSS properties have an exact Tailwind equivalent, but the most common values are converted.',
      },
      {
        question: 'Does the tool save my styles?',
        answer:
          'Yes. You can save presets in the browser via localStorage and export/import configurations in JSON to share or backup.',
      },
      {
        question: 'Does it work on mobile?',
        answer:
          'Yes. The interface is responsive and adapted for smaller screens. On mobile, the preview appears first and controls are in tabs below.',
      },
      {
        question: 'Do I need to install anything or create an account?',
        answer:
          'No. The tool works directly in the browser, no installation, no sign-up, and no data is sent.',
      },
    ],
  },
  es: {
    name: 'Generador Visual de CSS',
    shortDescription:
      'Crea gradientes, sombras, bordes, border-radius, glassmorphism, filtros y animaciones con sliders y copia el código CSS.',
    primaryKeyword: 'generador de css visual online',
    secondaryKeywords: [
      'generador de gradiente css',
      'generador de sombra css',
      'generador border-radius',
      'generador glassmorphism',
      'generador box-shadow',
      'generador de botón css',
      'generador neumorphism',
      'generador de tarjeta css',
    ],
    searchIntent:
      'Desarrolladores y diseñadores que necesitan crear efectos CSS visualmente sin memorizar propiedades y valores.',
    seoTitle: 'Generador Visual de CSS Online | Gradiente, Sombra, Glass, Radius',
    seoDescription:
      'Crea CSS visual con sliders: gradientes, box-shadow, border-radius, glassmorphism, filtros, transforms y animaciones. Vista previa en vivo y código listo para copiar.',
    h1: 'Generador Visual de CSS con Vista Previa en Tiempo Real',
    intro:
      'Crea gradientes, sombras, bordes, border-radius, glassmorphism, filtros, transforms y animaciones CSS visualmente con sliders y copia el código listo para usar.',
    contentBlocks: [
      {
        title: 'Generador visual de CSS con vista previa en tiempo real',
        paragraphs: [
          'Esta herramienta permite crear efectos CSS complejos sin memorizar propiedades o valores. Solo ajusta los sliders y ve el resultado en vivo en el panel de vista previa.',
          'Todos los efectos populares están disponibles: box-shadow con múltiples capas, border-radius avanzado con sintaxis elíptica, gradientes lineales, radiales y cónicos, glassmorphism con backdrop-filter, bordes con gradiente, transforms 3D, filtros de imagen y animaciones CSS.',
        ],
      },
      {
        title: 'Cómo usar el generador de CSS visual',
        paragraphs: [
          'Elige una categoría en el panel izquierdo (sombra, gradiente, border-radius, glassmorphism, bordes, texto, transforms, filtros o animaciones). Cada categoría ofrece sliders específicos para ajustar las propiedades CSS.',
          'La vista previa a la derecha se actualiza en tiempo real mientras mueves los sliders. Puedes cambiar el tipo de elemento (tarjeta, botón, input, badge) y el fondo de la vista previa para probar diferentes escenarios.',
          'Cuando estés satisfecho con el resultado, copia el código CSS generado con un clic. El código está disponible en CSS puro, HTML + CSS, Tailwind aproximado y CSS variables.',
        ],
        list: [
          'Ajusta sombras con múltiples capas y dirección de luz.',
          'Crea border-radius orgánico con sintaxis avanzada.',
          'Genera gradientes con múltiples colores y ángulo personalizado.',
          'Configura glassmorphism con blur, saturación y borde translúcido.',
          'Aplica transforms 3D, filtros y animaciones con presets.',
        ],
      },
      {
        title: 'Presets listos para empezar rápido',
        paragraphs: [
          'La herramienta ofrece docenas de presets visuales para empezar sin configurar nada. Tarjetas con sombra suave, botones con gradiente, efectos glassmorphism, neumorphism y neón están disponibles con un clic.',
          'Cada preset se puede personalizar después. Carga un preset como punto de partida y ajusta los sliders según tu necesidad.',
        ],
      },
      {
        title: 'Privacidad y compatibilidad',
        paragraphs: [
          'Todo el procesamiento ocurre localmente en el navegador. No se envía ningún dato al servidor. Puedes usar la herramienta offline después de cargar la página.',
          'El CSS generado es compatible con todos los navegadores modernos. Para propiedades como backdrop-filter, el prefijo -webkit- se incluye automáticamente para soporte en Safari.',
        ],
      },
    ],
    faq: [
      {
        question: '¿Puedo copiar el CSS generado y usarlo en mi proyecto?',
        answer:
          'Sí. El código CSS generado es 100% funcional y puede copiarse directamente a cualquier proyecto web, React, Next.js, Vue o HTML puro.',
      },
      {
        question: '¿El glassmorphism funciona en todos los navegadores?',
        answer:
          'El backdrop-filter funciona en navegadores modernos (Chrome, Firefox, Safari, Edge). El prefijo -webkit-backdrop-filter se incluye automáticamente para Safari.',
      },
      {
        question: '¿Puedo generar código Tailwind?',
        answer:
          'Sí. La herramienta genera una aproximación en clases Tailwind CSS. No todas las propiedades CSS tienen equivalente exacto en Tailwind, pero los valores más comunes se convierten.',
      },
      {
        question: '¿La herramienta guarda mis estilos?',
        answer:
          'Sí. Puedes guardar presets en el navegador via localStorage y exportar/importar configuraciones en JSON para compartir o hacer backup.',
      },
      {
        question: '¿Funciona en el celular?',
        answer:
          'Sí. La interfaz es responsiva y adaptada para pantallas pequeñas. En el móvil, la vista previa aparece primero y los controles están en pestañas debajo.',
      },
      {
        question: '¿Necesito instalar algo o crear una cuenta?',
        answer:
          'No. La herramienta funciona directamente en el navegador, sin instalación, sin registro y sin envío de datos.',
      },
    ],
  },
};

export function getCssGeneratorContent(locale: AppLocale): CssGeneratorLocaleContent {
  return contentByLocale[locale];
}
