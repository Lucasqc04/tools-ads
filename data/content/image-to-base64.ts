import type { ContentBlock, FaqItem } from '@/types/content';

export const imageToBase64Intro =
  'Envie imagem e gere Base64 automaticamente com preview e copia em um clique.';

export const imageToBase64ContentBlocks: ContentBlock[] = [
  {
    title: 'Gerador de Base64 a partir de imagem para APIs e integracoes',
    paragraphs: [
      'Esta ferramenta faz o caminho inverso do leitor: voce envia a imagem e recebe o Base64 pronto para uso em payloads, front-end e configuracoes tecnicas.',
      'Tambem e possivel escolher o formato da imagem antes da codificacao para ajustar compatibilidade com sistemas que exigem tipos especificos.',
    ],
  },
  {
    title: 'Casos de uso comuns no dia a dia',
    paragraphs: [
      'Times de produto e desenvolvimento usam Base64 para enviar imagens sem arquivo separado, montar exemplos de API e criar prototipos rapidos.',
      'Com modo de saida em data URL completo ou somente Base64, voce adapta o resultado para diferentes cenarios sem retrabalho.',
    ],
    list: [
      'Gerar Base64 para payload de API.',
      'Criar data URL para uso direto em HTML/CSS.',
      'Copiar e colar Base64 em ferramentas de teste.',
      'Baixar resultado em .txt para compartilhar com equipe.',
    ],
  },
  {
    title: 'Privacidade e desempenho',
    paragraphs: [
      'A conversao da imagem para Base64 ocorre localmente no navegador, sem envio obrigatorio do arquivo para servidor.',
      'Arquivos grandes podem gerar texto Base64 extenso. Nesses casos, o tamanho final depende de resolucao, formato e qualidade da imagem.',
    ],
  },
];

export const imageToBase64Faq: FaqItem[] = [
  {
    question: 'A imagem enviada sobe para servidor?',
    answer:
      'Nao por padrao. O processamento e local no navegador durante a conversao para Base64.',
  },
  {
    question: 'Posso copiar o Base64 com um clique?',
    answer:
      'Sim. A ferramenta tem botao de copia para levar o resultado direto para a area de transferencia.',
  },
  {
    question: 'Consigo escolher entre data URL e Base64 puro?',
    answer:
      'Sim. Voce pode alternar entre os dois modos de saida conforme a necessidade da integracao.',
  },
  {
    question: 'Posso mudar o formato da imagem antes de gerar Base64?',
    answer:
      'Sim. Ha opcoes de formato de saida para codificar a imagem no padrao desejado.',
  },
  {
    question: 'A ferramenta funciona no celular?',
    answer:
      'Sim. A interface e responsiva e permite upload, preview e copia em dispositivos moveis.',
  },
];
