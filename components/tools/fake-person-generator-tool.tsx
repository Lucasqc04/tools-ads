'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  buildFakePeopleOutput,
  fakePersonDefaultOptions,
  generateFakePeople,
  getFakePersonCitiesByState,
  getFakePersonFields,
  getFakePersonStateOptions,
  type FakeAgeMode,
  type FakeEmailDomainMode,
  type FakeGenderMode,
  type FakeNameLanguage,
  type FakeNameStyle,
  type FakeOutputPreset,
  type FakePasswordMode,
  type FakePerson,
  type FakeStateMode,
} from '@/lib/fake-person';
import { type AppLocale } from '@/lib/i18n/config';

type FakePersonGeneratorToolProps = Readonly<{
  locale?: AppLocale;
}>;

type Ui = {
  title: string;
  intro: string;
  warning: string;
  quantityLabel: string;
  genderLabel: string;
  genderRandom: string;
  genderMale: string;
  genderFemale: string;
  ageModeLabel: string;
  ageModeExact: string;
  ageModeRange: string;
  exactAgeLabel: string;
  minAgeLabel: string;
  maxAgeLabel: string;
  stateModeLabel: string;
  stateModeRandom: string;
  stateModeSpecific: string;
  stateLabel: string;
  cityHintLabel: string;
  cpfFormatLabel: string;
  cpfWithMask: string;
  cpfWithoutMask: string;
  emailDomainLabel: string;
  domainRandom: string;
  nameLanguageLabel: string;
  nameLanguageBr: string;
  nameLanguageIntl: string;
  nameStyleLabel: string;
  nameStyleCommon: string;
  nameStyleRare: string;
  outputPresetLabel: string;
  outputPresetComplete: string;
  outputPresetEmails: string;
  outputPresetCpfs: string;
  outputPresetPhones: string;
  includeParents: string;
  inheritFatherSurname: string;
  includeExtras: string;
  includeLandline: string;
  includePassword: string;
  passwordModeLabel: string;
  passwordModeStrong: string;
  passwordModeWeak: string;
  passwordModeNumeric: string;
  passwordLengthLabel: string;
  seedLabel: string;
  generateButton: string;
  generateMoreButton: string;
  clearButton: string;
  invalidInput: string;
  generatedCount: (count: number) => string;
  copyField: string;
  copiedField: string;
  copyCard: string;
  regenerateCard: string;
  noResults: string;
  outputsTitle: string;
  outputTabText: string;
  outputTabJson: string;
  outputTabCsv: string;
  outputTabSql: string;
  copyTextOutput: string;
  copyJsonOutput: string;
  copyCsvOutput: string;
  copySqlOutput: string;
  downloadJson: string;
  downloadCsv: string;
  copyShareLink: string;
  historyTitle: string;
  historyEmpty: string;
  historyItem: (count: number, stamp: string) => string;
  localNote: string;
  copyError: string;
};

const ptUi: Ui = {
  title: 'Gerador de Pessoa Fake para Testes (Brasil)',
  intro:
    'Gere pessoas ficticias coerentes com CPF valido, RG, idade, nascimento, endereco, DDD, CEP, email e telefone para QA, homologacao e automacao.',
  warning: 'Dados gerados sao ficticios e devem ser usados apenas para testes.',
  quantityLabel: 'Quantidade (1 a 30)',
  genderLabel: 'Sexo',
  genderRandom: 'Aleatorio',
  genderMale: 'Masculino',
  genderFemale: 'Feminino',
  ageModeLabel: 'Modo de idade',
  ageModeExact: 'Idade exata',
  ageModeRange: 'Faixa de idade',
  exactAgeLabel: 'Idade exata',
  minAgeLabel: 'Idade minima',
  maxAgeLabel: 'Idade maxima',
  stateModeLabel: 'Localizacao',
  stateModeRandom: 'Aleatorio e coerente',
  stateModeSpecific: 'Estado especifico',
  stateLabel: 'Estado (UF)',
  cityHintLabel: 'Cidades possiveis da UF',
  cpfFormatLabel: 'Formato do CPF',
  cpfWithMask: 'Com pontuacao',
  cpfWithoutMask: 'Sem pontuacao',
  emailDomainLabel: 'Dominio de email',
  domainRandom: 'Famosos aleatorio (gmail/hotmail/outlook/yahoo)',
  nameLanguageLabel: 'Idioma do nome',
  nameLanguageBr: 'Brasileiro',
  nameLanguageIntl: 'Internacional',
  nameStyleLabel: 'Estilo do nome',
  nameStyleCommon: 'Comum',
  nameStyleRare: 'Raro',
  outputPresetLabel: 'Preset de saida (modo dev)',
  outputPresetComplete: 'Completo',
  outputPresetEmails: 'Somente emails',
  outputPresetCpfs: 'Somente CPF/RG',
  outputPresetPhones: 'Somente telefones',
  includeParents: 'Gerar nome da mae e do pai',
  inheritFatherSurname: 'Herdar ultimo sobrenome do pai',
  includeExtras: 'Gerar extras (sangue, altura, peso, cor favorita)',
  includeLandline: 'Gerar telefone fixo',
  includePassword: 'Gerar senha',
  passwordModeLabel: 'Modo da senha',
  passwordModeStrong: 'Forte',
  passwordModeWeak: 'Fraca',
  passwordModeNumeric: 'So numeros',
  passwordLengthLabel: 'Tamanho da senha',
  seedLabel: 'Seed fixa (opcional, para reproducao)',
  generateButton: 'Gerar pessoas',
  generateMoreButton: 'Gerar mais',
  clearButton: 'Limpar',
  invalidInput: 'Revise quantidade, idade e senha para continuar.',
  generatedCount: (count) => `${count} pessoa(s) gerada(s).`,
  copyField: 'Copiar',
  copiedField: 'Copiado',
  copyCard: 'Copiar card',
  regenerateCard: 'Regenerar pessoa',
  noResults: 'Nenhuma pessoa gerada ainda. Configure e clique em gerar.',
  outputsTitle: 'Saidas para testes (texto, JSON, CSV, SQL)',
  outputTabText: 'Texto',
  outputTabJson: 'JSON',
  outputTabCsv: 'CSV',
  outputTabSql: 'SQL',
  copyTextOutput: 'Copiar texto',
  copyJsonOutput: 'Copiar JSON',
  copyCsvOutput: 'Copiar CSV',
  copySqlOutput: 'Copiar SQL',
  downloadJson: 'Baixar JSON',
  downloadCsv: 'Baixar CSV',
  copyShareLink: 'Copiar link compartilhavel',
  historyTitle: 'Historico recente',
  historyEmpty: 'Sem historico por enquanto.',
  historyItem: (count, stamp) => `${count} pessoa(s) em ${stamp}`,
  localNote:
    'Processamento local no navegador. Nenhum dado e enviado para servidor por padrao.',
  copyError: 'Nao foi possivel copiar agora. Tente novamente.',
};

