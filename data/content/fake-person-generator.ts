import type { ContentBlock, FaqItem } from '@/types/content';

export const fakePersonGeneratorIntro =
  'Gere perfis fictícios para testes, com CPF válido, RG, e-mail, telefone, endereço, idade e nascimento coerentes entre si, e exporte em texto, JSON, CSV ou SQL. Os dados são inventados e não pertencem a pessoas reais.';

export const fakePersonGeneratorContentBlocks: ContentBlock[] = [
  {
    title: 'O que o gerador de pessoa fake cria',
    paragraphs: [
      'A ferramenta monta perfis de pessoa para testes de cadastro, validação de formulários, automação de QA e carga de bancos de homologação. Você gera de 1 a 30 perfis por vez e escolhe sexo, idade exata ou faixa de idade, estado, formato do CPF, domínio do e-mail, tipo de nome (comum ou raro, brasileiro ou internacional), nome dos pais, telefone fixo, senha e extras como tipo sanguíneo, altura e peso.',
      'Os dados mantêm coerência entre si: a data de nascimento corresponde à idade e ao signo, e o estado, a cidade, o DDD e a faixa de CEP combinam. O CPF é válido pelo cálculo dos dígitos verificadores, mas é sorteado e não tem relação com o estado. O RG segue só o formato de cada UF e não tem dígito verificador calculado. Com uma seed fixa, as mesmas opções repetem o mesmo resultado.',
    ],
    list: [
      'Configurar sexo, idade exata ou faixa de idade.',
      'Gerar por estado específico ou em modo aleatório coerente.',
      'Ativar campos extras, como tipo sanguíneo, altura e peso.',
      'Escolher os campos da saída: completo, só e-mails, só CPF e RG ou só telefones.',
      'Exportar em texto, JSON, CSV e SQL INSERT, ou copiar um link com as opções.',
    ],
  },
  {
    title: 'Endereços, e-mails e telefones: o que é real',
    paragraphs: [
      'Para trazer ruas e CEPs que existem, a ferramenta consulta o ViaCEP (viacep.com.br), um serviço externo. A consulta leva apenas estado, cidade e um termo de busca genérico, e nenhum dado da pessoa gerada. Se o serviço não responder, o endereço é montado com dados internos, e o número da casa é sempre sorteado.',
      'Nomes, e-mails e telefones são combinações aleatórias e podem coincidir com os de pessoas reais: os e-mails usam domínios verdadeiros, como gmail.com e outlook.com. Por isso, não envie mensagens, SMS ou ligações para os contatos gerados.',
    ],
  },
  {
    title: 'Uso responsável e privacidade',
    paragraphs: [
      'Os perfis são sintéticos e servem para ambientes de desenvolvimento e homologação. Não use em cadastros reais, para abrir contas, obter vantagens ou se passar por outra pessoa: isso pode configurar fraude.',
      'A geração acontece no navegador. As opções escolhidas ficam salvas no próprio navegador para a próxima visita, e os perfis gerados não são enviados ao servidor do site. A única consulta externa é a do ViaCEP, descrita acima.',
    ],
  },
];

export const fakePersonGeneratorFaq: FaqItem[] = [
  {
    question: 'Os dados gerados são de pessoas reais?',
    answer:
      'Não. Os perfis são inventados e servem para testes técnicos. Como são combinações aleatórias, nomes, e-mails, telefones e até o CPF podem coincidir por acaso com dados reais, por isso não use fora de ambientes de teste.',
  },
  {
    question: 'O CPF gerado é válido?',
    answer:
      'É válido pelo cálculo dos dígitos verificadores, então passa em validações de formato. Ele não é consultado na Receita Federal e não tem relação com o estado ou a idade do perfil.',
  },
  {
    question: 'Os endereços existem de verdade?',
    answer:
      'Em geral, sim para rua, bairro e CEP, que vêm do ViaCEP quando o serviço responde. O número é sorteado, e se a consulta falhar o endereço é montado com dados internos, que podem não existir.',
  },
  {
    question: 'Posso exportar para um banco de dados?',
    answer:
      'Sim. Há saída em SQL INSERT (tabela fake_people no modo completo), além de JSON, CSV e texto simples. A escolha dos campos da saída define as colunas.',
  },
  {
    question: 'Os dados são enviados para o servidor?',
    answer:
      'Não. Os perfis são gerados no navegador. A única consulta externa é ao ViaCEP, feita só com estado, cidade e um termo de busca para obter ruas e CEPs reais.',
  },
];
