export const CRYPTO_ASSET_IDS = [
  'BTC',
  'ETH',
  'USDT',
  'USDC',
  'SOL',
  'BNB',
  'TRX',
  'XRP',
  'ADA',
  'LTC',
  'DOT',
  'AVAX',
  'ATOM',
  'XMR',
  'TON',
] as const;

export type CryptoAssetId = (typeof CRYPTO_ASSET_IDS)[number];

export type UnitDefinition = {
  id: string;
  label: string;
  factorNumerator: bigint;
  factorDenominator?: bigint;
  decimals: number;
  description: string;
  isOffchain?: boolean;
};

export type AssetDefinition = {
  id: CryptoAssetId;
  name: string;
  decimals: number;
  baseUnitId: string;
  defaultFromUnitId: string;
  defaultToUnitId: string;
  units: UnitDefinition[];
};

const TEN = 10n;

const pow10 = (power: number): bigint => {
  let result = 1n;
  for (let i = 0; i < power; i += 1) {
    result *= TEN;
  }
  return result;
};

const unit = (
  id: string,
  label: string,
  factorNumerator: bigint,
  decimals: number,
  description: string,
  options?: { factorDenominator?: bigint; isOffchain?: boolean },
): UnitDefinition => ({
  id,
  label,
  factorNumerator,
  factorDenominator: options?.factorDenominator,
  decimals,
  description,
  isOffchain: options?.isOffchain,
});

const buildAsset = (asset: AssetDefinition): AssetDefinition => asset;

