import type { AppLocale } from '@/lib/i18n/config';
import type { ContentBlock, FaqItem } from '@/types/content';

export const pixDecoderIntro =
  'Gere, valide e decodifique Pix Copia e Cola: veja os campos EMV, confira o CRC16 e baixe o QR Code. Tudo no navegador.';

export const pixDecoderContentBlocks: ContentBlock[] = [
  {
    title: 'O que é Pix Copia e Cola?',
    paragraphs: [
      'Pix Copia e Cola é a versão em texto do QR Code Pix. É um payload no formato EMV (Europay, Mastercard, Visa) que reúne os dados do pagamento: chave do recebedor, nome, cidade, identificador e, se houver, o valor.',
      'O formato é padronizado pelo Banco Central do Brasil e segue a especificação BR Code. Quando o QR Code é lido ou o texto é colado no app do banco, esses dados são interpretados para iniciar a transação.',
    ],
  },
  {
    title: 'Pix estático vs. dinâmico',
    paragraphs: [
      'O Pix estático pode ser reutilizado quantas vezes quiser e leva a chave Pix do recebedor dentro do próprio código. É o tipo usado por lojas, autônomos e doações. Se o campo de valor (54) não existir, quem paga digita o valor.',
      'O Pix dinâmico leva uma URL (location) fornecida pelo PSP, o banco ou a fintech que emitiu a cobrança, e os dados do pagamento são buscados nela. Costuma valer para uma cobrança específica, como em e-commerce. Esta ferramenta monta o código a partir da URL que você informa, mas não a consulta e não cria cobranças: isso depende do seu PSP.',
    ],
    list: [
      'Estático: a chave Pix fica no subcampo 26.01 e o Point of Initiation Method (campo 01) é 11.',
      'Dinâmico: a URL fica no subcampo 26.25, sem https://, e o campo 01 é 12. Chave e URL não podem aparecer juntas.',
      'Os dois usam o identificador br.gov.bcb.pix no subcampo 26.00.',
      'Ao ler um código, a ferramenta o trata como dinâmico se o campo 01 for 12 ou se houver URL; caso contrário, como estático.',
    ],
  },
  {
    title: 'Como ler o resultado da validação',
    paragraphs: [
      'O resultado pode ser "Válido", "Válido com avisos", "Inválido", "CRC inválido" ou "Não parece Pix" (quando o identificador br.gov.bcb.pix não é encontrado). São erros: campo obrigatório ausente (52, 53, 58, 59, 60 ou 63), tamanho declarado diferente do real, CRC ausente ou fora do fim do código e chave e URL juntas. São avisos: moeda diferente de BRL (986), país diferente de BR, nome com mais de 25 caracteres, cidade com mais de 15, valor fora do formato e campos repetidos.',
      'Na geração, a ferramenta confere o formato da chave (dígitos de CPF e CNPJ, e-mail, telefone ou chave aleatória), corta o nome em 25 caracteres e a cidade em 15, grava o valor com duas casas e usa "***" quando não há TXID. O TXID deve ter até 25 letras e números, e a ferramenta avisa quando não for assim.',
    ],
  },
  {
    title: 'CRC16: o que é e como funciona',
    paragraphs: [
      'O CRC16-CCITT é um checksum de 4 caracteres hexadecimais no final do payload (campo 63). Ele é calculado sobre todo o texto, do início até "6304", com polinômio 0x1021 e valor inicial 0xFFFF. Se um caractere mudar, o CRC deixa de bater e o app do banco pode recusar o código.',
      'O botão de correção recalcula só o CRC do final do código. Ele não confere o conteúdo: se alguém trocou a chave ou o valor, o código corrigido terá CRC válido e dados diferentes do original. Use a correção apenas em códigos que você mesmo montou.',
    ],
  },
  {
    title: 'Privacidade e limites',
    paragraphs: [
      'A leitura, a validação, o cálculo do CRC e a geração do QR Code acontecem no navegador. Chave, valor e payload não são enviados ao servidor do site.',
      'A ferramenta não consulta o DICT (Diretório de Identificadores de Contas Transacionais) do Banco Central, não confirma quem é o dono da chave e não mostra se um pagamento foi feito.',
    ],
  },
  {
    title: 'Avisos de segurança',
    paragraphs: [
      'Um CRC válido não significa que o recebedor é confiável. Confira nome, chave e valor no app do seu banco antes de confirmar um Pix.',
      'QR Codes Pix também são usados em golpes: nunca pague sem verificar o destinatário. Esta ferramenta serve para análise técnica e para gerar códigos dos seus próprios recebimentos.',
    ],
  },
];

