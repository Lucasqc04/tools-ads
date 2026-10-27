import { sha256Hex } from '@/lib/screenshare/auth';
import { isValidRoomId, isValidSecret } from '@/lib/screenshare/protocol';
import { consumeRateLimit, getHostPeers } from '@/lib/screenshare/store';
import { json, serverError } from '@/lib/screenshare/http';

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
    return json({ peers: result.peers });
  } catch (error) {
    return serverError(error);
  }
}
