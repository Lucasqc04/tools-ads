import type { ContentBlock, FaqItem } from '@/types/content';

export const csvViewerIntro =
  'Cole um CSV ou envie um arquivo para ver os dados em tabela, com separador detectado automaticamente, filtros, ordenação e exportação em XLSX.';

export const csvViewerContentBlocks: ContentBlock[] = [
  {
    title: 'Como a ferramenta lê o seu CSV',
    paragraphs: [
      'Cole o texto na caixa ou envie um arquivo .csv ou .txt. A ferramenta testa quatro separadores (vírgula, ponto e vírgula, tabulação e barra vertical) e escolhe o que deixa as linhas com o número de colunas mais consistente. Esse é o cenário típico de planilhas exportadas em português, que costumam usar ponto e vírgula. Se a escolha automática não ficar certa, selecione o separador de leitura manualmente e a tabela é refeita na hora.',
      'Aspas duplas são respeitadas: um campo entre aspas pode conter o separador ou uma quebra de linha, e aspas duplas repetidas viram uma aspa dentro do texto. Linhas com menos colunas são completadas com células vazias e linhas vazias no final são descartadas.',
      'Exemplo: com as linhas nome;idade;cidade, Lucas;31;São Paulo e Ana;28;Porto, o separador detectado é o ponto e vírgula e a tabela mostra 3 colunas e 2 linhas de dados, usando a primeira linha como cabeçalho.',
    ],
  },
  {
    title: 'Tabela, filtros, conversão e exportação',
    paragraphs: [
      'A tabela mostra o número de linhas e colunas e permite ordenar por coluna, filtrar em todas as colunas ou em uma específica e escolher quantas linhas aparecem por página. A ordenação trata valores numéricos como números. A opção "Primeira linha como cabeçalho" define se a primeira linha vira o título das colunas.',
      'Você também pode converter o CSV para outro separador: escolha o separador do arquivo de saída, copie o resultado ou baixe um novo CSV. Os campos que contêm o novo separador, aspas ou quebra de linha saem entre aspas. O botão "Exportar XLSX" gera uma planilha com uma aba chamada CSV.',
    ],
    list: [
      'Aceita colar texto ou enviar .csv e .txt.',
      'Separadores: vírgula, ponto e vírgula, tabulação e barra vertical.',
      'A tabela mostra até 1.200 linhas, com ordenação, filtros e paginação.',
      'A exportação XLSX e a conversão de separador usam todas as linhas lidas, sem aplicar filtros nem ordenação.',
    ],
  },
  {
    title: 'Limites e privacidade',
    paragraphs: [
      'O arquivo é lido no navegador e os dados não são enviados ao nosso servidor. A leitura de arquivos usa a codificação UTF-8: se um arquivo salvo em outra codificação (como Windows-1252, comum em exportações antigas) mostrar acentos trocados, abra-o em um editor e salve como UTF-8 antes de enviar.',
      'Todas as células são tratadas como texto, inclusive no XLSX: números e datas não são convertidos para tipos do Excel. Arquivos muito grandes dependem da memória do aparelho, e a pré-visualização é limitada às 1.200 primeiras linhas.',
    ],
  },
];

export const csvViewerFaq: FaqItem[] = [
  {
    question: 'Posso colar CSV e também enviar arquivo?',
    answer:
      'Sim. Você pode colar o texto na caixa ou enviar um arquivo .csv ou .txt. Só o primeiro arquivo enviado é lido.',
  },
  {
    question: 'A detecção do separador é automática?',
    answer:
      'Sim, entre vírgula, ponto e vírgula, tabulação e barra vertical. Você pode trocar manualmente o separador de leitura quando a escolha automática não servir.',
  },
  {
    question: 'Dá para exportar para XLSX?',
    answer:
      'Sim. O botão "Exportar XLSX" baixa uma planilha com todas as linhas lidas, sem aplicar filtros e ordenação. Os valores são gravados como texto.',
  },
  {
    question: 'Meus dados são enviados para algum servidor?',
    answer:
      'Não. A leitura, a tabela, a conversão e a exportação acontecem no navegador. O conteúdo do arquivo não sai do seu aparelho.',
  },
];
