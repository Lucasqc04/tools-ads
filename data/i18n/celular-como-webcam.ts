import type { AppLocale } from '@/lib/i18n/config';

export type WebcamQualityPreset = 'economy' | 'balanced' | 'high' | 'fluid' | 'ultra';

export type CelularWebcamUiCopy = {
  createSession: string;
  creatingSession: string;
  startNewSession: string;
  copyLink: string;
  linkCopied: string;
  scanQr: string;
  qrAlt: string;
  awaitingPhone: string;
  phoneRequested: string;
  approvePhone: string;
  phoneConnectTitle: string;
  phoneConnectHint: string;
  phoneConnectedTitle: string;
  phoneConnectedHint: string;
  externalCameraHint: string;
  waitingForApproval: string;
  phoneApproved: string;
  connectInstructions: string[];
  noInstall: string;
  sessionPrivacy: string;
  p2pNotice: string;
  turnNotice: string;
  preview: string;
  cameraPreview: string;
  cleanPreview: string;
  fullscreen: string;
  endSession: string;
  cancelConnection: string;
  openSettings: string;
  closeSettings: string;
  startCamera: string;
  pauseCamera: string;
  resumeCamera: string;
  connecting: string;
  transmitting: string;
  reconnecting: string;
  disconnected: string;
  sessionExpired: string;
  sessionEnded: string;
  allowCamera: string;
  phoneReady: string;
  confirmConnection: string;
  waitingForPc: string;
  flipCamera: string;
  microphone: string;
  optionalAudio: string;
  optionalAudioHint: string;
  microphoneOn: string;
  microphoneOff: string;
  camera: string;
  quality: string;
  preferenceMode: string;
  preferQuality: string;
  preferBalance: string;
  preferFluency: string;
  cameraSource: string;
  presetEconomy: string;
  presetBalanced: string;
  presetHigh: string;
  presetFluid: string;
  presetUltra: string;
  frameRate: string;
  torch: string;
  zoom: string;
  stats: string;
  resolution: string;
  fps: string;
  bitrate: string;
  packetLoss: string;
  roundTrip: string;
  route: string;
  direct: string;
  relay: string;
  unknown: string;
  waiting: string;
  accepted: string;
  cleanWindowBlocked: string;
  connectionFailed: string;
  permissionDenied: string;
  noCamera: string;
  insecureContext: string;
  unsupportedBrowser: string;
  serviceUnavailable: string;
  cameraUnavailable: string;
  connectionHint: string;
  privacyTitle: string;
  privacyText: string;
  obsTitle: string;
  obsSteps: string[];
  obsLinux: string;
  nativeCameraNote: string;
  startError: string;
  cameraError: string;
  connectionError: string;
  retry: string;
  close: string;
};

