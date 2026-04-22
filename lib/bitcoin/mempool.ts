import { getBitcoinNetworkConfig, type BitcoinNetworkId } from '@/lib/bitcoin/networks';

type AddressStats = {
  funded_txo_count: number;
  funded_txo_sum: number;
  spent_txo_count: number;
  spent_txo_sum: number;
  tx_count: number;
};

type AddressPayload = {
  address: string;
  chain_stats: AddressStats;
  mempool_stats: AddressStats;
};

export type MempoolUtxo = {
  txid: string;
  vout: number;
  value: number;
  status: {
    confirmed: boolean;
    block_height?: number;
    block_hash?: string;
    block_time?: number;
  };
};

export type AddressBalance = {
  confirmedSats: number;
  unconfirmedSats: number;
  totalSats: number;
};

export type RecommendedFeeRate = {
  fastestFee: number;
  halfHourFee: number;
  hourFee: number;
  economyFee: number;
  minimumFee: number;
};

const parseJson = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const fallback = `Erro HTTP ${response.status}`;
    const message = await response.text().catch(() => fallback);
    throw new Error(message || fallback);
  }

  return (await response.json()) as T;
};

const parseText = async (response: Response): Promise<string> => {
  if (!response.ok) {
    const fallback = `Erro HTTP ${response.status}`;
    const message = await response.text().catch(() => fallback);
    throw new Error(message || fallback);
  }

  return response.text();
};

const buildApiUrl = (networkId: BitcoinNetworkId, path: string): string => {
  const networkConfig = getBitcoinNetworkConfig(networkId);
  return `${networkConfig.mempoolApiBaseUrl}${path}`;
};

const buildBlockstreamApiUrl = (networkId: BitcoinNetworkId, path: string): string => {
  const networkConfig = getBitcoinNetworkConfig(networkId);
  return `${networkConfig.blockstreamApiBaseUrl}${path}`;
};

type FallbackOptions = {
  onFallback?: (reason: string) => void;
  timeoutMs?: number;
};

const DEFAULT_TIMEOUT_MS = 3000;

const fetchWithTimeout = async (
  input: RequestInfo,
  init: RequestInit | undefined,
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<Response> => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(input, { signal: controller.signal, ...init });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
};

export const fetchAddressBalance = async (
  networkId: BitcoinNetworkId,
  address: string,
  opts?: FallbackOptions,
): Promise<AddressBalance> => {
  const timeout = opts?.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  const mempoolEndpoint = buildApiUrl(networkId, `/address/${address}`);

  try {
    const payload = await fetchWithTimeout(mempoolEndpoint, { method: 'GET', cache: 'no-store' }, timeout).then((r) =>
      parseJson<AddressPayload>(r),
    );

    const confirmedSats = payload.chain_stats.funded_txo_sum - payload.chain_stats.spent_txo_sum;
    const unconfirmedSats = payload.mempool_stats.funded_txo_sum - payload.mempool_stats.spent_txo_sum;

    return {
      confirmedSats,
      unconfirmedSats,
      totalSats: confirmedSats + unconfirmedSats,
    };
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    opts?.onFallback?.(reason);

    // fallback to Blockstream (Esplora-compatible)
    const bsEndpoint = buildBlockstreamApiUrl(networkId, `/address/${address}`);
    const payload = await fetchWithTimeout(bsEndpoint, { method: 'GET', cache: 'no-store' }, timeout * 2).then((r) =>
      parseJson<AddressPayload>(r),
    );

    const confirmedSats = payload.chain_stats.funded_txo_sum - payload.chain_stats.spent_txo_sum;
    const unconfirmedSats = payload.mempool_stats.funded_txo_sum - payload.mempool_stats.spent_txo_sum;

    return {
      confirmedSats,
      unconfirmedSats,
      totalSats: confirmedSats + unconfirmedSats,
    };
  }
};

export const fetchAddressUtxos = async (
  networkId: BitcoinNetworkId,
  address: string,
  opts?: FallbackOptions,
): Promise<MempoolUtxo[]> => {
  const timeout = opts?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const mempoolEndpoint = buildApiUrl(networkId, `/address/${address}/utxo`);

  try {
    return await fetchWithTimeout(mempoolEndpoint, { method: 'GET', cache: 'no-store' }, timeout).then((r) =>
      parseJson<MempoolUtxo[]>(r),
    );
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    opts?.onFallback?.(reason);

    const bsEndpoint = buildBlockstreamApiUrl(networkId, `/address/${address}/utxo`);
    return await fetchWithTimeout(bsEndpoint, { method: 'GET', cache: 'no-store' }, timeout * 2).then((r) =>
      parseJson<MempoolUtxo[]>(r),
    );
  }
};

export const fetchRecommendedFeeRate = async (
  networkId: BitcoinNetworkId,
  opts?: FallbackOptions,
): Promise<RecommendedFeeRate> => {
  const timeout = opts?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const endpoint = buildApiUrl(networkId, '/v1/fees/recommended');

  try {
    return await fetchWithTimeout(endpoint, { method: 'GET', cache: 'no-store' }, timeout).then((response) =>
      parseJson<RecommendedFeeRate>(response),
    );
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    opts?.onFallback?.(reason);

    // Blockstream provides /fee-estimates mapping target->sats/vbyte
    const bsEndpoint = buildBlockstreamApiUrl(networkId, '/fee-estimates');

    try {
      const estimates = await fetchWithTimeout(bsEndpoint, { method: 'GET', cache: 'no-store' }, timeout * 2).then((r) =>
        parseJson<Record<string, number>>(r),
      );

      const asNumber = (key: string | number) => {
        const v = estimates[String(key)];
        return Number.isFinite(v) ? Math.round(v) : undefined;
      };

      const allValues = Object.values(estimates).map((v) => Math.round(v));
      const minVal = allValues.length ? Math.max(1, Math.min(...allValues)) : 1;
      const maxVal = allValues.length ? Math.max(...allValues) : 12;

      const fastestFee = asNumber(1) ?? maxVal;
      const halfHourFee = asNumber(3) ?? asNumber(6) ?? fastestFee;
      const hourFee = asNumber(6) ?? asNumber(12) ?? halfHourFee;
      const economyFee = asNumber(24) ?? Math.max(1, Math.floor((halfHourFee + hourFee) / 2));
      const minimumFee = minVal;

      return {
        fastestFee,
        halfHourFee,
        hourFee,
        economyFee,
        minimumFee,
      };
    } catch {
      return {
        fastestFee: 12,
        halfHourFee: 8,
        hourFee: 5,
        economyFee: 3,
        minimumFee: 1,
      };
    }
  }
};

export const broadcastTransactionHex = async (
  networkId: BitcoinNetworkId,
  txHex: string,
  opts?: FallbackOptions,
): Promise<string> => {
  const timeout = opts?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const mempoolEndpoint = buildApiUrl(networkId, '/tx');

  try {
    const txid = await fetchWithTimeout(
      mempoolEndpoint,
      {
        method: 'POST',
        cache: 'no-store',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: txHex,
      },
      timeout,
    ).then((r) => parseText(r));

    return txid.trim().replaceAll('"', '');
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    opts?.onFallback?.(reason);

    const bsEndpoint = buildBlockstreamApiUrl(networkId, '/tx');

    const txid = await fetchWithTimeout(
      bsEndpoint,
      {
        method: 'POST',
        cache: 'no-store',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: txHex,
      },
      timeout * 2,
    ).then((r) => parseText(r));

    return txid.trim().replaceAll('"', '');
  }
};
