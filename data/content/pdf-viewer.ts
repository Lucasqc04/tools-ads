import type { ContentBlock, FaqItem } from '@/types/content';

export const pdfViewerIntro =
  'Visualize arquivos PDF localmente no navegador, sem upload automático para servidor, com preview amplo e abertura em nova aba.';

export const pdfViewerContentBlocks: ContentBlock[] = [
  {
    title: 'Visualização local de PDF sem fricção',
    paragraphs: [
      'O PDF Viewer foi separado para focar em leitura rápida de documentos. Você seleciona o arquivo e o preview é carregado localmente, sem depender de serviços externos.',
      'Isso é útil para revisar contratos, propostas, anexos técnicos e documentos operacionais em poucos cliques, mantendo privacidade e baixo atrito.',
    ],
  },
  {
    title: 'Quando usar essa ferramenta no dia a dia',
    paragraphs: [
      'Em rotinas de suporte, comercial e produto, abrir PDFs com rapidez ajuda a validar arquivos antes de enviar para cliente ou time interno.',
      'A opção de abrir em nova aba melhora leitura em telas menores e facilita navegação quando você precisa alternar entre documento e outras ferramentas.',
    ],
    list: [
      'Conferir PDFs antes de compartilhar.',
      'Revisar documentos em fluxo mobile.',
      'Validar renderização de anexos locais.',
      'Evitar upload desnecessário para terceiros.',
    ],
  },
  {
    title: 'Limitações e contexto de uso',
    paragraphs: [
      'A ferramenta é um visualizador e não faz edição avançada do PDF. Para edição estrutural, use softwares específicos.',
      'Arquivos muito pesados podem demandar mais memória do dispositivo. Em casos extremos, prefira leitura em nova aba para melhor fluidez.',
    ],
  },
];

export const pdfViewerFaq: FaqItem[] = [
  {
    question: 'O PDF é enviado para servidor?',
    answer:
      'Não por padrão. O arquivo é aberto localmente no navegador para visualização.',
  },
  {
    question: 'Posso abrir o PDF em nova aba?',
    answer:
      'Sim. Existe botão para abrir o documento em nova aba e facilitar leitura.',
  },
  {
    question: 'Consigo editar o PDF nessa ferramenta?',
    answer:
      'Não. A funcionalidade aqui é focada em visualização rápida e validação do documento.',
  },
  {
    question: 'Funciona no celular?',
    answer:
      'Sim. O layout é responsivo e o preview mantém boa usabilidade em telas menores.',
  },
];

