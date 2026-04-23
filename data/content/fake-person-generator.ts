import type { ContentBlock, FaqItem } from '@/types/content';

export const fakePersonGeneratorIntro =
  'Gere pessoas ficticias coerentes para testes com CPF valido, RG, email, telefone, endereco, idade, nascimento e exportacao em JSON, CSV e SQL.';

export const fakePersonGeneratorContentBlocks: ContentBlock[] = [
  {
    title: 'Gerador de pessoa fake para QA, homologacao e automacao',
    paragraphs: [
      'Esta ferramenta cria perfis ficticios de pessoa com foco em uso tecnico: testes de cadastro, validacao de formularios, pipelines de QA e seeds para banco de homologacao.',
      'A geracao prioriza coerencia entre sexo, faixa etaria, data de nascimento, signo, estado, cidade, DDD e CEP, reduzindo retrabalho manual durante testes.',
    ],
  },
  {
    title: 'Foco Brasil com dados coerentes e dominio de email famoso',
    paragraphs: [
      'A estrutura da identidade gerada foi pensada para contexto brasileiro: CPF valido, RG em formato realista, endereco por UF com cidades e DDD compativeis e telefones no padrao nacional.',
      'Nos emails, a saida usa dominios conhecidos como gmail.com, hotmail.com, outlook.com e yahoo.com, com opcao de fixar um dominio especifico.',
    ],
    list: [
      'Configurar sexo, idade exata ou faixa de idade.',
      'Gerar por estado especifico ou modo aleatorio coerente.',
      'Ativar campos extras como tipo sanguineo, altura e peso.',
      'Escolher preset de saida: completo, somente emails, somente CPF/RG ou somente telefones.',
      'Exportar em texto, JSON, CSV e SQL INSERT.',
    ],
  },
  {
    title: 'Privacidade e uso responsavel',
    paragraphs: [
      'Os dados sao sinteticos e destinados a ambientes de teste. Nao devem ser usados para fraude, personificacao ou qualquer acao ilegal.',
      'Por padrao, a geracao acontece localmente no navegador, sem envio automatico de dados para servidor.',
    ],
  },
];

export const fakePersonGeneratorFaq: FaqItem[] = [
  {
    question: 'Os dados gerados sao reais?',
    answer:
      'Nao. Os dados sao ficticios e foram criados para testes tecnicos em desenvolvimento e homologacao.',
  },
  {
    question: 'O CPF gerado e valido matematicamente?',
    answer:
      'Sim. O CPF segue o algoritmo oficial de digitos verificadores para passar em validacoes de formato e calculo.',
  },
  {
    question: 'Consigo gerar dados coerentes por estado e cidade?',
    answer:
      'Sim. A tool combina estado, cidade, DDD e faixa de CEP de forma coerente para reduzir inconsistencias no teste.',
  },
  {
    question: 'Posso exportar para banco de dados?',
    answer:
      'Sim. Existe saida em SQL INSERT, alem de JSON, CSV e texto simples para integracao rapida.',
  },
  {
    question: 'Os dados sao enviados para servidor?',
    answer:
      'Nao por padrao. O processamento ocorre localmente no navegador.',
  },
];
