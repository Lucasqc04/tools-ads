'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  Activity, AlertTriangle, Camera, CameraOff, ChevronDown, Copy, Gauge,
  LockKeyhole, Maximize2, Mic, MicOff, MonitorUp, PhoneOff,
  ShieldCheck, Square, UsersRound, Volume2, VolumeX, Wifi, X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TOOL_ID, trackEvent } from '@/lib/analytics';
import { createRandomHex } from '@/lib/screenshare/auth';
import {
  getCaptureLevelConstraints, getInitialCaptureConstraints, getPeerBitrateCeiling,
  chooseAutomaticCaptureLevel, classifyConnection, computeConnectionMetrics,
  type AutomaticCaptureLevel, type ConnectionMetrics, type StatsBaseline,
} from '@/lib/screenshare/quality';
import {
  allocatePeerBitrate, estimateUploadTraffic, formatDataAmount, getConsumptionPercent,
  getConsumptionThresholds, getNominalVideoBitrate, getProjectedHourlyBytes,
  measureInboundMediaDelta, measureOutboundMediaDelta,
  type ByteCounterState,
} from '@/lib/screenshare/usage';
import {
  defaultShareScreenPreferences, getSessionLimitForPreset, getUploadBudgetForPreset,
  loadShareScreenPreferences, SHARE_SCREEN_PREFERENCES_KEY, type ShareScreenPreferences,
} from '@/lib/screenshare/preferences';
import { getBrowserNetworkInformation, classifyBrowserNetwork, type BrowserNetworkInfo } from '@/lib/screenshare/network-info';
import { qualityProfiles, type QualityMode, type ScreenShareSignal, type UnsequencedSignal } from '@/lib/screenshare/protocol';
import { getShareScreenUi } from '@/data/i18n/share-screen-ui';
import { getShareScreenCallCopy } from '@/data/i18n/share-screen-call';
import { createCallMediaTransceivers, getDisplayMediaOptions, getRemoteTrackKind, type CallMediaKind, type CallMediaTransceivers } from '@/lib/screenshare/media';
import type { AppLocale } from '@/lib/i18n/config';

type Props = { locale?: AppLocale; initialRoomId?: string };
type ApiError = Error & { code?: string };
type HostPeer = {
  id: string;
  displayName: string;
  cameraOn: boolean;
  microphoneOn: boolean;
  pc: RTCPeerConnection;
  senders: RTCRtpSender[];
  senderKinds: CallMediaKind[];
  transceivers: CallMediaTransceivers;
  negotiationId: string;
  candidates: RTCIceCandidateInit[];
  metrics: ConnectionMetrics | null;
  state: RTCPeerConnectionState;
  economy: boolean;
  lastAdaptation: number;
  restartCount: number;
  byteCounters: ByteCounterState;
  lastStatsAt: number;
  baseline: StatsBaseline | null;
  congestionSince: number | null;
  stableSince: number | null;
  appliedBitrate: number;
};
type HostRuntime = {
  roomId: string;
  token: string;
  stream: MediaStream;
  deviceStream: MediaStream | null;
  peers: Map<string, HostPeer>;
  cursor: number;
  startedAt: number;
  roomUrl: string;
  audioAvailable: boolean;
  screenSharerId: string | null;
  iceServers: RTCIceServer[];
  lastStatsAt: number;
  byteCounters: ByteCounterState;
  sessionBytes: number;
  lastUploadMbps: number | null;
  captureLevel: AutomaticCaptureLevel;
  captureLevelSince: number;
  lastTrackConstraintAt: number;
  everConnected: boolean;
  closed: boolean;
};
type ViewerMeshPeer = { id: string; pc: RTCPeerConnection; negotiationId: string; candidates: Array<{ negotiationId: string; candidate: RTCIceCandidateInit }>; transceivers: CallMediaTransceivers; senders: RTCRtpSender[]; senderKinds: CallMediaKind[]; bytes: ByteCounterState; lastStatsAt: number; state: RTCPeerConnectionState };
type ViewerRuntime = { roomId: string; peerId: string; token: string; pc: RTCPeerConnection; transceivers: CallMediaTransceivers; senders: RTCRtpSender[]; senderKinds: CallMediaKind[]; meshPeers: Map<string, ViewerMeshPeer>; localStream: MediaStream | null; screenStream: MediaStream | null; cursor: number; negotiationId: string | null; candidates: Array<{ negotiationId: string; candidate: RTCIceCandidateInit }>; bytes: ByteCounterState; sessionBytes: number; lastStatsAt: number; lastAdaptation: number; heartbeatTimer: number | null; pollTimer: number | null; rosterTimer: number | null; recoveryTimer: number | null; connected: boolean; completed: boolean; closed: boolean };
type PeerView = { id: string; displayName: string; state: RTCPeerConnectionState; metrics: ConnectionMetrics | null; cameraOn: boolean; microphoneOn: boolean };
type ParticipantView = { id: string; displayName: string; state: string; cameraOn: boolean; microphoneOn: boolean };
type RemoteMedia = { camera?: MediaStream; screen?: MediaStream; microphone?: MediaStream; screenAudio?: MediaStream };
type RoomView = { roomId: string; token: string; roomUrl: string; viewerLimit: number; startedAt: number; audioAvailable: boolean; hostName: string; access: 'public' | 'private'; screenSharerId: string | null };
type ViewerRoom = { state: string; viewerCount: number; viewerLimit: number; audioAvailable: boolean; qualityMode?: QualityMode; hostName?: string; access?: 'public' | 'private'; screenSharerId?: string | null; hostCameraOn?: boolean; hostMicrophoneOn?: boolean };
type ExtendedCopy = {
  warningTitle: string; warningBody: string; dataUseNotice: string; cellularRisk: string; unknownRisk: string;
  startEconomy: string; adjustSettings: string; continueChosen: string; rememberChoice: string;
  network: string; wifi: string; cellular: string; ethernet: string; unknown: string; browserNoNetworkInfo: string;
  saveData: string; limitedConnection: string; dataSaver: string; contentType: string; automatic: string; textWork: string; videoGames: string;
  uploadBudget: string; budgetEconomy: string; budgetModerate: string; budgetBalanced: string; budgetHigh: string; budgetCustom: string;
  viewerLimit: string; maximumViewers: string; sessionDataLimit: string; unlimited: string; custom: string; alertPolicy: string; warnOnly: string; reduceQuality: string; stopAtLimit: string;
  currentRate: string; dataSent: string; averageMinute: string; projectedHour: string; budgetTarget: string; estimated: string; measured: string; mediaOnly: string;
  qualityMode: string; contentHintNote: string; budgetWarning: string; viewerJoined: string; qualityReduced: string; limitReached: string; limitProgress: string;
  economyViewer: string; autoViewer: string; askEconomy: string; viewerData: string; networkType: string; usageEstimate: string; overhead: string;
  profileEconomy: string; profileBalanced: string; profileHigh: string; profileFluid: string; profileMaximum: string; budgetShort: string; budgetExceeded: string; limitedRisk: string; supportedCodecs: string;
  effectiveTypeNote: string; downlinkLabel: string; networkRttLabel: string;
  hotspotNotice: string;
};

function CallVideo({ stream, muted = true, fit = 'contain', className, onPlayBlocked }: {
  stream: MediaStream | null | undefined;
  muted?: boolean;
  fit?: 'contain' | 'cover';
  className?: string;
  onPlayBlocked?: () => void;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const onPlayBlockedRef = useRef(onPlayBlocked);
  onPlayBlockedRef.current = onPlayBlocked;
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    element.srcObject = stream ?? null;
    if (!stream) return;
    void element.play().catch(() => onPlayBlockedRef.current?.());
  }, [stream]);
  return <video ref={ref} autoPlay playsInline muted={muted} className={className ?? `h-full w-full ${fit === 'cover' ? 'object-cover' : 'object-contain'}`} />;
}

function CallAudio({ stream, muted, volume = 1, playSignal = 0, onBlocked }: { stream: MediaStream | null | undefined; muted: boolean; volume?: number; playSignal?: number; onBlocked?: () => void }) {
  const ref = useRef<HTMLAudioElement>(null);
  const onBlockedRef = useRef(onBlocked);
  onBlockedRef.current = onBlocked;
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    element.srcObject = stream ?? null;
    element.volume = volume;
    element.muted = muted;
    if (stream) void element.play().catch(() => onBlockedRef.current?.());
  }, [muted, playSignal, stream, volume]);
  return <audio ref={ref} autoPlay playsInline className="hidden" />;
}

const extra: Record<AppLocale, ExtendedCopy> = {
  'pt-br': {
    warningTitle: 'Sua transmissão pode consumir bastante internet',
    warningBody: 'A conexão P2P envia uma cópia do vídeo para cada espectador. Mais pessoas significam mais upload e mais dados móveis, se a rede usar uma franquia.',
    dataUseNotice: 'Estimativa de mídia por hora com base no perfil e no limite de espectadores. O overhead de rede aparece separado; o bitrate real varia.',
    cellularRisk: 'O navegador informa que a conexão é celular. Confira a franquia antes de transmitir.', unknownRisk: 'O navegador não informa o tipo da rede. Não é possível confirmar se ela usa dados móveis.',
    startEconomy: 'Iniciar no modo econômico', adjustSettings: 'Ajustar configurações', continueChosen: 'Continuar com esta qualidade', rememberChoice: 'Lembrar esta confirmação nesta configuração',
    network: 'Tipo de conexão', wifi: 'Wi-Fi detectado', cellular: 'Rede celular detectada', ethernet: 'Ethernet detectada', unknown: 'Tipo desconhecido', browserNoNetworkInfo: 'O navegador não disponibiliza o tipo de rede.',
    saveData: 'O navegador sugeriu economia de dados.', limitedConnection: 'Estou usando uma conexão com franquia limitada', dataSaver: 'Economizar dados automaticamente', contentType: 'Tipo de conteúdo', automatic: 'Automático', textWork: 'Texto e trabalho', videoGames: 'Vídeos e jogos',
    uploadBudget: 'Orçamento total de upload', budgetEconomy: 'Econômico · 3 Mbps', budgetModerate: 'Moderado · 10 Mbps', budgetBalanced: 'Equilibrado · 20 Mbps', budgetHigh: 'Alto desempenho · 50 Mbps', budgetCustom: 'Personalizado',
    viewerLimit: 'Limite de espectadores', maximumViewers: 'máx.', sessionDataLimit: 'Limite de dados da sessão', unlimited: 'Sem limite', custom: 'Personalizado', alertPolicy: 'Ao atingir o limite', warnOnly: 'Apenas avisar', reduceQuality: 'Reduzir qualidade automaticamente', stopAtLimit: 'Encerrar transmissão',
    currentRate: 'Upload atual', dataSent: 'Dados enviados nesta sessão', averageMinute: 'Média por minuto', projectedHour: 'Projeção por hora', budgetTarget: 'Meta de upload', estimated: 'estimado', measured: 'medido pelo WebRTC', mediaOnly: 'Conta somente bytes de mídia vistos pela aplicação, não o consumo total da operadora ou de outros aplicativos.',
    qualityMode: 'Modo de qualidade', contentHintNote: 'A preferência de conteúdo orienta o encoder; não identifica perfeitamente o que aparece na tela.', budgetWarning: 'O orçamento não comporta a qualidade mínima para todos os espectadores. Reduza o perfil ou o limite de espectadores.', viewerJoined: 'Novo espectador conectado', qualityReduced: 'A qualidade foi reduzida para respeitar sua proteção de dados.', limitReached: 'Limite de dados da sessão atingido.', limitProgress: 'Uso do limite',
    economyViewer: 'Preferir economia de dados', autoViewer: 'Qualidade automática', askEconomy: 'Pedir qualidade econômica', viewerData: 'Dados recebidos nesta sessão', networkType: 'Rede informada pelo navegador', usageEstimate: 'Estimativa de upload', overhead: 'overhead estimado',
    profileEconomy: 'Econômico · 480p / 30 FPS', profileBalanced: 'Equilibrado · 720p / 30 FPS', profileHigh: 'Alta qualidade · 1080p / 30 FPS', profileFluid: 'Fluidez · 720p / 60 FPS', profileMaximum: 'Máxima qualidade · 1080p / 60 FPS', budgetShort: 'O orçamento ficou abaixo do mínimo por espectador.', supportedCodecs: 'Codecs de vídeo aceitos pelo navegador',
    budgetExceeded: 'A qualidade escolhida excede o orçamento de upload. O bitrate individual foi reduzido para se ajustar à meta.', limitedRisk: 'Você informou que esta conexão pode usar uma franquia, inclusive por hotspot.', effectiveTypeNote: 'tipo efetivo; não confirma rede celular', downlinkLabel: 'download estimado pelo navegador', networkRttLabel: 'RTT estimado pelo navegador', hotspotNotice: 'Wi-Fi também pode ser um hotspot com franquia móvel.',
  },
  en: {
    warningTitle: 'Your broadcast may use a lot of data', warningBody: 'P2P sends a separate video copy to each viewer. More viewers mean more upload and more mobile data when the network uses a data plan.',
    dataUseNotice: 'Media-per-hour estimate based on the selected profile and viewer limit. Network overhead is shown separately; actual bitrate varies.', cellularRisk: 'Your browser reports a cellular connection. Check your data allowance before broadcasting.', unknownRisk: 'Your browser does not report the network type, so we cannot confirm whether it uses mobile data.',
    startEconomy: 'Start in data saver mode', adjustSettings: 'Adjust settings', continueChosen: 'Continue with selected quality', rememberChoice: 'Remember this confirmation for these settings',
    network: 'Connection type', wifi: 'Wi-Fi detected', cellular: 'Cellular network detected', ethernet: 'Ethernet detected', unknown: 'Unknown connection type', browserNoNetworkInfo: 'Your browser does not provide the network type.', saveData: 'Your browser suggested saving data.', limitedConnection: 'I am using a metered connection', dataSaver: 'Save data automatically', contentType: 'Content type', automatic: 'Automatic', textWork: 'Text and work', videoGames: 'Video and games',
    uploadBudget: 'Total upload budget', budgetEconomy: 'Economy · 3 Mbps', budgetModerate: 'Moderate · 10 Mbps', budgetBalanced: 'Balanced · 20 Mbps', budgetHigh: 'High performance · 50 Mbps', budgetCustom: 'Custom', viewerLimit: 'Viewer limit', maximumViewers: 'max', sessionDataLimit: 'Session data limit', unlimited: 'No limit', custom: 'Custom', alertPolicy: 'When the limit is reached', warnOnly: 'Warn only', reduceQuality: 'Reduce quality automatically', stopAtLimit: 'End broadcast',
    currentRate: 'Current upload', dataSent: 'Data sent this session', averageMinute: 'Average per minute', projectedHour: 'Projected per hour', budgetTarget: 'Upload target', estimated: 'estimated', measured: 'measured by WebRTC', mediaOnly: 'Counts only media bytes observed by this app, not your carrier total or other apps.', qualityMode: 'Quality mode', contentHintNote: 'Content preference guides the encoder; it does not perfectly detect screen content.', budgetWarning: 'The budget cannot support the minimum quality for every viewer. Lower the profile or viewer limit.', viewerJoined: 'New viewer connected', qualityReduced: 'Quality was reduced to respect your data protection settings.', limitReached: 'Session data limit reached.', limitProgress: 'Limit used', budgetExceeded: 'Selected quality exceeds the upload budget. Individual bitrate was reduced to fit the target.', limitedRisk: 'You reported that this connection may use a data allowance, including through a hotspot.',
    economyViewer: 'Prefer data saver', autoViewer: 'Automatic quality', askEconomy: 'Request economy quality', viewerData: 'Data received this session', networkType: 'Network reported by browser', usageEstimate: 'Upload estimate', overhead: 'estimated overhead', profileEconomy: 'Economy · 480p / 30 FPS', profileBalanced: 'Balanced · 720p / 30 FPS', profileHigh: 'High quality · 1080p / 30 FPS', profileFluid: 'Fluid · 720p / 60 FPS', profileMaximum: 'Maximum · 1080p / 60 FPS', budgetShort: 'The budget is below the minimum per viewer.', supportedCodecs: 'Video codecs supported by this browser', effectiveTypeNote: 'effective type; does not confirm cellular', downlinkLabel: 'browser downlink estimate', networkRttLabel: 'browser RTT estimate', hotspotNotice: 'Wi-Fi can also be a metered mobile hotspot.',
  },
  es: {
    warningTitle: 'La transmisión puede consumir muchos datos', warningBody: 'P2P envía una copia del vídeo a cada espectador. Más personas implican más subida y más datos móviles si la red tiene límite.',
    dataUseNotice: 'Estimación de medios por hora según el perfil y el límite de espectadores. El overhead se muestra por separado; el bitrate real varía.', cellularRisk: 'El navegador informa una conexión celular. Comprueba tu franquicia antes de transmitir.', unknownRisk: 'El navegador no informa el tipo de red, así que no podemos confirmar si usa datos móviles.',
    startEconomy: 'Iniciar en modo ahorro', adjustSettings: 'Ajustar configuración', continueChosen: 'Continuar con esta calidad', rememberChoice: 'Recordar esta confirmación para esta configuración',
    network: 'Tipo de conexión', wifi: 'Wi-Fi detectado', cellular: 'Red celular detectada', ethernet: 'Ethernet detectada', unknown: 'Tipo de conexión desconocido', browserNoNetworkInfo: 'El navegador no proporciona el tipo de red.', saveData: 'El navegador sugirió ahorrar datos.', limitedConnection: 'Estoy usando una conexión con límite de datos', dataSaver: 'Ahorrar datos automáticamente', contentType: 'Tipo de contenido', automatic: 'Automático', textWork: 'Texto y trabajo', videoGames: 'Vídeos y juegos',
    uploadBudget: 'Presupuesto total de subida', budgetEconomy: 'Económico · 3 Mbps', budgetModerate: 'Moderado · 10 Mbps', budgetBalanced: 'Equilibrado · 20 Mbps', budgetHigh: 'Alto rendimiento · 50 Mbps', budgetCustom: 'Personalizado', viewerLimit: 'Límite de espectadores', maximumViewers: 'máx.', sessionDataLimit: 'Límite de datos de sesión', unlimited: 'Sin límite', custom: 'Personalizado', alertPolicy: 'Al alcanzar el límite', warnOnly: 'Solo avisar', reduceQuality: 'Reducir calidad automáticamente', stopAtLimit: 'Finalizar transmisión',
    currentRate: 'Subida actual', dataSent: 'Datos enviados en esta sesión', averageMinute: 'Promedio por minuto', projectedHour: 'Proyección por hora', budgetTarget: 'Objetivo de subida', estimated: 'estimado', measured: 'medido por WebRTC', mediaOnly: 'Cuenta solo los bytes multimedia observados por la aplicación, no el total del operador ni otras aplicaciones.', qualityMode: 'Modo de calidad', contentHintNote: 'La preferencia orienta el encoder; no detecta perfectamente el contenido de pantalla.', budgetWarning: 'El presupuesto no permite la calidad mínima para todos. Reduce el perfil o el límite de espectadores.', viewerJoined: 'Nuevo espectador conectado', qualityReduced: 'La calidad se redujo para respetar la protección de datos.', limitReached: 'Se alcanzó el límite de datos de sesión.', limitProgress: 'Límite usado', budgetExceeded: 'La calidad elegida supera el presupuesto de subida. El bitrate individual se redujo para ajustarse al objetivo.', limitedRisk: 'Has indicado que esta conexión puede tener límite de datos, incluso mediante un hotspot.',
    economyViewer: 'Preferir ahorro de datos', autoViewer: 'Calidad automática', askEconomy: 'Solicitar calidad económica', viewerData: 'Datos recibidos en esta sesión', networkType: 'Red indicada por el navegador', usageEstimate: 'Estimación de subida', overhead: 'overhead estimado', profileEconomy: 'Económico · 480p / 30 FPS', profileBalanced: 'Equilibrado · 720p / 30 FPS', profileHigh: 'Alta calidad · 1080p / 30 FPS', profileFluid: 'Fluidez · 720p / 60 FPS', profileMaximum: 'Máxima calidad · 1080p / 60 FPS', budgetShort: 'El presupuesto está por debajo del mínimo por espectador.', supportedCodecs: 'Códecs de vídeo compatibles con el navegador', effectiveTypeNote: 'tipo efectivo; no confirma una red celular', downlinkLabel: 'descarga estimada por el navegador', networkRttLabel: 'RTT estimado por el navegador', hotspotNotice: 'La conexión Wi-Fi también puede ser un hotspot móvil con límite de datos.',
  },
  zh: {
    warningTitle: '直播可能消耗较多流量', warningBody: 'P2P 会为每位观众单独发送视频。观众越多，上传和移动数据消耗越大。', dataUseNotice: '根据所选画质和观众上限估算每小时媒体流量。网络开销单独显示，实际码率会变化。', cellularRisk: '浏览器报告当前为蜂窝网络，请先确认流量套餐。', unknownRisk: '浏览器未提供网络类型，无法确认是否正在使用移动数据。', startEconomy: '以省流模式开始', adjustSettings: '调整设置', continueChosen: '按当前画质继续', rememberChoice: '记住此设置下的确认', network: '连接类型', wifi: '检测到 Wi-Fi', cellular: '检测到蜂窝网络', ethernet: '检测到以太网', unknown: '未知连接类型', browserNoNetworkInfo: '浏览器未提供网络类型。', saveData: '浏览器建议节省流量。', limitedConnection: '我正在使用流量有限的连接', dataSaver: '自动节省流量', contentType: '内容类型', automatic: '自动', textWork: '文字与办公', videoGames: '视频与游戏', uploadBudget: '总上传预算', budgetEconomy: '省流 · 3 Mbps', budgetModerate: '适中 · 10 Mbps', budgetBalanced: '均衡 · 20 Mbps', budgetHigh: '高性能 · 50 Mbps', budgetCustom: '自定义', viewerLimit: '观众上限', maximumViewers: '最大', sessionDataLimit: '本次流量上限', unlimited: '不限', custom: '自定义', alertPolicy: '达到上限时', warnOnly: '仅提醒', reduceQuality: '自动降低画质', stopAtLimit: '结束直播', currentRate: '当前上传', dataSent: '本次已发送', averageMinute: '每分钟平均', projectedHour: '每小时预计', budgetTarget: '上传目标', estimated: '估算', measured: 'WebRTC 测量', mediaOnly: '只统计应用观察到的媒体字节，不包括运营商总流量或其他应用。', qualityMode: '画质模式', contentHintNote: '内容偏好会指导编码器，但无法准确识别所有屏幕内容。', budgetWarning: '预算不足以为所有观众维持最低画质，请降低画质或观众上限。', viewerJoined: '新观众已连接', qualityReduced: '已降低画质以遵循流量保护设置。', limitReached: '已达到本次流量上限。', limitProgress: '已使用上限', economyViewer: '优先节省流量', autoViewer: '自动画质', askEconomy: '请求省流画质', viewerData: '本次接收数据', networkType: '浏览器报告的网络', usageEstimate: '上传估算', overhead: '估算开销', profileEconomy: '省流 · 480p / 30 FPS', profileBalanced: '均衡 · 720p / 30 FPS', profileHigh: '高清 · 1080p / 30 FPS', profileFluid: '流畅 · 720p / 60 FPS', profileMaximum: '最高 · 1080p / 60 FPS', budgetShort: '预算低于每位观众的最低值。', supportedCodecs: '浏览器支持的视频编码', budgetExceeded: '所选画质超过上传预算，已降低每位观众的码率。', limitedRisk: '你已说明此连接可能使用有限流量，包括手机热点。', effectiveTypeNote: '有效类型；不能确认蜂窝网络', downlinkLabel: '浏览器估算下载速率', networkRttLabel: '浏览器估算 RTT', hotspotNotice: 'Wi-Fi 也可能是使用移动流量套餐的手机热点。',
  },
};

