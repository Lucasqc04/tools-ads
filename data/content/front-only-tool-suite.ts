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
    'O processamento acontece no navegador sempre que possível. Arquivos e dados inseridos não precisam ser enviados ao servidor do site para concluir a tarefa principal.',
  en: 'Processing happens in the browser whenever possible. Files and inputs do not need to be uploaded to the site server for the main workflow.',
  es: 'El procesamiento ocurre en el navegador siempre que es posible. Los archivos y entradas no necesitan enviarse al servidor del sitio para ejecutar el flujo principal.',
  zh: 'Processing happens in the browser whenever possible. Files and inputs do not need to be uploaded to the site server for the main workflow.',
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
          'Valide CNPJ, gere números válidos para testes e exporte listas em TXT, CSV ou JSON.',
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
        seoTitle: 'Gerador e Validador de CNPJ Online | Com ou Sem Pontuação',
        seoDescription:
          'Confira os dígitos verificadores de um CNPJ ou gere números válidos para testes, com ou sem pontuação, e exporte em TXT, CSV ou JSON.',
        h1: 'Validador e Gerador de CNPJ para Testes',
        intro:
          'Cole um CNPJ para conferir os dígitos verificadores ou gere até 200 números válidos por vez, com escolha de filial e exportação, para usar em testes.',
        contentBlocks: [
          {
            title: 'Como funciona a validação do CNPJ',
            paragraphs: [
              'O CNPJ tem 14 dígitos: 8 da raiz da empresa, 4 da ordem (0001 costuma indicar a matriz e as demais numeram as filiais) e 2 dígitos verificadores, calculados a partir dos 12 primeiros. A ferramenta ignora pontos, barra e hífen, recalcula os dois dígitos e informa se o número confere. O CNPJ aparece formatado (00.000.000/0000-00) e só com números, o que ajuda a separar um erro de máscara de um erro de cálculo.',
              'Números com todos os dígitos iguais, como 11111111111111, são recusados. Exemplo: 11.222.333/0001-81 é válido; se você trocar o último dígito para 2, o resultado passa a ser inválido.',
            ],
          },
          {
            title: 'Gerar CNPJs para testes',
            paragraphs: [
              'O gerador sorteia os 8 dígitos da raiz, aplica a filial escolhida (o padrão é 0001) e calcula os dois dígitos verificadores. Você define de 1 a 200 números por lote, com ou sem pontuação, e pode copiar um por um, copiar a lista toda ou baixar o resultado.',
              'Os números servem para preencher formulários, homologação, QA e testes automatizados. Eles são sorteados e não foram criados a partir de nenhuma empresa. Como só obedecem à conta dos dígitos, um deles pode coincidir por acaso com o CNPJ de uma empresa real. Por isso, use somente em ambientes de teste, nunca para cadastro, abertura de conta, emissão de nota ou para se passar por alguém.',
              'A validação e a geração acontecem no navegador. Os números digitados ou gerados não são enviados ao servidor do site.',
            ],
            list: ['TXT, um número por linha', 'CSV com a coluna "cnpj"', 'JSON com a lista de números, para testes de API'],
          },
          {
            title: 'O que a validação não confirma',
            paragraphs: [
              'Um CNPJ com dígitos corretos não prova que a empresa existe, está ativa ou tem determinado nome: a ferramenta não consulta a Receita Federal. Para conferir uma empresa de verdade, use a consulta pública oficial.',
              'O novo CNPJ alfanumérico, com letras, não é suportado: a ferramenta considera apenas os números, então o resultado não vale para esse formato.',
            ],
          },
        ],
        faq: [
          { question: 'O CNPJ gerado existe na Receita Federal?', answer: 'Não foi criado a partir de nenhuma empresa. Ele só respeita a conta dos dígitos verificadores, e a ferramenta não consulta cadastros oficiais. Por acaso, um número sorteado pode coincidir com o de uma empresa real.' },
          { question: 'Posso gerar CNPJ sem pontuação?', answer: 'Sim. Escolha "Sem pontuação" para receber só os 14 dígitos, útil em campos que aceitam apenas números. A opção vale para a lista inteira.' },
          { question: 'Serve para testar formulários?', answer: 'Sim, esse é o uso indicado: QA, homologação, fixtures e validação de campos. Não use os números em cadastros reais, na abertura de contas ou para se passar por uma empresa.' },
          { question: 'Os CNPJs são enviados para o servidor?', answer: 'Não. A validação e a geração acontecem no navegador, e os números digitados ou gerados não são enviados ao site.' },
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
      zh: {
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
    },
  },
  {
    id: 'validar-boleto',
    slug: 'validar-boleto',
    category: 'utility',
    relatedToolIds: ['pix-decoder', 'gerador-cnpj', 'cpf-generator'],
    content: {
      'pt-br': {
        name: 'Validador de Boleto e Linha Digitável',
        shortDescription:
          'Valide a linha digitável ou o código de barras, converta formatos e confira vencimento, valor e campo livre.',
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
          'Usuários e devs que precisam conferir boleto, linha digitável ou código de barras antes de integrar pagamentos.',
        seoTitle: 'Validador de Boleto e Linha Digitável | Converter e Decodificar',
        seoDescription:
          'Cole a linha digitável ou o código de barras de um boleto para conferir os dígitos, converter formatos e ver valor, banco e vencimento.',
        h1: 'Validador de Boleto e Linha Digitável Online',
        intro:
          'Cole uma linha digitável de 47 ou 48 dígitos, ou um código de barras de 44 dígitos, para conferir os dígitos verificadores, converter o formato e ler os campos.',
        contentBlocks: [
          {
            title: 'O que a ferramenta confere',
            paragraphs: [
              'A ferramenta reconhece dois tipos de boleto. No boleto bancário (linha de 47 dígitos), ela recalcula o dígito verificador de cada um dos três primeiros campos (módulo 10) e o DAC geral do código de barras (módulo 11), e confere se o código da moeda é 9 (real). No boleto de arrecadação, usado em contas de consumo e tributos (linha de 48 dígitos ou código de barras de 44 dígitos que começa com 8), ela confere os quatro blocos e o DAC geral, com módulo 10 ou 11 conforme o terceiro dígito.',
              'O resultado informa o tipo, o valor, o banco, o vencimento, o código de barras, o campo livre e a lista de inconsistências, com os dígitos esperados. Na seção "Partes explicadas" cada trecho da linha aparece com o seu significado.',
            ],
          },
          {
            title: 'Como ler valor, banco e vencimento',
            paragraphs: [
              'O valor vem em centavos no código de barras. Num boleto bancário, R$ 0,00 costuma indicar que o valor não está definido no código. No boleto de arrecadação, o valor só aparece quando o terceiro dígito é 6 ou 8; nos tipos 7 e 9 ele é apenas uma referência e fica em branco.',
              'O banco é identificado pelos três primeiros dígitos, mas a ferramenta tem uma lista curta de nomes (como Banco do Brasil, Itaú, Bradesco, Santander e Caixa); os demais aparecem como "Banco não identificado", sem que isso indique erro. O vencimento vem de um fator de 4 dígitos que conta dias a partir de 07/10/1997 e recomeça em 1000 no dia 22/02/2025. Por isso, quando o fator permite as duas leituras, a ferramenta mostra duas datas: escolha a que faz sentido para a emissão do seu boleto. Se o fator for 0000, nenhuma data é exibida. Boletos de arrecadação não mostram vencimento, pois ele depende do convênio.',
            ],
          },
          {
            title: 'Exemplo e conversão entre formatos',
            paragraphs: [
              'A linha 34191.09008 72564.898723 32408.290008 1 10010000082831 resulta em um boleto do Itaú de R$ 828,31, com fator 1001, que pode ser lido como 04/07/2000 ou 23/02/2025. Ao colar uma linha digitável, a ferramenta monta o código de barras equivalente; ao colar o código de barras, monta a linha. Também é possível ler o código pela câmera do aparelho, copiar o código de barras ou a linha e baixar o diagnóstico em JSON.',
              'A análise acontece no navegador. A linha, o código de barras e a imagem da câmera não são enviados ao servidor do site.',
            ],
            list: ['Dígitos de cada campo (módulo 10)', 'DAC geral (módulo 11 ou 10, conforme o tipo)', 'Diagnóstico em JSON'],
          },
          {
            title: 'Limites e cuidados',
            paragraphs: [
              'A ferramenta só verifica a estrutura e os dígitos. Ela não consulta o banco e não confirma se o boleto foi pago, está registrado ou cancelado, quem é o beneficiário ou se há fraude, e não interpreta o campo livre, cujo conteúdo muda de banco para banco. Antes de pagar, confira o beneficiário e o valor no aplicativo do seu banco.',
            ],
          },
        ],
        faq: [
          { question: 'A ferramenta consulta o banco?', answer: 'Não. Ela confere a estrutura, os dígitos e os campos no navegador, sem consultar o banco. Por isso não sabe se o boleto foi pago ou cancelado.' },
          { question: 'Aceita boleto de concessionária e tributos?', answer: 'Sim. Linhas de 48 dígitos e códigos de barras de 44 dígitos que começam com 8 são tratados como arrecadação, com regras próprias de verificação. Nesses boletos não há vencimento.' },
          { question: 'Por que aparecem duas datas de vencimento?', answer: 'O fator de vencimento reinicia em 1000 em 22/02/2025, então um mesmo fator pode apontar para duas datas. A ferramenta mostra as duas, e você escolhe a que combina com a data de emissão.' },
          { question: 'Posso ler o boleto pela câmera?', answer: 'Sim. O botão "Abrir câmera" lê o código de barras do boleto, desde que o navegador autorize o acesso. A imagem fica no seu aparelho. Se não funcionar, cole a linha digitável.' },
          { question: 'Posso exportar o resultado?', answer: 'Sim. Você pode copiar o código de barras, copiar a linha digitável ou baixar o diagnóstico completo em JSON.' },
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
      zh: {
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
      zh: {
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
          'Veja os metadados EXIF de uma foto (câmera, data, GPS), copie o JSON e baixe uma cópia limpa em JPEG, PNG ou WEBP.',
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
          'Usuários que querem conferir ou remover metadados de fotos antes de publicar, enviar ou arquivar.',
        seoTitle: 'Leitor e Removedor de EXIF Online | Metadados e GPS',
        seoDescription:
          'Veja o EXIF de fotos no navegador, confira câmera, data e GPS e baixe uma cópia limpa, sem metadados. Aceita várias imagens e não envia arquivos.',
        h1: 'Leitor e Removedor de EXIF de Imagem',
        intro:
          'Envie uma ou várias fotos, leia os metadados EXIF, IPTC e XMP quando existirem e baixe uma cópia limpa, sem localização e sem dados da câmera.',
        contentBlocks: [
          {
            title: 'O que metadados de imagem podem revelar',
            paragraphs: [
              'Uma foto pode guardar o modelo da câmera ou do celular, a lente, o dia e a hora da captura, a orientação, o programa de edição e, às vezes, as coordenadas GPS de onde ela foi tirada. Conferir esses campos antes de publicar ou enviar um arquivo ajuda a evitar a divulgação de uma localização sem querer.',
              'Depois de enviar as imagens, clique em ler metadados. A leitura simples mostra cartões com arquivo, dimensões, data de criação, software, câmera, lente, localização GPS, cores e orientação, e o JSON bruto traz todos os campos encontrados. Campos que não existem no arquivo aparecem como “Não informado”. Muitas fotos já passaram por redes sociais ou aplicativos que apagam parte desses dados, então é normal encontrar pouco ou nada.',
            ],
          },
          {
            title: 'Como a cópia limpa é gerada',
            paragraphs: [
              'A cópia limpa é criada desenhando a imagem em um canvas e salvando de novo como JPEG, PNG ou WEBP. Como o arquivo é recriado do zero, os metadados embutidos, como EXIF e GPS, não são copiados. A qualidade de JPEG e WEBP pode ser ajustada de 10% a 100% (padrão 92%). Como a imagem é recodificada, JPEG e WEBP perdem um pouco de qualidade a cada gravação; se a foto tiver transparência, prefira PNG ou WEBP.',
              'É possível limpar só a imagem selecionada ou todas de uma vez: com várias imagens, o resultado vem em um ZIP. Também dá para copiar o JSON dos metadados ou baixá-lo como arquivo. A leitura e a limpeza acontecem no navegador, sem envio das imagens ao servidor.',
            ],
            list: ['Copiar ou baixar o JSON dos metadados', 'Limpar uma imagem ou várias em ZIP', 'Escolher JPEG, PNG ou WEBP e a qualidade'],
          },
          {
            title: 'O que a limpeza não resolve',
            paragraphs: [
              'A ferramenta não remove marcas visíveis, marca d’água, texto escrito na imagem nem rostos, placas ou qualquer informação que apareça nos pixels. Ela também só enxerga os metadados que o formato permite ler: a leitura varia entre JPEG, PNG, WEBP e outros formatos.',
            ],
          },
        ],
        faq: [
          { question: 'Consigo remover o GPS da foto?', answer: 'Sim. A cópia limpa é recriada em um canvas e não leva os metadados embutidos, incluindo as coordenadas GPS. Você pode conferir antes, na leitura dos metadados.' },
          { question: 'Funciona com PNG e WEBP?', answer: 'A leitura varia conforme o formato e os dados que o arquivo realmente tem. A cópia limpa pode ser salva em JPEG, PNG ou WEBP, independentemente do formato de origem.' },
          { question: 'A imagem é enviada para um servidor?', answer: 'Não. A leitura dos metadados e a geração da cópia limpa acontecem no navegador.' },
          { question: 'Posso limpar várias fotos de uma vez?', answer: 'Sim. Selecione várias imagens e use “Remover EXIF de todas”: o resultado é baixado em um arquivo ZIP.' },
          { question: 'Remove o texto que aparece na imagem?', answer: 'Não. Texto visível faz parte dos pixels e precisa ser editado em um editor de imagens.' },
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
      zh: {
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
          'Defina largura e altura, recorte a imagem na proporção escolhida ou gere um quadrado central e exporte em PNG, JPEG ou WEBP.',
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
          'Usuários que precisam adaptar imagens para redes sociais, sites, lojas e documentos sem instalar um editor.',
        seoTitle: 'Redimensionar e Cortar Imagem Online | PNG, JPEG e WEBP',
        seoDescription:
          'Envie uma imagem, defina largura e altura, escolha ajustar, cortar ou quadrado central e baixe em PNG, JPEG ou WEBP. Tudo no navegador.',
        h1: 'Redimensionar e Cortar Imagem Online',
        intro:
          'Defina o tamanho final em pixels, escolha como a imagem deve caber (inteira, cortada ou em quadrado central) e baixe o resultado em PNG, JPEG ou WEBP.',
        contentBlocks: [
          {
            title: 'Redimensionar para posts, sites e envios',
            paragraphs: [
              'Muitos sistemas pedem imagens em um tamanho exato, como 1080 × 1080 para um post quadrado ou 1200 × 630 para uma imagem de compartilhamento. Envie uma imagem, digite a largura e a altura finais e veja o resultado ao vivo ao lado do original. O tamanho padrão é 1080 × 1080. Marque “Manter proporção” para que a altura acompanhe a largura (e vice-versa) conforme a proporção dos dois campos.',
              'Há três modos. “Ajustar sem cortar” mantém a imagem inteira dentro do tamanho pedido e preenche as sobras com branco. “Cortar para preencher” ocupa toda a área e corta o excesso: arraste a moldura ou os quadrados nos cantos para escolher qual parte fica. “Quadrado central” usa a largura nos dois lados e corta a imagem em 1:1, bom para avatares e catálogos.',
            ],
            list: [
              'Ajustar sem cortar: imagem inteira, com faixas brancas se a proporção for diferente.',
              'Cortar para preencher: sem bordas, com o corte que você posicionar.',
              'Quadrado central: largura e altura iguais, com corte 1:1.',
            ],
          },
          {
            title: 'Formatos, qualidade e privacidade',
            paragraphs: [
              'Exporte em WEBP (o padrão) para arquivos menores, em JPEG para compatibilidade ampla ou em PNG para manter a nitidez de gráficos e capturas de tela. A qualidade vai de 10% a 100% (padrão 90%) e afeta JPEG e WEBP. A ferramenta trabalha com uma imagem por vez e aceita PNG, JPEG, WEBP, AVIF, GIF, BMP e TIFF. O processamento acontece no navegador e a imagem não é enviada ao servidor.',
              'Atenção à transparência: a imagem é desenhada sobre um fundo branco, então áreas transparentes saem brancas em qualquer formato, inclusive PNG. Para manter o fundo transparente, use outra ferramenta, como o removedor de fundo ou o conversor.',
            ],
          },
          {
            title: 'Cuidados com o tamanho e a proporção',
            paragraphs: [
              'Se o tamanho pedido for maior que o da imagem, ela é ampliada e pode ficar borrada. Sempre que possível, parta de um arquivo maior do que o tamanho final. Como a imagem é recriada, os metadados comuns, como localização, não vão para o novo arquivo.',
            ],
          },
        ],
        faq: [
          { question: 'Como gerar uma imagem quadrada?', answer: 'Escolha o modo “Quadrado central”, defina a largura e ajuste a moldura de corte. A altura passa a ser igual à largura.' },
          { question: 'A imagem transparente continua transparente?', answer: 'Não. A imagem é desenhada sobre um fundo branco, então as áreas transparentes saem brancas, mesmo em PNG.' },
          { question: 'Remove metadados da foto?', answer: 'Como o arquivo exportado é uma imagem nova gerada no navegador, os metadados comuns, como EXIF e GPS, não são copiados.' },
          { question: 'A imagem é enviada para um servidor?', answer: 'Não. O corte e o redimensionamento acontecem no navegador.' },
          { question: 'Qual formato devo baixar?', answer: 'WEBP para páginas leves, JPEG para compatibilidade com qualquer sistema e PNG para gráficos e capturas com bordas nítidas, lembrando que a transparência não é mantida.' },
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
      zh: {
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
          'Una vários PDFs na ordem que quiser, divida um PDF em uma página por arquivo (em ZIP) e abra ou proteja PDFs com senha.',
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
          'Usuários que precisam montar ou separar documentos PDF antes de enviar, arquivar ou imprimir, sem mandar o arquivo para um servidor.',
        seoTitle: 'Juntar, Dividir e Reordenar PDF Online | ZIP de Páginas',
        seoDescription:
          'Junte vários PDFs na ordem que escolher, divida um PDF em páginas dentro de um ZIP e abra ou proteja PDFs com senha, tudo no navegador.',
        h1: 'Juntar, Dividir e Reordenar PDF Online',
        intro:
          'Envie PDFs, defina a ordem dos arquivos e baixe um único PDF combinado, ou divida um PDF em uma página por arquivo dentro de um ZIP.',
        contentBlocks: [
          {
            title: 'Juntar e reordenar PDFs',
            paragraphs: [
              'Adicione os PDFs à fila e use os botões “Subir” e “Descer” para definir a ordem. “Juntar PDFs” cria um único arquivo com todas as páginas de cada PDF, na ordem da fila. A reordenação é por arquivo: a ferramenta não muda a ordem das páginas dentro de um mesmo PDF nem apaga páginas avulsas.',
              'Para reorganizar páginas, divida o PDF em páginas separadas e junte novamente os arquivos na ordem desejada, descartando os que não quiser. Isso serve, por exemplo, para montar um único anexo com contrato, comprovante e documento de identidade.',
            ],
          },
          {
            title: 'Dividir em páginas e proteger com senha',
            paragraphs: [
              '“Dividir primeiro PDF em ZIP” pega o primeiro PDF da fila e salva cada página como um PDF separado (pagina-1.pdf, pagina-2.pdf e assim por diante) dentro de um ZIP. Se quiser, preencha a senha do ZIP: o pacote sai criptografado (AES-256) e as páginas só abrem com ela.',
              'Também é possível proteger o PDF final com senha de abertura, no PDF juntado ou no primeiro PDF da fila, e informar uma senha de proprietário opcional. A proteção de PDF usa criptografia RC4 de 128 bits, adequada para impedir que alguém abra o arquivo por acaso, mas considerada fraca para segredos importantes; nesses casos, prefira o ZIP com senha.',
            ],
            list: ['Juntar vários PDFs na ordem da fila', 'Dividir o primeiro PDF em páginas (ZIP, com senha opcional)', 'Verificar se um PDF tem senha', 'Remover ou colocar senha em um PDF'],
          },
          {
            title: 'PDFs protegidos, limites e privacidade',
            paragraphs: [
              '“Verificar segurança” indica se cada PDF da fila tem senha e o algoritmo usado. Para abrir um PDF protegido, informe a senha de entrada; a mesma senha é usada para todos os arquivos protegidos da fila. “Remover senha do primeiro PDF” só funciona quando você sabe a senha: a ferramenta não quebra senhas. Senha incorreta ou criptografia não suportada geram uma mensagem de erro.',
              'Os PDFs são lidos e gerados no navegador e não são enviados ao servidor. Arquivos muito grandes ou com muitas páginas dependem da memória do aparelho. PDFs corrompidos podem falhar; revise o arquivo gerado antes de compartilhar.',
            ],
          },
        ],
        faq: [
          { question: 'Consigo reordenar as páginas de um PDF?', answer: 'Não diretamente. A ferramenta reordena os arquivos da fila antes de juntar. Para mudar páginas de um mesmo PDF, divida-o em páginas e junte os arquivos na ordem que quiser.' },
          { question: 'Dividir gera todas as páginas?', answer: 'Sim. O modo dividir gera um PDF por página do primeiro arquivo da fila, todos dentro de um ZIP.' },
          { question: 'Os PDFs são enviados para um servidor?', answer: 'Não. A montagem, a divisão e a proteção por senha acontecem no navegador.' },
          { question: 'Consigo abrir um PDF com senha?', answer: 'Sim, se você souber a senha. Informe a senha de entrada para juntar, dividir ou remover a proteção do arquivo. A ferramenta não recupera senhas esquecidas.' },
          { question: 'A senha do ZIP e a do PDF são iguais?', answer: 'Não. A senha do ZIP protege o pacote com as páginas divididas (AES-256). A senha do PDF final usa criptografia RC4 de 128 bits e é um nível mais fraco de proteção.' },
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
      zh: {
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
          'Envie uma imagem e baixe em um ZIP o favicon.ico, os PNGs, o Apple Touch Icon, os ícones maskable, o site.webmanifest e as tags HTML.',
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
          'Desenvolvedores e donos de site que precisam transformar uma imagem base em um pacote completo de ícones para site e PWA.',
        seoTitle: 'Gerador de Favicon e Manifest PWA | ICO, PNG e HTML',
        seoDescription:
          'Envie uma imagem e baixe um ZIP com favicon.ico, ícones PNG, Apple Touch Icon, ícones maskable, site.webmanifest e as tags HTML prontas.',
        h1: 'Gerador de Favicon, Manifest e Ícones PWA',
        intro:
          'Envie o logo do seu site e gere o pacote de favicon: favicon.ico, ícones PNG, Apple Touch Icon, ícones maskable, site.webmanifest e as tags HTML para colar no site.',
        contentBlocks: [
          {
            title: 'O que o pacote contém',
            paragraphs: [
              'Um favicon moderno não é só um arquivo .ico: abas do navegador, atalhos no iPhone e no Android e telas iniciais de PWA usam tamanhos diferentes. A partir de uma única imagem, a ferramenta gera um ZIP com 13 arquivos.',
            ],
            list: [
              'favicon.ico, com as versões de 16, 32 e 48 px.',
              'PNGs de 16, 32, 48, 96 e 256 px (favicon-16x16.png, favicon-32x32.png e assim por diante).',
              'apple-touch-icon.png, com 180 × 180 px, para a tela inicial do iOS.',
              'web-app-manifest-192x192.png e web-app-manifest-512x512.png, para Android e PWA.',
              'maskable-icon-192x192.png e maskable-icon-512x512.png, com fundo e margem de segurança para ícones adaptáveis.',
              'site.webmanifest, com nome, cores, modo de exibição e os ícones de 192 e 512 px (comuns e maskable).',
              'favicon-html-snippet.txt, com as tags link e meta para o head da página.',
            ],
          },
          {
            title: 'Como ajustar e usar os arquivos',
            paragraphs: [
              'Informe o nome do site, o nome curto, a cor de fundo, a cor do tema, a URL inicial e o modo de exibição (standalone, minimal-ui, browser ou fullscreen). Ajuste a margem de segurança de 0% a 24% (padrão 8%), escolha se os favicons comuns têm fundo transparente, na cor de fundo ou na cor do tema, e use as opções de fundo arredondado nos ícones maskable e de inverter as cores da imagem. Com a atualização automática ligada, a prévia muda a cada ajuste.',
              'Na aba de códigos você copia o HTML, o manifest e os trechos para React e Next.js. Os caminhos do manifest e do HTML começam com “/”, então coloque todos os arquivos na raiz do site (na pasta public, em projetos Next.js). A imagem é processada no navegador e não é enviada ao servidor.',
            ],
          },
          {
            title: 'Escolha uma boa imagem base',
            paragraphs: [
              'Envie uma imagem quadrada, simples e com boa margem: ela é ajustada dentro de cada tamanho sem deformar, então imagens retangulares ficam com espaço vazio nas laterais. Aceita PNG, JPEG, WEBP, AVIF, GIF, BMP e TIFF; SVG não é aceito. Logos com muitos detalhes ou texto pequeno perdem leitura em 16 × 16 px, então confira a prévia no tamanho de aba antes de baixar.',
            ],
          },
        ],
        faq: [
          { question: 'Gera um favicon.ico de verdade?', answer: 'Sim. O favicon.ico contém as versões de 16, 32 e 48 px, e o ZIP traz também os PNGs separados.' },
          { question: 'Quais arquivos vêm no ZIP?', answer: 'Treze arquivos: favicon.ico, PNGs de 16, 32, 48, 96 e 256 px, apple-touch-icon.png (180 px), ícones de 192 e 512 px para PWA, ícones maskable de 192 e 512 px, site.webmanifest e um arquivo com as tags HTML.' },
          { question: 'Onde coloco os arquivos no site?', answer: 'Na raiz do site, porque os caminhos do manifest e das tags começam com “/”. Em um projeto Next.js, use a pasta public e cole as tags no head.' },
          { question: 'Posso enviar um SVG?', answer: 'Não. O seletor aceita PNG, JPEG, WEBP, AVIF, GIF, BMP e TIFF. Exporte o SVG como PNG com boa resolução antes de enviar.' },
          { question: 'A imagem é enviada para um servidor?', answer: 'Não. Os ícones são gerados no navegador.' },
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
      zh: {
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
      zh: {
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
      zh: {
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
          'Cole um JSON de exemplo e gere interface TypeScript, schema Zod e JSON Schema, com cópia por aba e exportação em ZIP.',
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
          'Devs que precisam transformar payloads reais em tipos, validadores e schemas para acelerar integrações.',
        seoTitle: 'JSON para TypeScript, Zod e JSON Schema | Gerador Online',
        seoDescription:
          'Cole um JSON e gere interface TypeScript, schema Zod e JSON Schema no navegador, com cópia por aba e exportação em ZIP. Grátis.',
        h1: 'JSON para TypeScript, Zod e JSON Schema',
        intro:
          'Cole um JSON de exemplo e gere uma interface TypeScript, um schema Zod e um JSON Schema para tipar e validar a resposta de uma API.',
        contentBlocks: [
          {
            title: 'Como o código é gerado a partir do JSON',
            paragraphs: [
              'Cole um JSON na caixa da esquerda, informe o nome raiz (por exemplo, UserPayload) e clique em "Gerar código". A ferramenta lê o exemplo e infere o tipo de cada campo: texto, número, inteiro, booleano, null, lista ou objeto. Objetos aninhados ficam dentro da mesma interface, e o resultado aparece em três abas: typeScript, zod e jsonSchema.',
              'Com o JSON {"id":1,"name":"Lucas","active":true,"tags":["dev"]} e o nome UserPayload, a aba TypeScript traz uma interface UserPayload com id: number, name: string, active: boolean e tags: string[], mais um alias UserPayloadList para uma lista desses objetos. A aba Zod traz um z.object com os mesmos campos (o id sai como z.number().int()) e o tipo inferido pelo próprio schema.',
            ],
          },
          {
            title: 'Listas, campos opcionais e formatos reconhecidos',
            paragraphs: [
              'Quando a raiz é uma lista, a ferramenta junta todos os itens em um só tipo: um campo que existe em alguns itens e em outros não vira opcional (com ?), e um campo com tipos diferentes vira uma união. Textos que parecem e-mail, URL (http ou https), UUID, data (AAAA-MM-DD) ou data e hora ISO recebem a validação correspondente no Zod e o format no JSON Schema. O JSON Schema gerado segue o draft 2020-12 e marca todos os objetos com additionalProperties: false.',
            ],
            list: [
              'Aba TypeScript: interface e alias de lista.',
              'Aba Zod: schema com import { z } from \'zod\' e o tipo inferido.',
              'Aba JSON Schema: schema para documentação ou para validadores em qualquer linguagem.',
              '"Exportar ZIP": três arquivos, com o nome raiz mais .ts, .zod.ts e .schema.json.',
            ],
          },
          {
            title: 'Limites e privacidade',
            paragraphs: [
              'Um único JSON de exemplo não mostra tudo: campos que podem faltar, valores nulos que só aparecem às vezes, listas vazias (que viram unknown), enums, tamanhos e faixas de valores. Revise o código antes de usá-lo e, se possível, cole um exemplo com vários itens para a inferência enxergar mais variações. A ferramenta não separa objetos aninhados em interfaces com nomes próprios e não aceita JSON com comentários.',
              'A análise é feita no navegador e o JSON colado, assim como os arquivos gerados, não são enviados ao nosso servidor.',
            ],
          },
        ],
        faq: [
          { question: 'A ferramenta gera schema Zod?', answer: 'Sim. A aba zod traz um schema com z.object e o tipo inferido por z.infer, que você pode colar direto em um projeto que já use Zod.' },
          { question: 'E se o JSON for uma lista?', answer: 'Funciona. O tipo principal descreve cada item da lista e um alias com o sufixo List representa o array. Campos ausentes em alguns itens ficam opcionais.' },
          { question: 'Posso baixar tudo de uma vez?', answer: 'Sim. "Exportar ZIP" baixa três arquivos: o TypeScript, o schema Zod e o JSON Schema, todos com o nome raiz que você informou.' },
          { question: 'O meu JSON é enviado para algum servidor?', answer: 'Não. A inferência e a geração dos arquivos acontecem no navegador e o JSON não sai do seu aparelho.' },
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
      zh: {
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
          'Digite uma expressão cron, leia o que ela significa em português e veja as próximas 8 execuções para um fuso horário.',
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
          'Devs e operadores que precisam criar ou revisar agendamentos cron sem errar horário.',
        seoTitle: 'Gerador e Explicador de Cron Online | Próximas Execuções',
        seoDescription:
          'Digite uma expressão cron, veja a explicação em português e as próximas 8 execuções em um fuso horário. Grátis e no navegador.',
        h1: 'Gerador e Explicador de Cron Online',
        intro:
          'Digite ou escolha um modelo de expressão cron, leia a explicação em português e confira as próximas execuções antes de agendar a tarefa.',
        contentBlocks: [
          {
            title: 'Como usar o explicador de cron',
            paragraphs: [
              'Digite a expressão no campo (por exemplo, 0 9 * * 1-5) ou clique em um dos cinco modelos prontos: a cada 5 minutos, dias úteis às 9h, primeiro dia do mês, domingo às 3h e dia 15 às 8h30. A ferramenta mostra a descrição em inglês e a tradução em português, e lista as próximas 8 execuções. Para 0 9 * * 1-5, a leitura em português é "Às 09:00, de segunda-feira a sexta-feira".',
              'Uma expressão cron tem cinco campos separados por espaço: minuto, hora, dia do mês, mês e dia da semana. O asterisco significa "todos", a barra (*/5) define um intervalo, a vírgula lista valores e o hífen indica uma faixa. A leitura também aceita seis campos, com os segundos na frente, e atalhos como @daily.',
            ],
          },
          {
            title: 'Fuso horário e horários exibidos',
            paragraphs: [
              'O campo de fuso horário recebe um nome da lista IANA, como America/Sao_Paulo ou UTC, e é usado para calcular quando a expressão dispara. Atenção: as datas da lista são exibidas no fuso do seu navegador, não no fuso digitado. Por exemplo, 0 9 * * 1-5 em America/Sao_Paulo aparece como 12:00 se o seu navegador estiver em UTC. Compare sempre o instante, não só o número da hora.',
              'Se a expressão ou o fuso forem inválidos, a ferramenta mostra a mensagem do analisador (geralmente em inglês) e não lista as execuções. O botão "Copiar" copia apenas a expressão.',
            ],
            list: ['Descrição em inglês e em português', 'Próximas 8 execuções a partir de agora', 'Cinco modelos prontos', 'Cópia da expressão'],
          },
          {
            title: 'Limites e privacidade',
            paragraphs: [
              'Cada agendador tem as suas regras: alguns aceitam segundos, nomes de dias e meses, o caractere L (último dia) ou atalhos como @daily, e outros não. A ferramenta mostra como esta biblioteca lê a expressão e não garante que o seu sistema (crontab, Kubernetes, GitHub Actions, serviços de nuvem) vá interpretá-la do mesmo jeito. Confirme a sintaxe na documentação dele.',
              'A análise é feita no navegador e a expressão digitada não é enviada ao nosso servidor.',
            ],
          },
        ],
        faq: [
          { question: 'A ferramenta mostra as próximas execuções?', answer: 'Sim. Ela lista as próximas 8 datas a partir do momento atual, calculadas para o fuso horário informado e exibidas no horário do seu navegador.' },
          { question: 'Posso escolher o fuso horário?', answer: 'Sim. Digite um nome IANA, como America/Sao_Paulo ou UTC. O campo vem preenchido com o fuso do seu navegador. As datas listadas são mostradas no horário do navegador.' },
          { question: 'Serve para o crontab do Linux?', answer: 'Serve como apoio para as expressões de cinco campos. Alguns recursos, como segundos ou atalhos, variam entre sistemas, então confirme na documentação do seu agendador.' },
          { question: 'A expressão é enviada para algum servidor?', answer: 'Não. A leitura da expressão e o cálculo das datas acontecem no navegador.' },
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
      zh: {
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
          'Comprima ou descomprima um arquivo em gzip ou deflate e empacote vários arquivos ou uma pasta em ZIP, com senha opcional.',
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
          'Devs e usuários técnicos que precisam transformar arquivos compactados sem instalar utilitário desktop.',
        seoTitle: 'Gzip, Deflate e ZIP Online | Compactar e ZIP com Senha',
        seoDescription:
          'Comprima ou descomprima gzip e deflate, crie ZIP com senha (AES-256) a partir de arquivos ou de uma pasta, tudo no navegador.',
        h1: 'Gzip, Deflate e ZIP com Senha Online',
        intro:
          'Selecione arquivos ou uma pasta para comprimir em gzip ou deflate, criar um ZIP com senha opcional ou recriar um ZIP sem senha.',
        contentBlocks: [
          {
            title: 'O que cada botão faz',
            paragraphs: [
              'Adicione arquivos arrastando-os ou escolhendo no seletor. Os botões Gzip, Descompactar gzip, Deflate e Inflate trabalham só com o primeiro arquivo da lista e baixam o resultado: o gzip gera nome.gz e o deflate gera nome.deflate. Para descomprimir, a extensão .gz, .gzip ou .deflate é removida do nome. "Deflate" aqui é o formato zlib (o mesmo usado em respostas HTTP "deflate"), e não o deflate bruto sem cabeçalho.',
              '"Criar ZIP" empacota todos os arquivos da lista em um único arquivos.zip. "Selecionar pasta" troca a lista pelos arquivos da pasta e mantém os caminhos relativos dentro do ZIP. Se você informar uma senha, o ZIP é criptografado com AES-256. Windows e macOS nem sempre abrem esse tipo de ZIP pelo gerenciador nativo, e programas como o 7-Zip funcionam. Teste antes de enviar para outra pessoa.',
            ],
          },
          {
            title: 'Sobre "Extrair ZIP"',
            paragraphs: [
              'O botão "Extrair ZIP" lê o primeiro arquivo da lista (usando a senha, se houver) e baixa um novo arquivo zip-extraido.zip com o conteúdo, sem senha e sem as pastas vazias. Ele não salva os arquivos soltos. Use-o para remover a senha de um ZIP seu ou conferir se a senha está correta, e abra o novo ZIP em seguida.',
            ],
            list: [
              'Gzip e Deflate: um arquivo por vez, saída com extensão .gz ou .deflate.',
              'ZIP: vários arquivos ou pastas, com senha opcional (AES-256).',
              'Extrair ZIP: gera zip-extraido.zip sem senha.',
            ],
          },
          {
            title: 'Limites e privacidade',
            paragraphs: [
              'Gzip e deflate usam a compressão nativa do navegador, que existe nos navegadores atuais mas pode faltar nos mais antigos. O arquivo resultante é montado na memória antes do download, então arquivos muito grandes podem travar o aparelho. A senha do ZIP protege o conteúdo dos arquivos, mas os nomes deles dentro do pacote continuam visíveis para quem abrir a lista, e ela não substitui um cofre de senhas.',
              'Tudo acontece no navegador: os arquivos e a senha não são enviados ao nosso servidor.',
            ],
          },
        ],
        faq: [
          { question: 'Dá para compactar uma pasta inteira?', answer: 'Sim. Use "Selecionar pasta" (se o navegador permitir) e depois "Criar ZIP". Os caminhos das subpastas são mantidos dentro do ZIP.' },
          { question: 'O ZIP com senha é seguro?', answer: 'Ele usa criptografia AES-256, mas a segurança também depende da força da senha. Alguns programas, como o gerenciador nativo do Windows, podem não abrir esse tipo de ZIP.' },
          { question: 'Como descompactar um arquivo gzip?', answer: 'Selecione o arquivo .gz como primeiro da lista e clique em "Descompactar gzip". O arquivo é baixado sem a extensão .gz.' },
          { question: 'Os meus arquivos são enviados para algum servidor?', answer: 'Não. A compressão, o ZIP e a senha são processados no navegador e os arquivos não saem do seu aparelho.' },
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
      zh: {
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
      zh: {
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
          'Busque taxas recomendadas em sat/vB, estime o custo pelo tamanho da transação e compare prioridades em sats e BTC.',
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
          'Usuários de Bitcoin que precisam estimar o custo de uma transação pelo tamanho virtual antes de enviar ou consolidar UTXOs.',
        seoTitle: 'Calculadora de Fee Bitcoin | Mempool sat/vB e BTC',
        seoDescription:
          'Consulte as taxas recomendadas da mempool, informe entradas e saídas e estime o custo da transação em sats e BTC, sem enviar seus dados.',
        h1: 'Calculadora de Fee Bitcoin com Dados da Mempool',
        intro:
          'Atualize as taxas recomendadas, informe o tipo e o tamanho da transação e compare o custo de cada prioridade em sats e BTC.',
        contentBlocks: [
          {
            title: 'Como a taxa é calculada',
            paragraphs: [
              'Em Bitcoin, a taxa depende do tamanho da transação, não do valor enviado. Esse tamanho é medido em vbytes (vB) e a taxa em satoshis por vbyte (sat/vB). O custo é vsize multiplicado pela taxa, arredondado para cima: uma transação de 141 vB a 8 sat/vB custa 1.128 sats, ou 0,00001128 BTC.',
              'Para estimar o vsize, escolha o tipo de carteira e o número de entradas e saídas. A ferramenta usa 10,5 vB de base mais 68 vB por entrada e 31 vB por saída em carteiras modernas comuns (SegWit nativo), 58 e 43 vB em Taproot simples, e 10 vB mais 148 e 34 vB em carteiras antigas (legado). Uma transação típica, com 1 entrada e 2 saídas (destino e troco), dá cerca de 141 vB. Se você já conhece o tamanho real, escolha "Personalizado" e digite o vsize.',
            ],
          },
          {
            title: 'Como ler a tabela de prioridades',
            paragraphs: [
              'A tabela traz as taxas recomendadas pela mempool.space: mais rápida, meia hora, uma hora, econômica e mínima, além de uma taxa personalizada. Cada linha mostra sat/vB, o custo em sats e em BTC. Ao escolher uma prioridade, a simulação mostra quanto o destinatário recebe, quanto vai para a taxa e o total que sai da carteira (valor enviado mais taxa).',
              'Antes de clicar em "Atualizar mempool", a tabela exibe valores de exemplo (12, 8, 5, 3 e 1 sat/vB). Ao atualizar, o seu navegador consulta o mempool.space (ou o blockstream.info, se o primeiro falhar). Se nenhum responder, a tabela volta aos valores de exemplo. Nenhum endereço ou valor digitado é enviado nessa consulta; a rede pode ser mainnet ou testnet4.',
              'Esta ferramenta não usa seed nem chave privada, não assina e não transmite nada. O endereço de destino é opcional, não é validado e só entra no resumo copiado ou exportado em JSON.',
            ],
            list: ['Mainnet e testnet4', 'sat/vB convertido em sats e BTC', 'Resumo copiável e exportação em JSON'],
          },
          {
            title: 'O que a estimativa não garante',
            paragraphs: [
              'As taxas mudam a cada bloco, conforme a demanda por espaço. A taxa "mais rápida" ou "meia hora" é uma estimativa, não uma garantia de confirmação em prazo exato. O vsize também é uma estimativa: transações com multisig, scripts diferentes ou entradas de tipos misturados têm tamanho diferente. Confira a taxa e o tamanho na sua carteira no momento de enviar. Esta página informa custos e não é recomendação financeira.',
            ],
          },
        ],
        faq: [
          { question: 'O que é vsize?', answer: 'É o tamanho virtual da transação em vbytes (vB). Ele considera o desconto dos dados de witness do SegWit e é a base para o cálculo da taxa em sat/vB.' },
          { question: 'A ferramenta envia ou assina transações?', answer: 'Não. Ela só calcula custos. Não pede seed nem chave privada, não assina e não transmite nada para a rede.' },
          { question: 'De onde vêm as taxas?', answer: 'Do mempool.space, consultado direto pelo seu navegador ao clicar em "Atualizar mempool", com o blockstream.info como alternativa. Se ambos falharem, a tabela mostra valores de exemplo, que não refletem a rede.' },
          { question: 'A taxa depende do valor que estou enviando?', answer: 'Não. Ela depende do tamanho da transação. Enviar pouco com muitas entradas custa mais do que enviar muito com poucas entradas.' },
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
      zh: {
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
          'Valide endereços Bitcoin e decodifique transações em hex (raw) sem seed, assinatura ou envio à rede.',
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
          'Devs e usuários de Bitcoin que precisam inspecionar endereços e raw transactions sem risco de assinar ou transmitir.',
        seoTitle: 'Bitcoin Address e TX Decoder | Somente Leitura e Sem Envio',
        seoDescription:
          'Valide endereços Bitcoin, veja o scriptPubKey e decodifique uma transação em hex com inputs, outputs, txid e vsize, sem enviar nada.',
        h1: 'Bitcoin Address e TX Decoder Read-only',
        intro:
          'Inspecione endereços e transações em hex em modo somente leitura, sem pedir seed, WIF ou chave privada.',
        contentBlocks: [
          {
            title: 'O que cada função mostra',
            paragraphs: [
              'Ao validar um endereço, a ferramenta confere o formato e o checksum para a rede escolhida e mostra o tipo (Legacy, Script Hash, Native SegWit ou Taproot) e o scriptPubKey em hexadecimal, que é o script que bloqueia os fundos enviados a esse endereço. O tipo é deduzido pelo prefixo: endereços bc1q aparecem como P2WPKH/P2WSH, sem distinguir os dois.',
              'Ao decodificar uma transação em hex, ela mostra o txid, a versão, o locktime, o número de entradas e saídas, o total das saídas em satoshis, o vsize e o weight. Cada entrada mostra o txid e o índice da saída que ela gasta, o scriptSig e a quantidade de itens de witness. Cada saída mostra o valor em satoshis, o scriptPubKey, o endereço (quando o script permite) e o tipo, como P2PKH, P2SH, P2WPKH, P2WSH, P2TR ou OP_RETURN. O txid não inclui os dados de witness.',
            ],
          },
          {
            title: 'Mainnet e testnet',
            paragraphs: [
              'Escolha a rede antes de validar: um endereço de mainnet (que começa com bc1, 1 ou 3) é recusado quando a rede selecionada é testnet, e vice-versa, porque os prefixos são diferentes. Para a testnet, a ferramenta aceita endereços com prefixos tb1, m, n e 2.',
              'Todo o processamento acontece no navegador, sem consultar a rede Bitcoin. O endereço e o hex colados não são enviados ao servidor do site. Mesmo assim, nunca cole seed, WIF ou chave privada: esta ferramenta não precisa deles.',
            ],
            list: ['Validação de endereço por rede', 'Decodificação de transação em hex', 'Cópia e exportação em JSON'],
          },
          {
            title: 'Limites da decodificação',
            paragraphs: [
              'A transação em hex não traz o valor das entradas, então a ferramenta não calcula a taxa paga, não verifica assinaturas e não confirma se as entradas existem ou ainda estão disponíveis. Ela também não informa se o endereço já foi usado nem o saldo. Para isso, combine com um explorer ou com seu próprio node. A ferramenta não transmite transações.',
            ],
          },
        ],
        faq: [
          { question: 'A ferramenta pede seed ou chave privada?', answer: 'Não. Ela é somente leitura e não precisa de seed, WIF nem chave privada. Se algum site pedir isso para decodificar uma transação, desconfie.' },
          { question: 'Ela transmite a transação para a rede?', answer: 'Não. Ela só decodifica o hex no seu navegador. Nada é assinado nem enviado à rede Bitcoin.' },
          { question: 'Por que não aparece a taxa da transação?', answer: 'Porque a taxa é a soma das entradas menos a soma das saídas, e o hex não traz o valor das entradas. Aqui aparece apenas o total das saídas.' },
          { question: 'Funciona na testnet?', answer: 'Sim. Escolha testnet no seletor de rede. Endereços de mainnet e de testnet não são intercambiáveis.' },
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
      zh: {
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
          'Formate SQL por dialeto, escolha a caixa das palavras-chave, minifique a consulta e baixe o resultado em .sql.',
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
          'Devs e analistas que precisam limpar queries SQL para leitura, revisão, debug ou documentação.',
        seoTitle: 'SQL Formatter Online | PostgreSQL, MySQL, SQLite e T-SQL',
        seoDescription:
          'Cole uma consulta SQL, escolha o dialeto e formate, minifique, copie ou baixe em .sql. Roda no navegador, grátis e sem cadastro.',
        h1: 'SQL Formatter e Minifier Online',
        intro:
          'Cole uma consulta SQL e formate com quebras de linha e indentação, com palavras-chave em maiúsculas, minúsculas ou como estão.',
        contentBlocks: [
          {
            title: 'Como formatar uma consulta',
            paragraphs: [
              'Cole o SQL, escolha o dialeto (SQL padrão, PostgreSQL, MySQL, MariaDB, SQLite, BigQuery, T-SQL ou PL/SQL) e a caixa das palavras-chave (UPPER, lower ou preserve) e clique em "Formatar SQL". O resultado aparece ao lado, com cada cláusula em uma linha e indentação de 2 espaços. Também funciona com vários comandos separados por ponto e vírgula, que ficam separados por uma linha em branco.',
              'Exemplo: select id,name,email from users where active=true order by created_at desc limit 20; vira SELECT, FROM, WHERE, ORDER BY e LIMIT, cada um em sua linha, com os campos id, name e email um por linha e active = TRUE na condição.',
            ],
          },
          {
            title: 'Minificar e exportar',
            paragraphs: [
              '"Minificar" gera uma única linha: apaga comentários que começam com -- e reduz qualquer sequência de espaços e quebras de linha a um espaço. Esse modo é simples e não entende a sintaxe do SQL: um texto entre aspas que contenha -- tem o final cortado como se fosse comentário, e espaços repetidos dentro de textos entre aspas também são reduzidos, o que altera o valor. Comentários em bloco (/* */) são mantidos. Confira o resultado antes de usar.',
              '"Copiar resultado" e "Exportar .sql" usam o texto formatado ou minificado, ou o texto original se você ainda não formatou. O arquivo baixado se chama query.sql.',
            ],
            list: ['Formatar por dialeto', 'Caixa das palavras-chave: UPPER, lower ou preserve', 'Minificar em uma linha', 'Exportar query.sql'],
          },
          {
            title: 'Limites',
            paragraphs: [
              'Formatar muda só o aspecto do texto. A ferramenta não executa a consulta, não verifica tabelas, colunas ou permissões e não avalia o desempenho. Se o SQL tiver um erro de sintaxe que o formatador não consegue ler (como um parêntese aberto), ele mostra a mensagem técnica do analisador, em inglês. Revise sempre comandos que alteram dados antes de rodá-los em um banco real.',
              'A formatação acontece no navegador e o SQL colado não é enviado ao nosso servidor.',
            ],
          },
        ],
        faq: [
          { question: 'Quais dialetos de SQL a ferramenta aceita?', answer: 'SQL padrão, PostgreSQL, MySQL, MariaDB, SQLite, BigQuery, T-SQL e PL/SQL. O dialeto muda a forma como palavras reservadas e símbolos são lidos.' },
          { question: 'O que a minificação faz com os comentários?', answer: 'Remove os comentários de linha que começam com --, mas mantém os de bloco /* */. Cuidado com textos entre aspas que contenham --, porque o final deles também é cortado.' },
          { question: 'Posso baixar o resultado em .sql?', answer: 'Sim. "Exportar .sql" baixa o arquivo query.sql com o texto formatado ou minificado.' },
          { question: 'O meu SQL é enviado para algum servidor?', answer: 'Não. A formatação roda no navegador e a consulta não sai do seu aparelho.' },
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
      zh: {
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
