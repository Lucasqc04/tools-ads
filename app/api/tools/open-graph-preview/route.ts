import { NextResponse } from 'next/server';
import { extractOpenGraphData } from '@/lib/open-graph-preview';
import {
  fetchPublicUrl,
  PublicUrlFetchError,
} from '@/lib/safe-public-url-fetch';

export const runtime = 'nodejs';

const defaultHeaders = {
  'Cache-Control': 'no-store',
};

type ManifestEntry = {
  src?: string;
  url?: string;
  href?: string;
  type?: string;
  sizes?: string;
  purpose?: string;
};

const safeAbsoluteUrl = (candidate: string, baseUrl: string): string => {
  if (!candidate.trim()) {
    return '';
  }

  try {
    return new URL(candidate, baseUrl).toString();
  } catch {
    return '';
  }
};

const dedupeBy = <T,>(items: T[], getKey: (item: T) => string): T[] => {
  const seen = new Set<string>();
  const result: T[] = [];

  items.forEach((item) => {
    const key = getKey(item);
    if (!key || seen.has(key)) {
      return;
    }

    seen.add(key);
    result.push(item);
  });

  return result;
};

const fetchJson = async (url: string, signal: AbortSignal): Promise<object | null> => {
  try {
    const response = await fetchPublicUrl(new URL(url), {
      signal,
      userAgent: 'adtools-og-preview-bot/1.0 (+https://tools.lucasqc.com)',
      accept: 'application/json,text/plain,*/*',
      maxBytes: 1_000_000,
    });

    return JSON.parse(response.body.toString('utf8')) as object;
  } catch {
    return null;
  }
};

const getHeader = (headers: Record<string, string | string[] | undefined>, name: string): string => {
  const value = headers[name];
  return Array.isArray(value) ? value.join(', ') : value ?? '';
};

const isValidPublicUrl = (value: string): boolean => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const targetUrl = requestUrl.searchParams.get('url')?.trim() ?? '';

  if (!isValidPublicUrl(targetUrl)) {
    return NextResponse.json(
      {
        error: 'URL inválida. Use um endereço público com HTTP ou HTTPS.',
      },
      {
        status: 400,
        headers: defaultHeaders,
      },
    );
  }

  const startedAt = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetchPublicUrl(new URL(targetUrl), {
      signal: controller.signal,
      userAgent: 'adtools-og-preview-bot/1.0 (+https://tools.lucasqc.com)',
      accept: 'text/html,application/xhtml+xml',
      maxBytes: 2_000_000,
    });

    const data = extractOpenGraphData(response.body.toString('utf8'), response.url.toString());

    if (data.manifest) {
      const manifestPayload = await fetchJson(data.manifest, controller.signal);

      if (manifestPayload && typeof manifestPayload === 'object') {
        const manifestObject = manifestPayload as {
          icons?: ManifestEntry[];
          screenshots?: ManifestEntry[];
          shortcuts?: Array<{ url?: string; icons?: ManifestEntry[] }>;
        };

        const manifestIcons = (manifestObject.icons ?? [])
          .map((entry) => ({
            rel: 'manifest-icon',
            href: safeAbsoluteUrl(entry.src ?? entry.url ?? entry.href ?? '', data.manifest),
            type: entry.type ?? '',
            sizes: entry.sizes ?? '',
            media: '',
            color: '',
            purpose: entry.purpose ?? '',
          }))
          .filter((item) => Boolean(item.href));

        const manifestAssets = [
          ...(manifestObject.icons ?? []).map((entry) => ({
            url: safeAbsoluteUrl(entry.src ?? entry.url ?? entry.href ?? '', data.manifest),
            kind: 'icon' as const,
            source: 'manifest-icon',
            mimeHint: entry.type ?? '',
            sameOrigin: true,
          })),
          ...(manifestObject.screenshots ?? []).map((entry) => ({
            url: safeAbsoluteUrl(entry.src ?? entry.url ?? entry.href ?? '', data.manifest),
            kind: 'image' as const,
            source: 'manifest-screenshot',
            mimeHint: entry.type ?? 'image/*',
            sameOrigin: true,
          })),
          ...(manifestObject.shortcuts ?? []).flatMap((entry) => [
            ...(entry.url
              ? [{
                  url: safeAbsoluteUrl(entry.url, data.manifest),
                  kind: 'link' as const,
                  source: 'manifest-shortcut',
                  mimeHint: '',
                  sameOrigin: true,
                }]
              : []),
            ...((entry.icons ?? []).map((icon) => ({
              url: safeAbsoluteUrl(icon.src ?? icon.url ?? icon.href ?? '', data.manifest),
              kind: 'icon' as const,
              source: 'manifest-shortcut-icon',
              mimeHint: icon.type ?? '',
              sameOrigin: true,
            }))),
          ]),
        ].filter((item) => Boolean(item.url));

        data.icons = dedupeBy([...data.icons, ...manifestIcons], (item) => item.href);
        data.discoveredAssets = dedupeBy([...data.discoveredAssets, ...manifestAssets], (item) => item.url);
      }
    }
    const durationMs = Date.now() - startedAt;

    return NextResponse.json(
      {
        ok: true,
        fetchedUrl: response.url.toString(),
        data,
        fetchMeta: {
          status: response.status,
          statusText: response.statusText,
          contentType: getHeader(response.headers, 'content-type'),
          contentLength: getHeader(response.headers, 'content-length'),
          server: getHeader(response.headers, 'server'),
          cacheControl: getHeader(response.headers, 'cache-control'),
          contentLanguage: getHeader(response.headers, 'content-language'),
          xRobotsTag: getHeader(response.headers, 'x-robots-tag'),
          durationMs,
          fetchedAt: new Date().toISOString(),
        },
      },
      {
        status: 200,
        headers: defaultHeaders,
      },
    );
  } catch (error) {
    const isUnsafeUrl = error instanceof PublicUrlFetchError && error.code === 'unsafe_url';

    return NextResponse.json(
      {
        error: isUnsafeUrl
          ? 'Este endereço não pode ser consultado. Use uma página pública em HTTP ou HTTPS.'
          : 'Falha ao buscar a URL informada no momento.',
      },
      {
        status: isUnsafeUrl ? 400 : 502,
        headers: defaultHeaders,
      },
    );
  } finally {
    clearTimeout(timeout);
  }
}
