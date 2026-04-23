'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import {
  buildCompoundProjection,
  calculateRequiredMonthlyContribution,
  calculateRequiredRate,
  groupProjectionByYear,
  ratePercentToMonthly,
  type CompoundProjectionInput,
  type CompoundProjectionResult,
  type ContributionTiming,
  type PeriodFrequency,
  type ProjectionRow,
  type RateFrequency,
} from '@/lib/compound-interest';
import { type AppLocale } from '@/lib/i18n/config';

type CompoundInterestToolProps = Readonly<{
  locale?: AppLocale;
}>;

type TabId = 'invest' | 'goal' | 'rate';

type Ui = {
  title: string;
  intro: string;
  tabs: {
    invest: string;
    goal: string;
    rate: string;
  };
  initialAmount: string;
  monthlyContribution: string;
  targetAmount: string;
  rateLabel: string;
  rateFrequency: string;
  periodLabel: string;
  periodFrequency: string;
  contributionTiming: string;
  timingEnd: string;
  timingStart: string;
  frequencyMonthly: string;
  frequencyYearly: string;
  periodMonths: string;
  periodYears: string;
  compareSimple: string;
  inflationLabel: string;
  calculate: string;
  clear: string;
  example: string;
  conversionHint: string;
  resultTitle: string;
  finalAmount: string;
  totalInvested: string;
  totalInterest: string;
  profitability: string;
  realValue: string;
  simpleComparisonTitle: string;
  simpleFinalAmount: string;
  simpleInterest: string;
  simpleGap: string;
  chartTitle: string;
  chartLegendInvested: string;
  chartLegendAccumulated: string;
  tableTitle: string;
  tableMonthly: string;
  tableYearly: string;
  tablePeriod: string;
  tableOpening: string;
  tableContribution: string;
  tableInterest: string;
  tableClosing: string;
  tableInvested: string;
  showAllRows: string;
  showLessRows: string;
  summaryTitle: string;
  copySummary: string;
  downloadCsv: string;
  shareLink: string;
  copied: string;
  localNote: string;
  invalidInput: string;
  goalResult: string;
  rateResult: string;
  copyError: string;
  shareError: string;
};

