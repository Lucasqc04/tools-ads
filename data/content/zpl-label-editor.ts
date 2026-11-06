import type { ContentBlock, FaqItem } from '@/types/content';
import type { AppLocale } from '@/lib/i18n/config';

export type ZplLabelEditorContent = {
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

const contentByLocale: Record<AppLocale, ZplLabelEditorContent> = {
  'pt-br': {
    name: 'Editor de Etiquetas ZPL',
    shortDescription:
      'Importe ZPL, escreva uma descrição diferente em cada etiqueta e gere um único PDF para imprimir.',
    primaryKeyword: 'editor de etiquetas zpl',
    secondaryKeywords: [
      'adicionar descrição em etiqueta shopee',
      'converter zpl para pdf',
      'editar etiquetas shopee zpl',
      'visualizar arquivo zpl',
      'gerar pdf de etiquetas zpl',
    ],
    searchIntent:
      'Vendedores e equipes de expedição que precisam incluir identificação interna em várias etiquetas ZPL antes de imprimir.',
    seoTitle: 'Editor de Etiquetas ZPL para Shopee | Descrição e PDF',
    seoDescription:
      'Importe etiquetas ZPL (Shopee e outras), escreva a descrição do produto em cada uma, revise em grade e exporte um PDF único, PNG ou o ZPL editado.',
    h1: 'Editor de Etiquetas ZPL',
    intro:
      'Importe um arquivo ZPL, como o de etiquetas da Shopee, escreva o produto de cada pedido na etiqueta correspondente e exporte tudo em um único PDF.',
    contentBlocks: [
      {
        title: 'Escreva a identificação interna em cada etiqueta',
        paragraphs: [
          'Arquivos ZPL de marketplaces e transportadoras trazem os dados de envio, mas não o nome do produto que ajuda a separar os pedidos na embalagem. Este editor divide o arquivo em etiquetas (cada bloco entre ^XA e ^XZ) e permite escrever uma descrição, e uma observação opcional, para cada uma.',
          'Você preenche o lote só com o teclado: escreva o produto, pressione Enter e a próxima etiqueta abre pronta para receber o texto. O contador mostra quantas etiquetas já foram preenchidas, e o filtro "Pendentes" leva direto às que faltam.',
        ],
        list: [
          'Importe um arquivo .zpl ou .txt, ou cole o código.',
          'Preencha as descrições em sequência e revise em modo individual ou em grade.',
          'Exporte PDF, ZPL editado ou o PNG da etiqueta atual.',
        ],
      },
      {
        title: 'Posição e estilo do texto',
        paragraphs: [
          'Defina uma vez a posição, a largura, o alinhamento, o tamanho da fonte, o máximo de linhas e a rotação do texto. Ao aplicar o estilo, ele vale para todo o lote, e cada etiqueta mantém seu próprio texto. A posição também pode ser ajustada direto no preview.',
          'O ZPL original de cada etiqueta é preservado: a descrição é inserida em um bloco separado, antes do ^XZ, e o botão "Restaurar etiqueta original" remove o que foi acrescentado. O modo avançado mostra o código da etiqueta selecionada e avisa sobre problemas simples, como ^XA/^XZ ausentes, falta de campo ^FD ou coordenada ^FO inválida.',
        ],
      },
      {
        title: 'PDF, prévia e limites',
        paragraphs: [
          'O PDF tem uma página por etiqueta do lote, inclusive as que ficaram sem descrição, no tamanho em milímetros e no DPI definidos no estilo. As páginas são imagens: o texto não pode ser selecionado.',
          'Para a prévia fiel e para o PDF, cada etiqueta, já com a descrição, é enviada ao servidor do site, que a repassa ao serviço de renderização Labelary. Como etiquetas de envio costumam ter nome e endereço, use a ferramenta apenas se isso for aceitável para você. Se o serviço estiver indisponível, o editor usa uma prévia local simplificada (texto, caixas e códigos de barras aproximados), que pode diferir da etiqueta impressa. Cada envio aceita até 3 MB de ZPL.',
          'O lote fica salvo neste navegador por até 7 dias, para que você retome o trabalho após recarregar a página, e pode ser descartado a qualquer momento. Os dados das etiquetas não vão para os eventos de análise do site.',
        ],
      },
    ],
    faq: [
      {
        question: 'Consigo editar várias etiquetas da Shopee de uma vez?',
        answer:
          'Sim. O arquivo é separado em etiquetas e cada uma recebe sua própria descrição. A posição e o estilo do texto valem para todo o lote. A ferramenta lê qualquer arquivo ZPL com blocos ^XA e ^XZ.',
      },
      {
        question: 'Preciso entender comandos ZPL?',
        answer:
          'Não. O uso comum envolve digitar a descrição e ajustar a posição no preview. O editor de código só aparece no modo avançado, para quem conhece ZPL.',
      },
      {
        question: 'O PDF contém todas as etiquetas?',
        answer:
          'Sim. O PDF tem uma página para cada etiqueta do lote, com ou sem descrição. Se faltarem descrições, a ferramenta avisa antes e você pode revisar as pendentes ou gerar mesmo assim.',
      },
      {
        question: 'O arquivo original é alterado?',
        answer:
          'Não. O arquivo importado não é modificado. A ferramenta guarda o ZPL original de cada etiqueta e gera uma versão com a descrição, que pode ser restaurada. Para guardar o resultado, exporte o ZPL editado ou o PDF.',
      },
      {
        question: 'Os dados das etiquetas ficam só no meu navegador?',
        answer:
          'O lote fica salvo no navegador, mas a prévia e o PDF dependem de um serviço externo de renderização (Labelary), que recebe cada etiqueta pelo servidor do site. Se isso não for aceitável para você, não use a ferramenta com etiquetas que tenham dados pessoais.',
      },
    ],
  },
  en: {
    name: 'ZPL Label Editor',
    shortDescription:
      'Import ZPL, add a different product description to each label, and generate one print-ready PDF.',
    primaryKeyword: 'zpl label editor',
    secondaryKeywords: [
      'add product description to shipping label',
      'convert zpl to pdf',
      'bulk zpl label editor',
      'zpl file preview',
      'generate zpl labels pdf',
    ],
    searchIntent:
      'Sellers and shipping teams who need to add internal product identification to batches of ZPL labels before printing.',
    seoTitle: 'ZPL Label Editor | Add Product Descriptions and Generate PDF',
    seoDescription:
      'Import shipping ZPL labels, add a product description to every label, review the batch, and export one PDF for printing.',
    h1: 'ZPL Label Editor',
    intro:
      'Import shipping labels or any ZPL file, add order information, and generate the entire batch in one PDF.',
    contentBlocks: [
      {
        title: 'Add internal identification before printing',
        paragraphs: [
          'Carrier ZPL files usually include delivery details but not the internal product name that helps your packing workflow. This editor automatically separates every ^XA ... ^XZ block, so you can add a distinct description to each label without overwriting the source file.',
          'Fill a whole batch from the keyboard: type a product, press Enter, and the next label is ready. The batch list keeps progress visible and takes you straight to unfinished labels when it is time to review.',
        ],
        list: ['Import .zpl and .txt files or paste code.', 'Fill individual descriptions quickly.', 'Review in focused or grid mode.'],
      },
      {
        title: 'One shared style, individual product data',
        paragraphs: [
          'Set the description position, width, alignment, font size, line count, and rotation once, then apply the style across the batch. Each label keeps its own product text while the packing information stays consistent.',
          'The preview keeps positioning approachable instead of exposing technical commands. When needed, advanced mode opens the selected label source, surfaces basic structural warnings, and leaves the original ZPL available for restoration.',
        ],
      },
      {
        title: 'One PDF with a safe editing fallback',
        paragraphs: [
          'The main export creates one PDF page for each customized label. You can also download the complete ZPL batch for archival or printer delivery. Complex labels use a compatible ZPL renderer for precise output; a simplified local preview keeps editing available if that renderer is temporarily unavailable.',
          'Drafts are temporarily saved in this browser to protect unfinished work. When precise rendering is used, only the label being processed is sent to the rendering service; no label contents are sent to site analytics.',
        ],
      },
    ],
    faq: [
      { question: 'Can I edit a whole ZPL batch?', answer: 'Yes. Labels are detected automatically, each can receive its own description, and styling can be shared across the batch.' },
      { question: 'Do I need to know ZPL?', answer: 'No. The default workflow uses plain language fields and preview. Code editing is only available in advanced mode.' },
      { question: 'Does the export contain every label?', answer: 'Yes. The primary export creates one PDF with one page per modified label.' },
      { question: 'Is the original ZPL overwritten?', answer: 'No. The original source is retained and a separate generated ZPL is built for export.' },
      { question: 'Will my work survive a page refresh?', answer: 'Yes, for a limited time. A local browser draft can be resumed or discarded when you return.' },
    ],
  },
  es: {
    name: 'Editor de Etiquetas ZPL',
    shortDescription:
      'Importa ZPL, agrega una descripción diferente a cada etiqueta y genera un único PDF para imprimir.',
    primaryKeyword: 'editor de etiquetas zpl',
    secondaryKeywords: [
      'agregar descripcion a etiqueta de envio',
      'convertir zpl a pdf',
      'editor zpl por lotes',
      'vista previa archivo zpl',
      'generar pdf de etiquetas zpl',
    ],
    searchIntent:
      'Vendedores y equipos de despacho que necesitan agregar identificación interna a lotes de etiquetas ZPL antes de imprimir.',
    seoTitle: 'Editor de Etiquetas ZPL | Agregar Descripción y Generar PDF',
    seoDescription:
      'Importa etiquetas ZPL de envío, agrega un producto a cada etiqueta, revisa el lote y exporta un PDF único para imprimir.',
    h1: 'Editor de Etiquetas ZPL',
    intro:
      'Importa etiquetas de envío o cualquier archivo ZPL, agrega información por pedido y genera todo en un solo PDF.',
    contentBlocks: [
      {
        title: 'Agrega identificación interna antes de imprimir',
        paragraphs: [
          'Los archivos ZPL de transportistas suelen incluir datos de entrega, pero no el nombre interno del producto. Este editor separa automáticamente cada bloque ^XA ... ^XZ para que agregues una descripción distinta a cada etiqueta sin sobrescribir el archivo original.',
          'Completa un lote entero con el teclado: escribe el producto, presiona Enter y la siguiente etiqueta queda lista. La lista mantiene el progreso visible y lleva directamente a las etiquetas pendientes para revisarlas.',
        ],
        list: ['Importa archivos .zpl y .txt o pega código.', 'Completa descripciones individuales rápidamente.', 'Revisa en modo individual o cuadrícula.'],
      },
      {
        title: 'Un estilo compartido y datos individuales',
        paragraphs: [
          'Define una sola vez la posición, anchura, alineación, tamaño de fuente, líneas y rotación. Luego aplica el estilo a todo el lote: cada etiqueta conserva su producto y la información de empaque se mantiene uniforme.',
          'La vista previa evita que el flujo normal se convierta en un editor técnico. Cuando sea necesario, el modo avanzado abre el código de la etiqueta seleccionada, muestra avisos estructurales básicos y mantiene el ZPL original para restaurarlo.',
        ],
      },
      {
        title: 'PDF único y renderización con contingencia',
        paragraphs: [
          'La exportación principal crea una página PDF por etiqueta modificada. También puedes descargar el lote ZPL completo. Las etiquetas complejas usan un renderizador ZPL compatible para obtener una salida precisa; si no está disponible, una vista previa local simplificada mantiene el lote editable.',
          'El borrador se guarda temporalmente en este navegador para evitar pérdidas al recargar. Al usar renderización precisa, solo se envía la etiqueta en proceso al servicio de renderizado; el contenido nunca llega a los eventos analíticos del sitio.',
        ],
      },
    ],
    faq: [
      { question: 'Puedo editar muchas etiquetas ZPL a la vez?', answer: 'Sí. Las etiquetas se detectan automáticamente, cada una recibe su propia descripción y el estilo se puede compartir con todo el lote.' },
      { question: 'Necesito conocer ZPL?', answer: 'No. El modo normal usa campos simples y vista previa. La edición de código está solo en modo avanzado.' },
      { question: 'El PDF incluye todas las etiquetas?', answer: 'Sí. La exportación principal crea un PDF con una página por etiqueta modificada.' },
      { question: 'Se modifica el ZPL original?', answer: 'No. Se conserva el origen y se crea una versión generada separada para exportar.' },
      { question: 'Se guarda mi trabajo al actualizar?', answer: 'Sí, por tiempo limitado. El borrador local se puede continuar o descartar al volver.' },
    ],
  },
  zh: {
    name: 'ZPL Label Editor',
    shortDescription: 'Import ZPL, add a different product description to each label, and generate one print-ready PDF.',
    primaryKeyword: 'zpl label editor',
    secondaryKeywords: ['convert zpl to pdf', 'bulk zpl label editor', 'zpl file preview'],
    searchIntent: 'Shipping teams who need to add internal product identification to ZPL label batches before printing.',
    seoTitle: 'ZPL Label Editor | Add Descriptions and Generate PDF',
    seoDescription: 'Import ZPL shipping labels, add a product description to each label, review the batch, and export one PDF.',
    h1: 'ZPL Label Editor',
    intro: 'Import shipping labels or any ZPL file, add order information, and generate the entire batch in one PDF.',
    contentBlocks: [
      { title: 'Edit labels before printing', paragraphs: ['This editor separates each complete ZPL label and lets you add an individual internal product description without overwriting the original source.', 'Use Enter to move through a batch quickly and review unfinished labels from the progress list.'], list: ['Import ZPL or TXT files.', 'Fill descriptions label by label.', 'Review in focus or grid mode.'] },
      { title: 'Shared placement and individual text', paragraphs: ['Set the position, size, alignment, and line count once, then apply the same presentation to the full batch while each label keeps its own product description.', 'Advanced mode exposes the selected ZPL code and basic structural warnings without disturbing the main workflow.'] },
      { title: 'PDF export and local draft', paragraphs: ['The primary export creates one PDF page for each customized label, and the full generated ZPL can also be downloaded. A compatible renderer is used for complex labels, with a local preview fallback.', 'Draft data is temporarily saved in this browser. Label content is not included in site analytics.'] },
    ],
    faq: [
      { question: 'Can I edit a ZPL batch?', answer: 'Yes. Every detected label can receive its own description, and visual settings are shared across the batch.' },
      { question: 'Do I need ZPL knowledge?', answer: 'No. The default workflow is built around product text and preview.' },
      { question: 'Does PDF export include every label?', answer: 'Yes. Each customized label becomes one PDF page.' },
      { question: 'Is the original ZPL preserved?', answer: 'Yes. The generated output is separate from the original source.' },
      { question: 'Is there a saved draft?', answer: 'Yes. A temporary local draft can be resumed after a refresh.' },
    ],
  },
};

export const getZplLabelEditorContent = (locale: AppLocale): ZplLabelEditorContent =>
  contentByLocale[locale];