export const pixDecoderFaq: FaqItem[] = [
  {
    question: 'O que é Pix Copia e Cola?',
    answer: 'É a versão em texto do QR Code Pix: um payload no formato EMV com os dados do pagamento (chave, nome, cidade e, às vezes, valor), que pode ser colado no app do banco para iniciar o Pix.',
  },
  {
    question: 'Qual a diferença entre Pix estático e dinâmico?',
    answer: 'O estático leva a chave Pix no código e pode ser reutilizado. O dinâmico leva a URL de uma cobrança criada pelo PSP e costuma valer para um pagamento. A ferramenta mostra o tipo ao decodificar um código.',
  },
  {
    question: 'O que significa CRC inválido e posso corrigir?',
    answer: 'O CRC é o checksum de 4 caracteres no fim do código. Se ele não bater com o conteúdo, o código foi alterado ou cortado. A ferramenta mostra o CRC esperado e pode recalculá-lo, mas isso não verifica se chave, nome e valor estão certos.',
  },
  {
    question: 'A ferramenta valida a chave ou confirma pagamentos?',
    answer: 'Não. Ela confere só o formato (por exemplo, os dígitos de um CPF) e não consulta o DICT. O código gerado segue o padrão BR Code e funciona se a chave existir, mas a ferramenta não cria chaves nem cobranças dinâmicas. Leia o QR Code no app do banco e confira o recebedor antes de divulgá-lo.',
  },
  {
    question: 'Meus dados saem do navegador? Posso baixar o QR Code?',
    answer: 'Não, o processamento é local e nada é enviado ao site. O QR Code pode ser baixado em PNG ou SVG, com cor e tamanho ajustáveis, e os dados podem ser exportados em TXT, JSON ou CSV.',
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
      'Gere, valide e decodifique Pix Copia e Cola: veja os campos EMV, confira o CRC16 e baixe o QR Code. Tudo no navegador, sem enviar dados.',
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
  zh: {
    name: 'Pix 二维码解码与生成工具',
    shortDescription:
      '生成巴西 Pix 付款码，解析 EMV 字段、校验或修复 CRC16，并下载二维码。所有处理均在浏览器本地完成。',
    primaryKeyword: 'Pix 二维码解码器',
    secondaryKeywords: [
      'Pix 二维码生成器',
      'Pix EMV 解析器',
      'BR Code 解码器',
      'Pix 付款码校验',
      'Pix CRC16 校验工具',
      '解析 Pix 支付数据',
      '修复 Pix CRC',
      '巴西 Pix 二维码',
      'EMV 二维码解析器',
    ],
    searchIntent:
      '需要生成、校验、解析或修复巴西 Pix 付款码（BR Code EMV）的开发者、商家和用户。',
    seoTitle: 'Pix 二维码解码与生成 | BR Code EMV 校验工具',
    seoDescription:
      '生成 Pix 付款码，解析 EMV 字段，检查或修复 CRC16，并下载二维码。数据只在浏览器本地处理。',
    h1: 'Pix 二维码解码与生成工具',
    intro:
      'Pix 是巴西常用的即时支付方式。你可以生成 Pix 付款码、解析 BR Code 字段、检查 CRC16，并查看付款信息；所有操作都在浏览器本地完成。',
    contentBlocks: [
      {
        title: 'Pix 付款码和 BR Code 是什么？',
        paragraphs: [
          'Pix 付款码是一段代表 Pix 二维码的文本，采用 EMV 格式，可包含收款方 Pix 密钥、金额、姓名、城市和交易标识等信息。用户可以将其粘贴到巴西银行应用中发起付款。',
          '该格式由巴西中央银行依据 BR Code 规范制定。此工具用于查看和生成技术载荷，不会连接银行或实际发起转账。',
        ],
      },
      {
        title: '静态 Pix 与动态 Pix',
        paragraphs: [
          '静态 Pix 通常可以重复使用，载荷中直接包含收款方 Pix 密钥，适合商店、自由职业者和捐赠场景。',
          '动态 Pix 通常用于单笔付款。载荷包含支付服务提供商（PSP）给出的地址，由 PSP 返回对应的付款信息，常见于指定金额的账单和电商结账。',
        ],
        list: [
          '静态：Pix 密钥位于字段 26.01，Point of Initiation 为 11。',
          '动态：地址位于字段 26.25，Point of Initiation 为 12。',
          '两种类型都在字段 26.00 使用 GUI br.gov.bcb.pix。',
          'CRC16-CCITT 用于检查载荷完整性。',
        ],
      },
      {
        title: 'CRC16 校验和的作用',
        paragraphs: [
          'CRC16-CCITT 是载荷末尾字段 63 中的四位十六进制校验值，用于发现数据意外损坏或被修改的情况。',
          '计算采用多项式 0x1021 和初始值 0xFFFF。校验值不正确时，银行应用可能会拒绝付款码。本工具可以检查 CRC，也可以重新计算并修复它。',
        ],
      },
      {
        title: '本地处理与隐私',
        paragraphs: [
          '解析、校验、生成二维码和计算 CRC 都在浏览器中完成。付款载荷、密钥和金额不会发送到工具服务器。',
          '本工具不查询巴西中央银行的 DICT 系统，不核实密钥归属，也不确认付款是否完成。',
        ],
      },
      {
        title: '付款前的安全检查',
        paragraphs: [
          'CRC 校验通过并不代表收款方可信。确认 Pix 付款前，请务必在银行应用中核对收款人姓名、密钥和金额。',
          '二维码也可能被用于诈骗。请先核实收款方再付款；此工具仅用于技术分析和生成合法的测试或收款载荷。',
        ],
      },
    ],
    faq: [
      { question: '什么是 Pix 付款码？', answer: '它是 Pix 二维码的文本形式，包含付款所需的数据，可以粘贴到巴西银行应用中发起交易。' },
      { question: '静态 Pix 和动态 Pix 有什么区别？', answer: '静态 Pix 可重复使用，载荷中包含 Pix 密钥；动态 Pix 包含 PSP 提供的地址，通常用于单笔付款。' },
      { question: 'CRC 校验通过是否表示收款方可信？', answer: '不是。CRC 只检查载荷是否完整，付款前仍需在银行应用中核对收款人和金额。' },
      { question: '可以在这里修复无效的 CRC 吗？', answer: '可以。工具会重新计算 CRC16，并生成修正后的载荷供你检查或复制。' },
      { question: '密钥或付款数据会发送到服务器吗？', answer: '默认不会。生成、解析和校验都在浏览器本地完成；工具也不会查询 DICT 或确认付款。' },
    ],
  },
};

export function getPixDecoderContent(locale: AppLocale): PixDecoderLocaleContent {
  return contentByLocale[locale];
}
