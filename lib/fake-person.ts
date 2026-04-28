import { generateValidCpf } from '@/lib/cpf';
import type { AppLocale } from '@/lib/i18n/config';

export type FakeGender = 'male' | 'female';
export type FakeGenderMode = FakeGender | 'random';
export type FakeAgeMode = 'exact' | 'range';
export type FakeStateMode = 'random' | 'specific';
export type FakeNameLanguage = 'brazilian' | 'international';
export type FakeNameStyle = 'common' | 'rare';
export type FakeEmailDomainMode =
  | 'popular-random'
  | 'gmail.com'
  | 'hotmail.com'
  | 'outlook.com'
  | 'yahoo.com';
export type FakePasswordMode = 'strong' | 'weak' | 'numeric';
export type FakeOutputPreset = 'complete' | 'emails' | 'cpfs' | 'phones';

export type FakePersonLocation = {
  region: string;
  stateUf: string;
  stateName: string;
  city: string;
  ddd: string;
  cep: string;
  neighborhood: string;
  street: string;
  number: string;
  addressLine: string;
};

export type FakePersonExtras = {
  bloodType: string;
  heightCm: number;
  weightKg: number;
  favoriteColor: string;
};

export type FakePerson = {
  id: string;
  fullName: string;
  firstName: string;
  fatherName: string;
  motherName: string;
  gender: FakeGender;
  age: number;
  birthDate: string;
  zodiacSign: string;
  cpf: string;
  rg: string;
  email: string;
  mobilePhone: string;
  landlinePhone: string;
  password: string;
  location: FakePersonLocation;
  extras: FakePersonExtras;
};

export type FakePersonGeneratorOptions = {
  quantity: number;
  genderMode: FakeGenderMode;
  ageMode: FakeAgeMode;
  exactAge: number;
  minAge: number;
  maxAge: number;
  stateMode: FakeStateMode;
  stateUf: string;
  cpfWithPunctuation: boolean;
  emailDomainMode: FakeEmailDomainMode;
  includeParents: boolean;
  inheritFatherSurname: boolean;
  includeExtras: boolean;
  includePassword: boolean;
  includeLandline: boolean;
  passwordMode: FakePasswordMode;
  passwordLength: number;
  nameLanguage: FakeNameLanguage;
  nameStyle: FakeNameStyle;
  seed: string;
  outputPreset: FakeOutputPreset;
};

export type FakePersonField = {
  id: LocalizedFieldId;
  label: string;
  value: string;
};

export type FakePersonOutput = {
  json: string;
  text: string;
  csv: string;
  sql: string;
};

type PersonFieldId =
  | 'fullName'
  | 'gender'
  | 'age'
  | 'birthDate'
  | 'zodiacSign'
  | 'cpf'
  | 'rg'
  | 'email'
  | 'mobilePhone'
  | 'landlinePhone'
  | 'motherName'
  | 'fatherName'
  | 'password'
  | 'address'
  | 'state';

type LocalizedFieldId = PersonFieldId | 'bloodType' | 'heightCm' | 'weightKg' | 'favoriteColor' | 'cep' | 'ddd';

type CityData = {
  name: string;
  ddd: string;
  cepMin: number;
  cepMax: number;
};

type StateData = {
  uf: string;
  name: string;
  region: string;
  cities: CityData[];
};

type NameCatalog = {
  common: string[];
  rare: string[];
};

type ViaCepAddress = {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
};

const bloodTypes = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

const favoriteColors = [
  'Azul',
  'Verde',
  'Vermelho',
  'Preto',
  'Branco',
  'Cinza',
  'Laranja',
  'Amarelo',
  'Roxo',
  'Turquesa',
  'Rosa',
  'Marrom',
];

const neighborhoods = [
  'Centro',
  'Jardim Primavera',
  'Vila Nova',
  'Santa Cecilia',
  'Boa Vista',
  'Jardim Europa',
  'Liberdade',
  'Sao Jose',
  'Santo Antonio',
  'Parque das Flores',
  'Alto da Serra',
  'Cidade Nova',
];

const streetPrefixes = ['Rua', 'Avenida', 'Alameda', 'Travessa', 'Praca', 'Largo'];

const streetNames = [
  'das Acacias',
  'dos Jasmins',
  'das Palmeiras',
  'Santos Dumont',
  'Sete de Setembro',
  'Presidente Vargas',
  'Marechal Deodoro',
  'Dom Pedro II',
  'Antonio Carlos',
  'Rui Barbosa',
  'Bela Vista',
  'Campo Grande',
  'Monte Alegre',
  'das Laranjeiras',
  'da Esperanca',
];

const popularEmailDomains = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com'];

const viaCepStreetTerms = [
  'Rua',
  'Avenida',
  'Travessa',
  'Alameda',
  'Praca',
  'Dom',
  'Sao',
  'Santa',
  'Professor',
  'Coronel',
  'General',
  'Padre',
  'Doutor',
  'Major',
];

const viaCepNameTerms = [
  'Jose',
  'Joao',
  'Maria',
  'Ana',
  'Carlos',
  'Paulo',
  'Pedro',
  'Lucas',
  'Oliveira',
  'Silva',
  'Souza',
  'Santos',
  'Barbosa',
  'Almeida',
  'Fernandes',
  'Monteiro',
];

const viaCepSearchCache = new Map<string, ViaCepAddress[]>();
const viaCepRequestTimeoutMs = 1800;
const viaCepMaxTermAttempts = 5;
const viaCepMaxUniqueLocationLookups = 4;

