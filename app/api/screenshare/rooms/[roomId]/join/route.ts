import { requestFingerprint, sha256Hex } from '@/lib/screenshare/auth';
import { isValidPeerId, isValidRoomId, isValidSecret } from '@/lib/screenshare/protocol';
import { consumeRateLimit, joinRoom } from '@/lib/screenshare/store';
import { isRecord, json, readJsonBody, serverError } from '@/lib/screenshare/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type RouteProps = { params: Promise<{ roomId: string }> };

export async function POST(request: Request, { params }: RouteProps) {
  const { roomId } = await params;
  if (!isValidRoomId(roomId)) return json({ error: 'not_found' }, 404);
  const body = await readJsonBody(request, 2_000);
  if (!body.ok) return json({ error: body.code }, body.status);
  if (!isRecord(body.value) || typeof body.value.peerId !== 'string' || !isValidPeerId(body.value.peerId)) {
    return json({ error: 'invalid_request' }, 400);
  }

  const viewerToken = request.headers.get('x-screenshare-viewer-token');
  if (!isValidSecret(viewerToken)) return json({ error: 'invalid_viewer_token' }, 400);

  try {
    const peerId = body.value.peerId;
    const fingerprint = await requestFingerprint(request);
    if (!(await consumeRateLimit(`screenshare:rate:join:${roomId}:${fingerprint}`, 60, 12))) {
      return json({ error: 'rate_limited' }, 429);
    }

    const outcome = await joinRoom({
      id: roomId,
      peerId,
      tokenHash: await sha256Hex(viewerToken),
      now: Date.now(),
    });

    if (outcome === 'joined' || outcome === 'existing') {
      return json({ peerId, resumed: outcome === 'existing' });
    }
    if (outcome === 'full') return json({ error: 'room_full' }, 409);
    if (outcome === 'recovering') return json({ error: 'host_recovering' }, 409);
    if (outcome === 'closed' || outcome === 'expired') return json({ error: 'room_ended' }, 410);
    if (outcome === 'unauthorized') return json({ error: 'not_found' }, 404);
    if (outcome === 'conflict') return json({ error: 'try_again' }, 409);
    return json({ error: 'not_found' }, 404);
  } catch (error) {
    return serverError(error);
  }
}