const enUi: Ui = {
  title: 'Fake Person Generator for Testing (Brazil)',
  intro:
    'Generate coherent fictional profiles with valid CPF, RG, birth date, zodiac sign, address, DDD, ZIP code, email, and phone for QA and automation.',
  warning: 'Generated data is fictional and must be used for testing only.',
  quantityLabel: 'Quantity (1 to 30)',
  genderLabel: 'Gender',
  genderRandom: 'Random',
  genderMale: 'Male',
  genderFemale: 'Female',
  ageModeLabel: 'Age mode',
  ageModeExact: 'Exact age',
  ageModeRange: 'Age range',
  exactAgeLabel: 'Exact age',
  minAgeLabel: 'Minimum age',
  maxAgeLabel: 'Maximum age',
  stateModeLabel: 'Location',
  stateModeRandom: 'Random and coherent',
  stateModeSpecific: 'Specific state',
  stateLabel: 'State (UF)',
  cityHintLabel: 'Possible cities in selected state',
  cpfFormatLabel: 'CPF format',
  cpfWithMask: 'With punctuation',
  cpfWithoutMask: 'Plain digits',
  emailDomainLabel: 'Email domain',
  domainRandom: 'Popular random (gmail/hotmail/outlook/yahoo)',
  nameLanguageLabel: 'Name language',
  nameLanguageBr: 'Brazilian',
  nameLanguageIntl: 'International',
  nameStyleLabel: 'Name style',
  nameStyleCommon: 'Common',
  nameStyleRare: 'Rare',
  outputPresetLabel: 'Output preset (dev mode)',
  outputPresetComplete: 'Complete',
  outputPresetEmails: 'Emails only',
  outputPresetCpfs: 'CPF/RG only',
  outputPresetPhones: 'Phones only',
  includeParents: 'Generate mother and father names',
  inheritFatherSurname: 'Inherit last surname from father',
  includeExtras: 'Generate extras (blood type, height, weight, favorite color)',
  includeLandline: 'Generate landline number',
  includePassword: 'Generate password',
  passwordModeLabel: 'Password mode',
  passwordModeStrong: 'Strong',
  passwordModeWeak: 'Weak',
  passwordModeNumeric: 'Numbers only',
  passwordLengthLabel: 'Password length',
  seedLabel: 'Fixed seed (optional, reproducible output)',
  generateButton: 'Generate people',
  generateMoreButton: 'Generate more',
  clearButton: 'Clear',
  invalidInput: 'Review quantity, age, and password settings.',
  generatedCount: (count) => `${count} generated profile(s).`,
  copyField: 'Copy',
  copiedField: 'Copied',
  copyCard: 'Copy card',
  regenerateCard: 'Regenerate person',
  noResults: 'No generated profiles yet. Configure inputs and click generate.',
  outputsTitle: 'Testing outputs (text, JSON, CSV, SQL)',
  outputTabText: 'Text',
  outputTabJson: 'JSON',
  outputTabCsv: 'CSV',
  outputTabSql: 'SQL',
  copyTextOutput: 'Copy text',
  copyJsonOutput: 'Copy JSON',
  copyCsvOutput: 'Copy CSV',
  copySqlOutput: 'Copy SQL',
  downloadJson: 'Download JSON',
  downloadCsv: 'Download CSV',
  copyShareLink: 'Copy shareable link',
  historyTitle: 'Recent history',
  historyEmpty: 'No history yet.',
  historyItem: (count, stamp) => `${count} profile(s) at ${stamp}`,
  localNote: 'Local browser processing. No automatic server upload by default.',
  copyError: 'Could not copy right now. Please try again.',
};