const statesCatalog: StateData[] = [
  {
    uf: 'AC',
    name: 'Acre',
    region: 'Norte',
    cities: [
      { name: 'Rio Branco', ddd: '68', cepMin: 69900000, cepMax: 69924999 },
      { name: 'Cruzeiro do Sul', ddd: '68', cepMin: 69980000, cepMax: 69980999 },
    ],
  },
  {
    uf: 'AL',
    name: 'Alagoas',
    region: 'Nordeste',
    cities: [
      { name: 'Maceio', ddd: '82', cepMin: 57000000, cepMax: 57099999 },
      { name: 'Arapiraca', ddd: '82', cepMin: 57300000, cepMax: 57319999 },
    ],
  },
  {
    uf: 'AP',
    name: 'Amapa',
    region: 'Norte',
    cities: [
      { name: 'Macapa', ddd: '96', cepMin: 68900000, cepMax: 68911999 },
      { name: 'Santana', ddd: '96', cepMin: 68925000, cepMax: 68929999 },
    ],
  },
  {
    uf: 'AM',
    name: 'Amazonas',
    region: 'Norte',
    cities: [
      { name: 'Manaus', ddd: '92', cepMin: 69000000, cepMax: 69099999 },
      { name: 'Parintins', ddd: '92', cepMin: 69151000, cepMax: 69153999 },
    ],
  },
  {
    uf: 'BA',
    name: 'Bahia',
    region: 'Nordeste',
    cities: [
      { name: 'Salvador', ddd: '71', cepMin: 40000000, cepMax: 41999999 },
      { name: 'Feira de Santana', ddd: '75', cepMin: 44000000, cepMax: 44099999 },
    ],
  },
  {
    uf: 'CE',
    name: 'Ceara',
    region: 'Nordeste',
    cities: [
      { name: 'Fortaleza', ddd: '85', cepMin: 60000000, cepMax: 60999999 },
      { name: 'Juazeiro do Norte', ddd: '88', cepMin: 63000000, cepMax: 63059999 },
    ],
  },
  {
    uf: 'DF',
    name: 'Distrito Federal',
    region: 'Centro-Oeste',
    cities: [
      { name: 'Brasilia', ddd: '61', cepMin: 70000000, cepMax: 72799999 },
      { name: 'Taguatinga', ddd: '61', cepMin: 72000000, cepMax: 72199999 },
    ],
  },
  {
    uf: 'ES',
    name: 'Espirito Santo',
    region: 'Sudeste',
    cities: [
      { name: 'Vitoria', ddd: '27', cepMin: 29000000, cepMax: 29099999 },
      { name: 'Vila Velha', ddd: '27', cepMin: 29100000, cepMax: 29139999 },
    ],
  },
  {
    uf: 'GO',
    name: 'Goias',
    region: 'Centro-Oeste',
    cities: [
      { name: 'Goiania', ddd: '62', cepMin: 74000000, cepMax: 74899999 },
      { name: 'Anapolis', ddd: '62', cepMin: 75000000, cepMax: 75139999 },
    ],
  },
  {
    uf: 'MA',
    name: 'Maranhao',
    region: 'Nordeste',
    cities: [
      { name: 'Sao Luis', ddd: '98', cepMin: 65000000, cepMax: 65099999 },
      { name: 'Imperatriz', ddd: '99', cepMin: 65900000, cepMax: 65919999 },
    ],
  },
  {
    uf: 'MT',
    name: 'Mato Grosso',
    region: 'Centro-Oeste',
    cities: [
      { name: 'Cuiaba', ddd: '65', cepMin: 78000000, cepMax: 78109999 },
      { name: 'Rondonopolis', ddd: '66', cepMin: 78700000, cepMax: 78759999 },
    ],
  },
  {
    uf: 'MS',
    name: 'Mato Grosso do Sul',
    region: 'Centro-Oeste',
    cities: [
      { name: 'Campo Grande', ddd: '67', cepMin: 79000000, cepMax: 79129999 },
      { name: 'Dourados', ddd: '67', cepMin: 79800000, cepMax: 79839999 },
    ],
  },
  {
    uf: 'MG',
    name: 'Minas Gerais',
    region: 'Sudeste',
    cities: [
      { name: 'Belo Horizonte', ddd: '31', cepMin: 30000000, cepMax: 31999999 },
      { name: 'Uberlandia', ddd: '34', cepMin: 38400000, cepMax: 38419999 },
    ],
  },
  {
    uf: 'PA',
    name: 'Para',
    region: 'Norte',
    cities: [
      { name: 'Belem', ddd: '91', cepMin: 66000000, cepMax: 66999999 },
      { name: 'Santarem', ddd: '93', cepMin: 68000000, cepMax: 68040999 },
    ],
  },
  {
    uf: 'PB',
    name: 'Paraiba',
    region: 'Nordeste',
    cities: [
      { name: 'Joao Pessoa', ddd: '83', cepMin: 58000000, cepMax: 58099999 },
      { name: 'Campina Grande', ddd: '83', cepMin: 58400000, cepMax: 58429999 },
    ],
  },
  {
    uf: 'PR',
    name: 'Parana',
    region: 'Sul',
    cities: [
      { name: 'Curitiba', ddd: '41', cepMin: 80000000, cepMax: 82999999 },
      { name: 'Londrina', ddd: '43', cepMin: 86000000, cepMax: 86089999 },
    ],
  },
  {
    uf: 'PE',
    name: 'Pernambuco',
    region: 'Nordeste',
    cities: [
      { name: 'Recife', ddd: '81', cepMin: 50000000, cepMax: 52999999 },
      { name: 'Caruaru', ddd: '81', cepMin: 55000000, cepMax: 55029999 },
    ],
  },
  {
    uf: 'PI',
    name: 'Piaui',
    region: 'Nordeste',
    cities: [
      { name: 'Teresina', ddd: '86', cepMin: 64000000, cepMax: 64099999 },
      { name: 'Parnaiba', ddd: '86', cepMin: 64200000, cepMax: 64219999 },
    ],
  },
  {
    uf: 'RJ',
    name: 'Rio de Janeiro',
    region: 'Sudeste',
    cities: [
      { name: 'Rio de Janeiro', ddd: '21', cepMin: 20000000, cepMax: 23799999 },
      { name: 'Niteroi', ddd: '21', cepMin: 24000000, cepMax: 24399999 },
    ],
  },
  {
    uf: 'RN',
    name: 'Rio Grande do Norte',
    region: 'Nordeste',
    cities: [
      { name: 'Natal', ddd: '84', cepMin: 59000000, cepMax: 59139999 },
      { name: 'Mossoro', ddd: '84', cepMin: 59600000, cepMax: 59619999 },
    ],
  },
  {
    uf: 'RS',
    name: 'Rio Grande do Sul',
    region: 'Sul',
    cities: [
      { name: 'Porto Alegre', ddd: '51', cepMin: 90000000, cepMax: 91999999 },
      { name: 'Caxias do Sul', ddd: '54', cepMin: 95000000, cepMax: 95119999 },
    ],
  },
  {
    uf: 'RO',
    name: 'Rondonia',
    region: 'Norte',
    cities: [
      { name: 'Porto Velho', ddd: '69', cepMin: 76800000, cepMax: 76899999 },
      { name: 'Ji-Parana', ddd: '69', cepMin: 76900000, cepMax: 76909999 },
    ],
  },
  {
    uf: 'RR',
    name: 'Roraima',
    region: 'Norte',
    cities: [
      { name: 'Boa Vista', ddd: '95', cepMin: 69300000, cepMax: 69339999 },
      { name: 'Rorainopolis', ddd: '95', cepMin: 69373000, cepMax: 69373999 },
    ],
  },
  {
    uf: 'SC',
    name: 'Santa Catarina',
    region: 'Sul',
    cities: [
      { name: 'Florianopolis', ddd: '48', cepMin: 88000000, cepMax: 88099999 },
      { name: 'Joinville', ddd: '47', cepMin: 89200000, cepMax: 89239999 },
    ],
  },
  {
    uf: 'SP',
    name: 'Sao Paulo',
    region: 'Sudeste',
    cities: [
      { name: 'Sao Paulo', ddd: '11', cepMin: 1000000, cepMax: 5999999 },
      { name: 'Campinas', ddd: '19', cepMin: 13000000, cepMax: 13109999 },
      { name: 'Santos', ddd: '13', cepMin: 11000000, cepMax: 11099999 },
    ],
  },
  {
    uf: 'SE',
    name: 'Sergipe',
    region: 'Nordeste',
    cities: [
      { name: 'Aracaju', ddd: '79', cepMin: 49000000, cepMax: 49099999 },
      { name: 'Itabaiana', ddd: '79', cepMin: 49500000, cepMax: 49519999 },
    ],
  },
  {
    uf: 'TO',
    name: 'Tocantins',
    region: 'Norte',
    cities: [
      { name: 'Palmas', ddd: '63', cepMin: 77000000, cepMax: 77299999 },
      { name: 'Araguaina', ddd: '63', cepMin: 77800000, cepMax: 77829999 },
    ],
  },
];

