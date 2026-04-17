import type { AppLocale } from '@/lib/i18n/config';

type SeoBlock = {
  title: string;
  description: string;
  keywords: string[];
};

type SectionText = {
  title: string;
  body: string;
};

type NotFoundText = {
  title: string;
  description: string;
  cta: string;
};

export type SiteDictionary = {
  languageName: string;
  languageSwitcherLabel: string;
  common: {
    home: string;
    tools: string;
    about: string;
    contact: string;
    privacyPolicy: string;
    terms: string;
  };
  seo: {
    siteDefaultTitle: string;
    siteDefaultDescription: string;
    home: SeoBlock;
    tools: SeoBlock;
    about: SeoBlock;
    contact: SeoBlock;
    privacy: SeoBlock;
    terms: SeoBlock;
    qrCodeFallback: SeoBlock;
    htmlPdfJsonFallback: SeoBlock;
    cryptoFallback: SeoBlock;
    cryptoConversionNotFound: SeoBlock;
  };
  header: {
    goHomeAriaLabel: string;
    navLabel: string;
  };
  footer: {
    goHomeAriaLabel: string;
    navLabel: string;
    tagline: string;
    rightsReserved: string;
  };
  home: {
    h1: string;
    intro: string;
    featuredToolsTitle: string;
    viewAllTools: string;
    growthTitle: string;
    growthParagraphs: [string, string];
  };
  toolsIndex: {
    h1: string;
    intro: string;
    searchLabel: string;
    searchPlaceholder: string;
    searchButton: string;
    resultsLabel: string;
    emptyMessage: string;
    emptyHints: string[];
  };
  about: {
    h1: string;
    intro: string;
    principlesTitle: string;
    principles: string[];
    qualityTitle: string;
    qualityParagraph: string;
  };
  contact: {
    h1: string;
    intro: string;
    emailTitle: string;
    responseTimeTitle: string;
    responseTimeParagraph: string;
    bugReportTitle: string;
    bugReportItems: string[];
  };
  privacy: {
    h1: string;
    intro: string;
    sections: SectionText[];
  };
  terms: {
    h1: string;
    intro: string;
    sections: SectionText[];
  };
  notFound: NotFoundText;
  toolCard: {
    openTool: string;
    openToolAriaPrefix: string;
  };
  toolShell: {
    useToolTitle: string;
    contentTitle: string;
    faqTitle: string;
    relatedToolsTitle: string;
    relatedToolsDescription: string;
    trustTitle: string;
    trustText: string;
    cryptoRelatedTitle: string;
    cryptoRelatedDescription: string;
    cryptoPopularTitle: string;
    cryptoPopularDescription: string;
    conversionBreadcrumbLabel: string;
    conversionSearchIntent: string;
  };
  qrToolUi: {
    fromToConnector: string;
  };
};

