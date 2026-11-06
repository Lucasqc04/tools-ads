import type { ContentBlock, FaqItem } from '@/types/content';

export const cpfGeneratorIntro =
  'Gere CPFs com dígitos verificadores corretos para testar formulários e sistemas, com ou sem pontuação e em lotes de até 100. Os números são sorteados, servem apenas para testes e não pertencem a pessoas escolhidas.';

export const cpfGeneratorContentBlocks: ContentBlock[] = [
  {
    title: 'O que o gerador de CPF cria',
    paragraphs: [
      'O CPF tem 11 dígitos: nove sorteados e dois dígitos verificadores, calculados a partir dos nove primeiros. A ferramenta sorteia os nove dígitos, calcula os dois finais e entrega números que passam na validação matemática. Números com todos os dígitos iguais, como 11111111111, são descartados. Por exemplo, a base 123456789 resulta em 123.456.789-09.',
      'Você escolhe de 1 a 100 CPFs por vez e o formato: com pontuação (000.000.000-00) ou só com números (00000000000), conforme o que o seu campo ou a sua API aceita. Dá para copiar um número, ou a lista inteira, de uma só vez.',
    ],
  },
  {
    title: 'Quando usar e o que esperar',
    paragraphs: [
      'Equipes de produto, QA e desenvolvimento usam CPFs de teste para validar máscaras de campo, regras de backend e fluxos de cadastro em ambientes de desenvolvimento e homologação, sem precisar usar o documento de uma pessoa real.',
      'Os números são aleatórios e não foram criados a partir de nenhuma pessoa. Como qualquer combinação com dígitos corretos pode existir, um CPF gerado pode coincidir por acaso com o de alguém. Ele só prova que a conta dos dígitos fecha: não existe consulta à Receita Federal, e sistemas que conferem o cadastro oficial vão recusá-lo.',
    ],
    list: [
      'Validar campos de cadastro com regra de CPF.',
      'Testar APIs que exigem CPF no corpo da requisição.',
      'Montar bases de homologação com dados sintéticos.',
      'Alternar entre CPF com e sem pontuação, conforme a integração.',
    ],
  },
  {
    title: 'Privacidade e uso responsável',
    paragraphs: [
      'A geração acontece no navegador, e os CPFs gerados não são enviados ao servidor do site.',
      'Use os números apenas em ambientes de teste. Não os use em cadastros reais, para abrir contas, obter benefícios ou se passar por outra pessoa: além de não funcionarem em validações oficiais, esse uso pode configurar fraude.',
    ],
  },
];

export const cpfGeneratorFaq: FaqItem[] = [
  {
    question: 'Os números gerados passam na validação de CPF?',
    answer:
      'Sim. Os dois últimos dígitos são calculados pelo algoritmo do CPF, então a validação matemática passa. Isso não significa que o CPF exista ou pertença a alguém.',
  },
  {
    question: 'O CPF gerado é de uma pessoa real?',
    answer:
      'Não é criado a partir de nenhuma pessoa: os nove primeiros dígitos são sorteados. Por acaso, um número pode coincidir com um CPF existente, por isso use apenas em testes.',
  },
  {
    question: 'Posso gerar CPF com e sem pontuação?',
    answer:
      'Sim. Escolha "Com pontuação" (000.000.000-00) ou "Sem pontuação" (só números). A escolha vale para a lista inteira.',
  },
  {
    question: 'Consigo copiar vários CPFs de uma vez?',
    answer:
      'Sim. Gere de 1 a 100 números e use "Copiar todos" para levar a lista inteira, ou copie item por item.',
  },
  {
    question: 'Os CPFs são enviados para o servidor?',
    answer:
      'Não. A geração acontece no navegador e os números não são enviados ao site.',
  },
];
