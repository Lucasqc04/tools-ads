const CPF_BASE_LENGTH = 9;
const CPF_TOTAL_LENGTH = 11;
const MIN_GENERATION_ATTEMPTS = 40;

const onlyDigits = (value: string): string => value.replaceAll(/\D+/g, '');

const isRepeatedDigits = (value: string): boolean => /^(\d)\1+$/.test(value);

const calculateCheckDigit = (baseDigits: string): string => {
  const total = baseDigits
    .split('')
    .reduce((accumulator, digit, index) => {
      const weight = baseDigits.length + 1 - index;
      return accumulator + Number(digit) * weight;
    }, 0);

  const remainder = total % 11;
  const checkDigit = remainder < 2 ? 0 : 11 - remainder;

  return String(checkDigit);
};

const randomDigits = (length: number): string => {
  let value = '';

  for (let index = 0; index < length; index += 1) {
    value += Math.floor(Math.random() * 10);
  }

  return value;
};

const padBaseDigits = (rawValue: string): string => rawValue.padStart(CPF_BASE_LENGTH, '0').slice(0, CPF_BASE_LENGTH);

export const formatCpf = (cpf: string): string => {
  const digits = onlyDigits(cpf);

  if (digits.length !== CPF_TOTAL_LENGTH) {
    return digits;
  }

  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

export const stripCpfFormatting = (cpf: string): string => onlyDigits(cpf);

export const buildCpfFromBaseDigits = (baseDigitsInput: string): string => {
  const baseDigits = padBaseDigits(baseDigitsInput);
  const firstCheckDigit = calculateCheckDigit(baseDigits);
  const secondCheckDigit = calculateCheckDigit(`${baseDigits}${firstCheckDigit}`);

  return `${baseDigits}${firstCheckDigit}${secondCheckDigit}`;
};

export const isValidCpf = (cpf: string): boolean => {
  const digits = onlyDigits(cpf);

  if (digits.length !== CPF_TOTAL_LENGTH || isRepeatedDigits(digits)) {
    return false;
  }

  const baseDigits = digits.slice(0, CPF_BASE_LENGTH);
  return buildCpfFromBaseDigits(baseDigits) === digits;
};

export type GenerateCpfOptions = {
  withPunctuation?: boolean;
};

export const generateValidCpf = ({ withPunctuation = false }: GenerateCpfOptions = {}): string => {
  let attempts = 0;

  while (attempts < MIN_GENERATION_ATTEMPTS) {
    attempts += 1;

    const digits = buildCpfFromBaseDigits(randomDigits(CPF_BASE_LENGTH));

    if (isValidCpf(digits)) {
      return withPunctuation ? formatCpf(digits) : digits;
    }
  }

  const fallback = buildCpfFromBaseDigits('123456789');
  return withPunctuation ? formatCpf(fallback) : fallback;
};

export const generateValidCpfList = (
  quantity: number,
  { withPunctuation = false }: GenerateCpfOptions = {},
): string[] => {
  const amount = Number.isFinite(quantity) ? Math.max(1, Math.min(100, Math.floor(quantity))) : 1;

  return Array.from({ length: amount }, () => generateValidCpf({ withPunctuation }));
};
