import type { ContentBlock, FaqItem } from '@/types/content';

export const sorteadorIntro =
  'Cole uma lista e sorteie nomes, números ou equipes online, com roleta, contagem regressiva, resultado em CSV e link para compartilhar a configuração.';

export const sorteadorContentBlocks: ContentBlock[] = [
  {
    title: 'Três formas de sortear em uma só página',
    paragraphs: [
      'A aba Nomes sorteia itens de qualquer lista: cole os participantes, informe quantos quer sortear e clique em "Sortear agora". Cada item sorteado sai da rodada, então o mesmo nome não aparece duas vezes no mesmo resultado. A aba Números sorteia dentro de um intervalo, como 1 a 100 para uma rifa. A aba Equipes embaralha a lista e a divide em quantas equipes ou grupos você escolher.',
      'Exemplo: com a lista "Ana, Bruno, Carla, Diego, Elisa, Fábio" e 2 equipes, os participantes são embaralhados e distribuídos um a um entre as equipes, que ficam com 3 pessoas cada.',
    ],
  },
  {
    title: 'Como a lista é lida',
    paragraphs: [
      'Cada linha, ou cada trecho separado por vírgula, ponto e vírgula, barra vertical (|), tab, barra (/), ponto ou espaço, vira um item. A opção "Detectar automaticamente" procura os separadores nessa ordem: quebra de linha, vírgula, ponto e vírgula, barra vertical, tab, barra, ponto e, por último, espaço.',
      'Se seus itens têm mais de uma palavra, como "Maria Silva", use uma linha para cada item ou separe por vírgula. Com o separador de espaço, cada palavra vira um item, e com o ponto, abreviações como "Dr. Silva" são cortadas.',
    ],
    list: [
      'Remover itens repetidos da lista; espaços extras e linhas vazias são ignorados automaticamente.',
      'Não sortear itens que já saíram em rodadas anteriores desta sessão.',
      'Embaralhar a lista antes de sortear e ordenar os resultados.',
      'Contagem regressiva de 3, 5, 10, 15, 30 ou 60 segundos, e roleta visual com até 12 itens da lista.',
      'Aplicar pesos: com a opção de remover repetidos ligada, um nome que aparece mais vezes na lista ganha mais chances.',
    ],
  },
  {
    title: 'Como o resultado é gerado e como compartilhar',
    paragraphs: [
      'O sorteio usa o gerador de números aleatórios do navegador (crypto.getRandomValues) com seleção sem viés. A tela de resultado mostra um identificador do sorteio e o algoritmo usado. O identificador é só uma referência: ele não permite repetir o mesmo sorteio. O botão "Rodar simulação" faz 1000 sorteios de teste e mostra a distribuição, útil para conferir o efeito dos pesos.',
      'Você pode copiar o resultado, copiar a lista numerada, baixar um CSV com posição e item, ou copiar um link que reabre a página com a lista, a aba, o separador, a quantidade, a roleta, os pesos e a contagem já definidos. O sorteio é feito no navegador e a lista não é enviada ao servidor, mas, ao compartilhar o link, os nomes ficam escritos no endereço. Quem receber o link vê a lista.',
      'Para sorteios com valor legal ou premiação, como promoções, este recurso não substitui regras formais nem o registro do processo. Mostre o resultado em tela ou em gravação para dar transparência aos participantes.',
    ],
  },
];

export const sorteadorFaq: FaqItem[] = [
  {
    question: 'Como sortear nomes online sem repetir?',
    answer:
      'Cole um nome por linha, informe a quantidade de itens e sorteie. Em um mesmo resultado, nenhum item sai duas vezes. Para não repetir o nome em novos sorteios, ligue "Não sortear nomes já sorteados".',
  },
  {
    question: 'Posso sortear números aleatórios?',
    answer:
      'Sim. Na aba Números, informe o valor inicial e o final (por exemplo, de 1 a 100) e a quantidade de números que você quer sortear.',
  },
  {
    question: 'O sorteio é realmente aleatório?',
    answer:
      'Ele usa o gerador aleatório do navegador (crypto.getRandomValues), com seleção sem viés. A tela de resultado mostra o algoritmo usado. A simulação de 1000 sorteios permite conferir a distribuição, mas cada sorteio real é independente.',
  },
  {
    question: 'Posso dividir uma turma em equipes?',
    answer:
      'Sim. Na aba Equipes, cole os participantes, um por linha, escolha o número de equipes ou grupos e sorteie. A lista é embaralhada e distribuída em sequência entre as equipes.',
  },
  {
    question: 'A lista é enviada ao servidor?',
    answer:
      'Não. O sorteio acontece no navegador. A lista só passa a fazer parte de um endereço se você usar "Compartilhar link", pois os nomes vão escritos na URL.',
  },
];
