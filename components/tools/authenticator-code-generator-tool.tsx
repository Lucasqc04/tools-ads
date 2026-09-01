'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Camera,
  Check,
  ClipboardCopy,
  Clock3,
  Eye,
  EyeOff,
  ImageUp,
  KeyRound,
  RefreshCw,
  Save,
  ShieldAlert,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { AppLocale } from '@/lib/i18n/config';
import {
  generateTotpCode,
  getTotpTiming,
  parseTotpInput,
  type TotpConfig,
} from '@/lib/totp-authenticator';

type Notice = { tone: 'error' | 'success' | 'info'; text: string } | null;

type SavedTotpEntry = TotpConfig & {
  id: string;
  savedAt: string;
};

const STORAGE_KEY = 'tools-authenticator-saved-totp-v1';

type UiCopy = {
  sourceTitle: string;
  sourceDescription: string;
  qrTitle: string;
  sourceLabel: string;
  sourcePlaceholder: string;
  sourceHint: string;
  customLabel: string;
  customLabelPlaceholder: string;
  defaultLabel: string;
  reveal: string;
  hide: string;
  load: string;
  scanImage: string;
  scanCamera: string;
  stopCamera: string;
  cameraHint: string;
  activeTitle: string;
  waitingTitle: string;
  waitingDescription: string;
  copyCode: string;
  copied: string;
  expiresIn: string;
  seconds: string;
  nextCode: string;
  configuration: string;
  issuer: string;
  account: string;
  algorithm: string;
  digits: string;
  period: string;
  securityTitle: string;
  securityText: string;
  acknowledgement: string;
  save: string;
  savedTitle: string;
  savedDescription: string;
  noSaved: string;
  useSaved: string;
  remove: string;
  removeAll: string;
  saved: string;
  sourceManual: string;
  sourceImage: string;
  sourceCamera: string;
  loaded: string;
  invalidQr: string;
  imageError: string;
  cameraError: string;
  copiedCode: string;
  clipboardError: string;
  storageError: string;
  savedLocally: string;
  duplicate: string;
  removed: string;
  removeConfirm: string;
  removeAllConfirm: string;
  parseErrors: Record<string, string>;
};

