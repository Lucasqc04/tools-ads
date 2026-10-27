import { sha256Hex } from '@/lib/screenshare/auth';
import { isValidPeerId, isValidRoomId, isValidSecret } from '@/lib/screenshare/protocol';
import { consumeRateLimit, leaveViewer } from '@/lib/screenshare/store';
import { isRecord, json, readJsonBody, serverError } from '@/lib/screenshare/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type RouteProps = { params: Promise<{ roomId: string }> };

export async function POST(request: Request, { params }: RouteProps) {
  const { roomId } = await params;
  if (!isValidRoomId(roomId)) return json({ error: 'not_found' }, 404);
  const body = await readJsonBody(request, 1_000);
  if (!body.ok) return json({ error: body.code }, body.status);
  if (!isRecord(body.value) || typeof body.value.peerId !== 'string' || !isValidPeerId(body.value.peerId)) return json({ error: 'invalid_request' }, 400);
  const token = request.headers.get('x-screenshare-viewer-token');
  if (!isValidSecret(token)) return json({ error: 'unauthorized' }, 401);

  try {
    const peerId = body.value.peerId;
    if (!(await consumeRateLimit(`screenshare:rate:leave:${roomId}:${peerId}`, 60, 12))) {
      return json({ error: 'rate_limited' }, 429);
    }
    const result = await leaveViewer({ id: roomId, peerId, tokenHash: await sha256Hex(token), now: Date.now() });
    if (result === 'ok' || result === 'missing') return json({ ok: true });
    if (result === 'unauthorized') return json({ error: 'not_found' }, 404);
    return json({ error: 'service_unavailable' }, 503);
  } catch (error) {
    return serverError(error);
  }
}
