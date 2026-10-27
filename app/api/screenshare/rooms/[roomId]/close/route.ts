import { sha256Hex } from '@/lib/screenshare/auth';
import { isValidRoomId, isValidSecret } from '@/lib/screenshare/protocol';
import { closeRoom, consumeRateLimit } from '@/lib/screenshare/store';
import { json, serverError } from '@/lib/screenshare/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type RouteProps = { params: Promise<{ roomId: string }> };

export async function POST(request: Request, { params }: RouteProps) {
  const { roomId } = await params;
  if (!isValidRoomId(roomId)) return json({ error: 'not_found' }, 404);
  const token = request.headers.get('x-screenshare-host-token');
  if (!isValidSecret(token)) return json({ error: 'unauthorized' }, 401);

  try {
    if (!(await consumeRateLimit(`screenshare:rate:close:${roomId}`, 60, 12))) {
      return json({ error: 'rate_limited' }, 429);
    }
    const result = await closeRoom({ id: roomId, tokenHash: await sha256Hex(token), now: Date.now() });
    if (result === 'ok' || result === 'closed') return json({ ok: true });
    if (result === 'unauthorized') return json({ error: 'not_found' }, 404);
    return json({ error: 'not_found' }, 404);
  } catch (error) {
    return serverError(error);
  }
}
