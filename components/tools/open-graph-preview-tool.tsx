'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { AppLocale } from '@/lib/i18n/config';

type OpenGraphPreviewToolProps = {
  locale?: AppLocale;
};

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
  linkTagsCount: 0,
  metaTagsCount: 0,
  structuredDataCount: 0,
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

const Ui = {
  intro:
    'Auditoria completa de metadados via backend: busca HTML real da URL, extrai Open Graph, Twitter Card, icones, canonical, manifest, alternates, verificacoes, app links e diagnosticos para publicacao.',
  targetUrl: 'URL para auditoria',
  fetchAction: 'Buscar metadados completos',
  loadExample: 'Carregar exemplo',
  clear: 'Limpar',
  copyMeta: 'Copiar meta tags',
  copyNext: 'Copiar metadata Next.js',
  copied: 'Copiado',
  diagnostics: 'Diagnostico tecnico',
  previews: 'Previews por plataforma',
};

function KeyValueList({
  items,
}: Readonly<{
  items: Array<{ label: string; value: string | number }>;
}>) {
  return (
    <div className="grid gap-2 md:grid-cols-2">
      {items.map((item) => (
        <article key={item.label} className="rounded-lg border border-slate-200 bg-white p-3">
          <p className="text-[11px] uppercase tracking-wide text-slate-500">{item.label}</p>
          <p className="mt-1 break-all text-sm text-slate-800">{String(item.value || '-')}</p>
        </article>
      ))}
    </div>
  );
}

