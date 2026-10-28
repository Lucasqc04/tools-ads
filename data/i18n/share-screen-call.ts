import type { AppLocale } from '@/lib/i18n/config';

export type ShareScreenCallCopy = {
  roomTitle: string;
  callHeader: string;
  connected: string;
  person: string;
  people: string;
  roomPrivacy: string;
  publicRoom: string;
  publicRoomDescription: string;
  privateRoom: string;
  privateRoomDescription: string;
  displayName: string;
  displayNamePlaceholder: string;
  joinCall: string;
  waitingApproval: string;
  approvalRequest: string;
  pendingRequests: string;
  approve: string;
  reject: string;
  participants: string;
  speaking: string;
  host: string;
  you: string;
  microphone: string;
  camera: string;
  speakers: string;
  screenShare: string;
  switchScreen: string;
  stopScreen: string;
  screenBusy: string;
  screenStageEmpty: string;
  leaveCall: string;
  endCall: string;
  copyInvite: string;
  audioShared: string;
  audioNotShared: string;
  cameraOff: string;
  microphoneOff: string;
  waitingForPeople: string;
  connectingPeople: string;
  permissionError: string;
  screenUnavailable: string;
  screenMobileNote: string;
  screenPermission: string;
  joinRejected: string;
  noName: string;
  callStarted: string;
  callFull: string;
  waitingHost: string;
  settings: string;
  cameraPreview: string;
  cameraReady: string;
  cameraPreviewHelp: string;
  microphoneLevel: string;
  microphoneReady: string;
  microphoneLevelHelp: string;
  chat: string;
  chatPlaceholder: string;
  sendMessage: string;
  chatEmpty: string;
  chatPrivacy: string;
  leaveAndTransfer: string;
  hostTransferred: string;
  screenTile: string;
  miniCall: string;
  miniCallUnavailable: string;
  flash: string;
  flashUnavailable: string;
  screenPaused: string;
  devices: string;
  cameraSource: string;
  microphoneSource: string;
  speakerSource: string;
  defaultDevice: string;
  unnamedCamera: string;
  unnamedMicrophone: string;
  unnamedSpeaker: string;
  cameraSide: string;
  frontCamera: string;
  rearCamera: string;
  switchCamera: string;
  noOtherCamera: string;
  deviceChangeFailed: string;
  mirrorSelf: string;
  speakerUnsupported: string;
  screenMobileUnsupported: string;
  closePanel: string;
  dragToClose: string;
  options: string;
  deviceRecovered: string;
  expandStage: string;
  collapseStage: string;
  speakingNow: string;
  attachFile: string;
  chatFileTooLarge: string;
  chatNobodyConnected: string;
  chatFileSending: string;
  chatFileReceiving: string;
  chatFileFailed: string;
  downloadFile: string;
  viewPhoto: string;
  closePhoto: string;
  sentFile: string;
  deviceStarting: string;
  cameraStarting: string;
  videoConnecting: string;
  jumpToLatest: string;
  resizeChat: string;
};

