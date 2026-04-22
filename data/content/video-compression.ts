import type { ContentBlock, FaqItem } from '@/types/content';

export const videoCompressionIntro =
  'Comprima videos online, ajuste o nivel de compressao, veja estimativa de tamanho e compare preview antes de baixar.';

export const videoCompressionContentBlocks: ContentBlock[] = [
  {
    title: 'Compressao de video no navegador',
    paragraphs: [
      'Esta ferramenta reduz tamanho de video diretamente no browser, sem depender de instalacao local de software. Voce pode enviar varios videos e comprimir em lote no mesmo fluxo.',
      'O nivel de compressao e configuravel, permitindo balancear qualidade visual e peso final de acordo com o destino do arquivo: upload, compartilhamento, publicacao web ou armazenamento.',
    ],
  },
  {
    title: 'Estimativa de tamanho e preview antes do download',
    paragraphs: [
      'Antes de processar, a interface mostra expectativa de tamanho final com base em duracao e nivel de compressao escolhido. Isso ajuda a prever resultado antes de gastar tempo no processamento completo.',
      'Cada item mostra preview do video original e do comprimido, com comparativo de tamanho e percentual de reducao, para voce validar se a qualidade ficou adequada antes de baixar.',
    ],
    list: [
      'Nivel menor para manter mais qualidade e reduzir menos peso.',
      'Nivel medio para equilibrio em uploads diarios.',
      'Nivel alto para reduzir tamanho com maior perda visual.',
      'Processamento em lote para varios arquivos em uma unica execucao.',
    ],
  },
  {
    title: 'Privacidade, performance e limites',
    paragraphs: [
      'Por padrao, os videos sao processados localmente no navegador. Isso reduz exposicao de arquivos sensiveis e evita upload automatico para servidor.',
      'Videos longos e em alta resolucao exigem mais memoria e CPU. Em notebooks ou celulares mais simples, pode ser melhor comprimir em lotes menores para manter boa estabilidade.',
    ],
  },
];

export const videoCompressionFaq: FaqItem[] = [
  {
    question: 'Posso comprimir varios videos de uma vez?',
    answer:
      'Sim. O envio multiplo e suportado e cada video aparece com status individual no lote.',
  },
  {
    question: 'Consigo controlar o quanto quero comprimir?',
    answer:
      'Sim. Existe controle por nivel de compressao para ajustar o equilibrio entre qualidade e tamanho final.',
  },
  {
    question: 'A previsao de tamanho final e exata?',
    answer:
      'E uma estimativa tecnica baseada em bitrate e duracao. O tamanho real pode variar conforme codec, cena e movimento do video.',
  },
  {
    question: 'Os videos sobem para algum servidor?',
    answer:
      'Nao por padrao. O processamento acontece localmente no navegador.',
  },
  {
    question: 'Funciona em celular?',
    answer:
      'Sim, mas videos grandes podem demorar mais em dispositivos com menos memoria e processamento.',
  },
];
