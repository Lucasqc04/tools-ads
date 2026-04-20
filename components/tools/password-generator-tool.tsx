'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  generatePassword,
  hasAnyPasswordOptionSelected,
  type PasswordOptions,
} from '@/lib/password-generator';
import { type AppLocale } from '@/lib/i18n/config';

type PasswordGeneratorToolProps = Readonly<{
  locale?: AppLocale;
}>;

type PasswordUi = {
  title: string;
  intro: string;
  lengthLabel: string;
  lengthHint: string;
  sliderLabel: string;
  sliderHint: string;
  usedCharsTitle: string;
  uppercase: string;
  lowercase: string;
  numbers: string;
  symbols: string;
  generatedPasswordTitle: string;
  emptyPassword: string;
  noneOptionError: string;
  copy: string;
  copied: string;
  regenerate: string;
  clear: string;
  processingNote: string;
  copyError: string;
};

const uiByLocale: Record<AppLocale, PasswordUi> = {
  'pt-br': {
    title: 'Gerador de senha forte',
    intro:
      'Crie senha segura automaticamente com controle total de tamanho e tipos de caracteres.',
    lengthLabel: 'Numero de caracteres da senha',
    lengthHint:
      'Sem limite fixo no campo. Em tamanhos muito altos, a geracao pode levar mais tempo no dispositivo.',
    sliderLabel: 'Ajuste rapido com slider (1 a 200)',
    sliderHint:
      'O slider facilita o ajuste rapido. Para valores acima de 200, use o campo numerico.',
    usedCharsTitle: 'Caracteres utilizados',
    uppercase: 'Letra maiuscula',
    lowercase: 'Letra minuscula',
    numbers: 'Numeros',
    symbols: 'Simbolos',
    generatedPasswordTitle: 'Senha gerada',
    emptyPassword: 'Selecione pelo menos um tipo de caractere para gerar a senha.',
    noneOptionError: 'Marque ao menos uma opcao de caractere.',
    copy: 'Copiar',
    copied: 'Copiado',
    regenerate: 'Regenerar',
    clear: 'Limpar',
    processingNote:
      'A senha e gerada localmente no navegador e nao e enviada para servidor por padrao.',
    copyError: 'Nao foi possivel copiar agora. Tente novamente.',
  },
  en: {
    title: 'Strong password generator',
    intro: 'Create secure passwords automatically with full length and character control.',
    lengthLabel: 'Password length',
    lengthHint:
      'No fixed limit in this field. Very large lengths may take longer depending on your device.',
    sliderLabel: 'Quick slider control (1 to 200)',
    sliderHint:
      'Use the slider for quick changes. For values above 200, use the numeric input.',
    usedCharsTitle: 'Used characters',
    uppercase: 'Uppercase letters',
    lowercase: 'Lowercase letters',
    numbers: 'Numbers',
    symbols: 'Symbols',
    generatedPasswordTitle: 'Generated password',
    emptyPassword: 'Select at least one character type to generate a password.',
    noneOptionError: 'Select at least one character option.',
    copy: 'Copy',
    copied: 'Copied',
    regenerate: 'Regenerate',
    clear: 'Clear',
    processingNote:
      'The password is generated locally in your browser and is not sent to a server by default.',
    copyError: 'Could not copy right now. Please try again.',
  },
  es: {
    title: 'Generador de contrasena segura',
    intro:
      'Crea contrasenas seguras automaticamente con control total de longitud y tipos de caracteres.',
    lengthLabel: 'Numero de caracteres de la contrasena',
    lengthHint:
      'Sin limite fijo en este campo. Longitudes muy altas pueden tardar mas segun tu dispositivo.',
    sliderLabel: 'Ajuste rapido con slider (1 a 200)',
    sliderHint:
      'El slider facilita cambios rapidos. Para valores mayores a 200, usa el campo numerico.',
    usedCharsTitle: 'Caracteres utilizados',
    uppercase: 'Letras mayusculas',
    lowercase: 'Letras minusculas',
    numbers: 'Numeros',
    symbols: 'Simbolos',
    generatedPasswordTitle: 'Contrasena generada',
    emptyPassword: 'Selecciona al menos un tipo de caracter para generar la contrasena.',
    noneOptionError: 'Marca al menos una opcion de caracteres.',
    copy: 'Copiar',
    copied: 'Copiado',
    regenerate: 'Regenerar',
    clear: 'Limpiar',
    processingNote:
      'La contrasena se genera localmente en tu navegador y no se envia al servidor por defecto.',
    copyError: 'No fue posible copiar ahora. Intentalo de nuevo.',
  },
};

const parseLength = (rawValue: string): number => {
  const parsed = Number(rawValue);

  if (!Number.isFinite(parsed)) {
    return 12;
  }

  return Math.max(1, Math.floor(parsed));
};

const checkboxClassName =
  'h-4 w-4 rounded border border-slate-300 text-brand-600 focus:ring-2 focus:ring-brand-200';

