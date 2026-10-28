import { sha256Hex } from '@/lib/screenshare/auth';
import { SCREENSHARE_TRANSFER_TTL_SECONDS, isValidPeerId, isValidRoomId, isValidSecret } from '@/lib/screenshare/protocol';
import { cancelHostTransfer, consumeRateLimit, requestHostTransfer, sendSignal } from '@/lib/screenshare/store';
import { isRecord, json, readJsonBody, serverError } from '@/lib/screenshare/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type RouteProps = { params: Promise<{ roomId: string }> };

/** Host side: `request` asks one viewer to become host, `cancel` withdraws the open request. */
export async function POST(request: Request, { params }: RouteProps) {
  const { roomId } = await params;
  if (!isValidRoomId(roomId)) return json({ error: 'not_found' }, 404);
  const token = request.headers.get('x-screenshare-host-token');
  if (!isValidSecret(token)) return json({ error: 'unauthorized' }, 401);
  const body = await readJsonBody(request, 1_000);
  if (!body.ok) return json({ error: body.code }, body.status);
  if (!isRecord(body.value) || (body.value.action !== 'request' && body.value.action !== 'cancel')) {
    return json({ error: 'invalid_request' }, 400);
  }

  try {
    const tokenHash = await sha256Hex(token);
    if (!(await consumeRateLimit(`screenshare:rate:transfer:${roomId}`, 60, 12))) return json({ error: 'rate_limited' }, 429);

    if (body.value.action === 'cancel') {
      const outcome = await cancelHostTransfer({ id: roomId, tokenHash });
      if (outcome === 'ok') return json({ ok: true });
      return json({ error: 'not_found' }, 404);
    }

    const peerId = body.value.peerId;
    if (typeof peerId !== 'string' || !isValidPeerId(peerId)) return json({ error: 'invalid_request' }, 400);
    const now = Date.now();
    const outcome = await requestHostTransfer({ id: roomId, tokenHash, peerId, now });
    if (outcome === 'unauthorized' || outcome === 'missing') return json({ error: 'not_found' }, 404);
    if (outcome === 'closed') return json({ error: 'room_ended' }, 410);
    if (outcome === 'self' || outcome === 'not_member') return json({ error: outcome }, 409);
    if (outcome !== 'ok') return json({ error: 'not_found' }, 404);

    const sent = await sendSignal({ id: roomId, role: 'host', peerId: 'host', tokenHash, target: peerId, signal: { type: 'transfer-request' }, now });
    if (typeof sent !== 'number') return json({ error: 'not_found' }, 404);
    return json({ ok: true, expiresAt: now + SCREENSHARE_TRANSFER_TTL_SECONDS * 1000 });
  } catch (error) {
    return serverError(error);
  }
}
