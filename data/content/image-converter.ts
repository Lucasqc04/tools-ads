import type { ContentBlock, FaqItem } from '@/types/content';

export const imageConverterIntro =
  'Converta arquivos entre mais de 20 formatos de imagem e PDF direto no navegador, grátis, sem cadastro, sem login e com download rápido em desktop e mobile.';

export const imageConverterContentBlocks: ContentBlock[] = [
  {
    title: 'Como funciona o conversor de imagem e PDF',
    paragraphs: [
      'A ferramenta foi criada para cenários reais de produção em que você precisa mudar formato com rapidez: publicar imagem otimizada para web, preparar arquivo para impressão, gerar PDF de um arquivo visual ou extrair páginas de PDF como imagens para revisão e edição.',
      'Todo processamento acontece localmente no navegador. Isso significa menor latência, mais controle sobre o arquivo e menos risco de exposição de conteúdo sensível em upload para terceiros.',
    ],
  },
  {
    title: 'Conversões para mais de 20 formatos',
    paragraphs: [
      'Você pode converter rapidamente entre formatos populares e profissionais como PNG, JPEG, WEBP, AVIF, BMP, TIFF, ICO, GIF, SVG, HEIC, HEIF, TGA, DDS, HDR, EXR, PSD, RAW, CR2, NEF, ARW e PDF.',
      'A interface foi pensada para reduzir passos: escolha o arquivo, ajuste opções quando necessário e baixe o resultado em segundos.',
    ],
    list: [
      'PNG para JPEG para reduzir peso em imagens sem transparência.',
      'JPEG para WEBP para melhorar desempenho em páginas web.',
      'HEIC para JPEG para compatibilidade ampla em sites e sistemas.',
      'TIFF para PNG para manter qualidade em arte e assets de design.',
      'Imagem para PDF para envio de documentos e anexos.',
      'PDF para imagem com 1 arquivo de imagem gerado por página do PDF.',
    ],
  },
  {
    title: 'Boas práticas para preservar qualidade e performance',
    paragraphs: [
      'Formatos com compressão com perdas (JPEG e WEBP) permitem ajustar qualidade. Em geral, valores entre 80% e 92% equilibram bem nitidez e tamanho final para uso web.',
      'Na conversão de PDF para imagem, cada página gera uma imagem separada. Em arquivos longos, limitar páginas por lote melhora a experiência em celular e evita travamentos em dispositivos de menor memória.',
    ],
  },
];

export const imageConverterFaq: FaqItem[] = [
  {
    question: 'Esse conversor é gratuito?',
    answer:
      'Sim. O uso é gratuito e sem necessidade de conta para converter entre formatos de imagem e PDF.',
  },
  {
    question: 'Meus arquivos são enviados para servidor?',
    answer:
      'Não. O processamento ocorre localmente no navegador por padrão, sem upload automático para backend.',
  },
  {
    question: 'Consigo converter PDF para imagem e imagem para PDF?',
    answer:
      'Sim. A ferramenta suporta os dois fluxos, incluindo extração de páginas de PDF como imagens (1 imagem por página) e geração de PDF a partir de imagem.',
  },
  {
    question: 'Qual formato escolher para web?',
    answer:
      'Para web, WEBP e JPEG costumam entregar boa relação entre qualidade e tamanho. PNG é indicado quando você precisa preservar transparência.',
  },
  {
    question: 'Funciona no celular?',
    answer:
      'Sim. A interface foi desenhada para telas pequenas, sem scroll horizontal e com ações principais acessíveis em mobile.',
  },
];
