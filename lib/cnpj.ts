const CNPJ_BASE_LENGTH = 12;
const CNPJ_TOTAL_LENGTH = 14;
const FIRST_WEIGHTS = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const SECOND_WEIGHTS = [6, ...FIRST_WEIGHTS];

const onlyDigits = (value: string): string => value.replaceAll(/\D+/g, '');

const isRepeatedDigits = (value: string): boolean => /^(\d)\1+$/.test(value);

const randomDigits = (length: number): string => {
  let output = '';

  for (let index = 0; index < length; index += 1) {
    output += Math.floor(Math.random() * 10);
  }

  return output;
};

const calculateDigit = (baseDigits: string, weights: number[]): string => {
  const sum = baseDigits
    .split('')
    .reduce((total, digit, index) => total + Number(digit) * weights[index], 0);
  const remainder = sum % 11;
  return String(remainder < 2 ? 0 : 11 - remainder);
};

const padBaseDigits = (value: string): string =>
  onlyDigits(value).padStart(CNPJ_BASE_LENGTH, '0').slice(0, CNPJ_BASE_LENGTH);

export const stripCnpjFormatting = (value: string): string => onlyDigits(value);

export const formatCnpj = (value: string): string => {
  const digits = onlyDigits(value);

  if (digits.length !== CNPJ_TOTAL_LENGTH) {
    return digits;
  }

  return digits.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
};

export const buildCnpjFromBaseDigits = (baseInput: string): string => {
  const baseDigits = padBaseDigits(baseInput);
  const firstDigit = calculateDigit(baseDigits, FIRST_WEIGHTS);
  const secondDigit = calculateDigit(`${baseDigits}${firstDigit}`, SECOND_WEIGHTS);

  return `${baseDigits}${firstDigit}${secondDigit}`;
};

export const isValidCnpj = (value: string): boolean => {
  const digits = onlyDigits(value);

  if (digits.length !== CNPJ_TOTAL_LENGTH || isRepeatedDigits(digits)) {
    return false;
  }

  return buildCnpjFromBaseDigits(digits.slice(0, CNPJ_BASE_LENGTH)) === digits;
};

export type GenerateCnpjOptions = Readonly<{
  withPunctuation?: boolean;
  branchCode?: string;
}>;

export const generateValidCnpj = ({
  withPunctuation = false,
  branchCode,
}: GenerateCnpjOptions = {}): string => {
  const randomRoot = randomDigits(8);
  const branchDigits = onlyDigits(branchCode ?? '');
  const branch = branchDigits ? branchDigits.padStart(4, '0').slice(-4) : '0001';
  const cnpj = buildCnpjFromBaseDigits(`${randomRoot}${branch}`);

  return withPunctuation ? formatCnpj(cnpj) : cnpj;
};

export const generateValidCnpjList = (
  quantity: number,
  options: GenerateCnpjOptions = {},
): string[] => {
  const amount = Number.isFinite(quantity) ? Math.max(1, Math.min(200, Math.floor(quantity))) : 1;

  return Array.from({ length: amount }, () => generateValidCnpj(options));
};
