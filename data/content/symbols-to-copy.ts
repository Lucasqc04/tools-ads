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
};

export const getSymbolsToCopyContent = (locale: AppLocale): SymbolsToCopyContent =>
  contentByLocale[locale];
