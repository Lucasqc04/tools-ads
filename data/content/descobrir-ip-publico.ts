import type { ContentBlock, FaqItem } from '@/types/content';

export const descobrirIpPublicoIntro =
  'Descubra o seu endereço IP público, o provedor de internet (ISP) estimado, a localização aproximada e o navegador e o sistema que você está usando.';

export const descobrirIpPublicoContentBlocks: ContentBlock[] = [
  {
    title: 'O que esta ferramenta mostra',
    paragraphs: [
      'Ao abrir a página, a ferramenta consulta um serviço público de informações de IP e exibe o endereço IP público da sua conexão, o provedor (ISP), a cidade, a região e o país estimados. Você pode refazer a consulta a qualquer momento com o botão "Descobrir meu IP".',
      'Também aparecem o tipo de dispositivo (celular, tablet ou computador), o navegador e o sistema operacional. Esses dados são lidos do próprio navegador (User-Agent) e não dependem da consulta externa.',
    ],
  },
  {
    title: 'Quando usar',
    paragraphs: [
      'Use quando precisar saber qual IP os serviços externos enxergam na sua conexão: ao liberar o acesso em um firewall, configurar uma lista de IPs permitidos, confirmar se uma VPN está ativa ou passar a informação ao suporte do provedor.',
    ],
    list: [
      'Conferir o IP antes de cadastrá-lo em um painel, servidor ou banco de dados.',
      'Verificar se a VPN ou o proxy trocou o IP e o provedor exibidos.',
      'Ver qual ISP aparece para serviços remotos.',
      'Copiar IP, provedor e localização de uma vez para abrir um chamado.',
    ],
  },
  {
    title: 'Como a consulta é feita',
    paragraphs: [
      'A consulta sai diretamente do seu navegador, sem passar por uma API deste site. A ferramenta tenta os serviços ipwho.is, ipapi.co e ipwhois.app, nessa ordem, e, se todos falharem, usa o api.ipify.org, que devolve apenas o IP (provedor e localização ficam em branco).',
      'Como em qualquer consulta de IP, o serviço externo recebe o seu IP para respondê-la e trata esse dado conforme a própria política. O site não grava o resultado, mas não controla o que esses serviços registram.',
    ],
  },
  {
    title: 'Limites e como ler o resultado',
    paragraphs: [
      'A localização é uma estimativa feita a partir do IP e costuma apontar para a região do provedor, não para o seu endereço. Não use esse dado para decisões legais, de segurança ou que exijam precisão.',
      'Se você usa VPN, proxy ou rede corporativa, o IP exibido é o da saída dessa rede. Em redes com NAT, vários dispositivos compartilham o mesmo IP público. Se os serviços não responderem em 7 segundos cada, ou atingirem limite de uso, a ferramenta mostra uma mensagem de erro e você pode tentar de novo.',
    ],
  },
  {
    title: 'Como copiar o IP',
    paragraphs: [
      'O botão "Copiar" leva o IP como aparece. "Copiar (sem pontos)" remove os pontos: 203.0.113.45 vira 203011345. "Copiar tudo" leva IP, provedor e localização em texto simples.',
    ],
  },
];

export const descobrirIpPublicoFaq: FaqItem[] = [
  {
    question: 'O que significa IP público?',
    answer:
      'É o endereço que identifica a sua conexão para os serviços da internet. Em casa ou no trabalho, vários dispositivos costumam compartilhar o mesmo IP público por causa do roteador (NAT).',
  },
  {
    question: 'A consulta passa pelo servidor deste site?',
    answer:
      'Não. O navegador chama diretamente serviços públicos de IP (ipwho.is, ipapi.co, ipwhois.app e, como reserva, api.ipify.org). Esses serviços recebem o seu IP e têm suas próprias políticas de privacidade.',
  },
  {
    question: 'A localização é precisa?',
    answer:
      'Não. Ela é estimada pelo IP e geralmente indica a cidade ou a região do provedor, podendo estar errada. Com VPN ou proxy, mostra o local da saída da rede.',
  },
  {
    question: 'Por que o provedor ou a localização aparecem em branco?',
    answer:
      'Isso acontece quando só o serviço de reserva responde, pois ele informa apenas o IP. Tente "Descobrir meu IP" de novo daqui a pouco.',
  },
  {
    question: 'Para que serve copiar o IP sem pontos?',
    answer:
      'Para campos ou scripts que aceitam só os dígitos. O botão apenas remove os pontos, por exemplo 203.0.113.45 vira 203011345. Em IPv6 os dois-pontos permanecem.',
  },
];
