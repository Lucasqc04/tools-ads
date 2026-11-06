import type { AppLocale } from '@/lib/i18n/config';
import type { ContentBlock, FaqItem } from '@/types/content';

export const lightningDecoderIntro =
  'Cole uma invoice BOLT11, uma offer BOLT12, um LNURL ou uma Lightning Address para ver os campos organizados, exportar em JSON ou TXT e gerar um QR Code. Tudo no navegador.';

export const lightningDecoderContentBlocks: ContentBlock[] = [
  {
    title: 'O que este Lightning Decoder faz',
    paragraphs: [
      'Esta ferramenta lê textos da Lightning Network e mostra os detalhes de forma estruturada para inspeção técnica. Você pode colar uma invoice BOLT11, uma offer BOLT12, um link LNURL ou uma Lightning Address, com ou sem o prefixo "lightning:".',
      'Os campos aparecem agrupados por categoria (cabeçalho, pagamento, tempo, roteamento, segurança e metadados), o que facilita conferir uma invoice antes de integrá-la a um sistema ou investigar por que uma carteira recusou um pagamento.',
    ],
  },
  {
    title: 'Formatos suportados e como ler o resultado',
    paragraphs: [
      'BOLT11 (começa com lnbc, lntb, lnbcrt ou lnsb): mostra rede, valor em millisats (1.000 millisats = 1 satoshi), data de criação, expiração, chave pública do recebedor, tags, dicas de rota e a assinatura. Se a invoice não tiver tempo de expiração, a ferramenta considera o padrão de 3.600 segundos.',
      'BOLT12 (começa com lno1, lnr1 ou lnf1): decodifica o texto bech32 e lista os campos TLV mais comuns, como moeda, valor, descrição e expiração. Campos fora desse mapeamento aparecem como unknown_tag.',
      'LNURL: converte o texto bech32 de volta em URL, para você ver qual endereço ele aponta antes de abrir. Lightning Address (usuario@dominio.com): separa usuário e domínio e monta o endpoint LNURLp padrão, https://dominio.com/.well-known/lnurlp/usuario.',
    ],
    list: [
      'Decodificação local no navegador.',
      'Campos agrupados por cores e categorias.',
      'QR Code do conteúdo, para baixar em PNG ou SVG.',
      'Exportação dos dados em TXT e JSON.',
    ],
  },
  {
    title: 'Quando usar',
    paragraphs: [
      'Use para validar payloads recebidos, depurar o checkout Lightning de uma loja e conferir valor e expiração antes de cobrar. Também ajuda quando uma carteira rejeita um código: a ferramenta mostra se a estrutura está inválida ou se há campos ausentes.',
    ],
  },
  {
    title: 'Limites, privacidade e segurança',
    paragraphs: [
      'A decodificação é estrutural. A ferramenta não valida a assinatura da invoice, não verifica se o recebedor existe e não consulta a rede. Na Lightning Address, o endpoint é apenas calculado: ele não é acessado, então nada indica se o endereço funciona.',
      'Todo o processamento acontece no navegador, e o texto colado não é enviado ao servidor do site. Mesmo com a decodificação correta, confira o destinatário e o valor na sua carteira antes de pagar, e não abra URLs de LNURL que você não reconhece.',
    ],
  },
];

export const lightningDecoderFaq: FaqItem[] = [
  {
    question: 'Quais formatos posso decodificar?',
    answer:
      'BOLT11, BOLT12, LNURL e Lightning Address. Cole o texto no campo principal, com ou sem "lightning:" no início, e clique em decodificar.',
  },
  {
    question: 'Posso gerar um QR Code do conteúdo decodificado?',
    answer:
      'Sim. A aba de QR Code cria o código a partir do texto normalizado e permite baixar em PNG ou SVG, com cor e tamanho ajustáveis.',
  },
  {
    question: 'O texto que eu colo é enviado ao servidor?',
    answer:
      'Não. A decodificação e as exportações acontecem no navegador, e a ferramenta também não consulta endpoints de LNURL ou de Lightning Address.',
  },
  {
    question: 'Este decoder valida a assinatura da invoice?',
    answer:
      'Não. Ele mostra os campos, inclusive a assinatura, mas não faz a verificação criptográfica. Essa checagem cabe à sua carteira ou ao seu backend.',
  },
  {
    question: 'Posso exportar os detalhes técnicos?',
    answer:
      'Sim. Você pode copiar ou baixar o resultado em TXT e JSON, para auditoria, logs e documentação.',
  },
];

