import { localizePath, type AppLocale } from '@/lib/i18n/config';
import type { ContentBlock, FaqItem } from '@/types/content';
import { imageFormatIds, type ImageFormatId } from '@/types/image-conversion';

type ImageConversionSeed = {
  from: ImageFormatId;
  to: ImageFormatId;
  featured?: boolean;
};

export type ImageSlugVariant = 'technical' | 'ptBr';

export type ImageConversionPage = {
  slug: string;
  path: string;
  slugTechnical: string;
  pathTechnical: string;
  slugPtBr: string;
  pathPtBr: string;
  fromFormatId: ImageFormatId;
  toFormatId: ImageFormatId;
  fromLabel: string;
  toLabel: string;
  title: string;
  intro: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  contentBlocks: ContentBlock[];
  faq: FaqItem[];
  featured: boolean;
};

export type LocalizedImageConversionContent = {
  title: string;
  intro: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  contentBlocks: ContentBlock[];
  faq: FaqItem[];
};

export type ImageConversionLinkItem = {
  slug: string;
  path: string;
  fromLabel: string;
  toLabel: string;
  context: string;
};

const BASE_PATH = '/tools/image-converter';

const FORMAT_LABELS: Record<ImageFormatId, string> = {
  png: 'PNG',
  jpeg: 'JPEG',
  webp: 'WEBP',
  avif: 'AVIF',
  bmp: 'BMP',
  tiff: 'TIFF',
  ico: 'ICO',
  gif: 'GIF',
  svg: 'SVG',
  heic: 'HEIC',
  heif: 'HEIF',
  tga: 'TGA',
  dds: 'DDS',
  hdr: 'HDR',
  exr: 'EXR',
  psd: 'PSD',
  raw: 'RAW',
  cr2: 'CR2',
  nef: 'NEF',
  arw: 'ARW',
  pdf: 'PDF',
};

const featuredConversions = new Set<string>([
  'png->jpeg',
  'jpeg->png',
  'png->webp',
  'webp->png',
  'jpeg->webp',
  'webp->jpeg',
  'png->pdf',
  'jpeg->pdf',
  'webp->pdf',
  'pdf->png',
  'pdf->jpeg',
  'pdf->webp',
  'heic->jpeg',
  'heif->jpeg',
  'tiff->png',
  'svg->png',
  'bmp->webp',
  'gif->png',
  'ico->png',
  'psd->png',
]);

const conversionSeeds: ImageConversionSeed[] = imageFormatIds.flatMap((from) =>
  imageFormatIds
    .filter((to) => to !== from)
    .map((to) => ({
      from,
      to,
      featured: featuredConversions.has(`${from}->${to}`),
    })),
);

const TECHNICAL_FORMAT_ALIASES: Record<ImageFormatId, string[]> = {
  png: ['png'],
  jpeg: ['jpeg', 'jpg'],
  webp: ['webp'],
  avif: ['avif'],
  bmp: ['bmp'],
  tiff: ['tiff', 'tif'],
  ico: ['ico'],
  gif: ['gif'],
  svg: ['svg'],
  heic: ['heic'],
  heif: ['heif'],
  tga: ['tga'],
  dds: ['dds'],
  hdr: ['hdr'],
  exr: ['exr'],
  psd: ['psd'],
  raw: ['raw', 'dng'],
  cr2: ['cr2'],
  nef: ['nef'],
  arw: ['arw'],
  pdf: ['pdf'],
};

const PTBR_FORMAT_ALIASES: Record<string, string[]> = {
  png: ['png'],
  jpeg: ['jpeg', 'jpg'],
  webp: ['webp'],
  avif: ['avif'],
  bmp: ['bmp'],
  tiff: ['tiff', 'tif'],
  ico: ['ico'],
  gif: ['gif'],
  svg: ['svg'],
  heic: ['heic'],
  heif: ['heif'],
  tga: ['tga'],
  dds: ['dds'],
  hdr: ['hdr'],
  exr: ['exr'],
  psd: ['psd'],
  raw: ['raw', 'dng'],
  cr2: ['cr2'],
  nef: ['nef'],
  arw: ['arw'],
  pdf: ['pdf'],
};

