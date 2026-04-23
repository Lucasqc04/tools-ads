import type { ContentBlock, FaqItem } from '@/types/content';

export const compoundInterestIntro =
  'Simule juros compostos com aporte mensal, compare com juros simples e descubra aporte ou taxa necessaria para atingir sua meta financeira.';

export const compoundInterestContentBlocks: ContentBlock[] = [
  {
    title: 'Calculadora de juros compostos com foco em investimento real',
    paragraphs: [
      'A ferramenta combina valor inicial, aporte mensal, taxa de juros e prazo para projetar crescimento do patrimonio. O resultado mostra valor final, total investido, total em juros e rentabilidade percentual.',
      'A simulacao e util para planejamento de reserva de emergencia, aposentadoria, carteira de medio prazo e comparacao de cenarios com taxas diferentes.',
    ],
  },
  {
    title: 'Tres modos: investir, atingir meta e descobrir taxa',
    paragraphs: [
      'No modo Investir, voce testa cenarios com grafico de evolucao e tabela detalhada por periodo. No modo Atingir meta, a calculadora retorna quanto precisa aportar por mes para chegar ao objetivo.',
      'No modo Descobrir taxa, voce informa objetivo, prazo e aportes para obter a taxa mensal e anual necessaria, facilitando validacao de expectativa de retorno.',
    ],
    list: [
      'Conversao automatica entre taxa mensal e anual equivalente.',
      'Opcao de aporte no inicio ou no fim de cada periodo.',
      'Comparacao com juros simples para leitura educativa.',
      'Desconto opcional de inflacao para estimar valor real.',
      'Exportacao em CSV e compartilhamento por URL.',
    ],
  },
  {
    title: 'Boas praticas para interpretar os resultados',
    paragraphs: [
      'Juros compostos amplificam resultado em horizontes longos, mas dependem de regularidade de aporte e taxa consistente. Use mais de um cenario para avaliar risco e sensibilidade da meta.',
      'Os valores sao estimativas matematicas. Produto financeiro real pode ter impostos, taxas de administracao e oscilacao de mercado que alteram o retorno final.',
    ],
  },
];

export const compoundInterestFaq: FaqItem[] = [
  {
    question: 'Qual e a formula base dos juros compostos?',
    answer:
      'A base e M = C(1+i)^n, onde C e capital inicial, i e taxa por periodo e n e quantidade de periodos.',
  },
  {
    question: 'A calculadora aceita aporte mensal?',
    answer:
      'Sim. Voce pode incluir aporte mensal e escolher se ele entra no inicio ou no fim do periodo.',
  },
  {
    question: 'Qual a diferenca entre taxa mensal e anual?',
    answer:
      'A ferramenta converte automaticamente para taxa mensal equivalente quando taxa e prazo estao em unidades diferentes.',
  },
  {
    question: 'Posso descobrir quanto aportar para bater uma meta?',
    answer:
      'Sim. Na aba Atingir meta, informe valor objetivo, prazo e taxa para receber o aporte mensal necessario.',
  },
  {
    question: 'Os calculos sao feitos localmente?',
    answer:
      'Sim. O processamento ocorre no navegador por padrao, sem envio automatico para servidor.',
  },
];
