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

type ToolId =
  | 'crypto-unit-converter'
  | 'html-pdf-json'
  | 'html-viewer'
  | 'pdf-viewer'
  | 'json-formatter'
  | 'cpf-generator'
  | 'password-generator'
  | 'base64-image-viewer'
  | 'image-to-base64'
  | 'image-converter'
  | 'qr-code-generator'
  | 'invisible-character';

const enTranslations: Record<ToolId, ToolTranslation> = {
  'crypto-unit-converter': {
    name: 'Crypto Unit Converter',
    shortDescription:
      'Convert satoshi, gwei, wei, lamport, sun, lovelace, and other on-chain units for free, with no sign-up and no login.',
    primaryKeyword: 'free crypto unit converter',
    secondaryKeywords: [
      'satoshi converter',
      'gwei to eth',
      'wei to eth converter',
      'lamport to sol',
      'trx to sun converter',
      'crypto converter no sign up',
      'crypto converter without login',
      'free satoshi converter',
      'bitcoin unit converter',
      'ethereum unit converter',
    ],
    searchIntent:
      'Users and developers needing fast and precise conversion between crypto subunits for free, with no sign-up.',
    seoTitle: 'Free Crypto Unit Converter | Satoshi, Gwei, Wei, Lamport',
    seoDescription:
      'Convert BTC, ETH, USDT, USDC, SOL, TRX, XRP, ADA and more crypto units locally with precision, no sign-up, and no login.',
    h1: 'Free Crypto Unit Converter Without Sign-Up and Login',
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
  'html-viewer': {
    name: 'HTML Viewer with CSS and JS',
    shortDescription:
      'Preview HTML with CSS/JS support, fullscreen mode, and multi-file upload for free, with no sign-up and no login.',
    primaryKeyword: 'free html viewer online',
    secondaryKeywords: [
      'html css js preview',
      'sandbox html viewer',
      'test html online',
      'html viewer no sign up',
      'html viewer without login',
      'fullscreen html preview',
    ],
    searchIntent:
      'Developers and creators who need a fast HTML preview tool with script/style support, no sign-up, and local rendering.',
    seoTitle: 'Free HTML Viewer Online | CSS, JS, Fullscreen, No Sign-Up',
    seoDescription:
      'Paste HTML, CSS, and JavaScript or upload multiple files to render in sandbox for free, with no sign-up, no login, and fullscreen mode.',
    h1: 'Free HTML Viewer with CSS, JS, Fullscreen, and No Sign-Up',
    intro:
      'Dedicated HTML Viewer to render and test markup with styles and scripts using local browser processing.',
    contentBlocks: [
      {
        title: 'Focused HTML preview workflow',
        paragraphs: [
          'This page is dedicated to HTML rendering only, without PDF or JSON panels in the same interface. The result is a cleaner workflow focused on web snippet testing and page behavior checks.',
          'You can run CSS and JavaScript inside a sandboxed preview to validate interactions before shipping changes.',
        ],
      },
      {
        title: 'Single editor and multi-file modes',
        paragraphs: [
          'Use editor mode to paste HTML/CSS/JS directly, or switch to file mode to upload multiple source files at once.',
          'When multiple HTML files are uploaded, you can choose the main entry file while keeping shared CSS and JS bundled for preview.',
        ],
        list: [
          'Paste HTML, CSS, and JS directly.',
          'Upload many .html, .css, and .js files in one batch.',
          'Choose the main HTML file for rendering.',
          'Open output in fullscreen or new tab.',
        ],
      },
      {
        title: 'Safety and practical limits',
        paragraphs: [
          'Scripts are executed inside a sandboxed iframe preview. Run trusted code only when testing external snippets.',
          'For larger test setups, opening preview in a new tab can improve screen usage and debugging comfort.',
        ],
      },
    ],
    faq: [
      {
        question: 'Can this HTML Viewer execute JavaScript?',
        answer:
          'Yes. JavaScript execution is supported inside the sandbox preview for practical front-end testing.',
      },
      {
        question: 'Can I upload separate HTML, CSS, and JS files?',
        answer:
          'Yes. Multi-file mode supports .html, .css, and .js uploads, including multiple HTML entry options.',
      },
      {
        question: 'Is fullscreen mode available?',
        answer:
          'Yes. You can switch preview to fullscreen and also open it in a dedicated browser tab.',
      },
      {
        question: 'Is my code uploaded to a server?',
        answer:
          'No by default. Rendering runs locally in your browser for privacy and low latency.',
      },
    ],
  },
  'pdf-viewer': {
    name: 'Local PDF Viewer',
    shortDescription:
      'Open and review PDF files locally in your browser for free, with no sign-up, no login, and new-tab option.',
    primaryKeyword: 'free pdf viewer online',
    secondaryKeywords: [
      'open pdf in browser',
      'local pdf preview',
      'pdf reader online',
      'view pdf file online',
      'pdf viewer no sign up',
      'open pdf without login',
    ],
    searchIntent:
      'Users who need a quick way to open and read PDF files for free, with no sign-up and no installation.',
    seoTitle: 'Free PDF Viewer Online | Open PDF in Browser, No Sign-Up',
    seoDescription:
      'Preview PDF files locally in your browser for free, with no sign-up, no login, and no automatic upload.',
    h1: 'Free Local PDF Viewer Without Sign-Up and Login',
    intro:
      'Open PDF files instantly in-browser for local review, with responsive layout and quick access actions.',
    contentBlocks: [
      {
        title: 'Why use a local PDF viewer',
        paragraphs: [
          'This tool keeps PDF reading lightweight and focused. Select a file and review it immediately without cloud upload steps.',
          'It is useful for checking contracts, proposals, and internal documents before sharing them externally.',
        ],
      },
      {
        title: 'Workflow benefits',
        paragraphs: [
          'You can open the same document in a dedicated tab for better screen usage and easier cross-checking with other tools.',
          'The interface is intentionally simple to prioritize readability and speed.',
        ],
      },
    ],
    faq: [
      {
        question: 'Is the PDF uploaded to a server?',
        answer:
          'No by default. The file is loaded locally in your browser for preview.',
      },
      {
        question: 'Can I open the PDF in another tab?',
        answer:
          'Yes. There is a direct action to open the current PDF preview in a new tab.',
      },
      {
        question: 'Can I edit PDFs in this tool?',
        answer:
          'No. This page is focused on local viewing and review, not PDF editing.',
      },
    ],
  },
  'json-formatter': {
    name: 'JSON Formatter and Minifier',
    shortDescription:
      'Format, minify, and validate JSON for free, with no sign-up, no login, readable error feedback, and quick copy actions.',
    primaryKeyword: 'free json formatter online',
    secondaryKeywords: [
      'json minify online',
      'json pretty print',
      'json validator',
      'format json in browser',
      'json formatter no sign up',
      'json formatter without login',
    ],
    searchIntent:
      'Developers and analysts who need a fast JSON validation and formatting utility, free and with no sign-up.',
    seoTitle: 'Free JSON Formatter Online | Minify, Validate, No Sign-Up',
    seoDescription:
      'Paste JSON to format, minify, and validate syntax in your browser for free, with no sign-up and no login.',
    h1: 'Free JSON Formatter Without Sign-Up and Login',
    intro:
      'Dedicated JSON tool for payload cleanup, syntax checks, and quick output preparation in one place.',
    contentBlocks: [
      {
        title: 'Validate before shipping payloads',
        paragraphs: [
          'The formatter validates JSON syntax before applying transformations, helping you catch malformed payloads early.',
          'Error feedback is designed to be readable so you can fix issues quickly.',
        ],
      },
      {
        title: 'Pretty print and minify in one flow',
        paragraphs: [
          'Switch between formatted output for debugging and minified output for compact transport.',
          'This helps in API testing, incident debugging, and docs preparation workflows.',
        ],
        list: [
          'Pretty print for readability.',
          'Minify for compact payload transfer.',
          'Copy processed output with one click.',
        ],
      },
    ],
    faq: [
      {
        question: 'Does this tool validate invalid JSON?',
        answer:
          'Yes. It checks syntax and returns a readable error message when parsing fails.',
      },
      {
        question: 'Can I both format and minify JSON here?',
        answer:
          'Yes. Both actions are available in the same interface.',
      },
      {
        question: 'Is my JSON uploaded to a server?',
        answer:
          'No by default. Processing runs locally in your browser.',
      },
    ],
  },
  'image-converter': {
    name: 'Image and PDF Converter',
    shortDescription:
      'Convert 20+ image formats and PDF directly in your browser with a fast, free, no-sign-up workflow.',
    primaryKeyword: 'free image to pdf converter',
    secondaryKeywords: [
      'png to jpeg',
      'jpg to pdf',
      'pdf to png',
      'webp to jpg',
      'heic to jpg',
      'tiff to png',
      'avif to png',
      'pdf to image converter',
      'image format converter online',
      'image converter no sign up',
      'pdf converter without login',
    ],
    searchIntent:
      'Users who need fast conversion between many image and PDF formats for free, with no sign-up and no login.',
    seoTitle: 'Image and PDF Converter Online (20+ Formats) | Free, No Sign-Up',
    seoDescription:
      'Convert image and PDF files with local browser processing, no forced sign-up, no login, immediate download, and broad format coverage.',
    h1: 'Free Image and PDF Converter (20+ Formats) Without Sign-Up',
    intro:
      'Convert files between 20+ image formats and PDF with local processing and direct download in just a few steps.',
    contentBlocks: [
      {
        title: 'What this converter solves in real workflows',
        paragraphs: [
          'This tool handles common production tasks such as preparing website assets, adapting file formats for upload portals, turning image files into shareable PDFs, and extracting PDF pages as image files for editing.',
          'The conversion runs in-browser, which reduces upload friction and gives users more control over documents that may contain sensitive or client-specific material.',
        ],
      },
      {
        title: 'Popular conversions for everyday tasks',
        paragraphs: [
          'You can quickly run common conversions such as png to jpeg, jpg to pdf, pdf to png, heic to jpg, and tiff to png without installing desktop software.',
          'The interface keeps the flow simple: upload, pick output format, adjust options if needed, and download the result.',
        ],
        list: [
          'PNG to JPEG for lightweight image delivery without transparency.',
          'JPEG to WEBP for modern web optimization.',
          'Image to PDF for document submission and archival.',
          'PDF to image for editing individual pages in design tools.',
        ],
      },
      {
        title: 'Quality and performance best practices',
        paragraphs: [
          'For lossy outputs such as JPEG and WEBP, quality settings help balance readability and file size. Values around 80-92% are often a practical starting point.',
          'Large PDFs can be converted in smaller page batches to keep mobile performance stable and reduce memory pressure.',
        ],
      },
    ],
    faq: [
      {
        question: 'Can I convert both image to PDF and PDF to image?',
        answer:
          'Yes. The tool supports both directions and can export PDF pages as image files.',
      },
      {
        question: 'Is this converter free?',
        answer: 'Yes. Core conversion features are free and available without mandatory sign-up.',
      },
      {
        question: 'Are files uploaded to a server?',
        answer:
          'By default, no. Processing is local in the browser, which helps with privacy and faster response.',
      },
      {
        question: 'Which formats are supported?',
        answer:
          'The tool includes 20+ format options and dedicated conversion pages. Local conversion currently covers PNG, JPEG, WEBP, AVIF, GIF, TIFF, BMP, ICO, SVG, TGA, and PDF flows, while some professional formats depend on browser support.',
      },
      {
        question: 'Does it work on mobile devices?',
        answer:
          'Yes. The interface is responsive and keeps primary actions accessible on smaller screens.',
      },
    ],
  },
  'qr-code-generator': {
    name: 'QR Code Generator with Logo',
    shortDescription:
      'Create QR codes for text or URLs for free, with no sign-up, no login, logo branding, and export to multiple formats.',
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
      'Users who need fast QR generation for free, with no sign-up, no login, branding controls, and immediate download.',
    seoTitle: 'Free QR Code Generator Without Sign-Up or Login | PNG, SVG, PDF',
    seoDescription:
      'Generate QR codes online for free with no registration. Customize colors, add a center logo, and export PNG, JPEG, WEBP, SVG, or PDF.',
    h1: 'Free QR Code Generator Without Sign-Up or Login',
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
  'invisible-character': {
    name: 'Invisible Character for Games',
    shortDescription:
      'Copy and generate invisible characters for games and social networks with 2, 3, and 4-character options plus Unicode detection.',
    primaryKeyword: 'invisible character free fire',
    secondaryKeywords: [
      'free fire invisible name',
      'invisible name cod mobile',
      'invisible text discord',
      'blank character copy paste',
      'invisible username generator',
      'invisible character for games',
    ],
    searchIntent:
      'Players and social users who want to copy and test hidden Unicode patterns for display names and nicknames.',
    seoTitle: 'Invisible Character for Free Fire, COD, and Discord | Copy and Paste',
    seoDescription:
      'Copy invisible characters and generate 2-4 character invisible names for Free Fire, COD Mobile, Discord, and more platforms.',
    h1: 'Invisible Character for Games (Free Fire, COD, Discord, and more)',
    intro:
      'Generate and copy invisible names with multiple Unicode patterns, platform-focused recommendations, and hidden character detection.',
    contentBlocks: [
      {
        title: 'How this invisible character tool improves success rate',
        paragraphs: [
          'Instead of giving only one blank character, this tool offers multiple patterns and platform-focused testing flows. This helps when one validator blocks single characters but accepts short combinations.',
          'You can quickly try 2, 3, and 4-character outputs to match nickname length rules in games and social apps.',
        ],
      },
      {
        title: 'Built for gaming and social profile workflows',
        paragraphs: [
          'The page covers Free Fire, COD Mobile, Discord, and many other platforms with different validation behavior.',
          'Each dedicated platform page includes keyword-focused content, recommended starting pattern, and compatibility guidance.',
        ],
        list: [
          'Copy a single invisible character for quick tests.',
          'Generate invisible names with 2, 3, or 4 characters.',
          'Switch to alternate Unicode combinations when blocked.',
          'Use the detector to inspect hidden characters in pasted text.',
        ],
      },
      {
        title: 'Privacy and practical limitations',
        paragraphs: [
          'Generation and detection run locally in your browser by default, without mandatory backend upload.',
          'No pattern guarantees 100% approval because platforms can change validation rules at any time.',
        ],
      },
    ],
    faq: [
      {
        question: 'Does invisible nickname always work?',
        answer:
          'Not always. It depends on each platform current validator. That is why testing multiple combinations is essential.',
      },
      {
        question: 'Can I generate 2, 3, and 4-character invisible names?',
        answer:
          'Yes. The tool includes dedicated actions to generate short invisible variants quickly.',
      },
      {
        question: 'Is this tool free?',
        answer: 'Yes. You can copy and generate invisible text for free, with no mandatory sign-up.',
      },
      {
        question: 'Are my inputs sent to a server?',
        answer:
          'No by default. Character generation and detection are processed locally in your browser.',
      },
    ],
  },
  'cpf-generator': {
    name: 'Valid CPF Generator',
    shortDescription:
      'Generate valid CPF numbers for tests with punctuation or plain digits, free, no sign-up, no login, and quick copy actions.',
    primaryKeyword: 'free valid cpf generator',
    secondaryKeywords: [
      'cpf generator for testing',
      'create valid cpf',
      'cpf with punctuation',
      'cpf without punctuation',
      'cpf list generator',
      'cpf no sign up',
      'cpf without login',
      'cpf for qa tests',
    ],
    searchIntent:
      'Developers, QA teams, and analysts who need valid CPF samples for form validation and integration tests without sign-up.',
    seoTitle: 'Free Valid CPF Generator | With or Without Punctuation',
    seoDescription:
      'Create valid CPF numbers online for testing with punctuation toggle, batch generation, and one-click copy. Free, no sign-up, no login.',
    h1: 'Free Valid CPF Generator with Fast Copy and No Sign-Up',
    intro:
      'Generate mathematically valid CPF numbers in seconds for testing workflows, with output options for formatted or plain digits.',
    contentBlocks: [
      {
        title: 'Generate valid CPF numbers for realistic test data',
        paragraphs: [
          'This tool creates CPF values using the official check-digit algorithm, so generated numbers pass standard validation rules used in forms and APIs.',
          'You can switch between formatted output (000.000.000-00) and plain numeric output (00000000000) depending on your validation pipeline.',
        ],
      },
      {
        title: 'Practical use cases for product, QA, and development teams',
        paragraphs: [
          'Teams often need realistic but synthetic identifiers to test onboarding forms, anti-fraud validations, and internal registration flows.',
          'Batch generation plus copy actions reduce manual work when filling spreadsheets, seed fixtures, and repeated test scenarios.',
        ],
        list: [
          'Validate CPF mask behavior in front-end forms.',
          'Test payload rules in backend endpoints.',
          'Create synthetic records for staging environments.',
          'Switch output format to match third-party integrations.',
        ],
      },
      {
        title: 'Privacy and usage limits',
        paragraphs: [
          'Generation runs locally in the browser by default, with no mandatory upload to a server.',
          'Use generated CPF values only for testing and non-production simulations, never for real identity operations.',
        ],
      },
    ],
    faq: [
      {
        question: 'Do generated numbers pass CPF validation?',
        answer:
          'Yes. The generator follows official CPF check-digit rules, producing valid values for testing scenarios.',
      },
      {
        question: 'Can I choose with or without punctuation?',
        answer:
          'Yes. You can output CPF values with punctuation or as plain digits only.',
      },
      {
        question: 'Can I copy multiple CPFs at once?',
        answer:
          'Yes. You can copy the whole generated list at once or copy each CPF individually.',
      },
      {
        question: 'Do I need to create an account?',
        answer:
          'No. The tool is free and available without sign-up or login.',
      },
      {
        question: 'Is input data sent to a server?',
        answer:
          'No by default. Generation happens locally in your browser.',
      },
    ],
  },
  'password-generator': {
    name: 'Strong Password Generator',
    shortDescription:
      'Create strong passwords with custom length and character options, free, with no sign-up and no login.',
    primaryKeyword: 'free strong password generator',
    secondaryKeywords: [
      'secure password generator online',
      'random password creator',
      'password with symbols',
      'password with letters and numbers',
      'password generator no sign up',
      'password generator without login',
      'strong password for accounts',
      'custom length password',
    ],
    searchIntent:
      'Users who need to generate strong passwords quickly for personal accounts, work systems, and testing flows.',
    seoTitle: 'Free Strong Password Generator | Letters, Numbers, Symbols',
    seoDescription:
      'Generate strong passwords online with custom length, character selection, automatic refresh, and one-click copy. Free, no sign-up, no login.',
    h1: 'Free Strong Password Generator with Fast Copy',
    intro:
      'Generate secure passwords instantly with full control over size and character types, including uppercase, lowercase, numbers, and symbols.',
    contentBlocks: [
      {
        title: 'Build stronger passwords in a few clicks',
        paragraphs: [
          'This tool combines uppercase letters, lowercase letters, numbers, and symbols to generate stronger random passwords for practical use.',
          'The output updates automatically when you change length or character options, which speeds up password policy testing.',
        ],
      },
      {
        title: 'Where this password generator helps in real life',
        paragraphs: [
          'Many people still reuse short and predictable passwords. A configurable generator helps create unique credentials for each account.',
          'With regenerate and copy actions, the workflow is faster for onboarding, account resets, and QA credential preparation.',
        ],
        list: [
          'Create stronger passwords for email and SaaS logins.',
          'Generate temporary credentials for support operations.',
          'Prepare test passwords for staging and QA environments.',
          'Match specific password policies by toggling character sets.',
        ],
      },
      {
        title: 'Privacy and practical limits',
        paragraphs: [
          'Password generation runs locally in the browser by default, without mandatory server submission.',
          'The length field has no fixed UI cap, but very large values may require more processing time depending on device performance.',
        ],
      },
    ],
    faq: [
      {
        question: 'Does the password update automatically?',
        answer:
          'Yes. The password updates automatically when you change length or character options, and you can also click regenerate.',
      },
      {
        question: 'Can I choose which character types are used?',
        answer:
          'Yes. You can enable or disable uppercase, lowercase, numbers, and symbols.',
      },
      {
        question: 'Is there a maximum length?',
        answer:
          'There is no fixed maximum in the interface. For very large lengths, generation time depends on your device.',
      },
      {
        question: 'Can I copy the generated password with one click?',
        answer:
          'Yes. Use the copy button to send the current password directly to your clipboard.',
      },
      {
        question: 'Is the password sent to a server?',
        answer:
          'No by default. Generation happens locally in your browser.',
      },
    ],
  },
  'base64-image-viewer': {
    name: 'Base64 Image Viewer',
    shortDescription:
      'Paste Base64, preview image instantly, and download in multiple formats for free, with no sign-up and no login.',
    primaryKeyword: 'base64 image viewer online',
    secondaryKeywords: [
      'base64 to image converter',
      'decode image base64',
      'view base64 image',
      'base64 to png',
      'base64 to jpeg',
      'open base64 as image',
      'download image from base64',
      'data url image viewer',
    ],
    searchIntent:
      'Developers and technical users who need to paste Base64 and preview image output immediately before downloading.',
    seoTitle: 'Base64 Image Viewer Online | Instant Preview and Download',
    seoDescription:
      'Paste Base64 and preview image in real time. Download in multiple formats with local conversion, free, no sign-up, no login.',
    h1: 'Free Base64 Image Viewer with Instant Preview',
    intro:
      'Decode Base64 image strings instantly, preview side by side, and export to multiple image formats in one workflow.',
    contentBlocks: [
      {
        title: 'Turn Base64 text into a visible image',
        paragraphs: [
          'This tool decodes Base64 input and renders the image immediately in your browser, helping you validate payload content quickly.',
          'After previewing, you can download the decoded image in original form or export to common formats such as PNG, JPEG, WEBP, and SVG.',
        ],
      },
      {
        title: 'Practical workflows for API and support teams',
        paragraphs: [
          'It is useful when backend services return image data as Base64 inside JSON responses or webhook payloads.',
          'The side-by-side preview and format export flow reduce manual debugging steps during integrations and QA checks.',
        ],
        list: [
          'Validate Base64 image payloads from APIs.',
          'Decode data URLs into downloadable files.',
          'Convert decoded output to another format.',
          'Review images without external desktop software.',
        ],
      },
      {
        title: 'Privacy and practical limits',
        paragraphs: [
          'Decoding and rendering happen locally in the browser by default, without mandatory server upload.',
          'Large Base64 strings may require more memory and processing time depending on device performance.',
        ],
      },
    ],
    faq: [
      {
        question: 'Do I need to upload Base64 content to a server?',
        answer:
          'No by default. Decoding and preview run locally in your browser.',
      },
      {
        question: 'Does it support both data URL and raw Base64?',
        answer:
          'Yes. You can paste either format and define a fallback MIME type for raw Base64 content.',
      },
      {
        question: 'Can I download in different image formats?',
        answer:
          'Yes. After decoding, you can export to multiple image formats available in the tool.',
      },
      {
        question: 'Is preview updated instantly?',
        answer:
          'Yes. The preview updates automatically as soon as the Base64 input is valid.',
      },
      {
        question: 'Is this tool free?',
        answer:
          'Yes. It is free to use with no sign-up and no mandatory login.',
      },
    ],
  },
  'image-to-base64': {
    name: 'Image to Base64 Generator',
    shortDescription:
      'Upload an image and generate Base64 automatically with preview, one-click copy, and output mode selection.',
    primaryKeyword: 'image to base64 generator online',
    secondaryKeywords: [
      'convert image to base64',
      'png to base64',
      'jpg to base64',
      'image data url generator',
      'base64 encoder image',
      'copy image base64',
      'base64 from image online',
      'image base64 converter free',
    ],
    searchIntent:
      'Users and developers who need to encode image files as Base64 quickly for APIs, front-end usage, and testing.',
    seoTitle: 'Image to Base64 Generator | Convert Image to Base64 Online',
    seoDescription:
      'Upload image and generate Base64 instantly with preview, copy button, and data URL mode. Free, no sign-up, no login.',
    h1: 'Free Image to Base64 Generator with Instant Preview and Copy',
    intro:
      'Convert image files to Base64 automatically, choose output mode, and copy the result in one click.',
    contentBlocks: [
      {
        title: 'Encode images as Base64 for real integrations',
        paragraphs: [
          'This tool converts uploaded images to Base64 for practical usage in API payloads, inline web assets, and technical configurations.',
          'You can choose image output format before encoding and switch between full data URL output or Base64-only text.',
        ],
      },
      {
        title: 'Common day-to-day use cases',
        paragraphs: [
          'Teams use Base64 output for quick prototypes, API examples, and environments where sending separate files is not ideal.',
          'With preview, copy, and TXT download, the workflow is optimized for development, QA, and technical support.',
        ],
        list: [
          'Generate Base64 for API requests.',
          'Create data URLs for direct HTML/CSS usage.',
          'Copy Base64 strings into test tools quickly.',
          'Download Base64 output as text for team sharing.',
        ],
      },
      {
        title: 'Privacy and performance notes',
        paragraphs: [
          'Image encoding runs locally in the browser by default, without mandatory server transfer.',
          'Large images create long Base64 strings, so final size depends on resolution and selected format.',
        ],
      },
    ],
    faq: [
      {
        question: 'Is my uploaded image sent to a server?',
        answer:
          'No by default. Conversion to Base64 is processed locally in your browser.',
      },
      {
        question: 'Can I copy Base64 with one click?',
        answer:
          'Yes. Use the copy action to place the generated Base64 directly in your clipboard.',
      },
      {
        question: 'Can I choose between data URL and raw Base64?',
        answer:
          'Yes. You can switch output mode depending on your target integration requirement.',
      },
      {
        question: 'Can I change image format before encoding?',
        answer:
          'Yes. The tool allows selecting supported output image formats before Base64 generation.',
      },
      {
        question: 'Does it work on mobile devices?',
        answer:
          'Yes. The interface is responsive and supports upload, preview, and copy on mobile.',
      },
    ],
  },
};

const esTranslations: Record<ToolId, ToolTranslation> = {
  'crypto-unit-converter': {
    name: 'Conversor de Unidades Cripto',
    shortDescription:
      'Convierte satoshi, gwei, wei, lamport, sun, lovelace y otras subunidades on-chain gratis, sin registro y sin login.',
    primaryKeyword: 'conversor de unidades cripto gratis',
    secondaryKeywords: [
      'satoshi a btc',
      'gwei a eth',
      'wei a eth',
      'lamport a sol',
      'trx a sun',
      'conversor cripto sin registro',
      'conversor cripto sin login',
      'conversor satoshi gratis',
      'conversor unidades bitcoin',
      'conversor unidades ethereum',
    ],
    searchIntent:
      'Usuarios y desarrolladores que necesitan convertir subunidades cripto con precisión, rápido, gratis y sin registro.',
    seoTitle: 'Conversor Cripto Gratis de Satoshi, Gwei, Wei y Lamport',
    seoDescription:
      'Convierte unidades de BTC, ETH, USDT, USDC, SOL, TRX, XRP, ADA y más activos con cálculo local, sin registro y sin login.',
    h1: 'Conversor de Unidades Cripto Gratis, Sin Registro y Sin Login',
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
  'html-viewer': {
    name: 'Visor HTML con CSS y JS',
    shortDescription:
      'Previsualiza HTML con soporte para CSS/JS, pantalla completa y multiarchivo, gratis, sin registro y sin login.',
    primaryKeyword: 'html viewer online gratis',
    secondaryKeywords: [
      'preview html css js',
      'visor html sandbox',
      'probar html online',
      'visor html sin registro',
      'visor html sin login',
      'html preview pantalla completa',
    ],
    searchIntent:
      'Desarrolladores y creadores que necesitan una herramienta de previsualización HTML rápida, gratis y sin registro.',
    seoTitle: 'Visor HTML Online Gratis | CSS, JS y Pantalla Completa',
    seoDescription:
      'Pega HTML, CSS y JavaScript o sube múltiples archivos para renderizar en sandbox, gratis, sin registro y sin login.',
    h1: 'Visor HTML Gratis con CSS, JS y Sin Registro',
    intro:
      'Herramienta dedicada para renderizar y probar HTML con estilos y scripts usando procesamiento local en el navegador.',
    contentBlocks: [
      {
        title: 'Flujo enfocado solo en HTML',
        paragraphs: [
          'Esta página está dedicada exclusivamente al visor HTML, sin mezclar paneles de PDF o JSON en la misma interfaz.',
          'Puedes ejecutar CSS y JavaScript dentro de un preview con sandbox para validar interacciones y comportamiento visual.',
        ],
      },
      {
        title: 'Modo editor y modo archivos',
        paragraphs: [
          'En modo editor puedes pegar HTML, CSS y JS directamente. En modo archivos puedes subir varios archivos en un solo lote.',
          'Si subes varios HTML, eliges el archivo principal para renderizar mientras compartes CSS y JS comunes.',
        ],
        list: [
          'Pegar código HTML/CSS/JS.',
          'Subir múltiples archivos .html, .css y .js.',
          'Elegir el HTML principal.',
          'Abrir preview en pantalla completa o nueva pestaña.',
        ],
      },
      {
        title: 'Seguridad y límites prácticos',
        paragraphs: [
          'Los scripts se ejecutan dentro del iframe con sandbox. Usa código confiable cuando pruebes snippets externos.',
          'Para escenarios grandes, abrir en nueva pestaña mejora espacio de trabajo y lectura.',
        ],
      },
    ],
    faq: [
      {
        question: '¿Este visor HTML ejecuta JavaScript?',
        answer:
          'Sí. El preview permite ejecutar scripts dentro del sandbox para pruebas reales de front-end.',
      },
      {
        question: '¿Puedo subir archivos separados de HTML, CSS y JS?',
        answer:
          'Sí. El modo multiarchivo soporta .html, .css y .js, incluyendo múltiples HTML de entrada.',
      },
      {
        question: '¿Tiene modo pantalla completa?',
        answer:
          'Sí. Puedes activar pantalla completa y también abrir el resultado en nueva pestaña.',
      },
      {
        question: '¿Se sube mi código a un servidor?',
        answer:
          'No por defecto. El renderizado ocurre localmente en tu navegador.',
      },
    ],
  },
  'pdf-viewer': {
    name: 'Visor PDF Local',
    shortDescription:
      'Abre y revisa PDFs localmente en el navegador, gratis, sin registro, sin login y con opción de nueva pestaña.',
    primaryKeyword: 'pdf viewer online gratis',
    secondaryKeywords: [
      'abrir pdf en navegador',
      'vista previa pdf local',
      'lector pdf online',
      'ver pdf online',
      'visor pdf sin registro',
      'abrir pdf sin login',
    ],
    searchIntent:
      'Usuarios que necesitan abrir y leer PDFs rápido, gratis y sin registro, sin instalar software de escritorio.',
    seoTitle: 'Visor PDF Online Gratis | Abrir PDF en Navegador Sin Registro',
    seoDescription:
      'Visualiza PDFs localmente en tu navegador, gratis, sin registro, sin login y sin carga automática a servidor.',
    h1: 'Visor PDF Local Gratis, Sin Registro y Sin Login',
    intro:
      'Abre archivos PDF en segundos con procesamiento local y una interfaz orientada a lectura rápida.',
    contentBlocks: [
      {
        title: 'Por qué usar un visor PDF local',
        paragraphs: [
          'La herramienta prioriza lectura simple y sin fricción: seleccionas el archivo y ves el contenido de inmediato.',
          'Es útil para revisar contratos, propuestas y documentos técnicos antes de compartirlos.',
        ],
      },
      {
        title: 'Ventajas del flujo',
        paragraphs: [
          'Puedes abrir el PDF en nueva pestaña para ganar espacio de lectura.',
          'El diseño se mantiene minimalista para concentrarse en el documento.',
        ],
      },
    ],
    faq: [
      {
        question: '¿El PDF se sube a servidor?',
        answer:
          'No por defecto. El archivo se abre localmente en tu navegador.',
      },
      {
        question: '¿Puedo abrir el documento en otra pestaña?',
        answer:
          'Sí. Hay una acción directa para abrir el PDF actual en nueva pestaña.',
      },
      {
        question: '¿Permite editar PDF?',
        answer:
          'No. Esta página está enfocada en visualización y revisión local.',
      },
    ],
  },
  'json-formatter': {
    name: 'Formateador y Minificador JSON',
    shortDescription:
      'Formatea, minifica y valida JSON gratis, sin registro y sin login, con errores legibles y copia rápida.',
    primaryKeyword: 'formateador json online gratis',
    secondaryKeywords: [
      'json minify online',
      'json pretty print',
      'validador json',
      'formatear json en navegador',
      'formateador json sin registro',
      'formateador json sin login',
    ],
    searchIntent:
      'Desarrolladores y analistas que necesitan validar y ajustar JSON rápido, gratis y sin registro.',
    seoTitle: 'Formateador JSON Online Gratis | Minify, Validación y Sin Registro',
    seoDescription:
      'Pega JSON para formatear, minificar y validar sintaxis en el navegador, gratis, sin registro y sin login.',
    h1: 'Formateador JSON Gratis, Sin Registro y Sin Login',
    intro:
      'Herramienta dedicada para limpiar payloads JSON, validar estructura y preparar salida en segundos.',
    contentBlocks: [
      {
        title: 'Validación antes de usar payloads',
        paragraphs: [
          'La herramienta valida sintaxis JSON antes de transformar el contenido, ayudando a detectar errores temprano.',
          'Los mensajes de error están pensados para facilitar corrección rápida.',
        ],
      },
      {
        title: 'Formatear y minificar en el mismo flujo',
        paragraphs: [
          'Puedes alternar entre salida legible para depuración y salida minificada para transporte.',
          'Esto es útil en pruebas de API, soporte y documentación técnica.',
        ],
        list: [
          'Formatear para lectura.',
          'Minificar para transferencia compacta.',
          'Copiar salida procesada con un clic.',
        ],
      },
    ],
    faq: [
      {
        question: '¿Valida JSON inválido?',
        answer:
          'Sí. Detecta errores de sintaxis y devuelve un mensaje claro.',
      },
      {
        question: '¿Puedo formatear y minificar aquí mismo?',
        answer:
          'Sí. Ambas acciones están disponibles en la misma interfaz.',
      },
      {
        question: '¿El JSON se envía a servidor?',
        answer:
          'No por defecto. El procesamiento se realiza localmente en tu navegador.',
      },
    ],
  },
  'image-converter': {
    name: 'Conversor de Imagen y PDF',
    shortDescription:
      'Convierte más de 20 formatos de imagen y PDF directamente en tu navegador con un flujo rápido, gratis, sin registro y sin login.',
    primaryKeyword: 'conversor de imagen a pdf gratis',
    secondaryKeywords: [
      'png a jpeg',
      'jpg a pdf',
      'pdf a png',
      'webp a jpg',
      'heic a jpg',
      'tiff a png',
      'avif a png',
      'convertir pdf a imagen online',
      'conversor de formatos de imagen',
      'conversor de imagen sin registro',
      'conversor pdf sin login',
    ],
    searchIntent:
      'Usuarios que necesitan convertir archivos entre muchos formatos de imagen y PDF rápido, gratis y sin registro.',
    seoTitle: 'Conversor de Imagen y PDF Online (20+ formatos) | Gratis y Sin Registro',
    seoDescription:
      'Convierte imágenes y PDFs con procesamiento local, sin registro obligatorio, sin login, descarga inmediata y cobertura de formatos amplia.',
    h1: 'Conversor de Imagen y PDF Gratis (20+ formatos), Sin Registro y Sin Login',
    intro:
      'Convierte archivos entre más de 20 formatos de imagen y PDF con procesamiento local y descarga inmediata en pocos pasos.',
    contentBlocks: [
      {
        title: 'Qué resuelve este conversor en la práctica',
        paragraphs: [
          'La herramienta cubre flujos comunes: optimizar imágenes para web, adaptar formatos para formularios de terceros, generar PDF desde imagen y extraer páginas de PDF para edición visual.',
          'Todo ocurre en el navegador para reducir fricción operativa y mantener mayor control sobre archivos sensibles o de clientes.',
        ],
      },
      {
        title: 'Conversiones populares para tareas del día a día',
        paragraphs: [
          'Puedes resolver conversiones comunes como png a jpeg, jpg a pdf, pdf a png, heic a jpg y tiff a png sin instalar aplicaciones de escritorio.',
          'La interfaz mantiene el flujo simple: sube el archivo, elige el formato de salida, ajusta opciones si hace falta y descarga.',
        ],
        list: [
          'PNG a JPEG para reducir peso en imágenes sin transparencia.',
          'JPEG a WEBP para optimización web moderna.',
          'Imagen a PDF para envío y archivo documental.',
          'PDF a imagen para edición de páginas individuales.',
        ],
      },
      {
        title: 'Calidad y rendimiento',
        paragraphs: [
          'En formatos con pérdida como JPEG y WEBP, ajustar calidad permite equilibrar tamaño y legibilidad. Un rango entre 80% y 92% suele funcionar bien.',
          'En PDFs largos, convertir por bloques de páginas mejora estabilidad en móvil y reduce consumo de memoria.',
        ],
      },
    ],
    faq: [
      {
        question: '¿Puedo convertir imagen a PDF y PDF a imagen?',
        answer:
          'Sí. La herramienta soporta ambos sentidos e incluye exportación de páginas PDF como imágenes.',
      },
      {
        question: '¿Es gratis?',
        answer: 'Sí. Las conversiones principales son gratuitas y no exigen registro obligatorio.',
      },
      {
        question: '¿Los archivos se suben a servidor?',
        answer:
          'No por defecto. El procesamiento ocurre localmente en el navegador para mejorar privacidad y velocidad.',
      },
      {
        question: '¿Qué formatos están disponibles?',
        answer:
          'La herramienta incluye más de 20 opciones de formato y páginas dedicadas por conversión. Hoy el flujo local cubre PNG, JPEG, WEBP, AVIF, GIF, TIFF, BMP, ICO, SVG, TGA y PDF, mientras que algunos formatos profesionales dependen del soporte del navegador.',
      },
      {
        question: '¿Funciona en celular?',
        answer:
          'Sí. La interfaz es responsive y mantiene las acciones principales accesibles en pantallas pequeñas.',
      },
    ],
  },
  'qr-code-generator': {
    name: 'Generador de Código QR con Logo',
    shortDescription:
      'Crea códigos QR gratis para texto o URL, sin registro, sin login, con logo central y descarga en varios formatos.',
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
      'Usuarios que quieren generar códigos QR rápido, gratis, sin registro, sin login, personalizarlos y descargarlos.',
    seoTitle: 'Generador de Código QR Gratis, Sin Registro y Sin Login | PNG, SVG y PDF',
    seoDescription:
      'Genera códigos QR online gratis, sin cuenta ni login. Personaliza colores, agrega logo central y exporta PNG, JPEG, WEBP, SVG o PDF.',
    h1: 'Generador de Código QR Gratis, Sin Registro, Sin Login y con Descarga',
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
  'invisible-character': {
    name: 'Caracter Invisible para Juegos',
    shortDescription:
      'Copia y genera caracteres invisibles para juegos y redes sociales con opciones de 2, 3 y 4 caracteres y detector Unicode.',
    primaryKeyword: 'caracter invisible free fire',
    secondaryKeywords: [
      'nombre invisible free fire',
      'nombre invisible cod mobile',
      'texto invisible discord',
      'letra invisible copiar',
      'caracter invisible para juegos',
      'invisible username generator',
    ],
    searchIntent:
      'Jugadores y usuarios de redes sociales que buscan patrones Unicode invisibles para nombre visible o nickname.',
    seoTitle: 'Caracter Invisible para Free Fire, COD y Discord | Copiar y Pegar',
    seoDescription:
      'Copia caracter invisible y genera nombres invisibles de 2 a 4 caracteres para Free Fire, COD Mobile, Discord y otras plataformas.',
    h1: 'Caracter Invisible para Juegos (Free Fire, COD, Discord y mas)',
    intro:
      'Genera y copia nombres invisibles con multiples patrones Unicode, recomendaciones por plataforma y detector de caracteres ocultos.',
    contentBlocks: [
      {
        title: 'Por que esta herramienta funciona mejor que listas simples',
        paragraphs: [
          'En lugar de un solo caracter vacio, aqui tienes varios patrones y acciones de prueba por plataforma. Esto mejora el resultado cuando el validador bloquea caracteres individuales.',
          'Puedes probar rapido variantes de 2, 3 y 4 caracteres para adaptarte a reglas de longitud minima.',
        ],
      },
      {
        title: 'Flujo pensado para juegos y redes sociales',
        paragraphs: [
          'La herramienta cubre Free Fire, COD Mobile, Discord y decenas de plataformas con comportamientos de validacion diferentes.',
          'Cada pagina dedicada incluye contenido SEO especifico, recomendacion inicial y nota de compatibilidad.',
        ],
        list: [
          'Copiar un caracter invisible unico.',
          'Generar nombre invisible con 2, 3 o 4 caracteres.',
          'Cambiar combinacion Unicode cuando falle.',
          'Usar detector para auditar texto pegado.',
        ],
      },
      {
        title: 'Privacidad y limites reales',
        paragraphs: [
          'La generacion y deteccion se ejecutan localmente en el navegador por defecto, sin envio obligatorio al servidor.',
          'Ningun patron garantiza 100% de aprobacion, porque los filtros pueden cambiar con actualizaciones.',
        ],
      },
    ],
    faq: [
      {
        question: '¿El nombre invisible siempre funciona?',
        answer:
          'No siempre. Depende del validador actual de cada plataforma. Por eso conviene probar varias combinaciones.',
      },
      {
        question: '¿Puedo generar nombres invisibles con 2, 3 y 4 caracteres?',
        answer:
          'Si. La herramienta trae botones directos para generar variantes cortas en un clic.',
      },
      {
        question: '¿La herramienta es gratis?',
        answer:
          'Si. Puedes copiar y generar texto invisible gratis y sin registro obligatorio.',
      },
      {
        question: '¿Los datos se envian al servidor?',
        answer:
          'No por defecto. La deteccion y generacion ocurren localmente en tu navegador.',
      },
    ],
  },
  'cpf-generator': {
    name: 'Generador de CPF válido',
    shortDescription:
      'Genera números de CPF válidos para pruebas con o sin puntuación, gratis, sin registro, sin login y con copia rápida.',
    primaryKeyword: 'generador de cpf válido gratis',
    secondaryKeywords: [
      'crear cpf válido',
      'generar cpf para pruebas',
      'cpf con puntuación',
      'cpf sin puntuación',
      'generador de cpf por lote',
      'cpf sin registro',
      'cpf sin login',
      'cpf para testing qa',
    ],
    searchIntent:
      'Desarrolladores, equipos QA y analistas que necesitan CPF válidos para validar formularios e integraciones sin registro.',
    seoTitle: 'Generador de CPF Válido Gratis | Con o Sin Puntuación',
    seoDescription:
      'Crea CPF válidos online para pruebas con opción con o sin puntuación, generación por lote y copia en un clic. Gratis, sin registro y sin login.',
    h1: 'Generador de CPF Válido Gratis con Copia Rápida y Sin Registro',
    intro:
      'Genera CPF matemáticamente válidos en segundos para flujos de prueba, con salida formateada o solo numérica.',
    contentBlocks: [
      {
        title: 'Genera CPF válidos para datos de prueba realistas',
        paragraphs: [
          'La herramienta crea valores de CPF usando el cálculo oficial de dígitos verificadores, por lo que los números pasan validaciones comunes de formularios y APIs.',
          'Puedes alternar entre salida con formato (000.000.000-00) y salida solo numérica (00000000000), según la regla de tu integración.',
        ],
      },
      {
        title: 'Casos de uso para producto, QA y desarrollo',
        paragraphs: [
          'Los equipos necesitan identificadores sintéticos pero válidos para probar flujos de registro, validaciones antifraude y reglas de backend.',
          'Con generación en lote y copia rápida, reduces trabajo manual al preparar planillas, fixtures y escenarios repetitivos.',
        ],
        list: [
          'Validar máscaras de CPF en formularios front-end.',
          'Probar reglas de payload en endpoints backend.',
          'Crear registros sintéticos para ambientes de staging.',
          'Cambiar formato de salida según terceros integrados.',
        ],
      },
      {
        title: 'Privacidad y límites de uso',
        paragraphs: [
          'La generación se ejecuta localmente en el navegador por defecto, sin subida obligatoria a servidor.',
          'Usa los CPF generados solo para pruebas y simulaciones, nunca para operaciones de identidad real.',
        ],
      },
    ],
    faq: [
      {
        question: '¿Los números generados pasan validación de CPF?',
        answer:
          'Sí. El generador aplica las reglas oficiales de dígitos verificadores del CPF.',
      },
      {
        question: '¿Puedo elegir con o sin puntuación?',
        answer:
          'Sí. Puedes generar CPF con puntuación o solo con dígitos.',
      },
      {
        question: '¿Se pueden copiar varios CPF a la vez?',
        answer:
          'Sí. Puedes copiar toda la lista generada o copiar cada CPF por separado.',
      },
      {
        question: '¿Necesito crear cuenta?',
        answer:
          'No. La herramienta es gratis y no requiere registro ni login.',
      },
      {
        question: '¿Se envían los datos a servidor?',
        answer:
          'No por defecto. La generación ocurre localmente en tu navegador.',
      },
    ],
  },
  'password-generator': {
    name: 'Generador de Contrasena Segura',
    shortDescription:
      'Crea contrasenas seguras con longitud personalizada y tipos de caracteres, gratis, sin registro y sin login.',
    primaryKeyword: 'generador de contrasena segura gratis',
    secondaryKeywords: [
      'generador de contrasenas online',
      'crear contrasena aleatoria',
      'contrasena con simbolos',
      'contrasena con letras y numeros',
      'generador de contrasena sin registro',
      'generador de contrasena sin login',
      'contrasena fuerte para cuentas',
      'contrasena de longitud personalizada',
    ],
    searchIntent:
      'Usuarios que necesitan generar contrasenas seguras rapidamente para cuentas personales, sistemas de trabajo y pruebas.',
    seoTitle: 'Generador de Contrasena Segura Gratis | Letras, Numeros y Simbolos',
    seoDescription:
      'Genera contrasenas seguras online con longitud personalizada, seleccion de caracteres, regeneracion automatica y copia en un clic. Gratis, sin registro y sin login.',
    h1: 'Generador de Contrasena Segura Gratis con Copia Rapida',
    intro:
      'Genera contrasenas seguras en segundos con control total de longitud y tipos de caracteres, incluyendo mayusculas, minusculas, numeros y simbolos.',
    contentBlocks: [
      {
        title: 'Crea contrasenas mas fuertes en pocos clics',
        paragraphs: [
          'La herramienta combina letras mayusculas, minusculas, numeros y simbolos para generar contrasenas aleatorias mas robustas.',
          'El resultado se actualiza automaticamente cuando cambias longitud u opciones, acelerando pruebas de politicas de seguridad.',
        ],
      },
      {
        title: 'Casos de uso en el dia a dia',
        paragraphs: [
          'Muchas personas reutilizan contrasenas cortas y predecibles. Un generador configurable ayuda a crear credenciales unicas para cada servicio.',
          'Con botones de regenerar y copiar, el flujo es mas rapido para alta de cuentas, renovacion de accesos y preparacion de credenciales QA.',
        ],
        list: [
          'Crear contrasenas mas fuertes para correo y plataformas SaaS.',
          'Generar credenciales temporales para soporte tecnico.',
          'Preparar contrasenas de prueba para staging y QA.',
          'Cumplir reglas especificas activando o desactivando tipos de caracteres.',
        ],
      },
      {
        title: 'Privacidad y limites practicos',
        paragraphs: [
          'La generacion ocurre localmente en el navegador por defecto, sin envio obligatorio a servidor.',
          'El campo de longitud no tiene tope fijo en la interfaz, pero valores muy altos pueden tardar mas segun el rendimiento del dispositivo.',
        ],
      },
    ],
    faq: [
      {
        question: '¿La contrasena se actualiza automaticamente?',
        answer:
          'Si. La contrasena cambia automaticamente cuando modificas longitud u opciones, y tambien puedes usar regenerar.',
      },
      {
        question: '¿Puedo elegir los tipos de caracteres?',
        answer:
          'Si. Puedes activar o desactivar mayusculas, minusculas, numeros y simbolos.',
      },
      {
        question: '¿Existe un maximo de longitud?',
        answer:
          'No hay un maximo fijo en la interfaz. Para longitudes muy altas, el tiempo depende del dispositivo.',
      },
      {
        question: '¿Puedo copiar la contrasena con un clic?',
        answer:
          'Si. Usa el boton de copiar para enviar la contrasena actual al portapapeles.',
      },
      {
        question: '¿La contrasena se envia al servidor?',
        answer:
          'No por defecto. La generacion ocurre localmente en tu navegador.',
      },
    ],
  },
  'base64-image-viewer': {
    name: 'Lector de Base64 para Imagen',
    shortDescription:
      'Pega Base64, visualiza la imagen al instante y descarga en varios formatos, gratis, sin registro y sin login.',
    primaryKeyword: 'lector de base64 para imagen online',
    secondaryKeywords: [
      'base64 a imagen',
      'decodificar base64 de imagen',
      'visualizar imagen base64',
      'base64 a png',
      'base64 a jpeg',
      'abrir base64 como imagen',
      'descargar imagen desde base64',
      'visor de data url',
    ],
    searchIntent:
      'Usuarios y desarrolladores que necesitan pegar Base64 para ver la imagen de inmediato y descargarla en otro formato.',
    seoTitle: 'Lector de Base64 para Imagen Online | Vista Previa y Descarga',
    seoDescription:
      'Pega Base64 y visualiza imagen en tiempo real. Descarga en varios formatos con conversion local, gratis, sin registro y sin login.',
    h1: 'Lector de Base64 para Imagen Gratis con Vista Previa Instantanea',
    intro:
      'Decodifica cadenas Base64 de imagen al instante, visualiza el resultado y exporta en multiples formatos.',
    contentBlocks: [
      {
        title: 'Convierte texto Base64 en imagen visible',
        paragraphs: [
          'La herramienta decodifica el Base64 y renderiza la imagen de inmediato en tu navegador para validar contenido tecnico rapidamente.',
          'Despues de revisar la vista previa, puedes descargar el archivo original o exportarlo a formatos como PNG, JPEG, WEBP y SVG.',
        ],
      },
      {
        title: 'Flujo practico para APIs y soporte',
        paragraphs: [
          'Es util cuando servicios backend devuelven imagenes Base64 dentro de JSON o payloads de webhooks.',
          'La vista previa lateral y la exportacion por formato reducen pasos manuales en integraciones y pruebas QA.',
        ],
        list: [
          'Validar payloads de imagen Base64 desde API.',
          'Decodificar data URL a archivo descargable.',
          'Convertir salida decodificada a otro formato.',
          'Revisar imagenes sin software externo.',
        ],
      },
      {
        title: 'Privacidad y limites practicos',
        paragraphs: [
          'La decodificacion y renderizado ocurren localmente en el navegador por defecto, sin subida obligatoria a servidor.',
          'Cadenas Base64 muy grandes pueden requerir mas memoria y tiempo segun el dispositivo.',
        ],
      },
    ],
    faq: [
      {
        question: '¿Debo subir el Base64 a un servidor?',
        answer:
          'No por defecto. La lectura y vista previa se procesan localmente en tu navegador.',
      },
      {
        question: '¿Soporta data URL y Base64 puro?',
        answer:
          'Si. Acepta ambos formatos y permite definir MIME por defecto para contenido Base64 sin prefijo.',
      },
      {
        question: '¿Puedo descargar en diferentes formatos?',
        answer:
          'Si. Tras decodificar, puedes exportar en varios formatos de imagen disponibles.',
      },
      {
        question: '¿La vista previa se actualiza al instante?',
        answer:
          'Si. La vista se actualiza automaticamente cuando el Base64 es valido.',
      },
      {
        question: '¿La herramienta es gratuita?',
        answer:
          'Si. Es gratis y no exige registro ni login obligatorio.',
      },
    ],
  },
  'image-to-base64': {
    name: 'Generador de Base64 desde Imagen',
    shortDescription:
      'Sube una imagen y genera Base64 automaticamente con vista previa, copia rapida y modo de salida configurable.',
    primaryKeyword: 'generador de base64 desde imagen online',
    secondaryKeywords: [
      'imagen a base64',
      'convertir imagen a base64',
      'png a base64',
      'jpg a base64',
      'generador de data url',
      'codificar imagen en base64',
      'copiar base64 de imagen',
      'base64 encoder online',
    ],
    searchIntent:
      'Usuarios y desarrolladores que necesitan convertir archivos de imagen a Base64 para APIs, front-end y pruebas tecnicas.',
    seoTitle: 'Generador de Base64 desde Imagen | Convertir Imagen a Base64',
    seoDescription:
      'Sube imagen y genera Base64 al instante con vista previa, boton de copia y modo data URL. Gratis, sin registro y sin login.',
    h1: 'Generador de Base64 desde Imagen Gratis con Vista Previa y Copia',
    intro:
      'Convierte imagenes a Base64 automaticamente, elige modo de salida y copia el resultado en un clic.',
    contentBlocks: [
      {
        title: 'Codifica imagenes en Base64 para integraciones reales',
        paragraphs: [
          'La herramienta transforma imagenes subidas a Base64 para uso en payloads de API, assets inline y configuraciones tecnicas.',
          'Puedes elegir formato de imagen de salida antes de codificar y cambiar entre data URL completo o solo Base64.',
        ],
      },
      {
        title: 'Usos comunes en operaciones tecnicas',
        paragraphs: [
          'Equipos de desarrollo y QA usan Base64 para prototipos rapidos, ejemplos de API y escenarios donde no conviene adjuntar archivos separados.',
          'Con vista previa, copia y descarga en TXT, el flujo es agil para soporte tecnico y validaciones internas.',
        ],
        list: [
          'Generar Base64 para requests de API.',
          'Crear data URL para uso directo en HTML/CSS.',
          'Copiar Base64 en herramientas de prueba.',
          'Descargar salida Base64 como texto para compartir.',
        ],
      },
      {
        title: 'Privacidad y rendimiento',
        paragraphs: [
          'La conversion a Base64 ocurre localmente en el navegador por defecto, sin envio obligatorio a servidor.',
          'Imagenes grandes producen cadenas Base64 extensas, por lo que el tamano final depende de resolucion y formato elegido.',
        ],
      },
    ],
    faq: [
      {
        question: '¿La imagen se envia a servidor?',
        answer:
          'No por defecto. La conversion a Base64 se procesa localmente en tu navegador.',
      },
      {
        question: '¿Puedo copiar el Base64 con un clic?',
        answer:
          'Si. El boton de copia envia el resultado directamente al portapapeles.',
      },
      {
        question: '¿Puedo elegir entre data URL y Base64 puro?',
        answer:
          'Si. Puedes alternar el modo de salida segun la necesidad de tu integracion.',
      },
      {
        question: '¿Puedo cambiar formato de imagen antes de codificar?',
        answer:
          'Si. Hay varias opciones de formato compatibles para codificar la imagen.',
      },
      {
        question: '¿Funciona en celular?',
        answer:
          'Si. La interfaz responsive permite subir imagen, ver preview y copiar Base64 en mobile.',
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
