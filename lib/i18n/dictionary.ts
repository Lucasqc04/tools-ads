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
    catalogTitle: string;
    viewAllTools: string;
    guideTitle: string;
    guideParagraphs: [string, string];
  };
  toolsIndex: {
    h1: string;
    intro: string;
    searchLabel: string;
    searchPlaceholder: string;
    searchButton: string;
    resultsLabel: {
      singular: string;
      plural: string;
      catalog: string;
      showing: string;
    };
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
    expandTool: string;
    backToPage: string;
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
        title: 'Ferramentas Online Grátis para o Dia a Dia',
        description:
          'Converta arquivos, valide Pix e boletos, formate JSON e encontre utilitários para desenvolvimento, documentos, cripto e jogos. Grátis e sem cadastro.',
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
          'Catálogo de ferramentas online grátis, sem cadastro e sem login, para arquivos, desenvolvimento, cripto, jogos e tarefas do dia a dia.',
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
          'Conheça as ferramentas do Tools Lucasqc para arquivos, desenvolvimento, cripto, jogos e tarefas cotidianas, além de como enviar sugestões e correções.',
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
          'Política de privacidade do Tools Lucasqc: dados tratados nas ferramentas, métricas de uso, cookies, publicidade e como falar com a gente.',
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
      h1: 'Ferramentas online para arquivos, código e tarefas do dia a dia',
      intro:
        'O Tools Lucasqc reúne conversores de arquivos, calculadoras e utilitários para desenvolvimento, documentos, cripto, jogos e tarefas cotidianas. Grátis e sem cadastro.',
      catalogTitle: 'Mais acessadas',
      viewAllTools: 'Catálogo completo',
      guideTitle: 'Como encontrar a ferramenta certa',
      guideParagraphs: [
        'Converta imagens e arquivos, valide a estrutura de Pix e boletos, formate JSON ou prepare arquivos para redes sociais. Cada página apresenta instruções e limites relacionados à tarefa.',
        'O catálogo atende quem desenvolve ou testa software, trabalha com documentos e mídia, configura jogos ou precisa resolver uma tarefa pontual. Busque pelo nome ou use os filtros de categoria e jogo.',
      ],
    },
    toolsIndex: {
      h1: 'Todas as ferramentas',
      intro: 'Busque pelo nome, tarefa ou categoria e abra a ferramenta que resolve o que você precisa.',
      searchLabel: 'Buscar ferramenta',
      searchPlaceholder: 'Buscar: JSON, boleto, PDF',
      searchButton: 'Buscar',
      resultsLabel: {
        singular: 'ferramenta encontrada',
        plural: 'ferramentas encontradas',
        catalog: 'ferramentas no catálogo',
        showing: 'exibidas de',
      },
      emptyMessage: 'Nenhuma ferramenta encontrada para essa busca. Tente termos como',
      emptyHints: ['satoshi', 'json', 'pdf'],
    },
    about: {
      h1: 'Sobre o Tools Lucasqc',
      intro:
        'O Tools Lucasqc reúne ferramentas web para converter arquivos, fazer cálculos, trabalhar com dados de desenvolvimento e configurar recursos para jogos. O catálogo também inclui utilitários para QR Codes, Pix, boletos e tarefas cotidianas.',
      principlesTitle: 'O que você encontra',
      principles: [
        'Ferramentas para arquivos, desenvolvimento, cripto, jogos e tarefas cotidianas.',
        'Instruções e limitações relacionadas ao funcionamento de cada ferramenta.',
        'Informações sobre processamento local ou uso de serviços quando isso se aplica.',
      ],
      qualityTitle: 'Contato e correções',
      qualityParagraph:
        'Encontrou uma informação incorreta ou uma ferramenta com problema? Acesse a página Contato e envie o link da ferramenta, o que aconteceu e os passos para reproduzir.',
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
        'Esta política explica o que acontece com dados de navegação e informações inseridas nas ferramentas do Tools Lucasqc.',
      sections: [
        {
          title: '1. Dados processados nas ferramentas',
          body:
            'O tratamento depende da ferramenta. Pix e boleto são processados no navegador. A conversão de HEIC/HEIF e a compressão de vídeos menores podem enviar o arquivo ao servidor do site; vídeos acima de 512 MB são processados no navegador. A prévia Open Graph envia a URL informada ao servidor para buscar metadados. O baixador de vídeos envia o link informado ao servidor para localizar a mídia, e o arquivo é baixado pelo navegador. O editor de etiquetas ZPL envia o código ZPL, pelo servidor do site, ao serviço externo Labelary para gerar a imagem ou o PDF. Consultas de IP, DNS, endereços (CEP) e cripto podem usar serviços externos. A caixa de e-mail temporário mantém endereço e mensagens no servidor até a expiração configurada ou a exclusão. Leia o aviso da ferramenta e evite inserir dados sensíveis quando não forem necessários.',
        },
        {
          title: '2. Salas em tempo real e dados locais',
          body:
            'Chamadas com compartilhamento de tela, transferência entre dispositivos por link e celular como webcam usam o servidor do site para criar a sala e trocar os sinais de conexão: nome exibido, descrições WebRTC e candidatos de rede, que podem incluir endereços IP. Esses dados ficam temporariamente em um banco Upstash Redis e são removidos quando a sala expira ou é encerrada. Arquivos, mensagens, áudio e vídeo seguem direto entre os dispositivos. Por padrão, a conexão consulta um servidor STUN do Google, e um identificador derivado do IP (hash) é usado temporariamente para limitar abusos. Algumas ferramentas guardam rascunhos, preferências ou histórico apenas no armazenamento local do seu navegador, como o editor de Markdown, o editor de etiquetas ZPL, o gerador de pessoa fake e o autenticador, que só salva a chave se você pedir. Você pode apagar esses dados limpando os dados do site no navegador.',
        },
        {
          title: '3. Métricas e preferências',
          body:
            'O site usa Vercel Analytics para métricas de visita. Se um contêiner estiver configurado, o site também carrega o Google Tag Manager, cujas tags podem tratar dados conforme sua configuração. Os eventos das ferramentas registram identificadores e metadados de uso, sem incluir o conteúdo digitado ou os arquivos. O idioma escolhido fica guardado nos cookies NEXT_LOCALE e LOCALE_REDIRECTED e no armazenamento local do navegador. Consulte as políticas dos serviços envolvidos para saber como eles tratam dados de navegação.',
        },
        {
          title: '4. Publicidade',
          body:
            'O script e os espaços de anúncio do Google AdSense estão desativados no código atual. Se a publicidade for ativada no futuro, esta política será atualizada antes da ativação.',
        },
        {
          title: '5. Direitos do usuário',
          body:
            'Você pode solicitar esclarecimentos sobre dados e práticas de privacidade por meio da página de contato. Revisamos periodicamente esta política para manter clareza e conformidade.',
        },
        {
          title: '6. Atualizações desta política',
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
        'O endereço acessado não existe ou foi movido. Volte para a página inicial para encontrar a ferramenta que você procura.',
      cta: 'Voltar para a página inicial',
    },
    toolCard: {
      openTool: 'Abrir ferramenta',
      openToolAriaPrefix: 'Abrir',
    },
    toolShell: {
      useToolTitle: 'Use a ferramenta',
      expandTool: 'Expandir ferramenta',
      backToPage: 'Voltar à página',
      contentTitle: 'Guia rápido e contexto de uso',
      faqTitle: 'Perguntas frequentes',
      relatedToolsTitle: 'Outras ferramentas úteis',
      relatedToolsDescription:
        'Links úteis para continuar tarefas parecidas sem voltar para a busca.',
      trustTitle: 'Privacidade e tratamento de dados',
      trustText:
        'O tratamento de dados varia conforme a ferramenta: algumas operam no navegador; outras enviam arquivos, links ou solicitações ao servidor do site ou a um serviço externo. Consulte as instruções desta página antes de enviar dados, especialmente se forem sensíveis.',
      cryptoRelatedTitle: 'Outras conversões relacionadas',
      cryptoRelatedDescription:
        'Combinações próximas dentro do mesmo contexto técnico.',
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
        title: 'Free Online Tools for Everyday Tasks',
        description:
          'Convert files, validate Pix and boleto data, format JSON, and find utilities for development, documents, crypto, and games. Free to use, with no account required.',
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
          'Explore Tools Lucasqc utilities for files, development, crypto, games, and everyday tasks, and learn how to send feedback or corrections.',
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
      h1: 'Online tools for files, code, and everyday tasks',
      intro:
        'Tools Lucasqc brings together file converters, calculators, and utilities for development, documents, crypto, games, and everyday tasks. Free to use, with no account required.',
      catalogTitle: 'Popular tools',
      viewAllTools: 'Full catalog',
      guideTitle: 'How to find the right tool',
      guideParagraphs: [
        'Convert images and files, check Pix and boleto structures, format JSON, or prepare images for social networks. Each tool page explains its workflow and relevant limits.',
        'The catalog is for people who build or test software, work with documents and media, configure games, or need a quick utility. Search by name or use the category and game filters.',
      ],
    },
    toolsIndex: {
      h1: 'All tools',
      intro: 'Find the right tool by name, task, category, or game.',
      searchLabel: 'Search tools',
      searchPlaceholder: 'Search: JSON, PDF, QR code',
      searchButton: 'Search',
      resultsLabel: {
        singular: 'tool found',
        plural: 'tools found',
        catalog: 'tools in the catalog',
        showing: 'shown of',
      },
      emptyMessage: 'No tools matched this query. Try terms like',
      emptyHints: ['satoshi', 'json', 'pdf'],
    },
    about: {
      h1: 'About Tools Lucasqc',
      intro:
        'Tools Lucasqc brings together web tools for file conversion, calculations, development data, and game configuration. The catalog also includes utilities for QR codes, Brazilian Pix payments, boletos, and everyday tasks.',
      principlesTitle: 'What you can find here',
      principles: [
        'Tools for files, development, crypto, games, and everyday tasks.',
        'Instructions and limitations related to how each tool works.',
        'Processing details when a tool runs locally or uses a service.',
      ],
      qualityTitle: 'Contact and corrections',
      qualityParagraph:
        'Found incorrect information or a tool issue? Visit the Contact page and share the tool URL, what happened, and the steps to reproduce it.',
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
        'This policy explains what happens to browsing data and information entered into Tools Lucasqc tools.',
      sections: [
        {
          title: '1. Data processed in tools',
          body:
            'Data handling depends on the tool. Pix and boleto checks run in the browser. HEIC/HEIF conversion and compression of smaller videos may send the file to the site server; videos over 512 MB are processed in the browser. The Open Graph preview sends the URL to our server to retrieve metadata. IP, DNS, and crypto lookups may use external services. The temporary email inbox keeps its address and messages on the server until the configured expiry or deletion. Read the tool notice and avoid entering sensitive data when it is not needed.',
        },
        {
          title: '2. Analytics and preferences',
          body:
            'The site uses Vercel Analytics for visit metrics. When NEXT_PUBLIC_GTM_ID is configured, it also loads Google Tag Manager, whose tags may process data according to their configuration. Tool events record identifiers and usage metadata, not entered content or files. The language selector stores your preference in the NEXT_LOCALE cookie and browser local storage. See the relevant providers’ policies for details on browsing data.',
        },
        {
          title: '3. Advertising',
          body:
            'The Google AdSense script and ad spaces are disabled in the current code. If advertising is enabled in the future, this policy will be updated first.',
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
      expandTool: 'Expand tool',
      backToPage: 'Back to page',
      contentTitle: 'Quick guide and practical context',
      faqTitle: 'Frequently asked questions',
      relatedToolsTitle: 'Other useful tools',
      relatedToolsDescription:
        'Helpful links to continue similar tasks without starting over.',
      trustTitle: 'Privacy and data handling',
      trustText:
        'Data handling varies by tool: some run in your browser, while others send files, links, or requests to the site server or an external service. Check this page’s instructions before sending data, especially sensitive data.',
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
        title: 'Herramientas Online Gratis para el Día a Día',
        description:
          'Convierte archivos, revisa datos Pix y boletos brasileños, formatea JSON y encuentra utilidades para desarrollo, documentos, cripto y juegos. Gratis y sin registro.',
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
          'Explora herramientas de Tools Lucasqc para archivos, desarrollo, cripto, juegos y tareas cotidianas, y descubre cómo enviar sugerencias o correcciones.',
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
      h1: 'Herramientas online para archivos, código y tareas cotidianas',
      intro:
        'Tools Lucasqc reúne conversores de archivos, calculadoras y utilidades para desarrollo, documentos, cripto, juegos y tareas cotidianas. Gratis y sin registro.',
      catalogTitle: 'Más utilizadas',
      viewAllTools: 'Catálogo completo',
      guideTitle: 'Cómo encontrar la herramienta adecuada',
      guideParagraphs: [
        'Convierte imágenes y archivos, revisa la estructura de Pix y boletos brasileños, da formato a JSON o prepara imágenes para redes sociales. Cada herramienta explica su flujo y sus límites relevantes.',
        'El catálogo es para quienes desarrollan o prueban software, trabajan con documentos y medios, configuran juegos o necesitan una utilidad rápida. Busca por nombre o usa los filtros de categoría y juego.',
      ],
    },
    toolsIndex: {
      h1: 'Todas las herramientas',
      intro: 'Busca por nombre, tarea, categoría o juego y abre la herramienta adecuada.',
      searchLabel: 'Buscar herramienta',
      searchPlaceholder: 'Buscar: JSON, boleto, PDF',
      searchButton: 'Buscar',
      resultsLabel: {
        singular: 'herramienta encontrada',
        plural: 'herramientas encontradas',
        catalog: 'herramientas en el catálogo',
        showing: 'mostradas de',
      },
      emptyMessage: 'No se encontraron herramientas para esta búsqueda. Prueba con',
      emptyHints: ['satoshi', 'json', 'pdf'],
    },
    about: {
      h1: 'Sobre Tools Lucasqc',
      intro:
        'Tools Lucasqc reúne herramientas web para convertir archivos, hacer cálculos, trabajar con datos de desarrollo y configurar juegos. El catálogo también incluye utilidades para códigos QR, Pix, boletos brasileños y tareas cotidianas.',
      principlesTitle: 'Qué encontrarás',
      principles: [
        'Herramientas para archivos, desarrollo, cripto, juegos y tareas cotidianas.',
        'Instrucciones y límites relacionados con el funcionamiento de cada herramienta.',
        'Detalles de procesamiento cuando una herramienta funciona localmente o usa un servicio.',
      ],
      qualityTitle: 'Contacto y correcciones',
      qualityParagraph:
        '¿Encontraste información incorrecta o un problema? Visita la página de Contacto e incluye el enlace de la herramienta, qué ocurrió y los pasos para reproducirlo.',
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
        'Esta política explica qué ocurre con los datos de navegación y la información que ingresas en las herramientas de Tools Lucasqc.',
      sections: [
        {
          title: '1. Datos procesados en las herramientas',
          body:
            'El tratamiento depende de cada herramienta. Pix y los boletos brasileños se procesan en el navegador. La conversión HEIC/HEIF y la compresión de videos pequeños pueden enviar el archivo al servidor del sitio; los videos de más de 512 MB se procesan en el navegador. La vista previa Open Graph envía la URL al servidor para obtener metadatos. Las consultas de IP, DNS y cripto pueden usar servicios externos. La bandeja de correo temporal conserva la dirección y los mensajes en el servidor hasta el vencimiento configurado o su eliminación. Lee el aviso de cada herramienta y evita ingresar datos sensibles cuando no sean necesarios.',
        },
        {
          title: '2. Métricas y preferencias',
          body:
            'El sitio usa Vercel Analytics para medir visitas. Cuando se configura NEXT_PUBLIC_GTM_ID, también carga Google Tag Manager, cuyas etiquetas pueden tratar datos según su configuración. Los eventos de las herramientas registran identificadores y metadatos de uso, no el contenido ingresado ni los archivos. El selector de idioma guarda tu preferencia en la cookie NEXT_LOCALE y en el almacenamiento local del navegador. Consulta las políticas de los proveedores para conocer cómo tratan los datos de navegación.',
        },
        {
          title: '3. Publicidad',
          body:
            'El script y los espacios de Google AdSense están desactivados en el código actual. Si activamos publicidad en el futuro, actualizaremos esta política antes.',
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
      expandTool: 'Expandir herramienta',
      backToPage: 'Volver a la página',
      contentTitle: 'Guía rápida y contexto de uso',
      faqTitle: 'Preguntas frecuentes',
      relatedToolsTitle: 'Otras herramientas útiles',
      relatedToolsDescription:
        'Enlaces útiles para continuar tareas parecidas sin empezar de cero.',
      trustTitle: 'Privacidad y tratamiento de datos',
      trustText:
        'El tratamiento de datos varía según la herramienta: algunas funcionan en el navegador y otras envían archivos, enlaces o solicitudes al servidor del sitio o a un servicio externo. Lee las instrucciones de esta página antes de enviar datos, especialmente si son sensibles.',
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
        title: '日常实用免费在线工具',
        description:
          '使用免费在线工具转换文件、计算数值、生成内容并处理日常任务。按名称或类别搜索,快速找到所需工具。',
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
          '了解 Tools Lucasqc 提供的文件、开发、加密货币、游戏和日常工具,以及如何提交建议或更正。',
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
      h1: '处理文件、代码和日常任务的在线工具',
      intro:
        'Tools Lucasqc 提供文件转换、计算以及开发、文档、加密货币、游戏和日常任务工具。免费使用,无需注册。',
      catalogTitle: '热门工具',
      viewAllTools: '完整工具目录',
      guideTitle: '如何找到合适的工具',
      guideParagraphs: [
        '你可以转换文件、检查 Pix 与巴西 boleto 的格式、整理 JSON,或为社交平台准备图片。每个工具页面会说明操作方式和相关限制。',
        '目录适合开发或测试软件、处理文档和媒体、配置游戏,或临时完成一项任务的人。可按名称搜索,也可按类别或游戏筛选。',
      ],
    },
    toolsIndex: {
      h1: '全部工具',
      intro: '按名称、任务、类别或游戏查找所需工具。',
      searchLabel: '搜索工具',
      searchPlaceholder: '搜索: JSON、PDF',
      searchButton: '搜索',
      resultsLabel: {
        singular: '个工具',
        plural: '个工具',
        catalog: '个目录工具',
        showing: '项，共',
      },
      emptyMessage: '没有找到匹配的工具,可以试试这些关键词',
      emptyHints: ['聪', 'json', 'pdf'],
    },
    about: {
      h1: '关于 Tools Lucasqc',
      intro:
        'Tools Lucasqc 汇集文件转换、计算、开发数据和游戏配置工具,也提供二维码、Pix、巴西 boleto 及日常任务相关工具。',
      principlesTitle: '网站工具',
      principles: [
        '用于文件、开发、加密货币、游戏和日常任务。',
        '页面会介绍工具的操作方式和相关限制。',
        '适用时会说明数据在本地处理或使用在线服务的情况。',
      ],
      qualityTitle: '联系与纠错',
      qualityParagraph:
        '如果发现信息有误或工具无法正常使用,请前往联系页面,提供工具链接、问题描述和复现步骤。',
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
        '本政策说明 Tools Lucasqc 如何处理浏览数据以及你在工具中输入的信息。',
      sections: [
        {
          title: '1. 工具中处理的数据',
          body:
            '数据处理方式因工具而异。Pix 和巴西 boleto 检查在浏览器中运行。HEIC/HEIF 转换和较小视频的压缩可能会将文件发送到网站服务器；超过 512 MB 的视频在浏览器中处理。Open Graph 预览会将输入的网址发送到服务器以获取元数据。IP、DNS 和加密货币查询可能使用外部服务。临时邮箱地址和邮件会保存在服务器中,直到设定的过期时间或手动删除。请阅读工具提示,并避免输入非必要的敏感数据。',
        },
        {
          title: '2. 统计与偏好设置',
          body:
            '网站使用 Vercel Analytics 统计访问情况。配置 NEXT_PUBLIC_GTM_ID 后,网站也会加载 Google Tag Manager；其中启用的标签可能按其配置处理数据。工具事件记录工具标识和使用元数据,不包含输入内容或文件。语言选择器会将你的偏好保存在 NEXT_LOCALE Cookie 和浏览器本地存储中。第三方服务如何处理浏览数据,请查看其隐私政策。',
        },
        {
          title: '3. 广告',
          body:
            '当前代码已停用 Google AdSense 脚本和广告位。如果将来启用广告,我们会先更新本政策。',
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
      expandTool: '展开工具',
      backToPage: '返回页面',
      contentTitle: '快速指南与实用说明',
      faqTitle: '常见问题',
      relatedToolsTitle: '其他实用工具',
      relatedToolsDescription: '相关链接,帮助你继续完成类似任务,无需重新开始。',
      trustTitle: '隐私与数据处理',
      trustText:
        '数据处理方式因工具而异：有些在浏览器中运行,有些会将文件、链接或请求发送到网站服务器或外部服务。发送数据前请查看本页说明,尤其是敏感信息。',
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
