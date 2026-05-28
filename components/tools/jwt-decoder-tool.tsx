'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import type { AppLocale } from '@/lib/i18n/config';
import { decodeJwtToken } from '@/lib/jwt-decoder';

type JwtDecoderToolProps = Readonly<{
  locale?: AppLocale;
}>;

type JwtUi = {
  inputLabel: string;
  inputPlaceholder: string;
  decode: string;
  clear: string;
  loadExample: string;
  copyToken: string;
  copyHeader: string;
  copyPayload: string;
  copyPayloadClean: string;
  copied: string;
  resultHeader: string;
  resultPayload: string;
  resultSignature: string;
  warningsTitle: string;
  claimsTitle: string;
  expired: string;
  valid: string;
  wrapToken: string;
  singleLine: string;
  localOnlyTitle: string;
  localOnlyText: string;
  noClaims: string;
};

const uiByLocale: Record<AppLocale, JwtUi> = {
  'pt-br': {
    inputLabel: 'Token JWT',
    inputPlaceholder: 'Cole o JWT aqui...',
    decode: 'Decodificar',
    clear: 'Limpar',
    loadExample: 'Carregar exemplo',
    copyToken: 'Copiar token',
    copyHeader: 'Copiar header',
    copyPayload: 'Copiar payload',
    copyPayloadClean: 'Copiar payload limpo',
    copied: 'Copiado',
    resultHeader: 'Header (JSON)',
    resultPayload: 'Payload (JSON)',
    resultSignature: 'Signature',
    warningsTitle: 'Avisos importantes',
    claimsTitle: 'Claims comuns',
    expired: 'Token expirado',
    valid: 'Token ainda valido',
    wrapToken: 'Mostrar com quebra de linha',
    singleLine: 'Mostrar em linha unica',
    localOnlyTitle: 'Importante',
    localOnlyText: 'Esta ferramenta apenas decodifica o JWT. Ela NAO valida assinatura e NAO garante autenticidade do token.',
    noClaims: 'Nenhuma claim comum encontrada.',
  },
  en: {
    inputLabel: 'JWT token',
    inputPlaceholder: 'Paste your JWT here...',
    decode: 'Decode',
    clear: 'Clear',
    loadExample: 'Load example',
    copyToken: 'Copy token',
    copyHeader: 'Copy header',
    copyPayload: 'Copy payload',
    copyPayloadClean: 'Copy clean payload',
    copied: 'Copied',
    resultHeader: 'Header (JSON)',
    resultPayload: 'Payload (JSON)',
    resultSignature: 'Signature',
    warningsTitle: 'Important warnings',
    claimsTitle: 'Common claims',
    expired: 'Token expired',
    valid: 'Token still valid',
    wrapToken: 'Wrap token line',
    singleLine: 'Single line token',
    localOnlyTitle: 'Important',
    localOnlyText: 'This tool only decodes JWT. It does NOT verify signature and does NOT guarantee token authenticity.',
    noClaims: 'No common claims found.',
  },
  es: {
    inputLabel: 'Token JWT',
    inputPlaceholder: 'Pega tu JWT aqui...',
    decode: 'Decodificar',
    clear: 'Limpiar',
    loadExample: 'Cargar ejemplo',
    copyToken: 'Copiar token',
    copyHeader: 'Copiar header',
    copyPayload: 'Copiar payload',
    copyPayloadClean: 'Copiar payload limpio',
    copied: 'Copiado',
    resultHeader: 'Header (JSON)',
    resultPayload: 'Payload (JSON)',
    resultSignature: 'Signature',
    warningsTitle: 'Avisos importantes',
    claimsTitle: 'Claims comunes',
    expired: 'Token expirado',
    valid: 'Token aun valido',
    wrapToken: 'Mostrar con saltos de linea',
    singleLine: 'Mostrar en una sola linea',
    localOnlyTitle: 'Importante',
    localOnlyText: 'Esta herramienta solo decodifica JWT. NO valida firma y NO garantiza autenticidad del token.',
    noClaims: 'No se encontraron claims comunes.',
  },
};

const toBase64Url = (value: string): string =>
  btoa(value)
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '');

const exampleToken = (): string => {
  const header = toBase64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = toBase64Url(
    JSON.stringify({
      sub: 'user-123',
      iss: 'adtools-local',
      aud: 'web',
      role: 'admin',
      iat: 1710000000,
      exp: 1893456000,
    }),
  );

  return `${header}.${payload}.signature-placeholder`;
};

