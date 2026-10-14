import type { ContentBlock, FaqItem } from '@/types/content';

export const videoCompressionIntro =
  'Comprima videos de ate 10 GB, ajuste a intensidade e compare o resultado antes de baixar. Arquivos grandes sao processados no proprio aparelho.';

export const videoCompressionContentBlocks: ContentBlock[] = [
  {
    title: 'Compressao de video no navegador',
    paragraphs: [
      'Esta ferramenta reduz o tamanho de videos sem instalar software de escritorio. Voce pode adicionar varios arquivos e acompanhar cada um na fila. Videos acima de 512 MB usam leitura e gravacao em fluxo no aparelho, sem enviar o arquivo grande para o servidor do site.',
      'O nivel de compressao e configuravel, permitindo balancear qualidade visual e peso final de acordo com o destino do arquivo: upload, compartilhamento, publicacao web ou armazenamento.',
    ],
  },
  {
    title: 'Estimativa de tamanho e preview antes do download',
    paragraphs: [
      'Antes de processar, a interface mostra expectativa de tamanho final com base em duracao e nivel de compressao escolhido. Isso ajuda a prever resultado antes de gastar tempo no processamento completo.',
      'Cada item mostra preview do video original e do comprimido, com comparativo de tamanho e percentual de reducao, para voce validar se a qualidade ficou adequada antes de baixar.',
      'O limite de selecao e 10 GB por arquivo. A conversao de arquivos grandes usa os codecs disponiveis no navegador e pode demorar bastante, especialmente em videos longos ou em celulares.',
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
      'Videos acima de 512 MB ficam no aparelho e sao comprimidos por um worker do navegador, com saida temporaria no armazenamento local. Arquivos menores podem usar a API de processamento do site quando ela estiver disponivel.',
      'O processamento local mantem a interface responsiva e tenta impedir que a tela apague enquanto a ferramenta esta aberta. Navegadores moveis podem suspender tarefas quando voce troca de aplicativo ou bloqueia o celular; mantenha a pagina aberta e, se possivel, conecte o aparelho a energia.',
      'A ferramenta nao divide o arquivo em cortes independentes. Ela le e grava o fluxo de midia em partes internas, preservando a linha do tempo e evitando problemas de audio, sincronizacao e pontos de corte que podem ocorrer ao juntar segmentos recomprimidos.',
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
      'Videos acima de 512 MB sao processados localmente e nao sao enviados ao servidor. Arquivos menores podem ser enviados a API do site quando ela estiver disponivel.',
  },
  {
    question: 'Consigo comprimir um video de 5 GB no celular?',
    answer:
      'A ferramenta aceita arquivos de ate 10 GB e processa videos grandes localmente, mas um video de 5 GB pode demorar bastante e exige codecs compativeis e espaco livre. No celular, mantenha a pagina aberta: o navegador pode pausar o processamento quando o aplicativo vai para segundo plano.',
  },
];
