import {
  isValidWebcamSessionId,
  isValidWebcamClientId,
  isValidWebcamSignalId,
  isValidWebcamToken,
  isWebcamSignalAllowed,
  validateWebcamSignal,
} from '@/lib/celular-webcam/protocol';
import { pollWebcamSignals, sendWebcamSignal } from '@/lib/celular-webcam/store';
import {
  getAuthorizedToken,
  getRoleFromRequest,
  hashWebcamToken,
  isRequestRecord,
  json,
  readJsonBody,
  serverError,
} from '@/lib/celular-webcam/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type RouteProps = { params: Promise<{ sessionId: string }> };

export async function GET(request: Request, { params }: RouteProps) {
  const { sessionId } = await params;
  const role = getRoleFromRequest(request);
  const clientId = new URL(request.url).searchParams.get('clientId') ?? undefined;
  const token = getAuthorizedToken(request);
  if (!isValidWebcamSessionId(sessionId) || !role || !isValidWebcamToken(token)) {
    return json({ error: 'not_found' }, 404);
  }
  if (role === 'phone' && !isValidWebcamClientId(clientId)) return json({ error: 'not_found' }, 404);

  try {
    const result = await pollWebcamSignals({ id: sessionId, role, clientId, tokenHash: hashWebcamToken(token) });
    if (result.status === 'not_found') return json({ error: 'not_found' }, 404);
    if (result.status === 'expired') return json({ error: 'session_expired' }, 410);
    if (result.status === 'rate_limited') return json({ error: 'rate_limited' }, 429);
    return json(result);
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: Request, { params }: RouteProps) {
  const { sessionId } = await params;
  if (!isValidWebcamSessionId(sessionId)) return json({ error: 'not_found' }, 404);

  const token = getAuthorizedToken(request);
  if (!token) return json({ error: 'not_found' }, 404);
  const body = await readJsonBody(request);
  if (!body.ok) return json({ error: body.code }, body.status);
  if (!isRequestRecord(body.value) || (body.value.role !== 'host' && body.value.role !== 'phone')) {
    return json({ error: 'invalid_request' }, 400);
  }
  if (body.value.role === 'phone' && !isValidWebcamClientId(body.value.clientId)) return json({ error: 'not_found' }, 404);
  const clientId = body.value.role === 'phone' && typeof body.value.clientId === 'string' ? body.value.clientId : undefined;
  if (!isValidWebcamSignalId(body.value.signalId)) return json({ error: 'invalid_signal' }, 400);
  const signal = validateWebcamSignal(body.value.signal);
  if (!signal) return json({ error: 'invalid_signal' }, 400);
  const role = body.value.role;
  if (!isWebcamSignalAllowed(role, signal)) return json({ error: 'invalid_signal_direction' }, 400);

  try {
    const result = await sendWebcamSignal({
      id: sessionId,
      role,
      clientId,
      tokenHash: hashWebcamToken(token),
      signalId: body.value.signalId,
      signal,
    });
    if (result === 'ok' || result === 'duplicate') return json({ ok: true });
    if (result === 'not_found') return json({ error: 'not_found' }, 404);
    if (result === 'expired') return json({ error: 'session_expired' }, 410);
    if (result === 'rate_limited' || result === 'queue_full') return json({ error: 'rate_limited' }, 429);
    if (result === 'invalid_direction') return json({ error: 'invalid_signal_direction' }, 400);
    if (result === 'invalid_state') return json({ error: 'invalid_state' }, 409);
    return json({ error: 'service_unavailable' }, 503);
  } catch (error) {
    return serverError(error);
  }
}
