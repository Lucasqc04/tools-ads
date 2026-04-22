import type { ContentBlock, FaqItem } from '@/types/content';

export const bitcoinWalletIntro =
  'Crie carteira Bitcoin em Testnet e Mainnet, importe seed/WIF, consulte saldo e UTXOs, e envie BTC direto no navegador com mempool API.';

export const bitcoinWalletContentBlocks: ContentBlock[] = [
  {
    title: 'Carteira Bitcoin client-side com BIP39 e BIP84',
    paragraphs: [
      'A ferramenta gera seed phrase BIP39 e deriva endereco SegWit nativo (BIP84) localmente no browser. Em testnet, usa caminho com coin type 1; em mainnet, coin type 0.',
      'Voce tambem pode importar carteira por seed phrase ou private key em formato WIF para recuperar endereco e preparar envios sem backend custodial.',
    ],
  },
  {
    title: 'Consulta de saldo, UTXOs e envio com mempool API',
    paragraphs: [
      'Para montar transacao de envio, a pagina consulta UTXOs do endereco e faz coin selection local. Depois, assina a transacao no navegador e envia o hex final para broadcast.',
      'A estimativa de fee usa sat/vB e sugestoes publicas da mempool API para ajudar na confirmacao conforme urgencia.',
    ],
    list: [
      'Gerar carteira testnet/mainnet com seed em ingles.',
      'Importar carteira por mnemonic BIP39.',
      'Importar carteira por WIF.',
      'Ler saldo confirmado e nao confirmado.',
      'Visualizar UTXOs e enviar BTC com assinatura local.',
    ],
  },
  {
    title: 'Privacidade, riscos e boas praticas',
    paragraphs: [
      'A tool nao salva seed phrase nem WIF no servidor por padrao. Ainda assim, ambiente comprometido (malware, extensao maliciosa, captura de tela) pode expor suas chaves.',
      'Use testnet como padrao para testes e, em mainnet, opere com valores pequenos. Para custodia de longo prazo, prefira wallet dedicada ou hardware wallet.',
    ],
  },
];

export const bitcoinWalletFaq: FaqItem[] = [
  {
    question: 'Essa ferramenta funciona em testnet e mainnet?',
    answer:
      'Sim. Voce pode alternar entre testnet e mainnet no seletor de rede, com testnet como padrao recomendado.',
  },
  {
    question: 'Posso importar seed phrase e WIF?',
    answer:
      'Sim. A ferramenta suporta importacao por mnemonic BIP39 (ingles) e por private key em formato WIF.',
  },
  {
    question: 'Como o envio de BTC funciona sem backend?',
    answer:
      'A transacao e montada e assinada localmente no navegador. A API publica da mempool e usada para consultar UTXOs e para broadcast do hex assinado.',
  },
  {
    question: 'Meus dados sensiveis sao enviados para servidor?',
    answer:
      'Seed phrase e WIF nao sao enviados por padrao. Apenas chamadas publicas de rede sao feitas para saldo/UTXOs e broadcast quando voce decide enviar.',
  },
  {
    question: 'Posso usar para valores altos em mainnet?',
    answer:
      'Nao e o ideal. Para valores relevantes, prefira uma wallet dedicada ou hardware wallet com boas praticas de seguranca.',
  },
];
