import type { ContentBlock, FaqItem } from '@/types/content';

export const openGraphPreviewIntro =
  'Visualize como seu link aparece em redes sociais, gere meta tags Open Graph e Twitter Card e valide campos essenciais antes de publicar.';

export const openGraphPreviewContentBlocks: ContentBlock[] = [
  {
    title: 'Preview de link para redes sociais e mensageria',
    paragraphs: [
      'A ferramenta simula a aparencia de links compartilhados em Facebook, LinkedIn, WhatsApp, X e Discord. Assim, voce consegue ajustar titulo, descricao, imagem e URL antes de divulgar a pagina.',
      'Com essa validacao previa, fica mais facil reduzir problemas de clique, previews quebrados e cards sem imagem.',
    ],
  },
  {
    title: 'Auditoria completa por URL via backend',
    paragraphs: [
      'A pagina usa rota backend no Next.js para buscar o HTML real da URL e extrair metadados com menos limitacao de CORS do navegador.',
      'Depois de validar os dados, voce pode copiar meta tags HTML e o objeto metadata do Next.js para aplicar diretamente no projeto.',
    ],
    list: [
      'Preview visual por plataforma com foco em titulo e descricao.',
      'Diagnostico de tags obrigatorias ausentes ou incompletas.',
      'Coleta de icones, manifest, canonical, alternates e hreflang.',
      'Leitura de app links, verificacoes e metatags tecnicas.',
      'Gerador de meta tags Open Graph e Twitter Card.',
      'Gerador de snippet para metadata do Next.js.',
    ],
  },
  {
    title: 'Privacidade, limites e boas praticas',
    paragraphs: [
      'A auditoria consulta apenas a URL informada via backend para retornar os metadados encontrados no HTML e headers de resposta.',
      'Mesmo com tags corretas, algumas redes sociais usam cache proprio de preview. Por isso, atualizacoes podem demorar para refletir apos a publicacao.',
    ],
  },
];

export const openGraphPreviewFaq: FaqItem[] = [
  {
    question: 'O que e Open Graph?',
    answer:
      'Open Graph e um padrao de meta tags usado para definir como links aparecem quando compartilhados em plataformas sociais.',
  },
  {
    question: 'Por que meu link aparece sem imagem no WhatsApp?',
    answer:
      'Geralmente por falta de og:image valida, imagem inacessivel, URL sem HTTPS ou cache antigo da plataforma.',
  },
  {
    question: 'A ferramenta consegue buscar tags automaticamente de uma URL?',
    answer:
      'Sim. A coleta e feita por rota backend no Next.js para reduzir limitacoes de CORS e ampliar a auditoria tecnica.',
  },
  {
    question: 'Posso gerar metadata para Next.js?',
    answer:
      'Sim. A ferramenta gera um snippet pronto com openGraph, twitter e canonical.',
  },
  {
    question: 'Qual tamanho de imagem e recomendado para preview?',
    answer:
      'Um padrao comum e 1200x630 com URL absoluta HTTPS para melhor compatibilidade entre plataformas.',
  },
];
