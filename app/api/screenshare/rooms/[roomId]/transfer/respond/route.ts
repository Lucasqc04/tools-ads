import { sha256Hex } from '@/lib/screenshare/auth';
import { isValidPeerId, isValidRoomId, isValidSecret } from '@/lib/screenshare/protocol';
import { consumeRateLimit, respondHostTransfer, sendSignal } from '@/lib/screenshare/store';
import { isRecord, json, readJsonBody, serverError } from '@/lib/screenshare/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type RouteProps = { params: Promise<{ roomId: string }> };

/** Viewer side: accept or decline a host-transfer request addressed to this viewer. */
export async function POST(request: Request, { params }: RouteProps) {
  const { roomId } = await params;
  if (!isValidRoomId(roomId)) return json({ error: 'not_found' }, 404);
  const token = request.headers.get('x-screenshare-viewer-token');
  if (!isValidSecret(token)) return json({ error: 'unauthorized' }, 401);
  const body = await readJsonBody(request, 1_000);
  if (!body.ok) return json({ error: body.code }, body.status);
  if (!isRecord(body.value) || typeof body.value.peerId !== 'string' || !isValidPeerId(body.value.peerId) || typeof body.value.accept !== 'boolean') {
    return json({ error: 'invalid_request' }, 400);
  }

  try {
    const peerId = body.value.peerId;
    const tokenHash = await sha256Hex(token);
    if (!(await consumeRateLimit(`screenshare:rate:transfer-respond:${roomId}:${peerId}`, 60, 12))) return json({ error: 'rate_limited' }, 429);
    const now = Date.now();
    const outcome = await respondHostTransfer({ id: roomId, peerId, tokenHash, accept: body.value.accept, now });

    if (outcome === 'transferred') return json({ status: 'transferred' });
    if (outcome === 'declined') {
      // The host is still waiting for an answer; tell it the request was refused.
      await sendSignal({ id: roomId, role: 'viewer', peerId, tokenHash, target: 'host', signal: { type: 'transfer-response', accepted: false }, now });
      return json({ status: 'declined' });
    }
    if (outcome === 'expired') return json({ status: 'expired' }, 409);
    if (outcome === 'unauthorized') return json({ error: 'not_found' }, 404);
    if (outcome === 'closed') return json({ error: 'room_ended' }, 410);
    return json({ error: 'not_found' }, 404);
  } catch (error) {
    return serverError(error);
  }
}
