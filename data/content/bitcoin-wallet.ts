import type { ContentBlock, FaqItem } from '@/types/content';

export const bitcoinWalletIntro =
  'Crie ou importe uma carteira Bitcoin (BIP39/BIP84), consulte saldo e UTXOs e envie BTC em testnet ou mainnet, com a assinatura feita no próprio navegador.';

export const bitcoinWalletContentBlocks: ContentBlock[] = [
  {
    title: 'Como a carteira é gerada e importada',
    paragraphs: [
      'Ao gerar uma carteira, a ferramenta cria uma seed phrase BIP39 de 12 palavras em inglês, usando o gerador de números aleatórios seguro do navegador, e deriva um endereço SegWit nativo (BIP84, começa com bc1q na mainnet e tb1q na testnet). A derivação usa o caminho m/84\'/0\'/0\'/0/0 na mainnet e m/84\'/1\'/0\'/0/0 na testnet, ou seja, sempre o primeiro endereço de recebimento.',
      'Também é possível importar uma seed phrase BIP39 em inglês (12 ou 24 palavras) ou uma chave privada em formato WIF, desde que seja da rede selecionada e esteja no formato comprimido. Seeds protegidas por passphrase não são suportadas: o endereço mostrado será outro.',
    ],
    list: [
      'Gerar carteira nova em testnet ou mainnet.',
      'Importar por seed phrase BIP39 em inglês.',
      'Importar por chave privada WIF comprimida.',
      'Ver saldo confirmado e não confirmado do endereço.',
      'Listar UTXOs e enviar BTC com assinatura local.',
    ],
  },
  {
    title: 'Saldo, UTXOs e envio de BTC',
    paragraphs: [
      'Para mostrar o saldo e os UTXOs, a página consulta a API do mempool.space, com a Blockstream como alternativa se a primeira falhar. No envio, ela confere o endereço de destino para a rede escolhida, seleciona os maiores UTXOs até cobrir o valor mais a fee, assina a transação no navegador e transmite o hex pronto à mesma API. Por padrão, só UTXOs confirmados entram na seleção.',
      'A fee é calculada em sat/vB, com sugestões da mempool para escolher a urgência. O troco volta para o mesmo endereço. Se a sobra for menor que 546 sats, ela não vira troco e fica para os mineradores. Depois de transmitida, a transação não pode ser desfeita.',
    ],
  },
  {
    title: 'Privacidade, riscos e limites',
    paragraphs: [
      'A seed phrase e a WIF ficam apenas na memória da página: não são enviadas ao servidor do site nem gravadas no navegador. Por isso, ao recarregar ou fechar a página, a carteira some. Anote a seed antes de usar e guarde-a offline; quem a conhecer controla os fundos e ninguém consegue recuperá-la para você.',
      'Para consultar saldo e transmitir, o endereço e a transação assinada são enviados ao mempool.space (ou à Blockstream), que enxergam também o seu IP. Malware, extensões maliciosas e capturas de tela podem expor suas chaves.',
      'A ferramenta mostra só o primeiro endereço da carteira e não aceita passphrase, outros caminhos de derivação ou carteiras multisig. Fundos em outros endereços da mesma seed não aparecem no saldo. Use a testnet para aprender (suas moedas não têm valor) e, na mainnet, apenas valores pequenos. Para quantias relevantes, prefira uma hardware wallet. Este conteúdo é técnico e não é recomendação financeira.',
    ],
  },
];

export const bitcoinWalletFaq: FaqItem[] = [
  {
    question: 'Funciona em testnet e mainnet?',
    answer:
      'Sim. Você escolhe a rede no seletor, e a testnet vem como padrão. Na mainnet, qualquer envio usa BTC real e não pode ser desfeito.',
  },
  {
    question: 'Posso importar seed phrase e WIF?',
    answer:
      'Sim. A seed deve ser BIP39 em inglês (12 ou 24 palavras) e sem passphrase. A WIF precisa ser da rede selecionada e estar no formato comprimido. Em ambos os casos, a ferramenta mostra o endereço SegWit nativo correspondente.',
  },
  {
    question: 'Como o envio funciona sem backend?',
    answer:
      'A transação é montada e assinada no seu navegador. A API pública do mempool.space (ou da Blockstream) serve apenas para consultar UTXOs e fees e para transmitir o hex já assinado.',
  },
  {
    question: 'Minha seed ou WIF é enviada para algum servidor?',
    answer:
      'Não. Elas não saem do navegador e não são gravadas. Só o endereço, os pedidos de consulta e a transação assinada vão para a API pública da rede.',
  },
  {
    question: 'Posso guardar valores altos aqui?',
    answer:
      'Não é o indicado. A seed fica exposta na tela e na memória do navegador, e a página não guarda a carteira. Para valores relevantes, use uma hardware wallet.',
  },
];