const copy: Record<AppLocale, CelularWebcamUiCopy> = {
  'pt-br': {
    createSession: 'Criar conexão', creatingSession: 'Criando conexão…', startNewSession: 'Nova conexão',
    copyLink: 'Copiar link', linkCopied: 'Link copiado', scanQr: 'Escaneie com o celular', qrAlt: 'QR Code para conectar o celular como webcam',
    awaitingPhone: 'Aguardando celular', phoneRequested: 'Celular pronto para conectar', approvePhone: 'Permitir celular na chamada', phoneConnectTitle: 'Conectar celular à chamada', phoneConnectHint: 'Escaneie o QR e inicie a câmera no celular. Quando o pedido aparecer, permita a conexão aqui.', phoneConnectedTitle: 'Celular conectado à chamada', phoneConnectedHint: 'A imagem do celular está sendo usada como sua câmera nesta chamada.', externalCameraHint: 'Para usar no Discord, Meet ou em outro app, abra a janela limpa no OBS e ative a Câmera Virtual.', waitingForApproval: 'Aguardando aprovação no computador', phoneApproved: 'Conexão aprovada',
    connectInstructions: ['Abra a câmera do celular e escaneie o QR Code.', 'Permita o uso da câmera no navegador.', 'Confirme a conexão nesta tela do computador.'],
    noInstall: 'Sem cadastro e sem instalar aplicativo no celular.', sessionPrivacy: 'O vídeo não passa pelo servidor.', p2pNotice: 'WebRTC conecta os navegadores diretamente quando a rede permite.', turnNotice: 'Algumas redes bloqueiam conexões diretas e podem precisar de um servidor TURN.',
    preview: 'Prévia da câmera', cameraPreview: 'Prévia recebida do celular', cleanPreview: 'Abrir janela limpa', fullscreen: 'Tela cheia', endSession: 'Encerrar conexão', cancelConnection: 'Cancelar', openSettings: 'Configurações', closeSettings: 'Fechar configurações',
    startCamera: 'Iniciar câmera', pauseCamera: 'Pausar transmissão', resumeCamera: 'Retomar transmissão', connecting: 'Conectando…', transmitting: 'Transmitindo', reconnecting: 'Tentando restabelecer a conexão…', disconnected: 'Conexão interrompida', sessionExpired: 'Esta sessão expirou.', sessionEnded: 'A sessão foi encerrada.',
    allowCamera: 'Permita o acesso à câmera para continuar.', phoneReady: 'Câmera pronta neste celular', confirmConnection: 'Conectar ao computador', waitingForPc: 'Aguardando o computador permitir a conexão…', flipCamera: 'Trocar câmera', microphone: 'Microfone', optionalAudio: 'Incluir o microfone do celular', optionalAudioHint: 'O áudio começa desligado e usa uma faixa WebRTC separada.', microphoneOn: 'Microfone ligado', microphoneOff: 'Microfone desligado', camera: 'Câmera', quality: 'Qualidade desejada',
    preferenceMode: 'Prioridade da transmissão', preferQuality: 'Imagem', preferBalance: 'Equilíbrio', preferFluency: 'Fluidez', cameraSource: 'Câmera', presetEconomy: 'Econômica · 480p / 24 fps', presetBalanced: 'Equilibrada · 720p / 30 fps', presetHigh: 'Alta · 1080p / 30 fps', presetFluid: 'Fluida · 1080p / 60 fps', presetUltra: 'Ultra · 4K / 30 fps', frameRate: 'Quadros por segundo', torch: 'Lanterna', zoom: 'Zoom',
    stats: 'Dados da conexão', resolution: 'Resolução', fps: 'FPS', bitrate: 'Bitrate', packetLoss: 'Perda de pacotes', roundTrip: 'Tempo de ida e volta', route: 'Rota', direct: 'Direta', relay: 'Relay', unknown: 'Não medido', waiting: 'Aguardando', accepted: 'Aprovada',
    cleanWindowBlocked: 'O navegador bloqueou a janela. Permita pop-ups e tente de novo.', connectionFailed: 'Não foi possível conectar. Algumas redes exigem um servidor TURN.', permissionDenied: 'Permissão da câmera negada. Altere a permissão do site e tente novamente.', noCamera: 'Não encontramos uma câmera disponível neste celular.', insecureContext: 'Abra esta página por HTTPS para usar a câmera.', unsupportedBrowser: 'Este navegador não oferece suporte à câmera ou ao WebRTC necessários.', serviceUnavailable: 'O serviço de conexão está indisponível. Tente novamente em instantes.', cameraUnavailable: 'Não foi possível iniciar a câmera. Verifique se outro aplicativo está usando o dispositivo.',
    connectionHint: 'Mantenha esta página aberta e a tela do celular ativa durante a transmissão.', privacyTitle: 'Privacidade e conexão', privacyText: 'O site não recebe nem grava o vídeo. A sinalização temporária pode incluir dados de conexão WebRTC. Em uma conexão direta, os navegadores conectados podem conhecer o endereço IP um do outro.',
    obsTitle: 'Usar como webcam no PC', obsSteps: ['Conecte o celular e abra a janela limpa.', 'No OBS, adicione uma fonte Captura de Janela e escolha a prévia.', 'Inicie Câmera Virtual no OBS e escolha OBS Virtual Camera no Discord, Meet ou em outro app.'], obsLinux: 'No Linux, a câmera virtual do OBS pode depender do módulo v4l2loopback.', nativeCameraNote: 'O navegador não cria uma câmera para outros programas. O OBS conecta esta imagem aos apps pela Câmera Virtual.',
    startError: 'Não foi possível criar a sessão.', cameraError: 'Verifique a permissão e tente iniciar a câmera novamente.', connectionError: 'A conexão caiu. Confira a rede e tente novamente.', retry: 'Tentar novamente', close: 'Fechar',
  },
  en: {
    createSession: 'Create connection', creatingSession: 'Creating connection…', startNewSession: 'New connection',
    copyLink: 'Copy link', linkCopied: 'Link copied', scanQr: 'Scan with your phone', qrAlt: 'QR code to connect your phone as a webcam',
    awaitingPhone: 'Waiting for phone', phoneRequested: 'Phone is ready to connect', approvePhone: 'Allow phone in call', phoneConnectTitle: 'Connect phone to this call', phoneConnectHint: 'Scan the QR code and start the camera on your phone. Allow the request here when it appears.', phoneConnectedTitle: 'Phone connected to the call', phoneConnectedHint: 'Your phone camera is now being used in this call.', externalCameraHint: 'To use it in Discord, Meet, or another app, open the clean window in OBS and start Virtual Camera.', waitingForApproval: 'Waiting for approval on the computer', phoneApproved: 'Connection approved',
    connectInstructions: ['Open your phone camera and scan the QR code.', 'Allow camera access in the browser.', 'Approve the connection on this computer.'],
    noInstall: 'No account or phone app installation required.', sessionPrivacy: 'Video does not pass through the server.', p2pNotice: 'WebRTC connects the browsers directly when the network allows it.', turnNotice: 'Some networks block direct connections and may need a TURN server.',
    preview: 'Camera preview', cameraPreview: 'Preview received from phone', cleanPreview: 'Open clean window', fullscreen: 'Full screen', endSession: 'End connection', cancelConnection: 'Cancel', openSettings: 'Settings', closeSettings: 'Close settings',
    startCamera: 'Start camera', pauseCamera: 'Pause stream', resumeCamera: 'Resume stream', connecting: 'Connecting…', transmitting: 'Streaming', reconnecting: 'Trying to reconnect…', disconnected: 'Connection interrupted', sessionExpired: 'This session expired.', sessionEnded: 'The session has ended.',
    allowCamera: 'Allow camera access to continue.', phoneReady: 'Camera ready on this phone', confirmConnection: 'Connect to computer', waitingForPc: 'Waiting for the computer to allow the connection…', flipCamera: 'Switch camera', microphone: 'Microphone', optionalAudio: 'Include phone microphone', optionalAudioHint: 'Audio starts off and uses a separate WebRTC track.', microphoneOn: 'Microphone on', microphoneOff: 'Microphone off', camera: 'Camera', quality: 'Target quality',
    preferenceMode: 'Streaming priority', preferQuality: 'Image quality', preferBalance: 'Balanced', preferFluency: 'Motion', cameraSource: 'Camera', presetEconomy: 'Economy · 480p / 24 fps', presetBalanced: 'Balanced · 720p / 30 fps', presetHigh: 'High · 1080p / 30 fps', presetFluid: 'Fluid · 1080p / 60 fps', presetUltra: 'Ultra · 4K / 30 fps', frameRate: 'Frames per second', torch: 'Torch', zoom: 'Zoom',
    stats: 'Connection details', resolution: 'Resolution', fps: 'FPS', bitrate: 'Bitrate', packetLoss: 'Packet loss', roundTrip: 'Round trip', route: 'Route', direct: 'Direct', relay: 'Relay', unknown: 'Not measured', waiting: 'Waiting', accepted: 'Approved',
    cleanWindowBlocked: 'The browser blocked the window. Allow pop-ups and try again.', connectionFailed: 'Could not connect. Some networks require a TURN server.', permissionDenied: 'Camera permission was denied. Change this site’s permission and try again.', noCamera: 'No camera was found on this phone.', insecureContext: 'Open this page over HTTPS to use the camera.', unsupportedBrowser: 'This browser does not support the camera or WebRTC features required.', serviceUnavailable: 'The connection service is unavailable. Try again shortly.', cameraUnavailable: 'Could not start the camera. Check whether another app is using it.',
    connectionHint: 'Keep this page open and your phone screen awake while streaming.', privacyTitle: 'Privacy and connection', privacyText: 'The site does not receive or record video. Temporary signaling may contain WebRTC connection details. With a direct connection, connected browsers may learn each other’s IP address.',
    obsTitle: 'Use as a webcam on PC', obsSteps: ['Connect your phone and open the clean window.', 'In OBS, add a Window Capture source and select the preview.', 'Start OBS Virtual Camera and choose it in Discord, Meet, or another app.'], obsLinux: 'On Linux, OBS virtual camera may require the v4l2loopback module.', nativeCameraNote: 'A browser cannot create a system camera for other apps. OBS sends this video to them through Virtual Camera.',
    startError: 'Could not create the session.', cameraError: 'Check the permission and try starting the camera again.', connectionError: 'The connection dropped. Check the network and try again.', retry: 'Try again', close: 'Close',
  },
  es: {
    createSession: 'Crear conexión', creatingSession: 'Creando conexión…', startNewSession: 'Nueva conexión',
    copyLink: 'Copiar enlace', linkCopied: 'Enlace copiado', scanQr: 'Escanea con el celular', qrAlt: 'Código QR para conectar el celular como webcam',
    awaitingPhone: 'Esperando el celular', phoneRequested: 'El celular está listo para conectarse', approvePhone: 'Permitir el celular en la llamada', phoneConnectTitle: 'Conectar el celular a esta llamada', phoneConnectHint: 'Escanea el QR e inicia la cámara en el celular. Cuando aparezca la solicitud, permítela aquí.', phoneConnectedTitle: 'Celular conectado a la llamada', phoneConnectedHint: 'La cámara del celular ya se usa en esta llamada.', externalCameraHint: 'Para usarla en Discord, Meet u otra app, abre la ventana limpia en OBS e inicia la Cámara Virtual.', waitingForApproval: 'Esperando aprobación en la computadora', phoneApproved: 'Conexión aprobada',
    connectInstructions: ['Abre la cámara del celular y escanea el código QR.', 'Permite el acceso a la cámara en el navegador.', 'Confirma la conexión en esta pantalla de la computadora.'],
    noInstall: 'Sin cuenta y sin instalar una app en el teléfono.', sessionPrivacy: 'El video no pasa por el servidor.', p2pNotice: 'WebRTC conecta los navegadores directamente cuando la red lo permite.', turnNotice: 'Algunas redes bloquean las conexiones directas y pueden necesitar un servidor TURN.',
    preview: 'Vista de la cámara', cameraPreview: 'Vista recibida del celular', cleanPreview: 'Abrir ventana limpia', fullscreen: 'Pantalla completa', endSession: 'Terminar conexión', cancelConnection: 'Cancelar', openSettings: 'Configuración', closeSettings: 'Cerrar configuración',
    startCamera: 'Iniciar cámara', pauseCamera: 'Pausar transmisión', resumeCamera: 'Reanudar transmisión', connecting: 'Conectando…', transmitting: 'Transmitiendo', reconnecting: 'Intentando restablecer la conexión…', disconnected: 'Conexión interrumpida', sessionExpired: 'Esta sesión venció.', sessionEnded: 'La sesión terminó.',
    allowCamera: 'Permite el acceso a la cámara para continuar.', phoneReady: 'Cámara lista en este celular', confirmConnection: 'Conectar con la computadora', waitingForPc: 'Esperando que la computadora permita la conexión…', flipCamera: 'Cambiar cámara', microphone: 'Micrófono', optionalAudio: 'Incluir el micrófono del celular', optionalAudioHint: 'El audio empieza apagado y usa una pista WebRTC separada.', microphoneOn: 'Micrófono activado', microphoneOff: 'Micrófono desactivado', camera: 'Cámara', quality: 'Calidad deseada',
    preferenceMode: 'Prioridad de transmisión', preferQuality: 'Calidad de imagen', preferBalance: 'Equilibrio', preferFluency: 'Fluidez', cameraSource: 'Cámara', presetEconomy: 'Económica · 480p / 24 fps', presetBalanced: 'Equilibrada · 720p / 30 fps', presetHigh: 'Alta · 1080p / 30 fps', presetFluid: 'Fluida · 1080p / 60 fps', presetUltra: 'Ultra · 4K / 30 fps', frameRate: 'Cuadros por segundo', torch: 'Linterna', zoom: 'Zoom',
    stats: 'Datos de conexión', resolution: 'Resolución', fps: 'FPS', bitrate: 'Bitrate', packetLoss: 'Pérdida de paquetes', roundTrip: 'Ida y vuelta', route: 'Ruta', direct: 'Directa', relay: 'Relay', unknown: 'Sin medir', waiting: 'Esperando', accepted: 'Aprobada',
    cleanWindowBlocked: 'El navegador bloqueó la ventana. Permite las ventanas emergentes e inténtalo de nuevo.', connectionFailed: 'No se pudo conectar. Algunas redes necesitan un servidor TURN.', permissionDenied: 'Se denegó el permiso de la cámara. Cambia el permiso del sitio e inténtalo de nuevo.', noCamera: 'No encontramos una cámara en este celular.', insecureContext: 'Abre esta página por HTTPS para usar la cámara.', unsupportedBrowser: 'Este navegador no admite la cámara o las funciones WebRTC necesarias.', serviceUnavailable: 'El servicio de conexión no está disponible. Vuelve a intentarlo pronto.', cameraUnavailable: 'No se pudo iniciar la cámara. Comprueba si otra aplicación la está usando.',
    connectionHint: 'Mantén esta página abierta y la pantalla del celular activa durante la transmisión.', privacyTitle: 'Privacidad y conexión', privacyText: 'El sitio no recibe ni graba el video. La señalización temporal puede incluir datos de conexión WebRTC. En una conexión directa, los navegadores conectados pueden conocer la dirección IP del otro.',
    obsTitle: 'Usar como webcam en la PC', obsSteps: ['Conecta el celular y abre la ventana limpia.', 'En OBS, añade una fuente Captura de ventana y elige la vista previa.', 'Inicia OBS Virtual Camera y selecciónala en Discord, Meet u otra app.'], obsLinux: 'En Linux, la cámara virtual de OBS puede necesitar el módulo v4l2loopback.', nativeCameraNote: 'El navegador no crea una cámara del sistema para otras apps. OBS envía este video mediante Cámara Virtual.',
    startError: 'No se pudo crear la sesión.', cameraError: 'Comprueba el permiso e intenta iniciar la cámara de nuevo.', connectionError: 'Se perdió la conexión. Revisa la red e inténtalo de nuevo.', retry: 'Intentar de nuevo', close: 'Cerrar',
  },
  zh: {
    createSession: '创建连接', creatingSession: '正在创建连接…', startNewSession: '新建连接', copyLink: '复制链接', linkCopied: '链接已复制', scanQr: '用手机扫描', qrAlt: '将手机连接为摄像头的二维码',
    awaitingPhone: '等待手机连接', phoneRequested: '手机已准备连接', approvePhone: '允许手机加入通话', phoneConnectTitle: '将手机连接到此通话', phoneConnectHint: '用手机扫描二维码并启动摄像头。出现请求后，请在此处允许连接。', phoneConnectedTitle: '手机已连接到通话', phoneConnectedHint: '此通话现在正在使用手机摄像头。', externalCameraHint: '如需在 Discord、Meet 或其他应用中使用，请在 OBS 中打开纯净窗口并启动虚拟摄像头。', waitingForApproval: '等待电脑批准', phoneApproved: '已批准连接',
    cancelConnection: '取消', connectInstructions: ['用手机相机扫描二维码。', '在浏览器中允许使用摄像头。', '在电脑屏幕上确认连接。'], noInstall: '无需账号，也无需在手机安装应用。', sessionPrivacy: '视频不会经过服务器。', p2pNotice: '网络允许时，WebRTC 会让两个浏览器直接连接。', turnNotice: '部分网络会阻止直连，可能需要 TURN 服务器。',
    preview: '摄像头预览', cameraPreview: '来自手机的画面', cleanPreview: '打开纯净窗口', fullscreen: '全屏', endSession: '结束连接', openSettings: '设置', closeSettings: '关闭设置', startCamera: '启动摄像头', pauseCamera: '暂停传输', resumeCamera: '继续传输', connecting: '正在连接…', transmitting: '正在传输', reconnecting: '正在尝试重新连接…', disconnected: '连接中断', sessionExpired: '此会话已过期。', sessionEnded: '会话已结束。',
    allowCamera: '请允许摄像头权限以继续。', phoneReady: '手机摄像头已就绪', confirmConnection: '连接电脑', waitingForPc: '等待电脑允许连接…', flipCamera: '切换摄像头', microphone: '麦克风', optionalAudio: '启用手机麦克风', optionalAudioHint: '音频默认关闭，并使用独立的 WebRTC 音轨。', microphoneOn: '麦克风已开启', microphoneOff: '麦克风已关闭', camera: '摄像头', quality: '目标画质', presetEconomy: '省流 · 480p / 24 fps', presetBalanced: '均衡 · 720p / 30 fps', presetHigh: '高清 · 1080p / 30 fps', presetFluid: '流畅 · 1080p / 60 fps', presetUltra: '超清 · 4K / 30 fps', frameRate: '帧率', torch: '闪光灯', zoom: '变焦',
    preferenceMode: '传输优先级', preferQuality: '画质', preferBalance: '均衡', preferFluency: '流畅度', cameraSource: '摄像头', stats: '连接数据', resolution: '分辨率', fps: 'FPS', bitrate: '码率', packetLoss: '丢包率', roundTrip: '往返时间', route: '连接路线', direct: '直连', relay: '中继', unknown: '未测量', waiting: '等待中', accepted: '已批准', cleanWindowBlocked: '浏览器阻止了窗口。请允许弹出窗口后重试。', connectionFailed: '无法连接。某些网络需要 TURN 服务器。', permissionDenied: '摄像头权限被拒绝。请更改网站权限后重试。', noCamera: '此手机没有可用摄像头。', insecureContext: '请通过 HTTPS 打开页面以使用摄像头。', unsupportedBrowser: '此浏览器不支持所需摄像头或 WebRTC 功能。', serviceUnavailable: '连接服务暂不可用，请稍后重试。', cameraUnavailable: '无法启动摄像头，请确认没有其他应用正在使用。',
    connectionHint: '传输期间请保持页面打开并让手机屏幕保持唤醒。', privacyTitle: '隐私和连接', privacyText: '网站不会接收或录制视频。临时信令可能包含 WebRTC 连接信息。直连时，连接的浏览器可能会获知彼此的 IP 地址。', obsTitle: '在电脑上用作摄像头', obsSteps: ['连接手机并打开纯净窗口。', '在 OBS 中添加窗口采集源并选择预览。', '启动 OBS Virtual Camera，然后在 Discord、Meet 或其他应用中选择它。'], obsLinux: 'Linux 上的 OBS 虚拟摄像头可能需要 v4l2loopback 模块。', nativeCameraNote: '浏览器无法为其他应用创建系统摄像头；OBS 可通过虚拟摄像头输出此视频。', startError: '无法创建会话。', cameraError: '检查权限后重新启动摄像头。', connectionError: '连接已断开，请检查网络后重试。', retry: '重试', close: '关闭',
  },
};

export const getCelularWebcamUiCopy = (locale: AppLocale): CelularWebcamUiCopy => copy[locale];
