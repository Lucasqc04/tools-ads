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
    shortDescription: 'Transforme titulos e frases em slugs limpos para URL com opcoes de separador, limite e sugestoes.',
    primaryKeyword: 'gerador de slug para url',
    secondaryKeywords: ['slug generator', 'criar slug online', 'url amigavel', 'slug para wordpress', 'slug para nextjs'],
    searchIntent: 'Criadores e devs que precisam gerar URLs amigaveis para blog, e-commerce e CMS.',
    seoTitle: 'Gerador de Slug para URL Online | Criar URL Amigavel',
    seoDescription: 'Converta textos em slugs limpos com remocao de acentos, controle de separador, limite de tamanho e preview da URL final.',
    h1: 'Gerador de Slug para URL',
    intro: 'Crie slugs limpos e consistentes para posts, paginas, produtos e categorias com controle total de formato.',
    contentBlocks: [
      {
        title: 'O que e slug e por que importa',
        paragraphs: [
          'Slug e a parte da URL que identifica um conteudo de forma legivel. Um bom slug facilita navegacao e melhora organizacao de links em diferentes sistemas.',
          'Nesta ferramenta voce transforma textos em slugs padronizados com remocao de acentos, simbolos e espacos extras.',
        ],
      },
      {
        title: 'Configuracoes para diferentes cenarios',
        paragraphs: [
          'Voce pode escolher separador, definir limite maximo, cortar sem quebrar palavra e remover termos comuns para deixar URL mais objetiva.',
          'Tambem e possivel montar preview com prefixo de dominio ou categoria, util para CMS, WordPress, Shopify e projetos Next.js.',
        ],
      },
      {
        title: 'Boas praticas e limitacoes',
        paragraphs: [
          'Slugs muito longos ficam dificeis de manter e compartilhar. Prefira termos diretos e coerentes com o conteudo da pagina.',
          'A ferramenta ajuda na normalizacao, mas a escolha final de palavras continua sendo uma decisao editorial.',
        ],
      },
    ],
    faq: [
      { question: 'Posso escolher hifen ou underscore?', answer: 'Sim. Voce escolhe o separador conforme seu padrao.' },
      { question: 'A ferramenta remove acentos e emojis?', answer: 'Sim. Existem opcoes para limpeza de acentos, pontuacao e emojis.' },
      { question: 'Posso limitar tamanho sem quebrar palavra?', answer: 'Sim. Ha opcao para manter limites por palavra.' },
      { question: 'Consigo copiar URL completa com prefixo?', answer: 'Sim. Voce pode informar prefixo e copiar o resultado final.' },
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
};

export const getSlugGeneratorContent = (locale: AppLocale): SlugGeneratorLocaleContent =>
  contentByLocale[locale] ?? contentByLocale['pt-br'];

export const slugGeneratorIntro = contentByLocale['pt-br'].intro;
export const slugGeneratorContentBlocks = contentByLocale['pt-br'].contentBlocks;
export const slugGeneratorFaq = contentByLocale['pt-br'].faq;
