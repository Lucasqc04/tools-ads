import type { AppLocale } from '@/lib/i18n/config';
import type { ContentBlock, FaqItem } from '@/types/content';

export type UniversalConverterLocaleContent = {
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

const contentByLocale: Record<AppLocale, UniversalConverterLocaleContent> = {
  'pt-br': {
    name: 'Conversor Universal de Texto, Codigos, Hashes, Cifras e Bases',
    shortDescription:
      'Central unica para converter texto, numero, codigo, hash e cifra com validacao, presets, lote, multiplos destinos e processamento local.',
    primaryKeyword: 'conversor universal de texto codigo hash cifras e bases',
    secondaryKeywords: [
      'conversor universal online',
      'texto para binario',
      'binario para texto',
      'texto para sha256',
      'texto para md5',
      'conversor de bases',
      'cifra de cesar',
      'texto para morse',
      'url encode decode',
    ],
    searchIntent:
      'Usuarios tecnicos e estudantes que querem converter formatos em uma central unica, com validacao clara e sem instalar software.',
    seoTitle: 'Conversor Universal de Texto, Codigo, Hash e Cifras Online',
    seoDescription:
      'Converta textos, numeros, hashes, cifras classicas e bases numericas em uma central unica, com busca interna, presets e processamento local.',
    h1: 'Conversor Universal de Texto, Codigo, Hash e Cifras',
    intro:
      'Cole qualquer texto, numero ou codigo, escolha origem e destino, e converta rapidamente entre representacoes tecnicas com feedback claro e botao de copiar.',
    contentBlocks: [
      {
        title: 'Uma central profissional de conversoes tecnicas',
        paragraphs: [
          'O Conversor Universal foi desenhado como um motor de conversao com matriz de combinacoes validas. Isso significa que a ferramenta evita promessas falsas de "tudo para tudo" e apenas habilita fluxos realmente possiveis.',
          'Voce pode converter texto para binario, hexadecimal, ASCII, Morse, hashes e outras representacoes, alem de trabalhar com bases numericas, cifras classicas e formatos comuns de programacao.',
        ],
      },
      {
        title: 'Diferenca entre conversao, codificacao, cifra e hash',
        paragraphs: [
          'Conversao muda representacao entre formatos equivalentes, como decimal para hexadecimal. Codificacao organiza dados para transporte, como URL encode e HTML entities. Cifras classicas transformam texto com regras historicas, como Cesar e Vigenere.',
          'Hash e diferente: algoritmos como SHA-256 e MD5 geram impressao digital unidirecional. Nao existe conversao reversa de hash para texto original, e a interface deixa isso explicito com avisos de irreversibilidade.',
        ],
      },
      {
        title: 'Presets, multiplos destinos e modo lote',
        paragraphs: [
          'Em vez de repetir operacoes manualmente, voce pode aplicar presets como "texto para todos os hashes" ou "numero para todas as bases". A ferramenta mostra blocos separados de resultado, cada um com copiar individual e mensagens de validacao.',
          'No modo lote, cada linha da entrada vira uma linha de saida. Isso acelera tarefas operacionais em dados de teste, logs, payloads e listas tecnicas.',
        ],
      },
      {
        title: 'Deteccao de entrada e pipeline em etapas',
        paragraphs: [
          'A central tenta identificar padroes como binario, hexadecimal, Morse, URL encoded e hash-like para sugerir conversoes sem alterar seu input automaticamente.',
          'Para fluxos avancados, o modo pipeline permite encadear etapas e ver resultados intermediarios. Exemplo: texto -> hexadecimal -> decode ou URL encoded -> texto -> slug.',
        ],
      },
      {
        title: 'Privacidade, limites e boas praticas',
        paragraphs: [
          'Sempre que o algoritmo permite, o processamento acontece localmente no navegador. Isso reduz dependencia de backend e aumenta confianca em tarefas de depuracao rapida.',
          'Algumas cifras desta ferramenta sao educativas e nao devem ser tratadas como seguranca moderna. Para fluxos especializados, voce tambem encontra links para ferramentas dedicadas ja existentes no projeto.',
        ],
      },
    ],
    faq: [
      {
        question: 'Essa ferramenta envia meu texto para o servidor?',
        answer:
          'Sempre que possivel o processamento e local no navegador. Isso e indicado no proprio fluxo da ferramenta.',
      },
      {
        question: 'Posso converter qualquer formato para qualquer outro?',
        answer:
          'Nao. A central usa uma matriz de conversoes validas e bloqueia combinacoes impossiveis para evitar resultados falsos.',
      },
      {
        question: 'Por que nao da para converter SHA-256 de volta para texto?',
        answer:
          'Porque hash e unidirecional. SHA-256, MD5 e similares geram resumo criptografico e nao possuem reversao direta.',
      },
      {
        question: 'Qual a diferenca entre hash, cifra e codificacao?',
        answer:
          'Hash gera assinatura irreversivel, cifra transforma texto com chave/regra e codificacao adapta dados para transporte/representacao.',
      },
      {
        question: 'A ferramenta funciona no celular?',
        answer:
          'Sim. A interface foi estruturada para uso mobile com foco em 320px/375px sem scroll horizontal.',
      },
    ],
  },
  en: {
    name: 'Universal Converter for Text, Codes, Hashes, Ciphers, and Bases',
    shortDescription:
      'Single conversion hub for text, numbers, hashes, ciphers, and technical formats with validation, presets, batch mode, and local processing.',
    primaryKeyword: 'universal text code hash cipher base converter',
    secondaryKeywords: [
      'universal converter online',
      'text to binary',
      'binary to text',
      'text to sha256',
      'text to md5',
      'base converter',
      'caesar cipher decoder',
      'text to morse',
      'url encode decode',
    ],
    searchIntent:
      'Technical users and students looking for a single conversion hub with valid mappings and clear input validation.',
    seoTitle: 'Universal Converter for Text, Code, Hash, and Ciphers Online',
    seoDescription:
      'Convert text, numbers, hashes, classic ciphers, and numeric bases in one place with presets, search, and local browser processing.',
    h1: 'Universal Converter for Text, Code, Hash, and Ciphers',
    intro:
      'Paste any text, number, or code, choose source and target format, and get fast validated output with copy actions.',
    contentBlocks: [
      {
        title: 'A practical conversion hub',
        paragraphs: [
          'This tool is built on a valid conversion matrix instead of fake all-to-all promises. Only meaningful and technically valid paths are enabled.',
          'You can convert text, numeric bases, classic ciphers, hashes, and developer-friendly encodings in one clean interface.',
        ],
      },
      {
        title: 'Conversion vs encoding vs cipher vs hash',
        paragraphs: [
          'Conversion changes representation between compatible values. Encoding prepares data for transport. Classic ciphers transform text for educational workflows.',
          'Hashes such as SHA-256 and MD5 are one-way fingerprints. They are intentionally not reversible.',
        ],
      },
      {
        title: 'Presets, multi-output, and batch mode',
        paragraphs: [
          'Presets let you generate multiple outputs at once, such as all hashes for a single input.',
          'Batch mode converts line by line, which is useful for logs, fixture generation, and repetitive technical tasks.',
        ],
      },
      {
        title: 'Detection and pipeline',
        paragraphs: [
          'Input detection suggests likely formats like binary, hex, Morse, URL encoded, and hash-like strings without forcing automatic changes.',
          'Pipeline mode supports chained conversions with intermediate steps for advanced workflows.',
        ],
      },
      {
        title: 'Privacy and limits',
        paragraphs: [
          'Whenever possible, processing is done in-browser. Some educational ciphers are not modern security solutions.',
          'Dedicated tools remain available for specific domains to avoid weak duplicated experiences.',
        ],
      },
    ],
    faq: [
      { question: 'Is processing local?', answer: 'Yes, whenever algorithm support is available in-browser.' },
      { question: 'Can I convert everything to everything?', answer: 'No. Only valid conversion pairs are enabled.' },
      { question: 'Why can not SHA-256 be reversed?', answer: 'Hashes are one-way by design and not direct reversible transforms.' },
      { question: 'Can I convert multiple values at once?', answer: 'Yes. Batch mode supports line-by-line conversion.' },
      { question: 'Does it work on mobile?', answer: 'Yes. The interface is mobile-first and responsive.' },
    ],
  },
  es: {
    name: 'Conversor Universal de Texto, Codigos, Hashes, Cifras y Bases',
    shortDescription:
      'Central unica para convertir texto, numeros, hashes, cifras y formatos tecnicos con validacion, presets y modo lote.',
    primaryKeyword: 'conversor universal texto codigo hash cifras bases',
    secondaryKeywords: [
      'conversor universal online',
      'texto a binario',
      'binario a texto',
      'texto a sha256',
      'texto a md5',
      'conversor de bases',
      'cifra de cesar',
      'texto a morse',
      'url encode decode',
    ],
    searchIntent:
      'Usuarios tecnicos y estudiantes que necesitan conversiones validas en una sola herramienta con retroalimentacion clara.',
    seoTitle: 'Conversor Universal de Texto, Codigo, Hash y Cifras Online',
    seoDescription:
      'Convierte texto, numeros, hashes, cifras clasicas y bases numericas en una central unica con busqueda, presets y procesamiento local.',
    h1: 'Conversor Universal de Texto, Codigo, Hash y Cifras',
    intro:
      'Pega cualquier texto, numero o codigo, elige origen y destino, y convierte rapido con validacion clara y boton copiar.',
    contentBlocks: [
      {
        title: 'Una central profesional de conversiones',
        paragraphs: [
          'Esta herramienta usa una matriz de conversiones validas para evitar combinaciones imposibles. Solo muestra rutas tecnicamente correctas.',
          'Puedes convertir texto, bases numericas, hashes, cifras clasicas y formatos de programacion en una sola interfaz.',
        ],
      },
      {
        title: 'Diferencias clave entre formatos',
        paragraphs: [
          'Convertir no es lo mismo que codificar. Tampoco es lo mismo que cifrar o hashear. Cada categoria tiene objetivos distintos.',
          'Hashes como SHA-256 y MD5 son unidireccionales y no se revierten a texto original.',
        ],
      },
      {
        title: 'Presets, multiples salidas y lote',
        paragraphs: [
          'Con presets puedes generar varias salidas de una vez, por ejemplo todos los hashes.',
          'El modo lote convierte linea por linea para flujos repetitivos y tareas operativas.',
        ],
      },
      {
        title: 'Deteccion y pipeline',
        paragraphs: [
          'La deteccion sugiere formatos probables como binario, hexadecimal, Morse y URL encoded.',
          'El modo pipeline permite encadenar pasos y revisar salidas intermedias para conversiones complejas.',
        ],
      },
      {
        title: 'Privacidad y limites',
        paragraphs: [
          'Cuando es posible, el procesamiento corre localmente en navegador.',
          'Algunas cifras son educativas y no deben tratarse como seguridad moderna.',
        ],
      },
    ],
    faq: [
      { question: 'Se envia mi texto al servidor?', answer: 'No por defecto. El procesamiento principal es local cuando aplica.' },
      { question: 'Puedo convertir cualquier formato a cualquier formato?', answer: 'No. Solo combinaciones validas en la matriz.' },
      { question: 'Por que no puedo revertir SHA-256?', answer: 'Porque es hash unidireccional.' },
      { question: 'Puedo convertir varias lineas?', answer: 'Si. El modo lote convierte una linea por resultado.' },
      { question: 'Funciona en celular?', answer: 'Si. La interfaz es responsiva y mobile-first.' },
    ],
  },
};

export const getUniversalConverterContent = (
  locale: AppLocale,
): UniversalConverterLocaleContent => contentByLocale[locale] ?? contentByLocale['pt-br'];

export const universalConverterIntro = contentByLocale['pt-br'].intro;
export const universalConverterContentBlocks = contentByLocale['pt-br'].contentBlocks;
export const universalConverterFaq = contentByLocale['pt-br'].faq;
