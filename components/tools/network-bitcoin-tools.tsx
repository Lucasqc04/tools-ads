'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { decodeBitcoinTransaction, inspectBitcoinAddress, type BitcoinReadonlyNetwork, type BitcoinTxDecodeResult } from '@/lib/bitcoin-readonly';
import { fetchRecommendedFeeRate } from '@/lib/bitcoin/mempool';
import type { BitcoinNetworkId } from '@/lib/bitcoin/networks';
import type { AppLocale } from '@/lib/i18n/config';

type Notice = { tone: 'info' | 'success' | 'error'; text: string } | null;

const noticeClass = {
  info: 'border-slate-200 bg-slate-50 text-slate-700',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  error: 'border-red-200 bg-red-50 text-red-700',
};

const copyText = async (
  value: string,
  setNotice: (notice: Notice) => void,
  success: string,
  errorText = 'Copy failed.',
) => {
  try {
    await navigator.clipboard.writeText(value);
    setNotice({ tone: 'success', text: success });
  } catch {
    setNotice({ tone: 'error', text: errorText });
  }
};

const downloadText = (content: string, fileName: string, type = 'text/plain') => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
};

function ToolHeader({ title, intro }: Readonly<{ title: string; intro: string }>) {
  return (
    <header className="rounded-xl border border-brand-200 bg-gradient-to-r from-brand-50 to-indigo-50 p-4">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-700">{intro}</p>
    </header>
  );
}

function NoticeBox({ notice }: Readonly<{ notice: Notice }>) {
  if (!notice) return null;
  return <p className={`rounded-lg border px-3 py-2 text-sm ${noticeClass[notice.tone]}`}>{notice.text}</p>;
}

const dnsUi = {
  'pt-br': {
    title: 'DNS Lookup via DNS over HTTPS',
    intro: 'Consulte registros A, AAAA, CNAME, MX, TXT, NS, SOA e CAA usando resolvers publicos DoH.',
    domain: 'Dominio',
    type: 'Tipo',
    resolver: 'Resolver',
    lookup: 'Consultar DNS',
    lookupAll: 'Todos os tipos em todos resolvers',
    filter: 'Filtrar resultados',
    show: 'Mostrar',
    all: 'Todos',
    withAnswers: 'Com resposta',
    noData: 'Sem resposta',
    errors: 'Erros',
    copy: 'Copiar JSON',
    exportJson: 'Exportar JSON',
    exportCsv: 'Exportar CSV',
    copied: 'Copiado.',
    status: 'Status',
    answers: 'Respostas',
    name: 'Nome',
    data: 'Dados',
    noAnswers: 'Nenhuma resposta retornada.',
    copyError: 'Nao foi possivel copiar.',
    resolverSummary: 'Resumo por resolver e tipo',
  },
  en: {
    title: 'DNS Lookup via DNS over HTTPS',
    intro: 'Query A, AAAA, CNAME, MX, TXT, NS, SOA, and CAA records using public DoH resolvers.',
    domain: 'Domain',
    type: 'Type',
    resolver: 'Resolver',
    lookup: 'Lookup DNS',
    lookupAll: 'All types on all resolvers',
    filter: 'Filter results',
    show: 'Show',
    all: 'All',
    withAnswers: 'With answers',
    noData: 'No data',
    errors: 'Errors',
    copy: 'Copy JSON',
    exportJson: 'Export JSON',
    exportCsv: 'Export CSV',
    copied: 'Copied.',
    status: 'Status',
    answers: 'Answers',
    name: 'Name',
    data: 'Data',
    noAnswers: 'No answer returned.',
    copyError: 'Could not copy.',
    resolverSummary: 'Resolver and type summary',
  },
  es: {
    title: 'DNS Lookup via DNS over HTTPS',
    intro: 'Consulta registros A, AAAA, CNAME, MX, TXT, NS, SOA y CAA usando resolvers DoH publicos.',
    domain: 'Dominio',
    type: 'Tipo',
    resolver: 'Resolver',
    lookup: 'Consultar DNS',
    lookupAll: 'Todos los tipos en todos resolvers',
    filter: 'Filtrar resultados',
    show: 'Mostrar',
    all: 'Todos',
    withAnswers: 'Con respuesta',
    noData: 'Sin respuesta',
    errors: 'Errores',
    copy: 'Copiar JSON',
    exportJson: 'Exportar JSON',
    exportCsv: 'Exportar CSV',
    copied: 'Copiado.',
    status: 'Status',
    answers: 'Respuestas',
    name: 'Nombre',
    data: 'Datos',
    noAnswers: 'Ninguna respuesta retornada.',
    copyError: 'No fue posible copiar.',
    resolverSummary: 'Resumen por resolver y tipo',
  },
} satisfies Record<AppLocale, Record<string, string>>;