const brazilianMaleNames: NameCatalog = {
  common: [
    'Joao',
    'Gabriel',
    'Lucas',
    'Pedro',
    'Gustavo',
    'Rafael',
    'Matheus',
    'Felipe',
    'Bruno',
    'Diego',
    'Caio',
    'Thiago',
    'Andre',
    'Daniel',
    'Vinicius',
    'Leandro',
    'Eduardo',
    'Henrique',
    'Ricardo',
    'Marcos',
  ],
  rare: [
    'Ariovaldo',
    'Bento',
    'Cassiano',
    'Davi Lucca',
    'Everaldo',
    'Fabricio',
    'Gael',
    'Heitor',
    'Icaro',
    'Joaquim',
    'Kaua',
    'Lourenco',
    'Murilo',
    'Nicolas',
    'Otavio',
  ],
};

const brazilianFemaleNames: NameCatalog = {
  common: [
    'Maria',
    'Ana',
    'Julia',
    'Beatriz',
    'Larissa',
    'Amanda',
    'Camila',
    'Fernanda',
    'Patricia',
    'Juliana',
    'Isabela',
    'Carolina',
    'Renata',
    'Vanessa',
    'Paula',
    'Mariana',
    'Natasha',
    'Sabrina',
    'Gabriela',
    'Leticia',
  ],
  rare: [
    'Alana',
    'Brenda',
    'Catarina',
    'Dandara',
    'Eloa',
    'Flavia',
    'Giovanna',
    'Helena',
    'Iolanda',
    'Jussara',
    'Kiara',
    'Luiza',
    'Mirela',
    'Nayara',
    'Olivia',
  ],
};

const internationalMaleNames: NameCatalog = {
  common: [
    'Liam',
    'Noah',
    'Ethan',
    'Oliver',
    'James',
    'Henry',
    'Alexander',
    'David',
    'Michael',
    'William',
    'Leo',
    'Benjamin',
    'Thomas',
    'Daniel',
    'Samuel',
  ],
  rare: ['Alistair', 'Cedric', 'Dorian', 'Elian', 'Finnian', 'Leopold', 'Milo', 'Nolan', 'Orion', 'Silas'],
};

const internationalFemaleNames: NameCatalog = {
  common: [
    'Olivia',
    'Emma',
    'Sophia',
    'Isabella',
    'Mia',
    'Charlotte',
    'Amelia',
    'Harper',
    'Evelyn',
    'Emily',
    'Grace',
    'Natalie',
    'Ava',
    'Lily',
    'Hannah',
  ],
  rare: ['Adeline', 'Bianca', 'Celeste', 'Delilah', 'Elora', 'Freya', 'Isolde', 'Juniper', 'Kaia', 'Serena'],
};

const surnames = [
  'Silva',
  'Souza',
  'Costa',
  'Oliveira',
  'Pereira',
  'Rodrigues',
  'Almeida',
  'Santos',
  'Nascimento',
  'Lima',
  'Araujo',
  'Fernandes',
  'Gomes',
  'Carvalho',
  'Rocha',
  'Melo',
  'Barros',
  'Ribeiro',
  'Martins',
  'Cardoso',
  'Freitas',
  'Vieira',
  'Teixeira',
  'Moraes',
  'Castro',
];

