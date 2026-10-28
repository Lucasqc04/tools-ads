import type { AppLocale } from '@/lib/i18n/config';

export type ShareScreenUi = {
  eyebrow: string;
  startTitle: string;
  startDescription: string;
  startButton: string;
  startShort: string;
  advanced: string;
  qualityLabel: string;
  qualityAutomatic: string;
  qualityEconomy: string;
  qualityBalanced: string;
  qualityHigh: string;
  qualityFluid: string;
  qualityMaximum: string;
  noAccount: string;
  noInstall: string;
  p2pNote: string;
  connectivityNotice: string;
  roomActive: string;
  connecting: string;
  reconnecting: string;
  excellent: string;
  stable: string;
  unstable: string;
  waiting: string;
  viewers: string;
  negotiating: string;
  elapsed: string;
  shareLink: string;
  copyLink: string;
  copied: string;
  settings: string;
  diagnostics: string;
  showDiagnostics: string;
  hideDiagnostics: string;
  stop: string;
  endRoom: string;
  hostPreview: string;
  capturing: string;
  waitingViewers: string;
  audioPresent: string;
  audioMissing: string;
  qualityLimited: string;
  connection: string;
  resolution: string;
  frameRate: string;
  bitrate: string;
  roundTrip: string;
  packetLoss: string;
  iceRoute: string;
  upload: string;
  droppedFrames: string;
  notMeasured: string;
  direct: string;
  relayed: string;
  unknownRoute: string;
  statsNote: string;
  spectator: string;
  hostRecovering: string;
  roomEnded: string;
  roomExpired: string;
  roomFull: string;
  unableToConnect: string;
  redisUnavailable: string;
  genericError: string;
  captureUnsupported: string;
  captureCanceled: string;
  retry: string;
  retryConnection: string;
  resume: string;
  resumeDescription: string;
  openBrowserPicker: string;
  watchTitle: string;
  watchDescription: string;
  preparingVideo: string;
  waitingForHost: string;
  watchReady: string;
  playWithSound: string;
  mute: string;
  unmute: string;
  volume: string;
  fullscreen: string;
  exitFullscreen: string;
  audio: string;
  p2pPrivacy: string;
  negotiationFailed: string;
  connectionLost: string;
  startAnother: string;
};

