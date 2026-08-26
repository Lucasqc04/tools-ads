import { localizePath, type AppLocale } from '@/lib/i18n/config';
import { MAX_TABLE_NUMBER } from '@/lib/multiplication-table-quiz';
import type { ContentBlock, FaqItem } from '@/types/content';

export type MultiplicationTablePage = {
  tableNumber: number;
  featured: boolean;
  slugPtBr: string;
  slugEn: string;
  slugEs: string;
};

export type MultiplicationTableResolution = {
  page: MultiplicationTablePage;
  sourceLocale: AppLocale;
};

export type LocalizedMultiplicationTableContent = {
  title: string;
  intro: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  contentBlocks: ContentBlock[];
  faq: FaqItem[];
};

export type MultiplicationTableLinkItem = {
  slug: string;
  path: string;
  name: string;
  description: string;
};

const FEATURED_TABLE_NUMBERS = new Set([2, 3, 5, 7, 9]);

const toPtBrSlug = (n: number): string => `tabuada-do-${n}`;
const toEnSlug = (n: number): string => `times-table-${n}`;
const toEsSlug = (n: number): string => `tabla-del-${n}`;

const buildPage = (tableNumber: number): MultiplicationTablePage => ({
  tableNumber,
  featured: FEATURED_TABLE_NUMBERS.has(tableNumber),
  slugPtBr: toPtBrSlug(tableNumber),
  slugEn: toEnSlug(tableNumber),
  slugEs: toEsSlug(tableNumber),
});

export const multiplicationTablePages: MultiplicationTablePage[] = Array.from(
  { length: MAX_TABLE_NUMBER },
  (_, index) => buildPage(index + 1),
);

const pageMaps: Record<AppLocale, Map<string, MultiplicationTablePage>> = {
  'pt-br': new Map(multiplicationTablePages.map((page) => [page.slugPtBr, page])),
  en: new Map(multiplicationTablePages.map((page) => [page.slugEn, page])),
  es: new Map(multiplicationTablePages.map((page) => [page.slugEs, page])),
};

export const getMultiplicationTableResolutionBySlug = (
  slug: string,
): MultiplicationTableResolution | undefined => {
  for (const sourceLocale of ['pt-br', 'en', 'es'] as const) {
    const page = pageMaps[sourceLocale].get(slug);
    if (page) {
      return { page, sourceLocale };
    }
  }

  return undefined;
};

export const getMultiplicationTableSlugByLocale = (
  page: MultiplicationTablePage,
  locale: AppLocale,
): string => {
  if (locale === 'en') {
    return page.slugEn;
  }

  if (locale === 'es') {
    return page.slugEs;
  }

  return page.slugPtBr;
};

export const getMultiplicationTablePathByLocale = (
  page: MultiplicationTablePage,
  locale: AppLocale,
): string => localizePath(locale, `/${getMultiplicationTableSlugByLocale(page, locale)}`);

export const getMultiplicationTableLocalePathMap = (
  page: MultiplicationTablePage,
): Record<AppLocale, string> => ({
  'pt-br': getMultiplicationTablePathByLocale(page, 'pt-br'),
  en: getMultiplicationTablePathByLocale(page, 'en'),
  es: getMultiplicationTablePathByLocale(page, 'es'),
});

const buildKeywords = (locale: AppLocale, n: number): string[] => {
  if (locale === 'en') {
    return [
      `times table ${n}`,
      `${n} times table`,
      `multiplication table ${n}`,
      `${n} times table quiz`,
      'multiplication table quiz',
    ];
  }

  if (locale === 'es') {
    return [
      `tabla del ${n}`,
      `tabla de multiplicar del ${n}`,
      `tabla del ${n} para imprimir`,
      `quiz tabla del ${n}`,
      'tabla de multiplicar con quiz',
    ];
  }

  return [
    `tabuada do ${n}`,
    `tabuada de multiplicar do ${n}`,
    `tabuada do ${n} para imprimir`,
    `quiz tabuada do ${n}`,
    'tabuada com quiz',
  ];
};