const sanitizeSlugToken = (value: string): string =>
  value
    .trim()
    .normalize('NFD')
    .replaceAll(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, '-')
    .replaceAll(/^-+|-+$/g, '');

const toTechnicalSlug = (from: ImageFormatId, to: ImageFormatId): string =>
  `${from}-to-${to}`;

const toPtBrSlug = (fromLabel: string, toLabel: string): string =>
  `${sanitizeSlugToken(fromLabel)}-para-${sanitizeSlugToken(toLabel)}`;

const normalizeTechnicalToken = (token: string): string => {
  const normalized = sanitizeSlugToken(token);
  if (normalized === 'jpg') {
    return 'jpeg';
  }

  return normalized;
};

const normalizePtBrToken = (token: string): string => {
  const normalized = sanitizeSlugToken(token);
  if (normalized === 'jpg') {
    return 'jpeg';
  }

  return normalized;
};

const parseSlugByDelimiter = (
  slug: string,
  delimiter: '-to-' | '-para-',
): { from: string; to: string } | null => {
  const index = slug.indexOf(delimiter);

  if (index <= 0) {
    return null;
  }

  const from = slug.slice(0, index);
  const to = slug.slice(index + delimiter.length);

  if (!from || !to) {
    return null;
  }

  return { from, to };
};

const isPdfFlow = (from: ImageFormatId, to: ImageFormatId): boolean =>
  from === 'pdf' || to === 'pdf';

const buildPtBrContentBlocks = (fromLabel: string, toLabel: string): ContentBlock[] => {
  const pdfFlow = fromLabel === 'PDF' || toLabel === 'PDF';

  return [
    {
      title: `Quando usar ${fromLabel} para ${toLabel}`,
      paragraphs: [
        `A conversão de ${fromLabel} para ${toLabel} é útil quando você precisa adaptar arquivo para um canal específico, como publicação web, envio por e-mail, documentação interna ou integração com plataformas que exigem formato definido.`,
        pdfFlow
          ? 'Neste fluxo envolvendo PDF, você consegue transformar páginas em imagem para edição/recorte ou gerar PDF a partir de imagem para compartilhamento e impressão.'
          : 'Neste fluxo de imagem para imagem, você mantém a mesma informação visual e muda apenas o encapsulamento para equilibrar qualidade, compatibilidade e peso final do arquivo.',
      ],
    },
    {
      title: 'Qualidade, compressão e compatibilidade',
      paragraphs: [
        'JPEG e WEBP podem usar compressão com perdas. Ajustar qualidade é importante para reduzir tamanho sem degradar demais textos, ícones e elementos com alto contraste.',
        'PNG mantém melhor nitidez em artes com transparência e áreas chapadas. Para imagens fotográficas, JPEG e WEBP normalmente entregam arquivos menores.',
      ],
      list: [
        'Use PNG quando precisar de transparência.',
        'Use JPEG para compatibilidade ampla e bom custo/tamanho.',
        'Use WEBP para otimização web moderna.',
        'Use PDF para envio e organização de páginas/documentos.',
      ],
    },
    {
      title: 'Privacidade e limites práticos',
      paragraphs: [
        'A conversão ocorre no navegador, sem upload automático de conteúdo para servidor. Isso ajuda em fluxos sensíveis, como documentos internos, layouts de campanha e arquivos de clientes.',
        'Arquivos grandes e PDFs longos podem consumir mais memória no dispositivo. Em casos pesados, converta por partes para manter fluidez em celulares e notebooks de entrada.',
      ],
    },
  ];
};

const buildPtBrFaq = (fromLabel: string, toLabel: string): FaqItem[] => [
  {
    question: `Como converter ${fromLabel} para ${toLabel}?`,
    answer:
      'Selecione o arquivo de origem, revise formato de destino e inicie a conversão. O resultado é gerado localmente no navegador para download imediato.',
  },
  {
    question: 'A conversão é gratuita?',
    answer: 'Sim. O uso é gratuito, sem cadastro obrigatório e sem login.',
  },
  {
    question: 'Os arquivos enviados ficam salvos em servidor?',
    answer:
      'Não. O processamento é local no browser por padrão, sem upload automático para backend.',
  },
  {
    question: 'Consigo usar no celular?',
    answer:
      'Sim. A interface é responsiva e foi desenhada para funcionar bem em telas pequenas, sem rolagem horizontal.',
  },
];

