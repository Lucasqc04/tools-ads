'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Camera, CameraOff, Flashlight, FlashlightOff, LoaderCircle, Mic, MicOff, Play, Settings2, SwitchCamera, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TOOL_ID, trackEvent } from '@/lib/analytics';
import { getCelularWebcamUiCopy, type WebcamQualityPreset } from '@/data/i18n/celular-como-webcam';
import type { AppLocale } from '@/lib/i18n/config';
import {
  WebcamApiError,
  closeWebcamSessionRequest,
  createWebcamClientId,
  getWebcamIceServersRequest,
  pollWebcamSignalRequest,
  sendWebcamSignalRequest,
} from '@/lib/celular-webcam/client';
import { isValidWebcamToken } from '@/lib/celular-webcam/protocol';

type Props = { locale: AppLocale; sessionId: string; audioAllowed?: boolean };
type CameraStatus = 'preparing' | 'ready' | 'requesting' | 'waiting' | 'connecting' | 'connected' | 'reconnecting' | 'ended' | 'error';
type StreamQuality = { width: number; height: number; fps: number; bitrate: number };
type ZoomCapabilities = { min: number; max: number; step: number };
type ExtendedCapabilities = MediaTrackCapabilities & { torch?: boolean; zoom?: ZoomCapabilities };
type ExtendedConstraintSet = MediaTrackConstraintSet & { torch?: boolean; zoom?: number };
type ExtendedTrackConstraints = Omit<MediaTrackConstraints, 'advanced'> & { torch?: boolean; advanced?: ExtendedConstraintSet[] };

const constraintsWithTorch = (track: MediaStreamTrack, enabled: boolean): ExtendedTrackConstraints => {
  const current = track.getConstraints() as ExtendedTrackConstraints;
  const advanced = (current.advanced ?? []).filter((constraint) => constraint.torch === undefined);
  return { ...current, torch: enabled, advanced: [...advanced, { torch: enabled }] };
};

const profile: Record<WebcamQualityPreset, StreamQuality> = {
  economy: { width: 640, height: 480, fps: 24, bitrate: 900_000 },
  balanced: { width: 1280, height: 720, fps: 30, bitrate: 2_500_000 },
  high: { width: 1920, height: 1080, fps: 30, bitrate: 5_000_000 },
  fluid: { width: 1920, height: 1080, fps: 60, bitrate: 5_000_000 },
  ultra: { width: 3840, height: 2160, fps: 30, bitrate: 8_000_000 },
};

const presetName = (preset: WebcamQualityPreset, copy: ReturnType<typeof getCelularWebcamUiCopy>) => ({
  economy: copy.presetEconomy,
  balanced: copy.presetBalanced,
  high: copy.presetHigh,
  fluid: copy.presetFluid,
  ultra: copy.presetUltra,
}[preset]);

const getCameraError = (error: unknown, copy: ReturnType<typeof getCelularWebcamUiCopy>): string => {
  const name = error instanceof Error ? error.name : '';
  if (name === 'NotAllowedError' || name === 'PermissionDeniedError' || name === 'SecurityError') return copy.permissionDenied;
  if (name === 'NotFoundError' || name === 'DevicesNotFoundError') return copy.noCamera;
  if (name === 'NotReadableError' || name === 'TrackStartError') return copy.cameraUnavailable;
  if (error instanceof WebcamApiError && error.code === 'service_unavailable') return copy.serviceUnavailable;
  if (error instanceof WebcamApiError && error.code === 'session_expired') return copy.sessionExpired;
  return copy.cameraError;
};

const getCameraErrorType = (error: unknown): string => {
  if (error instanceof WebcamApiError) return error.code === 'session_expired' ? 'not_found' : 'network_error';
  const name = error instanceof Error ? error.name : '';
  if (name === 'NotAllowedError' || name === 'PermissionDeniedError' || name === 'SecurityError') return 'permission_denied';
  if (name === 'NotFoundError' || name === 'DevicesNotFoundError') return 'not_found';
  return 'processing_failed';
};

const createClientIdFromFragment = (): { token: string | null; clientId: string } => {
  const fragment = new URLSearchParams(window.location.hash.slice(1));
  const token = fragment.get('token');
  window.history.replaceState(null, '', window.location.pathname + window.location.search);
  return { token: isValidWebcamToken(token) ? token : null, clientId: createWebcamClientId() };
};

