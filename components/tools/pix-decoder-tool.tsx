'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { AppLocale } from '@/lib/i18n/config';
import {
  buildPixPayload,
  fixCrc,
  formatKeyForPayload,
  getPixExamples,
  parseEmvFields,
  pixToCsv,
  pixToJson,
  validatePixPayload,
  verifyCrc,
  type EmvField,
  type PixData,
  type PixGeneratorInput,
  type PixGeneratorResult,
  type PixKeyType,
  type PixValidationResult,
} from '@/lib/pix-emv';

// ---------- TYPES ----------

type Tab = 'generate' | 'validate' | 'decoder' | 'tree' | 'qrcode' | 'crc' | 'export';

type PixDecoderToolProps = Readonly<{
  locale?: AppLocale;
  initialTab?: Tab;
}>;

// ---------- LABELS ----------

const ui: Record<string, Record<AppLocale, string>> = {
  tabGenerate: { 'pt-br': 'Gerar Pix', en: 'Generate Pix', es: 'Generar Pix' },
  tabValidate: { 'pt-br': 'Validar', en: 'Validate', es: 'Validar' },
  tabDecoder: { 'pt-br': 'Decoder', en: 'Decoder', es: 'Decoder' },
  tabTree: { 'pt-br': 'Árvore EMV', en: 'EMV Tree', es: 'Árbol EMV' },
  tabQr: { 'pt-br': 'QR Code', en: 'QR Code', es: 'QR Code' },
  tabCrc: { 'pt-br': 'CRC16', en: 'CRC16', es: 'CRC16' },
  tabExport: { 'pt-br': 'Exportar', en: 'Export', es: 'Exportar' },
  keyType: { 'pt-br': 'Tipo de chave', en: 'Key type', es: 'Tipo de clave' },
  key: { 'pt-br': 'Chave Pix', en: 'Pix Key', es: 'Clave Pix' },
  name: { 'pt-br': 'Nome do recebedor', en: 'Recipient name', es: 'Nombre del receptor' },
  city: { 'pt-br': 'Cidade', en: 'City', es: 'Ciudad' },
  amount: { 'pt-br': 'Valor (R$)', en: 'Amount (BRL)', es: 'Valor (BRL)' },
  txid: { 'pt-br': 'TXID (opcional)', en: 'TXID (optional)', es: 'TXID (opcional)' },
  additionalInfo: { 'pt-br': 'Info adicional', en: 'Additional info', es: 'Info adicional' },
  generate: { 'pt-br': 'Gerar Pix Copia e Cola', en: 'Generate Pix Copy & Paste', es: 'Generar Pix Copia y Pega' },
  reset: { 'pt-br': 'Resetar', en: 'Reset', es: 'Resetear' },
  loadExample: { 'pt-br': 'Carregar exemplo', en: 'Load example', es: 'Cargar ejemplo' },
  copy: { 'pt-br': 'Copiar', en: 'Copy', es: 'Copiar' },
  copied: { 'pt-br': 'Copiado!', en: 'Copied!', es: '¡Copiado!' },
  download: { 'pt-br': 'Baixar', en: 'Download', es: 'Descargar' },
  payload: { 'pt-br': 'Pix Copia e Cola', en: 'Pix Copy & Paste', es: 'Pix Copia y Pega' },
  pastePayload: { 'pt-br': 'Cole o Pix Copia e Cola aqui', en: 'Paste Pix Copy & Paste here', es: 'Pegue el Pix Copia y Pega aquí' },
  validate: { 'pt-br': 'Validar', en: 'Validate', es: 'Validar' },
  valid: { 'pt-br': 'Válido', en: 'Valid', es: 'Válido' },
  validWarnings: { 'pt-br': 'Válido com avisos', en: 'Valid with warnings', es: 'Válido con avisos' },
  invalid: { 'pt-br': 'Inválido', en: 'Invalid', es: 'Inválido' },
  crcInvalid: { 'pt-br': 'CRC inválido', en: 'Invalid CRC', es: 'CRC inválido' },
  notPix: { 'pt-br': 'Não parece Pix', en: 'Not a Pix payload', es: 'No parece Pix' },
  static: { 'pt-br': 'Pix Estático', en: 'Static Pix', es: 'Pix Estático' },
  dynamic: { 'pt-br': 'Pix Dinâmico', en: 'Dynamic Pix', es: 'Pix Dinámico' },
  unknown: { 'pt-br': 'Desconhecido', en: 'Unknown', es: 'Desconocido' },
  pixData: { 'pt-br': 'Dados Pix extraídos', en: 'Extracted Pix data', es: 'Datos Pix extraídos' },
  fixCrc: { 'pt-br': 'Corrigir CRC', en: 'Fix CRC', es: 'Corregir CRC' },
  crcOriginal: { 'pt-br': 'CRC original', en: 'Original CRC', es: 'CRC original' },
  crcCalculated: { 'pt-br': 'CRC calculado', en: 'Calculated CRC', es: 'CRC calculado' },
  crcStatus: { 'pt-br': 'Status', en: 'Status', es: 'Estado' },
  fixedPayload: { 'pt-br': 'Payload corrigido', en: 'Fixed payload', es: 'Payload corregido' },
  qrSize: { 'pt-br': 'Tamanho do QR', en: 'QR size', es: 'Tamaño del QR' },
  qrColor: { 'pt-br': 'Cor do QR', en: 'QR color', es: 'Color del QR' },
  qrBg: { 'pt-br': 'Cor de fundo', en: 'Background', es: 'Color de fondo' },
  downloadPng: { 'pt-br': 'Baixar PNG', en: 'Download PNG', es: 'Descargar PNG' },
  downloadSvg: { 'pt-br': 'Baixar SVG', en: 'Download SVG', es: 'Descargar SVG' },
  exportJson: { 'pt-br': 'Exportar JSON', en: 'Export JSON', es: 'Exportar JSON' },
  exportCsv: { 'pt-br': 'Exportar CSV', en: 'Export CSV', es: 'Exportar CSV' },
  exportTxt: { 'pt-br': 'Exportar TXT', en: 'Export TXT', es: 'Exportar TXT' },
  privacy: { 'pt-br': '🔒 Processamento 100% local. Nenhum dado é enviado ao servidor.', en: '🔒 100% local processing. No data is sent to any server.', es: '🔒 Procesamiento 100% local. Ningún dato se envía al servidor.' },
  securityWarning: { 'pt-br': '⚠️ CRC válido NÃO garante que o recebedor é confiável. Confira sempre no app do banco.', en: '⚠️ Valid CRC does NOT mean the recipient is trustworthy. Always verify in your banking app.', es: '⚠️ CRC válido NO garantiza que el receptor es confiable. Verifica siempre en tu app bancaria.' },
  examples: { 'pt-br': 'Exemplos', en: 'Examples', es: 'Ejemplos' },
  legend: { 'pt-br': 'Legenda', en: 'Legend', es: 'Leyenda' },
  cpf: { 'pt-br': 'CPF', en: 'CPF', es: 'CPF' },
  cnpj: { 'pt-br': 'CNPJ', en: 'CNPJ', es: 'CNPJ' },
  email: { 'pt-br': 'E-mail', en: 'Email', es: 'E-mail' },
  phone: { 'pt-br': 'Telefone', en: 'Phone', es: 'Teléfono' },
  random: { 'pt-br': 'Chave aleatória', en: 'Random key', es: 'Clave aleatoria' },
  manual: { 'pt-br': 'Manual/outro', en: 'Manual/other', es: 'Manual/otro' },
};

