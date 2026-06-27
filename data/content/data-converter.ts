import type { AppLocale } from '@/lib/i18n/config';
import type { ContentBlock, FaqItem } from '@/types/content';

export type DataConverterLocaleContent = {
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

const contentByLocale: Record<AppLocale, DataConverterLocaleContent> = {
  'pt-br': {
    name: 'Conversor de JSON, SQL, XLSX, CSV e TSV',
    shortDescription:
      'Converta dados tabulares entre JSON, SQL INSERT, XLSX, CSV e TSV com colar, upload, deteccao automatica e processamento local.',
    primaryKeyword: 'conversor json csv xlsx online',
    secondaryKeywords: [
      'converter json para csv',
      'converter csv para json',
      'xlsx para json online',
      'sql insert para csv',
      'csv para sql insert',
      'tsv para xlsx',
    ],
    searchIntent:
      'Usuarios, analistas e devs que precisam transformar dados tabulares entre formatos comuns de planilha, API e banco de dados sem instalar software.',
    seoTitle: 'Conversor JSON, CSV, XLSX, TSV e SQL Online | Sem Cadastro',
    seoDescription:
      'Cole ou envie arquivo para converter JSON, SQL INSERT, XLSX, CSV e TSV no navegador. Detecta formato automaticamente e exporta para planilha ou texto.',
    h1: 'Conversor de JSON, SQL, XLSX, CSV e TSV Online',
    intro:
      'Cole dados do clipboard ou envie arquivo para converter tabelas entre JSON, SQL INSERT, XLSX, CSV e TSV direto no navegador, gratis e sem cadastro.',
    contentBlocks: [
      {
        title: 'Conversao de dados tabulares em um fluxo unico',
        paragraphs: [
          'Esta ferramenta transforma os formatos mais comuns de dados tabulares: JSON de API, CSV exportado por sistemas, TSV copiado de planilhas, XLSX do Excel e comandos SQL INSERT usados em bancos de dados.',
          'O fluxo foi feito para operacoes rapidas: cole o conteudo, envie um arquivo ou importe TXT, confirme o formato detectado e escolha o destino. O preview ajuda a validar linhas e colunas antes de copiar ou baixar o resultado.',
        ],
      },
      {
        title: 'Quando usar JSON, SQL, XLSX, CSV ou TSV',
        paragraphs: [
          'JSON e util para APIs, automacoes e integrações entre sistemas. CSV e TSV sao ideais para troca simples de tabelas, logs e bases pequenas. XLSX facilita abertura em Excel, Google Sheets e ferramentas administrativas. SQL INSERT ajuda a preparar cargas pequenas, fixtures e massas de teste.',
          'Como cada formato tem limites próprios, a ferramenta normaliza a entrada como tabela. Objetos JSON viram colunas, comandos INSERT viram linhas, e arquivos XLSX usam a primeira aba da planilha.',
        ],
        list: [
          'JSON para CSV quando voce precisa abrir payload de API em planilha.',
          'CSV para JSON para alimentar scripts, testes e importadores.',
          'XLSX para TSV quando precisa colar dados em sistemas internos.',
          'SQL INSERT para CSV para revisar cargas em tabela.',
          'CSV ou TSV para SQL INSERT para montar dados de teste rapidamente.',
        ],
      },
      {
        title: 'Privacidade, deteccao automatica e limites praticos',
        paragraphs: [
          'O processamento principal acontece localmente no navegador. Arquivos e textos colados nao precisam ser enviados para backend para detectar formato, montar preview ou gerar saidas de texto.',
          'A deteccao automatica cobre JSON valido, SQL INSERT, CSV e TSV. Arquivos TXT sao tratados como texto e passam pela mesma deteccao do conteudo colado. Em arquivos muito grandes, especialmente XLSX com muitas abas ou milhares de linhas, dividir o dataset melhora a performance em celular.',
        ],
      },
    ],
    faq: [
      {
        question: 'Quais formatos essa ferramenta converte?',
        answer:
          'Ela converte entre JSON, SQL INSERT, XLSX, CSV e TSV. TXT tambem pode ser enviado como entrada de texto para deteccao automatica.',
      },
      {
        question: 'Posso colar do clipboard?',
        answer:
          'Sim. Voce pode colar manualmente no campo de texto ou usar o botao de colar quando o navegador permitir acesso ao clipboard.',
      },
      {
        question: 'Arquivos XLSX sao enviados para servidor?',
        answer:
          'Nao por padrao. A leitura da primeira aba e a exportacao XLSX acontecem localmente no navegador.',
      },
      {
        question: 'Como funciona a conversao para SQL?',
        answer:
          'A ferramenta gera comandos INSERT INTO usando a primeira linha como cabecalho quando essa opcao esta marcada. Tambem e possivel definir o nome da tabela.',
      },
      {
        question: 'Funciona no celular?',
        answer:
          'Sim. A interface usa preview com rolagem interna para evitar scroll horizontal da pagina em telas pequenas.',
      },
    ],
  },
  en: {
    name: 'JSON, SQL, XLSX, CSV, and TSV Converter',
    shortDescription:
      'Convert tabular data between JSON, SQL INSERT, XLSX, CSV, and TSV with paste, upload, auto-detection, and local processing.',
    primaryKeyword: 'json csv xlsx converter online',
    secondaryKeywords: [
      'json to csv converter',
      'csv to json converter',
      'xlsx to json online',
      'sql insert to csv',
      'csv to sql insert',
      'tsv to xlsx',
    ],
    searchIntent:
      'Users, analysts, and developers who need to transform tabular data between spreadsheet, API, and database formats without installing software.',
    seoTitle: 'JSON, CSV, XLSX, TSV, and SQL Converter Online',
    seoDescription:
      'Paste or upload data to convert JSON, SQL INSERT, XLSX, CSV, and TSV in-browser with auto-detection, preview, copy, and download.',
    h1: 'JSON, SQL, XLSX, CSV, and TSV Converter Online',
    intro:
      'Paste clipboard data or upload a file to convert tables between JSON, SQL INSERT, XLSX, CSV, and TSV directly in your browser.',
    contentBlocks: [
      {
        title: 'A single flow for tabular data conversion',
        paragraphs: [
          'This converter covers common tabular data formats used across APIs, spreadsheets, exports, logs, and database fixtures. It accepts pasted text and uploaded files, including TXT files that are detected by content.',
          'The tool normalizes input into a table preview first. That lets you inspect columns and rows before copying text output or downloading a spreadsheet file.',
        ],
      },
      {
        title: 'When each output format makes sense',
        paragraphs: [
          'JSON is useful for APIs and scripts. CSV and TSV are lightweight exchange formats for tables and logs. XLSX is practical for Excel and spreadsheet workflows. SQL INSERT is helpful for small seed datasets, fixtures, and quick database tests.',
          'Object arrays become table columns, INSERT statements become rows, and XLSX input reads the first worksheet so the conversion remains predictable.',
        ],
        list: [
          'JSON to CSV for opening API payloads in spreadsheet tools.',
          'CSV to JSON for scripts, test data, and import jobs.',
          'XLSX to TSV for clean copy-paste into internal tools.',
          'SQL INSERT to CSV for reviewing seed data as a table.',
          'CSV or TSV to SQL INSERT for quick database fixtures.',
        ],
      },
      {
        title: 'Privacy, detection, and practical limits',
        paragraphs: [
          'Main processing runs locally in the browser. Pasted content and selected files do not need to be uploaded to a backend for detection, preview, or text export.',
          'Automatic detection handles valid JSON, SQL INSERT, CSV, and TSV. Very large XLSX files can still use significant memory, so splitting huge datasets is better on mobile devices.',
        ],
      },
    ],
    faq: [
      {
        question: 'Which formats can I convert?',
        answer:
          'You can convert between JSON, SQL INSERT, XLSX, CSV, and TSV. TXT uploads are accepted as text input and auto-detected.',
      },
      {
        question: 'Can I paste from the clipboard?',
        answer:
          'Yes. You can paste directly into the text area or use the paste button when your browser allows clipboard access.',
      },
      {
        question: 'Are XLSX files uploaded to a server?',
        answer:
          'No by default. Reading the first sheet and exporting XLSX run locally in your browser.',
      },
      {
        question: 'How does SQL output work?',
        answer:
          'The converter generates INSERT INTO statements. If header row is enabled, the first row becomes column names.',
      },
      {
        question: 'Does it work on mobile?',
        answer:
          'Yes. Wide previews scroll inside the tool so the page itself avoids horizontal scrolling.',
      },
    ],
  },
  es: {
    name: 'Conversor de JSON, SQL, XLSX, CSV y TSV',
    shortDescription:
      'Convierte datos tabulares entre JSON, SQL INSERT, XLSX, CSV y TSV con pegado, carga de archivo, deteccion automatica y procesamiento local.',
    primaryKeyword: 'conversor json csv xlsx online',
    secondaryKeywords: [
      'convertir json a csv',
      'convertir csv a json',
      'xlsx a json online',
      'sql insert a csv',
      'csv a sql insert',
      'tsv a xlsx',
    ],
    searchIntent:
      'Usuarios, analistas y desarrolladores que necesitan transformar datos tabulares entre planillas, APIs y bases de datos sin instalar software.',
    seoTitle: 'Conversor JSON, CSV, XLSX, TSV y SQL Online',
    seoDescription:
      'Pega o sube datos para convertir JSON, SQL INSERT, XLSX, CSV y TSV en el navegador con deteccion automatica, vista previa y descarga.',
    h1: 'Conversor de JSON, SQL, XLSX, CSV y TSV Online',
    intro:
      'Pega datos del clipboard o sube un archivo para convertir tablas entre JSON, SQL INSERT, XLSX, CSV y TSV directamente en el navegador.',
    contentBlocks: [
      {
        title: 'Conversion tabular en un solo flujo',
        paragraphs: [
          'Esta herramienta cubre formatos usados en APIs, planillas, exportaciones, logs y datos de prueba de bases. Acepta texto pegado y archivos, incluyendo TXT con deteccion por contenido.',
          'La entrada se normaliza como tabla antes de exportar. Asi puedes revisar filas y columnas antes de copiar el resultado o descargar el archivo convertido.',
        ],
      },
      {
        title: 'Cuando usar cada formato',
        paragraphs: [
          'JSON es util para APIs y scripts. CSV y TSV son formatos livianos para intercambio de tablas. XLSX sirve para Excel y flujos administrativos. SQL INSERT ayuda a crear fixtures, seeds y pruebas pequenas de base de datos.',
          'Arrays de objetos se convierten en columnas, sentencias INSERT se convierten en filas, y XLSX toma la primera hoja para mantener un resultado predecible.',
        ],
        list: [
          'JSON a CSV para abrir payloads de API como planilla.',
          'CSV a JSON para scripts, pruebas e importadores.',
          'XLSX a TSV para pegar datos en sistemas internos.',
          'SQL INSERT a CSV para revisar cargas como tabla.',
          'CSV o TSV a SQL INSERT para fixtures rapidos.',
        ],
      },
      {
        title: 'Privacidad, deteccion y limites',
        paragraphs: [
          'El procesamiento principal ocurre localmente en el navegador. El contenido pegado y los archivos seleccionados no necesitan subirse a backend para detectar, previsualizar o exportar texto.',
          'La deteccion automatica reconoce JSON valido, SQL INSERT, CSV y TSV. Archivos XLSX muy grandes pueden consumir memoria, por eso en movil conviene dividir datasets enormes.',
        ],
      },
    ],
    faq: [
      {
        question: 'Que formatos puedo convertir?',
        answer:
          'Puedes convertir entre JSON, SQL INSERT, XLSX, CSV y TSV. Tambien se acepta TXT como entrada de texto con deteccion automatica.',
      },
      {
        question: 'Puedo pegar desde el clipboard?',
        answer:
          'Si. Puedes pegar manualmente en el campo de texto o usar el boton de pegar cuando el navegador permita acceso al clipboard.',
      },
      {
        question: 'Los archivos XLSX se suben al servidor?',
        answer:
          'No por defecto. La lectura de la primera hoja y la exportacion XLSX ocurren localmente en el navegador.',
      },
      {
        question: 'Como funciona la salida SQL?',
        answer:
          'El conversor genera sentencias INSERT INTO. Si la opcion de cabecera esta activa, la primera fila se usa como nombres de columna.',
      },
      {
        question: 'Funciona en celular?',
        answer:
          'Si. Las vistas previas anchas usan desplazamiento interno para evitar scroll horizontal en la pagina.',
      },
    ],
  },
};

export const dataConverterIntro = contentByLocale['pt-br'].intro;
export const dataConverterContentBlocks = contentByLocale['pt-br'].contentBlocks;
export const dataConverterFaq = contentByLocale['pt-br'].faq;

export const getDataConverterContent = (locale: AppLocale): DataConverterLocaleContent =>
  contentByLocale[locale];