export function JwtDecoderTool({ locale = 'pt-br' }: JwtDecoderToolProps) {
  const ui = uiByLocale[locale];
  const [token, setToken] = useState('');
  const [copiedKey, setCopiedKey] = useState('');
  const [wrapMode, setWrapMode] = useState(true);

  const decoded = useMemo(() => decodeJwtToken(token), [token]);

  const copyValue = async (key: string, value: string) => {
    if (!value.trim()) {
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(''), 1400);
    } catch {
      setCopiedKey('');
    }
  };

  const hasError = decoded.errors.length > 0;
  const wrapVariant = wrapMode ? 'secondary' : 'ghost';
  const singleLineVariant = wrapMode ? 'ghost' : 'secondary';
  const expirationToneClass = decoded.expiration?.expired
    ? 'border border-red-200 bg-red-50 text-red-700'
    : 'border border-emerald-200 bg-emerald-50 text-emerald-700';
  const expirationLabel = decoded.expiration?.expired ? ui.expired : ui.valid;

  return (
    <Card className="space-y-5">
      <section className="rounded-xl border border-red-200 bg-red-50 p-4">
        <h3 className="text-sm font-semibold text-red-900">{ui.localOnlyTitle}</h3>
        <p className="mt-1 text-sm text-red-800">{ui.localOnlyText}</p>
      </section>

      <label className="space-y-2">
        <span className="text-sm font-semibold text-slate-800">{ui.inputLabel}</span>
        <Textarea
          value={token}
          onChange={(event) => setToken(event.target.value)}
          placeholder={ui.inputPlaceholder}
          className="min-h-[150px] font-mono text-xs"
        />
      </label>

      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => setToken((current) => current.trim())}>{ui.decode}</Button>
        <Button variant="secondary" onClick={() => setToken(exampleToken())}>{ui.loadExample}</Button>
        <Button variant="secondary" onClick={() => copyValue('token', token)}>
          {copiedKey === 'token' ? ui.copied : ui.copyToken}
        </Button>
        <Button variant="ghost" onClick={() => setToken('')}>{ui.clear}</Button>
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        <Button
          variant={wrapVariant}
          onClick={() => setWrapMode(true)}
        >
          {ui.wrapToken}
        </Button>
        <Button
          variant={singleLineVariant}
          onClick={() => setWrapMode(false)}
        >
          {ui.singleLine}
        </Button>
      </div>

      {decoded.errors.length > 0 ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <ul className="space-y-1">
            {decoded.errors.map((error) => (
              <li key={error}>- {error}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {decoded.warnings.length > 0 ? (
        <section className="space-y-2 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <h3 className="text-sm font-semibold text-amber-900">{ui.warningsTitle}</h3>
          <ul className="space-y-1 text-sm text-amber-800">
            {decoded.warnings.map((warning) => (
              <li key={warning}>- {warning}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-800">{ui.resultHeader}</h3>
        <pre className="max-h-60 overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900">
          {decoded.headerJsonText || '{}'}
        </pre>
        <Button variant="secondary" onClick={() => copyValue('header', decoded.headerJsonText)}>
          {copiedKey === 'header' ? ui.copied : ui.copyHeader}
        </Button>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-800">{ui.resultPayload}</h3>
        <pre className="max-h-60 overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900">
          {decoded.payloadJsonText || '{}'}
        </pre>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => copyValue('payload', decoded.payloadJsonText)}>
            {copiedKey === 'payload' ? ui.copied : ui.copyPayload}
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              copyValue(
                'payload-clean',
                JSON.stringify(decoded.payloadObject ?? {}),
              )
            }
          >
            {copiedKey === 'payload-clean' ? ui.copied : ui.copyPayloadClean}
          </Button>
        </div>
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-slate-800">{ui.resultSignature}</h3>
        <pre
          className={`overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900 ${
            wrapMode ? 'whitespace-pre-wrap break-all' : 'whitespace-nowrap'
          }`}
        >
          {decoded.parts.signaturePart || '-'}
        </pre>
      </section>

      <section className="space-y-2 rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="text-sm font-semibold text-slate-800">{ui.claimsTitle}</h3>
        {decoded.commonClaims.length > 0 ? (
          <ul className="space-y-2 text-sm text-slate-700">
            {decoded.commonClaims.map((claim) => (
              <li key={claim.key}>
                <strong>{claim.key}</strong>: {claim.formattedValue}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500">{ui.noClaims}</p>
        )}

        {decoded.expiration ? (
          <p
            className={`rounded-lg px-3 py-2 text-sm ${expirationToneClass}`}
          >
            {expirationLabel}: {decoded.expiration.localText} ({decoded.expiration.isoUtc})
          </p>
        ) : null}
      </section>

      {hasError ? null : (
        <section className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
          {token}
        </section>
      )}
    </Card>
  );
}
