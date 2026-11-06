import type { ContentBlock, FaqItem } from '@/types/content';

export const emailTemporarioIntro =
  'Crie um e-mail temporário grátis para receber mensagens por 1 hora, ler tudo na própria página e manter seu e-mail principal fora de cadastros e testes.';

export const emailTemporarioContentBlocks: ContentBlock[] = [
  {
    title: 'O que é um e-mail temporário',
    paragraphs: [
      'É um endereço criado na hora, sem conta nem senha, que só recebe mensagens. Ao clicar em gerar, a ferramenta cria uma inbox no domínio mail.lucasqc.com com um nome aleatório (ou o prefixo que você escolher, de 3 a 40 caracteres) e mostra as mensagens na própria página.',
      'Por padrão, a inbox dura 1 hora. A tela consulta novas mensagens a cada 10 segundos enquanto a aba está aberta, mostra o tempo restante e permite apagar tudo antes do prazo.',
    ],
  },
  {
    title: 'Para que usar',
    paragraphs: [
      'O uso mais comum é receber um código ou um link de confirmação em um site que você não quer associar ao e-mail pessoal. Equipes de desenvolvimento também usam o endereço para conferir e-mails de cadastro, recuperação e notificação em ambientes de teste, sem criar caixas permanentes.',
    ],
    list: [
      'Confirmar um cadastro rápido ou baixar um material gratuito.',
      'Receber um código de verificação em um teste.',
      'Conferir como um e-mail transacional chega e como o HTML dele é exibido.',
      'Evitar lista de marketing no e-mail principal.',
    ],
  },
  {
    title: 'Como as mensagens são tratadas',
    paragraphs: [
      'Os e-mails chegam ao servidor do site e ficam guardados até a inbox expirar ou até você apagá-la. Esse armazenamento é temporário, mas não é local: o conteúdo passa pelo servidor. A leitura exige um código secreto gerado junto com a inbox e salvo no seu navegador; é por isso que, ao recarregar a página, você recupera a mesma inbox enquanto ela estiver ativa.',
      'A visualização HTML acontece em um quadro isolado: scripts e formulários são bloqueados e as imagens externas só carregam se você permitir, porque podem avisar o remetente de que o e-mail foi aberto. Também dá para ler a versão em texto e ver o HTML.',
    ],
  },
  {
    title: 'Limites e quando não usar',
    paragraphs: [
      'A inbox guarda até 50 mensagens e só recebe: não há envio nem resposta. Anexos não são exibidos, apenas o texto e o HTML do e-mail. Mensagens muito longas são cortadas, e há limite de criações por minuto para evitar abuso.',
      'Não use para banco, corretora, carteira de criptomoedas, conta de trabalho ou recuperação de senha de qualquer serviço importante, pois depois da expiração você perde o acesso ao endereço. Quem souber o endereço pode enviar mensagens para ele, e o serviço não garante anonimato.',
    ],
  },
];

export const emailTemporarioFaq: FaqItem[] = [
  {
    question: 'Quanto tempo o e-mail temporário fica ativo?',
    answer:
      'Por padrão, 1 hora. A tela mostra a contagem regressiva e, ao final, o endereço e as mensagens são apagados automaticamente. Você também pode apagar a inbox antes, com o botão "Apagar inbox".',
  },
  {
    question: 'Preciso criar conta ou informar meu e-mail?',
    answer:
      'Não. Basta gerar o endereço. Se você recarregar a página no mesmo navegador, a inbox ativa é recuperada.',
  },
  {
    question: 'As mensagens ficam guardadas onde?',
    answer:
      'No servidor do site, de forma temporária, até a inbox expirar ou ser apagada. Por isso, não use o endereço para receber informações sensíveis.',
  },
  {
    question: 'Posso enviar e-mails ou receber anexos?',
    answer:
      'Não. A ferramenta apenas recebe mensagens e mostra assunto, remetente, texto e HTML. Anexos não são exibidos.',
  },
  {
    question: 'Posso usar para recuperar senha ou criar contas importantes?',
    answer:
      'Não é recomendado. Quando a inbox expira, você perde o acesso ao endereço e pode ficar sem como recuperar a conta. Para bancos, trabalho e serviços importantes, use um e-mail permanente.',
  },
];