export const assets: AssetDefinition[] = [
  buildAsset({
    id: 'BTC',
    name: 'Bitcoin (BTC)',
    decimals: 8,
    baseUnitId: 'sat',
    defaultFromUnitId: 'btc',
    defaultToUnitId: 'sat',
    units: [
      unit('btc', 'BTC', 100_000_000n, 8, 'Unidade principal do Bitcoin.'),
      unit('mbtc', 'mBTC', 100_000n, 5, '1 mBTC = 0,001 BTC.'),
      unit('ubtc', 'μBTC', 100n, 2, 'Também chamado de "bit". 1 μBTC = 100 satoshis.'),
      unit('bit', 'bit', 100n, 2, 'Unidade popular equivalente a 100 satoshis.'),
      unit('ksat', 'kSats', 1_000n, 3, '1 kSat = 1.000 satoshis.'),
      unit('sat', 'satoshi', 1n, 0, 'Menor unidade on-chain do Bitcoin.'),
      unit(
        'msat',
        'msat',
        1n,
        0,
        'Millisatoshi (1/1000 sat), usado na Lightning Network (off-chain).',
        { factorDenominator: 1_000n, isOffchain: true },
      ),
    ],
  }),
  buildAsset({
    id: 'ETH',
    name: 'Ethereum (ETH)',
    decimals: 18,
    baseUnitId: 'wei',
    defaultFromUnitId: 'gwei',
    defaultToUnitId: 'eth',
    units: [
      unit('mether', 'METH', pow10(24), 24, '1.000.000 ETH.'),
      unit('kether', 'kETH', pow10(21), 21, '1.000 ETH.'),
      unit('eth', 'ETH', pow10(18), 18, 'Unidade principal do Ethereum.'),
      unit('finney', 'finney', pow10(15), 15, '0,001 ETH.'),
      unit('szabo', 'szabo', pow10(12), 12, '0,000001 ETH.'),
      unit('gwei', 'gwei', pow10(9), 9, 'Unidade mais usada para gas fees.'),
      unit('mwei', 'mwei', pow10(6), 6, 'Também chamado de lovelace no ecossistema Ethereum.'),
      unit('kwei', 'kwei', pow10(3), 3, 'Também chamado de babbage.'),
      unit('wei', 'wei', 1n, 0, 'Menor unidade on-chain do Ethereum.'),
    ],
  }),
  buildAsset({
    id: 'USDT',
    name: 'Tether (USDT)',
    decimals: 6,
    baseUnitId: 'micro-usdt',
    defaultFromUnitId: 'usdt',
    defaultToUnitId: 'micro-usdt',
    units: [
      unit('usdt', 'USDT', 1_000_000n, 6, 'Unidade principal. Em ERC20/TRC20, normalmente possui 6 casas decimais.'),
      unit('milli-usdt', 'mUSDT', 1_000n, 3, '0,001 USDT.'),
      unit('micro-usdt', 'μUSDT', 1n, 0, 'Menor unidade técnica do token com 6 decimais.'),
      unit('wei-usdt', 'wei (ERC20)', 1n, 0, 'Termo informal para a menor unidade do token (não é wei nativo de ETH).'),
    ],
  }),
  buildAsset({
    id: 'USDC',
    name: 'USD Coin (USDC)',
    decimals: 6,
    baseUnitId: 'micro-usdc',
    defaultFromUnitId: 'usdc',
    defaultToUnitId: 'micro-usdc',
    units: [
      unit('usdc', 'USDC', 1_000_000n, 6, 'Unidade principal com 6 casas decimais.'),
      unit('milli-usdc', 'mUSDC', 1_000n, 3, '0,001 USDC.'),
      unit('micro-usdc', 'μUSDC', 1n, 0, 'Menor unidade técnica do USDC.'),
    ],
  }),
  buildAsset({
    id: 'SOL',
    name: 'Solana (SOL)',
    decimals: 9,
    baseUnitId: 'lamport',
    defaultFromUnitId: 'lamport',
    defaultToUnitId: 'sol',
    units: [
      unit('sol', 'SOL', 1_000_000_000n, 9, 'Unidade principal da Solana.'),
      unit('lamport', 'lamport', 1n, 0, 'Menor unidade (1e-9 SOL).'),
    ],
  }),
  buildAsset({
    id: 'BNB',
    name: 'BNB (BNB Smart Chain)',
    decimals: 18,
    baseUnitId: 'wei',
    defaultFromUnitId: 'bnb',
    defaultToUnitId: 'gwei',
    units: [
      unit('bnb', 'BNB', pow10(18), 18, 'Unidade principal da BNB Chain.'),
      unit('gwei', 'gwei', pow10(9), 9, 'Unidade comum para gas na BNB Chain.'),
      unit('wei', 'wei', 1n, 0, 'Menor unidade on-chain da BNB Chain.'),
    ],
  }),
  buildAsset({
    id: 'TRX',
    name: 'Tron (TRX)',
    decimals: 6,
    baseUnitId: 'sun',
    defaultFromUnitId: 'trx',
    defaultToUnitId: 'sun',
    units: [
      unit('trx', 'TRX', 1_000_000n, 6, 'Unidade principal da Tron.'),
      unit('sun', 'sun', 1n, 0, 'Menor unidade da Tron (1e-6 TRX).'),
    ],
  }),
  buildAsset({
    id: 'XRP',
    name: 'XRP (Ripple)',
    decimals: 6,
    baseUnitId: 'drop',
    defaultFromUnitId: 'xrp',
    defaultToUnitId: 'drop',
    units: [
      unit('xrp', 'XRP', 1_000_000n, 6, 'Unidade principal do XRP Ledger.'),
      unit('drop', 'drop', 1n, 0, 'Menor unidade do XRP (1e-6 XRP).'),
    ],
  }),
  buildAsset({
    id: 'ADA',
    name: 'Cardano (ADA)',
    decimals: 6,
    baseUnitId: 'lovelace',
    defaultFromUnitId: 'ada',
    defaultToUnitId: 'lovelace',
    units: [
      unit('ada', 'ADA', 1_000_000n, 6, 'Unidade principal da Cardano.'),
      unit('lovelace', 'lovelace', 1n, 0, 'Menor unidade da Cardano (1e-6 ADA).'),
    ],
  }),
  buildAsset({
    id: 'LTC',
    name: 'Litecoin (LTC)',
    decimals: 8,
    baseUnitId: 'litoshi',
    defaultFromUnitId: 'ltc',
    defaultToUnitId: 'litoshi',
    units: [
      unit('ltc', 'LTC', 100_000_000n, 8, 'Unidade principal da Litecoin.'),
      unit('litoshi', 'litoshi', 1n, 0, 'Menor unidade da Litecoin (1e-8 LTC).'),
    ],
  }),
  buildAsset({
    id: 'DOT',
    name: 'Polkadot (DOT)',
    decimals: 10,
    baseUnitId: 'planck',
    defaultFromUnitId: 'dot',
    defaultToUnitId: 'planck',
    units: [
      unit('dot', 'DOT', pow10(10), 10, 'Unidade principal da Polkadot.'),
      unit('planck', 'planck', 1n, 0, 'Menor unidade da DOT (1e-10 DOT).'),
    ],
  }),
  buildAsset({
    id: 'AVAX',
    name: 'Avalanche (AVAX)',
    decimals: 18,
    baseUnitId: 'wei',
    defaultFromUnitId: 'avax',
    defaultToUnitId: 'navax',
    units: [
      unit('avax', 'AVAX', pow10(18), 18, 'Unidade principal da Avalanche.'),
      unit('navax', 'nAVAX', pow10(9), 9, 'Nano-AVAX (1e-9 AVAX).'),
      unit('wei', 'wei', 1n, 0, 'Menor unidade on-chain no contexto EVM da Avalanche C-Chain.'),
    ],
  }),
  buildAsset({
    id: 'ATOM',
    name: 'Cosmos (ATOM)',
    decimals: 6,
    baseUnitId: 'uatom',
    defaultFromUnitId: 'atom',
    defaultToUnitId: 'uatom',
    units: [
      unit('atom', 'ATOM', 1_000_000n, 6, 'Unidade principal da Cosmos.'),
      unit('uatom', 'uatom', 1n, 0, 'Menor unidade (micro-atom).'),
    ],
  }),
  buildAsset({
    id: 'XMR',
    name: 'Monero (XMR)',
    decimals: 12,
    baseUnitId: 'piconero',
    defaultFromUnitId: 'xmr',
    defaultToUnitId: 'piconero',
    units: [
      unit('xmr', 'XMR', pow10(12), 12, 'Unidade principal da Monero.'),
      unit('piconero', 'piconero', 1n, 0, 'Menor unidade da Monero (1e-12 XMR).'),
    ],
  }),
  buildAsset({
    id: 'TON',
    name: 'TON (The Open Network)',
    decimals: 9,
    baseUnitId: 'nanoton',
    defaultFromUnitId: 'ton',
    defaultToUnitId: 'nanoton',
    units: [
      unit('ton', 'TON', 1_000_000_000n, 9, 'Unidade principal da TON.'),
      unit('nanoton', 'nanoton', 1n, 0, 'Menor unidade da TON (1e-9 TON).'),
    ],
  }),
];

