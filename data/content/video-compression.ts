import type { ContentBlock, FaqItem } from '@/types/content';

export const videoCompressionIntro =
  'Comprima vídeos de até 10 GB, ajuste o nível e compare o resultado antes de baixar. O arquivo é processado no navegador e não é enviado ao servidor.';

export const videoCompressionContentBlocks: ContentBlock[] = [
  {
    title: 'Como comprimir um vídeo',
    paragraphs: [
      'Adicione um ou vários vídeos (MP4, MOV, M4V, WEBM, OGV ou MKV), ajuste o nível de compressão e clique em comprimir. Cada arquivo aparece na fila com seu próprio status. O resultado sai sempre em MP4, normalmente com vídeo H.264 e áudio AAC, e você baixa um vídeo de cada vez ou todos juntos.',
      'O nível vai de 1% a 100% e começa em 58%. Em níveis mais altos a imagem fica mais comprimida e o áudio usa uma taxa menor; acima de cerca de 35%, a resolução também diminui, chegando a cerca de 58% do tamanho original nos níveis mais altos. Para manter a resolução, use um nível baixo.',
    ],
  },
  {
    title: 'Estimativa de tamanho e prévia antes do download',
    paragraphs: [
      'Antes do processamento, a interface estima o tamanho final com base na duração e no nível escolhido. É só uma previsão: o tamanho real varia com o tipo de cena, o movimento e o codec disponível.',
      'Depois de comprimir, cada item mostra uma prévia do vídeo original e do comprimido, com a comparação de tamanho e a porcentagem de redução. Assista a um trecho com movimento rápido ou texto na tela antes de baixar, porque é onde a perda de qualidade aparece primeiro.',
    ],
    list: [
      'Nível baixo: preserva mais qualidade e reduz menos o arquivo.',
      'Nível médio: equilibra qualidade e tamanho.',
      'Nível alto: reduz mais o arquivo, com perda visual maior e resolução menor.',
      'Lote: vários arquivos na mesma execução.',
    ],
  },
  {
    title: 'Privacidade, desempenho e limites',
    paragraphs: [
      'O vídeo permanece no aparelho e é processado no navegador. Arquivos acima de 512 MB usam processamento local em fluxo; os menores usam FFmpeg.wasm. Os componentes de compressão podem ser baixados no primeiro uso, mas o vídeo não é enviado ao servidor do site.',
      'O limite é de 10 GB por arquivo, mas a conclusão depende de memória, espaço livre e dos codecs do navegador. Vídeos grandes podem levar bastante tempo, principalmente no celular, e o navegador pode pausar a tarefa se você trocar de aplicativo ou bloquear a tela. Mantenha a página aberta e, se possível, conecte o aparelho à energia.',
      'A compressão não divide o vídeo em cortes independentes: ela processa o fluxo de mídia inteiro para preservar a linha do tempo e a sincronia do áudio.',
    ],
  },
];

export const videoCompressionFaq: FaqItem[] = [
  {
    question: 'Posso comprimir vários vídeos de uma vez?',
    answer:
      'Sim. Adicione vários arquivos e cada vídeo aparece na fila com seu próprio status, prévia e porcentagem de redução.',
  },
  {
    question: 'O que o nível de compressão muda?',
    answer:
      'Ele ajusta a qualidade da imagem, a taxa do áudio e, a partir de cerca de 35%, a resolução do vídeo. Níveis mais altos geram arquivos menores com mais perda visual.',
  },
  {
    question: 'A previsão do tamanho final é exata?',
    answer:
      'Não. É uma estimativa baseada na duração e no nível. O tamanho real aparece depois da compressão e varia conforme o codec, as cenas e o movimento do vídeo.',
  },
  {
    question: 'Meu vídeo é enviado para algum servidor?',
    answer:
      'Não. O vídeo é processado no navegador e não é enviado ao servidor do site. Os componentes necessários podem ser baixados no primeiro uso.',
  },
  {
    question: 'Consigo comprimir um vídeo de 5 GB no celular?',
    answer:
      'A ferramenta aceita até 10 GB e processa vídeos grandes no próprio aparelho, mas um arquivo de 5 GB pode demorar bastante e exige codecs compatíveis e espaço livre. Mantenha a página aberta: o navegador pode pausar a tarefa em segundo plano.',
  },
];