const defaultOptions: FakePersonGeneratorOptions = {
  quantity: 5,
  genderMode: 'random',
  ageMode: 'range',
  exactAge: 30,
  minAge: 18,
  maxAge: 40,
  stateMode: 'random',
  stateUf: 'SP',
  cpfWithPunctuation: true,
  emailDomainMode: 'popular-random',
  includeParents: true,
  inheritFatherSurname: false,
  includeExtras: true,
  includePassword: true,
  includeLandline: true,
  passwordMode: 'strong',
  passwordLength: 12,
  nameLanguage: 'brazilian',
  nameStyle: 'common',
  seed: '',
  outputPreset: 'complete',
};

const safeInt = (value: number, minimum: number, maximum: number): number => {
  if (!Number.isFinite(value)) {
    return minimum;
  }

  return Math.min(maximum, Math.max(minimum, Math.floor(value)));
};

const removeAccents = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const normalizeViaCepToken = (value: string): string =>
  removeAccents(value)
    .toLowerCase()
    .split(/\s+/)
    .join(' ')
    .trim();

const buildLocationLookupKey = (stateUf: string, city: string): string =>
  `${stateUf.toUpperCase()}|${normalizeViaCepToken(city)}`;

const shuffleWithRng = <T,>(rng: RandomSource, items: T[]): T[] => {
  const nextItems = [...items];

  for (let index = nextItems.length - 1; index > 0; index -= 1) {
    const swapIndex = rng.int(0, index);
    const temp = nextItems[index];
    nextItems[index] = nextItems[swapIndex];
    nextItems[swapIndex] = temp;
  }

  return nextItems;
};

const normalizeEmailLocal = (value: string): string =>
  removeAccents(value)
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, '')
    .replace(/\s+/g, '.');

const formatCep = (value: number): string => {
  const digits = String(Math.max(0, Math.floor(value))).padStart(8, '0').slice(0, 8);
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
};

const pad = (value: number): string => String(value).padStart(2, '0');

const formatBirthDate = (value: Date): string =>
  `${pad(value.getDate())}/${pad(value.getMonth() + 1)}/${value.getFullYear()}`;

const calculateAge = (birthDate: Date): number => {
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age -= 1;
  }

  return Math.max(0, age);
};

const getZodiacSign = (birthDate: Date): string => {
  const day = birthDate.getDate();
  const month = birthDate.getMonth() + 1;

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Touro';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemeos';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leao';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgem';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Escorpiao';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagitario';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricornio';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquario';
  return 'Peixes';
};

const generateRgByUf = (uf: string, rng: RandomSource): string => {
  const d = (size: number) => rng.digits(size);

  if (uf === 'SP') {
    const suffix = rng.bool() ? String(rng.int(0, 9)) : 'X';
    return `${d(2)}.${d(3)}.${d(3)}-${suffix}`;
  }

  if (uf === 'RJ') {
    return `${d(2)}.${d(3)}.${d(2)}-${d(1)}`;
  }

  if (uf === 'MG') {
    return `${d(2)}.${d(3)}.${d(3)}-${d(1)}`;
  }

  return `${d(2)}.${d(3)}.${d(3)}-${d(1)}`;
};

const createBirthDateWithinAgeRange = (
  rng: RandomSource,
  minAge: number,
  maxAge: number,
): Date => {
  const today = new Date();
  const safeMin = safeInt(minAge, 0, 120);
  const safeMax = safeInt(maxAge, safeMin, 120);

  const earliest = new Date(today.getFullYear() - safeMax - 1, today.getMonth(), today.getDate() + 1);
  const latest = new Date(today.getFullYear() - safeMin, today.getMonth(), today.getDate(), 23, 59, 59, 999);

  const minTime = earliest.getTime();
  const maxTime = latest.getTime();

  if (maxTime <= minTime) {
    return latest;
  }

  const time = rng.int(minTime, maxTime);
  return new Date(time);
};

const buildPassword = (
  rng: RandomSource,
  length: number,
  mode: FakePasswordMode,
  firstName: string,
): string => {
  const finalLength = safeInt(length, 4, 64);

  if (mode === 'weak') {
    const local = normalizeEmailLocal(firstName).replace(/\./g, '') || 'usuario';
    const suffix = rng.digits(Math.max(2, finalLength - local.length)).slice(0, Math.max(2, finalLength - local.length));
    return `${local}${suffix}`.slice(0, finalLength);
  }

  const numericSet = '0123456789';

  if (mode === 'numeric') {
    return rng.fromChars(numericSet, finalLength);
  }

  const pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*+-_';
  return rng.fromChars(pool, finalLength);
};

const chooseNameCatalog = (
  language: FakeNameLanguage,
  gender: FakeGender,
): NameCatalog => {
  if (language === 'international') {
    return gender === 'male' ? internationalMaleNames : internationalFemaleNames;
  }

  return gender === 'male' ? brazilianMaleNames : brazilianFemaleNames;
};

const buildFullName = (
  firstName: string,
  maternalSurname: string,
  paternalSurname: string,
): string => `${firstName} ${maternalSurname} ${paternalSurname}`;

const buildEmail = (
  rng: RandomSource,
  fullName: string,
  domainMode: FakeEmailDomainMode,
): string => {
  const tokens = removeAccents(fullName).split(' ').filter(Boolean);
  const first = tokens[0] ?? 'usuario';
  const last = tokens[tokens.length - 1] ?? 'teste';
  const localBase = normalizeEmailLocal(`${first}.${last}`);
  const localSuffix = rng.int(10, 9999);
  const local = `${localBase}${localSuffix}`;

  const domain =
    domainMode === 'popular-random'
      ? rng.pick(popularEmailDomains)
      : domainMode;

  return `${local}@${domain}`;
};

