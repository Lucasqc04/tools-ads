import type { AppLocale } from '@/lib/i18n/config';
import type { ContentBlock, FaqItem } from '@/types/content';

export type UuidNanoIdLocaleContent = {
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

const contentByLocale: Record<AppLocale, UuidNanoIdLocaleContent> = {
  'pt-br': {
    name: 'Gerador de UUID, ULID, KSUID, CUID2 e NanoID',
    shortDescription: 'Gere UUID v1-v7, NanoID, ULID, KSUID, CUID2 e ObjectId em lote, com copia rapida e exportacao TXT/CSV.',
    primaryKeyword: 'gerador de uuid ulid ksuid cuid2 e nanoid online',
    secondaryKeywords: ['uuid v7 generator', 'uuid v1 v3 v4 v5 v6 v7', 'gerar nanoid', 'gerar ulid', 'gerar ksuid'],
    searchIntent: 'Devs que precisam gerar identificadores unicos para API, banco de dados, logs, testes e mocks.',
    seoTitle: 'Gerador de UUID v1-v7, ULID, KSUID, CUID2 e NanoID Online',
    seoDescription: 'Crie IDs com UUID (todas as versoes), NanoID, ULID, KSUID, CUID2 e ObjectId com exportacao rapida em TXT/CSV.',
    h1: 'Gerador de UUID, ULID, KSUID, CUID2 e NanoID Online',
    intro: 'Gere identificadores unicos no navegador para usar em testes, banco de dados, APIs, eventos e mocks.',
    contentBlocks: [
      {
        title: 'Padroes modernos de IDs para cada tipo de sistema',
        paragraphs: [
          'A ferramenta agora cobre UUID v1, v3, v4, v5, v6 e v7, alem de NanoID, ULID, KSUID, CUID2 e ObjectId. Isso permite escolher o formato ideal para APIs, bancos, filas, eventos e logs.',
          'Voce pode gerar em lote e exportar sem depender de backend, mantendo fluxo rapido para testes, seeds e mocks.',
        ],
      },
      {
        title: 'Quando usar cada formato',
        paragraphs: [
          'Use UUID v7 quando quer ordenacao temporal moderna. UUID v1/v6 tambem carregam tempo; v3/v5 sao deterministicas por namespace+nome. ULID e KSUID sao bons para ordenacao e leitura.',
          'Para testes e mocks, gerar lotes de IDs acelera criacao de payloads e fixtures sem depender de backend.',
        ],
      },
      {
        title: 'Privacidade e limitacoes',
        paragraphs: [
          'A geracao acontece no navegador usando API de criptografia do proprio ambiente. Nao existe cadastro ou envio obrigatorio para servidor.',
          'IDs curtos podem aumentar chance de colisao em cenarios de alto volume, especialmente com alfabetos pequenos.',
        ],
      },
    ],
    faq: [
      { question: 'Quais tipos de ID esta ferramenta gera?', answer: 'UUID v1-v7, NanoID, ULID, KSUID, CUID2 e ObjectId.' },
      { question: 'Posso gerar varios IDs de uma vez?', answer: 'Sim. Defina quantidade e gere em lote com copia e download.' },
      { question: 'Posso usar alfabeto personalizado no NanoID?', answer: 'Sim. Basta informar os caracteres desejados para montar os IDs.' },
      { question: 'A geracao e local?', answer: 'Sim. Tudo roda no navegador por padrao.' },
    ],
  },
  en: {
    name: 'UUID, ULID, KSUID, CUID2, and NanoID Generator',
    shortDescription: 'Generate UUID v1-v7, NanoID, ULID, KSUID, CUID2, and ObjectId in batches with quick export.',
    primaryKeyword: 'uuid ulid ksuid cuid2 and nanoid generator online',
    secondaryKeywords: ['uuid v7 generator', 'uuid all versions', 'generate nanoid', 'generate ulid', 'generate ksuid'],
    searchIntent: 'Developers generating unique IDs for APIs, databases, logs, events, and test data.',
    seoTitle: 'UUID v1-v7, ULID, KSUID, CUID2, and NanoID Generator Online',
    seoDescription: 'Generate IDs with UUID all versions, NanoID, ULID, KSUID, CUID2, and ObjectId. Export to TXT and CSV.',
    h1: 'UUID, ULID, KSUID, CUID2, and NanoID Generator Online',
    intro: 'Create unique identifiers in-browser for development, testing, mocks, APIs, and database records.',
    contentBlocks: [
      {
        title: 'Multiple ID standards in one place',
        paragraphs: [
          'You can generate UUID v1, v3, v4, v5, v6, and v7, plus NanoID, ULID, KSUID, CUID2, and Mongo-style ObjectId.',
          'This gives flexibility for API design, database keys, event streams, and reproducible deterministic identifiers.',
        ],
      },
      {
        title: 'Typical use cases',
        paragraphs: [
          'Use UUID v7 for modern time-ordered UUIDs, v3/v5 for deterministic namespace-based IDs, and ULID/KSUID for sortable token-like identifiers.',
          'Batch generation saves time when preparing fixtures, seeds, and mock API responses.',
        ],
      },
      {
        title: 'Local processing and limits',
        paragraphs: [
          'ID generation runs locally in your browser using secure random APIs.',
          'Very short IDs or tiny alphabets can increase collision risk in high volume environments.',
        ],
      },
    ],
    faq: [
      { question: 'Which ID types can I generate here?', answer: 'UUID v1-v7, NanoID, ULID, KSUID, CUID2, and ObjectId.' },
      { question: 'Can I generate many IDs at once?', answer: 'Yes. Set quantity and generate in batches.' },
      { question: 'Can I customize NanoID alphabet?', answer: 'Yes. You can define your own alphabet.' },
      { question: 'Is generation local?', answer: 'Yes. Processing happens in-browser.' },
    ],
  },
  es: {
    name: 'Generador de UUID, ULID, KSUID, CUID2 y NanoID',
    shortDescription: 'Genera UUID v1-v7, NanoID, ULID, KSUID, CUID2 y ObjectId por lote, con exportacion TXT/CSV.',
    primaryKeyword: 'generador de uuid ulid ksuid cuid2 y nanoid online',
    secondaryKeywords: ['uuid v7 generator', 'uuid todas las versiones', 'generar nanoid', 'generar ulid', 'generar ksuid'],
    searchIntent: 'Equipos tecnicos que necesitan identificadores unicos para APIs, logs, eventos y pruebas.',
    seoTitle: 'Generador de UUID v1-v7, ULID, KSUID, CUID2 y NanoID Online',
    seoDescription: 'Crea IDs con UUID todas las versiones, NanoID, ULID, KSUID, CUID2 y ObjectId. Exporta en TXT/CSV.',
    h1: 'Generador de UUID, ULID, KSUID, CUID2 y NanoID Online',
    intro: 'Genera identificadores unicos en el navegador para desarrollo, testing y datos de ejemplo.',
    contentBlocks: [
      {
        title: 'Estandares de ID para casos reales',
        paragraphs: [
          'Puedes generar UUID v1, v3, v4, v5, v6 y v7, ademas de NanoID, ULID, KSUID, CUID2 y ObjectId.',
          'Con esta pagina generas lotes y exportas IDs para API, base de datos, backend y frontend.',
        ],
      },
      {
        title: 'Cuando elegir cada formato',
        paragraphs: [
          'Usa UUID v7 para orden temporal moderna, UUID v3/v5 para IDs deterministas y ULID/KSUID para identificadores ordenables.',
          'Para testing, generar listas acelera creacion de mocks y fixtures.',
        ],
      },
      {
        title: 'Privacidad y limitaciones',
        paragraphs: [
          'La generacion se hace localmente en el navegador.',
          'IDs muy cortos o alfabetos pequenos aumentan probabilidad de colisiones.',
        ],
      },
    ],
    faq: [
      { question: 'Que tipos de ID puedo generar?', answer: 'UUID v1-v7, NanoID, ULID, KSUID, CUID2 y ObjectId.' },
      { question: 'Puedo generar multiples IDs?', answer: 'Si. Puedes generar en lote.' },
      { question: 'Puedo usar alfabeto personalizado?', answer: 'Si. NanoID permite definir alfabeto propio.' },
      { question: 'Se genera localmente?', answer: 'Si. Todo corre en el navegador.' },
    ],
  },
};

export const getUuidNanoIdContent = (locale: AppLocale): UuidNanoIdLocaleContent =>
  contentByLocale[locale] ?? contentByLocale['pt-br'];

export const uuidNanoIdIntro = contentByLocale['pt-br'].intro;
export const uuidNanoIdContentBlocks = contentByLocale['pt-br'].contentBlocks;
export const uuidNanoIdFaq = contentByLocale['pt-br'].faq;
