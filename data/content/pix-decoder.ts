import type { AppLocale } from '@/lib/i18n/config';
import type { ContentBlock, FaqItem } from '@/types/content';

export const pixDecoderIntro =
  'Gere Pix Copia e Cola estático ou dinâmico, decodifique payload EMV campo por campo, valide CRC16, corrija erros, visualize a árvore de campos e baixe o QR Code — tudo localmente no navegador.';

export const pixDecoderContentBlocks: ContentBlock[] = [
  {
    title: 'O que é Pix Copia e Cola?',
    paragraphs: [
      'Pix Copia e Cola é uma representação textual do QR Code Pix. É um payload no formato EMV (Europay, Mastercard, Visa) que contém os dados necessários para realizar um pagamento Pix: chave do recebedor, valor, nome, cidade e identificador.',
      'O formato é padronizado pelo Banco Central do Brasil e segue a especificação BR Code. Quando escaneado ou colado no app bancário, os dados são interpretados automaticamente para iniciar a transação.',
    ],
  },
  {
    title: 'Pix estático vs. dinâmico',
    paragraphs: [
      'QR Code Pix estático pode ser reutilizado infinitas vezes. Contém a chave Pix do recebedor diretamente no payload. Ideal para lojas, autônomos e doações.',
      'QR Code Pix dinâmico é de uso único. Contém uma URL/location fornecida pelo PSP (Prestador de Serviços de Pagamento) que retorna os dados do pagamento em tempo real. É usado em cobranças específicas e e-commerce.',
    ],
    list: [
      'Estático: chave Pix no campo 26.01, Point of Initiation = 11.',
      'Dinâmico: URL no campo 26.25, Point of Initiation = 12.',
      'Ambos usam GUI br.gov.bcb.pix no campo 26.00.',
      'CRC16-CCITT valida integridade do payload.',
    ],
  },
  {
    title: 'CRC16 — o que é e como funciona',
    paragraphs: [
      'CRC16-CCITT é um checksum de 4 caracteres hexadecimais no final do payload (campo 63). Ele garante que o payload não foi corrompido ou alterado.',
      'O cálculo usa polinômio 0x1021 com valor inicial 0xFFFF. Se o CRC estiver incorreto, o app bancário pode rejeitar o pagamento. Esta ferramenta permite detectar e corrigir CRC inválido.',
    ],
  },
  {
    title: 'Privacidade e processamento local',
    paragraphs: [
      'Todo o processamento — parsing, validação, geração de QR Code e CRC — acontece 100% no navegador. Nenhum dado de pagamento é enviado ao servidor.',
      'A ferramenta não consulta o DICT (Diretório de Identificadores de Contas) do Banco Central, não valida titularidade de chaves e não confirma pagamentos.',
    ],
  },
  {
    title: 'Avisos de segurança',
    paragraphs: [
      'Um CRC válido NÃO significa que o recebedor é confiável. Sempre confira os dados (nome, chave, valor) no app do seu banco antes de confirmar um pagamento Pix.',
      'QR Codes Pix podem ser usados em golpes. Nunca pague sem verificar o destinatário. Esta ferramenta é apenas para análise técnica e geração de payloads legítimos.',
    ],
  },
];

export const pixDecoderFaq: FaqItem[] = [
  {
    question: 'O que é Pix Copia e Cola?',
    answer: 'É a versão textual do QR Code Pix. Um payload no formato EMV que contém os dados do pagamento (chave, valor, nome, cidade) e pode ser colado no app bancário para iniciar a transação.',
  },
  {
    question: 'Essa ferramenta gera Pix real?',
    answer: 'Sim, o Pix estático gerado é real e pode ser usado para receber pagamentos. Para Pix dinâmico real, é necessário um PSP (como banco ou fintech) que forneça a URL/location.',
  },
  {
    question: 'Qual a diferença entre Pix estático e dinâmico?',
    answer: 'Estático é reutilizável, contém a chave diretamente. Dinâmico é de uso único, contém URL de um PSP que retorna os dados em tempo real.',
  },
  {
    question: 'O que é CRC do Pix?',
    answer: 'CRC16-CCITT é um checksum de 4 caracteres no final do payload que valida integridade. Se estiver errado, o app bancário pode rejeitar o código.',
  },
  {
    question: 'Posso corrigir um Pix com CRC inválido?',
    answer: 'Sim. A ferramenta recalcula o CRC correto e gera o payload corrigido. Útil para payloads editados manualmente ou corrompidos.',
  },
  {
    question: 'A chave Pix é validada no Banco Central?',
    answer: 'Não. A ferramenta valida apenas formato e estrutura. Não consulta o DICT nem confirma titularidade. Sempre confira os dados no app do banco.',
  },
  {
    question: 'A ferramenta confirma se o pagamento foi feito?',
    answer: 'Não. Confirmação de pagamento depende do PSP/banco. Esta ferramenta apenas gera, valida e decodifica payloads.',
  },
  {
    question: 'A ferramenta envia meus dados para o servidor?',
    answer: 'Não. Todo processamento é local no navegador. Nenhum dado de chave, valor ou payload sai do seu dispositivo.',
  },
  {
    question: 'Posso baixar o QR Code Pix?',
    answer: 'Sim. Você pode baixar em PNG, SVG ou PDF, copiar como imagem e personalizar cores e tamanho.',
  },
  {
    question: 'Posso usar o QR Code gerado em uma loja?',
    answer: 'Sim. O QR Code estático gerado é válido e funcional. Imprima ou exiba digitalmente para receber pagamentos.',
  },
];

