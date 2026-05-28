'use client';
/* eslint-disable @next/next/no-img-element */

import { useMemo, useState } from 'react';
import { ImageViewer } from '@/components/shared/image-viewer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { copyImageBlobToClipboard } from '@/lib/qr-code';
import type { AppLocale } from '@/lib/i18n/config';

type OpenGraphPreviewToolProps = Readonly<{
  locale?: AppLocale;
}>;

type AssetKind =
  | 'image'
  | 'icon'
  | 'script'
  | 'stylesheet'
  | 'font'
  | 'video'
  | 'audio'
  | 'document'
  | 'feed'
  | 'manifest'
  | 'link'
  | 'other';

type OpenGraphState = {
  url: string;
  title: string;
  description: string;
  image: string;
  siteName: string;
  type: string;
  locale: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  canonical: string;
  favicon: string;
  ogImages: string[];
  twitterImages: string[];
  manifest: string;
  robots: string;
  themeColor: string;
  author: string;
  publishedTime: string;
  modifiedTime: string;
  language: string;
  htmlLang: string;
  verification: Array<{ name: string; value: string }>;
  appLinks: Array<{ platform: string; value: string }>;
  icons: Array<{
    rel: string;
    href: string;
    type: string;
    sizes: string;
    media: string;
    color: string;
    purpose: string;
  }>;
  alternates: Array<{
    rel: string;
    href: string;
    hreflang: string;
    type: string;
    media: string;
    title: string;
  }>;
  feeds: Array<{ title: string; type: string; href: string }>;
  allMetaTags: Array<{ key: string; value: string; source: 'name' | 'property' | 'http-equiv' | 'itemprop' }>;
  discoveredAssets: Array<{
    url: string;
    kind: AssetKind;
    source: string;
    mimeHint: string;
    sameOrigin: boolean;
  }>;
  linkTagsCount: number;
  metaTagsCount: number;
  structuredDataCount: number;
};

type FetchResponse = {
  ok: boolean;
  fetchedUrl: string;
  data: OpenGraphState;
  error?: string;
  fetchMeta?: {
    status: number;
    statusText: string;
    contentType: string;
    contentLength: string;
    server: string;
    cacheControl: string;
    contentLanguage: string;
    xRobotsTag: string;
    durationMs: number;
    fetchedAt: string;
  };
};

type SocialPlatformId = 'facebook' | 'linkedin' | 'whatsapp' | 'twitter' | 'discord' | 'google';

type VisualItem = {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  kind: AssetKind | 'social-preview';
  source: string;
  meta?: string;
};

const PAGE_SIZE = 8;

const defaultState: OpenGraphState = {
  url: '',
  title: '',
  description: '',
  image: '',
  siteName: '',
  type: 'website',
  locale: 'en_US',
  twitterCard: 'summary_large_image',
  twitterTitle: '',
  twitterDescription: '',
  twitterImage: '',
  canonical: '',
  favicon: '',
  ogImages: [],
  twitterImages: [],
  manifest: '',
  robots: '',
  themeColor: '',
  author: '',
  publishedTime: '',
  modifiedTime: '',
  language: '',
  htmlLang: '',
  verification: [],
  appLinks: [],
  icons: [],
  alternates: [],
  feeds: [],
  allMetaTags: [],
  discoveredAssets: [],
  linkTagsCount: 0,
  metaTagsCount: 0,
  structuredDataCount: 0,
};

const socialPlatformOptions: Array<{ id: SocialPlatformId; label: string }> = [
  { id: 'facebook', label: 'Facebook' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'twitter', label: 'X/Twitter' },
  { id: 'discord', label: 'Discord' },
  { id: 'google', label: 'Google' },
];

const assetKindLabel: Record<AssetKind, string> = {
  image: 'Imagem',
  icon: 'Icone',
  script: 'Script',
  stylesheet: 'CSS',
  font: 'Fonte',
  video: 'Video',
  audio: 'Audio',
  document: 'Documento',
  feed: 'Feed',
  manifest: 'Manifest',
  link: 'Link',
  other: 'Outro',
};

