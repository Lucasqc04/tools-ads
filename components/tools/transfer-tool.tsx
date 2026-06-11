'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import type { IScannerControls } from '@zxing/browser';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/cn';
import { formatBytes } from '@/lib/file-size';
import type { AppLocale } from '@/lib/i18n/config';
import { downloadBlob } from '@/lib/qr-code';
import {
  addPacketToAssembly,
  buildUint8Chunks,
  createTransferPackets,
  mergeUint8Chunks,
  parseSignalDescription,
  parseTransferInput,
  serializeSignalDescription,
  waitForDataChannelDrain,
  waitForIceGatheringComplete,
  type TransferAssemblyState,
  type TransferPacket,
  type TransferSignalKind,
} from '@/lib/transfer';

type TransferToolProps = Readonly<{
  locale?: AppLocale;
}>;

type ToolMode = 'simple' | 'p2p';
type P2PRole = 'receive' | 'send';
type ScannerTarget = 'simple' | 'offer' | 'answer' | null;
type NoticeTone = 'info' | 'success' | 'error';
type SendPayloadMode = 'file' | 'text';
type TransferPayloadType = 'file' | 'text';
type ZxingModule = typeof import('@zxing/browser');
type BusyAction =
  | 'offer'
  | 'import-offer'
  | 'import-answer'
  | 'camera'
  | 'send'
  | null;

type Notice = {
  tone: NoticeTone;
  text: string;
};

type GeneratedTransfer = {
  packets: TransferPacket[];
  urls: string[];
  compressedLength: number;
  rawLength: number;
  sessionId: string;
};

type ReceivedTransfer = {
  blob: Blob;
  fileName: string;
  mimeType: string;
  payloadType: TransferPayloadType;
  size: number;
  text?: string;
};

type CameraOption = {
  deviceId: string;
  label: string;
};

type IncomingTransferMetaMessage = {
  type: 'meta';
  payloadType: TransferPayloadType;
  fileName: string;
  mimeType: string;
  size: number;
  totalChunks: number;
};

type IncomingTransferState = {
  meta: IncomingTransferMetaMessage;
  chunks: Uint8Array[];
  receivedBytes: number;
};

const SIMPLE_CHUNK_LENGTH = 1000;
const SIGNAL_CHUNK_LENGTH = 240;
const DATA_CHANNEL_CHUNK_SIZE = 16 * 1024;
const QR_PREVIEW_SIZE = 320;

