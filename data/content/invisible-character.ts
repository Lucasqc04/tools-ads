import type { ContentBlock, FaqItem } from '@/types/content';

export const invisibleCharacterIntro =
  'Copie caractere invisível para Fortnite, Free Fire, COD Mobile, Discord e outras plataformas, com gerador de nickname, 20 variantes prontas e detector Unicode.';

export const invisibleCharacterContentBlocks: ContentBlock[] = [
  {
    title: 'Como usar o caractere invisível no Fortnite e em outros jogos',
    paragraphs: [
      'Escolha a plataforma e copie o padrão recomendado para ela. Se quiser montar um nickname, digite o nome base e defina onde o invisível entra: antes, depois, entre as letras, em volta do nome ou sozinho. O botão de copiar entrega o texto pronto para colar no campo de nome.',
      'Cada jogo ou rede social valida nomes de um jeito, e o resultado pode mudar por região, versão do app e tipo de conta. Por isso a ferramenta oferece combinações de 2, 3 ou 4 caracteres Unicode, em vez de um único caractere vazio.',
    ],
  },
  {
    title: 'Gerador de nickname e 20 variantes prontas',
    paragraphs: [
      'As 20 variantes prontas vêm de 4 combinações invisíveis cruzadas com 5 posições (sozinho, antes, depois, entre as letras e em volta). Se o seu nickname base estiver vazio, a ferramenta usa o nome da plataforma escolhida como exemplo.',
      'Exemplo: para o Free Fire, o padrão recomendado é o "Hangul x2", que repete duas vezes o caractere U+3164. Com o nome "Ana" e a posição "depois", o resultado é "Ana" seguido desses dois caracteres, que não aparecem na tela. O campo de repetições aceita de 1 a 12 vezes.',
    ],
    list: [
      'Copiar só o invisível, para testes rápidos.',
      'Gerar o nickname com o invisível antes, depois, entre as letras ou em volta.',
      'Copiar uma das 20 variantes quando a primeira for recusada.',
      'Ver a sequência Unicode do resultado antes de colar.',
    ],
  },
  {
    title: 'Caracteres incluídos, detector e removedor',
    paragraphs: [
      'A lista tem 13 caracteres. Sete são invisíveis de verdade: U+3164 (Hangul Filler), U+2800 (Braille Blank), U+200B, U+200C, U+200D, U+2060 e U+FEFF. Os outros seis são espaços especiais, como o espaço sem quebra (U+00A0), que ocupam largura e podem ser filtrados com mais facilidade.',
      'O detector permite colar um nickname para ver quantos caracteres invisíveis ele tem, em que posição estão, qual é o ponto Unicode de cada um e qual seria a versão limpa. Caracteres invisíveis fora da lista aparecem como "não catalogado".',
    ],
  },
  {
    title: 'Limites e privacidade',
    paragraphs: [
      'Nenhum padrão garante aprovação. As plataformas mudam filtros com atualizações, alguns jogos removem ou normalizam caracteres invisíveis, e o nome pode aparecer em branco ou diferente conforme a fonte. As indicações de compatibilidade da ferramenta são orientações de teste, não garantias: valide no campo de nome real antes de confirmar.',
      'A geração e a detecção acontecem no seu navegador. O texto digitado ou colado não é enviado para um servidor nem salvo pela ferramenta. Use nomes invisíveis com bom senso e respeite as regras de cada plataforma.',
    ],
  },
];

export const invisibleCharacterFaq: FaqItem[] = [
  {
    question: 'Qual caractere invisível funciona melhor no Fortnite?',
    answer:
      'Não existe garantia fixa. Combinações com Hangul Filler (U+3164), Braille Blank (U+2800) e zero-width são boas primeiras opções. Teste as variantes de 2 a 4 caracteres e valide no campo de nome do jogo.',
  },
  {
    question: 'Posso gerar várias variações de nickname invisível?',
    answer:
      'Sim. Digite um nickname base e use a lista de 20 variantes prontas para copiar opções com o invisível antes, depois, entre as letras, em volta do nome ou sozinho.',
  },
  {
    question: 'Free Fire, COD Mobile, Fortnite e Discord aceitam nome invisível?',
    answer:
      'Podem aceitar em alguns casos, mas isso depende da validação atual de cada plataforma, da região e da conta. Por isso a ferramenta oferece vários padrões para você testar.',
  },
  {
    question: 'Como saber se meu texto tem caractere invisível?',
    answer:
      'Cole o texto no detector da página. Ele lista cada caractere invisível encontrado, com posição e ponto Unicode, e mostra o texto limpo para copiar.',
  },
  {
    question: 'Os dados são enviados para servidor?',
    answer:
      'Não. A geração e a detecção acontecem no seu navegador, e a ferramenta não salva o que você digita.',
  },
];
