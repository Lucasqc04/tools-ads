'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { type AppLocale } from '@/lib/i18n/config';
import { broadcastTransactionHex, fetchAddressBalance, fetchAddressUtxos, fetchRecommendedFeeRate, type AddressBalance, type MempoolUtxo, type RecommendedFeeRate } from '@/lib/bitcoin/mempool';
import { btcToSats, satsToBtc } from '@/lib/bitcoin/fee';
import { createAndSignSendTransaction, type SignedTransactionResult } from '@/lib/bitcoin/create-send-tx';
import { defaultBitcoinNetworkId, getBitcoinNetworkConfig, type BitcoinNetworkId } from '@/lib/bitcoin/networks';
import { deriveWalletFromMnemonic, deriveWalletFromWif, generateEnglishMnemonic, type WalletMaterial } from '@/lib/bitcoin/wallet';

type BitcoinWalletToolProps = Readonly<{
  locale?: AppLocale;
}>;

type TabId = 'generate' | 'import-mnemonic' | 'import-wif';

type WalletSession =
  | (WalletMaterial & {
      source: {
        type: 'mnemonic';
        mnemonic: string;
        origin: 'generated' | 'imported';
      };
    })
  | (WalletMaterial & {
      source: {
        type: 'wif';
        wif: string;
      };
    });

type WalletDataState = {
  isLoading: boolean;
  balance: AddressBalance | null;
  utxos: MempoolUtxo[];
  errorMessage: string;
};

type TxState = {
  isSending: boolean;
  errorMessage: string;
  successTxid: string;
  result: SignedTransactionResult | null;
};

type Ui = {
  title: string;
  intro: string;
  networkLabel: string;
  networkTestnet: string;
  networkMainnet: string;
  modeLabel: string;
  modeGenerate: string;
  modeImportMnemonic: string;
  modeImportWif: string;
  generateTitle: string;
  generateDescription: string;
  generateButton: string;
  generatedMnemonicLabel: string;
  importMnemonicTitle: string;
  importMnemonicDescription: string;
  mnemonicInputPlaceholder: string;
  importMnemonicButton: string;
  importWifTitle: string;
  importWifDescription: string;
  wifInputPlaceholder: string;
  importWifButton: string;
  walletDetailsTitle: string;
  addressLabel: string;
  publicKeyLabel: string;
  derivationPathLabel: string;
  showSeed: string;
  hideSeed: string;
  showWif: string;
  hideWif: string;
  copy: string;
  copied: string;
  refreshWalletData: string;
  balanceTitle: string;
  confirmedBalance: string;
  unconfirmedBalance: string;
  totalBalance: string;
  utxosTitle: string;
  utxosEmpty: string;
  utxosCount: (count: number) => string;
  txidLabel: string;
  amountLabel: string;
  statusLabel: string;
  sendTitle: string;
  destinationLabel: string;
  destinationPlaceholder: string;
  amountBtcLabel: string;
  amountBtcPlaceholder: string;
  feeRateLabel: string;
  feeRateHint: string;
  includeUnconfirmedLabel: string;
  sendButton: string;
  sendingButton: string;
  feeRecommendation: string;
  feeFast: string;
  feeHalfHour: string;
  feeHour: string;
  feeMin: string;
  txSuccess: string;
  txId: string;
  txFee: string;
  txInputs: string;
  txChange: string;
  viewOnExplorer: string;
  viewAddressOnExplorer: string;
  testnetFaucetTitle: string;
  testnetFaucetDescription: string;
  openFaucet: string;
  localSecurityNote: string;
  mainnetWarning: string;
  testnetDefaultHint: string;
  walletMissingHint: string;
  loadingWalletData: string;
  networkSwitchHint: string;
  invalidSend: string;
  includeConfirmedOnlyHint: string;
  mempoolFallbackWarningTitle: string;
  mempoolFallbackWarningBody: string;
};