const esUi: Ui = {
  title: 'Generador de Persona Fake para Pruebas (Brasil)',
  intro:
    'Genera perfiles ficticios coherentes con CPF valido, RG, nacimiento, signo, direccion, DDD, codigo postal, email y telefono para QA y automatizacion.',
  warning: 'Los datos generados son ficticios y deben usarse solo para pruebas.',
  quantityLabel: 'Cantidad (1 a 30)',
  genderLabel: 'Sexo',
  genderRandom: 'Aleatorio',
  genderMale: 'Masculino',
  genderFemale: 'Femenino',
  ageModeLabel: 'Modo de edad',
  ageModeExact: 'Edad exacta',
  ageModeRange: 'Rango de edad',
  exactAgeLabel: 'Edad exacta',
  minAgeLabel: 'Edad minima',
  maxAgeLabel: 'Edad maxima',
  stateModeLabel: 'Ubicacion',
  stateModeRandom: 'Aleatorio y coherente',
  stateModeSpecific: 'Estado especifico',
  stateLabel: 'Estado (UF)',
  cityHintLabel: 'Ciudades posibles del estado',
  cpfFormatLabel: 'Formato de CPF',
  cpfWithMask: 'Con puntuacion',
  cpfWithoutMask: 'Sin puntuacion',
  emailDomainLabel: 'Dominio de email',
  domainRandom: 'Populares aleatorio (gmail/hotmail/outlook/yahoo)',
  nameLanguageLabel: 'Idioma del nombre',
  nameLanguageBr: 'Brasileno',
  nameLanguageIntl: 'Internacional',
  nameStyleLabel: 'Estilo del nombre',
  nameStyleCommon: 'Comun',
  nameStyleRare: 'Raro',
  outputPresetLabel: 'Preset de salida (modo dev)',
  outputPresetComplete: 'Completo',
  outputPresetEmails: 'Solo emails',
  outputPresetCpfs: 'Solo CPF/RG',
  outputPresetPhones: 'Solo telefonos',
  includeParents: 'Generar nombre de madre y padre',
  inheritFatherSurname: 'Heredar ultimo apellido del padre',
  includeExtras: 'Generar extras (sangre, altura, peso, color favorita)',
  includeLandline: 'Generar telefono fijo',
  includePassword: 'Generar contrasena',
  passwordModeLabel: 'Modo de contrasena',
  passwordModeStrong: 'Fuerte',
  passwordModeWeak: 'Debil',
  passwordModeNumeric: 'Solo numeros',
  passwordLengthLabel: 'Tamano de contrasena',
  seedLabel: 'Seed fija (opcional, salida reproducible)',
  generateButton: 'Generar personas',
  generateMoreButton: 'Generar mas',
  clearButton: 'Limpiar',
  invalidInput: 'Revisa cantidad, edad y configuracion de contrasena.',
  generatedCount: (count) => `${count} persona(s) generada(s).`,
  copyField: 'Copiar',
  copiedField: 'Copiado',
  copyCard: 'Copiar card',
  regenerateCard: 'Regenerar persona',
  noResults: 'Todavia no hay personas generadas. Configura y pulsa generar.',
  outputsTitle: 'Salidas para pruebas (texto, JSON, CSV, SQL)',
  outputTabText: 'Texto',
  outputTabJson: 'JSON',
  outputTabCsv: 'CSV',
  outputTabSql: 'SQL',
  copyTextOutput: 'Copiar texto',
  copyJsonOutput: 'Copiar JSON',
  copyCsvOutput: 'Copiar CSV',
  copySqlOutput: 'Copiar SQL',
  downloadJson: 'Descargar JSON',
  downloadCsv: 'Descargar CSV',
  copyShareLink: 'Copiar enlace compartible',
  historyTitle: 'Historial reciente',
  historyEmpty: 'Sin historial por ahora.',
  historyItem: (count, stamp) => `${count} persona(s) en ${stamp}`,
  localNote: 'Procesamiento local en navegador. No hay envio automatico a servidor.',
  copyError: 'No fue posible copiar ahora. Intentalo de nuevo.',
};

const uiByLocale: Record<AppLocale, Ui> = {
  'pt-br': ptUi,
  en: enUi,
  es: esUi,
};

const checkboxClassName =
  'h-4 w-4 rounded border border-slate-300 text-brand-600 focus:ring-2 focus:ring-brand-200';

const storageKey = 'tool:fake-person-generator:v1';

const parsePositiveInt = (value: string, fallback: number): number => {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.max(1, Math.floor(parsed));
};

const downloadFile = (filename: string, content: string, mimeType: string): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};

const localeToIntl: Record<AppLocale, string> = {
  'pt-br': 'pt-BR',
  en: 'en-US',
  es: 'es-ES',
};

