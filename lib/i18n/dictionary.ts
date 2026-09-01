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
        'Hub de ferramentas online grátis para tarefas do dia a dia, com experiência rápida, sem cadastro e sem login em português, inglês e espanhol.',
      home: {
        title: 'Ferramentas Online para Produtividade e Desenvolvimento',
        description:
          'Use ferramentas online práticas, gratuitas, sem cadastro e sem login para resolver tarefas comuns com rapidez e processamento local quando aplicável.',
        keywords: [
          'ferramentas online',
          'ferramentas online gratis sem cadastro',
          'ferramentas online sem login',
          'tools online grátis',
          'utilitários web',
          'ferramentas para desenvolvedores',
        ],
      },
      tools: {
        title: 'Ferramentas Online',
        description:
          'Lista de ferramentas online grátis, sem cadastro e sem login, com conteúdo útil e foco em performance para desktop e mobile.',
        keywords: [
          'ferramentas online',
          'ferramentas online grátis',
          'ferramentas sem cadastro',
          'ferramentas sem login',
          'lista de tools',
          'utilitários web grátis',
        ],
      },
      about: {
        title: 'Sobre o Projeto',
        description:
          'Entenda o objetivo do Tools Lucasqc, como as ferramentas são construídas e quais princípios de utilidade, UX e privacidade orientam o produto.',
        keywords: ['sobre ferramentas online', 'projeto tools', 'utilitários web'],
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
      tagline: 'Ferramentas online rápidas, úteis e sem complicação',
      rightsReserved: 'Todos os direitos reservados.',
    },
    home: {
      h1: 'Ferramentas online úteis para o dia a dia',
      intro:
        'Encontre e use ferramentas online gratuitas para converter, calcular, gerar, visualizar e resolver tarefas comuns do cotidiano, tudo em um só lugar, sem cadastro e sem login.',
      featuredToolsTitle: 'Ferramentas em destaque',
      viewAllTools: 'Ver todas as ferramentas',
      growthTitle: 'Ferramentas pensadas para uso rápido',
      growthParagraphs: [
        'Cada ferramenta tem sua própria página com guia rápido, FAQ e ações diretas para você concluir a tarefa sem perder tempo.',
        'A navegação é leve para evitar poluição visual. Em celular e desktop, você chega nas ações principais com poucos cliques.',
      ],
    },
    toolsIndex: {
      h1: 'Todas as ferramentas',
      intro:
        'Catálogo enxuto com páginas focadas. Cada ferramenta traz contexto, FAQ e fluxo simples para você resolver a tarefa em poucos passos.',
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
        'O Tools Lucasqc nasceu para entregar utilitários web realmente úteis, rápidos e fáceis de usar. Cada página foi pensada para funcionar bem sozinha e ajudar você a resolver tarefas sem complicação.',
      principlesTitle: 'Princípios do produto',
      principles: [
        'Conteúdo útil antes de monetização.',
        'Experiência limpa e responsiva em mobile e desktop.',
        'Processamento local quando possível, para mais privacidade.',
        'Arquitetura escalável para novas tools sem retrabalho.',
      ],
      qualityTitle: 'Compromisso de qualidade',
      qualityParagraph:
        'Mantemos páginas institucionais claras, políticas transparentes e navegação simples. Isso fortalece a confiança dos usuários e de plataformas de anúncios como o Google AdSense.',
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
        'Links úteis para continuar tarefas parecidas sem voltar para a busca.',
      trustTitle: 'Privacidade e processamento local',
      trustText:
        'As ferramentas desta página rodam no navegador e não enviam o conteúdo digitado para backend. Isso melhora privacidade, reduz latência e ajuda na experiência mobile.',
      cryptoRelatedTitle: 'Outras conversões relacionadas',
      cryptoRelatedDescription:
        'Links internos leves para combinações próximas e úteis do mesmo contexto técnico.',
      cryptoPopularTitle: 'Conversões populares',
      cryptoPopularDescription:
        'Conversões frequentes como gwei para ETH, sat para BTC e lamport para SOL.',
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
        'Global hub of free online tools for everyday tasks, with fast UX, no sign-up, and no login in Portuguese, English, and Spanish.',
      home: {
        title: 'Free Online Tools for Creators, Marketers, and Developers',
        description:
          'Use practical web tools with fast workflows, free access, no sign-up, no login, and privacy-friendly local processing.',
        keywords: [
          'free online tools',
          'free online tools no sign up',
          'free online tools no login',
          'web productivity tools',
          'developer tools online',
          'fast browser tools',
        ],
      },
      tools: {
        title: 'All Online Tools',
        description:
          'Explore focused online tools with clear pages, free access, no sign-up, and quick workflows for desktop and mobile.',
        keywords: [
          'online tools list',
          'free web utilities',
          'tools without sign up',
          'tools without login',
          'browser tools',
        ],
      },
      about: {
        title: 'About This Project',
        description:
          'Learn how Tools Lucasqc is built to deliver useful tools with clean UX and transparent privacy practices.',
        keywords: ['about tools lucasqc', 'web tools project', 'web tools mission'],
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
      tagline: 'Fast online tools for practical workflows',
      rightsReserved: 'All rights reserved.',
    },
    home: {
      h1: 'Useful online tools for everyday tasks',
      intro:
        'Find and use free online tools to convert, calculate, generate, visualize and solve common daily tasks, all in one place with no sign-up and no login.',
      featuredToolsTitle: 'Featured tools',
      viewAllTools: 'View all tools',
      growthTitle: 'Built for fast everyday workflows',
      growthParagraphs: [
        'Each tool has its own focused page with a quick guide, FAQ, and direct actions so users can finish tasks quickly.',
        'Navigation stays intentionally lightweight to reduce clutter, helping users reach key actions fast on both desktop and mobile.',
      ],
    },
    toolsIndex: {
      h1: 'All tools',
      intro:
        'A focused catalog with one page per utility. Every tool includes clear context, FAQ, and practical steps for quick use.',
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
        'Tools Lucasqc was created to ship practical web utilities that are fast, simple, and useful in real workflows.',
      principlesTitle: 'Product principles',
      principles: [
        'Useful content before monetization.',
        'Clean responsive UX across mobile and desktop.',
        'Local processing whenever possible for stronger privacy.',
        'Scalable architecture for adding new tools consistently.',
      ],
      qualityTitle: 'Quality commitment',
      qualityParagraph:
        'We keep institutional pages clear, policies transparent, and navigation straightforward. This helps build trust with users and ad platforms such as Google AdSense.',
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
        'Helpful links to continue similar tasks without starting over.',
      trustTitle: 'Privacy and local processing',
      trustText:
        'Tools on this page run directly in your browser and do not send entered content to a backend. This improves privacy and reduces latency.',
      cryptoRelatedTitle: 'Related conversions',
      cryptoRelatedDescription:
        'Internal links to nearby conversion combinations that match similar technical intent.',
      cryptoPopularTitle: 'Popular conversions',
      cryptoPopularDescription:
        'Frequently used conversions such as gwei to ETH, sat to BTC, and lamport to SOL.',
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
        'Hub internacional de herramientas online gratis para tareas cotidianas, con UX rápida, sin registro y sin login en portugués, inglés y español.',
      home: {
        title: 'Herramientas Online Gratis para Productividad y Desarrollo',
        description:
          'Usa utilidades web prácticas, gratis, sin registro y sin login, con procesamiento local para una experiencia más rápida y confiable.',
        keywords: [
          'herramientas online gratis',
          'herramientas online sin registro',
          'herramientas online sin login',
          'utilidades web',
          'herramientas para desarrolladores',
          'herramientas rápidas',
        ],
      },
      tools: {
        title: 'Todas las herramientas online',
        description:
          'Directorio de herramientas gratis, sin registro y sin login, con páginas claras y flujo rápido para móvil y escritorio.',
        keywords: [
          'lista de herramientas online',
          'utilidades web gratis',
          'herramientas sin registro',
          'herramientas sin login',
          'tools en navegador',
        ],
      },
      about: {
        title: 'Sobre este proyecto',
        description:
          'Conoce cómo Tools Lucasqc está construido para ofrecer herramientas útiles con UX limpia y políticas transparentes.',
        keywords: ['sobre tools lucasqc', 'proyecto herramientas web', 'herramientas web'],
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
      tagline: 'Herramientas online rápidas y útiles, sin complicaciones',
      rightsReserved: 'Todos los derechos reservados.',
    },
    home: {
      h1: 'Herramientas online útiles para el día a día',
      intro:
        'Encuentra y usa herramientas online gratis para convertir, calcular, generar, visualizar y resolver tareas cotidianas, todo en un solo lugar, sin registro y sin login.',
      featuredToolsTitle: 'Herramientas destacadas',
      viewAllTools: 'Ver todas las herramientas',
      growthTitle: 'Diseñadas para uso rápido',
      growthParagraphs: [
        'Cada herramienta tiene su propia página con guía rápida, FAQ y acciones directas para completar la tarea sin perder tiempo.',
        'La navegación se mantiene ligera para evitar ruido visual y facilitar el uso en móvil y escritorio.',
      ],
    },
    toolsIndex: {
      h1: 'Todas las herramientas',
      intro:
        'Catálogo enfocado con una página por utilidad. Cada herramienta incluye contexto, FAQ y pasos prácticos de uso.',
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
        'Tools Lucasqc nace para ofrecer utilidades web realmente prácticas, rápidas y fáciles de usar en tareas reales.',
      principlesTitle: 'Principios del producto',
      principles: [
        'Contenido útil antes que monetización.',
        'Experiencia limpia y responsive en móvil y escritorio.',
        'Procesamiento local cuando sea posible para mayor privacidad.',
        'Arquitectura escalable para nuevas herramientas sin retrabajo.',
      ],
      qualityTitle: 'Compromiso de calidad',
      qualityParagraph:
        'Mantenemos páginas institucionales claras, políticas transparentes y navegación simple. Esto fortalece la confianza de usuarios y plataformas de anuncios como Google AdSense.',
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
        'Enlaces útiles para continuar tareas parecidas sin empezar de cero.',
      trustTitle: 'Privacidad y procesamiento local',
      trustText:
        'Las herramientas de esta página se ejecutan en el navegador y no envían automáticamente el contenido ingresado a un backend. Esto mejora privacidad y reduce latencia.',
      cryptoRelatedTitle: 'Otras conversiones relacionadas',
      cryptoRelatedDescription:
        'Enlaces internos ligeros para combinaciones cercanas dentro del mismo contexto técnico.',
      cryptoPopularTitle: 'Conversiones populares',
      cryptoPopularDescription:
        'Conversiones frecuentes como gwei a ETH, sat a BTC y lamport a SOL.',
      conversionBreadcrumbLabel: 'Conversor de Unidades Cripto',
      conversionSearchIntent:
        'Usuarios que buscan conversión directa entre dos unidades técnicas del mismo activo cripto.',
    },
    qrToolUi: {
      fromToConnector: 'a',
    },
  },
  zh: {
    languageName: '中文',
    languageSwitcherLabel: '语言',
    common: {
      home: '首页',
      tools: '工具',
      about: '关于',
      contact: '联系我们',
      privacyPolicy: '隐私政策',
      terms: '使用条款',
    },
    seo: {
      siteDefaultTitle: '在线工具',
      siteDefaultDescription:
        '免费在线工具集合,快速好用、无需注册、无需登录,提供葡萄牙语、英语、西班牙语和中文版本,满足日常任务需求。',
      home: {
        title: '免费在线工具:创作者、营销人员与开发者的效率利器',
        description:
          '使用便捷的网页工具,免费、无需注册、无需登录,支持本地处理以保护隐私,快速完成常见任务。',
        keywords: [
          '免费在线工具',
          '在线工具无需注册',
          '在线工具无需登录',
          '网页效率工具',
          '开发者在线工具',
          '浏览器快速工具',
        ],
      },
      tools: {
        title: '全部在线工具',
        description:
          '浏览专注实用的在线工具,页面清晰、免费使用、无需注册,支持桌面和移动端快速操作。',
        keywords: [
          '在线工具列表',
          '免费网页工具',
          '无需注册的工具',
          '无需登录的工具',
          '浏览器工具',
        ],
      },
      about: {
        title: '关于本项目',
        description:
          '了解 Tools Lucasqc 如何打造实用工具,注重简洁体验与透明的隐私实践。',
        keywords: ['关于 tools lucasqc', '网页工具项目', '网页工具使命'],
      },
      contact: {
        title: '联系我们',
        description: 'Tools Lucasqc 在线工具的官方支持与合作联系渠道。',
        keywords: ['联系在线工具', '工具支持', '商务合作'],
      },
      privacy: {
        title: '隐私政策',
        description:
          '了解 Tools Lucasqc 如何处理浏览器数据、Cookie、广告集成以及用户隐私权利。',
        keywords: ['隐私政策', 'cookie', '数据处理', '广告政策'],
      },
      terms: {
        title: '使用条款',
        description:
          '使用 Tools Lucasqc 的条款,包括用户责任、平台限制以及内容所有权。',
        keywords: ['使用条款', '使用条件', '责任声明'],
      },
      qrCodeFallback: {
        title: '免费二维码生成器,无需注册',
        description:
          '即时生成二维码,添加中心Logo,直接在浏览器中导出 PNG、JPEG、WEBP、SVG 或 PDF 文件。',
        keywords: ['免费二维码生成器', '二维码生成无需注册'],
      },
      htmlPdfJsonFallback: {
        title: 'HTML 查看器、PDF 查看器与 JSON 格式化工具',
        description:
          '安全预览 HTML、打开本地 PDF 文件,并直接在浏览器中格式化或压缩 JSON。',
        keywords: ['在线json格式化', 'html查看器', '浏览器pdf查看器'],
      },
      cryptoFallback: {
        title: '加密货币单位换算器',
        description:
          '换算 BTC、ETH、SOL、USDT 等加密货币单位,精确本地计算,无需外部 API。',
        keywords: ['加密货币单位换算', '聪换算器', 'gwei换算eth'],
      },
      cryptoConversionNotFound: {
        title: '未找到该换算页面',
        description:
          '当前请求的换算页面暂不可用。请浏览加密货币单位换算器查看相关换算组合。',
        keywords: ['加密货币单位换算器'],
      },
    },
    header: {
      goHomeAriaLabel: '前往 Tools Lucasqc 首页',
      navLabel: '主导航',
    },
    footer: {
      goHomeAriaLabel: '前往 Tools Lucasqc 首页',
      navLabel: '机构链接',
      tagline: '快速实用的在线工具',
      rightsReserved: '版权所有。',
    },
    home: {
      h1: '解决日常任务的实用在线工具',
      intro:
        '查找并使用免费在线工具进行转换、计算、生成和可视化,一站式解决常见日常任务,无需注册、无需登录。',
      featuredToolsTitle: '精选工具',
      viewAllTools: '查看全部工具',
      growthTitle: '为高效日常工作流而生',
      growthParagraphs: [
        '每个工具都有独立的专属页面,配有快速指南、常见问题和直接操作入口,帮助用户迅速完成任务。',
        '导航设计刻意保持简洁,减少干扰,让用户无论在电脑还是手机上都能快速找到关键功能。',
      ],
    },
    toolsIndex: {
      h1: '全部工具',
      intro:
        '专注实用的工具目录,每个工具一个页面。所有工具都包含清晰说明、常见问题和实用操作步骤。',
      searchLabel: '搜索工具',
      searchPlaceholder: '例如:json、聪、pdf',
      searchButton: '搜索',
      resultsLabel: '个结果',
      emptyMessage: '没有找到匹配的工具,可以试试这些关键词',
      emptyHints: ['聪', 'json', 'pdf'],
    },
    about: {
      h1: '关于 Tools Lucasqc',
      intro:
        'Tools Lucasqc 致力于打造快速、简单、真正实用的网页工具,服务于真实的工作流程。',
      principlesTitle: '产品原则',
      principles: [
        '实用内容优先于商业化。',
        '桌面和移动端均保持简洁的响应式体验。',
        '尽可能采用本地处理,更好地保护隐私。',
        '可扩展的架构,便于持续、稳定地新增工具。',
      ],
      qualityTitle: '质量承诺',
      qualityParagraph:
        '我们保持机构页面清晰、政策透明、导航直观。这有助于建立用户信任,也符合 Google AdSense 等广告平台的要求。',
    },
    contact: {
      h1: '联系我们',
      intro:
        '如需支持、反馈、内容纠错或商务合作,请通过下方的官方联系渠道与我们联系。',
      emailTitle: '邮箱',
      responseTimeTitle: '响应时间',
      responseTimeParagraph:
        '我们通常在2个工作日内回复。附带清晰复现步骤的技术问题反馈会被优先处理。',
      bugReportTitle: '提交问题反馈的建议',
      bugReportItems: [
        '提供具体的页面链接。',
        '描述预期行为与实际出现的问题。',
        '注明使用的浏览器、设备和大致发生时间。',
      ],
    },
    privacy: {
      h1: '隐私政策',
      intro:
        '本政策说明 Tools Lucasqc 如何处理浏览信息,以及我们为保护用户所遵循的做法。',
      sections: [
        {
          title: '1. 工具中处理的数据',
          body:
            '核心工具在设计上尽可能在浏览器本地处理数据。也就是说,你在工具字段中输入的内容不会自动发送到我们的服务器。',
        },
        {
          title: '2. Cookie 与统计分析',
          body:
            '我们可能使用技术性和统计性 Cookie,以提升性能、稳定性和使用体验。广告合作伙伴也可能根据其自身政策使用 Cookie。',
        },
        {
          title: '3. 广告',
          body:
            '本网站可能展示来自 Google AdSense 等服务商的广告。广告投放受合作伙伴政策约束,包括 Cookie 使用和基于兴趣的个性化规则。',
        },
        {
          title: '4. 用户权利',
          body:
            '你可以通过联系页面就数据和隐私相关事项提出问题。我们会定期审查本政策,以保持透明与合规。',
        },
        {
          title: '5. 政策更新',
          body:
            '我们可能会更新本页面,以反映产品改进、法律变化或新的功能集成。建议你定期查看。',
        },
      ],
    },
    terms: {
      h1: '使用条款',
      intro: '使用本网站即表示你同意以下条款。如果你不同意,请停止使用本站工具。',
      sections: [
        {
          title: '1. 工具性质',
          body:
            '本站提供的工具为辅助性工具,不能替代专业的技术、法律、会计或财务建议。',
        },
        {
          title: '2. 使用责任',
          body:
            '用户需自行核实结果后再做出重要决策。尽管我们进行质量把控,不同环境和解读方式仍可能存在局限性。',
        },
        {
          title: '3. 知识产权',
          body:
            '文本内容、网站结构和视觉组件均受相关权利保护。未经授权不得完整复制。',
        },
        {
          title: '4. 可用性与变更',
          body:
            '出于维护、改进或第三方政策调整的需要,我们可能在不预先通知的情况下更新、暂停或移除功能。',
        },
        {
          title: '5. 联系方式',
          body: '如对本条款有疑问,可通过网站联系页面提交。',
        },
      ],
    },
    notFound: {
      title: '页面未找到',
      description: '你请求的网址不存在或已被移动。请使用下方链接返回首页。',
      cta: '返回首页',
    },
    toolCard: {
      openTool: '打开工具',
      openToolAriaPrefix: '打开',
    },
    toolShell: {
      useToolTitle: '使用该工具',
      contentTitle: '快速指南与实用说明',
      faqTitle: '常见问题',
      relatedToolsTitle: '其他实用工具',
      relatedToolsDescription: '相关链接,帮助你继续完成类似任务,无需重新开始。',
      trustTitle: '隐私与本地处理',
      trustText:
        '本页面的工具直接在你的浏览器中运行,不会将输入内容发送到后端服务器。这样可以提升隐私保护并降低延迟。',
      cryptoRelatedTitle: '相关换算',
      cryptoRelatedDescription: '与当前换算意图相近的内部链接推荐。',
      cryptoPopularTitle: '热门换算',
      cryptoPopularDescription:
        '常用换算,例如 gwei 换算 ETH、聪(sat)换算 BTC、lamport 换算 SOL。',
      conversionBreadcrumbLabel: '加密货币单位换算器',
      conversionSearchIntent:
        '用户希望在同一加密资产的两个技术单位之间进行直接换算。',
    },
    qrToolUi: {
      fromToConnector: '至',
    },
  },
};

export const getDictionary = (locale: AppLocale): SiteDictionary => dictionaries[locale];
