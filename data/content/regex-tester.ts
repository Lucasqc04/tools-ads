import type { AppLocale } from '@/lib/i18n/config';
import type { ContentBlock, FaqItem } from '@/types/content';

export type RegexTesterLocaleContent = {
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

const contentByLocale: Record<AppLocale, RegexTesterLocaleContent> = {
  'pt-br': {
    name: 'Regex Tester Online',
    shortDescription: 'Teste expressoes regulares com destaque de matches, grupos capturados, substituicao e feedback de erro.',
    primaryKeyword: 'regex tester online',
    secondaryKeywords: ['testar regex', 'regex javascript online', 'regex replace tester', 'captura de grupos regex', 'validar expressao regular'],
    searchIntent: 'Devs e estudantes que querem validar regex, encontrar padroes em texto e simular replace rapidamente.',
    seoTitle: 'Regex Tester Online | Testar Expressao Regular e Replace',
    seoDescription: 'Crie e teste regex online com flags, matches destacados, grupos capturados, posicoes e preview de substituicao.',
    h1: 'Regex Tester Online com Matches e Substituicao',
    intro: 'Escreva sua expressao regular, cole um texto de teste e veja resultados em tempo real com destaque visual e mensagens claras.',
    contentBlocks: [
      {
        title: 'Teste regex em tempo real com clareza',
        paragraphs: [
          'Regex e poderosa para encontrar e validar padroes em texto. Nesta pagina voce testa expressoes com flags comuns e enxerga exatamente onde cada match acontece.',
          'A lista de resultados mostra inicio, fim e grupos capturados para facilitar depuracao de formularios, logs, payloads e automacoes.',
        ],
      },
      {
        title: 'Substituicao e exemplos prontos',
        paragraphs: [
          'Alem de encontrar padroes, voce pode testar substituicao com replacement e comparar o texto antes e depois.',
          'Incluimos exemplos prontos para e-mail, URL, telefone, CPF, hashtags, mencoes, datas, numeros e remocao de espacos duplicados.',
        ],
      },
      {
        title: 'Limitacoes importantes',
        paragraphs: [
          'O motor utilizado segue regex do JavaScript. Alguns recursos podem diferir de engines de outras linguagens, como Python, Java ou PCRE.',
          'Para manter performance e legibilidade, evite expressoes excessivamente complexas em textos muito longos.',
        ],
      },
    ],
    faq: [
      { question: 'Quais flags posso usar?', answer: 'Voce pode testar flags comuns como g, i, m, s, u e y.' },
      { question: 'Consigo ver grupos capturados?', answer: 'Sim. Cada match pode listar os grupos de captura encontrados.' },
      { question: 'A ferramenta mostra erros de regex invalida?', answer: 'Sim. Quando a expressao e invalida, mostramos erro amigavel.' },
      { question: 'Os dados sao processados localmente?', answer: 'Sim. O teste ocorre no navegador, sem backend obrigatorio.' },
    ],
  },
  en: {
    name: 'Regex Tester Online',
    shortDescription: 'Test regex patterns with highlighted matches, capture groups, replacement preview, and clear error feedback.',
    primaryKeyword: 'regex tester online',
    secondaryKeywords: ['test regex online', 'javascript regex tester', 'regex replace preview', 'regex capture groups', 'validate regex pattern'],
    searchIntent: 'Developers and students validating regex patterns against sample text and replacement output.',
    seoTitle: 'Regex Tester Online | Matches, Groups, and Replace Preview',
    seoDescription: 'Test JavaScript regex with flags, highlighted matches, captured groups, start/end positions, and replace preview.',
    h1: 'Regex Tester Online for Pattern Validation',
    intro: 'Write a regex pattern, paste sample text, and inspect matches instantly with detailed output.',
    contentBlocks: [
      {
        title: 'Fast regex debugging',
        paragraphs: [
          'Regular expressions help validate and extract data quickly. This tool highlights each match and shows exact indexes for easier debugging.',
          'It is useful for form validation, logs, text cleanup, and API payload checks.',
        ],
      },
      {
        title: 'Replacement mode and practical examples',
        paragraphs: [
          'Use replacement mode to preview transformed output without editing your source text manually.',
          'Ready-made patterns cover email, URL, phone, CPF, numbers, hashtags, mentions, dates, and duplicated spaces.',
        ],
      },
      {
        title: 'Engine compatibility note',
        paragraphs: [
          'This page uses JavaScript regex behavior. Some advanced syntax differs from Python, Java, or PCRE engines.',
          'Keep patterns as simple as possible for readability and performance in large texts.',
        ],
      },
    ],
    faq: [
      { question: 'Which flags are available?', answer: 'Common flags include g, i, m, s, u, and y.' },
      { question: 'Can I inspect capture groups?', answer: 'Yes. Each match includes captured groups when present.' },
      { question: 'Do I get invalid regex errors?', answer: 'Yes. Invalid patterns return a friendly error message.' },
      { question: 'Is processing local?', answer: 'Yes. Testing happens in your browser.' },
    ],
  },
  es: {
    name: 'Regex Tester Online',
    shortDescription: 'Prueba expresiones regulares con matches resaltados, grupos capturados, reemplazo y errores claros.',
    primaryKeyword: 'regex tester online',
    secondaryKeywords: ['probar regex', 'regex javascript online', 'regex replace', 'grupos regex', 'validar expresion regular'],
    searchIntent: 'Usuarios tecnicos que necesitan validar patrones regex con texto real y ver resultados inmediatos.',
    seoTitle: 'Regex Tester Online | Matches, Grupos y Reemplazo',
    seoDescription: 'Prueba regex en linea con flags, resaltado de coincidencias, grupos capturados y preview de reemplazo.',
    h1: 'Regex Tester Online para Probar Patrones',
    intro: 'Escribe tu regex, pega texto y revisa coincidencias en tiempo real con salida detallada.',
    contentBlocks: [
      {
        title: 'Pruebas regex mas claras',
        paragraphs: [
          'Regex es util para encontrar, validar y transformar texto. Esta herramienta destaca cada match y su posicion exacta.',
          'Es ideal para formularios, logs, limpieza de texto y pruebas de integracion.',
        ],
      },
      {
        title: 'Modo reemplazo y biblioteca de ejemplos',
        paragraphs: [
          'Puedes probar find and replace con preview inmediato para entender el resultado final.',
          'Incluimos ejemplos de email, URL, telefono, CPF, numeros, hashtags, menciones, fechas y espacios duplicados.',
        ],
      },
      {
        title: 'Diferencias entre motores regex',
        paragraphs: [
          'El comportamiento de esta pagina sigue regex de JavaScript. Algunas sintaxis pueden cambiar en otros lenguajes.',
          'Evita patrones demasiado complejos para mantener rendimiento y mantenimiento.',
        ],
      },
    ],
    faq: [
      { question: 'Que flags puedo usar?', answer: 'Puedes usar g, i, m, s, u y y.' },
      { question: 'Muestra grupos capturados?', answer: 'Si. Cada coincidencia puede incluir sus grupos.' },
      { question: 'Muestra errores de regex invalida?', answer: 'Si. Recibes un mensaje amigable.' },
      { question: 'Se procesa localmente?', answer: 'Si. Todo corre en el navegador.' },
    ],
  },
};

export const getRegexTesterContent = (locale: AppLocale): RegexTesterLocaleContent =>
  contentByLocale[locale] ?? contentByLocale['pt-br'];

export const regexTesterIntro = contentByLocale['pt-br'].intro;
export const regexTesterContentBlocks = contentByLocale['pt-br'].contentBlocks;
export const regexTesterFaq = contentByLocale['pt-br'].faq;
