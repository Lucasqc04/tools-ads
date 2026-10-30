'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Camera, Check, Copy, Expand, LoaderCircle, MonitorPlay, Smartphone, Wifi, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TOOL_ID, trackEvent } from '@/lib/analytics';
import { getCelularWebcamUiCopy } from '@/data/i18n/celular-como-webcam';
import type { AppLocale } from '@/lib/i18n/config';
import {
  WebcamApiError,
  closeWebcamSessionRequest,
  getWebcamIceServersRequest,
  pollWebcamSignalRequest,
  sendWebcamSignalRequest,
  webcamRequest,
  type WebcamStats,
} from '@/lib/celular-webcam/client';
import type { WebcamSignal } from '@/lib/celular-webcam/protocol';

type Props = {
  locale: AppLocale;
  embedded?: boolean;
  open?: boolean;
  anchorElement?: HTMLElement | null;
  embeddedTheme?: 'light' | 'dark';
  audioAllowed?: boolean;
  onRemoteStreamChange?: (stream: MediaStream | null) => void;
  onClose?: () => void;
};
type HostStatus = 'idle' | 'creating' | 'waiting' | 'requested' | 'connecting' | 'connected' | 'reconnecting' | 'ended' | 'error';
type PopoverPosition = { left: number; top?: number; bottom?: number; maxHeight: number; arrowLeft: number; placement: 'above' | 'below' };
type InboundVideoStats = { kind?: string; mediaType?: string; frameWidth?: number; frameHeight?: number; framesPerSecond?: number; bytesReceived?: number; packetsLost?: number; packetsReceived?: number };
type CandidatePairStats = { state?: string; selected?: boolean; nominated?: boolean; currentRoundTripTime?: number; localCandidateId?: string };

const sessionErrorType = (error: unknown) => error instanceof WebcamApiError && error.code === 'service_unavailable' ? 'network_error' : 'processing_failed';

