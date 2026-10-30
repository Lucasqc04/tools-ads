import { isValidWebcamClientId, isValidWebcamSessionId } from '@/lib/celular-webcam/protocol';
import { heartbeatWebcamSession } from '@/lib/celular-webcam/store';
import {
  getAuthorizedToken,
  getRoleFromRequest,
  hashWebcamToken,
  json,
  serverError,
} from '@/lib/celular-webcam/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type RouteProps = { params: Promise<{ sessionId: string }> };

export async function POST(request: Request, { params }: RouteProps) {
  const { sessionId } = await params;
  const role = getRoleFromRequest(request);
  const clientId = new URL(request.url).searchParams.get('clientId') ?? undefined;
  const token = getAuthorizedToken(request);
  if (!isValidWebcamSessionId(sessionId) || !role || !token) return json({ error: 'not_found' }, 404);
  if (role === 'phone' && !isValidWebcamClientId(clientId)) return json({ error: 'not_found' }, 404);

  try {
    const status = await heartbeatWebcamSession({ id: sessionId, role, clientId, tokenHash: hashWebcamToken(token) });
    if (status === 'ok') return json({ ok: true });
    if (status === 'expired') return json({ error: 'session_expired' }, 410);
    return json({ error: 'not_found' }, 404);
  } catch (error) {
    return serverError(error);
  }
}
