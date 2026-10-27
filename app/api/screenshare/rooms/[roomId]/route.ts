import { requestFingerprint } from '@/lib/screenshare/auth';
import { isValidRoomId } from '@/lib/screenshare/protocol';
import { consumeRateLimit, getPublicRoomInfo } from '@/lib/screenshare/store';
import { json, serverError } from '@/lib/screenshare/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type RouteProps = { params: Promise<{ roomId: string }> };

export async function GET(request: Request, { params }: RouteProps) {
  const { roomId } = await params;
  if (!isValidRoomId(roomId)) return json({ error: 'not_found' }, 404);

  try {
    const fingerprint = await requestFingerprint(request);
    if (!(await consumeRateLimit(`screenshare:rate:room:${roomId}:${fingerprint}`, 60, 90))) {
      return json({ error: 'rate_limited' }, 429);
    }

    const info = await getPublicRoomInfo(roomId, Date.now());
    if (info.status !== 'ok') return json({ error: 'not_found' }, 404);
    return json(info);
  } catch (error) {
    return serverError(error);
  }
}
