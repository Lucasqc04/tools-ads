import { address, payments, Psbt } from 'bitcoinjs-lib';
import { estimateNetworkFee } from '@/lib/bitcoin/fee';
import { getBitcoinNetworkConfig, type BitcoinNetworkId } from '@/lib/bitcoin/networks';
import { getSignerFromWif } from '@/lib/bitcoin/wallet';
import type { MempoolUtxo } from '@/lib/bitcoin/mempool';

export type SignedTransactionResult = {
  txHex: string;
  txid: string;
  feeSats: number;
  selectedInputs: number;
  changeSats: number;
  spendAmountSats: number;
};

type BuildSendTxParams = {
  networkId: BitcoinNetworkId;
  fromAddress: string;
  destinationAddress: string;
  amountSats: number;
  feeRate: number;
  wif: string;
  utxos: MempoolUtxo[];
  includeUnconfirmed?: boolean;
};

type CoinSelectionResult = {
  selected: MempoolUtxo[];
  feeSats: number;
  changeSats: number;
  selectedTotal: number;
};

const DUST_LIMIT = 546;

const sortUtxosForSpend = (utxos: MempoolUtxo[]): MempoolUtxo[] =>
  [...utxos].sort((a, b) => b.value - a.value);

const selectCoins = (
  utxos: MempoolUtxo[],
  amountSats: number,
  feeRate: number,
): CoinSelectionResult => {
  const ordered = sortUtxosForSpend(utxos);
  const selected: MempoolUtxo[] = [];
  let selectedTotal = 0;

  for (const utxo of ordered) {
    selected.push(utxo);
    selectedTotal += utxo.value;

    const feeWithChange = estimateNetworkFee(selected.length, 2, feeRate);
    const changeWithTwoOutputs = selectedTotal - amountSats - feeWithChange;

    if (changeWithTwoOutputs >= DUST_LIMIT) {
      return {
        selected,
        feeSats: feeWithChange,
        changeSats: changeWithTwoOutputs,
        selectedTotal,
      };
    }

    const feeWithoutChange = estimateNetworkFee(selected.length, 1, feeRate);
    const remainingAfterSingleOutput = selectedTotal - amountSats - feeWithoutChange;

    if (remainingAfterSingleOutput >= 0 && remainingAfterSingleOutput < DUST_LIMIT) {
      return {
        selected,
        feeSats: feeWithoutChange,
        changeSats: 0,
        selectedTotal,
      };
    }
  }

  const currentFeeGuess = estimateNetworkFee(Math.max(1, selected.length), 2, feeRate);
  const required = amountSats + currentFeeGuess;

  throw new Error(
    `Saldo insuficiente para enviar este valor com a fee atual. Necessario pelo menos ${required} sats.`,
  );
};

const toBigInt = (value: number): bigint => BigInt(Math.floor(value));

export const createAndSignSendTransaction = (
  params: BuildSendTxParams,
): SignedTransactionResult => {
  if (!Number.isSafeInteger(params.amountSats) || params.amountSats <= 0) {
    throw new Error('Valor de envio invalido.');
  }

  if (!Number.isFinite(params.feeRate) || params.feeRate < 1) {
    throw new Error('Fee rate invalida. Use valor maior ou igual a 1 sat/vB.');
  }

  const networkConfig = getBitcoinNetworkConfig(params.networkId);
  const keyPair = getSignerFromWif(params.wif, params.networkId);

  if (!keyPair.privateKey) {
    throw new Error('Nao foi possivel acessar chave privada para assinatura.');
  }

  address.toOutputScript(params.destinationAddress, networkConfig.bitcoinNetwork);

  const senderPayment = payments.p2wpkh({
    pubkey: keyPair.publicKey,
    network: networkConfig.bitcoinNetwork,
  });

  if (!senderPayment.address || !senderPayment.output) {
    throw new Error('Nao foi possivel derivar endereco SegWit para assinatura.');
  }

  const senderScript = senderPayment.output;

  if (senderPayment.address !== params.fromAddress) {
    throw new Error('A chave informada nao corresponde ao endereco da carteira atual.');
  }

  const spendableUtxos = params.utxos.filter((utxo) =>
    params.includeUnconfirmed ? true : utxo.status.confirmed,
  );

  if (!spendableUtxos.length) {
    throw new Error('Nenhum UTXO disponivel para envio na rede selecionada.');
  }

  const selection = selectCoins(spendableUtxos, params.amountSats, params.feeRate);
  const psbt = new Psbt({
    network: networkConfig.bitcoinNetwork,
  });

  selection.selected.forEach((utxo) => {
    psbt.addInput({
      hash: utxo.txid,
      index: utxo.vout,
      witnessUtxo: {
        script: senderScript,
        value: toBigInt(utxo.value),
      },
    });
  });

  psbt.addOutput({
    address: params.destinationAddress,
    value: toBigInt(params.amountSats),
  });

  if (selection.changeSats > 0) {
    psbt.addOutput({
      address: params.fromAddress,
      value: toBigInt(selection.changeSats),
    });
  }

  selection.selected.forEach((_, index) => {
    psbt.signInput(index, keyPair);
  });

  psbt.finalizeAllInputs();

  const transaction = psbt.extractTransaction();

  return {
    txHex: transaction.toHex(),
    txid: transaction.getId(),
    feeSats: selection.feeSats,
    selectedInputs: selection.selected.length,
    changeSats: selection.changeSats,
    spendAmountSats: params.amountSats,
  };
};
