import { sha256Hex } from '@/lib/screenshare/auth';
import { isValidRoomId, isValidSecret } from '@/lib/screenshare/protocol';
import { consumeRateLimit, handoffHost } from '@/lib/screenshare/store';
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
    if (!(await consumeRateLimit(`screenshare:rate:handoff:${roomId}`, 60, 6))) return json({ error: 'rate_limited' }, 429);
    const result = await handoffHost({ id: roomId, tokenHash: await sha256Hex(token), now: Date.now() });
    if (result.status === 'transferred') return json({ ok: true, ...result });
    if (result.status === 'closed') return json({ ok: true, ...result });
    if (result.status === 'unauthorized' || result.status === 'missing') return json({ error: 'not_found' }, 404);
    return json({ error: 'room_ended' }, 410);
  } catch (error) {
    return serverError(error);
  }
}
