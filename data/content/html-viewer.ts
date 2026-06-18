import type { ContentBlock, FaqItem } from '@/types/content';

export const htmlViewerIntro =
  'Editor HTML online com CodeMirror, preview sandbox, CSS, JavaScript, console capturado, templates rápidos, upload de arquivos e exportação .html.';

export const htmlViewerContentBlocks: ContentBlock[] = [
  {
    title: 'Editor HTML com highlight, abas e preview real',
    paragraphs: [
      'Esta página deixou de ser apenas um visualizador simples e virou um playground de HTML. Você edita HTML, CSS e JavaScript em abas com highlight de sintaxe, números de linha, gutter de lint e um preview renderizado em iframe sandbox.',
      'O fluxo é pensado para desenvolvedores, criadores e estudantes que precisam testar snippets, componentes, landing sections, tabelas, formulários ou emails HTML sem abrir uma IDE completa.',
    ],
  },
  {
    title: 'Console, checagens simples e templates prontos',
    paragraphs: [
      'O console captura console.log, console.warn, console.error, erros de runtime e promises rejeitadas emitidas dentro do preview. Isso ajuda a descobrir rapidamente se o JavaScript do snippet quebrou ou se um evento não está disparando.',
      'A ferramenta também inclui checagens simples para tags HTML possivelmente abertas, chaves CSS e sintaxe JavaScript. Para acelerar o início, use templates de componente, landing section, email HTML, formulário e tabela.',
    ],
    list: [
      'Editar HTML, CSS e JS em abas dedicadas.',
      'Executar preview manualmente ou com auto-run.',
      'Capturar logs e erros do iframe sandbox.',
      'Usar templates rápidos e exportar o HTML final.',
    ],
  },
  {
    title: 'Arquivos, viewport e exportação',
    paragraphs: [
      'Se você separa estrutura, estilo e script em arquivos diferentes, pode subir .html, .css e .js de uma vez. O HTML principal popula o editor e os arquivos CSS/JS são combinados para o preview.',
      'O preview tem modos desktop, tablet e mobile para validar responsividade sem sair da página. Depois do teste, você pode copiar o documento final, baixar um .html completo, abrir em nova aba ou usar tela cheia.',
    ],
  },
  {
    title: 'Boas práticas de segurança e uso',
    paragraphs: [
      'Mesmo com sandbox, scripts podem executar lógica dentro do contexto do preview. Por isso, rode apenas código de fontes confiáveis quando estiver testando snippets externos.',
      'Para inspeção rápida em mobile, use a abertura em nova aba e o modo tela cheia. Isso melhora área útil de leitura e facilita validação de layout responsivo.',
    ],
  },
];

export const htmlViewerFaq: FaqItem[] = [
  {
    question: 'Posso executar JavaScript no HTML Viewer?',
    answer:
      'Sim. O preview executa scripts dentro do iframe sandbox e envia logs, warnings e erros para o console da própria ferramenta.',
  },
  {
    question: 'O editor tem highlight e números de linha?',
    answer:
      'Sim. A interface usa CodeMirror com highlight para HTML, CSS e JavaScript, números de linha e gutter de checagem.',
  },
  {
    question: 'Consigo usar arquivos separados de HTML, CSS e JS?',
    answer:
      'Sim. Você pode importar múltiplos arquivos .html, .css e .js, escolher o HTML principal e continuar editando no playground.',
  },
  {
    question: 'Posso baixar ou copiar o HTML final?',
    answer:
      'Sim. A ferramenta permite copiar o documento final com CSS/JS injetados ou baixar um arquivo .html completo.',
  },
  {
    question: 'Essa ferramenta envia meu código para servidor?',
    answer:
      'Não por padrão. O processamento, a edição e a renderização acontecem localmente no navegador.',
  },
];
