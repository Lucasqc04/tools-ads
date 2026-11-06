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
    shortDescription: 'Converta um timestamp Unix (em segundos ou milissegundos) em data UTC e local, e uma data em timestamp. Tudo no navegador.',
    primaryKeyword: 'conversor unix timestamp online',
    secondaryKeywords: ['timestamp para data', 'data para timestamp', 'epoch converter', 'timestamp segundos milissegundos', 'converter exp jwt'],
    searchIntent: 'Devs e analistas que precisam interpretar datas de APIs, logs, JWT e banco de dados.',
    seoTitle: 'Conversor Unix Timestamp Online | Segundos e Milissegundos',
    seoDescription: 'Converta um timestamp Unix em data UTC e local, ou uma data em timestamp, em segundos e milissegundos. Roda no navegador, sem cadastro.',
    h1: 'Conversor Unix Timestamp para Data e Data para Timestamp',
    intro: 'Cole um timestamp de uma API, log ou JWT e veja a data em UTC e no horário local, ou escolha uma data para obter o timestamp em segundos e milissegundos.',
    contentBlocks: [
      {
        title: 'O que é o timestamp Unix e como usar a ferramenta',
        paragraphs: [
          'O timestamp Unix (ou epoch) é a quantidade de tempo passada desde 1º de janeiro de 1970, 00:00 em UTC. Ele aparece em logs, webhooks, bancos de dados e em claims de JWT como exp e iat. No campo "Timestamp -> Data", cole o número e a ferramenta mostra a data em UTC (formato ISO), a data no horário do seu navegador, o fuso usado, quanto tempo falta ou passou e se a data está no passado ou no futuro. Por exemplo, 1716890240 e 1716890240000 correspondem a 2024-05-28T09:57:20Z.',
          'O botão "Usar agora" preenche o campo com o instante atual em milissegundos, e o rodapé mostra o timestamp atual em segundos e milissegundos, atualizado em tempo real. Também é possível colar uma data em texto, como 2024-05-28T10:17:20Z.',
        ],
      },
      {
        title: 'Segundos ou milissegundos: como a ferramenta decide',
        paragraphs: [
          'A ferramenta não tem uma chave para escolher a unidade: números inteiros com valor absoluto menor que 1 trilhão (10^12) são tratados como segundos, e os maiores são tratados como milissegundos. Com isso, valores de 10 dígitos (como 1716890240) são segundos e valores de 13 dígitos (como 1716890240000) são milissegundos. O resultado mostra sempre os dois valores. Um timestamp em milissegundos de antes de setembro de 2001 tem menos de 13 dígitos e seria lido como segundos, e um número de 11 ou 12 dígitos em segundos aparece com ano muito distante, o que costuma indicar que a unidade está trocada.',
          'Se o texto não for um número inteiro, ele é lido como data pelo próprio navegador. Datas com horário e sem fuso explícito (2024-05-28T10:17:20) usam o fuso do navegador, enquanto datas só com dia (2024-05-28) são lidas como UTC. Quando o fuso importa, informe o Z ou o deslocamento (por exemplo, -03:00).',
        ],
      },
      {
        title: 'Data para timestamp e limites',
        paragraphs: [
          'No bloco "Data -> Timestamp", escolha a data e a hora (sem hora, vale 00:00). A hora é interpretada no fuso do seu navegador, e o resultado traz o UTC, o horário local e o timestamp em segundos e em milissegundos. Esse bloco ainda não converte corretamente datas anteriores a 9 de setembro de 2001. Para essas datas, use o campo de texto e informe a data completa com fuso, como 2000-01-01T00:00:00Z.',
          'A conversão acontece no navegador e os valores digitados não são enviados ao nosso servidor. A ferramenta não considera segundos bissextos, como é o padrão do tempo Unix, e não converte para outros fusos além de UTC e do fuso do seu navegador.',
        ],
      },
    ],
    faq: [
      { question: 'A ferramenta detecta segundos e milissegundos?', answer: 'Sim, automaticamente: inteiros abaixo de 10^12 são lidos como segundos e os maiores como milissegundos. O resultado mostra o valor nas duas unidades.' },
      { question: 'Posso converter uma data para timestamp?', answer: 'Sim. No bloco "Data -> Timestamp", escolha a data e, se quiser, a hora. A hora é lida no fuso do seu navegador, e o resultado vem em segundos e milissegundos.' },
      { question: 'A ferramenta mostra UTC e o horário local?', answer: 'Sim. Ela mostra a data em UTC (ISO 8601), a data no horário local do navegador e o nome do fuso horário usado.' },
      { question: 'Os valores que digito são enviados para algum servidor?', answer: 'Não. A conversão é feita no navegador e os valores não saem do seu aparelho.' },
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
  zh: {
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
};

export const getUnixTimestampContent = (locale: AppLocale): UnixTimestampLocaleContent =>
  contentByLocale[locale] ?? contentByLocale['pt-br'];

export const unixTimestampIntro = contentByLocale['pt-br'].intro;
export const unixTimestampContentBlocks = contentByLocale['pt-br'].contentBlocks;
export const unixTimestampFaq = contentByLocale['pt-br'].faq;