export function OpenGraphPreviewTool({ locale: _locale = 'pt-br' }: Readonly<OpenGraphPreviewToolProps>) {
  const [state, setState] = useState<OpenGraphState>(defaultState);
  const [targetUrl, setTargetUrl] = useState('');
  const [fetchedUrl, setFetchedUrl] = useState('');
  const [fetchMeta, setFetchMeta] = useState<FetchResponse['fetchMeta']>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedKey, setCopiedKey] = useState('');

  const checklist = useMemo(() => getChecklist(state), [state]);
  const domain = useMemo(() => getDomain(state.url || state.canonical), [state.canonical, state.url]);
  const metaHtml = useMemo(() => buildMetaHtml(state), [state]);
  const nextMetadata = useMemo(() => buildNextMetadata(state), [state]);

  const copyGenerated = async (key: string, value: string) => {
    const ok = await copyToClipboard(value);
    if (!ok) {
      return;
    }

    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 1200);
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
    } catch {
      setError('Falha ao buscar a URL agora.');
    } finally {
      setLoading(false);
    }
  };

  return (
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
            { label: 'JSON-LD scripts', value: state.structuredDataCount },
          ]}
        />
      </section>

      <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h3 className="text-sm font-semibold text-slate-800">Campos principais</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">URL</span>
            <Input value={state.url} readOnly />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">Canonical</span>
            <Input value={state.canonical} readOnly />
          </label>
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-semibold text-slate-800">Titulo</span>
            <Input value={state.title} readOnly />
          </label>
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-semibold text-slate-800">Descricao</span>
            <Input value={state.description} readOnly />
          </label>
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-semibold text-slate-800">Imagem principal</span>
            <Input value={state.image} readOnly />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">Site name</span>
            <Input value={state.siteName} readOnly />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">og:type</span>
            <Input value={state.type} readOnly />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">og:locale</span>
            <Input value={state.locale} readOnly />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">twitter:card</span>
            <Input value={state.twitterCard} readOnly />
          </label>
        </div>
      </section>

      <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h3 className="text-sm font-semibold text-slate-800">Infra publica do site</h3>
        <KeyValueList
          items={[
            { label: 'Favicon', value: state.favicon || '-' },
            { label: 'Manifest', value: state.manifest || '-' },
            { label: 'Robots meta', value: state.robots || '-' },
            { label: 'X-Robots-Tag', value: fetchMeta?.xRobotsTag || '-' },
            { label: 'Tema (theme-color)', value: state.themeColor || '-' },
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
        <h3 className="text-sm font-semibold text-slate-800">Diagnostico tecnico</h3>
        <div className="grid gap-2 md:grid-cols-3">
          {checklist.map((item) => (
            <p key={item.label} className={`rounded-md border px-2 py-1 text-xs ${item.ok ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-amber-200 bg-amber-50 text-amber-800'}`}>
              {item.ok ? 'OK' : 'Ajustar'}: {item.label}
            </p>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-800">Previews por plataforma</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {['Facebook', 'LinkedIn', 'WhatsApp', 'X/Twitter', 'Discord', 'Google'].map((platform) => (
            <article key={platform} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <header className="border-b border-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">{platform}</header>
              {state.image ? (
                <div
                  className="h-36 w-full bg-cover bg-center"
                  style={{ backgroundImage: `url('${state.image}')` }}
                />
              ) : (
                <div className="h-36 w-full bg-slate-100" />
              )}
              <div className="space-y-1 p-3">
                <p className="text-[11px] uppercase tracking-wide text-slate-500">{domain || state.siteName || 'domain.com'}</p>
                <p className="text-sm font-semibold text-slate-900">{clip(state.title || 'Titulo do preview', 80)}</p>
                <p className="text-xs text-slate-600">{clip(state.description || 'Descricao do preview do link compartilhado.', 180)}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        <article className="space-y-2 rounded-xl border border-slate-200 bg-white p-3">
          <h4 className="text-sm font-semibold text-slate-800">Imagens Open Graph ({state.ogImages.length})</h4>
          <pre className="max-h-[220px] overflow-auto whitespace-pre-wrap break-all rounded-lg border border-slate-100 bg-slate-50 p-3 text-xs text-slate-700">{JSON.stringify(state.ogImages, null, 2)}</pre>
        </article>
        <article className="space-y-2 rounded-xl border border-slate-200 bg-white p-3">
          <h4 className="text-sm font-semibold text-slate-800">Imagens Twitter ({state.twitterImages.length})</h4>
          <pre className="max-h-[220px] overflow-auto whitespace-pre-wrap break-all rounded-lg border border-slate-100 bg-slate-50 p-3 text-xs text-slate-700">{JSON.stringify(state.twitterImages, null, 2)}</pre>
        </article>
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        <article className="space-y-2 rounded-xl border border-slate-200 bg-white p-3">
          <h4 className="text-sm font-semibold text-slate-800">Icones ({state.icons.length})</h4>
          <pre className="max-h-[220px] overflow-auto whitespace-pre-wrap break-all rounded-lg border border-slate-100 bg-slate-50 p-3 text-xs text-slate-700">{JSON.stringify(state.icons, null, 2)}</pre>
        </article>
        <article className="space-y-2 rounded-xl border border-slate-200 bg-white p-3">
          <h4 className="text-sm font-semibold text-slate-800">Alternates e hreflang ({state.alternates.length})</h4>
          <pre className="max-h-[220px] overflow-auto whitespace-pre-wrap break-all rounded-lg border border-slate-100 bg-slate-50 p-3 text-xs text-slate-700">{JSON.stringify(state.alternates, null, 2)}</pre>
        </article>
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

      <section className="space-y-2 rounded-xl border border-slate-200 bg-white p-3">
        <h4 className="text-sm font-semibold text-slate-800">Meta tags coletadas ({state.allMetaTags.length})</h4>
        <pre className="max-h-[280px] overflow-auto whitespace-pre-wrap break-all rounded-lg border border-slate-100 bg-slate-50 p-3 text-xs text-slate-700">{JSON.stringify(state.allMetaTags, null, 2)}</pre>
      </section>

      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => copyGenerated('meta', metaHtml)}>
          {copiedKey === 'meta' ? Ui.copied : Ui.copyMeta}
        </Button>
        <Button variant="secondary" onClick={() => copyGenerated('next', nextMetadata)}>
          {copiedKey === 'next' ? Ui.copied : Ui.copyNext}
        </Button>
      </div>

      <section className="grid gap-3 md:grid-cols-2">
        <article className="space-y-2 rounded-xl border border-slate-200 bg-white p-3">
          <h4 className="text-sm font-semibold text-slate-800">Meta tags HTML</h4>
          <Textarea readOnly value={metaHtml} className="min-h-[280px] font-mono text-xs" />
        </article>
        <article className="space-y-2 rounded-xl border border-slate-200 bg-white p-3">
          <h4 className="text-sm font-semibold text-slate-800">Next.js metadata</h4>
          <Textarea readOnly value={nextMetadata} className="min-h-[280px] font-mono text-xs" />
        </article>
      </section>
    </Card>
  );
}