const getDomain = (url: string): string => {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
};

const clip = (value: string, max: number): string => {
  if (value.length <= max) {
    return value;
  }

  return `${value.slice(0, max - 1)}...`;
};

const isVisualAssetKind = (kind: AssetKind): boolean => kind === 'image' || kind === 'icon';

const buildMetaHtml = (state: OpenGraphState): string => {
  const lines = [
    `<meta property="og:title" content="${state.title}" />`,
    `<meta property="og:description" content="${state.description}" />`,
    `<meta property="og:image" content="${state.image}" />`,
    `<meta property="og:url" content="${state.url}" />`,
    `<meta property="og:type" content="${state.type || 'website'}" />`,
    `<meta property="og:site_name" content="${state.siteName}" />`,
    `<meta property="og:locale" content="${state.locale}" />`,
    `<meta name="twitter:card" content="${state.twitterCard || 'summary_large_image'}" />`,
    `<meta name="twitter:title" content="${state.twitterTitle || state.title}" />`,
    `<meta name="twitter:description" content="${state.twitterDescription || state.description}" />`,
    `<meta name="twitter:image" content="${state.twitterImage || state.image}" />`,
    state.canonical ? `<link rel="canonical" href="${state.canonical}" />` : '',
    state.favicon ? `<link rel="icon" href="${state.favicon}" />` : '',
    state.manifest ? `<link rel="manifest" href="${state.manifest}" />` : '',
  ];

  return lines.filter(Boolean).join('\n');
};

const buildNextMetadata = (state: OpenGraphState): string => `export const metadata = {\n  title: ${JSON.stringify(state.title)},\n  description: ${JSON.stringify(state.description)},\n  alternates: { canonical: ${JSON.stringify(state.canonical || state.url)} },\n  manifest: ${JSON.stringify(state.manifest || undefined)},\n  openGraph: {\n    title: ${JSON.stringify(state.title)},\n    description: ${JSON.stringify(state.description)},\n    url: ${JSON.stringify(state.url)},\n    siteName: ${JSON.stringify(state.siteName)},\n    locale: ${JSON.stringify(state.locale)},\n    type: ${JSON.stringify(state.type || 'website')},\n    images: ${JSON.stringify((state.ogImages.length ? state.ogImages : [state.image]).filter(Boolean).map((url) => ({ url })), null, 2)},\n  },\n  twitter: {\n    card: ${JSON.stringify(state.twitterCard || 'summary_large_image')},\n    title: ${JSON.stringify(state.twitterTitle || state.title)},\n    description: ${JSON.stringify(state.twitterDescription || state.description)},\n    images: ${JSON.stringify((state.twitterImages.length ? state.twitterImages : [state.twitterImage || state.image]).filter(Boolean), null, 2)},\n  },\n  icons: ${JSON.stringify(state.icons.map((icon) => ({ rel: icon.rel, url: icon.href })), null, 2)},\n};`;

const getChecklist = (state: OpenGraphState) => [
  { label: 'og:title', ok: Boolean(state.title.trim()) },
  { label: 'og:description', ok: Boolean(state.description.trim()) },
  { label: 'og:image', ok: Boolean(state.image.trim()) },
  { label: 'og:url', ok: Boolean(state.url.trim()) },
  { label: 'twitter:card', ok: Boolean(state.twitterCard.trim()) },
  { label: 'twitter:title', ok: Boolean((state.twitterTitle || state.title).trim()) },
  { label: 'canonical', ok: Boolean((state.canonical || state.url).trim()) },
  { label: 'favicon', ok: Boolean(state.favicon.trim()) },
  { label: 'manifest', ok: Boolean(state.manifest.trim()) },
  { label: 'robots', ok: Boolean(state.robots.trim()) },
  { label: 'imagem https', ok: state.image.startsWith('https://') },
  { label: 'titulo <= 70', ok: state.title.length > 0 && state.title.length <= 70 },
  { label: 'descricao <= 200', ok: state.description.length > 0 && state.description.length <= 200 },
];

