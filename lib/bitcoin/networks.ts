import { networks, type Network } from 'bitcoinjs-lib';

export type BitcoinNetworkId = 'testnet' | 'mainnet';

export type BitcoinNetworkConfig = {
  id: BitcoinNetworkId;
  bitcoinNetwork: Network;
  coinType: 0 | 1;
  derivationBasePath: string;
  mempoolApiBaseUrl: string;
  blockstreamApiBaseUrl: string;
  mempoolExplorerBaseUrl: string;
  addressPrefix: 'bc1' | 'tb1';
};

export const defaultBitcoinNetworkId: BitcoinNetworkId = 'testnet';

export const bitcoinNetworkConfigs: Record<BitcoinNetworkId, BitcoinNetworkConfig> = {
  testnet: {
    id: 'testnet',
    bitcoinNetwork: networks.testnet,
    coinType: 1,
    derivationBasePath: "m/84'/1'/0'/0",
    mempoolApiBaseUrl: 'https://mempool.space/testnet4/api',
    blockstreamApiBaseUrl: 'https://blockstream.info/testnet/api',
    mempoolExplorerBaseUrl: 'https://mempool.space/testnet4',
    addressPrefix: 'tb1',
  },
  mainnet: {
    id: 'mainnet',
    bitcoinNetwork: networks.bitcoin,
    coinType: 0,
    derivationBasePath: "m/84'/0'/0'/0",
    mempoolApiBaseUrl: 'https://mempool.space/api',
    blockstreamApiBaseUrl: 'https://blockstream.info/api',
    mempoolExplorerBaseUrl: 'https://mempool.space',
    addressPrefix: 'bc1',
  },
};

export const getBitcoinNetworkConfig = (networkId: BitcoinNetworkId): BitcoinNetworkConfig =>
  bitcoinNetworkConfigs[networkId];

export const getBip84Path = (
  networkId: BitcoinNetworkId,
  addressIndex = 0,
): string => {
  const normalizedIndex = Number.isFinite(addressIndex)
    ? Math.max(0, Math.floor(addressIndex))
    : 0;

  return `${bitcoinNetworkConfigs[networkId].derivationBasePath}/${normalizedIndex}`;
};
