import type { AppLocale } from '@/lib/i18n/config';
import type { ContentBlock, FaqItem } from '@/types/content';

export type GamerUsernameGeneratorContent = {
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

const contentByLocale: Record<AppLocale, GamerUsernameGeneratorContent> = {
  'pt-br': {
    name: 'Gerador de Nick para Jogos',
    shortDescription:
      'Gere nicknames aleatórios para Fortnite, Free Fire, Roblox, Valorant e outros jogos com estilo clássico, leet speak ou decorado com símbolos.',
    primaryKeyword: 'gerador de nick para jogos',
    secondaryKeywords: [
      'gerador de nome para free fire',
      'gerador de nick fortnite',
      'gerador de nome gamer',
      'nome aleatorio para jogo',
      'gerador de nickname aleatorio',
      'nome para roblox gerador',
    ],
    searchIntent:
      'Jogadores que querem gerar um nome de usuário criativo e disponível para um jogo especifico rapidamente, sem precisar pensar do zero.',
    seoTitle: 'Gerador de Nick para Jogos Grátis | Fortnite, Free Fire, Roblox e Mais',
    seoDescription:
      'Gere nicknames aleatórios para jogos com estilo clássico, leet speak ou decorado com símbolos. Sorteie quantas vezes quiser, favorite os melhores e copie com um clique.',
    h1: 'Gerador de Nick para Jogos Grátis com Estilos e Favoritos',
    intro:
      'Sorteie nicknames aleatórios para o seu jogo favorito, escolha o estilo (clássico, leet speak ou com símbolos) e copie o resultado com um clique.',
    contentBlocks: [
      {
        title: 'Como gerar um nickname para jogos',
        paragraphs: [
          'Escolha o jogo (ou deixe em branco para um nome genérico), o estilo do nome e se quer incluir um número no final. Clique em gerar para sortear uma combinação de palavras, ou continue clicando para ver novas opções até encontrar uma que goste. Favorite os nomes que mais gostou para comparar depois.',
          'O estilo clássico combina um adjetivo e um substantivo (por exemplo, "ShadowWolf"). O estilo leet speak troca algumas letras por números (como "Sh4d0wW0lf"). O estilo com símbolos adiciona um símbolo decorativo no início e no fim do nome.',
        ],
      },
      {
        title: 'Nomes com contexto por jogo',
        paragraphs: [
          'Cada jogo tem um banco de palavras próprio: Valorant usa termos táticos, Minecraft usa termos de construção e mineração, Free Fire e PUBG Mobile usam termos de battle royale, e assim por diante. Isso deixa o nome sorteado mais coerente com o universo do jogo escolhido, em vez de uma combinação genérica.',
        ],
        list: [
          'Sorteie várias vezes até encontrar um nome que soe bem.',
          'Combine o estilo leet speak com um jogo competitivo como Valorant ou CS2.',
          'Use o estilo com símbolos para nomes que chamem mais atenção.',
          'Favorite os melhores resultados para comparar depois.',
        ],
      },
      {
        title: 'Disponibilidade do nome no jogo',
        paragraphs: [
          'A ferramenta gera combinações de palavras e não verifica se o nome já está em uso no jogo escolhido. Depois de escolher um nome, confirme diretamente no cadastro ou nas configurações de perfil do jogo se ele está disponível.',
        ],
      },
      {
        title: 'Processamento local e privacidade',
        paragraphs: [
          'Toda a geração de nomes acontece localmente no seu navegador. Os favoritos ficam salvos apenas no seu dispositivo, e nenhum dado é enviado para um servidor.',
        ],
      },
    ],
    faq: [
      {
        question: 'O gerador verifica se o nome está disponível no jogo?',
        answer:
          'Não. Ele gera combinações de palavras localmente; a disponibilidade final depende do jogo e da sua conta.',
      },
      {
        question: 'Posso escolher o jogo para deixar o nome mais temático?',
        answer:
          'Sim. Cada jogo tem um banco de palavras próprio que deixa o nome sorteado mais coerente com o universo daquele jogo.',
      },
      {
        question: 'O que é o estilo leet speak?',
        answer:
          'É a substituição de algumas letras por números parecidos visualmente (a→4, e→3, i→1, o→0, s→5, t→7), um estilo bastante usado em nicknames gamer.',
      },
      {
        question: 'Os favoritos ficam salvos?',
        answer:
          'Sim. Os nomes favoritados ficam salvos localmente no seu navegador e continuam disponíveis na próxima visita.',
      },
      {
        question: 'É gratuito e funciona no celular?',
        answer:
          'Sim. A ferramenta é gratuita, não exige cadastro e funciona normalmente em navegadores mobile.',
      },
    ],
  },
  en: {
    name: 'Gamer Username Generator',
    shortDescription:
      'Generate random usernames for Fortnite, Free Fire, Roblox, Valorant, and other games with classic, leet speak, or symbol-decorated styles.',
    primaryKeyword: 'gamer username generator',
    secondaryKeywords: [
      'free fire name generator',
      'fortnite username generator',
      'random gaming name generator',
      'random gamertag generator',
      'roblox username generator',
      'cool gamer name generator',
    ],
    searchIntent:
      'Players who want to quickly generate a creative, game-specific username without having to think of one from scratch.',
    seoTitle: 'Gamer Username Generator Free | Fortnite, Free Fire, Roblox and More',
    seoDescription:
      'Generate random gaming usernames with classic, leet speak, or symbol-decorated styles. Reroll as many times as you want, favorite the best ones, and copy with one click.',
    h1: 'Gamer Username Generator with Styles and Favorites',
    intro:
      'Roll random usernames for your favorite game, pick a style (classic, leet speak, or symbols), and copy the result with one click.',
    contentBlocks: [
      {
        title: 'How to generate a gaming username',
        paragraphs: [
          'Pick a game (or leave it blank for a generic name), a style, and whether to include a number at the end. Click generate to roll a word combination, or keep clicking to see new options until you find one you like. Favorite the names you like best to compare later.',
          'The classic style combines an adjective and a noun (e.g. "ShadowWolf"). The leet speak style swaps some letters for numbers (like "Sh4d0wW0lf"). The symbols style adds a decorative symbol at the start and end of the name.',
        ],
      },
      {
        title: 'Game-aware naming',
        paragraphs: [
          'Each game has its own word bank: Valorant uses tactical terms, Minecraft uses building and mining terms, Free Fire and PUBG Mobile use battle royale terms, and so on. This keeps the rolled name in tune with the chosen game\'s world instead of a generic combination.',
        ],
        list: [
          'Reroll a few times until you find a name that sounds right.',
          'Pair the leet speak style with a competitive game like Valorant or CS2.',
          'Use the symbols style for names that stand out more.',
          'Favorite your best results to compare later.',
        ],
      },
      {
        title: 'Name availability in the game',
        paragraphs: [
          'The tool generates word combinations and does not check whether a name is already taken in the chosen game. After picking a name, confirm directly in the game\'s sign-up or profile settings whether it\'s available.',
        ],
      },
      {
        title: 'Local processing and privacy',
        paragraphs: [
          'All name generation runs locally in your browser. Favorites are saved only on your own device, and no data is sent to a server.',
        ],
      },
    ],
    faq: [
      {
        question: 'Does the generator check if the name is available in the game?',
        answer:
          'No. It generates word combinations locally; final availability depends on the game and your account.',
      },
      {
        question: 'Can I pick a game to make the name more thematic?',
        answer:
          'Yes. Each game has its own word bank that keeps the rolled name in tune with that game\'s world.',
      },
      {
        question: 'What is the leet speak style?',
        answer:
          'It replaces some letters with visually similar numbers (a→4, e→3, i→1, o→0, s→5, t→7), a style commonly used in gaming usernames.',
      },
      {
        question: 'Are my favorites saved?',
        answer:
          'Yes. Favorited names are saved locally in your browser and stay available on your next visit.',
      },
      {
        question: 'Is it free and does it work on mobile?',
        answer:
          'Yes. The tool is free, requires no sign-up, and works normally on mobile browsers.',
      },
    ],
  },
  es: {
    name: 'Generador de Nombre para Juegos',
    shortDescription:
      'Genera nombres de usuario aleatorios para Fortnite, Free Fire, Roblox, Valorant y otros juegos con estilo clásico, leet speak o decorado con símbolos.',
    primaryKeyword: 'generador de nombre para juegos',
    secondaryKeywords: [
      'generador de nombre free fire',
      'generador de nombre fortnite',
      'generador de nombre gamer',
      'nombre aleatorio para juego',
      'generador de nickname aleatorio',
      'generador de nombre roblox',
    ],
    searchIntent:
      'Jugadores que quieren generar rápidamente un nombre de usuario creativo para un juego específico sin tener que pensarlo desde cero.',
    seoTitle: 'Generador de Nombre para Juegos Gratis | Fortnite, Free Fire, Roblox y Más',
    seoDescription:
      'Genera nombres de usuario aleatorios para juegos con estilo clásico, leet speak o decorado con símbolos. Sortea tantas veces como quieras, guarda favoritos y copia con un clic.',
    h1: 'Generador de Nombre para Juegos Gratis con Estilos y Favoritos',
    intro:
      'Sortea nombres aleatorios para tu juego favorito, elige el estilo (clásico, leet speak o con símbolos) y copia el resultado con un clic.',
    contentBlocks: [
      {
        title: 'Cómo generar un nombre para juegos',
        paragraphs: [
          'Elige el juego (o déjalo en blanco para un nombre genérico), el estilo del nombre y si quieres incluir un número al final. Haz clic en generar para sortear una combinación de palabras, o sigue haciendo clic para ver nuevas opciones hasta encontrar una que te guste. Guarda como favoritos los nombres que más te gusten para compararlos después.',
          'El estilo clásico combina un adjetivo y un sustantivo (por ejemplo, "ShadowWolf"). El estilo leet speak cambia algunas letras por números (como "Sh4d0wW0lf"). El estilo con símbolos agrega un símbolo decorativo al inicio y al final del nombre.',
        ],
      },
      {
        title: 'Nombres con contexto por juego',
        paragraphs: [
          'Cada juego tiene su propio banco de palabras: Valorant usa términos tácticos, Minecraft usa términos de construcción y minería, Free Fire y PUBG Mobile usan términos de battle royale, y así sucesivamente. Esto hace que el nombre sorteado tenga más coherencia con el universo del juego elegido en vez de una combinación genérica.',
        ],
        list: [
          'Sortea varias veces hasta encontrar un nombre que suene bien.',
          'Combina el estilo leet speak con un juego competitivo como Valorant o CS2.',
          'Usa el estilo con símbolos para nombres que llamen más la atención.',
          'Guarda como favoritos tus mejores resultados para comparar después.',
        ],
      },
      {
        title: 'Disponibilidad del nombre en el juego',
        paragraphs: [
          'La herramienta genera combinaciones de palabras y no verifica si un nombre ya está en uso en el juego elegido. Después de elegir un nombre, confirma directamente en el registro o en la configuración de perfil del juego si está disponible.',
        ],
      },
      {
        title: 'Procesamiento local y privacidad',
        paragraphs: [
          'Toda la generación de nombres ocurre localmente en tu navegador. Los favoritos se guardan solo en tu dispositivo, y ningún dato se envía a un servidor.',
        ],
      },
    ],
    faq: [
      {
        question: '¿El generador verifica si el nombre está disponible en el juego?',
        answer:
          'No. Genera combinaciones de palabras localmente; la disponibilidad final depende del juego y de tu cuenta.',
      },
      {
        question: '¿Puedo elegir el juego para que el nombre sea más temático?',
        answer:
          'Sí. Cada juego tiene su propio banco de palabras que hace que el nombre sorteado tenga más coherencia con ese universo.',
      },
      {
        question: '¿Qué es el estilo leet speak?',
        answer:
          'Es el reemplazo de algunas letras por números visualmente parecidos (a→4, e→3, i→1, o→0, s→5, t→7), un estilo muy usado en nombres gamer.',
      },
      {
        question: '¿Se guardan mis favoritos?',
        answer:
          'Sí. Los nombres favoritos se guardan localmente en tu navegador y siguen disponibles en tu próxima visita.',
      },
      {
        question: '¿Es gratis y funciona en el celular?',
        answer:
          'Sí. La herramienta es gratuita, no requiere registro y funciona con normalidad en navegadores móviles.',
      },
    ],
  },
  zh: {
    name: 'Gamer Username Generator',
    shortDescription:
      'Generate random usernames for Fortnite, Free Fire, Roblox, Valorant, and other games with classic, leet speak, or symbol-decorated styles.',
    primaryKeyword: 'gamer username generator',
    secondaryKeywords: [
      'free fire name generator',
      'fortnite username generator',
      'random gaming name generator',
      'random gamertag generator',
      'roblox username generator',
      'cool gamer name generator',
    ],
    searchIntent:
      'Players who want to quickly generate a creative, game-specific username without having to think of one from scratch.',
    seoTitle: 'Gamer Username Generator Free | Fortnite, Free Fire, Roblox and More',
    seoDescription:
      'Generate random gaming usernames with classic, leet speak, or symbol-decorated styles. Reroll as many times as you want, favorite the best ones, and copy with one click.',
    h1: 'Gamer Username Generator with Styles and Favorites',
    intro:
      'Roll random usernames for your favorite game, pick a style (classic, leet speak, or symbols), and copy the result with one click.',
    contentBlocks: [
      {
        title: 'How to generate a gaming username',
        paragraphs: [
          'Pick a game (or leave it blank for a generic name), a style, and whether to include a number at the end. Click generate to roll a word combination, or keep clicking to see new options until you find one you like. Favorite the names you like best to compare later.',
          'The classic style combines an adjective and a noun (e.g. "ShadowWolf"). The leet speak style swaps some letters for numbers (like "Sh4d0wW0lf"). The symbols style adds a decorative symbol at the start and end of the name.',
        ],
      },
      {
        title: 'Game-aware naming',
        paragraphs: [
          'Each game has its own word bank: Valorant uses tactical terms, Minecraft uses building and mining terms, Free Fire and PUBG Mobile use battle royale terms, and so on. This keeps the rolled name in tune with the chosen game\'s world instead of a generic combination.',
        ],
        list: [
          'Reroll a few times until you find a name that sounds right.',
          'Pair the leet speak style with a competitive game like Valorant or CS2.',
          'Use the symbols style for names that stand out more.',
          'Favorite your best results to compare later.',
        ],
      },
      {
        title: 'Name availability in the game',
        paragraphs: [
          'The tool generates word combinations and does not check whether a name is already taken in the chosen game. After picking a name, confirm directly in the game\'s sign-up or profile settings whether it\'s available.',
        ],
      },
      {
        title: 'Local processing and privacy',
        paragraphs: [
          'All name generation runs locally in your browser. Favorites are saved only on your own device, and no data is sent to a server.',
        ],
      },
    ],
    faq: [
      {
        question: 'Does the generator check if the name is available in the game?',
        answer:
          'No. It generates word combinations locally; final availability depends on the game and your account.',
      },
      {
        question: 'Can I pick a game to make the name more thematic?',
        answer:
          'Yes. Each game has its own word bank that keeps the rolled name in tune with that game\'s world.',
      },
      {
        question: 'What is the leet speak style?',
        answer:
          'It replaces some letters with visually similar numbers (a→4, e→3, i→1, o→0, s→5, t→7), a style commonly used in gaming usernames.',
      },
      {
        question: 'Are my favorites saved?',
        answer:
          'Yes. Favorited names are saved locally in your browser and stay available on your next visit.',
      },
      {
        question: 'Is it free and does it work on mobile?',
        answer:
          'Yes. The tool is free, requires no sign-up, and works normally on mobile browsers.',
      },
    ],
  },
};

export const getGamerUsernameGeneratorContent = (
  locale: AppLocale,
): GamerUsernameGeneratorContent => contentByLocale[locale];
