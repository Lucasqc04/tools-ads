import { isIP } from 'node:net';

const parseIpv4 = (address: string): number[] | null => {
  const parts = address.split('.');
  if (parts.length !== 4) {
    return null;
  }

  const octets = parts.map((part) => (/^\d{1,3}$/.test(part) ? Number(part) : NaN));
  return octets.every((octet) => octet >= 0 && octet <= 255) ? octets : null;
};

const isBlockedIpv4 = ([a, b, c]: number[]): boolean =>
  a === 0 || // "this" network
  a === 10 || // private
  a === 127 || // loopback
  (a === 100 && b >= 64 && b <= 127) || // carrier-grade NAT
  (a === 169 && b === 254) || // link-local, cloud metadata
  (a === 172 && b >= 16 && b <= 31) || // private
  (a === 192 && b === 0 && c === 0) || // IETF protocol assignments
  (a === 192 && b === 0 && c === 2) || // TEST-NET-1
  (a === 192 && b === 168) || // private
  (a === 198 && (b === 18 || b === 19)) || // benchmarking
  (a === 198 && b === 51 && c === 100) || // TEST-NET-2
  (a === 203 && b === 0 && c === 113) || // TEST-NET-3
  a >= 224; // multicast, reserved, broadcast

/** Expands an IPv6 literal to 8 groups of 16 bits, or null when malformed. */
const parseIpv6 = (address: string): number[] | null => {
  let value = address.toLowerCase();
  const zoneIndex = value.indexOf('%');
  if (zoneIndex !== -1) {
    value = value.slice(0, zoneIndex);
  }

  const lastColon = value.lastIndexOf(':');
  const tail = value.slice(lastColon + 1);
  if (tail.includes('.')) {
    const v4 = parseIpv4(tail);
    if (!v4) {
      return null;
    }
    value = `${value.slice(0, lastColon + 1)}${((v4[0] << 8) | v4[1]).toString(16)}:${((v4[2] << 8) | v4[3]).toString(16)}`;
  }

  const halves = value.split('::');
  if (halves.length > 2) {
    return null;
  }

  const head = halves[0] ? halves[0].split(':') : [];
  const rest = halves.length === 2 && halves[1] ? halves[1].split(':') : [];
  const missing = 8 - head.length - rest.length;

  if ((halves.length === 1 && missing !== 0) || missing < 0) {
    return null;
  }

  const groups = [...head, ...Array<string>(halves.length === 2 ? missing : 0).fill('0'), ...rest];
  if (groups.length !== 8 || groups.some((group) => !/^[0-9a-f]{1,4}$/.test(group))) {
    return null;
  }

  return groups.map((group) => parseInt(group, 16));
};

const isBlockedIpv6 = (groups: number[]): boolean => {
  const [g0, g1, g2, g3, g4, g5, g6, g7] = groups;

  const isUnspecifiedOrLoopback =
    groups.slice(0, 7).every((group) => group === 0) && (g7 === 0 || g7 === 1);
  if (isUnspecifiedOrLoopback) {
    return true;
  }

  // IPv4-mapped (::ffff:a.b.c.d) and IPv4-compatible (::a.b.c.d): judge the embedded IPv4.
  const embeddedV4 = [g6 >> 8, g6 & 0xff, g7 >> 8, g7 & 0xff];
  if (g0 === 0 && g1 === 0 && g2 === 0 && g3 === 0 && g4 === 0 && (g5 === 0xffff || g5 === 0)) {
    return isBlockedIpv4(embeddedV4);
  }
  // NAT64 64:ff9b::/96 embeds an IPv4 address as well.
  if (g0 === 0x64 && g1 === 0xff9b && g2 === 0 && g3 === 0 && g4 === 0 && g5 === 0) {
    return isBlockedIpv4(embeddedV4);
  }

  return (
    (g0 & 0xfe00) === 0xfc00 || // unique local fc00::/7
    (g0 & 0xffc0) === 0xfe80 || // link-local fe80::/10
    (g0 & 0xffc0) === 0xfec0 || // deprecated site-local
    (g0 & 0xff00) === 0xff00 || // multicast
    (g0 === 0x2001 && g1 === 0x0db8) || // documentation
    g0 === 0x2002 // 6to4 can tunnel to private IPv4
  );
};

/**
 * True when connecting to this literal would reach a loopback, private,
 * link-local, multicast or otherwise non-public destination. Anything that is
 * not a parseable IP is treated as blocked (fail closed).
 */
export const isBlockedIp = (address: string): boolean => {
  const family = isIP(address);

  if (family === 4) {
    const octets = parseIpv4(address);
    return !octets || isBlockedIpv4(octets);
  }

  if (family === 6) {
    const groups = parseIpv6(address);
    return !groups || isBlockedIpv6(groups);
  }

  return true;
};