const copyToClipboard = async (value: string): Promise<boolean> => {
  if (!value.trim()) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
};

const getAssetProxyUrl = (url: string): string => `/api/tools/open-graph-preview/asset?url=${encodeURIComponent(url)}`;

const extractFilename = (url: string): string => {
  try {
    const pathname = new URL(url).pathname;
    return pathname.split('/').findLast(Boolean) ?? 'arquivo';
  } catch {
    return 'arquivo';
  }
};

const downloadViaProxy = async (url: string): Promise<void> => {
  const response = await fetch(getAssetProxyUrl(url));
  if (!response.ok) {
    throw new Error('Falha ao baixar asset.');
  }

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = extractFilename(url);
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(objectUrl);
};

const copyImageViaProxy = async (url: string): Promise<void> => {
  const response = await fetch(getAssetProxyUrl(url));
  if (!response.ok) {
    throw new Error('Falha ao copiar imagem.');
  }

  const blob = await response.blob();
  await copyImageBlobToClipboard(blob);
};

const buildIconVisualItems = (state: OpenGraphState): VisualItem[] => {
  const items: VisualItem[] = [];

  if (state.favicon) {
    items.push({
      id: `favicon:${state.favicon}`,
      title: 'Favicon principal',
      subtitle: state.favicon,
      imageUrl: state.favicon,
      kind: 'icon',
      source: 'favicon',
      meta: '',
    });
  }

  state.icons.forEach((icon, index) => {
    items.push({
      id: `icon:${index}:${icon.href}`,
      title: icon.rel || `Icone ${index + 1}`,
      subtitle: icon.href,
      imageUrl: icon.href,
      kind: 'icon',
      source: icon.rel,
      meta: [icon.sizes, icon.type, icon.purpose].filter(Boolean).join(' | '),
    });
  });

  return Array.from(new Map(items.map((item) => [item.imageUrl, item])).values());
};

const buildSocialImageItems = (state: OpenGraphState): VisualItem[] => {
  const items: VisualItem[] = [];

  [state.image, ...state.ogImages].filter(Boolean).forEach((url, index) => {
    items.push({
      id: `og:${index}:${url}`,
      title: index === 0 ? 'Imagem OG principal' : `Open Graph ${index + 1}`,
      subtitle: url,
      imageUrl: url,
      kind: 'image',
      source: 'og:image',
      meta: '',
    });
  });

  [state.twitterImage, ...state.twitterImages].filter(Boolean).forEach((url, index) => {
    items.push({
      id: `twitter:${index}:${url}`,
      title: index === 0 ? 'Imagem Twitter principal' : `Twitter ${index + 1}`,
      subtitle: url,
      imageUrl: url,
      kind: 'image',
      source: 'twitter:image',
      meta: '',
    });
  });

  return Array.from(new Map(items.map((item) => [item.imageUrl, item])).values());
};

const buildPreviewVisual = (platform: SocialPlatformId, state: OpenGraphState) => {
  const isTwitter = platform === 'twitter';
  const imageUrl = isTwitter ? state.twitterImage || state.image : state.image || state.twitterImage;
  const title = isTwitter ? state.twitterTitle || state.title : state.title;
  const description = isTwitter ? state.twitterDescription || state.description : state.description;

  return {
    platformLabel: socialPlatformOptions.find((item) => item.id === platform)?.label ?? platform,
    imageUrl,
    title,
    description,
  };
};

const Ui = {
  intro:
    'Auditoria visual e tecnica via backend: busca HTML real da URL, extrai Open Graph, Twitter Card, icones, assets publicados, canonical, manifest, alternates, verificacoes, app links e permite copiar/baixar o que for possivel.',
  targetUrl: 'URL para auditoria',
  fetchAction: 'Buscar metadados completos',
  loadExample: 'Carregar exemplo',
  clear: 'Limpar',
  copyMeta: 'Copiar meta tags',
  copyNext: 'Copiar metadata Next.js',
  copied: 'Copiado',
  previews: 'Preview por rede social',
};

