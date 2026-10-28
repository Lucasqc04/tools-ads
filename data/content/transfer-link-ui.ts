import type { AppLocale } from '@/lib/i18n/config';

export type TransferLinkCopy = {
  title: string;
  intro: string;
  deviceName: string;
  deviceNameTemplate: string;
  createRoom: string;
  joinRoom: string;
  roomTitle: string;
  inviteLink: string;
  copyLink: string;
  copied: string;
  participants: string;
  connectedDevices: string;
  waitingForPeople: string;
  you: string;
  connected: string;
  connecting: string;
  disconnected: string;
  chooseFiles: string;
  dropFilesHint: string;
  noFilesSelected: string;
  sendToEveryone: string;
  waitingForDevice: string;
  activityTitle: string;
  noActiveTransfers: string;
  sending: string;
  receiving: string;
  sent: string;
  failed: string;
  receivedFiles: string;
  receivedFilesEmpty: string;
  readyToDownload: string;
  download: string;
  removeFile: string;
  endRoom: string;
  leaveRoom: string;
  learnMore: string;
  privacyBody: string;
  roomExpired: string;
  roomFull: string;
  connectionFailed: string;
  unknownError: string;
  connectionReady: string;
};

export const transferLinkCopy: Record<AppLocale, TransferLinkCopy> = {
  'pt-br': {
    title: 'Transferência por link',
    intro: 'Compartilhe uma sala para enviar e receber arquivos entre todos os dispositivos.',
    deviceName: 'Seu dispositivo',
    deviceNameTemplate: 'Dispositivo {number}',
    createRoom: 'Criar sala',
    joinRoom: 'Entrar na sala',
    roomTitle: 'Sala de transferência',
    inviteLink: 'Convide outros dispositivos',
    copyLink: 'Copiar convite',
    copied: 'Convite copiado.',
    participants: 'Dispositivos na sala',
    connectedDevices: 'online',
    waitingForPeople: 'Compartilhe o convite para adicionar dispositivos.',
    you: 'Você',
    connected: 'Conectado',
    connecting: 'Conectando',
    disconnected: 'Desconectado',
    chooseFiles: 'Escolher arquivos',
    dropFilesHint: 'Arraste arquivos para cá ou escolha no dispositivo',
    noFilesSelected: 'Os arquivos escolhidos aparecerão aqui.',
    sendToEveryone: 'Enviar para todos',
    waitingForDevice: 'Aguarde outro dispositivo entrar para enviar.',
    activityTitle: 'Transferências',
    noActiveTransfers: 'Nenhuma transferência em andamento.',
    sending: 'Enviando',
    receiving: 'Recebendo',
    sent: 'Enviado',
    failed: 'Falha no envio',
    receivedFiles: 'Arquivos recebidos',
    receivedFilesEmpty: 'Os arquivos recebidos aparecerão aqui. Você escolhe quando baixar.',
    readyToDownload: 'Pronto para baixar',
    download: 'Baixar',
    removeFile: 'Remover arquivo recebido',
    endRoom: 'Encerrar sala',
    leaveRoom: 'Sair da sala',
    learnMore: 'Saiba mais sobre conexão e privacidade',
    privacyBody: 'O servidor coordena a sala; os arquivos são enviados diretamente entre os navegadores e não ficam armazenados nele. Algumas redes podem bloquear conexões diretas.',
    roomExpired: 'Esta sala não existe mais ou expirou. Peça um novo convite.',
    roomFull: 'Esta sala já atingiu o limite de dispositivos.',
    connectionFailed: 'Não foi possível conectar. Tente abrir o convite novamente ou use o pareamento por QR.',
    unknownError: 'Não foi possível concluir a ação. Tente novamente.',
    connectionReady: 'Pronto para transferir arquivos.',
  },
  en: {
    title: 'Transfer files with a link',
    intro: 'Share a room to send and receive files between every connected device.',
    deviceName: 'Your device',
    deviceNameTemplate: 'Device {number}',
    createRoom: 'Create room',
    joinRoom: 'Join room',
    roomTitle: 'File transfer room',
    inviteLink: 'Invite other devices',
    copyLink: 'Copy invite',
    copied: 'Invite copied.',
    participants: 'Devices in this room',
    connectedDevices: 'online',
    waitingForPeople: 'Share the invite to add devices.',
    you: 'You',
    connected: 'Connected',
    connecting: 'Connecting',
    disconnected: 'Disconnected',
    chooseFiles: 'Choose files',
    dropFilesHint: 'Drop files here or choose them from your device',
    noFilesSelected: 'Your selected files will appear here.',
    sendToEveryone: 'Send to everyone',
    waitingForDevice: 'Wait for another device to join before sending.',
    activityTitle: 'Transfers',
    noActiveTransfers: 'No transfers in progress.',
    sending: 'Sending',
    receiving: 'Receiving',
    sent: 'Sent',
    failed: 'Transfer failed',
    receivedFiles: 'Received files',
    receivedFilesEmpty: 'Received files will appear here. You choose when to download them.',
    readyToDownload: 'Ready to download',
    download: 'Download',
    removeFile: 'Remove received file',
    endRoom: 'End room',
    leaveRoom: 'Leave room',
    learnMore: 'Learn about connection and privacy',
    privacyBody: 'The server coordinates the room; files move directly between browsers and are not stored there. Some networks may block direct connections.',
    roomExpired: 'This room no longer exists or has expired. Ask for a new invite.',
    roomFull: 'This room has reached its device limit.',
    connectionFailed: 'Could not connect. Reopen the invite or use QR pairing.',
    unknownError: 'Could not complete this action. Try again.',
    connectionReady: 'Ready to transfer files.',
  },
  es: {
    title: 'Transferir archivos con un enlace',
    intro: 'Comparte una sala para enviar y recibir archivos entre todos los dispositivos conectados.',
    deviceName: 'Tu dispositivo',
    deviceNameTemplate: 'Dispositivo {number}',
    createRoom: 'Crear sala',
    joinRoom: 'Unirse a la sala',
    roomTitle: 'Sala de transferencia',
    inviteLink: 'Invita a otros dispositivos',
    copyLink: 'Copiar invitación',
    copied: 'Invitación copiada.',
    participants: 'Dispositivos en esta sala',
    connectedDevices: 'en línea',
    waitingForPeople: 'Comparte la invitación para añadir dispositivos.',
    you: 'Tú',
    connected: 'Conectado',
    connecting: 'Conectando',
    disconnected: 'Desconectado',
    chooseFiles: 'Elegir archivos',
    dropFilesHint: 'Suelta archivos aquí o elígelos en tu dispositivo',
    noFilesSelected: 'Los archivos seleccionados aparecerán aquí.',
    sendToEveryone: 'Enviar a todos',
    waitingForDevice: 'Espera a que se una otro dispositivo para enviar.',
    activityTitle: 'Transferencias',
    noActiveTransfers: 'No hay transferencias en curso.',
    sending: 'Enviando',
    receiving: 'Recibiendo',
    sent: 'Enviado',
    failed: 'Error en la transferencia',
    receivedFiles: 'Archivos recibidos',
    receivedFilesEmpty: 'Los archivos recibidos aparecerán aquí. Tú eliges cuándo descargarlos.',
    readyToDownload: 'Listo para descargar',
    download: 'Descargar',
    removeFile: 'Quitar archivo recibido',
    endRoom: 'Cerrar sala',
    leaveRoom: 'Salir de la sala',
    learnMore: 'Más información sobre conexión y privacidad',
    privacyBody: 'El servidor coordina la sala; los archivos se envían directamente entre navegadores y no se almacenan allí. Algunas redes pueden bloquear las conexiones directas.',
    roomExpired: 'La sala ya no existe o ha caducado. Pide una nueva invitación.',
    roomFull: 'La sala alcanzó el límite de dispositivos.',
    connectionFailed: 'No se pudo conectar. Vuelve a abrir la invitación o usa el emparejamiento QR.',
    unknownError: 'No se pudo completar la acción. Inténtalo de nuevo.',
    connectionReady: 'Listo para transferir archivos.',
  },
  zh: {
    title: '通过链接传输文件',
    intro: '分享一个房间，让所有已连接的设备都能互相发送和接收文件。',
    deviceName: '你的设备',
    deviceNameTemplate: '设备 {number}',
    createRoom: '创建房间',
    joinRoom: '加入房间',
    roomTitle: '文件传输房间',
    inviteLink: '邀请其他设备',
    copyLink: '复制邀请链接',
    copied: '邀请链接已复制。',
    participants: '房间内的设备',
    connectedDevices: '台设备已连接',
    waitingForPeople: '分享邀请链接以添加设备。',
    you: '你',
    connected: '已连接',
    connecting: '连接中',
    disconnected: '已断开',
    chooseFiles: '选择文件',
    dropFilesHint: '将文件拖到这里，或从设备中选择',
    noFilesSelected: '所选文件会显示在这里。',
    sendToEveryone: '发送给所有人',
    waitingForDevice: '请等待其他设备加入后再发送。',
    activityTitle: '传输记录',
    noActiveTransfers: '当前没有正在进行的传输。',
    sending: '正在发送',
    receiving: '正在接收',
    sent: '已发送',
    failed: '传输失败',
    receivedFiles: '已接收的文件',
    receivedFilesEmpty: '接收的文件会显示在这里。你可以选择何时下载。',
    readyToDownload: '可以下载',
    download: '下载',
    removeFile: '移除已接收的文件',
    endRoom: '结束房间',
    leaveRoom: '离开房间',
    learnMore: '了解连接与隐私',
    privacyBody: '服务器负责协调房间；文件在浏览器之间直接传输，不会保存在服务器上。某些网络可能会阻止直接连接。',
    roomExpired: '房间不存在或已过期。请索取新的邀请链接。',
    roomFull: '房间设备数量已达上限。',
    connectionFailed: '无法连接。请重新打开邀请链接，或使用二维码配对。',
    unknownError: '无法完成此操作，请重试。',
    connectionReady: '可以传输文件了。',
  },
};