const uiByLocale = {
  'pt-br': {
    simpleTab: 'QR rapido',
    p2pTab: 'Arquivo ou texto grande P2P',
    simpleIntro:
      'Use QR para links, Pix, senhas temporarias, JSON curto e comandos pequenos. O destino pode ler pela camera, pela propria pagina ou por imagem.',
    p2pIntro:
      'Use WebRTC DataChannel para arquivos e textos maiores. O pareamento acontece por QR manual e depois o envio segue direto entre os navegadores.',
    simpleWriteTitle: '1. Gerar QR neste dispositivo',
    simpleReadTitle: '2. Ler QR do outro dispositivo aqui',
    simpleInputLabel: 'Texto, link, Pix, JSON ou comando curto',
    simpleInputPlaceholder:
      'Cole aqui um link, chave Pix, payload curto, JSON pequeno ou comando de terminal',
    simpleGenerate: 'Gerar QR',
    simpleClear: 'Limpar',
    simpleGeneratedTitle: 'QR atual',
    simpleGeneratedEmpty: 'Digite algo e gere o QR para mostrar aqui.',
    simpleReceivedTitle: 'Conteudo lido neste dispositivo',
    simpleReceivedLabel: 'Conteudo lido',
    simpleReceivedPlaceholder: 'O texto recebido aparece aqui para copiar.',
    simpleCopyReceived: 'Copiar texto',
    simpleOpenScanner: 'Abrir leitor QR',
    simpleCaptureImage: 'Ler por imagem / camera do sistema',
    simpleCopyLink: 'Copiar link desta parte',
    simpleChars: 'Caracteres',
    simpleCompressed: 'Compactado',
    simpleParts: 'Partes',
    simpleUseP2P:
      'Se esse conteudo ficar com muitas partes, use o modo P2P para evitar troca manual longa.',
    simpleGeneratedOne: 'QR pronto. O outro dispositivo ja pode escanear.',
    simpleGeneratedMany: (parts: number) =>
      `Conteudo dividido em ${parts} partes. Leia todas no destino para reconstruir.`,
    simpleReceivedOk: 'Conteudo recebido com sucesso.',
    simpleCameraPlainOk: 'QR lido. Conteudo carregado para copia.',
    simpleWrongPacket:
      'Esse QR nao contem texto simples. Troque para o fluxo P2P ou escaneie o QR correto.',
    p2pRoleTitle: 'Escolha o papel deste dispositivo',
    p2pReceiveRole: 'Receber neste dispositivo',
    p2pSendRole: 'Enviar deste dispositivo',
    p2pReceiveIntro:
      'Use este modo no PC ou no aparelho que vai baixar o arquivo. Ele gera a offer e espera a answer do outro lado.',
    p2pSendIntro:
      'Use este modo no celular ou no aparelho que vai mandar o conteudo. Ele le a offer, responde com uma answer e envia o arquivo ou o texto.',
    receiveStep1Title: 'Passo 1 — Gerar o QR de conexao neste dispositivo',
    receiveStep1Description:
      'No PC ou no aparelho que vai receber, gere a offer e deixe este QR visivel para o dispositivo que vai enviar.',
    receiveStep2Title: 'Passo 2 — Ler a answer do dispositivo que vai enviar',
    receiveStep2Description:
      'Depois que o outro dispositivo ler a offer, volte aqui e leia a answer dele pela camera, por imagem ou colando o texto.',
    receiveStep3Title: 'Passo 3 — Aguardar a conexao e o recebimento',
    receiveStep3Description:
      'Quando o canal abrir, este dispositivo fica pronto para receber o arquivo ou o texto.',
    sendStep1Title: 'Passo 1 — Ler a offer do dispositivo receptor',
    sendStep1Description:
      'No celular ou no aparelho que vai enviar, leia a offer mostrada no dispositivo receptor.',
    sendStep2Title: 'Passo 2 — Mostrar a answer para o dispositivo receptor',
    sendStep2Description:
      'Depois de ler a offer, esta pagina gera uma answer. Deixe este QR aberto para o receptor ler.',
    sendStep3Title: 'Passo 3 — Aguardar o canal abrir',
    sendStep3Description:
      'Quando o receptor ler a answer, aguarde alguns segundos ate o canal P2P ficar pronto.',
    sendStep4Title: 'Passo 4 — Enviar arquivo ou texto',
    sendStep4Description:
      'Escolha um arquivo ou cole um texto grande somente depois que o canal estiver aberto.',
    privacyTitle: 'Conectividade e privacidade',
    privacyHint:
      'Sem TURN relay nesta versao. Com STUN ligado, a conexao continua direta, mas um STUN publico pode ajudar a descobrir a rota.',
    privacyStrict:
      'Com STUN desligado, a chance maior e funcionar na mesma rede ou em cenarios simples de NAT.',
    stunToggle: 'Usar STUN publico para facilitar conexao direta',
    generateOffer: 'Gerar pedido de conexao',
    regenerateOffer: 'Gerar novo pedido',
    offerReadyOne: 'Offer pronta. Escaneie no celular ou no outro navegador.',
    offerReadyMany: (parts: number) =>
      `Offer dividida em ${parts} partes. Leia todas no dispositivo que vai enviar.`,
    answerReadyOne: 'Answer pronta. Agora o dispositivo receptor precisa ler este QR.',
    answerReadyMany: (parts: number) =>
      `Answer dividida em ${parts} partes. Leia todas no dispositivo receptor.`,
    importOfferTitle: 'Ler offer do dispositivo receptor',
    importAnswerTitle: 'Ler answer do dispositivo que vai enviar',
    importPlaceholder:
      'Cole aqui o texto bruto da offer/answer, ou use o leitor QR logo abaixo.',
    importOfferButton: 'Importar offer',
    importAnswerButton: 'Importar answer',
    importByCamera: 'Ler offer/answer por QR',
    openOfferScanner: 'Abrir leitor da offer',
    openAnswerScanner: 'Abrir leitor da answer',
    connectionIdle: 'Nenhuma conexao ativa ainda.',
    connectionWaitingAnswer:
      'Offer gerada. Falta o outro dispositivo responder com a answer.',
    connectionConnecting:
      'Pareamento concluido. Aguarde o WebRTC abrir o canal entre os dispositivos.',
    connectionReadyReceive:
      'Canal aberto. Este dispositivo esta pronto para receber texto ou arquivo.',
    connectionReadySend:
      'Canal aberto. Este dispositivo ja pode enviar texto ou arquivo.',
    connectionClosed: 'Canal encerrado.',
    connectionFailed:
      'Falha na conexao P2P. Tente regenerar a offer, revisar a answer ou ligar o STUN.',
    importOfferOk: 'Offer recebida. A answer foi gerada para o outro dispositivo.',
    importAnswerOk: 'Answer aplicada. Aguarde a abertura do canal.',
    invalidOffer: 'A offer informada e invalida.',
    invalidAnswer: 'A answer informada e invalida.',
    payloadTitle: 'Conteudo para enviar',
    payloadModeFile: 'Arquivo',
    payloadModeText: 'Texto grande',
    payloadTextLabel: 'Texto para transferir',
    payloadTextPlaceholder:
      'Cole aqui um texto maior, um JSON grande, um trecho de log ou qualquer conteudo que nao caiba bem em QR.',
    payloadChooseFile: 'Selecionar arquivo',
    payloadNoFile: 'Nenhum arquivo selecionado.',
    sendNow: 'Enviar agora',
    sending: 'Enviando...',
    sendDone: 'Envio concluido.',
    sendNeedsChannel: 'O canal ainda nao esta aberto.',
    sendNeedsText: 'Digite um texto antes de enviar.',
    sendNeedsFile: 'Escolha um arquivo antes de enviar.',
    sendPreparing: 'Preparando envio...',
    receiving: (fileName: string) => `Recebendo ${fileName}...`,
    receiveDoneFile: (fileName: string) =>
      `${fileName} recebido. O download foi disparado neste dispositivo.`,
    receiveDoneText: 'Texto recebido. Voce pode copiar ou baixar agora.',
    receiveResultTitle: 'Conteudo recebido neste dispositivo',
    receiveDownload: 'Baixar novamente',
    receiveCopy: 'Copiar texto recebido',
    receiveEmpty:
      'Depois que a conexao abrir e o envio terminar, o arquivo ou o texto recebido aparece aqui.',
    resetSession: 'Resetar sessao',
    loadingOffer: 'Gerando offer e preparando os QR Codes...',
    loadingOfferImport: 'Lendo a offer e gerando a answer...',
    loadingAnswerImport: 'Aplicando a answer e aguardando o canal...',
    loadingCamera: 'Abrindo camera para ler o QR...',
    scannerTitle: 'Leitor QR da pagina',
    scannerIntro:
      'Use a camera do navegador ou envie uma imagem do QR. Em muitos celulares, o seletor de imagem tambem abre a camera do sistema.',
    scannerForSimpleTitle: 'Ler QR de texto',
    scannerForOfferTitle: 'Ler QR da offer',
    scannerForAnswerTitle: 'Ler QR da answer',
    scannerSimpleHint: 'Aponte a camera para o QR de texto do outro dispositivo.',
    scannerOfferHint: 'Aponte a camera para o QR da offer mostrado no dispositivo receptor.',
    scannerAnswerHint: 'Aponte a camera para o QR da answer mostrado no dispositivo que vai enviar.',
    scannerStart: 'Iniciar camera',
    scannerStop: 'Parar camera',
    scannerClose: 'Fechar leitor',
    scannerDevice: 'Camera',
    scannerImageLabel: 'Escolher imagem do QR',
    scannerReady: 'Leitor QR pronto.',
    scannerReading: 'Aponte a camera para o QR.',
    scannerAwaitMore: (count: number, total: number) =>
      `Parte ${count} de ${total} lida. Continue com as proximas.`,
    scannerWrongSignal:
      'O QR lido nao pertence a este passo. Confira se esta lendo offer ou answer.',
    scannerUnsupportedText:
      'Seu navegador nao permitiu a camera neste momento. Voce ainda pode enviar uma imagem do QR ou usar a camera nativa do celular.',
    scannerImageError: 'Nao foi possivel ler esse arquivo como QR Code.',
    scannerCameraError: 'Nao foi possivel iniciar a camera para ler o QR.',
    scannerHashLoaded: (count: number, total: number) =>
      `A pagina abriu com a parte ${count} de ${total}. Use o leitor interno para completar a transferencia.`,
    scannerHashTextDone: 'Conteudo vindo do QR carregado automaticamente nesta pagina.',
    scannerHashOfferDone:
      'Offer recebida pela URL. A answer foi gerada automaticamente para este dispositivo.',
    scannerHashAnswerDone:
      'Answer recebida pela URL. Aguarde a abertura do canal P2P.',
    localOnlyNote:
      'Processamento local no navegador. No modo P2P, o payload principal segue pelo DataChannel apos o pareamento.',
    partLabel: (index: number, total: number) => `Parte ${index} de ${total}`,
    previous: 'Anterior',
    next: 'Proxima',
    copied: 'Copiado.',
    copyError: 'Nao foi possivel copiar agora.',
  },
  en: {
    simpleTab: 'Quick QR',
    p2pTab: 'Large file or text P2P',
    simpleIntro:
      'Use QR for links, Pix payloads, temporary passwords, compact JSON, and short commands. The other device can scan with the camera, inside this page, or from an image.',
    p2pIntro:
      'Use WebRTC DataChannel for larger files and text. QR is only used for the manual handshake and the payload then moves directly between browsers.',
    simpleWriteTitle: '1. Generate QR on this device',
    simpleReadTitle: '2. Read the other device QR here',
    simpleInputLabel: 'Short text, link, Pix payload, JSON, or command',
    simpleInputPlaceholder:
      'Paste a link, Pix key, compact payload, short JSON, or terminal command here',
    simpleGenerate: 'Generate QR',
    simpleClear: 'Clear',
    simpleGeneratedTitle: 'Current QR',
    simpleGeneratedEmpty: 'Type something and generate the QR to preview it here.',
    simpleReceivedTitle: 'Content read on this device',
    simpleReceivedLabel: 'Scanned content',
    simpleReceivedPlaceholder: 'Scanned text appears here for copying.',
    simpleCopyReceived: 'Copy text',
    simpleOpenScanner: 'Open QR scanner',
    simpleCaptureImage: 'Read from image / system camera',
    simpleCopyLink: 'Copy this part link',
    simpleChars: 'Characters',
    simpleCompressed: 'Compressed',
    simpleParts: 'Parts',
    simpleUseP2P:
      'If this payload grows into many parts, switch to P2P to avoid a long manual exchange.',
    simpleGeneratedOne: 'QR ready. The other device can scan it now.',
    simpleGeneratedMany: (parts: number) =>
      `Content split into ${parts} parts. Scan all of them on the destination device.`,
    simpleReceivedOk: 'Content received successfully.',
    simpleCameraPlainOk: 'QR read. Content loaded for copy.',
    simpleWrongPacket:
      'This QR does not contain simple text content. Switch to the P2P flow or scan the correct QR.',
    p2pRoleTitle: 'Choose this device role',
    p2pReceiveRole: 'Receive on this device',
    p2pSendRole: 'Send from this device',
    p2pReceiveIntro:
      'Use this on the desktop or the device that will download the file. It creates the offer and waits for the answer.',
    p2pSendIntro:
      'Use this on the phone or the device that will send the payload. It reads the offer, creates an answer, and sends the file or large text.',
    receiveStep1Title: 'Step 1 — Generate the connection QR on this device',
    receiveStep1Description:
      'On the desktop or receiving device, create the offer and keep this QR visible for the sending device.',
    receiveStep2Title: 'Step 2 — Read the answer from the sending device',
    receiveStep2Description:
      'After the other device reads the offer, come back here and read its answer with the camera, from an image, or by pasting the raw text.',
    receiveStep3Title: 'Step 3 — Wait for connection and receive the payload',
    receiveStep3Description:
      'Once the channel opens, this device is ready to receive file or text.',
    sendStep1Title: 'Step 1 — Read the receiver offer',
    sendStep1Description:
      'On the phone or sending device, read the offer shown on the receiver device.',
    sendStep2Title: 'Step 2 — Show the answer to the receiver device',
    sendStep2Description:
      'After reading the offer, this page generates an answer. Keep this QR open so the receiver can read it.',
    sendStep3Title: 'Step 3 — Wait for the channel to open',
    sendStep3Description:
      'After the receiver reads the answer, wait a few seconds for the P2P channel to become ready.',
    sendStep4Title: 'Step 4 — Send file or text',
    sendStep4Description:
      'Choose a file or paste large text only after the channel is open.',
    privacyTitle: 'Connectivity and privacy',
    privacyHint:
      'There is no TURN relay in this build. With STUN enabled the transfer stays direct, but a public STUN server can help discover the route.',
    privacyStrict:
      'With STUN disabled the best chance is the same network or a simple NAT environment.',
    stunToggle: 'Use public STUN to help direct connectivity',
    generateOffer: 'Generate connection request',
    regenerateOffer: 'Generate new request',
    offerReadyOne: 'Offer ready. Scan it on the other device.',
    offerReadyMany: (parts: number) =>
      `Offer split into ${parts} parts. Scan all parts on the sending device.`,
    answerReadyOne: 'Answer ready. The receiving device now needs to read this QR.',
    answerReadyMany: (parts: number) =>
      `Answer split into ${parts} parts. Scan all parts on the receiving device.`,
    importOfferTitle: 'Read the receiver offer',
    importAnswerTitle: 'Read the sender answer',
    importPlaceholder:
      'Paste the raw offer/answer text here, or use the QR scanner below.',
    importOfferButton: 'Import offer',
    importAnswerButton: 'Import answer',
    importByCamera: 'Read offer/answer via QR',
    openOfferScanner: 'Open offer scanner',
    openAnswerScanner: 'Open answer scanner',
    connectionIdle: 'No active connection yet.',
    connectionWaitingAnswer: 'Offer created. The other device still needs to reply with an answer.',
    connectionConnecting: 'Handshake done. Wait for WebRTC to open the channel.',
    connectionReadyReceive:
      'Channel open. This device is ready to receive file or text.',
    connectionReadySend: 'Channel open. This device can now send file or text.',
    connectionClosed: 'Channel closed.',
    connectionFailed:
      'P2P connection failed. Try regenerating the offer, re-reading the answer, or enabling STUN.',
    importOfferOk: 'Offer imported. An answer was generated for the other device.',
    importAnswerOk: 'Answer applied. Wait for the channel to open.',
    invalidOffer: 'The provided offer is invalid.',
    invalidAnswer: 'The provided answer is invalid.',
    payloadTitle: 'Payload to send',
    payloadModeFile: 'File',
    payloadModeText: 'Large text',
    payloadTextLabel: 'Text to transfer',
    payloadTextPlaceholder:
      'Paste larger text, logs, JSON, or any payload that is too big for practical QR exchange.',
    payloadChooseFile: 'Choose file',
    payloadNoFile: 'No file selected.',
    sendNow: 'Send now',
    sending: 'Sending...',
    sendDone: 'Transfer completed.',
    sendNeedsChannel: 'The data channel is not open yet.',
    sendNeedsText: 'Enter text before sending.',
    sendNeedsFile: 'Choose a file before sending.',
    sendPreparing: 'Preparing transfer...',
    receiving: (fileName: string) => `Receiving ${fileName}...`,
    receiveDoneFile: (fileName: string) =>
      `${fileName} received. Download was triggered on this device.`,
    receiveDoneText: 'Text received. You can copy or download it now.',
    receiveResultTitle: 'Content received on this device',
    receiveDownload: 'Download again',
    receiveCopy: 'Copy received text',
    receiveEmpty:
      'Once the channel is open and the transfer finishes, the received file or text will appear here.',
    resetSession: 'Reset session',
    loadingOffer: 'Generating the offer and preparing the QR codes...',
    loadingOfferImport: 'Reading the offer and generating the answer...',
    loadingAnswerImport: 'Applying the answer and waiting for the channel...',
    loadingCamera: 'Opening the camera to read the QR...',
    scannerTitle: 'Built-in QR scanner',
    scannerIntro:
      'Use the browser camera or upload a QR image. On many phones the image picker can also open the system camera.',
    scannerForSimpleTitle: 'Read text QR',
    scannerForOfferTitle: 'Read offer QR',
    scannerForAnswerTitle: 'Read answer QR',
    scannerSimpleHint: 'Point the camera at the text QR from the other device.',
    scannerOfferHint: 'Point the camera at the offer QR shown on the receiving device.',
    scannerAnswerHint: 'Point the camera at the answer QR shown on the sending device.',
    scannerStart: 'Start camera',
    scannerStop: 'Stop camera',
    scannerClose: 'Close scanner',
    scannerDevice: 'Camera',
    scannerImageLabel: 'Choose QR image',
    scannerReady: 'QR scanner ready.',
    scannerReading: 'Point the camera at the QR code.',
    scannerAwaitMore: (count: number, total: number) =>
      `Part ${count} of ${total} scanned. Continue with the remaining parts.`,
    scannerWrongSignal:
      'The scanned QR does not belong to this step. Check whether you need the offer or the answer.',
    scannerUnsupportedText:
      'Camera access is not available right now. You can still upload a QR image or use the phone camera app.',
    scannerImageError: 'Could not read this image as a QR code.',
    scannerCameraError: 'Could not start the camera scanner.',
    scannerHashLoaded: (count: number, total: number) =>
      `This page opened with part ${count} of ${total}. Use the built-in scanner to finish the set.`,
    scannerHashTextDone: 'Content from the QR was loaded automatically on this page.',
    scannerHashOfferDone:
      'Offer received from the URL. The answer was generated automatically on this device.',
    scannerHashAnswerDone:
      'Answer received from the URL. Wait for the P2P channel to open.',
    localOnlyNote:
      'Local browser processing. In P2P mode the main payload travels through the data channel after pairing.',
    partLabel: (index: number, total: number) => `Part ${index} of ${total}`,
    previous: 'Previous',
    next: 'Next',
    copied: 'Copied.',
    copyError: 'Could not copy right now.',
  },
  es: {
    simpleTab: 'QR rapido',
    p2pTab: 'Archivo o texto grande P2P',
    simpleIntro:
      'Usa QR para enlaces, payloads Pix, contrasenas temporales, JSON pequeno y comandos cortos. El otro dispositivo puede leerlo con la camara, en esta pagina o desde una imagen.',
    p2pIntro:
      'Usa WebRTC DataChannel para archivos y textos grandes. El QR solo sirve para el emparejamiento y luego el payload va directo entre navegadores.',
    simpleWriteTitle: '1. Generar QR en este dispositivo',
    simpleReadTitle: '2. Leer aqui el QR del otro dispositivo',
    simpleInputLabel: 'Texto corto, enlace, Pix, JSON o comando',
    simpleInputPlaceholder:
      'Pega aqui un enlace, clave Pix, payload corto, JSON pequeno o comando de terminal',
    simpleGenerate: 'Generar QR',
    simpleClear: 'Limpiar',
    simpleGeneratedTitle: 'QR actual',
    simpleGeneratedEmpty: 'Escribe algo y genera el QR para verlo aqui.',
    simpleReceivedTitle: 'Contenido leido en este dispositivo',
    simpleReceivedLabel: 'Contenido leido',
    simpleReceivedPlaceholder: 'El texto leido aparece aqui para copiar.',
    simpleCopyReceived: 'Copiar texto',
    simpleOpenScanner: 'Abrir lector QR',
    simpleCaptureImage: 'Leer por imagen / camara del sistema',
    simpleCopyLink: 'Copiar enlace de esta parte',
    simpleChars: 'Caracteres',
    simpleCompressed: 'Compactado',
    simpleParts: 'Partes',
    simpleUseP2P:
      'Si el contenido se divide en demasiadas partes, cambia al modo P2P para evitar intercambio manual largo.',
    simpleGeneratedOne: 'QR listo. El otro dispositivo ya puede escanearlo.',
    simpleGeneratedMany: (parts: number) =>
      `Contenido dividido en ${parts} partes. Lee todas en el dispositivo destino.`,
    simpleReceivedOk: 'Contenido recibido correctamente.',
    simpleCameraPlainOk: 'QR leido. Contenido cargado para copiar.',
    simpleWrongPacket:
      'Ese QR no contiene contenido simple de texto. Cambia al flujo P2P o escanea el QR correcto.',
    p2pRoleTitle: 'Elige el papel de este dispositivo',
    p2pReceiveRole: 'Recibir en este dispositivo',
    p2pSendRole: 'Enviar desde este dispositivo',
    p2pReceiveIntro:
      'Usa este modo en el PC o en el dispositivo que va a descargar el archivo. Genera la offer y espera la answer.',
    p2pSendIntro:
      'Usa este modo en el movil o en el dispositivo que va a enviar el contenido. Lee la offer, genera la answer y envia el archivo o texto.',
    receiveStep1Title: 'Paso 1 — Generar el QR de conexion en este dispositivo',
    receiveStep1Description:
      'En el PC o en el dispositivo que va a recibir, genera la offer y deja este QR visible para el dispositivo que enviara.',
    receiveStep2Title: 'Paso 2 — Leer la answer del dispositivo que envia',
    receiveStep2Description:
      'Despues de que el otro dispositivo lea la offer, vuelve aqui y lee su answer por camara, imagen o pegando el texto.',
    receiveStep3Title: 'Paso 3 — Esperar la conexion y la recepcion',
    receiveStep3Description:
      'Cuando el canal se abra, este dispositivo quedara listo para recibir archivo o texto.',
    sendStep1Title: 'Paso 1 — Leer la offer del dispositivo receptor',
    sendStep1Description:
      'En el movil o dispositivo que va a enviar, lee la offer mostrada en el dispositivo receptor.',
    sendStep2Title: 'Paso 2 — Mostrar la answer al dispositivo receptor',
    sendStep2Description:
      'Despues de leer la offer, esta pagina genera una answer. Deja este QR abierto para que el receptor lo lea.',
    sendStep3Title: 'Paso 3 — Esperar a que el canal se abra',
    sendStep3Description:
      'Cuando el receptor lea la answer, espera unos segundos hasta que el canal P2P quede listo.',
    sendStep4Title: 'Paso 4 — Enviar archivo o texto',
    sendStep4Description:
      'Elige un archivo o pega texto grande solo cuando el canal este abierto.',
    privacyTitle: 'Conectividad y privacidad',
    privacyHint:
      'No hay TURN relay en esta version. Con STUN activo la transferencia sigue siendo directa, pero un STUN publico puede ayudar a descubrir la ruta.',
    privacyStrict:
      'Con STUN apagado, la mejor posibilidad es estar en la misma red o en un NAT sencillo.',
    stunToggle: 'Usar STUN publico para ayudar a la conexion directa',
    generateOffer: 'Generar solicitud de conexion',
    regenerateOffer: 'Generar nueva solicitud',
    offerReadyOne: 'Offer lista. Escaneala en el otro dispositivo.',
    offerReadyMany: (parts: number) =>
      `Offer dividida en ${parts} partes. Lee todas en el dispositivo que enviara.`,
    answerReadyOne: 'Answer lista. El dispositivo receptor ahora debe leer este QR.',
    answerReadyMany: (parts: number) =>
      `Answer dividida en ${parts} partes. Lee todas en el dispositivo receptor.`,
    importOfferTitle: 'Leer la offer del receptor',
    importAnswerTitle: 'Leer la answer del emisor',
    importPlaceholder:
      'Pega aqui el texto bruto de la offer/answer o usa el lector QR de abajo.',
    importOfferButton: 'Importar offer',
    importAnswerButton: 'Importar answer',
    importByCamera: 'Leer offer/answer por QR',
    openOfferScanner: 'Abrir lector de offer',
    openAnswerScanner: 'Abrir lector de answer',
    connectionIdle: 'Todavia no hay una conexion activa.',
    connectionWaitingAnswer:
      'Offer creada. El otro dispositivo todavia debe responder con una answer.',
    connectionConnecting: 'Emparejamiento listo. Espera a que WebRTC abra el canal.',
    connectionReadyReceive:
      'Canal abierto. Este dispositivo ya puede recibir archivo o texto.',
    connectionReadySend:
      'Canal abierto. Este dispositivo ya puede enviar archivo o texto.',
    connectionClosed: 'Canal cerrado.',
    connectionFailed:
      'La conexion P2P fallo. Intenta regenerar la offer, volver a leer la answer o activar STUN.',
    importOfferOk: 'Offer importada. Se genero una answer para el otro dispositivo.',
    importAnswerOk: 'Answer aplicada. Espera a que se abra el canal.',
    invalidOffer: 'La offer indicada es invalida.',
    invalidAnswer: 'La answer indicada es invalida.',
    payloadTitle: 'Contenido para enviar',
    payloadModeFile: 'Archivo',
    payloadModeText: 'Texto grande',
    payloadTextLabel: 'Texto para transferir',
    payloadTextPlaceholder:
      'Pega aqui texto grande, logs, JSON o cualquier payload que no convenga pasar solo por QR.',
    payloadChooseFile: 'Seleccionar archivo',
    payloadNoFile: 'Ningun archivo seleccionado.',
    sendNow: 'Enviar ahora',
    sending: 'Enviando...',
    sendDone: 'Envio completado.',
    sendNeedsChannel: 'El canal de datos aun no esta abierto.',
    sendNeedsText: 'Escribe un texto antes de enviar.',
    sendNeedsFile: 'Selecciona un archivo antes de enviar.',
    sendPreparing: 'Preparando envio...',
    receiving: (fileName: string) => `Recibiendo ${fileName}...`,
    receiveDoneFile: (fileName: string) =>
      `${fileName} recibido. Se inicio la descarga en este dispositivo.`,
    receiveDoneText: 'Texto recibido. Ya puedes copiarlo o descargarlo.',
    receiveResultTitle: 'Contenido recibido en este dispositivo',
    receiveDownload: 'Descargar otra vez',
    receiveCopy: 'Copiar texto recibido',
    receiveEmpty:
      'Cuando el canal se abra y el envio termine, el archivo o texto recibido aparecera aqui.',
    resetSession: 'Reiniciar sesion',
    loadingOffer: 'Generando la offer y preparando los codigos QR...',
    loadingOfferImport: 'Leyendo la offer y generando la answer...',
    loadingAnswerImport: 'Aplicando la answer y esperando el canal...',
    loadingCamera: 'Abriendo la camara para leer el QR...',
    scannerTitle: 'Lector QR integrado',
    scannerIntro:
      'Usa la camara del navegador o sube una imagen del QR. En muchos moviles el selector de imagen tambien puede abrir la camara del sistema.',
    scannerForSimpleTitle: 'Leer QR de texto',
    scannerForOfferTitle: 'Leer QR de la offer',
    scannerForAnswerTitle: 'Leer QR de la answer',
    scannerSimpleHint: 'Apunta la camara al QR de texto del otro dispositivo.',
    scannerOfferHint: 'Apunta la camara al QR de la offer mostrado en el dispositivo receptor.',
    scannerAnswerHint: 'Apunta la camara al QR de la answer mostrado en el dispositivo que va a enviar.',
    scannerStart: 'Iniciar camara',
    scannerStop: 'Parar camara',
    scannerClose: 'Cerrar lector',
    scannerDevice: 'Camara',
    scannerImageLabel: 'Elegir imagen del QR',
    scannerReady: 'Lector QR listo.',
    scannerReading: 'Apunta la camara al QR.',
    scannerAwaitMore: (count: number, total: number) =>
      `Parte ${count} de ${total} leida. Continua con las restantes.`,
    scannerWrongSignal:
      'El QR leido no pertenece a este paso. Revisa si necesitas la offer o la answer.',
    scannerUnsupportedText:
      'La camara no esta disponible ahora mismo. Aun puedes subir una imagen del QR o usar la camara del movil.',
    scannerImageError: 'No fue posible leer esa imagen como QR.',
    scannerCameraError: 'No fue posible iniciar la camara para leer el QR.',
    scannerHashLoaded: (count: number, total: number) =>
      `Esta pagina se abrio con la parte ${count} de ${total}. Usa el lector interno para completar el conjunto.`,
    scannerHashTextDone: 'El contenido del QR se cargo automaticamente en esta pagina.',
    scannerHashOfferDone:
      'Offer recibida desde la URL. La answer se genero automaticamente en este dispositivo.',
    scannerHashAnswerDone:
      'Answer recibida desde la URL. Espera a que se abra el canal P2P.',
    localOnlyNote:
      'Procesamiento local en el navegador. En modo P2P, el payload principal viaja por el data channel despues del emparejamiento.',
    partLabel: (index: number, total: number) => `Parte ${index} de ${total}`,
    previous: 'Anterior',
    next: 'Siguiente',
    copied: 'Copiado.',
    copyError: 'No fue posible copiar ahora.',
  },
} satisfies Record<
  AppLocale,
  {
    simpleTab: string;
    p2pTab: string;
    simpleIntro: string;
    p2pIntro: string;
    simpleWriteTitle: string;
    simpleReadTitle: string;
    simpleInputLabel: string;
    simpleInputPlaceholder: string;
    simpleGenerate: string;
    simpleClear: string;
    simpleGeneratedTitle: string;
    simpleGeneratedEmpty: string;
    simpleReceivedTitle: string;
    simpleReceivedLabel: string;
    simpleReceivedPlaceholder: string;
    simpleCopyReceived: string;
    simpleOpenScanner: string;
    simpleCaptureImage: string;
    simpleCopyLink: string;
    simpleChars: string;
    simpleCompressed: string;
    simpleParts: string;
    simpleUseP2P: string;
    simpleGeneratedOne: string;
    simpleGeneratedMany: (parts: number) => string;
    simpleReceivedOk: string;
    simpleCameraPlainOk: string;
    simpleWrongPacket: string;
    p2pRoleTitle: string;
    p2pReceiveRole: string;
    p2pSendRole: string;
    p2pReceiveIntro: string;
    p2pSendIntro: string;
    receiveStep1Title: string;
    receiveStep1Description: string;
    receiveStep2Title: string;
    receiveStep2Description: string;
    receiveStep3Title: string;
    receiveStep3Description: string;
    sendStep1Title: string;
    sendStep1Description: string;
    sendStep2Title: string;
    sendStep2Description: string;
    sendStep3Title: string;
    sendStep3Description: string;
    sendStep4Title: string;
    sendStep4Description: string;
    privacyTitle: string;
    privacyHint: string;
    privacyStrict: string;
    stunToggle: string;
    generateOffer: string;
    regenerateOffer: string;
    offerReadyOne: string;
    offerReadyMany: (parts: number) => string;
    answerReadyOne: string;
    answerReadyMany: (parts: number) => string;
    importOfferTitle: string;
    importAnswerTitle: string;
    importPlaceholder: string;
    importOfferButton: string;
    importAnswerButton: string;
    importByCamera: string;
    openOfferScanner: string;
    openAnswerScanner: string;
    connectionIdle: string;
    connectionWaitingAnswer: string;
    connectionConnecting: string;
    connectionReadyReceive: string;
    connectionReadySend: string;
    connectionClosed: string;
    connectionFailed: string;
    importOfferOk: string;
    importAnswerOk: string;
    invalidOffer: string;
    invalidAnswer: string;
    payloadTitle: string;
    payloadModeFile: string;
    payloadModeText: string;
    payloadTextLabel: string;
    payloadTextPlaceholder: string;
    payloadChooseFile: string;
    payloadNoFile: string;
    sendNow: string;
    sending: string;
    sendDone: string;
    sendNeedsChannel: string;
    sendNeedsText: string;
    sendNeedsFile: string;
    sendPreparing: string;
    receiving: (fileName: string) => string;
    receiveDoneFile: (fileName: string) => string;
    receiveDoneText: string;
    receiveResultTitle: string;
    receiveDownload: string;
    receiveCopy: string;
    receiveEmpty: string;
    resetSession: string;
    loadingOffer: string;
    loadingOfferImport: string;
    loadingAnswerImport: string;
    loadingCamera: string;
    scannerTitle: string;
    scannerIntro: string;
    scannerForSimpleTitle: string;
    scannerForOfferTitle: string;
    scannerForAnswerTitle: string;
    scannerSimpleHint: string;
    scannerOfferHint: string;
    scannerAnswerHint: string;
    scannerStart: string;
    scannerStop: string;
    scannerClose: string;
    scannerDevice: string;
    scannerImageLabel: string;
    scannerReady: string;
    scannerReading: string;
    scannerAwaitMore: (count: number, total: number) => string;
    scannerWrongSignal: string;
    scannerUnsupportedText: string;
    scannerImageError: string;
    scannerCameraError: string;
    scannerHashLoaded: (count: number, total: number) => string;
    scannerHashTextDone: string;
    scannerHashOfferDone: string;
    scannerHashAnswerDone: string;
    localOnlyNote: string;
    partLabel: (index: number, total: number) => string;
    previous: string;
    next: string;
    copied: string;
    copyError: string;
  }