type DnsResolver = 'cloudflare' | 'google';

type DnsAnswer = {
  name: string;
  type: number;
  TTL: number;
  data: string;
};

type DnsResponse = {
  Status: number;
  TC?: boolean;
  RD?: boolean;
  RA?: boolean;
  AD?: boolean;
  CD?: boolean;
  Question?: Array<{ name: string; type: number }>;
  Answer?: DnsAnswer[];
  Authority?: DnsAnswer[];
};

type DnsLookupResult = {
  resolver: DnsResolver;
  type: string;
  response?: DnsResponse;
  error?: string;
};

const dnsTypeOptions = ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS', 'SOA', 'CAA'];
const dnsResolvers: DnsResolver[] = ['cloudflare', 'google'];

const normalizeDomainInput = (value: string): string => {
  const trimmed = value.trim();
  try {
    const url = trimmed.includes('://') ? new URL(trimmed) : new URL(`https://${trimmed}`);
    return url.hostname.replace(/^www\./, '');
  } catch {
    return trimmed.replace(/^https?:\/\//, '').split('/')[0]?.replace(/^www\./, '') ?? trimmed;
  }
};

const queryDns = async (resolver: DnsResolver, domain: string, type: string): Promise<DnsResponse> => {
  const name = domain.trim();
  const endpoint =
    resolver === 'cloudflare'
      ? `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=${encodeURIComponent(type)}`
      : `https://dns.google/resolve?name=${encodeURIComponent(name)}&type=${encodeURIComponent(type)}`;
  const response = await fetch(endpoint, {
    headers: resolver === 'cloudflare' ? { Accept: 'application/dns-json' } : undefined,
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return (await response.json()) as DnsResponse;
};

export function DnsLookupDohTool({ locale = 'pt-br' }: Readonly<{ locale?: AppLocale }>) {
  const ui = dnsUi[locale];
  const [domain, setDomain] = useState('example.com');
  const [recordType, setRecordType] = useState('A');
  const [resolver, setResolver] = useState<DnsResolver>('cloudflare');
  const [results, setResults] = useState<DnsLookupResult[]>([]);
  const [filter, setFilter] = useState('');
  const [showMode, setShowMode] = useState<'all' | 'answers' | 'empty' | 'errors'>('all');
  const [notice, setNotice] = useState<Notice>(null);
  const filteredResults = useMemo(() => {
    const term = filter.trim().toLowerCase();
    return results.filter((item) => {
      const answers = item.response?.Answer ?? [];
      if (showMode === 'answers' && !answers.length) return false;
      if (showMode === 'empty' && (answers.length || item.error)) return false;
      if (showMode === 'errors' && !item.error) return false;
      if (!term) return true;
      return [
        item.resolver,
        item.type,
        item.error ?? '',
        ...(item.response?.Question ?? []).map((question) => question.name),
        ...answers.flatMap((answer) => [answer.name, answer.data, String(answer.TTL)]),
      ].some((value) => value.toLowerCase().includes(term));
    });
  }, [filter, results, showMode]);
  const json = results.length ? JSON.stringify({ domain: normalizeDomainInput(domain), results }, null, 2) : '';
  const csv = useMemo(() => [
    'resolver,type,status,name,ttl,data,error',
    ...results.flatMap((item) => {
      const answers = item.response?.Answer ?? [];
      if (item.error) return [`${item.resolver},${item.type},error,,,,${JSON.stringify(item.error)}`];
      if (!answers.length) return [`${item.resolver},${item.type},empty,,,,`];
      return answers.map((answer) => [
        item.resolver,
        item.type,
        item.response?.Status ?? '',
        JSON.stringify(answer.name),
        answer.TTL,
        JSON.stringify(answer.data),
        '',
      ].join(','));
    }),
  ].join('\n'), [results]);

  const lookup = async () => {
    try {
      const normalized = normalizeDomainInput(domain);
      setResults([{ resolver, type: recordType, response: await queryDns(resolver, normalized, recordType) }]);
      setNotice(null);
    } catch (error) {
      setNotice({ tone: 'error', text: error instanceof Error ? error.message : 'DNS error.' });
    }
  };

  const lookupAll = async () => {
    const normalized = normalizeDomainInput(domain);
    const queries = dnsResolvers.flatMap((resolverId) => dnsTypeOptions.map((type) => ({ resolver: resolverId, type })));
    const next = await Promise.all(queries.map(async (query) => {
      try {
        return { ...query, response: await queryDns(query.resolver, normalized, query.type) };
      } catch (error) {
        return { ...query, error: error instanceof Error ? error.message : 'DNS error.' };
      }
    }));
    setResults(next);
    setNotice(null);
  };

  return (
    <Card className="space-y-5">
      <ToolHeader title={ui.title} intro={ui.intro} />
      <div className="grid gap-4 md:grid-cols-[1fr_160px_180px]">
        <label className="space-y-2"><span className="text-sm font-semibold text-slate-800">{ui.domain}</span><Input value={domain} onChange={(event) => setDomain(event.target.value)} /></label>
        <label className="space-y-2"><span className="text-sm font-semibold text-slate-800">{ui.type}</span><Select value={recordType} onChange={(event) => setRecordType(event.target.value)}>{dnsTypeOptions.map((item) => <option key={item} value={item}>{item}</option>)}</Select></label>
        <label className="space-y-2"><span className="text-sm font-semibold text-slate-800">{ui.resolver}</span><Select value={resolver} onChange={(event) => setResolver(event.target.value as DnsResolver)}><option value="cloudflare">Cloudflare</option><option value="google">Google</option></Select></label>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => void lookup()}>{ui.lookup}</Button>
        <Button variant="secondary" onClick={() => void lookupAll()}>{ui.lookupAll}</Button>
        <Button variant="secondary" disabled={!results.length} onClick={() => void copyText(json, setNotice, ui.copied, ui.copyError)}>{ui.copy}</Button>
        <Button variant="secondary" disabled={!results.length} onClick={() => downloadText(json, 'dns-lookup.json', 'application/json')}>{ui.exportJson}</Button>
        <Button variant="secondary" disabled={!results.length} onClick={() => downloadText(csv, 'dns-lookup.csv', 'text/csv')}>{ui.exportCsv}</Button>
      </div>
      <NoticeBox notice={notice} />
      {results.length ? (
        <section className="space-y-4">
          <div className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-[1fr_180px]">
            <label className="space-y-2"><span className="text-sm font-semibold text-slate-800">{ui.filter}</span><Input value={filter} onChange={(event) => setFilter(event.target.value)} /></label>
            <label className="space-y-2"><span className="text-sm font-semibold text-slate-800">{ui.show}</span><Select value={showMode} onChange={(event) => setShowMode(event.target.value as typeof showMode)}><option value="all">{ui.all}</option><option value="answers">{ui.withAnswers}</option><option value="empty">{ui.noData}</option><option value="errors">{ui.errors}</option></Select></label>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {results.map((item) => {
              const count = item.response?.Answer?.length ?? 0;
              return (
                <div key={`${item.resolver}-${item.type}`} className={`rounded-lg border p-3 ${item.error ? 'border-red-200 bg-red-50 text-red-900' : count ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : 'border-slate-200 bg-white text-slate-700'}`}>
                  <p className="text-xs font-semibold uppercase tracking-wide opacity-75">{item.resolver} / {item.type}</p>
                  <p className="mt-1 text-sm font-semibold">{item.error ? ui.errors : count ? `${count} ${ui.answers}` : ui.noAnswers}</p>
                  <p className="mt-1 text-xs opacity-80">{ui.status}: {item.response?.Status ?? '-'}</p>
                </div>
              );
            })}
          </div>
          <div className="space-y-3">
            {filteredResults.map((item) => (
              <div key={`${item.resolver}-${item.type}-table`} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 px-4 py-3">
                  <h4 className="text-sm font-semibold text-slate-900">{item.resolver} / {item.type}</h4>
                  <span className="text-xs text-slate-500">{ui.status}: {item.response?.Status ?? (item.error ? 'error' : '-')}</span>
                </div>
                {item.error ? (
                  <p className="p-4 text-sm text-red-700">{item.error}</p>
                ) : (item.response?.Answer ?? []).length ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 text-sm">
                      <thead className="bg-white text-left text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-3 py-2">{ui.name}</th><th className="px-3 py-2">TTL</th><th className="px-3 py-2">{ui.data}</th></tr></thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {(item.response?.Answer ?? []).map((answer, index) => <tr key={`${answer.name}-${index}`}><td className="px-3 py-2">{answer.name}</td><td className="px-3 py-2">{answer.TTL}</td><td className="break-all px-3 py-2 font-mono text-xs">{answer.data}</td></tr>)}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="p-4 text-sm text-slate-500">{ui.noAnswers}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </Card>
  );
}

const feeUi = {
  'pt-br': {
    title: 'Calculadora de fee Bitcoin com mempool',
    intro: 'Busque taxas atuais em sat/vB, estime custo por tamanho virtual e compare prioridades.',
    network: 'Rede',
    refresh: 'Atualizar mempool',
    vsize: 'Tamanho virtual (vB)',
    txProfile: 'Tipo de transacao',
    simpleSegwit: 'Carteira moderna comum',
    legacy: 'Carteira antiga',
    taproot: 'Taproot simples',
    customProfile: 'Custom tecnico',
    inputs: 'Entradas',
    outputs: 'Saidas',
    sendAmount: 'Valor a enviar (BTC)',
    recipient: 'Endereco destino (opcional)',
    simulation: 'Simulacao de envio',
    feeFormula: 'Conta usada',
    totalDebit: 'Total que sai da carteira',
    recipientGets: 'Destinatario recebe',
    minerGets: 'Minerador recebe',
    beginnerNote: 'Em Bitcoin, a taxa depende do tamanho da transacao em vbytes, nao do valor enviado. Uma transacao com muitos inputs custa mais mesmo enviando pouco.',
    timeHint: 'Estimativa pratica',
    custom: 'Fee custom sat/vB',
    priority: 'Prioridade',
    fastest: 'Mais rapida',
    halfHour: 'Meia hora',
    hour: 'Uma hora',
    economy: 'Economica',
    minimum: 'Minima',
    customLabel: 'Customizada',
    copied: 'Copiado.',
    copyError: 'Nao foi possivel copiar.',
    copy: 'Copiar resumo',
    exportJson: 'Exportar JSON',
  },
  en: {
    title: 'Bitcoin fee calculator with mempool',
    intro: 'Fetch current sat/vB fees, estimate cost by virtual size, and compare priorities.',
    network: 'Network',
    refresh: 'Refresh mempool',
    vsize: 'Virtual size (vB)',
    txProfile: 'Transaction type',
    simpleSegwit: 'Common modern wallet',
    legacy: 'Old wallet',
    taproot: 'Simple Taproot',
    customProfile: 'Technical custom',
    inputs: 'Inputs',
    outputs: 'Outputs',
    sendAmount: 'Amount to send (BTC)',
    recipient: 'Destination address (optional)',
    simulation: 'Send simulation',
    feeFormula: 'Formula used',
    totalDebit: 'Total leaving wallet',
    recipientGets: 'Recipient receives',
    minerGets: 'Miner receives',
    beginnerNote: 'In Bitcoin, the fee depends on transaction size in vbytes, not the amount sent. A transaction with many inputs costs more even when sending a small amount.',
    timeHint: 'Practical estimate',
    custom: 'Custom fee sat/vB',
    priority: 'Priority',
    fastest: 'Fastest',
    halfHour: 'Half hour',
    hour: 'One hour',
    economy: 'Economy',
    minimum: 'Minimum',
    customLabel: 'Custom',
    copied: 'Copied.',
    copyError: 'Could not copy.',
    copy: 'Copy summary',
    exportJson: 'Export JSON',
  },
  es: {
    title: 'Calculadora de fee Bitcoin con mempool',
    intro: 'Consulta tasas actuales en sat/vB, estima costo por tamaño virtual y compara prioridades.',
    network: 'Red',
    refresh: 'Actualizar mempool',
    vsize: 'Tamano virtual (vB)',
    txProfile: 'Tipo de transaccion',
    simpleSegwit: 'Wallet moderna comun',
    legacy: 'Wallet antigua',
    taproot: 'Taproot simple',
    customProfile: 'Custom tecnico',
    inputs: 'Entradas',
    outputs: 'Salidas',
    sendAmount: 'Valor a enviar (BTC)',
    recipient: 'Direccion destino (opcional)',
    simulation: 'Simulacion de envio',
    feeFormula: 'Cuenta usada',
    totalDebit: 'Total que sale de la wallet',
    recipientGets: 'Destinatario recibe',
    minerGets: 'Minero recibe',
    beginnerNote: 'En Bitcoin, la fee depende del tamano de la transaccion en vbytes, no del valor enviado. Una transaccion con muchos inputs cuesta mas aunque envies poco.',
    timeHint: 'Estimacion practica',
    custom: 'Fee custom sat/vB',
    priority: 'Prioridad',
    fastest: 'Mas rapida',
    halfHour: 'Media hora',
    hour: 'Una hora',
    economy: 'Economica',
    minimum: 'Minima',
    customLabel: 'Custom',
    copied: 'Copiado.',
    copyError: 'No fue posible copiar.',
    copy: 'Copiar resumen',
    exportJson: 'Exportar JSON',
  },
} satisfies Record<AppLocale, Record<string, string>>;

const satsToBtc = (sats: number): string => (sats / 100_000_000).toFixed(8);
const btcToSats = (btc: string): number => Math.max(0, Math.round((Number(btc) || 0) * 100_000_000));
type BitcoinFeeProfile = 'segwit' | 'legacy' | 'taproot' | 'custom';

const estimateBitcoinVsize = (profile: BitcoinFeeProfile, inputs: number, outputs: number, customVsize: string): number => {
  if (profile === 'custom') return Math.max(1, Number(customVsize) || 1);
  const safeInputs = Math.max(1, Math.floor(inputs));
  const safeOutputs = Math.max(1, Math.floor(outputs));
  if (profile === 'legacy') return Math.ceil(10 + safeInputs * 148 + safeOutputs * 34);
  if (profile === 'taproot') return Math.ceil(10.5 + safeInputs * 58 + safeOutputs * 43);
  return Math.ceil(10.5 + safeInputs * 68 + safeOutputs * 31);
};

export function BitcoinFeeMempoolTool({ locale = 'pt-br' }: Readonly<{ locale?: AppLocale }>) {
  const ui = feeUi[locale];
  const [network, setNetwork] = useState<BitcoinNetworkId>('mainnet');
  const [profile, setProfile] = useState<BitcoinFeeProfile>('segwit');
  const [inputs, setInputs] = useState('1');
  const [outputs, setOutputs] = useState('2');
  const [vsize, setVsize] = useState('140');
  const [customFee, setCustomFee] = useState('8');
  const [sendAmount, setSendAmount] = useState('0.001');
  const [recipient, setRecipient] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('halfHourFee');
  const [fees, setFees] = useState<Record<string, number> | null>(null);
  const [notice, setNotice] = useState<Notice>(null);
  const estimatedVsize = estimateBitcoinVsize(profile, Number(inputs) || 1, Number(outputs) || 1, vsize);

  const rows = useMemo(() => {
    const source = fees ?? { fastestFee: 12, halfHourFee: 8, hourFee: 5, economyFee: 3, minimumFee: 1, customFee: Number(customFee) || 1 };
    const labels: Record<string, string> = {
      fastestFee: ui.fastest,
      halfHourFee: ui.halfHour,
      hourFee: ui.hour,
      economyFee: ui.economy,
      minimumFee: ui.minimum,
      customFee: ui.customLabel,
    };
    return Object.entries(source).map(([label, rate]) => {
      const sats = Math.ceil(estimatedVsize * rate);
      return { id: label, label: labels[label] ?? label, rate, sats, btc: satsToBtc(sats) };
    });
  }, [customFee, estimatedVsize, fees, ui.customLabel, ui.economy, ui.fastest, ui.halfHour, ui.hour, ui.minimum]);
  const selectedRow = rows.find((row) => row.id === selectedPriority) ?? rows[0];
  const sendSats = btcToSats(sendAmount);
  const totalSats = sendSats + (selectedRow?.sats ?? 0);
  const formula = `${estimatedVsize} vB x ${selectedRow?.rate ?? 0} sat/vB = ${selectedRow?.sats ?? 0} sats (${satsToBtc(selectedRow?.sats ?? 0)} BTC)`;
  const json = JSON.stringify({ network, profile, inputs, outputs, recipient, amountBtc: sendAmount, vsize: estimatedVsize, selected: selectedRow, totalSats, rows }, null, 2);

  const refresh = async () => {
    try {
      const next = await fetchRecommendedFeeRate(network);
      setFees({ ...next, customFee: Number(customFee) || next.hourFee });
      setNotice(null);
    } catch (error) {
      setNotice({ tone: 'error', text: error instanceof Error ? error.message : 'Mempool error.' });
    }
  };

  return (
    <Card className="space-y-5">
      <ToolHeader title={ui.title} intro={ui.intro} />
      <section className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h4 className="text-sm font-semibold text-slate-900">{ui.simulation}</h4>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="space-y-2"><span className="text-sm font-semibold text-slate-800">{ui.sendAmount}</span><Input type="number" step="0.00000001" value={sendAmount} onChange={(event) => setSendAmount(event.target.value)} /></label>
          <label className="space-y-2"><span className="text-sm font-semibold text-slate-800">{ui.recipient}</span><Input value={recipient} onChange={(event) => setRecipient(event.target.value)} placeholder="bc1..." /></label>
          <label className="space-y-2"><span className="text-sm font-semibold text-slate-800">{ui.txProfile}</span><Select value={profile} onChange={(event) => setProfile(event.target.value as BitcoinFeeProfile)}><option value="segwit">{ui.simpleSegwit}</option><option value="taproot">{ui.taproot}</option><option value="legacy">{ui.legacy}</option><option value="custom">{ui.customProfile}</option></Select></label>
          <label className="space-y-2"><span className="text-sm font-semibold text-slate-800">{ui.priority}</span><Select value={selectedPriority} onChange={(event) => setSelectedPriority(event.target.value)}>{rows.map((row) => <option key={row.id} value={row.id}>{row.label} - {row.rate} sat/vB</option>)}</Select></label>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <label className="space-y-2"><span className="text-sm font-semibold text-slate-800">{ui.inputs}</span><Input type="number" min={1} value={inputs} onChange={(event) => setInputs(event.target.value)} disabled={profile === 'custom'} /></label>
          <label className="space-y-2"><span className="text-sm font-semibold text-slate-800">{ui.outputs}</span><Input type="number" min={1} value={outputs} onChange={(event) => setOutputs(event.target.value)} disabled={profile === 'custom'} /></label>
          <label className="space-y-2"><span className="text-sm font-semibold text-slate-800">{ui.vsize}</span><Input type="number" value={profile === 'custom' ? vsize : String(estimatedVsize)} disabled={profile !== 'custom'} onChange={(event) => setVsize(event.target.value)} /></label>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900"><p className="text-xs font-semibold uppercase tracking-wide">{ui.recipientGets}</p><p className="mt-1 font-mono text-sm">{satsToBtc(sendSats)} BTC</p></div>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-900"><p className="text-xs font-semibold uppercase tracking-wide">{ui.minerGets}</p><p className="mt-1 font-mono text-sm">{selectedRow?.sats ?? 0} sats</p></div>
          <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-3 text-cyan-900"><p className="text-xs font-semibold uppercase tracking-wide">{ui.totalDebit}</p><p className="mt-1 font-mono text-sm">{satsToBtc(totalSats)} BTC</p></div>
        </div>
        <div className="grid gap-3 lg:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white p-3"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{ui.feeFormula}</p><p className="mt-1 text-sm font-semibold text-slate-900">{formula}</p></div>
          <div className="rounded-lg border border-slate-200 bg-white p-3"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{ui.timeHint}</p><p className="mt-1 text-sm text-slate-700">{ui.beginnerNote}</p></div>
        </div>
      </section>
      <div className="grid gap-4 md:grid-cols-3">
        <label className="space-y-2"><span className="text-sm font-semibold text-slate-800">{ui.network}</span><Select value={network} onChange={(event) => setNetwork(event.target.value as BitcoinNetworkId)}><option value="mainnet">Mainnet</option><option value="testnet">Testnet4</option></Select></label>
        <label className="space-y-2"><span className="text-sm font-semibold text-slate-800">{ui.vsize}</span><Input type="number" value={String(estimatedVsize)} disabled /></label>
        <label className="space-y-2"><span className="text-sm font-semibold text-slate-800">{ui.custom}</span><Input type="number" value={customFee} onChange={(event) => setCustomFee(event.target.value)} /></label>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => void refresh()}>{ui.refresh}</Button>
        <Button variant="secondary" onClick={() => void copyText(json, setNotice, ui.copied, ui.copyError)}>{ui.copy}</Button>
        <Button variant="secondary" onClick={() => downloadText(json, 'bitcoin-fees.json', 'application/json')}>{ui.exportJson}</Button>
      </div>
      <NoticeBox notice={notice} />
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-3 py-2">{ui.priority}</th><th className="px-3 py-2">sat/vB</th><th className="px-3 py-2">sats</th><th className="px-3 py-2">BTC</th></tr></thead>
          <tbody className="divide-y divide-slate-100 bg-white">{rows.map((row) => <tr key={row.label} className={row.id === selectedPriority ? 'bg-brand-50' : ''}><td className="px-3 py-2 font-semibold">{row.label}</td><td className="px-3 py-2">{row.rate}</td><td className="px-3 py-2">{row.sats}</td><td className="px-3 py-2 font-mono text-xs">{row.btc}</td></tr>)}</tbody>
        </table>
      </div>
    </Card>
  );
}

const decoderUi = {
  'pt-br': {
    title: 'Bitcoin address e TX decoder read-only',
    intro: 'Valide enderecos e decodifique transacoes Bitcoin hex sem assinar, transmitir ou pedir seed.',
    network: 'Rede',
    address: 'Endereco Bitcoin',
    inspect: 'Validar endereco',
    tx: 'Transacao raw hex',
    decode: 'Decodificar TX',
    copyJson: 'Copiar JSON',
    exportJson: 'Exportar JSON',
    copied: 'Copiado.',
    copyError: 'Nao foi possivel copiar.',
  },
  en: {
    title: 'Bitcoin address and TX decoder read-only',
    intro: 'Validate addresses and decode Bitcoin raw hex transactions without signing, broadcasting, or asking for a seed.',
    network: 'Network',
    address: 'Bitcoin address',
    inspect: 'Validate address',
    tx: 'Raw transaction hex',
    decode: 'Decode TX',
    copyJson: 'Copy JSON',
    exportJson: 'Export JSON',
    copied: 'Copied.',
    copyError: 'Could not copy.',
  },
  es: {
    title: 'Bitcoin address y TX decoder read-only',
    intro: 'Valida direcciones y decodifica transacciones Bitcoin hex sin firmar, transmitir ni pedir seed.',
    network: 'Red',
    address: 'Direccion Bitcoin',
    inspect: 'Validar direccion',
    tx: 'Transaccion raw hex',
    decode: 'Decodificar TX',
    copyJson: 'Copiar JSON',
    exportJson: 'Exportar JSON',
    copied: 'Copiado.',
    copyError: 'No fue posible copiar.',
  },
} satisfies Record<AppLocale, Record<string, string>>;

export function BitcoinAddressTxDecoderTool({ locale = 'pt-br' }: Readonly<{ locale?: AppLocale }>) {
  const ui = decoderUi[locale];
  const [network, setNetwork] = useState<BitcoinReadonlyNetwork>('mainnet');
  const [addressInput, setAddressInput] = useState('bc1qexample');
  const [txHex, setTxHex] = useState('');
  const [addressResult, setAddressResult] = useState<ReturnType<typeof inspectBitcoinAddress> | null>(null);
  const [txResult, setTxResult] = useState<BitcoinTxDecodeResult | null>(null);
  const [notice, setNotice] = useState<Notice>(null);
  const json = JSON.stringify({ address: addressResult, transaction: txResult }, null, 2);

  return (
    <Card className="space-y-5">
      <ToolHeader title={ui.title} intro={ui.intro} />
      <label className="space-y-2 block"><span className="text-sm font-semibold text-slate-800">{ui.network}</span><Select value={network} onChange={(event) => setNetwork(event.target.value as BitcoinReadonlyNetwork)}><option value="mainnet">Mainnet</option><option value="testnet">Testnet</option></Select></label>
      <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <label className="space-y-2 block"><span className="text-sm font-semibold text-slate-800">{ui.address}</span><Input value={addressInput} onChange={(event) => setAddressInput(event.target.value)} className="font-mono" /></label>
        <Button variant="secondary" onClick={() => setAddressResult(inspectBitcoinAddress(addressInput, network))}>{ui.inspect}</Button>
        {addressResult ? <pre className={`overflow-auto rounded-lg p-3 text-xs ${addressResult.ok ? 'bg-emerald-50 text-emerald-900' : 'bg-red-50 text-red-900'}`}>{JSON.stringify(addressResult, null, 2)}</pre> : null}
      </section>
      <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <label className="space-y-2 block"><span className="text-sm font-semibold text-slate-800">{ui.tx}</span><Textarea value={txHex} onChange={(event) => setTxHex(event.target.value)} className="min-h-[180px] font-mono text-xs" /></label>
        <Button variant="secondary" onClick={() => setTxResult(decodeBitcoinTransaction(txHex, network))}>{ui.decode}</Button>
        {txResult ? <pre className={`max-h-[460px] overflow-auto rounded-lg p-3 text-xs ${txResult.ok ? 'bg-white text-slate-800' : 'bg-red-50 text-red-900'}`}>{JSON.stringify(txResult, null, 2)}</pre> : null}
      </section>
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" disabled={!addressResult && !txResult} onClick={() => void copyText(json, setNotice, ui.copied, ui.copyError)}>{ui.copyJson}</Button>
        <Button variant="secondary" disabled={!addressResult && !txResult} onClick={() => downloadText(json, 'bitcoin-decoder.json', 'application/json')}>{ui.exportJson}</Button>
      </div>
      <NoticeBox notice={notice} />
    </Card>
  );
}
