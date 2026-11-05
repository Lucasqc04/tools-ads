import type { ContentBlock, FaqItem } from '@/types/content';

export const openGraphPreviewIntro =
  'Visualize como seu link aparece em redes sociais, gere meta tags Open Graph e Twitter Card e valide campos essenciais antes de publicar.';

export const openGraphPreviewContentBlocks: ContentBlock[] = [
  {
    title: 'Prévia de links para redes sociais e mensageiros',
    paragraphs: [
      'A ferramenta simula a aparência de links compartilhados no Facebook, LinkedIn, WhatsApp, X e Discord. Você pode conferir título, descrição e imagem antes de divulgar uma página.',
      'A prévia ajuda a encontrar imagens ausentes e informações incompletas antes de compartilhar o link.',
    ],
  },
  {
    title: 'Como a análise por URL funciona',
    paragraphs: [
      'A URL informada é enviada ao servidor do site, que busca a página e lê o HTML e os cabeçalhos da resposta. Isso permite consultar metadados que o navegador pode bloquear por segurança.',
      'Depois de revisar o resultado, você pode copiar as meta tags HTML ou um objeto metadata para Next.js e adaptar ao seu projeto.',
    ],
    list: [
      'Prévia por plataforma com foco em título, descrição e imagem.',
      'Verificação de tags ausentes ou incompletas.',
      'Leitura de ícones, manifest, canonical, alternates e hreflang.',
      'Consulta de app links, verificações e metatags técnicas.',
      'Geração de meta tags Open Graph e Twitter Card.',
      'Geração de exemplo de metadata para Next.js.',
    ],
  },
  {
    title: 'Privacidade, limites e boas práticas',
    paragraphs: [
      'A URL que você informa é enviada ao servidor para consultar a página e seus metadados. Se você copiar ou baixar uma imagem, o servidor também busca o arquivo indicado pela página. Use apenas URLs que você tenha autorização para consultar.',
      'Mesmo com as tags corretas, algumas redes sociais mantêm a prévia em cache. As alterações podem demorar para aparecer depois da publicação.',
    ],
  },
];

export const openGraphPreviewFaq: FaqItem[] = [
  {
    question: 'O que é Open Graph?',
    answer:
      'Open Graph é um padrão de metatags que define como os links aparecem quando são compartilhados em plataformas sociais.',
  },
  {
    question: 'Por que meu link aparece sem imagem no WhatsApp?',
    answer:
      'Isso pode acontecer quando falta uma og:image válida, a imagem não está acessível, a URL não usa HTTPS ou a plataforma ainda mostra uma prévia em cache.',
  },
  {
    question: 'A ferramenta consegue buscar tags automaticamente por URL?',
    answer:
      'Sim. A URL é enviada ao servidor do site, que busca a página e extrai as metatags. Não informe links privados nem URLs que você não tenha autorização para consultar.',
  },
  {
    question: 'Posso gerar metadata para Next.js?',
    answer:
      'Sim. A ferramenta gera um snippet pronto com openGraph, twitter e canonical.',
  },
  {
    question: 'Qual tamanho de imagem é recomendado para a prévia?',
    answer:
      'Uma imagem de 1200 × 630 pixels com URL HTTPS absoluta costuma funcionar bem em diferentes plataformas.',
  },
];