const uiByLocale: Record<AppLocale, Ui> = {
  'pt-br': {
    title: 'Calculadora de Juros Compostos Online',
    intro:
      'Simule investimento com aporte mensal, descubra aporte necessario para bater meta e calcule a taxa exigida para chegar ao valor final desejado.',
    tabs: {
      invest: 'Investir',
      goal: 'Atingir meta',
      rate: 'Descobrir taxa',
    },
    initialAmount: 'Valor inicial',
    monthlyContribution: 'Aporte mensal',
    targetAmount: 'Valor final desejado',
    rateLabel: 'Taxa de juros',
    rateFrequency: 'Frequencia da taxa',
    periodLabel: 'Prazo',
    periodFrequency: 'Frequencia do prazo',
    contributionTiming: 'Momento do aporte',
    timingEnd: 'Aporte no fim do periodo',
    timingStart: 'Aporte no inicio do periodo',
    frequencyMonthly: 'Ao mes',
    frequencyYearly: 'Ao ano',
    periodMonths: 'Meses',
    periodYears: 'Anos',
    compareSimple: 'Comparar com juros simples',
    inflationLabel: 'Inflacao anual (opcional)',
    calculate: 'Calcular',
    clear: 'Limpar campos',
    example: 'Exemplo rapido: R$ 1.000 iniciais + R$ 300/mes por 5 anos a 1% ao mes',
    conversionHint:
      'Quando taxa e prazo usam unidades diferentes, a ferramenta converte automaticamente para taxa equivalente mensal.',
    resultTitle: 'Resultado da simulacao',
    finalAmount: 'Valor final',
    totalInvested: 'Total investido',
    totalInterest: 'Total em juros',
    profitability: 'Rentabilidade',
    realValue: 'Valor real (descontando inflacao)',
    simpleComparisonTitle: 'Comparacao com juros simples',
    simpleFinalAmount: 'Valor final no simples',
    simpleInterest: 'Juros no simples',
    simpleGap: 'Diferenca para compostos',
    chartTitle: 'Evolucao do patrimonio',
    chartLegendInvested: 'Total aportado',
    chartLegendAccumulated: 'Patrimonio acumulado',
    tableTitle: 'Tabela detalhada',
    tableMonthly: 'Visao mensal',
    tableYearly: 'Visao anual',
    tablePeriod: 'Periodo',
    tableOpening: 'Saldo inicial',
    tableContribution: 'Aporte',
    tableInterest: 'Juros',
    tableClosing: 'Saldo final',
    tableInvested: 'Total investido',
    showAllRows: 'Mostrar todas as linhas',
    showLessRows: 'Mostrar menos',
    summaryTitle: 'Resumo em texto',
    copySummary: 'Copiar resumo',
    downloadCsv: 'Baixar CSV',
    shareLink: 'Copiar link compartilhavel',
    copied: 'Copiado',
    localNote:
      'Calculo local no navegador. Nenhum valor e enviado para servidor por padrao.',
    invalidInput: 'Preencha valores validos para calcular.',
    goalResult: 'Aporte mensal necessario para bater a meta',
    rateResult: 'Taxa necessaria para bater a meta',
    copyError: 'Nao foi possivel copiar agora. Tente novamente.',
    shareError: 'Nao foi possivel gerar link compartilhavel neste dispositivo.',
  },
  en: {
    title: 'Compound Interest Calculator Online',
    intro:
      'Simulate monthly-contribution investing, find the contribution needed to hit a target, and estimate required rate for a final amount.',
    tabs: {
      invest: 'Invest',
      goal: 'Reach goal',
      rate: 'Find rate',
    },
    initialAmount: 'Initial amount',
    monthlyContribution: 'Monthly contribution',
    targetAmount: 'Target final amount',
    rateLabel: 'Interest rate',
    rateFrequency: 'Rate frequency',
    periodLabel: 'Time horizon',
    periodFrequency: 'Period frequency',
    contributionTiming: 'Contribution timing',
    timingEnd: 'Contribution at period end',
    timingStart: 'Contribution at period start',
    frequencyMonthly: 'Per month',
    frequencyYearly: 'Per year',
    periodMonths: 'Months',
    periodYears: 'Years',
    compareSimple: 'Compare with simple interest',
    inflationLabel: 'Annual inflation (optional)',
    calculate: 'Calculate',
    clear: 'Clear fields',
    example: 'Quick example: $1,000 initial + $300/month for 5 years at 1% monthly',
    conversionHint:
      'When rate and period units differ, the tool converts to equivalent monthly rate automatically.',
    resultTitle: 'Simulation result',
    finalAmount: 'Final amount',
    totalInvested: 'Total invested',
    totalInterest: 'Total interest',
    profitability: 'Profitability',
    realValue: 'Real value (inflation-adjusted)',
    simpleComparisonTitle: 'Simple interest comparison',
    simpleFinalAmount: 'Simple final amount',
    simpleInterest: 'Simple interest',
    simpleGap: 'Gap vs compound',
    chartTitle: 'Portfolio growth',
    chartLegendInvested: 'Total invested',
    chartLegendAccumulated: 'Accumulated balance',
    tableTitle: 'Detailed table',
    tableMonthly: 'Monthly view',
    tableYearly: 'Yearly view',
    tablePeriod: 'Period',
    tableOpening: 'Opening balance',
    tableContribution: 'Contribution',
    tableInterest: 'Interest',
    tableClosing: 'Closing balance',
    tableInvested: 'Total invested',
    showAllRows: 'Show all rows',
    showLessRows: 'Show fewer rows',
    summaryTitle: 'Text summary',
    copySummary: 'Copy summary',
    downloadCsv: 'Download CSV',
    shareLink: 'Copy shareable link',
    copied: 'Copied',
    localNote: 'Local browser calculation. No automatic server upload by default.',
    invalidInput: 'Enter valid values to calculate.',
    goalResult: 'Required monthly contribution to hit the target',
    rateResult: 'Required rate to hit the target',
    copyError: 'Could not copy right now. Please try again.',
    shareError: 'Could not generate shareable link on this device.',
  },
  es: {
    title: 'Calculadora de Interes Compuesto Online',
    intro:
      'Simula inversion con aporte mensual, calcula el aporte para una meta y encuentra la tasa necesaria para llegar a un valor final.',
    tabs: {
      invest: 'Invertir',
      goal: 'Alcanzar meta',
      rate: 'Descubrir tasa',
    },
    initialAmount: 'Valor inicial',
    monthlyContribution: 'Aporte mensual',
    targetAmount: 'Valor final objetivo',
    rateLabel: 'Tasa de interes',
    rateFrequency: 'Frecuencia de tasa',
    periodLabel: 'Plazo',
    periodFrequency: 'Frecuencia del plazo',
    contributionTiming: 'Momento del aporte',
    timingEnd: 'Aporte al final del periodo',
    timingStart: 'Aporte al inicio del periodo',
    frequencyMonthly: 'Al mes',
    frequencyYearly: 'Al ano',
    periodMonths: 'Meses',
    periodYears: 'Anos',
    compareSimple: 'Comparar con interes simple',
    inflationLabel: 'Inflacion anual (opcional)',
    calculate: 'Calcular',
    clear: 'Limpiar campos',
    example: 'Ejemplo rapido: $1,000 inicial + $300/mes por 5 anos al 1% mensual',
    conversionHint:
      'Si tasa y plazo usan unidades distintas, la herramienta convierte a tasa mensual equivalente.',
    resultTitle: 'Resultado de la simulacion',
    finalAmount: 'Valor final',
    totalInvested: 'Total invertido',
    totalInterest: 'Total en intereses',
    profitability: 'Rentabilidad',
    realValue: 'Valor real (descontando inflacion)',
    simpleComparisonTitle: 'Comparacion con interes simple',
    simpleFinalAmount: 'Valor final simple',
    simpleInterest: 'Interes simple',
    simpleGap: 'Diferencia vs compuesto',
    chartTitle: 'Evolucion del patrimonio',
    chartLegendInvested: 'Total aportado',
    chartLegendAccumulated: 'Patrimonio acumulado',
    tableTitle: 'Tabla detallada',
    tableMonthly: 'Vista mensual',
    tableYearly: 'Vista anual',
    tablePeriod: 'Periodo',
    tableOpening: 'Saldo inicial',
    tableContribution: 'Aporte',
    tableInterest: 'Interes',
    tableClosing: 'Saldo final',
    tableInvested: 'Total invertido',
    showAllRows: 'Mostrar todas las filas',
    showLessRows: 'Mostrar menos filas',
    summaryTitle: 'Resumen en texto',
    copySummary: 'Copiar resumen',
    downloadCsv: 'Descargar CSV',
    shareLink: 'Copiar enlace compartible',
    copied: 'Copiado',
    localNote: 'Calculo local en navegador. No se envian datos al servidor por defecto.',
    invalidInput: 'Completa valores validos para calcular.',
    goalResult: 'Aporte mensual necesario para alcanzar la meta',
    rateResult: 'Tasa necesaria para alcanzar la meta',
    copyError: 'No fue posible copiar ahora. Intentalo de nuevo.',
    shareError: 'No fue posible generar enlace compartible en este dispositivo.',
  },
};

