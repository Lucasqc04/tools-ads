import type { ContentBlock, FaqItem } from '@/types/content';

export const htmlViewerIntro =
  'Edite HTML, CSS e JavaScript em abas, veja o resultado em um preview isolado (sandbox) e acompanhe os erros no console, tudo no navegador.';

export const htmlViewerContentBlocks: ContentBlock[] = [
  {
    title: 'Editor HTML com highlight, abas e preview real',
    paragraphs: [
      'Você edita HTML, CSS e JavaScript em abas separadas, com cores de sintaxe, números de linha e marcação de erros simples, e vê o resultado em um preview renderizado em iframe com sandbox.',
      'O fluxo é pensado para desenvolvedores, criadores e estudantes que precisam testar snippets, componentes, seções de landing page, tabelas, formulários ou e-mails em HTML sem abrir uma IDE completa.',
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
      'Se você separa estrutura, estilo e script em arquivos diferentes, pode enviar .html, .htm, .css e .js de uma vez. O HTML principal preenche a aba HTML e os arquivos CSS e JS são combinados nas respectivas abas.',
      'O preview tem modos desktop, tablet e mobile para validar responsividade sem sair da página. Depois do teste, você pode copiar o documento final, baixar um .html completo, abrir em nova aba ou usar tela cheia.',
    ],
  },
  {
    title: 'Segurança, limites e privacidade',
    paragraphs: [
      'O preview roda em um iframe com sandbox e sem acesso ao site que o contém. Mesmo assim, o JavaScript que você cola é executado de verdade e pode, por exemplo, carregar scripts ou imagens de endereços externos ou fazer requisições de rede. Rode apenas código em que você confia.',
      'O botão "Nova aba" abre o documento fora do preview, sem o isolamento do iframe. Use essa opção só com código seu ou de fonte confiável. A edição e a renderização acontecem no navegador e o conteúdo digitado não é enviado ao nosso servidor.',
      'As checagens apontam problemas simples (tags HTML possivelmente abertas, chaves de CSS desbalanceadas e erros de sintaxe do JavaScript) e não substituem um validador completo. O console guarda as 80 mensagens mais recentes. O HTML copiado ou baixado já traz o CSS e o JS embutidos, além de um pequeno script que envia as mensagens do console ao editor.',
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
      'Sim. Você pode importar vários arquivos .html, .htm, .css e .js de uma vez. Os CSS e JS são combinados nas abas correspondentes e, se houver mais de um HTML, você escolhe qual é o principal. Outras extensões são ignoradas.',
  },
  {
    question: 'Posso baixar ou copiar o HTML final?',
    answer:
      'Sim. A ferramenta permite copiar o documento final com CSS/JS injetados ou baixar um arquivo .html completo.',
  },
  {
    question: 'Essa ferramenta envia meu código para servidor?',
    answer:
      'Não. A edição e a renderização acontecem no navegador e o código digitado não é enviado ao nosso servidor. Atenção: se o seu HTML ou JavaScript carregar recursos externos ou fizer requisições, é o próprio código que acessa esses endereços.',
  },
];