const buildPhones = (
  rng: RandomSource,
  ddd: string,
): {
  mobile: string;
  landline: string;
} => {
  const mobileFirst = String(rng.int(6, 9));
  const mobileMid = rng.digits(3);
  const mobileEnd = rng.digits(4);
  const landlineFirst = String(rng.int(2, 5));
  const landlineMid = rng.digits(3);
  const landlineEnd = rng.digits(4);

  return {
    mobile: `(${ddd}) 9${mobileFirst}${mobileMid}-${mobileEnd}`,
    landline: `(${ddd}) ${landlineFirst}${landlineMid}-${landlineEnd}`,
  };
};

const buildLocation = (rng: RandomSource, state: StateData, city: CityData): FakePersonLocation => {
  const cep = formatCep(rng.int(city.cepMin, city.cepMax));
  const neighborhood = rng.pick(neighborhoods);
  const streetPrefix = rng.pick(streetPrefixes);
  const streetName = rng.pick(streetNames);
  const number = String(rng.int(10, 4999));
  const street = `${streetPrefix} ${streetName}`;

  return {
    region: state.region,
    stateUf: state.uf,
    stateName: state.name,
    city: city.name,
    ddd: city.ddd,
    cep,
    neighborhood,
    street,
    number,
    addressLine: `${street}, ${number} - ${neighborhood}, ${city.name} - ${state.uf}, ${cep}`,
  };
};

const selectGender = (rng: RandomSource, mode: FakeGenderMode): FakeGender =>
  mode === 'random' ? (rng.bool() ? 'male' : 'female') : mode;

const resolveState = (rng: RandomSource, mode: FakeStateMode, uf: string): StateData => {
  if (mode === 'specific') {
    const found = statesCatalog.find((state) => state.uf === uf);

    if (found) {
      return found;
    }
  }

  return rng.pick(statesCatalog);
};

const sanitizeOptions = (options: Partial<FakePersonGeneratorOptions>): FakePersonGeneratorOptions => {
  const merged: FakePersonGeneratorOptions = {
    ...defaultOptions,
    ...options,
  };

  const minAge = safeInt(merged.minAge, 0, 120);
  const maxAge = safeInt(merged.maxAge, minAge, 120);

  return {
    ...merged,
    quantity: safeInt(merged.quantity, 1, 30),
    exactAge: safeInt(merged.exactAge, 0, 120),
    minAge,
    maxAge,
    passwordLength: safeInt(merged.passwordLength, 4, 64),
  };
};

const hashSeed = (input: string): number => {
  let hash = 2166136261;

  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
};

class RandomSource {
  private readonly seeded: boolean;

  private seedState: number;

  constructor(seed: string) {
    const normalized = seed.trim();
    this.seeded = normalized.length > 0;
    this.seedState = this.seeded ? hashSeed(normalized) : 0;
  }

  private nextSeededFloat(): number {
    this.seedState += 0x6d2b79f5;
    let t = this.seedState;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  private nextCryptoFloat(): number {
    if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
      const data = new Uint32Array(1);
      crypto.getRandomValues(data);
      return (data[0] ?? 0) / 4294967296;
    }

    return Math.random();
  }

  next(): number {
    return this.seeded ? this.nextSeededFloat() : this.nextCryptoFloat();
  }

  int(min: number, max: number): number {
    const floorMin = Math.floor(min);
    const floorMax = Math.floor(max);

    if (floorMax <= floorMin) {
      return floorMin;
    }

    const offset = Math.floor(this.next() * (floorMax - floorMin + 1));
    return floorMin + offset;
  }

  bool(): boolean {
    return this.next() >= 0.5;
  }

  pick<T>(items: T[]): T {
    return items[this.int(0, items.length - 1)] as T;
  }

  digits(length: number): string {
    return Array.from({ length }, () => String(this.int(0, 9))).join('');
  }

  fromChars(pool: string, length: number): string {
    return Array.from({ length }, () => pool[this.int(0, pool.length - 1)] ?? '').join('');
  }
}

const fetchViaCepJson = async (url: string): Promise<unknown> => {
  const abortController = new AbortController();
  const timeoutId = globalThis.setTimeout(() => {
    abortController.abort();
  }, viaCepRequestTimeoutMs);

  try {
    const response = await fetch(url, {
      signal: abortController.signal,
      cache: 'force-cache',
    });

    if (!response.ok) {
      return [];
    }

    return await response.json();
  } catch {
    return [];
  } finally {
    globalThis.clearTimeout(timeoutId);
  }
};

const parseViaCepResult = (payload: unknown, stateUf: string): ViaCepAddress[] => {
  if (!Array.isArray(payload)) {
    return [];
  }

  const normalizedState = normalizeViaCepToken(stateUf);

  return payload
    .filter((entry): entry is ViaCepAddress => Boolean(entry && typeof entry === 'object'))
    .filter((entry) => entry.erro !== true)
    .filter(
      (entry) =>
        typeof entry.cep === 'string' &&
        typeof entry.logradouro === 'string' &&
        typeof entry.bairro === 'string' &&
        typeof entry.localidade === 'string' &&
        typeof entry.uf === 'string',
    )
    .filter((entry) => normalizeViaCepToken(entry.uf) === normalizedState)
    .filter((entry) => entry.logradouro.trim().length > 0);
};

const fetchViaCepByTerm = async (
  stateUf: string,
  city: string,
  term: string,
): Promise<ViaCepAddress[]> => {
  const normalizedStateUf = stateUf.trim().toUpperCase();
  const normalizedCity = removeAccents(city).trim();
  const normalizedTerm = removeAccents(term).trim();

  if (!normalizedStateUf || !normalizedCity || !normalizedTerm) {
    return [];
  }

  const cacheKey = `${buildLocationLookupKey(normalizedStateUf, normalizedCity)}|${normalizeViaCepToken(normalizedTerm)}`;
  const cached = viaCepSearchCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const url = `https://viacep.com.br/ws/${normalizedStateUf}/${encodeURIComponent(normalizedCity)}/${encodeURIComponent(normalizedTerm)}/json/`;
  const payload = await fetchViaCepJson(url);
  const parsed = parseViaCepResult(payload, normalizedStateUf);

  viaCepSearchCache.set(cacheKey, parsed);
  return parsed;
};