const budgetEstimateNotice: Record<AppLocale, string> = {
  'pt-br': 'A estimativa excede o orçamento escolhido. O controlador tentará reduzir os bitrates por espectador dentro das limitações do navegador.',
  en: 'The estimate exceeds the selected budget. The controller will try to lower per-viewer bitrates within browser limits.',
  es: 'La estimación supera el presupuesto elegido. El controlador intentará reducir los bitrates por espectador dentro de los límites del navegador.',
  zh: '估算值超过所选预算。控制器会在浏览器能力范围内尝试降低每位观众的码率。',
};

const audioEstimateNotice: Record<AppLocale, string> = {
  'pt-br': 'A estimativa inicial não inclui áudio opcional. Se o navegador capturar áudio, ela passa a incluir até 128 kbps por espectador.',
  en: 'The initial estimate excludes optional audio. If the browser captures audio, it includes up to 128 kbps per viewer.',
  es: 'La estimación inicial no incluye audio opcional. Si el navegador captura audio, suma hasta 128 kbps por espectador.',
  zh: '初始估算不含可选音频。如果浏览器捕获音频，估算会为每位观众增加最高 128 kbps。',
};

const api = async <T,>(url: string, init?: RequestInit): Promise<T> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);
  let response: Response;
  try {
    response = await fetch(url, { cache: 'no-store', ...init, signal: init?.signal ?? controller.signal });
  } catch {
    const error = new Error('network_error') as ApiError;
    error.code = 'network_error';
    throw error;
  } finally {
    clearTimeout(timeout);
  }
  const payload = await response.json().catch(() => ({})) as { error?: string } & T;
  if (!response.ok) {
    const error = new Error(payload.error ?? 'request_failed') as ApiError;
    error.code = payload.error;
    throw error;
  }
  return payload;
};

const formatMbps = (bps: number | null | undefined) => bps == null || !Number.isFinite(bps) ? '—' : `${(bps / 1_000_000).toFixed(1)} Mbps`;
const formatMetric = (value: number | null | undefined, suffix = '') => value == null || !Number.isFinite(value) ? '—' : `${value.toFixed(value >= 100 ? 0 : 1)}${suffix}`;
const formatDuration = (startedAt: number, now: number) => {
  const seconds = Math.max(0, Math.floor((now - startedAt) / 1_000));
  return [Math.floor(seconds / 3600), Math.floor((seconds % 3600) / 60), seconds % 60].map((value) => String(value).padStart(2, '0')).join(':');
};
const supportedVideoCodecs = () => {
  if (typeof RTCRtpSender === 'undefined' || !RTCRtpSender.getCapabilities) return [];
  return Array.from(new Set(RTCRtpSender.getCapabilities('video')?.codecs.map((codec) => codec.mimeType.split('/')[1]).filter(Boolean) ?? []));
};
const serializeCandidate = (candidate: RTCIceCandidate): NonNullable<Extract<UnsequencedSignal, { type: 'candidate' }>['candidate']> => ({
  candidate: candidate.candidate,
  sdpMid: candidate.sdpMid,
  sdpMLineIndex: candidate.sdpMLineIndex,
  usernameFragment: candidate.usernameFragment,
});
const humanError = (error: unknown, ui: ReturnType<typeof getShareScreenUi>, x: ExtendedCopy) => {
  if (!(error instanceof Error)) return ui.genericError;
  if (error.name === 'NotAllowedError' || error.name === 'AbortError') return ui.captureCanceled;
  if (error.name === 'NotFoundError' || error.name === 'NotSupportedError') return ui.captureUnsupported;
  const code = (error as ApiError).code;
  if (code === 'redis_unavailable' || code === 'service_unavailable' || code === 'rate_limited') return ui.redisUnavailable;
  if (code === 'room_full') return ui.roomFull;
  if (code === 'host_recovering') return ui.hostRecovering;
  if (code === 'room_ended') return ui.roomEnded;
  if (code === 'network_error') return ui.unableToConnect;
  return x.unknownRisk && code === 'not_found' ? ui.roomExpired : ui.genericError;
};
const statusCopy = (state: string, ui: ReturnType<typeof getShareScreenUi>) => {
  if (state === 'expired') return ui.roomExpired;
  if (state === 'closed') return ui.roomEnded;
  if (state === 'full') return ui.roomFull;
  if (state === 'recovering') return ui.hostRecovering;
  return '';
};
const getBrowserNetwork = (): BrowserNetworkInfo => classifyBrowserNetwork(getBrowserNetworkInformation());
const getConfirmationKey = (preferences: ShareScreenPreferences, networkType: string) => JSON.stringify({
  qualityMode: preferences.qualityMode,
  dataSaver: preferences.dataSaver,
  viewers: preferences.viewerLimit,
  budget: preferences.uploadBudgetMbps,
  sessionLimit: preferences.sessionLimitBytes,
  alertPolicy: preferences.alertPolicy,
  contentPreference: preferences.contentPreference,
  limited: preferences.limitedConnection,
  networkType,
});