const buildConversionPage = (seed: ImageConversionSeed): ImageConversionPage => {
  const fromLabel = FORMAT_LABELS[seed.from];
  const toLabel = FORMAT_LABELS[seed.to];

  const slugTechnical = toTechnicalSlug(seed.from, seed.to);
  const slugPtBr = toPtBrSlug(fromLabel, toLabel);

  const pathTechnical = `${BASE_PATH}/${slugTechnical}`;
  const pathPtBr = `${BASE_PATH}/${slugPtBr}`;

  const normalizedFrom = seed.from === 'jpeg' ? 'jpg' : seed.from;
  const normalizedTo = seed.to === 'jpeg' ? 'jpg' : seed.to;

  return {
    slug: slugTechnical,
    path: pathTechnical,
    slugTechnical,
    pathTechnical,
    slugPtBr,
    pathPtBr,
    fromFormatId: seed.from,
    toFormatId: seed.to,
    fromLabel,
    toLabel,
    title: `Conversor de ${fromLabel} para ${toLabel}`,
    intro: `Converta ${fromLabel} para ${toLabel} online, grátis, sem cadastro, sem login e com processamento local no navegador.`,
    seoTitle: `${fromLabel} para ${toLabel} Grátis | Conversor Sem Cadastro`,
    seoDescription: `Converta ${fromLabel} para ${toLabel} no navegador, grátis, sem cadastro e sem login. Fluxo rápido com download imediato.`,
    keywords: [
      `${normalizedFrom} para ${normalizedTo}`,
      `${normalizedFrom} to ${normalizedTo}`,
      `converter ${normalizedFrom} para ${normalizedTo} gratis`,
      `${normalizedFrom} to ${normalizedTo} free`,
      `conversor ${normalizedFrom} sem cadastro`,
      `${normalizedFrom} converter no sign up`,
    ],
    contentBlocks: buildPtBrContentBlocks(fromLabel, toLabel),
    faq: buildPtBrFaq(fromLabel, toLabel),
    featured: seed.featured === true,
  };
};

const pages = conversionSeeds.map((seed) => buildConversionPage(seed));

export const imageConversionPages: ImageConversionPage[] = pages;

const technicalSlugMap = new Map(
  imageConversionPages.map((page) => [page.slugTechnical, page]),
);

const ptBrSlugMap = new Map(imageConversionPages.map((page) => [page.slugPtBr, page]));

const technicalAliasPairMap = new Map(
  imageConversionPages.map((page) => [
    `${normalizeTechnicalToken(page.fromFormatId)}->${normalizeTechnicalToken(page.toFormatId)}`,
    page,
  ]),
);

const ptBrAliasPairMap = new Map(
  imageConversionPages.map((page) => [
    `${normalizePtBrToken(page.fromLabel)}->${normalizePtBrToken(page.toLabel)}`,
    page,
  ]),
);

const buildTechnicalAliasSlugs = (page: ImageConversionPage): string[] => {
  const fromTokens = TECHNICAL_FORMAT_ALIASES[page.fromFormatId] ?? [page.fromFormatId];
  const toTokens = TECHNICAL_FORMAT_ALIASES[page.toFormatId] ?? [page.toFormatId];

  return fromTokens.flatMap((fromToken) =>
    toTokens.map((toToken) => `${fromToken}-to-${toToken}`),
  );
};

const buildPtBrAliasSlugs = (page: ImageConversionPage): string[] => {
  const fromLabelToken = sanitizeSlugToken(page.fromLabel);
  const toLabelToken = sanitizeSlugToken(page.toLabel);
  const fromTokens = PTBR_FORMAT_ALIASES[fromLabelToken] ?? [fromLabelToken];
  const toTokens = PTBR_FORMAT_ALIASES[toLabelToken] ?? [toLabelToken];

  return fromTokens.flatMap((fromToken) =>
    toTokens.map((toToken) => `${fromToken}-para-${toToken}`),
  );
};

