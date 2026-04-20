export type PasswordOptions = {
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
};

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()-_=+[]{};:,.<>/?|~';

const getCharacterPool = (options: PasswordOptions): string => {
  let pool = '';

  if (options.uppercase) {
    pool += UPPERCASE;
  }

  if (options.lowercase) {
    pool += LOWERCASE;
  }

  if (options.numbers) {
    pool += NUMBERS;
  }

  if (options.symbols) {
    pool += SYMBOLS;
  }

  return pool;
};

const getActiveCharacterSets = (options: PasswordOptions): string[] => {
  const sets: string[] = [];

  if (options.uppercase) {
    sets.push(UPPERCASE);
  }

  if (options.lowercase) {
    sets.push(LOWERCASE);
  }

  if (options.numbers) {
    sets.push(NUMBERS);
  }

  if (options.symbols) {
    sets.push(SYMBOLS);
  }

  return sets;
};

const getRandomInt = (maxExclusive: number): number => {
  if (maxExclusive <= 0) {
    return 0;
  }

  const cryptoRef = globalThis.crypto;

  if (!cryptoRef?.getRandomValues) {
    return Math.floor(Math.random() * maxExclusive);
  }

  const maxUint32 = 0x100000000;
  const limit = Math.floor(maxUint32 / maxExclusive) * maxExclusive;
  const randomValue = new Uint32Array(1);

  do {
    cryptoRef.getRandomValues(randomValue);
  } while (randomValue[0] >= limit);

  return randomValue[0] % maxExclusive;
};

const clampLength = (length: number): number => {
  if (!Number.isFinite(length)) {
    return 12;
  }

  return Math.max(1, Math.floor(length));
};

export const hasAnyPasswordOptionSelected = (options: PasswordOptions): boolean =>
  options.uppercase || options.lowercase || options.numbers || options.symbols;

export const generatePassword = (length: number, options: PasswordOptions): string => {
  const finalLength = clampLength(length);
  const pool = getCharacterPool(options);
  const activeSets = getActiveCharacterSets(options);

  if (!pool) {
    return '';
  }

  const passwordChars: string[] = [];

  if (finalLength >= activeSets.length) {
    activeSets.forEach((set) => {
      passwordChars.push(set[getRandomInt(set.length)]);
    });
  }

  while (passwordChars.length < finalLength) {
    passwordChars.push(pool[getRandomInt(pool.length)]);
  }

  for (let index = passwordChars.length - 1; index > 0; index -= 1) {
    const randomIndex = getRandomInt(index + 1);
    const currentValue = passwordChars[index];

    passwordChars[index] = passwordChars[randomIndex];
    passwordChars[randomIndex] = currentValue;
  }

  return passwordChars.join('');
};