const buildContentBlocks = (locale: AppLocale, n: number): ContentBlock[] => {
  if (locale === 'en') {
    return [
      {
        title: `The times table of ${n}, from 1x to 12x`,
        paragraphs: [
          `This page opens the multiplication tool with the times table of ${n} already selected, showing every result from ${n} x 1 to ${n} x 12. Switch to quiz mode to practice this table specifically, with the second number drawn from your chosen difficulty range.`,
          'You can also print a blank worksheet of this table to practice away from the screen, or on paper alongside a class or homework assignment.',
        ],
      },
      {
        title: `Tips for memorizing the ${n} times table`,
        paragraphs: [
          `Some rows are easier to spot patterns in than others — look for how the result changes by ${n} each time you move to the next row, and use a row you already know (like ${n} x 5 or ${n} x 10) as an anchor to work out nearby ones.`,
        ],
        list: [
          `Start the quiz on easy difficulty to get comfortable with ${n} x 1 through ${n} x 5.`,
          'Repeat the round a few times in the same session for repetition.',
          'Check the most-frequent-mistakes list after each round.',
          'Print the worksheet for offline practice.',
        ],
      },
      {
        title: 'Timed practice and saved best score',
        paragraphs: [
          `Answering ${n}x questions against the clock helps build both accuracy and recall speed. Your best score for this table and difficulty is saved locally in your browser, so you can track improvement across visits.`,
        ],
      },
      {
        title: 'Local and private',
        paragraphs: [
          'The quiz, timer, and saved scores all run locally in your browser. No answer or score is sent to a server.',
        ],
      },
    ];
  }

  if (locale === 'es') {
    return [
      {
        title: `La tabla del ${n}, del 1x al 12x`,
        paragraphs: [
          `Esta página abre la herramienta de multiplicación con la tabla del ${n} ya seleccionada, mostrando cada resultado de ${n} x 1 a ${n} x 12. Cambia al modo quiz para practicar específicamente esta tabla, con el segundo número sorteado según la dificultad elegida.`,
          'También puedes imprimir una hoja de ejercicios en blanco de esta tabla para practicar lejos de la pantalla, o en papel junto a una tarea escolar.',
        ],
      },
      {
        title: `Consejos para memorizar la tabla del ${n}`,
        paragraphs: [
          `Algunas filas son más fáciles de reconocer que otras: fíjate cómo el resultado aumenta de ${n} en ${n} cada vez que avanzas una fila, y usa una fila que ya sepas (como ${n} x 5 o ${n} x 10) como referencia para calcular las cercanas.`,
        ],
        list: [
          `Empieza el quiz en dificultad fácil para dominar de ${n} x 1 a ${n} x 5.`,
          'Repite la ronda varias veces en la misma sesión.',
          'Revisa la lista de errores más frecuentes después de cada ronda.',
          'Imprime la hoja de ejercicios para practicar sin pantalla.',
        ],
      },
      {
        title: 'Práctica cronometrada y récord guardado',
        paragraphs: [
          `Responder preguntas de la tabla del ${n} contra el reloj ayuda a mejorar precisión y velocidad. Tu mejor resultado para esta tabla y dificultad se guarda localmente en tu navegador, así puedes ver tu progreso entre visitas.`,
        ],
      },
      {
        title: 'Local y privado',
        paragraphs: [
          'El quiz, el cronómetro y los puntajes guardados funcionan completamente en tu navegador. Ninguna respuesta o puntaje se envía a un servidor.',
        ],
      },
    ];
  }

  return [
    {
      title: `A tabuada do ${n}, do 1x ao 12x`,
      paragraphs: [
        `Esta página abre a ferramenta de multiplicação com a tabuada do ${n} já selecionada, mostrando cada resultado de ${n} x 1 até ${n} x 12. Mude para o modo quiz para treinar especificamente essa tabuada, com o segundo número sorteado conforme a dificuldade escolhida.`,
        'Você também pode imprimir uma folha de exercícios em branco dessa tabuada para praticar longe da tela, ou no papel junto com uma tarefa escolar.',
      ],
    },
    {
      title: `Dicas para memorizar a tabuada do ${n}`,
      paragraphs: [
        `Algumas linhas são mais fáceis de reconhecer que outras: repare como o resultado aumenta de ${n} em ${n} a cada linha, e use uma linha que você já sabe (como ${n} x 5 ou ${n} x 10) como referência para calcular as próximas.`,
      ],
      list: [
        `Comece o quiz na dificuldade fácil para dominar de ${n} x 1 a ${n} x 5.`,
        'Repita a rodada algumas vezes na mesma sessão.',
        'Confira a lista de erros mais frequentes depois de cada rodada.',
        'Imprima a folha de exercícios para praticar sem tela.',
      ],
    },
    {
      title: 'Treino cronometrado e recorde salvo',
      paragraphs: [
        `Responder perguntas da tabuada do ${n} contra o relógio ajuda a melhorar precisão e velocidade de raciocínio. Seu melhor resultado para essa tabuada e dificuldade fica salvo localmente no seu navegador, para acompanhar sua evolução entre visitas.`,
      ],
    },
    {
      title: 'Local e privado',
      paragraphs: [
        'O quiz, o cronômetro e os recordes salvos funcionam inteiramente no seu navegador. Nenhuma resposta ou pontuação é enviada para um servidor.',
      ],
    },
  ];
};