export const getImageConversionResolutionBySlug = (
  slug: string,
): { page: ImageConversionPage; variant: ImageSlugVariant } | undefined => {
  const technical = technicalSlugMap.get(slug);
  if (technical) {
    return { page: technical, variant: 'technical' };
  }

  const ptBr = ptBrSlugMap.get(slug);
  if (ptBr) {
    return { page: ptBr, variant: 'ptBr' };
  }

  const parsedTechnical = parseSlugByDelimiter(slug, '-to-');
  if (parsedTechnical) {
    const key = `${normalizeTechnicalToken(parsedTechnical.from)}->${normalizeTechnicalToken(parsedTechnical.to)}`;
    const aliasMatch = technicalAliasPairMap.get(key);
    if (aliasMatch) {
      return { page: aliasMatch, variant: 'technical' };
    }
  }

  const parsedPtBr = parseSlugByDelimiter(slug, '-para-');
  if (parsedPtBr) {
    const key = `${normalizePtBrToken(parsedPtBr.from)}->${normalizePtBrToken(parsedPtBr.to)}`;
    const aliasMatch = ptBrAliasPairMap.get(key);
    if (aliasMatch) {
      return { page: aliasMatch, variant: 'ptBr' };
    }
  }

  return undefined;
};

export const getImageConversionPageBySlug = (
  slug: string,
): ImageConversionPage | undefined => getImageConversionResolutionBySlug(slug)?.page;

export const getImageConversionPathByVariant = (
  page: ImageConversionPage,
  variant: ImageSlugVariant,
): string => (variant === 'ptBr' ? page.pathPtBr : page.pathTechnical);

export const getPreferredImageSlugVariant = (locale: AppLocale): ImageSlugVariant =>
  locale === 'pt-br' ? 'ptBr' : 'technical';

export const getImageConversionPathByLocale = (
  page: ImageConversionPage,
  locale: AppLocale,
): string =>
  localizePath(
    locale,
    getImageConversionPathByVariant(page, getPreferredImageSlugVariant(locale)),
  );

export const getImageConversionLocalePathMap = (
  page: ImageConversionPage,
): Record<AppLocale, string> => ({
  'pt-br': getImageConversionPathByLocale(page, 'pt-br'),
  en: getImageConversionPathByLocale(page, 'en'),
  es: getImageConversionPathByLocale(page, 'es'),
});

const getConversionContext = (
  locale: AppLocale,
  page: ImageConversionPage,
): string => {
  const flow =
    page.fromFormatId === 'pdf'
      ? 'pdf-to-image'
      : page.toFormatId === 'pdf'
        ? 'image-to-pdf'
        : 'image-to-image';

  if (locale === 'en') {
    if (flow === 'pdf-to-image') {
      return 'PDF to image workflow';
    }

    if (flow === 'image-to-pdf') {
      return 'Image to PDF workflow';
    }

    return 'Image format optimization';
  }

  if (locale === 'es') {
    if (flow === 'pdf-to-image') {
      return 'Flujo de PDF a imagen';
    }

    if (flow === 'image-to-pdf') {
      return 'Flujo de imagen a PDF';
    }

    return 'Optimización entre formatos de imagen';
  }

  if (flow === 'pdf-to-image') {
    return 'Fluxo de PDF para imagem';
  }

  if (flow === 'image-to-pdf') {
    return 'Fluxo de imagem para PDF';
  }

  return 'Otimização entre formatos de imagem';
};

