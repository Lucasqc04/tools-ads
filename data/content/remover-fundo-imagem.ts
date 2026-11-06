import type { ContentBlock, FaqItem } from '@/types/content';

export const backgroundRemoverIntro =
  'Remova o fundo de uma imagem por chroma key: escolha a cor do fundo, compare três níveis de recorte e baixe um PNG transparente no tamanho original. Funciona melhor com fundo verde, magenta, branco ou de cor uniforme.';

export const backgroundRemoverContentBlocks: ContentBlock[] = [
  {
    title: 'Como funciona o removedor de fundo por chroma key',
    paragraphs: [
      'Esta ferramenta não usa inteligência artificial nem detecta objetos. Ela remove uma cor: você informa qual é a cor do fundo e todos os pixels parecidos com ela ficam transparentes. As opções de cor são magenta (#FF00FF), verde (#00FF00), branco (#FFFFFF), automática pelos cantos da imagem e uma cor manual em hexadecimal.',
      'Para cada pixel, o programa mede a distância entre a cor dele e a cor do fundo. Pixels muito próximos ficam transparentes, os intermediários ganham uma transição suave e os distantes continuam opacos. Ao carregar a imagem, ela gera três recortes lado a lado (leve, equilibrada e forte) para você escolher o que preserva melhor os detalhes.',
    ],
  },
  {
    title: 'Tolerância, suavidade da borda e cor residual',
    paragraphs: [
      'A tolerância define o quanto um pixel pode se afastar da cor do fundo e ainda ser removido. Se sobrar fundo ou um contorno colorido, aumente. Se o recorte estiver comendo cabelo, tecido ou detalhes pequenos, diminua. A suavidade controla a transição da borda: valores maiores deixam a borda mais macia, e valores menores deixam o corte mais seco.',
      'A opção de reduzir cor residual (despill) atenua o tom do fundo que fica nas bordas semitransparentes, como o contorno esverdeado de uma pessoa gravada diante de um pano verde. Também é possível recortar a imagem antes, em formato livre, quadrado ou redondo, para tirar áreas que não interessam.',
    ],
    list: [
      'Leve: preserva cabelo, fumaça, tecido e detalhes finos.',
      'Equilibrada: ponto de partida para a maioria das imagens.',
      'Forte: remove mais halo e sobras de fundo nas bordas.',
      'Automática pelos cantos: usa a cor média dos quatro cantos, útil quando o fundo é uniforme.',
    ],
  },
  {
    title: 'PNG transparente no tamanho original',
    paragraphs: [
      'As prévias são reduzidas (até 1200 px no lado maior) só para a comparação ficar rápida. Ao baixar, o recorte é refeito sobre a imagem original e o arquivo sai em PNG com transparência, sem recompressão JPEG e com a largura e a altura originais, salvo o recorte que você tiver aplicado.',
      'Aceita PNG, JPG, JPEG, WEBP e BMP. As imagens não são enviadas ao servidor: todo o cálculo acontece no navegador.',
    ],
  },
  {
    title: 'Limites para ter bons resultados',
    paragraphs: [
      'Como o método remove uma cor em toda a imagem, e não só o fundo ao redor do objeto, qualquer parte do objeto com tom parecido com o fundo também ficará transparente. Camisa verde diante de fundo verde, por exemplo, não funciona. Sombras fortes, reflexos, fundos com textura ou gradiente exigem ajuste fino ou um recorte manual em outro editor.',
      'Fotos comuns, com cenário real e muitas cores, não são o caso de uso desta ferramenta. Em imagens muito grandes, o celular pode demorar mais por causa de memória e processador; se travar, teste com uma versão menor.',
    ],
  },
];

export const backgroundRemoverFaq: FaqItem[] = [
  {
    question: 'A ferramenta remove qualquer fundo automaticamente?',
    answer:
      'Não. Ela remove uma cor de fundo uniforme (verde, magenta, branco ou outra que você escolher). Para cenários reais, com muitas cores e objetos, o resultado fica ruim e é melhor usar um editor com seleção manual.',
  },
  {
    question: 'O download perde qualidade ou reduz a resolução?',
    answer:
      'Não reduz a resolução. A prévia é menor para ser rápida, mas o download refaz o processo na imagem original e gera um PNG transparente com o tamanho original (ou o do recorte, se você usou o recorte).',
  },
  {
    question: 'Minhas imagens são enviadas para um servidor?',
    answer:
      'Não. O upload, a prévia, o recorte e o PNG final são feitos no próprio navegador, sem envio a servidor.',
  },
  {
    question: 'Por que parte do objeto também ficou transparente?',
    answer:
      'O recorte remove todos os pixels parecidos com a cor escolhida, inclusive os que estão dentro do objeto. Diminua a tolerância, teste a opção leve ou use um fundo de cor diferente das cores do objeto.',
  },
  {
    question: 'Quais formatos de imagem posso enviar?',
    answer:
      'PNG, JPG, JPEG, WEBP e BMP. O arquivo gerado é sempre PNG com transparência.',
  },
];
