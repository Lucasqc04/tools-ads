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
    title: 'Dois modos de uso: manual e busca por URL via BFF',
    paragraphs: [
      'No modo manual, voce preenche os campos e gera previews sem depender de acesso externo. No modo de busca por URL, a pagina usa uma rota BFF do Next.js para consultar HTML e extrair tags com menos limitacao de CORS.',
      'Depois de validar os dados, voce pode copiar meta tags HTML e o objeto metadata do Next.js para aplicar diretamente no projeto.',
    ],
    list: [
      'Preview visual por plataforma com foco em titulo e descricao.',
      'Diagnostico de tags obrigatorias ausentes ou incompletas.',
      'Gerador de meta tags Open Graph e Twitter Card.',
      'Gerador de snippet para metadata do Next.js.',
      'Upload local de imagem para testar card manualmente.',
    ],
  },
  {
    title: 'Privacidade, limites e boas praticas',
    paragraphs: [
      'No modo manual, os dados ficam no navegador por padrao. No modo buscar por URL, apenas a URL informada e consultada pela rota BFF para retorno das tags.',
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
      'Sim. Existe modo de busca via rota BFF no Next.js para reduzir limitacoes de CORS do navegador.',
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
