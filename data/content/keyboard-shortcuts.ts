import type { AppLocale } from '@/lib/i18n/config';
import type { ContentBlock, FaqItem } from '@/types/content';

export type KeyboardShortcutsContent = {
  name: string;
  shortDescription: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  searchIntent: string;
  seoTitle: string;
  seoDescription: string;
  h1: string;
  intro: string;
  contentBlocks: ContentBlock[];
  faq: FaqItem[];
};

const contentByLocale: Record<AppLocale, KeyboardShortcutsContent> = {
  'pt-br': {
    name: 'Central de Atalhos de Teclado',
    shortDescription:
      'Atalhos de teclado do Windows, macOS, VS Code, Excel, Google Sheets, Chrome, GitHub e Figma com busca, categorias e alternância Windows/Mac.',
    primaryKeyword: 'atalhos de teclado',
    secondaryKeywords: [
      'atalhos de teclado excel',
      'atalhos de teclado vscode',
      'atalhos de teclado windows',
      'atalhos de teclado mac',
      'atalhos de teclado chrome',
      'atalhos de teclado google sheets',
    ],
    searchIntent:
      'Usuarios que querem consultar rapidamente os atalhos de teclado de um app ou sistema especifico, com equivalente Windows/Mac quando aplicavel.',
    seoTitle: 'Central de Atalhos de Teclado | Windows, Mac, VS Code, Excel e Mais',
    seoDescription:
      'Consulte atalhos de teclado do Windows, macOS, VS Code, Excel, Google Sheets, Chrome, GitHub e Figma organizados por categoria, com busca e alternância Windows/Mac.',
    h1: 'Central de Atalhos de Teclado por Aplicativo',
    intro:
      'Escolha um aplicativo ou sistema, busque por ação e alterne entre o atalho de Windows e de Mac quando existir diferença.',
    contentBlocks: [
      {
        title: 'Como usar a central de atalhos',
        paragraphs: [
          'Escolha um aplicativo ou sistema na lista (Windows, macOS, VS Code, Excel, Google Sheets, Chrome, GitHub ou Figma) para ver os atalhos organizados por categoria. Use a busca para filtrar por ação (por exemplo, "copiar" ou "comentário") e, quando o atalho variar entre sistemas, alterne entre Windows e Mac para ver a combinação correta para o seu teclado.',
          'Cada linha mostra a ação e a combinação de teclas correspondente. A lista cobre os atalhos mais usados no dia a dia de cada ferramenta, focando em produtividade real em vez de listas gigantes difíceis de consultar rápido.',
        ],
      },
      {
        title: 'Por que aprender atalhos de teclado',
        paragraphs: [
          'Trocar o mouse por um atalho de teclado economiza segundos em cada ação, e esses segundos somam minutos ao longo do dia de trabalho. Atalhos também reduzem a interrupção do fluxo de raciocínio: em vez de procurar um botão no menu, a ação acontece sem tirar as mãos do teclado.',
        ],
        list: [
          'Comece pelos atalhos de navegação básica do sistema operacional.',
          'Aprenda 3 a 5 atalhos novos por semana em vez de tentar decorar tudo de uma vez.',
          'Use a busca desta página sempre que esquecer um atalho específico.',
          'Confira a versão Mac quando o atalho depender do sistema.',
        ],
      },
      {
        title: 'Cobertura por aplicativo',
        paragraphs: [
          'A central cobre atalhos essenciais de sistema operacional (Windows e macOS), edição de código (VS Code), planilhas (Excel e Google Sheets), navegador (Chrome), controle de versão (GitHub) e design de interface (Figma). Novos aplicativos são adicionados com o tempo.',
        ],
      },
      {
        title: 'Processamento local e privacidade',
        paragraphs: [
          'A busca e a navegação entre aplicativos acontecem inteiramente no seu navegador. Nenhum dado é enviado para um servidor.',
        ],
      },
    ],
    faq: [
      {
        question: 'Os atalhos funcionam em Windows e Mac?',
        answer:
          'Sim, quando o aplicativo tem versão para os dois sistemas você pode alternar entre a combinação de Windows e de Mac.',
      },
      {
        question: 'Quais aplicativos estão disponíveis?',
        answer:
          'Windows, macOS, VS Code, Excel, Google Sheets, Chrome, GitHub e Figma, com mais aplicativos sendo adicionados ao longo do tempo.',
      },
      {
        question: 'Posso buscar um atalho específico?',
        answer:
          'Sim. Use o campo de busca dentro de cada aplicativo para filtrar pela ação que você procura.',
      },
      {
        question: 'É gratuito e funciona no celular?',
        answer:
          'Sim. A ferramenta é gratuita, não exige cadastro e funciona normalmente em navegadores mobile para consulta.',
      },
    ],
  },
  en: {
    name: 'Keyboard Shortcuts Hub',
    shortDescription:
      'Keyboard shortcuts for Windows, macOS, VS Code, Excel, Google Sheets, Chrome, GitHub, and Figma with search, categories, and a Windows/Mac toggle.',
    primaryKeyword: 'keyboard shortcuts',
    secondaryKeywords: [
      'excel keyboard shortcuts',
      'vscode keyboard shortcuts',
      'windows keyboard shortcuts',
      'mac keyboard shortcuts',
      'chrome keyboard shortcuts',
      'google sheets keyboard shortcuts',
    ],
    searchIntent:
      'People who want to quickly look up keyboard shortcuts for a specific app or system, with a Windows/Mac equivalent when applicable.',
    seoTitle: 'Keyboard Shortcuts Hub | Windows, Mac, VS Code, Excel and More',
    seoDescription:
      'Look up keyboard shortcuts for Windows, macOS, VS Code, Excel, Google Sheets, Chrome, GitHub, and Figma organized by category, with search and a Windows/Mac toggle.',
    h1: 'Keyboard Shortcuts Hub by App',
    intro:
      'Pick an app or system, search by action, and switch between the Windows and Mac shortcut when they differ.',
    contentBlocks: [
      {
        title: 'How to use the shortcuts hub',
        paragraphs: [
          'Pick an app or system from the list (Windows, macOS, VS Code, Excel, Google Sheets, Chrome, GitHub, or Figma) to see shortcuts organized by category. Use search to filter by action (e.g. "copy" or "comment"), and when a shortcut differs between systems, switch between Windows and Mac to see the right combination for your keyboard.',
          'Each row shows the action and its key combination. The list covers the most commonly used shortcuts for everyday work in each tool, focused on real productivity rather than a giant list that\'s hard to scan quickly.',
        ],
      },
      {
        title: 'Why learn keyboard shortcuts',
        paragraphs: [
          'Trading a mouse click for a keyboard shortcut saves seconds on every action, and those seconds add up to minutes over a work day. Shortcuts also reduce interruptions to your train of thought: instead of hunting for a menu button, the action happens without taking your hands off the keyboard.',
        ],
        list: [
          'Start with your operating system\'s basic navigation shortcuts.',
          'Learn 3 to 5 new shortcuts a week instead of trying to memorize everything at once.',
          'Use this page\'s search whenever you forget a specific shortcut.',
          'Check the Mac version when a shortcut depends on the system.',
        ],
      },
      {
        title: 'Coverage by app',
        paragraphs: [
          'The hub covers essential operating system shortcuts (Windows and macOS), code editing (VS Code), spreadsheets (Excel and Google Sheets), the browser (Chrome), version control (GitHub), and interface design (Figma). More apps are added over time.',
        ],
      },
      {
        title: 'Local processing and privacy',
        paragraphs: [
          'Search and navigation between apps run entirely in your browser. No data is sent to a server.',
        ],
      },
    ],
    faq: [
      {
        question: 'Do the shortcuts work on both Windows and Mac?',
        answer:
          'Yes, when an app has a version for both systems you can switch between the Windows and Mac combination.',
      },
      {
        question: 'Which apps are available?',
        answer:
          'Windows, macOS, VS Code, Excel, Google Sheets, Chrome, GitHub, and Figma, with more apps being added over time.',
      },
      {
        question: 'Can I search for a specific shortcut?',
        answer:
          'Yes. Use the search box inside each app to filter by the action you\'re looking for.',
      },
      {
        question: 'Is it free and does it work on mobile?',
        answer:
          'Yes. The tool is free, requires no sign-up, and works normally on mobile browsers for reference.',
      },
    ],
  },
  es: {
    name: 'Central de Atajos de Teclado',
    shortDescription:
      'Atajos de teclado de Windows, macOS, VS Code, Excel, Google Sheets, Chrome, GitHub y Figma con búsqueda, categorías y alternancia Windows/Mac.',
    primaryKeyword: 'atajos de teclado',
    secondaryKeywords: [
      'atajos de teclado excel',
      'atajos de teclado vscode',
      'atajos de teclado windows',
      'atajos de teclado mac',
      'atajos de teclado chrome',
      'atajos de teclado google sheets',
    ],
    searchIntent:
      'Personas que quieren consultar rápidamente los atajos de teclado de una app o sistema específico, con el equivalente Windows/Mac cuando aplique.',
    seoTitle: 'Central de Atajos de Teclado | Windows, Mac, VS Code, Excel y Más',
    seoDescription:
      'Consulta atajos de teclado de Windows, macOS, VS Code, Excel, Google Sheets, Chrome, GitHub y Figma organizados por categoría, con búsqueda y alternancia Windows/Mac.',
    h1: 'Central de Atajos de Teclado por Aplicación',
    intro:
      'Elige una app o sistema, busca por acción y alterna entre el atajo de Windows y de Mac cuando exista diferencia.',
    contentBlocks: [
      {
        title: 'Cómo usar la central de atajos',
        paragraphs: [
          'Elige una app o sistema de la lista (Windows, macOS, VS Code, Excel, Google Sheets, Chrome, GitHub o Figma) para ver los atajos organizados por categoría. Usa la búsqueda para filtrar por acción (por ejemplo, "copiar" o "comentario") y, cuando el atajo varíe entre sistemas, alterna entre Windows y Mac para ver la combinación correcta para tu teclado.',
          'Cada fila muestra la acción y la combinación de teclas correspondiente. La lista cubre los atajos más usados en el día a día de cada herramienta, enfocada en productividad real en vez de una lista gigante difícil de consultar rápido.',
        ],
      },
      {
        title: 'Por qué aprender atajos de teclado',
        paragraphs: [
          'Cambiar un clic de mouse por un atajo de teclado ahorra segundos en cada acción, y esos segundos suman minutos a lo largo del día laboral. Los atajos también reducen las interrupciones al hilo de pensamiento: en vez de buscar un botón en el menú, la acción ocurre sin quitar las manos del teclado.',
        ],
        list: [
          'Empieza por los atajos básicos de navegación de tu sistema operativo.',
          'Aprende de 3 a 5 atajos nuevos por semana en vez de intentar memorizar todo de una vez.',
          'Usa la búsqueda de esta página siempre que olvides un atajo específico.',
          'Revisa la versión Mac cuando un atajo dependa del sistema.',
        ],
      },
      {
        title: 'Cobertura por aplicación',
        paragraphs: [
          'La central cubre atajos esenciales del sistema operativo (Windows y macOS), edición de código (VS Code), hojas de cálculo (Excel y Google Sheets), el navegador (Chrome), control de versiones (GitHub) y diseño de interfaz (Figma). Se agregan más apps con el tiempo.',
        ],
      },
      {
        title: 'Procesamiento local y privacidad',
        paragraphs: [
          'La búsqueda y la navegación entre apps funcionan completamente en tu navegador. Ningún dato se envía a un servidor.',
        ],
      },
    ],
    faq: [
      {
        question: '¿Los atajos funcionan en Windows y Mac?',
        answer:
          'Sí, cuando una app tiene versión para ambos sistemas puedes alternar entre la combinación de Windows y de Mac.',
      },
      {
        question: '¿Qué aplicaciones están disponibles?',
        answer:
          'Windows, macOS, VS Code, Excel, Google Sheets, Chrome, GitHub y Figma, con más apps agregándose con el tiempo.',
      },
      {
        question: '¿Puedo buscar un atajo específico?',
        answer:
          'Sí. Usa el cuadro de búsqueda dentro de cada app para filtrar por la acción que buscas.',
      },
      {
        question: '¿Es gratis y funciona en el celular?',
        answer:
          'Sí. La herramienta es gratuita, no requiere registro y funciona con normalidad en navegadores móviles para consulta.',
      },
    ],
  },
};

export const getKeyboardShortcutsContent = (locale: AppLocale): KeyboardShortcutsContent =>
  contentByLocale[locale];
