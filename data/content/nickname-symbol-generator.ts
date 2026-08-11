import type { AppLocale } from '@/lib/i18n/config';
import type { ContentBlock, FaqItem } from '@/types/content';

export type NicknameSymbolGeneratorContent = {
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

const contentByLocale: Record<AppLocale, NicknameSymbolGeneratorContent> = {
  'pt-br': {
    name: 'Gerador de Simbolos para Nickname',
    shortDescription:
      'Crie nicknames com 224 simbolos, 28 molduras e 12 estilos de letras para Fortnite, Free Fire, Roblox, Valorant, COD Mobile e outros jogos.',
    primaryKeyword: 'simbolos para nickname fortnite',
    secondaryKeywords: [
      'gerador de nickname com simbolos',
      'simbolos para nome de jogo',
      'simbolos para nick free fire',
      'nome com simbolos roblox',
      'simbolos para nome valorant',
      'nickname gamer copiar e colar',
    ],
    searchIntent:
      'Jogadores que querem decorar um nickname com simbolos Unicode, molduras e estilos de letra antes de copiar para o perfil do jogo.',
    seoTitle: 'Simbolos para Nickname Fortnite e Jogos | Gerador Online',
    seoDescription:
      'Monte nicknames para Fortnite e outros jogos com teclado de simbolos. Insira caracteres no meio do nome, escolha molduras e copie sem cadastro.',
    h1: 'Gerador de Simbolos para Nickname de Fortnite e Jogos',
    intro:
      'Digite seu nome e use o teclado para inserir 224 simbolos em qualquer posicao. Combine 14 categorias, 28 molduras e 12 estilos Unicode.',
    contentBlocks: [
      {
        title: 'Como criar um nickname gamer com simbolos',
        paragraphs: [
          'Comece digitando o nome que voce ja usa ou uma palavra curta que represente seu estilo. Posicione o cursor antes, depois ou entre as letras e toque no teclado de simbolos para montar a combinacao livremente. Tambem e possivel selecionar um trecho, substitui-lo por um simbolo, apagar e limpar tudo sem depender de um preset.',
          'O preview personalizado permite combinar a montagem livre com prefixos, sufixos e 12 estilos de letras, incluindo original, small caps, largura completa, negrito, italico, circulado, quadrado, espacado e sublinhado. Quando encontrar uma combinacao legivel, copie o resultado e teste no campo real do perfil antes de confirmar a alteracao.',
        ],
      },
      {
        title: 'Presets para Fortnite, Free Fire, Roblox e outros jogos',
        paragraphs: [
          'Cada jogo exibe nomes em lugares diferentes. No Fortnite, o nickname precisa continuar facil de reconhecer no lobby e na lista de amigos. No Free Fire e no COD Mobile, a leitura em telas pequenas favorece molduras compactas. No Roblox, nome de usuario e nome de exibicao podem seguir filtros diferentes. Por isso a ordem dos presets muda conforme a plataforma selecionada.',
          'As paginas dedicadas usam a mesma ferramenta completa, mas iniciam com o jogo e os estilos mais relevantes ja selecionados. Isso reduz tentativa e erro sem fingir que existe um simbolo universalmente aceito.',
        ],
        list: [
          'Fortnite: raios, katakana, laminas e decoracao curta.',
          'Free Fire: molduras, coroas, asas e estilos small caps.',
          'Valorant e CS2: formatos curtos para placar e feed.',
          'Roblox: combinacoes simples para chat e nome de exibicao.',
        ],
      },
      {
        title: 'Compatibilidade de Unicode e limite do nickname',
        paragraphs: [
          'Os resultados usam caracteres Unicode reais, nao imagens. Mesmo assim, jogos, contas vinculadas, consoles, celulares e fontes podem exibir o mesmo simbolo de maneiras diferentes. Um caractere pode aparecer normalmente no navegador e virar um quadrado vazio dentro do jogo. Emoji e molduras complexas costumam variar mais que simbolos de texto simples.',
          'O contador mostra o tamanho do resultado gerado, incluindo as decoracoes. Use isso para comparar opcoes, mas confirme o limite diretamente no jogo porque as regras podem mudar. Se a primeira versao for rejeitada, remova a moldura, volte ao estilo original ou teste um preset mais curto.',
        ],
      },
      {
        title: 'Copia local, privacidade e uso responsavel',
        paragraphs: [
          'A criacao do nickname acontece localmente no navegador. O nome digitado nao precisa ser enviado para uma API e pode ser substituido ou limpo a qualquer momento. Os botoes de copia usam apenas a area de transferencia do dispositivo.',
          'Os nomes dos jogos sao usados somente para orientar presets e exemplos. A ferramenta nao e afiliada aos publishers e nao verifica disponibilidade de nickname. Evite imitar criadores, jogadores profissionais ou marcas de forma enganosa e respeite as regras de cada comunidade.',
        ],
      },
    ],
    faq: [
      {
        question: 'Quais simbolos posso usar no nome do Fortnite?',
        answer:
          'A aceitacao pode mudar. Comece por simbolos de texto curtos como ϟ, ツ, 乂, ★ e molduras simples. Copie o resultado e valide no campo de nome da Epic antes de confirmar.',
      },
      {
        question: 'O gerador funciona para outros jogos?',
        answer:
          'Sim. A ferramenta e generica e inclui presets para Fortnite, Free Fire, Roblox, Valorant, COD Mobile, PUBG Mobile, CS2, Minecraft, Brawl Stars e Rocket League.',
      },
      {
        question: 'Por que alguns simbolos aparecem como quadrados?',
        answer:
          'Isso acontece quando a fonte do jogo ou do aparelho nao possui aquele glifo Unicode. Tente um simbolo mais simples ou mantenha as letras no estilo original.',
      },
      {
        question: 'A ferramenta verifica se o nickname esta disponivel?',
        answer:
          'Nao. Ela cria e copia variacoes, mas a disponibilidade e a validacao final dependem do jogo e da sua conta.',
      },
      {
        question: 'Posso colocar simbolos no meio do nickname?',
        answer:
          'Sim. Toque no ponto desejado dentro do campo de edicao, mantenha a opcao No cursor selecionada e depois toque nos simbolos. Eles entram exatamente naquela posicao.',
      },
    ],
  },
  en: {
    name: 'Gaming Name Symbol Generator',
    shortDescription:
      'Create gaming names with 224 symbols, 28 frames, and 12 letter styles for Fortnite, Free Fire, Roblox, Valorant, COD Mobile, and more.',
    primaryKeyword: 'fortnite name symbols generator',
    secondaryKeywords: [
      'gaming name symbol generator',
      'symbols for fortnite name',
      'free fire nickname symbols',
      'roblox name symbols',
      'valorant name symbols',
      'gaming nickname copy and paste',
    ],
    searchIntent:
      'Players who want to decorate a gaming name with Unicode symbols, frames, and letter styles before copying it to a profile.',
    seoTitle: 'Fortnite Name Symbols Generator for Games | Copy and Paste',
    seoDescription:
      'Build Fortnite and gaming names with a symbol keyboard. Insert characters anywhere, choose Unicode frames and styles, then copy with no sign-up.',
    h1: 'Fortnite Name Symbols Generator for Gaming Nicknames',
    intro:
      'Type your name and use the keyboard to insert 224 symbols anywhere. Combine 14 categories, 28 frames, and 12 Unicode letter styles.',
    contentBlocks: [
      {
        title: 'Build a gaming name with symbols',
        paragraphs: [
          'Start with the name you already use or a short word that matches your play style. Place the cursor before, after, or between letters and tap the symbol keyboard to build the combination freely. You can also select part of the name, replace it with a symbol, use backspace, or clear the editor without relying on a preset.',
          'The custom preview combines free typing with prefixes, suffixes, and 12 letter styles, including original, small caps, fullwidth, bold, italic, circled, squared, spaced, and underlined text. Once a version stays readable, copy it and test it in the real profile field before confirming a name change.',
        ],
      },
      {
        title: 'Presets for Fortnite, Free Fire, Roblox, and more',
        paragraphs: [
          'Games display names in different contexts. Fortnite names need to remain recognizable in lobbies and friend lists. Free Fire and COD Mobile use small mobile layouts where compact frames work better. Roblox can apply different rules to usernames and display names. The preset order changes with the selected platform to reflect those practical differences.',
          'Dedicated game pages use the same complete generator but open with the relevant game and suggested styles already selected. This saves time without claiming that one symbol will always pass every filter.',
        ],
        list: [
          'Fortnite: lightning, katakana, blades, and short decorations.',
          'Free Fire: ornate frames, crowns, wings, and small caps.',
          'Valorant and CS2: compact formats for scoreboards and feeds.',
          'Roblox: simple combinations for chat and display names.',
        ],
      },
      {
        title: 'Unicode compatibility and name length',
        paragraphs: [
          'Generated results use real Unicode characters rather than images. Games, linked accounts, consoles, phones, and fonts can still render the same symbol differently. A character that looks correct in your browser may appear as a blank square in the game. Emoji and complex frames usually vary more than simple text symbols.',
          'The counter includes the decoration in the final character total. Use it to compare options, but confirm the current limit inside the game because validation rules can change. If a version is rejected, remove the frame, return to original lettering, or try a shorter preset.',
        ],
      },
      {
        title: 'Local generation, privacy, and responsible use',
        paragraphs: [
          'Nickname creation runs locally in your browser. Your input does not need to be uploaded to an API, and you can replace or clear it at any time. Copy buttons only interact with your device clipboard.',
          'Game names are used to organize presets and examples. This tool is not affiliated with their publishers and cannot check name availability. Avoid misleading impersonation of creators, professional players, teams, or brands, and follow each community’s rules.',
        ],
      },
    ],
    faq: [
      {
        question: 'Which symbols can I use in a Fortnite name?',
        answer:
          'Acceptance can change. Start with short text symbols such as ϟ, ツ, 乂, ★, or simple frames. Copy the result and validate it in the Epic display-name field before confirming.',
      },
      {
        question: 'Does the generator work for other games?',
        answer:
          'Yes. It is a general gaming-name tool with presets for Fortnite, Free Fire, Roblox, Valorant, COD Mobile, PUBG Mobile, CS2, Minecraft, Brawl Stars, and Rocket League.',
      },
      {
        question: 'Why do some symbols appear as empty squares?',
        answer:
          'The game or device font may not contain that Unicode glyph. Try a simpler symbol or switch the lettering back to the original style.',
      },
      {
        question: 'Can this tool check if a name is available?',
        answer:
          'No. It creates and copies variations, while availability and final validation depend on the game and your account.',
      },
      {
        question: 'Can I place symbols in the middle of a gaming name?',
        answer:
          'Yes. Tap the desired point in the editor, keep At cursor selected, and then tap any symbol. It will be inserted at that exact position.',
      },
    ],
  },
  es: {
    name: 'Generador de Simbolos para Nicknames',
    shortDescription:
      'Crea nombres con 224 simbolos, 28 marcos y 12 estilos de letras para Fortnite, Free Fire, Roblox, Valorant, COD Mobile y otros juegos.',
    primaryKeyword: 'simbolos para nombre fortnite',
    secondaryKeywords: [
      'generador de nicknames con simbolos',
      'simbolos para nombres de juegos',
      'simbolos para nick free fire',
      'nombre con simbolos roblox',
      'simbolos para nombre valorant',
      'nickname gamer copiar y pegar',
    ],
    searchIntent:
      'Jugadores que quieren decorar un nickname con simbolos Unicode, marcos y estilos de letras antes de copiarlo al perfil.',
    seoTitle: 'Simbolos para Nombre Fortnite y Juegos | Generador Online',
    seoDescription:
      'Monta nombres para Fortnite y otros juegos con un teclado de simbolos. Inserta caracteres donde quieras, elige marcos y copia sin registro.',
    h1: 'Generador de Simbolos para Nombres de Fortnite y Juegos',
    intro:
      'Escribe tu nombre y usa el teclado para insertar 224 simbolos en cualquier posicion. Combina 14 categorias, 28 marcos y 12 estilos Unicode.',
    contentBlocks: [
      {
        title: 'Como crear un nickname gamer con simbolos',
        paragraphs: [
          'Empieza con el nombre que ya usas o una palabra corta que represente tu estilo. Coloca el cursor antes, despues o entre las letras y toca el teclado de simbolos para montar la combinacion libremente. Tambien puedes seleccionar una parte, sustituirla por un simbolo, borrar o limpiar todo sin depender de un preset.',
          'El preview personalizado combina la escritura libre con prefijos, sufijos y 12 estilos de letras, como original, small caps, ancho completo, negrita, cursiva, circulado, cuadrados, espaciado y subrayado. Cuando una combinacion siga legible, copiala y pruebala en el campo real del perfil antes de confirmar el cambio.',
        ],
      },
      {
        title: 'Presets para Fortnite, Free Fire, Roblox y otros juegos',
        paragraphs: [
          'Cada juego muestra los nombres en contextos diferentes. En Fortnite debe seguir reconocible en lobbies y listas de amigos. Free Fire y COD Mobile usan pantallas pequenas donde funcionan mejor los marcos compactos. Roblox puede aplicar reglas distintas al usuario y al nombre visible. Por eso el orden de presets cambia segun la plataforma.',
          'Las paginas dedicadas usan el mismo generador completo, pero ya abren con el juego y los estilos relevantes seleccionados. Esto reduce pruebas sin prometer que un simbolo sera aceptado siempre.',
        ],
        list: [
          'Fortnite: rayos, katakana, cuchillas y decoracion corta.',
          'Free Fire: marcos, coronas, alas y estilos small caps.',
          'Valorant y CS2: formatos cortos para marcador y feed.',
          'Roblox: combinaciones simples para chat y nombre visible.',
        ],
      },
      {
        title: 'Compatibilidad Unicode y longitud del nombre',
        paragraphs: [
          'Los resultados usan caracteres Unicode reales, no imagenes. Aun asi, juegos, cuentas vinculadas, consolas, telefonos y fuentes pueden mostrar el mismo simbolo de formas diferentes. Un caracter correcto en el navegador puede convertirse en un cuadrado vacio dentro del juego. Los emoji y marcos complejos suelen variar mas que los simbolos de texto.',
          'El contador incluye las decoraciones en el total final. Usalo para comparar opciones, pero confirma el limite actual dentro del juego porque las reglas pueden cambiar. Si una version es rechazada, elimina el marco, vuelve a las letras originales o prueba un preset mas corto.',
        ],
      },
      {
        title: 'Generacion local, privacidad y uso responsable',
        paragraphs: [
          'La creacion del nickname ocurre localmente en el navegador. El texto no necesita enviarse a una API y puedes cambiarlo o limpiarlo cuando quieras. Los botones de copia solo usan el portapapeles del dispositivo.',
          'Los nombres de juegos se usan para organizar presets y ejemplos. La herramienta no esta afiliada a sus publishers y no comprueba disponibilidad. Evita suplantar de forma enganosa a creadores, jugadores profesionales, equipos o marcas y respeta las reglas de cada comunidad.',
        ],
      },
    ],
    faq: [
      {
        question: '¿Que simbolos puedo usar en un nombre de Fortnite?',
        answer:
          'La aceptacion puede cambiar. Empieza con simbolos cortos como ϟ, ツ, 乂, ★ o marcos simples. Copia el resultado y validalo en el campo de nombre de Epic antes de confirmar.',
      },
      {
        question: '¿El generador funciona para otros juegos?',
        answer:
          'Si. Incluye presets para Fortnite, Free Fire, Roblox, Valorant, COD Mobile, PUBG Mobile, CS2, Minecraft, Brawl Stars y Rocket League.',
      },
      {
        question: '¿Por que algunos simbolos aparecen como cuadrados?',
        answer:
          'La fuente del juego o del dispositivo puede no incluir ese glifo Unicode. Prueba un simbolo mas simple o vuelve al estilo de letras original.',
      },
      {
        question: '¿La herramienta comprueba si el nombre esta disponible?',
        answer:
          'No. Crea y copia variaciones, pero la disponibilidad y validacion final dependen del juego y de tu cuenta.',
      },
      {
        question: '¿Puedo colocar simbolos en el medio del nickname?',
        answer:
          'Si. Toca el punto deseado en el editor, deja En el cursor seleccionado y despues toca cualquier simbolo. Se insertara exactamente en esa posicion.',
      },
    ],
  },
};

export const getNicknameSymbolGeneratorContent = (
  locale: AppLocale,
): NicknameSymbolGeneratorContent => contentByLocale[locale];