const fetchRealAddressesForCity = async (
  rng: RandomSource,
  stateUf: string,
  city: string,
): Promise<ViaCepAddress[]> => {
  const nameTerms = shuffleWithRng(rng, viaCepNameTerms).slice(0, 6);
  const candidateTerms = Array.from(new Set([...viaCepStreetTerms, ...nameTerms])).slice(
    0,
    viaCepMaxTermAttempts,
  );

  for (const term of candidateTerms) {
    const matches = await fetchViaCepByTerm(stateUf, city, term);

    if (matches.length > 0) {
      return matches;
    }
  }

  return [];
};

const mergePersonWithRealAddress = (
  person: FakePerson,
  realAddress: ViaCepAddress,
): FakePerson => {
  const street = realAddress.logradouro.trim() || person.location.street;
  const neighborhood = realAddress.bairro.trim() || person.location.neighborhood;
  const city = realAddress.localidade.trim() || person.location.city;
  const stateUf = realAddress.uf.trim().toUpperCase() || person.location.stateUf;
  const cep = realAddress.cep.trim() || person.location.cep;
  const addressLine = `${street}, ${person.location.number} - ${neighborhood}, ${city} - ${stateUf}, ${cep}`;

  return {
    ...person,
    location: {
      ...person.location,
      street,
      neighborhood,
      city,
      stateUf,
      cep,
      addressLine,
    },
  };
};

const resolveNamesForPerson = (
  rng: RandomSource,
  language: FakeNameLanguage,
  style: FakeNameStyle,
  gender: FakeGender,
): {
  firstName: string;
  maternalSurname: string;
  paternalSurname: string;
} => {
  const catalog = chooseNameCatalog(language, gender);

  return {
    firstName: rng.pick(catalog[style]),
    maternalSurname: rng.pick(surnames),
    paternalSurname: rng.pick(surnames),
  };
};

export const getFakePersonStateOptions = (): Array<{ uf: string; name: string; region: string }> =>
  statesCatalog.map((state) => ({
    uf: state.uf,
    name: state.name,
    region: state.region,
  }));

export const getFakePersonCitiesByState = (uf: string): Array<{ name: string; ddd: string }> => {
  const state = statesCatalog.find((entry) => entry.uf === uf);

  if (!state) {
    return [];
  }

  return state.cities.map((city) => ({
    name: city.name,
    ddd: city.ddd,
  }));
};

export const generateFakePeople = (
  incomingOptions: Partial<FakePersonGeneratorOptions>,
): FakePerson[] => {
  const options = sanitizeOptions(incomingOptions);
  const rng = new RandomSource(options.seed);

  return Array.from({ length: options.quantity }, (_, index) => {
    const gender = selectGender(rng, options.genderMode);
    const state = resolveState(rng, options.stateMode, options.stateUf);
    const city = rng.pick(state.cities);
    const location = buildLocation(rng, state, city);

    const birthDate =
      options.ageMode === 'exact'
        ? createBirthDateWithinAgeRange(rng, options.exactAge, options.exactAge)
        : createBirthDateWithinAgeRange(rng, options.minAge, options.maxAge);

    const age = calculateAge(birthDate);

    const childName = resolveNamesForPerson(
      rng,
      options.nameLanguage,
      options.nameStyle,
      gender,
    );

    const fatherBase = resolveNamesForPerson(rng, options.nameLanguage, options.nameStyle, 'male');
    const motherBase = resolveNamesForPerson(rng, options.nameLanguage, options.nameStyle, 'female');

    const fatherName = buildFullName(
      fatherBase.firstName,
      fatherBase.maternalSurname,
      fatherBase.paternalSurname,
    );

    const motherName = buildFullName(
      motherBase.firstName,
      motherBase.maternalSurname,
      motherBase.paternalSurname,
    );

    const childPaternalSurname = options.inheritFatherSurname
      ? fatherBase.paternalSurname
      : childName.paternalSurname;

    const fullName = buildFullName(
      childName.firstName,
      childName.maternalSurname,
      childPaternalSurname,
    );

    const cpf = generateValidCpf({ withPunctuation: options.cpfWithPunctuation });
    const rg = generateRgByUf(state.uf, rng);
    const email = buildEmail(rng, fullName, options.emailDomainMode);
    const phones = buildPhones(rng, city.ddd);
    const password = options.includePassword
      ? buildPassword(rng, options.passwordLength, options.passwordMode, childName.firstName)
      : '';

    const heightCm = gender === 'male' ? rng.int(162, 198) : rng.int(150, 186);
    const weightKg = gender === 'male' ? rng.int(58, 115) : rng.int(45, 98);

    return {
      id: `${state.uf}-${city.ddd}-${index + 1}-${rng.digits(4)}`,
      fullName,
      firstName: childName.firstName,
      fatherName: options.includeParents ? fatherName : '',
      motherName: options.includeParents ? motherName : '',
      gender,
      age,
      birthDate: formatBirthDate(birthDate),
      zodiacSign: getZodiacSign(birthDate),
      cpf,
      rg,
      email,
      mobilePhone: phones.mobile,
      landlinePhone: options.includeLandline ? phones.landline : '',
      password,
      location,
      extras: {
        bloodType: options.includeExtras ? rng.pick(bloodTypes) : '',
        heightCm: options.includeExtras ? heightCm : 0,
        weightKg: options.includeExtras ? weightKg : 0,
        favoriteColor: options.includeExtras ? rng.pick(favoriteColors) : '',
      },
    };
  });
};

