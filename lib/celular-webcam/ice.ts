import { createHmac } from 'node:crypto';

const parseUrls = (value: string | undefined, prefixes: string[]): string[] =>
  (value ?? '')
    .split(',')
    .map((url) => url.trim())
    .filter((url) => prefixes.some((prefix) => url.startsWith(prefix)));

export const getWebcamIceServers = (now = Date.now()): RTCIceServer[] => {
  const stunUrls = parseUrls(process.env.SCREENSHARE_STUN_URLS, ['stun:', 'stuns:']);
  const servers: RTCIceServer[] = [{
    urls: stunUrls.length > 0 ? stunUrls : ['stun:stun.l.google.com:19302'],
  }];

  const turnUrls = parseUrls(process.env.WEBRTC_TURN_URLS, ['turn:', 'turns:']);
  const sharedSecret = process.env.WEBRTC_TURN_SHARED_SECRET?.trim();
  if (turnUrls.length > 0 && sharedSecret) {
    const configuredTtl = Number.parseInt(process.env.WEBRTC_TURN_CREDENTIAL_TTL_SECONDS ?? '', 10);
    const ttl = Number.isFinite(configuredTtl) ? Math.min(3_600, Math.max(300, configuredTtl)) : 900;
    const username = String(Math.floor(now / 1_000) + ttl) + ':adtools-webcam';
    const credential = createHmac('sha1', sharedSecret).update(username).digest('base64');
    servers.push({ urls: turnUrls, username, credential });
  }

  return servers;
};
