import type { AppLocale } from '@/lib/i18n/config';
import type { ContentBlock, FaqItem } from '@/types/content';

export type ShareScreenContent = {
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

const contentByLocale: Record<AppLocale, ShareScreenContent> = {
  'pt-br': {
    name: 'Compartilhar Tela por Link',
    shortDescription: 'Transmita a tela do computador direto para outras pessoas pelo navegador, com conexão WebRTC P2P e sem instalar aplicativo.',
    primaryKeyword: 'compartilhar tela online por link',
    secondaryKeywords: [
      'transmitir tela do pc pelo navegador',
      'compartilhar tela sem instalar programa',
      'assistir compartilhamento de tela por link',
      'compartilhar tela p2p webrtc',
      'compartilhamento de tela com áudio do sistema',
    ],
    searchIntent: 'Pessoas que precisam mostrar uma tela para alguém rapidamente, sem conta, reunião agendada ou aplicativo instalado.',
    seoTitle: 'Compartilhar Tela Online por Link, sem Instalar Aplicativo',
    seoDescription: 'Transmita a tela do computador pelo navegador e envie um link para assistir. WebRTC P2P, sem login; o vídeo não passa pelo servidor.',
    h1: 'Compartilhe a Tela do Computador por um Link',
    intro: 'Inicie a captura com a permissão do navegador, copie o link da sala e transmita a tela diretamente para até cinco espectadores, sem conta ou instalação.',
    contentBlocks: [
      {
        title: 'Como funciona o compartilhamento por link',
        paragraphs: [
          'Ao iniciar uma transmissão, o navegador pede que você escolha a tela, janela ou aba que deseja mostrar. Depois, a ferramenta cria uma sala temporária e gera um link para os espectadores. Cada pessoa abre o link no próprio navegador e negocia uma conexão WebRTC independente com quem está apresentando.',
          'O Redis é usado somente para guardar a sala temporária e trocar ofertas, respostas e candidatos de conexão durante a negociação. O vídeo e o áudio compatível seguem entre os navegadores por WebRTC P2P; eles não são enviados ao Redis, à aplicação Next.js nem a um servidor de mídia.',
        ],
      },
      {
        title: 'Quando usar uma transmissão de tela',
        paragraphs: [
          'O link é útil para demonstrar um erro, revisar uma página, explicar um fluxo de trabalho, mostrar uma apresentação ou orientar alguém em uma tarefa. Quem assiste só precisa de um navegador atualizado e do endereço da sala; não precisa criar uma conta nem instalar um aplicativo.',
          'A captura precisa ser iniciada por você e o navegador sempre mostra o seletor de conteúdo. No celular, assistir costuma funcionar melhor do que apresentar: a captura de tela não está disponível em todos os navegadores móveis.',
        ],
        list: [
          'Compartilhe uma aba durante uma demonstração de produto ou suporte.',
          'Mostre um aplicativo ou janela específica para uma revisão rápida.',
          'Envie um link temporário para acompanhar uma apresentação ao vivo.',
        ],
      },
      {
        title: 'Qualidade, áudio e diagnóstico',
        paragraphs: [
          'O modo automático começa em uma meta equilibrada e ajusta a resolução da captura após observar a conexão por algum tempo. O limite de bitrate é controlado separadamente para cada espectador quando o navegador permite. Um ajuste da resolução da tela compartilhada afeta todos; por isso, a ferramenta só considera a tendência da maioria antes de mudar a captura.',
          'Os perfis econômicos, equilibrado, alta qualidade, fluidez e máxima qualidade são metas, não garantias. A tela de diagnóstico mostra apenas métricas que o navegador fornece, como RTT, perda de pacotes, bitrate calculado a partir dos bytes WebRTC e resolução recebida. RTT é uma ida e volta da conexão, não o atraso exato do vídeo de ponta a ponta.',
        ],
      },
      {
        title: 'Privacidade e limitações da conexão direta',
        paragraphs: [
          'A transmissão não é gravada pelo site. O link dá acesso à sala enquanto ela estiver ativa, então compartilhe-o apenas com quem deve assistir e encerre a sessão ao terminar. O navegador pode disponibilizar o áudio da aba ou do sistema; isso varia conforme o navegador, o sistema operacional e a fonte selecionada.',
          'WebRTC usa ICE e STUN para procurar uma rota entre os participantes. Em uma conexão direta, os participantes podem descobrir informações de conectividade, inclusive endereços IP; P2P não significa anonimato de IP. Esta versão não inclui relay TURN. Firewalls e NATs restritivos podem impedir a conexão, e a ferramenta informa quando não consegue estabelecê-la. As salas e mensagens de sinalização expiram automaticamente.',
        ],
      },
      {
        title: 'Consumo de internet e limite por sessão',
        paragraphs: [
          'Como cada espectador recebe uma conexão independente, o computador do host envia uma cópia de mídia para cada pessoa. Um fluxo de 5 Mbps corresponde a cerca de 2,25 GB por hora para um espectador e 11,25 GB por hora para cinco, antes do overhead de rede estimado separadamente. O bitrate efetivo muda com o conteúdo, a rede e o navegador; o orçamento de upload controla uma meta e não é um bloqueio rígido do tráfego.',
          'A ferramenta começa com limite de sessão de 1 GB e encerramento automático, que você pode alterar para 500 MB, 2 GB, 5 GB, um valor personalizado ou sem limite. O cálculo usa bytes de mídia WebRTC observados pelo navegador, não o consumo total da operadora, o overhead ou os dados usados por outros aplicativos. Se o navegador não disponibilizar esses contadores, a aplicação mostra que o uso não foi medido e não consegue aplicar o limite automaticamente.',
        ],
      },
    ],
    faq: [
      { question: 'Como alguém assiste à minha tela?', answer: 'Copie o link da sala depois que a captura começar. O espectador abre esse endereço em outro navegador e a conexão WebRTC é negociada automaticamente.' },
      { question: 'O vídeo ou a captura são enviados ao servidor?', answer: 'Não. Redis guarda apenas dados temporários de sala e sinalização. O vídeo e o áudio seguem diretamente entre os navegadores quando a rede permite.' },
      { question: 'Preciso instalar algo ou criar uma conta?', answer: 'Não. O host precisa de um navegador compatível e autoriza a captura pelo seletor do próprio navegador. O espectador abre o link no navegador.' },
      { question: 'Por que a conexão pode falhar em algumas redes?', answer: 'Esta versão usa WebRTC com STUN e conexão P2P, sem relay TURN. Algumas VPNs, redes corporativas, firewalls e NATs restritivos bloqueiam a rota direta.' },
      { question: 'A ferramenta compartilha o áudio do computador?', answer: 'Quando o navegador e a fonte escolhida oferecem áudio, você pode autorizá-lo no seletor de compartilhamento. A ferramenta mostra se uma faixa de áudio foi recebida; a disponibilidade não é garantida em todos os dispositivos.' },
    ],
  },
  en: {
    name: 'Share Screen by Link',
    shortDescription: 'Stream your computer screen to other people in their browser with a direct WebRTC P2P connection and no app to install.',
    primaryKeyword: 'share screen online by link',
    secondaryKeywords: [
      'share computer screen in browser',
      'screen sharing without installing software',
      'watch a screen share by link',
      'webrtc p2p screen sharing',
      'share screen with system audio',
    ],
    searchIntent: 'People who need to show a screen quickly without an account, scheduled meeting, or installed desktop app.',
    seoTitle: 'Share Your Screen Online by Link, No App Required',
    seoDescription: 'Stream your computer screen in a browser and send a watch link. WebRTC P2P keeps video off the media server; no sign-in or install.',
    h1: 'Share Your Computer Screen with a Link',
    intro: 'Approve screen capture in your browser, copy the room link, and stream directly to up to five viewers with no account or installation.',
    contentBlocks: [
      {
        title: 'How link-based screen sharing works',
        paragraphs: [
          'When you start a broadcast, your browser asks you to choose a screen, window, or tab. The tool then creates a temporary room and a link for viewers. Each viewer opens that link in a browser and negotiates an independent WebRTC connection with the presenter.',
          'Redis is used only for temporary room state and to exchange offers, answers, and connection candidates during setup. Compatible video and audio travel between browsers over WebRTC P2P; they are not sent through Redis, the Next.js application, or a media server.',
        ],
      },
      {
        title: 'When to use a screen broadcast',
        paragraphs: [
          'A share link is useful for demonstrating a bug, reviewing a page, explaining a workflow, presenting a deck, or guiding someone through a task. Viewers only need a modern browser and the room address; they do not need an account or an installed app.',
          'You start capture yourself, and the browser always displays its own source picker. On a phone, watching is usually more reliable than presenting because screen capture is not available in every mobile browser.',
        ],
        list: [
          'Share a browser tab during a product demo or support session.',
          'Show one application or window for a quick review.',
          'Send a temporary link so others can follow a live presentation.',
        ],
      },
      {
        title: 'Quality, audio, and connection diagnostics',
        paragraphs: [
          'Automatic mode starts with a balanced target and adjusts capture resolution after observing the connection over time. When supported, the bitrate ceiling is managed separately for each viewer. Changing the shared capture affects everyone, so the tool looks at the majority trend before changing it.',
          'Economy, balanced, high quality, fluid, and maximum quality are targets, not guarantees. Diagnostics show only browser-reported values such as RTT, packet loss, bitrate computed from WebRTC bytes, and received resolution. RTT is a connection round trip, not exact end-to-end video delay.',
        ],
      },
      {
        title: 'Privacy and limits of a direct connection',
        paragraphs: [
          'The site does not record the broadcast. The link grants access while the room is active, so share it only with intended viewers and end the session when finished. A browser may provide tab or system audio; availability depends on the browser, operating system, and selected source.',
          'WebRTC uses ICE and STUN to find a route between participants. With a direct connection, participants may learn connectivity information, including IP addresses; P2P does not provide IP anonymity. This version has no TURN relay. Restrictive firewalls and NATs can block a direct route, and the tool reports when it cannot connect. Rooms and signaling messages expire automatically.',
        ],
      },
      {
        title: 'Internet use and per-session limit',
        paragraphs: [
          'Each viewer receives an independent connection, so the presenter sends one media copy per person. A 5 Mbps stream uses about 2.25 GB per hour for one viewer and 11.25 GB per hour for five, with estimated network overhead shown separately. Effective bitrate changes with screen content, network conditions, and browser behavior. The upload budget controls an encoder target; it is not a hard cap on all network traffic.',
          'The tool starts with a 1 GB session limit and automatic stop. You can choose 500 MB, 2 GB, 5 GB, a custom amount, or no limit. The counter uses WebRTC media bytes reported by the browser; it does not include your carrier total, network overhead, or other apps. If the browser does not expose byte counters, the app marks usage as unavailable and cannot enforce the session limit.',
        ],
      },
    ],
    faq: [
      { question: 'How can someone watch my screen?', answer: 'Copy the room link after capture starts. A viewer opens it in another browser and WebRTC negotiation happens automatically.' },
      { question: 'Is my video or capture uploaded to the server?', answer: 'No. Redis stores temporary room and signaling data only. Video and audio travel directly between browsers when the network allows it.' },
      { question: 'Do I need an account or an install?', answer: 'No. The presenter needs a compatible browser and approves capture in the browser picker. Viewers open the link in a browser.' },
      { question: 'Why might a connection fail on some networks?', answer: 'This version uses WebRTC with STUN and direct P2P connections, without a TURN relay. Some VPNs, corporate networks, firewalls, and restrictive NATs block direct routes.' },
      { question: 'Can I share computer audio?', answer: 'If your browser and selected source provide audio, you can allow it in the sharing picker. The tool reports whether an audio track is present; support varies by device.' },
    ],
  },
  es: {
    name: 'Compartir Pantalla por Enlace',
    shortDescription: 'Transmite la pantalla del ordenador a otras personas desde el navegador con una conexión WebRTC P2P directa y sin instalar una app.',
    primaryKeyword: 'compartir pantalla online por enlace',
    secondaryKeywords: [
      'compartir pantalla del pc en el navegador',
      'compartir pantalla sin instalar programa',
      'ver pantalla compartida por enlace',
      'compartir pantalla p2p webrtc',
      'compartir pantalla con audio del sistema',
    ],
    searchIntent: 'Personas que necesitan mostrar una pantalla rápidamente, sin cuenta, reunión programada ni aplicación instalada.',
    seoTitle: 'Compartir Pantalla Online por Enlace, sin Instalar Apps',
    seoDescription: 'Transmite la pantalla del ordenador desde el navegador y envía un enlace para verla. WebRTC P2P, sin iniciar sesión y sin instalar apps.',
    h1: 'Comparte la Pantalla de tu Ordenador con un Enlace',
    intro: 'Autoriza la captura en el navegador, copia el enlace de la sala y transmite directamente a hasta cinco espectadores, sin cuenta ni instalación.',
    contentBlocks: [
      {
        title: 'Cómo funciona compartir pantalla por enlace',
        paragraphs: [
          'Al iniciar una transmisión, el navegador te pide elegir la pantalla, ventana o pestaña que quieres mostrar. La herramienta crea una sala temporal y un enlace para los espectadores. Cada persona abre el enlace en su navegador y negocia una conexión WebRTC independiente con quien presenta.',
          'Redis solo guarda el estado temporal de la sala e intercambia ofertas, respuestas y candidatos de conexión durante el inicio. El vídeo y el audio compatible viajan entre los navegadores por WebRTC P2P; no pasan por Redis, la aplicación Next.js ni un servidor multimedia.',
        ],
      },
      {
        title: 'Cuándo usar una transmisión de pantalla',
        paragraphs: [
          'El enlace sirve para demostrar un error, revisar una página, explicar un flujo de trabajo, mostrar una presentación o guiar a alguien en una tarea. Los espectadores solo necesitan un navegador actualizado y la dirección de la sala; no necesitan cuenta ni instalar una app.',
          'Tú inicias la captura y el navegador siempre muestra su selector de contenido. En el móvil, mirar suele funcionar mejor que presentar porque la captura de pantalla no está disponible en todos los navegadores móviles.',
        ],
        list: [
          'Comparte una pestaña durante una demostración o sesión de soporte.',
          'Muestra una aplicación o ventana para una revisión rápida.',
          'Envía un enlace temporal para seguir una presentación en directo.',
        ],
      },
      {
        title: 'Calidad, audio y diagnóstico de conexión',
        paragraphs: [
          'El modo automático empieza con un objetivo equilibrado y ajusta la resolución de captura después de observar la conexión durante un tiempo. Cuando el navegador lo permite, el límite de bitrate se ajusta por separado para cada espectador. Como cambiar la captura compartida afecta a todos, la herramienta observa la tendencia de la mayoría antes de modificarla.',
          'Los perfiles económico, equilibrado, alta calidad, fluidez y máxima calidad son objetivos, no garantías. El diagnóstico muestra solo datos disponibles en el navegador, como RTT, pérdida de paquetes, bitrate calculado a partir de bytes WebRTC y resolución recibida. RTT es una ida y vuelta de la conexión, no el retraso exacto del vídeo de extremo a extremo.',
        ],
      },
      {
        title: 'Privacidad y límites de la conexión directa',
        paragraphs: [
          'El sitio no graba la transmisión. El enlace da acceso a la sala mientras siga activa; compártelo solo con las personas que deban verla y termina la sesión al finalizar. El navegador puede ofrecer audio de la pestaña o del sistema; depende del navegador, el sistema operativo y la fuente elegida.',
          'WebRTC utiliza ICE y STUN para buscar una ruta entre participantes. Con una conexión directa, los participantes pueden conocer información de conectividad, incluidas direcciones IP; P2P no ofrece anonimato de IP. Esta versión no incluye relay TURN. Algunos firewalls y NAT restrictivos pueden bloquear la conexión y la herramienta avisa si no puede establecerla. Las salas y mensajes de señalización caducan automáticamente.',
        ],
      },
      {
        title: 'Consumo de internet y límite por sesión',
        paragraphs: [
          'Cada espectador recibe una conexión independiente, así que quien presenta envía una copia de medios por persona. Un flujo de 5 Mbps consume unos 2,25 GB por hora para un espectador y 11,25 GB por hora para cinco; el overhead estimado de red se muestra aparte. El bitrate real cambia según el contenido de la pantalla, la red y el navegador. El presupuesto de subida controla un objetivo del encoder, no limita de forma rígida todo el tráfico.',
          'La herramienta comienza con un límite de sesión de 1 GB y cierre automático. Puedes cambiarlo a 500 MB, 2 GB, 5 GB, un valor personalizado o sin límite. El contador usa bytes de medios WebRTC que informa el navegador; no incluye el total de la operadora, el overhead ni otras aplicaciones. Si el navegador no ofrece contadores, el uso aparece como no medido y no se puede aplicar el límite automáticamente.',
        ],
      },
    ],
    faq: [
      { question: '¿Cómo puede alguien ver mi pantalla?', answer: 'Copia el enlace de la sala cuando comience la captura. El espectador lo abre en otro navegador y la negociación WebRTC ocurre automáticamente.' },
      { question: '¿Se sube mi vídeo o captura al servidor?', answer: 'No. Redis solo guarda datos temporales de sala y señalización. El vídeo y el audio viajan directamente entre navegadores cuando la red lo permite.' },
      { question: '¿Necesito una cuenta o instalar algo?', answer: 'No. Quien presenta necesita un navegador compatible y autoriza la captura desde el selector del navegador. Los espectadores abren el enlace en el navegador.' },
      { question: '¿Por qué puede fallar la conexión en algunas redes?', answer: 'Esta versión usa WebRTC con STUN y conexión P2P directa, sin relay TURN. Algunas VPN, redes corporativas, firewalls y NAT restrictivos bloquean rutas directas.' },
      { question: '¿Puedo compartir el audio del ordenador?', answer: 'Si el navegador y la fuente seleccionada ofrecen audio, puedes permitirlo en el selector de pantalla. La herramienta indica si hay una pista de audio; el soporte depende del dispositivo.' },
    ],
  },
  zh: {
    name: '通过链接共享屏幕',
    shortDescription: '在浏览器中向他人直播电脑屏幕，使用 WebRTC P2P 直连，无需安装应用。',
    primaryKeyword: '通过链接在线共享屏幕',
    secondaryKeywords: ['浏览器共享电脑屏幕', '无需安装软件的屏幕共享', '通过链接观看屏幕共享'],
    searchIntent: '需要快速展示屏幕，且不想注册账号、安排会议或安装桌面应用的用户。',
    seoTitle: '通过链接在线共享屏幕，无需安装应用',
    seoDescription: '在浏览器中直播电脑屏幕并发送观看链接。使用 WebRTC P2P，无需登录或安装应用。',
    h1: '通过链接共享电脑屏幕',
    intro: '在浏览器中批准屏幕捕获，复制房间链接，即可直接向最多五位观众传输画面。',
    contentBlocks: [
      { title: '链接共享如何工作', paragraphs: ['开始直播时，浏览器会让你选择要共享的屏幕、窗口或标签页。工具创建一个临时房间和观看链接。观众在浏览器中打开链接，并与主持人自动协商独立的 WebRTC 连接。', 'Redis 只保存临时房间状态，并在连接建立期间交换信令。视频和兼容的音频通过 WebRTC P2P 在浏览器之间传输，不经过 Redis、Next.js 应用或媒体服务器。'] },
      { title: '质量、音频与连接诊断', paragraphs: ['自动模式以均衡目标开始，并根据连接状态调整捕获分辨率。浏览器支持时，每位观众的码率限制会单独调整。分辨率和帧率是目标值，不是保证值。', '诊断面板只显示浏览器实际提供的 RTT、丢包、码率和接收分辨率。RTT 是连接往返时间，并不等于端到端视频延迟。'] },
      { title: '隐私和直连限制', paragraphs: ['网站不会录制直播。房间链接在房间有效期间可以观看，请只分享给预期的观众，并在结束后关闭房间。浏览器是否能捕获系统或标签页音频取决于设备和选择的来源。', 'WebRTC 使用 ICE 和 STUN 寻找连接路径。直连参与者可能获得连接信息，包括 IP 地址；P2P 不等于 IP 匿名。本版本不包含 TURN 中继，严格的防火墙或 NAT 可能阻止连接。房间和信令会自动过期。'] },
      { title: '流量消耗和会话上限', paragraphs: ['每位观众都有独立连接，因此主持人会为每个人发送一份媒体流。5 Mbps 的视频流每位观众每小时约使用 2.25 GB，五位观众约使用 11.25 GB；估算的网络开销会单独显示。实际码率会随屏幕内容、网络和浏览器变化。上传预算是编码器目标，不是严格的总流量上限。', '工具默认设置 1 GB 会话上限并在达到时自动结束。你可以改为 500 MB、2 GB、5 GB、自定义数值或不限。计数依据浏览器报告的 WebRTC 媒体字节，不包括运营商总流量、网络开销或其他应用。如果浏览器不提供字节计数，应用会显示无法测量，也无法自动执行上限。'] },
    ],
    faq: [
      { question: '别人如何观看我的屏幕？', answer: '开始捕获后复制房间链接。观众在另一个浏览器打开链接，WebRTC 会自动协商连接。' },
      { question: '视频会上传到服务器吗？', answer: '不会。Redis 仅保存临时房间和信令数据；网络允许时，视频和音频直接在浏览器之间传输。' },
      { question: '需要安装应用或注册吗？', answer: '不需要。主持人通过兼容浏览器的屏幕选择器授权捕获，观众打开链接即可观看。' },
      { question: '为什么某些网络无法连接？', answer: '本版本使用 STUN 和 WebRTC P2P，没有 TURN 中继。VPN、企业防火墙或严格的 NAT 可能阻止直连。' },
    ],
  },
};

export const getShareScreenContent = (locale: AppLocale): ShareScreenContent => contentByLocale[locale];
