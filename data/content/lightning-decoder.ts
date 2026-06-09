import type { AppLocale } from '@/lib/i18n/config';
import type { ContentBlock, FaqItem } from '@/types/content';

export const lightningDecoderIntro =
  'Decodifique Lightning Address, LNURL, BOLT11 e BOLT12 com visual colorido por campos, exporte JSON/TXT e gere QR Code customizado em PNG e SVG — tudo localmente no navegador.';

export const lightningDecoderContentBlocks: ContentBlock[] = [
  {
    title: 'O que este Lightning Decoder faz',
    paragraphs: [
      'Esta ferramenta analisa strings do ecossistema Lightning Network e mostra os detalhes estruturados para inspeção técnica. Você pode colar invoice BOLT11, offer BOLT12, links LNURL e também Lightning Address.',
      'O decoder organiza as seções por categoria visual (header, pagamento, tempo, roteamento e segurança), facilitando auditoria, debugging e validação antes de pagar ou integrar em aplicações.',
    ],
  },
  {
    title: 'Formatos suportados',
    paragraphs: [
      'BOLT11: leitura de rede, valor em millisats, timestamp, expiração, tags, assinatura e detalhes brutos.',
      'BOLT12: decode estrutural do payload bech32 com visualização local dos bytes em texto ou hexadecimal.',
      'LNURL: decode do conteúdo bech32 para URL/payload, útil para inspecionar endpoints de login e pagamento.',
      'Lightning Address: decomposição do formato usuario@dominio com endpoint LNURLp calculado automaticamente.',
    ],
    list: [
      'Decode local no navegador.',
      'Visual colorido por grupo de campos.',
      'Geração de QR Code do payload normalizado.',
      'Exportação de dados em TXT e JSON.',
    ],
  },
  {
    title: 'Quando usar',
    paragraphs: [
      'Use este decoder para validar payloads recebidos, depurar integrações de checkout Lightning e conferir campos críticos antes da cobrança. É útil para devs, suporte técnico, operações e criadores de conteúdo de Bitcoin.',
      'Também ajuda em troubleshooting quando uma wallet rejeita um payload: você pode identificar estrutura inválida, campos ausentes ou inconsistências de formatação rapidamente.',
    ],
  },
  {
    title: 'Privacidade e segurança',
    paragraphs: [
      'Todo processamento acontece no navegador do usuário. Não há envio automático dos payloads para servidor nesta ferramenta.',
      'Mesmo com decode válido, sempre confirme destinatário e valor dentro da sua carteira/app de pagamento. Esta página não substitui validações de segurança da wallet.',
    ],
  },
];

export const lightningDecoderFaq: FaqItem[] = [
  {
    question: 'Quais formatos posso decodificar?',
    answer:
      'A ferramenta suporta Lightning Address, LNURL, BOLT11 e BOLT12. Basta colar o valor no campo principal e clicar em decodificar.',
  },
  {
    question: 'Posso gerar QR Code do conteúdo decodificado?',
    answer:
      'Sim. A aba de QR Code cria o código a partir do payload normalizado e permite baixar em PNG ou SVG com personalização de cor e tamanho.',
  },
  {
    question: 'Os dados ficam salvos no servidor?',
    answer:
      'Não. O decode e as exportações são processados localmente no navegador.',
  },
  {
    question: 'Este decoder valida assinatura criptográfica?',
    answer:
      'Ele faz decode estrutural e exibe os campos técnicos. Para validação criptográfica completa, use também sua stack de verificação na wallet/backend.',
  },
  {
    question: 'Posso exportar os detalhes técnicos?',
    answer:
      'Sim. Você pode copiar ou baixar os resultados em TXT e JSON para auditoria, logs e documentação.',
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
    seoTitle: 'Lightning Decoder Online | BOLT11, BOLT12, LNURL e Lightning Address',
    seoDescription:
      'Decodifique BOLT11, BOLT12, LNURL e Lightning Address com visual colorido por campos, exporte JSON/TXT e gere QR Code. 100% local no navegador.',
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
};

export function getLightningDecoderContent(locale: AppLocale): LightningDecoderLocaleContent {
  return contentByLocale[locale];
}
