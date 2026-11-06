import type { ContentBlock, FaqItem } from '@/types/content';

export const compoundInterestIntro =
  'Simule juros compostos com aporte mensal, compare com juros simples e descubra o aporte ou a taxa necessária para atingir sua meta financeira.';

export const compoundInterestContentBlocks: ContentBlock[] = [
  {
    title: 'Como a calculadora de juros compostos faz a conta',
    paragraphs: [
      'A simulação combina valor inicial, aporte mensal, taxa de juros e prazo. A capitalização é mensal: a cada mês o saldo recebe os juros do período e, depois, entra o aporte (ou o contrário, se você escolher aporte no início). O resultado mostra o valor final, o total investido, o total em juros e a rentabilidade, que é o total em juros dividido pelo total investido. O prazo é limitado a 1.200 meses (100 anos).',
      'Se a taxa for anual, ela é convertida para a taxa mensal equivalente, e não dividida por 12: 12% ao ano equivalem a cerca de 0,949% ao mês. Exemplo: R$ 1.000 iniciais mais R$ 300 por mês durante 5 anos, a 1% ao mês e com aporte no fim de cada mês, resultam em R$ 26.317,60, sendo R$ 19.000 investidos e R$ 7.317,60 de juros (38,51%). Com o aporte no início do mês, o resultado sobe para R$ 26.562,61.',
    ],
  },
  {
    title: 'Três modos: investir, atingir meta e descobrir taxa',
    paragraphs: [
      'No modo Investir, você testa cenários e vê o gráfico de evolução e a tabela por mês ou por ano. No modo Atingir meta, a calculadora informa o aporte mensal necessário para chegar ao valor desejado com a taxa e o prazo informados: por exemplo, R$ 1.224,44 por mês para juntar R$ 100.000 em 5 anos a 1% ao mês, começando do zero.',
      'No modo Descobrir taxa, você informa o valor desejado, o prazo e os aportes, e a ferramenta encontra a taxa mensal e a anual equivalente. Aportes de R$ 1.000 por mês durante 5 anos para chegar a R$ 100.000 exigem cerca de 1,62% ao mês (21,2% ao ano).',
    ],
    list: [
      'Conversão automática entre taxa mensal e anual equivalente.',
      'Aporte no início ou no fim de cada mês.',
      'Comparação com juros simples, que não capitalizam o saldo.',
      'Desconto opcional da inflação anual para estimar o valor em poder de compra de hoje.',
      'Exportação em CSV e link compartilhável com os valores preenchidos.',
    ],
  },
  {
    title: 'Limites e como interpretar os resultados',
    paragraphs: [
      'A conta é matemática e assume taxa constante, aporte fixo todo mês e nenhum saque. Ela não considera imposto de renda, IOF, taxas de administração nem a oscilação de investimentos reais, que mudam o retorno final. Os valores são estimativas e não representam promessa de rendimento nem recomendação de investimento.',
      'Compare mais de um cenário para ver o efeito de taxas e prazos diferentes. O cálculo acontece no navegador, e os últimos valores ficam salvos apenas no próprio navegador.',
    ],
  },
];

export const compoundInterestFaq: FaqItem[] = [
  {
    question: 'Qual é a fórmula dos juros compostos?',
    answer:
      'Sem aportes, M = C × (1 + i)^n, em que C é o capital inicial, i é a taxa por período e n é o número de períodos. Com aporte mensal, a ferramenta soma os aportes mês a mês, cada um capitalizado pelos meses restantes.',
  },
  {
    question: 'A calculadora aceita aporte mensal?',
    answer:
      'Sim. O aporte mensal é fixo e você escolhe se ele entra no início ou no fim de cada mês. No início, ele já rende juros no mês do aporte.',
  },
  {
    question: 'Como uma taxa anual é convertida?',
    answer:
      'Pela taxa equivalente: (1 + taxa anual)^(1/12) − 1. Assim, 12% ao ano rendem exatamente 12% em 12 meses, e não 1% ao mês.',
  },
  {
    question: 'Posso descobrir quanto aportar para atingir uma meta?',
    answer:
      'Sim. Na aba Atingir meta, informe o valor desejado, o prazo, o valor inicial e a taxa para receber o aporte mensal necessário. Se o valor inicial já chega à meta, o aporte é zero.',
  },
  {
    question: 'Os valores são enviados para um servidor?',
    answer:
      'Não. O cálculo é feito no navegador. O link compartilhável leva os valores na própria URL, então só envie esse link a quem você quiser.',
  },
];
