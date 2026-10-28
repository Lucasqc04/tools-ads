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
    name: 'Chamada com Compartilhamento de Tela',
    shortDescription: 'Faça uma chamada pelo navegador com voz, câmera e compartilhamento de tela P2P por link, sem conta ou instalação.',
    primaryKeyword: 'chamada com compartilhamento de tela por link',
    secondaryKeywords: [
      'chamada online com câmera e microfone sem instalar',
      'compartilhar tela em chamada pelo navegador',
      'reunião por link com compartilhamento de tela',
      'chamada de vídeo p2p no navegador',
      'compartilhar tela e áudio do sistema por link',
    ],
    searchIntent: 'Pessoas que querem conversar por voz e câmera e mostrar uma tela pelo navegador, sem criar conta nem instalar aplicativo.',
    seoTitle: 'Chamada com Compartilhamento de Tela por Link e sem Instalar',
    seoDescription: 'Crie uma chamada no navegador com voz, câmera e tela P2P. Escolha sala pública ou com aprovação, sem login ou instalação.',
    h1: 'Faça uma Chamada e Compartilhe a Tela por Link',
    intro: 'Abra uma sala temporária, convide pessoas por link e converse por voz e câmera enquanto uma pessoa compartilha a tela. Sem conta ou instalação.',
    contentBlocks: [
      {
        title: 'Como funciona o compartilhamento por link',
        paragraphs: [
          'Ao iniciar uma chamada, a ferramenta cria uma sala temporária e gera um link para os participantes. Dentro da sala, cada pessoa pode ligar a câmera e o microfone; quem quiser compartilhar a tela escolhe uma tela, janela ou aba no seletor do navegador. Cada participante abre o link no próprio navegador e negocia conexões WebRTC independentes.',
          'O Redis é usado somente para guardar a sala temporária e trocar ofertas, respostas e candidatos de conexão durante a negociação. O vídeo e o áudio compatível seguem entre os navegadores por WebRTC P2P; eles não são enviados ao Redis, à aplicação Next.js nem a um servidor de mídia.',
        ],
      },
      {
        title: 'Uma chamada simples para conversar e mostrar a tela',
        paragraphs: [
          'Cada pessoa entra com um nome temporário e pode ligar ou desligar o microfone e a câmera durante a conversa. O anfitrião escolhe se qualquer pessoa com o link pode entrar ou se precisa aprovar cada pedido. O link não aparece em uma lista pública; quem o recebe pode encaminhá-lo, então use a sala privada quando quiser controlar a entrada.',
          'Uma pessoa por vez pode compartilhar a tela. O apresentador pode parar ou trocar a fonte pelo controle de tela, enquanto qualquer participante pode sair da chamada. O microfone e a câmera são opcionais e só pedem permissão quando ativados. No celular, assistir costuma funcionar bem; apresentar depende do suporte de captura de tela na versão do navegador e do sistema operacional.',
        ],
        list: [
          'Converse com uma equipe enquanto revisam uma apresentação ou página.',
          'Ajude alguém a resolver um problema mostrando uma janela específica.',
          'Use uma sala privada com aprovação para uma demonstração com convidados.',
        ],
      },
      {
        title: 'Como funcionam voz, câmera e compartilhamento',
        paragraphs: [
          'Áudio, câmera e tela são enviados diretamente entre os navegadores por conexões WebRTC independentes. A sala aceita até cinco convidados por padrão, além do anfitrião. Com mais participantes, cada pessoa pode enviar uma cópia de sua mídia a cada participante; por isso, chamadas maiores podem consumir mais upload e exigir mais do processador. O limite de participantes pode ser configurado no servidor.',
          'A qualidade automática ajusta o bitrate por conexão e, para a tela do apresentador da sala, pode ajustar a resolução com base na maioria das conexões. A tela só pode ter um apresentador de cada vez. A adaptação é uma meta sujeita ao encoder, ao dispositivo e à rede; não promete uma resolução independente para cada pessoa.',
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
          'A transmissão não é gravada pelo site. Os nomes temporários, participantes e mensagens de sinalização ficam no Redis apenas enquanto a sala está ativa e expiram automaticamente. Em salas públicas, qualquer pessoa com o link pode entrar; em salas privadas, o anfitrião aprova cada pedido. O navegador pode disponibilizar o áudio da aba ou do sistema; isso varia conforme o navegador, o sistema operacional e a fonte selecionada.',
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
      { question: 'As pessoas precisam instalar algo ou criar uma conta?', answer: 'Não. Cada participante abre o link no navegador e escolhe um nome temporário. O navegador pede acesso à câmera, ao microfone ou à tela somente quando a pessoa ativa o recurso correspondente.' },
      { question: 'Posso controlar quem entra na chamada?', answer: 'Sim. Escolha uma sala pública por link ou uma sala privada, em que o anfitrião aprova cada solicitação antes da entrada.' },
      { question: 'Quantas pessoas podem compartilhar a tela?', answer: 'Somente uma pessoa por vez. Quando a tela está livre, qualquer participante pode iniciar o seletor do navegador. Quem está compartilhando pode parar a própria transmissão; o anfitrião pode encerrar a chamada.' },
      { question: 'O vídeo ou a captura são enviados ao servidor?', answer: 'Não. Redis guarda apenas dados temporários de sala e sinalização. O vídeo e o áudio seguem diretamente entre os navegadores quando a rede permite.' },
      { question: 'A ferramenta grava a chamada ou compartilha o áudio do computador?', answer: 'O site não grava a chamada. O áudio do sistema ou da aba pode ser compartilhado quando o navegador e a fonte escolhida oferecem essa opção; microfone e áudio recebido podem ser silenciados localmente.' },
    ],
  },
  en: {
    name: 'Video Call with Screen Sharing',
    shortDescription: 'Start a browser call with voice, camera, and P2P screen sharing by link, with no account or app installation.',
    primaryKeyword: 'video call with screen sharing by link',
    secondaryKeywords: [
      'browser call with camera and microphone no install',
      'screen sharing in a browser call by link',
      'online meeting link with screen sharing',
      'p2p video call in browser',
      'share screen and system audio by link',
    ],
    searchIntent: 'People who want to talk with voice and camera and show a screen in their browser without creating an account or installing an app.',
    seoTitle: 'Browser Video Call with Screen Sharing by Link, No Install',
    seoDescription: 'Create a browser call with voice, camera, and P2P screen sharing. Choose open entry or host approval; no sign-in or install.',
    h1: 'Start a Call and Share Your Screen by Link',
    intro: 'Open a temporary room, invite people by link, and talk with voice and camera while one person shares a screen. No account or installation.',
    contentBlocks: [
      {
        title: 'How link-based screen sharing works',
        paragraphs: [
          'When you start a call, the tool creates a temporary room and a link for participants. Inside the room, people can turn on their camera and microphone; anyone who wants to share a screen chooses a screen, window, or tab in the browser picker. Participants open the link in a browser and negotiate independent WebRTC connections.',
          'Redis is used only for temporary room state and to exchange offers, answers, and connection candidates during setup. Compatible video and audio travel between browsers over WebRTC P2P; they are not sent through Redis, the Next.js application, or a media server.',
        ],
      },
      {
        title: 'A simple call for talking and showing a screen',
        paragraphs: [
          'Each person joins with a temporary display name and can turn their microphone and camera on or off during the call. The host chooses whether anyone with the invite can join or whether each request needs approval. The link is not listed publicly, so use a private room when you need to control entry.',
          'Only one person can share a screen at a time. The presenter can stop or switch the source with the screen control, and anyone can leave the call. Camera and microphone are optional and request permission only when enabled. Watching often works well on phones; presenting depends on screen-capture support in the browser version and operating system.',
        ],
        list: [
          'Talk with a team while reviewing a presentation or webpage.',
          'Help someone troubleshoot by showing one application window.',
          'Use a private room with approval for a guest demonstration.',
        ],
      },
      {
        title: 'How voice, camera, and screen sharing work',
        paragraphs: [
          'Audio, camera, and screen tracks travel directly between browsers over separate WebRTC connections. The default room limit is five guests plus the host. With more participants, each person may upload a copy of their media to every other participant, so larger calls can use more upload bandwidth and processor time. The participant limit can be configured on the server.',
          'Automatic quality adjusts the bitrate per connection and can adapt the presenter’s shared capture based on the majority of connections. There can only be one screen presenter at once. Adaptation targets depend on the browser encoder, device, and network; they do not promise a different screen resolution for every viewer.',
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
          'The site does not record calls. Temporary names, participants, and signaling messages stay in Redis only while the room is active and expire automatically. Anyone with a public-room link can join; the host approves requests in a private room. A browser may provide tab or system audio; availability depends on the browser, operating system, and selected source.',
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
      { question: 'Do people need an account or an install?', answer: 'No. Everyone opens the link in a browser and chooses a temporary name. The browser asks for camera, microphone, or screen access only when that person turns the feature on.' },
      { question: 'Can I control who joins the call?', answer: 'Yes. Choose an open room for anyone with the link or a private room where the host approves each join request.' },
      { question: 'How many people can share a screen?', answer: 'One person at a time. When sharing is stopped, any participant can start the browser picker. The person sharing can stop their own stream; the host can end the call.' },
      { question: 'Is my video or capture uploaded to the server?', answer: 'No. Redis stores temporary room and signaling data only. Video and audio travel directly between browsers when the network allows it.' },
      { question: 'Does the site record the call or share system audio?', answer: 'The site does not record the call. Tab or system audio can be shared when the browser and selected source support it; participants can mute their local playback.' },
    ],
  },
  es: {
    name: 'Videollamada con Compartir Pantalla',
    shortDescription: 'Haz una llamada en el navegador con voz, cámara y pantalla P2P por enlace, sin cuenta ni instalar una aplicación.',
    primaryKeyword: 'videollamada con compartir pantalla por enlace',
    secondaryKeywords: [
      'llamada en navegador con cámara y micrófono sin instalar',
      'compartir pantalla en videollamada por enlace',
      'reunión online por enlace con compartir pantalla',
      'videollamada p2p en el navegador',
      'compartir pantalla y audio del sistema por enlace',
    ],
    searchIntent: 'Personas que quieren conversar con voz y cámara y mostrar una pantalla en el navegador, sin crear cuenta ni instalar una app.',
    seoTitle: 'Videollamada con Compartir Pantalla por Enlace y sin Instalar',
    seoDescription: 'Crea una llamada en el navegador con voz, cámara y compartir pantalla P2P. Elige entrada libre o aprobación, sin iniciar sesión.',
    h1: 'Inicia una Llamada y Comparte la Pantalla por Enlace',
    intro: 'Abre una sala temporal, invita por enlace y habla con voz y cámara mientras una persona comparte pantalla. Sin cuenta ni instalación.',
    contentBlocks: [
      {
        title: 'Cómo funciona compartir pantalla por enlace',
        paragraphs: [
          'Al iniciar una llamada, la herramienta crea una sala temporal y un enlace para los participantes. Dentro de la sala, cada persona puede activar cámara y micrófono; quien quiera compartir pantalla elige una pantalla, ventana o pestaña en el selector del navegador. Todos abren el enlace en su navegador y negocian conexiones WebRTC independientes.',
          'Redis solo guarda el estado temporal de la sala e intercambia ofertas, respuestas y candidatos de conexión durante el inicio. El vídeo y el audio compatible viajan entre los navegadores por WebRTC P2P; no pasan por Redis, la aplicación Next.js ni un servidor multimedia.',
        ],
      },
      {
        title: 'Una llamada sencilla para hablar y mostrar la pantalla',
        paragraphs: [
          'Cada persona entra con un nombre temporal y puede activar o desactivar su micrófono y cámara durante la llamada. El anfitrión elige si cualquiera con el enlace puede entrar o si debe aprobar cada solicitud. El enlace no se publica en un directorio; usa una sala privada si necesitas controlar la entrada.',
          'Solo una persona puede compartir la pantalla a la vez. Quien presenta puede detener o cambiar la fuente desde el control de pantalla, y cualquier participante puede salir de la llamada. Cámara y micrófono son opcionales y solicitan permiso solo al activarlos. En móviles, mirar suele funcionar bien; presentar depende del soporte de captura de pantalla del navegador, su versión y el sistema operativo.',
        ],
        list: [
          'Habla con un equipo mientras revisáis una presentación o página.',
          'Ayuda a alguien a resolver un problema mostrando una ventana.',
          'Usa una sala privada con aprobación para una demostración con invitados.',
        ],
      },
      {
        title: 'Cómo funcionan la voz, la cámara y la pantalla',
        paragraphs: [
          'El audio, la cámara y la pantalla viajan directamente entre navegadores por conexiones WebRTC independientes. El límite predeterminado es de cinco invitados más el anfitrión. Con más participantes, cada persona puede enviar una copia de sus medios a cada integrante; las llamadas grandes pueden consumir más subida y procesador. El límite se puede configurar en el servidor.',
          'La calidad automática ajusta el bitrate por conexión y puede adaptar la captura del presentador según la mayoría de las conexiones. Solo puede haber una pantalla compartida a la vez. Los objetivos dependen del encoder, el dispositivo y la red; no garantizan una resolución diferente para cada espectador.',
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
          'El sitio no graba las llamadas. Los nombres temporales, participantes y mensajes de señalización solo permanecen en Redis mientras la sala está activa y caducan automáticamente. En una sala pública, cualquiera con el enlace puede entrar; en una privada, el anfitrión aprueba cada solicitud. El navegador puede ofrecer audio de pestaña o del sistema según la fuente y el dispositivo.',
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
      { question: '¿Hace falta una cuenta o instalar algo?', answer: 'No. Cada persona abre el enlace en el navegador y elige un nombre temporal. El navegador pide acceso a cámara, micrófono o pantalla solo al activar el control correspondiente.' },
      { question: '¿Puedo controlar quién entra en la llamada?', answer: 'Sí. Elige una sala pública por enlace o una sala privada en la que el anfitrión aprueba cada solicitud.' },
      { question: '¿Cuántas personas pueden compartir pantalla?', answer: 'Solo una persona a la vez. Cuando la pantalla queda libre, cualquier participante puede iniciar el selector del navegador. Quien comparte puede detener su propia transmisión; el anfitrión puede finalizar la llamada.' },
      { question: '¿Se sube mi vídeo o captura al servidor?', answer: 'No. Redis solo guarda datos temporales de sala y señalización. El vídeo y el audio viajan directamente entre navegadores cuando la red lo permite.' },
      { question: '¿Se graba la llamada o se puede compartir el audio del sistema?', answer: 'El sitio no graba la llamada. El audio de una pestaña o del sistema se puede compartir si el navegador y la fuente elegida lo permiten; cada persona puede silenciar la reproducción local.' },
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
