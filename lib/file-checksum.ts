export type ChecksumAlgorithm = 'md5' | 'sha1' | 'sha256' | 'sha384' | 'sha512' | 'crc32';

export type FileChecksumResult = {
  algorithm: ChecksumAlgorithm;
  value: string;
};

const subtleAlgorithmName: Partial<Record<ChecksumAlgorithm, AlgorithmIdentifier>> = {
  sha1: 'SHA-1',
  sha256: 'SHA-256',
  sha384: 'SHA-384',
  sha512: 'SHA-512',
};

const toHex = (buffer: ArrayBuffer): string =>
  Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');

const crc32Table = (() => {
  const table = new Uint32Array(256);

  for (let index = 0; index < 256; index += 1) {
    let value = index;
    for (let bit = 0; bit < 8; bit += 1) {
      value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    }
    table[index] = value >>> 0;
  }

  return table;
})();

export const calculateCrc32 = (bytes: Uint8Array): string => {
  let crc = 0xffffffff;

  for (let index = 0; index < bytes.length; index += 1) {
    crc = crc32Table[(crc ^ bytes[index]) & 0xff] ^ (crc >>> 8);
  }

  return ((crc ^ 0xffffffff) >>> 0).toString(16).padStart(8, '0');
};

export const calculateFileChecksums = async (
  file: File,
  algorithms: ChecksumAlgorithm[],
): Promise<FileChecksumResult[]> => {
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  const results: FileChecksumResult[] = [];

  for (const algorithm of algorithms) {
    if (algorithm === 'crc32') {
      results.push({ algorithm, value: calculateCrc32(bytes) });
      continue;
    }

    if (algorithm === 'md5') {
      const SparkMD5 = (await import('spark-md5')).default;
      results.push({ algorithm, value: SparkMD5.ArrayBuffer.hash(arrayBuffer) });
      continue;
    }

    const subtleName = subtleAlgorithmName[algorithm];
    if (!subtleName) {
      continue;
    }

    const digest = await crypto.subtle.digest(subtleName, arrayBuffer);
    results.push({ algorithm, value: toHex(digest) });
  }

  return results;
};

