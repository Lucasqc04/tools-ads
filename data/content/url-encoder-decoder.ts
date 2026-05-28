import type { AppLocale } from '@/lib/i18n/config';
import type { ContentBlock, FaqItem } from '@/types/content';

export type UrlEncoderDecoderLocaleContent = {
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

const contentByLocale: Record<AppLocale, UrlEncoderDecoderLocaleContent> = {
  'pt-br': {
    name: 'URL Encoder e Decoder',
    shortDescription: 'Codifique e decodifique URLs e parametros com suporte a caracteres especiais, query params e copia rapida.',
    primaryKeyword: 'url encoder e decoder online',
    secondaryKeywords: ['encode url', 'decode url', 'url encode parametro', 'decode query string', 'utm encoder'],
    searchIntent: 'Devs, analistas e marketing que precisam codificar/decodificar links e parametros com seguranca.',
    seoTitle: 'URL Encoder e Decoder Online | Encode/Decode de URL e Parametros',
    seoDescription: 'Ferramenta para codificar e decodificar URL, query params e textos com acentos/simbolos. Inclui parser de parametros e reconstruir URL.',
    h1: 'URL Encoder e Decoder Online',
    intro: 'Transforme texto e links em formatos seguros para query params, redirects, APIs e campanhas.',
    contentBlocks: [
      {
        title: 'Quando usar URL encode e decode',
        paragraphs: [
          'Encode e util quando voce precisa enviar parametros com espacos, acentos e simbolos em links, APIs e formulários.',
          'Decode faz o caminho inverso, ajudando na leitura e depuracao de URLs que chegam codificadas.',
        ],
      },
      {
        title: 'Trabalho com query string',
        paragraphs: [
          'A ferramenta tambem separa query params em tabela para voce editar nome e valor com clareza.',
          'Depois de ajustar os parametros, voce pode reconstruir a URL final e copiar o resultado rapidamente.',
        ],
      },
      {
        title: 'Limites e cuidados',
        paragraphs: [
          'Nem todo texto codificado deve ser decodificado com a mesma funcao. Em alguns casos, voce precisa tratar URL completa e parametro individual de forma diferente.',
          'Sempre valide o resultado final para evitar links quebrados em campanhas e integrações.',
        ],
      },
    ],
    faq: [
      { question: 'Qual a diferenca entre encodeURI e encodeURIComponent?', answer: 'encodeURI e melhor para URL completa; encodeURIComponent e ideal para valor de parametro.' },
      { question: 'Posso decodificar query string completa?', answer: 'Sim. Voce pode colar URL inteira e extrair parametros.' },
      { question: 'A ferramenta detecta texto ja codificado?', answer: 'Sim. Existe aviso quando o texto aparenta estar codificado.' },
      { question: 'Funciona no navegador sem backend?', answer: 'Sim. Todo processamento e local.' },
    ],
  },
  en: {
    name: 'URL Encoder and Decoder',
    shortDescription: 'Encode and decode URLs and query params with support for special characters and fast copy actions.',
    primaryKeyword: 'url encoder decoder online',
    secondaryKeywords: ['encode url', 'decode url', 'query param encoder', 'decode query string', 'utm url encoding'],
    searchIntent: 'Developers, analysts, and marketers handling links, redirects, and URL parameters.',
    seoTitle: 'URL Encoder and Decoder Online | Encode/Decode URL and Params',
    seoDescription: 'Encode or decode full URLs and parameters. Includes query parser, editable params, and URL rebuild workflow.',
    h1: 'URL Encoder and Decoder Online',
    intro: 'Encode and decode links safely for query params, APIs, redirects, and campaign URLs.',
    contentBlocks: [
      {
        title: 'Why URL encoding matters',
        paragraphs: [
          'URL encoding ensures spaces and special characters are transmitted safely in links and request parameters.',
          'Decoding helps inspect incoming URLs, debug integrations, and read values clearly.',
        ],
      },
      {
        title: 'Query parameter editing',
        paragraphs: [
          'You can parse query strings into key/value rows, edit them, and rebuild a final URL.',
          'This is useful for UTM setup, redirect links, and API parameter checks.',
        ],
      },
      {
        title: 'Practical limitations',
        paragraphs: [
          'Use full URL encoding and parameter encoding in the correct context to avoid malformed links.',
          'Always validate final output before publishing links in production workflows.',
        ],
      },
    ],
    faq: [
      { question: 'What is the difference between encodeURI and encodeURIComponent?', answer: 'encodeURI is for full URLs, encodeURIComponent is for individual parameter values.' },
      { question: 'Can I parse full query strings?', answer: 'Yes. Paste a full URL and extract/edit parameters.' },
      { question: 'Can it detect already encoded content?', answer: 'Yes. It can show a hint when content looks encoded.' },
      { question: 'Is processing local?', answer: 'Yes. It runs in-browser.' },
    ],
  },
  es: {
    name: 'URL Encoder y Decoder',
    shortDescription: 'Codifica y decodifica URLs y parametros con soporte para caracteres especiales y query string.',
    primaryKeyword: 'url encoder decoder online',
    secondaryKeywords: ['encode url', 'decode url', 'parametro url encode', 'query string decode', 'utm encoder'],
    searchIntent: 'Usuarios tecnicos y marketing que necesitan manipular URLs y parametros de forma segura.',
    seoTitle: 'URL Encoder y Decoder Online | Codificar y Decodificar URL',
    seoDescription: 'Codifica y decodifica URL completa o parametros. Incluye parser de query params y reconstruccion de enlace.',
    h1: 'URL Encoder y Decoder Online',
    intro: 'Convierte texto y enlaces para uso seguro en APIs, redirects, query params y campanas.',
    contentBlocks: [
      {
        title: 'Para que sirve encode/decode',
        paragraphs: [
          'URL encode protege espacios, acentos y simbolos en enlaces y parametros.',
          'URL decode facilita lectura de links codificados durante pruebas y debugging.',
        ],
      },
      {
        title: 'Edicion de query params',
        paragraphs: [
          'Puedes separar parametros en tabla, editar nombre/valor y reconstruir URL final.',
          'Es util para UTM, links de redireccion y validacion de integraciones.',
        ],
      },
      {
        title: 'Cuidados importantes',
        paragraphs: [
          'No siempre debes usar la misma funcion para URL completa y valor individual de parametro.',
          'Valida el resultado final para evitar enlaces invalidos.',
        ],
      },
    ],
    faq: [
      { question: 'Diferencia entre encodeURI y encodeURIComponent?', answer: 'encodeURI para URL completa; encodeURIComponent para valor de parametro.' },
      { question: 'Puedo parsear query string?', answer: 'Si. Puedes extraer y editar parametros.' },
      { question: 'Detecta texto ya codificado?', answer: 'Si. Muestra alerta cuando parece codificado.' },
      { question: 'Se procesa localmente?', answer: 'Si. Todo corre en el navegador.' },
    ],
  },
};

export const getUrlEncoderDecoderContent = (locale: AppLocale): UrlEncoderDecoderLocaleContent =>
  contentByLocale[locale] ?? contentByLocale['pt-br'];

export const urlEncoderDecoderIntro = contentByLocale['pt-br'].intro;
export const urlEncoderDecoderContentBlocks = contentByLocale['pt-br'].contentBlocks;
export const urlEncoderDecoderFaq = contentByLocale['pt-br'].faq;
