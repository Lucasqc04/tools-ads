import type { ContentBlock, FaqItem } from '@/types/content';

export const textDiffIntro =
  'Cole duas versões de um texto e veja o que foi adicionado e removido, com diff por caractere, palavra, linha, parágrafo ou lista e um resumo das mudanças.';

export const textDiffContentBlocks: ContentBlock[] = [
  {
    title: 'Como comparar duas versões de um texto',
    paragraphs: [
      'Cole o texto original no primeiro campo e o texto novo no segundo (ou envie arquivos .txt, .md, .csv, .json, .html, .xml e .log) e clique em "Comparar textos". O resultado mostra o que saiu em vermelho, o que entrou em verde e o que ficou igual, lado a lado e em uma leitura contínua, além de uma lista de alterações. O botão "Trocar lados" inverte original e novo.',
      'A escolha do modo muda a unidade comparada. Palavra (o padrão) serve para revisar frases e artigos, caractere mostra mudanças pequenas como um erro de digitação, e linha ou parágrafo são melhores para código, contratos e documentação. Exemplo: ao comparar "O gato preto dorme." com "O gato branco dorme." no modo palavra, só "preto" aparece como removido e "branco" como adicionado, com similaridade de 75%.',
    ],
  },
  {
    title: 'Como ler os números e as opções',
    paragraphs: [
      'A similaridade é a parcela de unidades iguais sobre o total de unidades (iguais, adicionadas e removidas). No modo palavra, os espaços entre palavras também contam como unidades. "Adições" e "Remoções" são essas unidades. "Linhas alteradas" mostra o maior valor entre as duas e a diferença de tamanho mostra quantos caracteres a versão nova tem a mais ou a menos. O resumo executivo repete esses números em frases.',
      'As opções permitem ignorar maiúsculas, acentos, espaços extras, pontuação e quebras de linha. A comparação é feita sobre o texto já ajustado por essas opções, então o diff exibido também aparece sem as diferenças ignoradas. Atenção: "Ignorar espaços extras" vem marcado e junta todo o texto em uma única linha, inclusive as quebras de linha. Para comparar por linha, parágrafo ou lista, desmarque essa opção.',
    ],
    list: [
      'Lista: mostra os itens em comum e os que aparecem só na lista A ou só na B. Itens repetidos aparecem no arquivo JSON exportado.',
      'Exportar TXT: relatório com métricas, resumo e todas as alterações.',
      'Exportar JSON: o resultado completo, com as operações do diff.',
      'Copiar texto final: copia o conteúdo do campo "Texto novo".',
    ],
  },
  {
    title: 'Limites e privacidade',
    paragraphs: [
      'A comparação é feita no navegador e os textos não são enviados ao nosso servidor. Para manter a página rápida, quando a quantidade de unidades de um texto multiplicada pela do outro passa de 250 mil (por exemplo, mais de 500 caracteres, 500 linhas ou cerca de 250 palavras em cada lado), a ferramenta não calcula as partes iguais: marca todo o texto original como removido e todo o novo como adicionado, e a similaridade fica em 0%. Nesses casos, compare por partes, ou use um modo de unidade maior, como linha ou parágrafo.',
      'A lista de alterações na tela mostra as 120 primeiras. O relatório TXT traz todas. O diff de caracteres e palavras não entende o significado do texto, só a sequência de símbolos: uma frase reescrita com as mesmas ideias aparece como várias trocas.',
    ],
  },
];

export const textDiffFaq: FaqItem[] = [
  {
    question: 'Como comparar dois textos online?',
    answer:
      'Cole o texto original e o texto novo (ou envie arquivos), escolha o modo de comparação e clique em "Comparar textos". O resultado mostra adições, remoções, similaridade e um resumo.',
  },
  {
    question: 'Qual modo de comparação devo usar?',
    answer:
      'Use palavra para frases e artigos, caractere para achar mudanças pequenas, linha para código ou listas de itens longos, parágrafo para documentos e lista para ver quais itens estão em um lado e no outro. Nos modos linha, parágrafo e lista, desmarque "Ignorar espaços extras" para preservar as quebras de linha.',
  },
  {
    question: 'Existe modo para comparar listas?',
    answer:
      'Sim. No modo lista, cada linha é um item e o resultado mostra os itens em comum, os que só existem na lista A e os que só existem na B. A ordem dos itens não importa.',
  },
  {
    question: 'Por que a similaridade aparece como 0% em textos grandes?',
    answer:
      'Em textos muito grandes, a ferramenta não calcula as partes iguais, para não travar o navegador. Nesse caso, tudo aparece como removido e adicionado. Compare por partes ou use o modo linha ou parágrafo.',
  },
  {
    question: 'Meus textos são enviados para algum servidor?',
    answer:
      'Não. O diff e as métricas são calculados no navegador e o conteúdo não sai do seu aparelho.',
  },
];
