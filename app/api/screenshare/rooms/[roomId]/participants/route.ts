import { sha256Hex } from '@/lib/screenshare/auth';
import { isValidPeerId, isValidRoomId, isValidSecret } from '@/lib/screenshare/protocol';
import { consumeRateLimit, getParticipants } from '@/lib/screenshare/store';
import { json, serverError } from '@/lib/screenshare/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type RouteProps = { params: Promise<{ roomId: string }> };

export async function GET(request: Request, { params }: RouteProps) {
  const { roomId } = await params;
  if (!isValidRoomId(roomId)) return json({ error: 'not_found' }, 404);
  const url = new URL(request.url);
  const peerId = url.searchParams.get('peerId') ?? '';
  if (!isValidPeerId(peerId)) return json({ error: 'invalid_request' }, 400);
  const token = request.headers.get('x-screenshare-viewer-token');
  if (!isValidSecret(token)) return json({ error: 'unauthorized' }, 401);

  try {
    if (!(await consumeRateLimit(`screenshare:rate:participants:${roomId}:${peerId}`, 60, 40))) return json({ error: 'rate_limited' }, 429);
    const result = await getParticipants({ id: roomId, peerId, tokenHash: await sha256Hex(token), now: Date.now() });
    if (result.status !== 'ok') return json({ error: 'not_found' }, 404);
    return json({ host: result.host, peers: result.peers, screenSharerId: result.screenSharerId, access: result.access, audioAvailable: result.audioAvailable });
  } catch (error) {
    return serverError(error);
  }
}
