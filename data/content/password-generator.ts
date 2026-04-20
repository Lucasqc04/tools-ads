import type { ContentBlock, FaqItem } from '@/types/content';

export const passwordGeneratorIntro =
  'Gere senha forte automaticamente com tamanho personalizado, selecao de caracteres e copia rapida.';

export const passwordGeneratorContentBlocks: ContentBlock[] = [
  {
    title: 'Gerador de senha forte para uso pessoal e profissional',
    paragraphs: [
      'Esta ferramenta cria senhas aleatorias combinando letras maiusculas, minusculas, numeros e simbolos conforme as opcoes escolhidas. Isso ajuda a montar credenciais mais resistentes para contas pessoais, sistemas corporativos e ambientes de desenvolvimento.',
      'A senha e atualizada automaticamente quando voce muda o tamanho ou os tipos de caracteres. Assim, voce testa combinacoes rapidamente sem perder tempo com ajustes manuais.',
    ],
  },
  {
    title: 'Quando usar um criador de senha online',
    paragraphs: [
      'No dia a dia, muitas pessoas reutilizam senhas curtas e previsiveis. Um gerador com controle de composicao facilita a criacao de senhas unicas para cada servico.',
      'Com botao de regenerar e copia em um clique, o fluxo fica pratico para configurar novas contas, renovar acessos e criar credenciais para homologacao.',
    ],
    list: [
      'Criar senha forte para e-mail e banco digital.',
      'Gerar credenciais para sistemas internos da empresa.',
      'Definir senhas de teste para ambientes de QA e staging.',
      'Ajustar regras de senha conforme politica de seguranca do servico.',
    ],
  },
  {
    title: 'Privacidade, limites e boas praticas',
    paragraphs: [
      'A geracao acontece localmente no navegador e nao exige envio da senha para servidor por padrao. Isso reduz exposicao de dados durante o processo.',
      'Para aumentar seguranca, use senhas longas, evite reutilizacao entre servicos e prefira combinar este gerador com um gerenciador de senhas confiavel.',
    ],
  },
];

export const passwordGeneratorFaq: FaqItem[] = [
  {
    question: 'A senha e gerada automaticamente?',
    answer:
      'Sim. A senha muda automaticamente quando voce altera tamanho ou tipos de caracteres, e voce ainda pode usar o botao de regenerar.',
  },
  {
    question: 'Posso escolher quais caracteres entram na senha?',
    answer:
      'Sim. Voce pode ativar ou desativar letras maiusculas, letras minusculas, numeros e simbolos.',
  },
  {
    question: 'Existe limite de quantidade de caracteres?',
    answer:
      'O campo nao tem limite fixo na interface. Em valores muito altos, o tempo de geracao pode variar conforme o desempenho do dispositivo.',
  },
  {
    question: 'Posso copiar a senha com um clique?',
    answer:
      'Sim. A ferramenta tem botao de copiar para levar a senha direto para a area de transferencia.',
  },
  {
    question: 'A senha e enviada para servidor?',
    answer:
      'Nao por padrao. A geracao e local no navegador.',
  },
];
