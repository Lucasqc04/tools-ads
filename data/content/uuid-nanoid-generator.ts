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
    shortDescription: 'Gere UUID v1 a v7, NanoID, ULID, KSUID, CUID2 e ObjectId em lote, com cópia rápida e exportação em TXT ou CSV.',
    primaryKeyword: 'gerador de uuid ulid ksuid cuid2 e nanoid online',
    secondaryKeywords: ['uuid v7 generator', 'uuid v1 v3 v4 v5 v6 v7', 'gerar nanoid', 'gerar ulid', 'gerar ksuid'],
    searchIntent: 'Devs que precisam gerar identificadores unicos para API, banco de dados, logs, testes e mocks.',
    seoTitle: 'Gerador de UUID v1-v7, ULID, KSUID, CUID2 e NanoID Online',
    seoDescription: 'Gere até 500 IDs por vez no navegador: UUID v1 a v7, NanoID com alfabeto próprio, ULID, KSUID, CUID2 e ObjectId. Copie ou exporte em TXT e CSV.',
    h1: 'Gerador de UUID, ULID, KSUID, CUID2 e NanoID Online',
    intro: 'Gere UUID, NanoID, ULID, KSUID, CUID2 e ObjectId no navegador, em lotes de até 500, para usar em testes, banco de dados, APIs, eventos e mocks.',
    contentBlocks: [
      {
        title: 'Como gerar identificadores em lote',
        paragraphs: [
          'Escolha o tipo de ID, informe a quantidade (de 1 a 500) e clique em "Gerar IDs". A lista pode ser copiada inteira, com os IDs separados por quebra de linha ou por vírgula, ou baixada em TXT ou CSV. Por padrão, a ferramenta gera 10 UUID v4.',
          'No UUID, você escolhe a versão (v1, v3, v4, v5, v6 ou v7). No NanoID, define o tamanho (de 4 a 128 caracteres, 21 por padrão) e, se quiser, o alfabeto: basta digitar os caracteres permitidos, e repetições são ignoradas.',
        ],
      },
      {
        title: 'Quando usar cada formato',
        paragraphs: [
          'UUID v4 é totalmente aleatório e serve para a maioria dos casos. UUID v7, ULID e KSUID começam com a hora de criação, então IDs gerados em sequência tendem a ficar em ordem, o que ajuda em índices de banco e em logs. UUID v1 e v6 também carregam tempo. CUID2 é curto e aleatório. NanoID é compacto e personalizável, e ObjectId segue o formato de 24 caracteres hexadecimais do MongoDB, com a hora de criação no início.',
          'UUID v3 e v5 não são aleatórios: o resultado vem de um namespace e de um nome. Com os mesmos dados, o ID é sempre o mesmo, o que serve para ter um identificador estável a partir de um texto. Em lotes, a ferramenta acrescenta o número da posição ao nome para que cada ID da lista seja diferente.',
        ],
        list: [
          'UUID v4: identificador aleatório de uso geral.',
          'UUID v7, ULID e KSUID: IDs que seguem a ordem de criação.',
          'UUID v3 e v5: IDs fixos gerados a partir de namespace e nome.',
          'NanoID: IDs curtos para URLs e códigos, com alfabeto e tamanho à escolha.',
        ],
      },
      {
        title: 'Privacidade e limites',
        paragraphs: [
          'Os IDs são gerados no seu navegador, com a API de números aleatórios do próprio navegador, e não são enviados ao servidor. Os valores baseados em hora (v1, v6, v7, ULID, KSUID e ObjectId) revelam quando foram criados, então evite usá-los onde essa informação não deva ficar pública.',
          'IDs curtos aumentam a chance de repetição, principalmente com alfabetos pequenos: um NanoID de 4 caracteres tem muito menos combinações que um de 21. A ferramenta avisa quando o tamanho informado é menor que 8. Ela não consulta um banco de dados, então não verifica se um ID já existe no seu sistema.',
        ],
      },
    ],
    faq: [
      { question: 'Quais tipos de ID esta ferramenta gera?', answer: 'UUID nas versões v1, v3, v4, v5, v6 e v7, NanoID, ULID, KSUID, CUID2 e ObjectId.' },
      { question: 'Quantos IDs posso gerar de uma vez?', answer: 'De 1 a 500 por lote. A lista pode ser copiada com quebra de linha ou vírgula, ou exportada em TXT e CSV.' },
      { question: 'Posso usar um alfabeto personalizado no NanoID?', answer: 'Sim. Digite os caracteres permitidos no campo de alfabeto. Repetições são ignoradas, e com menos de 2 caracteres distintos a ferramenta volta ao alfabeto padrão.' },
      { question: 'Por que o UUID v3 ou v5 repete o mesmo resultado?', answer: 'Porque ele é calculado a partir de um namespace e de um nome, sem aleatoriedade. Mudando o nome, o ID muda. Para IDs aleatórios, use o v4 ou o v7.' },
      { question: 'Os IDs são gerados no servidor?', answer: 'Não. A geração acontece no navegador e os IDs não são enviados nem guardados pelo servidor do site.' },
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
  zh: {
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
};

export const getUuidNanoIdContent = (locale: AppLocale): UuidNanoIdLocaleContent =>
  contentByLocale[locale] ?? contentByLocale['pt-br'];

export const uuidNanoIdIntro = contentByLocale['pt-br'].intro;
export const uuidNanoIdContentBlocks = contentByLocale['pt-br'].contentBlocks;
export const uuidNanoIdFaq = contentByLocale['pt-br'].faq;