const buildFaq = (locale: AppLocale, n: number): FaqItem[] => {
  if (locale === 'en') {
    return [
      {
        question: `What is the times table of ${n}?`,
        answer: `It's the sequence of results from multiplying ${n} by 1 through 12: ${n}, ${n * 2}, ${n * 3}, and so on up to ${n * 12}.`,
      },
      {
        question: `Can I practice only the ${n} times table in the quiz?`,
        answer: `Yes. This page pre-selects ${n} as the fixed number, so every quiz question multiplies ${n} by another number in your chosen difficulty range.`,
      },
      {
        question: 'Can I print this table as a worksheet?',
        answer: `Yes. Use the print button to generate a blank worksheet of the ${n} times table to fill in on paper.`,
      },
      {
        question: 'Is my progress saved?',
        answer: 'Yes. Your best score and most frequent mistakes are saved locally in your browser.',
      },
    ];
  }

  if (locale === 'es') {
    return [
      {
        question: `¿Cuál es la tabla del ${n}?`,
        answer: `Es la secuencia de resultados de multiplicar ${n} por 1 hasta 12: ${n}, ${n * 2}, ${n * 3}, y así hasta ${n * 12}.`,
      },
      {
        question: `¿Puedo practicar solo la tabla del ${n} en el quiz?`,
        answer: `Sí. Esta página preselecciona el ${n} como número fijo, así que cada pregunta del quiz multiplica ${n} por otro número dentro de la dificultad elegida.`,
      },
      {
        question: '¿Puedo imprimir esta tabla como hoja de ejercicios?',
        answer: `Sí. Usa el botón de imprimir para generar una hoja de ejercicios en blanco de la tabla del ${n}.`,
      },
      {
        question: '¿Se guarda mi progreso?',
        answer: 'Sí. Tu mejor puntaje y los errores más frecuentes se guardan localmente en tu navegador.',
      },
    ];
  }

  return [
    {
      question: `Qual é a tabuada do ${n}?`,
      answer: `É a sequência de resultados de multiplicar ${n} por 1 até 12: ${n}, ${n * 2}, ${n * 3}, e assim até ${n * 12}.`,
    },
    {
      question: `Posso treinar só a tabuada do ${n} no quiz?`,
      answer: `Sim. Esta página já seleciona o ${n} como número fixo, então cada pergunta do quiz multiplica ${n} por outro número dentro da dificuldade escolhida.`,
    },
    {
      question: 'Posso imprimir essa tabuada como folha de exercícios?',
      answer: `Sim. Use o botão de imprimir para gerar uma folha de exercícios em branco da tabuada do ${n}.`,
    },
    {
      question: 'Meu progresso fica salvo?',
      answer: 'Sim. Seu melhor resultado e os erros mais frequentes ficam salvos localmente no seu navegador.',
    },
  ];
};

const buildFallbackContent = (locale: AppLocale): LocalizedMultiplicationTableContent => {
  const fallback = {
    'pt-br': {
      title: 'Tabuada com Quiz',
      intro: 'Consulte a tabuada e treine multiplicação.',
      seoTitle: 'Tabuada com Quiz',
      seoDescription: 'Consulte a tabuada e treine com um quiz cronometrado.',
    },
    en: {
      title: 'Multiplication Table Quiz',
      intro: 'Look up the times table and practice multiplication.',
      seoTitle: 'Multiplication Table Quiz',
      seoDescription: 'Look up the times table and practice with a timed quiz.',
    },
    es: {
      title: 'Tabla de Multiplicar con Quiz',
      intro: 'Consulta la tabla de multiplicar y practica.',
      seoTitle: 'Tabla de Multiplicar con Quiz',
      seoDescription: 'Consulta la tabla de multiplicar y practica con un quiz.',
    },
  }[locale];

  return { ...fallback, keywords: [], contentBlocks: [], faq: [] };
};

