'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { parseUserAgent, formatIpNoDots, type DeviceInfo } from '@/lib/device-info';
import { type AppLocale } from '@/lib/i18n/config';

type Ui = {
  title: string;
  intro: string;
  discoverButton: string;
  clearButton: string;
  fetching: string;
  fetchError: string;
  ipLabel: string;
  providerLabel: string;
  locationLabel: string;
  deviceLabel: string;
  browserLabel: string;
  osLabel: string;
  latitudeLabel: string;
  longitudeLabel: string;
  copy: string;
  copied: string;
  copyError: string;
  copyNoDots: string;
  copyAll: string;
  processingNote: string;
};

const uiByLocale: Record<AppLocale, Ui> = {
  'pt-br': {
    title: 'Descobrir IP Público',
    intro: 'Veja seu IP público, provedor estimado e informações básicas do dispositivo.',
    discoverButton: 'Descobrir meu IP',
    clearButton: 'Limpar',
    fetching: 'Consultando...',
    fetchError: 'Nao foi possivel recuperar o IP agora. Tente novamente em instantes.',
    ipLabel: 'Endereço IP',
    providerLabel: 'Provedor (ISP)',
    locationLabel: 'Localização aproximada',
    deviceLabel: 'Dispositivo',
    browserLabel: 'Navegador',
    osLabel: 'Sistema operacional',
    latitudeLabel: 'Latitude',
    longitudeLabel: 'Longitude',
    copy: 'Copiar',
    copied: 'Copiado',
    copyError: 'Não foi possível copiar agora. Tente novamente.',
    copyNoDots: 'Copiar (sem pontos)',
    copyAll: 'Copiar tudo',
    processingNote:
      'A consulta é feita diretamente do seu navegador para um serviço público de informações de IP. Nenhum dado passa pelo nosso servidor.',
  },
  en: {
    title: 'Discover Public IP',
    intro: 'See your public IP, estimated provider and basic device information.',
    discoverButton: 'Discover my IP',
    clearButton: 'Clear',
    fetching: 'Querying...',
    fetchError: 'Could not retrieve your IP right now. Please try again shortly.',
    ipLabel: 'IP Address',
    providerLabel: 'Provider (ISP)',
    locationLabel: 'Approx. location',
    deviceLabel: 'Device',
    browserLabel: 'Browser',
    osLabel: 'Operating system',
    latitudeLabel: 'Latitude',
    longitudeLabel: 'Longitude',
    copy: 'Copy',
    copied: 'Copied',
    copyError: 'Could not copy right now. Try again.',
    copyNoDots: 'Copy (no dots)',
    copyAll: 'Copy all',
    processingNote:
      'The request is made directly from your browser to a public IP information service. No data is sent to our server.',
  },
  es: {
    title: 'Descubrir IP Público',
    intro: 'Vea su IP público, proveedor estimado e información básica del dispositivo.',
    discoverButton: 'Descubrir mi IP',
    clearButton: 'Limpiar',
    fetching: 'Consultando...',
    fetchError: 'No fue posible recuperar tu IP ahora. Intenta de nuevo en breve.',
    ipLabel: 'Dirección IP',
    providerLabel: 'Proveedor (ISP)',
    locationLabel: 'Ubicación aproximada',
    deviceLabel: 'Dispositivo',
    browserLabel: 'Navegador',
    osLabel: 'Sistema operativo',
    latitudeLabel: 'Latitud',
    longitudeLabel: 'Longitud',
    copy: 'Copiar',
    copied: 'Copiado',
    copyError: 'No fue posible copiar ahora. Intenta de nuevo.',
    copyNoDots: 'Copiar (sin puntos)',
    copyAll: 'Copiar todo',
    processingNote:
      'La consulta se realiza directamente desde tu navegador a un servicio público de información de IP. Ningún dato pasa por nuestro servidor.',
  },
};

type IpInfo = {
  ip?: string;
  city?: string;
  region?: string;
  country?: string;
  isp?: string;
  org?: string;
  latitude?: string | number;
  longitude?: string | number;
  [key: string]: string | number | undefined;
};

type IpDiscoveryToolProps = Readonly<{ locale?: AppLocale }>;

const IP_FETCH_TIMEOUT_MS = 7000;

const isValidIp = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0 && value !== '—';

const normalizeIpData = (data: Record<string, unknown>): IpInfo => {
  const ip = (data.ip ?? data.IP ?? data.query ?? data.address ?? '') as string;
  const city = (data.city ?? data.city_name ?? '') as string;
  const region = (data.region ?? data.regionName ?? data.region_name ?? '') as string;
  const country = (data.country ?? data.country_name ?? data.countryCode ?? '') as string;
  const isp = (data.isp ?? data.org ?? data.organization ?? data.asn_name ?? '') as string;
  const org = (data.org ?? data.organization ?? '') as string;
  const latitude = (data.latitude ?? data.lat ?? data.latitude_deg ?? '') as string | number;
  const longitude = (data.longitude ?? data.lon ?? data.longitude_deg ?? '') as string | number;

  return {
    ip,
    city,
    region,
    country,
    isp,
    org,
    latitude,
    longitude,
  };
};

