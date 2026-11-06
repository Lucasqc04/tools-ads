import type { ContentBlock, FaqItem } from '@/types/content';

export const jsonFormatterIntro =
  'Formate, minifique e valide JSON no navegador com feedback de erro amigável e cópia rápida do resultado.';

export const jsonFormatterContentBlocks: ContentBlock[] = [
  {
    title: 'O que a ferramenta faz com o seu JSON',
    paragraphs: [
      'Cole um JSON e escolha uma ação. "Formatar" reescreve o conteúdo com indentação de 2 espaços e uma propriedade por linha, o que facilita a leitura de respostas de API, arquivos de configuração e logs. "Minificar" remove espaços e quebras de linha para gerar uma linha compacta. Nas duas ações o JSON é validado antes: se houver erro de sintaxe, nada é alterado e a mensagem de erro aparece abaixo do campo.',
      'O resultado também substitui o texto do campo de entrada, então você pode alternar entre formatar e minificar quantas vezes quiser. O botão "Copiar resultado" copia o resultado gerado.',
      'Exemplo: ao colar {"nome":"Ana","ativo":true,"tags":["a","b"]} e clicar em "Formatar", cada propriedade vai para uma linha e os itens de "tags" ficam um por linha. Clicar em "Minificar" devolve tudo em uma linha, sem espaços.',
    ],
  },
  {
    title: 'JSON dentro de texto e erros comuns',
    paragraphs: [
      'Se o conteúdo inteiro não for um JSON válido, mas houver trechos entre chaves {} ou colchetes [] que sejam JSON válido (como uma linha de log com um payload no meio), a ferramenta formata esses trechos e mantém o texto ao redor.',
      'Os erros mais comuns são vírgula sobrando no final de uma lista ou objeto, aspas simples no lugar de aspas duplas, nomes de propriedade sem aspas e comentários, que o formato JSON não aceita. A mensagem de erro vem do próprio navegador, geralmente em inglês, e indica a posição do problema.',
    ],
    list: [
      'Validar um payload antes de enviar para uma API.',
      'Formatar uma resposta para depurar ou documentar.',
      'Minificar um JSON para colar em um teste ou em uma variável de ambiente.',
    ],
  },
  {
    title: 'Privacidade e limites',
    paragraphs: [
      'O processamento acontece no navegador e o texto colado não é enviado ao nosso servidor.',
      'A leitura segue o padrão do JavaScript, então números inteiros maiores que 9.007.199.254.740.991 perdem precisão, propriedades repetidas mantêm só o último valor e chaves numéricas podem mudar de ordem. Se esses detalhes importam, confira o resultado. Arquivos muito grandes dependem da memória do aparelho, e a ferramenta não aceita JSON5 nem JSON com comentários.',
    ],
  },
];

export const jsonFormatterFaq: FaqItem[] = [
  {
    question: 'A ferramenta valida JSON inválido?',
    answer:
      'Sim. Ao formatar ou minificar, o texto é validado. Se houver erro de sintaxe, a mensagem aparece abaixo do campo e o conteúdo não é alterado.',
  },
  {
    question: 'Posso minificar e formatar no mesmo lugar?',
    answer:
      'Sim. O resultado volta para o campo de entrada, então você alterna entre "Formatar" e "Minificar" sem colar de novo.',
  },
  {
    question: 'O conteúdo é enviado para servidor?',
    answer:
      'Não. A validação e a formatação são feitas no navegador e o JSON não sai do seu aparelho.',
  },
  {
    question: 'Qual indentação é usada ao formatar?',
    answer:
      'Dois espaços por nível. A ferramenta não tem opção para trocar por tabulação nem para ordenar as chaves.',
  },
];