const uiByLocale: Record<AppLocale, Ui> = {
  'pt-br': {
    title: 'Carteira Bitcoin Testnet e Mainnet',
    intro:
      'Gere ou importe carteira BIP39/BIP84, consulte saldo e UTXOs, e envie BTC direto do navegador usando mempool API.',
    networkLabel: 'Rede',
    networkTestnet: 'Testnet (padrao recomendado)',
    networkMainnet: 'Mainnet',
    modeLabel: 'Modo da carteira',
    modeGenerate: 'Gerar carteira',
    modeImportMnemonic: 'Importar seed',
    modeImportWif: 'Importar WIF',
    generateTitle: 'Gerar nova carteira BIP39',
    generateDescription:
      'Cria mnemonic em ingles e deriva endereco SegWit nativo (BIP84).',
    generateButton: 'Gerar carteira',
    generatedMnemonicLabel: 'Seed phrase gerada',
    importMnemonicTitle: 'Importar via seed phrase',
    importMnemonicDescription:
      'Cole sua mnemonic BIP39 em ingles para derivar endereco BIP84.',
    mnemonicInputPlaceholder: 'seed phrase com 12 ou 24 palavras...',
    importMnemonicButton: 'Importar seed',
    importWifTitle: 'Importar via private key (WIF)',
    importWifDescription:
      'Cole a WIF da rede selecionada para reconstruir endereco e enviar.',
    wifInputPlaceholder: 'L1... / K... / c... / 9...',
    importWifButton: 'Importar WIF',
    walletDetailsTitle: 'Dados da carteira',
    addressLabel: 'Endereco',
    publicKeyLabel: 'Chave publica',
    derivationPathLabel: 'Caminho de derivacao',
    showSeed: 'Mostrar seed',
    hideSeed: 'Ocultar seed',
    showWif: 'Mostrar WIF',
    hideWif: 'Ocultar WIF',
    copy: 'Copiar',
    copied: 'Copiado',
    refreshWalletData: 'Atualizar saldo e UTXOs',
    balanceTitle: 'Saldo da carteira',
    confirmedBalance: 'Confirmado',
    unconfirmedBalance: 'Nao confirmado',
    totalBalance: 'Total',
    utxosTitle: 'UTXOs disponiveis',
    utxosEmpty: 'Nenhum UTXO encontrado para este endereco.',
    utxosCount: (count) => `${count} UTXO(s) carregados`,
    txidLabel: 'TXID',
    amountLabel: 'Valor',
    statusLabel: 'Status',
    sendTitle: 'Enviar BTC',
    destinationLabel: 'Endereco de destino',
    destinationPlaceholder: 'bc1... ou tb1...',
    amountBtcLabel: 'Valor em BTC',
    amountBtcPlaceholder: '0.0001',
    feeRateLabel: 'Fee rate (sat/vB)',
    feeRateHint: 'Use fee maior para confirmar mais rapido.',
    includeUnconfirmedLabel: 'Incluir UTXOs nao confirmados',
    sendButton: 'Criar e enviar transacao',
    sendingButton: 'Enviando...',
    feeRecommendation: 'Sugestao de fee (mempool)',
    feeFast: 'Rapida',
    feeHalfHour: '30 min',
    feeHour: '1 hora',
    feeMin: 'Minima',
    txSuccess: 'Transacao enviada com sucesso.',
    txId: 'Txid',
    txFee: 'Fee paga',
    txInputs: 'Inputs usados',
    txChange: 'Troco',
    viewOnExplorer: 'Ver no explorer',
    viewAddressOnExplorer: 'Ver endereco no explorer',
    testnetFaucetTitle: 'Precisa de BTC de teste?',
    testnetFaucetDescription:
      'Use um faucet da testnet4 para receber moedas de teste e validar envios sem risco.',
    openFaucet: 'Abrir faucet testnet4',
    localSecurityNote:
      'Esta tool roda no navegador e nao guarda seed/WIF no servidor. Mesmo assim, use valores pequenos e ambiente confiavel.',
    mainnetWarning:
      'Voce esta em MAINNET. Qualquer envio usa BTC real. Revise endereco, valor e fee antes de confirmar.',
    testnetDefaultHint:
      'A rede padrao e Testnet para testes seguros antes de operar em Mainnet.',
    walletMissingHint:
      'Gere ou importe uma carteira para consultar saldo e enviar BTC.',
    loadingWalletData: 'Carregando saldo e UTXOs...',
    networkSwitchHint:
      'Ao trocar rede, a carteira e rederivada automaticamente (seed) ou validada novamente (WIF).',
    invalidSend:
      'Preencha endereco destino, valor e fee valida para enviar.',
    includeConfirmedOnlyHint:
      'Se desmarcado, somente UTXOs confirmados serao usados na selecao de inputs.',
    mempoolFallbackWarningTitle: 'API mempool.space instavel',
    mempoolFallbackWarningBody:
      'A API principal esta lenta ou retornou erro. Usando Blockstream como fallback — proceda com calma.',
  },
  en: {
    title: 'Bitcoin Wallet for Testnet and Mainnet',
    intro:
      'Generate or import BIP39/BIP84 wallet, read balance and UTXOs, and send BTC directly in browser via mempool API.',
    networkLabel: 'Network',
    networkTestnet: 'Testnet (recommended default)',
    networkMainnet: 'Mainnet',
    modeLabel: 'Wallet mode',
    modeGenerate: 'Generate wallet',
    modeImportMnemonic: 'Import seed',
    modeImportWif: 'Import WIF',
    generateTitle: 'Generate new BIP39 wallet',
    generateDescription: 'Creates english mnemonic and derives native SegWit address (BIP84).',
    generateButton: 'Generate wallet',
    generatedMnemonicLabel: 'Generated seed phrase',
    importMnemonicTitle: 'Import from seed phrase',
    importMnemonicDescription: 'Paste english BIP39 mnemonic to derive BIP84 address.',
    mnemonicInputPlaceholder: '12 or 24 words seed phrase...',
    importMnemonicButton: 'Import seed',
    importWifTitle: 'Import from private key (WIF)',
    importWifDescription: 'Paste WIF for selected network to rebuild address and send.',
    wifInputPlaceholder: 'L1... / K... / c... / 9...',
    importWifButton: 'Import WIF',
    walletDetailsTitle: 'Wallet data',
    addressLabel: 'Address',
    publicKeyLabel: 'Public key',
    derivationPathLabel: 'Derivation path',
    showSeed: 'Show seed',
    hideSeed: 'Hide seed',
    showWif: 'Show WIF',
    hideWif: 'Hide WIF',
    copy: 'Copy',
    copied: 'Copied',
    refreshWalletData: 'Refresh balance and UTXOs',
    balanceTitle: 'Wallet balance',
    confirmedBalance: 'Confirmed',
    unconfirmedBalance: 'Unconfirmed',
    totalBalance: 'Total',
    utxosTitle: 'Available UTXOs',
    utxosEmpty: 'No UTXOs found for this address.',
    utxosCount: (count) => `${count} UTXO(s) loaded`,
    txidLabel: 'TXID',
    amountLabel: 'Amount',
    statusLabel: 'Status',
    sendTitle: 'Send BTC',
    destinationLabel: 'Destination address',
    destinationPlaceholder: 'bc1... or tb1...',
    amountBtcLabel: 'Amount in BTC',
    amountBtcPlaceholder: '0.0001',
    feeRateLabel: 'Fee rate (sat/vB)',
    feeRateHint: 'Use higher fee for faster confirmation.',
    includeUnconfirmedLabel: 'Include unconfirmed UTXOs',
    sendButton: 'Create and broadcast transaction',
    sendingButton: 'Sending...',
    feeRecommendation: 'Fee suggestion (mempool)',
    feeFast: 'Fast',
    feeHalfHour: '30 min',
    feeHour: '1 hour',
    feeMin: 'Minimum',
    txSuccess: 'Transaction broadcasted successfully.',
    txId: 'Txid',
    txFee: 'Paid fee',
    txInputs: 'Used inputs',
    txChange: 'Change',
    viewOnExplorer: 'View on explorer',
    viewAddressOnExplorer: 'View address on explorer',
    testnetFaucetTitle: 'Need test BTC?',
    testnetFaucetDescription:
      'Use a testnet4 faucet to get testing coins and validate transfers without risk.',
    openFaucet: 'Open testnet4 faucet',
    localSecurityNote:
      'This tool runs in-browser and does not store seed/WIF on server. Still, use small amounts and trusted environment.',
    mainnetWarning:
      'You are on MAINNET. Any broadcast uses real BTC. Review destination, amount, and fee before sending.',
    testnetDefaultHint:
      'Default network is Testnet so you can test safely before moving to Mainnet.',
    walletMissingHint: 'Generate or import a wallet to read balance and send BTC.',
    loadingWalletData: 'Loading balance and UTXOs...',
    networkSwitchHint:
      'When switching networks, wallet is rederived from seed or revalidated from WIF.',
    invalidSend:
      'Fill destination address, amount, and valid fee rate before sending.',
    includeConfirmedOnlyHint:
      'If unchecked, only confirmed UTXOs are used during input selection.',
    mempoolFallbackWarningTitle: 'mempool.space API unstable',
    mempoolFallbackWarningBody:
      'Primary API is slow or returned an error. Using Blockstream as fallback — proceed cautiously.',
  },
  es: {
    title: 'Wallet Bitcoin para Testnet y Mainnet',
    intro:
      'Genera o importa wallet BIP39/BIP84, consulta saldo y UTXOs, y envia BTC en navegador usando mempool API.',
    networkLabel: 'Red',
    networkTestnet: 'Testnet (recomendado por defecto)',
    networkMainnet: 'Mainnet',
    modeLabel: 'Modo de wallet',
    modeGenerate: 'Generar wallet',
    modeImportMnemonic: 'Importar seed',
    modeImportWif: 'Importar WIF',
    generateTitle: 'Generar nueva wallet BIP39',
    generateDescription: 'Crea mnemonic en ingles y deriva direccion SegWit nativa (BIP84).',
    generateButton: 'Generar wallet',
    generatedMnemonicLabel: 'Seed phrase generada',
    importMnemonicTitle: 'Importar desde seed phrase',
    importMnemonicDescription: 'Pega mnemonic BIP39 en ingles para derivar direccion BIP84.',
    mnemonicInputPlaceholder: 'seed phrase de 12 o 24 palabras...',
    importMnemonicButton: 'Importar seed',
    importWifTitle: 'Importar con private key (WIF)',
    importWifDescription:
      'Pega WIF de la red seleccionada para reconstruir direccion y enviar.',
    wifInputPlaceholder: 'L1... / K... / c... / 9...',
    importWifButton: 'Importar WIF',
    walletDetailsTitle: 'Datos de la wallet',
    addressLabel: 'Direccion',
    publicKeyLabel: 'Clave publica',
    derivationPathLabel: 'Ruta de derivacion',
    showSeed: 'Mostrar seed',
    hideSeed: 'Ocultar seed',
    showWif: 'Mostrar WIF',
    hideWif: 'Ocultar WIF',
    copy: 'Copiar',
    copied: 'Copiado',
    refreshWalletData: 'Actualizar saldo y UTXOs',
    balanceTitle: 'Saldo de la wallet',
    confirmedBalance: 'Confirmado',
    unconfirmedBalance: 'No confirmado',
    totalBalance: 'Total',
    utxosTitle: 'UTXOs disponibles',
    utxosEmpty: 'No se encontraron UTXOs para esta direccion.',
    utxosCount: (count) => `${count} UTXO(s) cargados`,
    txidLabel: 'TXID',
    amountLabel: 'Valor',
    statusLabel: 'Estado',
    sendTitle: 'Enviar BTC',
    destinationLabel: 'Direccion destino',
    destinationPlaceholder: 'bc1... o tb1...',
    amountBtcLabel: 'Valor en BTC',
    amountBtcPlaceholder: '0.0001',
    feeRateLabel: 'Fee rate (sat/vB)',
    feeRateHint: 'Usa fee mas alta para confirmar mas rapido.',
    includeUnconfirmedLabel: 'Incluir UTXOs no confirmados',
    sendButton: 'Crear y enviar transaccion',
    sendingButton: 'Enviando...',
    feeRecommendation: 'Sugerencia de fee (mempool)',
    feeFast: 'Rapida',
    feeHalfHour: '30 min',
    feeHour: '1 hora',
    feeMin: 'Minima',
    txSuccess: 'Transaccion enviada correctamente.',
    txId: 'Txid',
    txFee: 'Fee pagada',
    txInputs: 'Inputs usados',
    txChange: 'Cambio',
    viewOnExplorer: 'Ver en explorer',
    viewAddressOnExplorer: 'Ver direccion en explorer',
    testnetFaucetTitle: 'Necesitas BTC de prueba?',
    testnetFaucetDescription:
      'Usa un faucet de testnet4 para obtener monedas de prueba y validar envios sin riesgo.',
    openFaucet: 'Abrir faucet testnet4',
    localSecurityNote:
      'Esta tool funciona en navegador y no guarda seed/WIF en servidor. Aun asi, usa montos pequenos y entorno confiable.',
    mainnetWarning:
      'Estas en MAINNET. Cualquier envio usa BTC real. Revisa direccion, valor y fee antes de confirmar.',
    testnetDefaultHint:
      'La red por defecto es Testnet para pruebas seguras antes de Mainnet.',
    walletMissingHint:
      'Genera o importa una wallet para consultar saldo y enviar BTC.',
    loadingWalletData: 'Cargando saldo y UTXOs...',
    networkSwitchHint:
      'Al cambiar red, la wallet se rederiva desde seed o se revalida con WIF.',
    invalidSend:
      'Completa direccion destino, valor y fee valida antes de enviar.',
    includeConfirmedOnlyHint:
      'Si no se marca, solo se usaran UTXOs confirmados para seleccionar inputs.',
    mempoolFallbackWarningTitle: 'API mempool.space inestable',
    mempoolFallbackWarningBody:
      'La API principal está lenta o devolvió un error. Usando Blockstream como fallback — proceda con calma.',
  },
};

