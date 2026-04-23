import type { ContentBlock, FaqItem } from '@/types/content';

export const sorteadorIntro =
  'Sorteie nomes, numeros e listas completas com parsing inteligente, roleta visual, multiplos resultados e compartilhamento por link.';

export const sorteadorContentBlocks: ContentBlock[] = [
  {
    title: 'Sorteador online completo para nomes, numeros e roleta',
    paragraphs: [
      'Esta ferramenta foi desenhada para funcionar como hub de sorteio. Voce pode colar qualquer lista, detectar separadores automaticamente e rodar sorteios com ou sem repeticao.',
      'A interface tambem cobre casos comuns como sorteio de nomes para dinamicas, sorteio de numeros para rifas e embaralhamento completo para definir ordem aleatoria.',
    ],
  },
  {
    title: 'Parsing inteligente e configuracoes de sorteio',
    paragraphs: [
      'A lista aceita multiplos formatos: virgula, quebra de linha, espaco, tab, ponto, pipe, barra e ponto e virgula. Isso reduz friccao quando voce copia dados de planilha, chat ou bloco de notas.',
      'Antes do sorteio, voce pode limpar a lista removendo duplicados, espacos extras e itens vazios. Tambem existe suporte a pesos para dar chances diferentes a cada item.',
    ],
    list: [
      'Sortear 1 ou varios resultados com controle de quantidade.',
      'Definir suspense de 0, 3, 5 ou 10 segundos.',
      'Ativar roleta visual com animacao.',
      'Evitar repetir nomes ja sorteados.',
      'Rodar simulacao de 1000 sorteios para validar distribuicao.',
    ],
  },
  {
    title: 'Transparencia, privacidade e compartilhamento',
    paragraphs: [
      'O sorteio utiliza aleatoriedade local do navegador com crypto.getRandomValues e mostra seed de referencia junto ao algoritmo aplicado.',
      'Por padrao, o processamento acontece localmente no dispositivo. Voce ainda pode copiar resultado, baixar CSV e compartilhar o setup via URL para auditoria rapida.',
    ],
  },
];

export const sorteadorFaq: FaqItem[] = [
  {
    question: 'Como sortear nomes online sem repetir?',
    answer:
      'Cole a lista, escolha o modo sem repeticao e defina a quantidade de resultados. A ferramenta remove os sorteados da pool da rodada.',
  },
  {
    question: 'Posso sortear numeros aleatorios tambem?',
    answer:
      'Sim. Quando a lista possui apenas numeros, o modo numerico aparece e voce pode gerar intervalo automatico para sorteio.',
  },
  {
    question: 'O sorteio e realmente aleatorio?',
    answer:
      'A selecao usa aleatoriedade local com crypto.getRandomValues e exibicao de seed/algoritmo para transparencia do processo.',
  },
  {
    question: 'Consigo compartilhar a configuracao do sorteio?',
    answer:
      'Sim. O botao de link compartilhavel gera URL com parametros como itens, quantidade, modo e tempo de suspense.',
  },
  {
    question: 'Os dados da lista vao para o servidor?',
    answer:
      'Nao por padrao. A lista e processada localmente no navegador.',
  },
];
