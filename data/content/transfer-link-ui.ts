import type { AppLocale } from '@/lib/i18n/config';

export type TransferLinkCopy = {
  title: string;
  intro: string;
  deviceName: string;
  deviceNamePlaceholder: string;
  createRoom: string;
  joinRoom: string;
  inviteLink: string;
  copyLink: string;
  copied: string;
  participants: string;
  thisDevice: string;
  you: string;
  waitingForPeople: string;
  waitingForHost: string;
  connecting: string;
  connected: string;
  disconnected: string;
  selectFiles: string;
  selectedFiles: string;
  noFilesSelected: string;
  sendFiles: string;
  sendNeedsPeer: string;
  receiveEmpty: string;
  receivedFilesTitle: string;
  receiving: string;
  readyToDownload: string;
  download: string;
  endRoom: string;
  leaveRoom: string;
  privacyTitle: string;
  privacyBody: string;
  roomExpired: string;
  roomFull: string;
  connectionFailed: string;
  unknownError: string;
  sent: string;
  failed: string;
};

export const transferLinkCopy: Record<AppLocale, TransferLinkCopy> = {
  'pt-br': {
    title: 'Enviar arquivos por link',
    intro: 'Crie uma sala, compartilhe o link e envie arquivos para os dispositivos conectados.',
    deviceName: 'Nome deste dispositivo',
    deviceNamePlaceholder: 'Ex.: Meu notebook',
    createRoom: 'Criar sala e gerar link',
    joinRoom: 'Entrar na sala',
    inviteLink: 'Link para compartilhar',
    copyLink: 'Copiar link',
    copied: 'Link copiado.',
    participants: 'Dispositivos na sala',
    thisDevice: 'Este dispositivo · remetente',
    you: 'Você · recebendo',
    waitingForPeople: 'Aguardando alguém abrir o link…',
    waitingForHost: 'Entrando na sala e aguardando o remetente…',
    connecting: 'Conectando…',
    connected: 'Conectado',
    disconnected: 'Desconectado',
    selectFiles: 'Escolher arquivos',
    selectedFiles: 'Arquivos selecionados',
    noFilesSelected: 'Escolha um ou mais arquivos para enviar.',
    sendFiles: 'Enviar para os dispositivos conectados',
    sendNeedsPeer: 'Aguarde ao menos um dispositivo ficar conectado.',
    receiveEmpty: 'Quando o remetente iniciar um envio, o progresso aparecerá aqui.',
    receivedFilesTitle: 'Arquivos recebidos',
    receiving: 'Baixando',
    readyToDownload: 'Pronto para baixar',
    download: 'Baixar arquivo',
    endRoom: 'Encerrar sala',
    leaveRoom: 'Sair da sala',
    privacyTitle: 'Conexão e privacidade',
    privacyBody: 'O servidor coordena a sala e a conexão. Os arquivos seguem entre os navegadores por WebRTC e não são armazenados no servidor. Redes restritivas podem falhar porque esta versão não usa relay TURN.',
    roomExpired: 'Esta sala não existe mais ou expirou. Peça um novo link ao remetente.',
    roomFull: 'Esta sala já atingiu o limite de dispositivos.',
    connectionFailed: 'Não foi possível conectar. Tente abrir o link novamente ou use o pareamento manual por QR.',
    unknownError: 'Não foi possível concluir a ação. Tente novamente.',
    sent: 'Enviado',
    failed: 'Falha no envio',
  },
  en: {
    title: 'Send files with a link',
    intro: 'Create a room, share its link, and send files to connected devices.',
    deviceName: 'This device name',
    deviceNamePlaceholder: 'For example, My laptop',
    createRoom: 'Create room and link',
    joinRoom: 'Join room',
    inviteLink: 'Share this link',
    copyLink: 'Copy link',
    copied: 'Link copied.',
    participants: 'Devices in this room',
    thisDevice: 'This device · sender',
    you: 'You · receiving',
    waitingForPeople: 'Waiting for someone to open the link…',
    waitingForHost: 'Joining the room and waiting for the sender…',
    connecting: 'Connecting…',
    connected: 'Connected',
    disconnected: 'Disconnected',
    selectFiles: 'Choose files',
    selectedFiles: 'Selected files',
    noFilesSelected: 'Choose one or more files to send.',
    sendFiles: 'Send to connected devices',
    sendNeedsPeer: 'Wait for at least one device to connect.',
    receiveEmpty: 'Transfer progress will appear here when the sender starts sending.',
    receivedFilesTitle: 'Received files',
    receiving: 'Downloading',
    readyToDownload: 'Ready to download',
    download: 'Download file',
    endRoom: 'End room',
    leaveRoom: 'Leave room',
    privacyTitle: 'Connection and privacy',
    privacyBody: 'The server coordinates the room and connection. Files travel between browsers over WebRTC and are not stored on the server. Restrictive networks may fail because this version has no TURN relay.',
    roomExpired: 'This room no longer exists or has expired. Ask the sender for a new link.',
    roomFull: 'This room has reached its device limit.',
    connectionFailed: 'Could not connect. Reopen the link or use manual QR pairing.',
    unknownError: 'Could not complete this action. Try again.',
    sent: 'Sent',
    failed: 'Transfer failed',
  },
  es: {
    title: 'Enviar archivos con un enlace',
    intro: 'Crea una sala, comparte el enlace y envía archivos a los dispositivos conectados.',
    deviceName: 'Nombre de este dispositivo',
    deviceNamePlaceholder: 'Por ejemplo, Mi portátil',
    createRoom: 'Crear sala y enlace',
    joinRoom: 'Unirse a la sala',
    inviteLink: 'Enlace para compartir',
    copyLink: 'Copiar enlace',
    copied: 'Enlace copiado.',
    participants: 'Dispositivos en la sala',
    thisDevice: 'Este dispositivo · remitente',
    you: 'Tú · recibiendo',
    waitingForPeople: 'Esperando a que alguien abra el enlace…',
    waitingForHost: 'Entrando en la sala y esperando al remitente…',
    connecting: 'Conectando…',
    connected: 'Conectado',
    disconnected: 'Desconectado',
    selectFiles: 'Elegir archivos',
    selectedFiles: 'Archivos seleccionados',
    noFilesSelected: 'Elige uno o varios archivos para enviar.',
    sendFiles: 'Enviar a los dispositivos conectados',
    sendNeedsPeer: 'Espera a que se conecte al menos un dispositivo.',
    receiveEmpty: 'El progreso aparecerá aquí cuando el remitente inicie el envío.',
    receivedFilesTitle: 'Archivos recibidos',
    receiving: 'Descargando',
    readyToDownload: 'Listo para descargar',
    download: 'Descargar archivo',
    endRoom: 'Cerrar sala',
    leaveRoom: 'Salir de la sala',
    privacyTitle: 'Conexión y privacidad',
    privacyBody: 'El servidor coordina la sala y la conexión. Los archivos viajan entre navegadores por WebRTC y no se guardan en el servidor. Las redes restrictivas pueden fallar porque esta versión no usa relay TURN.',
    roomExpired: 'La sala ya no existe o ha caducado. Pide un enlace nuevo al remitente.',
    roomFull: 'La sala alcanzó el límite de dispositivos.',
    connectionFailed: 'No se pudo conectar. Abre el enlace de nuevo o usa el emparejamiento manual por QR.',
    unknownError: 'No se pudo completar la acción. Inténtalo de nuevo.',
    sent: 'Enviado',
    failed: 'Error en el envío',
  },
  zh: {
    title: '通过链接发送文件',
    intro: '创建房间并分享链接，即可向已连接的设备发送文件。',
    deviceName: '此设备名称',
    deviceNamePlaceholder: '例如：我的笔记本电脑',
    createRoom: '创建房间并生成链接',
    joinRoom: '加入房间',
    inviteLink: '分享此链接',
    copyLink: '复制链接',
    copied: '链接已复制。',
    participants: '房间内的设备',
    thisDevice: '此设备 · 发送方',
    you: '你 · 接收中',
    waitingForPeople: '等待其他人打开链接…',
    waitingForHost: '正在加入房间并等待发送方…',
    connecting: '正在连接…',
    connected: '已连接',
    disconnected: '已断开',
    selectFiles: '选择文件',
    selectedFiles: '已选文件',
    noFilesSelected: '选择一个或多个文件进行发送。',
    sendFiles: '发送给已连接设备',
    sendNeedsPeer: '请等待至少一台设备连接。',
    receiveEmpty: '发送方开始发送后，进度会显示在这里。',
    receivedFilesTitle: '已接收的文件',
    receiving: '下载中',
    readyToDownload: '可以下载',
    download: '下载文件',
    endRoom: '结束房间',
    leaveRoom: '离开房间',
    privacyTitle: '连接与隐私',
    privacyBody: '服务器仅协调房间和连接。文件通过 WebRTC 在浏览器之间传输，不会存储在服务器上。由于此版本没有 TURN 中继，受限网络可能无法连接。',
    roomExpired: '房间不存在或已过期。请向发送方索要新链接。',
    roomFull: '房间已达到设备数量上限。',
    connectionFailed: '连接失败。请重新打开链接，或使用二维码手动配对。',
    unknownError: '无法完成此操作，请重试。',
    sent: '已发送',
    failed: '发送失败',
  },
};