const buildLocalizedContentBlocks = (
  locale: AppLocale,
  fromLabel: string,
  toLabel: string,
): ContentBlock[] => {
  if (locale === 'pt-br') {
    return buildPtBrContentBlocks(fromLabel, toLabel);
  }

  if (locale === 'es') {
    return [
      {
        title: `Cuándo usar ${fromLabel} a ${toLabel}`,
        paragraphs: [
          `La conversión de ${fromLabel} a ${toLabel} es útil para publicar imágenes, enviar archivos por correo, preparar documentación o cumplir requisitos de formato en plataformas específicas.`,
          'El proceso ocurre en el navegador y prioriza velocidad, control local del archivo y menor fricción operativa.',
        ],
      },
      {
        title: 'Calidad, peso y compatibilidad',
        paragraphs: [
          'JPEG, WEBP y AVIF permiten compresión con pérdida para reducir tamaño. PNG y SVG suelen ser útiles cuando necesitas transparencia o mejor nitidez en gráficos.',
          'En flujos con PDF, puedes convertir páginas a imagen para edición o generar PDF desde imagen para compartir, archivar o imprimir.',
        ],
      },
      {
        title: 'Privacidad y límites de rendimiento',
        paragraphs: [
          'Los archivos se procesan localmente por defecto, sin subida automática a servidor.',
          'En PDFs extensos, conviene convertir por bloques para mantener estabilidad en móviles y equipos con menos memoria.',
        ],
      },
    ];
  }

  return [
    {
      title: `When to use ${fromLabel} to ${toLabel}`,
      paragraphs: [
        `Converting ${fromLabel} to ${toLabel} is useful when you need channel-specific delivery, such as web publishing, document sharing, support workflows, or platform upload constraints.`,
        'The workflow runs in-browser for faster turnaround and better control over sensitive files.',
      ],
    },
    {
      title: 'Quality, size, and compatibility',
      paragraphs: [
        'JPEG and WEBP offer lossy compression for lighter files. PNG is better when transparency and sharp edges are critical.',
        'For PDF-related paths, you can extract pages as images for editing or build PDFs from images for distribution and archival.',
      ],
    },
    {
      title: 'Privacy and performance notes',
      paragraphs: [
        'By default, conversion is local and does not upload files to a backend automatically.',
        'Large PDF batches can consume memory. Converting in smaller chunks improves reliability on mobile devices.',
      ],
    },
  ];
};

const buildLocalizedFaq = (
  locale: AppLocale,
  fromLabel: string,
  toLabel: string,
): FaqItem[] => {
  if (locale === 'pt-br') {
    return buildPtBrFaq(fromLabel, toLabel);
  }

  if (locale === 'es') {
    return [
      {
        question: `¿Cómo convierto ${fromLabel} a ${toLabel}?`,
        answer:
          'Selecciona el archivo de origen, confirma formato de destino y ejecuta la conversión. El resultado se genera para descarga inmediata.',
      },
      {
        question: '¿Es gratis?',
        answer: 'Sí. La herramienta puede usarse gratis, sin registro obligatorio y sin login.',
      },
      {
        question: '¿Los archivos se suben a servidor?',
        answer:
          'No por defecto. El procesamiento ocurre localmente en el navegador para proteger la privacidad.',
      },
      {
        question: '¿Funciona en móvil?',
        answer:
          'Sí. La interfaz se adapta a pantallas pequeñas sin scroll horizontal.',
      },
    ];
  }

  return [
    {
      question: `How do I convert ${fromLabel} to ${toLabel}?`,
      answer:
        'Select the source file, confirm target format, and start conversion. The result is generated for immediate local download.',
    },
    {
      question: 'Is this converter free?',
      answer: 'Yes. You can use it for free with no mandatory sign-up or login.',
    },
    {
      question: 'Are files uploaded to a server?',
      answer:
        'No by default. Conversion runs locally in your browser without automatic backend upload.',
    },
    {
      question: 'Does it work on mobile?',
      answer:
        'Yes. The interface is responsive and keeps core actions accessible on small screens.',
    },
  ];
};

