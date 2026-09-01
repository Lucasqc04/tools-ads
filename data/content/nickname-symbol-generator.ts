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
  zh: {
    name: '游戏昵称符号生成器',
    shortDescription:
      '为 Fortnite、Free Fire、Roblox、Valorant、COD Mobile 等游戏创建带有224种符号、28种花体边框和12种字体风格的昵称。',
    primaryKeyword: 'fortnite 昵称符号生成器',
    secondaryKeywords: [
      '游戏昵称符号生成器',
      'fortnite 名字符号',
      'free fire 昵称符号',
      'roblox 名字符号',
      'valorant 名字符号',
      '游戏昵称复制粘贴',
    ],
    searchIntent:
      '希望在复制到个人资料前,用 Unicode 符号、花体边框和字体风格装饰游戏昵称的玩家。',
    seoTitle: 'Fortnite 昵称符号生成器 | 复制粘贴',
    seoDescription:
      '使用符号键盘搭建 Fortnite 和其他游戏的昵称。可在任意位置插入字符,选择 Unicode 花体边框和风格,无需注册即可复制。',
    h1: 'Fortnite 游戏昵称符号生成器',
    intro:
      '输入你的名字,使用符号键盘在任意位置插入224种符号。可组合14个分类、28种花体边框和12种 Unicode 字体风格。',
    contentBlocks: [
      {
        title: '用符号打造游戏昵称',
        paragraphs: [
          '从你已经在使用的名字或代表你风格的简短词语开始。将光标定位在字母前面、后面或中间,点击符号键盘自由组合。你也可以选中一部分文字替换为符号,使用退格键或清空编辑器,而无需依赖预设。',
          '自定义预览支持将自由输入与前缀、后缀以及12种字体风格结合,包括原始、小型大写、全角、粗体、斜体、圆圈、方框、间隔和下划线。当某个版本保持清晰易读时,复制结果并在真实的资料字段中测试后再确认修改。',
        ],
      },
      {
        title: 'Fortnite、Free Fire、Roblox 等游戏的预设方案',
        paragraphs: [
          '不同游戏在不同场景中显示名字。Fortnite 的昵称需要在大厅和好友列表中保持易于辨认。Free Fire 和 COD Mobile 使用较小的移动端布局,紧凑的花体边框效果更好。Roblox 对用户名和显示名称可能采用不同的规则。因此预设顺序会根据所选平台而变化。',
          '各游戏专属页面使用同一个完整的生成器,但会预先选中相关的游戏和推荐风格,从而节省时间,同时不会宣称某个符号一定能通过所有过滤规则。',
        ],
        list: [
          'Fortnite:闪电、片假名、刀刃和简短装饰。',
          'Free Fire:华丽边框、皇冠、翅膀和小型大写风格。',
          'Valorant 和 CS2:适合记分板和动态消息的紧凑格式。',
          'Roblox:适用于聊天和显示名称的简单组合。',
        ],
      },
      {
        title: 'Unicode 兼容性与名字长度限制',
        paragraphs: [
          '生成结果使用真实的 Unicode 字符,而非图片。不过游戏、关联账号、主机、手机和字体仍可能以不同方式渲染同一个符号。某个字符在浏览器中显示正常,进入游戏后也可能变成空白方框。表情符号和复杂花体边框的兼容性通常比简单文字符号更不稳定。',
          '字符计数器会将装饰内容计入最终总长度。可以用它来比较不同方案,但请在游戏内确认实际限制,因为验证规则可能会变化。如果某个版本被拒绝,可以去掉花体边框、恢复原始字母,或尝试更短的预设。',
        ],
      },
      {
        title: '本地生成、隐私与合理使用',
        paragraphs: [
          '昵称的创建在浏览器本地完成。你输入的内容无需上传到任何 API,并且可以随时替换或清空。复制按钮只会与你设备的剪贴板交互。',
          '游戏名称仅用于组织预设和示例。本工具与相关发行商没有任何关联,也无法检测名字是否可用。请避免以误导性的方式冒充创作者、职业玩家、战队或品牌,并遵守各社区的规则。',
        ],
      },
    ],
    faq: [
      {
        question: '我可以在 Fortnite 名字中使用哪些符号?',
        answer:
          '是否被接受可能会变化。可以先尝试 ϟ、ツ、乂、★ 等简短文字符号,或使用简单的花体边框。复制结果后,在 Epic 的显示名称字段中验证后再确认。',
      },
      {
        question: '这个生成器适用于其他游戏吗?',
        answer:
          '适用。这是一个通用的游戏昵称工具,内置 Fortnite、Free Fire、Roblox、Valorant、COD Mobile、PUBG Mobile、CS2、Minecraft、Brawl Stars 和 Rocket League 的预设。',
      },
      {
        question: '为什么有些符号会显示为空白方框?',
        answer:
          '这通常是因为游戏或设备的字体不包含该 Unicode 字形。可以尝试更简单的符号,或将字母切换回原始样式。',
      },
      {
        question: '这个工具能检测名字是否可用吗?',
        answer:
          '不能。它只负责创建和复制变体,名字是否可用以及最终验证取决于具体游戏和你的账号。',
      },
      {
        question: '可以在昵称中间插入符号吗?',
        answer:
          '可以。在编辑框中点击你想要的位置,保持"在光标处"选项,然后点击任意符号,它会准确插入到那个位置。',
      },
    ],
  },
};

export const getNicknameSymbolGeneratorContent = (
  locale: AppLocale,
): NicknameSymbolGeneratorContent => contentByLocale[locale];