export function ShareScreenTool({ locale = 'pt-br', initialRoomId }: Props) {
  const ui = getShareScreenUi(locale);
  const callCopy = getShareScreenCallCopy(locale);
  const x = extra[locale];
  const hostVideoRef = useRef<HTMLVideoElement>(null);
  const localMediaRef = useRef<MediaStream | null>(null);
  const hostRef = useRef<HostRuntime | null>(null);
  const viewerRef = useRef<ViewerRuntime | null>(null);
  const preferencesRef = useRef<ShareScreenPreferences>(defaultShareScreenPreferences);
  const toastTimerRef = useRef<number | null>(null);
  const alertedThresholds = useRef<Set<number>>(new Set());
  const lastBudgetNoticeRef = useRef<number>(0);
  const baselineRef = useRef<StatsBaseline | null>(null);
  const [preferences, setPreferences] = useState<ShareScreenPreferences>(defaultShareScreenPreferences);
  const [network, setNetwork] = useState<BrowserNetworkInfo>({ type: 'unknown', typeWasReported: false, effectiveType: null, saveData: null, downlinkMbps: null, rttMs: null, available: false });
  const [phase, setPhase] = useState<'idle' | 'confirm' | 'starting' | 'active' | 'waiting' | 'connecting' | 'watching' | 'error' | 'ended'>('idle');
  const [room, setRoom] = useState<RoomView | null>(null);
  const [roomStatus, setRoomStatus] = useState<ViewerRoom | null>(null);
  const [errorText, setErrorText] = useState('');
  const [toast, setToast] = useState('');
  const [peers, setPeers] = useState<PeerView[]>([]);
  const [pendingPeers, setPendingPeers] = useState<Array<{ id: string; displayName: string }>>([]);
  const [participants, setParticipants] = useState<ParticipantView[]>([]);
  const [remoteMedia, setRemoteMedia] = useState<Record<string, RemoteMedia>>({});
  const [participantName, setParticipantName] = useState('');
  const [roomAccess, setRoomAccess] = useState<'public' | 'private'>('public');
  const [cameraOn, setCameraOn] = useState(false);
  const [microphoneOn, setMicrophoneOn] = useState(false);
  const [speakerMuted, setSpeakerMuted] = useState(false);
  const [screenSharerId, setScreenSharerId] = useState<string | null>(null);
  const [hostCallPanel, setHostCallPanel] = useState<'participants' | 'settings' | 'stats' | null>(null);
  const [viewerPeerId, setViewerPeerId] = useState('');
  const [admissionState, setAdmissionState] = useState<'pending' | 'approved' | 'denied' | null>(null);
  const [viewerMetrics, setViewerMetrics] = useState<ConnectionMetrics | null>(null);
  const [hostMetrics, setHostMetrics] = useState<ConnectionMetrics | null>(null);
  const [hostBytes, setHostBytes] = useState(0);
  const [viewerBytes, setViewerBytes] = useState(0);
  const [hostDataMeasured, setHostDataMeasured] = useState(false);
  const [viewerDataMeasured, setViewerDataMeasured] = useState(false);
  const [currentUploadBps, setCurrentUploadBps] = useState<number | null>(null);
  const [clock, setClock] = useState(Date.now());
  const [diagnosticsOpen, setDiagnosticsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [rememberConfirmation, setRememberConfirmation] = useState(false);
  const [viewerEconomy, setViewerEconomy] = useState(false);
  const [capturedAudio, setCapturedAudio] = useState(false);
  const [budgetShortfall, setBudgetShortfall] = useState(false);
  const [budgetExceeded, setBudgetExceeded] = useState(false);
  const [hostReconnectText, setHostReconnectText] = useState('');
  const [viewerLimitFromConfig, setViewerLimitFromConfig] = useState(5);
  const [codecs, setCodecs] = useState<string[]>([]);
  const [callPlayBlocked, setCallPlayBlocked] = useState(false);
  const [speakerVolume, setSpeakerVolume] = useState(1);
  const [playAudioSignal, setPlayAudioSignal] = useState(0);
  const [fullscreenActive, setFullscreenActive] = useState(false);
  const joinAbortRef = useRef(false);
  const cameraOnRef = useRef(cameraOn);
  const microphoneOnRef = useRef(microphoneOn);

  preferencesRef.current = preferences;
  cameraOnRef.current = cameraOn;
  microphoneOnRef.current = microphoneOn;

  useEffect(() => {
    const loaded = loadShareScreenPreferences(localStorage.getItem(SHARE_SCREEN_PREFERENCES_KEY));
    const info = getBrowserNetwork();
    if (info.saveData && !loaded.dataSaver) loaded.dataSaver = true;
    setPreferences(loaded);
    setNetwork(info);
    try { setParticipantName(localStorage.getItem('adtools.share-screen.display-name.v1') ?? ''); } catch { /* storage can be disabled */ }
    void api<{ viewerLimit: number }>('/api/screenshare/config').then(({ viewerLimit }) => {
      setViewerLimitFromConfig(viewerLimit);
      setPreferences((current) => current.viewerLimit > viewerLimit ? { ...current, viewerLimit } : current);
    }).catch(() => undefined);
    setCodecs(supportedVideoCodecs());
    const connection = getBrowserNetworkInformation();
    const onNetworkChange = () => {
      const next = getBrowserNetwork();
      setNetwork(next);
      if (next.saveData) setPreferences((current) => ({ ...current, dataSaver: true }));
    };
    connection?.addEventListener?.('change', onNetworkChange);
    return () => connection?.removeEventListener?.('change', onNetworkChange);
  }, []);

  useEffect(() => {
    try {
      const name = participantName.trim().slice(0, 32);
      if (name) localStorage.setItem('adtools.share-screen.display-name.v1', name);
    } catch { /* storage can be disabled */ }
  }, [participantName]);

  useEffect(() => {
    try { localStorage.setItem(SHARE_SCREEN_PREFERENCES_KEY, JSON.stringify(preferences)); } catch { /* storage can be disabled */ }
  }, [preferences]);

  useEffect(() => {
    const tick = window.setInterval(() => setClock(Date.now()), 1_000);
    return () => window.clearInterval(tick);
  }, []);

  useEffect(() => {
    const update = () => setFullscreenActive(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', update);
    return () => document.removeEventListener('fullscreenchange', update);
  }, []);

  useEffect(() => {
    if (!hostRef.current || !hostVideoRef.current) return;
    hostVideoRef.current.srcObject = hostRef.current.stream;
    void hostVideoRef.current.play().catch(() => undefined);
  }, [room?.roomId, phase]);

  const setPreference = useCallback(<K extends keyof ShareScreenPreferences>(key: K, value: ShareScreenPreferences[K]) => {
    setPreferences((current) => ({ ...current, [key]: value }));
  }, []);

  const notify = useCallback((message: string) => {
    setToast(message);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToast(''), 5_000);
  }, []);

  const toggleLocalDevice = useCallback(async (kind: 'camera' | 'microphone') => {
    const currentlyOn = kind === 'camera' ? cameraOn : microphoneOn;
    const mediaKind: CallMediaKind = kind === 'camera' ? 'camera' : 'microphone';
    let nextTrack: MediaStreamTrack | null = null;
    const existingStream = localMediaRef.current;
    if (currentlyOn) {
      nextTrack = null;
    } else {
      const currentTrack = kind === 'camera' ? existingStream?.getVideoTracks()[0] : existingStream?.getAudioTracks()[0];
      if (currentTrack?.readyState === 'live') nextTrack = currentTrack;
      else {
        try {
          const acquired = await navigator.mediaDevices.getUserMedia({ audio: kind === 'microphone', video: kind === 'camera' });
          const oldTracks = existingStream?.getTracks().filter((track) => track.kind !== (kind === 'camera' ? 'video' : 'audio')) ?? [];
          const newTracks = acquired.getTracks();
          localMediaRef.current = new MediaStream([...oldTracks, ...newTracks]);
          for (const oldTrack of existingStream?.getTracks() ?? []) if (!oldTracks.includes(oldTrack)) oldTrack.stop();
          nextTrack = kind === 'camera' ? acquired.getVideoTracks()[0] ?? null : acquired.getAudioTracks()[0] ?? null;
        } catch {
          setErrorText(callCopy.permissionError);
          if (phase === 'active' || phase === 'watching' || phase === 'connecting') notify(callCopy.permissionError);
          return;
        }
      }
    }

    const setForSenders = async (senders: RTCRtpSender[], kinds: CallMediaKind[]) => {
      await Promise.all(senders.map((sender, index) => kinds[index] === mediaKind ? sender.replaceTrack(nextTrack).catch(() => undefined) : Promise.resolve()));
    };
    const host = hostRef.current;
    if (host) {
      host.deviceStream = localMediaRef.current;
      await Promise.all(Array.from(host.peers.values(), (peer) => setForSenders(peer.senders, peer.senderKinds)));
    }
    const viewer = viewerRef.current;
    if (viewer) {
      viewer.localStream = localMediaRef.current;
      await setForSenders(viewer.senders, viewer.senderKinds);
      await Promise.all(Array.from(viewer.meshPeers.values(), (peer) => setForSenders(peer.senders, peer.senderKinds)));
    }
    if (currentlyOn) {
      const oldTrack = kind === 'camera' ? localMediaRef.current?.getVideoTracks()[0] : localMediaRef.current?.getAudioTracks()[0];
      if (oldTrack) {
        const remaining = localMediaRef.current?.getTracks().filter((track) => track !== oldTrack) ?? [];
        oldTrack.stop();
        localMediaRef.current = remaining.length ? new MediaStream(remaining) : null;
      }
      if (kind === 'camera') setCameraOn(false);
      else setMicrophoneOn(false);
    } else {
      if (kind === 'camera') setCameraOn(Boolean(nextTrack));
      else setMicrophoneOn(Boolean(nextTrack));
    }
    if (hostRef.current) hostRef.current.deviceStream = localMediaRef.current;
    if (viewerRef.current) viewerRef.current.localStream = localMediaRef.current;
    const nextCameraOn = kind === 'camera' ? !currentlyOn && Boolean(nextTrack) : cameraOn;
    const nextMicrophoneOn = kind === 'microphone' ? !currentlyOn && Boolean(nextTrack) : microphoneOn;
    if (hostRef.current) void api(`/api/screenshare/rooms/${hostRef.current.roomId}/heartbeat`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Screenshare-Host-Token': hostRef.current.token },
      body: JSON.stringify({ role: 'host', audioAvailable: hostRef.current.audioAvailable, qualityMode: preferencesRef.current.dataSaver ? 'economy' : preferencesRef.current.qualityMode, cameraOn: nextCameraOn, microphoneOn: nextMicrophoneOn }),
    }).catch(() => undefined);
    if (viewerRef.current) void api(`/api/screenshare/rooms/${viewerRef.current.roomId}/heartbeat`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Screenshare-Viewer-Token': viewerRef.current.token },
      body: JSON.stringify({ role: 'viewer', peerId: viewerRef.current.peerId, state: viewerRef.current.pc.connectionState === 'connected' ? 'connected' : 'connecting', cameraOn: nextCameraOn, microphoneOn: nextMicrophoneOn }),
    }).catch(() => undefined);
  }, [cameraOn, callCopy.permissionError, microphoneOn, notify, phase]);

  const attachRemoteTrack = useCallback((peerId: string, transceivers: CallMediaTransceivers, event: RTCTrackEvent) => {
    const kind = getRemoteTrackKind(transceivers, event.transceiver);
    if (!kind) return;
    const stream = new MediaStream([event.track]);
    setRemoteMedia((current) => ({ ...current, [peerId]: { ...current[peerId], [kind]: stream } }));
  }, []);

  const removeRemoteParticipant = useCallback((peerId: string) => {
    setRemoteMedia((current) => {
      const next = { ...current };
      delete next[peerId];
      return next;
    });
  }, []);

  const changeViewerLimit = useCallback(async (viewerLimit: number) => {
    const runtime = hostRef.current;
    if (!runtime) {
      setPreference('viewerLimit', viewerLimit);
      return;
    }
    try {
      const result = await api<{ viewerLimit: number }>(`/api/screenshare/rooms/${runtime.roomId}/limits`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Screenshare-Host-Token': runtime.token },
        body: JSON.stringify({ viewerLimit }),
      });
      setPreference('viewerLimit', result.viewerLimit);
      setRoom((current) => current ? { ...current, viewerLimit: result.viewerLimit } : current);
    } catch (error) {
      notify(humanError(error, ui, x));
    }
  }, [notify, setPreference, ui, x]);

  const setContentHint = useCallback((stream: MediaStream, content: ShareScreenPreferences['contentPreference']) => {
    const track = stream.getVideoTracks()[0] as MediaStreamTrack & { contentHint?: string } | undefined;
    if (!track || !('contentHint' in track)) return;
    try { track.contentHint = content === 'text' ? 'detail' : content === 'motion' ? 'motion' : ''; } catch { /* optional browser API */ }
  }, []);

  const roomEstimate = useMemo(() => {
    const screenBitrate = preferences.dataSaver ? qualityProfiles.economy.maxBitrate : getNominalVideoBitrate(preferences.qualityMode);
    const cameraBitrate = cameraOn ? 500_000 : 0;
    const audioBitrate = (microphoneOn ? 96_000 : 0) + 64_000;
    return estimateUploadTraffic(screenBitrate + cameraBitrate, preferences.viewerLimit, undefined, audioBitrate);
  }, [cameraOn, microphoneOn, preferences.dataSaver, preferences.qualityMode, preferences.viewerLimit]);

  const connectionLabel = useMemo(() => {
    if (!network.available) return `${x.unknown} · ${x.browserNoNetworkInfo}`;
    const type = !network.typeWasReported ? x.unknown : network.type === 'wifi' ? x.wifi : network.type === 'cellular' ? x.cellular : network.type === 'ethernet' ? x.ethernet : x.unknown;
    const hints = [
      !network.typeWasReported ? x.browserNoNetworkInfo : null,
      network.effectiveType ? `${x.effectiveTypeNote}: ${network.effectiveType}` : null,
      network.downlinkMbps !== null ? `${x.downlinkLabel}: ${network.downlinkMbps} Mbps` : null,
      network.rttMs !== null ? `${x.networkRttLabel}: ${network.rttMs} ms` : null,
    ].filter(Boolean);
    return hints.length ? `${type} · ${hints.join(' · ')}` : type;
  }, [network, x]);
  const risk = network.type === 'cellular' || preferences.limitedConnection || network.saveData === true || network.type === 'unknown';
  const riskMessage = network.type === 'cellular' ? x.cellularRisk : preferences.limitedConnection ? x.limitedRisk : network.saveData ? x.saveData : x.unknownRisk;

  const sendHostSignal = useCallback(async (runtime: HostRuntime, peerId: string, signal: UnsequencedSignal) => {
    await api(`/api/screenshare/rooms/${runtime.roomId}/signals`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Screenshare-Host-Token': runtime.token },
      body: JSON.stringify({ role: 'host', toPeerId: peerId, signal }),
    });
  }, []);

  const sendViewerSignal = useCallback(async (runtime: ViewerRuntime, signal: UnsequencedSignal, toPeerId = 'host') => {
    await api(`/api/screenshare/rooms/${runtime.roomId}/signals`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Screenshare-Viewer-Token': runtime.token },
      body: JSON.stringify({ role: 'viewer', peerId: runtime.peerId, toPeerId, signal }),
    });
  }, []);

  const closeViewer = useCallback(async (signalBye = true) => {
    const runtime = viewerRef.current;
    if (!runtime || runtime.closed) return;
    runtime.closed = true;
    joinAbortRef.current = true;
    if (runtime.heartbeatTimer) window.clearInterval(runtime.heartbeatTimer);
    if (runtime.pollTimer) window.clearTimeout(runtime.pollTimer);
    if (runtime.rosterTimer) window.clearInterval(runtime.rosterTimer);
    if (runtime.recoveryTimer) window.clearTimeout(runtime.recoveryTimer);
    if (signalBye) void sendViewerSignal(runtime, { type: 'bye' }).catch(() => undefined);
    runtime.pc.ontrack = null;
    runtime.pc.onicecandidate = null;
    runtime.pc.close();
    for (const peer of runtime.meshPeers.values()) {
      peer.pc.ontrack = null;
      peer.pc.onicecandidate = null;
      peer.pc.close();
    }
    runtime.meshPeers.clear();
    runtime.localStream?.getTracks().forEach((track) => track.stop());
    runtime.screenStream?.getTracks().forEach((track) => { track.onended = null; track.stop(); });
    if (localMediaRef.current === runtime.localStream) localMediaRef.current = null;
    viewerRef.current = null;
    setCameraOn(false);
    setMicrophoneOn(false);
    setScreenSharerId(null);
    setParticipants([]);
    setRemoteMedia({});
    try {
      await api(`/api/screenshare/rooms/${runtime.roomId}/leave`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Screenshare-Viewer-Token': runtime.token },
        body: JSON.stringify({ peerId: runtime.peerId }),
      });
    } catch { /* TTL lease also releases the seat */ }
  }, [sendViewerSignal]);

  const endHost = useCallback(async (notifyViewers = true) => {
    const runtime = hostRef.current;
    if (!runtime || runtime.closed) return;
    runtime.closed = true;
    setPhase('ended');
    for (const peer of runtime.peers.values()) {
      peer.pc.onicecandidate = null;
      peer.pc.onconnectionstatechange = null;
      peer.pc.close();
    }
    runtime.peers.clear();
    runtime.stream.getTracks().forEach((track) => track.stop());
    runtime.deviceStream?.getTracks().forEach((track) => track.stop());
    localMediaRef.current = null;
    if (notifyViewers) {
      try {
        await api(`/api/screenshare/rooms/${runtime.roomId}/close`, {
          method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Screenshare-Host-Token': runtime.token }, body: '{}',
        });
      } catch { /* server TTL and closed peer connections end the session */ }
    }
    hostRef.current = null;
    setRoom(null);
    setPeers([]);
    setParticipants([]);
    setPendingPeers([]);
    setScreenSharerId(null);
    setRemoteMedia({});
    setCapturedAudio(false);
    setCameraOn(false);
    setMicrophoneOn(false);
    setHostBytes(runtime.sessionBytes);
  }, []);

  const stopScreenShare = useCallback(async (captureEnded = false) => {
    const host = hostRef.current;
    if (host) {
      if (host.screenSharerId !== 'host') return;
      for (const peer of host.peers.values()) {
        await Promise.all(peer.senders.map((sender, index) => peer.senderKinds[index] === 'screen' || peer.senderKinds[index] === 'screenAudio' ? sender.replaceTrack(null).catch(() => undefined) : Promise.resolve()));
      }
      if (host.screenSharerId === 'host') {
        await api(`/api/screenshare/rooms/${host.roomId}/screen`, {
          method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Screenshare-Host-Token': host.token },
          body: JSON.stringify({ role: 'host', action: 'stop' }),
        }).catch(() => undefined);
      }
      host.screenSharerId = null;
      host.audioAvailable = false;
      setCapturedAudio(false);
      setRoom((current) => current ? { ...current, audioAvailable: false, screenSharerId: null } : current);
      setScreenSharerId(null);
      const oldStream = host.stream;
      oldStream.getTracks().forEach((track) => { track.onended = null; track.stop(); });
      host.stream = new MediaStream();
      if (hostVideoRef.current) hostVideoRef.current.srcObject = null;
      if (!captureEnded) notify(callCopy.stopScreen);
      return;
    }

    const viewer = viewerRef.current;
    if (!viewer?.screenStream) return;
    const headers = { 'Content-Type': 'application/json', 'X-Screenshare-Viewer-Token': viewer.token };
    await api(`/api/screenshare/rooms/${viewer.roomId}/screen`, {
      method: 'POST', headers, body: JSON.stringify({ role: 'viewer', peerId: viewer.peerId, action: 'stop' }),
    }).catch(() => undefined);
    const senderGroups = [{ senders: viewer.senders, kinds: viewer.senderKinds }, ...Array.from(viewer.meshPeers.values(), (peer) => ({ senders: peer.senders, kinds: peer.senderKinds }))];
    await Promise.all(senderGroups.flatMap((group) => group.senders.map((sender, index) => {
      const kind = group.kinds[index];
      return kind === 'screen' || kind === 'screenAudio' ? sender.replaceTrack(null).catch(() => undefined) : Promise.resolve();
    })));
    viewer.screenStream.getTracks().forEach((track) => { track.onended = null; track.stop(); });
    viewer.screenStream = null;
    setScreenSharerId(null);
    setRoomStatus((current) => current ? { ...current, screenSharerId: null, audioAvailable: false } : current);
    if (!captureEnded) notify(callCopy.stopScreen);
  }, [callCopy.stopScreen, notify]);

  const startScreenShare = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getDisplayMedia) {
      notify(callCopy.screenUnavailable);
      return;
    }
    let capture: Promise<MediaStream>;
    try {
      // Request a native picker with no nonstandard display constraints; apply targets after capture.
      capture = navigator.mediaDevices.getDisplayMedia(getDisplayMediaOptions());
    } catch {
      notify(callCopy.screenUnavailable);
      return;
    }
    void (async () => {
      let nextStream: MediaStream | null = null;
      let lockContext: { roomId: string; token: string; role: 'host' | 'viewer'; peerId?: string; actorId: string } | null = null;
      let lockAcquired = false;
      try {
        nextStream = await capture;
        const nextVideo = nextStream.getVideoTracks()[0];
        if (!nextVideo) throw new Error('missing_video_track');
        setContentHint(nextStream, preferencesRef.current.contentPreference);
        const economy = preferencesRef.current.dataSaver || viewerEconomy || network.saveData === true;
        await nextVideo.applyConstraints(getInitialCaptureConstraints(economy ? 'economy' : preferencesRef.current.qualityMode, !economy && preferencesRef.current.contentPreference === 'motion')).catch(() => notify(ui.qualityLimited));
        const host = hostRef.current;
        const viewer = viewerRef.current;
        if (!host && !viewer) { nextStream.getTracks().forEach((track) => track.stop()); return; }
        const actorId = host ? 'host' : viewer!.peerId;
        const roomId = host ? host.roomId : viewer!.roomId;
        const token = host ? host.token : viewer!.token;
        const role = host ? 'host' : 'viewer';
        lockContext = { roomId, token, role, ...(viewer ? { peerId: viewer.peerId } : {}), actorId };
        const lock = await api<{ screenSharerId: string | null }>(`/api/screenshare/rooms/${roomId}/screen`, {
          method: 'POST', headers: { 'Content-Type': 'application/json', [host ? 'X-Screenshare-Host-Token' : 'X-Screenshare-Viewer-Token']: token },
          body: JSON.stringify({ role, ...(viewer ? { peerId: viewer.peerId } : {}), action: 'start', audioAvailable: nextStream.getAudioTracks().length > 0 }),
        });
        if (lock.screenSharerId !== actorId) throw Object.assign(new Error(callCopy.screenBusy), { code: 'screen_busy' });
        lockAcquired = true;
        const screenAudio = nextStream.getAudioTracks()[0] ?? null;
        const replaceScreen = async (senders: RTCRtpSender[], kinds: CallMediaKind[]) => Promise.all(senders.map((sender, index) => {
          if (kinds[index] === 'screen') return sender.replaceTrack(nextVideo).catch(() => undefined);
          if (kinds[index] === 'screenAudio') return sender.replaceTrack(screenAudio).catch(() => undefined);
          return Promise.resolve();
        }));
        if (host) {
          const previous = host.stream;
          host.stream = nextStream;
          host.screenSharerId = actorId;
          host.audioAvailable = Boolean(screenAudio);
          await Promise.all(Array.from(host.peers.values(), (peer) => replaceScreen(peer.senders, peer.senderKinds)));
          previous.getTracks().forEach((track) => { track.onended = null; track.stop(); });
          setCapturedAudio(Boolean(screenAudio));
          setRoom((current) => current ? { ...current, audioAvailable: Boolean(screenAudio), screenSharerId: actorId } : current);
          if (hostVideoRef.current) { hostVideoRef.current.srcObject = nextStream; void hostVideoRef.current.play().catch(() => undefined); }
        } else if (viewer) {
          const previous = viewer.screenStream;
          viewer.screenStream = nextStream;
          const groups = [{ senders: viewer.senders, kinds: viewer.senderKinds }, ...Array.from(viewer.meshPeers.values(), (peer) => ({ senders: peer.senders, kinds: peer.senderKinds }))];
          await Promise.all(groups.map((group) => replaceScreen(group.senders, group.kinds)));
          previous?.getTracks().forEach((track) => { track.onended = null; track.stop(); });
          setRoomStatus((current) => current ? { ...current, screenSharerId: actorId, audioAvailable: Boolean(screenAudio) } : current);
        }
        setScreenSharerId(actorId);
        nextVideo.onended = () => { void stopScreenShare(true); };
      } catch (error) {
        if (lockAcquired && lockContext) void api(`/api/screenshare/rooms/${lockContext.roomId}/screen`, {
          method: 'POST', headers: { 'Content-Type': 'application/json', [lockContext.role === 'host' ? 'X-Screenshare-Host-Token' : 'X-Screenshare-Viewer-Token']: lockContext.token },
          body: JSON.stringify({ role: lockContext.role, ...(lockContext.peerId ? { peerId: lockContext.peerId } : {}), action: 'stop' }),
        }).catch(() => undefined);
        nextStream?.getTracks().forEach((track) => track.stop());
        const code = (error as ApiError).code;
        const captureError = error instanceof Error && error.name === 'AbortError' ? ui.captureCanceled
          : error instanceof Error && error.name === 'NotAllowedError' ? callCopy.screenPermission
            : error instanceof Error && (error.name === 'NotFoundError' || error.name === 'NotSupportedError') ? callCopy.screenUnavailable
              : humanError(error, ui, x);
        notify(code === 'screen_busy' ? callCopy.screenBusy : code === 'room_ended' ? ui.roomEnded : captureError);
      }
    })();
  }, [callCopy, network.saveData, notify, setContentHint, stopScreenShare, ui, viewerEconomy, x]);

  const startCapture = useCallback(async (modeOverride?: QualityMode, reduceData = false) => {
    if (!participantName.trim()) {
      setErrorText(callCopy.noName);
      setPhase('error');
      return;
    }
    const mode = modeOverride ?? preferencesRef.current.qualityMode;
    const economy = reduceData || preferencesRef.current.dataSaver || network.saveData === true;
    setPhase('starting');
    setErrorText('');
    alertedThresholds.current.clear();
    trackEvent('tool_started', { tool: TOOL_ID.shareScreen, locale });
    try {
      const token = createRandomHex(32);
      const config = await api<{ iceServers: RTCIceServer[]; viewerLimit: number }>('/api/screenshare/config');
      setViewerLimitFromConfig(config.viewerLimit);
      if (preferencesRef.current.viewerLimit > config.viewerLimit) {
        setPreferences((current) => ({ ...current, viewerLimit: config.viewerLimit }));
      }
      const created = await api<{ roomId: string; viewerLimit: number }>('/api/screenshare/rooms', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Screenshare-Host-Token': token },
        body: JSON.stringify({ qualityMode: economy ? 'economy' : mode, viewerLimit: Math.min(config.viewerLimit, preferencesRef.current.viewerLimit), hostName: participantName, access: roomAccess, hostCameraOn: cameraOn, hostMicrophoneOn: microphoneOn }),
      });
      const basePath = `/${locale}/share/${created.roomId}`;
      const roomUrl = `${window.location.origin}${basePath}`;
      const stream = new MediaStream();
      const runtime: HostRuntime = {
        roomId: created.roomId, token, stream, deviceStream: localMediaRef.current, peers: new Map(), cursor: 0, startedAt: Date.now(), roomUrl,
        audioAvailable: false, lastStatsAt: Date.now(), byteCounters: new Map(), sessionBytes: 0,
        screenSharerId: null,
        iceServers: config.iceServers,
        lastUploadMbps: null, captureLevel: economy ? 'economy' : mode === 'high' || mode === 'maximum' ? 'high' : 'balanced',
        captureLevelSince: Date.now(), lastTrackConstraintAt: 0, everConnected: false, closed: false,
      };
      hostRef.current = runtime;
      setRoom({ roomId: created.roomId, token, roomUrl, viewerLimit: created.viewerLimit, startedAt: runtime.startedAt, audioAvailable: false, hostName: participantName, access: roomAccess, screenSharerId: null });
      setScreenSharerId(null);
      setCapturedAudio(false);
      setParticipants([{ id: 'host', displayName: participantName, state: 'connected', cameraOn, microphoneOn }]);
      setHostCallPanel(null);
      setViewerLimitFromConfig(created.viewerLimit);
      setPhase('active');
      setDiagnosticsOpen(false);
      try { await navigator.clipboard.writeText(roomUrl); notify(ui.copied); trackEvent('result_copied', { tool: TOOL_ID.shareScreen, locale }); } catch { /* user can copy from visible link field */ }
    } catch (error) {
      setErrorText(humanError(error, ui, x));
      setPhase('error');
      trackEvent('tool_error', { tool: TOOL_ID.shareScreen, locale, error_type: (error as ApiError)?.code === 'redis_unavailable' ? 'network_error' : 'processing_failed' });
    }
  }, [callCopy.noName, cameraOn, locale, microphoneOn, network.saveData, notify, participantName, roomAccess, ui, x]);

  const confirmAndStart = useCallback((economy: boolean) => {
    const nextPreferences = { ...preferencesRef.current, ...(economy ? { dataSaver: true, qualityMode: 'economy' as const } : {}) };
    if (economy) {
      setPreference('dataSaver', true);
      setPreference('qualityMode', 'economy');
    }
  if (rememberConfirmation) {
      try { localStorage.setItem('adtools.share-screen.confirm.v1', getConfirmationKey(nextPreferences, `${network.type}:${network.saveData ?? 'unknown'}`)); } catch { /* storage can be disabled */ }
    }
    setPhase('starting');
    void startCapture(economy ? 'economy' : nextPreferences.qualityMode, economy);
  }, [network.saveData, network.type, rememberConfirmation, setPreference, startCapture]);

  const changeQuality = useCallback((mode: QualityMode) => {
    setPreference('qualityMode', mode);
  }, [setPreference]);

  const connectViewer = useCallback(async (roomId: string, preferEconomy: boolean) => {
    if (!participantName.trim()) { setErrorText(callCopy.noName); return; }
    setPhase('connecting');
    setErrorText('');
    joinAbortRef.current = false;
    try {
      const token = createRandomHex(32);
      const peerId = createRandomHex(16);
      const config = await api<{ iceServers: RTCIceServer[]; viewerLimit: number }>('/api/screenshare/config');
      setViewerLimitFromConfig(config.viewerLimit);
      const pc = new RTCPeerConnection({ iceServers: config.iceServers, iceCandidatePoolSize: 2 });
      const localTracks = localMediaRef.current?.getTracks() ?? [];
      const currentScreen = viewerRef.current?.screenStream ?? null;
      const transceivers = createCallMediaTransceivers(
        pc,
        localTracks.find((track) => track.kind === 'audio') ?? null,
        localTracks.find((track) => track.kind === 'video') ?? null,
        currentScreen?.getVideoTracks()[0] ?? null,
        currentScreen?.getAudioTracks()[0] ?? null,
      );
      const senderKinds: CallMediaKind[] = ['microphone', 'camera', 'screen', 'screenAudio'];
      const runtime: ViewerRuntime = {
        roomId, peerId, token, pc, transceivers,
        senders: senderKinds.map((kind) => transceivers[kind].sender), senderKinds,
        meshPeers: new Map(), localStream: localMediaRef.current, screenStream: currentScreen,
        cursor: 0, negotiationId: null, candidates: [], bytes: new Map(), sessionBytes: 0, lastStatsAt: Date.now(), lastAdaptation: 0,
        heartbeatTimer: null, pollTimer: null, rosterTimer: null, recoveryTimer: null, connected: false, completed: false, closed: false,
      };
      baselineRef.current = null;
      viewerRef.current = runtime;
      setViewerPeerId(peerId);
      setViewerEconomy(preferEconomy);
      const join = await api<{ state: 'pending' | 'approved' }>('/api/screenshare/rooms/' + roomId + '/join', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Screenshare-Viewer-Token': token },
        body: JSON.stringify({ peerId, displayName: participantName, cameraOn, microphoneOn }),
      });
      if (join.state === 'pending') {
        setAdmissionState('pending');
        setPhase('waiting');
        const startedAt = Date.now();
        let lastPendingHeartbeat = startedAt;
        while (!runtime.closed && !joinAbortRef.current && Date.now() - startedAt < 90_000) {
          await new Promise((resolve) => window.setTimeout(resolve, 1_800));
          if (runtime.closed || joinAbortRef.current) break;
          const admission = await api<{ state: string; admission: 'pending' | 'approved' | 'denied' }>(`/api/screenshare/rooms/${roomId}/join?peerId=${peerId}`, {
            headers: { 'X-Screenshare-Viewer-Token': token },
          });
          if (admission.admission === 'denied') throw Object.assign(new Error(callCopy.joinRejected), { code: 'join_rejected' });
          if (admission.state === 'closed' || admission.state === 'expired') throw Object.assign(new Error(ui.roomEnded), { code: 'room_ended' });
          if (admission.admission === 'approved') break;
          if (Date.now() - lastPendingHeartbeat > 18_000) {
            lastPendingHeartbeat = Date.now();
            await api(`/api/screenshare/rooms/${roomId}/heartbeat`, {
              method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Screenshare-Viewer-Token': token },
              body: JSON.stringify({ role: 'viewer', peerId, state: 'connecting', cameraOn: cameraOnRef.current, microphoneOn: microphoneOnRef.current }),
            });
          }
        }
        if (joinAbortRef.current || runtime.closed) return;
        if (Date.now() - startedAt >= 90_000) throw Object.assign(new Error(callCopy.waitingApproval), { code: 'approval_timeout' });
      }
      if (runtime.closed || joinAbortRef.current) return;
      setAdmissionState('approved');

      let pollForNegotiation: () => Promise<void> = async () => undefined;
      let pollDelay = 1_500;
      let pollInFlight = false;
      const schedulePoll = () => {
        if (runtime.closed) return;
        if (runtime.pollTimer) window.clearTimeout(runtime.pollTimer);
        runtime.pollTimer = window.setTimeout(() => { runtime.pollTimer = null; void pollForNegotiation(); }, runtime.connected ? 5_000 : pollDelay);
      };
      const attachConnectionState = (connection: RTCPeerConnection, otherPeerId: string | 'host') => {
        connection.onconnectionstatechange = () => {
          if (otherPeerId === 'host') runtime.connected = connection.connectionState === 'connected';
          if (connection.connectionState === 'connected') {
            if (runtime.recoveryTimer) window.clearTimeout(runtime.recoveryTimer);
            runtime.recoveryTimer = null;
            setPhase('watching');
            setHostReconnectText('');
            if (!runtime.completed) { runtime.completed = true; trackEvent('tool_completed', { tool: TOOL_ID.shareScreen, locale }); }
          } else if (connection.connectionState === 'disconnected' || connection.connectionState === 'failed') {
            if (otherPeerId === 'host') setHostReconnectText(ui.connectionLost);
            if (connection.connectionState === 'failed' && otherPeerId === 'host') void sendViewerSignal(runtime, { type: 'restart-request' }).catch(() => undefined);
            void pollForNegotiation();
            schedulePoll();
            if (otherPeerId === 'host') {
              if (runtime.recoveryTimer) window.clearTimeout(runtime.recoveryTimer);
              runtime.recoveryTimer = window.setTimeout(() => {
                runtime.recoveryTimer = null;
                if (runtime.closed || connection.connectionState === 'connected') return;
                void api<{ state?: string }>(`/api/screenshare/rooms/${roomId}`).then((info) => {
                  if (info.state === 'closed' || info.state === 'expired') { setErrorText(info.state === 'closed' ? ui.roomEnded : ui.roomExpired); setPhase('ended'); void closeViewer(false); }
                }).catch(() => undefined);
              }, 5_000);
            }
          }
        };
      };
      const makeMeshPeer = (otherPeerId: string): ViewerMeshPeer => {
        const meshPc = new RTCPeerConnection({ iceServers: config.iceServers, iceCandidatePoolSize: 2 });
        const tracks = runtime.localStream?.getTracks() ?? [];
        const shared = runtime.screenStream;
        const meshTransceivers = createCallMediaTransceivers(
          meshPc,
          tracks.find((track) => track.kind === 'audio') ?? null,
          tracks.find((track) => track.kind === 'video') ?? null,
          shared?.getVideoTracks()[0] ?? null,
          shared?.getAudioTracks()[0] ?? null,
        );
        const meshKinds: CallMediaKind[] = ['microphone', 'camera', 'screen', 'screenAudio'];
        const mesh: ViewerMeshPeer = { id: otherPeerId, pc: meshPc, negotiationId: crypto.randomUUID(), candidates: [], transceivers: meshTransceivers, senders: meshKinds.map((kind) => meshTransceivers[kind].sender), senderKinds: meshKinds, bytes: new Map(), lastStatsAt: Date.now(), state: meshPc.connectionState };
        runtime.meshPeers.set(otherPeerId, mesh);
        meshPc.ontrack = (event) => attachRemoteTrack(otherPeerId, meshTransceivers, event);
        meshPc.onicecandidate = (event) => {
          if (event.candidate) void sendViewerSignal(runtime, { type: 'candidate', negotiationId: mesh.negotiationId, candidate: serializeCandidate(event.candidate) }, otherPeerId).catch(() => undefined);
        };
        attachConnectionState(meshPc, otherPeerId);
        return mesh;
      };
      const createMeshOffer = async (otherPeerId: string) => {
        let mesh = runtime.meshPeers.get(otherPeerId);
        if (!mesh) mesh = makeMeshPeer(otherPeerId);
        if (mesh.pc.signalingState !== 'stable') return;
        mesh.negotiationId = crypto.randomUUID();
        const offer = await mesh.pc.createOffer();
        await mesh.pc.setLocalDescription(offer);
        await sendViewerSignal(runtime, { type: 'offer', negotiationId: mesh.negotiationId, description: { type: 'offer', sdp: offer.sdp ?? '' } }, otherPeerId);
      };
      runtime.pc.ontrack = (event) => {
        attachRemoteTrack('host', runtime.transceivers, event);
      };
      runtime.pc.onicecandidate = (event) => {
        if (event.candidate && runtime.negotiationId) void sendViewerSignal(runtime, { type: 'candidate', negotiationId: runtime.negotiationId, candidate: serializeCandidate(event.candidate) }).catch(() => undefined);
      };
      attachConnectionState(runtime.pc, 'host');
      await sendViewerSignal(runtime, { type: 'join' });
      if (preferEconomy) await sendViewerSignal(runtime, { type: 'quality-request', preference: 'economy' });

      const applySignal = async (signal: ScreenShareSignal) => {
        if (signal.type === 'room-closed') { setErrorText(ui.roomEnded); setPhase('ended'); void closeViewer(false); return; }
        if (signal.type === 'bye') {
          const mesh = runtime.meshPeers.get(signal.fromPeerId);
          if (mesh) { mesh.pc.close(); runtime.meshPeers.delete(signal.fromPeerId); removeRemoteParticipant(signal.fromPeerId); }
          return;
        }
        if (signal.type === 'offer' && signal.fromPeerId === 'host') {
          runtime.negotiationId = signal.negotiationId;
          await runtime.pc.setRemoteDescription(signal.description);
          for (const candidate of runtime.candidates.splice(0).filter((item) => item.negotiationId === signal.negotiationId)) await runtime.pc.addIceCandidate(candidate.candidate).catch(() => undefined);
          const answer = await runtime.pc.createAnswer();
          await runtime.pc.setLocalDescription(answer);
          await sendViewerSignal(runtime, { type: 'answer', negotiationId: signal.negotiationId, description: { type: 'answer', sdp: answer.sdp ?? '' } });
          return;
        }
        if (signal.type === 'candidate' && signal.fromPeerId === 'host') {
          if (runtime.pc.remoteDescription && signal.negotiationId === runtime.negotiationId) await runtime.pc.addIceCandidate(signal.candidate).catch(() => undefined);
          else runtime.candidates.push({ negotiationId: signal.negotiationId, candidate: signal.candidate });
          return;
        }
        if (signal.fromPeerId === 'host') return;
        let mesh = runtime.meshPeers.get(signal.fromPeerId);
        if (signal.type === 'offer') {
          if (!mesh) mesh = makeMeshPeer(signal.fromPeerId);
          mesh.negotiationId = signal.negotiationId;
          await mesh.pc.setRemoteDescription(signal.description);
          for (const candidate of mesh.candidates.splice(0).filter((item) => item.negotiationId === signal.negotiationId)) await mesh.pc.addIceCandidate(candidate.candidate).catch(() => undefined);
          const answer = await mesh.pc.createAnswer();
          await mesh.pc.setLocalDescription(answer);
          await sendViewerSignal(runtime, { type: 'answer', negotiationId: signal.negotiationId, description: { type: 'answer', sdp: answer.sdp ?? '' } }, signal.fromPeerId);
        } else if (signal.type === 'answer' && mesh && signal.negotiationId === mesh.negotiationId) {
          await mesh.pc.setRemoteDescription(signal.description);
          for (const candidate of mesh.candidates.splice(0)) await mesh.pc.addIceCandidate(candidate.candidate).catch(() => undefined);
        } else if (signal.type === 'candidate') {
          if (!mesh) mesh = makeMeshPeer(signal.fromPeerId);
          if (mesh.pc.remoteDescription && signal.negotiationId === mesh.negotiationId) await mesh.pc.addIceCandidate(signal.candidate).catch(() => undefined);
          else mesh.candidates.push({ negotiationId: signal.negotiationId, candidate: signal.candidate });
        }
      };
      pollForNegotiation = async () => {
        if (runtime.closed || pollInFlight) return;
        pollInFlight = true;
        let succeeded = false;
        try {
          const result = await api<{ status: string; roomState?: string; messages: ScreenShareSignal[] }>(`/api/screenshare/rooms/${roomId}/signals?role=viewer&peerId=${peerId}&after=${runtime.cursor}`, { headers: { 'X-Screenshare-Viewer-Token': token } });
          if (result.roomState && result.roomState !== 'active') {
            const message = statusCopy(result.roomState, ui);
            if (message) { setErrorText(message); setPhase(result.roomState === 'recovering' ? 'connecting' : 'ended'); }
            if (result.roomState === 'expired' || result.roomState === 'closed') { void closeViewer(false); return; }
          }
          for (const signal of result.messages) { runtime.cursor = Math.max(runtime.cursor, signal.sequence); await applySignal(signal); }
          succeeded = true;
        } catch (error) {
          if ((error as ApiError).code === 'not_found' || (error as ApiError).code === 'room_ended') { setErrorText(ui.roomExpired); setPhase('ended'); void closeViewer(false); return; }
          setHostReconnectText(humanError(error, ui, x));
        } finally {
          pollInFlight = false;
          pollDelay = succeeded ? 1_500 : Math.min(pollDelay * 2, 12_000);
          schedulePoll();
        }
      };
      const syncRoster = async () => {
        if (runtime.closed) return;
        try {
          const roster = await api<{ host: ParticipantView; peers: ParticipantView[]; screenSharerId: string | null; audioAvailable: boolean }>(`/api/screenshare/rooms/${roomId}/participants?peerId=${peerId}`, { headers: { 'X-Screenshare-Viewer-Token': token } });
          const people = [roster.host, ...roster.peers].filter(Boolean);
          setParticipants(people.map((person) => ({ ...person, state: person.id === 'host' ? 'connected' : person.state })));
          setScreenSharerId(roster.screenSharerId);
          setRoomStatus((current) => current ? { ...current, screenSharerId: roster.screenSharerId, audioAvailable: roster.audioAvailable } : current);
          const activeIds = new Set(people.map((person) => person.id).filter((id) => id !== 'host' && id !== peerId));
          for (const person of people) {
            if (person.id === 'host' || person.id === peerId || runtime.meshPeers.has(person.id)) continue;
            if (peerId.localeCompare(person.id) < 0) await createMeshOffer(person.id);
          }
          for (const [id, mesh] of runtime.meshPeers) if (!activeIds.has(id)) { mesh.pc.close(); runtime.meshPeers.delete(id); removeRemoteParticipant(id); }
        } catch { /* Redis outages are covered by heartbeat leases and signaling retries. */ }
      };
      void pollForNegotiation();
      void syncRoster();
      runtime.rosterTimer = window.setInterval(() => { void syncRoster(); }, 5_000);
      runtime.heartbeatTimer = window.setInterval(() => {
        if (runtime.closed) return;
        void api<{ ok: boolean }>(`/api/screenshare/rooms/${roomId}/heartbeat`, {
          method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Screenshare-Viewer-Token': token },
          body: JSON.stringify({ role: 'viewer', peerId, state: runtime.pc.connectionState === 'connected' ? 'connected' : 'connecting', cameraOn: cameraOnRef.current, microphoneOn: microphoneOnRef.current }),
        }).catch((error) => {
          if ((error as ApiError).code === 'room_ended') { setErrorText(ui.roomEnded); setPhase('ended'); void closeViewer(false); }
          else setHostReconnectText(humanError(error, ui, x));
        });
      }, 20_000);
      setPhase('connecting');
    } catch (error) {
      const code = (error as ApiError).code;
      const message = code === 'join_rejected' ? callCopy.joinRejected : code === 'approval_timeout' ? callCopy.waitingApproval : code === 'room_full' ? callCopy.callFull : humanError(error, ui, x);
      if (viewerRef.current) await closeViewer(false);
      setAdmissionState(code === 'join_rejected' ? 'denied' : null);
      setErrorText(message);
      setPhase(code === 'join_rejected' ? 'idle' : 'error');
      if (code !== 'join_rejected' && code !== 'approval_timeout') trackEvent('tool_error', { tool: TOOL_ID.shareScreen, locale, error_type: code === 'room_full' ? 'validation_failed' : 'network_error' });
    }
  }, [attachRemoteTrack, callCopy, cameraOn, closeViewer, locale, microphoneOn, participantName, removeRemoteParticipant, sendViewerSignal, ui, x]);

  useEffect(() => {
    if (!initialRoomId) return;
    let active = true;
    setPhase('connecting');
    void api<ViewerRoom & { status: string }>(`/api/screenshare/rooms/${initialRoomId}`).then((response) => {
      if (!active) return;
      setRoomStatus(response);
      const status = response.state;
      if (status !== 'active') { setErrorText(statusCopy(status ?? '', ui)); setPhase(status === 'expired' || status === 'closed' ? 'ended' : 'idle'); return; }
      setPhase('idle');
    }).catch((error) => {
      if (!active) return;
      setErrorText(humanError(error, ui, x)); setPhase('error');
    });
    return () => { active = false; };
  }, [initialRoomId, ui, x]);

  useEffect(() => {
    const runtime = hostRef.current;
    if (!runtime || phase !== 'active') return;
    let active = true;
    let pollTimer: number | null = null;
    let pollDelay = 1_800;
    let pollInFlight = false;
    const refreshPeerViews = () => {
      const views = Array.from(runtime.peers, ([id, peer]) => ({ id, displayName: peer.displayName, state: peer.state, metrics: peer.metrics, cameraOn: peer.cameraOn, microphoneOn: peer.microphoneOn }));
      setPeers(views);
      setParticipants([{ id: 'host', displayName: participantName, state: 'connected', cameraOn, microphoneOn }, ...views.map((peer) => ({ id: peer.id, displayName: peer.displayName, state: peer.state, cameraOn: peer.cameraOn, microphoneOn: peer.microphoneOn }))]);
    };
    const schedulePoll = () => {
      if (!active || runtime.closed) return;
      if (pollTimer) window.clearTimeout(pollTimer);
      pollTimer = window.setTimeout(() => { pollTimer = null; void poll(); }, pollDelay);
    };

    const createHostPeer = async (peerId: string, displayName = ui.spectator) => {
      if (runtime.peers.has(peerId) || runtime.closed) return;
      const previousViewers = runtime.peers.size;
      const startPrefs = preferencesRef.current;
      const estimateProfileBps = startPrefs.dataSaver ? qualityProfiles.economy.maxBitrate : startPrefs.qualityMode === 'automatic'
        ? (startPrefs.contentPreference === 'motion' && runtime.captureLevel !== 'economy' ? qualityProfiles.fluid.maxBitrate : qualityProfiles[runtime.captureLevel].maxBitrate)
        : getNominalVideoBitrate(startPrefs.qualityMode);
      const extraCameraBps = runtime.deviceStream?.getVideoTracks().some((track) => track.readyState === 'live') ? 500_000 : 0;
      const outgoingAudioBps = (runtime.deviceStream?.getAudioTracks().some((track) => track.readyState === 'live') ? 96_000 : 0) + (runtime.audioAvailable ? 64_000 : 0);
      const beforeEstimate = estimateUploadTraffic(estimateProfileBps + extraCameraBps, previousViewers, undefined, outgoingAudioBps).totalMbps;
      const pc = new RTCPeerConnection({ iceServers: runtime.iceServers, iceCandidatePoolSize: 2 });
      const initialAllocation = allocatePeerBitrate({ budgetMbps: startPrefs.uploadBudgetMbps, activeViewers: previousViewers + 1, profileCeilingBps: estimateProfileBps + extraCameraBps, viewerPrefersEconomy: startPrefs.dataSaver, audioPerViewerBps: outgoingAudioBps });
      const localDeviceTracks = runtime.deviceStream?.getTracks() ?? [];
      const transceivers = createCallMediaTransceivers(
        pc,
        localDeviceTracks.find((track) => track.kind === 'audio') ?? null,
        localDeviceTracks.find((track) => track.kind === 'video') ?? null,
        runtime.stream.getVideoTracks()[0] ?? null,
        runtime.stream.getAudioTracks()[0] ?? null,
      );
      const senderKinds: CallMediaKind[] = ['microphone', 'camera', 'screen', 'screenAudio'];
      const senders = senderKinds.map((kind) => transceivers[kind].sender);
      const peer: HostPeer = { id: peerId, displayName, cameraOn: false, microphoneOn: false, pc, senders, senderKinds, transceivers, negotiationId: crypto.randomUUID(), candidates: [], metrics: null, state: pc.connectionState, economy: false, lastAdaptation: 0, restartCount: 0, byteCounters: new Map(), lastStatsAt: Date.now(), baseline: null, congestionSince: null, stableSince: null, appliedBitrate: Math.min(estimateProfileBps, initialAllocation.bitrateBps) };
      runtime.peers.set(peerId, peer);
      const afterEstimate = estimateUploadTraffic(estimateProfileBps + extraCameraBps, previousViewers + 1, undefined, outgoingAudioBps).totalMbps;
      if (afterEstimate > startPrefs.uploadBudgetMbps && (network.type === 'cellular' || startPrefs.limitedConnection || startPrefs.dataSaver || network.type === 'unknown') && Date.now() - lastBudgetNoticeRef.current > 60_000) {
        lastBudgetNoticeRef.current = Date.now();
        notify(`${x.viewerJoined}. ${x.currentRate}: ${beforeEstimate.toFixed(1)} → ${afterEstimate.toFixed(1)} Mbps.`);
      }
      for (const existingPeer of runtime.peers.values()) existingPeer.lastAdaptation = 0;
      pc.ontrack = (event) => attachRemoteTrack(peerId, transceivers, event);
      pc.onicecandidate = (event) => {
        if (!event.candidate) return;
        void sendHostSignal(runtime, peerId, { type: 'candidate', negotiationId: peer.negotiationId, candidate: serializeCandidate(event.candidate) }).catch(() => undefined);
      };
      pc.onconnectionstatechange = () => {
        peer.state = pc.connectionState;
        refreshPeerViews();
        if ((pc.connectionState === 'failed' || pc.iceConnectionState === 'failed') && peer.restartCount < 2) {
          peer.restartCount += 1;
          peer.negotiationId = crypto.randomUUID();
          void pc.createOffer({ iceRestart: true }).then(async (offer) => {
            await pc.setLocalDescription(offer);
            await sendHostSignal(runtime, peerId, { type: 'offer', negotiationId: peer.negotiationId, description: { type: 'offer', sdp: offer.sdp ?? '' } });
          }).catch(() => { setHostReconnectText(ui.unableToConnect); });
        } else if (pc.connectionState === 'connected') {
          peer.restartCount = 0;
          setHostReconnectText('');
          if (!runtime.everConnected) {
            runtime.everConnected = true;
            trackEvent('tool_completed', { tool: TOOL_ID.shareScreen, locale });
          }
        }
      };
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      await sendHostSignal(runtime, peerId, { type: 'offer', negotiationId: peer.negotiationId, description: { type: 'offer', sdp: offer.sdp ?? '' } });
      refreshPeerViews();
    };

    const poll = async () => {
      if (!active || runtime.closed || pollInFlight) return;
      pollInFlight = true;
      let succeeded = false;
      try {
        const response = await api<{ status: string; roomState?: string; messages: ScreenShareSignal[] }>(`/api/screenshare/rooms/${runtime.roomId}/signals?role=host&after=${runtime.cursor}`, { headers: { 'X-Screenshare-Host-Token': runtime.token } });
        if (response.roomState === 'recovering') setHostReconnectText(ui.hostRecovering);
        for (const message of response.messages) {
          runtime.cursor = Math.max(runtime.cursor, message.sequence);
          const peer = runtime.peers.get(message.fromPeerId);
          if (message.type === 'join') {
            const roster = await api<{ peers: Array<{ id: string; displayName: string; cameraOn: boolean; microphoneOn: boolean }> }>(`/api/screenshare/rooms/${runtime.roomId}/peers`, { headers: { 'X-Screenshare-Host-Token': runtime.token } }).catch(() => ({ peers: [] }));
            const member = roster.peers.find((item) => item.id === message.fromPeerId);
            if (member) await createHostPeer(member.id, member.displayName);
            continue;
          }
          if (!peer) continue;
          if (message.type === 'bye') { peer.pc.close(); runtime.peers.delete(peer.id); removeRemoteParticipant(peer.id); refreshPeerViews(); continue; }
          if (message.type === 'answer' && message.negotiationId === peer.negotiationId) {
            await peer.pc.setRemoteDescription(message.description);
            for (const candidate of peer.candidates.splice(0)) await peer.pc.addIceCandidate(candidate).catch(() => undefined);
          }
          if (message.type === 'candidate' && message.negotiationId === peer.negotiationId) {
            if (peer.pc.remoteDescription) await peer.pc.addIceCandidate(message.candidate).catch(() => undefined);
            else peer.candidates.push(message.candidate);
          }
          if (message.type === 'restart-request' && peer.restartCount < 2) {
            peer.restartCount += 1;
            peer.negotiationId = crypto.randomUUID();
            const offer = await peer.pc.createOffer({ iceRestart: true });
            await peer.pc.setLocalDescription(offer);
            await sendHostSignal(runtime, peer.id, { type: 'offer', negotiationId: peer.negotiationId, description: { type: 'offer', sdp: offer.sdp ?? '' } });
          }
          if (message.type === 'quality-request') { peer.economy = message.preference === 'economy'; }
        }
        succeeded = true;
      } catch (error) {
        if ((error as ApiError).code === 'redis_unavailable') setHostReconnectText(ui.redisUnavailable);
      } finally {
        pollInFlight = false;
        pollDelay = succeeded ? 1_800 : Math.min(pollDelay * 2, 15_000);
        schedulePoll();
      }
    };

    const syncActivePeers = async () => {
      if (!active || runtime.closed) return;
      try {
        const result = await api<{ peers: Array<{ id: string; displayName: string; cameraOn: boolean; microphoneOn: boolean }>; pending: Array<{ id: string; displayName: string }>; host: { displayName: string } | undefined; screenSharerId: string | null; audioAvailable: boolean }>(`/api/screenshare/rooms/${runtime.roomId}/peers`, {
          headers: { 'X-Screenshare-Host-Token': runtime.token },
        });
        const activeIds = new Set(result.peers.map((item) => item.id));
        setPendingPeers(result.pending ?? []);
        setScreenSharerId(result.screenSharerId ?? null);
        setRoom((current) => current ? { ...current, screenSharerId: result.screenSharerId ?? null, audioAvailable: result.audioAvailable } : current);
        for (const member of result.peers) {
          const peer = runtime.peers.get(member.id);
          if (peer) { peer.displayName = member.displayName; peer.cameraOn = member.cameraOn; peer.microphoneOn = member.microphoneOn; }
        }
        refreshPeerViews();
        for (const [peerId, peer] of runtime.peers) {
          if (activeIds.has(peerId)) continue;
          peer.pc.onicecandidate = null;
          peer.pc.onconnectionstatechange = null;
          peer.pc.close();
          runtime.peers.delete(peerId);
        }
        refreshPeerViews();
      } catch { /* the 60-second Redis lease recovers viewers during a signaling outage */ }
    };

    const sample = async () => {
      if (!active || runtime.closed) return;
      const peersNow = Array.from(runtime.peers.values()).filter((peer) => peer.state !== 'closed');
      const now = Date.now();
      const pref = preferencesRef.current;
      const effectiveProfileBps = pref.dataSaver ? qualityProfiles.economy.maxBitrate : pref.qualityMode === 'automatic'
        ? (pref.contentPreference === 'motion' && runtime.captureLevel !== 'economy' ? qualityProfiles.fluid.maxBitrate : qualityProfiles[runtime.captureLevel].maxBitrate)
        : getNominalVideoBitrate(pref.qualityMode);
      const outgoingCameraBps = runtime.deviceStream?.getVideoTracks().some((track) => track.readyState === 'live') ? 500_000 : 0;
      const outgoingAudioBps = (runtime.deviceStream?.getAudioTracks().some((track) => track.readyState === 'live') ? 96_000 : 0) + (runtime.audioAvailable ? 64_000 : 0);
      const requestedTotalMbps = estimateUploadTraffic(effectiveProfileBps + outgoingCameraBps, peersNow.length, undefined, outgoingAudioBps).totalMbps;
      const constrainedByBudget = peersNow.length > 0 && requestedTotalMbps > pref.uploadBudgetMbps;
      setBudgetExceeded(constrainedByBudget);
      if (constrainedByBudget && now - lastBudgetNoticeRef.current > 60_000) {
        lastBudgetNoticeRef.current = now;
        if (network.type === 'cellular' || pref.limitedConnection || pref.dataSaver || network.type === 'unknown') {
          notify(`${x.viewerJoined}. ${x.budgetExceeded}`);
        }
      }
      let sentDelta = 0;
      const allMetrics: ConnectionMetrics[] = [];
      for (const peer of peersNow) {
        try {
          const stats = await peer.pc.getStats();
          const namespaced = Array.from(stats.values()).map((item) => ({ ...item, id: `${peer.id}:${item.id}` }));
          const namespacedPrevious = peer.byteCounters;
          const measured = measureOutboundMediaDelta(namespaced as Array<{ id?: string; type?: string; kind?: string; mediaType?: string; bytesSent?: number }>, namespacedPrevious);
          sentDelta += measured.deltaBytes;
          peer.byteCounters = measured.next;
          const result = computeConnectionMetrics(stats.values() as Iterable<{ id?: string; type?: string; timestamp?: number; [key: string]: unknown }>, 'outbound', peer.baseline);
          peer.baseline = result.baseline;
          const elapsedPeer = Math.max(1, now - peer.lastStatsAt);
          peer.lastStatsAt = now;
          const peerMediaBps = measured.deltaBytes > 0 ? (measured.deltaBytes * 8 * 1_000) / elapsedPeer : null;
          peer.metrics = { ...result.metrics, bitrateBps: peerMediaBps };
          if (Array.from(stats.values()).some((item) => item.type === 'outbound-rtp' && Number.isFinite(item.bytesSent) && (item.kind === 'video' || item.kind === 'audio' || item.mediaType === 'video' || item.mediaType === 'audio'))) setHostDataMeasured(true);
          peer.state = peer.pc.connectionState;
          allMetrics.push(result.metrics);
          const profileCeilingBps = pref.dataSaver ? qualityProfiles.economy.maxBitrate : pref.qualityMode === 'automatic' ? effectiveProfileBps : getNominalVideoBitrate(pref.qualityMode);
          const allocation = allocatePeerBitrate({ budgetMbps: pref.uploadBudgetMbps, activeViewers: Math.max(1, peersNow.length), profileCeilingBps: profileCeilingBps + outgoingCameraBps, viewerPrefersEconomy: pref.dataSaver || peer.economy, audioPerViewerBps: outgoingAudioBps });
          setBudgetShortfall(allocation.budgetShortfall);
          if (now - peer.lastAdaptation >= 5_000) {
            const congested = (peer.metrics.packetLossPercent !== null && peer.metrics.packetLossPercent >= 5) || (peer.metrics.roundTripMs !== null && peer.metrics.roundTripMs >= 350);
            if (congested) { peer.congestionSince ??= now; peer.stableSince = null; }
            else if (peer.metrics.packetLossPercent !== null || peer.metrics.roundTripMs !== null) { peer.stableSince ??= now; peer.congestionSince = null; }
            const stableSeconds = peer.stableSince === null ? 0 : (now - peer.stableSince) / 1_000;
            const congestionSeconds = peer.congestionSince === null ? 0 : (now - peer.congestionSince) / 1_000;
            const adapted = getPeerBitrateCeiling(pref.dataSaver || peer.economy ? 'economy' : pref.qualityMode, peer.metrics, Math.min(peer.appliedBitrate, allocation.bitrateBps), congested ? congestionSeconds : stableSeconds);
            const target = Math.min(allocation.bitrateBps, adapted);
            const hasScreen = peer.transceivers.screen.sender.track?.readyState === 'live';
            const hasCamera = peer.transceivers.camera.sender.track?.readyState === 'live';
            const activeVideoCount = Math.max(1, Number(hasScreen) + Number(hasCamera));
            for (let senderIndex = 0; senderIndex < peer.senders.length; senderIndex += 1) {
              const sender = peer.senders[senderIndex];
              const params = sender.getParameters();
              if (!params.encodings?.length) params.encodings = [{}];
              const senderKind = peer.senderKinds[senderIndex];
              const cap = senderKind === 'microphone' || senderKind === 'screenAudio'
                ? 64_000
                : Math.floor(target / activeVideoCount);
              params.encodings[0].maxBitrate = cap;
              await sender.setParameters(params).catch(() => undefined);
            }
            peer.appliedBitrate = target;
            peer.lastAdaptation = now;
          }
        } catch { /* individual browser stats can be unsupported */ }
      }
      const elapsed = Math.max(1, now - runtime.lastStatsAt);
      runtime.lastStatsAt = now;
      runtime.sessionBytes += sentDelta;
      runtime.lastUploadMbps = (sentDelta * 8 * 1_000) / elapsed / 1_000_000;
      setHostBytes(runtime.sessionBytes);
      setCurrentUploadBps(runtime.lastUploadMbps * 1_000_000);
      setHostMetrics(allMetrics[0] ?? null);
      refreshPeerViews();

      if (preferencesRef.current.qualityMode === 'automatic' && !preferencesRef.current.dataSaver && runtime.peers.size > 0) {
        const nextLevel = chooseAutomaticCaptureLevel({ metrics: allMetrics, current: runtime.captureLevel, currentSince: runtime.captureLevelSince, now });
        if (nextLevel !== runtime.captureLevel && now - runtime.lastTrackConstraintAt > 20_000) {
          try {
            const captureTrack = runtime.stream.getVideoTracks()[0];
            if (captureTrack) {
              await captureTrack.applyConstraints(getCaptureLevelConstraints(nextLevel, pref.contentPreference === 'motion'));
              runtime.captureLevel = nextLevel;
              runtime.captureLevelSince = now;
              runtime.lastTrackConstraintAt = now;
            }
          } catch { notify(ui.qualityLimited); }
        }
      }

      const limit = pref.sessionLimitBytes;
      if (limit && limit > 0) {
        const thresholds = getConsumptionThresholds(limit);
        const reachedThisSample: number[] = [];
        let stopAtLimit = false;
        let reduceAtLimit = false;
        for (const threshold of thresholds) {
          if (runtime.sessionBytes >= threshold && !alertedThresholds.current.has(threshold)) {
            alertedThresholds.current.add(threshold);
            reachedThisSample.push(threshold);
            if (pref.alertPolicy === 'reduce' && threshold === thresholds[0]) {
              setPreference('dataSaver', true);
              reduceAtLimit = true;
            }
            if (pref.alertPolicy === 'stop' && threshold === limit) {
              stopAtLimit = true;
              break;
            }
          }
        }
        if (reachedThisSample.length) {
          const milestones = reachedThisSample.map((item) => `${Math.round((item / limit) * 100)}%`).join(' · ');
          const action = stopAtLimit ? x.limitReached : reduceAtLimit ? x.qualityReduced : '';
          notify(`${x.limitProgress}: ${milestones} · ${formatDataAmount(runtime.sessionBytes)}${action ? ` · ${action}` : ''}`);
          if (stopAtLimit) void endHost(true);
        }
      }
    };

    const heartbeat = async () => {
      if (!active || runtime.closed) return;
      try {
        await api<{ ok: boolean }>(`/api/screenshare/rooms/${runtime.roomId}/heartbeat`, {
          method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Screenshare-Host-Token': runtime.token },
          body: JSON.stringify({ role: 'host', audioAvailable: runtime.audioAvailable, qualityMode: preferencesRef.current.dataSaver ? 'economy' : preferencesRef.current.qualityMode, cameraOn, microphoneOn }),
        });
      } catch (error) {
        if ((error as ApiError).code === 'room_ended') {
          setHostReconnectText(ui.roomExpired);
          void endHost(false);
        } else setHostReconnectText(ui.redisUnavailable);
      }
    };

    void poll();
    void heartbeat();
    void syncActivePeers();
    const statsTimer = window.setInterval(() => { void sample(); }, 2_500);
    const heartbeatTimer = window.setInterval(() => { void heartbeat(); }, 20_000);
    const peersTimer = window.setInterval(() => { void syncActivePeers(); }, 5_000);
    return () => { active = false; if (pollTimer) window.clearTimeout(pollTimer); window.clearInterval(statsTimer); window.clearInterval(heartbeatTimer); window.clearInterval(peersTimer); };
  }, [attachRemoteTrack, cameraOn, endHost, locale, microphoneOn, network.type, participantName, phase, removeRemoteParticipant, room?.roomId, sendHostSignal, notify, setPreference, ui, x]);

  useEffect(() => {
    const runtime = viewerRef.current;
    if (!runtime || phase !== 'watching') return;
    let active = true;
    const sample = async () => {
      if (!active || runtime.closed) return;
      try {
        const connections = [runtime.pc, ...Array.from(runtime.meshPeers.values(), (peer) => peer.pc)];
        const connectionStats = await Promise.all(connections.map((connection) => connection.getStats()));
        const reports = connectionStats.flatMap((stats, index) =>
          Array.from(stats.values()).map((item) => ({ ...item, id: `${index}:${item.id}` })),
        );
        const stats = connectionStats[0];
        const measured = measureInboundMediaDelta(reports as Array<{ id?: string; type?: string; kind?: string; mediaType?: string; bytesReceived?: number }>, runtime.bytes);
        runtime.bytes = measured.next;
        runtime.sessionBytes += measured.deltaBytes;
        setViewerBytes(runtime.sessionBytes);
        if (reports.some((item) => item.type === 'inbound-rtp' && Number.isFinite(item.bytesReceived) && (item.kind === 'video' || item.kind === 'audio' || item.mediaType === 'video' || item.mediaType === 'audio'))) setViewerDataMeasured(true);
        const result = computeConnectionMetrics(stats.values() as Iterable<{ id?: string; type?: string; timestamp?: number; [key: string]: unknown }>, 'inbound', baselineRef.current);
        baselineRef.current = result.baseline;
        setViewerMetrics(result.metrics);
        const pref = preferencesRef.current;
        const outgoingConnections = [{ senders: runtime.senders, kinds: runtime.senderKinds }, ...Array.from(runtime.meshPeers.values(), (peer) => ({ senders: peer.senders, kinds: peer.senderKinds }))];
        const economy = viewerEconomy || pref.dataSaver;
        const screenProfile = economy ? qualityProfiles.economy.maxBitrate : pref.qualityMode === 'automatic' ? qualityProfiles.balanced.maxBitrate : getNominalVideoBitrate(pref.qualityMode);
        const cameraBps = runtime.localStream?.getVideoTracks().some((track) => track.readyState === 'live') ? 500_000 : 0;
        const audioBps = (runtime.localStream?.getAudioTracks().some((track) => track.readyState === 'live') ? 96_000 : 0) + (runtime.screenStream?.getAudioTracks().some((track) => track.readyState === 'live') ? 64_000 : 0);
        const allocation = allocatePeerBitrate({ budgetMbps: pref.uploadBudgetMbps, activeViewers: outgoingConnections.length, profileCeilingBps: screenProfile + cameraBps, viewerPrefersEconomy: economy, audioPerViewerBps: audioBps });
        setBudgetShortfall(allocation.budgetShortfall);
        if (Date.now() - runtime.lastAdaptation >= 5_000) {
          const hasCamera = runtime.transceivers.camera.sender.track?.readyState === 'live';
          const hasScreen = runtime.transceivers.screen.sender.track?.readyState === 'live';
          const videoCount = Math.max(1, Number(hasCamera) + Number(hasScreen));
          for (const group of outgoingConnections) for (let index = 0; index < group.senders.length; index += 1) {
            const sender = group.senders[index];
            const params = sender.getParameters();
            if (!params.encodings?.length) params.encodings = [{}];
            const kind = group.kinds[index];
            params.encodings[0].maxBitrate = kind === 'microphone' || kind === 'screenAudio' ? 64_000 : Math.floor(allocation.bitrateBps / videoCount);
            await sender.setParameters(params).catch(() => undefined);
          }
          runtime.lastAdaptation = Date.now();
        }
      } catch { /* browsers may expose partial stats */ }
    };
    void sample();
    const timer = window.setInterval(() => { void sample(); }, 2_500);
    return () => { active = false; window.clearInterval(timer); };
  }, [phase, viewerEconomy]);

  useEffect(() => {
    const runtime = hostRef.current;
    if (!runtime) return;
    return () => { if (runtime.closed) return; runtime.stream.getTracks().forEach((track) => track.stop()); runtime.deviceStream?.getTracks().forEach((track) => track.stop()); runtime.peers.forEach((peer) => peer.pc.close()); };
  }, [room?.roomId]);

  useEffect(() => () => {
    const runtime = viewerRef.current;
    if (runtime) {
      runtime.closed = true;
      if (runtime.pollTimer) window.clearTimeout(runtime.pollTimer);
      if (runtime.heartbeatTimer) window.clearInterval(runtime.heartbeatTimer);
      if (runtime.rosterTimer) window.clearInterval(runtime.rosterTimer);
      if (runtime.recoveryTimer) window.clearTimeout(runtime.recoveryTimer);
      runtime.pc.close();
      runtime.meshPeers.forEach((peer) => peer.pc.close());
      runtime.localStream?.getTracks().forEach((track) => track.stop());
      runtime.screenStream?.getTracks().forEach((track) => track.stop());
    }
    localMediaRef.current?.getTracks().forEach((track) => track.stop());
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
  }, []);

  useEffect(() => {
    const runtime = hostRef.current;
    if (!runtime) return;
    setContentHint(runtime.stream, preferences.contentPreference);
    const mode = preferences.dataSaver ? 'economy' : preferences.qualityMode;
    const track = runtime.stream.getVideoTracks()[0];
    if (!track) return;
    void track.applyConstraints(getInitialCaptureConstraints(mode, !preferences.dataSaver && preferences.contentPreference === 'motion')).then(() => {
      runtime.captureLevel = preferences.dataSaver || mode === 'economy' ? 'economy' : mode === 'high' || mode === 'maximum' ? 'high' : 'balanced';
      runtime.captureLevelSince = Date.now();
      runtime.lastTrackConstraintAt = Date.now();
    }).catch(() => notify(ui.qualityLimited));
  }, [notify, preferences.contentPreference, preferences.dataSaver, preferences.qualityMode, room?.roomId, setContentHint, ui.qualityLimited]);

  const copyLink = useCallback(async () => {
    if (!room?.roomUrl) return;
    try { await navigator.clipboard.writeText(room.roomUrl); notify(ui.copied); trackEvent('result_copied', { tool: TOOL_ID.shareScreen, locale }); }
    catch { notify(ui.genericError); }
  }, [locale, notify, room, ui.copied, ui.genericError]);

  const requestViewerPreference = useCallback(async (economy: boolean) => {
    setViewerEconomy(economy);
    const runtime = viewerRef.current;
    if (!runtime) return;
    try { await sendViewerSignal(runtime, { type: 'quality-request', preference: economy ? 'economy' : 'automatic' }); }
    catch { notify(ui.genericError); }
  }, [notify, sendViewerSignal, ui.genericError]);

  const moderateViewer = useCallback(async (peerId: string, action: 'approve' | 'reject') => {
    const runtime = hostRef.current;
    if (!runtime) return;
    try {
      await api(`/api/screenshare/rooms/${runtime.roomId}/peers`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Screenshare-Host-Token': runtime.token },
        body: JSON.stringify({ peerId, action }),
      });
      setPendingPeers((current) => current.filter((peer) => peer.id !== peerId));
    } catch (error) { notify(humanError(error, ui, x)); }
  }, [notify, ui, x]);

  const fullscreen = useCallback(() => {
    const element = document.getElementById('screenshare-call-stage');
    if (!element) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void element.requestFullscreen?.();
  }, []);

  const connectedCount = peers.filter((peer) => peer.state === 'connected').length;
  const negotiatingCount = peers.filter((peer) => peer.state !== 'connected' && peer.state !== 'closed').length;
  const measuredUploadEstimate = hostDataMeasured ? getProjectedHourlyBytes(hostBytes, clock - (room?.startedAt ?? clock)) : null;
  const averagePerMinute = room && hostDataMeasured && clock - room.startedAt > 0 ? hostBytes / ((clock - room.startedAt) / 60_000) : null;
  const limitPercent = getConsumptionPercent(hostBytes, preferences.sessionLimitBytes);
  const effectiveCurrentProfileBps = preferences.dataSaver ? qualityProfiles.economy.maxBitrate : preferences.qualityMode === 'automatic' && hostRef.current
    ? (preferences.contentPreference === 'motion' && hostRef.current.captureLevel !== 'economy' ? qualityProfiles.fluid.maxBitrate : qualityProfiles[hostRef.current.captureLevel].maxBitrate)
    : getNominalVideoBitrate(preferences.qualityMode);
  const uploadEstimate = estimateUploadTraffic(
    effectiveCurrentProfileBps + (cameraOn ? 500_000 : 0),
    peers.length,
    undefined,
    (microphoneOn ? 96_000 : 0) + (capturedAudio ? 64_000 : 0),
  );
  const viewerRoomEstimate = estimateUploadTraffic(getNominalVideoBitrate(roomStatus?.qualityMode ?? 'automatic'), 1, undefined, roomStatus?.audioAvailable ? 128_000 : 0);
  const avgQuality = peers.map((peer) => peer.metrics).filter(Boolean).map((metrics) => classifyConnection(metrics!));
  const hostQuality = avgQuality.includes('unstable') ? 'unstable' : avgQuality.length && avgQuality.every((item) => item === 'excellent') ? 'excellent' : avgQuality.length ? 'stable' : 'unknown';
  const viewerQuality = viewerMetrics ? classifyConnection(viewerMetrics) : 'unknown';
  const qualityLabel = hostQuality === 'excellent' ? ui.excellent : hostQuality === 'unstable' ? ui.unstable : hostQuality === 'stable' ? ui.stable : ui.waiting;
  const viewerQualityLabel = viewerQuality === 'excellent' ? ui.excellent : viewerQuality === 'unstable' ? ui.unstable : viewerQuality === 'stable' ? ui.stable : ui.waiting;

  const qualityOptions: Array<[QualityMode, string]> = [
    ['automatic', ui.qualityAutomatic], ['economy', ui.qualityEconomy], ['balanced', ui.qualityBalanced], ['high', ui.qualityHigh], ['fluid', ui.qualityFluid], ['maximum', ui.qualityMaximum],
  ];
  const roomStateText = statusCopy(roomStatus?.state ?? '', ui);

  const renderPreferences = (isLive = false) => (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-medium text-slate-800">
          <span>{ui.qualityLabel}</span>
          <select className="mt-1.5 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm" value={preferences.qualityMode} onChange={(event) => void changeQuality(event.target.value as QualityMode)}>
            {qualityOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <label className="block text-sm font-medium text-slate-800">
          <span>{x.uploadBudget}</span>
          <select className="mt-1.5 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm" value={preferences.uploadBudgetPreset} onChange={(event) => {
            const preset = event.target.value as ShareScreenPreferences['uploadBudgetPreset'];
            setPreferences((current) => ({ ...current, uploadBudgetPreset: preset, uploadBudgetMbps: getUploadBudgetForPreset(preset) ?? current.uploadBudgetMbps }));
          }}>
            <option value="economy">{x.budgetEconomy}</option><option value="moderate">{x.budgetModerate}</option><option value="balanced">{x.budgetBalanced}</option><option value="performance">{x.budgetHigh}</option><option value="custom">{x.budgetCustom}</option>
          </select>
          {preferences.uploadBudgetPreset === 'custom' ? <input aria-label={x.uploadBudget} className="mt-2 h-10 w-full rounded-lg border border-slate-300 bg-white px-3" type="number" min="1" max="200" value={preferences.uploadBudgetMbps} onChange={(event) => setPreference('uploadBudgetMbps', Math.max(1, Math.min(200, Number(event.target.value) || 1)))} /> : null}
        </label>
        <label className="block text-sm font-medium text-slate-800">
          <span>{x.viewerLimit}</span>
          <select className="mt-1.5 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm" value={preferences.viewerLimit} onChange={(event) => isLive ? void changeViewerLimit(Number(event.target.value)) : setPreference('viewerLimit', Number(event.target.value))}>
            {Array.from({ length: Math.min(viewerLimitFromConfig, 20) }, (_, index) => index + 1).map((count) => <option key={count} value={count}>{count} / {viewerLimitFromConfig} {x.maximumViewers}</option>)}
          </select>
        </label>
        <label className="block text-sm font-medium text-slate-800">
          <span>{x.sessionDataLimit}</span>
          <select className="mt-1.5 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm" value={preferences.sessionLimitPreset} onChange={(event) => {
            const preset = event.target.value as ShareScreenPreferences['sessionLimitPreset'];
            setPreferences((current) => ({ ...current, sessionLimitPreset: preset, sessionLimitBytes: getSessionLimitForPreset(preset) }));
          }}>
            <option value="500mb">500 MB</option><option value="1gb">1 GB</option><option value="2gb">2 GB</option><option value="5gb">5 GB</option><option value="custom">{x.custom}</option><option value="unlimited">{x.unlimited}</option>
          </select>
          {preferences.sessionLimitPreset === 'custom' ? <input aria-label={x.sessionDataLimit} className="mt-2 h-10 w-full rounded-lg border border-slate-300 bg-white px-3" type="number" min="1" max="100000" placeholder="MB" value={preferences.sessionLimitBytes ? Math.round(preferences.sessionLimitBytes / 1_000_000) : ''} onChange={(event) => setPreference('sessionLimitBytes', Math.max(1, Number(event.target.value) || 1) * 1_000_000)} /> : null}
        </label>
        <label className="block text-sm font-medium text-slate-800">
          <span>{x.alertPolicy}</span>
          <select className="mt-1.5 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm" value={preferences.alertPolicy} onChange={(event) => setPreference('alertPolicy', event.target.value as ShareScreenPreferences['alertPolicy'])}>
            <option value="warn">{x.warnOnly}</option><option value="reduce">{x.reduceQuality}</option><option value="stop">{x.stopAtLimit}</option>
          </select>
        </label>
        <label className="block text-sm font-medium text-slate-800">
          <span>{x.contentType}</span>
          <select className="mt-1.5 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm" value={preferences.contentPreference} onChange={(event) => setPreference('contentPreference', event.target.value as ShareScreenPreferences['contentPreference'])}>
            <option value="automatic">{x.automatic}</option><option value="text">{x.textWork}</option><option value="motion">{x.videoGames}</option>
          </select>
        </label>
      </div>
      <label className="flex items-start gap-2 text-sm text-slate-700"><input type="checkbox" checked={preferences.dataSaver} onChange={(event) => setPreference('dataSaver', event.target.checked)} className="mt-1 accent-brand-600" /><span><span className="font-semibold text-slate-900">{x.dataSaver}</span><span className="mt-0.5 block">{ui.qualityEconomy}</span></span></label>
      <label className="flex items-start gap-2 text-sm text-slate-700"><input type="checkbox" checked={preferences.limitedConnection} onChange={(event) => setPreference('limitedConnection', event.target.checked)} className="mt-1 accent-brand-600" /><span>{x.limitedConnection}</span></label>
      <p className="text-xs leading-5 text-slate-600">{x.contentHintNote}</p>
      {isLive && budgetShortfall ? <p role="status" className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950">{x.budgetWarning}</p> : null}
      <p className="text-xs text-slate-600">{x.supportedCodecs}: {codecs.length ? codecs.join(', ') : '—'}. {ui.qualityLimited}</p>
    </div>
  );

  const renderStats = (viewer = false) => {
    const metrics = viewer ? viewerMetrics : hostMetrics;
    const rows: Array<[string, string]> = [
      [ui.connection, viewer ? viewerQualityLabel : qualityLabel],
      [ui.resolution, metrics?.width && metrics.height ? `${Math.round(metrics.width)} × ${Math.round(metrics.height)}` : '—'],
      [ui.frameRate, formatMetric(metrics?.framesPerSecond, ' FPS')],
      [ui.bitrate, formatMbps(metrics?.bitrateBps)],
      [ui.roundTrip, metrics?.roundTripMs == null ? '—' : `${Math.round(metrics.roundTripMs)} ms (RTT)`],
      [ui.packetLoss, formatMetric(metrics?.packetLossPercent, '%')],
      [ui.iceRoute, metrics?.connection === 'direct' ? ui.direct : metrics?.connection === 'relayed' ? ui.relayed : ui.unknownRoute],
      [ui.droppedFrames, metrics?.framesDropped == null ? '—' : String(metrics.framesDropped)],
    ];
    return <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{rows.map(([label, value]) => <div key={label} className="rounded-lg border border-slate-200 bg-white px-3 py-2"><p className="text-xs text-slate-500">{label}</p><p className="mt-0.5 text-sm font-semibold text-slate-900">{value}</p></div>)}</div>;
  };

  const isHostCall = Boolean(room && !initialRoomId);
  const isViewerCall = Boolean(initialRoomId && viewerPeerId && ['waiting', 'connecting', 'watching'].includes(phase));
  const inCall = isHostCall && phase === 'active' || isViewerCall;
  const selfId = isHostCall ? 'host' : viewerPeerId;
  const sharedBy = participants.find((person) => person.id === screenSharerId)?.displayName ?? (screenSharerId === 'host' ? room?.hostName ?? roomStatus?.hostName : undefined);
  const sharedStream = screenSharerId === 'host'
    ? isHostCall ? hostRef.current?.stream : remoteMedia.host?.screen
    : screenSharerId === selfId
      ? viewerRef.current?.screenStream
      : screenSharerId ? remoteMedia[screenSharerId]?.screen : null;
  const sharedAudioAvailable = isHostCall ? room?.audioAvailable : roomStatus?.audioAvailable;
  const ownCameraStream = localMediaRef.current && cameraOn ? localMediaRef.current : null;
  const remoteAudioEntries = participants.filter((person) => person.id !== selfId).flatMap((person) => {
    const media = remoteMedia[person.id];
    return [person.microphoneOn ? media?.microphone : null, screenSharerId === person.id && sharedAudioAvailable ? media?.screenAudio : null].filter((stream): stream is MediaStream => Boolean(stream)).map((stream, index) => ({ key: `${person.id}-${index}`, stream }));
  });
  const initials = (name: string) => Array.from(name.trim()).slice(0, 2).join('').toUpperCase() || '?';
  const callIdentity = (person: ParticipantView) => <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">{initials(person.displayName)}</span>;
  const callMediaButton = (label: string, active: boolean, icon: ReactNode, onClick: () => void) => (
    <Button variant={active ? 'mediaActive' : 'media'} aria-label={label} title={label} onClick={onClick} className="h-12 min-w-12 rounded-2xl px-3">
      {icon}<span className="ml-2 hidden sm:inline">{label}</span>
    </Button>
  );

  if (inCall) {
    const myPerson = participants.find((person) => person.id === selfId) ?? { id: selfId, displayName: participantName || callCopy.you, state: 'connected', cameraOn, microphoneOn };
    const connectedParticipants = participants.length || (isHostCall ? 1 : 0);
    const shareLabel = screenSharerId === selfId ? callCopy.switchScreen : callCopy.screenShare;
    const markPlayBlocked = () => setCallPlayBlocked(true);
    return (
      <div className="fixed inset-0 !mt-0 z-[100] flex h-[100dvh] w-full flex-col overflow-hidden bg-slate-950 text-white" role="application" aria-label={callCopy.roomTitle}>
        <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-slate-800 px-3 sm:px-5">
          <div className="min-w-0"><p className="truncate text-sm font-semibold">{room?.hostName ?? roomStatus?.hostName ?? callCopy.roomTitle}</p><p className="text-xs text-slate-400">{isHostCall && room ? formatDuration(room.startedAt, clock) : callCopy.roomTitle} · {connectedParticipants} {callCopy.participants.toLocaleLowerCase()}</p></div>
          <div className="flex shrink-0 items-center gap-2"><span className="inline-flex items-center gap-1.5 rounded-full bg-slate-800 px-2.5 py-1.5 text-xs text-slate-200"><span className={`h-2 w-2 rounded-full ${hostReconnectText ? 'bg-amber-400' : phase === 'watching' || phase === 'active' ? 'bg-emerald-400' : 'animate-pulse bg-amber-400'}`} />{hostReconnectText ? ui.reconnecting : phase === 'watching' || phase === 'active' ? (isHostCall ? qualityLabel : viewerQualityLabel) : ui.connecting}</span>{isHostCall ? <Button variant="media" className="h-9 px-3" onClick={() => void copyLink()}><Copy size={15} /><span className="ml-2 hidden sm:inline">{callCopy.copyInvite}</span></Button> : null}</div>
        </header>

        <div className="flex min-h-0 flex-1 gap-3 p-2 sm:gap-4 sm:p-4">
          <main className="flex min-w-0 flex-1 flex-col gap-3">
            <section id="screenshare-call-stage" className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-2xl bg-slate-900 ring-1 ring-inset ring-white/5">
              {sharedStream?.getVideoTracks().some((track) => track.readyState === 'live') ? <CallVideo stream={sharedStream} className="h-full w-full object-contain" onPlayBlocked={markPlayBlocked} /> : <div className={`grid h-full w-full content-center justify-items-center gap-3 overflow-y-auto p-3 ${participants.length > 1 ? 'grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                {participants.map((person) => {
                  const cameraStream = person.cameraOn ? person.id === selfId ? ownCameraStream : remoteMedia[person.id]?.camera : null;
                  return <article key={person.id} className="relative aspect-video w-full max-w-2xl overflow-hidden rounded-2xl bg-slate-800 ring-1 ring-inset ring-white/10">
                    {cameraStream ? <CallVideo stream={cameraStream} fit="cover" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center">{callIdentity(person)}</div>}
                    <div className="absolute inset-x-0 bottom-0 flex items-center gap-1 bg-slate-950/80 px-3 py-2 text-xs"><span className="truncate">{person.id === selfId ? callCopy.you : person.displayName}</span>{person.id === 'host' ? <span className="rounded bg-brand-700 px-1.5 py-0.5 text-[9px]">{callCopy.host}</span> : null}{person.microphoneOn ? <Mic size={13} className="ml-auto shrink-0" /> : <MicOff size={13} className="ml-auto shrink-0 text-slate-400" />}</div>
                  </article>;
                })}
                {hostReconnectText && participants.length === 0 ? <p className="text-center text-sm text-slate-300">{hostReconnectText}</p> : null}
              </div>}
              {phase === 'waiting' && admissionState === 'pending' ? <div role="status" className="absolute bottom-3 left-1/2 max-w-[calc(100%-1.5rem)] -translate-x-1/2 rounded-xl bg-slate-950/90 px-4 py-3 text-center text-sm text-white shadow-lg">{callCopy.waitingApproval}</div> : null}
              {sharedStream?.getVideoTracks().some((track) => track.readyState === 'live') ? <div className="absolute left-3 top-3 flex max-w-[calc(100%-1.5rem)] flex-wrap items-center gap-2 rounded-xl bg-slate-950/80 px-3 py-2 text-sm text-white"><MonitorUp size={15} className="shrink-0 text-brand-300" /><span className="truncate">{sharedBy ?? myPerson.displayName} · {callCopy.screenShare}</span><span className="hidden text-xs text-slate-300 sm:inline">{sharedAudioAvailable ? callCopy.audioShared : callCopy.audioNotShared}</span></div> : null}
              {callPlayBlocked ? <button type="button" onClick={() => { setSpeakerMuted(false); setPlayAudioSignal((value) => value + 1); setCallPlayBlocked(false); }} className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-lg">{ui.playWithSound}</button> : null}
              {hostReconnectText ? <div role="status" className="absolute bottom-3 right-3 max-w-[80%] rounded-xl bg-slate-950/85 px-3 py-2 text-xs text-white">{hostReconnectText}</div> : null}
              {participants.length === 0 ? <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-900/95 text-center"><span className="h-7 w-7 animate-spin rounded-full border-2 border-slate-500 border-t-brand-300" /><p className="max-w-sm px-5 text-sm text-slate-300">{hostReconnectText || callCopy.connectingPeople}</p></div> : null}
            </section>

            {sharedStream?.getVideoTracks().some((track) => track.readyState === 'live') ? <div className="flex h-[5.5rem] shrink-0 gap-2 overflow-x-auto pb-1 sm:h-28 sm:justify-center">
              {participants.map((person) => {
                const cameraStream = person.cameraOn ? person.id === selfId ? ownCameraStream : remoteMedia[person.id]?.camera : null;
                return <div key={person.id} className="relative h-full w-24 shrink-0 overflow-hidden rounded-xl bg-slate-900 ring-1 ring-inset ring-white/10 sm:w-36">
                  {cameraStream ? <CallVideo stream={cameraStream} fit="cover" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center">{callIdentity(person)}</div>}
                  <div className="absolute inset-x-0 bottom-0 flex items-center gap-1 bg-slate-950/80 px-2 py-1.5 text-[11px]"><span className="truncate">{person.id === selfId ? callCopy.you : person.displayName}</span>{person.id === 'host' ? <span className="shrink-0 rounded bg-brand-700 px-1 py-0.5 text-[9px]">{callCopy.host}</span> : null}</div>
                  {person.id === selfId && !microphoneOn || person.id !== selfId && !person.microphoneOn ? <span className="absolute right-1.5 top-1.5 rounded-md bg-slate-950/80 p-1 text-slate-300"><MicOff size={12} /></span> : null}
                </div>;
              })}
            </div> : null}
          </main>

          {hostCallPanel ? <aside className="absolute inset-x-2 bottom-24 top-16 z-20 overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-4 md:relative md:inset-auto md:z-auto md:w-72 md:shrink-0">
            <div className="mb-4 flex items-center justify-between"><h2 className="font-semibold">{hostCallPanel === 'participants' ? callCopy.participants : hostCallPanel === 'settings' ? callCopy.settings : ui.diagnostics}</h2><button type="button" onClick={() => setHostCallPanel(null)} aria-label={ui.hideDiagnostics} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"><X size={17} /></button></div>
          {hostCallPanel === 'participants' ? <div className="space-y-2">
              {isHostCall && room ? <div className="mb-4 rounded-xl border border-slate-700 p-3"><p className="text-xs text-slate-400">{callCopy.roomPrivacy}</p><p className="mt-1 text-sm font-medium">{room.access === 'private' ? callCopy.privateRoom : callCopy.publicRoom}</p><div className="mt-2 flex gap-2"><input aria-label={callCopy.copyInvite} readOnly value={room.roomUrl} className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-950 px-2 text-xs text-slate-200" onFocus={(event) => event.currentTarget.select()} /><button type="button" onClick={() => void copyLink()} aria-label={callCopy.copyInvite} className="rounded-lg bg-slate-800 px-2 text-white hover:bg-slate-700"><Copy size={15} /></button></div></div> : null}
              {pendingPeers.length ? <div className="mb-3"><p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{callCopy.pendingRequests}</p>{pendingPeers.map((peer) => <div key={peer.id} className="mb-2 rounded-xl bg-slate-800 p-3"><p className="truncate text-sm font-medium">{peer.displayName}</p><p className="mb-3 mt-1 text-xs text-slate-400">{callCopy.approvalRequest}</p><div className="flex gap-2"><Button className="h-8 flex-1 px-2 text-xs" onClick={() => void moderateViewer(peer.id, 'approve')}>{callCopy.approve}</Button><Button variant="media" className="h-8 px-2 text-xs" onClick={() => void moderateViewer(peer.id, 'reject')}>{callCopy.reject}</Button></div></div>)}</div> : null}
              {participants.map((person) => <div key={person.id} className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-slate-800">{callIdentity(person)}<div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{person.id === selfId ? callCopy.you : person.displayName}</p><p className="text-xs text-slate-400">{person.id === 'host' ? callCopy.host : person.state === 'connected' ? ui.stable : ui.connecting}</p></div>{person.microphoneOn ? <Mic size={15} className="text-slate-300" /> : <MicOff size={15} className="text-slate-500" />}</div>)}
              {participants.length <= 1 ? <p className="px-2 py-3 text-sm text-slate-400">{callCopy.waitingForPeople}</p> : null}
            </div> : hostCallPanel === 'stats' ? <div className="space-y-3 text-slate-900"><div className="rounded-xl bg-white p-3">{renderStats(!isHostCall)}</div><p className="text-xs leading-5 text-slate-400">{ui.statsNote}</p>{isHostCall ? <div className="rounded-xl border border-slate-700 p-3 text-sm text-slate-200"><p>{x.currentRate}: {hostDataMeasured ? formatMbps(currentUploadBps) : ui.notMeasured}</p><p className="mt-1">{x.dataSent}: {hostDataMeasured ? formatDataAmount(hostBytes) : ui.notMeasured}</p><p className="mt-1">{x.projectedHour}: {measuredUploadEstimate == null ? '—' : `${formatDataAmount(measuredUploadEstimate)} / h`}</p></div> : <p className="text-sm text-slate-300">{x.viewerData}: {viewerDataMeasured ? formatDataAmount(viewerBytes) : ui.notMeasured}</p>}</div> : <div className="space-y-4">{isHostCall ? <div className="rounded-xl bg-white p-3">{renderPreferences(true)}</div> : <div className="space-y-3 rounded-xl border border-slate-700 p-3"><label className="flex items-start gap-2 text-sm text-slate-200"><input type="checkbox" checked={viewerEconomy} onChange={(event) => void requestViewerPreference(event.target.checked)} className="mt-1 accent-brand-500" /><span><span className="font-semibold">{x.economyViewer}</span><span className="mt-1 block text-xs leading-5 text-slate-400">{x.mediaOnly}</span></span></label><p className="text-sm text-slate-300">{x.currentRate}: {formatMbps(viewerMetrics?.bitrateBps)} · {x.viewerData}: {viewerDataMeasured ? formatDataAmount(viewerBytes) : ui.notMeasured}</p></div>}<label className="flex items-center gap-2 text-sm text-slate-200"><input type="checkbox" checked={speakerMuted} onChange={(event) => setSpeakerMuted(event.target.checked)} />{callCopy.speakers}</label><label className="block text-xs text-slate-300">{ui.volume}<input className="mt-2 w-full accent-brand-500" type="range" min="0" max="1" step="0.05" value={speakerVolume} onChange={(event) => setSpeakerVolume(Number(event.target.value))} /></label><p className="text-xs leading-5 text-slate-400">{callCopy.screenMobileNote}</p></div>}
          </aside> : null}
        </div>

        <footer className="flex min-h-20 shrink-0 flex-wrap items-center justify-center gap-2 border-t border-slate-800 bg-slate-950/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 sm:gap-3 sm:px-4">
          {callMediaButton(microphoneOn ? callCopy.microphone : callCopy.microphoneOff, microphoneOn, microphoneOn ? <Mic size={18} /> : <MicOff size={18} />, () => void toggleLocalDevice('microphone'))}
          {callMediaButton(cameraOn ? callCopy.camera : callCopy.cameraOff, cameraOn, cameraOn ? <Camera size={18} /> : <CameraOff size={18} />, () => void toggleLocalDevice('camera'))}
          {callMediaButton(shareLabel, screenSharerId === selfId, <MonitorUp size={18} />, startScreenShare)}
          {screenSharerId === selfId ? callMediaButton(callCopy.stopScreen, false, <Square size={16} />, () => void stopScreenShare()) : null}
          {callMediaButton(callCopy.speakers, !speakerMuted, speakerMuted ? <VolumeX size={18} /> : <Volume2 size={18} />, () => setSpeakerMuted((value) => !value))}
          <Button variant="media" aria-label={fullscreenActive ? ui.exitFullscreen : ui.fullscreen} title={fullscreenActive ? ui.exitFullscreen : ui.fullscreen} onClick={fullscreen} className="h-12 min-w-12 rounded-2xl px-3"><Maximize2 size={18} /></Button>
          <Button variant="media" aria-label={callCopy.participants} title={callCopy.participants} onClick={() => setHostCallPanel((current) => current === 'participants' ? null : 'participants')} className="h-12 min-w-12 rounded-2xl px-3"><UsersRound size={18} /><span className="ml-2 hidden sm:inline">{participants.length}</span></Button>
          <Button variant="media" aria-label={ui.diagnostics} title={ui.diagnostics} onClick={() => setHostCallPanel((current) => current === 'stats' ? null : 'stats')} className="hidden h-12 min-w-12 rounded-2xl px-3 sm:inline-flex"><Activity size={18} /></Button>
          {isHostCall ? <Button variant="mediaDanger" className="h-12 rounded-2xl px-4" onClick={() => void endHost(true)} aria-label={callCopy.endCall} title={callCopy.endCall}><PhoneOff size={18} /><span className="ml-2 hidden sm:inline">{callCopy.endCall}</span></Button> : <Button variant="mediaDanger" className="h-12 rounded-2xl px-4" onClick={() => { void closeViewer(true); setPhase('idle'); setViewerPeerId(''); setAdmissionState(null); }} aria-label={callCopy.leaveCall} title={callCopy.leaveCall}><PhoneOff size={18} /><span className="ml-2 hidden sm:inline">{callCopy.leaveCall}</span></Button>}
        </footer>
        {remoteAudioEntries.map((entry) => <CallAudio key={entry.key} stream={entry.stream} muted={speakerMuted} volume={speakerVolume} playSignal={playAudioSignal} onBlocked={markPlayBlocked} />)}
        {toast ? <div role="status" aria-live="polite" className="fixed bottom-24 left-1/2 z-[110] max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-lg bg-slate-800 px-4 py-3 text-sm text-white shadow-lg">{toast}</div> : null}
      </div>
    );
  }

  if (initialRoomId) {
    return (
      <div className="mx-auto w-full max-w-6xl space-y-5">
        <Card className="mx-auto max-w-2xl space-y-5 p-5 md:p-8">
          <div><p className="text-xs font-semibold uppercase tracking-wide text-brand-700">{ui.eyebrow}</p><h2 className="mt-2 text-2xl font-bold text-slate-900">{roomStatus?.hostName ?? callCopy.roomTitle}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{roomStatus?.access === 'private' ? callCopy.privateRoomDescription : callCopy.publicRoomDescription}</p></div>
          {phase === 'connecting' && !viewerPeerId ? <p role="status" className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">{ui.preparingVideo}</p> : null}
          {phase === 'waiting' && !viewerPeerId ? <p role="status" className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">{callCopy.waitingHost}</p> : null}
          {phase === 'idle' && roomStatus?.state === 'active' ? <>
            <label className="block text-sm font-medium text-slate-800">{callCopy.displayName}<input autoComplete="nickname" maxLength={32} value={participantName} onChange={(event) => setParticipantName(event.target.value)} placeholder={callCopy.displayNamePlaceholder} className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm" /></label>
            <div className="grid gap-2 sm:grid-cols-2"><Button variant="secondary" onClick={() => void toggleLocalDevice('microphone')}><Mic size={16} /><span className="ml-2">{microphoneOn ? callCopy.microphone : callCopy.microphoneOff}</span></Button><Button variant="secondary" onClick={() => void toggleLocalDevice('camera')}><Camera size={16} /><span className="ml-2">{cameraOn ? callCopy.camera : callCopy.cameraOff}</span></Button></div>
            {roomStatus.access === 'private' ? <p className="rounded-lg bg-brand-50 p-3 text-sm text-brand-900"><LockKeyhole size={15} className="mr-2 inline" />{callCopy.privateRoomDescription}</p> : null}
            <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4"><label className="flex items-center gap-2 text-sm font-medium text-slate-800"><input type="checkbox" checked={viewerEconomy} onChange={(event) => setViewerEconomy(event.target.checked)} className="accent-brand-600" />{x.economyViewer}</label><p className="text-xs leading-5 text-slate-600">{x.usageEstimate}: {viewerRoomEstimate.totalMbps.toFixed(1)} Mbps · {viewerRoomEstimate.totalGBPerHour.toFixed(2)} GB/h {x.estimated}. {x.mediaOnly}</p></div>
            <p className="text-xs leading-5 text-slate-500">{ui.p2pPrivacy}</p>
            <Button disabled={!participantName.trim()} onClick={() => { trackEvent('tool_started', { tool: TOOL_ID.shareScreen, locale, mode: viewerEconomy ? 'economy' : 'automatic' }); void connectViewer(initialRoomId, viewerEconomy); }}><UsersRound size={17} /><span className="ml-2">{callCopy.joinCall}</span></Button>
          </> : null}
          {(phase === 'error' || phase === 'ended') || errorText ? <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">{errorText || roomStateText || ui.roomEnded}<div className="mt-3"><Button variant="secondary" onClick={() => { setPhase('idle'); setErrorText(''); setAdmissionState(null); }}>{ui.retry}</Button></div></div> : null}
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5">
      {phase === 'active' && room ? <>
        <Card className="overflow-hidden p-0">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 md:px-5">
            <div className="flex items-center gap-3"><span className="relative flex h-3 w-3"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" /><span className="relative inline-flex h-3 w-3 rounded-full bg-rose-600" /></span><div><h2 className="font-bold text-slate-900">{ui.roomActive}</h2><p className="text-xs text-slate-500">{ui.elapsed}: {formatDuration(room.startedAt, clock)}</p></div></div>
            <div className="flex flex-wrap items-center gap-2 text-sm"><span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-slate-700"><UsersRound size={15} />{connectedCount}/{room.viewerLimit} {ui.viewers}</span><span className="rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-800">{qualityLabel}</span></div>
          </div>
          <div className="relative aspect-video max-h-[70vh] bg-slate-950"><video ref={hostVideoRef} autoPlay muted playsInline className="h-full w-full object-contain" aria-label={ui.hostPreview} />{peers.length === 0 ? <div className="absolute inset-x-0 bottom-4 mx-auto w-fit rounded-lg bg-slate-900/80 px-3 py-2 text-sm text-white">{ui.waitingViewers}</div> : null}</div>
          <div className="grid gap-4 p-4 md:grid-cols-[minmax(0,1fr)_auto] md:px-5">
            <div className="min-w-0 space-y-2"><label className="text-xs font-semibold uppercase tracking-wide text-slate-500">{ui.shareLink}</label><div className="flex min-w-0 gap-2"><input readOnly value={room.roomUrl} className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-slate-50 px-3 text-sm text-slate-800" onFocus={(event) => event.currentTarget.select()} /><Button variant="secondary" onClick={() => void copyLink()}><Copy size={16} /><span className="ml-2 hidden sm:inline">{ui.copyLink}</span></Button></div></div>
            <div className="flex flex-wrap items-end gap-2"><Button variant="secondary" onClick={() => setSettingsOpen(!settingsOpen)}><Gauge size={16} /><span className="ml-2">{ui.settings}</span></Button><Button variant="secondary" onClick={() => setDiagnosticsOpen(!diagnosticsOpen)}><Activity size={16} /><span className="ml-2">{ui.diagnostics}</span></Button><Button className="bg-rose-700 hover:bg-rose-800 focus-visible:ring-rose-500" onClick={() => void endHost(true)}><Square size={15} /><span className="ml-2">{ui.endRoom}</span></Button></div>
          </div>
        </Card>
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-bold text-slate-900">{ui.roomActive}</h3><p className="mt-1 text-sm text-slate-600">{x.currentRate}: {formatMbps(hostDataMeasured ? currentUploadBps : null)} · {x.dataSent}: {hostDataMeasured ? formatDataAmount(hostBytes) : ui.notMeasured}</p></div><span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">{ui.audio}: {capturedAudio ? ui.audioPresent : ui.audioMissing}</span></div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[[x.averageMinute, averagePerMinute == null ? '—' : `${formatDataAmount(averagePerMinute)} / min`], [x.projectedHour, measuredUploadEstimate == null ? '—' : `${formatDataAmount(measuredUploadEstimate)} / h`], [x.budgetTarget, `${preferences.uploadBudgetMbps} Mbps`], [ui.elapsed, formatDuration(room.startedAt, clock)]].map(([label, value]) => <div key={label} className="rounded-lg bg-slate-50 p-3"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 text-base font-semibold text-slate-900">{value}</p></div>)}</div>
            {!hostDataMeasured ? <p role="status" className="mt-3 text-xs text-slate-500">{ui.notMeasured}</p> : null}
            {limitPercent != null ? <div className="mt-4"><div className="mb-1 flex justify-between text-xs text-slate-600"><span>{x.limitProgress}</span><span>{Math.round(limitPercent)}% · {formatDataAmount(preferences.sessionLimitBytes ?? 0)}</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${Math.min(100, limitPercent)}%` }} /></div></div> : null}
            <p className="mt-3 text-sm text-slate-700">{x.usageEstimate}: {uploadEstimate.totalMbps.toFixed(1)} Mbps · {uploadEstimate.totalGBPerHour.toFixed(2)} GB/h {x.estimated}</p>
            <p className="mt-4 text-xs leading-5 text-slate-500">{x.mediaOnly} {x.overhead}: {uploadEstimate.overheadGBPerHour.toFixed(2)} GB/h {x.estimated}.</p>
          </Card>
          <Card><h3 className="flex items-center gap-2 font-bold text-slate-900"><UsersRound size={17} />{ui.viewers}</h3><div className="mt-3 space-y-2">{peers.length ? peers.map((peer, index) => <div key={peer.id} className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm"><span className="text-slate-700">{ui.spectator} {index + 1}</span><span className="text-xs text-slate-600">{peer.state === 'connected' ? (peer.metrics ? classifyConnection(peer.metrics) : ui.waiting) : ui.connecting}</span></div>) : <p className="text-sm text-slate-600">{ui.waitingViewers}</p>}<p className="border-t border-slate-100 pt-2 text-xs text-slate-500">{negotiatingCount} {ui.negotiating}</p></div></Card>
        </div>
        {budgetExceeded ? <div role="status" className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950"><AlertTriangle size={18} className="mt-0.5 shrink-0" />{budgetEstimateNotice[locale]}</div> : null}
        {budgetShortfall ? <div role="alert" className="flex flex-wrap items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950"><AlertTriangle size={18} className="mt-0.5 shrink-0" /><span className="min-w-0 flex-1">{x.budgetWarning}</span><Button variant="secondary" className="shrink-0" onClick={() => { setPreference('dataSaver', true); void changeQuality('economy'); }}>{ui.qualityEconomy}</Button><Button variant="ghost" className="shrink-0" onClick={() => void changeViewerLimit(Math.max(1, connectedCount))}>{x.viewerLimit}</Button></div> : null}
        {hostReconnectText ? <p role="status" className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">{hostReconnectText}</p> : null}
        {settingsOpen ? <Card><h3 className="mb-3 font-bold text-slate-900">{ui.settings}</h3>{renderPreferences(true)}</Card> : null}
        {diagnosticsOpen ? <Card className="space-y-4"><h3 className="font-bold text-slate-900">{ui.diagnostics}</h3>{renderStats()}<p className="text-xs leading-5 text-slate-500">{ui.statsNote} {x.mediaOnly}</p></Card> : null}
      </> : <>
        <Card className="relative overflow-hidden border-brand-100 bg-white p-5 md:p-8">
          <div className="absolute right-6 top-6 hidden rounded-2xl bg-brand-50 p-4 text-brand-700 md:block"><MonitorUp size={34} /></div>
          <div className="max-w-3xl"><span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-800"><Wifi size={14} />{ui.eyebrow}</span><h2 className="mt-4 max-w-2xl text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">{ui.startTitle}</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">{ui.startDescription}</p><div className="mt-5 flex flex-wrap gap-2"><span className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-700">{ui.noAccount}</span><span className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-700">{ui.noInstall}</span><span className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-700">WebRTC P2P</span></div></div>
          <div className="mt-6 grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-2 md:p-5">
            <label className="block text-sm font-medium text-slate-800">{callCopy.displayName}<input autoComplete="nickname" maxLength={32} required value={participantName} onChange={(event) => setParticipantName(event.target.value)} placeholder={callCopy.displayNamePlaceholder} className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm" /></label>
            <fieldset><legend className="mb-1.5 text-sm font-medium text-slate-800">{callCopy.roomPrivacy}</legend><div className="grid grid-cols-2 gap-2"><button type="button" aria-pressed={roomAccess === 'public'} onClick={() => setRoomAccess('public')} className={`rounded-lg border px-3 py-2.5 text-left text-sm ${roomAccess === 'public' ? 'border-brand-300 bg-brand-50 text-brand-800' : 'border-slate-300 bg-white text-slate-700'}`}><span className="block font-semibold">{callCopy.publicRoom}</span><span className="mt-1 block text-xs leading-4">{callCopy.publicRoomDescription}</span></button><button type="button" aria-pressed={roomAccess === 'private'} onClick={() => setRoomAccess('private')} className={`rounded-lg border px-3 py-2.5 text-left text-sm ${roomAccess === 'private' ? 'border-brand-300 bg-brand-50 text-brand-800' : 'border-slate-300 bg-white text-slate-700'}`}><span className="block font-semibold">{callCopy.privateRoom}</span><span className="mt-1 block text-xs leading-4">{callCopy.privateRoomDescription}</span></button></div></fieldset>
            <div className="flex flex-wrap items-center gap-2 md:col-span-2"><Button variant="secondary" onClick={() => void toggleLocalDevice('microphone')}><Mic size={16} /><span className="ml-2">{microphoneOn ? callCopy.microphone : callCopy.microphoneOff}</span></Button><Button variant="secondary" onClick={() => void toggleLocalDevice('camera')}><Camera size={16} /><span className="ml-2">{cameraOn ? callCopy.camera : callCopy.cameraOff}</span></Button></div>
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 md:p-5"><div className="flex items-start gap-3"><ShieldCheck size={22} className="mt-0.5 shrink-0 text-brand-700" /><div><h3 className="font-semibold text-slate-900">{ui.p2pNote}</h3><p className="mt-1 text-sm leading-6 text-slate-600">{ui.connectivityNotice}</p><p className="mt-2 text-xs leading-5 text-slate-500">{x.network}: {connectionLabel}{network.saveData ? ` · ${x.saveData}` : ''}</p></div></div>
              {phase === 'confirm' ? <div className="mt-4 space-y-4 rounded-xl border border-amber-300 bg-amber-50 p-4" role="region" aria-labelledby="screenshare-warning-title"><div className="flex items-start gap-3"><AlertTriangle size={21} className="mt-0.5 shrink-0 text-amber-800" /><div><h3 id="screenshare-warning-title" className="font-bold text-amber-950">{x.warningTitle}</h3><p className="mt-1 text-sm leading-6 text-amber-900">{x.warningBody}</p></div></div><p className="text-sm font-semibold text-amber-950">{x.usageEstimate}: {roomEstimate.totalMbps.toFixed(1)} Mbps · {roomEstimate.totalGBPerHour.toFixed(2)} GB/h {x.estimated} ({roomEstimate.mediaGBPerHour.toFixed(2)} GB/h mídia + {roomEstimate.overheadGBPerHour.toFixed(2)} GB/h {x.overhead}). {preferences.viewerLimit} {ui.viewers}.</p><p className="text-xs leading-5 text-amber-900">{x.dataUseNotice}</p><p className="text-sm font-medium text-amber-950">{x.sessionDataLimit}: {preferences.sessionLimitBytes ? formatDataAmount(preferences.sessionLimitBytes) : x.unlimited} · {preferences.alertPolicy === 'stop' ? x.stopAtLimit : preferences.alertPolicy === 'reduce' ? x.reduceQuality : x.warnOnly}</p>{roomEstimate.totalMbps > preferences.uploadBudgetMbps ? <p className="rounded-lg bg-amber-100 p-3 text-sm font-medium text-amber-950">{budgetEstimateNotice[locale]}</p> : null}{risk ? <p className="rounded-lg bg-amber-100 p-3 text-sm font-medium text-amber-950">{riskMessage}</p> : null}<label className="flex items-center gap-2 text-sm text-amber-950"><input type="checkbox" checked={rememberConfirmation} onChange={(event) => setRememberConfirmation(event.target.checked)} />{x.rememberChoice}</label><div className="flex flex-wrap gap-2"><Button onClick={() => confirmAndStart(false)}>{x.continueChosen}</Button><Button variant="secondary" onClick={() => confirmAndStart(true)}>{x.startEconomy}</Button><Button variant="ghost" onClick={() => setPhase('idle')}>{x.adjustSettings}</Button></div></div> : null}
              {phase === 'confirm' ? <div className="mt-3 space-y-2 rounded-lg bg-slate-100 p-3"><p className="text-xs leading-5 text-slate-600">{x.hotspotNotice}</p><label className="flex items-center gap-2 text-sm text-slate-800"><input type="checkbox" checked={preferences.limitedConnection} onChange={(event) => setPreference('limitedConnection', event.target.checked)} className="accent-brand-600" />{x.limitedConnection}</label></div> : null}
              {phase === 'error' ? <p role="alert" className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">{errorText}</p> : null}
              {phase !== 'confirm' && phase !== 'starting' ? <Button disabled={!participantName.trim()} className="mt-5" onClick={() => {
                let remembered = false;
                try { remembered = localStorage.getItem('adtools.share-screen.confirm.v1') === getConfirmationKey(preferences, `${network.type}:${network.saveData ?? 'unknown'}`); } catch { /* storage can be disabled */ }
                if (remembered) { setRememberConfirmation(true); confirmAndStart(false); }
                else setPhase('confirm');
              }}><MonitorUp size={17} /><span className="ml-2">{ui.startButton}</span></Button> : null}
              {phase === 'starting' ? <Button className="mt-5" disabled><span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent" />{ui.preparingVideo}</Button> : null}
            </div>
            <div className="space-y-3"><button type="button" className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-800" aria-expanded={settingsOpen} onClick={() => setSettingsOpen(!settingsOpen)}><span className="inline-flex items-center gap-2"><Gauge size={17} />{ui.advanced}</span><ChevronDown size={16} className={settingsOpen ? 'rotate-180 transition' : 'transition'} /></button>{settingsOpen ? renderPreferences() : <p className="px-1 text-xs leading-5 text-slate-500">{x.dataUseNotice}</p>}<div className="rounded-lg border border-slate-200 p-3 text-sm"><p className="font-semibold text-slate-900">{x.usageEstimate}</p><p className="mt-1 text-slate-700">{roomEstimate.totalMbps.toFixed(1)} Mbps · {roomEstimate.totalGBPerHour.toFixed(2)} GB/h</p><p className="mt-1 text-xs text-slate-500">{roomEstimate.mediaGBPerHour.toFixed(2)} GB/h mídia + {roomEstimate.overheadGBPerHour.toFixed(2)} GB/h {x.overhead}</p><p className="mt-2 text-xs leading-5 text-slate-500">{audioEstimateNotice[locale]}</p></div><p className="text-xs leading-5 text-slate-500">{ui.p2pPrivacy}</p></div>
          </div>
        </Card>
        {errorText && phase !== 'error' ? <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">{errorText}</p> : null}
      </>}
      {toast ? <div role="status" aria-live="polite" className="fixed bottom-4 left-1/2 z-50 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-lg bg-slate-900 px-4 py-3 text-sm text-white shadow-lg">{toast}</div> : null}
    </div>
  );
}
