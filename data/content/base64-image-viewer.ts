import type { ContentBlock, FaqItem } from '@/types/content';

export const base64ImageViewerIntro =
  'Cole Base64 e visualize imagem na hora, com opcao de download em varios formatos.';

export const base64ImageViewerContentBlocks: ContentBlock[] = [
  {
    title: 'Leitor de Base64 para converter texto em imagem visualizavel',
    paragraphs: [
      'Esta ferramenta transforma Base64 em imagem de forma imediata no navegador. Assim que voce cola o conteudo, o preview aparece ao lado para validacao rapida.',
      'Depois de confirmar o resultado, voce pode baixar a imagem no formato original decodificado ou converter para outros formatos comuns como PNG, JPEG, WEBP e SVG.',
    ],
  },
  {
    title: 'Quando usar o visualizador de Base64',
    paragraphs: [
      'O fluxo e util para desenvolvedores, suporte tecnico e times de integracao que recebem imagens serializadas em APIs, bancos de dados ou payloads de webhook.',
      'Com preview lado a lado e download rapido, fica mais simples depurar respostas de servicos e validar se o conteudo retornado esta correto.',
    ],
    list: [
      'Validar imagens em Base64 vindas de API.',
      'Decodificar data URL para arquivo real.',
      'Converter imagem decodificada para outro formato.',
      'Revisar rapidamente imagens sem instalar software extra.',
    ],
  },
  {
    title: 'Privacidade e limites praticos',
    paragraphs: [
      'A decodificacao acontece localmente no navegador e nao exige upload do Base64 para servidor por padrao.',
      'Se o Base64 for muito grande, o tempo de renderizacao pode variar conforme memoria e desempenho do dispositivo.',
    ],
  },
];

export const base64ImageViewerFaq: FaqItem[] = [
  {
    question: 'Preciso enviar o Base64 para servidor?',
    answer:
      'Nao por padrao. A leitura e o preview sao processados localmente no navegador.',
  },
  {
    question: 'Funciona com data URL e Base64 puro?',
    answer:
      'Sim. A ferramenta aceita os dois formatos e permite definir o MIME padrao quando o prefixo nao existe.',
  },
  {
    question: 'Posso baixar em formatos diferentes?',
    answer:
      'Sim. Depois do preview, voce escolhe o formato de download entre varias opcoes de imagem.',
  },
  {
    question: 'Consigo ver a imagem imediatamente?',
    answer:
      'Sim. O preview e atualizado automaticamente quando o Base64 e valido.',
  },
  {
    question: 'Esta ferramenta e gratuita?',
    answer: 'Sim. O uso e gratuito, sem cadastro e sem login obrigatorio.',
  },
];