export const getLocalizedImageConversionContent = (
  page: ImageConversionPage,
  locale: AppLocale,
): LocalizedImageConversionContent => {
  const fromLabel = page.fromLabel;
  const toLabel = page.toLabel;
  const normalizedFrom = page.fromFormatId === 'jpeg' ? 'jpg' : page.fromFormatId;
  const normalizedTo = page.toFormatId === 'jpeg' ? 'jpg' : page.toFormatId;

  if (locale === 'pt-br') {
    return {
      title: `Conversor de ${fromLabel} para ${toLabel}`,
      intro: `Converta ${fromLabel} para ${toLabel} online, grátis, sem cadastro, sem login e com download imediato.`,
      seoTitle: `${fromLabel} para ${toLabel} Grátis | Conversor Sem Cadastro`,
      seoDescription: `Converta ${fromLabel} para ${toLabel} no navegador, grátis, sem cadastro e sem login. Conversão rápida com processamento local.`,
      keywords: [
        `${normalizedFrom} para ${normalizedTo}`,
        `${normalizedFrom} to ${normalizedTo}`,
        `converter ${normalizedFrom} para ${normalizedTo} gratis`,
        `${normalizedFrom} to ${normalizedTo} free`,
        `conversor ${normalizedFrom} sem cadastro`,
        `${normalizedFrom} sem login`,
      ],
      contentBlocks: buildLocalizedContentBlocks('pt-br', fromLabel, toLabel),
      faq: buildLocalizedFaq('pt-br', fromLabel, toLabel),
    };
  }

  if (locale === 'es') {
    return {
      title: `Conversor de ${fromLabel} a ${toLabel}`,
      intro: `Convierte ${fromLabel} a ${toLabel} online, gratis, sin registro, sin login y con descarga inmediata.`,
      seoTitle: `${fromLabel} a ${toLabel} Gratis | Conversor Sin Registro`,
      seoDescription: `Convierte ${fromLabel} a ${toLabel} en el navegador, gratis, sin registro y sin login, con flujo rápido.`,
      keywords: [
        `${normalizedFrom} a ${normalizedTo}`,
        `${normalizedFrom} to ${normalizedTo}`,
        `convertir ${normalizedFrom} a ${normalizedTo} gratis`,
        `${normalizedFrom} to ${normalizedTo} free`,
        `conversor ${normalizedFrom} sin registro`,
        `${normalizedFrom} sin login`,
      ],
      contentBlocks: buildLocalizedContentBlocks('es', fromLabel, toLabel),
      faq: buildLocalizedFaq('es', fromLabel, toLabel),
    };
  }

  return {
    title: `${fromLabel} to ${toLabel} Converter`,
    intro: `Convert ${fromLabel} to ${toLabel} online for free, with no sign-up, no login, and instant download.`,
    seoTitle: `${fromLabel} to ${toLabel} Free | Converter Without Sign-Up`,
    seoDescription: `Convert ${fromLabel} to ${toLabel} directly in your browser for free, with no sign-up, no login, and local processing.`,
    keywords: [
      `${normalizedFrom} to ${normalizedTo}`,
      `${normalizedFrom} to ${normalizedTo} free`,
      `${normalizedFrom} converter no sign up`,
      `${normalizedFrom} converter no login`,
      `convert ${normalizedFrom} ${normalizedTo} online`,
    ],
    contentBlocks: buildLocalizedContentBlocks('en', fromLabel, toLabel),
    faq: buildLocalizedFaq('en', fromLabel, toLabel),
  };
};

export const toLocalizedImageConversionLink = (
  page: ImageConversionPage,
  locale: AppLocale,
): ImageConversionLinkItem => ({
  slug: page.slug,
  path: getImageConversionPathByLocale(page, locale),
  fromLabel: page.fromLabel,
  toLabel: page.toLabel,
  context: getConversionContext(locale, page),
});

export const getImageConversionStaticParams = (): Array<{ conversionSlug: string }> => {
  const slugSet = new Set<string>();

  imageConversionPages.forEach((page) => {
    buildTechnicalAliasSlugs(page).forEach((slug) => slugSet.add(slug));
    buildPtBrAliasSlugs(page).forEach((slug) => slugSet.add(slug));
  });

  return Array.from(slugSet).map((conversionSlug) => ({ conversionSlug }));
};

export const getFeaturedImageConversionPages = (limit = 4): ImageConversionPage[] =>
  imageConversionPages.filter((page) => page.featured).slice(0, limit);

export const getRelatedImageConversionPages = (
  slug: string,
  limit = 4,
): ImageConversionPage[] => {
  const current = getImageConversionPageBySlug(slug);

  if (!current) {
    return getFeaturedImageConversionPages(limit);
  }

  const sameFlow = imageConversionPages.filter(
    (page) =>
      page.slug !== slug &&
      isPdfFlow(page.fromFormatId, page.toFormatId) ===
        isPdfFlow(current.fromFormatId, current.toFormatId),
  );

  if (sameFlow.length >= limit) {
    return sameFlow.slice(0, limit);
  }

  const fallbacks = imageConversionPages.filter(
    (page) =>
      page.slug !== slug &&
      page.fromFormatId !== current.fromFormatId &&
      page.toFormatId !== current.toFormatId &&
      page.featured,
  );

  return [...sameFlow, ...fallbacks].slice(0, limit);
};
