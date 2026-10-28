import { sha256Hex } from '@/lib/screenshare/auth';
import { isValidPeerId, isValidRoomId, isValidSecret } from '@/lib/screenshare/protocol';
import { approveViewer, consumeRateLimit, getHostPeers, rejectViewer } from '@/lib/screenshare/store';
import { isRecord, json, readJsonBody, serverError } from '@/lib/screenshare/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type RouteProps = { params: Promise<{ roomId: string }> };

export async function GET(request: Request, { params }: RouteProps) {
  const { roomId } = await params;
  if (!isValidRoomId(roomId)) return json({ error: 'not_found' }, 404);
  const token = request.headers.get('x-screenshare-host-token');
  if (!isValidSecret(token)) return json({ error: 'unauthorized' }, 401);

  try {
    if (!(await consumeRateLimit(`screenshare:rate:peers:${roomId}`, 60, 60))) {
      return json({ error: 'rate_limited' }, 429);
    }
    const result = await getHostPeers(roomId, await sha256Hex(token), Date.now());
    if (result.status === 'unauthorized') return json({ error: 'not_found' }, 404);
    if (result.status === 'missing') return json({ error: 'not_found' }, 404);
    return json({ host: result.host, hostPeerId: result.hostPeerId, peers: result.peers, pending: result.pending, screenSharerId: result.screenSharerId, audioAvailable: result.audioAvailable });
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: Request, { params }: RouteProps) {
  const { roomId } = await params;
  if (!isValidRoomId(roomId)) return json({ error: 'not_found' }, 404);
  const token = request.headers.get('x-screenshare-host-token');
  if (!isValidSecret(token)) return json({ error: 'unauthorized' }, 401);
  const body = await readJsonBody(request, 1_000);
  if (!body.ok) return json({ error: body.code }, body.status);
  if (!isRecord(body.value) || (body.value.action !== 'approve' && body.value.action !== 'reject') || typeof body.value.peerId !== 'string' || !isValidPeerId(body.value.peerId)) {
    return json({ error: 'invalid_request' }, 400);
  }

  try {
    if (!(await consumeRateLimit(`screenshare:rate:admit:${roomId}`, 60, 60))) return json({ error: 'rate_limited' }, 429);
    const result = body.value.action === 'approve'
      ? await approveViewer({ id: roomId, peerId: body.value.peerId, tokenHash: await sha256Hex(token), now: Date.now() })
      : await rejectViewer({ id: roomId, peerId: body.value.peerId, tokenHash: await sha256Hex(token), now: Date.now() });
    if (result === 'approved' || result === 'rejected') return json({ ok: true, state: result });
    if (result === 'full') return json({ error: 'room_full' }, 409);
    if (result === 'unauthorized' || result === 'missing') return json({ error: 'not_found' }, 404);
    if (result === 'closed') return json({ error: 'room_ended' }, 410);
    return json({ error: 'request_expired' }, 409);
  } catch (error) {
    return serverError(error);
  }
}
