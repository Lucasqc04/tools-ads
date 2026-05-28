import type { ContentBlock, FaqItem } from '@/types/content';
import type { AppLocale } from '@/lib/i18n/config';

// ---------- pt-br ----------

export const codeConverterIntro =
  'Converta código entre Pascal, C, Java e Pseudocódigo (Portugol) de forma educacional. Veja explicações de sintaxe, exemplos prontos e análise estrutural — tudo 100% local no navegador.';

export const codeConverterContentBlocks: ContentBlock[] = [
  {
    title: 'Conversor educacional de código entre linguagens',
    paragraphs: [
      'Esta ferramenta converte código-fonte entre Pascal, C, Java e Pseudocódigo (estilo VisualG/Portugol). O objetivo é educacional: ajudar estudantes e professores a entender como as mesmas estruturas lógicas são escritas em linguagens diferentes.',
      'A conversão usa parsing AST local no navegador — nenhum código é enviado para servidor. Cole seu programa, escolha a linguagem de origem e destino, e veja o resultado com explicações de cada diferença sintática.',
    ],
  },
  {
    title: 'Linguagens suportadas e estruturas reconhecidas',
    paragraphs: [
      'O conversor reconhece as estruturas mais usadas em cursos de programação: variáveis, atribuição, if/else, while, for, repeat/do-while, funções, procedimentos, leitura e escrita, switch/case e expressões aritméticas.',
      'Cada linguagem tem suas particularidades de sintaxe que são mapeadas automaticamente durante a conversão.',
    ],
    list: [
      'Pascal: program, var, begin/end, writeln, readln, :=, function/procedure.',
      'C: #include, main(), printf, scanf, {}, operadores ++/--.',
      'Java: class, public static void main, System.out.println, Scanner.',
      'Pseudocódigo: algoritmo, inicio/fim, leia, escreval, <- atribuição.',
    ],
  },
  {
    title: 'Exemplos prontos para aprendizado',
    paragraphs: [
      'A ferramenta inclui exemplos clássicos de programação como soma de dois números, par/ímpar, fatorial, Fibonacci, Bubble Sort e funções. Cada exemplo está disponível nas 4 linguagens para comparação direta.',
      'Carregue um exemplo, converta para outra linguagem e compare as diferenças estruturais. Isso ajuda a fixar padrões e entender a lógica por trás de cada sintaxe.',
    ],
  },
  {
    title: 'Privacidade e processamento local',
    paragraphs: [
      'Todo o processamento acontece localmente no navegador. O código digitado não é enviado para nenhum servidor. Isso garante privacidade total e funciona offline após o carregamento da página.',
      'A ferramenta é gratuita, sem cadastro, sem login e sem limite de uso.',
    ],
  },
];

export const codeConverterFaq: FaqItem[] = [
  {
    question: 'Quais linguagens o conversor suporta?',
    answer:
      'Pascal, C, Java e Pseudocódigo (estilo VisualG/Portugol). Você pode converter entre qualquer par dessas linguagens.',
  },
  {
    question: 'A conversão é perfeita e posso compilar o resultado?',
    answer:
      'A conversão é educacional. Ela mapeia as estruturas principais corretamente, mas código complexo pode precisar de ajustes manuais antes de compilar.',
  },
  {
    question: 'Meu código é enviado para algum servidor?',
    answer:
      'Não. Todo o processamento é local no navegador. Nenhum dado é transmitido.',
  },
  {
    question: 'Posso usar para trabalhos da faculdade?',
    answer:
      'Sim. A ferramenta é ideal para estudar como a mesma lógica é expressa em linguagens diferentes. Use como apoio para entender sintaxe, não como substituto de aprender a programar.',
  },
  {
    question: 'O conversor reconhece funções e procedimentos?',
    answer:
      'Sim. Funções, procedimentos, parâmetros e variáveis locais são reconhecidos e convertidos entre as linguagens.',
  },
  {
    question: 'Existe limite de tamanho do código?',
    answer:
      'Não há limite técnico na interface. Para programas muito grandes, o parsing pode demorar um pouco mais dependendo do dispositivo.',
  },
];