export const generateFakePeopleWithRealAddresses = async (
  incomingOptions: Partial<FakePersonGeneratorOptions>,
): Promise<FakePerson[]> => {
  const options = sanitizeOptions(incomingOptions);
  const people = generateFakePeople(options);
  const lookupSeed = options.seed ? `${options.seed}-viacep` : '';
  const lookupRng = new RandomSource(lookupSeed);
  const poolsByLocation = new Map<string, ViaCepAddress[]>();

  const uniqueLocations = Array.from(
    new Set(people.map((person) => buildLocationLookupKey(person.location.stateUf, person.location.city))),
  ).slice(0, viaCepMaxUniqueLocationLookups);

  await Promise.all(
    uniqueLocations.map(async (locationKey) => {
      const sample = people.find(
        (person) => buildLocationLookupKey(person.location.stateUf, person.location.city) === locationKey,
      );

      if (!sample) {
        return;
      }

      const pool = await fetchRealAddressesForCity(
        lookupRng,
        sample.location.stateUf,
        sample.location.city,
      );

      poolsByLocation.set(locationKey, pool);
    }),
  );

  return people.map((person) => {
    const locationKey = buildLocationLookupKey(person.location.stateUf, person.location.city);
    const pool = poolsByLocation.get(locationKey) ?? [];

    if (pool.length === 0) {
      return person;
    }

    const pickedAddress = lookupRng.pick(pool);
    return mergePersonWithRealAddress(person, pickedAddress);
  });
};

const outputFieldsByPreset: Record<FakeOutputPreset, PersonFieldId[]> = {
  complete: [
    'fullName',
    'gender',
    'age',
    'birthDate',
    'zodiacSign',
    'cpf',
    'rg',
    'email',
    'mobilePhone',
    'landlinePhone',
    'state',
    'address',
    'motherName',
    'fatherName',
    'password',
  ],
  emails: ['fullName', 'email'],
  cpfs: ['fullName', 'cpf', 'rg'],
  phones: ['fullName', 'mobilePhone', 'landlinePhone'],
};

const genderLabelsByLocale: Record<AppLocale, Record<FakeGender, string>> = {
  'pt-br': {
    male: 'Masculino',
    female: 'Feminino',
  },
  en: {
    male: 'Male',
    female: 'Female',
  },
  es: {
    male: 'Masculino',
    female: 'Femenino',
  },
};

const zodiacByLocale: Record<AppLocale, Record<string, string>> = {
  'pt-br': {
    Aries: 'Aries',
    Touro: 'Touro',
    Gemeos: 'Gemeos',
    Cancer: 'Cancer',
    Leao: 'Leao',
    Virgem: 'Virgem',
    Libra: 'Libra',
    Escorpiao: 'Escorpiao',
    Sagitario: 'Sagitario',
    Capricornio: 'Capricornio',
    Aquario: 'Aquario',
    Peixes: 'Peixes',
  },
  en: {
    Aries: 'Aries',
    Touro: 'Taurus',
    Gemeos: 'Gemini',
    Cancer: 'Cancer',
    Leao: 'Leo',
    Virgem: 'Virgo',
    Libra: 'Libra',
    Escorpiao: 'Scorpio',
    Sagitario: 'Sagittarius',
    Capricornio: 'Capricorn',
    Aquario: 'Aquarius',
    Peixes: 'Pisces',
  },
  es: {
    Aries: 'Aries',
    Touro: 'Tauro',
    Gemeos: 'Geminis',
    Cancer: 'Cancer',
    Leao: 'Leo',
    Virgem: 'Virgo',
    Libra: 'Libra',
    Escorpiao: 'Escorpio',
    Sagitario: 'Sagitario',
    Capricornio: 'Capricornio',
    Aquario: 'Acuario',
    Peixes: 'Piscis',
  },
};

const favoriteColorByLocale: Record<AppLocale, Record<string, string>> = {
  'pt-br': {
    Azul: 'Azul',
    Verde: 'Verde',
    Vermelho: 'Vermelho',
    Preto: 'Preto',
    Branco: 'Branco',
    Cinza: 'Cinza',
    Laranja: 'Laranja',
    Amarelo: 'Amarelo',
    Roxo: 'Roxo',
    Turquesa: 'Turquesa',
    Rosa: 'Rosa',
    Marrom: 'Marrom',
  },
  en: {
    Azul: 'Blue',
    Verde: 'Green',
    Vermelho: 'Red',
    Preto: 'Black',
    Branco: 'White',
    Cinza: 'Gray',
    Laranja: 'Orange',
    Amarelo: 'Yellow',
    Roxo: 'Purple',
    Turquesa: 'Turquoise',
    Rosa: 'Pink',
    Marrom: 'Brown',
  },
  es: {
    Azul: 'Azul',
    Verde: 'Verde',
    Vermelho: 'Rojo',
    Preto: 'Negro',
    Branco: 'Blanco',
    Cinza: 'Gris',
    Laranja: 'Naranja',
    Amarelo: 'Amarillo',
    Roxo: 'Morado',
    Turquesa: 'Turquesa',
    Rosa: 'Rosa',
    Marrom: 'Marron',
  },
};

