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
    shortDescription: 'Codifique e decodifique uma URL inteira ou só o valor de um parâmetro, veja os query params em tabela e reconstrua o link.',
    primaryKeyword: 'url encoder e decoder online',
    secondaryKeywords: ['encode url', 'decode url', 'url encode parametro', 'decode query string', 'utm encoder'],
    searchIntent: 'Devs, analistas e marketing que precisam codificar e decodificar links e parâmetros com segurança.',
    seoTitle: 'URL Encoder e Decoder Online | Encode e Decode de URL',
    seoDescription: 'Codifique e decodifique URL completa ou valor de parâmetro, edite os query params em tabela e monte o link final. Roda no navegador.',
    h1: 'URL Encoder e Decoder Online',
    intro: 'Codifique ou decodifique uma URL ou um parâmetro (espaços, acentos e símbolos) para usar em links, redirects, APIs e campanhas.',
    contentBlocks: [
      {
        title: 'URL completa ou parâmetro: qual modo usar',
        paragraphs: [
          'Cole o texto, escolha o modo e clique em Encode ou em Decode. No modo "URL completa", a ferramenta mantém a estrutura do endereço (: / ? & = #) e só codifica o que não pode aparecer em uma URL, como espaços e acentos. É o que você quer para um link inteiro. No modo "Parâmetro", tudo que tem função especial é codificado, inclusive & = ? / e #. Use esse modo para o valor de um único parâmetro, por exemplo uma URL de retorno (redirect) que vai dentro de outra URL.',
          'Exemplo: no modo "URL completa", https://site.com/produto especial?utm_source=google ads vira https://site.com/produto%20especial?utm_source=google%20ads. No modo "Parâmetro", João & Maria = 50% vira Jo%C3%A3o%20%26%20Maria%20%3D%2050%25. A codificação usa UTF-8, então "ã" ocupa dois bytes (%C3%A3).',
        ],
      },
      {
        title: 'Tabela de query params e reconstrução do link',
        paragraphs: [
          'Depois de um Encode ou Decode, a ferramenta lê os parâmetros do resultado (o que vem depois do ?) e mostra cada nome e valor em campos editáveis. Ajuste os valores e clique em "Reconstruir URL final" para montar o link a partir do campo "Base URL", que precisa ser um endereço completo, como https://exemplo.com/pagina. O resultado vai para o campo Resultado.',
          'Ao reconstruir, os parâmetros antigos da Base URL são substituídos pelos da tabela, o #fragmento é mantido, os espaços viram "+" e nomes repetidos ficam só com o último valor. Parâmetros sem nome são ignorados. O botão "Inverter origem/resultado" troca os dois campos para você aplicar uma operação em cima da outra.',
        ],
      },
      {
        title: 'Avisos, limites e privacidade',
        paragraphs: [
          'Se o texto colado já parece codificado (por exemplo, contém %20), aparece um aviso para você não codificar duas vezes. Se houver uma sequência % incompleta ou inválida, o Decode falha com a mensagem "Falha ao decodificar o valor informado". O Decode do modo "URL completa" não desfaz caracteres reservados como %2F, %3F e %26 (eles continuam codificados), então use o modo "Parâmetro" para decodificar tudo.',
          'O processamento acontece no navegador e os links e parâmetros digitados não são enviados ao nosso servidor.',
        ],
      },
    ],
    faq: [
      { question: 'Qual a diferença entre URL completa e parâmetro?', answer: 'URL completa (encodeURI) preserva os caracteres que estruturam o endereço, como / ? & = e #. Parâmetro (encodeURIComponent) codifica todos eles e serve para o valor de um parâmetro.' },
      { question: 'Posso decodificar uma query string completa?', answer: 'Sim. Cole a URL ou só a parte depois do ?, clique em Decode e veja os parâmetros na tabela. Para decodificar tudo, inclusive %26 e %3D, use o modo "Parâmetro".' },
      { question: 'A ferramenta avisa quando o texto já está codificado?', answer: 'Sim. Quando a decodificação do texto muda o conteúdo, aparece um aviso. Ele serve para evitar uma codificação dupla, como %2520.' },
      { question: 'Os meus links são enviados para algum servidor?', answer: 'Não. Todo o processamento é feito no navegador.' },
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
  zh: {
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
};

export const getUrlEncoderDecoderContent = (locale: AppLocale): UrlEncoderDecoderLocaleContent =>
  contentByLocale[locale] ?? contentByLocale['pt-br'];

export const urlEncoderDecoderIntro = contentByLocale['pt-br'].intro;
export const urlEncoderDecoderContentBlocks = contentByLocale['pt-br'].contentBlocks;
export const urlEncoderDecoderFaq = contentByLocale['pt-br'].faq;
