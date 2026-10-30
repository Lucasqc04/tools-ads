import { isValidWebcamClientId, isValidWebcamSessionId } from '@/lib/celular-webcam/protocol';
import { getWebcamIceServers } from '@/lib/celular-webcam/ice';
import { authorizeWebcamSession } from '@/lib/celular-webcam/store';
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

export async function GET(request: Request, { params }: RouteProps) {
  const { sessionId } = await params;
  const role = getRoleFromRequest(request);
  const clientId = new URL(request.url).searchParams.get('clientId') ?? undefined;
  const token = getAuthorizedToken(request);
  if (!isValidWebcamSessionId(sessionId) || !role || !token) return json({ error: 'not_found' }, 404);
  if (role === 'phone' && !isValidWebcamClientId(clientId)) return json({ error: 'not_found' }, 404);

  try {
    const access = await authorizeWebcamSession({ id: sessionId, role, clientId, tokenHash: hashWebcamToken(token) });
    if (access.status === 'not_found') return json({ error: 'not_found' }, 404);
    if (access.status === 'expired' || access.status === 'closed') return json({ error: 'session_expired' }, 410);
    return json({ iceServers: getWebcamIceServers() });
  } catch (error) {
    return serverError(error);
  }
}
