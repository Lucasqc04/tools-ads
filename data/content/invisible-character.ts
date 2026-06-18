import type { ContentBlock, FaqItem } from '@/types/content';

export const invisibleCharacterIntro =
  'Copie caractere invisivel para Fortnite, Free Fire, COD Mobile, Discord e outras plataformas, com gerador de nickname, 20 variantes prontas e detector Unicode.';

export const invisibleCharacterContentBlocks: ContentBlock[] = [
  {
    title: 'Como usar caractere invisivel no Fortnite e em outros jogos',
    paragraphs: [
      'Esta ferramenta foi reforçada para quem procura caractere invisivel para Fortnite, nome invisivel e espaco invisivel sem depender de listas estáticas. Você escolhe a plataforma, copia o padrão recomendado e pode inserir o invisível antes, depois, entre letras ou em volta do nickname.',
      'O objetivo é reduzir tentativa e erro, porque cada validador possui regras diferentes. No Fortnite e em outros jogos, um único caractere pode ser bloqueado, enquanto combinações de 2, 3 ou 4 caracteres Unicode podem passar em alguns cenários.',
    ],
  },
  {
    title: 'Gerador de nickname e 20 variantes prontas',
    paragraphs: [
      'Além do botão de copiar invisível, o gerador permite digitar um nickname base e criar variações com posições diferentes. A lista de 20 variantes prontas combina tamanhos e padrões para você testar rapidamente no campo de nome do jogo.',
      'Esse formato é melhor que entregar apenas um caractere vazio, porque dá alternativas imediatas quando a plataforma normaliza espaços, remove zero-width ou exige tamanho mínimo.',
    ],
    list: [
      'Copiar invisível único para testes rápidos.',
      'Gerar nickname com invisível antes, depois, entre letras ou em volta.',
      'Copiar 20 variantes prontas para Fortnite e outros jogos.',
      'Trocar combinação Unicode com um clique quando uma opção falhar.',
    ],
  },
  {
    title: 'Matriz Unicode, detector e removedor de invisíveis',
    paragraphs: [
      'A base inclui caracteres invisíveis usados em comunidades gamer: U+3164 (Hangul Filler), U+2800 (Braille Blank), U+200B, U+200C, U+200D, U+2060 e U+FEFF, além de espaços especiais que podem funcionar em alguns contextos.',
      'O detector permite colar qualquer nickname para ver quantos caracteres invisíveis existem, quais pontos Unicode foram encontrados e qual seria a versão limpa sem caracteres ocultos.',
    ],
  },
  {
    title: 'Privacidade, limite de validacao e boas praticas',
    paragraphs: [
      'Geracao e deteccao de caracteres acontecem no navegador, sem upload obrigatorio para servidor. Isso ajuda em velocidade e privacidade no uso diario.',
      'Nenhum padrao garante 100% de aprovacao, porque as plataformas mudam filtros com atualizacoes. Use as combinacoes da ferramenta, valide no ambiente real e ajuste ate encontrar o formato aceito.',
    ],
  },
];

export const invisibleCharacterFaq: FaqItem[] = [
  {
    question: 'Qual caractere invisivel funciona melhor no Fortnite?',
    answer:
      'Não existe garantia fixa, mas combinações com zero-width, Hangul Filler (U+3164) e Braille Blank (U+2800) são boas primeiras opções. Teste as variantes de 2 a 4 caracteres.',
  },
  {
    question: 'Posso gerar várias variações de nickname invisível?',
    answer:
      'Sim. Digite um nickname base e use a lista de 20 variantes prontas para copiar opções com invisível antes, depois, entre letras ou em volta do nome.',
  },
  {
    question: 'Free Fire, COD Mobile, Fortnite e Discord aceitam nome invisivel?',
    answer:
      'Podem aceitar em alguns casos, mas depende da validação atual de cada plataforma. Por isso a ferramenta oferece múltiplos padrões para teste rápido.',
  },
  {
    question: 'Como saber se meu texto tem caractere invisivel?',
    answer:
      'Use o detector da propria pagina. Ele lista os pontos Unicode detectados no texto colado e ajuda na auditoria do nome.',
  },
  {
    question: 'Os dados sao enviados para servidor?',
    answer:
      'Nao por padrao. O processamento acontece localmente no navegador.',
  },
];
