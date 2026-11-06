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
      'Converta tabelas entre JSON, SQL INSERT, XLSX, CSV e TSV: cole o texto ou envie um arquivo e o formato é detectado sozinho. Tudo no navegador.',
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
      'Usuários, analistas e devs que precisam transformar dados tabulares entre formatos comuns de planilha, API e banco de dados sem instalar software.',
    seoTitle: 'Conversor JSON, CSV, XLSX, TSV e SQL Online | Sem Cadastro',
    seoDescription:
      'Converta JSON, SQL INSERT, XLSX, CSV e TSV no navegador. Cole o texto ou envie o arquivo, confira a prévia e copie ou baixe o resultado.',
    h1: 'Conversor de JSON, SQL, XLSX, CSV e TSV Online',
    intro:
      'Cole dados da área de transferência ou envie um arquivo para converter tabelas entre JSON, SQL INSERT, XLSX, CSV e TSV direto no navegador, grátis e sem cadastro.',
    contentBlocks: [
      {
        title: 'O que o conversor aceita e como lê a entrada',
        paragraphs: [
          'A ferramenta transforma qualquer entrada em uma tabela de linhas e colunas e depois grava essa tabela no formato de destino. Você pode colar texto (ou usar o botão "Colar") ou enviar arquivos .json, .sql, .csv, .tsv, .txt, .xlsx e .xls. Em arquivos XLSX e XLS, só a primeira aba é lida.',
          'No formato "Detectar automaticamente", a ferramenta reconhece JSON válido, SQL com INSERT INTO ... VALUES, CSV (vírgula, ponto e vírgula ou barra vertical) e TSV (tabulação). Quando a detecção erra, escolha o formato de origem manualmente. Um JSON que é uma lista de objetos vira uma tabela com uma coluna por chave, e valores aninhados (objetos ou listas dentro de uma célula) são gravados como texto JSON. Em SQL, vários INSERT na mesma entrada são juntados em uma só tabela.',
        ],
      },
      {
        title: 'Como ler o resultado',
        paragraphs: [
          'A prévia mostra as primeiras 80 linhas lidas, e o resultado em texto aparece abaixo para copiar ou baixar. A opção "Primeira linha como cabeçalho" decide se a primeira linha vira o nome das colunas: no JSON ela vira as chaves dos objetos e no SQL vira a lista de colunas. Sem ela, o JSON sai como lista de listas e as colunas SQL recebem os nomes column_1, column_2 e assim por diante.',
          'Exemplo: com as linhas id,nome,total, 1,Ana,120.50 e 2,Lucas,89.90, escolher JSON gera uma lista de objetos como {"id":"1","nome":"Ana","total":"120.50"} (valores de CSV são texto), e escolher SQL com a tabela vendas gera um único INSERT INTO vendas (id, nome, total) VALUES com uma linha para cada pessoa.',
        ],
        list: [
          'CSV e TSV geram texto com vírgula e tabulação, respectivamente. Campos com aspas, quebra de linha ou o separador saem entre aspas.',
          'No SQL, o nome da tabela e das colunas é simplificado: letras minúsculas, números e sublinhado, e acentos viram sublinhado.',
          'Ao escolher XLSX como destino, o arquivo é baixado direto, com uma aba chamada Data.',
        ],
      },
      {
        title: 'Limites e privacidade',
        paragraphs: [
          'A leitura, a conversão e a geração do XLSX acontecem no navegador, e os dados não são enviados ao nosso servidor. O botão "Colar" depende da permissão do navegador para ler a área de transferência; se ela for negada, cole com o teclado no campo de texto.',
          'Texto vindo de CSV, TSV e SQL é lido como texto, e valores de CSV e TSV não são convertidos em números ou datas. A geração de SQL não cria tipos de coluna nem cobre CREATE TABLE, apenas INSERT. Arquivos de texto são lidos como UTF-8. Planilhas com milhares de linhas ou várias abas podem pesar no celular, e abas além da primeira são ignoradas.',
        ],
      },
    ],
    faq: [
      {
        question: 'Quais formatos essa ferramenta converte?',
        answer:
          'Ela lê JSON, SQL INSERT, CSV, TSV, TXT, XLSX e XLS e grava em JSON, SQL INSERT, CSV, TSV ou XLSX. Arquivos TXT passam pela mesma detecção do texto colado.',
      },
      {
        question: 'Meus arquivos são enviados para algum servidor?',
        answer:
          'Não. A leitura do arquivo (inclusive XLSX), a conversão e a geração do XLSX acontecem no navegador e o conteúdo não sai do seu aparelho.',
      },
      {
        question: 'Como funciona a conversão para SQL?',
        answer:
          'A ferramenta gera um INSERT INTO com os valores de todas as linhas. Com "Primeira linha como cabeçalho" marcado, essa linha vira os nomes das colunas. Você pode definir o nome da tabela. Números e TRUE/FALSE só saem sem aspas quando vêm tipados (JSON, XLSX ou outro SQL); valores lidos de CSV e TSV saem como texto entre aspas simples.',
      },
      {
        question: 'Qual aba do XLSX é convertida?',
        answer:
          'Só a primeira aba da planilha. Para converter outra aba, mova-a para a primeira posição no Excel ou exporte-a como CSV antes de enviar.',
      },
      {
        question: 'O botão Colar não funcionou. O que fazer?',
        answer:
          'O navegador pode bloquear o acesso à área de transferência. Nesse caso, clique no campo de texto e cole com Ctrl+V (ou o gesto de colar do celular).',
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
  zh: {
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
};

export const dataConverterIntro = contentByLocale['pt-br'].intro;
export const dataConverterContentBlocks = contentByLocale['pt-br'].contentBlocks;
export const dataConverterFaq = contentByLocale['pt-br'].faq;

export const getDataConverterContent = (locale: AppLocale): DataConverterLocaleContent =>
  contentByLocale[locale];
