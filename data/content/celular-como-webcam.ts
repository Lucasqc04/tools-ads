import type { AppLocale } from '@/lib/i18n/config';
import type { ContentBlock, FaqItem } from '@/types/content';

export type CelularWebcamContent = {
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

const contentByLocale: Record<AppLocale, CelularWebcamContent> = {
  'pt-br': {
    name: 'Celular como Webcam',
    shortDescription: 'Use a câmera do celular no computador pelo navegador, sem instalar aplicativo no telefone.',
    primaryKeyword: 'usar celular como webcam no PC',
    secondaryKeywords: [
      'transformar celular em webcam para computador',
      'câmera do celular no PC sem aplicativo',
      'usar celular como câmera no OBS',
      'webcam do celular pelo navegador',
      'transmitir câmera do celular para o computador',
    ],
    searchIntent: 'Quem quer aproveitar a câmera do celular como vídeo de uma chamada ou captura no computador sem instalar um app no telefone.',
    seoTitle: 'Use o Celular como Webcam no PC, sem Instalar App | Tools',
    seoDescription: 'Conecte a câmera do celular ao computador por QR Code e WebRTC P2P. Sem aplicativo no telefone; use a prévia do navegador no OBS.',
    h1: 'Use o Celular como Webcam no PC',
    intro: 'Conecte o celular ao computador por QR Code e transmita a câmera direto entre os navegadores, sem instalar aplicativo no telefone.',
    contentBlocks: [
      {
        title: 'Como conectar o celular ao computador',
        paragraphs: [
          'Abra esta ferramenta no computador e crie uma sessão temporária. Leia o QR Code com o celular, permita o acesso à câmera e confirme a conexão na tela do computador. Depois da aprovação, o telefone envia o vídeo diretamente ao navegador do PC usando WebRTC. O processo não exige cadastro nem aplicativo instalado no celular; o navegador do telefone precisa aceitar captura de câmera e abrir a página por HTTPS.',
          'O servidor é usado somente para parear os dois navegadores e trocar os dados necessários para iniciar a conexão. Ofertas, respostas e candidatos de rede ficam temporariamente no Redis e são removidos ao encerrar a sessão ou expiram automaticamente. O vídeo e o áudio opcional não passam pelo Redis, pelo Next.js ou por um servidor de mídia.',
        ],
      },
      {
        title: 'Qualidade de imagem e controles do celular',
        paragraphs: [
          'A transmissão começa com uma meta equilibrada de 720p a 30 quadros por segundo. Os perfis econômico, alta qualidade, fluido e 4K são pedidos flexíveis: o navegador escolhe o que a câmera e o aparelho conseguem entregar, e a tela do computador mostra resolução, quadros por segundo e bitrate somente quando os dados estão disponíveis. Uma rede instável pode reduzir a qualidade ou interromper o vídeo.',
          'No telefone, você pode trocar entre a câmera frontal e traseira, escolher outro dispositivo quando o navegador o identifica e ajustar opções reais como zoom ou lanterna quando o hardware permite. O microfone fica desligado no início e pode ser ativado separadamente. A disponibilidade muda entre Android, iOS e versões de navegador; controles incompatíveis são ocultados e não impedem o vídeo básico.',
        ],
      },
      {
        title: 'Usar a imagem no OBS e em chamadas',
        paragraphs: [
          'No computador, abra a visualização limpa em uma janela separada e adicione uma fonte de captura de janela no OBS Studio. Escolha a janela da prévia, ajuste o enquadramento e inicie a Câmera Virtual do OBS. Em seguida, selecione OBS Virtual Camera no Discord, Meet, Zoom ou outro aplicativo. O site não instala uma webcam virtual no sistema operacional; a Câmera Virtual é iniciada pelo próprio OBS.',
          'No Linux, o recurso de câmera virtual do OBS pode depender do módulo v4l2loopback, conforme a distribuição e a instalação. A captura de uma janela do navegador funciona como alternativa para gravar ou transmitir. A prévia limpa usa a mesma conexão de vídeo que a página do computador e não cria um segundo receptor P2P nem duplica o envio do celular.',
        ],
      },
      {
        title: 'Privacidade, conexão e limites práticos',
        paragraphs: [
          'A sessão usa identificadores e credenciais aleatórios, permite um celular por vez e exige aprovação explícita no computador antes de começar a transmissão. O servidor guarda hashes dos segredos, estado temporário e mensagens de sinalização com prazo de expiração; não grava câmera, microfone ou capturas. Os dados de conexão do WebRTC são trocados para estabelecer a rota e não são enviados à análise do site.',
          'Uma conexão P2P pode revelar informações de conectividade, inclusive o endereço IP, aos navegadores conectados; P2P não significa anonimato de rede. A configuração padrão usa STUN e não inclui relay TURN. Alguns firewalls e roteadores impedem a conexão direta; nesses casos, a transmissão não começa até configurar um servidor TURN compatível. Mantenha a página aberta: o navegador ou o sistema pode pausar a câmera quando o celular vai para segundo plano ou bloqueia a tela.',
        ],
      },
    ],
    faq: [
      { question: 'Preciso instalar um aplicativo no celular?', answer: 'Não. Leia o QR Code e abra a página no navegador do celular. A câmera só é solicitada quando você toca em Iniciar câmera.' },
      { question: 'O vídeo é enviado ao servidor?', answer: 'Não. O vídeo segue por WebRTC entre o celular e o computador. O servidor troca somente mensagens temporárias de sinalização para estabelecer a conexão.' },
      { question: 'Por que o celular às vezes não conecta ao PC?', answer: 'Firewalls e alguns roteadores bloqueiam conexões diretas. A versão padrão usa STUN e não tem relay TURN configurado; configure um TURN compatível no servidor para redes que exigem retransmissão.' },
      { question: 'A ferramenta cria uma webcam virtual para o Windows ou macOS?', answer: 'Não. Ela fornece uma janela limpa para captura. No OBS, capture essa janela e inicie a Câmera Virtual do OBS para selecioná-la em outros aplicativos.' },
      { question: 'O celular pode ficar com a tela bloqueada?', answer: 'Não há garantia. Navegadores e sistemas móveis podem suspender a câmera ou a conexão em segundo plano; mantenha a tela ativa durante a transmissão.' },
    ],
  },
  en: {
    name: 'Phone as a Webcam',
    shortDescription: 'Use your phone camera on a computer through the browser, with no phone app to install.',
    primaryKeyword: 'use phone as a webcam for PC',
    secondaryKeywords: [
      'turn phone into webcam for computer',
      'phone camera on PC without an app',
      'use phone as a camera in OBS',
      'phone webcam in browser',
      'stream phone camera to computer',
    ],
    searchIntent: 'People who want to use a phone camera as video for a computer call or capture without installing a phone app.',
    seoTitle: 'Use Your Phone as a Webcam for PC, No App Needed | Tools',
    seoDescription: 'Pair your phone camera with a computer by QR code and WebRTC P2P. No phone app; capture the browser preview in OBS.',
    h1: 'Use Your Phone as a Webcam for PC',
    intro: 'Pair your phone and computer with a QR code and stream video directly between browsers, with no phone app to install.',
    contentBlocks: [
      {
        title: 'Connect a phone to your computer',
        paragraphs: [
          'Open this tool on the computer and create a temporary session. Scan the QR code with your phone, allow camera access, and confirm the connection on the computer screen. After approval, the phone sends video directly to the PC browser with WebRTC. No account or phone app is required; the phone browser must support camera capture and open the page over HTTPS.',
          'The server only pairs the browsers and exchanges the data needed to start their connection. Offers, answers, and network candidates are kept in Redis temporarily and are deleted when the session ends or expire automatically. Video and optional audio never pass through Redis, Next.js, or a media server.',
        ],
      },
      {
        title: 'Video quality and phone controls',
        paragraphs: [
          'The stream starts with a balanced target of 720p at 30 frames per second. Economy, high quality, fluid, and 4K profiles are flexible requests: the browser chooses what the camera and device can deliver, and the computer shows resolution, frame rate, and bitrate only when those values are available. An unstable network can lower quality or interrupt video.',
          'On the phone, switch between front and rear cameras, select another device when the browser identifies it, and use real options such as zoom or torch when the hardware supports them. The microphone starts off and can be enabled separately. Support differs across Android, iOS, and browser versions; unsupported controls stay hidden without affecting basic video.',
        ],
      },
      {
        title: 'Use the picture in OBS and calls',
        paragraphs: [
          'On the computer, open the clean preview in a separate window and add a Window Capture source in OBS Studio. Select the preview window, frame it, and start OBS Virtual Camera. Then choose OBS Virtual Camera in Discord, Meet, Zoom, or another app. This site does not install a system webcam; OBS starts its own virtual camera.',
          'On Linux, OBS virtual camera support may depend on the v4l2loopback module and your distribution setup. Capturing a browser window is another way to record or stream. The clean preview shares the computer page’s existing video connection, so it does not create a second P2P receiver or duplicate the phone upload.',
        ],
      },
      {
        title: 'Privacy, connection, and practical limits',
        paragraphs: [
          'Each session uses random identifiers and credentials, allows one phone at a time, and requires explicit approval on the computer before transmission starts. The server keeps credential hashes, temporary session state, and expiring signaling messages; it does not record camera, microphone, or screen capture. WebRTC connection details are exchanged to establish a route and are not sent to site analytics.',
          'A P2P connection can expose connectivity details, including IP addresses, to connected browsers; P2P does not provide network anonymity. The default configuration uses STUN and has no TURN relay. Some firewalls and routers block direct connections; in that case, a compatible TURN server must be configured before a stream can connect. Keep the page open: a browser or mobile system may pause the camera when the phone goes to the background or locks.',
        ],
      },
    ],
    faq: [
      { question: 'Do I need to install an app on my phone?', answer: 'No. Scan the QR code and open the page in your phone browser. Camera access is requested only after you tap Start camera.' },
      { question: 'Does the video go to a server?', answer: 'No. Video travels over WebRTC between the phone and computer. The server exchanges only temporary signaling messages needed to establish the connection.' },
      { question: 'Why can’t my phone connect to the PC?', answer: 'Firewalls and some routers block direct connections. The default setup uses STUN and has no TURN relay; configure a compatible TURN server for networks that require relaying.' },
      { question: 'Does this create a native webcam for Windows or macOS?', answer: 'No. It provides a clean browser window for capture. In OBS, capture that window and start OBS Virtual Camera to select it in other apps.' },
      { question: 'Can I lock my phone screen while streaming?', answer: 'There is no guarantee. Mobile browsers and operating systems may suspend the camera or connection in the background, so keep the screen awake while streaming.' },
    ],
  },
  es: {
    name: 'Celular como Webcam',
    shortDescription: 'Usa la cámara del celular en la computadora desde el navegador, sin instalar una app en el teléfono.',
    primaryKeyword: 'usar el celular como webcam para PC',
    secondaryKeywords: [
      'convertir celular en webcam para computadora',
      'cámara del celular en PC sin aplicación',
      'usar celular como cámara en OBS',
      'webcam del móvil desde el navegador',
      'transmitir cámara del celular al ordenador',
    ],
    searchIntent: 'Personas que quieren usar la cámara del celular en una llamada o captura en la computadora sin instalar una aplicación en el teléfono.',
    seoTitle: 'Usa el Celular como Webcam para PC, sin Instalar Apps | Tools',
    seoDescription: 'Conecta la cámara del celular a la computadora con un código QR y WebRTC P2P. Sin app en el teléfono; captura la vista del navegador en OBS.',
    h1: 'Usa el Celular como Webcam para PC',
    intro: 'Conecta el celular y la computadora con un código QR y transmite video directamente entre navegadores, sin instalar una app en el teléfono.',
    contentBlocks: [
      {
        title: 'Conecta el celular a la computadora',
        paragraphs: [
          'Abre esta herramienta en la computadora y crea una sesión temporal. Escanea el código QR con el celular, permite el acceso a la cámara y confirma la conexión en la pantalla del ordenador. Tras la aprobación, el teléfono envía el video directamente al navegador de la PC mediante WebRTC. No hace falta una cuenta ni instalar una app; el navegador del celular debe admitir la captura de cámara y abrir la página por HTTPS.',
          'El servidor solo empareja los navegadores e intercambia los datos necesarios para iniciar la conexión. Las ofertas, respuestas y candidatos de red se guardan temporalmente en Redis y se eliminan al cerrar la sesión o vencen automáticamente. El video y el audio opcional no pasan por Redis, Next.js ni por un servidor multimedia.',
        ],
      },
      {
        title: 'Calidad de video y controles del celular',
        paragraphs: [
          'La transmisión comienza con una meta equilibrada de 720p a 30 cuadros por segundo. Los perfiles económico, alta calidad, fluido y 4K son solicitudes flexibles: el navegador elige lo que admiten la cámara y el dispositivo, y la computadora muestra resolución, cuadros por segundo y bitrate solo cuando esos datos están disponibles. Una red inestable puede reducir la calidad o interrumpir el video.',
          'En el teléfono puedes alternar entre la cámara frontal y trasera, elegir otro dispositivo si el navegador lo identifica y usar opciones reales como zoom o linterna cuando el hardware las admite. El micrófono empieza apagado y se activa por separado. La compatibilidad cambia entre Android, iOS y las versiones del navegador; las opciones no compatibles se ocultan y no afectan el video básico.',
        ],
      },
      {
        title: 'Usa la imagen en OBS y en llamadas',
        paragraphs: [
          'En la computadora, abre la vista limpia en una ventana separada y añade una fuente de captura de ventana en OBS Studio. Selecciona la vista, ajusta el encuadre e inicia OBS Virtual Camera. Después, selecciona OBS Virtual Camera en Discord, Meet, Zoom u otra aplicación. El sitio no instala una webcam en el sistema operativo; OBS inicia su propia cámara virtual.',
          'En Linux, la cámara virtual de OBS puede depender del módulo v4l2loopback y de la distribución. Capturar una ventana del navegador también sirve para grabar o transmitir. La vista limpia comparte la conexión de video existente de la página en la computadora: no crea otro receptor P2P ni duplica la carga enviada por el celular.',
        ],
      },
      {
        title: 'Privacidad, conexión y límites prácticos',
        paragraphs: [
          'Cada sesión usa identificadores y credenciales aleatorios, permite un celular a la vez y requiere aprobación explícita en la computadora antes de transmitir. El servidor conserva hashes de credenciales, estado temporal y mensajes de señalización con vencimiento; no graba la cámara, el micrófono ni la pantalla. Los datos de conexión de WebRTC se intercambian para establecer una ruta y no se envían a las analíticas del sitio.',
          'Una conexión P2P puede revelar información de red, incluidas direcciones IP, a los navegadores conectados; P2P no ofrece anonimato de red. La configuración predeterminada usa STUN y no incluye relay TURN. Algunos firewalls y routers bloquean conexiones directas; para esas redes se debe configurar un servidor TURN compatible. Mantén la página abierta: el navegador o el sistema móvil puede pausar la cámara cuando el teléfono pasa a segundo plano o bloquea la pantalla.',
        ],
      },
    ],
    faq: [
      { question: '¿Tengo que instalar una app en el celular?', answer: 'No. Escanea el código QR y abre la página en el navegador del teléfono. La cámara se solicita cuando pulsas Iniciar cámara.' },
      { question: '¿El video se envía a un servidor?', answer: 'No. El video viaja por WebRTC entre el celular y la computadora. El servidor intercambia solo mensajes temporales de señalización para establecer la conexión.' },
      { question: '¿Por qué a veces no se conecta el celular con la PC?', answer: 'Los firewalls y algunos routers bloquean conexiones directas. La configuración predeterminada usa STUN y no tiene relay TURN; configura un servidor TURN compatible para redes que lo necesiten.' },
      { question: '¿La herramienta crea una webcam virtual para Windows o macOS?', answer: 'No. Ofrece una ventana limpia para capturar. En OBS, captura esa ventana e inicia OBS Virtual Camera para seleccionarla en otras aplicaciones.' },
      { question: '¿Puedo bloquear la pantalla del celular mientras transmito?', answer: 'No está garantizado. Los navegadores móviles y el sistema operativo pueden suspender la cámara o la conexión en segundo plano; mantén la pantalla activa durante la transmisión.' },
    ],
  },
  zh: {
    name: '手机作为电脑摄像头',
    shortDescription: '通过浏览器将手机摄像头用于电脑，无需在手机上安装应用。',
    primaryKeyword: '手机作为电脑摄像头',
    secondaryKeywords: ['手机摄像头连接电脑', '手机摄像头用于 OBS', '浏览器手机摄像头', '手机摄像头传到电脑'],
    searchIntent: '希望在电脑通话或录制中使用手机摄像头、又不想在手机安装应用的用户。',
    seoTitle: '手机作为电脑摄像头，无需安装应用 | Tools',
    seoDescription: '通过二维码和 WebRTC P2P 将手机摄像头连接到电脑。无需在手机安装应用，可在 OBS 中捕获浏览器预览。',
    h1: '将手机用作电脑摄像头',
    intro: '扫描二维码连接手机和电脑，视频直接在两个浏览器之间传输，无需在手机安装应用。',
    contentBlocks: [
      {
        title: '连接手机和电脑',
        paragraphs: [
          '在电脑上打开此工具并创建临时会话。用手机扫描二维码，允许摄像头权限，然后在电脑屏幕上确认连接。获准后，手机通过 WebRTC 将视频直接发送到电脑浏览器。无需账号或手机应用；手机浏览器需要支持摄像头采集，并通过 HTTPS 打开页面。',
          '服务器只负责配对浏览器并交换启动连接所需的数据。SDP offer、answer 和网络候选信息会暂存在 Redis 中，会话结束时删除或自动过期。视频和可选音频不会经过 Redis、Next.js 或媒体服务器。',
        ],
      },
      {
        title: '画质和手机控制',
        paragraphs: [
          '默认画质目标为 720p、每秒 30 帧。省流、高清、流畅和 4K 都是灵活请求，实际效果取决于摄像头、手机、浏览器和网络。只有浏览器提供数据时，电脑才会显示实际分辨率、帧率和码率；网络不稳定时画质可能下降或中断。',
          '手机端可切换前后摄像头，选择浏览器识别到的其他摄像头，并在设备支持时使用变焦或闪光灯。麦克风默认关闭，可单独开启。Android、iOS 和不同浏览器版本的功能支持不一样；不支持的控制项会隐藏，不影响基本视频传输。',
        ],
      },
      {
        title: '在 OBS 和通话应用中使用',
        paragraphs: [
          '在电脑上打开独立的纯净预览窗口，在 OBS Studio 中添加窗口采集源并选择该窗口。调整画面后启动 OBS 虚拟摄像头，再在 Discord、Meet、Zoom 等应用中选择 OBS Virtual Camera。本工具不会向操作系统安装原生虚拟摄像头驱动。',
          'Linux 上的 OBS 虚拟摄像头可能依赖 v4l2loopback 模块，具体取决于发行版和安装方式。也可以直接采集浏览器窗口进行录制或直播。纯净预览与电脑页面共用同一条视频连接，不会增加第二个 P2P 接收端或重复手机上传。',
        ],
      },
      {
        title: '隐私、连接和实际限制',
        paragraphs: [
          '每个会话使用随机标识和凭据，一次只允许一台手机，并且需要电脑明确批准后才会开始发送视频。服务器只保存凭据哈希、临时状态和有过期时间的信令消息，不录制摄像头、麦克风或屏幕。WebRTC 会交换建立网络连接所需的信息，不会发送到网站分析系统。',
          'P2P 连接可能向连接的浏览器暴露网络信息，包括 IP 地址，因此 P2P 不代表网络匿名。默认配置使用 STUN，没有配置 TURN 中继。某些防火墙和路由器会阻止直连，这类网络需要配置兼容的 TURN 服务器。请保持页面打开；手机浏览器或系统可能在后台或锁屏时暂停摄像头。',
        ],
      },
    ],
    faq: [
      { question: '需要在手机安装应用吗？', answer: '不需要。扫描二维码并在手机浏览器打开页面。点击“启动摄像头”后才会请求摄像头权限。' },
      { question: '视频会发送到服务器吗？', answer: '不会。视频通过 WebRTC 在手机和电脑之间传输。服务器只交换建立连接所需的临时信令消息。' },
      { question: '为什么手机有时无法连接电脑？', answer: '防火墙和部分路由器会阻止直连。默认配置使用 STUN，没有 TURN 中继；需要中继的网络应配置兼容的 TURN 服务器。' },
      { question: '它能为 Windows 或 macOS 创建系统摄像头吗？', answer: '不能。它提供一个纯净的浏览器窗口供 OBS 捕获。启动 OBS Virtual Camera 后，其他应用才能选择它。' },
      { question: '传输时可以锁定手机屏幕吗？', answer: '无法保证。移动浏览器或系统可能在后台暂停摄像头和连接，传输时请保持屏幕开启。' },
    ],
  },
};

export const getCelularWebcamContent = (locale: AppLocale): CelularWebcamContent => contentByLocale[locale];