const DECIMAL_REGEX = /^-?\d*([.,]\d*)?$/;

type ParsedDecimal = {
  numerator: bigint;
  denominator: bigint;
};

const parseDecimal = (value: string): ParsedDecimal | null => {
  const normalized = value.trim().replace(',', '.');

  if (!normalized || normalized === '-' || !DECIMAL_REGEX.test(normalized)) {
    return null;
  }

  const isNegative = normalized.startsWith('-');
  const unsigned = isNegative ? normalized.slice(1) : normalized;
  const [integerPartRaw, decimalPartRaw = ''] = unsigned.split('.');

  const integerPart = integerPartRaw || '0';
  const decimalPart = decimalPartRaw || '';

  if (!/^\d+$/.test(integerPart) || (decimalPart && !/^\d+$/.test(decimalPart))) {
    return null;
  }

  const combined = `${integerPart}${decimalPart}`.replace(/^0+(?=\d)/, '') || '0';
  const numerator = BigInt(combined) * (isNegative ? -1n : 1n);
  const denominator = pow10(decimalPart.length);

  return { numerator, denominator };
};

const formatGroupedInteger = (value: string): string => {
  const sign = value.startsWith('-') ? '-' : '';
  const unsigned = sign ? value.slice(1) : value;

  return `${sign}${unsigned.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

const formatRational = (
  numerator: bigint,
  denominator: bigint,
  maxFractionDigits = 18,
): { raw: string; display: string; truncated: boolean } => {
  if (denominator === 0n) {
    return { raw: '0', display: '0', truncated: false };
  }

  const negative = numerator < 0n;
  const absNumerator = negative ? -numerator : numerator;

  const integerPart = absNumerator / denominator;
  let remainder = absNumerator % denominator;

  const fractionDigits: string[] = [];
  let truncated = false;

  for (let i = 0; i < maxFractionDigits && remainder > 0n; i += 1) {
    remainder *= TEN;
    const digit = remainder / denominator;
    remainder %= denominator;
    fractionDigits.push(digit.toString());
  }

  if (remainder > 0n) {
    truncated = true;
  }

  const fraction = fractionDigits.join('').replace(/0+$/, '');
  const sign = negative ? '-' : '';
  const integerAsString = integerPart.toString();
  const raw = fraction ? `${sign}${integerAsString}.${fraction}` : `${sign}${integerAsString}`;

  const grouped = formatGroupedInteger(`${sign}${integerAsString}`);
  const display = fraction ? `${grouped}.${fraction}${truncated ? '…' : ''}` : grouped;

  return { raw, display, truncated };
};

const getUnitFactor = (unit: UnitDefinition): { numerator: bigint; denominator: bigint } => ({
  numerator: unit.factorNumerator,
  denominator: unit.factorDenominator ?? 1n,
});

export const getAssetById = (assetId: CryptoAssetId): AssetDefinition => {
  const asset = assets.find((item) => item.id === assetId);

  if (!asset) {
    return assets[0];
  }

  return asset;
};

export const getUnitById = (assetId: CryptoAssetId, unitId: string): UnitDefinition | null => {
  const asset = getAssetById(assetId);
  return asset.units.find((item) => item.id === unitId) ?? null;
};

export const getDefaultUnitsForAsset = (
  assetId: CryptoAssetId,
): { from: string; to: string } => {
  const asset = getAssetById(assetId);

  return {
    from: asset.defaultFromUnitId,
    to: asset.defaultToUnitId,
  };
};

export const resolveUnitSelection = (
  assetId: CryptoAssetId,
  fromUnitId?: string,
  toUnitId?: string,
): { assetId: CryptoAssetId; from: string; to: string } => {
  const asset = getAssetById(assetId);
  const defaults = getDefaultUnitsForAsset(asset.id);

  const hasUnit = (unitId?: string): unitId is string =>
    Boolean(unitId && asset.units.some((unit) => unit.id === unitId));

  const from = hasUnit(fromUnitId) ? fromUnitId : defaults.from;
  let to = hasUnit(toUnitId) ? toUnitId : defaults.to;

  if (from === to) {
    const fallback = asset.units.find((unit) => unit.id !== from)?.id;
    to = fallback ?? to;
  }

  return {
    assetId: asset.id,
    from,
    to,
  };
};

export type ConversionResult = {
  ok: boolean;
  raw: string;
  display: string;
  error?: string;
  warning?: string;
};

export const convertCryptoAmount = (input: {
  value: string;
  assetId: CryptoAssetId;
  fromUnitId: string;
  toUnitId: string;
}): ConversionResult => {
  const parsed = parseDecimal(input.value);

  if (!parsed) {
    return {
      ok: false,
      raw: '',
      display: '',
      error: 'Digite um número válido para converter.',
    };
  }

  const fromUnit = getUnitById(input.assetId, input.fromUnitId);
  const toUnit = getUnitById(input.assetId, input.toUnitId);

  if (!fromUnit || !toUnit) {
    return {
      ok: false,
      raw: '',
      display: '',
      error: 'Selecione unidades válidas para o ativo escolhido.',
    };
  }

  const fromFactor = getUnitFactor(fromUnit);
  const toFactor = getUnitFactor(toUnit);

  const numerator =
    parsed.numerator * fromFactor.numerator * toFactor.denominator;
  const denominator =
    parsed.denominator * fromFactor.denominator * toFactor.numerator;

  const result = formatRational(numerator, denominator, 18);

  const warnings: string[] = [];

  if (result.truncated) {
    warnings.push('Resultado muito longo. Exibindo com corte após 18 casas decimais.');
  }

  if (fromUnit.isOffchain || toUnit.isOffchain) {
    warnings.push('Conversão envolve unidade off-chain (Lightning), útil para contexto técnico e não liquidação on-chain direta.');
  }

  return {
    ok: true,
    raw: result.raw,
    display: result.display,
    warning: warnings.length ? warnings.join(' ') : undefined,
  };
};
