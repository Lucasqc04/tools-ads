import type { ContentBlock, FaqItem } from '@/types/content';

export const cryptoConverterIntro =
  'Converta unidades cripto de BTC, ETH, USDT, USDC, SOL, BNB, TRX, XRP, ADA, LTC, DOT, AVAX, ATOM, XMR e TON localmente, sem API externa e com cálculo em tempo real.';

export const cryptoConverterContentBlocks: ContentBlock[] = [
  {
    title: 'Como funciona a conversão de unidades cripto',
    paragraphs: [
      'A ferramenta converte apenas unidades do mesmo ativo. Você pode transformar BTC em satoshis, gwei em ETH ou lamport em SOL, mas não BTC em ETH. Esse recorte evita confusão de cotação e mantém o foco em precisão de unidade.',
      'Todo cálculo é matemático e local, com base em fatores fixos (incluindo casos racionais, como millisatoshi na Lightning Network). Não existe chamada para API externa e nenhum dado digitado é enviado para servidor.',
    ],
  },
  {
    title: 'Quando usar no dia a dia',
    paragraphs: [
      'Ao conferir taxas de rede, muitos explorers e carteiras exibem valores em satoshis (BTC) ou gwei/wei (ETH). A conversão rápida ajuda a validar se o valor cobrado está coerente.',
      'Também é útil para documentação técnica, propostas comerciais e conteúdo educativo, quando você precisa mostrar o mesmo valor em unidades diferentes para públicos distintos.',
    ],
    list: [
      'Conferir frações pequenas de BTC em satoshis.',
      'Interpretar custos de transação em gwei e wei.',
      'Converter lamports em SOL e sun em TRX para debugging de integração.',
      'Padronizar dados antes de exportar para planilhas.',
    ],
  },
  {
    title: 'Limitações importantes',
    paragraphs: [
      'Este conversor não faz cotação entre moedas fiduciárias (como BRL ou USD) e não realiza troca entre ativos diferentes. O foco é exclusivamente conversão de unidade dentro do mesmo ativo.',
      'Stablecoins e tokens variam por rede. USDT e USDC costumam operar com 6 casas em redes populares, mas implementações específicas podem divergir. Sempre valide a precisão no contrato/token oficial do seu contexto.',
    ],
  },
];

export const cryptoConverterFaq: FaqItem[] = [
  {
    question: 'Esta ferramenta usa cotação em tempo real?',
    answer:
      'Não. Ela converte unidades internas de cada ativo por fatores fixos, sem consultar APIs de preço.',
  },
  {
    question: 'Qual a diferença entre BTC e satoshi?',
    answer:
      'Satoshi é a menor fração de bitcoin. 1 BTC equivale a 100.000.000 satoshis.',
  },
  {
    question: 'O que é gwei no Ethereum?',
    answer:
      'Gwei é uma unidade intermediária do ETH usada com frequência para taxas de rede. 1 ETH equivale a 1.000.000.000 gwei.',
  },
  {
    question: 'Por que existe aviso para msat (Lightning)?',
    answer:
      'Millisatoshi é uma unidade off-chain da Lightning Network. A conversão é útil para cálculo técnico, mas não representa liquidação on-chain direta no protocolo base do Bitcoin.',
  },
  {
    question: 'Os dados são enviados para algum servidor?',
    answer:
      'Não. O processamento ocorre no navegador e o valor digitado não é transmitido para backend.',
  },
];
