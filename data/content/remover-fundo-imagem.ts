import type { ContentBlock, FaqItem } from '@/types/content';

export const backgroundRemoverIntro =
  'Remova fundo de imagem por chroma key online, escolha a cor do fundo, compare 3 niveis de recorte e baixe PNG transparente no tamanho original.';

export const backgroundRemoverContentBlocks: ContentBlock[] = [
  {
    title: 'Como funciona o removedor de fundo por chroma key',
    paragraphs: [
      'Esta ferramenta remove fundos de cor solida ou quase solida usando chroma key no navegador. Voce envia a imagem, escolhe a cor do fundo e compara tres recortes: leve, equilibrado e forte.',
      'O algoritmo calcula a distancia de cada pixel ate a cor escolhida. Pixels muito proximos ficam transparentes; pixels intermediarios recebem uma transicao suave; pixels distantes permanecem opacos. Isso ajuda a preservar detalhes quando o fundo e verde, magenta, branco ou uma cor manual.',
    ],
  },
  {
    title: 'Controle de threshold, softness e despill',
    paragraphs: [
      'Threshold define o quanto a cor do fundo precisa ser parecida para ser removida. Se sobrar fundo ou halo colorido, aumentar esse valor tende a limpar mais. Se o recorte estiver comendo bordas, cabelo, textura ou detalhes pequenos, diminuir ajuda a preservar a imagem.',
      'Softness controla a transicao da borda. Um valor maior cria uma borda mais suave e menos serrilhada; um valor menor faz um corte mais seco. O despill reduz vazamento de verde, magenta ou branco nas bordas semi-transparentes.',
    ],
    list: [
      'Use Leve para cabelo, tecido, fumaca e detalhes finos.',
      'Use Equilibrada como primeiro teste na maioria das imagens.',
      'Use Forte quando sobra contorno do fundo ou halo colorido.',
      'Use Auto pelos cantos quando o fundo aparece limpo nos quatro cantos.',
    ],
  },
  {
    title: 'PNG transparente sem perder resolucao',
    paragraphs: [
      'As miniaturas sao reduzidas apenas para deixar a comparacao rapida. Quando voce baixa o resultado, o recorte e aplicado novamente sobre a imagem original, mantendo largura e altura originais.',
      'A saida e PNG transparente, formato adequado para preservar alpha sem recompressao JPEG. Se a imagem de entrada era JPG, a qualidade original do JPG ja vem da propria fonte, mas a exportacao final nao recompacta em JPG.',
    ],
  },
  {
    title: 'Limites praticos para melhores resultados',
    paragraphs: [
      'Chroma key funciona melhor quando o fundo tem cor uniforme e boa iluminacao. Sombras fortes, reflexos, fundo com textura e objeto com cor parecida com o fundo podem exigir ajustes finos ou um recorte manual complementar.',
      'Em imagens muito grandes, celulares podem demorar mais por causa de memoria e CPU. Se o navegador ficar lento, teste primeiro com uma imagem menor ou use o desktop para arquivos de alta resolucao.',
    ],
  },
];

export const backgroundRemoverFaq: FaqItem[] = [
  {
    question: 'A ferramenta remove qualquer fundo automaticamente?',
    answer:
      'Ela e focada em chroma key: fundos verdes, magenta, brancos ou de cor bem definida. Para fundos complexos, com cenario real ou muitas cores, o resultado pode exigir ajuste manual em outro editor.',
  },
  {
    question: 'O download perde qualidade ou reduz a resolucao?',
    answer:
      'Nao reduz a resolucao. O preview e menor para ficar rapido, mas o download processa a imagem original e gera PNG transparente no tamanho original.',
  },
  {
    question: 'Minhas imagens sao enviadas para servidor?',
    answer:
      'Nao por padrao. O upload, o preview, o recorte e a geracao do PNG acontecem localmente no navegador.',
  },
  {
    question: 'Qual formato de saida e gerado?',
    answer:
      'A ferramenta gera PNG com transparencia, porque PNG preserva o canal alpha e e adequado para usar em design, ecommerce, thumbnails e posts.',
  },
  {
    question: 'Funciona no celular?',
    answer:
      'Sim. A interface e responsiva, mas imagens muito grandes podem ser mais lentas em celulares com pouca memoria.',
  },
];
