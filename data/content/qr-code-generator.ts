import type { ContentBlock, FaqItem } from '@/types/content';

export const qrCodeGeneratorIntro =
  'Cole texto, URL, PIX copia-e-cola ou qualquer conteúdo e gere QR Code grátis em segundos, sem cadastro, sem conta e sem pagar nada, com logo central, cores personalizadas e exportação em PNG, JPEG, WEBP, SVG e PDF.';

export const qrCodeGeneratorContentBlocks: ContentBlock[] = [
  {
    title: 'Como usar o gerador de QR Code',
    paragraphs: [
      'Digite ou cole o conteúdo no campo principal e o QR Code é renderizado no navegador em tempo real. Você pode usar texto simples, links, payload de pagamento e identificadores internos para operações de suporte ou logística.',
      'A ferramenta é gratuita, não exige login e não pede criação de conta. Você pode gerar quantos QR Codes precisar, incluindo versões para testes, campanhas e uso interno.',
      'Depois da geração, ajuste o estilo visual: cor dos módulos, cor de fundo, tipo de pontos, margem, nível de correção de erro e tamanho final da imagem. Se quiser reforçar branding, adicione um logo no centro.',
    ],
  },
  {
    title: 'Grátis, sem cadastro e com uso ilimitado',
    paragraphs: [
      'Este gerador foi pensado para reduzir fricção: sem formulário de cadastro, sem assinatura e sem bloqueio por quantidade de uso. Você consegue criar e baixar QR Codes de forma imediata.',
      'Isso é útil para operações do dia a dia em que velocidade importa, como atendimento, logística, cardápio digital, material impresso, onboarding e campanhas de marketing com troca rápida de links.',
    ],
  },
  {
    title: 'Boas práticas de legibilidade e escaneamento',
    paragraphs: [
      'Para manter leitura robusta, prefira contraste alto entre QR e fundo. Também evite logo central grande demais, pois isso reduz área útil de leitura. O nível de correção de erro ajuda, mas não compensa excesso de interferência visual.',
      'Se o QR for impresso, valide em mais de um dispositivo antes de publicar. Para uso em tela, teste tamanho mínimo em mobile e desktop, principalmente em ambientes de iluminação ruim.',
    ],
    list: [
      'Use fundo claro e módulos escuros para máximo contraste.',
      'Mantenha o logo pequeno e com margem interna adequada.',
      'Teste o QR em iOS e Android antes de distribuir.',
    ],
  },
  {
    title: 'Privacidade e processamento local',
    paragraphs: [
      'Toda a geração acontece localmente no navegador. O texto digitado, a imagem de logo e os arquivos exportados não são enviados para servidor por padrão nesta ferramenta.',
      'Esse modelo reduz latência, aumenta controle do usuário e facilita uso em contextos sensíveis, como payloads internos de operação, dados de onboarding e links de uso temporário.',
    ],
  },
];

export const qrCodeGeneratorFaq: FaqItem[] = [
  {
    question: 'O gerador de QR Code é gratuito mesmo?',
    answer:
      'Sim. A ferramenta é gratuita, sem necessidade de cadastro, sem login e sem pagamento para gerar ou baixar QR Code.',
  },
  {
    question: 'Existe limite de uso por dia ou por arquivo?',
    answer:
      'Não há limite prático de uso na interface da ferramenta. Você pode gerar quantos QR Codes precisar para uso pessoal ou profissional.',
  },
  {
    question: 'Posso gerar QR Code com logo no centro?',
    answer:
      'Sim. Basta enviar uma imagem para o logo central. A ferramenta ajusta o QR mantendo uma área protegida, mas é importante testar leitura após personalização.',
  },
  {
    question: 'Quais formatos de download estão disponíveis?',
    answer:
      'Você pode exportar em PNG, JPEG, WEBP, SVG e PDF. Também é possível copiar a imagem do QR para a área de transferência em navegadores compatíveis.',
  },
  {
    question: 'A ferramenta envia meu texto para servidor?',
    answer:
      'Não. O processamento é local no navegador e o conteúdo inserido não é transmitido para backend por padrão.',
  },
];
