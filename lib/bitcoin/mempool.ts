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

export const fetchAddressBalance = async (
  networkId: BitcoinNetworkId,
  address: string,
): Promise<AddressBalance> => {
  const endpoint = buildApiUrl(networkId, `/address/${address}`);
  const payload = await fetch(endpoint, {
    method: 'GET',
    cache: 'no-store',
  }).then((response) => parseJson<AddressPayload>(response));

  const confirmedSats =
    payload.chain_stats.funded_txo_sum - payload.chain_stats.spent_txo_sum;
  const unconfirmedSats =
    payload.mempool_stats.funded_txo_sum - payload.mempool_stats.spent_txo_sum;

  return {
    confirmedSats,
    unconfirmedSats,
    totalSats: confirmedSats + unconfirmedSats,
  };
};

export const fetchAddressUtxos = async (
  networkId: BitcoinNetworkId,
  address: string,
): Promise<MempoolUtxo[]> => {
  const endpoint = buildApiUrl(networkId, `/address/${address}/utxo`);
  return fetch(endpoint, { method: 'GET', cache: 'no-store' }).then((response) =>
    parseJson<MempoolUtxo[]>(response),
  );
};

export const fetchRecommendedFeeRate = async (
  networkId: BitcoinNetworkId,
): Promise<RecommendedFeeRate> => {
  const endpoint = buildApiUrl(networkId, '/v1/fees/recommended');

  try {
    return await fetch(endpoint, { method: 'GET', cache: 'no-store' }).then((response) =>
      parseJson<RecommendedFeeRate>(response),
    );
  } catch {
    return {
      fastestFee: 12,
      halfHourFee: 8,
      hourFee: 5,
      economyFee: 3,
      minimumFee: 1,
    };
  }
};

export const broadcastTransactionHex = async (
  networkId: BitcoinNetworkId,
  txHex: string,
): Promise<string> => {
  const endpoint = buildApiUrl(networkId, '/tx');

  const txid = await fetch(endpoint, {
    method: 'POST',
    cache: 'no-store',
    headers: {
      'Content-Type': 'text/plain',
    },
    body: txHex,
  }).then((response) => parseText(response));

  return txid.trim().replaceAll('"', '');
};