export function CelularComoWebcamTool({ locale, embedded = false, open = true, anchorElement, embeddedTheme = 'light', audioAllowed, onRemoteStreamChange, onClose }: Props) {
  const copy = getCelularWebcamUiCopy(locale);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const receiveAudio = embedded ? false : (audioAllowed ?? audioEnabled);
  const [status, setStatus] = useState<HostStatus>('idle');
  const [portalReady, setPortalReady] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState<PopoverPosition | null>(null);
  const [sessionId, setSessionId] = useState('');
  const [phoneUrl, setPhoneUrl] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [stats, setStats] = useState<WebcamStats>({ resolution: null, fps: null, bitrateBps: null, packetLossPercent: null, roundTripMs: null, route: null });
  const [showStats, setShowStats] = useState(true);
  const [audioOn, setAudioOn] = useState(false);
  const [videoFit, setVideoFit] = useState<'contain' | 'cover'>('contain');
  const [cleanWindowOpen, setCleanWindowOpen] = useState(false);
  const [qrLib, setQrLib] = useState<typeof import('qr-code-styling') | null>(null);
  const popoverRef = useRef<HTMLElement>(null);
  const qrContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const hostTokenRef = useRef('');
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);
  const cleanWindowRef = useRef<Window | null>(null);
  const cleanVideoRef = useRef<HTMLVideoElement | null>(null);
  const pollErrorCountRef = useRef(0);
  const autoStartRef = useRef(false);
  const statusRef = useRef(status);
  const isEnded = status === 'ended';
  const qrTargetReady = !embedded || (open && popoverPosition !== null);
  const pauseHiddenSession = embedded && !open && (status === 'waiting' || status === 'requested' || status === 'error');
  const completedEventRef = useRef(false);
  statusRef.current = status;

  const signal = useCallback((message: WebcamSignal) => {
    if (!sessionId || !hostTokenRef.current) return Promise.reject(new Error('missing_credentials'));
    return sendWebcamSignalRequest(sessionId, 'host', hostTokenRef.current, message);
  }, [sessionId]);

  useEffect(() => { import('qr-code-styling').then((mod) => setQrLib(mod)); }, []);
  useEffect(() => { setPortalReady(true); }, []);

  useEffect(() => {
    if (!qrTargetReady || !qrLib || !phoneUrl || !qrContainerRef.current) return;
    const container = qrContainerRef.current;
    container.replaceChildren();
    const qrSize = embedded ? 168 : 240;
    const qr = new qrLib.default({
      width: qrSize,
      height: qrSize,
      data: phoneUrl,
      margin: 4,
      dotsOptions: { color: '#0f172a', type: 'square' },
      backgroundOptions: { color: '#ffffff' },
      cornersSquareOptions: { color: '#0f172a' },
      cornersDotOptions: { color: '#0f172a' },
      qrOptions: { errorCorrectionLevel: 'M' },
    });
    qr.append(container);
  }, [embedded, phoneUrl, qrLib, qrTargetReady]);

  const publishRemoteStream = useCallback((stream: MediaStream | null) => {
    remoteStreamRef.current = stream;
    setRemoteStream(stream);
    onRemoteStreamChange?.(stream);
  }, [onRemoteStreamChange]);

  const closeCleanWindow = useCallback(() => {
    const popup = cleanWindowRef.current;
    if (popup && !popup.closed) popup.close();
    cleanWindowRef.current = null;
    cleanVideoRef.current = null;
    setCleanWindowOpen(false);
  }, []);

  const clearPeer = useCallback(() => {
    const peer = peerRef.current;
    if (peer) {
      peer.ontrack = null;
      peer.onicecandidate = null;
      peer.onconnectionstatechange = null;
      peer.close();
      peerRef.current = null;
    }
    pendingCandidatesRef.current = [];
    publishRemoteStream(null);
    closeCleanWindow();
  }, [closeCleanWindow, publishRemoteStream]);

  const createPeer = useCallback(async () => {
    if (peerRef.current) return peerRef.current;
    const { iceServers } = await getWebcamIceServersRequest(sessionId, 'host', hostTokenRef.current);
    const peer = new RTCPeerConnection({ iceServers, iceCandidatePoolSize: 2 });
    peerRef.current = peer;
    peer.addTransceiver('video', { direction: 'recvonly' });
    if (receiveAudio) peer.addTransceiver('audio', { direction: 'recvonly' });
    peer.onicecandidate = (event) => {
      if (!event.candidate) return;
      const candidate = event.candidate.toJSON();
      if (candidate.candidate) void signal({ type: 'candidate', candidate: { ...candidate, candidate: candidate.candidate } }).catch(() => undefined);
    };
    peer.ontrack = (event) => {
      let stream = event.streams[0];
      if (!stream) {
        stream = remoteStreamRef.current ?? new MediaStream();
        if (!stream.getTracks().some((track) => track.id === event.track.id)) stream.addTrack(event.track);
      }
      publishRemoteStream(stream);
    };
    peer.onconnectionstatechange = () => {
      if (peer.connectionState === 'connected') {
        setStatus('connected');
        setError('');
        if (!completedEventRef.current) {
          completedEventRef.current = true;
          trackEvent('tool_completed', { tool: TOOL_ID.celularComoWebcam, locale, mode: embedded ? 'call' : 'webcam' });
        }
      } else if (peer.connectionState === 'connecting') {
        setStatus('connecting');
      } else if (peer.connectionState === 'disconnected' || peer.connectionState === 'failed') {
        setStatus('reconnecting');
      }
    };
    return peer;
  }, [embedded, locale, publishRemoteStream, receiveAudio, sessionId, signal]);

  const acceptOffer = useCallback(async (description: RTCSessionDescriptionInit) => {
    const peer = await createPeer();
    if (peer.signalingState !== 'stable' && peer.signalingState !== 'have-local-offer') return;
    await peer.setRemoteDescription(description);
    for (const candidate of pendingCandidatesRef.current.splice(0)) await peer.addIceCandidate(candidate).catch(() => undefined);
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    if (!peer.localDescription) throw new Error('answer_unavailable');
    await signal({ type: 'answer', description: { type: 'answer', sdp: peer.localDescription.sdp ?? '' } });
    setStatus('connecting');
  }, [createPeer, signal]);

  const handleSignal = useCallback(async (message: WebcamSignal) => {
    if (message.type === 'request') {
      setStatus('requested');
    } else if (message.type === 'offer') {
      await acceptOffer(message.description);
    } else if (message.type === 'candidate') {
      const peer = peerRef.current;
      if (peer?.remoteDescription) await peer.addIceCandidate(message.candidate).catch(() => undefined);
      else pendingCandidatesRef.current.push(message.candidate);
    } else if (message.type === 'state' && message.state === 'connected') {
      setStatus('connected');
    } else if (message.type === 'bye') {
      setStatus('ended');
      clearPeer();
    }
  }, [acceptOffer, clearPeer]);

  useEffect(() => {
    if (!sessionId || !hostTokenRef.current || isEnded || pauseHiddenSession) return;
    let active = true;
    let timer = 0;
    let delay = 800;
    const poll = async () => {
      try {
        const result = await pollWebcamSignalRequest(sessionId, 'host', hostTokenRef.current);
        if (!active) return;
        pollErrorCountRef.current = 0;
        if (result.status === 'closed' || result.status === 'expired') {
          setStatus('ended');
          setError(copy.sessionEnded);
          clearPeer();
          return;
        }
        if (result.status === 'requested' && statusRef.current === 'waiting') setStatus('requested');
        for (const message of result.messages) {
          if (!active) return;
          await handleSignal(message);
        }
        delay = statusRef.current === 'connected' ? 1_800 : 850;
      } catch (reason) {
        if (!active) return;
        pollErrorCountRef.current += 1;
        if (reason instanceof WebcamApiError && reason.code === 'session_expired') {
          setStatus('ended');
          setError(copy.sessionExpired);
          clearPeer();
          return;
        }
        delay = Math.min(8_000, 1_000 * 2 ** Math.min(3, pollErrorCountRef.current));
      } finally {
        if (active && statusRef.current !== 'ended') timer = window.setTimeout(poll, delay);
      }
    };
    void poll();
    return () => { active = false; window.clearTimeout(timer); };
  }, [clearPeer, copy.sessionEnded, copy.sessionExpired, handleSignal, isEnded, pauseHiddenSession, sessionId]);

  useEffect(() => {
    if (!sessionId || !hostTokenRef.current || isEnded || pauseHiddenSession) return;
    const heartbeat = window.setInterval(() => {
      void webcamRequest('/api/webcam/sessions/' + encodeURIComponent(sessionId) + '/heartbeat?role=host', {
        method: 'POST', headers: { 'X-Webcam-Token': hostTokenRef.current },
      }).catch(() => undefined);
    }, 25_000);
    return () => window.clearInterval(heartbeat);
  }, [isEnded, pauseHiddenSession, sessionId]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.srcObject = remoteStream;
      if (remoteStream) void video.play().catch(() => undefined);
    }
    if (cleanVideoRef.current) {
      cleanVideoRef.current.srcObject = remoteStream;
      if (remoteStream) void cleanVideoRef.current.play().catch(() => undefined);
    }
    if (audioRef.current) {
      audioRef.current.srcObject = remoteStream;
      audioRef.current.muted = !audioOn;
      if (remoteStream && audioOn) void audioRef.current.play().catch(() => undefined);
    }
    remoteStream?.getAudioTracks().forEach((track) => { track.enabled = audioOn; });
  }, [audioOn, remoteStream]);

  useEffect(() => {
    if (status !== 'connected' || !peerRef.current) return;
    let active = true;
    let previous: { bytes: number; at: number } | null = null;
    const updateStats = async () => {
      const peer = peerRef.current;
      if (!peer || !active) return;
      try {
        const report = await peer.getStats();
        const now = performance.now();
        const inboundValues: InboundVideoStats[] = [];
        const pairValues: CandidatePairStats[] = [];
        const candidates = new Map<string, { candidateType?: string }>();
        report.forEach((item) => {
          const value = item as unknown as InboundVideoStats & CandidatePairStats & { candidateType?: string };
          if (item.type === 'inbound-rtp' && (value.kind === 'video' || value.mediaType === 'video')) inboundValues.push(value);
          if (item.type === 'candidate-pair' && (value.selected || (value.nominated && value.state === 'succeeded'))) pairValues.push(value);
          if (item.type === 'local-candidate') candidates.set(item.id, value);
        });
        const inboundValue = inboundValues[0];
        const pairValue = pairValues[0];
        const bytes = inboundValue?.bytesReceived;
        const bitrateBps = bytes !== undefined && previous && now > previous.at ? Math.round((bytes - previous.bytes) * 8_000 / (now - previous.at)) : null;
        if (bytes !== undefined) previous = { bytes, at: now };
        const received = inboundValue?.packetsReceived ?? 0;
        const lost = inboundValue?.packetsLost;
        const localType = pairValue?.localCandidateId ? candidates.get(pairValue.localCandidateId)?.candidateType : undefined;
        setStats({
          resolution: inboundValue?.frameWidth && inboundValue.frameHeight ? inboundValue.frameWidth + ' × ' + inboundValue.frameHeight : null,
          fps: inboundValue?.framesPerSecond ?? null,
          bitrateBps,
          packetLossPercent: lost !== undefined && received + lost > 0 ? Math.max(0, lost) / (received + Math.max(0, lost)) * 100 : null,
          roundTripMs: pairValue?.currentRoundTripTime !== undefined ? pairValue.currentRoundTripTime * 1_000 : null,
          route: localType === 'relay' ? 'relay' : localType ? 'direct' : null,
        });
      } catch { /* getStats can be unavailable while the peer is recovering. */ }
    };
    void updateStats();
    const timer = window.setInterval(() => { void updateStats(); }, 2_500);
    return () => { active = false; window.clearInterval(timer); };
  }, [status]);

  useEffect(() => () => {
    const id = sessionId;
    const token = hostTokenRef.current;
    if (id && token) void closeWebcamSessionRequest(id, 'host', token, undefined, true).catch(() => undefined);
    clearPeer();
    onRemoteStreamChange?.(null);
  }, [clearPeer, onRemoteStreamChange, sessionId]);

  const createSession = useCallback(async () => {
    setStatus('creating');
    setError('');
    try {
      const result = await webcamRequest<{ sessionId: string; hostToken: string; phoneToken: string }>('/api/webcam/sessions', { method: 'POST' });
      hostTokenRef.current = result.hostToken;
      const audioQuery = receiveAudio ? '?audio=1' : '';
      const url = new URL('/' + locale + '/tools/celular-como-webcam/conectar/' + result.sessionId + audioQuery + '#token=' + result.phoneToken, window.location.origin).toString();
      setSessionId(result.sessionId);
      setPhoneUrl(url);
      setStatus('waiting');
      completedEventRef.current = false;
      trackEvent('tool_started', { tool: TOOL_ID.celularComoWebcam, locale, mode: embedded ? 'call' : 'webcam' });
    } catch (reason) {
      setStatus('error');
      setError(copy.startError);
      trackEvent('tool_error', { tool: TOOL_ID.celularComoWebcam, locale, error_type: sessionErrorType(reason) });
    }
  }, [copy.startError, embedded, locale, receiveAudio]);

  useEffect(() => {
    if (!embedded || !open || status !== 'idle' || autoStartRef.current) return;
    autoStartRef.current = true;
    void createSession();
  }, [createSession, embedded, open, status]);

  const allowPhone = useCallback(async () => {
    try {
      await signal({ type: 'accept' });
      await createPeer();
      setStatus('connecting');
    } catch (reason) {
      setStatus('error');
      setError(copy.connectionError);
      trackEvent('tool_error', { tool: TOOL_ID.celularComoWebcam, locale, error_type: sessionErrorType(reason) });
    }
  }, [copy.connectionError, createPeer, locale, signal]);

  const endSession = useCallback(async () => {
    const id = sessionId;
    const token = hostTokenRef.current;
    hostTokenRef.current = '';
    clearPeer();
    setPhoneUrl('');
    setSessionId('');
    setStatus('ended');
    if (id && token) await closeWebcamSessionRequest(id, 'host', token).catch(() => undefined);
    onRemoteStreamChange?.(null);
  }, [clearPeer, onRemoteStreamChange, sessionId]);

  const closeOverlay = useCallback(() => {
    onClose?.();
  }, [onClose]);
  const closeOverlayRef = useRef(closeOverlay);
  closeOverlayRef.current = closeOverlay;

  useEffect(() => {
    if (!embedded || !open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeOverlayRef.current();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [embedded, open, closeOverlay]);

  useLayoutEffect(() => {
    if (!embedded || !open || !portalReady) return;
    const frame = window.requestAnimationFrame(() => popoverRef.current?.focus({ preventScroll: true }));
    return () => window.cancelAnimationFrame(frame);
  }, [embedded, open, portalReady]);

  useLayoutEffect(() => {
    if (!embedded || !open || !portalReady || !anchorElement) {
      setPopoverPosition(null);
      return;
    }
    const updatePosition = () => {
      if (!anchorElement.isConnected) {
        setPopoverPosition(null);
        return;
      }
      const rect = anchorElement.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const width = Math.min(360, viewportWidth - 24);
      const left = Math.min(viewportWidth - width - 12, Math.max(12, rect.left + rect.width / 2 - width / 2));
      const spaceAbove = rect.top - 12;
      const spaceBelow = viewportHeight - rect.bottom - 12;
      const placement = spaceAbove >= 360 || spaceAbove >= spaceBelow ? 'above' : 'below';
      const available = placement === 'above' ? spaceAbove : spaceBelow;
      const maxHeight = Math.max(220, Math.min(520, available - 12));
      const anchorCenter = rect.left + rect.width / 2;
      setPopoverPosition({
        left,
        top: placement === 'below' ? rect.bottom + 12 : undefined,
        bottom: placement === 'above' ? viewportHeight - rect.top + 12 : undefined,
        maxHeight,
        arrowLeft: Math.min(width - 20, Math.max(20, anchorCenter - left)),
        placement,
      });
    };
    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [anchorElement, embedded, open, portalReady]);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(phoneUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2_000);
      trackEvent('result_shared', { tool: TOOL_ID.celularComoWebcam, locale, method: 'copy_link' });
    } catch { setError(copy.connectionError); }
  }, [copy.connectionError, locale, phoneUrl]);

  const retrySession = useCallback(async () => {
    if (sessionId) await endSession();
    void createSession();
  }, [createSession, endSession, sessionId]);

  const toggleAudio = useCallback(() => {
    const next = !audioOn;
    setAudioOn(next);
    remoteStream?.getAudioTracks().forEach((track) => { track.enabled = next; });
    const audio = audioRef.current;
    if (audio) {
      audio.muted = !next;
      if (next) void audio.play().catch(() => undefined);
    }
  }, [audioOn, remoteStream]);

  const openCleanWindow = useCallback(() => {
    const popup = window.open('', '_blank', 'popup,width=1280,height=720');
    if (!popup) { setError(copy.cleanWindowBlocked); return; }
    popup.document.title = copy.cleanPreview;
    popup.document.documentElement.style.cssText = 'height:100%;background:#000';
    popup.document.body.style.cssText = 'height:100%;margin:0;background:#000;overflow:hidden';
    const video = popup.document.createElement('video');
    video.autoplay = true;
    video.playsInline = true;
    video.muted = true;
    video.style.cssText = 'display:block;width:100%;height:100%;object-fit:contain;background:#000';
    popup.document.body.append(video);
    popup.addEventListener('beforeunload', () => setCleanWindowOpen(false), { once: true });
    cleanWindowRef.current = popup;
    cleanVideoRef.current = video;
    video.srcObject = remoteStreamRef.current;
    if (remoteStreamRef.current) void video.play().catch(() => undefined);
    setCleanWindowOpen(true);
  }, [copy.cleanPreview, copy.cleanWindowBlocked]);

  const toggleFullscreen = useCallback(() => {
    const container = videoRef.current?.parentElement;
    if (!container) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void container.requestFullscreen().catch(() => undefined);
  }, []);

  const statusLabel = useMemo(() => {
    if (status === 'connected') return copy.transmitting;
    if (status === 'requested') return copy.phoneRequested;
    if (status === 'connecting') return copy.connecting;
    if (status === 'reconnecting') return copy.reconnecting;
    if (status === 'ended') return copy.sessionEnded;
    return copy.awaitingPhone;
  }, [copy, status]);

  const content = (
    <section className="w-full space-y-5" aria-label={copy.preview}>
      {!sessionId ? <div className="mx-auto max-w-5xl">
        <div className="grid min-w-0 gap-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 md:grid-cols-[minmax(0,1fr)_minmax(16rem,20rem)] md:items-center">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-sm font-semibold text-brand-700"><Smartphone size={18} aria-hidden="true" />{copy.noInstall}</div>
            <h2 className="mt-3 text-xl font-bold text-slate-900 sm:text-2xl">{copy.awaitingPhone}</h2>
            <ol className="mt-4 space-y-3 text-sm leading-6 text-slate-700">{copy.connectInstructions.map((instruction, index) => <li className="flex gap-3" key={instruction}><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-800">{index + 1}</span><span>{instruction}</span></li>)}</ol>
            <p className="mt-4 text-sm font-medium text-slate-600">{copy.sessionPrivacy}</p>
            <p className="mt-2 text-xs leading-5 text-slate-600">{copy.externalCameraHint}</p>
            {error ? <p role="alert" className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">{error}</p> : null}
            {!embedded && audioAllowed === undefined ? <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm text-slate-700"><input type="checkbox" checked={audioEnabled} onChange={(event) => setAudioEnabled(event.target.checked)} className="mt-1 accent-brand-600" /><span><span className="font-medium text-slate-900">{copy.optionalAudio}</span><span className="mt-1 block text-xs leading-5 text-slate-600">{copy.optionalAudioHint}</span></span></label> : null}
            <Button onClick={() => void (status === 'error' ? retrySession() : createSession())} disabled={status === 'creating'} className="mt-5 min-h-12 w-full sm:w-auto">
              {status === 'creating' ? <LoaderCircle size={18} className="mr-2 animate-spin" aria-hidden="true" /> : <Camera size={18} className="mr-2" aria-hidden="true" />}
              {status === 'creating' ? copy.creatingSession : status === 'error' ? copy.retry : status === 'ended' ? copy.startNewSession : copy.createSession}
            </Button>
          </div>
          <div className="flex min-h-52 items-center justify-center rounded-xl bg-slate-50 p-4 text-center">
            <div className="max-w-xs"><Wifi size={24} className="mx-auto text-brand-600" aria-hidden="true" /><p className="mt-3 text-sm font-semibold text-slate-800">{copy.p2pNotice}</p><p className="mt-2 text-xs leading-5 text-slate-600">{copy.turnNotice}</p></div>
          </div>
        </div>
      </div> : (
        <div className="mx-auto grid w-full max-w-6xl gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="flex min-w-0 flex-col gap-3">
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black" aria-label={copy.preview}>
              {remoteStream ? <video ref={videoRef} autoPlay playsInline muted className={`absolute inset-0 h-full w-full ${videoFit === 'cover' ? 'object-cover' : 'object-contain'}`} /> : <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 text-center"><span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-800 text-slate-300"><Camera size={26} aria-hidden="true" /></span><p className="text-sm font-medium text-white">{statusLabel}</p></div>}
              <audio ref={audioRef} autoPlay />
              {remoteStream ? <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-between gap-2 bg-gradient-to-t from-black/75 to-transparent p-3 text-xs text-white"><span>{statusLabel}</span><div className="flex gap-2"><Button variant="media" shape="icon" className="h-9 w-9" aria-label={copy.fullscreen} title={copy.fullscreen} onClick={toggleFullscreen}><Expand size={16} /></Button><Button variant="media" className="min-h-9 px-3 text-xs" onClick={openCleanWindow}><MonitorPlay size={15} className="mr-1.5" />{cleanWindowOpen ? copy.cleanPreview : copy.cleanPreview}</Button></div></div> : null}
            </div>
            {error ? <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">{error}</p> : null}
            <div className="flex flex-wrap items-center gap-2">
              {status === 'requested' ? <Button onClick={() => void allowPhone()} className="min-h-11"><Check size={17} className="mr-2" />{copy.approvePhone}</Button> : null}
              {status === 'connected' && receiveAudio ? <Button variant={audioOn ? 'callActive' : 'call'} aria-pressed={audioOn} onClick={toggleAudio} className="min-h-11">{audioOn ? copy.microphoneOn : copy.microphoneOff}</Button> : null}
              {remoteStream ? <Button variant="call" aria-pressed={videoFit === 'cover'} onClick={() => setVideoFit((value) => value === 'cover' ? 'contain' : 'cover')} className="min-h-11">{videoFit === 'cover' ? copy.quality : copy.preview}</Button> : null}
              <Button variant="call" aria-pressed={showStats} onClick={() => setShowStats((value) => !value)} className="min-h-11">{copy.stats}</Button>
              <Button variant="call" onClick={() => void endSession()} className="min-h-11">{copy.endSession}</Button>
            </div>
          </div>

          <aside className="min-w-0 space-y-4">
            {!remoteStream ? <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between gap-3"><h3 className="text-sm font-semibold text-slate-900">{statusLabel}</h3><span className={`h-2.5 w-2.5 shrink-0 rounded-full ${status === 'requested' ? 'bg-amber-400' : 'bg-brand-500'}`} aria-hidden="true" /></div>
              {status === 'requested' ? <Button onClick={() => void allowPhone()} className="mt-3 min-h-11 w-full">{copy.approvePhone}</Button> : <p className="mt-2 text-sm leading-5 text-slate-600">{copy.scanQr}</p>}
              <div className="mt-4 flex justify-center rounded-lg bg-white p-2"><div ref={qrContainerRef} role="img" className="max-w-full" aria-label={copy.qrAlt} /></div>
              <Button variant="secondary" onClick={() => void copyLink()} className="mt-3 min-h-11 w-full">{copied ? <Check size={16} className="mr-2" /> : <Copy size={16} className="mr-2" />}{copied ? copy.linkCopied : copy.copyLink}</Button>
            </div> : null}

            {showStats ? <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h3 className="text-sm font-semibold text-slate-900">{copy.stats}</h3>
              <dl className="mt-3 space-y-2 text-sm">{[
                [copy.resolution, stats.resolution ?? copy.unknown],
                [copy.fps, stats.fps !== null ? Math.round(stats.fps) + ' fps' : copy.unknown],
                [copy.bitrate, stats.bitrateBps !== null && stats.bitrateBps >= 0 ? (stats.bitrateBps / 1_000_000).toFixed(2) + ' Mbps' : copy.unknown],
                [copy.packetLoss, stats.packetLossPercent !== null ? stats.packetLossPercent.toFixed(1) + '%' : copy.unknown],
                [copy.roundTrip, stats.roundTripMs !== null ? Math.round(stats.roundTripMs) + ' ms' : copy.unknown],
                [copy.route, stats.route ? (stats.route === 'relay' ? copy.relay : copy.direct) : copy.unknown],
              ].map(([label, value]) => <div key={label} className="flex min-w-0 items-center justify-between gap-3"><dt className="truncate text-slate-600">{label}</dt><dd className="shrink-0 font-medium tabular-nums text-slate-900">{value}</dd></div>)}</dl>
            </div> : null}

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h3 className="text-sm font-semibold text-slate-900">{copy.obsTitle}</h3>
              <ol className="mt-3 space-y-2 text-sm leading-5 text-slate-700">{copy.obsSteps.map((step, index) => <li key={step} className="flex gap-2"><span className="font-semibold text-brand-700">{index + 1}.</span><span>{step}</span></li>)}</ol>
              <p className="mt-3 text-xs leading-5 text-slate-600">{copy.obsLinux} {copy.nativeCameraNote}</p>
            </div>
            <p className="text-xs leading-5 text-slate-600"><strong>{copy.privacyTitle}.</strong> {copy.privacyText}</p>
          </aside>
        </div>
      )}
    </section>
  );

  const darkPopover = embeddedTheme === 'dark';
  const embeddedContent = popoverPosition ? (
    <div className="pointer-events-none fixed z-[160] w-[min(22.5rem,calc(100vw-1.5rem))]" style={{ left: popoverPosition.left, top: popoverPosition.top, bottom: popoverPosition.bottom }}>
      <span aria-hidden="true" className={`absolute h-3 w-3 rotate-45 ${popoverPosition.placement === 'above' ? 'bottom-[-0.35rem] border-b border-r' : 'top-[-0.35rem] border-l border-t'} ${darkPopover ? 'border-ink-700 bg-ink-900' : 'border-slate-200 bg-white'}`} style={{ left: popoverPosition.arrowLeft - 6 }} />
      <section ref={popoverRef} id="phone-webcam-popover" role="dialog" aria-modal="false" aria-labelledby="phone-webcam-title" tabIndex={-1} style={{ maxHeight: popoverPosition.maxHeight }} className={`pointer-events-auto relative overflow-y-auto overscroll-contain rounded-2xl border p-3 shadow-2xl outline-none sm:p-4 ${darkPopover ? 'border-ink-700 bg-ink-900 text-white' : 'border-slate-200 bg-white text-slate-900'}`}>
        <header className="flex items-center gap-3">
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${darkPopover ? 'bg-accent-500 text-ink-950' : 'bg-brand-50 text-brand-700'}`}><Smartphone size={20} aria-hidden="true" /></span>
          <div className="min-w-0 flex-1">
            <h2 id="phone-webcam-title" className="truncate text-sm font-semibold">{copy.phoneConnectTitle}</h2>
            <p role="status" aria-live="polite" className={`mt-0.5 truncate text-xs ${darkPopover ? 'text-ink-300' : 'text-slate-600'}`}>{status === 'creating' ? copy.creatingSession : status === 'connected' ? copy.phoneConnectedTitle : statusLabel}</p>
          </div>
          <Button variant={darkPopover ? 'call' : 'secondary'} shape="icon" className="h-9 w-9 shrink-0" aria-label={copy.close} title={copy.close} onClick={closeOverlay}><X size={17} /></Button>
        </header>

        {status === 'waiting' || status === 'requested' ? <>
          <div className="mt-3 flex min-h-40 justify-center rounded-xl bg-white p-2">
            {qrLib ? <div ref={qrContainerRef} role="img" aria-label={copy.qrAlt} className="max-w-full" /> : <LoaderCircle size={22} className="m-auto animate-spin text-brand-600" aria-label={copy.creatingSession} />}
          </div>
          {status === 'waiting' ? <p className={`mt-3 text-center text-sm leading-5 ${darkPopover ? 'text-ink-200' : 'text-slate-700'}`}>{copy.phoneConnectHint}</p> : null}
          {status === 'requested' ? <Button variant={darkPopover ? 'callActive' : 'primary'} onClick={() => void allowPhone()} className="mt-3 min-h-11 w-full"><Check size={17} className="mr-2" />{copy.approvePhone}</Button> : null}
          <div className="mt-2 flex gap-2">
            <Button variant={darkPopover ? 'call' : 'secondary'} onClick={() => void copyLink()} className="min-h-10 min-w-0 flex-1 px-2 text-xs">{copied ? <Check size={15} className="mr-1.5 shrink-0" /> : <Copy size={15} className="mr-1.5 shrink-0" />}{copied ? copy.linkCopied : copy.copyLink}</Button>
            <Button variant={darkPopover ? 'call' : 'secondary'} onClick={() => void endSession()} className="min-h-10 min-w-0 flex-1 px-2 text-xs">{copy.cancelConnection}</Button>
          </div>
        </> : null}

        {status === 'idle' || status === 'creating' || status === 'connecting' || status === 'reconnecting' ? <div className={`mt-4 flex items-center gap-3 rounded-xl p-3 text-sm ${darkPopover ? 'bg-ink-800 text-ink-200' : 'bg-slate-50 text-slate-700'}`}>
          <LoaderCircle size={19} className="shrink-0 animate-spin text-brand-600" aria-hidden="true" />
          <p>{status === 'connecting' || status === 'reconnecting' ? statusLabel : copy.creatingSession}</p>
        </div> : null}

        {status === 'connected' ? <div className="mt-4 space-y-3">
          <p className={`text-sm leading-5 ${darkPopover ? 'text-ink-200' : 'text-slate-700'}`}>{copy.phoneConnectedHint}</p>
          <p className={`text-xs leading-5 ${darkPopover ? 'text-ink-400' : 'text-slate-500'}`}>{copy.externalCameraHint}</p>
          <Button variant={darkPopover ? 'callActive' : 'primary'} onClick={openCleanWindow} className="min-h-11 w-full"><MonitorPlay size={17} className="mr-2" />{copy.cleanPreview}</Button>
          <Button variant={darkPopover ? 'callDanger' : 'secondary'} onClick={() => void endSession()} className="min-h-10 w-full text-xs">{copy.endSession}</Button>
        </div> : null}

        {status === 'error' || status === 'ended' ? <div className="mt-3 space-y-3">
          <p role={status === 'error' ? 'alert' : 'status'} className={`rounded-lg p-3 text-sm leading-5 ${status === 'error' ? 'border border-rose-200 bg-rose-50 text-rose-800' : darkPopover ? 'bg-ink-800 text-ink-200' : 'bg-slate-50 text-slate-700'}`}>{status === 'error' ? error || copy.connectionError : copy.sessionEnded}</p>
          <Button variant={darkPopover ? 'callActive' : 'primary'} onClick={() => void retrySession()} className="min-h-11 w-full"><Camera size={17} className="mr-2" />{status === 'error' ? copy.retry : copy.startNewSession}</Button>
        </div> : null}

        {status === 'waiting' ? <p className={`mt-3 text-center text-[11px] leading-4 ${darkPopover ? 'text-ink-400' : 'text-slate-500'}`}>{copy.sessionPrivacy}</p> : null}
      </section>
    </div>
  ) : null;

  if (embedded) {
    return open && portalReady && embeddedContent ? createPortal(embeddedContent, document.body) : null;
  }
  return content;
}
