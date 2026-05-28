import type { ContentBlock, FaqItem } from '@/types/content';

export const textDiffIntro =
  'Compare duas versoes de texto online com diff visual, resumo executivo, metricas de mudanca e modo para listas.';

export const textDiffContentBlocks: ContentBlock[] = [
  {
    title: 'Comparador de textos para contratos, redacao, SEO e codigo',
    paragraphs: [
      'Esta ferramenta compara texto original e texto novo para destacar adicoes, remocoes e alteracoes em poucos segundos. Ela funciona bem para revisar termos, artigos, documentacao tecnica, descricoes de produto e trechos de codigo.',
      'Voce pode alternar o nivel de comparacao por caractere, palavra, linha, paragrafo ou lista, dependendo do tipo de conteudo que esta analisando.',
    ],
  },
  {
    title: 'Metricas praticas para tomada de decisao',
    paragraphs: [
      'A pagina mostra similaridade, variacao de tamanho, quantidade de adicoes e remocoes e resumo executivo com foco no impacto da mudanca. Isso facilita revisoes rapidas por times de conteudo, juridico, suporte e produto.',
      'Tambem e possivel ignorar diferencas cosmeticas, como maiusculas, acentos, espacos extras e pontuacao, para focar no que realmente mudou no texto.',
    ],
    list: [
      'Diff lado a lado para comparar versoes de forma clara.',
      'Diff inline para leitura continua com destaques.',
      'Lista de alteracoes para auditoria rapida.',
      'Modo de comparacao de listas (itens em comum e divergentes).',
      'Exportacao de relatorio em TXT e JSON.',
    ],
  },
  {
    title: 'Privacidade e processamento local',
    paragraphs: [
      'Os textos comparados permanecem no navegador. O processamento e local por padrao, sem necessidade de envio para servidor para gerar diff e estatisticas.',
      'Para textos muito grandes, o desempenho depende do dispositivo. Em cenarios extensos, vale dividir em blocos para manter a interface fluida em mobile.',
    ],
  },
];

export const textDiffFaq: FaqItem[] = [
  {
    question: 'Como comparar dois textos online?',
    answer:
      'Cole o texto original e o texto novo, escolha o modo de comparacao e clique em comparar para ver o diff.',
  },
  {
    question: 'A ferramenta mostra o que foi adicionado e removido?',
    answer:
      'Sim. O resultado exibe adicoes, remocoes e resumo das mudancas por versao.',
  },
  {
    question: 'Posso comparar contratos e codigo?',
    answer:
      'Sim. O comparador funciona para contratos, artigos, redacao, markdown, html e blocos de codigo.',
  },
  {
    question: 'Existe modo para comparar listas?',
    answer:
      'Sim. No modo lista, voce ve itens em comum, itens unicos e duplicados de cada lado.',
  },
  {
    question: 'Meus textos sao enviados para servidor?',
    answer:
      'Nao por padrao. O diff e as metricas sao calculados localmente no navegador.',
  },
];