function t(key: string, locale: AppLocale): string {
  return ui[key]?.[locale] ?? ui[key]?.['pt-br'] ?? key;
}

// ---------- FIELD CATEGORY COLORS ----------

const CATEGORY_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  emv: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'EMV básico' },
  pix: { bg: 'bg-green-100', text: 'text-green-800', label: 'Pix' },
  merchant: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Recebedor' },
  additional: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Dados adicionais' },
  crc: { bg: 'bg-red-100', text: 'text-red-800', label: 'CRC' },
  unknown: { bg: 'bg-slate-100', text: 'text-slate-600', label: 'Desconhecido' },
};

// ---------- MAIN COMPONENT ----------

export function PixDecoderTool({ locale = 'pt-br', initialTab = 'generate' }: PixDecoderToolProps) {
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Generate state
  const [genKeyType, setGenKeyType] = useState<PixKeyType>('cpf');
  const [genKey, setGenKey] = useState('');
  const [genName, setGenName] = useState('Fulano da Silva');
  const [genCity, setGenCity] = useState('SAO PAULO');
  const [genAmount, setGenAmount] = useState('');
  const [genTxid, setGenTxid] = useState('');
  const [genInfo, setGenInfo] = useState('');
  const [genResult, setGenResult] = useState<PixGeneratorResult | null>(null);

  // Validate/Decode state
  const [inputPayload, setInputPayload] = useState('');
  const [validationResult, setValidationResult] = useState<PixValidationResult | null>(null);

  // QR state
  const [qrSize, setQrSize] = useState(256);
  const [qrColor, setQrColor] = useState('#000000');
  const [qrBg, setQrBg] = useState('#ffffff');
  const qrCanvasRef = useRef<HTMLDivElement>(null);

  const copyToClipboard = useCallback((text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    });
  }, []);

  const downloadFile = useCallback((content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  // Auto-validate when payload changes
  useEffect(() => {
    if (inputPayload.trim()) {
      setValidationResult(validatePixPayload(inputPayload));
    } else {
      setValidationResult(null);
    }
  }, [inputPayload]);

  // Generate handler
  const handleGenerate = useCallback(() => {
    const input: PixGeneratorInput = {
      keyType: genKeyType,
      key: formatKeyForPayload(genKeyType, genKey),
      merchantName: genName,
      merchantCity: genCity,
      amount: genAmount || undefined,
      txid: genTxid || undefined,
      additionalInfo: genInfo || undefined,
    };
    const result = buildPixPayload(input);
    setGenResult(result);
    // Also set as input for other tabs
    if (result.payload) {
      setInputPayload(result.payload);
    }
  }, [genKeyType, genKey, genName, genCity, genAmount, genTxid, genInfo]);

  const handleReset = useCallback(() => {
    setGenKey('');
    setGenName('');
    setGenCity('');
    setGenAmount('');
    setGenTxid('');
    setGenInfo('');
    setGenResult(null);
    setInputPayload('');
    setValidationResult(null);
  }, []);

  const loadExample = useCallback((payload: string) => {
    setInputPayload(payload);
    setActiveTab('validate');
  }, []);

  const activePayload = genResult?.payload ?? inputPayload;
  const activeValidation = validationResult;

  const tabs: { key: Tab; label: string }[] = [
    { key: 'generate', label: t('tabGenerate', locale) },
    { key: 'validate', label: t('tabValidate', locale) },
    { key: 'decoder', label: t('tabDecoder', locale) },
    { key: 'tree', label: t('tabTree', locale) },
    { key: 'qrcode', label: t('tabQr', locale) },
    { key: 'crc', label: t('tabCrc', locale) },
    { key: 'export', label: t('tabExport', locale) },
  ];

  return (
    <Card className="space-y-6">
      {/* Tab bar */}
      <div className="flex flex-wrap gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB: Generate */}
      {activeTab === 'generate' && (
        <GenerateTab
          locale={locale}
          genKeyType={genKeyType}
          setGenKeyType={setGenKeyType}
          genKey={genKey}
          setGenKey={setGenKey}
          genName={genName}
          setGenName={setGenName}
          genCity={genCity}
          setGenCity={setGenCity}
          genAmount={genAmount}
          setGenAmount={setGenAmount}
          genTxid={genTxid}
          setGenTxid={setGenTxid}
          genInfo={genInfo}
          setGenInfo={setGenInfo}
          genResult={genResult}
          onGenerate={handleGenerate}
          onReset={handleReset}
          copyToClipboard={copyToClipboard}
          copiedKey={copiedKey}
        />
      )}

      {/* TAB: Validate */}
      {activeTab === 'validate' && (
        <ValidateTab
          locale={locale}
          inputPayload={inputPayload}
          setInputPayload={setInputPayload}
          validationResult={activeValidation}
          loadExample={loadExample}
          copyToClipboard={copyToClipboard}
          copiedKey={copiedKey}
        />
      )}

      {/* TAB: Decoder */}
      {activeTab === 'decoder' && (
        <DecoderTab
          locale={locale}
          payload={activePayload}
          validation={activeValidation}
          copyToClipboard={copyToClipboard}
          copiedKey={copiedKey}
        />
      )}

      {/* TAB: Tree */}
      {activeTab === 'tree' && (
        <TreeTab
          locale={locale}
          validation={activeValidation}
          copyToClipboard={copyToClipboard}
          copiedKey={copiedKey}
        />
      )}

      {/* TAB: QR Code */}
      {activeTab === 'qrcode' && (
        <QrCodeTab
          locale={locale}
          payload={activePayload}
          qrSize={qrSize}
          setQrSize={setQrSize}
          qrColor={qrColor}
          setQrColor={setQrColor}
          qrBg={qrBg}
          setQrBg={setQrBg}
          qrCanvasRef={qrCanvasRef}
          copyToClipboard={copyToClipboard}
          copiedKey={copiedKey}
        />
      )}

      {/* TAB: CRC */}
      {activeTab === 'crc' && (
        <CrcTab
          locale={locale}
          payload={activePayload}
          setInputPayload={setInputPayload}
          copyToClipboard={copyToClipboard}
          copiedKey={copiedKey}
        />
      )}

      {/* TAB: Export */}
      {activeTab === 'export' && (
        <ExportTab
          locale={locale}
          payload={activePayload}
          validation={activeValidation}
          copyToClipboard={copyToClipboard}
          copiedKey={copiedKey}
          downloadFile={downloadFile}
        />
      )}

      {/* Privacy & Security */}
      <div className="space-y-1">
        <p className="text-xs text-slate-500">{t('privacy', locale)}</p>
        <p className="text-xs text-amber-600">{t('securityWarning', locale)}</p>
      </div>
    </Card>
  );
}

// ---------- GENERATE TAB ----------

function GenerateTab({ locale, genKeyType, setGenKeyType, genKey, setGenKey, genName, setGenName, genCity, setGenCity, genAmount, setGenAmount, genTxid, setGenTxid, genInfo, setGenInfo, genResult, onGenerate, onReset, copyToClipboard, copiedKey }: Readonly<{
  locale: AppLocale;
  genKeyType: PixKeyType;
  setGenKeyType: (v: PixKeyType) => void;
  genKey: string;
  setGenKey: (v: string) => void;
  genName: string;
  setGenName: (v: string) => void;
  genCity: string;
  setGenCity: (v: string) => void;
  genAmount: string;
  setGenAmount: (v: string) => void;
  genTxid: string;
  setGenTxid: (v: string) => void;
  genInfo: string;
  setGenInfo: (v: string) => void;
  genResult: PixGeneratorResult | null;
  onGenerate: () => void;
  onReset: () => void;
  copyToClipboard: (text: string, key: string) => void;
  copiedKey: string | null;
}>) {
  const keyTypes: { value: PixKeyType; label: string }[] = [
    { value: 'cpf', label: t('cpf', locale) },
    { value: 'cnpj', label: t('cnpj', locale) },
    { value: 'email', label: t('email', locale) },
    { value: 'phone', label: t('phone', locale) },
    { value: 'random', label: t('random', locale) },
    { value: 'manual', label: t('manual', locale) },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-800">{t('keyType', locale)}</label>
          <div className="flex flex-wrap gap-1.5">
            {keyTypes.map((kt) => (
              <button
                key={kt.value}
                type="button"
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  genKeyType === kt.value
                    ? 'bg-brand-600 text-white'
                    : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
                onClick={() => setGenKeyType(kt.value)}
              >
                {kt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-800">{t('key', locale)}</label>
          <Input
            value={genKey}
            onChange={(e) => setGenKey(e.target.value)}
            placeholder={genKeyType === 'cpf' ? '000.000.000-00' : genKeyType === 'email' ? 'exemplo@email.com' : genKeyType === 'phone' ? '+5511999999999' : ''}
            className="font-mono text-sm"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-800">{t('name', locale)} <span className="text-slate-400 font-normal">(máx 25)</span></label>
          <Input value={genName} onChange={(e) => setGenName(e.target.value)} maxLength={25} className="text-sm" />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-800">{t('city', locale)} <span className="text-slate-400 font-normal">(máx 15)</span></label>
          <Input value={genCity} onChange={(e) => setGenCity(e.target.value)} maxLength={15} className="text-sm" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-800">{t('amount', locale)}</label>
            <Input value={genAmount} onChange={(e) => setGenAmount(e.target.value)} placeholder="0.00" className="font-mono text-sm" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-800">{t('txid', locale)}</label>
            <Input value={genTxid} onChange={(e) => setGenTxid(e.target.value)} maxLength={25} className="font-mono text-sm" />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-800">{t('additionalInfo', locale)}</label>
          <Input value={genInfo} onChange={(e) => setGenInfo(e.target.value)} className="text-sm" />
        </div>

        <div className="flex gap-2 pt-2">
          <Button onClick={onGenerate}>{t('generate', locale)}</Button>
          <Button variant="ghost" onClick={onReset}>{t('reset', locale)}</Button>
        </div>

        {genResult && genResult.issues.length > 0 && (
          <div className="space-y-1">
            {genResult.issues.map((issue, idx) => (
              <p key={idx} className={`text-xs ${issue.level === 'error' ? 'text-red-600' : 'text-amber-600'}`}>
                {issue.level === 'error' ? '❌' : '⚠️'} {issue.message}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Result */}
      <div>
        {genResult?.payload ? (
          <section className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {t('payload', locale)}
            </h3>
            <div className="break-all rounded-lg border border-slate-200 bg-white p-3 font-mono text-xs text-slate-900">
              {genResult.payload}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button className="h-8 px-3 text-xs" onClick={() => copyToClipboard(genResult.payload, 'gen-payload')}>
                {copiedKey === 'gen-payload' ? '✓ ' + t('copied', locale) : '📋 ' + t('copy', locale)}
              </Button>
            </div>
            <div className="border-t border-slate-200 pt-3">
              <PixDataSummary pixData={genResult.pixData} locale={locale} />
            </div>
          </section>
        ) : (
          <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-slate-200 text-sm text-slate-400">
            {locale === 'en' ? 'Fill the form and click Generate' : locale === 'es' ? 'Complete el formulario y haga clic en Generar' : 'Preencha o formulário e clique em Gerar'}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- VALIDATE TAB ----------

function ValidateTab({ locale, inputPayload, setInputPayload, validationResult, loadExample, copyToClipboard, copiedKey }: Readonly<{
  locale: AppLocale;
  inputPayload: string;
  setInputPayload: (v: string) => void;
  validationResult: PixValidationResult | null;
  loadExample: (payload: string) => void;
  copyToClipboard: (text: string, key: string) => void;
  copiedKey: string | null;
}>) {
  const examples = useMemo(() => getPixExamples(), []);

  const statusBadge = useMemo(() => {
    if (!validationResult) return null;
    const statusMap: Record<string, { color: string; label: string }> = {
      valid: { color: 'bg-green-100 text-green-800', label: t('valid', locale) },
      'valid-warnings': { color: 'bg-yellow-100 text-yellow-800', label: t('validWarnings', locale) },
      invalid: { color: 'bg-red-100 text-red-800', label: t('invalid', locale) },
      'crc-invalid': { color: 'bg-red-100 text-red-800', label: t('crcInvalid', locale) },
      'not-pix': { color: 'bg-slate-100 text-slate-800', label: t('notPix', locale) },
    };
    const s = statusMap[validationResult.status];
    return s ? <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${s.color}`}>{s.label}</span> : null;
  }, [validationResult, locale]);

  const typeBadge = useMemo(() => {
    if (!validationResult) return null;
    const typeMap: Record<string, string> = {
      static: t('static', locale),
      dynamic: t('dynamic', locale),
      unknown: t('unknown', locale),
    };
    return <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">{typeMap[validationResult.type]}</span>;
  }, [validationResult, locale]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Textarea
          value={inputPayload}
          onChange={(e) => setInputPayload(e.target.value)}
          placeholder={t('pastePayload', locale)}
          className="min-h-[100px] font-mono text-xs"
          rows={4}
        />
        <div className="flex flex-wrap items-center gap-2">
          {statusBadge}
          {typeBadge}
        </div>

        {/* Examples */}
        <details>
          <summary className="cursor-pointer text-xs font-medium text-slate-500">{t('examples', locale)}</summary>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {Object.entries(examples).map(([key, ex]) => (
              <button
                key={key}
                type="button"
                className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-100"
                onClick={() => loadExample(ex.payload)}
                title={ex.description}
              >
                {ex.label}
              </button>
            ))}
          </div>
        </details>
      </div>

      {validationResult && (
        <>
          {/* Issues */}
          {validationResult.issues.length > 0 && (
            <section className="space-y-1 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
              {validationResult.issues.map((issue, idx) => (
                <p key={idx} className={`text-xs ${
                  issue.level === 'error' ? 'text-red-600' :
                  issue.level === 'warning' ? 'text-amber-600' : 'text-blue-600'
                }`}>
                  {issue.level === 'error' ? '❌' : issue.level === 'warning' ? '⚠️' : 'ℹ️'} {issue.message}
                </p>
              ))}
            </section>
          )}

          {/* Extracted Data */}
          <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <svg className="h-4 w-4 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              {t('pixData', locale)}
            </h3>
            <PixDataSummary pixData={validationResult.pixData} locale={locale} />
            <div>
              <Button className="h-8 px-3 text-xs" onClick={() => copyToClipboard(inputPayload, 'validate-payload')}>
                {copiedKey === 'validate-payload' ? '✓ ' + t('copied', locale) : '📋 ' + t('copy', locale)}
              </Button>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

// ---------- DECODER TAB ----------

function DecoderTab({ locale, payload, validation, copyToClipboard, copiedKey }: Readonly<{
  locale: AppLocale;
  payload: string;
  validation: PixValidationResult | null;
  copyToClipboard: (text: string, key: string) => void;
  copiedKey: string | null;
}>) {
  const fields = useMemo(() => {
    if (validation) return validation.fields;
    if (payload.trim()) return parseEmvFields(payload.trim());
    return [];
  }, [payload, validation]);

  const [selectedField, setSelectedField] = useState<EmvField | null>(null);

  if (!payload.trim()) {
    return (
      <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-slate-200 text-sm text-slate-400">
        {locale === 'en' ? 'Enter a payload in the Validate tab first' : locale === 'es' ? 'Ingrese un payload en la pestaña Validar primero' : 'Insira um payload na aba Validar primeiro'}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(CATEGORY_COLORS).map(([key, val]) => (
          <span key={key} className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-medium ${val.bg} ${val.text}`}>
            {val.label}
          </span>
        ))}
      </div>

      {/* Color-coded payload */}
      <section className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
        <div className="flex flex-wrap gap-0.5 font-mono text-xs leading-relaxed">
          {fields.map((field, idx) => {
            const cat = CATEGORY_COLORS[field.category] ?? CATEGORY_COLORS.unknown;
            return (
              <button
                key={idx}
                type="button"
                className={`cursor-pointer rounded px-1 py-0.5 transition-all hover:ring-2 hover:ring-brand-600 ${cat.bg} ${cat.text} ${
                  selectedField === field ? 'ring-2 ring-brand-600' : ''
                }`}
                onClick={() => setSelectedField(field === selectedField ? null : field)}
                title={`${field.id}: ${field.name}`}
              >
                <span className="opacity-60">{field.id}</span>
                <span className="opacity-40">{field.length.toString().padStart(2, '0')}</span>
                <span>{field.value.length > 30 ? `${field.value.slice(0, 30)}…` : field.value}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Selected field details */}
      {selectedField && (
        <section className="space-y-2 rounded-xl border border-brand-200 bg-brand-50/30 p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-900">{selectedField.name}</h4>
            <span className={`rounded px-2 py-0.5 text-[10px] font-medium ${CATEGORY_COLORS[selectedField.category]?.bg} ${CATEGORY_COLORS[selectedField.category]?.text}`}>
              {selectedField.category}
            </span>
          </div>
          <p className="text-xs text-slate-600">{selectedField.description}</p>
          <div className="grid grid-cols-3 gap-2 text-xs text-slate-700">
            <div><span className="text-slate-500">ID:</span> <code>{selectedField.id}</code></div>
            <div><span className="text-slate-500">Tam:</span> <code>{selectedField.length}</code></div>
            <div><span className="text-slate-500">{selectedField.required ? '✓ Obrigatório' : '○ Opcional'}</span></div>
          </div>
          <div className="break-all rounded-lg border border-slate-200 bg-white p-2 font-mono text-xs text-slate-900">
            {selectedField.value}
          </div>
          {selectedField.children && selectedField.children.length > 0 && (
            <div className="mt-2 space-y-1 border-l-2 border-slate-200 pl-3">
              {selectedField.children.map((child, ci) => (
                <div key={ci} className="text-xs">
                  <span className="font-medium text-slate-700">{child.id} {child.name}:</span>{' '}
                  <code className="text-slate-900">{child.value}</code>
                </div>
              ))}
            </div>
          )}
          <Button className="h-7 px-2 text-[11px]" variant="ghost" onClick={() => copyToClipboard(selectedField.value, `field-${selectedField.id}`)}>
            {copiedKey === `field-${selectedField.id}` ? '✓' : t('copy', locale)}
          </Button>
        </section>
      )}
    </div>
  );
}

// ---------- TREE TAB ----------

function TreeTab({ locale, validation, copyToClipboard, copiedKey }: Readonly<{
  locale: AppLocale;
  validation: PixValidationResult | null;
  copyToClipboard: (text: string, key: string) => void;
  copiedKey: string | null;
}>) {
  const fields = validation?.fields ?? [];

  if (fields.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-slate-200 text-sm text-slate-400">
        {locale === 'en' ? 'No fields to display' : locale === 'es' ? 'Sin campos para mostrar' : 'Nenhum campo para exibir'}
      </div>
    );
  }

  return (
    <section className="space-y-1 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
      {fields.map((field, idx) => (
        <TreeNode key={idx} field={field} depth={0} copyToClipboard={copyToClipboard} copiedKey={copiedKey} locale={locale} />
      ))}
    </section>
  );
}

function TreeNode({ field, depth, copyToClipboard, copiedKey, locale }: Readonly<{
  field: EmvField;
  depth: number;
  copyToClipboard: (text: string, key: string) => void;
  copiedKey: string | null;
  locale: AppLocale;
}>) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = field.children && field.children.length > 0;
  const cat = CATEGORY_COLORS[field.category] ?? CATEGORY_COLORS.unknown;
  const indent = depth * 16;
  const copyKey = `tree-${field.id}-${field.offset}`;

  return (
    <div style={{ marginLeft: `${indent}px` }}>
      <div className="group flex items-center gap-1.5 rounded px-1.5 py-0.5 hover:bg-slate-100">
        {hasChildren ? (
          <button type="button" className="text-xs text-slate-400" onClick={() => setExpanded(!expanded)}>
            {expanded ? '▼' : '▶'}
          </button>
        ) : (
          <span className="w-3" />
        )}
        <span className={`rounded px-1 py-0.5 text-[10px] font-mono font-bold ${cat.bg} ${cat.text}`}>
          {field.id}
        </span>
        <span className="text-xs font-medium text-slate-700">{field.name}</span>
        {!hasChildren && (
          <code className="ml-1 truncate text-xs text-slate-500">{field.value.length > 40 ? `${field.value.slice(0, 40)}…` : field.value}</code>
        )}
        <button
          type="button"
          className="ml-auto hidden text-[10px] text-slate-400 hover:text-slate-700 group-hover:inline"
          onClick={() => copyToClipboard(field.value, copyKey)}
        >
          {copiedKey === copyKey ? '✓' : '⎘'}
        </button>
      </div>
      {hasChildren && expanded && field.children?.map((child, ci) => (
        <TreeNode key={ci} field={child} depth={depth + 1} copyToClipboard={copyToClipboard} copiedKey={copiedKey} locale={locale} />
      ))}
    </div>
  );
}

// ---------- QR CODE TAB ----------

function QrCodeTab({ locale, payload, qrSize, setQrSize, qrColor, setQrColor, qrBg, setQrBg, qrCanvasRef, copyToClipboard, copiedKey }: Readonly<{
  locale: AppLocale;
  payload: string;
  qrSize: number;
  setQrSize: (v: number) => void;
  qrColor: string;
  setQrColor: (v: string) => void;
  qrBg: string;
  setQrBg: (v: string) => void;
  qrCanvasRef: React.RefObject<HTMLDivElement | null>;
  copyToClipboard: (text: string, key: string) => void;
  copiedKey: string | null;
}>) {
  const [qrLib, setQrLib] = useState<typeof import('qr-code-styling') | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const qrInstanceRef = useRef<any>(null);

  // Dynamic import of qr-code-styling
  useEffect(() => {
    import('qr-code-styling').then((mod) => setQrLib(mod));
  }, []);

  // Render QR
  useEffect(() => {
    if (!qrLib || !payload.trim() || !qrCanvasRef.current) return;

    const QRCodeStyling = qrLib.default;
    const container = qrCanvasRef.current;

    // Clear previous
    container.innerHTML = '';

    const qr = new QRCodeStyling({
      width: qrSize,
      height: qrSize,
      data: payload,
      dotsOptions: { color: qrColor, type: 'square' },
      backgroundOptions: { color: qrBg },
      cornersSquareOptions: { color: qrColor },
      cornersDotOptions: { color: qrColor },
      qrOptions: { errorCorrectionLevel: 'M' },
    });

    qr.append(container);
    qrInstanceRef.current = qr;
  }, [qrLib, payload, qrSize, qrColor, qrBg, qrCanvasRef]);

  const handleDownloadPng = useCallback(() => {
    qrInstanceRef.current?.download({ extension: 'png', name: 'pix-qrcode' });
  }, []);

  const handleDownloadSvg = useCallback(() => {
    qrInstanceRef.current?.download({ extension: 'svg', name: 'pix-qrcode' });
  }, []);

  if (!payload.trim()) {
    return (
      <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-slate-200 text-sm text-slate-400">
        {locale === 'en' ? 'Generate or validate a payload first' : locale === 'es' ? 'Genere o valide un payload primero' : 'Gere ou valide um payload primeiro'}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Controls */}
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-800">{t('qrSize', locale)}: {qrSize}px</label>
          <input type="range" min={128} max={512} step={32} value={qrSize} onChange={(e) => setQrSize(Number(e.target.value))} className="w-full" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-800">{t('qrColor', locale)}</label>
            <input type="color" value={qrColor} onChange={(e) => setQrColor(e.target.value)} className="h-9 w-full cursor-pointer rounded-lg border border-slate-200" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-800">{t('qrBg', locale)}</label>
            <input type="color" value={qrBg} onChange={(e) => setQrBg(e.target.value)} className="h-9 w-full cursor-pointer rounded-lg border border-slate-200" />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          <Button className="h-8 px-3 text-xs" onClick={handleDownloadPng}>{t('downloadPng', locale)}</Button>
          <Button className="h-8 px-3 text-xs" variant="secondary" onClick={handleDownloadSvg}>{t('downloadSvg', locale)}</Button>
          <Button className="h-8 px-3 text-xs" variant="ghost" onClick={() => copyToClipboard(payload, 'qr-payload')}>
            {copiedKey === 'qr-payload' ? t('copied', locale) : `${t('copy', locale)} payload`}
          </Button>
        </div>
      </div>

      {/* QR Preview */}
      <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50/80 p-6">
        <div ref={qrCanvasRef as React.RefObject<HTMLDivElement>} className="flex items-center justify-center" />
      </div>
    </div>
  );
}

// ---------- CRC TAB ----------

function CrcTab({ locale, payload, setInputPayload, copyToClipboard, copiedKey }: Readonly<{
  locale: AppLocale;
  payload: string;
  setInputPayload: (v: string) => void;
  copyToClipboard: (text: string, key: string) => void;
  copiedKey: string | null;
}>) {
  const crcResult = useMemo(() => {
    if (!payload.trim()) return null;
    return verifyCrc(payload.trim());
  }, [payload]);

  const fixedPayload = useMemo(() => {
    if (!payload.trim()) return '';
    return fixCrc(payload.trim());
  }, [payload]);

  if (!payload.trim()) {
    return (
      <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-slate-200 text-sm text-slate-400">
        {locale === 'en' ? 'Enter a payload first' : locale === 'es' ? 'Ingrese un payload primero' : 'Insira um payload primeiro'}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3">
          <p className="text-[10px] font-medium text-slate-500">{t('crcOriginal', locale)}</p>
          <p className="font-mono text-lg font-bold text-slate-900">{crcResult?.provided || '—'}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3">
          <p className="text-[10px] font-medium text-slate-500">{t('crcCalculated', locale)}</p>
          <p className="font-mono text-lg font-bold text-slate-900">{crcResult?.calculated || '—'}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3">
          <p className="text-[10px] font-medium text-slate-500">{t('crcStatus', locale)}</p>
          <p className={`text-lg font-bold ${crcResult?.valid ? 'text-green-600' : 'text-red-600'}`}>
            {crcResult?.valid ? '✓' : '✗'} {crcResult?.valid ? t('valid', locale) : t('crcInvalid', locale)}
          </p>
        </div>
      </div>

      {crcResult && !crcResult.valid && (
        <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
          <h4 className="text-sm font-semibold text-slate-800">{t('fixedPayload', locale)}</h4>
          <div className="break-all rounded-lg border border-green-200 bg-green-50 p-3 font-mono text-xs text-green-900">
            {fixedPayload}
          </div>
          <div className="flex gap-2">
            <Button className="h-8 px-3 text-xs" onClick={() => copyToClipboard(fixedPayload, 'fixed-payload')}>
              {copiedKey === 'fixed-payload' ? '✓ ' + t('copied', locale) : '📋 ' + t('copy', locale)}
            </Button>
            <Button className="h-8 px-3 text-xs" variant="ghost" onClick={() => setInputPayload(fixedPayload)}>
              {locale === 'en' ? 'Use fixed' : locale === 'es' ? 'Usar corregido' : 'Usar corrigido'}
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}

// ---------- EXPORT TAB ----------

function ExportTab({ locale, payload, validation, copyToClipboard, copiedKey, downloadFile }: Readonly<{
  locale: AppLocale;
  payload: string;
  validation: PixValidationResult | null;
  copyToClipboard: (text: string, key: string) => void;
  copiedKey: string | null;
  downloadFile: (content: string, filename: string, type: string) => void;
}>) {
  const jsonContent = useMemo(() => {
    if (!validation) return '';
    return pixToJson(validation);
  }, [validation]);

  const csvContent = useMemo(() => {
    if (!validation) return '';
    return pixToCsv(validation.pixData);
  }, [validation]);

  if (!payload.trim()) {
    return (
      <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-slate-200 text-sm text-slate-400">
        {locale === 'en' ? 'No data to export' : locale === 'es' ? 'Sin datos para exportar' : 'Nenhum dado para exportar'}
      </div>
    );
  }

  return (
    <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
      <Button className="h-9 text-xs" variant="secondary" onClick={() => copyToClipboard(payload, 'export-payload')}>
        {copiedKey === 'export-payload' ? '✓' : '📋'} {t('copy', locale)} Payload
      </Button>
      <Button className="h-9 text-xs" variant="secondary" onClick={() => downloadFile(payload, 'pix-payload.txt', 'text/plain')}>
        📄 {t('exportTxt', locale)}
      </Button>
      <Button className="h-9 text-xs" variant="secondary" onClick={() => { copyToClipboard(jsonContent, 'export-json'); }}>
        {copiedKey === 'export-json' ? '✓' : '📋'} {t('copy', locale)} JSON
      </Button>
      <Button className="h-9 text-xs" variant="secondary" onClick={() => downloadFile(jsonContent, 'pix-data.json', 'application/json')}>
        📄 {t('exportJson', locale)}
      </Button>
      <Button className="h-9 text-xs" variant="secondary" onClick={() => downloadFile(csvContent, 'pix-data.csv', 'text/csv')}>
        📄 {t('exportCsv', locale)}
      </Button>
    </div>
  );
}

// ---------- PIX DATA SUMMARY ----------

function PixDataSummary({ pixData, locale }: Readonly<{ pixData: PixData; locale: AppLocale }>) {
  const rows = useMemo(() => {
    const typeLabel = pixData.type === 'static' ? t('static', locale) :
                      pixData.type === 'dynamic' ? t('dynamic', locale) : t('unknown', locale);
    const items: Array<{ label: string; value: string | null }> = [
      { label: locale === 'en' ? 'Type' : locale === 'es' ? 'Tipo' : 'Tipo', value: typeLabel },
      { label: t('key', locale), value: pixData.key },
      { label: t('keyType', locale), value: pixData.keyType },
      { label: t('amount', locale), value: pixData.amount ? `R$ ${pixData.amount}` : null },
      { label: t('name', locale), value: pixData.merchantName },
      { label: t('city', locale), value: pixData.merchantCity },
      { label: locale === 'en' ? 'Country' : locale === 'es' ? 'País' : 'País', value: pixData.countryCode },
      { label: locale === 'en' ? 'Currency' : locale === 'es' ? 'Moneda' : 'Moeda', value: pixData.currency },
      { label: 'TXID', value: pixData.txid },
      { label: t('additionalInfo', locale), value: pixData.additionalInfo },
      { label: 'URL', value: pixData.url },
      { label: 'MCC', value: pixData.merchantCategoryCode },
      { label: 'CRC', value: pixData.crcProvided ? `${pixData.crcProvided} ${pixData.crcValid ? '✓' : '✗'}` : null },
    ];
    return items.filter((item) => item.value);
  }, [pixData, locale]);

  return (
    <div className="space-y-1">
      {rows.map((row) => (
        <div key={row.label} className="flex justify-between text-xs">
          <span className="text-slate-500">{row.label}</span>
          <span className="font-mono text-slate-800">{row.value}</span>
        </div>
      ))}
    </div>
  );
}


