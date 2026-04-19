import type { ContentBlock, FaqItem } from '@/types/content';

export const htmlViewerIntro =
  'Visualizador de HTML com suporte a CSS e JavaScript, modo editor e upload de múltiplos arquivos, com preview em tela cheia ou nova aba.';

export const htmlViewerContentBlocks: ContentBlock[] = [
  {
    title: 'Editor completo para HTML, CSS e JS',
    paragraphs: [
      'Esta página é dedicada exclusivamente ao HTML Viewer. Você pode testar marcação, estilos e scripts no mesmo fluxo, com renderização rápida para validar componentes e páginas antes de publicar.',
      'O preview roda em iframe com sandbox e permite execução de JavaScript para cenários de prototipação e debugging visual, sem misturar com funções de PDF ou JSON na mesma interface.',
    ],
  },
  {
    title: 'Suporte a múltiplos arquivos (.html, .css, .js)',
    paragraphs: [
      'Se você separa estrutura, estilo e script em arquivos diferentes, pode subir todos de uma vez. O viewer permite escolher o HTML principal e combina os CSS/JS no preview para simular um ambiente real.',
      'Esse fluxo também ajuda quando você trabalha com mais de um HTML na mesma tarefa, como variações de páginas, templates de e-mail ou protótipos de telas.',
    ],
    list: [
      'Cole código direto no modo editor.',
      'Carregue vários arquivos no modo arquivos.',
      'Selecione o HTML de entrada principal.',
      'Teste em tela cheia ou abra em nova aba.',
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
      'Sim. O preview suporta scripts dentro do iframe com sandbox para você testar comportamento visual e interações.',
  },
  {
    question: 'Consigo usar arquivos separados de HTML, CSS e JS?',
    answer:
      'Sim. Você pode enviar múltiplos arquivos e escolher qual HTML será usado como entrada principal.',
  },
  {
    question: 'Há opção de tela cheia?',
    answer:
      'Sim. O visualizador possui botão de tela cheia e também opção para abrir o resultado em nova aba.',
  },
  {
    question: 'Essa ferramenta envia meu código para servidor?',
    answer:
      'Não por padrão. O processamento e a renderização acontecem localmente no navegador.',
  },
  {
    question: 'Funciona no celular?',
    answer:
      'Sim. O layout é responsivo e mantém as ações principais acessíveis em telas pequenas.',
  },
];
