export type RateFrequency = 'monthly' | 'yearly';
export type PeriodFrequency = 'months' | 'years';
export type ContributionTiming = 'end' | 'start';

export type ProjectionRow = {
  period: number;
  openingBalance: number;
  contribution: number;
  interest: number;
  closingBalance: number;
  totalInvested: number;
};

export type CompoundProjectionInput = {
  initialAmount: number;
  monthlyContribution: number;
  ratePercent: number;
  rateFrequency: RateFrequency;
  periodValue: number;
  periodFrequency: PeriodFrequency;
  contributionTiming: ContributionTiming;
};

export type SimpleProjectionSummary = {
  finalAmount: number;
  totalInterest: number;
  differenceFromCompound: number;
};

export type CompoundProjectionResult = {
  months: number;
  effectiveMonthlyRate: number;
  effectiveYearlyRate: number;
  rows: ProjectionRow[];
  finalAmount: number;
  totalInvested: number;
  totalInterest: number;
  profitabilityPercent: number;
  simpleComparison: SimpleProjectionSummary;
};

export type RequiredContributionInput = {
  targetAmount: number;
  initialAmount: number;
  ratePercent: number;
  rateFrequency: RateFrequency;
  periodValue: number;
  periodFrequency: PeriodFrequency;
  contributionTiming: ContributionTiming;
};

export type RequiredRateInput = {
  targetAmount: number;
  initialAmount: number;
  monthlyContribution: number;
  periodValue: number;
  periodFrequency: PeriodFrequency;
  contributionTiming: ContributionTiming;
};

export type RequiredRateResult = {
  monthlyRate: number;
  yearlyRate: number;
};

const MAX_MONTHS = 1200;

const sanitizePositive = (value: number): number => {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, value);
};

export const periodToMonths = (
  periodValue: number,
  periodFrequency: PeriodFrequency,
): number => {
  const safeValue = sanitizePositive(periodValue);

  if (!safeValue) {
    return 1;
  }

  const months = periodFrequency === 'years' ? safeValue * 12 : safeValue;

  return Math.max(1, Math.min(MAX_MONTHS, Math.floor(months)));
};

export const ratePercentToMonthly = (
  ratePercent: number,
  rateFrequency: RateFrequency,
): number => {
  const safePercent = Number.isFinite(ratePercent) ? ratePercent : 0;

  if (rateFrequency === 'monthly') {
    return safePercent / 100;
  }

  const yearlyRate = safePercent / 100;
  return Math.pow(1 + yearlyRate, 1 / 12) - 1;
};

export const monthlyRateToYearlyEquivalent = (monthlyRate: number): number =>
  Math.pow(1 + monthlyRate, 12) - 1;

const projectFinalAmountWithMonthlyRate = (
  monthlyRate: number,
  months: number,
  initialAmount: number,
  monthlyContribution: number,
  contributionTiming: ContributionTiming,
): number => {
  let balance = initialAmount;

  for (let month = 1; month <= months; month += 1) {
    if (contributionTiming === 'start') {
      balance += monthlyContribution;
    }

    balance += balance * monthlyRate;

    if (contributionTiming === 'end') {
      balance += monthlyContribution;
    }
  }

  return balance;
};

const buildSimpleProjectionSummary = (
  compoundFinalAmount: number,
  monthlyRate: number,
  months: number,
  initialAmount: number,
  monthlyContribution: number,
  contributionTiming: ContributionTiming,
): SimpleProjectionSummary => {
  let principal = initialAmount;
  let accruedInterest = 0;

  for (let month = 1; month <= months; month += 1) {
    if (contributionTiming === 'start') {
      principal += monthlyContribution;
    }

    accruedInterest += principal * monthlyRate;

    if (contributionTiming === 'end') {
      principal += monthlyContribution;
    }
  }

  const finalAmount = principal + accruedInterest;

  return {
    finalAmount,
    totalInterest: accruedInterest,
    differenceFromCompound: compoundFinalAmount - finalAmount,
  };
};