// ---------- English ----------

const codeConverterIntroEn =
  'Convert code between Pascal, C, Java and Pseudocode educationally. See syntax explanations, ready examples and structural analysis — all 100% local in the browser.';

const codeConverterContentBlocksEn: ContentBlock[] = [
  {
    title: 'Educational code converter between languages',
    paragraphs: [
      'This tool converts source code between Pascal, C, Java and Pseudocode (VisualG/Portugol style). The goal is educational: helping students and teachers understand how the same logical structures are written in different languages.',
      'The conversion uses local AST parsing in the browser — no code is sent to any server. Paste your program, choose source and target language, and see the result with explanations of each syntactic difference.',
    ],
  },
  {
    title: 'Supported languages and recognized structures',
    paragraphs: [
      'The converter recognizes the most common structures used in programming courses: variables, assignment, if/else, while, for, repeat/do-while, functions, procedures, read/write, switch/case and arithmetic expressions.',
    ],
    list: [
      'Pascal: program, var, begin/end, writeln, readln, :=, function/procedure.',
      'C: #include, main(), printf, scanf, {}, ++/-- operators.',
      'Java: class, public static void main, System.out.println, Scanner.',
      'Pseudocode: algoritmo, inicio/fim, leia, escreval, <- assignment.',
    ],
  },
  {
    title: 'Privacy and local processing',
    paragraphs: [
      'All processing happens locally in the browser. The code you type is not sent to any server. This ensures total privacy and works offline after page load.',
    ],
  },
];

const codeConverterFaqEn: FaqItem[] = [
  {
    question: 'Which languages does the converter support?',
    answer: 'Pascal, C, Java and Pseudocode (VisualG/Portugol style). You can convert between any pair of these languages.',
  },
  {
    question: 'Is the conversion perfect and can I compile the result?',
    answer: 'The conversion is educational. It maps the main structures correctly, but complex code may need manual adjustments before compiling.',
  },
  {
    question: 'Is my code sent to any server?',
    answer: 'No. All processing is local in the browser. No data is transmitted.',
  },
  {
    question: 'Does the converter recognize functions and procedures?',
    answer: 'Yes. Functions, procedures, parameters and local variables are recognized and converted between languages.',
  },
];

// ---------- Spanish ----------

const codeConverterIntroEs =
  'Convierta código entre Pascal, C, Java y Pseudocódigo de forma educacional. Vea explicaciones de sintaxis, ejemplos listos y análisis estructural — todo 100% local en el navegador.';

const codeConverterContentBlocksEs: ContentBlock[] = [
  {
    title: 'Conversor educacional de código entre lenguajes',
    paragraphs: [
      'Esta herramienta convierte código fuente entre Pascal, C, Java y Pseudocódigo (estilo VisualG/Portugol). El objetivo es educacional: ayudar a estudiantes y profesores a entender cómo las mismas estructuras lógicas se escriben en diferentes lenguajes.',
      'La conversión usa parsing AST local en el navegador — ningún código se envía al servidor. Pegue su programa, elija el lenguaje de origen y destino, y vea el resultado con explicaciones de cada diferencia sintáctica.',
    ],
  },
  {
    title: 'Lenguajes soportados y estructuras reconocidas',
    paragraphs: [
      'El conversor reconoce las estructuras más usadas en cursos de programación: variables, asignación, if/else, while, for, repeat/do-while, funciones, procedimientos, lectura y escritura, switch/case y expresiones aritméticas.',
    ],
    list: [
      'Pascal: program, var, begin/end, writeln, readln, :=, function/procedure.',
      'C: #include, main(), printf, scanf, {}, operadores ++/--.',
      'Java: class, public static void main, System.out.println, Scanner.',
      'Pseudocódigo: algoritmo, inicio/fim, leia, escreval, <- asignación.',
    ],
  },
  {
    title: 'Privacidad y procesamiento local',
    paragraphs: [
      'Todo el procesamiento ocurre localmente en el navegador. El código digitado no se envía a ningún servidor.',
    ],
  },
];