function KeyValueList({
  items,
}: Readonly<{
  items: Array<{ label: string; value: string | number | null | undefined; swatch?: string }>;
}>) {
  return (
    <div className="grid gap-2 md:grid-cols-2">
      {items.map((item) => (
        <article key={item.label} className="rounded-lg border border-slate-200 bg-white p-3">
          <p className="text-[11px] uppercase tracking-wide text-slate-500">{item.label}</p>
          <div className="mt-1 flex items-center gap-2">
            {item.swatch ? (
              <span className="h-4 w-4 rounded border border-slate-300" style={{ backgroundColor: item.swatch }} />
            ) : null}
            <p className="break-all text-sm text-slate-800">{String(item.value || '-')}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

function MetaTagList({
  items,
  onCopy,
  copiedKey,
}: Readonly<{
  items: OpenGraphState['allMetaTags'];
  onCopy: (key: string, value: string) => void;
  copiedKey: string;
}>) {
  return (
    <div className="space-y-2">
      {items.map((item, index) => {
        const key = `${item.source}:${item.key}:${index}`;
        const line = `${item.source} | ${item.key} = ${item.value}`;

        return (
          <article key={key} className="rounded-lg border border-slate-200 bg-white p-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1 space-y-1">
                <p className="text-[11px] uppercase tracking-wide text-slate-500">{item.source}</p>
                <p className="font-mono text-xs text-slate-900">{item.key}</p>
                <p className="break-all text-sm text-slate-700">{item.value}</p>
              </div>
              <Button variant="secondary" onClick={() => onCopy(key, line)}>
                {copiedKey === key ? Ui.copied : 'Copiar'}
              </Button>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function VisualCard({
  item,
  onOpen,
  onCopyUrl,
  onCopyImage,
  onDownload,
  copiedKey,
}: Readonly<{
  item: VisualItem;
  onOpen: (item: VisualItem) => void;
  onCopyUrl: (key: string, value: string) => void;
  onCopyImage: (item: VisualItem) => void;
  onDownload: (item: VisualItem) => void;
  copiedKey: string;
}>) {
  const copyUrlKey = `url:${item.id}`;
  const copyImageKey = `img:${item.id}`;

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <button type="button" className="block h-32 w-full bg-slate-100" onClick={() => onOpen(item)}>
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.title} className="h-full w-full object-contain" />
        ) : null}
      </button>
      <div className="space-y-2 p-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">{item.title}</p>
          <p className="mt-1 break-all text-xs text-slate-600">{clip(item.subtitle, 110)}</p>
          {item.meta ? <p className="mt-1 text-[11px] text-slate-500">{item.meta}</p> : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => onOpen(item)}>Ver</Button>
          <Button variant="secondary" onClick={() => onCopyUrl(copyUrlKey, item.imageUrl)}>
            {copiedKey === copyUrlKey ? Ui.copied : 'Copiar URL'}
          </Button>
          <Button variant="secondary" onClick={() => onCopyImage(item)}>
            {copiedKey === copyImageKey ? Ui.copied : 'Copiar imagem'}
          </Button>
          <Button variant="secondary" onClick={() => onDownload(item)}>Baixar</Button>
        </div>
      </div>
    </article>
  );
}

function AssetCard({
  asset,
  onCopy,
  onOpen,
  onDownload,
  copiedKey,
}: Readonly<{
  asset: OpenGraphState['discoveredAssets'][number];
  onCopy: (key: string, value: string) => void;
  onOpen: (item: VisualItem) => void;
  onDownload: (url: string) => void;
  copiedKey: string;
}>) {
  const isVisual = isVisualAssetKind(asset.kind);
  const copyKey = `asset:${asset.url}`;

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-[11px] uppercase tracking-wide text-slate-500">{assetKindLabel[asset.kind]}</p>
          <p className="break-all text-sm font-semibold text-slate-900">{asset.url}</p>
          <p className="text-xs text-slate-600">Fonte: {asset.source || '-'} | {asset.sameOrigin ? 'mesmo dominio' : 'externo'}</p>
          {asset.mimeHint ? <p className="text-[11px] text-slate-500">{asset.mimeHint}</p> : null}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => onCopy(copyKey, asset.url)}>
          {copiedKey === copyKey ? Ui.copied : 'Copiar URL'}
        </Button>
        <Button variant="secondary" onClick={() => onDownload(asset.url)}>Baixar</Button>
        {isVisual ? (
          <Button
            variant="secondary"
            onClick={() =>
              onOpen({
                id: asset.url,
                title: assetKindLabel[asset.kind],
                subtitle: asset.url,
                imageUrl: asset.url,
                kind: asset.kind,
                source: asset.source,
                meta: asset.mimeHint,
              })
            }
          >
            Ver
          </Button>
        ) : null}
      </div>
    </article>
  );
}

export function OpenGraphPreviewTool({ locale: _locale = 'pt-br' }: OpenGraphPreviewToolProps) {
  const [state, setState] = useState<OpenGraphState>(defaultState);
  const [targetUrl, setTargetUrl] = useState('');
  const [fetchedUrl, setFetchedUrl] = useState('');
  const [fetchMeta, setFetchMeta] = useState<FetchResponse['fetchMeta']>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedKey, setCopiedKey] = useState('');
  const [socialPlatform, setSocialPlatform] = useState<SocialPlatformId>('whatsapp');
  const [assetsPage, setAssetsPage] = useState(1);
  const [viewerItem, setViewerItem] = useState<VisualItem | null>(null);

  const checklist = useMemo(() => getChecklist(state), [state]);
  const domain = useMemo(() => getDomain(state.url || state.canonical), [state.canonical, state.url]);
  const metaHtml = useMemo(() => buildMetaHtml(state), [state]);
  const nextMetadata = useMemo(() => buildNextMetadata(state), [state]);
  const iconItems = useMemo(() => buildIconVisualItems(state), [state]);
  const socialImageItems = useMemo(() => buildSocialImageItems(state), [state]);
  const previewVisual = useMemo(() => buildPreviewVisual(socialPlatform, state), [socialPlatform, state]);
  const totalAssetPages = useMemo(
    () => Math.max(1, Math.ceil(state.discoveredAssets.length / PAGE_SIZE)),
    [state.discoveredAssets.length],
  );
  const pagedAssets = useMemo(
    () => state.discoveredAssets.slice((assetsPage - 1) * PAGE_SIZE, assetsPage * PAGE_SIZE),
    [assetsPage, state.discoveredAssets],
  );

  const setCopied = (key: string) => {
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 1200);
  };

  const handleCopyText = async (key: string, value: string) => {
    const ok = await copyToClipboard(value);
    if (ok) {
      setCopied(key);
    }
  };

  const handleCopyImage = async (item: VisualItem) => {
    try {
      await copyImageViaProxy(item.imageUrl);
      setCopied(`img:${item.id}`);
    } catch {
      setError('Nao foi possivel copiar essa imagem agora.');
    }
  };

  const handleDownloadItem = async (item: VisualItem) => {
    try {
      await downloadViaProxy(item.imageUrl);
    } catch {
      setError('Nao foi possivel baixar esse arquivo agora.');
    }
  };

  const handleDownloadUrl = async (url: string) => {
    try {
      await downloadViaProxy(url);
    } catch {
      setError('Nao foi possivel baixar esse arquivo agora.');
    }
  };

  const handleFetch = async () => {
    if (!targetUrl.trim()) {
      setError('Informe uma URL valida.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/tools/open-graph-preview?url=${encodeURIComponent(targetUrl)}`);
      const payload = (await response.json()) as FetchResponse;

      if (!response.ok || !payload.ok) {
        setError(payload.error ?? 'Nao foi possivel buscar tags dessa URL.');
        return;
      }

      setState(payload.data);
      setFetchedUrl(payload.fetchedUrl);
      setFetchMeta(payload.fetchMeta);
      setAssetsPage(1);
      setViewerItem(null);
    } catch {
      setError('Falha ao buscar a URL agora.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="space-y-5">
        <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
          {Ui.intro}
        </section>

        <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">{Ui.targetUrl}</span>
            <Input value={targetUrl} onChange={(event) => setTargetUrl(event.target.value)} placeholder="https://example.com/produto" />
          </label>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={handleFetch} disabled={loading}>
              {loading ? 'Buscando...' : Ui.fetchAction}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setTargetUrl('https://example.com');
                setError('');
              }}
            >
              {Ui.loadExample}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setState(defaultState);
                setFetchedUrl('');
                setFetchMeta(undefined);
                setTargetUrl('');
                setError('');
                setCopiedKey('');
                setAssetsPage(1);
                setViewerItem(null);
              }}
            >
              {Ui.clear}
            </Button>
          </div>
        </section>

        {error ? <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

        <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-sm font-semibold text-slate-800">Resumo da coleta</h3>
          <KeyValueList
            items={[
              { label: 'URL final', value: fetchedUrl || state.url || '-' },
              { label: 'Dominio', value: domain || '-' },
              { label: 'HTTP status', value: fetchMeta?.status ?? '-' },
              { label: 'Tempo (ms)', value: fetchMeta?.durationMs ?? '-' },
              { label: 'Content-Type', value: fetchMeta?.contentType || '-' },
              { label: 'Meta tags', value: state.metaTagsCount },
              { label: 'Link tags', value: state.linkTagsCount },
              { label: 'Assets descobertos', value: state.discoveredAssets.length },
            ]}
          />
        </section>

        <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-slate-800">Snippets gerados</h3>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={() => void handleCopyText('meta-snippet', metaHtml)}>
                {copiedKey === 'meta-snippet' ? Ui.copied : Ui.copyMeta}
              </Button>
              <Button variant="secondary" onClick={() => void handleCopyText('next-snippet', nextMetadata)}>
                {copiedKey === 'next-snippet' ? Ui.copied : Ui.copyNext}
              </Button>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <article className="space-y-2 rounded-xl border border-slate-200 bg-white p-3">
              <h4 className="text-sm font-semibold text-slate-800">Meta tags HTML</h4>
              <Textarea readOnly value={metaHtml} className="min-h-[220px] font-mono text-xs" />
            </article>
            <article className="space-y-2 rounded-xl border border-slate-200 bg-white p-3">
              <h4 className="text-sm font-semibold text-slate-800">Next.js metadata</h4>
              <Textarea readOnly value={nextMetadata} className="min-h-[220px] font-mono text-xs" />
            </article>
          </div>
        </section>

        <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-sm font-semibold text-slate-800">Campos principais</h3>
          <KeyValueList
            items={[
              { label: 'URL', value: state.url || '-' },
              { label: 'Canonical', value: state.canonical || '-' },
              { label: 'Site name', value: state.siteName || '-' },
              { label: 'og:type', value: state.type || '-' },
              { label: 'og:locale', value: state.locale || '-' },
              { label: 'twitter:card', value: state.twitterCard || '-' },
              { label: 'Titulo', value: state.title || '-' },
              { label: 'Descricao', value: state.description || '-' },
            ]}
          />
        </section>

        <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-sm font-semibold text-slate-800">Infra publica do site</h3>
          <KeyValueList
            items={[
              { label: 'Favicon', value: state.favicon || '-' },
              { label: 'Manifest', value: state.manifest || '-' },
              { label: 'Robots meta', value: state.robots || '-' },
              { label: 'X-Robots-Tag', value: fetchMeta?.xRobotsTag || '-' },
              { label: 'Tema', value: state.themeColor || '-', swatch: state.themeColor || undefined },
              { label: 'Autor', value: state.author || '-' },
              { label: 'Publicado em', value: state.publishedTime || '-' },
              { label: 'Atualizado em', value: state.modifiedTime || '-' },
              { label: 'Idioma meta', value: state.language || '-' },
              { label: 'HTML lang', value: state.htmlLang || '-' },
              { label: 'Content-Language', value: fetchMeta?.contentLanguage || '-' },
              { label: 'Server', value: fetchMeta?.server || '-' },
            ]}
          />
        </section>

        <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-slate-800">{Ui.previews}</h3>
            <div className="w-full max-w-[220px]">
              <Select value={socialPlatform} onChange={(event) => setSocialPlatform(event.target.value as SocialPlatformId)}>
                {socialPlatformOptions.map((option) => (
                  <option key={option.id} value={option.id}>{option.label}</option>
                ))}
              </Select>
            </div>
          </div>
          <article className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <header className="border-b border-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
              {previewVisual.platformLabel}
            </header>
            {previewVisual.imageUrl ? (
              <button type="button" className="block h-44 w-full bg-slate-100" onClick={() => setViewerItem({
                id: `preview:${socialPlatform}`,
                title: `${previewVisual.platformLabel} preview`,
                subtitle: previewVisual.imageUrl,
                imageUrl: previewVisual.imageUrl,
                kind: 'social-preview',
                source: socialPlatform,
              })}>
                <img src={previewVisual.imageUrl} alt={previewVisual.platformLabel} className="h-full w-full object-cover" />
              </button>
            ) : (
              <div className="h-44 w-full bg-slate-100" />
            )}
            <div className="space-y-2 p-4">
              <p className="text-[11px] uppercase tracking-wide text-slate-500">{domain || state.siteName || 'domain.com'}</p>
              <p className="text-lg font-semibold text-slate-900">{clip(previewVisual.title || 'Titulo do preview', 90)}</p>
              <p className="text-sm text-slate-600">{clip(previewVisual.description || 'Descricao do preview do link compartilhado.', 220)}</p>
            </div>
          </article>
        </section>

        <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-slate-800">Icones visuais ({iconItems.length})</h3>
            <span className="text-xs text-slate-500">Ver, copiar URL, copiar imagem e baixar</span>
          </div>
          {iconItems.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {iconItems.map((item) => (
                <VisualCard
                  key={item.id}
                  item={item}
                  onOpen={setViewerItem}
                  onCopyUrl={(key, value) => void handleCopyText(key, value)}
                  onCopyImage={(selected) => void handleCopyImage(selected)}
                  onDownload={(selected) => void handleDownloadItem(selected)}
                  copiedKey={copiedKey}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-600">Nenhum icone encontrado na URL auditada.</p>
          )}
        </section>

        <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-slate-800">Imagens sociais e previews ({socialImageItems.length})</h3>
            <span className="text-xs text-slate-500">Open Graph, Twitter e imagens principais detectadas</span>
          </div>
          {socialImageItems.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {socialImageItems.map((item) => (
                <VisualCard
                  key={item.id}
                  item={item}
                  onOpen={setViewerItem}
                  onCopyUrl={(key, value) => void handleCopyText(key, value)}
                  onCopyImage={(selected) => void handleCopyImage(selected)}
                  onDownload={(selected) => void handleDownloadItem(selected)}
                  copiedKey={copiedKey}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-600">Nenhuma imagem social encontrada na URL auditada.</p>
          )}
        </section>

        <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-slate-800">Assets e arquivos descobertos ({state.discoveredAssets.length})</h3>
            <span className="text-xs text-slate-500">Best effort: inclui arquivos referenciados no HTML, metatags, links publicos e manifest</span>
          </div>
          {state.discoveredAssets.length > 0 ? (
            <>
              {totalAssetPages > 1 ? (
                <label className="space-y-2">
                  <span className="sr-only">Selecionar pagina de assets descobertos</span>
                  <div className="flex items-center justify-between gap-2 text-sm font-semibold text-slate-800">
                    <span>Paginacao por slider</span>
                    <span className="rounded-md border border-slate-200 bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                      Pagina {assetsPage} de {totalAssetPages}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={totalAssetPages}
                    value={assetsPage}
                    onChange={(event) => setAssetsPage(Number(event.target.value))}
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-brand-600"
                  />
                </label>
              ) : null}
              <div className="grid gap-3 md:grid-cols-2">
                {pagedAssets.map((asset) => (
                  <AssetCard
                    key={`${asset.kind}:${asset.url}`}
                    asset={asset}
                    onCopy={(key, value) => void handleCopyText(key, value)}
                    onOpen={setViewerItem}
                    onDownload={(url) => void handleDownloadUrl(url)}
                    copiedKey={copiedKey}
                  />
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-600">Nenhum asset adicional foi descoberto nessa URL.</p>
          )}
        </section>

        <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-sm font-semibold text-slate-800">Diagnostico tecnico</h3>
          <div className="grid gap-2 md:grid-cols-3">
            {checklist.map((item) => (
              <p key={item.label} className={`rounded-md border px-2 py-1 text-xs ${item.ok ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-amber-200 bg-amber-50 text-amber-800'}`}>
                {item.ok ? 'OK' : 'Ajustar'}: {item.label}
              </p>
            ))}
          </div>
        </section>

        <section className="grid gap-3 md:grid-cols-2">
          <article className="space-y-2 rounded-xl border border-slate-200 bg-white p-3">
            <h4 className="text-sm font-semibold text-slate-800">Verificacoes ({state.verification.length})</h4>
            <pre className="max-h-[220px] overflow-auto whitespace-pre-wrap break-all rounded-lg border border-slate-100 bg-slate-50 p-3 text-xs text-slate-700">{JSON.stringify(state.verification, null, 2)}</pre>
          </article>
          <article className="space-y-2 rounded-xl border border-slate-200 bg-white p-3">
            <h4 className="text-sm font-semibold text-slate-800">App links ({state.appLinks.length})</h4>
            <pre className="max-h-[220px] overflow-auto whitespace-pre-wrap break-all rounded-lg border border-slate-100 bg-slate-50 p-3 text-xs text-slate-700">{JSON.stringify(state.appLinks, null, 2)}</pre>
          </article>
        </section>

        <section className="grid gap-3 md:grid-cols-2">
          <article className="space-y-2 rounded-xl border border-slate-200 bg-white p-3">
            <h4 className="text-sm font-semibold text-slate-800">Alternates e hreflang ({state.alternates.length})</h4>
            <pre className="max-h-[220px] overflow-auto whitespace-pre-wrap break-all rounded-lg border border-slate-100 bg-slate-50 p-3 text-xs text-slate-700">{JSON.stringify(state.alternates, null, 2)}</pre>
          </article>
          <article className="space-y-2 rounded-xl border border-slate-200 bg-white p-3">
            <h4 className="text-sm font-semibold text-slate-800">Feeds ({state.feeds.length})</h4>
            <pre className="max-h-[220px] overflow-auto whitespace-pre-wrap break-all rounded-lg border border-slate-100 bg-slate-50 p-3 text-xs text-slate-700">{JSON.stringify(state.feeds, null, 2)}</pre>
          </article>
        </section>

        <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-sm font-semibold text-slate-800">Metatags coletadas ({state.allMetaTags.length})</h3>
          <MetaTagList items={state.allMetaTags} onCopy={(key, value) => void handleCopyText(key, value)} copiedKey={copiedKey} />
        </section>
      </Card>

      <ImageViewer
        src={viewerItem?.imageUrl ?? ''}
        alt={viewerItem?.title ?? 'Asset visual'}
        isOpen={Boolean(viewerItem)}
        onClose={() => setViewerItem(null)}
        onDownload={viewerItem ? () => downloadViaProxy(viewerItem.imageUrl) : undefined}
      />
    </>
  );
}