const copy: Record<AppLocale, ShareScreenCallCopy> = {
  'pt-br': {
    roomTitle: 'Chamada', callHeader: 'Chamada com compartilhamento', connected: 'Conectado', person: 'pessoa', people: 'pessoas', roomPrivacy: 'Quem pode entrar', publicRoom: 'Pública por link', publicRoomDescription: 'Qualquer pessoa com o link entra na sala.', privateRoom: 'Privada com aprovação', privateRoomDescription: 'Você aprova cada pessoa antes de entrar.',
    displayName: 'Seu nome na chamada', displayNamePlaceholder: 'Como as pessoas vão te reconhecer?', joinCall: 'Entrar na chamada', waitingApproval: 'Aguardando aprovação do anfitrião…', approvalRequest: 'pediu para entrar', pendingRequests: 'Pedidos para entrar', approve: 'Permitir entrada', reject: 'Recusar', participants: 'Participantes', speaking: 'Falando', host: 'Anfitrião', you: 'Você', microphone: 'Microfone', camera: 'Câmera', speakers: 'Áudio da chamada', screenShare: 'Compartilhar tela', switchScreen: 'Mudar tela', stopScreen: 'Parar tela', screenBusy: 'Outra pessoa está compartilhando a tela', screenStageEmpty: 'Quando alguém compartilhar a tela, ela aparecerá aqui.', leaveCall: 'Sair da chamada', endCall: 'Encerrar chamada', copyInvite: 'Copiar convite', audioShared: 'Áudio da tela ativo', audioNotShared: 'Sem áudio da tela', cameraOff: 'Câmera desligada', microphoneOff: 'Microfone desligado', waitingForPeople: 'Compartilhe o convite para chamar mais pessoas.', connectingPeople: 'Conectando as pessoas…', permissionError: 'Não foi possível acessar câmera ou microfone. Confira a permissão do navegador e tente novamente.', screenUnavailable: 'Esta versão do navegador não oferece captura de tela nesta página. Atualize ou use um navegador compatível com captura de tela na web.', screenMobileNote: 'A captura depende da versão do navegador e do sistema. Quando disponível, inicie pelo botão Compartilhar tela dentro da chamada.', screenPermission: 'O navegador bloqueou a captura de tela. Confira as permissões e se a página está aberta em uma conexão segura e tente novamente.', joinRejected: 'O anfitrião não aprovou sua entrada.', noName: 'Digite um nome para continuar.', callStarted: 'A chamada está pronta.', callFull: 'A sala atingiu o limite de participantes.', waitingHost: 'Aguardando a chamada se reconectar…', settings: 'Opções da chamada', cameraPreview: 'Prévia da câmera', cameraReady: 'Câmera funcionando', cameraPreviewHelp: 'Só você vê esta prévia antes de entrar.', microphoneLevel: 'Nível do microfone', microphoneReady: 'Microfone funcionando', microphoneLevelHelp: 'Fale para conferir se o microfone está captando sua voz.', chat: 'Chat', chatPlaceholder: 'Escreva uma mensagem…', sendMessage: 'Enviar mensagem', chatEmpty: 'As mensagens enviadas durante a chamada aparecem aqui.', chatPrivacy: 'As mensagens e os arquivos (até 50 MB) seguem direto entre as pessoas e não ficam salvos.', leaveAndTransfer: 'Sair e passar o controle', hostTransferred: 'A chamada continua. Outra pessoa assumiu o controle da sala.', screenTile: 'Tela compartilhada', miniCall: 'Abrir mini chamada', miniCallUnavailable: 'A janela flutuante não está disponível neste navegador.', flash: 'Lanterna da câmera', flashUnavailable: 'Não foi possível ligar a lanterna desta câmera.', screenPaused: 'A captura está temporariamente pausada pelo navegador.', devices: 'Câmera e microfone', cameraSource: 'Câmera', microphoneSource: 'Microfone', speakerSource: 'Saída de áudio', defaultDevice: 'Padrão do aparelho', unnamedCamera: 'Câmera', unnamedMicrophone: 'Microfone', unnamedSpeaker: 'Saída', cameraSide: 'Lado da câmera', frontCamera: 'Frontal', rearCamera: 'Traseira', switchCamera: 'Virar câmera', noOtherCamera: 'Não encontramos outra câmera neste aparelho.', deviceChangeFailed: 'Não foi possível usar esse dispositivo. Verifique a permissão e tente outro.', mirrorSelf: 'Espelhar minha imagem para mim', speakerUnsupported: 'Este navegador não permite escolher a saída de áudio.', screenMobileUnsupported: 'Navegadores de celular não permitem compartilhar a tela. Use o computador para compartilhar; no celular, mostre algo com a câmera traseira.', closePanel: 'Fechar painel', dragToClose: 'Arraste para baixo para fechar', options: 'Opções', deviceRecovered: 'Câmera ou microfone reconectado.', expandStage: 'Expandir tela', collapseStage: 'Mostrar todos', speakingNow: 'Falando agora', attachFile: 'Enviar arquivo', chatFileTooLarge: 'Arquivo grande demais. O limite é de 50 MB.', chatNobodyConnected: 'Ninguém está conectado para receber agora.', chatFileSending: 'Enviando…', chatFileReceiving: 'Recebendo…', chatFileFailed: 'Falha na transferência', downloadFile: 'Baixar', viewPhoto: 'Ver foto', closePhoto: 'Fechar foto', sentFile: 'enviou um arquivo', deviceStarting: 'Ligando…', cameraStarting: 'Ligando câmera…', videoConnecting: 'Conectando vídeo…', jumpToLatest: 'Ir para o fim', resizeChat: 'Redimensionar o chat',
  },
  en: {
    roomTitle: 'Call', callHeader: 'Call with screen sharing', connected: 'Connected', person: 'person', people: 'people', roomPrivacy: 'Who can join', publicRoom: 'Anyone with the link', publicRoomDescription: 'Anyone who has the invite can join.', privateRoom: 'Private with approval', privateRoomDescription: 'You approve each person before they join.',
    displayName: 'Your name in the call', displayNamePlaceholder: 'How should people recognize you?', joinCall: 'Join call', waitingApproval: 'Waiting for the host to approve you…', approvalRequest: 'asked to join', pendingRequests: 'Join requests', approve: 'Admit', reject: 'Decline', participants: 'Participants', speaking: 'Speaking', host: 'Host', you: 'You', microphone: 'Microphone', camera: 'Camera', speakers: 'Call audio', screenShare: 'Share screen', switchScreen: 'Change screen', stopScreen: 'Stop sharing', screenBusy: 'Someone else is sharing their screen', screenStageEmpty: 'A shared screen will appear here.', leaveCall: 'Leave call', endCall: 'End call', copyInvite: 'Copy invite', audioShared: 'Screen audio on', audioNotShared: 'No screen audio', cameraOff: 'Camera off', microphoneOff: 'Microphone off', waitingForPeople: 'Share the invite to bring others in.', connectingPeople: 'Connecting everyone…', permissionError: 'Camera or microphone access failed. Check browser permissions and try again.', screenUnavailable: 'This browser version does not provide screen capture on this page. Update it or use a browser that supports web screen capture.', screenMobileNote: 'Screen capture depends on browser and operating system versions. When it is available, start it with Share screen inside the call.', screenPermission: 'The browser blocked screen capture. Check its permissions and that this page uses a secure connection, then try again.', joinRejected: 'The host did not approve your request.', noName: 'Enter a name to continue.', callStarted: 'Your call is ready.', callFull: 'The room has reached its participant limit.', waitingHost: 'Waiting for the call to reconnect…', settings: 'Call options', cameraPreview: 'Camera preview', cameraReady: 'Camera is working', cameraPreviewHelp: 'Only you can see this preview before joining.', microphoneLevel: 'Microphone level', microphoneReady: 'Microphone is working', microphoneLevelHelp: 'Speak to check that your microphone is picking up your voice.', chat: 'Chat', chatPlaceholder: 'Write a message…', sendMessage: 'Send message', chatEmpty: 'Messages sent during the call will appear here.', chatPrivacy: 'Messages and files (up to 50 MB) travel directly between people and are not saved.', leaveAndTransfer: 'Leave and pass host', hostTransferred: 'The call continues. Someone else is now managing the room.', screenTile: 'Shared screen', miniCall: 'Open mini call', miniCallUnavailable: 'Floating call is not available in this browser.', flash: 'Camera flashlight', flashUnavailable: 'This camera could not turn on its flashlight.', screenPaused: 'Screen capture is temporarily paused by the browser.', devices: 'Camera and microphone', cameraSource: 'Camera', microphoneSource: 'Microphone', speakerSource: 'Audio output', defaultDevice: 'Device default', unnamedCamera: 'Camera', unnamedMicrophone: 'Microphone', unnamedSpeaker: 'Output', cameraSide: 'Camera side', frontCamera: 'Front', rearCamera: 'Rear', switchCamera: 'Flip camera', noOtherCamera: 'We could not find another camera on this device.', deviceChangeFailed: 'This device could not be used. Check the permission or try another one.', mirrorSelf: 'Mirror my own preview', speakerUnsupported: 'This browser does not let you choose the audio output.', screenMobileUnsupported: 'Mobile browsers cannot share the screen. Use a computer to share; on your phone you can show something with the rear camera.', closePanel: 'Close panel', dragToClose: 'Drag down to close', options: 'Options', deviceRecovered: 'Camera or microphone reconnected.', expandStage: 'Expand view', collapseStage: 'Show everyone', speakingNow: 'Speaking now', attachFile: 'Send file', chatFileTooLarge: 'File too large. The limit is 50 MB.', chatNobodyConnected: 'No one is connected to receive right now.', chatFileSending: 'Sending…', chatFileReceiving: 'Receiving…', chatFileFailed: 'Transfer failed', downloadFile: 'Download', viewPhoto: 'View photo', closePhoto: 'Close photo', sentFile: 'sent a file', deviceStarting: 'Starting…', cameraStarting: 'Starting camera…', videoConnecting: 'Connecting video…', jumpToLatest: 'Jump to latest', resizeChat: 'Resize chat',
  },
  es: {
    roomTitle: 'Llamada', callHeader: 'Llamada con pantalla compartida', connected: 'Conectado', person: 'persona', people: 'personas', roomPrivacy: 'Quién puede entrar', publicRoom: 'Pública con enlace', publicRoomDescription: 'Cualquier persona con el enlace puede entrar.', privateRoom: 'Privada con aprobación', privateRoomDescription: 'Apruebas a cada persona antes de entrar.',
    displayName: 'Tu nombre en la llamada', displayNamePlaceholder: '¿Cómo te reconocerán?', joinCall: 'Entrar en la llamada', waitingApproval: 'Esperando la aprobación del anfitrión…', approvalRequest: 'solicitó entrar', pendingRequests: 'Solicitudes para entrar', approve: 'Permitir', reject: 'Rechazar', participants: 'Participantes', speaking: 'Hablando', host: 'Anfitrión', you: 'Tú', microphone: 'Micrófono', camera: 'Cámara', speakers: 'Audio de la llamada', screenShare: 'Compartir pantalla', switchScreen: 'Cambiar pantalla', stopScreen: 'Dejar de compartir', screenBusy: 'Otra persona está compartiendo la pantalla', screenStageEmpty: 'La pantalla compartida aparecerá aquí.', leaveCall: 'Salir de la llamada', endCall: 'Finalizar llamada', copyInvite: 'Copiar invitación', audioShared: 'Audio de pantalla activo', audioNotShared: 'Sin audio de pantalla', cameraOff: 'Cámara apagada', microphoneOff: 'Micrófono apagado', waitingForPeople: 'Comparte la invitación para invitar a otras personas.', connectingPeople: 'Conectando a todos…', permissionError: 'No se pudo acceder a la cámara o al micrófono. Revisa los permisos del navegador e inténtalo de nuevo.', screenUnavailable: 'Esta versión del navegador no ofrece captura de pantalla en esta página. Actualízala o usa un navegador compatible con captura web.', screenMobileNote: 'La captura depende de la versión del navegador y del sistema. Cuando esté disponible, iníciala con Compartir pantalla dentro de la llamada.', screenPermission: 'El navegador bloqueó la captura de pantalla. Revisa los permisos y que la página use una conexión segura, y vuelve a intentarlo.', joinRejected: 'El anfitrión no aprobó tu entrada.', noName: 'Escribe un nombre para continuar.', callStarted: 'La llamada está lista.', callFull: 'La sala alcanzó su límite de participantes.', waitingHost: 'Esperando a que la llamada se reconecte…', settings: 'Opciones de llamada', cameraPreview: 'Vista previa de la cámara', cameraReady: 'La cámara funciona', cameraPreviewHelp: 'Solo tú ves esta vista previa antes de entrar.', microphoneLevel: 'Nivel del micrófono', microphoneReady: 'El micrófono funciona', microphoneLevelHelp: 'Habla para comprobar que el micrófono capta tu voz.', chat: 'Chat', chatPlaceholder: 'Escribe un mensaje…', sendMessage: 'Enviar mensaje', chatEmpty: 'Los mensajes de la llamada aparecerán aquí.', chatPrivacy: 'Los mensajes y archivos (hasta 50 MB) viajan directamente entre las personas y no se guardan.', leaveAndTransfer: 'Salir y pasar el control', hostTransferred: 'La llamada continúa. Otra persona ahora gestiona la sala.', screenTile: 'Pantalla compartida', miniCall: 'Abrir mini llamada', miniCallUnavailable: 'La ventana flotante no está disponible en este navegador.', flash: 'Linterna de la cámara', flashUnavailable: 'No se pudo encender la linterna de esta cámara.', screenPaused: 'El navegador pausó temporalmente la captura de pantalla.', devices: 'Cámara y micrófono', cameraSource: 'Cámara', microphoneSource: 'Micrófono', speakerSource: 'Salida de audio', defaultDevice: 'Predeterminado del dispositivo', unnamedCamera: 'Cámara', unnamedMicrophone: 'Micrófono', unnamedSpeaker: 'Salida', cameraSide: 'Lado de la cámara', frontCamera: 'Frontal', rearCamera: 'Trasera', switchCamera: 'Girar cámara', noOtherCamera: 'No encontramos otra cámara en este dispositivo.', deviceChangeFailed: 'No se pudo usar este dispositivo. Revisa el permiso o prueba otro.', mirrorSelf: 'Reflejar mi propia imagen', speakerUnsupported: 'Este navegador no permite elegir la salida de audio.', screenMobileUnsupported: 'Los navegadores móviles no pueden compartir la pantalla. Usa un ordenador para compartir; en el móvil puedes mostrar algo con la cámara trasera.', closePanel: 'Cerrar panel', dragToClose: 'Arrastra hacia abajo para cerrar', options: 'Opciones', deviceRecovered: 'Cámara o micrófono reconectado.', expandStage: 'Expandir pantalla', collapseStage: 'Mostrar a todos', speakingNow: 'Hablando ahora', attachFile: 'Enviar archivo', chatFileTooLarge: 'Archivo demasiado grande. El límite es de 50 MB.', chatNobodyConnected: 'Nadie está conectado para recibir ahora.', chatFileSending: 'Enviando…', chatFileReceiving: 'Recibiendo…', chatFileFailed: 'Falló la transferencia', downloadFile: 'Descargar', viewPhoto: 'Ver foto', closePhoto: 'Cerrar foto', sentFile: 'envió un archivo', deviceStarting: 'Encendiendo…', cameraStarting: 'Encendiendo cámara…', videoConnecting: 'Conectando vídeo…', jumpToLatest: 'Ir al final', resizeChat: 'Redimensionar el chat',
  },
  zh: {
    roomTitle: '通话', callHeader: '屏幕共享通话', connected: '已连接', person: '人', people: '人', roomPrivacy: '谁可以加入', publicRoom: '持链接即可加入', publicRoomDescription: '任何拥有邀请链接的人都可以加入。', privateRoom: '加入需批准', privateRoomDescription: '由你批准每位加入者。',
    displayName: '通话中的名称', displayNamePlaceholder: '其他人如何称呼你？', joinCall: '加入通话', waitingApproval: '等待主持人批准…', approvalRequest: '申请加入', pendingRequests: '加入申请', approve: '允许', reject: '拒绝', participants: '通话参与者', speaking: '正在说话', host: '主持人', you: '你', microphone: '麦克风', camera: '摄像头', speakers: '通话音频', screenShare: '共享屏幕', switchScreen: '更换屏幕', stopScreen: '停止共享', screenBusy: '其他人正在共享屏幕', screenStageEmpty: '共享屏幕将在此显示。', leaveCall: '离开通话', endCall: '结束通话', copyInvite: '复制邀请', audioShared: '屏幕音频已开启', audioNotShared: '没有屏幕音频', cameraOff: '摄像头已关闭', microphoneOff: '麦克风已关闭', waitingForPeople: '分享邀请链接来邀请其他人。', connectingPeople: '正在连接参与者…', permissionError: '无法访问摄像头或麦克风。请检查浏览器权限后重试。', screenUnavailable: '此浏览器版本当前页面不提供屏幕捕获。请更新浏览器或使用支持网页屏幕捕获的浏览器。', screenMobileNote: '屏幕捕获取决于浏览器和操作系统版本。支持时，请在通话中点击“共享屏幕”开始。', screenPermission: '浏览器阻止了屏幕捕获。请检查权限以及页面是否使用安全连接，然后重试。', joinRejected: '主持人未批准你的加入请求。', noName: '请输入名称以继续。', callStarted: '通话已准备就绪。', callFull: '房间已达到参与人数上限。', waitingHost: '等待通话重新连接…', settings: '通话选项', cameraPreview: '摄像头预览', cameraReady: '摄像头工作正常', cameraPreviewHelp: '加入前只有你能看到预览。', microphoneLevel: '麦克风音量', microphoneReady: '麦克风工作正常', microphoneLevelHelp: '说话以确认麦克风正在接收声音。', chat: '聊天', chatPlaceholder: '输入消息…', sendMessage: '发送消息', chatEmpty: '通话消息会显示在这里。', chatPrivacy: '消息和文件（最大 50 MB）直接在参与者之间传输，不会保存。', leaveAndTransfer: '离开并转交房间管理', hostTransferred: '通话仍在继续，其他参与者已接管房间。', screenTile: '共享屏幕', miniCall: '打开迷你通话', miniCallUnavailable: '此浏览器不支持浮动通话窗口。', flash: '摄像头闪光灯', flashUnavailable: '无法打开此摄像头的闪光灯。', screenPaused: '浏览器暂时暂停了屏幕捕获。', devices: '摄像头和麦克风', cameraSource: '摄像头', microphoneSource: '麦克风', speakerSource: '音频输出', defaultDevice: '设备默认', unnamedCamera: '摄像头', unnamedMicrophone: '麦克风', unnamedSpeaker: '输出', cameraSide: '摄像头方向', frontCamera: '前置', rearCamera: '后置', switchCamera: '切换摄像头', noOtherCamera: '此设备上找不到其他摄像头。', deviceChangeFailed: '无法使用此设备。请检查权限或选择其他设备。', mirrorSelf: '镜像显示我的画面', speakerUnsupported: '此浏览器不支持选择音频输出。', screenMobileUnsupported: '手机浏览器无法共享屏幕。请使用电脑共享；在手机上可以用后置摄像头展示内容。', closePanel: '关闭面板', dragToClose: '向下拖动关闭', options: '选项', deviceRecovered: '摄像头或麦克风已重新连接。', expandStage: '放大画面', collapseStage: '显示所有人', speakingNow: '正在说话', attachFile: '发送文件', chatFileTooLarge: '文件太大，上限为 50 MB。', chatNobodyConnected: '目前没有已连接的接收者。', chatFileSending: '发送中…', chatFileReceiving: '接收中…', chatFileFailed: '传输失败', downloadFile: '下载', viewPhoto: '查看照片', closePhoto: '关闭照片', sentFile: '发送了文件', deviceStarting: '正在开启…', cameraStarting: '正在开启摄像头…', videoConnecting: '正在连接视频…', jumpToLatest: '回到最新', resizeChat: '调整聊天宽度',
  },
};

export const getShareScreenCallCopy = (locale: AppLocale): ShareScreenCallCopy => copy[locale];
