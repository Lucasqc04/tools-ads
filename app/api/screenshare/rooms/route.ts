import {
  SCREENSHARE_ROOM_TTL_SECONDS,
  isQualityMode,
  isValidSecret,
  type ScreenShareRoomRecord,
} from '@/lib/screenshare/protocol';
import { createRandomHex, requestFingerprint, sha256Hex } from '@/lib/screenshare/auth';
import { createRoom, consumeRateLimit, getConfiguredViewerLimit } from '@/lib/screenshare/store';
import { isRecord, json, readJsonBody, serverError } from '@/lib/screenshare/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const body = await readJsonBody(request, 2_000);
  if (!body.ok) return json({ error: body.code }, body.status);
  if (!isRecord(body.value)) return json({ error: 'invalid_request' }, 400);

  const hostToken = request.headers.get('x-screenshare-host-token');
  if (!isValidSecret(hostToken)) return json({ error: 'invalid_host_token' }, 400);

  const qualityMode = body.value.qualityMode ?? 'automatic';
  if (!isQualityMode(qualityMode)) return json({ error: 'invalid_quality_mode' }, 400);
  const configuredLimit = getConfiguredViewerLimit();
  const viewerLimit = body.value.viewerLimit === undefined ? configuredLimit : body.value.viewerLimit;
  if (!Number.isInteger(viewerLimit) || Number(viewerLimit) < 1 || Number(viewerLimit) > configuredLimit) {
    return json({ error: 'invalid_viewer_limit' }, 400);
  }

  try {
    const fingerprint = await requestFingerprint(request);
    if (!(await consumeRateLimit(`screenshare:rate:create:${fingerprint}`, 60, 4))) {
      return json({ error: 'rate_limited' }, 429);
    }

    const now = Date.now();
    const id = createRandomHex(24);
    const record: ScreenShareRoomRecord = {
      id,
      hostTokenHash: await sha256Hex(hostToken),
      status: 'active',
      createdAt: now,
      lastHostHeartbeat: now,
      hardExpiresAt: now + SCREENSHARE_ROOM_TTL_SECONDS * 1_000,
      viewerLimit: Number(viewerLimit),
      maxViewerLimit: configuredLimit,
      qualityMode,
      audioAvailable: false,
    };

    if (!(await createRoom(record))) return json({ error: 'try_again' }, 503);
    return json({ roomId: id, viewerLimit: record.viewerLimit, expiresAt: record.hardExpiresAt });
  } catch (error) {
    return serverError(error);
  }
}
