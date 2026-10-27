import { NextResponse } from 'next/server';
import { ScreenShareStoreUnavailableError } from './store';
import { SCREENSHARE_MAX_BODY_BYTES } from './protocol';

export type JsonBodyResult =
  | { ok: true; value: unknown }
  | { ok: false; status: 400 | 413; code: 'invalid_json' | 'body_too_large' };

export const readJsonBody = async (
  request: Request,
  maxBytes = SCREENSHARE_MAX_BODY_BYTES,
): Promise<JsonBodyResult> => {
  const contentLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(contentLength) && contentLength > maxBytes) {
    return { ok: false, status: 413, code: 'body_too_large' };
  }

  try {
    const raw = await request.text();
    if (new TextEncoder().encode(raw).byteLength > maxBytes) {
      return { ok: false, status: 413, code: 'body_too_large' };
    }
    return { ok: true, value: JSON.parse(raw) as unknown };
  } catch {
    return { ok: false, status: 400, code: 'invalid_json' };
  }
};

export const json = (body: unknown, status = 200) =>
  NextResponse.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store, max-age=0' },
  });

export const serverError = (error: unknown) => {
  if (error instanceof ScreenShareStoreUnavailableError) {
    return json({ error: 'redis_unavailable' }, 503);
  }
  return json({ error: 'service_unavailable' }, 503);
};

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