const uiByLocale: Record<AppLocale, UiCopy> = {
  'pt-br': {
    sourceTitle: 'Adicionar um autenticador temporário',
    sourceDescription: 'Leia a configuração pelo QR Code ou cole a chave secreta para gerar códigos localmente.',
    qrTitle: 'QR Code',
    sourceLabel: 'Chave Base32 ou link otpauth://totp/',
    sourcePlaceholder: 'Ex.: JBSWY3DPEHPK3PXP ou otpauth://totp/...',
    sourceHint: 'O token de 6 dígitos que já apareceu no app não gera o próximo código. Use o QR, a chave Base32 ou o link otpauth.',
    customLabel: 'Nome para identificar este teste (opcional)',
    customLabelPlaceholder: 'Ex.: OAuth staging',
    defaultLabel: 'Autenticador de teste',
    reveal: 'Mostrar chave',
    hide: 'Ocultar chave',
    load: 'Gerar código',
    scanImage: 'Ler imagem do QR',
    scanCamera: 'Abrir câmera',
    stopCamera: 'Fechar câmera',
    cameraHint: 'A câmera é usada apenas para ler o QR nesta página.',
    activeTitle: 'Código do autenticador',
    waitingTitle: 'Pronto para gerar um código',
    waitingDescription: 'Adicione um QR Code, uma chave Base32 ou um link otpauth para começar.',
    copyCode: 'Copiar código',
    copied: 'Copiado',
    expiresIn: 'Expira em',
    seconds: 'segundos',
    nextCode: 'O próximo código aparece automaticamente.',
    configuration: 'Configuração lida',
    issuer: 'Emissor',
    account: 'Conta',
    algorithm: 'Algoritmo',
    digits: 'Dígitos',
    period: 'Período',
    securityTitle: 'Antes de salvar neste dispositivo',
    securityText: 'Salvar mantém a chave secreta no localStorage deste navegador. Use somente para QA, staging ou testes em dispositivo confiável. Para contas pessoais, financeiras, administrativas ou de produção, use um aplicativo autenticador confiável.',
    acknowledgement: 'Entendo que esta chave ficará salva neste navegador e vou usar este recurso apenas para testes.',
    save: 'Salvar para teste local',
    savedTitle: 'Autenticadores salvos neste navegador',
    savedDescription: 'A lista não sai deste dispositivo. Remova entradas ao concluir o teste ou antes de usar um computador compartilhado.',
    noSaved: 'Nenhum autenticador salvo ainda.',
    useSaved: 'Usar',
    remove: 'Remover',
    removeAll: 'Remover todos',
    saved: 'salvo',
    sourceManual: 'chave colada',
    sourceImage: 'QR da imagem',
    sourceCamera: 'QR da câmera',
    loaded: 'Configuração carregada de',
    invalidQr: 'O QR Code não contém uma configuração TOTP compatível.',
    imageError: 'Não foi possível ler um QR Code nesta imagem.',
    cameraError: 'Não foi possível abrir ou usar a câmera.',
    copiedCode: 'Código copiado para a área de transferência.',
    clipboardError: 'Não foi possível copiar o código neste navegador.',
    storageError: 'Não foi possível salvar neste navegador.',
    savedLocally: 'Autenticador salvo somente neste navegador.',
    duplicate: 'Esta configuração já está salva neste navegador.',
    removed: 'Autenticador removido deste navegador.',
    removeConfirm: 'Remover esta chave salva deste navegador?',
    removeAllConfirm: 'Remover todos os autenticadores salvos deste navegador?',
    parseErrors: {
      empty: 'Cole uma chave Base32, um link otpauth ou leia um QR Code.',
      'invalid-url': 'O link otpauth está inválido ou usa parâmetros não suportados.',
      'unsupported-type': 'Este QR não é do tipo TOTP. Códigos HOTP não acompanham a expiração por tempo.',
      'missing-secret': 'A configuração não possui uma chave secreta.',
      'invalid-secret': 'A chave deve estar em Base32 e ter formato válido.',
      'temporary-code': 'Este é apenas um código temporário. Cole o QR, a chave Base32 ou o link otpauth para gerar os próximos.',
    },
  },
  en: {
    sourceTitle: 'Add a temporary authenticator',
    sourceDescription: 'Scan the setup QR code or paste the secret to generate codes locally.',
    qrTitle: 'QR Code',
    sourceLabel: 'Base32 secret or otpauth://totp/ link',
    sourcePlaceholder: 'Example: JBSWY3DPEHPK3PXP or otpauth://totp/...',
    sourceHint: 'A six-digit token already shown by an app cannot create the next one. Use the QR, Base32 secret, or otpauth link.',
    customLabel: 'Label for this test (optional)',
    customLabelPlaceholder: 'Example: OAuth staging',
    defaultLabel: 'Test authenticator',
    reveal: 'Show secret',
    hide: 'Hide secret',
    load: 'Generate code',
    scanImage: 'Scan QR image',
    scanCamera: 'Open camera',
    stopCamera: 'Close camera',
    cameraHint: 'The camera is used only to scan the QR on this page.',
    activeTitle: 'Authenticator code',
    waitingTitle: 'Ready to generate a code',
    waitingDescription: 'Add a QR code, Base32 secret, or otpauth link to start.',
    copyCode: 'Copy code',
    copied: 'Copied',
    expiresIn: 'Expires in',
    seconds: 'seconds',
    nextCode: 'The next code appears automatically.',
    configuration: 'Read configuration',
    issuer: 'Issuer',
    account: 'Account',
    algorithm: 'Algorithm',
    digits: 'Digits',
    period: 'Period',
    securityTitle: 'Before saving on this device',
    securityText: 'Saving stores the secret in this browser’s localStorage. Use it only for QA, staging, or testing on a trusted device. For personal, financial, admin, or production accounts, use a trusted authenticator app.',
    acknowledgement: 'I understand this secret will be stored in this browser and will use this only for testing.',
    save: 'Save for local testing',
    savedTitle: 'Authenticators saved in this browser',
    savedDescription: 'This list does not leave this device. Remove entries after testing or before using a shared computer.',
    noSaved: 'No saved authenticator yet.',
    useSaved: 'Use',
    remove: 'Remove',
    removeAll: 'Remove all',
    saved: 'saved',
    sourceManual: 'pasted secret',
    sourceImage: 'QR image',
    sourceCamera: 'camera QR',
    loaded: 'Configuration loaded from',
    invalidQr: 'This QR Code does not contain a compatible TOTP configuration.',
    imageError: 'A QR Code could not be read from this image.',
    cameraError: 'The camera could not be opened or used.',
    copiedCode: 'Code copied to clipboard.',
    clipboardError: 'The code could not be copied in this browser.',
    storageError: 'This browser could not save the entry.',
    savedLocally: 'Authenticator saved only in this browser.',
    duplicate: 'This configuration is already saved in this browser.',
    removed: 'Authenticator removed from this browser.',
    removeConfirm: 'Remove this saved secret from this browser?',
    removeAllConfirm: 'Remove every saved authenticator from this browser?',
    parseErrors: {
      empty: 'Paste a Base32 secret, an otpauth link, or scan a QR Code.',
      'invalid-url': 'The otpauth link is invalid or uses unsupported parameters.',
      'unsupported-type': 'This QR is not TOTP. HOTP codes do not rotate on a time interval.',
      'missing-secret': 'This setup does not include a secret key.',
      'invalid-secret': 'The secret must be valid Base32.',
      'temporary-code': 'This is only a temporary code. Paste the QR, Base32 secret, or otpauth link to generate future codes.',
    },
  },
  es: {
    sourceTitle: 'Añadir un autenticador temporal',
    sourceDescription: 'Lee el QR de configuración o pega el secreto para generar códigos localmente.',
    qrTitle: 'Código QR',
    sourceLabel: 'Secreto Base32 o enlace otpauth://totp/',
    sourcePlaceholder: 'Ej.: JBSWY3DPEHPK3PXP u otpauth://totp/...',
    sourceHint: 'Un token de seis dígitos ya mostrado por una app no puede crear el siguiente. Usa el QR, secreto Base32 o enlace otpauth.',
    customLabel: 'Nombre para esta prueba (opcional)',
    customLabelPlaceholder: 'Ej.: OAuth staging',
    defaultLabel: 'Autenticador de prueba',
    reveal: 'Mostrar secreto',
    hide: 'Ocultar secreto',
    load: 'Generar código',
    scanImage: 'Leer imagen QR',
    scanCamera: 'Abrir cámara',
    stopCamera: 'Cerrar cámara',
    cameraHint: 'La cámara solo se usa para leer el QR en esta página.',
    activeTitle: 'Código del autenticador',
    waitingTitle: 'Listo para generar un código',
    waitingDescription: 'Añade un QR, secreto Base32 o enlace otpauth para empezar.',
    copyCode: 'Copiar código',
    copied: 'Copiado',
    expiresIn: 'Expira en',
    seconds: 'segundos',
    nextCode: 'El próximo código aparece automáticamente.',
    configuration: 'Configuración leída',
    issuer: 'Emisor',
    account: 'Cuenta',
    algorithm: 'Algoritmo',
    digits: 'Dígitos',
    period: 'Periodo',
    securityTitle: 'Antes de guardar en este dispositivo',
    securityText: 'Guardar mantiene el secreto en el localStorage de este navegador. Úsalo solo para QA, staging o pruebas en un dispositivo confiable. Para cuentas personales, financieras, administrativas o de producción, usa una app autenticadora confiable.',
    acknowledgement: 'Entiendo que este secreto quedará guardado en este navegador y usaré esta función solo para pruebas.',
    save: 'Guardar para prueba local',
    savedTitle: 'Autenticadores guardados en este navegador',
    savedDescription: 'La lista no sale de este dispositivo. Elimina las entradas al terminar o antes de usar un equipo compartido.',
    noSaved: 'Todavía no hay autenticadores guardados.',
    useSaved: 'Usar',
    remove: 'Eliminar',
    removeAll: 'Eliminar todos',
    saved: 'guardado',
    sourceManual: 'secreto pegado',
    sourceImage: 'QR de imagen',
    sourceCamera: 'QR de cámara',
    loaded: 'Configuración cargada desde',
    invalidQr: 'Este QR Code no contiene una configuración TOTP compatible.',
    imageError: 'No se pudo leer un QR Code en esta imagen.',
    cameraError: 'No se pudo abrir o usar la cámara.',
    copiedCode: 'Código copiado al portapapeles.',
    clipboardError: 'No se pudo copiar el código en este navegador.',
    storageError: 'No se pudo guardar en este navegador.',
    savedLocally: 'Autenticador guardado solo en este navegador.',
    duplicate: 'Esta configuración ya está guardada en este navegador.',
    removed: 'Autenticador eliminado de este navegador.',
    removeConfirm: '¿Eliminar este secreto guardado de este navegador?',
    removeAllConfirm: '¿Eliminar todos los autenticadores guardados de este navegador?',
    parseErrors: {
      empty: 'Pega un secreto Base32, un enlace otpauth o lee un QR Code.',
      'invalid-url': 'El enlace otpauth es inválido o usa parámetros no compatibles.',
      'unsupported-type': 'Este QR no es TOTP. Los códigos HOTP no rotan por tiempo.',
      'missing-secret': 'La configuración no tiene una clave secreta.',
      'invalid-secret': 'El secreto debe tener Base32 válido.',
      'temporary-code': 'Esto es solo un código temporal. Pega el QR, secreto Base32 o enlace otpauth para generar los próximos.',
    },
  },
  zh: {
    sourceTitle: 'Add a temporary authenticator',
    sourceDescription: 'Scan the setup QR code or paste the secret to generate codes locally.',
    qrTitle: 'QR Code',
    sourceLabel: 'Base32 secret or otpauth://totp/ link',
    sourcePlaceholder: 'Example: JBSWY3DPEHPK3PXP or otpauth://totp/...',
    sourceHint: 'A six-digit token already shown by an app cannot create the next one. Use the QR, Base32 secret, or otpauth link.',
    customLabel: 'Label for this test (optional)',
    customLabelPlaceholder: 'Example: OAuth staging',
    defaultLabel: 'Test authenticator',
    reveal: 'Show secret',
    hide: 'Hide secret',
    load: 'Generate code',
    scanImage: 'Scan QR image',
    scanCamera: 'Open camera',
    stopCamera: 'Close camera',
    cameraHint: 'The camera is used only to scan the QR on this page.',
    activeTitle: 'Authenticator code',
    waitingTitle: 'Ready to generate a code',
    waitingDescription: 'Add a QR code, Base32 secret, or otpauth link to start.',
    copyCode: 'Copy code',
    copied: 'Copied',
    expiresIn: 'Expires in',
    seconds: 'seconds',
    nextCode: 'The next code appears automatically.',
    configuration: 'Read configuration',
    issuer: 'Issuer',
    account: 'Account',
    algorithm: 'Algorithm',
    digits: 'Digits',
    period: 'Period',
    securityTitle: 'Before saving on this device',
    securityText: 'Saving stores the secret in this browser’s localStorage. Use it only for QA, staging, or testing on a trusted device. For personal, financial, admin, or production accounts, use a trusted authenticator app.',
    acknowledgement: 'I understand this secret will be stored in this browser and will use this only for testing.',
    save: 'Save for local testing',
    savedTitle: 'Authenticators saved in this browser',
    savedDescription: 'This list does not leave this device. Remove entries after testing or before using a shared computer.',
    noSaved: 'No saved authenticator yet.',
    useSaved: 'Use',
    remove: 'Remove',
    removeAll: 'Remove all',
    saved: 'saved',
    sourceManual: 'pasted secret',
    sourceImage: 'QR image',
    sourceCamera: 'camera QR',
    loaded: 'Configuration loaded from',
    invalidQr: 'This QR Code does not contain a compatible TOTP configuration.',
    imageError: 'A QR Code could not be read from this image.',
    cameraError: 'The camera could not be opened or used.',
    copiedCode: 'Code copied to clipboard.',
    clipboardError: 'The code could not be copied in this browser.',
    storageError: 'This browser could not save the entry.',
    savedLocally: 'Authenticator saved only in this browser.',
    duplicate: 'This configuration is already saved in this browser.',
    removed: 'Authenticator removed from this browser.',
    removeConfirm: 'Remove this saved secret from this browser?',
    removeAllConfirm: 'Remove every saved authenticator from this browser?',
    parseErrors: {
      empty: 'Paste a Base32 secret, an otpauth link, or scan a QR Code.',
      'invalid-url': 'The otpauth link is invalid or uses unsupported parameters.',
      'unsupported-type': 'This QR is not TOTP. HOTP codes do not rotate on a time interval.',
      'missing-secret': 'This setup does not include a secret key.',
      'invalid-secret': 'The secret must be valid Base32.',
      'temporary-code': 'This is only a temporary code. Paste the QR, Base32 secret, or otpauth link to generate future codes.',
    },
  },
};