const chartWidth = 720;
const chartHeight = 260;
const chartPadding = 32;
const defaultRowLimit = 24;
const storageKey = 'tool:compound-interest:v1';

const localeToIntl: Record<AppLocale, string> = {
  'pt-br': 'pt-BR',
  en: 'en-US',
  es: 'es-ES',
};

const localeToCurrency: Record<AppLocale, string> = {
  'pt-br': 'BRL',
  en: 'USD',
  es: 'EUR',
};

const parseNumberInput = (value: string): number | null => {
  const trimmed = value
    .trim()
    .replace(/\s+/g, '')
    .replace(/[^\d,.-]/g, '');

  if (!trimmed) {
    return null;
  }

  const hasComma = trimmed.includes(',');
  const hasDot = trimmed.includes('.');

  let normalized = trimmed;

  if (hasComma && hasDot) {
    const commaIndex = trimmed.lastIndexOf(',');
    const dotIndex = trimmed.lastIndexOf('.');

    if (commaIndex > dotIndex) {
      normalized = trimmed.replace(/\./g, '').replace(',', '.');
    } else {
      normalized = trimmed.replace(/,/g, '');
    }
  } else if (hasComma) {
    normalized = trimmed.replace(',', '.');
  }

  const parsed = Number(normalized);

  if (!Number.isFinite(parsed)) {
    return null;
  }

  return parsed;
};

const parsePositiveIntInput = (value: string): number | null => {
  const parsed = parseNumberInput(value);

  if (parsed === null) {
    return null;
  }

  const rounded = Math.floor(parsed);

  if (!Number.isFinite(rounded) || rounded <= 0) {
    return null;
  }

  return rounded;
};

const formatCurrency = (value: number, locale: AppLocale): string =>
  new Intl.NumberFormat(localeToIntl[locale], {
    style: 'currency',
    currency: localeToCurrency[locale],
    maximumFractionDigits: 2,
  }).format(value);

const formatPercent = (value: number, locale: AppLocale, digits = 2): string =>
  new Intl.NumberFormat(localeToIntl[locale], {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value) + '%';

const csvFileNameByLocale: Record<AppLocale, string> = {
  'pt-br': 'simulacao-juros-compostos.csv',
  en: 'compound-interest-simulation.csv',
  es: 'simulacion-interes-compuesto.csv',
};

const sanitizeCsvHeader = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

const buildProjectionCsv = (rows: ProjectionRow[], ui: Ui): string => {
  const header = [
    ui.tablePeriod,
    ui.tableOpening,
    ui.tableContribution,
    ui.tableInterest,
    ui.tableClosing,
    ui.tableInvested,
  ]
    .map((column) => sanitizeCsvHeader(column))
    .join(',');

  const body = rows
    .map((row) =>
      [
        row.period,
        row.openingBalance.toFixed(2),
        row.contribution.toFixed(2),
        row.interest.toFixed(2),
        row.closingBalance.toFixed(2),
        row.totalInvested.toFixed(2),
      ].join(','),
    )
    .join('\n');

  return `${header}\n${body}`;
};

const downloadText = (filename: string, content: string, mimeType: string): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};

