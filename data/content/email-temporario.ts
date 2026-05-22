import type { ContentBlock, FaqItem } from '@/types/content';

export const emailTemporarioIntro =
  'Crie um e-mail descartavel para receber mensagens por tempo limitado e reduzir spam no seu endereco principal.';

export const emailTemporarioContentBlocks: ContentBlock[] = [
  {
    title: 'O que e um e-mail temporario?',
    paragraphs: [
      'E-mail temporario e um endereco criado na hora para receber mensagens por um periodo curto, sem precisar cadastrar conta tradicional. Neste site, cada inbox fica ativa por tempo limitado e e apagada automaticamente apos a expiracao.',
      'Esse fluxo ajuda quando voce precisa validar um cadastro rapido, testar um formulario ou receber um codigo unico sem expor seu e-mail pessoal em plataformas desconhecidas.',
    ],
  },
  {
    title: 'Para que serve um e-mail temporario?',
    paragraphs: [
      'O uso mais comum e separar atividades de baixo risco do seu canal principal. Assim voce evita poluicao da caixa principal e reduz a chance de entrar em listas de marketing indesejadas.',
      'Tambem e util para QA e times tecnicos que precisam validar envios transacionais durante homologacao, sem criar usuarios permanentes.',
    ],
    list: [
      'Testar fluxos de cadastro e confirmacao de conta.',
      'Receber codigos de verificacao em testes rapidos.',
      'Evitar spam no e-mail principal em sites secundarios.',
      'Validar webhooks e templates de e-mail em ambiente de QA.',
    ],
  },
  {
    title: 'E seguro usar e-mail temporario?',
    paragraphs: [
      'E uma opcao pratica para privacidade basica, mas nao substitui boas praticas de seguranca. O conteudo recebido e temporario e pode expirar rapido, entao nao use para dados criticos ou contas importantes.',
      'A ferramenta nao promete anonimato absoluto. Sempre trate esse tipo de inbox como canal descartavel para cenarios de baixo risco.',
    ],
  },
  {
    title: 'Quando nao usar e-mail temporario?',
    paragraphs: [
      'Nao use para bancos, corretoras, carteiras de cripto, contas corporativas, recuperacao de senha ou qualquer servico que dependa de historico de mensagens a longo prazo.',
      'Como a inbox expira automaticamente, voce pode perder acesso a notificacoes futuras. Para contas importantes, prefira um e-mail permanente com autenticacao forte.',
    ],
  },
];

export const emailTemporarioFaq: FaqItem[] = [
  {
    question: 'Quanto tempo o e-mail temporario fica ativo?',
    answer:
      'Por padrao, a inbox fica ativa por 1 hora. Depois desse periodo, endereco e mensagens expiram automaticamente.',
  },
  {
    question: 'Preciso criar conta para usar?',
    answer:
      'Nao. Basta gerar um endereco temporario e acompanhar a inbox diretamente na pagina.',
  },
  {
    question: 'Posso enviar e-mails por esta ferramenta?',
    answer:
      'Nao. Este MVP e focado apenas em recebimento de mensagens inbound.',
  },
  {
    question: 'As mensagens ficam salvas para sempre?',
    answer:
      'Nao. O armazenamento e temporario e usa expiracao automatica para apagar dados apos o TTL.',
  },
  {
    question: 'Serve para contas financeiras e recuperacao de senha?',
    answer:
      'Nao e recomendado. Para servicos sensiveis e contas importantes, use um e-mail pessoal permanente e seguro.',
  },
];
