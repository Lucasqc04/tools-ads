import type { AppLocale } from '@/lib/i18n/config';
import type { ContentBlock, FaqItem } from '@/types/content';

export type SlugGeneratorLocaleContent = {
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

const contentByLocale: Record<AppLocale, SlugGeneratorLocaleContent> = {
  'pt-br': {
    name: 'Gerador de Slug para URL',
    shortDescription: 'Transforme títulos e frases em slugs limpos para URL, com opção de separador, limite de tamanho e sugestões.',
    primaryKeyword: 'gerador de slug para url',
    secondaryKeywords: ['slug generator', 'criar slug online', 'url amigavel', 'slug para wordpress', 'slug para nextjs'],
    searchIntent: 'Criadores e devs que precisam gerar URLs amigaveis para blog, e-commerce e CMS.',
    seoTitle: 'Gerador de Slug para URL Online | Criar Slug Amigável',
    seoDescription: 'Gere o slug de um título: a ferramenta tira acentos e símbolos, escolhe hífen ou underscore, limita o tamanho e monta a URL completa com prefixo.',
    h1: 'Gerador de Slug para URL',
    intro: 'Digite um título ou uma frase e gere um slug limpo para a URL de posts, páginas, produtos e categorias, sem acentos, símbolos nem espaços.',
    contentBlocks: [
      {
        title: 'O que é um slug e como gerar o seu',
        paragraphs: [
          'Slug é o trecho final de uma URL que identifica a página de forma legível, como "camiseta-premium-azul" em site.com/loja/camiseta-premium-azul. Cole o título no campo "Texto original" e o slug aparece na hora, junto com a URL completa montada com o prefixo que você informar.',
          'Exemplo: "Lançamento: Camiseta Premium Azul #Coleção" vira "lancamento-camiseta-premium-azul-colecao". A ferramenta sempre tira os acentos e a cedilha e troca espaços e traços repetidos por um único separador.',
        ],
      },
      {
        title: 'Opções de configuração',
        paragraphs: [
          'Você pode escolher hífen ou underscore como separador, manter ou não as letras minúsculas, remover pontuação, emojis e palavras comuns (como "de", "para", "com", "the" e "el") e definir o tamanho máximo (80 caracteres por padrão). Com "cortar só entre palavras" ligado, o limite vale por palavras inteiras: uma palavra que não cabe é pulada, e palavras menores que vierem depois ainda podem entrar.',
          'Os botões de sugestão mostram variações do slug gerado: com underscore, com hífen, sem separador e com o sufixo -2026. O histórico guarda os 20 últimos slugs que você salvar, no armazenamento local deste navegador.',
        ],
        list: [
          'Hífen é o separador mais comum em blogs, CMS e lojas.',
          'Use o prefixo para ver a URL final antes de colar no painel.',
          'O alerta de slug longo aparece acima de 72 caracteres.',
        ],
      },
      {
        title: 'Boas práticas e limites',
        paragraphs: [
          'Prefira slugs curtos, com as palavras que descrevem a página, e evite mudá-los depois de publicar, pois o endereço antigo deixa de funcionar a menos que exista um redirecionamento. Remover palavras comuns deixa o slug menor, mas confira se o sentido continua claro.',
          'A ferramenta não confere se o slug já existe no seu site e não converte alfabetos como o cirílico ou o chinês para letras latinas: esses caracteres são mantidos. Tudo é processado no navegador, sem envio do texto ao servidor.',
        ],
      },
    ],
    faq: [
      { question: 'Posso escolher hífen ou underscore?', answer: 'Sim. O seletor de separador alterna entre hífen (-) e underscore (_). Os dois formatos são aceitos em URLs, mas o hífen é o mais usado.' },
      { question: 'A ferramenta remove acentos e emojis?', answer: 'Os acentos e a cedilha são sempre removidos. Pontuação e emojis também saem por padrão, mas você pode desmarcar essas opções.' },
      { question: 'Como limitar o tamanho do slug?', answer: 'Informe o tamanho máximo. Com "cortar só entre palavras" ligado, a ferramenta usa só palavras inteiras que cabem no limite; desligado, ela corta o texto no tamanho exato.' },
      { question: 'Consigo copiar a URL completa com o prefixo do meu site?', answer: 'Sim. Digite o endereço base no campo de prefixo, por exemplo https://meusite.com/blog, e use "Copiar URL completa". Barras no final do prefixo são ignoradas.' },
    ],
  },
  en: {
    name: 'URL Slug Generator',
    shortDescription: 'Turn titles and phrases into clean URL slugs with separator, length, and suggestion controls.',
    primaryKeyword: 'url slug generator online',
    secondaryKeywords: ['slug generator', 'create slug online', 'friendly url slug', 'slug for wordpress', 'slug for nextjs'],
    searchIntent: 'Creators and developers generating clean slugs for blog posts, products, and CMS pages.',
    seoTitle: 'URL Slug Generator Online | Create Clean Friendly Slugs',
    seoDescription: 'Generate URL slugs from text with accent removal, separator choice, max length, and final URL preview.',
    h1: 'URL Slug Generator Online',
    intro: 'Create clean and consistent slugs for content, products, and categories with practical controls.',
    contentBlocks: [
      {
        title: 'What a slug is',
        paragraphs: [
          'A slug is the readable part of a URL path. Good slugs improve readability and make link structures easier to manage.',
          'This tool normalizes text into URL-safe segments and removes unnecessary noise.',
        ],
      },
      {
        title: 'Configurable rules',
        paragraphs: [
          'Choose hyphen or underscore, remove stopwords, set maximum length, and avoid cutting words when trimming.',
          'You can also use a URL prefix to preview final routes before publishing.',
        ],
      },
      {
        title: 'Practical limits',
        paragraphs: [
          'Automatic slug generation helps consistency, but final wording should still match your content intent.',
          'Keep slugs short and meaningful for better usability.',
        ],
      },
    ],
    faq: [
      { question: 'Can I choose hyphen or underscore?', answer: 'Yes. You can choose your preferred separator.' },
      { question: 'Can it remove accents and emojis?', answer: 'Yes. Cleanup options include accents, punctuation, and emojis.' },
      { question: 'Can I limit slug length without cutting words?', answer: 'Yes. You can keep word boundaries while limiting length.' },
      { question: 'Can I copy full URL with prefix?', answer: 'Yes. Add a prefix and copy the full URL preview.' },
    ],
  },
  es: {
    name: 'Generador de Slug para URL',
    shortDescription: 'Convierte titulos y frases en slugs limpios para URL con separador, longitud y sugerencias.',
    primaryKeyword: 'generador de slug para url',
    secondaryKeywords: ['slug generator', 'crear slug online', 'url amigable', 'slug para wordpress', 'slug para nextjs'],
    searchIntent: 'Creadores y developers que necesitan slugs limpios para contenido y catalogos.',
    seoTitle: 'Generador de Slug para URL Online | URL Limpia y Amigable',
    seoDescription: 'Transforma texto en slug con control de separador, limpieza de acentos y preview de URL final.',
    h1: 'Generador de Slug para URL Online',
    intro: 'Crea slugs claros para posts, productos y paginas con opciones de formato y limpieza.',
    contentBlocks: [
      {
        title: 'Que es un slug',
        paragraphs: [
          'Slug es la parte legible de la URL. Un buen slug facilita navegacion y organizacion de contenido.',
          'La herramienta convierte texto en formato amigable eliminando ruido innecesario.',
        ],
      },
      {
        title: 'Opciones de personalizacion',
        paragraphs: [
          'Puedes elegir separador, limitar longitud, remover palabras comunes y mantener corte por palabra.',
          'Tambien puedes agregar prefijo para previsualizar URL final.',
        ],
      },
      {
        title: 'Recomendaciones',
        paragraphs: [
          'Mantener slugs cortos y semanticos mejora lectura y mantenimiento.',
          'La herramienta automatiza, pero la eleccion final del texto sigue siendo editorial.',
        ],
      },
    ],
    faq: [
      { question: 'Puedo elegir guion o underscore?', answer: 'Si. Puedes definir el separador.' },
      { question: 'Quita acentos y emojis?', answer: 'Si. Incluye opciones de limpieza.' },
      { question: 'Puedo limitar sin cortar palabras?', answer: 'Si. Hay opcion para respetar palabras.' },
      { question: 'Puedo copiar URL completa con prefijo?', answer: 'Si. Puedes copiar el preview final.' },
    ],
  },
  zh: {
    name: 'URL Slug Generator',
    shortDescription: 'Turn titles and phrases into clean URL slugs with separator, length, and suggestion controls.',
    primaryKeyword: 'url slug generator online',
    secondaryKeywords: ['slug generator', 'create slug online', 'friendly url slug', 'slug for wordpress', 'slug for nextjs'],
    searchIntent: 'Creators and developers generating clean slugs for blog posts, products, and CMS pages.',
    seoTitle: 'URL Slug Generator Online | Create Clean Friendly Slugs',
    seoDescription: 'Generate URL slugs from text with accent removal, separator choice, max length, and final URL preview.',
    h1: 'URL Slug Generator Online',
    intro: 'Create clean and consistent slugs for content, products, and categories with practical controls.',
    contentBlocks: [
      {
        title: 'What a slug is',
        paragraphs: [
          'A slug is the readable part of a URL path. Good slugs improve readability and make link structures easier to manage.',
          'This tool normalizes text into URL-safe segments and removes unnecessary noise.',
        ],
      },
      {
        title: 'Configurable rules',
        paragraphs: [
          'Choose hyphen or underscore, remove stopwords, set maximum length, and avoid cutting words when trimming.',
          'You can also use a URL prefix to preview final routes before publishing.',
        ],
      },
      {
        title: 'Practical limits',
        paragraphs: [
          'Automatic slug generation helps consistency, but final wording should still match your content intent.',
          'Keep slugs short and meaningful for better usability.',
        ],
      },
    ],
    faq: [
      { question: 'Can I choose hyphen or underscore?', answer: 'Yes. You can choose your preferred separator.' },
      { question: 'Can it remove accents and emojis?', answer: 'Yes. Cleanup options include accents, punctuation, and emojis.' },
      { question: 'Can I limit slug length without cutting words?', answer: 'Yes. You can keep word boundaries while limiting length.' },
      { question: 'Can I copy full URL with prefix?', answer: 'Yes. Add a prefix and copy the full URL preview.' },
    ],
  },
};

export const getSlugGeneratorContent = (locale: AppLocale): SlugGeneratorLocaleContent =>
  contentByLocale[locale] ?? contentByLocale['pt-br'];

export const slugGeneratorIntro = contentByLocale['pt-br'].intro;
export const slugGeneratorContentBlocks = contentByLocale['pt-br'].contentBlocks;
export const slugGeneratorFaq = contentByLocale['pt-br'].faq;