const nowStamp = (locale: AppLocale): string =>
  new Date().toLocaleString(localeToIntl[locale], {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export function FakePersonGeneratorTool({ locale = 'pt-br' }: FakePersonGeneratorToolProps) {
  const ui = uiByLocale[locale];

  const [quantityInput, setQuantityInput] = useState(String(fakePersonDefaultOptions.quantity));
  const [genderMode, setGenderMode] = useState<FakeGenderMode>(fakePersonDefaultOptions.genderMode);
  const [ageMode, setAgeMode] = useState<FakeAgeMode>(fakePersonDefaultOptions.ageMode);
  const [exactAgeInput, setExactAgeInput] = useState(String(fakePersonDefaultOptions.exactAge));
  const [minAgeInput, setMinAgeInput] = useState(String(fakePersonDefaultOptions.minAge));
  const [maxAgeInput, setMaxAgeInput] = useState(String(fakePersonDefaultOptions.maxAge));
  const [stateMode, setStateMode] = useState<FakeStateMode>(fakePersonDefaultOptions.stateMode);
  const [stateUf, setStateUf] = useState(fakePersonDefaultOptions.stateUf);
  const [cpfWithPunctuation, setCpfWithPunctuation] = useState(
    fakePersonDefaultOptions.cpfWithPunctuation,
  );
  const [emailDomainMode, setEmailDomainMode] = useState<FakeEmailDomainMode>(
    fakePersonDefaultOptions.emailDomainMode,
  );
  const [nameLanguage, setNameLanguage] = useState<FakeNameLanguage>(
    fakePersonDefaultOptions.nameLanguage,
  );
  const [nameStyle, setNameStyle] = useState<FakeNameStyle>(fakePersonDefaultOptions.nameStyle);
  const [outputPreset, setOutputPreset] = useState<FakeOutputPreset>(
    fakePersonDefaultOptions.outputPreset,
  );
  const [includeParents, setIncludeParents] = useState(fakePersonDefaultOptions.includeParents);
  const [inheritFatherSurname, setInheritFatherSurname] = useState(
    fakePersonDefaultOptions.inheritFatherSurname,
  );
  const [includeExtras, setIncludeExtras] = useState(fakePersonDefaultOptions.includeExtras);
  const [includeLandline, setIncludeLandline] = useState(fakePersonDefaultOptions.includeLandline);
  const [includePassword, setIncludePassword] = useState(fakePersonDefaultOptions.includePassword);
  const [passwordMode, setPasswordMode] = useState<FakePasswordMode>(
    fakePersonDefaultOptions.passwordMode,
  );
  const [passwordLengthInput, setPasswordLengthInput] = useState(
    String(fakePersonDefaultOptions.passwordLength),
  );
  const [seedInput, setSeedInput] = useState(fakePersonDefaultOptions.seed);

  const [people, setPeople] = useState<FakePerson[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [copiedToken, setCopiedToken] = useState('');
  const [history, setHistory] = useState<Array<{ stamp: string; count: number }>>([]);
  const [previewMode, setPreviewMode] = useState<'text' | 'json' | 'csv' | 'sql'>('text');

  const states = useMemo(() => getFakePersonStateOptions(), []);
  const citiesFromState = useMemo(() => getFakePersonCitiesByState(stateUf), [stateUf]);

  useEffect(() => {
    const params = new URLSearchParams(globalThis.location.search);

    if (params.size) {
      const value = (key: string): string | null => params.get(key);

      if (value('q')) setQuantityInput(value('q') ?? String(fakePersonDefaultOptions.quantity));
      if (value('g')) setGenderMode(value('g') as FakeGenderMode);
      if (value('am')) setAgeMode(value('am') as FakeAgeMode);
      if (value('ea')) setExactAgeInput(value('ea') ?? String(fakePersonDefaultOptions.exactAge));
      if (value('min')) setMinAgeInput(value('min') ?? String(fakePersonDefaultOptions.minAge));
      if (value('max')) setMaxAgeInput(value('max') ?? String(fakePersonDefaultOptions.maxAge));
      if (value('sm')) setStateMode(value('sm') as FakeStateMode);
      if (value('uf')) setStateUf(value('uf') ?? fakePersonDefaultOptions.stateUf);
      if (value('cpfMask')) setCpfWithPunctuation(value('cpfMask') === '1');
      if (value('domain')) setEmailDomainMode(value('domain') as FakeEmailDomainMode);
      if (value('lang')) setNameLanguage(value('lang') as FakeNameLanguage);
      if (value('style')) setNameStyle(value('style') as FakeNameStyle);
      if (value('preset')) setOutputPreset(value('preset') as FakeOutputPreset);
      if (value('parents')) setIncludeParents(value('parents') === '1');
      if (value('inherit')) setInheritFatherSurname(value('inherit') === '1');
      if (value('extras')) setIncludeExtras(value('extras') === '1');
      if (value('landline')) setIncludeLandline(value('landline') === '1');
      if (value('pwd')) setIncludePassword(value('pwd') === '1');
      if (value('pwdMode')) setPasswordMode(value('pwdMode') as FakePasswordMode);
      if (value('pwdLen')) {
        setPasswordLengthInput(value('pwdLen') ?? String(fakePersonDefaultOptions.passwordLength));
      }
      if (value('seed')) setSeedInput(value('seed') ?? '');

      return;
    }

    const stored = globalThis.localStorage.getItem(storageKey);

    if (!stored) {
      return;
    }

    try {
      const parsed = JSON.parse(stored) as {
        quantityInput?: string;
        genderMode?: FakeGenderMode;
        ageMode?: FakeAgeMode;
        exactAgeInput?: string;
        minAgeInput?: string;
        maxAgeInput?: string;
        stateMode?: FakeStateMode;
        stateUf?: string;
        cpfWithPunctuation?: boolean;
        emailDomainMode?: FakeEmailDomainMode;
        nameLanguage?: FakeNameLanguage;
        nameStyle?: FakeNameStyle;
        outputPreset?: FakeOutputPreset;
        includeParents?: boolean;
        inheritFatherSurname?: boolean;
        includeExtras?: boolean;
        includeLandline?: boolean;
        includePassword?: boolean;
        passwordMode?: FakePasswordMode;
        passwordLengthInput?: string;
        seedInput?: string;
      };

      if (parsed.quantityInput) setQuantityInput(parsed.quantityInput);
      if (parsed.genderMode) setGenderMode(parsed.genderMode);
      if (parsed.ageMode) setAgeMode(parsed.ageMode);
      if (parsed.exactAgeInput) setExactAgeInput(parsed.exactAgeInput);
      if (parsed.minAgeInput) setMinAgeInput(parsed.minAgeInput);
      if (parsed.maxAgeInput) setMaxAgeInput(parsed.maxAgeInput);
      if (parsed.stateMode) setStateMode(parsed.stateMode);
      if (parsed.stateUf) setStateUf(parsed.stateUf);
      if (typeof parsed.cpfWithPunctuation === 'boolean') setCpfWithPunctuation(parsed.cpfWithPunctuation);
      if (parsed.emailDomainMode) setEmailDomainMode(parsed.emailDomainMode);
      if (parsed.nameLanguage) setNameLanguage(parsed.nameLanguage);
      if (parsed.nameStyle) setNameStyle(parsed.nameStyle);
      if (parsed.outputPreset) setOutputPreset(parsed.outputPreset);
      if (typeof parsed.includeParents === 'boolean') setIncludeParents(parsed.includeParents);
      if (typeof parsed.inheritFatherSurname === 'boolean') setInheritFatherSurname(parsed.inheritFatherSurname);
      if (typeof parsed.includeExtras === 'boolean') setIncludeExtras(parsed.includeExtras);
      if (typeof parsed.includeLandline === 'boolean') setIncludeLandline(parsed.includeLandline);
      if (typeof parsed.includePassword === 'boolean') setIncludePassword(parsed.includePassword);
      if (parsed.passwordMode) setPasswordMode(parsed.passwordMode);
      if (parsed.passwordLengthInput) setPasswordLengthInput(parsed.passwordLengthInput);
      if (parsed.seedInput) setSeedInput(parsed.seedInput);
    } catch {
      globalThis.localStorage.removeItem(storageKey);
    }
  }, []);

  useEffect(() => {
    globalThis.localStorage.setItem(
      storageKey,
      JSON.stringify({
        quantityInput,
        genderMode,
        ageMode,
        exactAgeInput,
        minAgeInput,
        maxAgeInput,
        stateMode,
        stateUf,
        cpfWithPunctuation,
        emailDomainMode,
        nameLanguage,
        nameStyle,
        outputPreset,
        includeParents,
        inheritFatherSurname,
        includeExtras,
        includeLandline,
        includePassword,
        passwordMode,
        passwordLengthInput,
        seedInput,
      }),
    );
  }, [
    quantityInput,
    genderMode,
    ageMode,
    exactAgeInput,
    minAgeInput,
    maxAgeInput,
    stateMode,
    stateUf,
    cpfWithPunctuation,
    emailDomainMode,
    nameLanguage,
    nameStyle,
    outputPreset,
    includeParents,
    inheritFatherSurname,
    includeExtras,
    includeLandline,
    includePassword,
    passwordMode,
    passwordLengthInput,
    seedInput,
  ]);

  const normalizedOptions = useMemo(() => {
    const quantity = parsePositiveInt(quantityInput, fakePersonDefaultOptions.quantity);
    const exactAge = parsePositiveInt(exactAgeInput, fakePersonDefaultOptions.exactAge);
    const minAge = parsePositiveInt(minAgeInput, fakePersonDefaultOptions.minAge);
    const maxAge = parsePositiveInt(maxAgeInput, fakePersonDefaultOptions.maxAge);
    const passwordLength = parsePositiveInt(
      passwordLengthInput,
      fakePersonDefaultOptions.passwordLength,
    );

    return {
      quantity,
      genderMode,
      ageMode,
      exactAge,
      minAge,
      maxAge,
      stateMode,
      stateUf,
      cpfWithPunctuation,
      emailDomainMode,
      includeParents,
      inheritFatherSurname,
      includeExtras,
      includeLandline,
      includePassword,
      passwordMode,
      passwordLength,
      nameLanguage,
      nameStyle,
      seed: seedInput.trim(),
      outputPreset,
    };
  }, [
    quantityInput,
    genderMode,
    ageMode,
    exactAgeInput,
    minAgeInput,
    maxAgeInput,
    stateMode,
    stateUf,
    cpfWithPunctuation,
    emailDomainMode,
    includeParents,
    inheritFatherSurname,
    includeExtras,
    includeLandline,
    includePassword,
    passwordMode,
    passwordLengthInput,
    nameLanguage,
    nameStyle,
    seedInput,
    outputPreset,
  ]);

  const currentOutput = useMemo(
    () => buildFakePeopleOutput(people, outputPreset, locale),
    [people, outputPreset, locale],
  );

  const previewValue =
    previewMode === 'text'
      ? currentOutput.text
      : previewMode === 'json'
        ? currentOutput.json
        : previewMode === 'csv'
          ? currentOutput.csv
          : currentOutput.sql;

  const generatePeople = (append: boolean) => {
    if (normalizedOptions.quantity < 1 || normalizedOptions.quantity > 30) {
      setErrorMessage(ui.invalidInput);
      return;
    }

    if (normalizedOptions.ageMode === 'range' && normalizedOptions.minAge > normalizedOptions.maxAge) {
      setErrorMessage(ui.invalidInput);
      return;
    }

    const nextPeople = generateFakePeople(normalizedOptions);

    setPeople((current) => (append ? [...current, ...nextPeople] : nextPeople));
    setHistory((current) => [
      { stamp: nowStamp(locale), count: nextPeople.length },
      ...current,
    ].slice(0, 8));
    setErrorMessage('');
    setFeedbackMessage('');
  };

  const regenerateOne = (index: number) => {
    const seedSuffix = normalizedOptions.seed
      ? `${normalizedOptions.seed}-regen-${index}-${Date.now()}`
      : '';

    const replacement = generateFakePeople({
      ...normalizedOptions,
      quantity: 1,
      seed: seedSuffix,
    })[0];

    if (!replacement) {
      return;
    }

    setPeople((current) => current.map((item, itemIndex) => (itemIndex === index ? replacement : item)));
  };

  const copyText = async (token: string, value: string) => {
    if (!value) {
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setCopiedToken(token);
      setFeedbackMessage('');
      globalThis.setTimeout(() => {
        setCopiedToken((current) => (current === token ? '' : current));
      }, 1400);
    } catch {
      setFeedbackMessage(ui.copyError);
    }
  };

  const copyShareLink = async () => {
    try {
      const query = new URLSearchParams();
      query.set('q', String(normalizedOptions.quantity));
      query.set('g', normalizedOptions.genderMode);
      query.set('am', normalizedOptions.ageMode);
      query.set('ea', String(normalizedOptions.exactAge));
      query.set('min', String(normalizedOptions.minAge));
      query.set('max', String(normalizedOptions.maxAge));
      query.set('sm', normalizedOptions.stateMode);
      query.set('uf', normalizedOptions.stateUf);
      query.set('cpfMask', normalizedOptions.cpfWithPunctuation ? '1' : '0');
      query.set('domain', normalizedOptions.emailDomainMode);
      query.set('lang', normalizedOptions.nameLanguage);
      query.set('style', normalizedOptions.nameStyle);
      query.set('preset', normalizedOptions.outputPreset);
      query.set('parents', normalizedOptions.includeParents ? '1' : '0');
      query.set('inherit', normalizedOptions.inheritFatherSurname ? '1' : '0');
      query.set('extras', normalizedOptions.includeExtras ? '1' : '0');
      query.set('landline', normalizedOptions.includeLandline ? '1' : '0');
      query.set('pwd', normalizedOptions.includePassword ? '1' : '0');
      query.set('pwdMode', normalizedOptions.passwordMode);
      query.set('pwdLen', String(normalizedOptions.passwordLength));

      if (normalizedOptions.seed) {
        query.set('seed', normalizedOptions.seed);
      }

      const link = `${globalThis.location.origin}${globalThis.location.pathname}?${query.toString()}`;
      await copyText('share-link', link);
    } catch {
      setFeedbackMessage(ui.copyError);
    }
  };

  return (
    <Card className="space-y-5">
      <header className="rounded-xl border border-brand-200 bg-gradient-to-r from-brand-50 to-indigo-50 p-4">
        <h3 className="text-lg font-semibold text-slate-900">{ui.title}</h3>
        <p className="mt-1 text-sm text-slate-700">{ui.intro}</p>
      </header>

      <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
        <strong>{ui.warning}</strong>
      </p>

      <section className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">{ui.quantityLabel}</span>
            <Input
              inputMode="numeric"
              min={1}
              max={30}
              value={quantityInput}
              onChange={(event) => setQuantityInput(event.target.value)}
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">{ui.genderLabel}</span>
            <Select
              value={genderMode}
              onChange={(event) => setGenderMode(event.target.value as FakeGenderMode)}
            >
              <option value="random">{ui.genderRandom}</option>
              <option value="male">{ui.genderMale}</option>
              <option value="female">{ui.genderFemale}</option>
            </Select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">{ui.ageModeLabel}</span>
            <Select
              value={ageMode}
              onChange={(event) => setAgeMode(event.target.value as FakeAgeMode)}
            >
              <option value="exact">{ui.ageModeExact}</option>
              <option value="range">{ui.ageModeRange}</option>
            </Select>
          </label>

          {ageMode === 'exact' ? (
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-800">{ui.exactAgeLabel}</span>
              <Input
                inputMode="numeric"
                value={exactAgeInput}
                onChange={(event) => setExactAgeInput(event.target.value)}
              />
            </label>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-800">{ui.minAgeLabel}</span>
                <Input
                  inputMode="numeric"
                  value={minAgeInput}
                  onChange={(event) => setMinAgeInput(event.target.value)}
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-800">{ui.maxAgeLabel}</span>
                <Input
                  inputMode="numeric"
                  value={maxAgeInput}
                  onChange={(event) => setMaxAgeInput(event.target.value)}
                />
              </label>
            </div>
          )}
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">{ui.stateModeLabel}</span>
            <Select
              value={stateMode}
              onChange={(event) => setStateMode(event.target.value as FakeStateMode)}
            >
              <option value="random">{ui.stateModeRandom}</option>
              <option value="specific">{ui.stateModeSpecific}</option>
            </Select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">{ui.stateLabel}</span>
            <Select
              value={stateUf}
              disabled={stateMode !== 'specific'}
              onChange={(event) => setStateUf(event.target.value)}
            >
              {states.map((state) => (
                <option key={state.uf} value={state.uf}>
                  {state.uf} - {state.name}
                </option>
              ))}
            </Select>
          </label>

          <label className="space-y-2 lg:col-span-2">
            <span className="text-sm font-semibold text-slate-800">{ui.cityHintLabel}</span>
            <Input
              value={citiesFromState.map((city) => `${city.name} (${city.ddd})`).join(' | ') || '--'}
              disabled
            />
          </label>
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">{ui.cpfFormatLabel}</span>
            <Select
              value={cpfWithPunctuation ? 'with' : 'without'}
              onChange={(event) => setCpfWithPunctuation(event.target.value === 'with')}
            >
              <option value="with">{ui.cpfWithMask}</option>
              <option value="without">{ui.cpfWithoutMask}</option>
            </Select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">{ui.emailDomainLabel}</span>
            <Select
              value={emailDomainMode}
              onChange={(event) => setEmailDomainMode(event.target.value as FakeEmailDomainMode)}
            >
              <option value="popular-random">{ui.domainRandom}</option>
              <option value="gmail.com">gmail.com</option>
              <option value="hotmail.com">hotmail.com</option>
              <option value="outlook.com">outlook.com</option>
              <option value="yahoo.com">yahoo.com</option>
            </Select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">{ui.nameLanguageLabel}</span>
            <Select
              value={nameLanguage}
              onChange={(event) => setNameLanguage(event.target.value as FakeNameLanguage)}
            >
              <option value="brazilian">{ui.nameLanguageBr}</option>
              <option value="international">{ui.nameLanguageIntl}</option>
            </Select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">{ui.nameStyleLabel}</span>
            <Select
              value={nameStyle}
              onChange={(event) => setNameStyle(event.target.value as FakeNameStyle)}
            >
              <option value="common">{ui.nameStyleCommon}</option>
              <option value="rare">{ui.nameStyleRare}</option>
            </Select>
          </label>
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <label className="space-y-2 lg:col-span-2">
            <span className="text-sm font-semibold text-slate-800">{ui.outputPresetLabel}</span>
            <Select
              value={outputPreset}
              onChange={(event) => setOutputPreset(event.target.value as FakeOutputPreset)}
            >
              <option value="complete">{ui.outputPresetComplete}</option>
              <option value="emails">{ui.outputPresetEmails}</option>
              <option value="cpfs">{ui.outputPresetCpfs}</option>
              <option value="phones">{ui.outputPresetPhones}</option>
            </Select>
          </label>

          <label className="space-y-2 lg:col-span-2">
            <span className="text-sm font-semibold text-slate-800">{ui.seedLabel}</span>
            <Input value={seedInput} onChange={(event) => setSeedInput(event.target.value)} />
          </label>
        </div>

        <div className="grid gap-2 md:grid-cols-2">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              className={checkboxClassName}
              checked={includeParents}
              onChange={(event) => setIncludeParents(event.target.checked)}
            />
            {ui.includeParents}
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              className={checkboxClassName}
              checked={inheritFatherSurname}
              onChange={(event) => setInheritFatherSurname(event.target.checked)}
            />
            {ui.inheritFatherSurname}
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              className={checkboxClassName}
              checked={includeExtras}
              onChange={(event) => setIncludeExtras(event.target.checked)}
            />
            {ui.includeExtras}
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              className={checkboxClassName}
              checked={includeLandline}
              onChange={(event) => setIncludeLandline(event.target.checked)}
            />
            {ui.includeLandline}
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              className={checkboxClassName}
              checked={includePassword}
              onChange={(event) => setIncludePassword(event.target.checked)}
            />
            {ui.includePassword}
          </label>
        </div>

        {includePassword ? (
          <div className="grid gap-3 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-800">{ui.passwordModeLabel}</span>
              <Select
                value={passwordMode}
                onChange={(event) => setPasswordMode(event.target.value as FakePasswordMode)}
              >
                <option value="strong">{ui.passwordModeStrong}</option>
                <option value="weak">{ui.passwordModeWeak}</option>
                <option value="numeric">{ui.passwordModeNumeric}</option>
              </Select>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-800">{ui.passwordLengthLabel}</span>
              <Input
                inputMode="numeric"
                value={passwordLengthInput}
                onChange={(event) => setPasswordLengthInput(event.target.value)}
              />
            </label>
          </div>
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

        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => generatePeople(false)}>
            {ui.generateButton}
          </Button>
          <Button variant="secondary" onClick={() => generatePeople(true)} disabled={!people.length}>
            {ui.generateMoreButton}
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setPeople([]);
              setErrorMessage('');
              setFeedbackMessage('');
              setCopiedToken('');
            }}
          >
            {ui.clearButton}
          </Button>
        </div>
      </section>

      <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-sm text-slate-600">
          {people.length ? ui.generatedCount(people.length) : ui.noResults}
        </p>

        {people.length ? (
          <div className="space-y-3">
            {people.map((person, index) => {
              const fields = getFakePersonFields(person, outputPreset, locale);

              return (
                <article
                  key={`${person.id}-${index}`}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-sm font-semibold text-slate-900">
                      {person.fullName} ({person.age})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="ghost"
                        className="h-8 px-3 text-xs"
                        onClick={() =>
                          void copyText(
                            `card-${index}`,
                            fields.map((field) => `${field.label}: ${field.value}`).join('\n'),
                          )
                        }
                      >
                        {copiedToken === `card-${index}` ? ui.copiedField : ui.copyCard}
                      </Button>
                      <Button
                        variant="ghost"
                        className="h-8 px-3 text-xs"
                        onClick={() => regenerateOne(index)}
                      >
                        {ui.regenerateCard}
                      </Button>
                    </div>
                  </div>

                  <div className="mt-2 space-y-2">
                    {fields.map((field) => (
                      <div
                        key={`${person.id}-${field.id}`}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            {field.label}
                          </p>
                          <p className="break-all text-sm text-slate-900">{field.value}</p>
                        </div>
                        <Button
                          variant="ghost"
                          className="h-8 px-3 text-xs"
                          onClick={() => void copyText(`${person.id}-${field.id}`, field.value)}
                        >
                          {copiedToken === `${person.id}-${field.id}`
                            ? ui.copiedField
                            : ui.copyField}
                        </Button>
                      </div>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        ) : null}
      </section>

      <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h4 className="text-sm font-semibold text-slate-900">{ui.outputsTitle}</h4>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() => setPreviewMode('text')}
            className={previewMode === 'text' ? 'border-brand-500 text-brand-700' : ''}
          >
            {ui.outputTabText}
          </Button>
          <Button
            variant="secondary"
            onClick={() => setPreviewMode('json')}
            className={previewMode === 'json' ? 'border-brand-500 text-brand-700' : ''}
          >
            {ui.outputTabJson}
          </Button>
          <Button
            variant="secondary"
            onClick={() => setPreviewMode('csv')}
            className={previewMode === 'csv' ? 'border-brand-500 text-brand-700' : ''}
          >
            {ui.outputTabCsv}
          </Button>
          <Button
            variant="secondary"
            onClick={() => setPreviewMode('sql')}
            className={previewMode === 'sql' ? 'border-brand-500 text-brand-700' : ''}
          >
            {ui.outputTabSql}
          </Button>
        </div>

        <Textarea readOnly rows={8} value={previewValue || ''} />

        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => void copyText('output-text', currentOutput.text)}>
            {copiedToken === 'output-text' ? ui.copiedField : ui.copyTextOutput}
          </Button>
          <Button variant="secondary" onClick={() => void copyText('output-json', currentOutput.json)}>
            {copiedToken === 'output-json' ? ui.copiedField : ui.copyJsonOutput}
          </Button>
          <Button variant="secondary" onClick={() => void copyText('output-csv', currentOutput.csv)}>
            {copiedToken === 'output-csv' ? ui.copiedField : ui.copyCsvOutput}
          </Button>
          <Button variant="secondary" onClick={() => void copyText('output-sql', currentOutput.sql)}>
            {copiedToken === 'output-sql' ? ui.copiedField : ui.copySqlOutput}
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              downloadFile('pessoas-fake.json', currentOutput.json, 'application/json;charset=utf-8;')
            }
          >
            {ui.downloadJson}
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              downloadFile('pessoas-fake.csv', currentOutput.csv, 'text/csv;charset=utf-8;')
            }
          >
            {ui.downloadCsv}
          </Button>
          <Button variant="secondary" onClick={() => void copyShareLink()}>
            {ui.copyShareLink}
          </Button>
        </div>
      </section>

      <section className="space-y-2 rounded-xl border border-slate-200 bg-white p-4">
        <h4 className="text-sm font-semibold text-slate-900">{ui.historyTitle}</h4>
        {history.length ? (
          <ul className="space-y-1 text-sm text-slate-700">
            {history.map((item, index) => (
              <li key={`${item.stamp}-${index}`}>{ui.historyItem(item.count, item.stamp)}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-600">{ui.historyEmpty}</p>
        )}
      </section>

      <p className="text-xs text-slate-600">{ui.localNote}</p>
    </Card>
  );
}
