import type { AppLocale } from '@/lib/i18n/config';
import type { ContentBlock, FaqItem } from '@/types/content';

export type UnixTimestampLocaleContent = {
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

const contentByLocale: Record<AppLocale, UnixTimestampLocaleContent> = {
  'pt-br': {
    name: 'Conversor Unix Timestamp',
    shortDescription: 'Converta timestamp Unix em data legivel e data em timestamp (segundos e milissegundos) com UTC e horario local.',
    primaryKeyword: 'conversor unix timestamp online',
    secondaryKeywords: ['timestamp para data', 'data para timestamp', 'epoch converter', 'timestamp segundos milissegundos', 'converter exp jwt'],
    searchIntent: 'Devs e analistas que precisam interpretar datas de APIs, logs, JWT e banco de dados.',
    seoTitle: 'Conversor Unix Timestamp Online | Segundos e Milissegundos',
    seoDescription: 'Converta timestamp Unix para data local/UTC e data para timestamp em segundos e milissegundos com deteccao automatica.',
    h1: 'Conversor Unix Timestamp para Data e Data para Timestamp',
    intro: 'Interprete timestamps de APIs, logs e JWT com conversao bidirecional, incluindo horario local, UTC e diferenca relativa.',
    contentBlocks: [
      {
        title: 'Timestamp Unix na pratica',
        paragraphs: [
          'Timestamp Unix representa tempo como numero desde 1970-01-01 UTC. Em sistemas, ele aparece com frequencia em logs, eventos, webhooks e campos de expiracao.',
          'Nesta pagina voce converte tanto timestamp para data quanto data para timestamp, com suporte a segundos e milissegundos.',
        ],
      },
      {
        title: 'Segundos vs milissegundos',
        paragraphs: [
          'Uma fonte comum de erro e confundir timestamp em segundos com milissegundos. A ferramenta detecta automaticamente e mostra os dois formatos para evitar bugs.',
          'Tambem exibimos data local, UTC e indicador de passado/futuro para acelerar analise em debugging.',
        ],
      },
      {
        title: 'Uso em API, banco e JWT',
        paragraphs: [
          'Ao depurar autenticacao, o campo exp do JWT normalmente usa Unix em segundos. Em bancos e logs, milissegundos tambem sao comuns.',
          'Essa diferenca impacta timezone e validacao temporal, por isso vale confirmar sempre o formato antes de comparar datas.',
        ],
      },
    ],
    faq: [
      { question: 'A ferramenta detecta segundos e milissegundos?', answer: 'Sim. A deteccao e automatica e mostramos ambos os formatos.' },
      { question: 'Posso converter data para timestamp?', answer: 'Sim. Basta informar data/hora no formulario reverso.' },
      { question: 'Mostra UTC e horario local?', answer: 'Sim. Exibimos os dois para facilitar comparacao.' },
      { question: 'Funciona sem backend?', answer: 'Sim. O processamento ocorre no navegador.' },
    ],
  },
  en: {
    name: 'Unix Timestamp Converter',
    shortDescription: 'Convert Unix timestamp to readable date and date to timestamp in seconds and milliseconds with UTC/local output.',
    primaryKeyword: 'unix timestamp converter online',
    secondaryKeywords: ['timestamp to date', 'date to timestamp', 'epoch converter', 'seconds milliseconds timestamp', 'jwt exp converter'],
    searchIntent: 'Developers and analysts converting timestamps from APIs, logs, JWT, and databases.',
    seoTitle: 'Unix Timestamp Converter Online | Date, UTC, Seconds, Milliseconds',
    seoDescription: 'Convert epoch timestamps to local/UTC date and reverse convert date/time to Unix seconds and milliseconds.',
    h1: 'Unix Timestamp Converter Online',
    intro: 'Convert timestamps both ways with automatic seconds/ms detection, UTC/local formatting, and relative time insight.',
    contentBlocks: [
      {
        title: 'Why Unix timestamps matter',
        paragraphs: [
          'Unix timestamp stores time as elapsed seconds since 1970-01-01 UTC. It is widely used in APIs, logs, webhooks, and auth systems.',
          'This page helps you quickly inspect and convert timestamps for debugging and operational tasks.',
        ],
      },
      {
        title: 'Seconds vs milliseconds',
        paragraphs: [
          'A common bug source is mixing seconds and milliseconds. The converter auto-detects input and displays both forms.',
          'You also get local date, UTC date, and past/future context to interpret values confidently.',
        ],
      },
      {
        title: 'Practical use cases',
        paragraphs: [
          'Use it for JWT exp/iat checks, API payload validation, database records, and event timeline analysis.',
          'Timezone awareness is still important because systems may display local and UTC values differently.',
        ],
      },
    ],
    faq: [
      { question: 'Can it detect seconds vs milliseconds?', answer: 'Yes. Detection is automatic and both values are shown.' },
      { question: 'Can I convert date/time back to timestamp?', answer: 'Yes. Use the reverse conversion section.' },
      { question: 'Does it show UTC and local time?', answer: 'Yes. Both are displayed.' },
      { question: 'Is conversion local?', answer: 'Yes. It runs in your browser.' },
    ],
  },
  es: {
    name: 'Conversor Unix Timestamp',
    shortDescription: 'Convierte timestamp Unix a fecha legible y fecha a timestamp en segundos y milisegundos.',
    primaryKeyword: 'conversor unix timestamp online',
    secondaryKeywords: ['timestamp a fecha', 'fecha a timestamp', 'epoch converter', 'timestamp segundos milisegundos', 'jwt exp converter'],
    searchIntent: 'Usuarios tecnicos que interpretan fechas de APIs, logs, JWT y bases de datos.',
    seoTitle: 'Conversor Unix Timestamp Online | Segundos y Milisegundos',
    seoDescription: 'Convierte timestamp Unix a fecha local/UTC y fecha a timestamp con deteccion automatica.',
    h1: 'Conversor Unix Timestamp para Fecha y Fecha para Timestamp',
    intro: 'Interpreta timestamps con conversion bidireccional, salida local/UTC y contexto relativo.',
    contentBlocks: [
      {
        title: 'Que es Unix timestamp',
        paragraphs: [
          'Unix timestamp expresa el tiempo desde 1970-01-01 UTC. Aparece en APIs, logs, eventos y campos de expiracion.',
          'Aqui puedes convertir en ambos sentidos para revisar valores rapido.',
        ],
      },
      {
        title: 'Segundos y milisegundos',
        paragraphs: [
          'Confundir segundos con milisegundos genera errores comunes. La herramienta detecta formato y muestra ambos resultados.',
          'Tambien incluye fecha local, UTC y si el valor es pasado o futuro.',
        ],
      },
      {
        title: 'Casos reales de uso',
        paragraphs: [
          'Util para revisar exp/iat de JWT, analizar logs y validar payloads de integracion.',
          'Ten en cuenta diferencias de zona horaria para interpretar correctamente los datos.',
        ],
      },
    ],
    faq: [
      { question: 'Detecta segundos y milisegundos?', answer: 'Si. La deteccion es automatica.' },
      { question: 'Convierte fecha a timestamp?', answer: 'Si. Incluye conversion inversa.' },
      { question: 'Muestra UTC y hora local?', answer: 'Si. Se muestran ambas.' },
      { question: 'Funciona localmente?', answer: 'Si. Corre en el navegador.' },
    ],
  },
};

export const getUnixTimestampContent = (locale: AppLocale): UnixTimestampLocaleContent =>
  contentByLocale[locale] ?? contentByLocale['pt-br'];

export const unixTimestampIntro = contentByLocale['pt-br'].intro;
export const unixTimestampContentBlocks = contentByLocale['pt-br'].contentBlocks;
export const unixTimestampFaq = contentByLocale['pt-br'].faq;
