import type { AppLocale } from '@/lib/i18n/config';
import type { ContentBlock, FaqItem } from '@/types/content';

export type SymbolsToCopyContent = {
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

const contentByLocale: Record<AppLocale, SymbolsToCopyContent> = {
  'pt-br': {
    name: 'Símbolos para Copiar e Colar',
    shortDescription:
      'Mais de 300 símbolos Unicode organizados em 12 categorias com busca, favoritos, histórico e cópia como texto, entidade HTML ou codepoint.',
    primaryKeyword: 'simbolos para copiar e colar',
    secondaryKeywords: [
      'seta para copiar',
      'coracao para copiar',
      'estrela para copiar',
      'simbolos para instagram',
      'simbolos matematicos para copiar',
      'simbolo de moeda para copiar',
    ],
    searchIntent:
      'Usuarios que procuram um simbolo especifico (seta, coracao, estrela, simbolo matematico) para copiar e colar rapidamente em bio, post ou documento.',
    seoTitle: 'Símbolos para Copiar e Colar | Setas, Corações, Estrelas e Mais',
    seoDescription:
      'Copie símbolos Unicode organizados por categoria: setas, corações, estrelas, matemática, moedas e mais. Busque, monte sequências e copie como texto, HTML ou codepoint.',
    h1: 'Símbolos para Copiar e Colar Grátis, Organizados por Categoria',
    intro:
      'Escolha uma categoria ou busque por nome, clique para copiar e monte sequências combinando varios símbolos antes de colar em qualquer lugar.',
    contentBlocks: [
      {
        title: 'Como usar o catálogo de símbolos',
        paragraphs: [
          'Escolha uma categoria no topo da ferramenta (setas, corações, estrelas, matemática, moedas, marcas de certo/errado, linhas e bordas, música, zodíaco, letras gregas, marcadores de lista ou xadrez e jogos) ou digite um termo na busca para filtrar por nome. Clique em qualquer símbolo para copiar instantaneamente, ou ative o modo "montar sequência" para juntar varios símbolos em uma única string antes de copiar tudo de uma vez.',
          'O botão de formato permite alternar entre copiar o caractere puro, a entidade HTML (útil para código-fonte de sites) ou o codepoint Unicode (útil para documentação técnica e debugging). Favoritos e o histórico de símbolos copiados recentemente ficam salvos localmente no navegador, então continuam disponíveis na próxima visita.',
        ],
      },
      {
        title: 'Onde usar os símbolos',
        paragraphs: [
          'Os símbolos funcionam em qualquer lugar que aceite texto Unicode: bio do Instagram e TikTok, posts do X/Twitter e Facebook, nome de usuário, planilhas, apresentações, documentos e até em código-fonte HTML/CSS/JS. Como são caracteres de texto reais (não imagens), eles se ajustam ao tamanho e à cor da fonte ao redor.',
        ],
        list: [
          'Decorar bio e posts em redes sociais.',
          'Inserir setas e marcadores em apresentações e planilhas.',
          'Usar símbolos matemáticos e gregos em textos técnicos.',
          'Copiar entidade HTML direto para o código de um site.',
        ],
      },
      {
        title: 'Compatibilidade entre dispositivos e fontes',
        paragraphs: [
          'A maioria dos símbolos desta lista faz parte do padrão Unicode e é amplamente suportada em navegadores, celulares e aplicativos modernos. Ainda assim, a fonte ativa em cada plataforma pode exibir alguns símbolos de forma ligeiramente diferente, e símbolos muito recentes podem aparecer como um quadrado vazio em sistemas mais antigos. Se um símbolo não aparecer corretamente, teste uma alternativa da mesma categoria.',
        ],
      },
      {
        title: 'Processamento local e privacidade',
        paragraphs: [
          'A busca, os favoritos, o histórico e a cópia acontecem inteiramente no seu navegador. Nenhum texto digitado ou símbolo selecionado é enviado para um servidor, e os dados salvos (favoritos e histórico) ficam apenas no armazenamento local do seu próprio dispositivo.',
        ],
      },
    ],
    faq: [
      {
        question: 'Como copio um símbolo?',
        answer:
          'Clique no símbolo desejado. Ele é copiado automaticamente para a área de transferência no formato escolhido (texto, HTML ou codepoint).',
      },
      {
        question: 'Posso combinar vários símbolos antes de copiar?',
        answer:
          'Sim. Ative o modo de montar sequência, clique nos símbolos na ordem desejada e copie a sequência completa de uma vez.',
      },
      {
        question: 'O que é a entidade HTML de um símbolo?',
        answer:
          'É a representação do caractere em código HTML (por exemplo, &#9733; para ★), útil para inserir símbolos diretamente no código-fonte de uma página.',
      },
      {
        question: 'Os favoritos ficam salvos?',
        answer:
          'Sim. Favoritos e histórico de símbolos copiados recentemente ficam salvos localmente no seu navegador e continuam disponíveis na próxima visita.',
      },
      {
        question: 'A ferramenta funciona no celular?',
        answer:
          'Sim. A busca, as categorias e a cópia funcionam normalmente em navegadores mobile, com layout adaptado para telas pequenas.',
      },
    ],
  },
  en: {
    name: 'Symbols to Copy and Paste',
    shortDescription:
      '300+ Unicode symbols organized in 12 categories with search, favorites, history, and copy as text, HTML entity, or codepoint.',
    primaryKeyword: 'symbols to copy and paste',
    secondaryKeywords: [
      'arrow symbol copy paste',
      'heart symbol copy paste',
      'star symbol to copy',
      'symbols for instagram bio',
      'math symbols copy paste',
      'currency symbol copy paste',
    ],
    searchIntent:
      'People looking for a specific symbol (arrow, heart, star, math symbol) to quickly copy and paste into a bio, post, or document.',
    seoTitle: 'Symbols to Copy and Paste | Arrows, Hearts, Stars and More',
    seoDescription:
      'Copy Unicode symbols organized by category: arrows, hearts, stars, math, currency and more. Search, build sequences, and copy as text, HTML, or codepoint.',
    h1: 'Symbols to Copy and Paste, Organized by Category',
    intro:
      'Pick a category or search by name, click to copy, and build sequences combining several symbols before pasting anywhere.',
    contentBlocks: [
      {
        title: 'How to use the symbol catalog',
        paragraphs: [
          'Pick a category at the top of the tool (arrows, hearts, stars, math, currency, check marks, lines & borders, music, zodiac, Greek letters, bullet points, or chess & game) or type a term in the search box to filter by name. Click any symbol to copy it instantly, or switch to "build sequence" mode to combine several symbols into one string before copying everything at once.',
          'The format toggle lets you switch between copying the raw character, the HTML entity (useful for website source code), or the Unicode codepoint (useful for technical documentation and debugging). Favorites and the recently-copied history are saved locally in your browser, so they stay available on your next visit.',
        ],
      },
      {
        title: 'Where to use these symbols',
        paragraphs: [
          'These symbols work anywhere that accepts Unicode text: Instagram and TikTok bios, X/Twitter and Facebook posts, usernames, spreadsheets, presentations, documents, and even HTML/CSS/JS source code. Since they are real text characters (not images), they adapt to the surrounding font size and color.',
        ],
        list: [
          'Decorate a social media bio or post.',
          'Insert arrows and bullets into presentations and spreadsheets.',
          'Use math and Greek symbols in technical writing.',
          'Copy the HTML entity straight into a website\'s source code.',
        ],
      },
      {
        title: 'Device and font compatibility',
        paragraphs: [
          'Most symbols in this list are part of the standard Unicode set and are broadly supported across modern browsers, phones, and apps. Even so, the active font on a given platform may render some symbols slightly differently, and very recent symbols can show as a blank square on older systems. If a symbol doesn\'t display correctly, try an alternative from the same category.',
        ],
      },
      {
        title: 'Local processing and privacy',
        paragraphs: [
          'Search, favorites, history, and copying all happen entirely in your browser. No typed text or selected symbol is sent to a server, and saved data (favorites and history) stays only in your own device\'s local storage.',
        ],
      },
    ],
    faq: [
      {
        question: 'How do I copy a symbol?',
        answer:
          'Click the symbol you want. It is copied automatically to your clipboard in the selected format (text, HTML, or codepoint).',
      },
      {
        question: 'Can I combine several symbols before copying?',
        answer:
          'Yes. Switch on the build-sequence mode, click symbols in the order you want, then copy the full sequence at once.',
      },
      {
        question: 'What is a symbol\'s HTML entity?',
        answer:
          'It is the character\'s HTML code representation (e.g. &#9733; for ★), useful for inserting symbols directly into a page\'s source code.',
      },
      {
        question: 'Are my favorites saved?',
        answer:
          'Yes. Favorites and the recently-copied history are saved locally in your browser and stay available on your next visit.',
      },
      {
        question: 'Does it work on mobile?',
        answer:
          'Yes. Search, categories, and copying all work normally on mobile browsers, with a layout adapted for small screens.',
      },
    ],
  },
  es: {
    name: 'Símbolos para Copiar y Pegar',
    shortDescription:
      'Más de 300 símbolos Unicode organizados en 12 categorías con búsqueda, favoritos, historial y copia como texto, entidad HTML o codepoint.',
    primaryKeyword: 'simbolos para copiar y pegar',
    secondaryKeywords: [
      'flecha para copiar',
      'corazon para copiar',
      'estrella para copiar',
      'simbolos para instagram',
      'simbolos matematicos para copiar',
      'simbolo de moneda para copiar',
    ],
    searchIntent:
      'Personas que buscan un simbolo especifico (flecha, corazon, estrella, simbolo matematico) para copiar y pegar rapidamente en una bio, post o documento.',
    seoTitle: 'Símbolos para Copiar y Pegar | Flechas, Corazones, Estrellas y Más',
    seoDescription:
      'Copia símbolos Unicode organizados por categoría: flechas, corazones, estrellas, matemáticas, monedas y más. Busca, arma secuencias y copia como texto, HTML o codepoint.',
    h1: 'Símbolos para Copiar y Pegar, Organizados por Categoría',
    intro:
      'Elige una categoría o busca por nombre, haz clic para copiar y arma secuencias combinando varios símbolos antes de pegarlos donde quieras.',
    contentBlocks: [
      {
        title: 'Cómo usar el catálogo de símbolos',
        paragraphs: [
          'Elige una categoría en la parte superior de la herramienta (flechas, corazones, estrellas, matemáticas, monedas, marcas de verificación, líneas y bordes, música, zodiaco, letras griegas, viñetas o ajedrez y juegos) o escribe un término en la búsqueda para filtrar por nombre. Haz clic en cualquier símbolo para copiarlo al instante, o activa el modo "armar secuencia" para combinar varios símbolos en una sola cadena antes de copiar todo de una vez.',
          'El selector de formato permite alternar entre copiar el carácter puro, la entidad HTML (útil para el código fuente de sitios web) o el codepoint Unicode (útil para documentación técnica y depuración). Los favoritos y el historial de símbolos copiados recientemente se guardan localmente en tu navegador, así que siguen disponibles en tu próxima visita.',
        ],
      },
      {
        title: 'Dónde usar estos símbolos',
        paragraphs: [
          'Estos símbolos funcionan en cualquier lugar que acepte texto Unicode: bio de Instagram y TikTok, posts de X/Twitter y Facebook, nombres de usuario, hojas de cálculo, presentaciones, documentos e incluso código fuente HTML/CSS/JS. Como son caracteres de texto reales (no imágenes), se adaptan al tamaño y color de la fuente que los rodea.',
        ],
        list: [
          'Decorar una bio o post en redes sociales.',
          'Insertar flechas y viñetas en presentaciones y hojas de cálculo.',
          'Usar símbolos matemáticos y griegos en textos técnicos.',
          'Copiar la entidad HTML directo al código fuente de un sitio.',
        ],
      },
      {
        title: 'Compatibilidad entre dispositivos y fuentes',
        paragraphs: [
          'La mayoría de los símbolos de esta lista forman parte del estándar Unicode y son ampliamente compatibles con navegadores, celulares y apps modernas. Aun así, la fuente activa en cada plataforma puede mostrar algunos símbolos de forma ligeramente distinta, y los símbolos muy recientes pueden aparecer como un cuadrado vacío en sistemas antiguos. Si un símbolo no se muestra correctamente, prueba una alternativa de la misma categoría.',
        ],
      },
      {
        title: 'Procesamiento local y privacidad',
        paragraphs: [
          'La búsqueda, los favoritos, el historial y la copia ocurren completamente en tu navegador. Ningún texto escrito ni símbolo seleccionado se envía a un servidor, y los datos guardados (favoritos e historial) quedan solo en el almacenamiento local de tu propio dispositivo.',
        ],
      },
    ],
    faq: [
      {
        question: '¿Cómo copio un símbolo?',
        answer:
          'Haz clic en el símbolo que quieras. Se copia automáticamente al portapapeles en el formato seleccionado (texto, HTML o codepoint).',
      },
      {
        question: '¿Puedo combinar varios símbolos antes de copiar?',
        answer:
          'Sí. Activa el modo de armar secuencia, haz clic en los símbolos en el orden deseado y copia la secuencia completa de una vez.',
      },
      {
        question: '¿Qué es la entidad HTML de un símbolo?',
        answer:
          'Es la representación del carácter en código HTML (por ejemplo, &#9733; para ★), útil para insertar símbolos directo en el código fuente de una página.',
      },
      {
        question: '¿Se guardan mis favoritos?',
        answer:
          'Sí. Los favoritos y el historial de símbolos copiados recientemente se guardan localmente en tu navegador y siguen disponibles en tu próxima visita.',
      },
      {
        question: '¿Funciona en el celular?',
        answer:
          'Sí. La búsqueda, las categorías y la copia funcionan con normalidad en navegadores móviles, con un diseño adaptado a pantallas pequeñas.',
      },
    ],
  },
  zh: {
    name: '可复制符号大全',
    shortDescription:
      '300多个 Unicode 符号,按12个分类整理,支持搜索、收藏、历史记录,并可复制为文本、HTML 实体或 Unicode 编码点。',
    primaryKeyword: '符号复制粘贴',
    secondaryKeywords: [
      '箭头符号复制',
      '爱心符号复制',
      '星星符号复制',
      'instagram 简介符号',
      '数学符号复制粘贴',
      '货币符号复制',
    ],
    searchIntent:
      '需要快速找到特定符号(箭头、爱心、星星、数学符号)并复制粘贴到简介、帖子或文档中的用户。',
    seoTitle: '可复制符号大全 | 箭头、爱心、星星等',
    seoDescription:
      '按分类复制 Unicode 符号:箭头、爱心、星星、数学符号、货币符号等。支持搜索、组合序列,并可复制为文本、HTML 或编码点。',
    h1: '按分类整理的可复制符号大全',
    intro:
      '选择一个分类或按名称搜索,点击即可复制,还可以组合多个符号后再一次性粘贴到任何地方。',
    contentBlocks: [
      {
        title: '如何使用符号目录',
        paragraphs: [
          '在工具顶部选择一个分类(箭头、爱心、星星、数学、货币、对勾标记、线条与边框、音乐、星座、希腊字母、项目符号,或棋类与游戏符号),或在搜索框中输入关键词按名称筛选。点击任意符号即可立即复制,也可以切换到"组合序列"模式,将多个符号合并成一个字符串后一次性复制。',
          '格式切换按钮可以在复制原始字符、HTML 实体(适用于网站源代码)或 Unicode 编码点(适用于技术文档和调试)之间切换。收藏和最近复制的历史记录会保存在浏览器本地,下次访问时依然可用。',
        ],
      },
      {
        title: '这些符号可以用在哪里',
        paragraphs: [
          '这些符号适用于任何支持 Unicode 文本的地方:Instagram 和 TikTok 简介、X/Twitter 和 Facebook 帖子、用户名、电子表格、演示文稿、文档,甚至 HTML/CSS/JS 源代码。由于它们是真正的文字字符(而非图片),会自动适应周围文字的大小和颜色。',
        ],
        list: [
          '装饰社交媒体简介或帖子。',
          '在演示文稿和电子表格中插入箭头和项目符号。',
          '在技术文档中使用数学和希腊字母符号。',
          '将 HTML 实体直接复制到网站源代码中。',
        ],
      },
      {
        title: '设备与字体兼容性',
        paragraphs: [
          '本列表中的大多数符号都属于标准 Unicode 字符集,在现代浏览器、手机和应用中都有广泛支持。不过不同平台使用的字体可能会让部分符号呈现略有差异,一些非常新的符号在较旧的系统上可能显示为空白方框。如果某个符号显示不正常,可以尝试同一分类中的其他符号。',
        ],
      },
      {
        title: '本地处理与隐私',
        paragraphs: [
          '搜索、收藏、历史记录和复制操作完全在你的浏览器中完成。输入的文字或选中的符号都不会发送到服务器,保存的数据(收藏和历史记录)只保留在你自己设备的本地存储中。',
        ],
      },
    ],
    faq: [
      {
        question: '如何复制一个符号?',
        answer:
          '点击你想要的符号即可,它会按你选择的格式(文本、HTML 或编码点)自动复制到剪贴板。',
      },
      {
        question: '可以在复制前组合多个符号吗?',
        answer: '可以。开启"组合序列"模式,按顺序点击符号,然后一次性复制完整的序列。',
      },
      {
        question: '符号的 HTML 实体是什么?',
        answer:
          '是该字符对应的 HTML 代码表示(例如 ★ 对应 &#9733;),适用于直接在页面源代码中插入符号。',
      },
      {
        question: '收藏会被保存吗?',
        answer: '会。收藏和最近复制的历史记录会保存在浏览器本地,下次访问时依然可用。',
      },
      {
        question: '这个工具在手机上能用吗?',
        answer: '可以。搜索、分类和复制功能在移动端浏览器中都能正常使用,布局也针对小屏幕做了适配。',
      },
    ],
  },
};

export const getSymbolsToCopyContent = (locale: AppLocale): SymbolsToCopyContent =>
  contentByLocale[locale];