>;

function SectionCard({
  title,
  description,
  children,
}: Readonly<{
  title: string;
  description?: string;
  children: ReactNode;
}>) {
  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 md:p-5">
      <header className="space-y-1">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        {description ? <p className="text-sm text-slate-600">{description}</p> : null}
      </header>
      {children}
    </section>
  );
}

function StatusNotice({ notice }: Readonly<{ notice: Notice | null }>) {
  if (!notice) {
    return null;
  }

  const toneClasses: Record<NoticeTone, string> = {
    info: 'border-sky-200 bg-sky-50 text-sky-900',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    error: 'border-rose-200 bg-rose-50 text-rose-900',
  };

  return (
    <div className={cn('rounded-xl border px-3 py-2 text-sm', toneClasses[notice.tone])}>
      {notice.text}
    </div>
  );
}

function ProgressBar({ value }: Readonly<{ value: number }>) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div className="h-2 overflow-hidden rounded-full bg-slate-200">
      <div
        className="h-full rounded-full bg-brand-600 transition-[width]"
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}

function Spinner({ label }: Readonly<{ label: string }>) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-brand-600" />
      <span>{label}</span>
    </div>
  );
}

function QrPreview({
  emptyLabel,
  size = QR_PREVIEW_SIZE,
  value,
  zxing,
}: Readonly<{
  emptyLabel: string;
  size?: number;
  value?: string;
  zxing: ZxingModule | null;
}>) {
  const svgMountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = svgMountRef.current;

    if (!mount) {
      return;
    }

    mount.replaceChildren();

    if (!value || !zxing) {
      return;
    }

    try {
      const writer = new zxing.BrowserQRCodeSvgWriter();
      const svg = writer.write(value, size, size);

      svg.setAttribute('class', 'h-full w-full');
      mount.appendChild(svg);
    } catch {
      mount.replaceChildren();
    }
  }, [size, value, zxing]);

  const showPlaceholder = !value || !zxing;

  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-3">
      <div className="relative mx-auto min-h-[280px] max-w-[320px]">
        <div
          ref={svgMountRef}
          className="flex h-full min-h-[280px] w-full items-center justify-center"
        />
        {showPlaceholder ? (
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <p className="text-center text-sm text-slate-500">{emptyLabel}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

const readFileAsUint8Array = (file: File): Promise<Uint8Array> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(new Uint8Array(reader.result));
        return;
      }

      reject(new Error('Nao foi possivel ler o arquivo.'));
    };

    reader.onerror = () => reject(new Error('Nao foi possivel ler o arquivo.'));
    reader.readAsArrayBuffer(file);
  });

