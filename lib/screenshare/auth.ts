export const sha256Hex = async (value: string): Promise<string> => {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
};

export const createRandomHex = (byteLength: number): string => {
  const bytes = crypto.getRandomValues(new Uint8Array(byteLength));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
};

export const requestFingerprint = async (request: Request): Promise<string> => {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const address = request.headers.get('x-real-ip')?.trim() || forwarded || 'unknown-client';
  return sha256Hex(address);
};
