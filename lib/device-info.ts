export type DeviceInfo = {
  deviceType: 'mobile' | 'tablet' | 'desktop' | 'unknown';
  os: string;
  browser: string;
  ua: string;
  isMobile: boolean;
};

export function parseUserAgent(ua = ''): DeviceInfo {
  const isMobile = /Mobi|Android|iPhone|iPad|iPod|Tablet/i.test(ua);

  let os = 'Unknown';
  if (/Windows NT/i.test(ua)) os = 'Windows';
  else if (/Mac OS X|Macintosh/i.test(ua)) os = 'macOS';
  else if (/Android/i.test(ua)) os = 'Android';
  else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';
  else if (/Linux/i.test(ua)) os = 'Linux';

  let browser = 'Unknown';
  if (/Edg\/|Edge\//i.test(ua)) browser = 'Edge';
  else if (/OPR\//i.test(ua) || /Opera\//i.test(ua)) browser = 'Opera';
  else if (/Chrome\//i.test(ua) && !/Edg\//i.test(ua) && !/OPR\//i.test(ua)) browser = 'Chrome';
  else if (/Firefox\//i.test(ua)) browser = 'Firefox';
  else if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) browser = 'Safari';

  let deviceType: DeviceInfo['deviceType'] = 'desktop';
  if (/Mobi|Android|iPhone|iPod/i.test(ua)) deviceType = 'mobile';
  else if (/Tablet|iPad/i.test(ua)) deviceType = 'tablet';

  return {
    deviceType,
    os,
    browser,
    ua,
    isMobile,
  };
}

export function formatIpNoDots(ip?: string): string {
  if (!ip) return '';
  return ip.replaceAll('.', '');
}
