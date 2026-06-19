import type { AppLocale } from '@/lib/i18n/config';
import type { ContentBlock, FaqItem } from '@/types/content';
import type { ToolCategory } from '@/types/tool';

export type FrontOnlyToolId =
  | 'gerador-cnpj'
  | 'validar-boleto'
  | 'file-checksum'
  | 'exif-viewer'
  | 'redimensionar-imagem'
  | 'pdf-organizer'
  | 'favicon-generator'
  | 'qr-code-scanner'
  | 'qr-code-wifi-vcard-evento'
  | 'json-para-typescript'
  | 'cron-generator'
  | 'gzip-deflate-zip'
  | 'dns-lookup'
  | 'bitcoin-fee-calculator'
  | 'bitcoin-address-tx-decoder'
  | 'sql-formatter';

export type FrontOnlyToolContent = {
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

export type FrontOnlyToolSeed = {
  id: FrontOnlyToolId;
  slug: string;
  category: ToolCategory;
  relatedToolIds: string[];
  content: Record<AppLocale, FrontOnlyToolContent>;
};

const localPrivacy = {
  'pt-br':
    'O processamento acontece no navegador sempre que possivel. Arquivos e entradas nao precisam ser enviados para o servidor do site para executar a tarefa principal.',
  en: 'Processing happens in the browser whenever possible. Files and inputs do not need to be uploaded to the site server for the main workflow.',
  es: 'El procesamiento ocurre en el navegador siempre que es posible. Los archivos y entradas no necesitan enviarse al servidor del sitio para ejecutar el flujo principal.',
} satisfies Record<AppLocale, string>;

const frontOnlyToolSeeds = [
  {
    id: 'gerador-cnpj',
    slug: 'gerador-cnpj',
    category: 'utility',
    relatedToolIds: ['cpf-generator', 'gerador-pessoa-fake', 'validar-boleto'],
    content: {
      'pt-br': {
        name: 'Validador e Gerador de CNPJ',
        shortDescription:
          'Valide CNPJ, gere numeros validos para testes e exporte listas em TXT, CSV ou JSON.',
        primaryKeyword: 'gerador e validador de cnpj',
        secondaryKeywords: [
          'gerador de cnpj valido',
          'validar cnpj online',
          'cnpj para teste',
          'gerar cnpj com pontuacao',
          'gerar cnpj sem pontuacao',
          'cnpj homologacao',
        ],
        searchIntent:
          'Devs, QAs e analistas que precisam validar CNPJ ou gerar massa de teste brasileira sem cadastro.',
        seoTitle: 'Gerador e Validador de CNPJ Online | Com ou Sem Pontuacao',
        seoDescription:
          'Valide CNPJ e gere listas de CNPJ validos para testes com copia rapida e exportacao TXT, CSV e JSON.',
        h1: 'Validador e Gerador de CNPJ para Testes',
        intro:
          'Cole um CNPJ para validar os digitos verificadores ou gere CNPJs validos em lote com matriz/filial e exportacao.',
        contentBlocks: [
          {
            title: 'Validacao real dos digitos do CNPJ',
            paragraphs: [
              'A ferramenta remove mascara, calcula os dois digitos verificadores e mostra o CNPJ formatado e somente numeros. Isso ajuda a diferenciar erro de formato de erro real no algoritmo.',
              'O gerador cria numeros validos para formulario, homologacao, QA e testes automatizados. Eles nao representam empresas reais e nao devem ser usados para fraude, cadastro indevido ou tentativa de identificacao.',
            ],
          },
          {
            title: 'Exportacao para massa de teste',
            paragraphs: [
              'Voce pode gerar de 1 a 200 CNPJs por vez, escolher a filial e alternar entre saida com ou sem pontuacao. A lista pode ser copiada ou baixada para planilhas, fixtures e scripts.',
              localPrivacy['pt-br'],
            ],
            list: ['TXT linha a linha', 'CSV com cabecalho', 'JSON para testes de API'],
          },
          {
            title: 'Limites importantes',
            paragraphs: [
              'Um CNPJ valido matematicamente nao confirma existencia, situacao cadastral ou dados da Receita Federal. A validacao aqui cobre apenas estrutura numerica e digitos verificadores.',
            ],
          },
        ],
        faq: [
          { question: 'O CNPJ gerado existe na Receita Federal?', answer: 'Nao. A ferramenta gera numeros validos pelo algoritmo, mas nao consulta cadastro oficial.' },
          { question: 'Posso gerar CNPJ sem pontuacao?', answer: 'Sim. Escolha a opcao sem pontuacao para usar somente os 14 digitos.' },
          { question: 'Serve para testes de formulario?', answer: 'Sim. O uso recomendado e QA, homologacao, fixtures e validacao de entrada.' },
          { question: 'Os CNPJs sao enviados para servidor?', answer: 'Nao por padrao. A validacao e a geracao rodam localmente no navegador.' },
        ],
      },
      en: {
        name: 'CNPJ Validator and Generator',
        shortDescription:
          'Validate Brazilian CNPJ numbers, generate valid test numbers, and export TXT, CSV, or JSON lists.',
        primaryKeyword: 'cnpj validator and generator',
        secondaryKeywords: [
          'valid cnpj generator',
          'validate cnpj online',
          'cnpj for testing',
          'formatted cnpj generator',
          'cnpj without punctuation',
          'brazil company tax id test data',
        ],
        searchIntent:
          'Developers and QA teams that need Brazilian company tax ID validation or test data without sign-up.',
        seoTitle: 'CNPJ Validator and Generator | Formatted or Digits Only',
        seoDescription:
          'Validate CNPJ check digits and generate valid CNPJ lists for tests with quick copy and TXT, CSV, JSON export.',
        h1: 'CNPJ Validator and Generator for Test Data',
        intro:
          'Paste a CNPJ to validate check digits or generate valid CNPJ batches with branch code and export options.',
        contentBlocks: [
          {
            title: 'Real CNPJ check digit validation',
            paragraphs: [
              'The tool strips punctuation, calculates both CNPJ check digits, and shows formatted and digits-only output. This helps separate mask issues from true algorithm errors.',
              'Generated CNPJs are useful for forms, QA, staging, and automated tests. They do not identify real companies and should not be used for fraud or impersonation.',
            ],
          },
          {
            title: 'Exports for test fixtures',
            paragraphs: [
              'Generate 1 to 200 CNPJs at once, set the branch code, and choose formatted or raw digits. Copy the list or download it for spreadsheets, fixtures, and scripts.',
              localPrivacy.en,
            ],
            list: ['Line-based TXT', 'CSV with header', 'JSON for API tests'],
          },
          {
            title: 'Important limits',
            paragraphs: [
              'A mathematically valid CNPJ does not prove legal existence, status, or official registry data. This page validates only numeric structure and check digits.',
            ],
          },
        ],
        faq: [
          { question: 'Does a generated CNPJ exist officially?', answer: 'No. It is valid by algorithm only and does not query any official registry.' },
          { question: 'Can I generate digits-only CNPJ?', answer: 'Yes. Choose the no-punctuation option to output the 14 digits only.' },
          { question: 'Is it suitable for form testing?', answer: 'Yes. The intended use is QA, staging, fixtures, and input validation.' },
          { question: 'Are CNPJs uploaded to a server?', answer: 'No by default. Validation and generation run locally in the browser.' },
        ],
      },
      es: {
        name: 'Validador y Generador de CNPJ',
        shortDescription:
          'Valida CNPJ brasilenos, genera numeros validos para pruebas y exporta TXT, CSV o JSON.',
        primaryKeyword: 'generador y validador de cnpj',
        secondaryKeywords: [
          'generador de cnpj valido',
          'validar cnpj online',
          'cnpj para pruebas',
          'cnpj con puntuacion',
          'cnpj sin puntuacion',
          'datos de prueba brasil',
        ],
        searchIntent:
          'Desarrolladores y QA que necesitan validar CNPJ o crear datos de prueba brasilenos sin registro.',
        seoTitle: 'Generador y Validador de CNPJ | Con o Sin Puntuacion',
        seoDescription:
          'Valida digitos de CNPJ y genera listas validas para pruebas con copia rapida y exportacion TXT, CSV y JSON.',
        h1: 'Validador y Generador de CNPJ para Pruebas',
        intro:
          'Pega un CNPJ para validar digitos o genera CNPJ validos en lote con codigo de sucursal y exportacion.',
        contentBlocks: [
          {
            title: 'Validacion real de digitos CNPJ',
            paragraphs: [
              'La herramienta quita mascara, calcula los dos digitos verificadores y muestra salida formateada y solo numeros. Asi separas errores de mascara de errores reales del algoritmo.',
              'Los CNPJ generados sirven para formularios, QA, staging y pruebas automatizadas. No representan empresas reales y no deben usarse para fraude o suplantacion.',
            ],
          },
          {
            title: 'Exportacion para datos de prueba',
            paragraphs: [
              'Puedes generar de 1 a 200 CNPJ, definir sucursal y elegir salida con o sin puntuacion. Copia la lista o descargala para planillas, fixtures y scripts.',
              localPrivacy.es,
            ],
            list: ['TXT linea por linea', 'CSV con cabecera', 'JSON para pruebas de API'],
          },
          {
            title: 'Limites importantes',
            paragraphs: [
              'Un CNPJ valido matematicamente no confirma existencia legal, estado fiscal ni datos oficiales. Esta pagina valida solo estructura numerica y digitos.',
            ],
          },
        ],
        faq: [
          { question: 'El CNPJ generado existe oficialmente?', answer: 'No. Solo es valido por algoritmo y no consulta registros oficiales.' },
          { question: 'Puedo generar CNPJ sin puntuacion?', answer: 'Si. Elige la opcion sin puntuacion para obtener solo 14 digitos.' },
          { question: 'Sirve para probar formularios?', answer: 'Si. El uso recomendado es QA, homologacion, fixtures y validacion de entrada.' },
          { question: 'Los CNPJ se envian al servidor?', answer: 'No por defecto. La validacion y generacion ocurren localmente en el navegador.' },
        ],
      },
    },
  },
  {
    id: 'validar-boleto',
    slug: 'validar-boleto',
    category: 'utility',
    relatedToolIds: ['pix-decoder', 'gerador-cnpj', 'cpf-generator'],
    content: {
      'pt-br': {
        name: 'Validador de Boleto e Linha Digitavel',
        shortDescription:
          'Valide linha digitavel ou codigo de barras, converta formatos e extraia vencimento, valor e campo livre.',
        primaryKeyword: 'validador de boleto linha digitavel',
        secondaryKeywords: [
          'validar boleto online',
          'linha digitavel para codigo de barras',
          'decodificar boleto',
          'verificar dac boleto',
          'boleto bancario validador',
          'boleto arrecadacao validar',
        ],
        searchIntent:
          'Usuarios e devs que precisam conferir boleto, linha digitavel ou codigo de barras antes de integrar pagamentos.',
        seoTitle: 'Validador de Boleto e Linha Digitavel | Converter e Decodificar',
        seoDescription:
          'Cole linha digitavel ou codigo de barras de boleto para validar DACs, converter formatos e ver valor, vencimento e campo livre.',
        h1: 'Validador de Boleto e Linha Digitavel Online',
        intro:
          'Cole uma linha digitavel de 47/48 digitos ou codigo de barras de 44 digitos para validar, converter e inspecionar os campos.',
        contentBlocks: [
          {
            title: 'Validacao de boleto bancario e arrecadacao',
            paragraphs: [
              'A ferramenta reconhece boleto bancario comum e boleto de arrecadacao/concessionaria, recalcula os digitos dos campos e o DAC geral quando aplicavel.',
              'O resultado mostra codigo de barras, linha digitavel formatada, banco, valor, fator de vencimento e campo livre para facilitar debug de integracoes.',
            ],
          },
          {
            title: 'Conversao entre linha digitavel e codigo de barras',
            paragraphs: [
              'Quando voce informa uma linha digitavel, a ferramenta monta o codigo de barras equivalente. Quando informa codigo de barras, ela gera a linha digitavel correspondente.',
              localPrivacy['pt-br'],
            ],
            list: ['Validar campos modulo 10', 'Validar DAC modulo 11', 'Exportar diagnostico em JSON'],
          },
          {
            title: 'Limites e cuidado operacional',
            paragraphs: [
              'A validacao matematica nao confirma pagamento, beneficiario, fraude ou registro no banco. Use o resultado como apoio tecnico e confirme dados sensiveis em canais oficiais.',
            ],
          },
        ],
        faq: [
          { question: 'A ferramenta consulta o banco?', answer: 'Nao. Ela valida estrutura, digitos e campos localmente, sem consulta bancaria.' },
          { question: 'Aceita boleto de concessionaria?', answer: 'Sim. Linhas de arrecadacao com 48 digitos e codigos iniciados por 8 sao tratados separadamente.' },
          { question: 'Mostra vencimento?', answer: 'Sim para boletos bancarios com fator de vencimento. Em ciclos novos, a ferramenta exibe candidatos quando necessario.' },
          { question: 'Posso exportar o resultado?', answer: 'Sim. O diagnostico pode ser copiado ou baixado em JSON.' },
        ],
      },
      en: {
        name: 'Brazilian Boleto and Digitable Line Validator',
        shortDescription:
          'Validate boleto lines or barcodes, convert formats, and extract due date, amount, and free field.',
        primaryKeyword: 'brazilian boleto validator',
        secondaryKeywords: [
          'validate boleto online',
          'digitable line to barcode',
          'decode boleto',
          'boleto check digit',
          'brazil payment slip validator',
          'boleto barcode parser',
        ],
        searchIntent:
          'Developers and payment teams that need to inspect boleto lines or barcodes before integrations.',
        seoTitle: 'Brazilian Boleto Validator | Decode Digitable Line and Barcode',
        seoDescription:
          'Paste a boleto digitable line or barcode to validate check digits, convert formats, and read amount, due date, and free field.',
        h1: 'Brazilian Boleto and Digitable Line Validator',
        intro:
          'Paste a 47/48 digit boleto line or 44 digit barcode to validate, convert, and inspect payment fields.',
        contentBlocks: [
          {
            title: 'Bank boleto and collection slip validation',
            paragraphs: [
              'The tool detects standard Brazilian bank boleto and collection/utilities slips, recalculates field check digits, and validates the general DAC when applicable.',
              'The result shows barcode, formatted line, bank, amount, due factor, and free field to speed up payment integration debugging.',
            ],
          },
          {
            title: 'Convert line and barcode formats',
            paragraphs: [
              'When you paste a digitable line, the page builds the equivalent barcode. When you paste a barcode, it builds the corresponding digitable line.',
              localPrivacy.en,
            ],
            list: ['Modulo 10 field checks', 'Modulo 11 general DAC', 'JSON diagnostic export'],
          },
          {
            title: 'Operational limits',
            paragraphs: [
              'Mathematical validation does not confirm payment, beneficiary identity, fraud status, or bank registration. Use it as a technical aid and confirm sensitive data through official channels.',
            ],
          },
        ],
        faq: [
          { question: 'Does it query a bank?', answer: 'No. It validates structure, digits, and fields locally without a bank lookup.' },
          { question: 'Does it support utility collection slips?', answer: 'Yes. 48-digit collection lines and barcodes starting with 8 are handled separately.' },
          { question: 'Can it show the due date?', answer: 'Yes for bank boletos with a due factor. When needed, candidate cycles are shown.' },
          { question: 'Can I export the result?', answer: 'Yes. The diagnostic can be copied or downloaded as JSON.' },
        ],
      },
      es: {
        name: 'Validador de Boleto y Linea Digitable',
        shortDescription:
          'Valida linea digitable o codigo de barras, convierte formatos y extrae vencimiento, valor y campo libre.',
        primaryKeyword: 'validador de boleto linea digitable',
        secondaryKeywords: [
          'validar boleto online',
          'linea digitable a codigo de barras',
          'decodificar boleto',
          'digito verificador boleto',
          'boleto brasileno validar',
          'parser boleto',
        ],
        searchIntent:
          'Usuarios y desarrolladores que necesitan revisar boletos brasilenos antes de integrar pagos.',
        seoTitle: 'Validador de Boleto | Decodificar Linea y Codigo de Barras',
        seoDescription:
          'Pega linea digitable o codigo de barras de boleto para validar digitos, convertir formatos y ver valor, vencimiento y campo libre.',
        h1: 'Validador de Boleto y Linea Digitable Online',
        intro:
          'Pega una linea de 47/48 digitos o codigo de barras de 44 digitos para validar, convertir e inspeccionar campos.',
        contentBlocks: [
          {
            title: 'Validacion de boleto bancario y recaudacion',
            paragraphs: [
              'La herramienta detecta boleto bancario y boleto de recaudacion/servicios, recalcula digitos de los campos y valida el DAC general cuando aplica.',
              'El resultado muestra codigo de barras, linea formateada, banco, valor, factor de vencimiento y campo libre para debug de integraciones.',
            ],
          },
          {
            title: 'Conversion entre linea y codigo de barras',
            paragraphs: [
              'Cuando pegas una linea, la pagina crea el codigo de barras equivalente. Cuando pegas un codigo de barras, genera la linea correspondiente.',
              localPrivacy.es,
            ],
            list: ['Validacion modulo 10', 'DAC general modulo 11', 'Exportacion JSON'],
          },
          {
            title: 'Limites operativos',
            paragraphs: [
              'La validacion matematica no confirma pago, beneficiario, fraude ni registro bancario. Usa el resultado como apoyo tecnico y confirma datos sensibles en canales oficiales.',
            ],
          },
        ],
        faq: [
          { question: 'Consulta el banco?', answer: 'No. Valida estructura, digitos y campos localmente sin consulta bancaria.' },
          { question: 'Acepta boletos de servicios?', answer: 'Si. Lineas de 48 digitos y codigos iniciados por 8 se tratan separadamente.' },
          { question: 'Muestra vencimiento?', answer: 'Si para boletos bancarios con factor de vencimiento. Cuando aplica, muestra candidatos.' },
          { question: 'Puedo exportar el resultado?', answer: 'Si. El diagnostico puede copiarse o descargarse en JSON.' },
        ],
      },
    },
  },
  {
    id: 'file-checksum',
    slug: 'file-checksum',
    category: 'dev',
    relatedToolIds: ['conversor-universal', 'json-formatter', 'gzip-deflate-zip'],
    content: {
      'pt-br': {
        name: 'Hash de Arquivo e Checksum',
        shortDescription:
          'Calcule MD5, SHA-1, SHA-256, SHA-384, SHA-512 e CRC32 de arquivos locais com comparacao e exportacao.',
        primaryKeyword: 'hash de arquivo checksum online',
        secondaryKeywords: [
          'sha256 arquivo',
          'md5 de arquivo',
          'verificar checksum',
          'crc32 online',
          'calcular hash arquivo',
          'file hash checker',
        ],
        searchIntent:
          'Usuarios tecnicos que precisam confirmar integridade de downloads, backups e artefatos de build.',
        seoTitle: 'Hash de Arquivo Online | SHA-256, MD5, SHA-512 e CRC32',
        seoDescription:
          'Calcule checksums de arquivo no navegador, compare com hash esperado e exporte resultados em JSON ou CSV.',
        h1: 'Hash de Arquivo e Checksum Online',
        intro:
          'Selecione um arquivo local, escolha algoritmos de hash, compare com um checksum esperado e exporte o resultado.',
        contentBlocks: [
          {
            title: 'Verificacao de integridade sem upload',
            paragraphs: [
              'Checksums ajudam a confirmar se um arquivo baixado, copiado ou compactado chegou sem alteracao. A pagina calcula hashes comuns diretamente a partir do arquivo local.',
              'MD5 e SHA-1 continuam uteis para compatibilidade legada, enquanto SHA-256 e SHA-512 sao escolhas melhores para integridade moderna.',
            ],
          },
          {
            title: 'Comparacao e exportacao',
            paragraphs: [
              'Cole um hash esperado para ver se algum algoritmo confere automaticamente. Depois copie todos os resultados ou baixe JSON/CSV para registrar em auditoria ou release notes.',
              localPrivacy['pt-br'],
            ],
            list: ['MD5 para checksums antigos', 'SHA-256/SHA-512 para releases', 'CRC32 para arquivos compactados'],
          },
          {
            title: 'Seguranca do checksum',
            paragraphs: [
              'Checksum nao prova autoria nem substitui assinatura digital. Para distribuicao sensivel, combine hash com assinatura criptografica, canal confiavel e verificacao de origem.',
            ],
          },
        ],
        faq: [
          { question: 'O arquivo e enviado para servidor?', answer: 'Nao por padrao. O navegador le o arquivo local e calcula os hashes.' },
          { question: 'Qual hash devo usar?', answer: 'Para integridade moderna, prefira SHA-256 ou SHA-512. MD5 e SHA-1 ficam para compatibilidade.' },
          { question: 'Posso comparar um checksum esperado?', answer: 'Sim. Cole o hash esperado e a tabela indica se algum resultado confere.' },
          { question: 'Funciona com arquivos grandes?', answer: 'Funciona, mas arquivos muito grandes dependem de memoria e desempenho do dispositivo.' },
        ],
      },
      en: {
        name: 'File Hash and Checksum',
        shortDescription:
          'Calculate MD5, SHA-1, SHA-256, SHA-384, SHA-512, and CRC32 for local files with comparison and export.',
        primaryKeyword: 'file hash checksum online',
        secondaryKeywords: [
          'sha256 file',
          'file md5 checksum',
          'verify checksum',
          'crc32 online',
          'calculate file hash',
          'file hash checker',
        ],
        searchIntent:
          'Technical users who need to verify download, backup, and build artifact integrity.',
        seoTitle: 'File Hash Online | SHA-256, MD5, SHA-512, and CRC32',
        seoDescription:
          'Calculate file checksums in the browser, compare with an expected hash, and export JSON or CSV results.',
        h1: 'File Hash and Checksum Calculator',
        intro:
          'Select a local file, choose hash algorithms, compare with an expected checksum, and export the result.',
        contentBlocks: [
          {
            title: 'Integrity checks without upload',
            paragraphs: [
              'Checksums help confirm whether a downloaded, copied, or compressed file changed. This page calculates common hashes directly from the local file.',
              'MD5 and SHA-1 remain useful for legacy compatibility, while SHA-256 and SHA-512 are stronger choices for modern integrity workflows.',
            ],
          },
          {
            title: 'Comparison and export',
            paragraphs: [
              'Paste an expected hash to automatically see whether any algorithm matches. Then copy all results or download JSON/CSV for audit records or release notes.',
              localPrivacy.en,
            ],
            list: ['MD5 for legacy checksums', 'SHA-256/SHA-512 for releases', 'CRC32 for archive workflows'],
          },
          {
            title: 'Checksum security limits',
            paragraphs: [
              'A checksum does not prove authorship and does not replace a digital signature. For sensitive distribution, combine hashes with cryptographic signatures and trusted channels.',
            ],
          },
        ],
        faq: [
          { question: 'Is the file uploaded?', answer: 'No by default. The browser reads the local file and calculates the hashes.' },
          { question: 'Which hash should I use?', answer: 'Prefer SHA-256 or SHA-512 for modern integrity checks. MD5 and SHA-1 are mainly compatibility formats.' },
          { question: 'Can I compare an expected checksum?', answer: 'Yes. Paste the expected hash and the table shows whether a result matches.' },
          { question: 'Does it work with large files?', answer: 'Yes, but very large files depend on your device memory and performance.' },
        ],
      },
      es: {
        name: 'Hash de Archivo y Checksum',
        shortDescription:
          'Calcula MD5, SHA-1, SHA-256, SHA-384, SHA-512 y CRC32 de archivos locales con comparacion y exportacion.',
        primaryKeyword: 'hash de archivo checksum online',
        secondaryKeywords: [
          'sha256 archivo',
          'md5 de archivo',
          'verificar checksum',
          'crc32 online',
          'calcular hash archivo',
          'file hash checker',
        ],
        searchIntent:
          'Usuarios tecnicos que necesitan verificar integridad de descargas, backups y artefactos de build.',
        seoTitle: 'Hash de Archivo Online | SHA-256, MD5, SHA-512 y CRC32',
        seoDescription:
          'Calcula checksums de archivo en el navegador, compara con un hash esperado y exporta JSON o CSV.',
        h1: 'Hash de Archivo y Checksum Online',
        intro:
          'Selecciona un archivo local, elige algoritmos, compara con un checksum esperado y exporta el resultado.',
        contentBlocks: [
          {
            title: 'Verificacion de integridad sin upload',
            paragraphs: [
              'Los checksums ayudan a confirmar si un archivo descargado, copiado o comprimido cambio. La pagina calcula hashes comunes directamente desde el archivo local.',
              'MD5 y SHA-1 siguen siendo utiles por compatibilidad, mientras SHA-256 y SHA-512 son mejores para integridad moderna.',
            ],
          },
          {
            title: 'Comparacion y exportacion',
            paragraphs: [
              'Pega un hash esperado para ver automaticamente si algun algoritmo coincide. Despues copia todos los resultados o descarga JSON/CSV.',
              localPrivacy.es,
            ],
            list: ['MD5 para checksums antiguos', 'SHA-256/SHA-512 para releases', 'CRC32 para archivos comprimidos'],
          },
          {
            title: 'Limites de seguridad',
            paragraphs: [
              'Un checksum no prueba autoria ni reemplaza firma digital. Para distribucion sensible, combina hash con firma criptografica y canal confiable.',
            ],
          },
        ],
        faq: [
          { question: 'El archivo se sube al servidor?', answer: 'No por defecto. El navegador lee el archivo local y calcula los hashes.' },
          { question: 'Que hash debo usar?', answer: 'Prefiere SHA-256 o SHA-512 para integridad moderna. MD5 y SHA-1 son principalmente compatibilidad.' },
          { question: 'Puedo comparar un checksum esperado?', answer: 'Si. Pega el hash esperado y la tabla indica si coincide.' },
          { question: 'Funciona con archivos grandes?', answer: 'Si, pero depende de memoria y rendimiento del dispositivo.' },
        ],
      },
    },
  },
  {
    id: 'exif-viewer',
    slug: 'exif-viewer',
    category: 'documents',
    relatedToolIds: ['redimensionar-imagem', 'image-compression', 'image-converter'],
    content: {
      'pt-br': {
        name: 'Leitor e Removedor de EXIF',
        shortDescription:
          'Leia metadados EXIF, GPS, camera e datas de imagens, copie JSON e baixe uma versao limpa.',
        primaryKeyword: 'leitor removedor exif online',
        secondaryKeywords: [
          'ver exif foto',
          'remover metadados imagem',
          'exif viewer online',
          'remover gps de foto',
          'metadados de imagem',
          'limpar exif jpg',
        ],
        searchIntent:
          'Usuarios que querem auditar ou remover metadados de fotos antes de publicar, enviar ou arquivar.',
        seoTitle: 'Leitor e Removedor de EXIF Online | Metadados e GPS',
        seoDescription:
          'Veja EXIF de imagens localmente, identifique camera/GPS/data e baixe uma copia limpa sem metadados.',
        h1: 'Leitor e Removedor de EXIF de Imagem',
        intro:
          'Envie uma imagem, leia metadados EXIF/IPTC/XMP quando disponiveis e gere uma copia limpa via canvas.',
        contentBlocks: [
          {
            title: 'O que metadados de imagem podem revelar',
            paragraphs: [
              'Fotos podem carregar camera, lente, horario, orientacao, software de edicao e ate coordenadas GPS. Ver esses campos antes de publicar ajuda em privacidade e auditoria.',
              'A leitura depende do formato e dos metadados realmente embutidos. Algumas redes sociais e apps ja removem parte desses dados automaticamente.',
            ],
          },
          {
            title: 'Remocao por renderizacao local',
            paragraphs: [
              'A copia limpa e gerada desenhando a imagem em canvas e exportando em PNG, JPEG ou WEBP. Esse fluxo remove metadados comuns porque cria um novo arquivo visual.',
              localPrivacy['pt-br'],
            ],
            list: ['Copiar JSON dos metadados', 'Exportar relatorio JSON', 'Baixar imagem limpa'],
          },
          {
            title: 'Limites de limpeza',
            paragraphs: [
              'A ferramenta nao remove marcas visuais, watermark, texto dentro da imagem ou informacoes que estejam nos pixels. Ela atua nos metadados embutidos e no arquivo exportado.',
            ],
          },
        ],
        faq: [
          { question: 'Consigo remover GPS da foto?', answer: 'Sim, ao exportar uma copia limpa via canvas, metadados GPS comuns deixam de ir no novo arquivo.' },
          { question: 'Funciona com PNG e WEBP?', answer: 'A leitura varia por formato, mas a exportacao limpa pode ser feita em PNG, JPEG ou WEBP.' },
          { question: 'A imagem e enviada para servidor?', answer: 'Nao por padrao. A leitura e a limpeza acontecem no navegador.' },
          { question: 'Remove texto que aparece na imagem?', answer: 'Nao. Texto visivel faz parte dos pixels e precisa ser editado visualmente.' },
        ],
      },
      en: {
        name: 'EXIF Reader and Remover',
        shortDescription:
          'Read EXIF metadata, GPS, camera, and image dates, copy JSON, and download a cleaned image copy.',
        primaryKeyword: 'exif reader remover online',
        secondaryKeywords: [
          'view photo exif',
          'remove image metadata',
          'exif viewer online',
          'remove gps from photo',
          'image metadata viewer',
          'clean jpg exif',
        ],
        searchIntent:
          'Users who want to audit or remove photo metadata before publishing, sharing, or archiving.',
        seoTitle: 'EXIF Reader and Remover Online | Metadata and GPS',
        seoDescription:
          'View image EXIF locally, detect camera/GPS/date fields, and download a clean copy without metadata.',
        h1: 'EXIF Reader and Image Metadata Remover',
        intro:
          'Upload an image, inspect available EXIF/IPTC/XMP metadata, and generate a clean canvas-rendered copy.',
        contentBlocks: [
          {
            title: 'What image metadata can reveal',
            paragraphs: [
              'Photos can contain camera model, lens, capture time, orientation, editing software, and sometimes GPS coordinates. Checking these fields before publishing helps with privacy and audits.',
              'Metadata availability depends on the format and what is embedded in the file. Some social apps already remove part of this data automatically.',
            ],
          },
          {
            title: 'Local cleanup through rendering',
            paragraphs: [
              'The clean copy is created by drawing the image to canvas and exporting PNG, JPEG, or WEBP. This produces a new visual file without common metadata chunks.',
              localPrivacy.en,
            ],
            list: ['Copy metadata JSON', 'Export JSON report', 'Download clean image'],
          },
          {
            title: 'Cleanup limits',
            paragraphs: [
              'The tool does not remove visible marks, watermarks, text inside the image, or information stored in pixels. It targets embedded metadata and the exported file.',
            ],
          },
        ],
        faq: [
          { question: 'Can it remove GPS from a photo?', answer: 'Yes, exporting a clean canvas copy removes common embedded GPS metadata from the new file.' },
          { question: 'Does it work with PNG and WEBP?', answer: 'Reading varies by format, but clean export supports PNG, JPEG, and WEBP.' },
          { question: 'Is the image uploaded?', answer: 'No by default. Reading and cleanup run in the browser.' },
          { question: 'Does it remove visible text?', answer: 'No. Visible text is part of the pixels and requires visual editing.' },
        ],
      },
      es: {
        name: 'Lector y Removedor de EXIF',
        shortDescription:
          'Lee metadatos EXIF, GPS, camara y fechas de imagenes, copia JSON y descarga una version limpia.',
        primaryKeyword: 'lector removedor exif online',
        secondaryKeywords: [
          'ver exif foto',
          'remover metadatos imagen',
          'exif viewer online',
          'remover gps de foto',
          'metadatos de imagen',
          'limpiar exif jpg',
        ],
        searchIntent:
          'Usuarios que quieren auditar o remover metadatos de fotos antes de publicar, enviar o archivar.',
        seoTitle: 'Lector y Removedor de EXIF Online | Metadatos y GPS',
        seoDescription:
          'Ve EXIF de imagenes localmente, detecta camara/GPS/fecha y descarga una copia limpia sin metadatos.',
        h1: 'Lector y Removedor de EXIF de Imagen',
        intro:
          'Sube una imagen, lee metadatos EXIF/IPTC/XMP disponibles y genera una copia limpia via canvas.',
        contentBlocks: [
          {
            title: 'Que pueden revelar los metadatos',
            paragraphs: [
              'Las fotos pueden incluir camara, lente, horario, orientacion, software de edicion e incluso coordenadas GPS. Revisarlo antes de publicar ayuda a privacidad y auditoria.',
              'La lectura depende del formato y de los metadatos realmente incluidos. Algunas redes sociales ya eliminan parte de estos datos.',
            ],
          },
          {
            title: 'Limpieza local por renderizado',
            paragraphs: [
              'La copia limpia se genera dibujando la imagen en canvas y exportando PNG, JPEG o WEBP. Este flujo crea un archivo nuevo sin metadatos comunes.',
              localPrivacy.es,
            ],
            list: ['Copiar JSON de metadatos', 'Exportar reporte JSON', 'Descargar imagen limpia'],
          },
          {
            title: 'Limites de limpieza',
            paragraphs: [
              'La herramienta no quita marcas visuales, watermarks, texto dentro de la imagen ni informacion en pixeles. Actua sobre metadatos embebidos y archivo exportado.',
            ],
          },
        ],
        faq: [
          { question: 'Puede remover GPS de una foto?', answer: 'Si, al exportar una copia limpia via canvas, los metadatos GPS comunes no van en el nuevo archivo.' },
          { question: 'Funciona con PNG y WEBP?', answer: 'La lectura varia por formato, pero la exportacion limpia soporta PNG, JPEG y WEBP.' },
          { question: 'La imagen se sube al servidor?', answer: 'No por defecto. Lectura y limpieza ocurren en el navegador.' },
          { question: 'Remueve texto visible?', answer: 'No. El texto visible forma parte de los pixeles y requiere edicion visual.' },
        ],
      },
    },
  },
  {
    id: 'redimensionar-imagem',
    slug: 'redimensionar-imagem',
    category: 'documents',
    relatedToolIds: ['image-compression', 'image-converter', 'exif-viewer'],
    content: {
      'pt-br': {
        name: 'Redimensionar e Cortar Imagem',
        shortDescription:
          'Redimensione imagem, recorte em proporcao fixa, gere quadrado central e exporte PNG, JPEG ou WEBP.',
        primaryKeyword: 'redimensionar imagem online',
        secondaryKeywords: [
          'cortar imagem online',
          'resize image online',
          'imagem 1080x1080',
          'converter imagem para quadrado',
          'recortar foto online',
          'exportar webp imagem',
        ],
        searchIntent:
          'Usuarios que precisam adaptar imagens para redes sociais, sites, lojas e documentos sem instalar editor.',
        seoTitle: 'Redimensionar e Cortar Imagem Online | PNG, JPEG e WEBP',
        seoDescription:
          'Envie uma imagem, ajuste largura/altura, escolha fit, cover ou quadrado central e baixe em PNG, JPEG ou WEBP.',
        h1: 'Redimensionar e Cortar Imagem Online',
        intro:
          'Ajuste dimensoes, mantenha proporcao quando quiser, recorte para preencher ou gere um quadrado central pronto para exportar.',
        contentBlocks: [
          {
            title: 'Resize para posts, sites e uploads',
            paragraphs: [
              'Muitos sistemas exigem imagem em tamanho especifico, como 1080x1080, 1200x630 ou banners horizontais. A ferramenta renderiza a nova dimensao em canvas com qualidade alta.',
              'Use ajustar sem cortar para preservar tudo, cortar para preencher para evitar bordas e quadrado central para avatar, catalogo e redes sociais.',
            ],
          },
          {
            title: 'Formatos e qualidade',
            paragraphs: [
              'Voce pode exportar em WEBP para tamanho menor, JPEG para compatibilidade ampla ou PNG quando precisa preservar transparencia e nitidez.',
              localPrivacy['pt-br'],
            ],
            list: ['Controle de largura e altura', 'Modo fit, cover e quadrado', 'Preview antes de baixar'],
          },
          {
            title: 'Cuidados com proporcao',
            paragraphs: [
              'Aumentar uma imagem muito pequena pode gerar perda visual. Para melhor resultado, parta de arquivo maior que o tamanho final e use WEBP/JPEG com qualidade equilibrada.',
            ],
          },
        ],
        faq: [
          { question: 'Posso gerar imagem quadrada?', answer: 'Sim. Use o modo quadrado central e defina largura e altura iguais.' },
          { question: 'Remove metadados?', answer: 'Como a exportacao cria uma nova imagem em canvas, metadados comuns tendem a ficar fora do arquivo final.' },
          { question: 'A imagem e enviada?', answer: 'Nao por padrao. O processamento usa recursos locais do navegador.' },
          { question: 'Qual formato devo baixar?', answer: 'WEBP para web leve, JPEG para compatibilidade e PNG para transparencia ou arte com bordas nítidas.' },
        ],
      },
      en: {
        name: 'Resize and Crop Image',
        shortDescription:
          'Resize images, crop to fixed proportions, create centered squares, and export PNG, JPEG, or WEBP.',
        primaryKeyword: 'resize image online',
        secondaryKeywords: [
          'crop image online',
          'image resizer',
          '1080x1080 image',
          'make image square',
          'crop photo online',
          'export webp image',
        ],
        searchIntent:
          'Users who need to adapt images for social posts, websites, stores, and documents without installing an editor.',
        seoTitle: 'Resize and Crop Image Online | PNG, JPEG, and WEBP',
        seoDescription:
          'Upload an image, set width/height, choose fit, cover, or centered square, and download PNG, JPEG, or WEBP.',
        h1: 'Resize and Crop Image Online',
        intro:
          'Adjust dimensions, keep ratio when needed, crop to cover, or generate a centered square ready to export.',
        contentBlocks: [
          {
            title: 'Resizing for posts, sites, and uploads',
            paragraphs: [
              'Many systems require specific image sizes such as 1080x1080, 1200x630, or horizontal banners. This tool renders the new size on canvas with high quality smoothing.',
              'Use fit to preserve the whole image, cover to fill without borders, and centered square for avatars, catalogs, and social media.',
            ],
          },
          {
            title: 'Formats and quality',
            paragraphs: [
              'Export WEBP for smaller web files, JPEG for wide compatibility, or PNG when you need transparency and crisp edges.',
              localPrivacy.en,
            ],
            list: ['Width and height control', 'Fit, cover, and square modes', 'Preview before download'],
          },
          {
            title: 'Ratio considerations',
            paragraphs: [
              'Upscaling a very small image may reduce visual quality. For best results, start from a file larger than the final size and choose balanced WEBP/JPEG quality.',
            ],
          },
        ],
        faq: [
          { question: 'Can I create a square image?', answer: 'Yes. Use centered square mode and set equal width and height.' },
          { question: 'Does it remove metadata?', answer: 'Because export creates a new canvas image, common metadata is usually not included in the final file.' },
          { question: 'Is the image uploaded?', answer: 'No by default. Processing uses local browser capabilities.' },
          { question: 'Which format should I download?', answer: 'WEBP for lightweight web use, JPEG for compatibility, and PNG for transparency or sharp graphics.' },
        ],
      },
      es: {
        name: 'Redimensionar y Cortar Imagen',
        shortDescription:
          'Redimensiona imagenes, recorta con proporcion fija, crea cuadrados centrales y exporta PNG, JPEG o WEBP.',
        primaryKeyword: 'redimensionar imagen online',
        secondaryKeywords: [
          'cortar imagen online',
          'resize image online',
          'imagen 1080x1080',
          'convertir imagen a cuadrado',
          'recortar foto online',
          'exportar webp imagen',
        ],
        searchIntent:
          'Usuarios que necesitan adaptar imagenes para redes, sitios, tiendas y documentos sin instalar editor.',
        seoTitle: 'Redimensionar y Cortar Imagen Online | PNG, JPEG y WEBP',
        seoDescription:
          'Sube una imagen, ajusta ancho/alto, elige fit, cover o cuadrado central y descarga PNG, JPEG o WEBP.',
        h1: 'Redimensionar y Cortar Imagen Online',
        intro:
          'Ajusta dimensiones, conserva proporcion cuando quieras, recorta para cubrir o genera un cuadrado central listo para exportar.',
        contentBlocks: [
          {
            title: 'Resize para posts, sitios y uploads',
            paragraphs: [
              'Muchos sistemas exigen tamanos especificos como 1080x1080, 1200x630 o banners horizontales. La herramienta renderiza el nuevo tamano en canvas con calidad alta.',
              'Usa ajustar sin cortar para preservar todo, cubrir para evitar bordes y cuadrado central para avatar, catalogo y redes sociales.',
            ],
          },
          {
            title: 'Formatos y calidad',
            paragraphs: [
              'Exporta WEBP para archivos web menores, JPEG para compatibilidad amplia o PNG si necesitas transparencia y bordes nitidos.',
              localPrivacy.es,
            ],
            list: ['Control de ancho y alto', 'Modos fit, cover y cuadrado', 'Preview antes de descargar'],
          },
          {
            title: 'Cuidados con proporcion',
            paragraphs: [
              'Aumentar una imagen muy pequena puede reducir calidad visual. Para mejor resultado, parte de un archivo mayor que el tamano final.',
            ],
          },
        ],
        faq: [
          { question: 'Puedo crear una imagen cuadrada?', answer: 'Si. Usa el modo cuadrado central y define ancho y alto iguales.' },
          { question: 'Remueve metadatos?', answer: 'Como la exportacion crea una nueva imagen en canvas, metadatos comunes no suelen incluirse.' },
          { question: 'La imagen se sube?', answer: 'No por defecto. El procesamiento usa recursos locales del navegador.' },
          { question: 'Que formato debo descargar?', answer: 'WEBP para web ligera, JPEG para compatibilidad y PNG para transparencia o graficos nitidos.' },
        ],
      },
    },
  },
  {
    id: 'pdf-organizer',
    slug: 'pdf-organizer',
    category: 'documents',
    relatedToolIds: ['image-converter', 'file-checksum', 'gzip-deflate-zip'],
    content: {
      'pt-br': {
        name: 'Juntar, Dividir e Reordenar PDF',
        shortDescription:
          'Combine PDFs, reordene arquivos, remova itens e divida paginas em ZIP opcionalmente protegido por senha.',
        primaryKeyword: 'juntar dividir reordenar pdf online',
        secondaryKeywords: [
          'juntar pdf online',
          'dividir pdf em paginas',
          'reordenar pdf',
          'remover paginas pdf',
          'organizador pdf',
          'pdf para zip paginas',
        ],
        searchIntent:
          'Usuarios que precisam montar ou separar documentos PDF localmente antes de enviar, arquivar ou imprimir.',
        seoTitle: 'Juntar, Dividir e Reordenar PDF Online | ZIP de Paginas',
        seoDescription:
          'Selecione PDFs, reordene a fila, junte em um arquivo ou divida o primeiro PDF em paginas separadas dentro de ZIP.',
        h1: 'Juntar, Dividir e Reordenar PDF Online',
        intro:
          'Envie PDFs, organize a ordem, remova arquivos da fila e exporte um PDF combinado ou paginas separadas em ZIP.',
        contentBlocks: [
          {
            title: 'Organizacao pratica de documentos',
            paragraphs: [
              'A interface trabalha com uma fila de arquivos. Voce pode mover PDFs para cima ou para baixo, remover itens e criar um documento final na ordem correta.',
              'O modo dividir pega o primeiro PDF da fila e exporta cada pagina como arquivo separado dentro de um ZIP, util para anexos, contratos e documentos escaneados.',
            ],
          },
          {
            title: 'ZIP opcional com senha',
            paragraphs: [
              'Ao dividir paginas, voce pode definir senha no ZIP quando o navegador e a biblioteca suportarem criptografia. O merge de PDF gera um arquivo PDF simples.',
              localPrivacy['pt-br'],
            ],
            list: ['Juntar varios PDFs', 'Reordenar fila', 'Dividir paginas em ZIP'],
          },
          {
            title: 'Limites para PDF protegido',
            paragraphs: [
              'PDFs criptografados, corrompidos ou com protecoes especificas podem falhar na leitura. Em documentos sensiveis, revise o arquivo gerado antes de compartilhar.',
            ],
          },
        ],
        faq: [
          { question: 'Consigo reordenar os PDFs?', answer: 'Sim. Use os botoes subir e descer na fila antes de juntar.' },
          { question: 'Divide todas as paginas?', answer: 'Sim. O modo dividir gera um PDF por pagina do primeiro arquivo da fila.' },
          { question: 'Os PDFs sao enviados?', answer: 'Nao por padrao. A montagem usa processamento local no navegador.' },
          { question: 'Aceita ZIP com senha?', answer: 'Sim para o pacote ZIP, quando suportado pelo navegador e pela biblioteca usada.' },
        ],
      },
      en: {
        name: 'Merge, Split, and Reorder PDF',
        shortDescription:
          'Combine PDFs, reorder files, remove items, and split pages into an optionally password-protected ZIP.',
        primaryKeyword: 'merge split reorder pdf online',
        secondaryKeywords: [
          'merge pdf online',
          'split pdf pages',
          'reorder pdf',
          'remove pdf pages',
          'pdf organizer',
          'pdf pages to zip',
        ],
        searchIntent:
          'Users who need to assemble or split PDF documents locally before sending, archiving, or printing.',
        seoTitle: 'Merge, Split, and Reorder PDF Online | Page ZIP Export',
        seoDescription:
          'Select PDFs, reorder the queue, merge into one file, or split the first PDF into separate page files inside a ZIP.',
        h1: 'Merge, Split, and Reorder PDF Online',
        intro:
          'Upload PDFs, organize order, remove files from the queue, and export a merged PDF or separate pages in ZIP.',
        contentBlocks: [
          {
            title: 'Practical document organization',
            paragraphs: [
              'The interface works with a file queue. Move PDFs up or down, remove items, and create a final document in the exact order you need.',
              'Split mode takes the first PDF in the queue and exports each page as a separate file inside a ZIP, useful for attachments, contracts, and scanned documents.',
            ],
          },
          {
            title: 'Optional password ZIP',
            paragraphs: [
              'When splitting pages, you can set a ZIP password where the browser and library support encryption. PDF merge creates a regular PDF file.',
              localPrivacy.en,
            ],
            list: ['Merge multiple PDFs', 'Reorder queue', 'Split pages to ZIP'],
          },
          {
            title: 'Protected PDF limits',
            paragraphs: [
              'Encrypted, corrupted, or specially protected PDFs may fail to load. For sensitive documents, review the generated file before sharing it.',
            ],
          },
        ],
        faq: [
          { question: 'Can I reorder PDFs?', answer: 'Yes. Use move up and move down buttons before merging.' },
          { question: 'Does split export every page?', answer: 'Yes. Split mode creates one PDF per page from the first file in the queue.' },
          { question: 'Are PDFs uploaded?', answer: 'No by default. Assembly uses local browser processing.' },
          { question: 'Can the ZIP use a password?', answer: 'Yes for the ZIP package when supported by the browser and library.' },
        ],
      },
      es: {
        name: 'Unir, Dividir y Reordenar PDF',
        shortDescription:
          'Combina PDFs, reordena archivos, elimina elementos y divide paginas en ZIP opcionalmente protegido.',
        primaryKeyword: 'unir dividir reordenar pdf online',
        secondaryKeywords: [
          'unir pdf online',
          'dividir pdf paginas',
          'reordenar pdf',
          'remover paginas pdf',
          'organizador pdf',
          'pdf a zip paginas',
        ],
        searchIntent:
          'Usuarios que necesitan montar o separar documentos PDF localmente antes de enviar, archivar o imprimir.',
        seoTitle: 'Unir, Dividir y Reordenar PDF Online | ZIP de Paginas',
        seoDescription:
          'Selecciona PDFs, reordena la cola, une en un archivo o divide el primer PDF en paginas separadas dentro de ZIP.',
        h1: 'Unir, Dividir y Reordenar PDF Online',
        intro:
          'Sube PDFs, organiza el orden, elimina archivos de la cola y exporta un PDF unido o paginas separadas en ZIP.',
        contentBlocks: [
          {
            title: 'Organizacion practica de documentos',
            paragraphs: [
              'La interfaz trabaja con una cola de archivos. Puedes mover PDFs arriba o abajo, eliminar items y crear un documento final en el orden correcto.',
              'El modo dividir toma el primer PDF de la cola y exporta cada pagina como archivo separado dentro de un ZIP.',
            ],
          },
          {
            title: 'ZIP opcional con contrasena',
            paragraphs: [
              'Al dividir paginas, puedes definir contrasena en el ZIP cuando navegador y biblioteca soporten cifrado. La union genera un PDF simple.',
              localPrivacy.es,
            ],
            list: ['Unir varios PDFs', 'Reordenar cola', 'Dividir paginas en ZIP'],
          },
          {
            title: 'Limites de PDF protegido',
            paragraphs: [
              'PDFs cifrados, corruptos o con protecciones especificas pueden fallar. En documentos sensibles, revisa el archivo generado antes de compartir.',
            ],
          },
        ],
        faq: [
          { question: 'Puedo reordenar PDFs?', answer: 'Si. Usa los botones subir y bajar antes de unir.' },
          { question: 'Divide todas las paginas?', answer: 'Si. El modo dividir crea un PDF por pagina del primer archivo.' },
          { question: 'Los PDFs se suben?', answer: 'No por defecto. La organizacion usa procesamiento local.' },
          { question: 'Acepta ZIP con contrasena?', answer: 'Si para el ZIP, cuando el navegador y la biblioteca lo soportan.' },
        ],
      },
    },
  },
  {
    id: 'favicon-generator',
    slug: 'favicon-generator',
    category: 'dev',
    relatedToolIds: ['image-converter', 'image-to-base64', 'open-graph-preview'],
    content: {
      'pt-br': {
        name: 'Gerador de Favicon e Manifest',
        shortDescription:
          'Gere favicon.ico, PNGs, Apple Touch Icon, maskable icons, manifest PWA e snippet HTML em um ZIP.',
        primaryKeyword: 'gerador de favicon e manifest',
        secondaryKeywords: [
          'gerador favicon online',
          'criar favicon ico',
          'gerar icone pwa',
          'site webmanifest generator',
          'apple touch icon generator',
          'maskable icon pwa',
        ],
        searchIntent:
          'Devs e criadores de site que precisam transformar uma imagem base em pacote completo de icones web/PWA.',
        seoTitle: 'Gerador de Favicon e Manifest PWA | ICO, PNG e HTML',
        seoDescription:
          'Envie uma imagem e gere pacote com favicon.ico, icons PNG, Apple Touch Icon, manifest.webmanifest e snippet HTML.',
        h1: 'Gerador de Favicon, Manifest e Icones PWA',
        intro:
          'Crie um pacote de favicon inspirado em fluxos completos: ICO, PNGs, maskable icons, manifest e tags HTML prontas.',
        contentBlocks: [
          {
            title: 'Pacote completo para navegador e PWA',
            paragraphs: [
              'Um favicon moderno nao e apenas um arquivo .ico. Sites e PWAs usam tamanhos diferentes para abas, atalhos, iOS, Android e telas iniciais.',
              'A ferramenta gera favicon.ico com multiplos tamanhos, PNGs padrao, Apple Touch Icon, maskable icons e site.webmanifest com nome, cor e modo de exibicao.',
            ],
          },
          {
            title: 'Snippet HTML e ZIP pronto',
            paragraphs: [
              'Depois de gerar, voce pode copiar o HTML para o head da pagina, copiar o manifest ou baixar todos os arquivos em ZIP para colocar na pasta public.',
              localPrivacy['pt-br'],
            ],
            list: ['favicon.ico multi-size', 'web-app-manifest 192/512', 'maskable icons para PWA'],
          },
          {
            title: 'Qualidade da imagem base',
            paragraphs: [
              'Use imagem quadrada, simples e com boa margem visual. Logos complexos podem perder leitura em 16x16, entao teste o preview em tamanhos pequenos.',
            ],
          },
        ],
        faq: [
          { question: 'Gera favicon.ico de verdade?', answer: 'Sim. O pacote inclui um ICO com entradas PNG em tamanhos comuns.' },
          { question: 'Inclui manifest PWA?', answer: 'Sim. A ferramenta cria site.webmanifest com nome, cores, display e icons.' },
          { question: 'Posso copiar as tags HTML?', answer: 'Sim. O snippet HTML fica disponivel para copiar depois da geracao.' },
          { question: 'A imagem e enviada?', answer: 'Nao por padrao. Os icones sao renderizados localmente no navegador.' },
        ],
      },
      en: {
        name: 'Favicon and Manifest Generator',
        shortDescription:
          'Generate favicon.ico, PNGs, Apple Touch Icon, maskable icons, PWA manifest, and HTML snippet in a ZIP.',
        primaryKeyword: 'favicon and manifest generator',
        secondaryKeywords: [
          'favicon generator online',
          'create favicon ico',
          'pwa icon generator',
          'site webmanifest generator',
          'apple touch icon generator',
          'maskable icon pwa',
        ],
        searchIntent:
          'Developers and site owners who need to turn a base image into a complete web/PWA icon package.',
        seoTitle: 'Favicon and PWA Manifest Generator | ICO, PNG, and HTML',
        seoDescription:
          'Upload an image and generate favicon.ico, PNG icons, Apple Touch Icon, webmanifest, and ready-to-copy HTML snippet.',
        h1: 'Favicon, Manifest, and PWA Icon Generator',
        intro:
          'Create a full favicon package: ICO, PNGs, maskable icons, manifest, and ready HTML tags.',
        contentBlocks: [
          {
            title: 'Complete package for browsers and PWAs',
            paragraphs: [
              'A modern favicon is not just one .ico file. Websites and PWAs use different sizes for tabs, shortcuts, iOS, Android, and home screens.',
              'The tool generates multi-size favicon.ico, standard PNGs, Apple Touch Icon, maskable icons, and site.webmanifest with name, color, and display mode.',
            ],
          },
          {
            title: 'Ready HTML snippet and ZIP',
            paragraphs: [
              'After generation, copy the HTML for your head tag, copy the manifest, or download all files in a ZIP to place in your public folder.',
              localPrivacy.en,
            ],
            list: ['Multi-size favicon.ico', '192/512 web app icons', 'PWA maskable icons'],
          },
          {
            title: 'Base image quality',
            paragraphs: [
              'Use a square, simple image with enough visual margin. Complex logos may lose readability at 16x16, so check small previews before shipping.',
            ],
          },
        ],
        faq: [
          { question: 'Does it create a real favicon.ico?', answer: 'Yes. The package includes an ICO with common embedded PNG sizes.' },
          { question: 'Does it include a PWA manifest?', answer: 'Yes. It creates site.webmanifest with name, colors, display mode, and icons.' },
          { question: 'Can I copy the HTML tags?', answer: 'Yes. The HTML snippet is available after generation.' },
          { question: 'Is the image uploaded?', answer: 'No by default. Icons are rendered locally in the browser.' },
        ],
      },
      es: {
        name: 'Generador de Favicon y Manifest',
        shortDescription:
          'Genera favicon.ico, PNGs, Apple Touch Icon, iconos maskable, manifest PWA y snippet HTML en ZIP.',
        primaryKeyword: 'generador de favicon y manifest',
        secondaryKeywords: [
          'generador favicon online',
          'crear favicon ico',
          'generar icono pwa',
          'site webmanifest generator',
          'apple touch icon generator',
          'maskable icon pwa',
        ],
        searchIntent:
          'Desarrolladores y creadores de sitios que necesitan convertir una imagen base en paquete completo web/PWA.',
        seoTitle: 'Generador de Favicon y Manifest PWA | ICO, PNG y HTML',
        seoDescription:
          'Sube una imagen y genera favicon.ico, iconos PNG, Apple Touch Icon, webmanifest y snippet HTML.',
        h1: 'Generador de Favicon, Manifest e Iconos PWA',
        intro:
          'Crea un paquete completo de favicon: ICO, PNGs, iconos maskable, manifest y tags HTML listas.',
        contentBlocks: [
          {
            title: 'Paquete completo para navegador y PWA',
            paragraphs: [
              'Un favicon moderno no es solo un archivo .ico. Sitios y PWAs usan tamanos distintos para pestanas, accesos, iOS, Android y pantallas iniciales.',
              'La herramienta genera favicon.ico multi-tamano, PNGs, Apple Touch Icon, iconos maskable y site.webmanifest con nombre, color y display.',
            ],
          },
          {
            title: 'Snippet HTML y ZIP listo',
            paragraphs: [
              'Despues de generar, copia el HTML para el head, copia el manifest o descarga todos los archivos en ZIP para ponerlos en public.',
              localPrivacy.es,
            ],
            list: ['favicon.ico multi-size', 'iconos web app 192/512', 'iconos maskable para PWA'],
          },
          {
            title: 'Calidad de imagen base',
            paragraphs: [
              'Usa una imagen cuadrada, simple y con margen visual. Logos complejos pueden perder lectura en 16x16, asi que revisa tamanos pequenos.',
            ],
          },
        ],
        faq: [
          { question: 'Genera favicon.ico real?', answer: 'Si. El paquete incluye un ICO con tamanos PNG comunes.' },
          { question: 'Incluye manifest PWA?', answer: 'Si. Crea site.webmanifest con nombre, colores, display e iconos.' },
          { question: 'Puedo copiar las tags HTML?', answer: 'Si. El snippet HTML queda disponible tras generar.' },
          { question: 'La imagen se sube?', answer: 'No por defecto. Los iconos se renderizan localmente.' },
        ],
      },
    },
  },
  {
    id: 'qr-code-scanner',
    slug: 'qr-code-scanner',
    category: 'utility',
    relatedToolIds: ['qr-code-generator', 'qr-code-wifi-vcard-evento', 'transfer'],
    content: {
      'pt-br': {
        name: 'QR Code Scanner e Decoder',
        shortDescription:
          'Leia QR Code por imagem ou camera, copie o conteudo decodificado e exporte TXT ou JSON.',
        primaryKeyword: 'qr code scanner decoder online',
        secondaryKeywords: [
          'leitor qr code online',
          'scanner qr code imagem',
          'decodificar qr code',
          'ler qr code camera',
          'qr code para texto',
          'qr code reader browser',
        ],
        searchIntent:
          'Usuarios que precisam ler QR Code de imagem, print ou camera sem instalar aplicativo.',
        seoTitle: 'QR Code Scanner Online | Ler QR por Camera ou Imagem',
        seoDescription:
          'Leia QR Code no navegador usando camera ou upload de imagem, copie o conteudo e exporte TXT ou JSON.',
        h1: 'QR Code Scanner e Decoder Online',
        intro:
          'Use camera ou envie imagem com QR Code para decodificar texto, URL, Wi-Fi, Pix, vCard ou qualquer payload.',
        contentBlocks: [
          {
            title: 'Leitura por camera ou arquivo',
            paragraphs: [
              'A ferramenta pode abrir a camera do dispositivo para leitura em tempo real ou analisar uma imagem enviada, como print, foto ou arquivo baixado.',
              'O resultado aparece como texto bruto para voce copiar, revisar, salvar em TXT ou exportar em JSON.',
            ],
          },
          {
            title: 'Privacidade na leitura',
            paragraphs: [
              'A camera precisa de permissao do navegador e pode ser parada a qualquer momento. Arquivos de imagem sao processados localmente pela biblioteca de leitura.',
              localPrivacy['pt-br'],
            ],
            list: ['Camera com stop manual', 'Upload de imagem', 'Exportacao TXT/JSON'],
          },
          {
            title: 'Conteudos suportados',
            paragraphs: [
              'QR Code pode carregar links, texto, dados Wi-Fi, vCard, calendario, Pix e outros formatos. A ferramenta mostra o payload bruto para voce decidir o proximo passo.',
            ],
          },
        ],
        faq: [
          { question: 'Precisa instalar app?', answer: 'Nao. Funciona no navegador com camera ou upload de imagem.' },
          { question: 'A camera fica ligada?', answer: 'Somente quando voce abre a camera. Use parar camera para encerrar a leitura.' },
          { question: 'Le imagens de print?', answer: 'Sim. Envie uma imagem com QR Code visivel e use ler imagem.' },
          { question: 'O resultado pode ser copiado?', answer: 'Sim. Voce pode copiar, baixar TXT ou exportar JSON.' },
        ],
      },
      en: {
        name: 'QR Code Scanner and Decoder',
        shortDescription:
          'Read QR Codes from image or camera, copy decoded content, and export TXT or JSON.',
        primaryKeyword: 'qr code scanner decoder online',
        secondaryKeywords: [
          'qr code reader online',
          'scan qr code image',
          'decode qr code',
          'read qr code camera',
          'qr code to text',
          'qr code reader browser',
        ],
        searchIntent:
          'Users who need to read QR Codes from an image, screenshot, or camera without installing an app.',
        seoTitle: 'QR Code Scanner Online | Read QR from Camera or Image',
        seoDescription:
          'Read QR Codes in the browser using camera or image upload, copy decoded content, and export TXT or JSON.',
        h1: 'QR Code Scanner and Decoder Online',
        intro:
          'Use camera or upload an image with a QR Code to decode text, URLs, Wi-Fi, Pix, vCard, or any payload.',
        contentBlocks: [
          {
            title: 'Read from camera or file',
            paragraphs: [
              'The tool can open your device camera for live scanning or analyze an uploaded image such as a screenshot, photo, or downloaded file.',
              'The result appears as raw text so you can copy it, review it, save TXT, or export JSON.',
            ],
          },
          {
            title: 'Scanning privacy',
            paragraphs: [
              'Camera access requires browser permission and can be stopped at any time. Image files are processed locally by the QR reading library.',
              localPrivacy.en,
            ],
            list: ['Camera with manual stop', 'Image upload', 'TXT/JSON export'],
          },
          {
            title: 'Supported content',
            paragraphs: [
              'QR Codes can carry links, text, Wi-Fi data, vCard, calendar, Pix, and other formats. The tool shows the raw payload so you can decide the next step.',
            ],
          },
        ],
        faq: [
          { question: 'Do I need to install an app?', answer: 'No. It works in the browser with camera or image upload.' },
          { question: 'Does the camera stay on?', answer: 'Only while you start it. Use stop camera to end scanning.' },
          { question: 'Can it read screenshots?', answer: 'Yes. Upload an image with a visible QR Code and scan it.' },
          { question: 'Can I copy the result?', answer: 'Yes. You can copy it, download TXT, or export JSON.' },
        ],
      },
      es: {
        name: 'QR Code Scanner y Decoder',
        shortDescription:
          'Lee QR Code por imagen o camara, copia contenido decodificado y exporta TXT o JSON.',
        primaryKeyword: 'qr code scanner decoder online',
        secondaryKeywords: [
          'lector qr code online',
          'scanner qr code imagen',
          'decodificar qr code',
          'leer qr code camara',
          'qr code a texto',
          'qr code reader browser',
        ],
        searchIntent:
          'Usuarios que necesitan leer QR Code desde imagen, captura o camara sin instalar aplicacion.',
        seoTitle: 'QR Code Scanner Online | Leer QR por Camara o Imagen',
        seoDescription:
          'Lee QR Code en el navegador usando camara o upload de imagen, copia contenido y exporta TXT o JSON.',
        h1: 'QR Code Scanner y Decoder Online',
        intro:
          'Usa camara o sube una imagen con QR Code para decodificar texto, URL, Wi-Fi, Pix, vCard o cualquier payload.',
        contentBlocks: [
          {
            title: 'Lectura por camara o archivo',
            paragraphs: [
              'La herramienta puede abrir la camara del dispositivo para lectura en tiempo real o analizar una imagen enviada como captura, foto o archivo.',
              'El resultado aparece como texto bruto para copiar, revisar, guardar en TXT o exportar JSON.',
            ],
          },
          {
            title: 'Privacidad en la lectura',
            paragraphs: [
              'La camara necesita permiso del navegador y puede detenerse en cualquier momento. Las imagenes se procesan localmente.',
              localPrivacy.es,
            ],
            list: ['Camara con stop manual', 'Upload de imagen', 'Exportacion TXT/JSON'],
          },
          {
            title: 'Contenidos soportados',
            paragraphs: [
              'QR Code puede cargar links, texto, datos Wi-Fi, vCard, calendario, Pix y otros formatos. La herramienta muestra el payload bruto.',
            ],
          },
        ],
        faq: [
          { question: 'Necesita instalar app?', answer: 'No. Funciona en el navegador con camara o upload de imagen.' },
          { question: 'La camara queda encendida?', answer: 'Solo cuando la abres. Usa parar camara para finalizar.' },
          { question: 'Lee imagenes de captura?', answer: 'Si. Sube una imagen con QR Code visible y leela.' },
          { question: 'El resultado puede copiarse?', answer: 'Si. Puedes copiar, descargar TXT o exportar JSON.' },
        ],
      },
    },
  },
  {
    id: 'qr-code-wifi-vcard-evento',
    slug: 'qr-code-wifi-vcard-evento',
    category: 'utility',
    relatedToolIds: ['qr-code-generator', 'qr-code-scanner', 'gerador-link-whatsapp-telegram'],
    content: {
      'pt-br': {
        name: 'Gerador de QR Wi-Fi, vCard e Evento',
        shortDescription:
          'Crie payloads e QR Codes para Wi-Fi, contato vCard e evento de calendario com download PNG/SVG.',
        primaryKeyword: 'gerador qr code wifi vcard evento',
        secondaryKeywords: [
          'qr code wifi',
          'qr code vcard',
          'qr code calendario',
          'gerar qr contato',
          'wifi qr generator',
          'ics qr code',
        ],
        searchIntent:
          'Usuarios que querem gerar QR Codes utilitarios prontos para compartilhar rede, contato ou evento.',
        seoTitle: 'Gerador de QR Wi-Fi, vCard e Evento | PNG e SVG',
        seoDescription:
          'Monte QR Code para rede Wi-Fi, contato vCard ou evento de calendario, copie payload e baixe PNG ou SVG.',
        h1: 'Gerador de QR Code Wi-Fi, vCard e Evento',
        intro:
          'Preencha dados de Wi-Fi, contato ou calendario, gere o QR Code e exporte imagem ou payload padronizado.',
        contentBlocks: [
          {
            title: 'QR utilitario com payload padronizado',
            paragraphs: [
              'Wi-Fi QR permite compartilhar SSID e senha de forma rapida. vCard facilita salvar contato, e evento cria payload de calendario para convites simples.',
              'A ferramenta mostra o payload bruto para auditoria antes de gerar o QR, evitando caixa-preta em dados sensiveis.',
            ],
          },
          {
            title: 'Exportacao para impressao e web',
            paragraphs: [
              'Baixe PNG para uso direto ou SVG para materiais que precisam escalar melhor. O payload tambem pode ser copiado para documentacao ou testes.',
              localPrivacy['pt-br'],
            ],
            list: ['Wi-Fi WPA/WEP/sem senha', 'Contato vCard 3.0', 'Evento em formato ICS'],
          },
          {
            title: 'Revisao antes de compartilhar',
            paragraphs: [
              'Revise senhas, telefones, emails e horarios antes de publicar. QR Codes impressos sao faceis de copiar, entao evite dados que nao devem circular.',
            ],
          },
        ],
        faq: [
          { question: 'Gera QR de Wi-Fi com senha?', answer: 'Sim. Informe SSID, tipo de seguranca, senha e se a rede e oculta.' },
          { question: 'Posso baixar SVG?', answer: 'Sim. Depois de gerar, baixe PNG ou SVG.' },
          { question: 'O payload fica visivel?', answer: 'Sim. A pagina mostra o payload bruto para revisao e copia.' },
          { question: 'Os dados sao enviados?', answer: 'Nao por padrao. O QR e gerado localmente no navegador.' },
        ],
      },
      en: {
        name: 'Wi-Fi, vCard, and Event QR Generator',
        shortDescription:
          'Create QR Code payloads for Wi-Fi, vCard contacts, and calendar events with PNG/SVG download.',
        primaryKeyword: 'wifi vcard event qr code generator',
        secondaryKeywords: [
          'wifi qr code',
          'vcard qr code',
          'calendar qr code',
          'contact qr generator',
          'wifi qr generator',
          'ics qr code',
        ],
        searchIntent:
          'Users who want practical QR Codes to share a network, contact, or event quickly.',
        seoTitle: 'Wi-Fi, vCard, and Event QR Generator | PNG and SVG',
        seoDescription:
          'Build QR Codes for Wi-Fi networks, vCard contacts, or calendar events, copy payload, and download PNG or SVG.',
        h1: 'Wi-Fi, vCard, and Event QR Code Generator',
        intro:
          'Fill Wi-Fi, contact, or calendar data, generate the QR Code, and export image or standardized payload.',
        contentBlocks: [
          {
            title: 'Practical QR with standard payloads',
            paragraphs: [
              'Wi-Fi QR lets people connect using SSID and password quickly. vCard helps save contacts, and event QR builds a simple calendar payload.',
              'The tool shows the raw payload before generating the QR, which makes sensitive data easier to review.',
            ],
          },
          {
            title: 'Exports for print and web',
            paragraphs: [
              'Download PNG for direct use or SVG for materials that need cleaner scaling. The payload can also be copied for documentation or tests.',
              localPrivacy.en,
            ],
            list: ['WPA/WEP/no-password Wi-Fi', 'vCard 3.0 contact', 'ICS calendar event'],
          },
          {
            title: 'Review before sharing',
            paragraphs: [
              'Check passwords, phone numbers, emails, and times before publishing. Printed QR Codes are easy to copy, so avoid data that should not circulate.',
            ],
          },
        ],
        faq: [
          { question: 'Can it create password Wi-Fi QR?', answer: 'Yes. Enter SSID, security type, password, and hidden network flag.' },
          { question: 'Can I download SVG?', answer: 'Yes. After generation, download PNG or SVG.' },
          { question: 'Is the payload visible?', answer: 'Yes. The page shows raw payload for review and copy.' },
          { question: 'Are the data uploaded?', answer: 'No by default. QR generation happens locally in the browser.' },
        ],
      },
      es: {
        name: 'Generador de QR Wi-Fi, vCard y Evento',
        shortDescription:
          'Crea payloads y QR Codes para Wi-Fi, contacto vCard y evento de calendario con descarga PNG/SVG.',
        primaryKeyword: 'generador qr code wifi vcard evento',
        secondaryKeywords: [
          'qr code wifi',
          'qr code vcard',
          'qr code calendario',
          'generar qr contacto',
          'wifi qr generator',
          'ics qr code',
        ],
        searchIntent:
          'Usuarios que quieren generar QR Codes utiles para compartir red, contacto o evento.',
        seoTitle: 'Generador de QR Wi-Fi, vCard y Evento | PNG y SVG',
        seoDescription:
          'Crea QR Code para red Wi-Fi, contacto vCard o evento de calendario, copia payload y descarga PNG o SVG.',
        h1: 'Generador de QR Code Wi-Fi, vCard y Evento',
        intro:
          'Completa datos de Wi-Fi, contacto o calendario, genera el QR Code y exporta imagen o payload.',
        contentBlocks: [
          {
            title: 'QR utilitario con payload estandar',
            paragraphs: [
              'Wi-Fi QR permite compartir SSID y contrasena rapidamente. vCard facilita guardar contacto y evento crea payload de calendario.',
              'La herramienta muestra el payload bruto antes de generar el QR, util para revisar datos sensibles.',
            ],
          },
          {
            title: 'Exportacion para impresion y web',
            paragraphs: [
              'Descarga PNG para uso directo o SVG para materiales que necesitan escalar mejor. El payload tambien puede copiarse para docs o pruebas.',
              localPrivacy.es,
            ],
            list: ['Wi-Fi WPA/WEP/sin contrasena', 'Contacto vCard 3.0', 'Evento calendario ICS'],
          },
          {
            title: 'Revision antes de compartir',
            paragraphs: [
              'Revisa contrasenas, telefonos, emails y horarios antes de publicar. QR Codes impresos son faciles de copiar.',
            ],
          },
        ],
        faq: [
          { question: 'Genera QR de Wi-Fi con contrasena?', answer: 'Si. Informa SSID, seguridad, contrasena y si la red es oculta.' },
          { question: 'Puedo descargar SVG?', answer: 'Si. Despues de generar, descarga PNG o SVG.' },
          { question: 'El payload queda visible?', answer: 'Si. La pagina muestra el payload bruto para revisar y copiar.' },
          { question: 'Los datos se envian?', answer: 'No por defecto. El QR se genera localmente.' },
        ],
      },
    },
  },
  {
    id: 'json-para-typescript',
    slug: 'json-para-typescript',
    category: 'dev',
    relatedToolIds: ['json-formatter', 'code-converter', 'jwt-decoder'],
    content: {
      'pt-br': {
        name: 'JSON para TypeScript, Zod e Schema',
        shortDescription:
          'Cole JSON real e gere interface TypeScript, schema Zod e JSON Schema com exportacao em ZIP.',
        primaryKeyword: 'json para typescript zod schema',
        secondaryKeywords: [
          'json to typescript',
          'json para zod',
          'gerador json schema',
          'typescript interface from json',
          'zod schema generator',
          'converter json em tipo',
        ],
        searchIntent:
          'Devs que precisam transformar payloads reais em tipos, validadores e schemas para acelerar integracoes.',
        seoTitle: 'JSON para TypeScript, Zod e JSON Schema | Gerador Online',
        seoDescription:
          'Cole JSON e gere interface TypeScript, schema Zod e JSON Schema com copia por aba e exportacao ZIP.',
        h1: 'JSON para TypeScript, Zod e JSON Schema',
        intro:
          'Transforme um exemplo JSON em codigo reutilizavel para tipagem, validacao runtime e documentacao de APIs.',
        contentBlocks: [
          {
            title: 'Inferencia a partir de exemplo real',
            paragraphs: [
              'A ferramenta analisa objetos, arrays, strings, numeros, booleanos e null para criar um modelo inicial. Ela tambem identifica formatos comuns como email, URL, UUID e datas.',
              'Arrays com objetos diferentes viram tipos combinados quando possivel. O resultado e um ponto de partida que deve ser revisado antes de ir para producao.',
            ],
          },
          {
            title: 'Tres saidas para o mesmo payload',
            paragraphs: [
              'TypeScript ajuda em autocomplete e contratos de codigo. Zod adiciona validacao runtime, e JSON Schema serve para documentacao, validacao e ferramentas externas.',
              localPrivacy['pt-br'],
            ],
            list: ['Interface TypeScript', 'Schema Zod', 'JSON Schema draft 2020-12'],
          },
          {
            title: 'Quando revisar manualmente',
            paragraphs: [
              'JSON de exemplo nao revela campos opcionais ausentes, regras de negocio, enums fechados ou limites numericos. Ajuste o codigo gerado conforme a API real.',
            ],
          },
        ],
        faq: [
          { question: 'Gera Zod?', answer: 'Sim. A ferramenta cria schema Zod e tipo inferido.' },
          { question: 'Suporta array na raiz?', answer: 'Sim. Ela gera tipo de item e alias de lista quando a raiz e array.' },
          { question: 'Posso exportar tudo?', answer: 'Sim. Baixe ZIP com arquivos TypeScript, Zod e JSON Schema.' },
          { question: 'O JSON e enviado?', answer: 'Nao por padrao. A inferencia roda no navegador.' },
        ],
      },
      en: {
        name: 'JSON to TypeScript, Zod, and Schema',
        shortDescription:
          'Paste real JSON and generate TypeScript interfaces, Zod schema, and JSON Schema with ZIP export.',
        primaryKeyword: 'json to typescript zod schema',
        secondaryKeywords: [
          'json to typescript',
          'json to zod',
          'json schema generator',
          'typescript interface from json',
          'zod schema generator',
          'convert json to type',
        ],
        searchIntent:
          'Developers who need to turn real payloads into types, validators, and schemas faster.',
        seoTitle: 'JSON to TypeScript, Zod, and JSON Schema | Online Generator',
        seoDescription:
          'Paste JSON and generate TypeScript interface, Zod schema, and JSON Schema with tab copy and ZIP export.',
        h1: 'JSON to TypeScript, Zod, and JSON Schema',
        intro:
          'Turn a JSON example into reusable code for typing, runtime validation, and API documentation.',
        contentBlocks: [
          {
            title: 'Inference from real examples',
            paragraphs: [
              'The tool analyzes objects, arrays, strings, numbers, booleans, and null to create a starter model. It also detects common string formats like email, URL, UUID, and dates.',
              'Arrays with different objects become combined types where possible. The output is a starting point that should be reviewed before production.',
            ],
          },
          {
            title: 'Three outputs for one payload',
            paragraphs: [
              'TypeScript helps with autocomplete and code contracts. Zod adds runtime validation, while JSON Schema works for documentation, validation, and external tooling.',
              localPrivacy.en,
            ],
            list: ['TypeScript interface', 'Zod schema', 'JSON Schema draft 2020-12'],
          },
          {
            title: 'When to review manually',
            paragraphs: [
              'A JSON example does not reveal missing optional fields, business rules, closed enums, or numeric limits. Adjust generated code against the real API.',
            ],
          },
        ],
        faq: [
          { question: 'Does it generate Zod?', answer: 'Yes. It creates a Zod schema and inferred type.' },
          { question: 'Does it support root arrays?', answer: 'Yes. It generates an item type and list alias when the root is an array.' },
          { question: 'Can I export everything?', answer: 'Yes. Download a ZIP with TypeScript, Zod, and JSON Schema files.' },
          { question: 'Is JSON uploaded?', answer: 'No by default. Inference runs in the browser.' },
        ],
      },
      es: {
        name: 'JSON a TypeScript, Zod y Schema',
        shortDescription:
          'Pega JSON real y genera interfaz TypeScript, schema Zod y JSON Schema con exportacion ZIP.',
        primaryKeyword: 'json a typescript zod schema',
        secondaryKeywords: [
          'json to typescript',
          'json a zod',
          'generador json schema',
          'typescript interface from json',
          'zod schema generator',
          'convertir json en tipo',
        ],
        searchIntent:
          'Desarrolladores que necesitan transformar payloads reales en tipos, validadores y schemas.',
        seoTitle: 'JSON a TypeScript, Zod y JSON Schema | Generador Online',
        seoDescription:
          'Pega JSON y genera interfaz TypeScript, schema Zod y JSON Schema con copia por pestana y ZIP.',
        h1: 'JSON a TypeScript, Zod y JSON Schema',
        intro:
          'Transforma un ejemplo JSON en codigo reutilizable para tipado, validacion runtime y documentacion de APIs.',
        contentBlocks: [
          {
            title: 'Inferencia desde ejemplo real',
            paragraphs: [
              'La herramienta analiza objetos, arrays, strings, numeros, booleanos y null para crear un modelo inicial. Tambien detecta email, URL, UUID y fechas.',
              'Arrays con objetos diferentes se combinan cuando es posible. El resultado es un punto de partida para revisar antes de produccion.',
            ],
          },
          {
            title: 'Tres salidas para el mismo payload',
            paragraphs: [
              'TypeScript ayuda con autocomplete y contratos. Zod agrega validacion runtime, y JSON Schema sirve para documentacion y herramientas externas.',
              localPrivacy.es,
            ],
            list: ['Interfaz TypeScript', 'Schema Zod', 'JSON Schema draft 2020-12'],
          },
          {
            title: 'Cuando revisar manualmente',
            paragraphs: [
              'Un JSON de ejemplo no revela campos opcionales ausentes, reglas de negocio, enums cerrados ni limites numericos. Ajusta el codigo segun la API real.',
            ],
          },
        ],
        faq: [
          { question: 'Genera Zod?', answer: 'Si. Crea schema Zod y tipo inferido.' },
          { question: 'Soporta array en la raiz?', answer: 'Si. Genera tipo de item y alias de lista cuando la raiz es array.' },
          { question: 'Puedo exportar todo?', answer: 'Si. Descarga ZIP con TypeScript, Zod y JSON Schema.' },
          { question: 'El JSON se envia?', answer: 'No por defecto. La inferencia ocurre en el navegador.' },
        ],
      },
    },
  },
  {
    id: 'cron-generator',
    slug: 'cron-generator',
    category: 'dev',
    relatedToolIds: ['conversor-unix-timestamp', 'json-formatter', 'code-converter'],
    content: {
      'pt-br': {
        name: 'Gerador e Explicador de Cron',
        shortDescription:
          'Monte expressoes cron, leia descricao humana e veja proximas execucoes por timezone.',
        primaryKeyword: 'gerador explicador cron online',
        secondaryKeywords: [
          'cron expression generator',
          'explicar cron',
          'cron para texto',
          'proximas execucoes cron',
          'validar cron online',
          'crontab generator',
        ],
        searchIntent:
          'Devs e operadores que precisam criar ou revisar agendamentos cron sem errar horario.',
        seoTitle: 'Gerador e Explicador de Cron Online | Proximas Execucoes',
        seoDescription:
          'Crie expressoes cron, veja descricao humana, escolha timezone e liste as proximas execucoes.',
        h1: 'Gerador e Explicador de Cron Online',
        intro:
          'Digite ou escolha um preset cron, gere a explicacao em linguagem humana e confira as proximas execucoes.',
        contentBlocks: [
          {
            title: 'Menos erro em agendamentos',
            paragraphs: [
              'Cron e compacto, mas facil de interpretar errado. A ferramenta traduz a expressao e mostra datas futuras para validar se o horario faz sentido.',
              'Use presets para padroes comuns como a cada 5 minutos, dias uteis, primeiro dia do mes ou domingo de madrugada.',
            ],
          },
          {
            title: 'Timezone explicito',
            paragraphs: [
              'O campo de timezone ajuda a simular execucoes no fuso correto, importante para servidores UTC, rotinas em nuvem e times distribuidos.',
              localPrivacy['pt-br'],
            ],
            list: ['Descricao humana', 'Lista de proximas execucoes', 'Copia da expressao cron'],
          },
          {
            title: 'Compatibilidade',
            paragraphs: [
              'Ambientes diferentes podem aceitar variacoes de cron com segundos, ano ou aliases especiais. Confirme a sintaxe suportada pelo seu scheduler antes de publicar.',
            ],
          },
        ],
        faq: [
          { question: 'Mostra proximas execucoes?', answer: 'Sim. A ferramenta lista proximas datas a partir do horario atual.' },
          { question: 'Posso trocar timezone?', answer: 'Sim. Edite o campo de timezone para simular outro fuso.' },
          { question: 'Serve para crontab Linux?', answer: 'Serve como apoio para expressoes de 5 campos, mas confirme particularidades do seu ambiente.' },
          { question: 'A expressao e enviada?', answer: 'Nao por padrao. A analise acontece no navegador.' },
        ],
      },
      en: {
        name: 'Cron Generator and Explainer',
        shortDescription:
          'Build cron expressions, read human descriptions, and preview next runs by timezone.',
        primaryKeyword: 'cron generator explainer online',
        secondaryKeywords: [
          'cron expression generator',
          'explain cron',
          'cron to text',
          'next cron runs',
          'validate cron online',
          'crontab generator',
        ],
        searchIntent:
          'Developers and operators who need to create or review cron schedules without time mistakes.',
        seoTitle: 'Cron Generator and Explainer Online | Next Run Preview',
        seoDescription:
          'Create cron expressions, see a human description, choose timezone, and list upcoming executions.',
        h1: 'Cron Generator and Explainer Online',
        intro:
          'Type or choose a cron preset, generate a human explanation, and check upcoming executions.',
        contentBlocks: [
          {
            title: 'Fewer scheduling mistakes',
            paragraphs: [
              'Cron is compact but easy to misread. This tool translates the expression and shows future dates so you can validate the schedule.',
              'Use presets for common patterns such as every 5 minutes, weekdays, first day of the month, or Sunday early morning.',
            ],
          },
          {
            title: 'Explicit timezone',
            paragraphs: [
              'The timezone field helps simulate runs in the correct zone, important for UTC servers, cloud jobs, and distributed teams.',
              localPrivacy.en,
            ],
            list: ['Human description', 'Upcoming run list', 'Copy cron expression'],
          },
          {
            title: 'Compatibility',
            paragraphs: [
              'Different environments may accept cron variations with seconds, year, or special aliases. Confirm the syntax supported by your scheduler before deploying.',
            ],
          },
        ],
        faq: [
          { question: 'Does it show next runs?', answer: 'Yes. It lists upcoming dates from the current time.' },
          { question: 'Can I change timezone?', answer: 'Yes. Edit the timezone field to simulate another zone.' },
          { question: 'Is it suitable for Linux crontab?', answer: 'It helps with 5-field expressions, but confirm environment-specific syntax.' },
          { question: 'Is the expression uploaded?', answer: 'No by default. Analysis happens in the browser.' },
        ],
      },
      es: {
        name: 'Generador y Explicador de Cron',
        shortDescription:
          'Crea expresiones cron, lee descripcion humana y mira proximas ejecuciones por timezone.',
        primaryKeyword: 'generador explicador cron online',
        secondaryKeywords: [
          'cron expression generator',
          'explicar cron',
          'cron a texto',
          'proximas ejecuciones cron',
          'validar cron online',
          'crontab generator',
        ],
        searchIntent:
          'Desarrolladores y operadores que necesitan crear o revisar cron sin errores de horario.',
        seoTitle: 'Generador y Explicador de Cron Online | Proximas Ejecuciones',
        seoDescription:
          'Crea expresiones cron, ve descripcion humana, elige timezone y lista proximas ejecuciones.',
        h1: 'Generador y Explicador de Cron Online',
        intro:
          'Escribe o elige un preset cron, genera explicacion humana y revisa proximas ejecuciones.',
        contentBlocks: [
          {
            title: 'Menos errores en agendamientos',
            paragraphs: [
              'Cron es compacto, pero facil de leer mal. La herramienta traduce la expresion y muestra fechas futuras para validar el horario.',
              'Usa presets para patrones comunes como cada 5 minutos, dias laborales, primer dia del mes o domingo de madrugada.',
            ],
          },
          {
            title: 'Timezone explicito',
            paragraphs: [
              'El campo timezone ayuda a simular ejecuciones en el fuso correcto, importante para servidores UTC, jobs cloud y equipos distribuidos.',
              localPrivacy.es,
            ],
            list: ['Descripcion humana', 'Lista de proximas ejecuciones', 'Copia de expresion cron'],
          },
          {
            title: 'Compatibilidad',
            paragraphs: [
              'Entornos distintos pueden aceptar variaciones con segundos, ano o aliases especiales. Confirma la sintaxis del scheduler antes de publicar.',
            ],
          },
        ],
        faq: [
          { question: 'Muestra proximas ejecuciones?', answer: 'Si. Lista proximas fechas desde el horario actual.' },
          { question: 'Puedo cambiar timezone?', answer: 'Si. Edita el campo timezone para simular otro fuso.' },
          { question: 'Sirve para crontab Linux?', answer: 'Sirve de apoyo para expresiones de 5 campos, pero confirma detalles del ambiente.' },
          { question: 'La expresion se envia?', answer: 'No por defecto. El analisis ocurre en el navegador.' },
        ],
      },
    },
  },
  {
    id: 'gzip-deflate-zip',
    slug: 'gzip-deflate-zip',
    category: 'dev',
    relatedToolIds: ['file-checksum', 'pdf-organizer', 'conversor-universal'],
    content: {
      'pt-br': {
        name: 'Gzip, Deflate e ZIP com Senha',
        shortDescription:
          'Comprima e descomprima gzip/deflate, compacte arquivos ou pastas em ZIP e extraia ZIP localmente.',
        primaryKeyword: 'gzip deflate zip online',
        secondaryKeywords: [
          'compactar gzip online',
          'descompactar gzip',
          'criar zip com senha',
          'compactar pasta online',
          'deflate online',
          'extrair zip no navegador',
        ],
        searchIntent:
          'Devs e usuarios tecnicos que precisam transformar arquivos compactados sem instalar utilitario desktop.',
        seoTitle: 'Gzip, Deflate e ZIP Online | Compactar, Extrair e Senha',
        seoDescription:
          'Comprima ou descomprima gzip/deflate, crie ZIP com arquivos/pastas e extraia ZIP no navegador.',
        h1: 'Gzip, Deflate e ZIP com Senha Online',
        intro:
          'Selecione arquivos ou pasta, aplique gzip/deflate, crie ZIP opcionalmente criptografado ou extraia um ZIP.',
        contentBlocks: [
          {
            title: 'Fluxos de compactacao em um lugar',
            paragraphs: [
              'Gzip e deflate sao comuns em payloads HTTP, logs e artefatos tecnicos. ZIP e melhor para agrupar varios arquivos ou uma pasta inteira.',
              'A ferramenta usa streams do navegador quando disponiveis e biblioteca ZIP para empacotar, extrair e aplicar senha no pacote.',
            ],
          },
          {
            title: 'Pastas e senha',
            paragraphs: [
              'Use selecionar pasta para manter caminhos relativos em um ZIP. A senha e opcional e serve para reduzir acesso casual ao pacote exportado.',
              localPrivacy['pt-br'],
            ],
            list: ['Gzip/gunzip de arquivo', 'Deflate/inflate', 'ZIP com arquivos ou pasta'],
          },
          {
            title: 'Limites de compatibilidade',
            paragraphs: [
              'CompressionStream pode nao existir em navegadores antigos. ZIP com senha depende do suporte da biblioteca e deve ser testado no destino antes de uso critico.',
            ],
          },
        ],
        faq: [
          { question: 'Compacta pasta inteira?', answer: 'Sim, usando o seletor de pasta quando o navegador suporta webkitdirectory.' },
          { question: 'Cria ZIP com senha?', answer: 'Sim. Informe uma senha antes de criar o ZIP.' },
          { question: 'Descompacta gzip?', answer: 'Sim. Selecione um arquivo .gz e use descompactar gzip.' },
          { question: 'Os arquivos sao enviados?', answer: 'Nao por padrao. O processamento acontece localmente.' },
        ],
      },
      en: {
        name: 'Gzip, Deflate, and Password ZIP',
        shortDescription:
          'Compress/decompress gzip/deflate, package files or folders into ZIP, and extract ZIP locally.',
        primaryKeyword: 'gzip deflate zip online',
        secondaryKeywords: [
          'gzip compressor online',
          'decompress gzip',
          'create password zip',
          'zip folder online',
          'deflate online',
          'extract zip in browser',
        ],
        searchIntent:
          'Developers and technical users who need archive transformations without installing desktop utilities.',
        seoTitle: 'Gzip, Deflate, and ZIP Online | Compress, Extract, Password',
        seoDescription:
          'Compress or decompress gzip/deflate, create ZIP from files/folders, and extract ZIP in the browser.',
        h1: 'Gzip, Deflate, and Password ZIP Online',
        intro:
          'Select files or folders, apply gzip/deflate, create an optionally encrypted ZIP, or extract a ZIP.',
        contentBlocks: [
          {
            title: 'Compression workflows in one place',
            paragraphs: [
              'Gzip and deflate are common in HTTP payloads, logs, and technical artifacts. ZIP is better for grouping multiple files or a whole folder.',
              'The tool uses browser streams when available and a ZIP library to package, extract, and apply a password to the archive.',
            ],
          },
          {
            title: 'Folders and password',
            paragraphs: [
              'Use folder selection to preserve relative paths inside a ZIP. The password is optional and helps reduce casual access to the exported package.',
              localPrivacy.en,
            ],
            list: ['Gzip/gunzip a file', 'Deflate/inflate', 'ZIP files or folder'],
          },
          {
            title: 'Compatibility limits',
            paragraphs: [
              'CompressionStream may be missing in older browsers. Password ZIP depends on library support and should be tested in the target environment before critical use.',
            ],
          },
        ],
        faq: [
          { question: 'Can it compress a folder?', answer: 'Yes, using folder selection where the browser supports webkitdirectory.' },
          { question: 'Can it create password ZIP?', answer: 'Yes. Enter a password before creating the ZIP.' },
          { question: 'Can it decompress gzip?', answer: 'Yes. Select a .gz file and use decompress gzip.' },
          { question: 'Are files uploaded?', answer: 'No by default. Processing happens locally.' },
        ],
      },
      es: {
        name: 'Gzip, Deflate y ZIP con Contrasena',
        shortDescription:
          'Comprime/descomprime gzip/deflate, empaqueta archivos o carpetas en ZIP y extrae ZIP localmente.',
        primaryKeyword: 'gzip deflate zip online',
        secondaryKeywords: [
          'compactar gzip online',
          'descomprimir gzip',
          'crear zip con contrasena',
          'compactar carpeta online',
          'deflate online',
          'extraer zip en navegador',
        ],
        searchIntent:
          'Desarrolladores y usuarios tecnicos que necesitan transformar archivos compactados sin instalar utilidades.',
        seoTitle: 'Gzip, Deflate y ZIP Online | Compactar, Extraer y Contrasena',
        seoDescription:
          'Comprime o descomprime gzip/deflate, crea ZIP con archivos/carpetas y extrae ZIP en el navegador.',
        h1: 'Gzip, Deflate y ZIP con Contrasena Online',
        intro:
          'Selecciona archivos o carpeta, aplica gzip/deflate, crea ZIP opcionalmente cifrado o extrae un ZIP.',
        contentBlocks: [
          {
            title: 'Flujos de compactacion en un lugar',
            paragraphs: [
              'Gzip y deflate son comunes en payloads HTTP, logs y artefactos tecnicos. ZIP es mejor para agrupar varios archivos o una carpeta.',
              'La herramienta usa streams del navegador cuando estan disponibles y biblioteca ZIP para empaquetar, extraer y aplicar contrasena.',
            ],
          },
          {
            title: 'Carpetas y contrasena',
            paragraphs: [
              'Usa seleccionar carpeta para conservar rutas relativas en ZIP. La contrasena es opcional y reduce acceso casual al paquete exportado.',
              localPrivacy.es,
            ],
            list: ['Gzip/gunzip de archivo', 'Deflate/inflate', 'ZIP de archivos o carpeta'],
          },
          {
            title: 'Limites de compatibilidad',
            paragraphs: [
              'CompressionStream puede faltar en navegadores antiguos. ZIP con contrasena depende del soporte de biblioteca y debe probarse en destino.',
            ],
          },
        ],
        faq: [
          { question: 'Compacta carpeta completa?', answer: 'Si, usando selector de carpeta cuando el navegador soporta webkitdirectory.' },
          { question: 'Crea ZIP con contrasena?', answer: 'Si. Informa una contrasena antes de crear el ZIP.' },
          { question: 'Descomprime gzip?', answer: 'Si. Selecciona un .gz y usa descomprimir gzip.' },
          { question: 'Los archivos se envian?', answer: 'No por defecto. El procesamiento ocurre localmente.' },
        ],
      },
    },
  },
  {
    id: 'dns-lookup',
    slug: 'dns-lookup',
    category: 'dev',
    relatedToolIds: ['descobrir-ip-publico', 'open-graph-preview', 'json-formatter'],
    content: {
      'pt-br': {
        name: 'DNS Lookup via DoH',
        shortDescription:
          'Consulte registros DNS A, AAAA, CNAME, MX, TXT, NS, SOA e CAA usando DNS over HTTPS publico.',
        primaryKeyword: 'dns lookup doh online',
        secondaryKeywords: [
          'consultar dns online',
          'verificar dns dominio',
          'dns over https lookup',
          'consultar mx txt',
          'ver registros dns',
          'cloudflare doh dns',
        ],
        searchIntent:
          'Devs, suporte e admins que precisam verificar registros DNS rapidamente sem usar terminal.',
        seoTitle: 'DNS Lookup via DoH | A, MX, TXT, CNAME, NS e CAA',
        seoDescription:
          'Consulte registros DNS por DNS over HTTPS usando Cloudflare ou Google e exporte a resposta JSON.',
        h1: 'DNS Lookup via DNS over HTTPS',
        intro:
          'Digite um dominio, escolha tipo de registro e resolver publico para consultar DNS direto do navegador.',
        contentBlocks: [
          {
            title: 'Consulta DNS sem terminal',
            paragraphs: [
              'DNS lookup ajuda a validar apontamentos de dominio, email, CDN, verificacao de propriedade e configuracoes de seguranca.',
              'A ferramenta consulta resolvers DoH publicos e mostra respostas, TTL, dados brutos e JSON para debug ou suporte.',
            ],
          },
          {
            title: 'Tipos de registro comuns',
            paragraphs: [
              'Use A/AAAA para IP, CNAME para aliases, MX para email, TXT para verificacoes, NS para autoridade, SOA para zona e CAA para politica de certificados.',
              'A consulta usa fetch publico para Cloudflare ou Google. O dominio consultado e enviado ao resolver escolhido, nao ao backend do site.',
            ],
            list: ['Cloudflare DoH', 'Google DoH', 'Exportacao JSON'],
          },
          {
            title: 'Cache e propagacao',
            paragraphs: [
              'Resultados DNS podem variar conforme cache, TTL e propagacao. Para mudancas recentes, compare resolvers e aguarde o TTL anterior expirar.',
            ],
          },
        ],
        faq: [
          { question: 'A consulta passa pelo servidor do site?', answer: 'Nao. O navegador chama diretamente o resolver DoH publico escolhido.' },
          { question: 'Quais registros suporta?', answer: 'A, AAAA, CNAME, MX, TXT, NS, SOA e CAA.' },
          { question: 'Por que meu DNS mudou em um lugar e nao em outro?', answer: 'Cache e TTL podem fazer resolvers retornarem valores diferentes durante propagacao.' },
          { question: 'Posso exportar a resposta?', answer: 'Sim. Copie ou baixe o JSON completo.' },
        ],
      },
      en: {
        name: 'DNS Lookup via DoH',
        shortDescription:
          'Query DNS records A, AAAA, CNAME, MX, TXT, NS, SOA, and CAA using public DNS over HTTPS.',
        primaryKeyword: 'dns lookup doh online',
        secondaryKeywords: [
          'dns lookup online',
          'check domain dns',
          'dns over https lookup',
          'lookup mx txt',
          'view dns records',
          'cloudflare doh dns',
        ],
        searchIntent:
          'Developers, support teams, and admins who need to check DNS records quickly without a terminal.',
        seoTitle: 'DNS Lookup via DoH | A, MX, TXT, CNAME, NS, and CAA',
        seoDescription:
          'Query DNS records through DNS over HTTPS using Cloudflare or Google and export the JSON response.',
        h1: 'DNS Lookup via DNS over HTTPS',
        intro:
          'Enter a domain, choose record type and public resolver, and query DNS directly from the browser.',
        contentBlocks: [
          {
            title: 'DNS checks without terminal',
            paragraphs: [
              'DNS lookup helps validate domain pointing, email, CDN, ownership verification, and security configuration.',
              'The tool queries public DoH resolvers and shows answers, TTL, raw data, and JSON for debugging or support.',
            ],
          },
          {
            title: 'Common record types',
            paragraphs: [
              'Use A/AAAA for IP, CNAME for aliases, MX for email, TXT for verification, NS for authority, SOA for zone data, and CAA for certificate policy.',
              'The browser fetches Cloudflare or Google directly. The queried domain is sent to the chosen resolver, not to the site backend.',
            ],
            list: ['Cloudflare DoH', 'Google DoH', 'JSON export'],
          },
          {
            title: 'Cache and propagation',
            paragraphs: [
              'DNS results may vary because of cache, TTL, and propagation. For recent changes, compare resolvers and wait for previous TTLs to expire.',
            ],
          },
        ],
        faq: [
          { question: 'Does the lookup go through this site server?', answer: 'No. The browser calls the selected public DoH resolver directly.' },
          { question: 'Which records are supported?', answer: 'A, AAAA, CNAME, MX, TXT, NS, SOA, and CAA.' },
          { question: 'Why did DNS change in one place but not another?', answer: 'Cache and TTL can make resolvers return different values during propagation.' },
          { question: 'Can I export the response?', answer: 'Yes. Copy or download the full JSON.' },
        ],
      },
      es: {
        name: 'DNS Lookup via DoH',
        shortDescription:
          'Consulta registros DNS A, AAAA, CNAME, MX, TXT, NS, SOA y CAA usando DNS over HTTPS publico.',
        primaryKeyword: 'dns lookup doh online',
        secondaryKeywords: [
          'consultar dns online',
          'verificar dns dominio',
          'dns over https lookup',
          'consultar mx txt',
          'ver registros dns',
          'cloudflare doh dns',
        ],
        searchIntent:
          'Desarrolladores, soporte y admins que necesitan verificar DNS rapidamente sin terminal.',
        seoTitle: 'DNS Lookup via DoH | A, MX, TXT, CNAME, NS y CAA',
        seoDescription:
          'Consulta registros DNS por DNS over HTTPS usando Cloudflare o Google y exporta respuesta JSON.',
        h1: 'DNS Lookup via DNS over HTTPS',
        intro:
          'Escribe un dominio, elige tipo de registro y resolver publico para consultar DNS desde el navegador.',
        contentBlocks: [
          {
            title: 'Consulta DNS sin terminal',
            paragraphs: [
              'DNS lookup ayuda a validar apuntamientos de dominio, email, CDN, verificacion de propiedad y seguridad.',
              'La herramienta consulta resolvers DoH publicos y muestra respuestas, TTL, datos brutos y JSON.',
            ],
          },
          {
            title: 'Tipos de registro comunes',
            paragraphs: [
              'Usa A/AAAA para IP, CNAME para aliases, MX para email, TXT para verificaciones, NS para autoridad, SOA para zona y CAA para certificados.',
              'La consulta usa fetch publico a Cloudflare o Google. El dominio se envia al resolver elegido, no al backend del sitio.',
            ],
            list: ['Cloudflare DoH', 'Google DoH', 'Exportacion JSON'],
          },
          {
            title: 'Cache y propagacion',
            paragraphs: [
              'Resultados DNS pueden variar por cache, TTL y propagacion. Para cambios recientes, compara resolvers y espera expirar TTLs anteriores.',
            ],
          },
        ],
        faq: [
          { question: 'La consulta pasa por el servidor del sitio?', answer: 'No. El navegador llama directamente al resolver DoH publico elegido.' },
          { question: 'Que registros soporta?', answer: 'A, AAAA, CNAME, MX, TXT, NS, SOA y CAA.' },
          { question: 'Por que DNS cambio en un lugar y no en otro?', answer: 'Cache y TTL pueden hacer que resolvers devuelvan valores distintos durante propagacion.' },
          { question: 'Puedo exportar la respuesta?', answer: 'Si. Copia o descarga el JSON completo.' },
        ],
      },
    },
  },
  {
    id: 'bitcoin-fee-calculator',
    slug: 'bitcoin-fee-calculator',
    category: 'crypto',
    relatedToolIds: ['bitcoin-address-tx-decoder', 'bitcoin-wallet', 'crypto-unit-converter'],
    content: {
      'pt-br': {
        name: 'Calculadora de Fee Bitcoin com Mempool',
        shortDescription:
          'Busque taxas recomendadas em sat/vB, estime custo por vsize e compare prioridades em sats e BTC.',
        primaryKeyword: 'calculadora fee bitcoin mempool',
        secondaryKeywords: [
          'taxa bitcoin hoje',
          'sat vb calculator',
          'bitcoin transaction fee calculator',
          'mempool fee rate',
          'calcular taxa btc',
          'sats para btc fee',
        ],
        searchIntent:
          'Usuarios Bitcoin que precisam estimar custo de transacao por tamanho virtual antes de enviar ou consolidar UTXOs.',
        seoTitle: 'Calculadora de Fee Bitcoin | Mempool sat/vB e BTC',
        seoDescription:
          'Consulte fees recomendadas via mempool, informe vsize e estime custo de transacao em sats e BTC.',
        h1: 'Calculadora de Fee Bitcoin com Dados da Mempool',
        intro:
          'Atualize taxas recomendadas, informe tamanho virtual da transacao e compare prioridade, sats totais e valor em BTC.',
        contentBlocks: [
          {
            title: 'Estimativa por sat/vB',
            paragraphs: [
              'Taxas Bitcoin sao normalmente estimadas em satoshis por virtual byte. Multiplicar sat/vB pelo vsize da transacao da uma estimativa de custo total em sats.',
              'A ferramenta permite comparar rapido, meia hora, uma hora, economica, minima e um valor customizado para planejamento.',
            ],
          },
          {
            title: 'Consulta publica de mempool',
            paragraphs: [
              'O botao atualizar consulta endpoints publicos de fee recomendada para a rede selecionada. Se a API falhar, a tabela ainda mostra valores de exemplo para calculo manual.',
              'Nenhuma chave privada, seed ou assinatura e usada aqui. A pagina apenas calcula custos e mostra dados de fee.',
            ],
            list: ['Mainnet e testnet', 'sat/vB para sats', 'Exportacao JSON'],
          },
          {
            title: 'O que a estimativa nao garante',
            paragraphs: [
              'Fee recomendada muda rapido conforme demanda. O valor nao garante confirmacao em bloco especifico e deve ser conferido no momento de transmitir a transacao.',
            ],
          },
        ],
        faq: [
          { question: 'O que e vsize?', answer: 'E o tamanho virtual da transacao em vB, usado para calcular fee em sat/vB.' },
          { question: 'A ferramenta envia transacao?', answer: 'Nao. Ela apenas estima taxas e nao assina nem transmite nada.' },
          { question: 'Busca dados da mempool?', answer: 'Sim. O botao atualizar consulta API publica de fees quando disponivel.' },
          { question: 'Serve para mainnet?', answer: 'Sim. Voce pode escolher mainnet ou testnet.' },
        ],
      },
      en: {
        name: 'Bitcoin Fee Calculator with Mempool',
        shortDescription:
          'Fetch recommended sat/vB fees, estimate cost by vsize, and compare priorities in sats and BTC.',
        primaryKeyword: 'bitcoin fee calculator mempool',
        secondaryKeywords: [
          'bitcoin fee today',
          'sat vb calculator',
          'bitcoin transaction fee calculator',
          'mempool fee rate',
          'calculate btc fee',
          'sats to btc fee',
        ],
        searchIntent:
          'Bitcoin users who need to estimate transaction cost by virtual size before sending or consolidating UTXOs.',
        seoTitle: 'Bitcoin Fee Calculator | Mempool sat/vB and BTC',
        seoDescription:
          'Fetch recommended mempool fees, enter transaction vsize, and estimate transaction cost in sats and BTC.',
        h1: 'Bitcoin Fee Calculator with Mempool Data',
        intro:
          'Refresh recommended fees, enter transaction virtual size, and compare priority, total sats, and BTC value.',
        contentBlocks: [
          {
            title: 'Estimate by sat/vB',
            paragraphs: [
              'Bitcoin fees are usually estimated in satoshis per virtual byte. Multiplying sat/vB by transaction vsize gives an estimated total cost in sats.',
              'The tool compares fast, half-hour, hour, economy, minimum, and custom rates for planning.',
            ],
          },
          {
            title: 'Public mempool lookup',
            paragraphs: [
              'Refresh queries public recommended fee endpoints for the selected network. If the API fails, the table still shows sample values for manual calculation.',
              'No private key, seed, or signing is involved. This page only calculates costs and displays fee data.',
            ],
            list: ['Mainnet and testnet', 'sat/vB to sats', 'JSON export'],
          },
          {
            title: 'What estimates cannot guarantee',
            paragraphs: [
              'Recommended fees change quickly with demand. The value does not guarantee confirmation in a specific block and should be checked when broadcasting.',
            ],
          },
        ],
        faq: [
          { question: 'What is vsize?', answer: 'It is transaction virtual size in vB, used to calculate fee in sat/vB.' },
          { question: 'Does the tool send transactions?', answer: 'No. It only estimates fees and does not sign or broadcast anything.' },
          { question: 'Does it fetch mempool data?', answer: 'Yes. Refresh queries a public fee API when available.' },
          { question: 'Does it support mainnet?', answer: 'Yes. You can choose mainnet or testnet.' },
        ],
      },
      es: {
        name: 'Calculadora de Fee Bitcoin con Mempool',
        shortDescription:
          'Consulta tasas recomendadas en sat/vB, estima costo por vsize y compara prioridades en sats y BTC.',
        primaryKeyword: 'calculadora fee bitcoin mempool',
        secondaryKeywords: [
          'tasa bitcoin hoy',
          'sat vb calculator',
          'bitcoin transaction fee calculator',
          'mempool fee rate',
          'calcular tasa btc',
          'sats a btc fee',
        ],
        searchIntent:
          'Usuarios Bitcoin que necesitan estimar costo de transaccion por tamano virtual antes de enviar o consolidar UTXOs.',
        seoTitle: 'Calculadora de Fee Bitcoin | Mempool sat/vB y BTC',
        seoDescription:
          'Consulta fees recomendadas via mempool, informa vsize y estima costo de transaccion en sats y BTC.',
        h1: 'Calculadora de Fee Bitcoin con Datos de Mempool',
        intro:
          'Actualiza tasas recomendadas, informa tamano virtual y compara prioridad, sats totales y valor BTC.',
        contentBlocks: [
          {
            title: 'Estimacion por sat/vB',
            paragraphs: [
              'Las fees Bitcoin se estiman normalmente en satoshis por virtual byte. Multiplicar sat/vB por vsize da una estimacion de costo total en sats.',
              'La herramienta compara rapido, media hora, una hora, economica, minima y custom para planificar.',
            ],
          },
          {
            title: 'Consulta publica de mempool',
            paragraphs: [
              'Actualizar consulta endpoints publicos de fee recomendada para la red elegida. Si la API falla, la tabla mantiene valores de ejemplo.',
              'No usa clave privada, seed ni firma. La pagina solo calcula costos y muestra datos de fee.',
            ],
            list: ['Mainnet y testnet', 'sat/vB a sats', 'Exportacion JSON'],
          },
          {
            title: 'Lo que la estimacion no garantiza',
            paragraphs: [
              'La fee recomendada cambia rapido segun demanda. El valor no garantiza confirmacion en un bloque especifico y debe revisarse al transmitir.',
            ],
          },
        ],
        faq: [
          { question: 'Que es vsize?', answer: 'Es el tamano virtual de la transaccion en vB, usado para calcular fee en sat/vB.' },
          { question: 'La herramienta envia transacciones?', answer: 'No. Solo estima fees y no firma ni transmite nada.' },
          { question: 'Busca datos de mempool?', answer: 'Si. Actualizar consulta una API publica cuando esta disponible.' },
          { question: 'Sirve para mainnet?', answer: 'Si. Puedes elegir mainnet o testnet.' },
        ],
      },
    },
  },
  {
    id: 'bitcoin-address-tx-decoder',
    slug: 'bitcoin-address-tx-decoder',
    category: 'crypto',
    relatedToolIds: ['bitcoin-fee-calculator', 'bitcoin-wallet', 'lightning-decoder'],
    content: {
      'pt-br': {
        name: 'Bitcoin Address e TX Decoder Read-only',
        shortDescription:
          'Valide enderecos Bitcoin e decodifique transacoes raw hex sem seed, assinatura ou broadcast.',
        primaryKeyword: 'bitcoin address tx decoder',
        secondaryKeywords: [
          'validar endereco bitcoin',
          'decode bitcoin transaction hex',
          'bitcoin raw tx decoder',
          'scriptpubkey bitcoin',
          'bitcoin address validator',
          'read only bitcoin tool',
        ],
        searchIntent:
          'Devs e usuarios Bitcoin que precisam inspecionar enderecos e raw transactions sem risco de assinar ou transmitir.',
        seoTitle: 'Bitcoin Address e TX Decoder | Read-only e Sem Broadcast',
        seoDescription:
          'Valide enderecos Bitcoin, veja scriptPubKey e decodifique raw transaction hex com inputs, outputs, txid e vsize.',
        h1: 'Bitcoin Address e TX Decoder Read-only',
        intro:
          'Inspecione enderecos e transacoes raw hex em modo somente leitura, sem pedir seed, WIF ou chave privada.',
        contentBlocks: [
          {
            title: 'Inspecao sem risco de envio',
            paragraphs: [
              'A ferramenta valida enderecos por rede e mostra scriptPubKey quando possivel. Para raw transaction, decodifica txid, inputs, outputs, valores, scripts e tamanho virtual.',
              'Ela nao assina, nao transmite e nao solicita seed. O foco e leitura tecnica e debug seguro de dados publicos ou transacoes preparadas.',
            ],
          },
          {
            title: 'Mainnet e testnet',
            paragraphs: [
              'Escolher a rede correta evita falsos negativos em enderecos. Enderecos mainnet e testnet usam prefixos e regras diferentes.',
              localPrivacy['pt-br'],
            ],
            list: ['Validacao de endereco', 'Decode raw hex', 'Exportacao JSON'],
          },
          {
            title: 'Limites de decode',
            paragraphs: [
              'Uma raw transaction isolada pode nao conter detalhes completos dos UTXOs de entrada, como valor anterior. Para auditoria total, combine com dados de explorer ou node.',
            ],
          },
        ],
        faq: [
          { question: 'A ferramenta pede seed?', answer: 'Nao. Ela e read-only e nao precisa de seed, WIF ou chave privada.' },
          { question: 'Transmite transacao?', answer: 'Nao. Ela apenas decodifica raw hex localmente.' },
          { question: 'Mostra txid?', answer: 'Sim. Quando a transacao e valida, mostra txid, vsize, weight, inputs e outputs.' },
          { question: 'Funciona em testnet?', answer: 'Sim. Escolha testnet no seletor de rede.' },
        ],
      },
      en: {
        name: 'Bitcoin Address and TX Decoder Read-only',
        shortDescription:
          'Validate Bitcoin addresses and decode raw hex transactions without seed, signing, or broadcast.',
        primaryKeyword: 'bitcoin address tx decoder',
        secondaryKeywords: [
          'validate bitcoin address',
          'decode bitcoin transaction hex',
          'bitcoin raw tx decoder',
          'scriptpubkey bitcoin',
          'bitcoin address validator',
          'read only bitcoin tool',
        ],
        searchIntent:
          'Developers and Bitcoin users who need to inspect addresses and raw transactions without signing or broadcasting risk.',
        seoTitle: 'Bitcoin Address and TX Decoder | Read-only, No Broadcast',
        seoDescription:
          'Validate Bitcoin addresses, view scriptPubKey, and decode raw transaction hex with inputs, outputs, txid, and vsize.',
        h1: 'Bitcoin Address and TX Decoder Read-only',
        intro:
          'Inspect addresses and raw transaction hex in read-only mode, without asking for seed, WIF, or private key.',
        contentBlocks: [
          {
            title: 'Inspection without sending risk',
            paragraphs: [
              'The tool validates addresses by network and shows scriptPubKey when possible. For raw transactions, it decodes txid, inputs, outputs, values, scripts, and virtual size.',
              'It does not sign, broadcast, or request seed. The focus is technical reading and safe debugging of public data or prepared transactions.',
            ],
          },
          {
            title: 'Mainnet and testnet',
            paragraphs: [
              'Choosing the correct network prevents false negatives. Mainnet and testnet addresses use different prefixes and rules.',
              localPrivacy.en,
            ],
            list: ['Address validation', 'Raw hex decode', 'JSON export'],
          },
          {
            title: 'Decode limits',
            paragraphs: [
              'A standalone raw transaction may not include full previous UTXO details such as input value. For full audit, combine it with explorer or node data.',
            ],
          },
        ],
        faq: [
          { question: 'Does it ask for seed?', answer: 'No. It is read-only and does not need seed, WIF, or private key.' },
          { question: 'Does it broadcast transactions?', answer: 'No. It only decodes raw hex locally.' },
          { question: 'Does it show txid?', answer: 'Yes. For valid transactions it shows txid, vsize, weight, inputs, and outputs.' },
          { question: 'Does it work on testnet?', answer: 'Yes. Choose testnet in the network selector.' },
        ],
      },
      es: {
        name: 'Bitcoin Address y TX Decoder Read-only',
        shortDescription:
          'Valida direcciones Bitcoin y decodifica transacciones raw hex sin seed, firma ni broadcast.',
        primaryKeyword: 'bitcoin address tx decoder',
        secondaryKeywords: [
          'validar direccion bitcoin',
          'decode bitcoin transaction hex',
          'bitcoin raw tx decoder',
          'scriptpubkey bitcoin',
          'bitcoin address validator',
          'read only bitcoin tool',
        ],
        searchIntent:
          'Desarrolladores y usuarios Bitcoin que necesitan inspeccionar direcciones y raw transactions sin firmar ni transmitir.',
        seoTitle: 'Bitcoin Address y TX Decoder | Read-only Sin Broadcast',
        seoDescription:
          'Valida direcciones Bitcoin, mira scriptPubKey y decodifica raw transaction hex con inputs, outputs, txid y vsize.',
        h1: 'Bitcoin Address y TX Decoder Read-only',
        intro:
          'Inspecciona direcciones y transacciones raw hex en modo solo lectura, sin pedir seed, WIF ni clave privada.',
        contentBlocks: [
          {
            title: 'Inspeccion sin riesgo de envio',
            paragraphs: [
              'La herramienta valida direcciones por red y muestra scriptPubKey cuando es posible. Para raw transaction decodifica txid, inputs, outputs, valores, scripts y vsize.',
              'No firma, no transmite y no solicita seed. El foco es lectura tecnica y debug seguro de datos publicos o transacciones preparadas.',
            ],
          },
          {
            title: 'Mainnet y testnet',
            paragraphs: [
              'Elegir la red correcta evita falsos negativos. Direcciones mainnet y testnet usan prefijos y reglas diferentes.',
              localPrivacy.es,
            ],
            list: ['Validacion de direccion', 'Decode raw hex', 'Exportacion JSON'],
          },
          {
            title: 'Limites de decode',
            paragraphs: [
              'Una raw transaction aislada puede no contener detalles completos de UTXOs previos, como valor de entrada. Para auditoria total, combina con explorer o node.',
            ],
          },
        ],
        faq: [
          { question: 'La herramienta pide seed?', answer: 'No. Es read-only y no necesita seed, WIF ni clave privada.' },
          { question: 'Transmite transaccion?', answer: 'No. Solo decodifica raw hex localmente.' },
          { question: 'Muestra txid?', answer: 'Si. Cuando es valida, muestra txid, vsize, weight, inputs y outputs.' },
          { question: 'Funciona en testnet?', answer: 'Si. Elige testnet en el selector de red.' },
        ],
      },
    },
  },
  {
    id: 'sql-formatter',
    slug: 'sql-formatter',
    category: 'dev',
    relatedToolIds: ['json-formatter', 'csv-viewer', 'text-diff'],
    content: {
      'pt-br': {
        name: 'SQL Formatter e Minifier',
        shortDescription:
          'Formate SQL por dialeto, ajuste caixa de keywords, minifique consultas e exporte arquivo .sql.',
        primaryKeyword: 'sql formatter online',
        secondaryKeywords: [
          'formatador sql',
          'sql minifier',
          'formatar query sql',
          'postgres sql formatter',
          'mysql formatter',
          'sql beautifier',
        ],
        searchIntent:
          'Devs e analistas que precisam limpar queries SQL para leitura, revisao, debug ou documentacao.',
        seoTitle: 'SQL Formatter Online | PostgreSQL, MySQL, SQLite e T-SQL',
        seoDescription:
          'Cole SQL, escolha dialeto, formate, minifique, copie resultado ou exporte .sql direto no navegador.',
        h1: 'SQL Formatter e Minifier Online',
        intro:
          'Formate queries SQL com dialeto, keywords em upper/lower/preserve, minificacao e exportacao .sql.',
        contentBlocks: [
          {
            title: 'SQL legivel para revisao',
            paragraphs: [
              'Queries longas ficam dificeis de revisar quando chegam em uma linha so. O formatador quebra clausulas, identa trechos e padroniza keywords conforme sua preferencia.',
              'Escolha dialetos comuns como PostgreSQL, MySQL, MariaDB, SQLite, BigQuery, T-SQL e PL/SQL para melhorar compatibilidade de sintaxe.',
            ],
          },
          {
            title: 'Minificacao e exportacao',
            paragraphs: [
              'O modo minificar remove comentarios simples e espacos repetidos para gerar uma versao compacta. Voce tambem pode copiar o resultado ou baixar como query.sql.',
              localPrivacy['pt-br'],
            ],
            list: ['Formatar por dialeto', 'Minificar SQL', 'Exportar .sql'],
          },
          {
            title: 'Limites do formatador',
            paragraphs: [
              'Formatar nao valida permissao, plano de execucao ou seguranca da query. Sempre revise queries destrutivas, filtros WHERE e variaveis antes de executar em banco real.',
            ],
          },
        ],
        faq: [
          { question: 'Suporta PostgreSQL?', answer: 'Sim. Tambem ha MySQL, MariaDB, SQLite, BigQuery, T-SQL e PL/SQL.' },
          { question: 'Minifica SQL?', answer: 'Sim. O modo minificar remove espacos repetidos e comentarios simples de linha.' },
          { question: 'Posso exportar .sql?', answer: 'Sim. Use exportar .sql para baixar o resultado.' },
          { question: 'O SQL e enviado?', answer: 'Nao por padrao. A formatacao roda no navegador.' },
        ],
      },
      en: {
        name: 'SQL Formatter and Minifier',
        shortDescription:
          'Format SQL by dialect, adjust keyword case, minify queries, and export a .sql file.',
        primaryKeyword: 'sql formatter online',
        secondaryKeywords: [
          'sql formatter',
          'sql minifier',
          'format sql query',
          'postgres sql formatter',
          'mysql formatter',
          'sql beautifier',
        ],
        searchIntent:
          'Developers and analysts who need to clean SQL queries for reading, review, debugging, or documentation.',
        seoTitle: 'SQL Formatter Online | PostgreSQL, MySQL, SQLite, and T-SQL',
        seoDescription:
          'Paste SQL, choose dialect, format, minify, copy output, or export .sql directly in the browser.',
        h1: 'SQL Formatter and Minifier Online',
        intro:
          'Format SQL queries with dialect selection, upper/lower/preserve keywords, minification, and .sql export.',
        contentBlocks: [
          {
            title: 'Readable SQL for review',
            paragraphs: [
              'Long queries are hard to review when they arrive in one line. The formatter breaks clauses, indents sections, and normalizes keywords as you prefer.',
              'Choose common dialects such as PostgreSQL, MySQL, MariaDB, SQLite, BigQuery, T-SQL, and PL/SQL for better syntax compatibility.',
            ],
          },
          {
            title: 'Minify and export',
            paragraphs: [
              'Minify mode removes simple line comments and repeated spaces to create a compact version. You can also copy the result or download query.sql.',
              localPrivacy.en,
            ],
            list: ['Format by dialect', 'Minify SQL', 'Export .sql'],
          },
          {
            title: 'Formatter limits',
            paragraphs: [
              'Formatting does not validate permissions, execution plans, or query safety. Always review destructive queries, WHERE filters, and variables before running against a real database.',
            ],
          },
        ],
        faq: [
          { question: 'Does it support PostgreSQL?', answer: 'Yes. It also includes MySQL, MariaDB, SQLite, BigQuery, T-SQL, and PL/SQL.' },
          { question: 'Can it minify SQL?', answer: 'Yes. Minify removes repeated spaces and simple line comments.' },
          { question: 'Can I export .sql?', answer: 'Yes. Use export .sql to download the result.' },
          { question: 'Is SQL uploaded?', answer: 'No by default. Formatting runs in the browser.' },
        ],
      },
      es: {
        name: 'SQL Formatter y Minifier',
        shortDescription:
          'Formatea SQL por dialecto, ajusta mayusculas de keywords, minifica consultas y exporta .sql.',
        primaryKeyword: 'sql formatter online',
        secondaryKeywords: [
          'formatador sql',
          'sql minifier',
          'formatar query sql',
          'postgres sql formatter',
          'mysql formatter',
          'sql beautifier',
        ],
        searchIntent:
          'Desarrolladores y analistas que necesitan limpiar queries SQL para lectura, revision, debug o documentacion.',
        seoTitle: 'SQL Formatter Online | PostgreSQL, MySQL, SQLite y T-SQL',
        seoDescription:
          'Pega SQL, elige dialecto, formatea, minifica, copia resultado o exporta .sql en el navegador.',
        h1: 'SQL Formatter y Minifier Online',
        intro:
          'Formatea queries SQL con dialecto, keywords upper/lower/preserve, minificacion y exportacion .sql.',
        contentBlocks: [
          {
            title: 'SQL legible para revision',
            paragraphs: [
              'Queries largas son dificiles de revisar cuando llegan en una sola linea. El formatter separa clausulas, indenta secciones y normaliza keywords.',
              'Elige dialectos comunes como PostgreSQL, MySQL, MariaDB, SQLite, BigQuery, T-SQL y PL/SQL para mejor compatibilidad.',
            ],
          },
          {
            title: 'Minificacion y exportacion',
            paragraphs: [
              'El modo minificar elimina comentarios simples y espacios repetidos para crear una version compacta. Tambien puedes copiar o descargar query.sql.',
              localPrivacy.es,
            ],
            list: ['Formatear por dialecto', 'Minificar SQL', 'Exportar .sql'],
          },
          {
            title: 'Limites del formatter',
            paragraphs: [
              'Formatear no valida permisos, plan de ejecucion ni seguridad. Revisa queries destructivas, filtros WHERE y variables antes de ejecutar en una base real.',
            ],
          },
        ],
        faq: [
          { question: 'Soporta PostgreSQL?', answer: 'Si. Tambien incluye MySQL, MariaDB, SQLite, BigQuery, T-SQL y PL/SQL.' },
          { question: 'Minifica SQL?', answer: 'Si. Minificar elimina espacios repetidos y comentarios simples de linea.' },
          { question: 'Puedo exportar .sql?', answer: 'Si. Usa exportar .sql para descargar el resultado.' },
          { question: 'El SQL se envia?', answer: 'No por defecto. El formato ocurre en el navegador.' },
        ],
      },
    },
  },
] satisfies FrontOnlyToolSeed[];

export { frontOnlyToolSeeds };

export const frontOnlyToolIds = frontOnlyToolSeeds.map((tool) => tool.id);

const frontOnlyToolContentById = new Map(
  frontOnlyToolSeeds.map((tool) => [tool.id, tool.content]),
);

export const isFrontOnlyToolId = (id: string): id is FrontOnlyToolId =>
  frontOnlyToolContentById.has(id as FrontOnlyToolId);

export const getFrontOnlyToolContent = (
  id: FrontOnlyToolId,
  locale: AppLocale,
): FrontOnlyToolContent => {
  const content = frontOnlyToolContentById.get(id);

  if (!content) {
    throw new Error(`Unknown front-only tool id: ${id}`);
  }

  return content[locale];
};
