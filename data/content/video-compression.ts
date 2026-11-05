import type { ContentBlock, FaqItem } from '@/types/content';

export const videoCompressionIntro =
  'Comprima vídeos de até 10 GB, ajuste a intensidade e compare o resultado antes de baixar. Vídeos acima de 512 MB são processados no aparelho; arquivos menores podem usar o servidor do site.';

export const videoCompressionContentBlocks: ContentBlock[] = [
  {
    title: 'Como a compressão de vídeo funciona',
    paragraphs: [
      'Reduza o tamanho dos vídeos sem instalar um programa. Você pode adicionar vários arquivos e acompanhar cada um na fila. Vídeos acima de 512 MB são processados no aparelho, sem enviar o arquivo ao servidor do site.',
      'O nível de compressão ajusta o equilíbrio entre qualidade visual e tamanho final, conforme o uso: envio, compartilhamento, publicação na web ou armazenamento.',
    ],
  },
  {
    title: 'Estimativa de tamanho e prévia antes do download',
    paragraphs: [
      'Antes do processamento, a interface estima o tamanho final com base na duração e no nível de compressão. O tamanho real pode variar conforme o vídeo e os codecs disponíveis.',
      'Cada item mostra uma prévia do vídeo original e do comprimido, além da comparação de tamanho e percentual de redução. Confira a qualidade antes de baixar.',
      'O limite é de 10 GB por arquivo. Vídeos grandes usam os codecs disponíveis no navegador e podem demorar, especialmente em celulares.',
    ],
    list: [
      'Nível baixo: preserva mais qualidade e reduz menos o tamanho.',
      'Nível médio: equilibra qualidade e tamanho.',
      'Nível alto: reduz mais o tamanho, com maior perda visual.',
      'Processamento em lote para vários arquivos na mesma execução.',
    ],
  },
  {
    title: 'Privacidade, desempenho e limites',
    paragraphs: [
      'Vídeos acima de 512 MB ficam no aparelho e são comprimidos por um worker do navegador, com saída temporária no armazenamento local. Arquivos menores podem ser enviados à API do site para processamento.',
      'Em celulares, o navegador pode suspender a tarefa se você trocar de aplicativo ou bloquear a tela. Mantenha a página aberta e, se possível, conecte o aparelho à energia.',
      'A ferramenta não divide o vídeo em cortes independentes. Ela processa o fluxo de mídia em partes internas para preservar a linha do tempo e reduzir problemas de áudio e sincronização.',
    ],
  },
];

export const videoCompressionFaq: FaqItem[] = [
  {
    question: 'Posso comprimir vários vídeos de uma vez?',
    answer:
      'Sim. Você pode adicionar vários arquivos, e cada vídeo aparece com seu próprio status na fila.',
  },
  {
    question: 'Consigo controlar o quanto quero comprimir?',
    answer:
      'Sim. Ajuste o nível de compressão para equilibrar qualidade e tamanho final.',
  },
  {
    question: 'A previsão do tamanho final é exata?',
    answer:
      'Não. É uma estimativa baseada na taxa de bits e na duração. O tamanho real varia conforme o codec, as cenas e o movimento do vídeo.',
  },
  {
    question: 'Os vídeos são enviados para algum servidor?',
    answer:
      'Vídeos acima de 512 MB são processados no navegador e não são enviados ao servidor. Arquivos menores podem ser enviados à API do site para compressão.',
  },
  {
    question: 'Consigo comprimir um vídeo de 5 GB no celular?',
    answer:
      'A ferramenta aceita arquivos de até 10 GB e processa vídeos grandes localmente, mas um vídeo de 5 GB pode demorar e exige codecs compatíveis e espaço livre. Mantenha a página aberta: o navegador pode pausar a tarefa quando o aplicativo vai para segundo plano.',
  },
];
