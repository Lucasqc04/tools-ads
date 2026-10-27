import { sha256Hex } from '@/lib/screenshare/auth';
import { isRecord, json, readJsonBody, serverError } from '@/lib/screenshare/http';
import { isValidRoomId, isValidSecret } from '@/lib/screenshare/protocol';
import { setRoomViewerLimit } from '@/lib/screenshare/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type RouteProps = { params: Promise<{ roomId: string }> };

export async function POST(request: Request, { params }: RouteProps) {
  const { roomId } = await params;
  if (!isValidRoomId(roomId)) return json({ error: 'not_found' }, 404);
  const hostToken = request.headers.get('x-screenshare-host-token');
  if (!isValidSecret(hostToken)) return json({ error: 'not_found' }, 404);
  const body = await readJsonBody(request, 1_000);
  if (!body.ok) return json({ error: body.code }, body.status);
  if (!isRecord(body.value) || !Number.isInteger(body.value.viewerLimit) || Number(body.value.viewerLimit) < 1 || Number(body.value.viewerLimit) > 20) {
    return json({ error: 'invalid_request' }, 400);
  }

  try {
    const viewerLimit = Number(body.value.viewerLimit);
    const outcome = await setRoomViewerLimit({ id: roomId, tokenHash: await sha256Hex(hostToken), viewerLimit });
    if (outcome === 'ok') return json({ ok: true, viewerLimit });
    if (outcome === 'invalid') return json({ error: 'invalid_viewer_limit' }, 400);
    if (outcome === 'closed' || outcome === 'missing') return json({ error: 'room_ended' }, 410);
    return json({ error: 'not_found' }, 404);
  } catch (error) {
    return serverError(error);
  }
}