const fieldLabelMapByLocale: Record<AppLocale, Record<LocalizedFieldId, string>> = {
  'pt-br': {
    fullName: 'Nome',
    gender: 'Sexo',
    age: 'Idade',
    birthDate: 'Nascimento',
    zodiacSign: 'Signo',
    cpf: 'CPF',
    rg: 'RG',
    email: 'Email',
    mobilePhone: 'Celular',
    landlinePhone: 'Telefone fixo',
    state: 'Estado/Cidade',
    address: 'Endereco',
    motherName: 'Nome da mae',
    fatherName: 'Nome do pai',
    password: 'Senha',
    bloodType: 'Tipo sanguineo',
    heightCm: 'Altura',
    weightKg: 'Peso',
    favoriteColor: 'Cor favorita',
    cep: 'CEP',
    ddd: 'DDD',
  },
  en: {
    fullName: 'Full name',
    gender: 'Gender',
    age: 'Age',
    birthDate: 'Birth date',
    zodiacSign: 'Zodiac sign',
    cpf: 'CPF',
    rg: 'RG',
    email: 'Email',
    mobilePhone: 'Mobile phone',
    landlinePhone: 'Landline phone',
    state: 'State/City',
    address: 'Address',
    motherName: 'Mother name',
    fatherName: 'Father name',
    password: 'Password',
    bloodType: 'Blood type',
    heightCm: 'Height',
    weightKg: 'Weight',
    favoriteColor: 'Favorite color',
    cep: 'ZIP code',
    ddd: 'DDD',
  },
  es: {
    fullName: 'Nombre completo',
    gender: 'Sexo',
    age: 'Edad',
    birthDate: 'Nacimiento',
    zodiacSign: 'Signo',
    cpf: 'CPF',
    rg: 'RG',
    email: 'Email',
    mobilePhone: 'Celular',
    landlinePhone: 'Telefono fijo',
    state: 'Estado/Ciudad',
    address: 'Direccion',
    motherName: 'Nombre de la madre',
    fatherName: 'Nombre del padre',
    password: 'Contrasena',
    bloodType: 'Tipo sanguineo',
    heightCm: 'Altura',
    weightKg: 'Peso',
    favoriteColor: 'Color favorito',
    cep: 'Codigo postal',
    ddd: 'DDD',
  },
};

const localizeFavoriteColor = (value: string, locale: AppLocale): string =>
  favoriteColorByLocale[locale][value] ?? value;

const localizeZodiac = (value: string, locale: AppLocale): string =>
  zodiacByLocale[locale][value] ?? value;

const getFieldValue = (person: FakePerson, field: PersonFieldId, locale: AppLocale): string => {
  if (field === 'address') {
    return person.location.addressLine;
  }

  if (field === 'state') {
    return `${person.location.stateUf} - ${person.location.stateName} (${person.location.city})`;
  }

  const raw = person[field];

  if (field === 'gender') {
    return raw === 'male' ? genderLabelsByLocale[locale].male : genderLabelsByLocale[locale].female;
  }

  if (field === 'zodiacSign' && typeof raw === 'string') {
    return localizeZodiac(raw, locale);
  }

  if (typeof raw === 'string' || typeof raw === 'number') {
    return String(raw);
  }

  return '';
};

export const getFakePersonFields = (
  person: FakePerson,
  preset: FakeOutputPreset,
  locale: AppLocale = 'pt-br',
): FakePersonField[] => {
  const fields = outputFieldsByPreset[preset] ?? outputFieldsByPreset.complete;
  const labels = fieldLabelMapByLocale[locale];
  const rows: FakePersonField[] = [];

  for (const field of fields) {
    const value = getFieldValue(person, field, locale);

    if (!value) {
      continue;
    }

    rows.push({
      id: field,
      label: labels[field] ?? field,
      value,
    });
  }

  if (preset === 'complete') {
    if (person.extras.bloodType) {
      rows.push({ id: 'bloodType', label: labels.bloodType, value: person.extras.bloodType });
    }

    if (person.extras.heightCm > 0) {
      rows.push({ id: 'heightCm', label: labels.heightCm, value: `${person.extras.heightCm} cm` });
    }

    if (person.extras.weightKg > 0) {
      rows.push({ id: 'weightKg', label: labels.weightKg, value: `${person.extras.weightKg} kg` });
    }

    if (person.extras.favoriteColor) {
      rows.push({
        id: 'favoriteColor',
        label: labels.favoriteColor,
        value: localizeFavoriteColor(person.extras.favoriteColor, locale),
      });
    }

    rows.push({ id: 'cep', label: labels.cep, value: person.location.cep });
    rows.push({ id: 'ddd', label: labels.ddd, value: person.location.ddd });
  }

  return rows;
};

export const buildFakePeopleOutput = (
  people: FakePerson[],
  preset: FakeOutputPreset,
  locale: AppLocale = 'pt-br',
): FakePersonOutput => {
  const normalized = people.map((person) => {
    const fields = getFakePersonFields(person, preset, locale);

    return fields.reduce<Record<string, string>>((accumulator, field) => {
      accumulator[field.id] = field.value;
      return accumulator;
    }, {});
  });

  const personLabelByLocale: Record<AppLocale, string> = {
    'pt-br': 'Pessoa',
    en: 'Person',
    es: 'Persona',
  };

  const text = normalized
    .map((person, index) => {
      const lines = Object.entries(person).map(([key, value]) => `${key}: ${value}`);
      return [`${personLabelByLocale[locale]} ${index + 1}`, ...lines].join('\n');
    })
    .join('\n\n');

  const json = JSON.stringify(normalized, null, 2);

  const csvHeaders = Array.from(
    new Set(normalized.flatMap((person) => Object.keys(person))),
  );

  const csvRows = normalized.map((person) =>
    csvHeaders
      .map((header) => {
        const raw = person[header] ?? '';
        return `"${String(raw).replace(/"/g, '""')}"`;
      })
      .join(','),
  );

  const csv = `${csvHeaders.join(',')}\n${csvRows.join('\n')}`;

  const tableName = preset === 'complete' ? 'fake_people' : `fake_people_${preset}`;
  const sqlColumns = csvHeaders.map((header) => `\`${header}\``).join(', ');
  const sqlValues = normalized
    .map((person) => {
      const values = csvHeaders.map((header) => {
        const raw = person[header] ?? '';
        const escaped = String(raw).replace(/'/g, "''");
        return `'${escaped}'`;
      });

      return `(${values.join(', ')})`;
    })
    .join(',\n');

  const sql = `INSERT INTO ${tableName} (${sqlColumns}) VALUES\n${sqlValues};`;

  return {
    json,
    text,
    csv,
    sql,
  };
};

export const fakePersonDefaultOptions = defaultOptions;
