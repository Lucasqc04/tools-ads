import type { ContentBlock, FaqItem } from '@/types/content';

export const markdownEditorIntro =
  'Escreva ou abra um arquivo .md, veja o resultado renderizado ao lado do texto e exporte em Markdown, HTML, PNG, PDF ou Word (.docx). Tudo no navegador.';

export const markdownEditorContentBlocks: ContentBlock[] = [
  {
    title: 'Editor de Markdown com preview ao lado do texto',
    paragraphs: [
      'Você digita o Markdown no editor e acompanha o resultado renderizado na hora, em visualização dividida, só editor ou só preview. A barra de ferramentas insere a sintaxe de títulos (H1 a H3), negrito, itálico, tachado, destaque, citação, listas, lista de tarefas, link, imagem, código, bloco de código, tabela e linha horizontal.',
      'O preview entende também notas de rodapé, texto sobrescrito e subscrito. HTML escrito dentro do Markdown não é interpretado: ele aparece como texto. O modo de tela cheia amplia a área de trabalho, útil para README, documentação técnica, notas de reunião e rascunhos de blog.',
    ],
  },
  {
    title: 'Abrir arquivo .md e exportar',
    paragraphs: [
      'O botão "Abrir .md" aceita arquivos .md e .markdown. O texto vai para o editor e o nome do arquivo é usado como base ao exportar. Os botões "Exemplo" e "Limpar" ajudam a começar ou recomeçar.',
      'Na exportação você escolhe o formato. Markdown devolve o texto como está. HTML gera uma página completa com o estilo do preview. Word (.docx) é montado a partir do texto Markdown. PNG e PDF são gerados a partir de uma imagem do preview.',
    ],
    list: [
      'Markdown (.md) e HTML (.html): arquivos de texto, ideais para versionar ou publicar.',
      'Word (.docx): para quem precisa abrir ou revisar o documento no Word.',
      'PNG: uma única imagem do preview, boa para compartilhar.',
      'PDF: páginas A4 feitas a partir da imagem do preview, então o texto do PDF não é selecionável nem pesquisável.',
    ],
  },
  {
    title: 'Limites e privacidade',
    paragraphs: [
      'O texto é processado no navegador e não é enviado ao nosso servidor. Para você não perder o trabalho ao recarregar a página, o conteúdo e o nome do arquivo ficam salvos no armazenamento local deste navegador. Use "Limpar" e evite deixar documentos sensíveis em computadores compartilhados.',
      'Imagens inseridas por link são carregadas do endereço original, e o preview as busca na internet. Na exportação para PNG e PDF, imagens externas só entram se o site de origem permitir o acesso. Caso contrário, elas são trocadas por um aviso e a ferramenta informa isso. A imagem do PNG e do PDF tem altura máxima de 12.000 pixels, e documentos mais longos são cortados (a ferramenta avisa). Para textos muito grandes, exporte em partes ou use HTML ou Word.',
    ],
  },
];

export const markdownEditorFaq: FaqItem[] = [
  {
    question: 'Posso abrir um arquivo .md existente?',
    answer:
      'Sim. Use "Abrir .md" para enviar um arquivo .md ou .markdown. O conteúdo vai para o editor e o preview é atualizado enquanto você edita.',
  },
  {
    question: 'Quais formatos de exportação estão disponíveis?',
    answer:
      'Markdown (.md), HTML (.html), Word (.docx), PNG e PDF. O PDF é feito a partir de uma imagem do preview, por isso o texto não é selecionável.',
  },
  {
    question: 'O conteúdo é enviado para algum servidor?',
    answer:
      'Não. Edição, preview e exportação acontecem no navegador. O texto fica salvo apenas no armazenamento local do seu navegador, para você retomar depois, e pode ser apagado com o botão "Limpar".',
  },
  {
    question: 'Por que minha imagem não aparece no PNG ou no PDF?',
    answer:
      'Imagens externas só são incluídas se o site de origem permitir o acesso pelo navegador. Quando isso não acontece, a imagem é trocada por um aviso e a ferramenta mostra uma mensagem na exportação. Imagens embutidas no próprio Markdown (data URL) funcionam normalmente.',
  },
  {
    question: 'Funciona no celular?',
    answer:
      'Sim, mas a visualização dividida fica apertada em telas pequenas. No celular, use os botões "Editor" e "Preview" para ver um painel por vez. Para documentos longos, o computador é mais confortável.',
  },
];
