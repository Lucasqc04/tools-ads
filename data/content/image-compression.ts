import type { ContentBlock, FaqItem } from '@/types/content';

export const imageCompressionIntro =
  'Comprima imagens online em lote com controle de nivel, estimativa de tamanho final e preview antes do download, gratis e sem cadastro.';

export const imageCompressionContentBlocks: ContentBlock[] = [
  {
    title: 'Como funciona a compressao de imagem em lote',
    paragraphs: [
      'A ferramenta permite enviar varias imagens de uma vez, definir o nivel de compressao e processar tudo no navegador. Isso reduz etapas manuais para quem precisa otimizar arquivos para site, ecommerce, anuncios e redes sociais.',
      'Antes de comprimir, o sistema mostra uma estimativa de tamanho final por arquivo. A previsao nao e absoluta, mas ajuda a decidir se vale usar uma compressao leve, media ou agressiva.',
    ],
  },
  {
    title: 'Controle de qualidade e tamanho para cada necessidade',
    paragraphs: [
      'Voce escolhe o nivel de compressao em slider e pode manter o formato original ou converter para JPEG/WEBP para reduzir ainda mais o peso.',
      'A pagina exibe preview da imagem original e da versao comprimida, com comparacao de tamanho e percentual de reducao, facilitando a revisao antes de baixar.',
    ],
    list: [
      'Compressao leve para preservar qualidade visual.',
      'Compressao media para equilibrio entre peso e nitidez.',
      'Compressao alta para reduzir mais tamanho em uploads e compartilhamento.',
      'Fluxo em lote para dezenas de imagens sem repetir processo arquivo por arquivo.',
    ],
  },
  {
    title: 'Privacidade e limites praticos',
    paragraphs: [
      'O processamento ocorre localmente no navegador por padrao, sem upload automatico para servidor. Isso e util para imagens sensiveis, materiais internos e conteudo de clientes.',
      'Em arquivos muito grandes, o tempo de compressao pode variar conforme memoria e desempenho do dispositivo. Em celular, trabalhar em lotes menores tende a melhorar estabilidade.',
    ],
  },
];

export const imageCompressionFaq: FaqItem[] = [
  {
    question: 'Posso comprimir varias imagens de uma vez?',
    answer:
      'Sim. A ferramenta suporta envio multiplo e processamento em lote com preview por arquivo.',
  },
  {
    question: 'Consigo escolher o nivel de compressao?',
    answer:
      'Sim. Voce controla o nivel por slider e pode ajustar entre compressao leve e mais agressiva.',
  },
  {
    question: 'A estimativa de tamanho final e precisa?',
    answer:
      'A estimativa e uma previsao baseada no nivel escolhido. O tamanho real pode variar conforme resolucao, formato e conteudo da imagem.',
  },
  {
    question: 'Meus arquivos sao enviados para servidor?',
    answer:
      'Nao por padrao. A compressao e feita localmente no navegador, sem upload automatico.',
  },
  {
    question: 'Funciona no celular?',
    answer:
      'Sim. A interface e responsiva e foi desenhada para funcionar em mobile sem scroll horizontal.',
  },
];
