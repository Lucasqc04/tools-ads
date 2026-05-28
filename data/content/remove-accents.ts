import type { AppLocale } from '@/lib/i18n/config';
import type { ContentBlock, FaqItem } from '@/types/content';

export type RemoveAccentsLocaleContent = {
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

const contentByLocale: Record<AppLocale, RemoveAccentsLocaleContent> = {
  'pt-br': {
    name: 'Remover Acentos de Texto',
    shortDescription: 'Remova acentos, cedilha e caracteres especiais de textos para URL, arquivo, planilha e padronizacao de dados.',
    primaryKeyword: 'remover acentos de texto online',
    secondaryKeywords: ['tirar acento', 'remover cedilha', 'texto sem acento', 'normalizar texto', 'gerar texto para slug'],
    searchIntent: 'Usuarios e devs que precisam normalizar texto para sistemas, arquivos, URLs e integracoes.',
    seoTitle: 'Remover Acentos de Texto Online | Tirar Cedilha e Caracteres Especiais',
    seoDescription: 'Converta texto com acentos para versao limpa, com opcoes de caixa, remocao de simbolos, emojis e geracao estilo slug.',
    h1: 'Remover Acentos de Texto Online',
    intro: 'Transforme textos com acentos e cedilha em versoes normalizadas para uso tecnico e operacional.',
    contentBlocks: [
      {
        title: 'Quando remover acentos',
        paragraphs: [
          'Em muitos sistemas, nomes de arquivo, chaves tecnicas e URLs funcionam melhor sem acentos. Essa normalizacao reduz conflitos e facilita integracoes.',
          'A ferramenta converte rapidamente caracteres como acao para acao, Joao para Joao e Sao Paulo para Sao Paulo sem alterar o significado principal.',
        ],
      },
      {
        title: 'Opcoes de limpeza e padronizacao',
        paragraphs: [
          'Voce pode manter caixa original, forcar minusculas/maiusculas, remover simbolos, colapsar espacos e trocar espacos por hifen ou underscore.',
          'Tambem e possivel gerar versao estilo slug para reaproveitar em URLs e identificadores.',
        ],
      },
      {
        title: 'Diferenca entre normalizar e traduzir',
        paragraphs: [
          'Remover acentos nao traduz idioma nem corrige contexto gramatical. A acao apenas adapta caracteres para uma versao mais simples.',
          'Alguns alfabetos especiais podem exigir tratamento adicional dependendo do sistema de destino.',
        ],
      },
    ],
    faq: [
      { question: 'A ferramenta remove cedilha tambem?', answer: 'Sim. Caracteres como c e C com cedilha sao convertidos para c e C.' },
      { question: 'Posso manter estrutura de multiplas linhas?', answer: 'Sim. O texto e processado sem obrigar perda de quebras de linha.' },
      { question: 'Consigo gerar versao para slug?', answer: 'Sim. Existe opcao para gerar formato mais amigavel para URL.' },
      { question: 'Os dados ficam locais?', answer: 'Sim. O processamento acontece no navegador.' },
    ],
  },
  en: {
    name: 'Remove Accents from Text',
    shortDescription: 'Remove accents and special characters for URLs, filenames, spreadsheets, and normalized identifiers.',
    primaryKeyword: 'remove accents from text online',
    secondaryKeywords: ['remove diacritics', 'text normalization', 'strip accents', 'slug text cleaner', 'normalize unicode text'],
    searchIntent: 'Users and developers normalizing text for technical systems and compatibility.',
    seoTitle: 'Remove Accents from Text Online | Normalize Special Characters',
    seoDescription: 'Convert accented text into normalized output with case options, symbol cleanup, emoji removal, and slug-style mode.',
    h1: 'Remove Accents from Text Online',
    intro: 'Normalize accented text for technical usage, clean identifiers, and safer URL/file workflows.',
    contentBlocks: [
      {
        title: 'Why accent removal is useful',
        paragraphs: [
          'Many systems work better with plain ASCII-like identifiers. Removing diacritics improves compatibility in URLs, filenames, and legacy pipelines.',
          'This tool quickly converts accented strings while preserving practical readability.',
        ],
      },
      {
        title: 'Cleanup controls',
        paragraphs: [
          'Choose lowercase/uppercase, remove punctuation and symbols, strip emojis, and normalize spacing.',
          'You can also output slug-friendly text for routing and IDs.',
        ],
      },
      {
        title: 'Important limitation',
        paragraphs: [
          'Accent removal is not translation. It normalizes characters but does not change language semantics.',
          'Some scripts may require custom transliteration rules depending on target systems.',
        ],
      },
    ],
    faq: [
      { question: 'Does it also remove cedilla-like characters?', answer: 'Yes. Common accented variants are normalized.' },
      { question: 'Can I keep multi-line text?', answer: 'Yes. Multi-line content is supported.' },
      { question: 'Can it generate slug-like output?', answer: 'Yes. Slug mode is available.' },
      { question: 'Is processing local?', answer: 'Yes. Everything runs in-browser.' },
    ],
  },
  es: {
    name: 'Quitar Acentos de Texto',
    shortDescription: 'Quita acentos y caracteres especiales para URLs, nombres de archivo, planillas y normalizacion.',
    primaryKeyword: 'quitar acentos de texto online',
    secondaryKeywords: ['eliminar acentos', 'normalizar texto', 'texto sin acentos', 'limpiar caracteres especiales', 'texto para slug'],
    searchIntent: 'Usuarios que necesitan estandarizar texto para sistemas e integraciones.',
    seoTitle: 'Quitar Acentos de Texto Online | Normalizar Caracteres',
    seoDescription: 'Convierte texto con acentos a formato limpio con opciones de mayusculas/minusculas, simbolos, emojis y modo slug.',
    h1: 'Quitar Acentos de Texto Online',
    intro: 'Normaliza texto con acentos para usar en URLs, archivos, planillas y sistemas.',
    contentBlocks: [
      {
        title: 'Para que sirve quitar acentos',
        paragraphs: [
          'Muchos sistemas antiguos o tecnicos prefieren texto sin acentos para evitar errores de compatibilidad.',
          'Esta herramienta ayuda a convertir rapidamente texto acentuado en una version mas simple.',
        ],
      },
      {
        title: 'Opciones de transformacion',
        paragraphs: [
          'Puedes definir mayusculas/minusculas, eliminar puntuacion/simbolos, remover emojis y ajustar espacios.',
          'Tambien puedes generar una version tipo slug para URLs.',
        ],
      },
      {
        title: 'Limites de la herramienta',
        paragraphs: [
          'Quitar acentos no traduce el idioma. Solo normaliza caracteres.',
          'Algunos alfabetos especiales pueden necesitar reglas adicionales.',
        ],
      },
    ],
    faq: [
      { question: 'Elimina tambien cedilla?', answer: 'Si. Incluye conversion de caracteres similares.' },
      { question: 'Soporta varias lineas?', answer: 'Si. Puedes procesar texto multilinea.' },
      { question: 'Puede generar modo slug?', answer: 'Si. Hay opcion para salida estilo slug.' },
      { question: 'Se procesa localmente?', answer: 'Si. Todo corre en el navegador.' },
    ],
  },
};

export const getRemoveAccentsContent = (locale: AppLocale): RemoveAccentsLocaleContent =>
  contentByLocale[locale] ?? contentByLocale['pt-br'];

export const removeAccentsIntro = contentByLocale['pt-br'].intro;
export const removeAccentsContentBlocks = contentByLocale['pt-br'].contentBlocks;
export const removeAccentsFaq = contentByLocale['pt-br'].faq;