const codeConverterFaqEs: FaqItem[] = [
  {
    question: '¿Qué lenguajes soporta el conversor?',
    answer: 'Pascal, C, Java y Pseudocódigo (estilo VisualG/Portugol). Puede convertir entre cualquier par de estos lenguajes.',
  },
  {
    question: '¿La conversión es perfecta y puedo compilar el resultado?',
    answer: 'La conversión es educacional. Mapea las estructuras principales correctamente, pero código complejo puede necesitar ajustes manuales antes de compilar.',
  },
  {
    question: '¿Mi código se envía a algún servidor?',
    answer: 'No. Todo el procesamiento es local en el navegador. Ningún dato se transmite.',
  },
  {
    question: '¿El conversor reconoce funciones y procedimientos?',
    answer: 'Sí. Funciones, procedimientos, parámetros y variables locales son reconocidos y convertidos entre lenguajes.',
  },
];

// ---------- Getter ----------

export function getCodeConverterContent(locale: AppLocale) {
  if (locale === 'en') {
    return {
      name: 'Educational Code Converter',
      shortDescription: 'Convert code between Pascal, C, Java and Pseudocode with syntax explanations.',
      seoTitle: 'Educational Code Converter | Pascal, C, Java & Pseudocode',
      seoDescription: codeConverterIntroEn,
      h1: 'Educational Code Converter — Pascal, C, Java & Pseudocode',
      intro: codeConverterIntroEn,
      faq: codeConverterFaqEn,
      contentBlocks: codeConverterContentBlocksEn,
      primaryKeyword: 'code converter pascal c java pseudocode',
      secondaryKeywords: ['pascal to c converter', 'pseudocode to java', 'educational code converter'],
      searchIntent: 'Students and teachers who need to convert code between Pascal, C, Java and Pseudocode for educational purposes.',
    };
  }

  if (locale === 'es') {
    return {
      name: 'Conversor Educacional de Código',
      shortDescription: 'Convierta código entre Pascal, C, Java y Pseudocódigo con explicaciones de sintaxis.',
      seoTitle: 'Conversor Educacional de Código | Pascal, C, Java y Pseudocódigo',
      seoDescription: codeConverterIntroEs,
      h1: 'Conversor Educacional de Código — Pascal, C, Java y Pseudocódigo',
      intro: codeConverterIntroEs,
      faq: codeConverterFaqEs,
      contentBlocks: codeConverterContentBlocksEs,
      primaryKeyword: 'conversor de código pascal c java pseudocódigo',
      secondaryKeywords: ['pascal a c conversor', 'pseudocódigo a java', 'conversor educacional de código'],
      searchIntent: 'Estudiantes y profesores que necesitan convertir código entre Pascal, C, Java y Pseudocódigo con fines educacionales.',
    };
  }

  return {
    name: 'Conversor Educacional de Código',
    shortDescription: 'Converta código entre Pascal, C, Java e Pseudocódigo com explicações de sintaxe.',
    seoTitle: 'Conversor de Código Educacional | Pascal, C, Java e Pseudocódigo',
    seoDescription: codeConverterIntro,
    h1: 'Conversor Educacional de Código — Pascal, C, Java e Pseudocódigo',
    intro: codeConverterIntro,
    faq: codeConverterFaq,
    contentBlocks: codeConverterContentBlocks,
    primaryKeyword: 'conversor de código pascal c java pseudocódigo online',
    secondaryKeywords: [
      'converter pascal para c',
      'pseudocódigo para java',
      'conversor educacional de código',
      'pascal para java online',
      'conversor de pseudocódigo',
    ],
    searchIntent: 'Estudantes e professores que precisam converter código entre Pascal, C, Java e Pseudocódigo para fins educacionais.',
  };
}