type LightningDecoderLocaleContent = {
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

const contentByLocale: Record<AppLocale, LightningDecoderLocaleContent> = {
  'pt-br': {
    name: 'Lightning Decoder',
    shortDescription: lightningDecoderIntro,
    primaryKeyword: 'lightning decoder bolt11 lnurl online',
    secondaryKeywords: [
      'decoder lightning network',
      'decode bolt11 invoice',
      'decode bolt12 offer',
      'decoder lnurl',
      'lightning address decoder',
      'lightning invoice parser',
      'bitcoin lightning tools',
      'lightning qr code generator',
      'bolt11 parser online',
      'lnurl decoder online',
    ],
    searchIntent:
      'Usuários e desenvolvedores que precisam decodificar payloads Lightning (BOLT11, BOLT12, LNURL e Lightning Address) com visual técnico e exportação.',
    seoTitle: 'Lightning Decoder | BOLT11, BOLT12, LNURL e Lightning Address',
    seoDescription:
      'Decodifique BOLT11, BOLT12, LNURL e Lightning Address, veja os campos agrupados, exporte JSON ou TXT e gere QR Code. Tudo no navegador.',
    h1: 'Lightning Decoder Online com QR Code e Exportação',
    intro: lightningDecoderIntro,
    contentBlocks: lightningDecoderContentBlocks,
    faq: lightningDecoderFaq,
  },
  en: {
    name: 'Lightning Decoder',
    shortDescription:
      'Decode Lightning Address, LNURL, BOLT11 and BOLT12 with color-coded fields, export JSON/TXT and generate QR Code in PNG/SVG, all locally in your browser.',
    primaryKeyword: 'lightning decoder bolt11 lnurl online',
    secondaryKeywords: [
      'lightning network decoder',
      'bolt11 invoice decoder',
      'bolt12 offer decoder',
      'lnurl decoder',
      'lightning address decoder',
      'lightning invoice parser',
      'bitcoin lightning tools',
      'lightning qr code generator',
      'decode bolt11 online',
      'decode lnurl online',
    ],
    searchIntent:
      'Users and developers needing to decode Lightning payloads (BOLT11, BOLT12, LNURL, Lightning Address) with technical output and export options.',
    seoTitle: 'Lightning Decoder Online | BOLT11, BOLT12, LNURL and Lightning Address',
    seoDescription:
      'Decode BOLT11, BOLT12, LNURL and Lightning Address with color-coded fields, export JSON/TXT and generate QR Code. 100% browser-local processing.',
    h1: 'Lightning Decoder Online with QR Code and Exports',
    intro:
      'Decode Lightning Address, LNURL, BOLT11 and BOLT12 with color-coded fields, export JSON/TXT and generate QR Code in PNG/SVG, all locally in your browser.',
    contentBlocks: [
      {
        title: 'What this Lightning Decoder does',
        paragraphs: [
          'This tool analyzes Lightning Network strings and displays structured technical details. You can paste BOLT11 invoices, BOLT12 offers, LNURL values, and Lightning Addresses.',
          'Fields are grouped by category (header, payment, timing, routing, security) to make troubleshooting and verification faster.',
        ],
      },
      {
        title: 'Supported formats',
        paragraphs: [
          'BOLT11: network, millisatoshi amount, timestamps, expiry, tags, signature, and raw details.',
          'BOLT12: structural bech32 decode with local payload rendering in text/hex.',
          'LNURL: bech32 decode to URL/payload for payment and auth inspection.',
          'Lightning Address: user@domain breakdown plus computed LNURLp endpoint.',
        ],
      },
      {
        title: 'Privacy and safety notes',
        paragraphs: [
          'Processing is local in your browser. Payloads are not sent to backend by default.',
          'A valid decode does not replace wallet-level safety checks. Always verify recipient and amount before paying.',
        ],
      },
    ],
    faq: [
      {
        question: 'Which Lightning formats are supported?',
        answer:
          'Lightning Address, LNURL, BOLT11 and BOLT12 are supported in a single decode input.',
      },
      {
        question: 'Can I generate a QR Code after decoding?',
        answer:
          'Yes. The QR tab generates from normalized payload and exports PNG or SVG.',
      },
      {
        question: 'Is decoding done locally?',
        answer:
          'Yes. The tool runs in-browser and does not upload payloads by default.',
      },
      {
        question: 'Does this validate cryptographic signatures?',
        answer:
          'This page focuses on structural decoding. Use dedicated verification in your backend/wallet for full cryptographic checks.',
      },
      {
        question: 'Can I export raw details?',
        answer:
          'Yes. You can copy or download TXT and JSON output.',
      },
    ],
  },
  es: {
    name: 'Lightning Decoder',
    shortDescription:
      'Decodifica Lightning Address, LNURL, BOLT11 y BOLT12 con campos en colores, exporta JSON/TXT y genera QR Code en PNG/SVG, todo localmente en el navegador.',
    primaryKeyword: 'lightning decoder bolt11 lnurl online',
    secondaryKeywords: [
      'decodificador lightning network',
      'decodificar bolt11',
      'decodificar bolt12',
      'decodificador lnurl',
      'lightning address decoder',
      'parser lightning invoice',
      'herramientas bitcoin lightning',
      'generador qr lightning',
      'decoder bolt11 online',
      'decoder lnurl online',
    ],
    searchIntent:
      'Usuarios y desarrolladores que necesitan decodificar payloads Lightning (BOLT11, BOLT12, LNURL y Lightning Address) con salida técnica y exportación.',
    seoTitle: 'Lightning Decoder Online | BOLT11, BOLT12, LNURL y Lightning Address',
    seoDescription:
      'Decodifica BOLT11, BOLT12, LNURL y Lightning Address con visual colorido por campos, exporta JSON/TXT y genera QR Code. 100% local en navegador.',
    h1: 'Lightning Decoder Online con QR Code y Exportación',
    intro:
      'Decodifica Lightning Address, LNURL, BOLT11 y BOLT12 con campos en colores, exporta JSON/TXT y genera QR Code en PNG/SVG, todo localmente en el navegador.',
    contentBlocks: [
      {
        title: 'Que hace esta herramienta',
        paragraphs: [
          'Analiza cadenas de Lightning Network y muestra detalles tecnicos estructurados para inspeccion y debugging.',
          'Puedes pegar BOLT11, BOLT12, LNURL o Lightning Address en una sola interfaz.',
        ],
      },
      {
        title: 'Formatos soportados',
        paragraphs: [
          'BOLT11: red, monto, timestamp, expiracion, tags y firma.',
          'BOLT12: decode estructural bech32 con salida local en texto/hex.',
          'LNURL: conversion de bech32 a URL/payload.',
          'Lightning Address: usuario@dominio con endpoint LNURLp calculado.',
        ],
      },
      {
        title: 'Privacidad y seguridad',
        paragraphs: [
          'El procesamiento ocurre localmente en el navegador y no envia payloads al servidor por defecto.',
          'Siempre valida destinatario y monto en tu wallet antes de confirmar pagos.',
        ],
      },
    ],
    faq: [
      {
        question: 'Que formatos puedo decodificar?',
        answer: 'Lightning Address, LNURL, BOLT11 y BOLT12.',
      },
      {
        question: 'Puedo generar QR Code del resultado?',
        answer: 'Si. Puedes descargar el QR en PNG o SVG.',
      },
      {
        question: 'Los datos se envian al servidor?',
        answer: 'No. El procesamiento es local en el navegador.',
      },
      {
        question: 'Valida firmas criptograficas?',
        answer: 'Hace decode estructural. Para validacion criptografica completa usa tu backend/wallet.',
      },
      {
        question: 'Puedo exportar los detalles?',
        answer: 'Si. Exporta en TXT y JSON.',
      },
    ],
  },
  zh: {
    name: 'Lightning Decoder',
    shortDescription:
      'Decode Lightning Address, LNURL, BOLT11 and BOLT12 with color-coded fields, export JSON/TXT and generate QR Code in PNG/SVG, all locally in your browser.',
    primaryKeyword: 'lightning decoder bolt11 lnurl online',
    secondaryKeywords: [
      'lightning network decoder',
      'bolt11 invoice decoder',
      'bolt12 offer decoder',
      'lnurl decoder',
      'lightning address decoder',
      'lightning invoice parser',
      'bitcoin lightning tools',
      'lightning qr code generator',
      'decode bolt11 online',
      'decode lnurl online',
    ],
    searchIntent:
      'Users and developers needing to decode Lightning payloads (BOLT11, BOLT12, LNURL, Lightning Address) with technical output and export options.',
    seoTitle: 'Lightning Decoder Online | BOLT11, BOLT12, LNURL and Lightning Address',
    seoDescription:
      'Decode BOLT11, BOLT12, LNURL and Lightning Address with color-coded fields, export JSON/TXT and generate QR Code. 100% browser-local processing.',
    h1: 'Lightning Decoder Online with QR Code and Exports',
    intro:
      'Decode Lightning Address, LNURL, BOLT11 and BOLT12 with color-coded fields, export JSON/TXT and generate QR Code in PNG/SVG, all locally in your browser.',
    contentBlocks: [
      {
        title: 'What this Lightning Decoder does',
        paragraphs: [
          'This tool analyzes Lightning Network strings and displays structured technical details. You can paste BOLT11 invoices, BOLT12 offers, LNURL values, and Lightning Addresses.',
          'Fields are grouped by category (header, payment, timing, routing, security) to make troubleshooting and verification faster.',
        ],
      },
      {
        title: 'Supported formats',
        paragraphs: [
          'BOLT11: network, millisatoshi amount, timestamps, expiry, tags, signature, and raw details.',
          'BOLT12: structural bech32 decode with local payload rendering in text/hex.',
          'LNURL: bech32 decode to URL/payload for payment and auth inspection.',
          'Lightning Address: user@domain breakdown plus computed LNURLp endpoint.',
        ],
      },
      {
        title: 'Privacy and safety notes',
        paragraphs: [
          'Processing is local in your browser. Payloads are not sent to backend by default.',
          'A valid decode does not replace wallet-level safety checks. Always verify recipient and amount before paying.',
        ],
      },
    ],
    faq: [
      {
        question: 'Which Lightning formats are supported?',
        answer:
          'Lightning Address, LNURL, BOLT11 and BOLT12 are supported in a single decode input.',
      },
      {
        question: 'Can I generate a QR Code after decoding?',
        answer:
          'Yes. The QR tab generates from normalized payload and exports PNG or SVG.',
      },
      {
        question: 'Is decoding done locally?',
        answer:
          'Yes. The tool runs in-browser and does not upload payloads by default.',
      },
      {
        question: 'Does this validate cryptographic signatures?',
        answer:
          'This page focuses on structural decoding. Use dedicated verification in your backend/wallet for full cryptographic checks.',
      },
      {
        question: 'Can I export raw details?',
        answer:
          'Yes. You can copy or download TXT and JSON output.',
      },
    ],
  },
};

export function getLightningDecoderContent(locale: AppLocale): LightningDecoderLocaleContent {
  return contentByLocale[locale];
}
