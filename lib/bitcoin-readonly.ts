import { address, networks, script, Transaction } from 'bitcoinjs-lib';

export type BitcoinReadonlyNetwork = 'mainnet' | 'testnet';

export type BitcoinAddressInfo = {
  ok: boolean;
  input: string;
  network?: BitcoinReadonlyNetwork;
  type?: string;
  scriptPubKey?: string;
  error?: string;
};

export type BitcoinTxOutputInfo = {
  index: number;
  valueSats: string;
  scriptPubKey: string;
  address?: string;
  type: string;
};

export type BitcoinTxInputInfo = {
  index: number;
  txid: string;
  vout: number;
  sequence: number;
  scriptSig: string;
  witnessItems: number;
};

export type BitcoinTxDecodeResult = {
  ok: boolean;
  txid?: string;
  version?: number;
  locktime?: number;
  inputCount?: number;
  outputCount?: number;
  totalOutputSats?: string;
  virtualSize?: number;
  weight?: number;
  inputs?: BitcoinTxInputInfo[];
  outputs?: BitcoinTxOutputInfo[];
  error?: string;
};

const networkConfig = {
  mainnet: networks.bitcoin,
  testnet: networks.testnet,
} satisfies Record<BitcoinReadonlyNetwork, typeof networks.bitcoin>;

const detectAddressType = (input: string): string => {
  const lower = input.toLowerCase();

  if (lower.startsWith('bc1p') || lower.startsWith('tb1p')) return 'Taproot (P2TR)';
  if (lower.startsWith('bc1q') || lower.startsWith('tb1q')) return 'Native SegWit (P2WPKH/P2WSH)';
  if (/^[13]/.test(input)) return input.startsWith('1') ? 'Legacy (P2PKH)' : 'Script Hash (P2SH)';
  if (/^[mn]/.test(input)) return 'Testnet Legacy (P2PKH)';
  if (input.startsWith('2')) return 'Testnet Script Hash (P2SH)';

  return 'Endereco Bitcoin';
};

const reverseBufferHex = (buffer: Uint8Array): string =>
  Buffer.from(buffer).reverse().toString('hex');

const classifyScript = (outputScript: Uint8Array): string => {
  const chunks = script.decompile(Buffer.from(outputScript));
  if (!chunks) return 'script';

  if (chunks.length === 5 && chunks[0] === 118 && chunks[1] === 169 && chunks[3] === 136 && chunks[4] === 172) {
    return 'P2PKH';
  }

  if (chunks.length === 3 && chunks[0] === 169 && chunks[2] === 135) {
    return 'P2SH';
  }

  if (chunks.length === 2 && chunks[0] === 0) {
    const data = chunks[1];
    if (Buffer.isBuffer(data) && data.length === 20) return 'P2WPKH';
    if (Buffer.isBuffer(data) && data.length === 32) return 'P2WSH';
  }

  if (chunks.length === 2 && chunks[0] === 81) {
    return 'P2TR';
  }

  if (chunks[0] === 106) {
    return 'OP_RETURN';
  }

  return 'script';
};

export const inspectBitcoinAddress = (
  input: string,
  selectedNetwork: BitcoinReadonlyNetwork = 'mainnet',
): BitcoinAddressInfo => {
  const trimmed = input.trim();

  try {
    const outputScript = address.toOutputScript(trimmed, networkConfig[selectedNetwork]);

    return {
      ok: true,
      input: trimmed,
      network: selectedNetwork,
      type: detectAddressType(trimmed),
      scriptPubKey: Buffer.from(outputScript).toString('hex'),
    };
  } catch (error) {
    return {
      ok: false,
      input: trimmed,
      network: selectedNetwork,
      error: error instanceof Error ? error.message : 'Endereco invalido para a rede selecionada.',
    };
  }
};

export const decodeBitcoinTransaction = (
  txHex: string,
  selectedNetwork: BitcoinReadonlyNetwork = 'mainnet',
): BitcoinTxDecodeResult => {
  const cleaned = txHex.trim().replaceAll(/\s+/g, '');

  if (!/^[0-9a-fA-F]+$/.test(cleaned) || cleaned.length % 2 !== 0) {
    return { ok: false, error: 'Informe uma transacao em hexadecimal valido.' };
  }

  try {
    const tx = Transaction.fromHex(cleaned);
    const network = networkConfig[selectedNetwork];
    const outputs = tx.outs.map<BitcoinTxOutputInfo>((output, index) => {
      let decodedAddress: string | undefined;

      try {
        decodedAddress = address.fromOutputScript(output.script, network);
      } catch {
        decodedAddress = undefined;
      }

      return {
        index,
        valueSats: output.value.toString(),
        scriptPubKey: Buffer.from(output.script).toString('hex'),
        address: decodedAddress,
        type: classifyScript(output.script),
      };
    });

    const totalOutputSats = outputs
      .reduce((total, output) => total + BigInt(output.valueSats), 0n)
      .toString();

    return {
      ok: true,
      txid: tx.getId(),
      version: tx.version,
      locktime: tx.locktime,
      inputCount: tx.ins.length,
      outputCount: tx.outs.length,
      totalOutputSats,
      virtualSize: tx.virtualSize(),
      weight: tx.weight(),
      inputs: tx.ins.map((input, index) => ({
        index,
        txid: reverseBufferHex(input.hash),
        vout: input.index,
        sequence: input.sequence,
        scriptSig: Buffer.from(input.script).toString('hex'),
        witnessItems: input.witness.length,
      })),
      outputs,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Nao foi possivel decodificar a transacao.',
    };
  }
};