async function fetchIpFrom(url: string): Promise<IpInfo> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), IP_FETCH_TIMEOUT_MS);

  try {
    const resp = await fetch(url, {
      method: 'GET',
      cache: 'no-store',
      signal: controller.signal,
    });

    if (!resp.ok) {
      throw new Error(`IP service failed: ${resp.status}`);
    }

    const raw = (await resp.json()) as Record<string, unknown>;
    const normalized = normalizeIpData(raw);

    if (!isValidIp(normalized.ip)) {
      throw new Error('IP missing in response');
    }

    return normalized;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

async function fetchIpOnlyFallback(): Promise<IpInfo> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), IP_FETCH_TIMEOUT_MS);

  try {
    const resp = await fetch('https://api.ipify.org?format=json', {
      method: 'GET',
      cache: 'no-store',
      signal: controller.signal,
    });

    if (!resp.ok) {
      throw new Error(`IP fallback failed: ${resp.status}`);
    }

    const raw = (await resp.json()) as Record<string, unknown>;
    const ip = raw.ip;

    if (!isValidIp(ip)) {
      throw new Error('IP missing in fallback response');
    }

    return { ip };
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export function IpDiscoveryTool({ locale = 'pt-br' }: IpDiscoveryToolProps) {
  const ui = uiByLocale[locale];

  const [loading, setLoading] = useState(true);
  const [ipInfo, setIpInfo] = useState<IpInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);

  useEffect(() => {
    setDeviceInfo(parseUserAgent(navigator.userAgent));
    fetchIp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchIp = async () => {
    setLoading(true);
    setError(null);

    try {
      const endpoints = ['https://ipwho.is/', 'https://ipapi.co/json/', 'https://ipwhois.app/json/'];
      let lastError: unknown;

      for (const endpoint of endpoints) {
        try {
          const info = await fetchIpFrom(endpoint);
          setIpInfo(info);
          return;
        } catch (endpointError) {
          lastError = endpointError;
        }
      }

      try {
        const ipOnly = await fetchIpOnlyFallback();
        setIpInfo(ipOnly);
        return;
      } catch (fallbackError) {
        throw fallbackError ?? lastError ?? new Error('No IP endpoint available');
      }
    } catch (err: unknown) {
      // eslint-disable-next-line no-console
      console.error('ip fetch error', err);
      setIpInfo(null);
      setError(ui.fetchError);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text?: string, key?: string) => {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(key ?? 'copied');
      setTimeout(() => setCopied(null), 1600);
    } catch {
      setError(ui.copyError);
    }
  };

  const renderValue = (value?: string | number) => (value ? String(value) : '—');

  return (
    <Card className="space-y-5">
      <header className="rounded-xl border border-brand-200 bg-gradient-to-r from-brand-50 to-indigo-50 p-4">
        <h3 className="text-lg font-semibold text-slate-900">{ui.title}</h3>
        <p className="mt-1 text-sm text-slate-700">{ui.intro}</p>
      </header>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Button onClick={fetchIp} disabled={loading}>
            {loading ? ui.fetching : ui.discoverButton}
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setIpInfo(null);
              setError(null);
              setLoading(false);
            }}
          >
            {ui.clearButton}
          </Button>
        </div>

        {error ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        ) : null}

        <section className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h4 className="text-sm font-semibold text-slate-800">{ui.ipLabel}</h4>
          <p className="font-mono text-sm text-slate-900">{loading ? ui.fetching : renderValue(ipInfo?.ip)}</p>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              onClick={() => handleCopy(renderValue(ipInfo?.ip), 'ip')}
              disabled={!ipInfo?.ip}
            >
              {copied === 'ip' ? ui.copied : ui.copy}
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleCopy(formatIpNoDots(ipInfo?.ip), 'ipNoDots')}
              disabled={!ipInfo?.ip}
            >
              {copied === 'ipNoDots' ? ui.copied : ui.copyNoDots}
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                handleCopy(
                  `IP: ${renderValue(ipInfo?.ip)}\nISP: ${renderValue(ipInfo?.isp)}\nLocal: ${renderValue(
                    ipInfo?.city,
                  )} ${renderValue(ipInfo?.region)} - ${renderValue(ipInfo?.country)}`,
                  'all',
                )
              }
              disabled={!ipInfo?.ip}
            >
              {copied === 'all' ? ui.copied : ui.copyAll}
            </Button>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-4">
            <h4 className="text-sm font-semibold text-slate-800">{ui.providerLabel}</h4>
            <p className="text-sm text-slate-900">{renderValue(ipInfo?.isp || ipInfo?.org)}</p>
          </div>

          <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-4">
            <h4 className="text-sm font-semibold text-slate-800">{ui.locationLabel}</h4>
            <p className="text-sm text-slate-900">
              {renderValue(ipInfo?.city)}, {renderValue(ipInfo?.region)} {renderValue(ipInfo?.country)}
            </p>
          </div>

          <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-4">
            <h4 className="text-sm font-semibold text-slate-800">{ui.deviceLabel}</h4>
            <p className="text-sm text-slate-900">{deviceInfo?.deviceType ?? '—'}</p>
          </div>

          <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-4">
            <h4 className="text-sm font-semibold text-slate-800">{ui.browserLabel}</h4>
            <p className="text-sm text-slate-900">{deviceInfo?.browser ?? '—'}</p>
            <p className="text-xs text-slate-500">{ui.osLabel}: {deviceInfo?.os ?? '—'}</p>
          </div>
        </section>

        <div className="flex gap-3">
          <div className="text-xs text-slate-600">{ui.processingNote}</div>
        </div>
      </div>
    </Card>
  );
}