const isSavedEntry = (value: unknown): value is SavedTotpEntry => {
  if (!value || typeof value !== 'object') return false;

  const entry = value as Partial<SavedTotpEntry>;
  return (
    typeof entry.id === 'string' &&
    typeof entry.secret === 'string' &&
    typeof entry.label === 'string' &&
    typeof entry.period === 'number' &&
    (entry.digits === 6 || entry.digits === 8) &&
    (entry.algorithm === 'SHA-1' || entry.algorithm === 'SHA-256' || entry.algorithm === 'SHA-512')
  );
};

const formatCode = (code: string) => (code.length === 6 ? `${code.slice(0, 3)} ${code.slice(3)}` : code);

const createEntryId = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;

export function AuthenticatorCodeGeneratorTool({
  locale = 'pt-br',
}: Readonly<{ locale?: AppLocale }>) {
  const ui = uiByLocale[locale];
  const [rawInput, setRawInput] = useState('');
  const [customLabel, setCustomLabel] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [activeConfig, setActiveConfig] = useState<TotpConfig | null>(null);
  const [code, setCode] = useState('');
  const [now, setNow] = useState(() => Date.now());
  const [notice, setNotice] = useState<Notice>(null);
  const [isReadingImage, setIsReadingImage] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [savedEntries, setSavedEntries] = useState<SavedTotpEntry[]>([]);
  const [storageAcknowledged, setStorageAcknowledged] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scannerControlsRef = useRef<{ stop: () => void } | null>(null);

  const timing = activeConfig ? getTotpTiming(activeConfig.period, now) : null;
  const timeSlot = activeConfig ? Math.floor(now / 1000 / activeConfig.period) : null;

  const writeSavedEntries = useCallback((entries: SavedTotpEntry[]) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    setSavedEntries(entries);
  }, []);

  useEffect(() => {
    try {
      const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]') as unknown;
      setSavedEntries(Array.isArray(parsed) ? parsed.filter(isSavedEntry) : []);
    } catch {
      setNotice({ tone: 'error', text: ui.invalidQr });
    }
  }, [ui.invalidQr]);

  useEffect(() => {
    if (!activeConfig) return undefined;

    const interval = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(interval);
  }, [activeConfig]);

  useEffect(() => {
    if (!activeConfig || timeSlot === null) {
      setCode('');
      return;
    }

    let cancelled = false;
    setCode('');

    void generateTotpCode(activeConfig, timeSlot * activeConfig.period * 1000)
      .then((nextCode) => {
        if (!cancelled) {
          setCode(nextCode);
          setCopied(false);
        }
      })
      .catch(() => {
        if (!cancelled) setNotice({ tone: 'error', text: ui.invalidQr });
      });

    return () => {
      cancelled = true;
    };
  }, [activeConfig, timeSlot, ui.invalidQr]);

  const stopCamera = useCallback(() => {
    scannerControlsRef.current?.stop();
    scannerControlsRef.current = null;
    setIsCameraActive(false);
  }, []);

  useEffect(() => stopCamera, [stopCamera]);

  const loadImportedInput = useCallback(
    (value: string, source: string) => {
      const parsed = parseTotpInput(value, customLabel);

      if (!parsed.ok) {
        setNotice({ tone: 'error', text: ui.parseErrors[parsed.reason] ?? ui.invalidQr });
        return false;
      }

      setRawInput(value);
      setActiveConfig({
        ...parsed.config,
        label:
          customLabel.trim() || parsed.config.label === 'Temporary authenticator code'
            ? customLabel.trim() || ui.defaultLabel
            : parsed.config.label,
      });
      setNow(Date.now());
      setCopied(false);
      setNotice({ tone: 'success', text: `${ui.loaded} ${source}.` });
      return true;
    },
    [customLabel, ui.defaultLabel, ui.invalidQr, ui.loaded, ui.parseErrors],
  );

  const handleManualLoad = () => {
    loadImportedInput(rawInput, ui.sourceManual);
  };

  const handleQrImage = async (file: File | undefined) => {
    if (!file) return;

    setIsReadingImage(true);
    try {
      const { BrowserQRCodeReader } = await import('@zxing/browser');
      const reader = new BrowserQRCodeReader();
      const objectUrl = URL.createObjectURL(file);

      try {
        const result = await reader.decodeFromImageUrl(objectUrl);
        loadImportedInput(result.getText(), ui.sourceImage);
      } finally {
        URL.revokeObjectURL(objectUrl);
      }
    } catch {
      setNotice({ tone: 'error', text: ui.imageError });
    } finally {
      setIsReadingImage(false);
    }
  };

  const startCamera = async () => {
    if (!videoRef.current) return;

    try {
      stopCamera();
      const { BrowserQRCodeReader } = await import('@zxing/browser');
      const reader = new BrowserQRCodeReader(undefined, {
        delayBetweenScanAttempts: 250,
        delayBetweenScanSuccess: 800,
      });
      const controls = await reader.decodeFromVideoDevice(undefined, videoRef.current, (result) => {
        if (result && loadImportedInput(result.getText(), ui.sourceCamera)) {
          stopCamera();
        }
      });

      scannerControlsRef.current = controls;
      setIsCameraActive(true);
    } catch {
      setNotice({ tone: 'error', text: ui.cameraError });
      stopCamera();
    }
  };

  const copyCode = async () => {
    if (!code) return;

    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setNotice({ tone: 'success', text: ui.copiedCode });
    } catch {
      setNotice({ tone: 'error', text: ui.clipboardError });
    }
  };

  const saveCurrent = () => {
    if (!activeConfig || !storageAcknowledged) return;

    const duplicate = savedEntries.some(
      (entry) => entry.secret === activeConfig.secret && entry.period === activeConfig.period,
    );

    if (duplicate) {
      setNotice({ tone: 'info', text: ui.duplicate });
      return;
    }

    try {
      writeSavedEntries([
        ...savedEntries,
        { ...activeConfig, id: createEntryId(), savedAt: new Date().toISOString() },
      ]);
      setStorageAcknowledged(false);
      setNotice({ tone: 'success', text: ui.savedLocally });
    } catch {
      setNotice({ tone: 'error', text: ui.storageError });
    }
  };

  const removeSaved = (id: string) => {
    if (!window.confirm(ui.removeConfirm)) return;

    writeSavedEntries(savedEntries.filter((entry) => entry.id !== id));
    setNotice({ tone: 'success', text: ui.removed });
  };

  const clearSaved = () => {
    if (!window.confirm(ui.removeAllConfirm)) return;

    writeSavedEntries([]);
    setNotice({ tone: 'success', text: ui.removed });
  };

  const activeLabel = useMemo(() => {
    if (!activeConfig) return '';
    return activeConfig.issuer || activeConfig.account || activeConfig.label;
  }, [activeConfig]);

  return (
    <div className="space-y-5">
      <Card className="space-y-5">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-slate-900">{ui.sourceTitle}</h3>
          <p className="text-sm leading-6 text-slate-600">{ui.sourceDescription}</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)]">
          <div className="space-y-4">
            <label className="block space-y-2 text-sm font-semibold text-slate-800">
              <span>{ui.sourceLabel}</span>
              <div className="relative">
                <Input
                  type={showSecret ? 'text' : 'password'}
                  value={rawInput}
                  onChange={(event) => {
                    setRawInput(event.target.value);
                    setActiveConfig(null);
                  }}
                  placeholder={ui.sourcePlaceholder}
                  className="pr-12"
                  spellCheck={false}
                  autoComplete="off"
                  aria-describedby="totp-source-hint"
                />
                <button
                  type="button"
                  className="absolute right-2 top-2 rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                  aria-label={showSecret ? ui.hide : ui.reveal}
                  onClick={() => setShowSecret((current) => !current)}
                >
                  {showSecret ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>
            <p id="totp-source-hint" className="text-xs leading-5 text-slate-500">{ui.sourceHint}</p>
            <label className="block space-y-2 text-sm font-semibold text-slate-800">
              <span>{ui.customLabel}</span>
              <Input
                value={customLabel}
                onChange={(event) => setCustomLabel(event.target.value)}
                placeholder={ui.customLabelPlaceholder}
                maxLength={80}
                autoComplete="off"
              />
            </label>
            <Button onClick={handleManualLoad} disabled={!rawInput.trim()} className="w-full sm:w-auto">
              <KeyRound size={17} className="mr-2" />
              {ui.load}
            </Button>
          </div>

          <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h4 className="text-sm font-semibold text-slate-900">{ui.qrTitle}</h4>
            <p className="text-sm leading-6 text-slate-600">{ui.sourceDescription}</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                void handleQrImage(file);
                event.target.value = '';
              }}
            />
            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
                disabled={isReadingImage}
              >
                <ImageUp size={17} className="mr-2" />
                {isReadingImage ? <RefreshCw size={17} className="animate-spin" /> : ui.scanImage}
              </Button>
              <Button variant="secondary" onClick={() => (isCameraActive ? stopCamera() : void startCamera())}>
                <Camera size={17} className="mr-2" />
                {isCameraActive ? ui.stopCamera : ui.scanCamera}
              </Button>
            </div>
            {isCameraActive ? (
              <div className="space-y-2">
                <video ref={videoRef} className="aspect-video w-full rounded-lg bg-slate-950 object-cover" muted playsInline />
                <p className="text-xs leading-5 text-slate-500">{ui.cameraHint}</p>
              </div>
            ) : (
              <video ref={videoRef} className="hidden" muted playsInline />
            )}
          </section>
        </div>

        {notice ? (
          <p
            role={notice.tone === 'error' ? 'alert' : 'status'}
            className={`rounded-lg px-3 py-2 text-sm ${
              notice.tone === 'error'
                ? 'bg-red-50 text-red-700'
                : notice.tone === 'success'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-sky-50 text-sky-700'
            }`}
          >
            {notice.text}
          </p>
        ) : null}
      </Card>

      <Card className="space-y-5">
        {activeConfig ? (
          <>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{ui.activeTitle}</h3>
                <p className="text-sm text-slate-600">{activeLabel}</p>
              </div>
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                <Check size={14} /> {ui.configuration}
              </span>
            </div>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-center">
              <button
                type="button"
                onClick={() => void copyCode()}
                className="min-h-36 w-full rounded-xl bg-slate-950 px-5 py-6 text-left text-white transition hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
                aria-label={ui.copyCode}
              >
                <span className="block text-sm font-medium text-slate-300">{copied ? ui.copied : ui.copyCode}</span>
                <span className="mt-2 block break-all font-mono text-4xl font-bold tracking-[0.14em] sm:text-5xl">
                  {code ? formatCode(code) : '••• •••'}
                </span>
                <span className="mt-3 inline-flex items-center gap-2 text-sm text-slate-300">
                  <ClipboardCopy size={16} /> {ui.nextCode}
                </span>
              </button>

              <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-4 border-brand-100 bg-white font-mono text-xl font-bold text-slate-900">
                  {timing?.remainingSeconds ?? '--'}
                </div>
                <p className="text-sm font-semibold text-slate-900">
                  {ui.expiresIn} {timing?.remainingSeconds ?? '--'} {ui.seconds}
                </p>
                <div className="h-2 overflow-hidden rounded-full bg-slate-200" aria-hidden="true">
                  <div
                    className="h-full rounded-full bg-brand-600 transition-[width] duration-200"
                    style={{ width: `${timing?.progress ?? 0}%` }}
                  />
                </div>
                <p className="inline-flex items-center gap-1.5 text-xs text-slate-500"><Clock3 size={14} /> {activeConfig.period}s</p>
              </div>
            </div>

            <dl className="grid gap-3 text-sm sm:grid-cols-2 xl:grid-cols-4">
              {[
                [ui.issuer, activeConfig.issuer || '—'],
                [ui.account, activeConfig.account || activeConfig.label],
                [ui.algorithm, activeConfig.algorithm],
                [ui.digits, String(activeConfig.digits)],
                [ui.period, `${activeConfig.period}s`],
              ].map(([label, value]) => (
                <div key={label} className="min-w-0 rounded-lg bg-slate-50 px-3 py-2">
                  <dt className="text-xs font-medium text-slate-500">{label}</dt>
                  <dd className="mt-1 truncate font-semibold text-slate-800" title={value}>{value}</dd>
                </div>
              ))}
            </dl>
          </>
        ) : (
          <div className="flex min-h-44 flex-col items-center justify-center text-center">
            <KeyRound size={30} className="text-brand-600" />
            <h3 className="mt-3 text-lg font-semibold text-slate-900">{ui.waitingTitle}</h3>
            <p className="mt-1 max-w-md text-sm leading-6 text-slate-600">{ui.waitingDescription}</p>
          </div>
        )}
      </Card>

      <Card className="space-y-4 border-amber-200 bg-amber-50/60">
        <div className="flex gap-3">
          <ShieldAlert className="mt-0.5 shrink-0 text-amber-700" size={22} />
          <div>
            <h3 className="font-semibold text-amber-950">{ui.securityTitle}</h3>
            <p className="mt-1 text-sm leading-6 text-amber-900">{ui.securityText}</p>
          </div>
        </div>
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-5 text-amber-950">
          <input
            type="checkbox"
            checked={storageAcknowledged}
            onChange={(event) => setStorageAcknowledged(event.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-amber-400 text-brand-600 focus:ring-brand-500"
          />
          {ui.acknowledgement}
        </label>
        <Button onClick={saveCurrent} disabled={!activeConfig || !storageAcknowledged}>
          <Save size={17} className="mr-2" /> {ui.save}
        </Button>
      </Card>

      <Card className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{ui.savedTitle}</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">{ui.savedDescription}</p>
          </div>
          {savedEntries.length > 0 ? (
            <Button variant="ghost" onClick={clearSaved} className="w-fit text-red-700 hover:bg-red-50 hover:text-red-800">
              <Trash2 size={16} className="mr-2" /> {ui.removeAll}
            </Button>
          ) : null}
        </div>

        {savedEntries.length ? (
          <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200">
            {savedEntries.map((entry) => (
              <li key={entry.id} className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">{entry.label}</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {[entry.issuer, entry.account].filter(Boolean).join(' · ') || `${entry.digits} ${ui.digits} · ${entry.period}s`}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setActiveConfig(entry);
                      setRawInput(entry.secret);
                      setCustomLabel(entry.label);
                      setNow(Date.now());
                      setNotice({ tone: 'success', text: `${entry.label} ${ui.saved}.` });
                    }}
                  >
                    <KeyRound size={16} className="mr-2" /> {ui.useSaved}
                  </Button>
                  <Button variant="ghost" onClick={() => removeSaved(entry.id)} className="text-red-700 hover:bg-red-50 hover:text-red-800" aria-label={`${ui.remove} ${entry.label}`}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-xl border border-dashed border-slate-300 px-4 py-5 text-sm text-slate-600">{ui.noSaved}</p>
        )}
      </Card>
    </div>
  );
}