const tabClassName = (isActive: boolean): string =>
  [
    'rounded-lg px-3 py-2 text-sm font-semibold transition-colors',
    isActive
      ? 'bg-brand-600 text-white'
      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
  ].join(' ');

const initialWalletDataState: WalletDataState = {
  isLoading: false,
  balance: null,
  utxos: [],
  errorMessage: '',
};

const truncateTxid = (value: string): string =>
  value.length <= 20 ? value : `${value.slice(0, 10)}...${value.slice(-10)}`;

const testnet4FaucetUrl = 'https://coinfaucet.eu/en/btc-testnet4/';

export function BitcoinWalletTool({ locale = 'pt-br' }: BitcoinWalletToolProps) {
  const ui = uiByLocale[locale];
  const [networkId, setNetworkId] = useState<BitcoinNetworkId>(defaultBitcoinNetworkId);
  const [activeTab, setActiveTab] = useState<TabId>('generate');
  const [mnemonicInput, setMnemonicInput] = useState('');
  const [wifInput, setWifInput] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [amountBtc, setAmountBtc] = useState('');
  const [feeRateInput, setFeeRateInput] = useState('1');
  const [includeUnconfirmed, setIncludeUnconfirmed] = useState(false);
  const [walletSession, setWalletSession] = useState<WalletSession | null>(null);
  const walletSessionRef = useRef<WalletSession | null>(walletSession);
  const [walletData, setWalletData] = useState<WalletDataState>(initialWalletDataState);
  const [txState, setTxState] = useState<TxState>({
    isSending: false,
    errorMessage: '',
    successTxid: '',
    result: null,
  });
  const [walletErrorMessage, setWalletErrorMessage] = useState('');
  const [copiedField, setCopiedField] = useState('');
  const [showSeed, setShowSeed] = useState(false);
  const [showWif, setShowWif] = useState(false);
  const [recommendedFee, setRecommendedFee] = useState<RecommendedFeeRate | null>(null);
  const [mempoolFallbackMessage, setMempoolFallbackMessage] = useState<string | null>(null);

  const explorerBaseUrl = useMemo(
    () => getBitcoinNetworkConfig(networkId).mempoolExplorerBaseUrl,
    [networkId],
  );

  useEffect(() => {
    walletSessionRef.current = walletSession;
  }, [walletSession]);

  useEffect(() => {
    let cancelled = false;

    const loadRecommendedFee = async () => {
      const fees = await fetchRecommendedFeeRate(networkId, {
        onFallback: () => {
          setMempoolFallbackMessage(`${ui.mempoolFallbackWarningTitle} — ${ui.mempoolFallbackWarningBody}`);
          setTimeout(() => setMempoolFallbackMessage(null), 10000);
        },
      });

      if (cancelled) {
        return;
      }

      setRecommendedFee(fees);
      setFeeRateInput(String(fees.halfHourFee || fees.hourFee || 1));
    };

    void loadRecommendedFee();

    return () => {
      cancelled = true;
    };
  }, [networkId]);

  useEffect(() => {
    const currentWallet = walletSessionRef.current;

    if (!currentWallet) {
      return;
    }

    try {
      const nextWallet =
        currentWallet.source.type === 'mnemonic'
          ? deriveWalletFromMnemonic({
              mnemonic: currentWallet.source.mnemonic,
              networkId,
            })
          : deriveWalletFromWif({
              wif: currentWallet.source.wif,
              networkId,
            });

      const remapped: WalletSession =
        currentWallet.source.type === 'mnemonic'
          ? {
              ...nextWallet,
              source: currentWallet.source,
            }
          : {
              ...nextWallet,
              source: currentWallet.source,
            };

      setWalletSession(remapped);
      setWalletData(initialWalletDataState);
      setTxState({
        isSending: false,
        errorMessage: '',
        successTxid: '',
        result: null,
      });
      setWalletErrorMessage('');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro ao trocar rede para a carteira atual.';
      setWalletSession(null);
      setWalletData(initialWalletDataState);
      setWalletErrorMessage(message);
    }
    // intentionally only on network switch
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [networkId]);

  const loadWalletData = async (addressValue: string) => {
    setWalletData((current) => ({
      ...current,
      isLoading: true,
      errorMessage: '',
    }));

    try {
      const [balance, utxos] = await Promise.all([
        fetchAddressBalance(networkId, addressValue, {
          onFallback: () => {
            setMempoolFallbackMessage(`${ui.mempoolFallbackWarningTitle} — ${ui.mempoolFallbackWarningBody}`);
            setTimeout(() => setMempoolFallbackMessage(null), 10000);
          },
        }),
        fetchAddressUtxos(networkId, addressValue, {
          onFallback: () => {
            setMempoolFallbackMessage(`${ui.mempoolFallbackWarningTitle} — ${ui.mempoolFallbackWarningBody}`);
            setTimeout(() => setMempoolFallbackMessage(null), 10000);
          },
        }),
      ]);

      setWalletData({
        isLoading: false,
        balance,
        utxos,
        errorMessage: '',
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Falha ao consultar saldo e UTXOs.';

      setWalletData({
        isLoading: false,
        balance: null,
        utxos: [],
        errorMessage: message,
      });
    }
  };

  useEffect(() => {
    if (!walletSession?.address) {
      setWalletData(initialWalletDataState);
      return;
    }

    void loadWalletData(walletSession.address);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletSession?.address, networkId]);

  const handleCopy = async (fieldId: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(fieldId);
      setTimeout(() => {
        setCopiedField((current) => (current === fieldId ? '' : current));
      }, 1400);
    } catch {
      setCopiedField('');
    }
  };

  const handleGenerateWallet = () => {
    try {
      const mnemonic = generateEnglishMnemonic(12);
      const derived = deriveWalletFromMnemonic({
        mnemonic,
        networkId,
      });

      const nextSession: WalletSession = {
        ...derived,
        source: {
          type: 'mnemonic',
          mnemonic,
          origin: 'generated',
        },
      };

      setWalletSession(nextSession);
      setWalletErrorMessage('');
      setTxState({
        isSending: false,
        errorMessage: '',
        successTxid: '',
        result: null,
      });
      setShowSeed(false);
      setShowWif(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Falha ao gerar carteira.';
      setWalletErrorMessage(message);
    }
  };

  const handleImportMnemonic = () => {
    try {
      const derived = deriveWalletFromMnemonic({
        mnemonic: mnemonicInput,
        networkId,
      });

      const nextSession: WalletSession = {
        ...derived,
        source: {
          type: 'mnemonic',
          mnemonic: mnemonicInput.trim(),
          origin: 'imported',
        },
      };

      setWalletSession(nextSession);
      setWalletErrorMessage('');
      setTxState({
        isSending: false,
        errorMessage: '',
        successTxid: '',
        result: null,
      });
      setShowSeed(false);
      setShowWif(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Falha ao importar seed.';
      setWalletErrorMessage(message);
    }
  };

  const handleImportWif = () => {
    try {
      const derived = deriveWalletFromWif({
        wif: wifInput,
        networkId,
      });

      const nextSession: WalletSession = {
        ...derived,
        source: {
          type: 'wif',
          wif: wifInput.trim(),
        },
      };

      setWalletSession(nextSession);
      setWalletErrorMessage('');
      setTxState({
        isSending: false,
        errorMessage: '',
        successTxid: '',
        result: null,
      });
      setShowSeed(false);
      setShowWif(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Falha ao importar WIF.';
      setWalletErrorMessage(message);
    }
  };

  const handleSend = async () => {
    if (!walletSession) {
      setTxState((current) => ({
        ...current,
        errorMessage: ui.invalidSend,
      }));
      return;
    }

    if (!destinationAddress.trim() || !amountBtc.trim() || !feeRateInput.trim()) {
      setTxState((current) => ({
        ...current,
        errorMessage: ui.invalidSend,
      }));
      return;
    }

    setTxState({
      isSending: true,
      errorMessage: '',
      successTxid: '',
      result: null,
    });

    try {
      const amountSats = btcToSats(amountBtc);
      const feeRate = Number(feeRateInput);

      if (!Number.isFinite(feeRate) || feeRate < 1) {
        throw new Error('Fee rate invalida.');
      }

      const signed = createAndSignSendTransaction({
        networkId,
        fromAddress: walletSession.address,
        destinationAddress: destinationAddress.trim(),
        amountSats,
        feeRate,
        wif: walletSession.wif,
        utxos: walletData.utxos,
        includeUnconfirmed,
      });

      const txid = await broadcastTransactionHex(networkId, signed.txHex, {
        onFallback: () => {
          setMempoolFallbackMessage(`${ui.mempoolFallbackWarningTitle} — ${ui.mempoolFallbackWarningBody}`);
          setTimeout(() => setMempoolFallbackMessage(null), 10000);
        },
      });

      setTxState({
        isSending: false,
        errorMessage: '',
        successTxid: txid,
        result: signed,
      });

      await loadWalletData(walletSession.address);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Falha ao enviar transacao.';
      setTxState({
        isSending: false,
        errorMessage: message,
        successTxid: '',
        result: null,
      });
    }
  };

  const currentBalance = walletData.balance;
  const confirmedBtc = currentBalance ? satsToBtc(currentBalance.confirmedSats) : '0';
  const unconfirmedBtc = currentBalance ? satsToBtc(currentBalance.unconfirmedSats) : '0';
  const totalBtc = currentBalance ? satsToBtc(currentBalance.totalSats) : '0';
  const feeRecommendation = recommendedFee;
  const mnemonicSecret =
    walletSession?.source.type === 'mnemonic' ? walletSession.source.mnemonic : '';

  return (
    <Card className="space-y-5">
      <header className="rounded-xl border border-brand-200 bg-gradient-to-r from-brand-50 to-indigo-50 p-4">
        <h3 className="text-lg font-semibold text-slate-900">{ui.title}</h3>
        <p className="mt-1 text-sm text-slate-700">{ui.intro}</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">{ui.networkLabel}</span>
          <Select
            value={networkId}
            onChange={(event) => setNetworkId(event.target.value as BitcoinNetworkId)}
          >
            <option value="testnet">{ui.networkTestnet}</option>
            <option value="mainnet">{ui.networkMainnet}</option>
          </Select>
        </label>

        <div className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">{ui.modeLabel}</span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={tabClassName(activeTab === 'generate')}
              onClick={() => setActiveTab('generate')}
            >
              {ui.modeGenerate}
            </button>
            <button
              type="button"
              className={tabClassName(activeTab === 'import-mnemonic')}
              onClick={() => setActiveTab('import-mnemonic')}
            >
              {ui.modeImportMnemonic}
            </button>
            <button
              type="button"
              className={tabClassName(activeTab === 'import-wif')}
              onClick={() => setActiveTab('import-wif')}
            >
              {ui.modeImportWif}
            </button>
          </div>
        </div>
      </div>

      <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
        {ui.testnetDefaultHint}
        <br />
        {ui.networkSwitchHint}
      </p>

      {networkId === 'mainnet' ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          {ui.mainnetWarning}
        </p>
      ) : null}

      {networkId === 'testnet' ? (
        <section className="space-y-2 rounded-xl border border-sky-200 bg-sky-50 p-4">
          <h4 className="text-sm font-semibold text-sky-900">{ui.testnetFaucetTitle}</h4>
          <p className="text-sm text-sky-800">{ui.testnetFaucetDescription}</p>
          <a
            href={testnet4FaucetUrl}
            target="_blank"
            rel="noreferrer nofollow"
            className="inline-flex text-sm font-semibold text-sky-900 underline"
          >
            {ui.openFaucet}
          </a>
        </section>
      ) : null}

      {activeTab === 'generate' ? (
        <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h4 className="text-sm font-semibold text-slate-900">{ui.generateTitle}</h4>
          <p className="text-sm text-slate-700">{ui.generateDescription}</p>
          <Button variant="secondary" onClick={handleGenerateWallet}>
            {ui.generateButton}
          </Button>
        </section>
      ) : null}

      {activeTab === 'import-mnemonic' ? (
        <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h4 className="text-sm font-semibold text-slate-900">{ui.importMnemonicTitle}</h4>
          <p className="text-sm text-slate-700">{ui.importMnemonicDescription}</p>
          <Textarea
            rows={4}
            value={mnemonicInput}
            placeholder={ui.mnemonicInputPlaceholder}
            onChange={(event) => setMnemonicInput(event.target.value)}
          />
          <Button variant="secondary" onClick={handleImportMnemonic}>
            {ui.importMnemonicButton}
          </Button>
        </section>
      ) : null}

      {activeTab === 'import-wif' ? (
        <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h4 className="text-sm font-semibold text-slate-900">{ui.importWifTitle}</h4>
          <p className="text-sm text-slate-700">{ui.importWifDescription}</p>
          <Input
            value={wifInput}
            placeholder={ui.wifInputPlaceholder}
            onChange={(event) => setWifInput(event.target.value)}
          />
          <Button variant="secondary" onClick={handleImportWif}>
            {ui.importWifButton}
          </Button>
        </section>
      ) : null}

      {walletErrorMessage ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {walletErrorMessage}
        </p>
      ) : null}

      {mempoolFallbackMessage ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          <strong className="font-semibold">{ui.mempoolFallbackWarningTitle}:</strong>{' '}
          {ui.mempoolFallbackWarningBody}
        </p>
      ) : null}

      {walletSession ? (
        <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-sm font-semibold text-slate-900">{ui.walletDetailsTitle}</h4>
            <Button
              variant="secondary"
              onClick={() => {
                void loadWalletData(walletSession.address);
              }}
            >
              {ui.refreshWalletData}
            </Button>
          </div>

          <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              {ui.addressLabel}
            </p>
            <p className="break-all text-sm font-semibold text-slate-900">{walletSession.address}</p>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  void handleCopy('address', walletSession.address);
                }}
              >
                {copiedField === 'address' ? ui.copied : ui.copy}
              </Button>
              <a
                href={`${explorerBaseUrl}/address/${walletSession.address}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex text-sm font-semibold text-slate-700 underline"
              >
                {ui.viewAddressOnExplorer}
              </a>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                {ui.publicKeyLabel}
              </p>
              <p className="break-all text-xs text-slate-800">{walletSession.publicKeyHex}</p>
            </div>

            <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                {ui.derivationPathLabel}
              </p>
              <p className="text-xs text-slate-800">{walletSession.derivationPath}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {walletSession.source.type === 'mnemonic' ? (
              <Button variant="secondary" onClick={() => setShowSeed((current) => !current)}>
                {showSeed ? ui.hideSeed : ui.showSeed}
              </Button>
            ) : null}
            <Button variant="secondary" onClick={() => setShowWif((current) => !current)}>
              {showWif ? ui.hideWif : ui.showWif}
            </Button>
          </div>

          {walletSession.source.type === 'mnemonic' && showSeed ? (
            <div className="space-y-2 rounded-lg border border-red-200 bg-red-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-red-700">
                {ui.generatedMnemonicLabel}
              </p>
              <p className="break-words text-sm text-red-800">{mnemonicSecret}</p>
              <Button
                variant="secondary"
                onClick={() => {
                  void handleCopy('seed', mnemonicSecret);
                }}
              >
                {copiedField === 'seed' ? ui.copied : ui.copy}
              </Button>
            </div>
          ) : null}

          {showWif ? (
            <div className="space-y-2 rounded-lg border border-red-200 bg-red-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-red-700">WIF</p>
              <p className="break-all text-sm text-red-800">{walletSession.wif}</p>
              <Button
                variant="secondary"
                onClick={() => {
                  void handleCopy('wif', walletSession.wif);
                }}
              >
                {copiedField === 'wif' ? ui.copied : ui.copy}
              </Button>
            </div>
          ) : null}
        </section>
      ) : (
        <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
          {ui.walletMissingHint}
        </p>
      )}

      <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h4 className="text-sm font-semibold text-slate-900">{ui.balanceTitle}</h4>

        {walletData.isLoading ? (
          <p className="text-sm text-slate-600">{ui.loadingWalletData}</p>
        ) : null}

        {walletData.errorMessage ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {walletData.errorMessage}
          </p>
        ) : null}

        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {ui.confirmedBalance}
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{confirmedBtc} BTC</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {ui.unconfirmedBalance}
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{unconfirmedBtc} BTC</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {ui.totalBalance}
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{totalBtc} BTC</p>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {ui.feeRecommendation}
          </p>
          {feeRecommendation ? (
            <p className="mt-1 text-sm text-slate-700">
              {ui.feeFast}: {feeRecommendation.fastestFee} • {ui.feeHalfHour}:{' '}
              {feeRecommendation.halfHourFee} • {ui.feeHour}: {feeRecommendation.hourFee} •{' '}
              {ui.feeMin}: {feeRecommendation.minimumFee} sat/vB
            </p>
          ) : (
            <p className="mt-1 text-sm text-slate-600">--</p>
          )}
        </div>
      </section>

      <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-sm font-semibold text-slate-900">{ui.utxosTitle}</h4>
          <p className="text-xs text-slate-600">{ui.utxosCount(walletData.utxos.length)}</p>
        </div>

        {walletData.utxos.length ? (
          <div className="space-y-2">
            {walletData.utxos.slice(0, 12).map((utxo) => (
              <div
                key={`${utxo.txid}-${utxo.vout}`}
                className="grid gap-2 rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-700 md:grid-cols-[1fr_auto_auto]"
              >
                <p className="break-all">
                  <strong>{ui.txidLabel}:</strong> {truncateTxid(utxo.txid)}#{utxo.vout}
                </p>
                <p>
                  <strong>{ui.amountLabel}:</strong> {satsToBtc(utxo.value)} BTC
                </p>
                <p>
                  <strong>{ui.statusLabel}:</strong>{' '}
                  {utxo.status.confirmed ? 'confirmed' : 'mempool'}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-600">{ui.utxosEmpty}</p>
        )}
      </section>

      <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h4 className="text-sm font-semibold text-slate-900">{ui.sendTitle}</h4>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">{ui.destinationLabel}</span>
            <Input
              value={destinationAddress}
              placeholder={ui.destinationPlaceholder}
              onChange={(event) => setDestinationAddress(event.target.value)}
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">{ui.amountBtcLabel}</span>
            <Input
              inputMode="decimal"
              value={amountBtc}
              placeholder={ui.amountBtcPlaceholder}
              onChange={(event) => setAmountBtc(event.target.value)}
            />
          </label>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">{ui.feeRateLabel}</span>
            <Input
              inputMode="decimal"
              value={feeRateInput}
              onChange={(event) => setFeeRateInput(event.target.value)}
            />
            <span className="text-xs text-slate-500">{ui.feeRateHint}</span>
          </label>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border border-slate-300 text-brand-600 focus:ring-2 focus:ring-brand-200"
              checked={includeUnconfirmed}
              onChange={(event) => setIncludeUnconfirmed(event.target.checked)}
            />
            {ui.includeUnconfirmedLabel}
          </label>
        </div>

        <p className="text-xs text-slate-500">{ui.includeConfirmedOnlyHint}</p>

        {txState.errorMessage ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {txState.errorMessage}
          </p>
        ) : null}

        {txState.successTxid ? (
          <div className="space-y-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
            <p className="font-semibold">{ui.txSuccess}</p>
            <p>
              <strong>{ui.txId}:</strong> {txState.successTxid}
            </p>
            <p>
              <strong>{ui.txFee}:</strong> {satsToBtc(txState.result?.feeSats ?? 0)} BTC
            </p>
            <p>
              <strong>{ui.txInputs}:</strong> {txState.result?.selectedInputs ?? 0}
            </p>
            <p>
              <strong>{ui.txChange}:</strong> {satsToBtc(txState.result?.changeSats ?? 0)} BTC
            </p>
            <a
              href={`${explorerBaseUrl}/tx/${txState.successTxid}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex text-sm font-semibold text-emerald-800 underline"
            >
              {ui.viewOnExplorer}
            </a>
          </div>
        ) : null}

        <Button
          variant="secondary"
          onClick={() => {
            void handleSend();
          }}
          disabled={txState.isSending || !walletSession}
        >
          {txState.isSending ? ui.sendingButton : ui.sendButton}
        </Button>
      </section>

      <p className="text-xs text-slate-600">{ui.localSecurityNote}</p>
    </Card>
  );
}
