import type { ContentBlock, FaqItem } from '@/types/content';

export const csvViewerIntro =
  'Cole CSV ou envie arquivo para visualizar tabela, detectar separador automaticamente, trocar delimitador e exportar em XLSX sem cadastro.';

export const csvViewerContentBlocks: ContentBlock[] = [
  {
    title: 'Visualize CSV com deteccao inteligente de separador',
    paragraphs: [
      'Esta ferramenta identifica automaticamente os separadores mais comuns, como virgula, ponto e virgula, tab e barra vertical. Isso facilita abrir planilhas exportadas de sistemas diferentes sem ajuste manual inicial.',
      'Se a deteccao nao ficar do jeito que voce quer, basta trocar o separador em um clique e a tabela e recalculada na hora.',
    ],
  },
  {
    title: 'Cole texto, envie arquivo e converta para XLSX',
    paragraphs: [
      'Voce pode colar o conteudo CSV diretamente na caixa de texto ou enviar arquivos .csv e .txt. A visualizacao mostra linhas e colunas de forma responsiva, inclusive em telas pequenas.',
      'Depois da revisao, e possivel exportar para XLSX para continuar o trabalho em Excel, Google Sheets ou outras ferramentas de planilha.',
    ],
    list: [
      'Upload de arquivo CSV/TXT e leitura local no navegador.',
      'Tabela com rolagem interna para evitar scroll horizontal na pagina.',
      'Selecao manual de separador quando necessario.',
      'Exportacao em XLSX com um clique.',
      'Conversao rapida para outro delimitador de CSV.',
    ],
  },
  {
    title: 'Privacidade, qualidade e limites',
    paragraphs: [
      'O processamento acontece localmente no navegador. Os dados do CSV nao precisam ser enviados para servidor para abrir a tabela ou gerar o XLSX.',
      'Arquivos muito grandes podem exigir mais memoria no dispositivo. Para manter desempenho em celular, o ideal e revisar por partes quando o CSV tiver muitas linhas.',
    ],
  },
];

export const csvViewerFaq: FaqItem[] = [
  {
    question: 'Posso colar CSV e tambem enviar arquivo?',
    answer:
      'Sim. A ferramenta aceita os dois fluxos: colar texto CSV ou enviar arquivo .csv/.txt.',
  },
  {
    question: 'A deteccao de separador e automatica?',
    answer:
      'Sim. A ferramenta tenta detectar automaticamente o delimitador, mas voce pode trocar manualmente quando quiser.',
  },
  {
    question: 'Da para exportar para XLSX?',
    answer:
      'Sim. Depois de carregar o CSV, voce pode exportar a tabela para XLSX com um clique.',
  },
  {
    question: 'Meus dados sao enviados para servidor?',
    answer:
      'Nao por padrao. A leitura, visualizacao e exportacao acontecem localmente no navegador.',
  },
];
