import { describe, expect, it } from 'vitest';
import { isBlockedIp } from '../ip-guard';

describe('isBlockedIp', () => {
  it.each([
    '127.0.0.1',
    '127.255.255.254',
    '10.0.0.5',
    '172.16.0.1',
    '172.31.255.255',
    '192.168.1.1',
    '169.254.169.254',
    '100.64.0.1',
    '0.0.0.0',
    '224.0.0.1',
    '255.255.255.255',
    '::1',
    '::',
    'fe80::1',
    'fc00::1',
    'fd12:3456::1',
    'ff02::1',
    '::ffff:127.0.0.1',
    '::ffff:7f00:1',
    '::ffff:10.0.0.1',
    '64:ff9b::7f00:1',
    '2002:7f00:1::1',
    'not-an-ip',
    '',
  ])('blocks %s', (address) => {
    expect(isBlockedIp(address)).toBe(true);
  });

  it.each([
    '8.8.8.8',
    '104.244.42.1',
    '172.15.0.1',
    '172.32.0.1',
    '2606:4700:4700::1111',
    '2a03:2880:f12f:83:face:b00c:0:25de',
    '::ffff:8.8.8.8',
  ])('allows public address %s', (address) => {
    expect(isBlockedIp(address)).toBe(false);
  });
});