const dictionaries: Record<AppLocale, SiteDictionary> = {
  'pt-br': {
    languageName: 'Português',
    languageSwitcherLabel: 'Idioma',
    common: {
      home: 'Home',
      tools: 'Ferramentas',
      about: 'Sobre',
      contact: 'Contato',
      privacyPolicy: 'Política de Privacidade',
      terms: 'Termos de Uso',
    },
    seo: {
      siteDefaultTitle: 'Ferramentas Online',
      siteDefaultDescription:
        'Hub de ferramentas online com foco em SEO técnico, performance e experiência limpa em português, inglês e espanhol.',
      home: {
        title: 'Ferramentas Online para Produtividade e Desenvolvimento',
        description:
          'Hub de ferramentas online com foco em SEO técnico, performance e experiência limpa. Use utilitários práticos sem cadastro e com processamento local quando aplicável.',
        keywords: [
          'ferramentas online',
          'tools online grátis',
          'utilitários web',
          'ferramentas para desenvolvedores',
        ],
      },
      tools: {
        title: 'Ferramentas Online',
        description:
          'Lista de ferramentas online com páginas próprias, conteúdo útil e foco em performance para desktop e mobile.',
        keywords: ['ferramentas online', 'lista de tools', 'utilitários web grátis'],
      },
      about: {
        title: 'Sobre o Projeto',
        description:
          'Entenda o objetivo do Tools Lucasqc, como as ferramentas são construídas e quais princípios de SEO, UX e privacidade orientam o produto.',
        keywords: ['sobre ferramentas online', 'projeto tools', 'seo e ux'],
      },
      contact: {
        title: 'Contato',
        description:
          'Canal oficial de contato para suporte, feedback, parcerias e reportes técnicos sobre as ferramentas online.',
        keywords: ['contato tools lucas qc', 'suporte ferramentas online', 'fale conosco'],
      },
      privacy: {
        title: 'Política de Privacidade',
        description:
          'Política de privacidade do Tools Lucasqc: dados coletados, finalidade, cookies, uso de anúncios e direitos do usuário.',
        keywords: ['política de privacidade', 'cookies', 'dados pessoais', 'adsense'],
      },
      terms: {
        title: 'Termos de Uso',
        description:
          'Termos de uso do Tools Lucasqc: responsabilidades, limitações, propriedade intelectual e condições gerais de utilização.',
        keywords: ['termos de uso', 'condições de uso', 'responsabilidades'],
      },
      qrCodeFallback: {
        title: 'Gerador de QR Code Grátis e Sem Cadastro',
        description:
          'Gere QR Code online grátis, sem cadastro e sem login, com logo central e exportação em PNG, JPEG, SVG e PDF.',
        keywords: ['gerador de qr code gratis', 'qr code sem cadastro'],
      },
      htmlPdfJsonFallback: {
        title: 'HTML Viewer, PDF Viewer e JSON Formatter',
        description:
          'Visualize HTML, abra PDF local e formate JSON sem enviar arquivos para servidor.',
        keywords: ['formatador json online', 'visualizador html'],
      },
      cryptoFallback: {
        title: 'Conversor de Unidades Cripto',
        description: 'Converta unidades de BTC, ETH e USDT localmente no navegador.',
        keywords: ['conversor de satoshi', 'btc para satoshi'],
      },
      cryptoConversionNotFound: {
        title: 'Conversão cripto não encontrada',
        description:
          'A conversão solicitada não está disponível no momento. Consulte outras opções de conversor de unidades cripto.',
        keywords: ['conversor de unidades cripto'],
      },
    },
    header: {
      goHomeAriaLabel: 'Ir para Tools Lucasqc',
      navLabel: 'Navegação principal',
    },
    footer: {
      goHomeAriaLabel: 'Ir para Tools Lucasqc',
      navLabel: 'Links institucionais',
      tagline: 'Ferramentas online rápidas, úteis e preparadas para SEO',
      rightsReserved: 'Todos os direitos reservados.',
    },
    home: {
      h1: 'Ferramentas online úteis para o dia a dia',
      intro:
        'Encontre e use ferramentas online gratuitas para converter, calcular, gerar, visualizar e resolver tarefas comuns do cotidiano, tudo em um só lugar e sem cadastro.',
      featuredToolsTitle: 'Ferramentas em destaque',
      viewAllTools: 'Ver todas as ferramentas',
      growthTitle: 'Estrutura pensada para crescimento orgânico',
      growthParagraphs: [
        'Cada tool é tratada como landing page própria, com metadados dedicados, FAQ, conteúdo explicativo e links internos leves. Assim, as páginas conseguem rankear direto no Google sem depender da home como única entrada.',
        'A navegação global é discreta para evitar poluição visual. O usuário encontra rápido o que precisa e o robô de busca mantém rastreabilidade de rotas importantes via sitemap e estrutura de links contextual.',
      ],
    },
    toolsIndex: {
      h1: 'Todas as ferramentas',
      intro:
        'Catálogo enxuto com páginas focadas. Cada ferramenta tem contexto próprio, FAQ, metadados individuais e arquitetura pronta para crescer sem perder qualidade.',
      searchLabel: 'Buscar ferramenta',
      searchPlaceholder: 'Ex.: json, satoshi, pdf',
      searchButton: 'Buscar',
      resultsLabel: 'resultado(s)',
      emptyMessage: 'Nenhuma ferramenta encontrada para essa busca. Tente termos como',
      emptyHints: ['satoshi', 'json', 'pdf'],
    },
    about: {
      h1: 'Sobre o Tools Lucasqc',
      intro:
        'O Tools Lucasqc nasceu para entregar utilitários web realmente úteis, rápidos e com estrutura profissional de SEO técnico. Cada página foi pensada como entrada direta de tráfego orgânico, sem depender da home para fazer sentido.',
      principlesTitle: 'Princípios do produto',
      principles: [
        'Conteúdo útil antes de monetização.',
        'Experiência limpa e responsiva em mobile e desktop.',
        'Processamento local quando possível, para mais privacidade.',
        'Arquitetura escalável para novas tools sem retrabalho.',
      ],
      qualityTitle: 'Compromisso de qualidade',
      qualityParagraph:
        'Mantemos páginas institucionais claras, políticas transparentes e uma arquitetura de links internos discreta. Isso fortalece confiança de usuários, mecanismos de busca e plataformas de anúncios como o Google AdSense.',
    },
    contact: {
      h1: 'Contato',
      intro:
        'Para dúvidas, sugestões, correções de conteúdo ou oportunidades de parceria, use o canal oficial abaixo.',
      emailTitle: 'E-mail',
      responseTimeTitle: 'Tempo de resposta',
      responseTimeParagraph:
        'Buscamos responder mensagens em até 2 dias úteis. Reportes técnicos com passos de reprodução têm prioridade por facilitarem análise e correção.',
      bugReportTitle: 'Boas práticas ao reportar problemas',
      bugReportItems: [
        'Informe a URL exata da página.',
        'Descreva o comportamento esperado e o comportamento atual.',
        'Inclua navegador, dispositivo e horário aproximado do erro.',
      ],
    },
    privacy: {
      h1: 'Política de Privacidade',
      intro:
        'Esta política descreve como o Tools Lucasqc trata informações de navegação e quais práticas adotamos para proteger usuários.',
      sections: [
        {
          title: '1. Dados processados nas ferramentas',
          body:
            'As ferramentas principais foram projetadas para processamento local no navegador sempre que possível. Isso significa que conteúdos inseridos em campos de uso não são enviados automaticamente para nossos servidores.',
        },
        {
          title: '2. Cookies e métricas',
          body:
            'Podemos usar cookies técnicos e de medição para melhorar desempenho, estabilidade e experiência. Quando houver integração de publicidade, parceiros podem usar cookies para personalização e medição conforme suas próprias políticas.',
        },
        {
          title: '3. Publicidade',
          body:
            'Este site pode exibir anúncios de redes como Google AdSense. A veiculação está sujeita às políticas da plataforma, inclusive quanto a uso de cookies e personalização de anúncios por interesse.',
        },
        {
          title: '4. Direitos do usuário',
          body:
            'Você pode solicitar esclarecimentos sobre dados e práticas de privacidade por meio da página de contato. Revisamos periodicamente esta política para manter clareza e conformidade.',
        },
        {
          title: '5. Atualizações desta política',
          body:
            'Alterações podem ocorrer para refletir melhorias no produto, mudanças legais ou novas integrações. Recomenda-se revisar esta página periodicamente.',
        },
      ],
    },
    terms: {
      h1: 'Termos de Uso',
      intro:
        'Ao utilizar este site, você concorda com os termos abaixo. Se não concordar, interrompa o uso das ferramentas.',
      sections: [
        {
          title: '1. Natureza das ferramentas',
          body:
            'As ferramentas disponibilizadas são utilitários de apoio e não substituem aconselhamento profissional técnico, jurídico, contábil ou financeiro.',
        },
        {
          title: '2. Responsabilidade de uso',
          body:
            'O usuário é responsável por validar resultados antes de aplicar decisões críticas. Apesar dos esforços de qualidade, podem existir limitações de interpretação e de compatibilidade entre ambientes.',
        },
        {
          title: '3. Propriedade intelectual',
          body:
            'Conteúdos textuais, estrutura do site e componentes visuais são protegidos por direitos aplicáveis. Reprodução integral sem autorização não é permitida.',
        },
        {
          title: '4. Disponibilidade e mudanças',
          body:
            'Podemos atualizar, pausar ou remover funcionalidades sem aviso prévio para manutenção, melhorias ou adequação a políticas de terceiros.',
        },
        {
          title: '5. Contato',
          body: 'Dúvidas sobre estes termos podem ser enviadas pela página de contato do site.',
        },
      ],
    },
    notFound: {
      title: 'Página não encontrada',
      description:
        'A URL acessada não existe ou foi movida. Use o link abaixo para voltar ao hub principal.',
      cta: 'Voltar para a home',
    },
    toolCard: {
      openTool: 'Abrir ferramenta',
      openToolAriaPrefix: 'Abrir',
    },
    toolShell: {
      useToolTitle: 'Use a ferramenta',
      contentTitle: 'Guia rápido e contexto de uso',
      faqTitle: 'Perguntas frequentes',
      relatedToolsTitle: 'Outras ferramentas úteis',
      relatedToolsDescription:
        'Links internos discretos para navegação contextual e descoberta orgânica.',
      trustTitle: 'Privacidade e processamento local',
      trustText:
        'As ferramentas desta página rodam no navegador e não enviam o conteúdo digitado para backend. Isso melhora privacidade, reduz latência e ajuda na experiência mobile.',
      cryptoRelatedTitle: 'Outras conversões relacionadas',
      cryptoRelatedDescription:
        'Links internos leves para combinações próximas e úteis do mesmo contexto técnico.',
      cryptoPopularTitle: 'Conversões populares',
      cryptoPopularDescription:
        'Páginas específicas de alta intenção para consultas diretas como gwei para ETH, sat para BTC e lamport para SOL.',
      conversionBreadcrumbLabel: 'Conversor de Unidades Cripto',
      conversionSearchIntent:
        'Usuários que buscam conversão direta entre duas unidades técnicas de um mesmo ativo cripto.',
    },
    qrToolUi: {
      fromToConnector: 'para',
    },
  },
  en: {
    languageName: 'English',
    languageSwitcherLabel: 'Language',
    common: {
      home: 'Home',
      tools: 'Tools',
      about: 'About',
      contact: 'Contact',
      privacyPolicy: 'Privacy Policy',
      terms: 'Terms of Use',
    },
    seo: {
      siteDefaultTitle: 'Online Tools',
      siteDefaultDescription:
        'Global online tools hub built for technical SEO, fast UX, and localized rankings in Portuguese, English, and Spanish.',
      home: {
        title: 'Free Online Tools for Creators, Marketers, and Developers',
        description:
          'Use practical web tools with indexable pages, strong technical SEO foundations, and privacy-friendly local processing.',
        keywords: [
          'free online tools',
          'web productivity tools',
          'developer tools online',
          'seo friendly tools',
        ],
      },
      tools: {
        title: 'All Online Tools',
        description:
          'Explore focused online tools with dedicated landing pages, FAQs, and optimized metadata for global search visibility.',
        keywords: ['online tools list', 'free web utilities', 'browser tools'],
      },
      about: {
        title: 'About This Project',
        description:
          'Learn how Tools Lucasqc is built to scale organic traffic with technical SEO, clean UX, and transparent privacy practices.',
        keywords: ['about tools lucasqc', 'seo tools project', 'web tools mission'],
      },
      contact: {
        title: 'Contact',
        description:
          'Official support and partnership contact channel for Tools Lucasqc online utilities.',
        keywords: ['contact online tools', 'tool support', 'business inquiry'],
      },
      privacy: {
        title: 'Privacy Policy',
        description:
          'Read how Tools Lucasqc handles browser data, cookies, advertising integrations, and user privacy rights.',
        keywords: ['privacy policy', 'cookies', 'data processing', 'ads policy'],
      },
      terms: {
        title: 'Terms of Use',
        description:
          'Terms for using Tools Lucasqc, including responsibilities, platform limitations, and content ownership.',
        keywords: ['terms of use', 'usage conditions', 'liability'],
      },
      qrCodeFallback: {
        title: 'Free QR Code Generator Without Sign Up',
        description:
          'Generate QR codes instantly, add a center logo, and export PNG, JPEG, WEBP, SVG, or PDF files directly in your browser.',
        keywords: ['free qr code generator', 'qr code no sign up'],
      },
      htmlPdfJsonFallback: {
        title: 'HTML Viewer, PDF Viewer, and JSON Formatter',
        description:
          'Preview HTML safely, open local PDF files, and format or minify JSON directly in the browser.',
        keywords: ['json formatter online', 'html viewer', 'pdf viewer browser'],
      },
      cryptoFallback: {
        title: 'Crypto Unit Converter',
        description:
          'Convert BTC, ETH, SOL, USDT, and other crypto units with precise local calculations and no external API.',
        keywords: ['crypto unit converter', 'satoshi converter', 'gwei to eth'],
      },
      cryptoConversionNotFound: {
        title: 'Crypto conversion page not found',
        description:
          'The requested conversion page is not available right now. Browse the crypto unit converter for related pairs.',
        keywords: ['crypto units converter'],
      },
    },
    header: {
      goHomeAriaLabel: 'Go to Tools Lucasqc homepage',
      navLabel: 'Primary navigation',
    },
    footer: {
      goHomeAriaLabel: 'Go to Tools Lucasqc homepage',
      navLabel: 'Institutional links',
      tagline: 'Fast online tools built for SEO and practical workflows',
      rightsReserved: 'All rights reserved.',
    },
    home: {
      h1: 'Useful online tools for everyday tasks',
      intro:
        'Find and use free online tools to convert, calculate, generate, visualize and solve common daily tasks, all in one place and with no sign up.',
      featuredToolsTitle: 'Featured tools',
      viewAllTools: 'View all tools',
      growthTitle: 'Built for international organic growth',
      growthParagraphs: [
        'Each tool is treated like a standalone landing page, with dedicated metadata, FAQ coverage, and contextual internal links. That structure supports rankings beyond homepage traffic.',
        'Navigation stays intentionally lightweight to reduce clutter. Users can reach key actions quickly while search engines crawl important URLs consistently through sitemaps and semantic linking.',
      ],
    },
    toolsIndex: {
      h1: 'All tools',
      intro:
        'A focused catalog with dedicated pages per utility. Every tool includes contextual content, FAQ, and metadata designed for search intent.',
      searchLabel: 'Search tools',
      searchPlaceholder: 'Example: json, satoshi, pdf',
      searchButton: 'Search',
      resultsLabel: 'result(s)',
      emptyMessage: 'No tools matched this query. Try terms like',
      emptyHints: ['satoshi', 'json', 'pdf'],
    },
    about: {
      h1: 'About Tools Lucasqc',
      intro:
        'Tools Lucasqc was created to ship practical web utilities with strong technical SEO foundations. Every page is built to work as an independent organic entry point.',
      principlesTitle: 'Product principles',
      principles: [
        'Useful content before monetization.',
        'Clean responsive UX across mobile and desktop.',
        'Local processing whenever possible for stronger privacy.',
        'Scalable architecture for adding new tools consistently.',
      ],
      qualityTitle: 'Quality commitment',
      qualityParagraph:
        'We keep institutional pages clear, policies transparent, and internal linking focused. This helps build trust with users, search engines, and ad platforms such as Google AdSense.',
    },
    contact: {
      h1: 'Contact',
      intro:
        'For support, feedback, content corrections, or partnerships, use the official contact channel below.',
      emailTitle: 'Email',
      responseTimeTitle: 'Response time',
      responseTimeParagraph:
        'We aim to answer within 2 business days. Technical bug reports with clear reproduction steps are prioritized.',
      bugReportTitle: 'Best practices for bug reports',
      bugReportItems: [
        'Share the exact page URL.',
        'Describe expected behavior and current behavior.',
        'Include browser, device, and approximate timestamp.',
      ],
    },
    privacy: {
      h1: 'Privacy Policy',
      intro:
        'This policy explains how Tools Lucasqc handles browsing information and which practices we follow to protect users.',
      sections: [
        {
          title: '1. Data processed in tools',
          body:
            'Core tools are designed for local browser processing whenever possible. In practical terms, the content you enter into tool fields is not automatically sent to our servers.',
        },
        {
          title: '2. Cookies and analytics',
          body:
            'We may use technical and measurement cookies to improve performance, stability, and experience. Advertising partners may also use cookies under their own policies.',
        },
        {
          title: '3. Advertising',
          body:
            'This site may display ads from providers such as Google AdSense. Delivery is subject to partner policies, including cookie usage and interest-based personalization rules.',
        },
        {
          title: '4. User rights',
          body:
            'You can request clarification about data and privacy practices through the contact page. We review this policy regularly to preserve transparency and compliance.',
        },
        {
          title: '5. Policy updates',
          body:
            'We may update this page to reflect product improvements, legal changes, or new integrations. We recommend reviewing it periodically.',
        },
      ],
    },
    terms: {
      h1: 'Terms of Use',
      intro:
        'By using this site, you agree to the terms below. If you do not agree, discontinue use of the tools.',
      sections: [
        {
          title: '1. Tool nature',
          body:
            'The available tools are support utilities and do not replace professional technical, legal, accounting, or financial advice.',
        },
        {
          title: '2. Usage responsibility',
          body:
            'Users are responsible for validating outputs before making critical decisions. Despite quality controls, limitations may exist across environments and interpretation contexts.',
        },
        {
          title: '3. Intellectual property',
          body:
            'Text content, site structure, and visual components are protected by applicable rights. Full reproduction without authorization is not allowed.',
        },
        {
          title: '4. Availability and changes',
          body:
            'We may update, pause, or remove features without prior notice for maintenance, improvements, or third-party policy alignment.',
        },
        {
          title: '5. Contact',
          body: 'Questions about these terms can be submitted through the site contact page.',
        },
      ],
    },
    notFound: {
      title: 'Page not found',
      description:
        'The requested URL does not exist or has moved. Use the link below to return to the main hub.',
      cta: 'Back to homepage',
    },
    toolCard: {
      openTool: 'Open tool',
      openToolAriaPrefix: 'Open',
    },
    toolShell: {
      useToolTitle: 'Use this tool',
      contentTitle: 'Quick guide and practical context',
      faqTitle: 'Frequently asked questions',
      relatedToolsTitle: 'Other useful tools',
      relatedToolsDescription:
        'Light internal links for contextual discovery and better crawl flow.',
      trustTitle: 'Privacy and local processing',
      trustText:
        'Tools on this page run directly in your browser and do not send entered content to a backend. This improves privacy and reduces latency.',
      cryptoRelatedTitle: 'Related conversions',
      cryptoRelatedDescription:
        'Internal links to nearby conversion combinations that match similar technical intent.',
      cryptoPopularTitle: 'Popular conversions',
      cryptoPopularDescription:
        'High-intent landing pages for queries such as gwei to ETH, sat to BTC, and lamport to SOL.',
      conversionBreadcrumbLabel: 'Crypto Unit Converter',
      conversionSearchIntent:
        'Users searching for direct conversion between two technical units of the same crypto asset.',
    },
    qrToolUi: {
      fromToConnector: 'to',
    },
  },
  es: {
    languageName: 'Español',
    languageSwitcherLabel: 'Idioma',
    common: {
      home: 'Inicio',
      tools: 'Herramientas',
      about: 'Acerca de',
      contact: 'Contacto',
      privacyPolicy: 'Política de Privacidad',
      terms: 'Términos de Uso',
    },
    seo: {
      siteDefaultTitle: 'Herramientas Online',
      siteDefaultDescription:
        'Hub internacional de herramientas online con enfoque en SEO técnico, UX rápida y contenido localizado en portugués, inglés y español.',
      home: {
        title: 'Herramientas Online Gratis para Productividad y Desarrollo',
        description:
          'Usa utilidades web con páginas indexables, estructura SEO sólida y procesamiento local para una experiencia más rápida y confiable.',
        keywords: [
          'herramientas online gratis',
          'utilidades web',
          'herramientas para desarrolladores',
          'seo técnico',
        ],
      },
      tools: {
        title: 'Todas las herramientas online',
        description:
          'Directorio de herramientas con landing pages propias, contenido útil y metadatos optimizados para posicionamiento internacional.',
        keywords: ['lista de herramientas online', 'utilidades web gratis', 'tools en navegador'],
      },
      about: {
        title: 'Sobre este proyecto',
        description:
          'Conoce cómo Tools Lucasqc está construido para crecer en tráfico orgánico con SEO técnico, UX limpia y políticas transparentes.',
        keywords: ['sobre tools lucasqc', 'proyecto seo tools', 'herramientas web'],
      },
      contact: {
        title: 'Contacto',
        description:
          'Canal oficial para soporte, sugerencias y oportunidades de colaboración en Tools Lucasqc.',
        keywords: ['contacto herramientas online', 'soporte tools', 'consultas'],
      },
      privacy: {
        title: 'Política de Privacidad',
        description:
          'Consulta cómo Tools Lucasqc trata datos de navegación, cookies, publicidad y derechos de privacidad del usuario.',
        keywords: ['política de privacidad', 'cookies', 'tratamiento de datos'],
      },
      terms: {
        title: 'Términos de Uso',
        description:
          'Condiciones de uso de Tools Lucasqc, responsabilidades del usuario y limitaciones de la plataforma.',
        keywords: ['términos de uso', 'condiciones', 'responsabilidad'],
      },
      qrCodeFallback: {
        title: 'Generador de Código QR Gratis y Sin Registro',
        description:
          'Crea códigos QR al instante, añade logo central y descarga en PNG, JPEG, WEBP, SVG o PDF.',
        keywords: ['generador qr gratis', 'qr sin registro'],
      },
      htmlPdfJsonFallback: {
        title: 'Visor HTML, Visor PDF y Formateador JSON',
        description:
          'Previsualiza HTML en sandbox, abre PDF local y formatea o minifica JSON en tu navegador.',
        keywords: ['formateador json online', 'visor html', 'visor pdf'],
      },
      cryptoFallback: {
        title: 'Conversor de Unidades Cripto',
        description:
          'Convierte unidades de BTC, ETH, SOL, USDT y más con cálculo local de alta precisión.',
        keywords: ['conversor unidades cripto', 'satoshi a btc', 'gwei a eth'],
      },
      cryptoConversionNotFound: {
        title: 'Conversión cripto no encontrada',
        description:
          'La conversión solicitada no está disponible por ahora. Revisa otras combinaciones en el conversor de unidades cripto.',
        keywords: ['conversor de unidades cripto'],
      },
    },
    header: {
      goHomeAriaLabel: 'Ir al inicio de Tools Lucasqc',
      navLabel: 'Navegación principal',
    },
    footer: {
      goHomeAriaLabel: 'Ir al inicio de Tools Lucasqc',
      navLabel: 'Enlaces institucionales',
      tagline: 'Herramientas online rápidas y útiles, preparadas para SEO global',
      rightsReserved: 'Todos los derechos reservados.',
    },
    home: {
      h1: 'Herramientas online útiles para el día a día',
      intro:
        'Encuentra y usa herramientas online gratis para convertir, calcular, generar, visualizar y resolver tareas cotidianas, todo en un solo lugar y sin registro.',
      featuredToolsTitle: 'Herramientas destacadas',
      viewAllTools: 'Ver todas las herramientas',
      growthTitle: 'Arquitectura orientada a crecimiento orgánico',
      growthParagraphs: [
        'Cada herramienta funciona como una landing page independiente, con metadatos dedicados, FAQ y enlaces internos contextuales. Esto mejora la visibilidad más allá del tráfico de la home.',
        'La navegación global se mantiene ligera para evitar ruido visual. Así el usuario llega rápido a la acción principal y Google rastrea URLs clave con mayor consistencia.',
      ],
    },
    toolsIndex: {
      h1: 'Todas las herramientas',
      intro:
        'Catálogo enfocado con páginas específicas por utilidad. Cada herramienta incluye contexto, FAQ y metadatos adaptados a intención de búsqueda.',
      searchLabel: 'Buscar herramienta',
      searchPlaceholder: 'Ej.: json, satoshi, pdf',
      searchButton: 'Buscar',
      resultsLabel: 'resultado(s)',
      emptyMessage: 'No se encontraron herramientas para esta búsqueda. Prueba con',
      emptyHints: ['satoshi', 'json', 'pdf'],
    },
    about: {
      h1: 'Sobre Tools Lucasqc',
      intro:
        'Tools Lucasqc nace para ofrecer utilidades web realmente prácticas, con base sólida de SEO técnico y rendimiento. Cada página está diseñada para funcionar como punto de entrada orgánico independiente.',
      principlesTitle: 'Principios del producto',
      principles: [
        'Contenido útil antes que monetización.',
        'Experiencia limpia y responsive en móvil y escritorio.',
        'Procesamiento local cuando sea posible para mayor privacidad.',
        'Arquitectura escalable para nuevas herramientas sin retrabajo.',
      ],
      qualityTitle: 'Compromiso de calidad',
      qualityParagraph:
        'Mantenemos páginas institucionales claras, políticas transparentes y enlaces internos discretos. Esto fortalece la confianza de usuarios, buscadores y plataformas de anuncios como Google AdSense.',
    },
    contact: {
      h1: 'Contacto',
      intro:
        'Para dudas, sugerencias, correcciones de contenido o alianzas, usa el canal oficial de contacto.',
      emailTitle: 'Correo electrónico',
      responseTimeTitle: 'Tiempo de respuesta',
      responseTimeParagraph:
        'Buscamos responder en hasta 2 días hábiles. Los reportes técnicos con pasos de reproducción tienen prioridad.',
      bugReportTitle: 'Buenas prácticas para reportar problemas',
      bugReportItems: [
        'Comparte la URL exacta de la página.',
        'Describe el comportamiento esperado y el actual.',
        'Incluye navegador, dispositivo y horario aproximado del error.',
      ],
    },
    privacy: {
      h1: 'Política de Privacidad',
      intro:
        'Esta política explica cómo Tools Lucasqc trata la información de navegación y qué prácticas aplicamos para proteger a los usuarios.',
      sections: [
        {
          title: '1. Datos procesados en las herramientas',
          body:
            'Las herramientas principales fueron diseñadas para procesar datos localmente en el navegador siempre que sea posible. Esto significa que el contenido ingresado no se envía automáticamente a nuestros servidores.',
        },
        {
          title: '2. Cookies y métricas',
          body:
            'Podemos usar cookies técnicas y de medición para mejorar rendimiento, estabilidad y experiencia. En integraciones publicitarias, socios externos pueden usar cookies según sus políticas.',
        },
        {
          title: '3. Publicidad',
          body:
            'Este sitio puede mostrar anuncios de redes como Google AdSense. La publicación se rige por políticas de terceros, incluyendo uso de cookies y personalización por intereses.',
        },
        {
          title: '4. Derechos del usuario',
          body:
            'Puedes solicitar aclaraciones sobre datos y prácticas de privacidad mediante la página de contacto. Revisamos esta política de forma periódica para mantener transparencia y cumplimiento.',
        },
        {
          title: '5. Actualizaciones de esta política',
          body:
            'Podemos actualizar este documento para reflejar mejoras del producto, cambios legales o nuevas integraciones. Recomendamos revisarlo regularmente.',
        },
      ],
    },
    terms: {
      h1: 'Términos de Uso',
      intro:
        'Al usar este sitio aceptas los términos descritos abajo. Si no estás de acuerdo, debes dejar de usar las herramientas.',
      sections: [
        {
          title: '1. Naturaleza de las herramientas',
          body:
            'Las herramientas disponibles son utilidades de apoyo y no sustituyen asesoría profesional técnica, legal, contable o financiera.',
        },
        {
          title: '2. Responsabilidad de uso',
          body:
            'El usuario es responsable de validar resultados antes de tomar decisiones críticas. Aunque existe control de calidad, pueden presentarse limitaciones según el entorno de uso.',
        },
        {
          title: '3. Propiedad intelectual',
          body:
            'El contenido textual, la estructura del sitio y los componentes visuales están protegidos por derechos aplicables. La reproducción total sin autorización no está permitida.',
        },
        {
          title: '4. Disponibilidad y cambios',
          body:
            'Podemos actualizar, pausar o retirar funcionalidades sin aviso previo por mantenimiento, mejoras o adecuación a políticas de terceros.',
        },
        {
          title: '5. Contacto',
          body:
            'Las consultas sobre estos términos pueden enviarse por la página de contacto.',
        },
      ],
    },
    notFound: {
      title: 'Página no encontrada',
      description:
        'La URL solicitada no existe o fue movida. Usa el enlace de abajo para volver al hub principal.',
      cta: 'Volver al inicio',
    },
    toolCard: {
      openTool: 'Abrir herramienta',
      openToolAriaPrefix: 'Abrir',
    },
    toolShell: {
      useToolTitle: 'Usa la herramienta',
      contentTitle: 'Guía rápida y contexto de uso',
      faqTitle: 'Preguntas frecuentes',
      relatedToolsTitle: 'Otras herramientas útiles',
      relatedToolsDescription:
        'Enlaces internos discretos para descubrimiento contextual y mejor rastreo orgánico.',
      trustTitle: 'Privacidad y procesamiento local',
      trustText:
        'Las herramientas de esta página se ejecutan en el navegador y no envían automáticamente el contenido ingresado a un backend. Esto mejora privacidad y reduce latencia.',
      cryptoRelatedTitle: 'Otras conversiones relacionadas',
      cryptoRelatedDescription:
        'Enlaces internos ligeros para combinaciones cercanas dentro del mismo contexto técnico.',
      cryptoPopularTitle: 'Conversiones populares',
      cryptoPopularDescription:
        'Landing pages de alta intención para búsquedas como gwei a ETH, sat a BTC y lamport a SOL.',
      conversionBreadcrumbLabel: 'Conversor de Unidades Cripto',
      conversionSearchIntent:
        'Usuarios que buscan conversión directa entre dos unidades técnicas del mismo activo cripto.',
    },
    qrToolUi: {
      fromToConnector: 'a',
    },
  },
};

export const getDictionary = (locale: AppLocale): SiteDictionary => dictionaries[locale];