export const getLocalizedMultiplicationTableContent = (
  page: MultiplicationTablePage,
  locale: AppLocale,
): LocalizedMultiplicationTableContent => {
  const n = page.tableNumber;
  if (!n) {
    return buildFallbackContent(locale);
  }

  const keywords = buildKeywords(locale, n);

  if (locale === 'en') {
    return {
      title: `Times Table of ${n} with Quiz`,
      intro: `See the full times table of ${n} from 1x to 12x, then practice it with a timed quiz and printable worksheet.`,
      seoTitle: `Times Table of ${n} | Chart, Quiz and Printable Worksheet`,
      seoDescription: `Look up the times table of ${n} and practice with a timed quiz. See your best score, most frequent mistakes, and print a worksheet.`,
      keywords,
      contentBlocks: buildContentBlocks(locale, n),
      faq: buildFaq(locale, n),
    };
  }

  if (locale === 'es') {
    return {
      title: `Tabla del ${n} con Quiz`,
      intro: `Mira la tabla completa del ${n} del 1x al 12x, y practícala con un quiz cronometrado y una hoja de ejercicios para imprimir.`,
      seoTitle: `Tabla del ${n} | Tabla, Quiz y Hoja de Ejercicios`,
      seoDescription: `Consulta la tabla del ${n} y practica con un quiz cronometrado. Mira tu récord, los errores más frecuentes e imprime una hoja de ejercicios.`,
      keywords,
      contentBlocks: buildContentBlocks(locale, n),
      faq: buildFaq(locale, n),
    };
  }

  return {
    title: `Tabuada do ${n} com Quiz`,
    intro: `Veja a tabuada completa do ${n} de 1x até 12x, e treine com um quiz cronometrado e folha de exercícios para imprimir.`,
    seoTitle: `Tabuada do ${n} | Tabela, Quiz e Folha de Exercícios`,
    seoDescription: `Consulte a tabuada do ${n} e treine com um quiz cronometrado. Veja seu recorde, os erros mais frequentes e imprima uma folha de exercícios.`,
    keywords,
    contentBlocks: buildContentBlocks(locale, n),
    faq: buildFaq(locale, n),
  };
};

export const toLocalizedMultiplicationTableLink = (
  page: MultiplicationTablePage,
  locale: AppLocale,
): MultiplicationTableLinkItem => ({
  slug: getMultiplicationTableSlugByLocale(page, locale),
  path: getMultiplicationTablePathByLocale(page, locale),
  name:
    locale === 'en'
      ? `Times table of ${page.tableNumber}`
      : locale === 'es'
        ? `Tabla del ${page.tableNumber}`
        : `Tabuada do ${page.tableNumber}`,
  description:
    locale === 'en'
      ? `Chart, quiz, and worksheet for the ${page.tableNumber} times table.`
      : locale === 'es'
        ? `Tabla, quiz y hoja de ejercicios de la tabla del ${page.tableNumber}.`
        : `Tabela, quiz e folha de exercícios da tabuada do ${page.tableNumber}.`,
});

export const getFeaturedMultiplicationTablePages = (limit = 6): MultiplicationTablePage[] =>
  multiplicationTablePages.filter((page) => page.featured).slice(0, limit);

export const getRelatedMultiplicationTablePages = (
  tableNumber: number,
  limit = 4,
): MultiplicationTablePage[] =>
  multiplicationTablePages
    .filter((page) => page.tableNumber !== tableNumber)
    .sort((a, b) => Number(b.featured) - Number(a.featured))
    .slice(0, limit);

export const getMultiplicationTableStaticParamsByLocale = (
  locale: AppLocale,
): Array<{ platformPageSlug: string }> =>
  multiplicationTablePages.map((page) => ({
    platformPageSlug: getMultiplicationTableSlugByLocale(page, locale),
  }));
