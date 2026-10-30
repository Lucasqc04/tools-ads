import {
  WEBCAM_SESSION_TTL_SECONDS,
  createWebcamSessionRecord,
} from '@/lib/celular-webcam/protocol';
import {
  consumeWebcamRateLimit,
  createWebcamSession,
} from '@/lib/celular-webcam/store';
import {
  createWebcamSessionId,
  createWebcamToken,
  getHashedRequestAddress,
  hashWebcamToken,
  json,
  serverError,
} from '@/lib/celular-webcam/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const fingerprint = getHashedRequestAddress(request);
    if (!(await consumeWebcamRateLimit('webcam:create:' + fingerprint, 600, 5))) {
      return json({ error: 'rate_limited' }, 429);
    }

    const now = Date.now();
    const sessionId = createWebcamSessionId();
    const hostToken = createWebcamToken();
    const phoneToken = createWebcamToken();
    const record = createWebcamSessionRecord(
      sessionId,
      hashWebcamToken(hostToken),
      hashWebcamToken(phoneToken),
      now,
    );

    if (!(await createWebcamSession(record))) return json({ error: 'try_again' }, 503);

    return json({
      sessionId,
      hostToken,
      phoneToken,
      expiresAt: record.hardExpiresAt,
      idleTtlSeconds: WEBCAM_SESSION_TTL_SECONDS,
    });
  } catch (error) {
    return serverError(error);
  }
}