export function CelularWebcamCamera({ locale, sessionId, audioAllowed = true }: Props) {
  const copy = getCelularWebcamUiCopy(locale);
  const [token, setToken] = useState('');
  const [clientId, setClientId] = useState('');
  const [requestSent, setRequestSent] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [status, setStatus] = useState<CameraStatus>('preparing');
  const [errorText, setErrorText] = useState('');
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [quality, setQuality] = useState<WebcamQualityPreset>('balanced');
  const [qualityMode, setQualityMode] = useState<'quality' | 'balanced' | 'motion'>('balanced');
  const [cameraDevices, setCameraDevices] = useState<MediaDeviceInfo[]>([]);
  const [cameraId, setCameraId] = useState('');
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [microphoneOn, setMicrophoneOn] = useState(false);
  const [paused, setPaused] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [torchPending, setTorchPending] = useState(false);
  const [zoomRange, setZoomRange] = useState<{ min: number; max: number; step: number; value: number } | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [actualResolution, setActualResolution] = useState('');
  const [actualFps, setActualFps] = useState<number | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const audioTrackRef = useRef<MediaStreamTrack | null>(null);
  const audioSenderRef = useRef<RTCRtpSender | null>(null);
  const videoSenderRef = useRef<RTCRtpSender | null>(null);
  const phonePeerRef = useRef<RTCPeerConnection | null>(null);
  const clientIdRef = useRef('');
  const tokenRef = useRef('');
  const statusRef = useRef<CameraStatus>('preparing');
  const requestedRef = useRef(false);
  const offerStartedRef = useRef(false);
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);
  const restartTimerRef = useRef<number | null>(null);
  const restartAttemptsRef = useRef(0);
  const stoppedRef = useRef(false);
  const torchOnRef = useRef(false);
  const torchBusyRef = useRef(false);

  statusRef.current = status;
  tokenRef.current = token;
  clientIdRef.current = clientId;

  const signal = useCallback((value: Parameters<typeof sendWebcamSignalRequest>[3]) => {
    if (!tokenRef.current || !clientIdRef.current) return Promise.reject(new Error('missing_credentials'));
    return sendWebcamSignalRequest(sessionId, 'phone', tokenRef.current, value, clientIdRef.current);
  }, [sessionId]);

  useEffect(() => {
    stoppedRef.current = false;
    const credentials = createClientIdFromFragment();
    setToken(credentials.token ?? '');
    setClientId(credentials.clientId);
    setAuthReady(true);
    if (!credentials.token) {
      setStatus('error');
      setErrorText(copy.sessionExpired);
    } else if (!window.isSecureContext) {
      setStatus('error');
      setErrorText(copy.insecureContext);
    } else if (!navigator.mediaDevices?.getUserMedia || typeof RTCPeerConnection === 'undefined') {
      setStatus('error');
      setErrorText(copy.unsupportedBrowser);
    } else {
      setStatus('ready');
    }
  }, [copy.insecureContext, copy.sessionExpired, copy.unsupportedBrowser]);

  const closePeerAndTracks = useCallback(() => {
    if (restartTimerRef.current) window.clearTimeout(restartTimerRef.current);
    restartTimerRef.current = null;
    const pc = phonePeerRef.current;
    if (pc) {
      pc.onicecandidate = null;
      pc.onconnectionstatechange = null;
      pc.close();
      phonePeerRef.current = null;
    }
    videoSenderRef.current = null;
    audioSenderRef.current = null;
    if (audioTrackRef.current) {
      audioTrackRef.current.onended = null;
      audioTrackRef.current.stop();
    }
    audioTrackRef.current = null;
    cameraStreamRef.current?.getTracks().forEach((track) => {
      track.onended = null;
      track.stop();
    });
    cameraStreamRef.current = null;
    pendingCandidatesRef.current = [];
    setCameraStream(null);
    setMicrophoneOn(false);
    setPaused(false);
    torchOnRef.current = false;
    setTorchOn(false);
    setTorchPending(false);
    torchBusyRef.current = false;
  }, []);

  const makeOffer = useCallback(async (iceRestart = false) => {
    const pc = phonePeerRef.current;
    if (!pc || !tokenRef.current || !clientIdRef.current) return;
    const offer = await pc.createOffer(iceRestart ? { iceRestart: true } : undefined);
    await pc.setLocalDescription(offer);
    if (!pc.localDescription) throw new Error('offer_unavailable');
    await signal({ type: 'offer', description: { type: 'offer', sdp: pc.localDescription.sdp ?? '' } });
  }, [signal]);

  const scheduleIceRestart = useCallback(() => {
    if (restartTimerRef.current || statusRef.current === 'ended' || stoppedRef.current) return;
    if (restartAttemptsRef.current >= 2) {
      setStatus('error');
      setErrorText(copy.connectionFailed);
      return;
    }
    const delay = restartAttemptsRef.current === 0 ? 2_000 : 5_000;
    setStatus('reconnecting');
    restartTimerRef.current = window.setTimeout(() => {
      restartTimerRef.current = null;
      restartAttemptsRef.current += 1;
      void makeOffer(true).catch(() => scheduleIceRestart());
    }, delay);
  }, [copy.connectionFailed, makeOffer]);

  const startPeer = useCallback(async () => {
    if (offerStartedRef.current || !cameraStreamRef.current || !tokenRef.current || !clientIdRef.current) return;
    offerStartedRef.current = true;
    setStatus('connecting');
    try {
      const { iceServers } = await getWebcamIceServersRequest(sessionId, 'phone', tokenRef.current, clientIdRef.current);
      if (stoppedRef.current) return;
      const pc = new RTCPeerConnection({ iceServers, iceCandidatePoolSize: 2 });
      phonePeerRef.current = pc;
      const videoTrack = cameraStreamRef.current.getVideoTracks()[0];
      if (!videoTrack) throw new Error('camera_track_missing');
      videoSenderRef.current = pc.addTrack(videoTrack, cameraStreamRef.current);
      if (audioAllowed) {
        audioSenderRef.current = pc.addTransceiver('audio', { direction: 'sendrecv' }).sender;
      }
      pc.onicecandidate = (event) => {
        if (!event.candidate) return;
        const candidate = event.candidate.toJSON();
        if (!candidate.candidate) return;
        void signal({ type: 'candidate', candidate: { ...candidate, candidate: candidate.candidate } }).catch(() => undefined);
      };
      pc.onconnectionstatechange = () => {
        if (pc.connectionState === 'connected') {
          restartAttemptsRef.current = 0;
          if (restartTimerRef.current) window.clearTimeout(restartTimerRef.current);
          restartTimerRef.current = null;
          setStatus('connected');
          void signal({ type: 'state', state: 'connected' }).catch(() => undefined);
        } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
          scheduleIceRestart();
        }
      };
      await makeOffer(false);
    } catch (error) {
      offerStartedRef.current = false;
      const pc = phonePeerRef.current;
      if (pc) {
        pc.onicecandidate = null;
        pc.onconnectionstatechange = null;
        pc.close();
      }
      phonePeerRef.current = null;
      videoSenderRef.current = null;
      audioSenderRef.current = null;
      setStatus('error');
      setErrorText(getCameraError(error, copy));
      trackEvent('tool_error', { tool: TOOL_ID.celularComoWebcam, locale, error_type: getCameraErrorType(error) });
    }
  }, [audioAllowed, copy, locale, makeOffer, scheduleIceRestart, sessionId, signal]);

  useEffect(() => {
    if (!requestSent || !token || !clientId || status === 'ended') return;
    let active = true;
    let timer = 0;
    let currentDelay = 900;

    const poll = async () => {
      try {
        const result = await pollWebcamSignalRequest(sessionId, 'phone', token, clientId);
        if (!active) return;
        if (result.status === 'closed' || result.status === 'expired') {
          setStatus('ended');
          setErrorText(copy.sessionEnded);
          closePeerAndTracks();
          return;
        }
        if (result.status === 'accepted' && !offerStartedRef.current) await startPeer();
        for (const message of result.messages) {
          if (!active) return;
          if (message.type === 'accept') {
            await startPeer();
          } else if (message.type === 'answer') {
            const pc = phonePeerRef.current;
            if (!pc) continue;
            await pc.setRemoteDescription(message.description);
            for (const candidate of pendingCandidatesRef.current.splice(0)) {
              await pc.addIceCandidate(candidate).catch(() => undefined);
            }
          } else if (message.type === 'candidate') {
            const pc = phonePeerRef.current;
            if (pc?.remoteDescription) await pc.addIceCandidate(message.candidate).catch(() => undefined);
            else pendingCandidatesRef.current.push(message.candidate);
          } else if (message.type === 'restart-request') {
            restartAttemptsRef.current += 1;
            if (restartAttemptsRef.current <= 2) await makeOffer(true);
          } else if (message.type === 'bye') {
            setStatus('ended');
            setErrorText(copy.sessionEnded);
            closePeerAndTracks();
          }
        }
        currentDelay = statusRef.current === 'connected' ? 2_000 : 900;
      } catch (error) {
        if (error instanceof WebcamApiError && error.code === 'session_expired') {
          setStatus('ended');
          setErrorText(copy.sessionExpired);
          closePeerAndTracks();
          return;
        }
        currentDelay = Math.min(4_000, currentDelay * 2);
      } finally {
        if (active && statusRef.current !== 'ended') timer = window.setTimeout(poll, currentDelay);
      }
    };

    void poll();
    return () => { active = false; window.clearTimeout(timer); };
  }, [clientId, closePeerAndTracks, copy.sessionEnded, copy.sessionExpired, makeOffer, requestSent, sessionId, startPeer, status, token]);

  const requestCamera = useCallback(async (deviceId = cameraId, selectedQuality = quality, selectedFacing = facingMode) => {
    const selected = profile[selectedQuality];
    const video: MediaTrackConstraints = {
      width: { ideal: selected.width },
      height: { ideal: selected.height },
      frameRate: { ideal: selected.fps },
      ...(deviceId ? { deviceId: { exact: deviceId } } : { facingMode: { ideal: selectedFacing } }),
    };
    try {
      return await navigator.mediaDevices.getUserMedia({ video, audio: false });
    } catch (firstError) {
      const name = firstError instanceof Error ? firstError.name : '';
      if (name === 'NotAllowedError' || name === 'PermissionDeniedError' || name === 'SecurityError') throw firstError;
      return navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: selectedFacing } }, audio: false });
    }
  }, [cameraId, facingMode, quality]);

  const startCamera = useCallback(async () => {
    if (!authReady || !token || typeof window === 'undefined' || !window.isSecureContext || !navigator.mediaDevices?.getUserMedia) return;
    setStatus('requesting');
    setErrorText('');
    let openedStream: MediaStream | null = null;
    try {
      const stream = openedStream = await requestCamera();
      const track = stream.getVideoTracks()[0];
      if (!track) { stream.getTracks().forEach((item) => item.stop()); throw new Error('camera_track_missing'); }
      cameraStreamRef.current?.getTracks().forEach((item) => item.stop());
      cameraStreamRef.current = stream;
      track.onended = () => {
        setStatus((current) => current === 'connected' ? 'reconnecting' : current);
        setErrorText(copy.cameraUnavailable);
        torchOnRef.current = false;
        setTorchOn(false);
      };
      torchOnRef.current = false;
      setTorchOn(false);
      const settings = track.getSettings();
      if (settings.width && settings.height) setActualResolution(settings.width + ' × ' + settings.height);
      setActualFps(settings.frameRate ?? null);
      const capabilities = (typeof track.getCapabilities === 'function' ? track.getCapabilities() : {}) as ExtendedCapabilities;
      setTorchSupported(capabilities.torch === true);
      if (capabilities.zoom) {
        const range = capabilities.zoom;
        setZoomRange({ min: range.min, max: range.max, step: range.step || 0.1, value: (track.getSettings() as MediaTrackSettings & { zoom?: number }).zoom ?? range.min });
      } else {
        setZoomRange(null);
      }
      const devices = await navigator.mediaDevices.enumerateDevices().catch(() => []);
      setCameraDevices(devices.filter((device) => device.kind === 'videoinput'));
      if (settings.deviceId) setCameraId(settings.deviceId);
      setCameraStream(stream);
      setStatus('ready');
      openedStream = null;
    } catch (error) {
      openedStream?.getTracks().forEach((item) => { item.onended = null; item.stop(); });
      if (cameraStreamRef.current === openedStream) cameraStreamRef.current = null;
      setCameraStream(null);
      setStatus('error');
      setErrorText(getCameraError(error, copy));
      trackEvent('tool_error', { tool: TOOL_ID.celularComoWebcam, locale, error_type: getCameraErrorType(error) });
    }
  }, [authReady, copy, locale, requestCamera, token]);

  const connectToComputer = useCallback(async () => {
    if (!cameraStreamRef.current || !token || !clientId) return;
    setStatus('waiting');
    setErrorText('');
    try {
      await signal({ type: 'request' });
      requestedRef.current = true;
      setRequestSent(true);
    } catch (error) {
      setStatus('error');
      setErrorText(getCameraError(error, copy));
      trackEvent('tool_error', { tool: TOOL_ID.celularComoWebcam, locale, error_type: getCameraErrorType(error) });
    }
  }, [clientId, copy, locale, signal, token]);

  const endConnection = useCallback(async () => {
    stoppedRef.current = true;
    const currentPc = phonePeerRef.current;
    if (requestedRef.current && token && clientId) {
      await sendWebcamSignalRequest(sessionId, 'phone', token, { type: 'bye' }, clientId).catch(() => undefined);
    }
    if (currentPc) {
      currentPc.onicecandidate = null;
      currentPc.onconnectionstatechange = null;
    }
    closePeerAndTracks();
    setRequestSent(false);
    setStatus('ended');
    setErrorText(copy.sessionEnded);
  }, [clientId, closePeerAndTracks, copy.sessionEnded, sessionId, token]);

  const switchCamera = useCallback(async (nextDeviceId?: string) => {
    if (!cameraStreamRef.current || torchBusyRef.current) return;
    const nextFacing = facingMode === 'environment' ? 'user' : 'environment';
    const resolvedDeviceId = nextDeviceId ?? '';
    let openedStream: MediaStream | null = null;
    try {
      const stream = openedStream = await requestCamera(resolvedDeviceId, quality, nextDeviceId === undefined ? nextFacing : facingMode);
      const track = stream.getVideoTracks()[0];
      if (!track) { stream.getTracks().forEach((item) => item.stop()); throw new Error('camera_track_missing'); }
      const sender = videoSenderRef.current;
      const previous = cameraStreamRef.current;
      const previousTrack = previous.getVideoTracks()[0];
      if (torchOnRef.current && previousTrack) {
        torchBusyRef.current = true;
        setTorchPending(true);
        try {
          await previousTrack.applyConstraints(constraintsWithTorch(previousTrack, false));
        } catch {
          setErrorText(copy.cameraError);
          openedStream?.getTracks().forEach((item) => { item.onended = null; item.stop(); });
          return;
        } finally {
          torchBusyRef.current = false;
          setTorchPending(false);
        }
        torchOnRef.current = false;
        setTorchOn(false);
      }
      if (sender) await sender.replaceTrack(track);
      track.onended = () => {
        setStatus((current) => current === 'connected' ? 'reconnecting' : current);
        setErrorText(copy.cameraUnavailable);
        torchOnRef.current = false;
        setTorchOn(false);
      };
      cameraStreamRef.current = stream;
      setCameraStream(stream);
      previous.getTracks().forEach((item) => { item.onended = null; item.stop(); });
      const capabilities = (typeof track.getCapabilities === 'function' ? track.getCapabilities() : {}) as ExtendedCapabilities;
      setTorchSupported(capabilities.torch === true);
      torchOnRef.current = false;
      setTorchOn(false);
      if (nextDeviceId !== undefined) setCameraId(nextDeviceId);
      else setFacingMode(nextFacing);
      const settings = track.getSettings();
      if (settings.width && settings.height) setActualResolution(settings.width + ' × ' + settings.height);
      setActualFps(settings.frameRate ?? null);
      openedStream = null;
    } catch (error) {
      openedStream?.getTracks().forEach((item) => { item.onended = null; item.stop(); });
      setErrorText(getCameraError(error, copy));
    }
  }, [copy, facingMode, quality, requestCamera]);

  const changeQuality = useCallback(async (next: WebcamQualityPreset) => {
    setQuality(next);
    const track = cameraStreamRef.current?.getVideoTracks()[0];
    if (!track) return;
    const target = profile[next];
    try {
      await track.applyConstraints({ ...track.getConstraints(), width: { ideal: target.width }, height: { ideal: target.height }, frameRate: { ideal: target.fps } });
      const settings = track.getSettings();
      if (settings.width && settings.height) setActualResolution(settings.width + ' × ' + settings.height);
      setActualFps(settings.frameRate ?? null);
    } catch {
      setErrorText(copy.cameraError);
    }
  }, [copy.cameraError]);

  const setSenderParameters = useCallback(async (mode: 'quality' | 'balanced' | 'motion') => {
    setQualityMode(mode);
    const sender = videoSenderRef.current;
    if (!sender) return;
    try {
      const parameters = sender.getParameters();
      const encoding = parameters.encodings?.[0];
      if (encoding) {
        encoding.maxBitrate = Math.max(500_000, Math.round(profile[quality].bitrate * (mode === 'quality' ? 1.35 : mode === 'motion' ? 1.1 : 1)));
        parameters.encodings = [encoding, ...parameters.encodings.slice(1)];
      }
      const extended = parameters as RTCRtpSendParameters & { degradationPreference?: 'maintain-framerate' | 'maintain-resolution' | 'balanced' };
      extended.degradationPreference = mode === 'quality' ? 'maintain-resolution' : mode === 'motion' ? 'maintain-framerate' : 'balanced';
      await sender.setParameters(parameters);
    } catch { /* Browser encoders may not allow changing these optional values. */ }
  }, [quality]);

  const toggleMicrophone = useCallback(async () => {
    if (!audioAllowed || !audioSenderRef.current) return;
    const current = audioTrackRef.current;
    if (current) {
      current.enabled = !current.enabled;
      setMicrophoneOn(current.enabled);
      return;
    }
    let openedStream: MediaStream | null = null;
    try {
      const stream = openedStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      const track = stream.getAudioTracks()[0];
      if (!track) { stream.getTracks().forEach((item) => item.stop()); throw new Error('microphone_track_missing'); }
      track.enabled = true;
      await audioSenderRef.current.replaceTrack(track);
      audioTrackRef.current = track;
      track.onended = () => setMicrophoneOn(false);
      setMicrophoneOn(true);
      openedStream = null;
    } catch (error) {
      openedStream?.getTracks().forEach((item) => { item.onended = null; item.stop(); });
      setErrorText(getCameraError(error, copy));
      trackEvent('tool_error', { tool: TOOL_ID.celularComoWebcam, locale, error_type: getCameraErrorType(error) });
    }
  }, [audioAllowed, copy, locale]);

  const togglePause = useCallback(async () => {
    const track = cameraStreamRef.current?.getVideoTracks()[0];
    if (!track || torchBusyRef.current) return;
    if (!paused && torchOnRef.current) {
      torchBusyRef.current = true;
      setTorchPending(true);
      try {
        await track.applyConstraints(constraintsWithTorch(track, false));
        torchOnRef.current = false;
        setTorchOn(false);
      } catch {
        setErrorText(copy.cameraError);
        return;
      } finally {
        torchBusyRef.current = false;
        setTorchPending(false);
      }
    }
    track.enabled = paused;
    setPaused(!paused);
  }, [copy.cameraError, paused]);

  const toggleTorch = useCallback(async () => {
    const track = cameraStreamRef.current?.getVideoTracks()[0];
    if (!track || torchBusyRef.current) return;
    const next = !torchOnRef.current;
    torchBusyRef.current = true;
    setTorchPending(true);
    try {
      await track.applyConstraints(constraintsWithTorch(track, next));
      if (cameraStreamRef.current?.getVideoTracks()[0] !== track) return;
      torchOnRef.current = next;
      setTorchOn(next);
      setErrorText('');
    } catch {
      setErrorText(copy.cameraError);
      if (next) {
        torchOnRef.current = false;
        setTorchOn(false);
      }
    } finally {
      torchBusyRef.current = false;
      setTorchPending(false);
    }
  }, [copy.cameraError]);

  const setZoom = useCallback(async (value: number) => {
    const track = cameraStreamRef.current?.getVideoTracks()[0];
    if (!track) return;
    try {
      const current = track.getConstraints() as ExtendedTrackConstraints;
      const advanced = (current.advanced ?? []).filter((constraint) => constraint.zoom === undefined);
      await track.applyConstraints({ ...current, advanced: [...advanced, { zoom: value }] });
      setZoomRange((current) => current ? { ...current, value } : current);
    } catch { setZoomRange(null); }
  }, []);

  useEffect(() => {
    const video = document.querySelector<HTMLVideoElement>('[data-phone-camera-preview]');
    if (!video) return;
    video.srcObject = cameraStream;
    if (cameraStream) void video.play().catch(() => undefined);
  }, [cameraStream]);

  useEffect(() => {
    const active = status === 'connected';
    if (!active || !('wakeLock' in navigator)) return;
    let sentinel: WakeLockSentinel | null = null;
    let stopped = false;
    void navigator.wakeLock.request('screen').then((value) => {
      if (stopped) void value.release();
      else sentinel = value;
    }).catch(() => undefined);
    return () => { stopped = true; if (sentinel) void sentinel.release(); };
  }, [status]);

  useEffect(() => () => {
    stoppedRef.current = true;
    if (restartTimerRef.current) window.clearTimeout(restartTimerRef.current);
    const pc = phonePeerRef.current;
    pc?.close();
    cameraStreamRef.current?.getTracks().forEach((track) => { track.onended = null; track.stop(); });
    if (audioTrackRef.current) { audioTrackRef.current.onended = null; audioTrackRef.current.stop(); }
    if (requestedRef.current && tokenRef.current && clientIdRef.current) {
      void closeWebcamSessionRequest(sessionId, 'phone', tokenRef.current, clientIdRef.current, true).catch(() => undefined);
    }
  }, [sessionId]);

  const statusLabel = useMemo(() => {
    if (status === 'connected') return copy.transmitting;
    if (status === 'waiting') return copy.waitingForPc;
    if (status === 'connecting') return copy.connecting;
    if (status === 'reconnecting') return copy.reconnecting;
    if (status === 'ended') return copy.sessionEnded;
    if (status === 'requesting') return copy.connecting;
    return copy.phoneReady;
  }, [copy, status]);

  const isCameraActive = Boolean(cameraStream?.getVideoTracks().some((track) => track.readyState === 'live'));
  const canUse = authReady && Boolean(token) && typeof window !== 'undefined' && window.isSecureContext && typeof navigator !== 'undefined' && Boolean(navigator.mediaDevices?.getUserMedia);

  return (
    <main className="relative flex min-h-[100svh] w-full flex-col overflow-hidden bg-ink-950 text-white" style={{ paddingTop: 'max(12px, env(safe-area-inset-top))', paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
      <header className="relative z-10 flex shrink-0 items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-400">Tools · Webcam</p>
          <p className="mt-1 truncate text-sm font-semibold text-white">{statusLabel}</p>
        </div>
        <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${status === 'connected' ? 'bg-emerald-400' : status === 'error' || status === 'ended' ? 'bg-rose-400' : 'bg-amber-300'}`} aria-hidden="true" />
      </header>

      <section className="relative mx-3 min-h-0 flex-1 overflow-hidden rounded-2xl bg-black sm:mx-6" aria-label={copy.preview}>
        {cameraStream ? <video data-phone-camera-preview autoPlay playsInline muted className="absolute inset-0 h-full w-full object-cover" /> : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
            <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-ink-800 text-ink-300"><Camera size={28} aria-hidden="true" /></span>
            <div className="max-w-sm">
              <h1 className="text-xl font-semibold text-white">{copy.camera}</h1>
              <p className="mt-2 text-sm leading-6 text-ink-300">{errorText || copy.allowCamera}</p>
            </div>
          </div>
        )}
        {cameraStream ? <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 bg-gradient-to-b from-black/60 to-transparent p-4 sm:p-5">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{statusLabel}</p>
            <p className="mt-1 text-xs text-ink-300">{actualResolution || copy.unknown}{actualFps ? ' · ' + Math.round(actualFps) + ' fps' : ''}</p>
          </div>
          {status === 'connected' ? <span className="rounded-full bg-emerald-500/90 px-3 py-1.5 text-xs font-semibold text-ink-950">{copy.transmitting}</span> : null}
        </div> : null}
        {errorText && cameraStream ? <div role="alert" className="absolute inset-x-3 bottom-3 rounded-xl border border-rose-400/30 bg-rose-950/90 px-4 py-3 text-sm leading-5 text-white">{errorText}</div> : null}
      </section>

      <div className="relative z-10 shrink-0 px-4 pb-2 pt-4 sm:px-6">
        {status === 'ready' || status === 'requesting' ? <div className="mx-auto flex max-w-lg flex-col gap-3">
          {!requestedRef.current ? <Button variant="callActive" disabled={!canUse || status === 'requesting'} onClick={() => void connectToComputer()} className="h-12 w-full rounded-full text-base">
            {status === 'requesting' ? <LoaderCircle size={18} className="mr-2 animate-spin" /> : <Camera size={18} className="mr-2" />}{copy.confirmConnection}
          </Button> : null}
          <p className="text-center text-xs leading-5 text-ink-400">{copy.connectionHint}</p>
        </div> : null}
        {!isCameraActive && status !== 'ended' ? <Button variant="callActive" disabled={!canUse || status === 'requesting'} onClick={() => void startCamera()} className="mx-auto h-12 w-full max-w-lg rounded-full text-base">
          {status === 'requesting' ? <LoaderCircle size={18} className="mr-2 animate-spin" /> : <Camera size={18} className="mr-2" />}{copy.startCamera}
        </Button> : null}
        <div className="mx-auto mt-3 flex max-w-lg flex-wrap items-center justify-center gap-2 sm:gap-3">
          <Button variant="media" shape="icon" className="h-12 w-12 rounded-full" aria-label={copy.flipCamera} title={copy.flipCamera} disabled={!isCameraActive} onClick={() => void switchCamera()}><SwitchCamera size={20} /></Button>
          {audioAllowed ? <Button variant={microphoneOn ? 'mediaActive' : 'media'} shape="icon" className="h-12 w-12 rounded-full" aria-label={microphoneOn ? copy.microphoneOn : copy.microphoneOff} aria-pressed={microphoneOn} title={copy.microphone} disabled={status !== 'connected'} onClick={() => void toggleMicrophone()}>{microphoneOn ? <Mic size={20} /> : <MicOff size={20} />}</Button> : null}
          <Button variant={paused ? 'mediaActive' : 'media'} shape="icon" className="h-12 w-12 rounded-full" aria-label={paused ? copy.resumeCamera : copy.pauseCamera} aria-pressed={paused} title={paused ? copy.resumeCamera : copy.pauseCamera} disabled={!isCameraActive} onClick={togglePause}>{paused ? <Play size={19} /> : <CameraOff size={19} />}</Button>
          {torchSupported ? <Button variant={torchOn ? 'mediaActive' : 'media'} shape="icon" className="h-12 w-12 rounded-full" aria-label={copy.torch} aria-pressed={torchOn} aria-busy={torchPending} title={copy.torch} disabled={!isCameraActive || torchPending} onClick={() => void toggleTorch()}>{torchOn ? <FlashlightOff size={20} /> : <Flashlight size={20} />}</Button> : null}
          <Button variant="media" shape="icon" className="h-12 w-12 rounded-full" aria-label={copy.openSettings} aria-expanded={settingsOpen} title={copy.openSettings} onClick={() => setSettingsOpen((current) => !current)}><Settings2 size={20} /></Button>
          <Button variant="mediaDanger" shape="icon" className="h-12 w-12 rounded-full" aria-label={copy.endSession} title={copy.endSession} disabled={status === 'ended'} onClick={() => void endConnection()}><CameraOff size={20} /></Button>
        </div>
      </div>

      <p role="status" aria-live="polite" className="min-h-8 shrink-0 px-5 pt-1 text-center text-xs leading-5 text-ink-400">{errorText || (status === 'connected' ? copy.transmitting : statusLabel)}</p>

      {settingsOpen ? <div className="fixed inset-0 z-30 flex items-end bg-black/60" onClick={() => setSettingsOpen(false)}>
        <section role="dialog" aria-modal="true" aria-label={copy.openSettings} onClick={(event) => event.stopPropagation()} className="max-h-[82svh] w-full overscroll-contain overflow-y-auto rounded-t-3xl border-t border-ink-700 bg-ink-900 px-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] pt-4 shadow-2xl sm:mx-auto sm:max-w-xl sm:rounded-3xl sm:border">
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-ink-600 sm:hidden" />
          <div className="flex items-center justify-between gap-3"><h2 className="text-base font-semibold text-white">{copy.openSettings}</h2><Button variant="media" shape="icon" className="h-10 w-10" aria-label={copy.closeSettings} onClick={() => setSettingsOpen(false)}><X size={18} /></Button></div>
          <div className="mt-5 space-y-5">
            <label className="block text-sm font-medium text-ink-200">{copy.quality}
              <select value={quality} onChange={(event) => void changeQuality(event.target.value as WebcamQualityPreset)} className="mt-2 h-12 w-full rounded-xl border border-ink-700 bg-ink-950 px-3 text-base text-white focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30">
                {(['economy', 'balanced', 'high', 'fluid', 'ultra'] as const).map((value) => <option key={value} value={value}>{presetName(value, copy)}</option>)}
              </select>
            </label>
            <label className="block text-sm font-medium text-ink-200">{copy.preferenceMode}
              <select value={qualityMode} onChange={(event) => void setSenderParameters(event.target.value as typeof qualityMode)} className="mt-2 h-12 w-full rounded-xl border border-ink-700 bg-ink-950 px-3 text-base text-white focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30">
                <option value="quality">{copy.preferQuality}</option><option value="balanced">{copy.preferBalance}</option><option value="motion">{copy.preferFluency}</option>
              </select>
            </label>
            {cameraDevices.length > 1 ? <label className="block text-sm font-medium text-ink-200">{copy.cameraSource}
              <select value={cameraId} onChange={(event) => void switchCamera(event.target.value)} className="mt-2 h-12 w-full min-w-0 rounded-xl border border-ink-700 bg-ink-950 px-3 text-base text-white focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30">
                {cameraDevices.map((device, index) => <option key={device.deviceId || index} value={device.deviceId}>{device.label || copy.camera + ' ' + (index + 1)}</option>)}
              </select>
            </label> : null}
            {zoomRange ? <label className="block text-sm text-ink-200">{copy.zoom}<span className="float-right tabular-nums text-ink-400">{zoomRange.value.toFixed(1)}×</span><input aria-label={copy.zoom} type="range" min={zoomRange.min} max={zoomRange.max} step={zoomRange.step} value={zoomRange.value} onChange={(event) => void setZoom(Number(event.target.value))} className="mt-3 w-full accent-accent-500" /></label> : null}
            {torchSupported ? <Button variant={torchOn ? 'mediaActive' : 'media'} aria-pressed={torchOn} aria-busy={torchPending} disabled={!isCameraActive || torchPending} onClick={() => void toggleTorch()} className="min-h-11 w-full">{torchOn ? <FlashlightOff size={17} className="mr-2" /> : <Flashlight size={17} className="mr-2" />}{copy.torch}</Button> : null}
            <div className="rounded-xl border border-ink-700 bg-ink-950 p-3 text-xs leading-5 text-ink-300">
              <div className="flex items-center justify-between gap-3"><span>{copy.resolution}</span><span className="font-medium tabular-nums text-white">{actualResolution || copy.unknown}</span></div>
              <div className="mt-2 flex items-center justify-between gap-3"><span>{copy.frameRate}</span><span className="font-medium tabular-nums text-white">{actualFps ? Math.round(actualFps) + ' fps' : copy.unknown}</span></div>
            </div>
          </div>
        </section>
      </div> : null}
    </main>
  );
}
