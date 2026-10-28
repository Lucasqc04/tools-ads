import type { AppLocale } from '@/lib/i18n/config';

export type ShareScreenCallCopy = {
  roomTitle: string;
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
};

const copy: Record<AppLocale, ShareScreenCallCopy> = {
  'pt-br': {
    roomTitle: 'Sala de chamada', roomPrivacy: 'Quem pode entrar', publicRoom: 'Pública por link', publicRoomDescription: 'Qualquer pessoa com o link entra na sala.', privateRoom: 'Privada com aprovação', privateRoomDescription: 'Você aprova cada pessoa antes de entrar.',
    displayName: 'Seu nome na chamada', displayNamePlaceholder: 'Como as pessoas vão te reconhecer?', joinCall: 'Entrar na chamada', waitingApproval: 'Aguardando aprovação do anfitrião…', approvalRequest: 'pediu para entrar', pendingRequests: 'Pedidos para entrar', approve: 'Permitir entrada', reject: 'Recusar', participants: 'Pessoas na chamada', host: 'Anfitrião', you: 'Você', microphone: 'Microfone', camera: 'Câmera', speakers: 'Áudio da chamada', screenShare: 'Compartilhar tela', switchScreen: 'Mudar tela', stopScreen: 'Parar tela', screenBusy: 'Outra pessoa está compartilhando a tela', screenStageEmpty: 'Quando alguém compartilhar a tela, ela aparecerá aqui.', leaveCall: 'Sair da chamada', endCall: 'Encerrar chamada', copyInvite: 'Copiar convite', audioShared: 'Áudio da tela ativo', audioNotShared: 'Sem áudio da tela', cameraOff: 'Câmera desligada', microphoneOff: 'Microfone desligado', waitingForPeople: 'Compartilhe o convite para chamar mais pessoas.', connectingPeople: 'Conectando as pessoas…', permissionError: 'Não foi possível acessar câmera ou microfone. Confira a permissão do navegador e tente novamente.', screenUnavailable: 'Esta versão do navegador não oferece captura de tela nesta página. Atualize ou use um navegador compatível com captura de tela na web.', screenMobileNote: 'A captura depende da versão do navegador e do sistema. Quando disponível, inicie pelo botão Compartilhar tela dentro da chamada.', screenPermission: 'O navegador bloqueou a captura de tela. Confira as permissões e se a página está aberta em uma conexão segura e tente novamente.', joinRejected: 'O anfitrião não aprovou sua entrada.', noName: 'Digite um nome para continuar.', callStarted: 'A chamada está pronta.', callFull: 'A sala atingiu o limite de participantes.', waitingHost: 'Aguardando o anfitrião voltar…', settings: 'Opções da chamada',
  },
  en: {
    roomTitle: 'Call room', roomPrivacy: 'Who can join', publicRoom: 'Anyone with the link', publicRoomDescription: 'Anyone who has the invite can join.', privateRoom: 'Private with approval', privateRoomDescription: 'You approve each person before they join.',
    displayName: 'Your name in the call', displayNamePlaceholder: 'How should people recognize you?', joinCall: 'Join call', waitingApproval: 'Waiting for the host to approve you…', approvalRequest: 'asked to join', pendingRequests: 'Join requests', approve: 'Admit', reject: 'Decline', participants: 'People in the call', host: 'Host', you: 'You', microphone: 'Microphone', camera: 'Camera', speakers: 'Call audio', screenShare: 'Share screen', switchScreen: 'Change screen', stopScreen: 'Stop sharing', screenBusy: 'Someone else is sharing their screen', screenStageEmpty: 'A shared screen will appear here.', leaveCall: 'Leave call', endCall: 'End call', copyInvite: 'Copy invite', audioShared: 'Screen audio on', audioNotShared: 'No screen audio', cameraOff: 'Camera off', microphoneOff: 'Microphone off', waitingForPeople: 'Share the invite to bring others in.', connectingPeople: 'Connecting everyone…', permissionError: 'Camera or microphone access failed. Check browser permissions and try again.', screenUnavailable: 'This browser version does not provide screen capture on this page. Update it or use a browser that supports web screen capture.', screenMobileNote: 'Screen capture depends on browser and operating system versions. When it is available, start it with Share screen inside the call.', screenPermission: 'The browser blocked screen capture. Check its permissions and that this page uses a secure connection, then try again.', joinRejected: 'The host did not approve your request.', noName: 'Enter a name to continue.', callStarted: 'Your call is ready.', callFull: 'The room has reached its participant limit.', waitingHost: 'Waiting for the host to return…', settings: 'Call options',
  },
  es: {
    roomTitle: 'Sala de llamada', roomPrivacy: 'Quién puede entrar', publicRoom: 'Pública con enlace', publicRoomDescription: 'Cualquier persona con el enlace puede entrar.', privateRoom: 'Privada con aprobación', privateRoomDescription: 'Apruebas a cada persona antes de entrar.',
    displayName: 'Tu nombre en la llamada', displayNamePlaceholder: '¿Cómo te reconocerán?', joinCall: 'Entrar en la llamada', waitingApproval: 'Esperando la aprobación del anfitrión…', approvalRequest: 'solicitó entrar', pendingRequests: 'Solicitudes para entrar', approve: 'Permitir', reject: 'Rechazar', participants: 'Personas en la llamada', host: 'Anfitrión', you: 'Tú', microphone: 'Micrófono', camera: 'Cámara', speakers: 'Audio de la llamada', screenShare: 'Compartir pantalla', switchScreen: 'Cambiar pantalla', stopScreen: 'Dejar de compartir', screenBusy: 'Otra persona está compartiendo la pantalla', screenStageEmpty: 'La pantalla compartida aparecerá aquí.', leaveCall: 'Salir de la llamada', endCall: 'Finalizar llamada', copyInvite: 'Copiar invitación', audioShared: 'Audio de pantalla activo', audioNotShared: 'Sin audio de pantalla', cameraOff: 'Cámara apagada', microphoneOff: 'Micrófono apagado', waitingForPeople: 'Comparte la invitación para invitar a otras personas.', connectingPeople: 'Conectando a todos…', permissionError: 'No se pudo acceder a la cámara o al micrófono. Revisa los permisos del navegador e inténtalo de nuevo.', screenUnavailable: 'Esta versión del navegador no ofrece captura de pantalla en esta página. Actualízala o usa un navegador compatible con captura web.', screenMobileNote: 'La captura depende de la versión del navegador y del sistema. Cuando esté disponible, iníciala con Compartir pantalla dentro de la llamada.', screenPermission: 'El navegador bloqueó la captura de pantalla. Revisa los permisos y que la página use una conexión segura, y vuelve a intentarlo.', joinRejected: 'El anfitrión no aprobó tu entrada.', noName: 'Escribe un nombre para continuar.', callStarted: 'La llamada está lista.', callFull: 'La sala alcanzó su límite de participantes.', waitingHost: 'Esperando a que vuelva el anfitrión…', settings: 'Opciones de llamada',
  },
  zh: {
    roomTitle: '通话房间', roomPrivacy: '谁可以加入', publicRoom: '持链接即可加入', publicRoomDescription: '任何拥有邀请链接的人都可以加入。', privateRoom: '加入需批准', privateRoomDescription: '由你批准每位加入者。',
    displayName: '通话中的名称', displayNamePlaceholder: '其他人如何称呼你？', joinCall: '加入通话', waitingApproval: '等待主持人批准…', approvalRequest: '申请加入', pendingRequests: '加入申请', approve: '允许', reject: '拒绝', participants: '通话参与者', host: '主持人', you: '你', microphone: '麦克风', camera: '摄像头', speakers: '通话音频', screenShare: '共享屏幕', switchScreen: '更换屏幕', stopScreen: '停止共享', screenBusy: '其他人正在共享屏幕', screenStageEmpty: '共享屏幕将在此显示。', leaveCall: '离开通话', endCall: '结束通话', copyInvite: '复制邀请', audioShared: '屏幕音频已开启', audioNotShared: '没有屏幕音频', cameraOff: '摄像头已关闭', microphoneOff: '麦克风已关闭', waitingForPeople: '分享邀请链接来邀请其他人。', connectingPeople: '正在连接参与者…', permissionError: '无法访问摄像头或麦克风。请检查浏览器权限后重试。', screenUnavailable: '此浏览器版本当前页面不提供屏幕捕获。请更新浏览器或使用支持网页屏幕捕获的浏览器。', screenMobileNote: '屏幕捕获取决于浏览器和操作系统版本。支持时，请在通话中点击“共享屏幕”开始。', screenPermission: '浏览器阻止了屏幕捕获。请检查权限以及页面是否使用安全连接，然后重试。', joinRejected: '主持人未批准你的加入请求。', noName: '请输入名称以继续。', callStarted: '通话已准备就绪。', callFull: '房间已达到参与人数上限。', waitingHost: '等待主持人重新连接…', settings: '通话选项',
  },
};

export const getShareScreenCallCopy = (locale: AppLocale): ShareScreenCallCopy => copy[locale];
