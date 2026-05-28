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
    name: 'Regex Studio: Testador, Gerador e Explicador',
    shortDescription: 'Teste, gere, explique, valide, extraia e substitua com regex. Biblioteca de padrões, construtor visual, diagnóstico e snippets em 7 linguagens.',
    primaryKeyword: 'regex tester online',
    secondaryKeywords: [
      'testar regex online',
      'gerador de regex',
      'explicador de regex',
      'regex javascript online',
      'validar email regex',
      'extrair dados regex',
      'regex cpf cnpj',
      'regex telefone brasileiro',
      'regex replace online',
      'construtor de regex visual',
      'regex para python java php',
      'testador de expressao regular',
    ],
    searchIntent: 'Devs e estudantes que querem testar, gerar, explicar, validar e extrair dados com expressoes regulares de forma visual e didatica.',
    seoTitle: 'Regex Studio Online | Testador, Gerador e Explicador de Regex',
    seoDescription: 'Teste, gere, explique e valide regex online. Biblioteca de padrões, construtor visual, extração de dados, substituição, diagnóstico e código para JS, Python, PHP, Java, C# e Go.',
    h1: 'Regex Studio: Testador, Gerador e Explicador de Expressões Regulares',
    intro: 'Ferramenta completa para regex: teste padrões com destaque visual, gere regex a partir de categorias, explique token a token, valide formatos, extraia dados de texto, substitua com presets e gere código para 7 linguagens — tudo 100% local no navegador usando o motor JavaScript.',
    contentBlocks: [
      {
        title: 'Testador de regex com resultados detalhados',
        paragraphs: [
          'O testador mostra matches com cores alternadas, posição (linha e coluna), grupos capturados e tempo de execução. Você pode exportar resultados em JSON, CSV ou TXT.',
          'O campo de replacement permite testar substituições com preview antes/depois e contagem de ocorrências.',
        ],
      },
      {
        title: 'Gerador de regex por categoria',
        paragraphs: [
          'Escolha o que quer encontrar (e-mail, CPF, CNPJ, telefone, URL, UUID, data, etc.) e configure opções específicas. A regex é gerada automaticamente com explicação e texto de teste.',
          'Cada gerador avisa sobre limitações. Por exemplo: regex de CPF valida formato, mas não verifica dígito verificador.',
        ],
      },
      {
        title: 'Construtor visual e explicador',
        paragraphs: [
          'O construtor visual permite montar regex clicando em blocos: caracteres, âncoras, quantificadores, grupos, conjuntos, lookaround e escape.',
          'O explicador analisa a regex token a token em linguagem simples, facilitando o aprendizado e a depuração de padrões complexos.',
        ],
      },
      {
        title: 'Biblioteca de padrões prontos',
        paragraphs: [
          'Mais de 30 padrões organizados em categorias: Brasil (CPF, CNPJ, CEP, telefone, placa), Web (e-mail, URL, domínio, slug), Dev (UUID, IP, hex color, JSON key), Texto (hashtag, menção, espaços), Datas, Números e Segurança.',
          'Cada padrão inclui explicação, texto de teste, limitações e botão para usar diretamente no testador.',
        ],
      },
      {
        title: 'Validação, extração e substituição',
        paragraphs: [
          'O modo validação verifica se uma entrada corresponde a um formato esperado (e-mail, CPF, URL, senha, etc.).',
          'O modo extração encontra todos os itens de um tipo em textos grandes, com opção de remover duplicados, ordenar e exportar.',
          'Os presets de substituição incluem remover espaços duplicados, tags HTML, emojis, mascarar dados e normalizar texto.',
        ],
      },
      {
        title: 'Snippets de código e diagnóstico',
        paragraphs: [
          'Gere código pronto para usar a regex em JavaScript, TypeScript, Python, PHP, Java, C# e Go, nos modos test, extract e replace.',
          'O diagnóstico analisa a regex e mostra checklist: âncoras, grupos, quantificadores, possíveis problemas de performance e sugestões de melhoria.',
        ],
      },
      {
        title: 'Privacidade e motor JavaScript',
        paragraphs: [
          'Todo processamento é local no navegador. Nenhum código ou texto é enviado para servidor.',
          'O motor utilizado é o de regex do JavaScript (ECMAScript). Algumas funcionalidades como lookbehind podem não funcionar em navegadores antigos. Para uso em outras linguagens, verifique a compatibilidade.',
        ],
      },
    ],
    faq: [
      { question: 'O que é regex?', answer: 'Regex (expressão regular) é um padrão de busca usado para encontrar, validar e substituir texto. É amplamente usado em programação, editores de texto e ferramentas de busca.' },
      { question: 'Essa ferramenta usa qual motor de regex?', answer: 'Usa o motor de regex nativo do JavaScript (ECMAScript) do seu navegador. O comportamento pode diferir de Python, Java ou PCRE em recursos avançados.' },
      { question: 'Posso gerar regex automaticamente?', answer: 'Sim. Na aba Gerar, escolha a categoria (e-mail, CPF, telefone, etc.) e configure opções. A regex é gerada com explicação e exemplo.' },
      { question: 'A regex funciona em Python, Java e PHP?', answer: 'A maioria dos padrões básicos funciona. A aba Código gera snippets adaptados para cada linguagem, mas sempre revise: operadores como lookbehind podem não estar disponíveis em todos os motores.' },
      { question: 'Como validar uma string inteira?', answer: 'Use as âncoras ^ (início) e $ (fim). Exemplo: ^\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}$ para CPF completo.' },
      { question: 'Como extrair vários resultados?', answer: 'Na aba Extrair, cole o texto e escolha o tipo (e-mails, links, telefones, etc.). Os resultados podem ser exportados em JSON, CSV ou TXT.' },
      { question: 'Como substituir texto usando regex?', answer: 'Na aba Substituir, escolha um preset (remover espaços, mascarar dados, etc.) ou use o campo replacement no testador para substituição personalizada.' },
      { question: 'Meus dados são enviados para o servidor?', answer: 'Não. Todo processamento é 100% local no navegador. Nenhum texto ou regex é transmitido.' },
    ],
  },
  en: {
    name: 'Regex Studio: Tester, Generator & Explainer',
    shortDescription: 'Test, generate, explain, validate, extract and replace with regex. Pattern library, visual builder, diagnostics and code snippets in 7 languages.',
    primaryKeyword: 'regex tester online',
    secondaryKeywords: [
      'test regex online',
      'regex generator',
      'regex explainer',
      'javascript regex tester',
      'regex replace preview',
      'regex capture groups',
      'validate regex pattern',
      'extract data regex',
      'regex code generator',
      'visual regex builder',
    ],
    searchIntent: 'Developers and students who want to test, generate, explain, validate and extract data using regex in a visual and educational way.',
    seoTitle: 'Regex Studio Online | Tester, Generator & Explainer',
    seoDescription: 'Test, generate, explain and validate regex online. Pattern library, visual builder, data extraction, replacement presets, diagnostics and code for JS, Python, PHP, Java, C# and Go.',
    h1: 'Regex Studio: Tester, Generator & Explainer for Regular Expressions',
    intro: 'Complete regex tool: test patterns with visual highlighting, generate regex from categories, explain token by token, validate formats, extract data, replace with presets, and generate code for 7 languages — all 100% local in the browser using the JavaScript engine.',
    contentBlocks: [
      {
        title: 'Regex tester with detailed results',
        paragraphs: [
          'The tester shows matches with alternating colors, position (line and column), captured groups and execution time. You can export results as JSON, CSV or TXT.',
          'The replacement field lets you test substitutions with a before/after preview and occurrence count.',
        ],
      },
      {
        title: 'Regex generator by category',
        paragraphs: [
          'Choose what you want to find (email, phone, date, URL, UUID, etc.) and configure specific options. The regex is generated automatically with explanation and test text.',
        ],
      },
      {
        title: 'Visual builder and explainer',
        paragraphs: [
          'The visual builder lets you compose regex by clicking blocks: characters, anchors, quantifiers, groups, sets, lookaround and escape.',
          'The explainer analyzes the regex token by token in plain language, making it easier to learn and debug complex patterns.',
        ],
      },
      {
        title: 'Pattern library, validation, extraction and replacement',
        paragraphs: [
          'Over 30 ready patterns organized by category. Validation mode checks format compliance. Extraction mode finds all items in large texts. Replacement presets include removing spaces, HTML, emojis, masking data and normalization.',
        ],
      },
      {
        title: 'Code snippets and diagnostics',
        paragraphs: [
          'Generate ready-to-use code in JavaScript, TypeScript, Python, PHP, Java, C# and Go for test, extract and replace modes.',
          'Diagnostics shows a checklist and suggestions to improve your regex.',
        ],
      },
      {
        title: 'Privacy and JavaScript engine',
        paragraphs: [
          'All processing is local in the browser. No text or regex is sent to any server.',
          'This tool uses the JavaScript (ECMAScript) regex engine. Some features like lookbehind may not work in older browsers.',
        ],
      },
    ],
    faq: [
      { question: 'What is regex?', answer: 'Regex (regular expression) is a search pattern used to find, validate and replace text. Widely used in programming, text editors and search tools.' },
      { question: 'Which regex engine does this tool use?', answer: 'It uses the native JavaScript (ECMAScript) regex engine of your browser.' },
      { question: 'Can I generate regex automatically?', answer: 'Yes. In the Generate tab, choose a category and configure options. The regex is generated with explanation and test text.' },
      { question: 'Does the regex work in Python, Java and PHP?', answer: 'Most basic patterns work across engines. The Code tab generates adapted snippets, but always review for engine-specific differences.' },
      { question: 'How do I validate an entire string?', answer: 'Use ^ (start) and $ (end) anchors around your pattern.' },
      { question: 'How do I extract multiple results?', answer: 'In the Extract tab, paste text and choose the type. Results can be exported as JSON, CSV or TXT.' },
      { question: 'Is my data sent to any server?', answer: 'No. All processing is 100% local in the browser.' },
    ],
  },
  es: {
    name: 'Regex Studio: Probador, Generador y Explicador',
    shortDescription: 'Pruebe, genere, explique, valide, extraiga y sustituya con regex. Biblioteca de patrones, constructor visual, diagnóstico y snippets en 7 lenguajes.',
    primaryKeyword: 'regex tester online',
    secondaryKeywords: [
      'probar regex online',
      'generador de regex',
      'explicador de regex',
      'regex javascript online',
      'validar email regex',
      'extraer datos regex',
      'regex cpf cnpj',
      'regex telefono brasil',
      'regex replace online',
    ],
    searchIntent: 'Desarrolladores y estudiantes que necesitan probar, generar, explicar y extraer datos con regex de forma visual.',
    seoTitle: 'Regex Studio Online | Probador, Generador y Explicador de Regex',
    seoDescription: 'Pruebe, genere, explique y valide regex online. Biblioteca de patrones, constructor visual, extracción, sustitución, diagnóstico y código para JS, Python, PHP, Java, C# y Go.',
    h1: 'Regex Studio: Probador, Generador y Explicador de Expresiones Regulares',
    intro: 'Herramienta completa de regex: pruebe patrones con resaltado visual, genere regex desde categorías, explique token a token, valide formatos, extraiga datos, sustituya con presets y genere código para 7 lenguajes — todo 100% local en el navegador.',
    contentBlocks: [
      {
        title: 'Probador de regex con resultados detallados',
        paragraphs: [
          'El probador muestra coincidencias con colores alternados, posición (línea y columna), grupos capturados y tiempo de ejecución.',
          'El campo de reemplazo permite probar sustituciones con preview antes/después.',
        ],
      },
      {
        title: 'Generador de regex por categoría',
        paragraphs: [
          'Elija qué quiere encontrar (email, teléfono, fecha, URL, UUID, etc.) y configure opciones. La regex se genera automáticamente con explicación.',
        ],
      },
      {
        title: 'Constructor visual y explicador',
        paragraphs: [
          'Monte regex haciendo clic en bloques. El explicador analiza la regex token a token en lenguaje simple.',
        ],
      },
      {
        title: 'Biblioteca, validación, extracción y sustitución',
        paragraphs: [
          'Más de 30 patrones organizados por categoría. Validación, extracción con exportación y presets de sustitución.',
        ],
      },
      {
        title: 'Privacidad y motor JavaScript',
        paragraphs: [
          'Todo el procesamiento es local en el navegador. Ningún dato se envía al servidor.',
        ],
      },
    ],
    faq: [
      { question: '¿Qué es regex?', answer: 'Regex (expresión regular) es un patrón de búsqueda para encontrar, validar y reemplazar texto.' },
      { question: '¿Qué motor de regex usa esta herramienta?', answer: 'Usa el motor nativo de regex JavaScript (ECMAScript) del navegador.' },
      { question: '¿Puedo generar regex automáticamente?', answer: 'Sí. En la pestaña Generar, elija categoría y opciones.' },
      { question: '¿La regex funciona en Python, Java y PHP?', answer: 'La mayoría de patrones básicos funcionan. La pestaña Código genera snippets adaptados.' },
      { question: '¿Mis datos se envían a algún servidor?', answer: 'No. Todo es 100% local en el navegador.' },
    ],
  },
};

export const getRegexTesterContent = (locale: AppLocale): RegexTesterLocaleContent =>
  contentByLocale[locale] ?? contentByLocale['pt-br'];

export const regexTesterIntro = contentByLocale['pt-br'].intro;
export const regexTesterContentBlocks = contentByLocale['pt-br'].contentBlocks;
export const regexTesterFaq = contentByLocale['pt-br'].faq;
