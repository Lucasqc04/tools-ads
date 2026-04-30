import type { ContentBlock, FaqItem } from '@/types/content';

export const markdownEditorIntro =
  'Visualizador e editor de Markdown com upload de arquivo .md, preview em tempo real, modo foco em tela cheia e exportacao em MD, HTML, PNG e PDF.';

export const markdownEditorContentBlocks: ContentBlock[] = [
  {
    title: 'Editor de Markdown completo para escrita e revisao visual',
    paragraphs: [
      'Esta ferramenta foi criada para quem precisa escrever, revisar e publicar Markdown com rapidez, sem depender de software instalado. Voce edita o texto bruto e acompanha ao mesmo tempo o resultado renderizado, com suporte para titulos, listas, links, imagens, tabelas, citacoes e blocos de codigo.',
      'O modo de edicao em tela cheia amplia a area de trabalho para aproveitar melhor o monitor no desktop. Assim, fica mais facil trabalhar com documentos longos, documentacao tecnica, README de projeto, notas de reuniao e conteudos para blog sem perder contexto entre o texto e o resultado final.',
    ],
  },
  {
    title: 'Upload de arquivo .md, atalhos de insercao e exportacao multipla',
    paragraphs: [
      'Se voce ja tem um arquivo Markdown pronto, basta enviar o .md para abrir e continuar editando na hora. A barra de acoes acelera tarefas comuns com insercao de H1, H2, listas ordenadas e nao ordenadas, tabela, bloco de codigo, link e imagem, reduzindo o trabalho manual de sintaxe.',
      'Depois de revisar, voce pode exportar no formato que fizer mais sentido para o seu fluxo: manter em .md para versionamento, gerar .html para publicacao web, baixar em imagem PNG para compartilhamento visual ou converter para PDF para envio e arquivamento.',
    ],
    list: [
      'Upload local de arquivos .md e .markdown.',
      'Preview renderizado em tempo real sem sair da pagina.',
      'Modo foco em tela cheia com editor e preview lado a lado.',
      'Exportacao em Markdown, HTML, PNG e PDF.',
    ],
  },
  {
    title: 'Privacidade, limites e boas praticas de uso',
    paragraphs: [
      'Por padrao, o processamento acontece localmente no navegador. Isso aumenta a privacidade para documentos internos e rascunhos de trabalho, porque o conteudo nao precisa ser enviado para backend para renderizar ou exportar.',
      'Para documentos muito grandes com muitas imagens externas, a exportacao em PNG ou PDF pode levar mais tempo dependendo da memoria e da CPU do dispositivo. Em fluxos longos, a recomendacao e dividir o conteudo em secoes e exportar por partes quando necessario.',
    ],
  },
];

export const markdownEditorFaq: FaqItem[] = [
  {
    question: 'Posso abrir um arquivo .md existente?',
    answer:
      'Sim. Voce pode enviar arquivos .md ou .markdown e continuar editando normalmente com preview em tempo real.',
  },
  {
    question: 'A ferramenta funciona em tela cheia?',
    answer:
      'Sim. Existe um modo foco em tela cheia que prioriza a area de edicao e preview, ideal para desktop e documentos longos.',
  },
  {
    question: 'Quais formatos de exportacao estao disponiveis?',
    answer:
      'Voce pode exportar em Markdown (.md), HTML (.html), imagem PNG e PDF, escolhendo o formato mais adequado para compartilhar ou publicar.',
  },
  {
    question: 'O conteudo e enviado para servidor?',
    answer:
      'Nao por padrao. Edicao, preview e exportacao rodam localmente no navegador do usuario.',
  },
  {
    question: 'Funciona no celular?',
    answer:
      'Sim. O layout e responsivo para mobile, com visualizacao adaptada para telas menores e sem rolagem horizontal.',
  },
];
