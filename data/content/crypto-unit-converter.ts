import type { ContentBlock, FaqItem } from '@/types/content';

export const cryptoConverterIntro =
  'Converta unidades do mesmo ativo cripto, como BTC em satoshis, gwei em ETH ou lamports em SOL. Cobre BTC, ETH, USDT, USDC, SOL, BNB, TRX, XRP, ADA, LTC, DOT, AVAX, ATOM, XMR e TON, com cálculo exato e feito no navegador.';

export const cryptoConverterContentBlocks: ContentBlock[] = [
  {
    title: 'Como funciona a conversão de unidades cripto',
    paragraphs: [
      'A ferramenta converte apenas unidades do mesmo ativo. Você pode transformar BTC em satoshis, gwei em ETH ou lamports em SOL, mas não BTC em ETH. Cada ativo tem uma unidade base (a menor) e fatores fixos para as demais, incluindo um caso fracionário, o millisatoshi (1 satoshi = 1.000 msat).',
      'O cálculo usa números inteiros de precisão arbitrária, sem arredondamento de ponto flutuante. Por exemplo, 0,015 BTC são 1.500.000 satoshis e 25 gwei são 0,000000025 ETH. Você pode digitar ponto ou vírgula como separador decimal. Quando o resultado passa de 18 casas decimais, ele é cortado (não arredondado) e a tela avisa. Na tela, o resultado usa vírgula para milhares e ponto para decimais; o botão de copiar entrega o número sem separador de milhares.',
    ],
  },
  {
    title: 'Quando usar no dia a dia',
    paragraphs: [
      'Explorers e carteiras costumam mostrar taxas e saldos em satoshis (Bitcoin) ou em gwei e wei (Ethereum e redes compatíveis). A conversão rápida ajuda a conferir se um valor cobrado faz sentido e a escrever documentação técnica com a mesma quantia em unidades diferentes.',
      'Para desenvolvedores, também serve para depurar integrações em que a API devolve valores na unidade mínima, como lamports, sun, drops ou piconeros.',
    ],
    list: [
      'Conferir frações pequenas de BTC em satoshis.',
      'Interpretar custos de transação em gwei e wei.',
      'Converter lamports em SOL e sun em TRX ao depurar uma integração.',
      'Padronizar valores antes de colocá-los em uma planilha.',
    ],
  },
  {
    title: 'Limites importantes',
    paragraphs: [
      'Este conversor não faz cotação em reais ou dólares e não troca um ativo por outro: ele não consulta preços e não serve como recomendação financeira. Para saber quanto um valor vale em moeda, use uma fonte de cotação atualizada.',
      'Os fatores são fixos e cobrem só os ativos e as unidades listados. Stablecoins e tokens variam por rede: USDT e USDC usam 6 casas decimais em redes populares, mas implementações específicas podem usar outro valor (na BNB Chain, por exemplo, é comum haver 18). Confira a precisão no contrato oficial do token. As unidades off-chain, como o msat da Lightning, servem para cálculo técnico e não representam uma liquidação on-chain.',
    ],
  },
];

export const cryptoConverterFaq: FaqItem[] = [
  {
    question: 'Esta ferramenta usa cotação em tempo real?',
    answer:
      'Não. Ela converte unidades do mesmo ativo por fatores fixos e não consulta preços. O resultado aparece conforme você digita, sem chamadas de rede.',
  },
  {
    question: 'Qual a diferença entre BTC e satoshi?',
    answer:
      'Satoshi é a menor fração do bitcoin. 1 BTC equivale a 100.000.000 satoshis.',
  },
  {
    question: 'O que é gwei no Ethereum?',
    answer:
      'Gwei é uma unidade do ETH muito usada para taxas de rede (gas). 1 ETH equivale a 1.000.000.000 gwei, e 1 gwei equivale a 1.000.000.000 wei.',
  },
  {
    question: 'Por que existe aviso para msat (Lightning)?',
    answer:
      'Millisatoshi é uma unidade off-chain da Lightning Network (1 sat = 1.000 msat). A conversão serve para cálculo técnico, mas não corresponde a uma liquidação direta na rede base do Bitcoin.',
  },
  {
    question: 'Os valores digitados são enviados para algum servidor?',
    answer:
      'Não. A conversão acontece no navegador e o valor digitado não é transmitido a nenhum servidor.',
  },
];
