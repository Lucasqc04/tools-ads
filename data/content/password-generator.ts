import type { ContentBlock, FaqItem } from '@/types/content';

export const passwordGeneratorIntro =
  'Gere uma senha aleatória escolhendo o tamanho e os tipos de caracteres. Ela é criada no seu navegador e atualizada na hora, com cópia em um clique.';

export const passwordGeneratorContentBlocks: ContentBlock[] = [
  {
    title: 'Como a senha é gerada',
    paragraphs: [
      'A ferramenta monta a senha com letras maiúsculas, letras minúsculas, números e símbolos, conforme as opções marcadas. Os símbolos possíveis são !@#$%^&*()-_=+[]{};:,.<>/?|~. O padrão é 12 caracteres, e o tamanho pode ser ajustado pelo slider (de 1 a 200) ou pelo campo numérico, que não tem limite fixo.',
      'Cada caractere é sorteado com o gerador de números aleatórios criptográfico do navegador (crypto.getRandomValues), com descarte de valores para evitar viés, e a ordem final é embaralhada. Quando o tamanho permite, a senha contém ao menos um caractere de cada tipo marcado. A senha é atualizada sempre que você muda o tamanho ou as opções, e o botão "Regenerar" cria outra com os mesmos ajustes.',
    ],
  },
  {
    title: 'Como escolher o tamanho',
    paragraphs: [
      'A segurança depende principalmente do tamanho e do conjunto de caracteres. Com os quatro tipos marcados, cada caractere vem de um conjunto de 90 opções, o que dá cerca de 6,5 bits por caractere: uma senha de 12 caracteres tem aproximadamente 78 bits, e uma de 20 caracteres, cerca de 130 bits. Desmarcar tipos reduz esse número. Alguns serviços aceitam só certos símbolos ou limitam o tamanho, e nesse caso basta ajustar as opções.',
      'Use uma senha diferente para cada serviço e guarde-as em um gerenciador de senhas. Uma senha forte não protege contra phishing nem contra vazamento do próprio serviço, e para contas importantes vale ativar a verificação em duas etapas.',
    ],
    list: [
      'Criar uma senha forte para e-mail e banco digital.',
      'Gerar credenciais para sistemas internos da empresa.',
      'Definir senhas de teste para ambientes de QA e staging.',
      'Adaptar a senha às regras do serviço, desmarcando símbolos ou outros tipos.',
    ],
  },
  {
    title: 'Privacidade e limites',
    paragraphs: [
      'A senha é gerada no navegador, não é enviada ao servidor do site e não fica guardada: ao recarregar a página, ela desaparece. Depois de copiar, o texto permanece na área de transferência até você copiar outra coisa, e alguns sistemas guardam um histórico dela.',
      'A ferramenta gera uma senha por vez e não gera frases-senha (passphrases). Anote a senha ou salve-a em um gerenciador antes de fechar a página.',
    ],
  },
];

export const passwordGeneratorFaq: FaqItem[] = [
  {
    question: 'A senha é gerada de forma segura?',
    answer:
      'Sim. Os caracteres são sorteados com o gerador aleatório criptográfico do navegador, não com Math.random. Se o navegador não tiver esse recurso, a ferramenta usa um sorteio comum, o que é raro nos navegadores atuais.',
  },
  {
    question: 'Posso escolher quais caracteres entram na senha?',
    answer:
      'Sim. Você ativa ou desativa letras maiúsculas, minúsculas, números e símbolos. É preciso manter ao menos um tipo marcado.',
  },
  {
    question: 'Qual o tamanho ideal da senha?',
    answer:
      'Com os quatro tipos de caracteres, 12 caracteres dão cerca de 78 bits e 16 caracteres, cerca de 104 bits. Para contas importantes, prefira 16 ou mais, com uma senha diferente em cada serviço.',
  },
  {
    question: 'Existe limite de tamanho?',
    answer:
      'O slider vai de 1 a 200. O campo numérico não tem limite fixo, mas em valores muito altos a geração pode demorar, conforme o dispositivo.',
  },
  {
    question: 'A senha é enviada ou guardada em algum lugar?',
    answer:
      'Não. Ela é gerada no navegador e não é enviada ao servidor nem salva. Ao recarregar a página, ela some, e depois de copiar ela fica na área de transferência.',
  },
];
