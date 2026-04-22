const SATOSHIS_PER_BTC = 100_000_000;
const P2WPKH_INPUT_VBYTES = 68;
const P2WPKH_OUTPUT_VBYTES = 31;
const TX_OVERHEAD_VBYTES = 10;

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const normalizeBtcText = (value: string): string => value.replace(',', '.').trim();

export const btcToSats = (value: string): number => {
  const normalized = normalizeBtcText(value);

  if (!/^\d+(\.\d{1,8})?$/.test(normalized)) {
    throw new Error('Valor de BTC invalido. Use ate 8 casas decimais.');
  }

  const [whole, fractional = ''] = normalized.split('.');
  const wholePart = Number(whole);
  const fractionalPart = Number(fractional.padEnd(8, '0'));
  const sats = wholePart * SATOSHIS_PER_BTC + fractionalPart;

  if (!Number.isFinite(sats) || sats <= 0 || !Number.isSafeInteger(sats)) {
    throw new Error('Valor de BTC fora do limite suportado.');
  }

  return sats;
};

export const satsToBtc = (sats: number): string => {
  if (!Number.isFinite(sats)) {
    return '0';
  }

  const safe = Math.max(0, Math.floor(sats));
  const full = (safe / SATOSHIS_PER_BTC).toFixed(8);
  return full.replace(/\.?0+$/, '');
};

export const estimateSegwitVBytes = (inputs: number, outputs: number): number =>
  TX_OVERHEAD_VBYTES +
  Math.max(0, Math.floor(inputs)) * P2WPKH_INPUT_VBYTES +
  Math.max(0, Math.floor(outputs)) * P2WPKH_OUTPUT_VBYTES;

export const estimateNetworkFee = (
  inputs: number,
  outputs: number,
  feeRate: number,
): number => {
  const normalizedRate = clamp(feeRate, 1, 10_000);
  return Math.ceil(estimateSegwitVBytes(inputs, outputs) * normalizedRate);
};