export const shareScreenUi: Record<AppLocale, ShareScreenUi> = {
  'pt-br': {
    eyebrow: 'Chamada P2P pelo navegador',
    startTitle: 'Converse e compartilhe a tela em uma chamada.',
    startDescription: 'Crie uma sala por link, ligue câmera ou microfone se quiser e compartilhe a tela com as pessoas da chamada.',
    startButton: 'Iniciar chamada',
    startShort: 'Assistir agora',
    advanced: 'Qualidade da transmissão',
    qualityLabel: 'Qualidade',
    qualityAutomatic: 'Automática · recomendada',
    qualityEconomy: 'Econômica · 480p / 30 FPS',
    qualityBalanced: 'Equilibrada · 720p / 30 FPS',
    qualityHigh: 'Alta qualidade · 1080p / 30 FPS',
    qualityFluid: 'Fluidez · 720p / 60 FPS',
    qualityMaximum: 'Máxima · 1080p / 60 FPS',
    noAccount: 'Sem conta',
    noInstall: 'Sem instalação',
    p2pNote: 'A chamada usa WebRTC P2P. Áudio e vídeo vão diretamente entre os participantes.',
    connectivityNotice: 'Em conexões diretas, participantes podem descobrir informações de conectividade, inclusive endereços IP.',
    roomActive: 'Chamada ao vivo',
    connecting: 'Conectando',
    reconnecting: 'Reconectando',
    excellent: 'Conexão excelente',
    stable: 'Conexão estável',
    unstable: 'Conexão instável',
    waiting: 'Aguardando dados',
    viewers: 'participantes',
    negotiating: 'conexões negociando',
    elapsed: 'duração',
    shareLink: 'Link da chamada',
    copyLink: 'Copiar link',
    copied: 'Link copiado',
    settings: 'Configurações',
    diagnostics: 'Diagnóstico',
    showDiagnostics: 'Ver estatísticas',
    hideDiagnostics: 'Ocultar estatísticas',
    stop: 'Parar transmissão',
    endRoom: 'Encerrar sala',
    hostPreview: 'Prévia do que está sendo transmitido',
    capturing: 'Capturando a tela selecionada',
    waitingViewers: 'O convite está pronto. Aguardando participantes.',
    audioPresent: 'Áudio compartilhado disponível',
    audioMissing: 'Sem áudio nesta transmissão',
    qualityLimited: 'O navegador não aplicou todas as metas de qualidade. Mantivemos a melhor configuração disponível.',
    connection: 'Conexão',
    resolution: 'Resolução atual',
    frameRate: 'Quadros por segundo',
    bitrate: 'Bitrate recebido',
    roundTrip: 'RTT estimado',
    packetLoss: 'Perda de pacotes',
    iceRoute: 'Rota ICE',
    upload: 'Upload usado',
    droppedFrames: 'Quadros descartados',
    notMeasured: 'Ainda não medido',
    direct: 'Direta',
    relayed: 'Retransmitida',
    unknownRoute: 'Indisponível',
    statsNote: 'A classificação é aproximada: excelente usa RTT abaixo de 120 ms, perda abaixo de 1% e bitrate de ao menos 1 Mbps; instável usa RTT a partir de 350 ms, perda a partir de 4% ou bitrate abaixo de 250 kbps. Métricas ausentes não são inventadas. O orçamento de upload é uma meta do encoder, não um teto rígido; sem contador de bytes, o limite de sessão não pode ser aplicado. RTT mede a ida e volta da conexão, não o atraso total do vídeo.',
    spectator: 'Espectador',
    hostRecovering: 'Aguardando a reconexão de quem apresenta…',
    roomEnded: 'Esta transmissão foi encerrada.',
    roomExpired: 'Esta sala expirou. Peça ao apresentador um novo link.',
    roomFull: 'Esta sala atingiu o limite de espectadores.',
    unableToConnect: 'Não foi possível estabelecer uma conexão P2P. A rede pode bloquear a rota direta.',
    redisUnavailable: 'A sinalização está temporariamente indisponível. Verifique a conexão e tente novamente.',
    genericError: 'Algo deu errado. Tente novamente.',
    captureUnsupported: 'O navegador ou contexto atual não disponibiliza a captura de tela. A disponibilidade varia por navegador e sistema.',
    captureCanceled: 'A seleção de tela foi cancelada.',
    retry: 'Tentar novamente',
    retryConnection: 'Reconectar',
    resume: 'Retomar transmissão',
    resumeDescription: 'Encontramos uma sala recente nesta aba. Compartilhe a tela novamente para reconectar os espectadores.',
    openBrowserPicker: 'Escolha uma tela, janela ou aba no seletor do navegador.',
    watchTitle: 'Transmissão de tela',
    watchDescription: 'Conexão direta com quem está apresentando.',
    preparingVideo: 'Preparando conexão segura…',
    waitingForHost: 'Aguardando o apresentador iniciar a transmissão…',
    watchReady: 'Transmissão pronta. Toque em “Assistir agora” para conectar.',
    playWithSound: 'Iniciar reprodução com áudio',
    mute: 'Silenciar',
    unmute: 'Ativar áudio',
    volume: 'Volume',
    fullscreen: 'Tela cheia',
    exitFullscreen: 'Sair da tela cheia',
    audio: 'Áudio',
    p2pPrivacy: 'Vídeo e áudio não são gravados nem enviados ao servidor de mídia. WebRTC P2P pode revelar dados de conectividade entre participantes.',
    negotiationFailed: 'A negociação não foi concluída. Confira a rede ou tente de novo.',
    connectionLost: 'A conexão caiu. Tentando reconectar automaticamente…',
    startAnother: 'Iniciar outra transmissão',
  },
  en: {
    eyebrow: 'Browser P2P call',
    startTitle: 'Talk and share your screen in one call.',
    startDescription: 'Create a room by link, turn on your camera or microphone if you like, and share a screen with the call.',
    startButton: 'Start call',
    startShort: 'Watch now',
    advanced: 'Broadcast quality',
    qualityLabel: 'Quality',
    qualityAutomatic: 'Automatic · recommended',
    qualityEconomy: 'Economy · 480p / 30 FPS',
    qualityBalanced: 'Balanced · 720p / 30 FPS',
    qualityHigh: 'High quality · 1080p / 30 FPS',
    qualityFluid: 'Fluid · 720p / 60 FPS',
    qualityMaximum: 'Maximum · 1080p / 60 FPS',
    noAccount: 'No account',
    noInstall: 'No install',
    p2pNote: 'Calls use WebRTC P2P. Audio and video travel directly between participants.',
    connectivityNotice: 'On direct connections, participants may learn connectivity details, including IP addresses.',
    roomActive: 'Live call',
    connecting: 'Connecting',
    reconnecting: 'Reconnecting',
    excellent: 'Excellent connection',
    stable: 'Stable connection',
    unstable: 'Unstable connection',
    waiting: 'Waiting for data',
    viewers: 'participants',
    negotiating: 'connections negotiating',
    elapsed: 'duration',
    shareLink: 'Call link',
    copyLink: 'Copy link',
    copied: 'Link copied',
    settings: 'Settings',
    diagnostics: 'Diagnostics',
    showDiagnostics: 'View stats',
    hideDiagnostics: 'Hide stats',
    stop: 'Stop broadcast',
    endRoom: 'End room',
    hostPreview: 'Preview of your broadcast',
    capturing: 'Capturing the selected screen',
    waitingViewers: 'Your invite is ready. Waiting for participants.',
    audioPresent: 'Shared audio available',
    audioMissing: 'No audio in this broadcast',
    qualityLimited: 'Your browser could not apply every quality target. We kept the best available settings.',
    connection: 'Connection',
    resolution: 'Current resolution',
    frameRate: 'Frames per second',
    bitrate: 'Received bitrate',
    roundTrip: 'Estimated RTT',
    packetLoss: 'Packet loss',
    iceRoute: 'ICE route',
    upload: 'Upload in use',
    droppedFrames: 'Dropped frames',
    notMeasured: 'Not measured yet',
    direct: 'Direct',
    relayed: 'Relayed',
    unknownRoute: 'Unavailable',
    statsNote: 'The rating is approximate: excellent uses RTT below 120 ms, loss below 1%, and bitrate of at least 1 Mbps; unstable uses RTT at or above 350 ms, loss at or above 4%, or bitrate below 250 kbps. Missing metrics are not invented. The upload budget is an encoder target, not a hard transport cap; without byte counters, the session limit cannot be enforced. RTT is a connection round trip, not total video delay.',
    spectator: 'Viewer',
    hostRecovering: 'Waiting for the presenter to reconnect…',
    roomEnded: 'This broadcast has ended.',
    roomExpired: 'This room expired. Ask the presenter for a new link.',
    roomFull: 'This room has reached its viewer limit.',
    unableToConnect: 'A P2P connection could not be established. The network may block a direct route.',
    redisUnavailable: 'Signaling is temporarily unavailable. Check your connection and try again.',
    genericError: 'Something went wrong. Please try again.',
    captureUnsupported: 'Screen capture is not available in this browser or page context. Availability varies by browser and operating system.',
    captureCanceled: 'Screen selection was canceled.',
    retry: 'Try again',
    retryConnection: 'Reconnect',
    resume: 'Resume broadcast',
    resumeDescription: 'A recent room was found in this tab. Share your screen again to reconnect viewers.',
    openBrowserPicker: 'Choose a screen, window, or tab in the browser picker.',
    watchTitle: 'Screen broadcast',
    watchDescription: 'Direct connection to the presenter.',
    preparingVideo: 'Preparing a secure connection…',
    waitingForHost: 'Waiting for the presenter to start…',
    watchReady: 'The broadcast is ready. Select “Watch now” to connect.',
    playWithSound: 'Start playback with audio',
    mute: 'Mute',
    unmute: 'Turn on audio',
    volume: 'Volume',
    fullscreen: 'Full screen',
    exitFullscreen: 'Exit full screen',
    audio: 'Audio',
    p2pPrivacy: 'Video and audio are not recorded or sent to a media server. WebRTC P2P may reveal connectivity details between participants.',
    negotiationFailed: 'Negotiation did not complete. Check the network or try again.',
    connectionLost: 'Connection dropped. Trying to reconnect automatically…',
    startAnother: 'Start another broadcast',
  },
  es: {
    eyebrow: 'Videollamada P2P en el navegador',
    startTitle: 'Habla y comparte la pantalla en una llamada.',
    startDescription: 'Crea una sala por enlace, activa la cámara o el micrófono si quieres y comparte la pantalla con las personas de la llamada.',
    startButton: 'Iniciar llamada',
    startShort: 'Ver ahora',
    advanced: 'Calidad de la transmisión',
    qualityLabel: 'Calidad',
    qualityAutomatic: 'Automática · recomendada',
    qualityEconomy: 'Económica · 480p / 30 FPS',
    qualityBalanced: 'Equilibrada · 720p / 30 FPS',
    qualityHigh: 'Alta calidad · 1080p / 30 FPS',
    qualityFluid: 'Fluidez · 720p / 60 FPS',
    qualityMaximum: 'Máxima · 1080p / 60 FPS',
    noAccount: 'Sin cuenta',
    noInstall: 'Sin instalación',
    p2pNote: 'La llamada usa WebRTC P2P. El audio y el vídeo van directamente entre participantes.',
    connectivityNotice: 'En conexiones directas, los participantes pueden conocer datos de conectividad, incluidas direcciones IP.',
    roomActive: 'Llamada en directo',
    connecting: 'Conectando',
    reconnecting: 'Reconectando',
    excellent: 'Conexión excelente',
    stable: 'Conexión estable',
    unstable: 'Conexión inestable',
    waiting: 'Esperando datos',
    viewers: 'participantes',
    negotiating: 'conexiones negociando',
    elapsed: 'duración',
    shareLink: 'Enlace de llamada',
    copyLink: 'Copiar enlace',
    copied: 'Enlace copiado',
    settings: 'Configuración',
    diagnostics: 'Diagnóstico',
    showDiagnostics: 'Ver estadísticas',
    hideDiagnostics: 'Ocultar estadísticas',
    stop: 'Detener transmisión',
    endRoom: 'Cerrar sala',
    hostPreview: 'Vista previa de tu transmisión',
    capturing: 'Capturando la pantalla seleccionada',
    waitingViewers: 'La invitación está lista. Esperando participantes.',
    audioPresent: 'Audio compartido disponible',
    audioMissing: 'Sin audio en esta transmisión',
    qualityLimited: 'El navegador no aplicó todos los objetivos de calidad. Mantuvimos la mejor configuración disponible.',
    connection: 'Conexión',
    resolution: 'Resolución actual',
    frameRate: 'Cuadros por segundo',
    bitrate: 'Bitrate recibido',
    roundTrip: 'RTT estimado',
    packetLoss: 'Pérdida de paquetes',
    iceRoute: 'Ruta ICE',
    upload: 'Subida en uso',
    droppedFrames: 'Cuadros descartados',
    notMeasured: 'Aún sin medir',
    direct: 'Directa',
    relayed: 'Retransmitida',
    unknownRoute: 'No disponible',
    statsNote: 'La clasificación es aproximada: excelente usa RTT inferior a 120 ms, pérdida inferior al 1% y bitrate de al menos 1 Mbps; inestable usa RTT desde 350 ms, pérdida desde el 4% o bitrate inferior a 250 kbps. No se inventan métricas ausentes. El presupuesto de subida es un objetivo del encoder, no un límite rígido de transporte; sin contador de bytes, no se puede aplicar el límite de sesión. RTT mide la ida y vuelta de la conexión, no el retraso total del vídeo.',
    spectator: 'Espectador',
    hostRecovering: 'Esperando que la persona que presenta se reconecte…',
    roomEnded: 'Esta transmisión terminó.',
    roomExpired: 'La sala caducó. Pide un enlace nuevo a quien presenta.',
    roomFull: 'La sala alcanzó el límite de espectadores.',
    unableToConnect: 'No se pudo establecer una conexión P2P. La red puede bloquear la ruta directa.',
    redisUnavailable: 'La señalización no está disponible temporalmente. Revisa la conexión e inténtalo de nuevo.',
    genericError: 'Algo salió mal. Inténtalo de nuevo.',
    captureUnsupported: 'La captura no está disponible en este navegador o contexto. La disponibilidad varía según el navegador y el sistema.',
    captureCanceled: 'Se canceló la selección de pantalla.',
    retry: 'Intentar de nuevo',
    retryConnection: 'Reconectar',
    resume: 'Reanudar transmisión',
    resumeDescription: 'Encontramos una sala reciente en esta pestaña. Comparte la pantalla de nuevo para reconectar a los espectadores.',
    openBrowserPicker: 'Elige una pantalla, ventana o pestaña en el selector del navegador.',
    watchTitle: 'Transmisión de pantalla',
    watchDescription: 'Conexión directa con quien presenta.',
    preparingVideo: 'Preparando conexión segura…',
    waitingForHost: 'Esperando a que empiece la transmisión…',
    watchReady: 'La transmisión está lista. Selecciona «Ver ahora» para conectarte.',
    playWithSound: 'Iniciar reproducción con audio',
    mute: 'Silenciar',
    unmute: 'Activar audio',
    volume: 'Volumen',
    fullscreen: 'Pantalla completa',
    exitFullscreen: 'Salir de pantalla completa',
    audio: 'Audio',
    p2pPrivacy: 'El vídeo y el audio no se graban ni se envían a un servidor multimedia. WebRTC P2P puede revelar datos de conectividad entre participantes.',
    negotiationFailed: 'La negociación no terminó. Revisa la red o inténtalo de nuevo.',
    connectionLost: 'La conexión se interrumpió. Intentando reconectar automáticamente…',
    startAnother: 'Iniciar otra transmisión',
  },
  zh: {
    eyebrow: '浏览器 P2P 通话',
    startTitle: '在通话中交流并共享屏幕。',
    startDescription: '通过链接创建房间，可选择开启摄像头或麦克风，并与通话参与者共享屏幕。',
    startButton: '开始通话',
    startShort: '立即观看',
    advanced: '直播画质',
    qualityLabel: '画质',
    qualityAutomatic: '自动 · 推荐',
    qualityEconomy: '省流 · 480p / 30 FPS',
    qualityBalanced: '均衡 · 720p / 30 FPS',
    qualityHigh: '高清 · 1080p / 30 FPS',
    qualityFluid: '流畅 · 720p / 60 FPS',
    qualityMaximum: '最高 · 1080p / 60 FPS',
    noAccount: '无需账号',
    noInstall: '无需安装',
    p2pNote: '直播使用 WebRTC P2P，视频不会经过媒体服务器。',
    connectivityNotice: '在直连中，参与者可能看到连接信息，包括 IP 地址。',
    roomActive: '直播中',
    connecting: '连接中',
    reconnecting: '正在重连',
    excellent: '连接优秀',
    stable: '连接稳定',
    unstable: '连接不稳定',
    waiting: '等待数据',
    viewers: '位观众',
    negotiating: '个连接协商中',
    elapsed: '时长',
    shareLink: '通话链接',
    copyLink: '复制链接',
    copied: '链接已复制',
    settings: '设置',
    diagnostics: '诊断',
    showDiagnostics: '查看统计',
    hideDiagnostics: '隐藏统计',
    stop: '停止直播',
    endRoom: '结束房间',
    hostPreview: '直播画面预览',
    capturing: '正在捕获所选屏幕',
    waitingViewers: '链接已准备好，等待观众。',
    audioPresent: '已共享音频',
    audioMissing: '直播中没有音频',
    qualityLimited: '浏览器未能应用所有画质目标，已保留当前可用的最佳设置。',
    connection: '连接',
    resolution: '当前分辨率',
    frameRate: '帧率',
    bitrate: '接收码率',
    roundTrip: '估算 RTT',
    packetLoss: '丢包率',
    iceRoute: 'ICE 路径',
    upload: '当前上传',
    droppedFrames: '丢帧',
    notMeasured: '尚未测量',
    direct: '直连',
    relayed: '中继',
    unknownRoute: '不可用',
    statsNote: '连接评级仅供参考：优秀表示 RTT 低于 120 毫秒、丢包低于 1%、码率至少为 1 Mbps；不稳定表示 RTT 达到 350 毫秒、丢包达到 4% 或码率低于 250 kbps。缺失指标不会被推测。上传预算是编码器目标，不是严格的传输上限；没有字节计数器时无法强制执行会话流量上限。RTT 是连接往返时间，不是完整的视频延迟。',
    spectator: '观众',
    hostRecovering: '正在等待主持人重新连接…',
    roomEnded: '直播已结束。',
    roomExpired: '房间已过期，请向主持人索取新链接。',
    roomFull: '房间已达到观众上限。',
    unableToConnect: '无法建立 P2P 连接，网络可能阻止了直连。',
    redisUnavailable: '信令暂时不可用，请检查网络后重试。',
    genericError: '发生错误，请重试。',
    captureUnsupported: '此浏览器或页面环境当前无法使用屏幕捕获。可用性因浏览器和操作系统而异。',
    captureCanceled: '已取消屏幕选择。',
    retry: '重试',
    retryConnection: '重新连接',
    resume: '恢复直播',
    resumeDescription: '在此标签页中发现了最近的房间。请重新共享屏幕以连接观众。',
    openBrowserPicker: '在浏览器选择器中选择屏幕、窗口或标签页。',
    watchTitle: '屏幕直播',
    watchDescription: '与主持人直接连接。',
    preparingVideo: '正在准备安全连接…',
    waitingForHost: '等待主持人开始直播…',
    watchReady: '直播已就绪。点击“立即观看”以连接。',
    playWithSound: '开启声音播放',
    mute: '静音',
    unmute: '开启声音',
    volume: '音量',
    fullscreen: '全屏',
    exitFullscreen: '退出全屏',
    audio: '音频',
    p2pPrivacy: '视频和音频不会录制或发送到媒体服务器。WebRTC P2P 可能向参与者暴露连接信息。',
    negotiationFailed: '连接协商未完成，请检查网络后重试。',
    connectionLost: '连接中断，正在自动重连…',
    startAnother: '开始新的直播',
  },
};

export const getShareScreenUi = (locale: AppLocale): ShareScreenUi => shareScreenUi[locale];