const chartPoints = (
  rows: ProjectionRow[],
  key: 'totalInvested' | 'closingBalance',
): string => {
  if (!rows.length) {
    return '';
  }

  const maxValue = Math.max(
    ...rows.map((row) => Math.max(row.totalInvested, row.closingBalance)),
    1,
  );

  return rows
    .map((row, index) => {
      const x =
        chartPadding +
        (index / Math.max(1, rows.length - 1)) * (chartWidth - chartPadding * 2);
      const value = key === 'totalInvested' ? row.totalInvested : row.closingBalance;
      const y = chartHeight - chartPadding - (value / maxValue) * (chartHeight - chartPadding * 2);

      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');
};

const summarizeProjection = (
  result: CompoundProjectionResult,
  locale: AppLocale,
  ui: Ui,
): string => {
  const formatter = (value: number) => formatCurrency(value, locale);

  return [
    `${ui.finalAmount}: ${formatter(result.finalAmount)}.`,
    `${ui.totalInvested}: ${formatter(result.totalInvested)}.`,
    `${ui.totalInterest}: ${formatter(result.totalInterest)}.`,
    `${ui.profitability}: ${formatPercent(result.profitabilityPercent, locale)}.`,
  ].join(' ');
};

const inflationAdjustedValue = (value: number, annualInflationPercent: number, months: number): number => {
  if (!Number.isFinite(annualInflationPercent) || annualInflationPercent <= 0) {
    return value;
  }

  const monthlyInflation = ratePercentToMonthly(annualInflationPercent, 'yearly');
  return value / Math.pow(1 + monthlyInflation, months);
};

const tabClassName = (active: boolean): string =>
  [
    'rounded-lg px-3 py-2 text-sm font-semibold transition-colors',
    active
      ? 'bg-brand-600 text-white'
      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
  ].join(' ');

export function CompoundInterestTool({ locale = 'pt-br' }: CompoundInterestToolProps) {
  const ui = uiByLocale[locale];
  const [activeTab, setActiveTab] = useState<TabId>('invest');

  const [initialAmountInput, setInitialAmountInput] = useState('1000');
  const [monthlyContributionInput, setMonthlyContributionInput] = useState('300');
  const [rateInput, setRateInput] = useState('1');
  const [rateFrequency, setRateFrequency] = useState<RateFrequency>('monthly');
  const [periodInput, setPeriodInput] = useState('5');
  const [periodFrequency, setPeriodFrequency] = useState<PeriodFrequency>('years');
  const [contributionTiming, setContributionTiming] = useState<ContributionTiming>('end');
  const [compareSimple, setCompareSimple] = useState(true);
  const [inflationInput, setInflationInput] = useState('');
  const [tableMode, setTableMode] = useState<'monthly' | 'yearly'>('monthly');
  const [showAllRows, setShowAllRows] = useState(false);

  const [goalTargetInput, setGoalTargetInput] = useState('100000');
  const [goalInitialInput, setGoalInitialInput] = useState('1000');
  const [goalRateInput, setGoalRateInput] = useState('1');
  const [goalRateFrequency, setGoalRateFrequency] = useState<RateFrequency>('monthly');
  const [goalPeriodInput, setGoalPeriodInput] = useState('10');
  const [goalPeriodFrequency, setGoalPeriodFrequency] = useState<PeriodFrequency>('years');
  const [goalContributionTiming, setGoalContributionTiming] =
    useState<ContributionTiming>('end');

  const [rateTargetInput, setRateTargetInput] = useState('100000');
  const [rateInitialInput, setRateInitialInput] = useState('1000');
  const [rateContributionInput, setRateContributionInput] = useState('300');
  const [ratePeriodInput, setRatePeriodInput] = useState('10');
  const [ratePeriodFrequency, setRatePeriodFrequency] = useState<PeriodFrequency>('years');
  const [rateContributionTiming, setRateContributionTiming] = useState<ContributionTiming>('end');

  const [projectionResult, setProjectionResult] = useState<CompoundProjectionResult | null>(null);
  const [goalContributionResult, setGoalContributionResult] = useState<number | null>(null);
  const [goalProjectionResult, setGoalProjectionResult] =
    useState<CompoundProjectionResult | null>(null);
  const [rateResult, setRateResult] = useState<{ monthlyRate: number; yearlyRate: number } | null>(
    null,
  );

  const [errorMessage, setErrorMessage] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(globalThis.location.search);

    if (params.has('vi')) {
      setInitialAmountInput(params.get('vi') ?? '1000');
    }
    if (params.has('ap')) {
      setMonthlyContributionInput(params.get('ap') ?? '300');
    }
    if (params.has('tx')) {
      setRateInput(params.get('tx') ?? '1');
    }
    if (params.has('txf')) {
      setRateFrequency((params.get('txf') as RateFrequency) ?? 'monthly');
    }
    if (params.has('p')) {
      setPeriodInput(params.get('p') ?? '5');
    }
    if (params.has('pf')) {
      setPeriodFrequency((params.get('pf') as PeriodFrequency) ?? 'years');
    }
    if (params.has('tm')) {
      setContributionTiming((params.get('tm') as ContributionTiming) ?? 'end');
    }
    if (params.has('inf')) {
      setInflationInput(params.get('inf') ?? '');
    }

    if (!params.size) {
      const stored = globalThis.localStorage.getItem(storageKey);

      if (!stored) {
        return;
      }

      try {
        const parsed = JSON.parse(stored) as {
          initialAmountInput?: string;
          monthlyContributionInput?: string;
          rateInput?: string;
          rateFrequency?: RateFrequency;
          periodInput?: string;
          periodFrequency?: PeriodFrequency;
          contributionTiming?: ContributionTiming;
          inflationInput?: string;
        };

        if (parsed.initialAmountInput) {
          setInitialAmountInput(parsed.initialAmountInput);
        }
        if (parsed.monthlyContributionInput) {
          setMonthlyContributionInput(parsed.monthlyContributionInput);
        }
        if (parsed.rateInput) {
          setRateInput(parsed.rateInput);
        }
        if (parsed.rateFrequency) {
          setRateFrequency(parsed.rateFrequency);
        }
        if (parsed.periodInput) {
          setPeriodInput(parsed.periodInput);
        }
        if (parsed.periodFrequency) {
          setPeriodFrequency(parsed.periodFrequency);
        }
        if (parsed.contributionTiming) {
          setContributionTiming(parsed.contributionTiming);
        }
        if (parsed.inflationInput) {
          setInflationInput(parsed.inflationInput);
        }
      } catch {
        globalThis.localStorage.removeItem(storageKey);
      }
    }
  }, []);

  useEffect(() => {
    globalThis.localStorage.setItem(
      storageKey,
      JSON.stringify({
        initialAmountInput,
        monthlyContributionInput,
        rateInput,
        rateFrequency,
        periodInput,
        periodFrequency,
        contributionTiming,
        inflationInput,
      }),
    );
  }, [
    initialAmountInput,
    monthlyContributionInput,
    rateInput,
    rateFrequency,
    periodInput,
    periodFrequency,
    contributionTiming,
    inflationInput,
  ]);

  const calculateInvestment = () => {
    const initialAmount = parseNumberInput(initialAmountInput);
    const monthlyContribution = parseNumberInput(monthlyContributionInput);
    const ratePercent = parseNumberInput(rateInput);
    const periodValue = parsePositiveIntInput(periodInput);

    if (
      initialAmount === null ||
      monthlyContribution === null ||
      ratePercent === null ||
      periodValue === null
    ) {
      setErrorMessage(ui.invalidInput);
      return;
    }

    const payload: CompoundProjectionInput = {
      initialAmount,
      monthlyContribution,
      ratePercent,
      rateFrequency,
      periodValue,
      periodFrequency,
      contributionTiming,
    };

    const result = buildCompoundProjection(payload);
    setProjectionResult(result);
    setErrorMessage('');
  };

  const calculateGoal = () => {
    const targetAmount = parseNumberInput(goalTargetInput);
    const initialAmount = parseNumberInput(goalInitialInput);
    const ratePercent = parseNumberInput(goalRateInput);
    const periodValue = parsePositiveIntInput(goalPeriodInput);

    if (
      targetAmount === null ||
      initialAmount === null ||
      ratePercent === null ||
      periodValue === null
    ) {
      setErrorMessage(ui.invalidInput);
      return;
    }

    const monthlyContribution = calculateRequiredMonthlyContribution({
      targetAmount,
      initialAmount,
      ratePercent,
      rateFrequency: goalRateFrequency,
      periodValue,
      periodFrequency: goalPeriodFrequency,
      contributionTiming: goalContributionTiming,
    });

    const validationProjection = buildCompoundProjection({
      initialAmount,
      monthlyContribution,
      ratePercent,
      rateFrequency: goalRateFrequency,
      periodValue,
      periodFrequency: goalPeriodFrequency,
      contributionTiming: goalContributionTiming,
    });

    setGoalContributionResult(monthlyContribution);
    setGoalProjectionResult(validationProjection);
    setErrorMessage('');
  };

  const calculateRate = () => {
    const targetAmount = parseNumberInput(rateTargetInput);
    const initialAmount = parseNumberInput(rateInitialInput);
    const monthlyContribution = parseNumberInput(rateContributionInput);
    const periodValue = parsePositiveIntInput(ratePeriodInput);

    if (
      targetAmount === null ||
      initialAmount === null ||
      monthlyContribution === null ||
      periodValue === null
    ) {
      setErrorMessage(ui.invalidInput);
      return;
    }

    const solved = calculateRequiredRate({
      targetAmount,
      initialAmount,
      monthlyContribution,
      periodValue,
      periodFrequency: ratePeriodFrequency,
      contributionTiming: rateContributionTiming,
    });

    setRateResult(solved);
    setErrorMessage('');
  };

  useEffect(() => {
    calculateInvestment();
    // initial render hydration
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentRows = useMemo(() => {
    if (!projectionResult) {
      return [];
    }

    if (tableMode === 'yearly') {
      return groupProjectionByYear(projectionResult.rows);
    }

    return projectionResult.rows;
  }, [projectionResult, tableMode]);

  const rowsForRender = showAllRows ? currentRows : currentRows.slice(0, defaultRowLimit);

  const chartRows = useMemo(() => {
    if (!projectionResult) {
      return [];
    }

    if (projectionResult.rows.length <= 180) {
      return projectionResult.rows;
    }

    const step = Math.ceil(projectionResult.rows.length / 180);
    return projectionResult.rows.filter((_, index) => index % step === 0);
  }, [projectionResult]);

  const investedLine = useMemo(() => chartPoints(chartRows, 'totalInvested'), [chartRows]);
  const accumulatedLine = useMemo(() => chartPoints(chartRows, 'closingBalance'), [chartRows]);

  const inflationValue = parseNumberInput(inflationInput);

  const inflationAdjusted =
    projectionResult && inflationValue && inflationValue > 0
      ? inflationAdjustedValue(projectionResult.finalAmount, inflationValue, projectionResult.months)
      : null;

  const summaryText = projectionResult
    ? summarizeProjection(projectionResult, locale, ui)
    : '';

  const copyText = async (value: string) => {
    if (!value) {
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setFeedbackMessage(ui.copied);
      globalThis.setTimeout(() => {
        setFeedbackMessage('');
      }, 1400);
    } catch {
      setFeedbackMessage(ui.copyError);
    }
  };

  const copyShareLink = async () => {
    try {
      const query = new URLSearchParams();
      query.set('vi', initialAmountInput);
      query.set('ap', monthlyContributionInput);
      query.set('tx', rateInput);
      query.set('txf', rateFrequency);
      query.set('p', periodInput);
      query.set('pf', periodFrequency);
      query.set('tm', contributionTiming);
      if (inflationInput) {
        query.set('inf', inflationInput);
      }

      const link = `${globalThis.location.origin}${globalThis.location.pathname}?${query.toString()}`;
      await navigator.clipboard.writeText(link);
      setFeedbackMessage(ui.copied);
      globalThis.setTimeout(() => {
        setFeedbackMessage('');
      }, 1400);
    } catch {
      setFeedbackMessage(ui.shareError);
    }
  };

  return (
    <Card className="space-y-5">
      <header className="rounded-xl border border-brand-200 bg-gradient-to-r from-brand-50 to-indigo-50 p-4">
        <h3 className="text-lg font-semibold text-slate-900">{ui.title}</h3>
        <p className="mt-1 text-sm text-slate-700">{ui.intro}</p>
      </header>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={tabClassName(activeTab === 'invest')}
          onClick={() => setActiveTab('invest')}
        >
          {ui.tabs.invest}
        </button>
        <button
          type="button"
          className={tabClassName(activeTab === 'goal')}
          onClick={() => setActiveTab('goal')}
        >
          {ui.tabs.goal}
        </button>
        <button
          type="button"
          className={tabClassName(activeTab === 'rate')}
          onClick={() => setActiveTab('rate')}
        >
          {ui.tabs.rate}
        </button>
      </div>

      <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
        {ui.example}
        <br />
        {ui.conversionHint}
      </p>

      {activeTab === 'invest' ? (
        <section className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="grid gap-3 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-800">{ui.initialAmount}</span>
              <Input
                inputMode="decimal"
                value={initialAmountInput}
                onChange={(event) => setInitialAmountInput(event.target.value)}
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-800">{ui.monthlyContribution}</span>
              <Input
                inputMode="decimal"
                value={monthlyContributionInput}
                onChange={(event) => setMonthlyContributionInput(event.target.value)}
              />
            </label>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-800">{ui.rateLabel}</span>
              <Input
                inputMode="decimal"
                value={rateInput}
                onChange={(event) => setRateInput(event.target.value)}
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-800">{ui.rateFrequency}</span>
              <Select
                value={rateFrequency}
                onChange={(event) => setRateFrequency(event.target.value as RateFrequency)}
              >
                <option value="monthly">{ui.frequencyMonthly}</option>
                <option value="yearly">{ui.frequencyYearly}</option>
              </Select>
            </label>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-800">{ui.periodLabel}</span>
              <Input
                inputMode="numeric"
                value={periodInput}
                onChange={(event) => setPeriodInput(event.target.value)}
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-800">{ui.periodFrequency}</span>
              <Select
                value={periodFrequency}
                onChange={(event) => setPeriodFrequency(event.target.value as PeriodFrequency)}
              >
                <option value="months">{ui.periodMonths}</option>
                <option value="years">{ui.periodYears}</option>
              </Select>
            </label>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-800">{ui.contributionTiming}</span>
              <Select
                value={contributionTiming}
                onChange={(event) => setContributionTiming(event.target.value as ContributionTiming)}
              >
                <option value="end">{ui.timingEnd}</option>
                <option value="start">{ui.timingStart}</option>
              </Select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-800">{ui.inflationLabel}</span>
              <Input
                inputMode="decimal"
                value={inflationInput}
                placeholder="4"
                onChange={(event) => setInflationInput(event.target.value)}
              />
            </label>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border border-slate-300 text-brand-600 focus:ring-2 focus:ring-brand-200"
              checked={compareSimple}
              onChange={(event) => setCompareSimple(event.target.checked)}
            />
            {ui.compareSimple}
          </label>

          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={calculateInvestment}>
              {ui.calculate}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setInitialAmountInput('1000');
                setMonthlyContributionInput('300');
                setRateInput('1');
                setRateFrequency('monthly');
                setPeriodInput('5');
                setPeriodFrequency('years');
                setContributionTiming('end');
                setInflationInput('');
                setShowAllRows(false);
              }}
            >
              {ui.clear}
            </Button>
          </div>
        </section>
      ) : null}

      {activeTab === 'goal' ? (
        <section className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="grid gap-3 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-800">{ui.targetAmount}</span>
              <Input
                inputMode="decimal"
                value={goalTargetInput}
                onChange={(event) => setGoalTargetInput(event.target.value)}
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-800">{ui.initialAmount}</span>
              <Input
                inputMode="decimal"
                value={goalInitialInput}
                onChange={(event) => setGoalInitialInput(event.target.value)}
              />
            </label>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-800">{ui.rateLabel}</span>
              <Input
                inputMode="decimal"
                value={goalRateInput}
                onChange={(event) => setGoalRateInput(event.target.value)}
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-800">{ui.rateFrequency}</span>
              <Select
                value={goalRateFrequency}
                onChange={(event) => setGoalRateFrequency(event.target.value as RateFrequency)}
              >
                <option value="monthly">{ui.frequencyMonthly}</option>
                <option value="yearly">{ui.frequencyYearly}</option>
              </Select>
            </label>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-800">{ui.periodLabel}</span>
              <Input
                inputMode="numeric"
                value={goalPeriodInput}
                onChange={(event) => setGoalPeriodInput(event.target.value)}
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-800">{ui.periodFrequency}</span>
              <Select
                value={goalPeriodFrequency}
                onChange={(event) => setGoalPeriodFrequency(event.target.value as PeriodFrequency)}
              >
                <option value="months">{ui.periodMonths}</option>
                <option value="years">{ui.periodYears}</option>
              </Select>
            </label>
          </div>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">{ui.contributionTiming}</span>
            <Select
              value={goalContributionTiming}
              onChange={(event) =>
                setGoalContributionTiming(event.target.value as ContributionTiming)
              }
            >
              <option value="end">{ui.timingEnd}</option>
              <option value="start">{ui.timingStart}</option>
            </Select>
          </label>

          <Button variant="secondary" onClick={calculateGoal}>
            {ui.calculate}
          </Button>

          {goalContributionResult !== null ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
              <p className="font-semibold">{ui.goalResult}</p>
              <p className="mt-1 text-lg font-bold">{formatCurrency(goalContributionResult, locale)}</p>
              {goalProjectionResult ? (
                <p className="mt-1 text-sm">
                  {ui.finalAmount}: {formatCurrency(goalProjectionResult.finalAmount, locale)}
                </p>
              ) : null}
            </div>
          ) : null}
        </section>
      ) : null}

      {activeTab === 'rate' ? (
        <section className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="grid gap-3 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-800">{ui.targetAmount}</span>
              <Input
                inputMode="decimal"
                value={rateTargetInput}
                onChange={(event) => setRateTargetInput(event.target.value)}
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-800">{ui.initialAmount}</span>
              <Input
                inputMode="decimal"
                value={rateInitialInput}
                onChange={(event) => setRateInitialInput(event.target.value)}
              />
            </label>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-800">{ui.monthlyContribution}</span>
              <Input
                inputMode="decimal"
                value={rateContributionInput}
                onChange={(event) => setRateContributionInput(event.target.value)}
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-800">{ui.periodLabel}</span>
              <Input
                inputMode="numeric"
                value={ratePeriodInput}
                onChange={(event) => setRatePeriodInput(event.target.value)}
              />
            </label>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-800">{ui.periodFrequency}</span>
              <Select
                value={ratePeriodFrequency}
                onChange={(event) => setRatePeriodFrequency(event.target.value as PeriodFrequency)}
              >
                <option value="months">{ui.periodMonths}</option>
                <option value="years">{ui.periodYears}</option>
              </Select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-800">{ui.contributionTiming}</span>
              <Select
                value={rateContributionTiming}
                onChange={(event) =>
                  setRateContributionTiming(event.target.value as ContributionTiming)
                }
              >
                <option value="end">{ui.timingEnd}</option>
                <option value="start">{ui.timingStart}</option>
              </Select>
            </label>
          </div>

          <Button variant="secondary" onClick={calculateRate}>
            {ui.calculate}
          </Button>

          {rateResult ? (
            <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-3 text-sm text-indigo-900">
              <p className="font-semibold">{ui.rateResult}</p>
              <p className="mt-1">
                {ui.frequencyMonthly}: {formatPercent(rateResult.monthlyRate * 100, locale, 4)}
              </p>
              <p>
                {ui.frequencyYearly}: {formatPercent(rateResult.yearlyRate * 100, locale, 4)}
              </p>
            </div>
          ) : null}
        </section>
      ) : null}

      {errorMessage ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMessage}
        </p>
      ) : null}

      {feedbackMessage ? (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {feedbackMessage}
        </p>
      ) : null}

      {projectionResult ? (
        <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
          <h4 className="text-sm font-semibold text-slate-900">{ui.resultTitle}</h4>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{ui.finalAmount}</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {formatCurrency(projectionResult.finalAmount, locale)}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {ui.totalInvested}
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {formatCurrency(projectionResult.totalInvested, locale)}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {ui.totalInterest}
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {formatCurrency(projectionResult.totalInterest, locale)}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {ui.profitability}
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {formatPercent(projectionResult.profitabilityPercent, locale)}
              </p>
            </div>
          </div>

          {inflationAdjusted !== null ? (
            <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
              <strong>{ui.realValue}:</strong> {formatCurrency(inflationAdjusted, locale)}
            </p>
          ) : null}

          {compareSimple ? (
            <div className="space-y-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              <p className="font-semibold">{ui.simpleComparisonTitle}</p>
              <p>
                {ui.simpleFinalAmount}:{' '}
                {formatCurrency(projectionResult.simpleComparison.finalAmount, locale)}
              </p>
              <p>
                {ui.simpleInterest}:{' '}
                {formatCurrency(projectionResult.simpleComparison.totalInterest, locale)}
              </p>
              <p>
                {ui.simpleGap}:{' '}
                {formatCurrency(projectionResult.simpleComparison.differenceFromCompound, locale)}
              </p>
            </div>
          ) : null}

          <section className="space-y-3">
            <h5 className="text-sm font-semibold text-slate-900">{ui.chartTitle}</h5>
            <div className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-2">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="h-auto w-full min-w-[320px]"
                role="img"
                aria-label={ui.chartTitle}
              >
                <line
                  x1={chartPadding}
                  y1={chartHeight - chartPadding}
                  x2={chartWidth - chartPadding}
                  y2={chartHeight - chartPadding}
                  stroke="#cbd5e1"
                  strokeWidth={1}
                />
                <line
                  x1={chartPadding}
                  y1={chartPadding}
                  x2={chartPadding}
                  y2={chartHeight - chartPadding}
                  stroke="#cbd5e1"
                  strokeWidth={1}
                />
                <polyline
                  fill="none"
                  stroke="#64748b"
                  strokeWidth={2}
                  points={investedLine}
                />
                <polyline
                  fill="none"
                  stroke="#0f766e"
                  strokeWidth={3}
                  points={accumulatedLine}
                />
              </svg>
            </div>
            <p className="text-xs text-slate-600">
              <span className="font-semibold text-slate-700">{ui.chartLegendInvested}</span> |{' '}
              <span className="font-semibold text-teal-700">{ui.chartLegendAccumulated}</span>
            </p>
          </section>

          <section className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h5 className="text-sm font-semibold text-slate-900">{ui.tableTitle}</h5>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setTableMode('monthly')}
                  className={tableMode === 'monthly' ? 'border-brand-500 text-brand-700' : ''}
                >
                  {ui.tableMonthly}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setTableMode('yearly')}
                  className={tableMode === 'yearly' ? 'border-brand-500 text-brand-700' : ''}
                >
                  {ui.tableYearly}
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="min-w-full text-left text-sm text-slate-700">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-3 py-2">{ui.tablePeriod}</th>
                    <th className="px-3 py-2">{ui.tableOpening}</th>
                    <th className="px-3 py-2">{ui.tableContribution}</th>
                    <th className="px-3 py-2">{ui.tableInterest}</th>
                    <th className="px-3 py-2">{ui.tableClosing}</th>
                    <th className="px-3 py-2">{ui.tableInvested}</th>
                  </tr>
                </thead>
                <tbody>
                  {rowsForRender.map((row) => (
                    <tr key={`${tableMode}-${row.period}`} className="border-b border-slate-100">
                      <td className="px-3 py-2">{row.period}</td>
                      <td className="px-3 py-2">{formatCurrency(row.openingBalance, locale)}</td>
                      <td className="px-3 py-2">{formatCurrency(row.contribution, locale)}</td>
                      <td className="px-3 py-2">{formatCurrency(row.interest, locale)}</td>
                      <td className="px-3 py-2">{formatCurrency(row.closingBalance, locale)}</td>
                      <td className="px-3 py-2">{formatCurrency(row.totalInvested, locale)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {currentRows.length > defaultRowLimit ? (
              <Button variant="ghost" onClick={() => setShowAllRows((current) => !current)}>
                {showAllRows ? ui.showLessRows : ui.showAllRows}
              </Button>
            ) : null}
          </section>

          <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <h5 className="text-sm font-semibold text-slate-900">{ui.summaryTitle}</h5>
            <p className="text-sm text-slate-700">{summaryText}</p>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={() => void copyText(summaryText)}>
                {ui.copySummary}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  downloadText(
                    csvFileNameByLocale[locale],
                    buildProjectionCsv(projectionResult.rows, ui),
                    'text/csv;charset=utf-8;',
                  );
                }}
              >
                {ui.downloadCsv}
              </Button>
              <Button variant="secondary" onClick={() => void copyShareLink()}>
                {ui.shareLink}
              </Button>
            </div>
          </section>
        </section>
      ) : null}

      <p className="text-xs text-slate-600">{ui.localNote}</p>
    </Card>
  );
}
