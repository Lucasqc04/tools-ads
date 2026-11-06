import type { ContentBlock, FaqItem } from '@/types/content';

export const imageCompressionIntro =
  'Comprima várias imagens de uma vez, escolha o nível de compressão e compare o antes e o depois antes de baixar. A compressão acontece no navegador e não exige cadastro.';

export const imageCompressionContentBlocks: ContentBlock[] = [
  {
    title: 'Como comprimir imagens em lote',
    paragraphs: [
      'Adicione uma ou várias imagens (PNG, JPEG, WEBP, AVIF, GIF, BMP, TIFF ou ICO, até 100 MB cada), ajuste o nível de compressão e clique em comprimir. O nível vai de 1% a 100% e começa em 56%. Quanto mais alto, menor o arquivo e maior a perda de qualidade.',
      'Antes de processar, a ferramenta mostra uma estimativa do tamanho final por arquivo e o total do lote. É só uma previsão calculada a partir do nível escolhido: o tamanho real depende da resolução e do conteúdo da imagem. Depois de comprimir, cada item mostra a prévia original e a comprimida, o tamanho final e a porcentagem de redução.',
    ],
  },
  {
    title: 'O que o nível de compressão muda',
    paragraphs: [
      'O nível controla dois ajustes ao mesmo tempo. O primeiro é a qualidade de codificação, que cai de cerca de 94% para cerca de 24% conforme você sobe o nível. O segundo é a resolução: em níveis acima de poucos pontos, o lado maior da imagem é reduzido de forma proporcional, chegando a cerca de 58% do tamanho original no nível máximo e nunca abaixo de 640 px.',
      'Por isso uma foto grande pode ficar visivelmente menor em largura e altura quando a compressão é forte. Se precisar manter as dimensões exatas, use um nível baixo ou redimensione a imagem em outra ferramenta antes.',
    ],
    list: [
      'Manter formato original: a imagem continua no mesmo tipo, quando o navegador permite.',
      'Converter para JPEG: reduz bastante fotos, mas remove transparência.',
      'Converter para WEBP: costuma gerar arquivos menores que JPEG e PNG para uso em sites.',
      'PNG sem perdas ganha pouco só com a qualidade; o ganho vem sobretudo da redução de resolução ou da troca para WEBP ou JPEG.',
    ],
  },
  {
    title: 'Quando usar e quais são os limites',
    paragraphs: [
      'Serve para reduzir fotos antes de anexar em e-mail, enviar em formulários com limite de tamanho, publicar em um site ou loja virtual e guardar capturas de tela. Teste primeiro com o nível padrão e use o botão de ver a imagem para conferir texto pequeno, bordas e áreas de céu ou degradê, onde a perda aparece primeiro.',
      'As imagens não são enviadas ao servidor: a compressão usa o processador do seu aparelho. Lotes grandes ou imagens muito pesadas podem demorar e consumir memória, principalmente no celular, então vale processar em grupos menores. O botão de baixar todas salva os arquivos um por um, sem criar um ZIP.',
    ],
  },
];

export const imageCompressionFaq: FaqItem[] = [
  {
    question: 'Posso comprimir várias imagens de uma vez?',
    answer:
      'Sim. Adicione quantas imagens quiser (até 100 MB cada), comprima todas com o mesmo nível e baixe uma a uma. Cada arquivo tem status, prévia e porcentagem de redução próprios.',
  },
  {
    question: 'O que o nível de compressão altera?',
    answer:
      'A qualidade de codificação e, em níveis mais altos, também a resolução: o lado maior chega a cerca de 58% do original no máximo, sem ficar abaixo de 640 px. Níveis baixos preservam mais detalhe.',
  },
  {
    question: 'A estimativa de tamanho final é exata?',
    answer:
      'Não. É uma previsão baseada no nível e no formato de saída. O tamanho real aparece depois da compressão e pode variar conforme a resolução e o tipo de imagem.',
  },
  {
    question: 'Minhas imagens são enviadas para um servidor?',
    answer:
      'Não. A compressão acontece no navegador, com o processador do seu aparelho. Nada é enviado pela ferramenta.',
  },
  {
    question: 'Por que meu PNG quase não diminuiu?',
    answer:
      'PNG é um formato sem perdas, então o ajuste de qualidade rende pouco. Para reduzir mais, aumente o nível, que também diminui a resolução, ou converta para WEBP ou JPEG (JPEG não mantém transparência).',
  },
];
