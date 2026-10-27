import { json } from '@/lib/screenshare/http';
import { getConfiguredViewerLimit } from '@/lib/screenshare/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const parseUrls = (value: string | undefined): string[] =>
  (value ?? '').split(',').map((item) => item.trim()).filter(Boolean);

export async function GET() {
  const stunUrls = parseUrls(process.env.SCREENSHARE_STUN_URLS);
  const iceServers: RTCIceServer[] = [{
    urls: stunUrls.length > 0 ? stunUrls : ['stun:stun.l.google.com:19302'],
  }];

  return json({ iceServers, viewerLimit: getConfiguredViewerLimit() });
}