export const buildCompoundProjection = (
  input: CompoundProjectionInput,
): CompoundProjectionResult => {
  const months = periodToMonths(input.periodValue, input.periodFrequency);
  const monthlyRate = ratePercentToMonthly(input.ratePercent, input.rateFrequency);
  const yearlyRate = monthlyRateToYearlyEquivalent(monthlyRate);
  const initialAmount = sanitizePositive(input.initialAmount);
  const monthlyContribution = sanitizePositive(input.monthlyContribution);

  let balance = initialAmount;
  let totalInvested = initialAmount;

  const rows: ProjectionRow[] = [];

  for (let period = 1; period <= months; period += 1) {
    const openingBalance = balance;
    let contribution = 0;

    if (input.contributionTiming === 'start') {
      contribution = monthlyContribution;
      balance += contribution;
      totalInvested += contribution;
    }

    const interest = balance * monthlyRate;
    balance += interest;

    if (input.contributionTiming === 'end') {
      contribution = monthlyContribution;
      balance += contribution;
      totalInvested += contribution;
    }

    rows.push({
      period,
      openingBalance,
      contribution,
      interest,
      closingBalance: balance,
      totalInvested,
    });
  }

  const finalAmount = balance;
  const totalInterest = finalAmount - totalInvested;

  const profitabilityPercent =
    totalInvested > 0 ? ((finalAmount - totalInvested) / totalInvested) * 100 : 0;

  return {
    months,
    effectiveMonthlyRate: monthlyRate,
    effectiveYearlyRate: yearlyRate,
    rows,
    finalAmount,
    totalInvested,
    totalInterest,
    profitabilityPercent,
    simpleComparison: buildSimpleProjectionSummary(
      finalAmount,
      monthlyRate,
      months,
      initialAmount,
      monthlyContribution,
      input.contributionTiming,
    ),
  };
};

export const groupProjectionByYear = (rows: ProjectionRow[]): ProjectionRow[] => {
  if (!rows.length) {
    return [];
  }

  const grouped: ProjectionRow[] = [];

  for (let index = 0; index < rows.length; index += 12) {
    const chunk = rows.slice(index, index + 12);
    const first = chunk[0];
    const last = chunk[chunk.length - 1];

    if (!first || !last) {
      continue;
    }

    grouped.push({
      period: Math.floor(index / 12) + 1,
      openingBalance: first.openingBalance,
      contribution: chunk.reduce((sum, row) => sum + row.contribution, 0),
      interest: chunk.reduce((sum, row) => sum + row.interest, 0),
      closingBalance: last.closingBalance,
      totalInvested: last.totalInvested,
    });
  }

  return grouped;
};

export const calculateRequiredMonthlyContribution = (
  input: RequiredContributionInput,
): number => {
  const targetAmount = sanitizePositive(input.targetAmount);
  const initialAmount = sanitizePositive(input.initialAmount);
  const months = periodToMonths(input.periodValue, input.periodFrequency);
  const monthlyRate = ratePercentToMonthly(input.ratePercent, input.rateFrequency);

  if (targetAmount <= initialAmount && monthlyRate >= 0) {
    return 0;
  }

  if (Math.abs(monthlyRate) < 1e-12) {
    const linear = (targetAmount - initialAmount) / months;
    return Math.max(0, linear);
  }

  const growth = Math.pow(1 + monthlyRate, months);
  const annuityFactorBase = (growth - 1) / monthlyRate;
  const annuityFactor =
    input.contributionTiming === 'start'
      ? annuityFactorBase * (1 + monthlyRate)
      : annuityFactorBase;

  if (!Number.isFinite(annuityFactor) || Math.abs(annuityFactor) < 1e-12) {
    return 0;
  }

  const required = (targetAmount - initialAmount * growth) / annuityFactor;

  if (!Number.isFinite(required)) {
    return 0;
  }

  return Math.max(0, required);
};

export const calculateRequiredRate = (input: RequiredRateInput): RequiredRateResult => {
  const targetAmount = sanitizePositive(input.targetAmount);
  const initialAmount = sanitizePositive(input.initialAmount);
  const monthlyContribution = sanitizePositive(input.monthlyContribution);
  const months = periodToMonths(input.periodValue, input.periodFrequency);

  const evaluate = (monthlyRate: number): number =>
    projectFinalAmountWithMonthlyRate(
      monthlyRate,
      months,
      initialAmount,
      monthlyContribution,
      input.contributionTiming,
    );

  let low = -0.9999;
  let high = 2;

  const targetAtZero = evaluate(0);

  if (targetAmount === targetAtZero) {
    return {
      monthlyRate: 0,
      yearlyRate: 0,
    };
  }

  if (targetAmount > targetAtZero) {
    while (evaluate(high) < targetAmount && high < 100) {
      high *= 1.6;
    }
  } else {
    high = 0;
  }

  for (let iteration = 0; iteration < 200; iteration += 1) {
    const mid = (low + high) / 2;
    const value = evaluate(mid);

    if (value >= targetAmount) {
      high = mid;
    } else {
      low = mid;
    }
  }

  const monthlyRate = (low + high) / 2;

  return {
    monthlyRate,
    yearlyRate: monthlyRateToYearlyEquivalent(monthlyRate),
  };
};
