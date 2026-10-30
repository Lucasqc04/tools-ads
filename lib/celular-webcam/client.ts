import type { WebcamRole, WebcamSessionStatus, WebcamSignal } from './protocol';

export type WebcamPollResult = {
  status: WebcamSessionStatus | 'expired' | 'not_found' | 'rate_limited';
  messages: WebcamSignal[];
  expiresAt?: number;
};

export type WebcamStats = {
  resolution: string | null;
  fps: number | null;
  bitrateBps: number | null;
  packetLossPercent: number | null;
  roundTripMs: number | null;
  route: 'direct' | 'relay' | null;
};

export class WebcamApiError extends Error {
  constructor(public readonly code: string) {
    super('Webcam request failed.');
    this.name = 'WebcamApiError';
  }
}

const sessionBase = (sessionId: string) => '/api/webcam/sessions/' + encodeURIComponent(sessionId);

export const webcamRequest = async <T,>(url: string, init: RequestInit = {}): Promise<T> => {
  const response = await fetch(url, { cache: 'no-store', ...init });
  const payload = await response.json().catch(() => null) as { error?: unknown } | null;
  if (!response.ok) {
    throw new WebcamApiError(typeof payload?.error === 'string' ? payload.error : 'service_unavailable');
  }
  return payload as T;
};

export const sendWebcamSignalRequest = (
  sessionId: string,
  role: WebcamRole,
  token: string,
  signal: WebcamSignal,
  clientId?: string,
): Promise<{ ok: true }> => webcamRequest(sessionBase(sessionId) + '/signals', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'X-Webcam-Token': token },
  body: JSON.stringify({ role, signalId: createWebcamSignalId(), signal, ...(clientId ? { clientId } : {}) }),
});

export const pollWebcamSignalRequest = (
  sessionId: string,
  role: WebcamRole,
  token: string,
  clientId?: string,
): Promise<WebcamPollResult> => {
  const query = new URLSearchParams({ role });
  if (clientId) query.set('clientId', clientId);
  return webcamRequest(sessionBase(sessionId) + '/signals?' + query.toString(), {
    headers: { 'X-Webcam-Token': token },
  });
};

export const getWebcamIceServersRequest = (
  sessionId: string,
  role: WebcamRole,
  token: string,
  clientId?: string,
): Promise<{ iceServers: RTCIceServer[] }> => {
  const query = new URLSearchParams({ role });
  if (clientId) query.set('clientId', clientId);
  return webcamRequest(sessionBase(sessionId) + '/ice?' + query.toString(), {
    headers: { 'X-Webcam-Token': token },
  });
};

export const heartbeatWebcamSessionRequest = (
  sessionId: string,
  role: WebcamRole,
  token: string,
  clientId?: string,
): Promise<{ ok: true }> => {
  const query = new URLSearchParams({ role });
  if (clientId) query.set('clientId', clientId);
  return webcamRequest(sessionBase(sessionId) + '/heartbeat?' + query.toString(), {
    method: 'POST',
    headers: { 'X-Webcam-Token': token },
  });
};

export const closeWebcamSessionRequest = (
  sessionId: string,
  role: WebcamRole,
  token: string,
  clientId?: string,
  keepalive = false,
): Promise<{ ok: true }> => {
  const query = new URLSearchParams({ role });
  if (clientId) query.set('clientId', clientId);
  return webcamRequest(sessionBase(sessionId) + '?' + query.toString(), {
    method: 'DELETE',
    headers: { 'X-Webcam-Token': token },
    keepalive,
  });
};

export const createWebcamClientId = (): string => {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
};

export const createWebcamSignalId = (): string => {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
};