// --- Localized content ---

type PixDecoderLocaleContent = {
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

const contentByLocale: Record<AppLocale, PixDecoderLocaleContent> = {
  'pt-br': {
    name: 'Validador e Gerador de Pix',
    shortDescription: pixDecoderIntro,
    primaryKeyword: 'gerador pix copia e cola online',
    secondaryKeywords: [
      'validar pix copia e cola',
      'decoder pix emv',
      'decodificar pix',
      'gerador qr code pix',
      'pix qr code decoder',
      'calcular crc pix',
      'corrigir crc pix',
      'extrair dados pix',
      'br code pix',
      'pix emv decoder',
    ],
    searchIntent:
      'Desenvolvedores, lojistas e usuários que precisam gerar, validar, decodificar ou corrigir payloads Pix Copia e Cola (BR Code EMV).',
    seoTitle: 'Gerador e Validador de Pix Copia e Cola Online | Decoder EMV',
    seoDescription:
      'Gere Pix Copia e Cola, valide payload, decodifique campos EMV, corrija CRC16, visualize árvore e baixe QR Code. 100% local no navegador.',
    h1: 'Validador e Gerador de Pix Copia e Cola Online',
    intro: pixDecoderIntro,
    contentBlocks: pixDecoderContentBlocks,
    faq: pixDecoderFaq,
  },
  en: {
    name: 'Pix QR Code Decoder & Generator',
    shortDescription:
      'Generate Pix Copy and Paste payloads, decode EMV fields, validate CRC16, fix errors, view the field tree and download QR Code — all locally in the browser.',
    primaryKeyword: 'pix qr code decoder online',
    secondaryKeywords: [
      'pix emv decoder',
      'br code decoder',
      'pix copy paste generator',
      'pix crc16 validator',
      'pix payload decoder',
      'generate pix qr code',
      'fix pix crc',
      'extract pix data',
      'brazilian pix decoder',
      'emv qr code parser',
    ],
    searchIntent:
      'Developers, merchants and users who need to generate, validate, decode or fix Pix Copy and Paste payloads (BR Code EMV).',
    seoTitle: 'Pix QR Code Decoder & Generator Online | EMV Validator',
    seoDescription:
      'Generate Pix Copy and Paste, validate payload, decode EMV fields, fix CRC16, view tree and download QR Code. 100% local browser processing.',
    h1: 'Pix QR Code Decoder & Generator Online',
    intro:
      'Generate Pix Copy and Paste payloads, decode EMV fields, validate CRC16, fix errors, view the field tree and download QR Code — all locally in the browser.',
    contentBlocks: [
      {
        title: 'What is Pix Copy and Paste?',
        paragraphs: [
          'Pix Copy and Paste is a text representation of the Pix QR Code. It\'s a payload in EMV (Europay, Mastercard, Visa) format containing the data needed for a Pix payment: recipient key, amount, name, city and identifier.',
          'The format is standardized by Brazil\'s Central Bank following the BR Code specification. When scanned or pasted in a banking app, the data is automatically interpreted to initiate the transaction.',
        ],
      },
      {
        title: 'Static vs. Dynamic Pix',
        paragraphs: [
          'Static Pix QR Code can be reused infinitely. It contains the Pix key directly in the payload. Ideal for shops, freelancers and donations.',
          'Dynamic Pix QR Code is single-use. It contains a URL/location provided by the PSP (Payment Service Provider) that returns payment data in real-time. Used for specific charges and e-commerce.',
        ],
        list: [
          'Static: Pix key in field 26.01, Point of Initiation = 11.',
          'Dynamic: URL in field 26.25, Point of Initiation = 12.',
          'Both use GUI br.gov.bcb.pix in field 26.00.',
          'CRC16-CCITT validates payload integrity.',
        ],
      },
      {
        title: 'CRC16 — what it is and how it works',
        paragraphs: [
          'CRC16-CCITT is a 4-character hexadecimal checksum at the end of the payload (field 63). It ensures the payload hasn\'t been corrupted or altered.',
          'The calculation uses polynomial 0x1021 with initial value 0xFFFF. If the CRC is incorrect, the banking app may reject the payment.',
        ],
      },
      {
        title: 'Privacy and local processing',
        paragraphs: [
          'All processing — parsing, validation, QR Code generation and CRC — happens 100% in the browser. No payment data is sent to any server.',
          'The tool does not query Brazil\'s Central Bank DICT, does not validate key ownership and does not confirm payments.',
        ],
      },
      {
        title: 'Security warnings',
        paragraphs: [
          'A valid CRC does NOT mean the recipient is trustworthy. Always verify the data (name, key, amount) in your banking app before confirming a Pix payment.',
          'Pix QR Codes can be used in scams. Never pay without verifying the recipient. This tool is only for technical analysis and legitimate payload generation.',
        ],
      },
    ],
    faq: [
      { question: 'What is Pix Copy and Paste?', answer: 'It\'s the text version of a Pix QR Code. An EMV payload containing payment data (key, amount, name, city) that can be pasted in a banking app to initiate a transaction.' },
      { question: 'Does this tool generate real Pix?', answer: 'Yes, the generated static Pix is real and can be used to receive payments. For real dynamic Pix, you need a PSP (bank or fintech) that provides the URL/location.' },
      { question: 'What\'s the difference between static and dynamic Pix?', answer: 'Static is reusable, contains the key directly. Dynamic is single-use, contains a PSP URL that returns data in real-time.' },
      { question: 'What is the Pix CRC?', answer: 'CRC16-CCITT is a 4-character checksum at the end validating integrity. If wrong, the banking app may reject the code.' },
      { question: 'Can I fix a Pix with invalid CRC?', answer: 'Yes. The tool recalculates the correct CRC and generates the fixed payload.' },
      { question: 'Is the Pix key validated with the Central Bank?', answer: 'No. The tool only validates format and structure. It doesn\'t query DICT or confirm ownership.' },
      { question: 'Does the tool confirm payments?', answer: 'No. Payment confirmation depends on the PSP/bank. This tool only generates, validates and decodes payloads.' },
      { question: 'Is my data sent to a server?', answer: 'No. All processing is local in the browser. No key, amount or payload data leaves your device.' },
      { question: 'Can I download the Pix QR Code?', answer: 'Yes. You can download in PNG, SVG or PDF, copy as image and customize colors and size.' },
      { question: 'Can I use the generated QR Code in a store?', answer: 'Yes. The generated static QR Code is valid and functional. Print or display digitally to receive payments.' },
    ],
  },
  es: {
    name: 'Decodificador y Generador de Pix',
    shortDescription:
      'Genera Pix Copia y Pega, decodifica campos EMV, valida CRC16, corrige errores, visualiza el árbol de campos y descarga QR Code — todo localmente en el navegador.',
    primaryKeyword: 'generador pix copia y pega online',
    secondaryKeywords: [
      'validar pix copia y pega',
      'decoder pix emv',
      'decodificar pix',
      'generador qr code pix',
      'pix qr code decoder',
      'calcular crc pix',
      'corregir crc pix',
      'extraer datos pix',
      'br code pix',
      'pix emv decoder',
    ],
    searchIntent:
      'Desarrolladores, comerciantes y usuarios que necesitan generar, validar, decodificar o corregir payloads Pix Copia y Pega (BR Code EMV).',
    seoTitle: 'Generador y Validador de Pix Copia y Pega Online | Decoder EMV',
    seoDescription:
      'Genera Pix Copia y Pega, valida payload, decodifica campos EMV, corrige CRC16, visualiza árbol y descarga QR Code. 100% local en el navegador.',
    h1: 'Validador y Generador de Pix Copia y Pega Online',
    intro:
      'Genera Pix Copia y Pega, decodifica campos EMV, valida CRC16, corrige errores, visualiza el árbol de campos y descarga QR Code — todo localmente en el navegador.',
    contentBlocks: [
      {
        title: '¿Qué es Pix Copia y Pega?',
        paragraphs: [
          'Pix Copia y Pega es la representación textual del QR Code Pix. Es un payload en formato EMV que contiene los datos necesarios para un pago Pix: clave del receptor, valor, nombre, ciudad e identificador.',
          'El formato está estandarizado por el Banco Central de Brasil siguiendo la especificación BR Code. Al escanearlo o pegarlo en la app bancaria, los datos se interpretan automáticamente para iniciar la transacción.',
        ],
      },
      {
        title: 'Pix estático vs. dinámico',
        paragraphs: [
          'El QR Code Pix estático puede reutilizarse infinitamente. Contiene la clave Pix directamente en el payload. Ideal para tiendas, autónomos y donaciones.',
          'El QR Code Pix dinámico es de uso único. Contiene una URL/location proporcionada por el PSP que devuelve los datos del pago en tiempo real.',
        ],
        list: [
          'Estático: clave Pix en campo 26.01, Point of Initiation = 11.',
          'Dinámico: URL en campo 26.25, Point of Initiation = 12.',
          'Ambos usan GUI br.gov.bcb.pix en campo 26.00.',
          'CRC16-CCITT valida integridad del payload.',
        ],
      },
      {
        title: 'CRC16 — qué es y cómo funciona',
        paragraphs: [
          'CRC16-CCITT es un checksum de 4 caracteres hexadecimales al final del payload (campo 63). Garantiza que el payload no fue corrompido o alterado.',
          'El cálculo usa polinomio 0x1021 con valor inicial 0xFFFF. Si el CRC es incorrecto, la app bancaria puede rechazar el pago.',
        ],
      },
      {
        title: 'Privacidad y procesamiento local',
        paragraphs: [
          'Todo el procesamiento — parsing, validación, generación de QR Code y CRC — ocurre 100% en el navegador. Ningún dato de pago se envía al servidor.',
          'La herramienta no consulta el DICT del Banco Central, no valida titularidad de claves y no confirma pagos.',
        ],
      },
      {
        title: 'Avisos de seguridad',
        paragraphs: [
          'Un CRC válido NO significa que el receptor es confiable. Siempre verifica los datos en la app de tu banco antes de confirmar un pago Pix.',
          'Los QR Codes Pix pueden usarse en estafas. Nunca pagues sin verificar el destinatario.',
        ],
      },
    ],
    faq: [
      { question: '¿Qué es Pix Copia y Pega?', answer: 'Es la versión textual del QR Code Pix. Un payload EMV con datos del pago que puede pegarse en la app bancaria para iniciar la transacción.' },
      { question: '¿Esta herramienta genera Pix real?', answer: 'Sí, el Pix estático generado es real. Para Pix dinámico real, se necesita un PSP que proporcione la URL/location.' },
      { question: '¿Cuál es la diferencia entre Pix estático y dinámico?', answer: 'Estático es reutilizable con la clave directamente. Dinámico es de uso único con URL del PSP.' },
      { question: '¿Qué es el CRC del Pix?', answer: 'CRC16-CCITT es un checksum de 4 caracteres al final que valida integridad. Si es incorrecto, la app puede rechazar el código.' },
      { question: '¿Puedo corregir un Pix con CRC inválido?', answer: 'Sí. La herramienta recalcula el CRC correcto y genera el payload corregido.' },
      { question: '¿La clave Pix se valida con el Banco Central?', answer: 'No. Solo valida formato y estructura. No consulta DICT ni confirma titularidad.' },
      { question: '¿La herramienta confirma pagos?', answer: 'No. La confirmación depende del PSP/banco. Solo genera, valida y decodifica payloads.' },
      { question: '¿Mis datos se envían a un servidor?', answer: 'No. Todo el procesamiento es local. Ningún dato sale de tu dispositivo.' },
      { question: '¿Puedo descargar el QR Code Pix?', answer: 'Sí. Puedes descargar en PNG, SVG o PDF, copiar como imagen y personalizar colores y tamaño.' },
      { question: '¿Puedo usar el QR Code generado en una tienda?', answer: 'Sí. El QR Code estático generado es válido y funcional.' },
    ],
  },
};

export function getPixDecoderContent(locale: AppLocale): PixDecoderLocaleContent {
  return contentByLocale[locale];
}
