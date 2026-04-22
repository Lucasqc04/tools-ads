import type { ContentBlock, FaqItem } from '@/types/content';

export const invisibleCharacterIntro =
  'Copie e gere caractere invisivel para Free Fire, COD Mobile, Discord e dezenas de outras plataformas, com teste de combinacoes Unicode e detector de texto oculto.';

export const invisibleCharacterContentBlocks: ContentBlock[] = [
  {
    title: 'Como usar caractere invisivel em jogos e redes sociais',
    paragraphs: [
      'Esta ferramenta foi feita para quem busca nome invisivel, espaco invisivel e letra invisivel para jogos online e redes sociais sem depender de geradores limitados. Voce escolhe a plataforma, copia padroes prontos e testa variacoes com 2, 3 e 4 caracteres.',
      'O objetivo e reduzir tentativa e erro, porque cada validador possui regras diferentes. Um jogo pode bloquear 1 caractere e aceitar sequencias maiores com combinacoes de Hangul Filler e zero-width.',
    ],
  },
  {
    title: 'Lista real de caracteres invisiveis e combinacoes praticas',
    paragraphs: [
      'A base inclui caracteres invisiveis de uso comum em comunidades gamer: U+3164 (Hangul Filler), U+2800 (Braille Blank), U+200B, U+200C, U+200D, U+2060 e U+FEFF, alem de espacos especiais que podem funcionar em alguns contextos.',
      'Tambem oferecemos combinacoes prontas para melhorar compatibilidade em validadores mais rigidos, incluindo padroes hibridos e variacoes semi-invisiveis.',
    ],
    list: [
      'Copiar invisivel unico para testes rapidos.',
      'Gerar nome invisivel com 2, 3 e 4 caracteres.',
      'Trocar combinacao com um clique para bypass de filtros.',
      'Analisar texto colado com detector de Unicode invisivel.',
    ],
  },
  {
    title: 'SEO por plataforma e pagina dedicada por jogo',
    paragraphs: [
      'A ferramenta possui pagina principal e paginas dedicadas por plataforma para buscas como caractere invisivel free fire, nome invisivel cod mobile, nick invisivel discord e variacoes internacionais.',
      'Cada pagina especifica adiciona contexto, recomendacao inicial e aviso de compatibilidade, evitando conteudo raso e melhorando cobertura long-tail para Google.',
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
    question: 'Qual caractere invisivel funciona melhor em jogos?',
    answer:
      'Os mais usados sao Hangul Filler (U+3164) e combinacoes com zero-width. Em muitos casos, 2 ou mais caracteres funcionam melhor que apenas 1.',
  },
  {
    question: 'Essa ferramenta e gratis?',
    answer:
      'Sim. Voce pode copiar e gerar nome invisivel gratuitamente, sem cadastro obrigatorio.',
  },
  {
    question: 'Free Fire, COD Mobile e Discord aceitam nome invisivel?',
    answer:
      'Podem aceitar, mas depende da validacao atual de cada plataforma. Por isso a ferramenta oferece multiplos padroes para teste rapido.',
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