const buildRtcConfiguration = (useStun: boolean): RTCConfiguration => ({
  iceServers: useStun
    ? [
        {
          urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'],
        },
      ]
    : [],
});

const isMetaMessage = (value: unknown): value is IncomingTransferMetaMessage =>
  Boolean(
    value &&
      typeof value === 'object' &&
      'type' in value &&
      value.type === 'meta' &&
      'payloadType' in value &&
      'fileName' in value &&
      'mimeType' in value &&
      'size' in value,
  );

export function TransferTool({ locale = 'pt-br' }: TransferToolProps) {
  const ui = useMemo(() => uiByLocale[locale] ?? uiByLocale['pt-br'], [locale]);

  const [zxing, setZxing] = useState<ZxingModule | null>(null);
  const [toolMode, setToolMode] = useState<ToolMode>('simple');
  const [simpleInput, setSimpleInput] = useState('');
  const [simpleGenerated, setSimpleGenerated] = useState<GeneratedTransfer | null>(null);
  const [simplePartIndex, setSimplePartIndex] = useState(0);
  const [simpleReceivedText, setSimpleReceivedText] = useState('');
  const [simpleReceiveVersion, setSimpleReceiveVersion] = useState(0);
  const [simpleNotice, setSimpleNotice] = useState<Notice | null>(null);
  const [p2pRole, setP2pRole] = useState<P2PRole>('receive');
  const [useStun, setUseStun] = useState(true);
  const [signalGenerated, setSignalGenerated] = useState<GeneratedTransfer | null>(null);
  const [signalPartIndex, setSignalPartIndex] = useState(0);
  const [offerImportText, setOfferImportText] = useState('');
  const [answerImportText, setAnswerImportText] = useState('');
  const [connectionNotice, setConnectionNotice] = useState<Notice | null>({
    tone: 'info',
    text: ui.connectionIdle,
  });
  const [peerConnected, setPeerConnected] = useState(false);
  const [sendMode, setSendMode] = useState<SendPayloadMode>('file');
  const [sendText, setSendText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sendProgress, setSendProgress] = useState(0);
  const [sendBusy, setSendBusy] = useState(false);
  const [receiveProgress, setReceiveProgress] = useState(0);
  const [receivedTransfer, setReceivedTransfer] = useState<ReceivedTransfer | null>(null);
  const [p2pReceiveVersion, setP2pReceiveVersion] = useState(0);
  const [busyAction, setBusyAction] = useState<BusyAction>(null);
  const [scannerTarget, setScannerTarget] = useState<ScannerTarget>(null);
  const [scannerNotice, setScannerNotice] = useState<Notice | null>(null);
  const [cameraDevices, setCameraDevices] = useState<CameraOption[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState('');
  const [cameraActive, setCameraActive] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scannerControlsRef = useRef<IScannerControls | null>(null);
  const scanAssemblyRef = useRef<TransferAssemblyState | null>(null);
  const lastScanRef = useRef<{ value: string; at: number }>({ value: '', at: 0 });
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const incomingTransferRef = useRef<IncomingTransferState | null>(null);
  const uiRef = useRef(ui);
  const importOfferRef = useRef<(rawValue: string, fromHash?: boolean) => Promise<void>>(
    async () => undefined,
  );
  const importAnswerRef = useRef<(rawValue: string, fromHash?: boolean) => Promise<void>>(
    async () => undefined,
  );
  const simpleReceivedSectionRef = useRef<HTMLDivElement | null>(null);
  const p2pReceivedSectionRef = useRef<HTMLDivElement | null>(null);
  const peerSessionRef = useRef(0);

  const currentSimpleUrl =
    simpleGenerated?.urls[simplePartIndex] ?? simpleGenerated?.urls[0] ?? undefined;
  const currentSignalUrl =
    signalGenerated?.urls[signalPartIndex] ?? signalGenerated?.urls[0] ?? undefined;
  const hasSimpleReceived = simpleReceivedText.trim().length > 0;
  const hasP2PReceived = Boolean(receivedTransfer);
  const showTopNotice =
    toolMode === 'simple' ? !hasSimpleReceived : !hasP2PReceived;
  const isReceiveFlow = p2pRole === 'receive';
  const isSignalBusy =
    busyAction === 'offer' ||
    busyAction === 'import-offer' ||
    busyAction === 'import-answer';

  const getCurrentBaseUrl = () => {
    if (typeof window === 'undefined') {
      return '';
    }

    return `${window.location.origin}${window.location.pathname}`;
  };

  const nextPeerSession = (): number => {
    peerSessionRef.current += 1;
    return peerSessionRef.current;
  };

  const isCurrentPeerSession = (sessionId: number): boolean =>
    peerSessionRef.current === sessionId;

  const getScannerPresentation = (target: ScannerTarget) => {
    if (target === 'offer') {
      return {
        title: ui.scannerForOfferTitle,
        hint: ui.scannerOfferHint,
      };
    }

    if (target === 'answer') {
      return {
        title: ui.scannerForAnswerTitle,
        hint: ui.scannerAnswerHint,
      };
    }

    return {
      title: ui.scannerForSimpleTitle,
      hint: ui.scannerSimpleHint,
    };
  };

  const stopScanner = useCallback(() => {
    scannerControlsRef.current?.stop();
    scannerControlsRef.current = null;
    setCameraActive(false);
  }, []);

  const closeScanner = () => {
    stopScanner();
    setScannerTarget(null);
  };

  const openScanner = (target: ScannerTarget) => {
    if (!target) {
      closeScanner();
      return;
    }

    stopScanner();
    scanAssemblyRef.current = null;
    lastScanRef.current = { value: '', at: 0 };
    setScannerTarget(target);
    setScannerNotice({
      tone: 'info',
      text: getScannerPresentation(target).hint,
    });
  };

  const clearPeer = useCallback(() => {
    peerSessionRef.current += 1;

    if (dataChannelRef.current) {
      dataChannelRef.current.onopen = null;
      dataChannelRef.current.onclose = null;
      dataChannelRef.current.onerror = null;
      dataChannelRef.current.onmessage = null;
      dataChannelRef.current.close();
    }

    if (peerRef.current) {
      peerRef.current.onconnectionstatechange = null;
      peerRef.current.ondatachannel = null;
      peerRef.current.close();
    }

    dataChannelRef.current = null;
    peerRef.current = null;

    incomingTransferRef.current = null;
    setPeerConnected(false);
    setSendProgress(0);
    setReceiveProgress(0);
  }, []);

  const resetP2PSession = () => {
    closeScanner();
    clearPeer();
    setSignalGenerated(null);
    setSignalPartIndex(0);
    setOfferImportText('');
    setAnswerImportText('');
    setSelectedFile(null);
    setSendText('');
    setSendProgress(0);
    setSendBusy(false);
    setReceiveProgress(0);
    setReceivedTransfer(null);
    setConnectionNotice({ tone: 'info', text: ui.connectionIdle });
    setBusyAction(null);
    scanAssemblyRef.current = null;
  };

  const copyText = async (
    value: string,
    setter: Dispatch<SetStateAction<Notice | null>>,
  ) => {
    try {
      await navigator.clipboard.writeText(value);
      setter({ tone: 'success', text: ui.copied });
    } catch {
      setter({ tone: 'error', text: ui.copyError });
    }
  };

  const revealSimpleReceived = (
    text: string,
    noticeText: string,
  ) => {
    setSimpleReceivedText(text);
    setSimpleNotice({ tone: 'success', text: noticeText });
    setToolMode('simple');
    setSimpleReceiveVersion((current) => current + 1);
  };

  const finalizeReceivedTransfer = () => {
    const incoming = incomingTransferRef.current;

    if (!incoming) {
      return;
    }

    const merged = mergeUint8Chunks(incoming.chunks, incoming.meta.size);
    const blob = new Blob([merged], {
      type: incoming.meta.mimeType || 'application/octet-stream',
    });

    if (incoming.meta.payloadType === 'text') {
      const text = new TextDecoder().decode(merged);

      setReceivedTransfer({
        blob,
        fileName: incoming.meta.fileName,
        mimeType: incoming.meta.mimeType,
        payloadType: 'text',
        size: incoming.meta.size,
        text,
      });
      setConnectionNotice({ tone: 'success', text: ui.receiveDoneText });
    } else {
      setReceivedTransfer({
        blob,
        fileName: incoming.meta.fileName,
        mimeType: incoming.meta.mimeType,
        payloadType: 'file',
        size: incoming.meta.size,
      });
      downloadBlob(blob, incoming.meta.fileName);
      setConnectionNotice({
        tone: 'success',
        text: ui.receiveDoneFile(incoming.meta.fileName),
      });
    }

    setReceiveProgress(100);
    setP2pReceiveVersion((current) => current + 1);
    incomingTransferRef.current = null;
  };

  const handleIncomingData = async (data: string | Blob | ArrayBuffer) => {
    if (typeof data === 'string') {
      let parsed: unknown;

      try {
        parsed = JSON.parse(data);
      } catch {
        return;
      }

      if (isMetaMessage(parsed)) {
        incomingTransferRef.current = {
          meta: parsed,
          chunks: [],
          receivedBytes: 0,
        };
        setReceivedTransfer(null);
        setReceiveProgress(0);
        setConnectionNotice({
          tone: 'info',
          text: ui.receiving(parsed.fileName),
        });
        return;
      }

      if (
        parsed &&
        typeof parsed === 'object' &&
        'type' in parsed &&
        parsed.type === 'done'
      ) {
        finalizeReceivedTransfer();
      }

      return;
    }

    const incoming = incomingTransferRef.current;

    if (!incoming) {
      return;
    }

    const buffer = data instanceof Blob ? await data.arrayBuffer() : data;
    const chunk = new Uint8Array(buffer);

    incoming.chunks.push(chunk);
    incoming.receivedBytes += chunk.byteLength;

    setReceiveProgress(
      incoming.meta.size > 0
        ? Math.min(100, (incoming.receivedBytes / incoming.meta.size) * 100)
        : 0,
    );
  };

  const attachDataChannel = (
    channel: RTCDataChannel,
    role: P2PRole,
    peerSessionId: number,
  ) => {
    channel.binaryType = 'arraybuffer';
    channel.bufferedAmountLowThreshold = 256 * 1024;

    channel.onopen = () => {
      if (!isCurrentPeerSession(peerSessionId)) {
        return;
      }

      setPeerConnected(true);
      setConnectionNotice({
        tone: 'success',
        text: role === 'receive' ? ui.connectionReadyReceive : ui.connectionReadySend,
      });
    };

    channel.onclose = () => {
      if (!isCurrentPeerSession(peerSessionId)) {
        return;
      }

      setPeerConnected(false);
      setConnectionNotice({ tone: 'info', text: ui.connectionClosed });
    };

    channel.onerror = () => {
      if (!isCurrentPeerSession(peerSessionId)) {
        return;
      }

      setConnectionNotice({ tone: 'error', text: ui.connectionFailed });
    };

    channel.onmessage = (event) => {
      if (!isCurrentPeerSession(peerSessionId)) {
        return;
      }

      void handleIncomingData(event.data as string | Blob | ArrayBuffer);
    };

    dataChannelRef.current = channel;
  };

  const attachPeerEvents = (
    peerConnection: RTCPeerConnection,
    role: P2PRole,
    peerSessionId: number,
  ) => {
    peerConnection.onconnectionstatechange = () => {
      if (!isCurrentPeerSession(peerSessionId)) {
        return;
      }

      if (peerConnection.connectionState === 'connected') {
        setPeerConnected(true);
        setConnectionNotice({
          tone: 'success',
          text: role === 'receive' ? ui.connectionReadyReceive : ui.connectionReadySend,
        });
      }

      if (peerConnection.connectionState === 'connecting') {
        setConnectionNotice({ tone: 'info', text: ui.connectionConnecting });
      }

      if (
        peerConnection.connectionState === 'failed' ||
        peerConnection.connectionState === 'disconnected'
      ) {
        setPeerConnected(false);
        setConnectionNotice({ tone: 'error', text: ui.connectionFailed });
      }
    };
  };

  const buildSignalTransfer = (
    signalKind: TransferSignalKind,
    rawContent: string,
  ): GeneratedTransfer => {
    const generated = createTransferPackets({
      kind: 'signal',
      signalKind,
      rawContent,
      baseUrl: getCurrentBaseUrl(),
      maxChunkLength: SIGNAL_CHUNK_LENGTH,
    });

    return {
      packets: generated.packets,
      urls: generated.urls,
      compressedLength: generated.compressedPayload.length,
      rawLength: rawContent.length,
      sessionId: generated.sessionId,
    };
  };

  const createOffer = async () => {
    try {
      setBusyAction('offer');
      closeScanner();
      clearPeer();
      setSignalGenerated(null);
      setSignalPartIndex(0);
      setReceivedTransfer(null);
      setReceiveProgress(0);

      const peerSessionId = nextPeerSession();
      const peerConnection = new RTCPeerConnection(buildRtcConfiguration(useStun));
      peerRef.current = peerConnection;
      attachPeerEvents(peerConnection, 'receive', peerSessionId);

      const channel = peerConnection.createDataChannel('adtools-transfer', {
        ordered: true,
      });
      attachDataChannel(channel, 'receive', peerSessionId);

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      await waitForIceGatheringComplete(peerConnection);

      if (!peerConnection.localDescription) {
        throw new Error(ui.connectionFailed);
      }

      const generated = buildSignalTransfer(
        'offer',
        serializeSignalDescription(peerConnection.localDescription),
      );

      setSignalGenerated(generated);
      setSignalPartIndex(0);
      setConnectionNotice({
        tone: 'success',
        text:
          generated.packets.length === 1
            ? ui.offerReadyOne
            : ui.offerReadyMany(generated.packets.length),
      });
      setPeerConnected(false);
    } catch {
      setConnectionNotice({ tone: 'error', text: ui.connectionFailed });
    } finally {
      setBusyAction(null);
    }
  };

  const importOffer = async (rawValue: string, fromHash = false) => {
    try {
      setBusyAction('import-offer');
      const description = parseSignalDescription(rawValue);

      if (description.type !== 'offer') {
        throw new Error(ui.invalidOffer);
      }

      stopScanner();
      clearPeer();
      setP2pRole('send');
      setOfferImportText(rawValue);
      setSignalGenerated(null);
      setSignalPartIndex(0);
      setReceivedTransfer(null);
      setReceiveProgress(0);

      const peerSessionId = nextPeerSession();
      const peerConnection = new RTCPeerConnection(buildRtcConfiguration(useStun));
      peerRef.current = peerConnection;
      attachPeerEvents(peerConnection, 'send', peerSessionId);

      peerConnection.ondatachannel = (event) => {
        attachDataChannel(event.channel, 'send', peerSessionId);
      };

      await peerConnection.setRemoteDescription(description);
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      await waitForIceGatheringComplete(peerConnection);

      if (!peerConnection.localDescription) {
        throw new Error(ui.connectionFailed);
      }

      const generated = buildSignalTransfer(
        'answer',
        serializeSignalDescription(peerConnection.localDescription),
      );

      setSignalGenerated(generated);
      setSignalPartIndex(0);
      closeScanner();
      setConnectionNotice({
        tone: 'success',
        text: fromHash
          ? ui.scannerHashOfferDone
          : generated.packets.length === 1
            ? ui.answerReadyOne
            : ui.answerReadyMany(generated.packets.length),
      });
      setToolMode('p2p');
    } catch (error) {
      setConnectionNotice({
        tone: 'error',
        text: error instanceof Error ? error.message : ui.invalidOffer,
      });
    } finally {
      setBusyAction(null);
    }
  };

  const importAnswer = async (rawValue: string, fromHash = false) => {
    try {
      setBusyAction('import-answer');
      const description = parseSignalDescription(rawValue);

      if (description.type !== 'answer') {
        throw new Error(ui.invalidAnswer);
      }

      if (!peerRef.current) {
        throw new Error(ui.connectionFailed);
      }

      setAnswerImportText(rawValue);
      await peerRef.current.setRemoteDescription(description);
      closeScanner();
      setConnectionNotice({
        tone: 'success',
        text: fromHash ? ui.scannerHashAnswerDone : ui.importAnswerOk,
      });
      setToolMode('p2p');
    } catch (error) {
      setConnectionNotice({
        tone: 'error',
        text: error instanceof Error ? error.message : ui.invalidAnswer,
      });
    } finally {
      setBusyAction(null);
    }
  };

  uiRef.current = ui;
  importOfferRef.current = importOffer;
  importAnswerRef.current = importAnswer;

  const handleDecodedValue = async (value: string, target: ScannerTarget) => {
    const now = Date.now();

    if (lastScanRef.current.value === value && now - lastScanRef.current.at < 1500) {
      return false;
    }

    lastScanRef.current = { value, at: now };

    const parsed = parseTransferInput(value);

    if (parsed.kind === 'plain') {
      if (target !== 'simple') {
        setScannerNotice({ tone: 'error', text: ui.scannerWrongSignal });
        return false;
      }

      revealSimpleReceived(parsed.text, ui.simpleCameraPlainOk);
      return true;
    }

    const assembled = addPacketToAssembly(scanAssemblyRef.current, parsed.packet);
    scanAssemblyRef.current = assembled.state;

    if (!assembled.complete) {
      setScannerNotice({
        tone: 'info',
        text: ui.scannerAwaitMore(assembled.receivedParts, assembled.state.totalParts),
      });
      return false;
    }

    scanAssemblyRef.current = null;

    if (assembled.state.kind === 'text') {
      if (target !== 'simple') {
        setScannerNotice({ tone: 'error', text: ui.simpleWrongPacket });
        return false;
      }

      revealSimpleReceived(assembled.decoded, ui.simpleReceivedOk);
      return true;
    }

    if (assembled.state.signalKind === 'offer') {
      if (target !== 'offer') {
        setScannerNotice({ tone: 'error', text: ui.scannerWrongSignal });
        return false;
      }

      await importOffer(assembled.decoded);
      return true;
    }

    if (assembled.state.signalKind === 'answer') {
      if (target !== 'answer') {
        setScannerNotice({ tone: 'error', text: ui.scannerWrongSignal });
        return false;
      }

      await importAnswer(assembled.decoded);
      return true;
    }

    setScannerNotice({ tone: 'error', text: ui.scannerWrongSignal });
    return false;
  };

  const startCameraScan = async () => {
    if (!zxing || !videoRef.current) {
      setScannerNotice({ tone: 'error', text: ui.scannerCameraError });
      return;
    }

    try {
      setBusyAction('camera');
      stopScanner();

      const devices = await zxing.BrowserCodeReader.listVideoInputDevices();
      const normalizedDevices = devices.map((device, index) => ({
        deviceId: device.deviceId,
        label: device.label || `${ui.scannerDevice} ${index + 1}`,
      }));

      setCameraDevices(normalizedDevices);

      if (!selectedCameraId && normalizedDevices[0]?.deviceId) {
        setSelectedCameraId(normalizedDevices[0].deviceId);
      }

      const reader = new zxing.BrowserQRCodeReader(undefined, {
        delayBetweenScanAttempts: 250,
        delayBetweenScanSuccess: 900,
      });

      const controls = await reader.decodeFromVideoDevice(
        selectedCameraId || normalizedDevices[0]?.deviceId || undefined,
        videoRef.current,
        (result) => {
          if (!result || !scannerTarget) {
            return;
          }

          void handleDecodedValue(result.getText(), scannerTarget).then((done) => {
            if (done) {
              closeScanner();
            }
          });
        },
      );

      scannerControlsRef.current = controls;
      setCameraActive(true);
      setScannerNotice({ tone: 'info', text: ui.scannerReading });
    } catch {
      setScannerNotice({ tone: 'error', text: ui.scannerCameraError });
    } finally {
      setBusyAction(null);
    }
  };

  const handleScannerImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file || !zxing) {
      return;
    }

    try {
      const reader = new zxing.BrowserQRCodeReader();
      const objectUrl = URL.createObjectURL(file);

      try {
        const result = await reader.decodeFromImageUrl(objectUrl);

        if (scannerTarget) {
          const done = await handleDecodedValue(result.getText(), scannerTarget);

          if (done) {
            closeScanner();
          }
        }
      } finally {
        URL.revokeObjectURL(objectUrl);
      }
    } catch {
      setScannerNotice({ tone: 'error', text: ui.scannerImageError });
    } finally {
      event.target.value = '';
    }
  };

  const generateSimpleQr = () => {
    const trimmed = simpleInput.trim();

    if (!trimmed) {
      setSimpleNotice({ tone: 'error', text: ui.sendNeedsText });
      return;
    }

    const generated = createTransferPackets({
      kind: 'text',
      rawContent: trimmed,
      baseUrl: getCurrentBaseUrl(),
      maxChunkLength: SIMPLE_CHUNK_LENGTH,
    });

    setSimpleGenerated({
      packets: generated.packets,
      urls: generated.urls,
      compressedLength: generated.compressedPayload.length,
      rawLength: trimmed.length,
      sessionId: generated.sessionId,
    });
    setSimplePartIndex(0);
    setSimpleNotice({
      tone: 'success',
      text:
        generated.packets.length === 1
          ? ui.simpleGeneratedOne
          : ui.simpleGeneratedMany(generated.packets.length),
    });
  };

  const sendPayload = async () => {
    const channel = dataChannelRef.current;

    if (!channel || channel.readyState !== 'open') {
      setConnectionNotice({ tone: 'error', text: ui.sendNeedsChannel });
      return;
    }

    let bytes: Uint8Array;
    let fileName: string;
    let mimeType: string;
    let payloadType: TransferPayloadType;

    if (sendMode === 'text') {
      if (!sendText.trim()) {
        setConnectionNotice({ tone: 'error', text: ui.sendNeedsText });
        return;
      }

      bytes = new TextEncoder().encode(sendText);
      fileName = 'transfer-text.txt';
      mimeType = 'text/plain;charset=utf-8';
      payloadType = 'text';
    } else {
      if (!selectedFile) {
        setConnectionNotice({ tone: 'error', text: ui.sendNeedsFile });
        return;
      }

      bytes = await readFileAsUint8Array(selectedFile);
      fileName = selectedFile.name;
      mimeType = selectedFile.type || 'application/octet-stream';
      payloadType = 'file';
    }

    const chunks = buildUint8Chunks(bytes, DATA_CHANNEL_CHUNK_SIZE);

    try {
      setBusyAction('send');
      setSendBusy(true);
      setSendProgress(0);
      setConnectionNotice({ tone: 'info', text: ui.sendPreparing });

      channel.send(
        JSON.stringify({
          type: 'meta',
          payloadType,
          fileName,
          mimeType,
          size: bytes.byteLength,
          totalChunks: chunks.length,
        } satisfies IncomingTransferMetaMessage),
      );

      for (let index = 0; index < chunks.length; index += 1) {
        await waitForDataChannelDrain(channel);
        channel.send(chunks[index]);
        setSendProgress(((index + 1) / chunks.length) * 100);
      }

      channel.send(JSON.stringify({ type: 'done' }));
      setConnectionNotice({ tone: 'success', text: ui.sendDone });
    } catch {
      setConnectionNotice({ tone: 'error', text: ui.connectionFailed });
    } finally {
      setBusyAction(null);
      setSendBusy(false);
    }
  };

  const consumeHashPayload = useCallback(async () => {
    if (typeof window === 'undefined' || !window.location.hash) {
      return;
    }

    const currentUi = uiRef.current;

    const parsed = parseTransferInput(window.location.href);

    if (parsed.kind === 'plain') {
      return;
    }

    window.history.replaceState({}, '', window.location.pathname);

    const assembled = addPacketToAssembly(null, parsed.packet);

    if (!assembled.complete) {
      scanAssemblyRef.current = assembled.state;
      setScannerNotice({
        tone: 'info',
        text: currentUi.scannerHashLoaded(
          assembled.receivedParts,
          assembled.state.totalParts,
        ),
      });
      setToolMode(assembled.state.kind === 'text' ? 'simple' : 'p2p');
      if (assembled.state.signalKind === 'offer') {
        setP2pRole('send');
      }
      if (assembled.state.signalKind === 'answer') {
        setP2pRole('receive');
      }
      return;
    }

    if (assembled.state.kind === 'text') {
      revealSimpleReceived(assembled.decoded, currentUi.scannerHashTextDone);
      return;
    }

    if (assembled.state.signalKind === 'offer') {
      await importOfferRef.current(assembled.decoded, true);
      setToolMode('p2p');
      return;
    }

    if (assembled.state.signalKind === 'answer') {
      await importAnswerRef.current(assembled.decoded, true);
      setToolMode('p2p');
    }
  }, []);

  useEffect(() => {
    let active = true;

    void import('@zxing/browser')
      .then((module) => {
        if (active) {
          setZxing(module);
          setScannerNotice({ tone: 'info', text: ui.scannerReady });
        }
      })
      .catch(() => {
        if (active) {
          setScannerNotice({ tone: 'error', text: ui.scannerUnsupportedText });
        }
      });

    return () => {
      active = false;
    };
  }, [ui.scannerReady, ui.scannerUnsupportedText]);

  useEffect(() => {
    void consumeHashPayload();
  }, [consumeHashPayload]);

  useEffect(() => {
    if (simpleReceiveVersion === 0) {
      return;
    }

    simpleReceivedSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, [simpleReceiveVersion]);

  useEffect(() => {
    if (p2pReceiveVersion === 0) {
      return;
    }

    p2pReceivedSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, [p2pReceiveVersion]);

  useEffect(
    () => () => {
      stopScanner();
      clearPeer();
    },
    [clearPeer, stopScanner],
  );

  const renderScannerPanel = (target: ScannerTarget) => {
    if (scannerTarget !== target || !target) {
      return null;
    }

    const presentation = getScannerPresentation(target);

    return (
      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="space-y-1">
          <h4 className="text-base font-semibold text-slate-900">{presentation.title}</h4>
          <p className="text-sm text-slate-600">{presentation.hint}</p>
        </div>

        {busyAction === 'camera' ? <Spinner label={ui.loadingCamera} /> : null}
        <StatusNotice notice={scannerNotice} />

        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-black">
            <video ref={videoRef} className="aspect-video h-full w-full object-cover" />
          </div>
          <div className="space-y-3">
            {cameraDevices.length > 1 ? (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-800">
                  {ui.scannerDevice}
                </label>
                <Select
                  value={selectedCameraId}
                  onChange={(event) => setSelectedCameraId(event.target.value)}
                >
                  {cameraDevices.map((device) => (
                    <option key={device.deviceId} value={device.deviceId}>
                      {device.label}
                    </option>
                  ))}
                </Select>
              </div>
            ) : null}

            <Button onClick={() => void startCameraScan()} disabled={busyAction === 'camera'}>
              {busyAction === 'camera'
                ? ui.loadingCamera
                : cameraActive
                  ? ui.scannerReading
                  : ui.scannerStart}
            </Button>
            <Button variant="secondary" onClick={stopScanner}>
              {ui.scannerStop}
            </Button>
            <label className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
              {ui.scannerImageLabel}
              <input
                className="sr-only"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleScannerImage}
              />
            </label>
            <Button variant="ghost" onClick={closeScanner}>
              {ui.scannerClose}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderSignalQrBlock = () => {
    if (!signalGenerated) {
      return null;
    }

    return (
      <div className="space-y-4">
        <QrPreview
          emptyLabel={isReceiveFlow ? ui.connectionIdle : ui.importOfferTitle}
          value={currentSignalUrl}
          zxing={zxing}
        />
        {signalGenerated.packets.length > 1 ? (
          <div className="flex items-center justify-between gap-3">
            <Button
              variant="secondary"
              onClick={() =>
                setSignalPartIndex((current) =>
                  current === 0 ? signalGenerated.packets.length - 1 : current - 1,
                )
              }
            >
              {ui.previous}
            </Button>
            <span className="text-sm text-slate-600">
              {ui.partLabel(signalPartIndex + 1, signalGenerated.packets.length)}
            </span>
            <Button
              variant="secondary"
              onClick={() =>
                setSignalPartIndex((current) =>
                  current === signalGenerated.packets.length - 1 ? 0 : current + 1,
                )
              }
            >
              {ui.next}
            </Button>
          </div>
        ) : null}
        {currentSignalUrl ? (
          <Button
            variant="ghost"
            onClick={() => void copyText(currentSignalUrl, setConnectionNotice)}
          >
            {ui.simpleCopyLink}
          </Button>
        ) : null}
      </div>
    );
  };

  return (
    <Card className="space-y-6 overflow-hidden p-4 md:p-6">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setToolMode('simple')}
          className={cn(
            'rounded-full px-4 py-2 text-sm font-semibold transition',
            toolMode === 'simple'
              ? 'bg-brand-600 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
          )}
        >
          {ui.simpleTab}
        </button>
        <button
          type="button"
          onClick={() => setToolMode('p2p')}
          className={cn(
            'rounded-full px-4 py-2 text-sm font-semibold transition',
            toolMode === 'p2p'
              ? 'bg-brand-600 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
          )}
        >
          {ui.p2pTab}
        </button>
      </div>

      {showTopNotice ? (
        <StatusNotice notice={toolMode === 'simple' ? simpleNotice : connectionNotice} />
      ) : null}

      {toolMode === 'simple' ? (
        <div className="space-y-6">
          {hasSimpleReceived ? (
            <div ref={simpleReceivedSectionRef}>
              <SectionCard title={ui.simpleReceivedTitle}>
                <div className="space-y-4">
                  <StatusNotice notice={simpleNotice} />
                  <label className="text-sm font-medium text-slate-800">
                    {ui.simpleReceivedLabel}
                  </label>
                  <Textarea
                    rows={7}
                    value={simpleReceivedText}
                    onChange={(event) => setSimpleReceivedText(event.target.value)}
                    placeholder={ui.simpleReceivedPlaceholder}
                  />
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => void copyText(simpleReceivedText, setSimpleNotice)}
                      disabled={!simpleReceivedText.trim()}
                    >
                      {ui.simpleCopyReceived}
                    </Button>
                    <Button variant="secondary" onClick={() => openScanner('simple')}>
                      {ui.simpleOpenScanner}
                    </Button>
                    <label className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
                      {ui.simpleCaptureImage}
                      <input
                        className="sr-only"
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onClick={() => openScanner('simple')}
                        onChange={handleScannerImage}
                      />
                    </label>
                  </div>
                  {renderScannerPanel('simple')}
                </div>
              </SectionCard>
            </div>
          ) : null}

          <p className="text-sm leading-6 text-slate-600">{ui.simpleIntro}</p>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
            <SectionCard title={ui.simpleWriteTitle}>
              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-800">
                  {ui.simpleInputLabel}
                </label>
                <Textarea
                  rows={8}
                  value={simpleInput}
                  onChange={(event) => setSimpleInput(event.target.value)}
                  placeholder={ui.simpleInputPlaceholder}
                />
                <div className="flex flex-wrap gap-2">
                  <Button onClick={generateSimpleQr}>{ui.simpleGenerate}</Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSimpleInput('');
                      setSimpleGenerated(null);
                      setSimplePartIndex(0);
                    }}
                  >
                    {ui.simpleClear}
                  </Button>
                </div>
                {simpleGenerated ? (
                  <>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
                        <div className="text-xs uppercase tracking-wide text-slate-500">
                          {ui.simpleChars}
                        </div>
                        <div className="mt-1 text-lg font-semibold text-slate-900">
                          {simpleGenerated.rawLength}
                        </div>
                      </div>
                      <div className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
                        <div className="text-xs uppercase tracking-wide text-slate-500">
                          {ui.simpleCompressed}
                        </div>
                        <div className="mt-1 text-lg font-semibold text-slate-900">
                          {simpleGenerated.compressedLength}
                        </div>
                      </div>
                      <div className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
                        <div className="text-xs uppercase tracking-wide text-slate-500">
                          {ui.simpleParts}
                        </div>
                        <div className="mt-1 text-lg font-semibold text-slate-900">
                          {simpleGenerated.packets.length}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600">{ui.simpleUseP2P}</p>
                  </>
                ) : null}
              </div>
            </SectionCard>

            <SectionCard
              title={ui.simpleGeneratedTitle}
              description={
                simpleGenerated
                  ? ui.partLabel(simplePartIndex + 1, simpleGenerated.packets.length)
                  : undefined
              }
            >
              <div className="space-y-3">
                <QrPreview
                  emptyLabel={ui.simpleGeneratedEmpty}
                  value={currentSimpleUrl}
                  zxing={zxing}
                />
                {simpleGenerated && simpleGenerated.packets.length > 1 ? (
                  <div className="flex items-center justify-between gap-3">
                    <Button
                      variant="secondary"
                      onClick={() =>
                        setSimplePartIndex((current) =>
                          current === 0 ? simpleGenerated.packets.length - 1 : current - 1,
                        )
                      }
                    >
                      {ui.previous}
                    </Button>
                    <span className="text-sm text-slate-600">
                      {ui.partLabel(simplePartIndex + 1, simpleGenerated.packets.length)}
                    </span>
                    <Button
                      variant="secondary"
                      onClick={() =>
                        setSimplePartIndex((current) =>
                          current === simpleGenerated.packets.length - 1 ? 0 : current + 1,
                        )
                      }
                    >
                      {ui.next}
                    </Button>
                  </div>
                ) : null}
                {currentSimpleUrl ? (
                  <Button
                    variant="ghost"
                    onClick={() => void copyText(currentSimpleUrl, setSimpleNotice)}
                  >
                    {ui.simpleCopyLink}
                  </Button>
                ) : null}
              </div>
            </SectionCard>
          </div>

          {!hasSimpleReceived ? (
            <SectionCard title={ui.simpleReadTitle}>
              <div className="space-y-4">
                <label className="text-sm font-medium text-slate-800">
                  {ui.simpleReceivedLabel}
                </label>
                <Textarea
                  rows={7}
                  value={simpleReceivedText}
                  onChange={(event) => setSimpleReceivedText(event.target.value)}
                  placeholder={ui.simpleReceivedPlaceholder}
                />
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => void copyText(simpleReceivedText, setSimpleNotice)}
                    disabled={!simpleReceivedText.trim()}
                  >
                    {ui.simpleCopyReceived}
                  </Button>
                  <Button variant="secondary" onClick={() => openScanner('simple')}>
                    {ui.simpleOpenScanner}
                  </Button>
                  <label className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
                    {ui.simpleCaptureImage}
                    <input
                      className="sr-only"
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onClick={() => openScanner('simple')}
                      onChange={handleScannerImage}
                    />
                  </label>
                </div>
                {renderScannerPanel('simple')}
              </div>
            </SectionCard>
          ) : null}
        </div>
      ) : (
        <div className="space-y-6">
          {receivedTransfer ? (
            <div ref={p2pReceivedSectionRef}>
              <SectionCard title={ui.receiveResultTitle}>
                <div className="space-y-4">
                  <StatusNotice notice={connectionNotice} />
                  <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
                    <div>
                      <div className="font-semibold text-slate-900">
                        {receivedTransfer.fileName}
                      </div>
                      <p className="text-sm text-slate-600">
                        {formatBytes(receivedTransfer.size)}
                      </p>
                    </div>

                    {receivedTransfer.payloadType === 'text' ? (
                      <>
                        <Textarea
                          rows={8}
                          value={receivedTransfer.text ?? ''}
                          onChange={() => undefined}
                        />
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="secondary"
                            onClick={() =>
                              void copyText(receivedTransfer.text ?? '', setConnectionNotice)
                            }
                          >
                            {ui.receiveCopy}
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() =>
                              downloadBlob(
                                receivedTransfer.blob,
                                receivedTransfer.fileName,
                              )
                            }
                          >
                            {ui.receiveDownload}
                          </Button>
                        </div>
                      </>
                    ) : (
                      <Button
                        variant="secondary"
                        onClick={() =>
                          downloadBlob(receivedTransfer.blob, receivedTransfer.fileName)
                        }
                      >
                        {ui.receiveDownload}
                      </Button>
                    )}
                  </div>
                </div>
              </SectionCard>
            </div>
          ) : null}

          <p className="text-sm leading-6 text-slate-600">{ui.p2pIntro}</p>

          <SectionCard title={ui.p2pRoleTitle}>
            <div className="grid gap-3 md:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  resetP2PSession();
                  setP2pRole('receive');
                }}
                className={cn(
                  'rounded-2xl border p-4 text-left transition',
                  p2pRole === 'receive'
                    ? 'border-brand-500 bg-brand-50'
                    : 'border-slate-200 bg-white hover:border-slate-300',
                )}
              >
                <div className="font-semibold text-slate-900">{ui.p2pReceiveRole}</div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{ui.p2pReceiveIntro}</p>
              </button>
              <button
                type="button"
                onClick={() => {
                  resetP2PSession();
                  setP2pRole('send');
                }}
                className={cn(
                  'rounded-2xl border p-4 text-left transition',
                  p2pRole === 'send'
                    ? 'border-brand-500 bg-brand-50'
                    : 'border-slate-200 bg-white hover:border-slate-300',
                )}
              >
                <div className="font-semibold text-slate-900">{ui.p2pSendRole}</div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{ui.p2pSendIntro}</p>
              </button>
            </div>
          </SectionCard>

          <SectionCard title={ui.privacyTitle} description={ui.privacyHint}>
            <div className="space-y-4">
              <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={useStun}
                  onChange={(event) => setUseStun(event.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300"
                />
                <span>{ui.stunToggle}</span>
              </label>
              <p className="text-sm text-slate-600">{ui.privacyStrict}</p>
              <p className="rounded-xl bg-white p-3 text-sm text-slate-600 ring-1 ring-slate-200">
                {ui.localOnlyNote}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button variant="ghost" onClick={resetP2PSession}>
                  {ui.resetSession}
                </Button>
              </div>
            </div>
          </SectionCard>

          {isReceiveFlow ? (
            <div className="space-y-4">
              <SectionCard title={ui.receiveStep1Title} description={ui.receiveStep1Description}>
                <div className="space-y-4">
                  {busyAction === 'offer' ? <Spinner label={ui.loadingOffer} /> : null}
                  <div className="flex flex-wrap gap-2">
                    <Button onClick={() => void createOffer()} disabled={isSignalBusy}>
                      {signalGenerated ? ui.regenerateOffer : ui.generateOffer}
                    </Button>
                  </div>
                  {signalGenerated ? (
                    renderSignalQrBlock()
                  ) : (
                    <p className="rounded-xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600">
                      {ui.receiveStep1Description}
                    </p>
                  )}
                </div>
              </SectionCard>

              <SectionCard title={ui.receiveStep2Title} description={ui.receiveStep2Description}>
                <div className="space-y-4">
                  {busyAction === 'import-answer' ? (
                    <Spinner label={ui.loadingAnswerImport} />
                  ) : null}
                  <Textarea
                    rows={5}
                    value={answerImportText}
                    onChange={(event) => setAnswerImportText(event.target.value)}
                    placeholder={ui.importPlaceholder}
                  />
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => void importAnswer(answerImportText)}
                      disabled={!answerImportText.trim() || isSignalBusy}
                    >
                      {ui.importAnswerButton}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => openScanner('answer')}
                      disabled={busyAction === 'camera'}
                    >
                      {ui.openAnswerScanner}
                    </Button>
                    <label className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
                      {ui.scannerImageLabel}
                      <input
                        className="sr-only"
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onClick={() => openScanner('answer')}
                        onChange={handleScannerImage}
                      />
                    </label>
                  </div>
                  {renderScannerPanel('answer')}
                </div>
              </SectionCard>

              <SectionCard title={ui.receiveStep3Title} description={ui.receiveStep3Description}>
                <div className="space-y-4">
                  {!hasP2PReceived ? <StatusNotice notice={connectionNotice} /> : null}
                  {!receivedTransfer ? (
                    <p className="text-sm text-slate-600">{ui.receiveEmpty}</p>
                  ) : null}
                  {receiveProgress > 0 && receiveProgress < 100 ? (
                    <div className="space-y-2">
                      <ProgressBar value={receiveProgress} />
                      <p className="text-sm text-slate-600">{Math.round(receiveProgress)}%</p>
                    </div>
                  ) : null}
                </div>
              </SectionCard>
            </div>
          ) : (
            <div className="space-y-4">
              <SectionCard title={ui.sendStep1Title} description={ui.sendStep1Description}>
                <div className="space-y-4">
                  {busyAction === 'import-offer' ? (
                    <Spinner label={ui.loadingOfferImport} />
                  ) : null}
                  <Textarea
                    rows={5}
                    value={offerImportText}
                    onChange={(event) => setOfferImportText(event.target.value)}
                    placeholder={ui.importPlaceholder}
                  />
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => void importOffer(offerImportText)}
                      disabled={!offerImportText.trim() || isSignalBusy}
                    >
                      {ui.importOfferButton}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => openScanner('offer')}
                      disabled={busyAction === 'camera'}
                    >
                      {ui.openOfferScanner}
                    </Button>
                    <label className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
                      {ui.scannerImageLabel}
                      <input
                        className="sr-only"
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onClick={() => openScanner('offer')}
                        onChange={handleScannerImage}
                      />
                    </label>
                  </div>
                  {renderScannerPanel('offer')}
                </div>
              </SectionCard>

              <SectionCard title={ui.sendStep2Title} description={ui.sendStep2Description}>
                <div className="space-y-4">
                  {signalGenerated ? (
                    renderSignalQrBlock()
                  ) : (
                    <p className="rounded-xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600">
                      {ui.sendStep2Description}
                    </p>
                  )}
                </div>
              </SectionCard>

              <SectionCard title={ui.sendStep3Title} description={ui.sendStep3Description}>
                <div className="space-y-4">
                  {!hasP2PReceived ? <StatusNotice notice={connectionNotice} /> : null}
                </div>
              </SectionCard>

              <SectionCard title={ui.sendStep4Title} description={ui.sendStep4Description}>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setSendMode('file')}
                      className={cn(
                        'rounded-full px-4 py-2 text-sm font-semibold transition',
                        sendMode === 'file'
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
                      )}
                    >
                      {ui.payloadModeFile}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSendMode('text')}
                      className={cn(
                        'rounded-full px-4 py-2 text-sm font-semibold transition',
                        sendMode === 'text'
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
                      )}
                    >
                      {ui.payloadModeText}
                    </button>
                  </div>

                  {sendMode === 'text' ? (
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-slate-800">
                        {ui.payloadTextLabel}
                      </label>
                      <Textarea
                        rows={8}
                        value={sendText}
                        onChange={(event) => setSendText(event.target.value)}
                        placeholder={ui.payloadTextPlaceholder}
                      />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <label className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
                        {ui.payloadChooseFile}
                        <input
                          className="sr-only"
                          type="file"
                          onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
                        />
                      </label>
                      <p className="text-sm text-slate-600">
                        {selectedFile
                          ? `${selectedFile.name} • ${formatBytes(selectedFile.size)}`
                          : ui.payloadNoFile}
                      </p>
                    </div>
                  )}

                  {sendBusy || sendProgress > 0 ? (
                    <div className="space-y-2">
                      <ProgressBar value={sendProgress} />
                      <p className="text-sm text-slate-600">
                        {sendBusy ? ui.sending : ui.sendDone} {Math.round(sendProgress)}%
                      </p>
                    </div>
                  ) : null}

                  {!peerConnected ? (
                    <p className="text-sm text-slate-600">{ui.sendNeedsChannel}</p>
                  ) : null}

                  <Button onClick={() => void sendPayload()} disabled={!peerConnected || sendBusy}>
                    {sendBusy ? ui.sending : ui.sendNow}
                  </Button>
                </div>
              </SectionCard>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