const SLIDER_MIN_LENGTH = 1;
const SLIDER_MAX_LENGTH = 200;

export function PasswordGeneratorTool({ locale = 'pt-br' }: PasswordGeneratorToolProps) {
  const ui = uiByLocale[locale];

  const [lengthInput, setLengthInput] = useState('12');
  const [options, setOptions] = useState<PasswordOptions>({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [regenerationCount, setRegenerationCount] = useState(0);

  const finalLength = useMemo(() => parseLength(lengthInput), [lengthInput]);
  const sliderLength = useMemo(
    () => Math.min(Math.max(finalLength, SLIDER_MIN_LENGTH), SLIDER_MAX_LENGTH),
    [finalLength],
  );

  useEffect(() => {
    if (!hasAnyPasswordOptionSelected(options)) {
      setGeneratedPassword('');
      setErrorMessage(ui.noneOptionError);
      setCopied(false);
      return;
    }

    const nextPassword = generatePassword(finalLength, options);
    setGeneratedPassword(nextPassword);
    setErrorMessage('');
    setCopied(false);
  }, [finalLength, options, regenerationCount, ui.noneOptionError]);

  const toggleOption = (key: keyof PasswordOptions) => {
    setOptions((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const handleCopy = async () => {
    if (!generatedPassword) {
      return;
    }

    try {
      await navigator.clipboard.writeText(generatedPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setErrorMessage(ui.copyError);
    }
  };

  return (
    <Card className="space-y-5">
      <header className="rounded-xl border border-brand-200 bg-gradient-to-r from-brand-50 to-indigo-50 p-4">
        <h3 className="text-lg font-semibold text-slate-900">{ui.title}</h3>
        <p className="mt-1 text-sm text-slate-700">{ui.intro}</p>
      </header>

      <label className="space-y-2">
        <span className="text-sm font-semibold text-slate-800">{ui.lengthLabel}</span>
        <Input
          type="number"
          inputMode="numeric"
          min={1}
          value={lengthInput}
          onChange={(event) => {
            setLengthInput(event.target.value);
            setErrorMessage('');
            setCopied(false);
          }}
        />
        <span className="text-xs text-slate-500">{ui.lengthHint}</span>
      </label>

      <label className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-slate-800">{ui.sliderLabel}</span>
          <span className="rounded-md border border-slate-200 bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
            {sliderLength}
          </span>
        </div>
        <input
          type="range"
          min={SLIDER_MIN_LENGTH}
          max={SLIDER_MAX_LENGTH}
          value={sliderLength}
          onChange={(event) => {
            setLengthInput(event.target.value);
            setErrorMessage('');
            setCopied(false);
          }}
          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-brand-600"
        />
        <span className="text-xs text-slate-500">{ui.sliderHint}</span>
      </label>

      <fieldset className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <legend className="px-1 text-sm font-semibold text-slate-800">{ui.usedCharsTitle}</legend>

        <label className="flex items-center gap-2 text-sm text-slate-800">
          <input
            type="checkbox"
            className={checkboxClassName}
            checked={options.uppercase}
            onChange={() => toggleOption('uppercase')}
          />
          {ui.uppercase}
        </label>

        <label className="flex items-center gap-2 text-sm text-slate-800">
          <input
            type="checkbox"
            className={checkboxClassName}
            checked={options.lowercase}
            onChange={() => toggleOption('lowercase')}
          />
          {ui.lowercase}
        </label>

        <label className="flex items-center gap-2 text-sm text-slate-800">
          <input
            type="checkbox"
            className={checkboxClassName}
            checked={options.numbers}
            onChange={() => toggleOption('numbers')}
          />
          {ui.numbers}
        </label>

        <label className="flex items-center gap-2 text-sm text-slate-800">
          <input
            type="checkbox"
            className={checkboxClassName}
            checked={options.symbols}
            onChange={() => toggleOption('symbols')}
          />
          {ui.symbols}
        </label>
      </fieldset>

      {errorMessage ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMessage}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => setRegenerationCount((value) => value + 1)}>
          {ui.regenerate}
        </Button>
        <Button variant="secondary" onClick={handleCopy} disabled={!generatedPassword}>
          {copied ? ui.copied : ui.copy}
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            setLengthInput('12');
            setOptions({
              uppercase: true,
              lowercase: true,
              numbers: true,
              symbols: true,
            });
            setRegenerationCount((value) => value + 1);
          }}
        >
          {ui.clear}
        </Button>
      </div>

      <section className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h4 className="text-sm font-semibold text-slate-800">{ui.generatedPasswordTitle}</h4>
        <p className="max-h-40 overflow-auto break-all rounded-lg border border-slate-200 bg-white p-3 font-mono text-sm text-slate-900">
          {generatedPassword || ui.emptyPassword}
        </p>
      </section>

      <p className="text-xs text-slate-600">{ui.processingNote}</p>
    </Card>
  );
}
