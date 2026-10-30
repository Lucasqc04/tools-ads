import { createHash, randomBytes } from 'node:crypto';
import { NextResponse } from 'next/server';
import { WebcamStoreUnavailableError } from './store';
import { WEBCAM_SIGNAL_MAX_BYTES, isRecord } from './protocol';

export const json = (body: unknown, status = 200) => NextResponse.json(body, {
  status,
  headers: {
    'Cache-Control': 'no-store, max-age=0',
    'Referrer-Policy': 'no-referrer',
  },
});

export const serverError = (error: unknown) => {
  if (error instanceof WebcamStoreUnavailableError) return json({ error: 'service_unavailable' }, 503);
  return json({ error: 'service_unavailable' }, 503);
};

export type JsonBodyResult =
  | { ok: true; value: unknown }
  | { ok: false; status: 400 | 413; code: 'invalid_json' | 'body_too_large' };

export const readJsonBody = async (request: Request, maxBytes = WEBCAM_SIGNAL_MAX_BYTES): Promise<JsonBodyResult> => {
  const contentLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(contentLength) && contentLength > maxBytes) {
    return { ok: false, status: 413, code: 'body_too_large' };
  }
  try {
    const bytes = await request.arrayBuffer();
    if (bytes.byteLength > maxBytes) return { ok: false, status: 413, code: 'body_too_large' };
    return { ok: true, value: JSON.parse(new TextDecoder().decode(bytes)) as unknown };
  } catch {
    return { ok: false, status: 400, code: 'invalid_json' };
  }
};

export const isRequestRecord = isRecord;

export const createWebcamToken = (): string => randomBytes(32).toString('hex');
export const createWebcamSessionId = (): string => randomBytes(24).toString('hex');
export const createWebcamClientId = (): string => randomBytes(16).toString('hex');
export const hashWebcamToken = (token: string): string => createHash('sha256').update(token).digest('hex');

export const getHashedRequestAddress = (request: Request): string => {
  const address = request.headers.get('x-real-ip')?.trim()
    || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || 'unknown-client';
  return createHash('sha256').update(address).digest('hex');
};

export const getRoleFromRequest = (request: Request): 'host' | 'phone' | null => {
  const role = new URL(request.url).searchParams.get('role');
  return role === 'host' || role === 'phone' ? role : null;
};

export const getAuthorizedToken = (request: Request): string | null => {
  const token = request.headers.get('x-webcam-token');
  return typeof token === 'string' && /^[a-f0-9]{64}$/.test(token) ? token : null;
};
