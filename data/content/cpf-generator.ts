import type { ContentBlock, FaqItem } from '@/types/content';

export const cpfGeneratorIntro =
  'Crie CPF válido para testes em segundos, com opção com ou sem pontuação e cópia rápida em lote.';

export const cpfGeneratorContentBlocks: ContentBlock[] = [
  {
    title: 'Gerador de CPF válido para testes de formulário e QA',
    paragraphs: [
      'Esta ferramenta gera números de CPF matematicamente válidos seguindo o cálculo oficial dos dígitos verificadores. Isso ajuda em fluxos de desenvolvimento, testes de integração e validação de campos em sistemas internos.',
      'Você pode escolher o formato com pontuação (000.000.000-00) ou sem pontuação (00000000000), dependendo da regra do ambiente que está testando.',
    ],
  },
  {
    title: 'Quando usar um criador de CPF válido',
    paragraphs: [
      'Equipes de produto, QA e desenvolvimento costumam precisar de dados de teste realistas para validar máscaras de input, validações backend e processos de cadastro.',
      'Com geração em lote e cópia rápida, fica mais fácil preencher cenários de teste sem repetir dados manualmente.',
    ],
    list: [
      'Validar campos de cadastro com regra de CPF.',
      'Testar APIs que exigem CPF no payload.',
      'Simular bases de homologação com dados sintéticos.',
      'Alternar entre CPF com e sem pontuação conforme a integração.',
    ],
  },
  {
    title: 'Privacidade, limites e boas práticas',
    paragraphs: [
      'A geração é local no navegador e não depende de envio para servidor por padrão. Isso reduz fricção e melhora privacidade no processo de teste.',
      'Use os CPFs gerados apenas para ambientes de desenvolvimento, homologação e cenários de validação. Não utilize em contextos de identificação real de pessoas.',
    ],
  },
];

export const cpfGeneratorFaq: FaqItem[] = [
  {
    question: 'Os números gerados passam na validação de CPF?',
    answer:
      'Sim. O cálculo usa os dígitos verificadores oficiais do CPF, então os números são válidos para testes de regra.',
  },
  {
    question: 'Posso gerar CPF com e sem pontuação?',
    answer:
      'Sim. A ferramenta permite alternar entre formato com pontuação e formato apenas numérico.',
  },
  {
    question: 'Consigo copiar vários CPFs de uma vez?',
    answer:
      'Sim. Depois de gerar a lista, você pode copiar todos os CPFs em lote ou copiar item por item.',
  },
  {
    question: 'Preciso de cadastro ou login para usar?',
    answer:
      'Não. O uso é gratuito, direto no navegador e sem cadastro obrigatório.',
  },
  {
    question: 'Os dados são enviados para servidor?',
    answer:
      'Não por padrão. A geração acontece localmente no navegador.',
  },
];
