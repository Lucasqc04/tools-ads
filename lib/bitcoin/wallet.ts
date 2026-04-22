import { HDKey } from '@scure/bip32';
import { generateMnemonic, mnemonicToSeedSync, validateMnemonic } from '@scure/bip39';
import { wordlist as englishWordlist } from '@scure/bip39/wordlists/english.js';
import { Buffer } from 'buffer';
import { initEccLib, payments } from 'bitcoinjs-lib';
import { ECPairFactory, type ECPairInterface } from 'ecpair';
import * as ecc from '@bitcoinerlab/secp256k1';
import { getBip84Path, getBitcoinNetworkConfig, type BitcoinNetworkId } from '@/lib/bitcoin/networks';

type GlobalWithBuffer = typeof globalThis & {
  Buffer?: typeof Buffer;
};

const globalWithBuffer = globalThis as GlobalWithBuffer;
if (!globalWithBuffer.Buffer) {
  globalWithBuffer.Buffer = Buffer;
}

initEccLib(ecc);

const ECPair = ECPairFactory(ecc);

export type WalletMaterial = {
  networkId: BitcoinNetworkId;
  derivationPath: string;
  address: string;
  publicKeyHex: string;
  privateKeyHex: string;
  wif: string;
};

const normalizeMnemonic = (mnemonic: string): string =>
  mnemonic
    .trim()
    .toLowerCase()
    .replaceAll(/\s+/g, ' ');

const buildWalletMaterial = (
  keyPair: ECPairInterface,
  networkId: BitcoinNetworkId,
  derivationPath: string,
): WalletMaterial => {
  const networkConfig = getBitcoinNetworkConfig(networkId);

  if (!keyPair.privateKey) {
    throw new Error('Nao foi possivel obter chave privada para esta carteira.');
  }

  const payment = payments.p2wpkh({
    pubkey: keyPair.publicKey,
    network: networkConfig.bitcoinNetwork,
  });

  if (!payment.address) {
    throw new Error('Nao foi possivel gerar endereco SegWit para esta carteira.');
  }

  return {
    networkId,
    derivationPath,
    address: payment.address,
    publicKeyHex: Buffer.from(keyPair.publicKey).toString('hex'),
    privateKeyHex: Buffer.from(keyPair.privateKey).toString('hex'),
    wif: keyPair.toWIF(),
  };
};

export const generateEnglishMnemonic = (words: 12 | 24 = 12): string =>
  generateMnemonic(englishWordlist, words === 24 ? 256 : 128);

export const validateEnglishMnemonic = (mnemonic: string): boolean =>
  validateMnemonic(normalizeMnemonic(mnemonic), englishWordlist);

export const deriveWalletFromMnemonic = (params: {
  mnemonic: string;
  networkId: BitcoinNetworkId;
  addressIndex?: number;
  passphrase?: string;
}): WalletMaterial => {
  const normalizedMnemonic = normalizeMnemonic(params.mnemonic);

  if (!validateEnglishMnemonic(normalizedMnemonic)) {
    throw new Error('Seed phrase invalida. Use uma mnemonic BIP39 em ingles.');
  }

  const networkConfig = getBitcoinNetworkConfig(params.networkId);
  const derivationPath = getBip84Path(params.networkId, params.addressIndex ?? 0);
  const seed = mnemonicToSeedSync(normalizedMnemonic, params.passphrase ?? '');
  const root = HDKey.fromMasterSeed(seed);
  const child = root.derive(derivationPath);

  if (!child.privateKey) {
    throw new Error('Nao foi possivel derivar chave privada para este caminho BIP84.');
  }

  const keyPair = ECPair.fromPrivateKey(Buffer.from(child.privateKey), {
    network: networkConfig.bitcoinNetwork,
    compressed: true,
  });

  return buildWalletMaterial(keyPair, params.networkId, derivationPath);
};

export const deriveWalletFromWif = (params: {
  wif: string;
  networkId: BitcoinNetworkId;
}): WalletMaterial => {
  const networkConfig = getBitcoinNetworkConfig(params.networkId);
  const trimmedWif = params.wif.trim();

  if (!trimmedWif) {
    throw new Error('Informe uma private key WIF valida.');
  }

  let keyPair: ECPairInterface;

  try {
    keyPair = ECPair.fromWIF(trimmedWif, networkConfig.bitcoinNetwork);
  } catch {
    throw new Error('WIF invalida para a rede selecionada.');
  }

  if (!keyPair.compressed) {
    throw new Error('A chave WIF precisa estar no formato comprimido para SegWit nativo.');
  }

  return buildWalletMaterial(keyPair, params.networkId, 'm/84 path via WIF');
};

export const getSignerFromWif = (
  wif: string,
  networkId: BitcoinNetworkId,
): ECPairInterface => {
  const networkConfig = getBitcoinNetworkConfig(networkId);

  try {
    return ECPair.fromWIF(wif.trim(), networkConfig.bitcoinNetwork);
  } catch {
    throw new Error('Nao foi possivel criar assinador a partir da WIF informada.');
  }
};
