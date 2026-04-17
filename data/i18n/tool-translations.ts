import type { ContentBlock, FaqItem } from '@/types/content';
import type { AppLocale } from '@/lib/i18n/config';

export type ToolTranslation = {
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

type NonPtLocale = Exclude<AppLocale, 'pt-br'>;

type ToolId = 'crypto-unit-converter' | 'html-pdf-json' | 'qr-code-generator';

const enTranslations: Record<ToolId, ToolTranslation> = {
  'crypto-unit-converter': {
    name: 'Crypto Unit Converter',
    shortDescription:
      'Convert satoshi, gwei, wei, lamport, sun, lovelace, and other on-chain units with local calculation only.',
    primaryKeyword: 'crypto unit converter',
    secondaryKeywords: [
      'satoshi converter',
      'gwei to eth',
      'wei to eth converter',
      'lamport to sol',
      'trx to sun converter',
      'bitcoin unit converter',
      'ethereum unit converter',
    ],
    searchIntent:
      'Users and developers needing precise conversion between crypto subunits without market price APIs.',
    seoTitle: 'Crypto Unit Converter: Satoshi, Gwei, Wei, Lamport and More',
    seoDescription:
      'Convert BTC, ETH, USDT, USDC, SOL, TRX, XRP, ADA and more crypto units locally with precision and no data upload.',
    h1: 'Crypto Unit Converter (Satoshi, Gwei, Wei, Lamport and more)',
    intro:
      'Convert crypto units for BTC, ETH, USDT, USDC, SOL, BNB, TRX, XRP, ADA, LTC, DOT, AVAX, ATOM, XMR, and TON in real time, with local math and no external APIs.',
    contentBlocks: [
      {
        title: 'How crypto unit conversion works',
        paragraphs: [
          'This tool converts units within the same asset only. You can convert BTC to satoshi or gwei to ETH, but not BTC to ETH. This keeps the workflow accurate and avoids exchange-rate confusion.',
          'All calculations run in-browser with fixed unit factors, including rational cases such as millisatoshi on Lightning. No external API call is required for conversion logic.',
        ],
      },
      {
        title: 'When to use it in real workflows',
        paragraphs: [
          'Explorers and wallets often display tiny amounts in satoshis, gwei, wei, or lamports. Fast conversion helps validate network fees and transfer values before settlement.',
          'It is also useful for technical documentation, onboarding guides, and support operations where both raw and human-readable units need to be shown side by side.',
        ],
        list: [
          'Review BTC fractions in satoshis.',
          'Interpret gas costs in gwei and wei.',
          'Convert lamports and sun for integration debugging.',
          'Normalize values before exporting to spreadsheets.',
        ],
      },
      {
        title: 'Important limits to understand',
        paragraphs: [
          'This converter does not provide fiat pricing (USD, EUR, BRL) and does not swap between different assets. It focuses strictly on unit math inside each chain or token.',
          'Stablecoins and token decimals can vary by network and contract implementation. Always validate precision against the official token contract in your target environment.',
        ],
      },
    ],
    faq: [
      {
        question: 'Does this tool use real-time market prices?',
        answer:
          'No. It converts fixed internal units of each asset and does not query exchange-rate APIs.',
      },
      {
        question: 'What is the difference between BTC and satoshi?',
        answer: 'Satoshi is the smallest Bitcoin unit. 1 BTC equals 100,000,000 satoshis.',
      },
      {
        question: 'What is gwei in Ethereum?',
        answer:
          'Gwei is an intermediate ETH unit commonly used to express network fees. 1 ETH equals 1,000,000,000 gwei.',
      },
      {
        question: 'Why is millisatoshi (msat) flagged as off-chain?',
        answer:
          'Millisatoshi is used in Lightning routing calculations. It is useful for technical operations but is not a direct on-chain settlement unit.',
      },
      {
        question: 'Is my input sent to a server?',
        answer:
          'No. The conversion is processed locally in your browser and input values are not sent to a backend by default.',
      },
    ],
  },
  'html-pdf-json': {
    name: 'HTML Viewer + PDF Viewer + JSON Formatter',
    shortDescription:
      'Preview HTML in sandbox, open local PDF files, and format or minify JSON directly in your browser.',
    primaryKeyword: 'json formatter online',
    secondaryKeywords: [
      'html viewer online',
      'open pdf in browser',
      'json minify online',
      'json pretty print',
    ],
    searchIntent:
      'Developers and technical teams that need local content inspection without cloud upload.',
    seoTitle: 'HTML Viewer, PDF Viewer, and JSON Formatter Online',
    seoDescription:
      'Use a 3-in-1 tool to preview HTML in sandbox, open local PDF files, and format or minify JSON with validation.',
    h1: 'Developer Utility: HTML Viewer, PDF Viewer, and JSON Formatter',
    intro:
      'Multi-purpose tool to preview HTML safely, read local PDFs, and format or minify JSON with syntax validation.',
    contentBlocks: [
      {
        title: 'HTML Viewer with sandbox preview',
        paragraphs: [
          'Paste markup and inspect rendering immediately inside a sandboxed iframe. This is useful for structure validation, UI snippet checks, and quick layout review.',
          'Even with sandbox isolation, avoid running untrusted production-grade code. The intended use is safe visual inspection, not full script execution testing.',
        ],
      },
      {
        title: 'Local PDF Viewer in the browser',
        paragraphs: [
          'When you select a PDF, the preview uses a temporary local blob URL. The file stays on your device and is not uploaded by default.',
          'This workflow is practical for checking contracts, manuals, and technical docs without sharing sensitive files through external services.',
        ],
      },
      {
        title: 'JSON formatter and minifier',
        paragraphs: [
          'The JSON panel supports both pretty-print and minify mode. Parsing errors are surfaced with readable feedback to speed up debugging.',
          'It is useful for API payload inspection, documentation cleanup, and preparing compact JSON for transport.',
        ],
        list: [
          'Pretty-print JSON for review.',
          'Minify JSON for transfer.',
          'Copy the processed output with one click.',
        ],
      },
    ],
    faq: [
      {
        question: 'Is the PDF uploaded to a server?',
        answer:
          'No. The file is read and displayed locally in your browser using a temporary URL.',
      },
      {
        question: 'Can I execute JavaScript in the HTML Viewer?',
        answer:
          'The preview uses a restricted sandbox without script execution permissions to reduce risk.',
      },
      {
        question: 'What happens if the JSON is invalid?',
        answer:
          'The formatter returns a clear error message so you can fix syntax issues before copying.',
      },
      {
        question: 'Does it work on mobile?',
        answer: 'Yes. The layout is responsive and key actions remain accessible on smaller screens.',
      },
      {
        question: 'Do I need an account to use it?',
        answer: 'No. All features are available for free without sign-up.',
      },
    ],
  },
  'qr-code-generator': {
    name: 'QR Code Generator with Logo',
    shortDescription:
      'Create QR codes for text or URLs with no sign-up, add logo branding, and export to multiple file formats.',
    primaryKeyword: 'free qr code generator',
    secondaryKeywords: [
      'qr code generator no sign up',
      'create qr code online',
      'qr code with logo',
      'custom qr code generator',
      'qr code png download',
      'qr code pdf export',
      'qr code without login',
      'unlimited qr code generator',
    ],
    searchIntent:
      'Users who need fast QR generation with branding controls and immediate download for business or operational use.',
    seoTitle: 'Free QR Code Generator Without Sign Up | PNG, SVG, PDF',
    seoDescription:
      'Generate QR codes online for free with no registration. Customize colors, add a center logo, and export PNG, JPEG, WEBP, SVG, or PDF.',
    h1: 'Free QR Code Generator Without Sign Up and With Download',
    intro:
      'Paste text, URL, payment payload, or any content and generate a free QR code in seconds. Customize style, add a center logo, and export in PNG, JPEG, WEBP, SVG, or PDF.',
    contentBlocks: [
      {
        title: 'How to use the QR Code Generator',
        paragraphs: [
          'Insert your content in the main field and the QR preview is rendered in real time directly in the browser. You can use plain text, links, payment payloads, and operational identifiers.',
          'The tool is free, does not require sign-up, and allows unlimited generation. You can create production and test variants quickly for campaigns, internal processes, and support operations.',
          'After generation, adjust visual settings such as module color, background color, shape style, margin, error correction level, and image size. You can also add a center logo for stronger branding.',
        ],
      },
      {
        title: 'Free, no sign-up, and unlimited usage',
        paragraphs: [
          'This generator is built to remove friction: no registration form, no subscription, and no artificial usage gate. Create and download QR codes immediately.',
          'That is useful for fast-moving workflows such as customer support, logistics labels, restaurant menus, onboarding materials, and paid media campaigns with frequent URL changes.',
        ],
      },
      {
        title: 'Scanning and readability best practices',
        paragraphs: [
          'For robust scanning, keep high contrast between the QR modules and the background. Avoid oversized center logos, because they reduce readable code area.',
          'If you plan to print the QR, test it on multiple devices before distribution. For screen usage, validate minimum size on both mobile and desktop under different lighting conditions.',
        ],
        list: [
          'Use dark modules on a light background for maximum contrast.',
          'Keep the logo compact with proper inner margin.',
          'Test with both iOS and Android scanners before publishing.',
        ],
      },
      {
        title: 'Privacy and local processing',
        paragraphs: [
          'QR generation runs locally in your browser. Text input, logo image, and exported files are not uploaded to a server by default in this tool.',
          'This model reduces latency, improves user control, and supports sensitive contexts such as temporary links, internal operations, and onboarding payloads.',
        ],
      },
    ],
    faq: [
      {
        question: 'Is this QR Code Generator really free?',
        answer:
          'Yes. You can generate and download QR codes for free with no account, no login, and no hidden payment flow.',
      },
      {
        question: 'Is there any daily or file usage limit?',
        answer:
          'There is no practical limit in the interface. You can generate as many QR codes as you need for personal or business use.',
      },
      {
        question: 'Can I create a QR code with a center logo?',
        answer:
          'Yes. Upload an image and the tool places it in the center area. After customization, test scanning before publishing.',
      },
      {
        question: 'Which download formats are available?',
        answer:
          'You can export PNG, JPEG, WEBP, SVG, and PDF. Compatible browsers can also copy the QR image to clipboard.',
      },
      {
        question: 'Is my content sent to a server?',
        answer:
          'No. Processing is local in your browser and entered content is not transmitted to a backend by default.',
      },
    ],
  },
};

const esTranslations: Record<ToolId, ToolTranslation> = {
  'crypto-unit-converter': {
    name: 'Conversor de Unidades Cripto',
    shortDescription:
      'Convierte satoshi, gwei, wei, lamport, sun, lovelace y otras subunidades on-chain sin usar APIs externas.',
    primaryKeyword: 'conversor de unidades cripto',
    secondaryKeywords: [
      'satoshi a btc',
      'gwei a eth',
      'wei a eth',
      'lamport a sol',
      'trx a sun',
      'conversor unidades bitcoin',
      'conversor unidades ethereum',
    ],
    searchIntent:
      'Usuarios y desarrolladores que necesitan convertir subunidades cripto con precisión sin depender de precios de mercado.',
    seoTitle: 'Conversor Cripto de Satoshi, Gwei, Wei, Lamport y Más',
    seoDescription:
      'Convierte unidades de BTC, ETH, USDT, USDC, SOL, TRX, XRP, ADA y más activos con cálculo local y sin enviar datos.',
    h1: 'Conversor de Unidades Cripto (Satoshi, Gwei, Wei, Lamport y más)',
    intro:
      'Convierte unidades de BTC, ETH, USDT, USDC, SOL, BNB, TRX, XRP, ADA, LTC, DOT, AVAX, ATOM, XMR y TON en tiempo real, con procesamiento local y sin API externa.',
    contentBlocks: [
      {
        title: 'Cómo funciona la conversión de unidades cripto',
        paragraphs: [
          'La herramienta convierte unidades del mismo activo. Puedes pasar de BTC a satoshi o de gwei a ETH, pero no de BTC a ETH. Esto evita confusiones de cotización y mantiene precisión técnica.',
          'El cálculo es matemático y local, usando factores fijos de unidad, incluyendo casos racionales como millisatoshi en Lightning. No se requiere llamada externa para convertir.',
        ],
      },
      {
        title: 'Cuándo usarla en la práctica',
        paragraphs: [
          'Explorers y wallets muestran montos pequeños en satoshis, gwei, wei o lamports. Una conversión rápida ayuda a validar comisiones y montos antes de operar.',
          'También sirve para documentación técnica, soporte y contenido educativo, donde necesitas mostrar el mismo valor en formatos técnicos y legibles.',
        ],
        list: [
          'Revisar fracciones de BTC en satoshis.',
          'Interpretar costos de red en gwei y wei.',
          'Convertir lamports y sun en debugging de integraciones.',
          'Normalizar datos antes de exportarlos a hojas de cálculo.',
        ],
      },
      {
        title: 'Limitaciones importantes',
        paragraphs: [
          'Este conversor no calcula precios fiat (USD, EUR, etc.) ni intercambia activos diferentes. El foco es convertir unidades dentro del mismo activo.',
          'Los decimales de stablecoins y tokens pueden variar según red y contrato. Valida siempre la precisión oficial en el contrato/token de tu contexto.',
        ],
      },
    ],
    faq: [
      {
        question: '¿Usa cotizaciones de mercado en tiempo real?',
        answer:
          'No. Convierte unidades internas de cada activo con factores fijos, sin consultar APIs de precio.',
      },
      {
        question: '¿Qué diferencia hay entre BTC y satoshi?',
        answer: 'Satoshi es la unidad mínima de Bitcoin. 1 BTC equivale a 100.000.000 satoshis.',
      },
      {
        question: '¿Qué es gwei en Ethereum?',
        answer:
          'Gwei es una unidad intermedia de ETH, muy usada para tarifas de red. 1 ETH equivale a 1.000.000.000 gwei.',
      },
      {
        question: '¿Por qué msat aparece como unidad off-chain?',
        answer:
          'Millisatoshi se usa en Lightning para cálculos técnicos. Es útil operativamente, pero no representa liquidación on-chain directa.',
      },
      {
        question: '¿Se envían mis datos a un servidor?',
        answer:
          'No. El procesamiento ocurre en el navegador y los valores ingresados no se transmiten a backend por defecto.',
      },
    ],
  },
  'html-pdf-json': {
    name: 'Visor HTML + Visor PDF + Formateador JSON',
    shortDescription:
      'Previsualiza HTML en sandbox, abre PDF local y formatea o minifica JSON directamente en el navegador.',
    primaryKeyword: 'formateador json online',
    secondaryKeywords: [
      'visor html online',
      'abrir pdf en navegador',
      'minificar json online',
      'json pretty print',
    ],
    searchIntent:
      'Desarrolladores y equipos técnicos que necesitan inspeccionar contenido local sin subir archivos a terceros.',
    seoTitle: 'Visor HTML, Visor PDF y Formateador JSON Online',
    seoDescription:
      'Usa una herramienta 3 en 1 para previsualizar HTML en sandbox, abrir PDF local y formatear o minificar JSON con validación.',
    h1: 'Utilidad para desarrollo: HTML Viewer, PDF Viewer y JSON Formatter',
    intro:
      'Herramienta multifunción para ver HTML con aislamiento, abrir PDF local y formatear o minificar JSON con validación de sintaxis.',
    contentBlocks: [
      {
        title: 'Visor HTML con aislamiento básico',
        paragraphs: [
          'Puedes pegar tu HTML y ver el render al instante dentro de un iframe con sandbox. Es útil para revisar estructura, bloques de contenido y layouts de forma rápida.',
          'Aunque existe aislamiento, evita ejecutar código desconocido de producción. El objetivo es inspección visual y estructural, no ejecución avanzada de scripts.',
        ],
      },
      {
        title: 'Visor PDF local en el navegador',
        paragraphs: [
          'Al seleccionar un PDF, la vista se genera con una URL local temporal (blob). El archivo permanece en tu dispositivo y no se sube automáticamente.',
          'Este flujo es útil para validar contratos, manuales y documentos técnicos sin depender de servicios externos de carga.',
        ],
      },
      {
        title: 'Formateador y minificador JSON',
        paragraphs: [
          'El bloque JSON permite formatear con indentación para lectura o minificar para reducir tamaño. Los errores de sintaxis se muestran con mensajes claros.',
          'Sirve para depuración de APIs, revisión de payloads y preparación de datos para documentación o transporte.',
        ],
        list: [
          'Formatear JSON para lectura.',
          'Minificar payload para transferencia.',
          'Copiar el resultado con un clic.',
        ],
      },
    ],
    faq: [
      {
        question: '¿El PDF se envía a algún servidor?',
        answer:
          'No. El archivo se abre localmente en tu navegador mediante una URL temporal.',
      },
      {
        question: '¿Puedo ejecutar JavaScript en el visor HTML?',
        answer:
          'El preview usa sandbox restringido y no habilita ejecución de scripts para reducir riesgos.',
      },
      {
        question: '¿Qué pasa si el JSON es inválido?',
        answer:
          'La herramienta muestra un error legible para ayudarte a corregir la sintaxis antes de copiar.',
      },
      {
        question: '¿Funciona en móvil?',
        answer:
          'Sí. La interfaz es responsive y mantiene las acciones principales accesibles en pantallas pequeñas.',
      },
      {
        question: '¿Necesito crear cuenta?',
        answer: 'No. Todas las funciones están disponibles gratis y sin registro.',
      },
    ],
  },
  'qr-code-generator': {
    name: 'Generador de Código QR con Logo',
    shortDescription:
      'Crea códigos QR gratis para texto o URL, sin registro, con logo central y descarga en varios formatos.',
    primaryKeyword: 'generador de código qr gratis',
    secondaryKeywords: [
      'qr sin registro',
      'crear qr online',
      'codigo qr con logo',
      'generador qr personalizado',
      'descargar qr png',
      'qr en pdf',
      'qr sin login',
      'generador qr ilimitado',
    ],
    searchIntent:
      'Usuarios que quieren generar códigos QR rápido, personalizarlos y descargarlos para uso comercial u operativo.',
    seoTitle: 'Generador de Código QR Gratis y Sin Registro | PNG, SVG y PDF',
    seoDescription:
      'Genera códigos QR online gratis, sin cuenta ni login. Personaliza colores, agrega logo central y exporta PNG, JPEG, WEBP, SVG o PDF.',
    h1: 'Generador de Código QR Gratis, Sin Registro y con Descarga',
    intro:
      'Pega texto, URL, payload de pago o cualquier contenido y genera un código QR gratis en segundos. Personaliza estilo, añade logo central y exporta PNG, JPEG, WEBP, SVG o PDF.',
    contentBlocks: [
      {
        title: 'Cómo usar el generador de código QR',
        paragraphs: [
          'Ingresa o pega el contenido en el campo principal y el QR se renderiza en tiempo real en tu navegador. Puedes usar texto, enlaces, payloads de pago e identificadores internos.',
          'La herramienta es gratuita, no exige registro y permite uso ilimitado para pruebas, campañas o flujos de operación internos.',
          'Después de generar, ajusta color, fondo, forma de módulos, margen, corrección de error y tamaño final. Si quieres reforzar marca, agrega un logo central.',
        ],
      },
      {
        title: 'Gratis, sin registro y sin límite práctico',
        paragraphs: [
          'El objetivo es eliminar fricción: sin formularios, sin suscripción y sin bloqueo por cantidad de uso. Puedes crear y descargar QR al instante.',
          'Esto ayuda en operaciones donde la velocidad importa, como atención al cliente, logística, menús digitales, onboarding y campañas de marketing con cambios frecuentes de URL.',
        ],
      },
      {
        title: 'Buenas prácticas de escaneo y legibilidad',
        paragraphs: [
          'Para mejorar lectura, usa alto contraste entre módulos y fondo. Evita logos excesivamente grandes, ya que reducen la zona útil de escaneo.',
          'Si vas a imprimir el QR, prueba en más de un dispositivo antes de publicarlo. Para pantallas, valida tamaño mínimo en móvil y desktop.',
        ],
        list: [
          'Usa módulos oscuros sobre fondo claro para mayor contraste.',
          'Mantén el logo pequeño con margen interno suficiente.',
          'Prueba escaneo en iOS y Android antes de distribuir.',
        ],
      },
      {
        title: 'Privacidad y procesamiento local',
        paragraphs: [
          'La generación ocurre localmente en el navegador. El texto ingresado, el logo y los archivos exportados no se suben por defecto a servidor.',
          'Este modelo reduce latencia, mejora control del usuario y facilita uso en contextos sensibles como enlaces temporales o payloads internos.',
        ],
      },
    ],
    faq: [
      {
        question: '¿El generador de QR es realmente gratis?',
        answer:
          'Sí. Puedes generar y descargar códigos QR gratis, sin cuenta, sin login y sin pago oculto.',
      },
      {
        question: '¿Existe límite diario o por archivo?',
        answer:
          'No hay un límite práctico en la interfaz. Puedes crear tantos códigos QR como necesites.',
      },
      {
        question: '¿Puedo generar QR con logo central?',
        answer:
          'Sí. Sube una imagen para el centro y luego valida el escaneo en dispositivos reales.',
      },
      {
        question: '¿Qué formatos de descarga están disponibles?',
        answer:
          'Puedes exportar PNG, JPEG, WEBP, SVG y PDF. En navegadores compatibles también puedes copiar la imagen al portapapeles.',
      },
      {
        question: '¿El contenido se envía a servidor?',
        answer:
          'No. El procesamiento es local en el navegador y el contenido no se transmite a backend por defecto.',
      },
    ],
  },
};

const translations: Record<NonPtLocale, Record<ToolId, ToolTranslation>> = {
  en: enTranslations,
  es: esTranslations,
};

export const getToolTranslation = (
  locale: NonPtLocale,
  toolId: ToolId,
): ToolTranslation => translations[locale][toolId];
