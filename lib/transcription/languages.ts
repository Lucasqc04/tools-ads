import type { AppLocale } from '@/lib/i18n/config';
import type { TranscriptionLanguageOption, WhisperLanguageCode } from './transcription-types';

export const SUPPORTED_LANGUAGE_CODES: WhisperLanguageCode[] = [
  'pt',
  'en',
  'es',
  'fr',
  'de',
  'it',
  'ja',
  'ko',
  'zh',
  'ru',
];

/** The exact lowercase English language name Whisper/Transformers.js expects for the `language` pipeline option. */
export const WHISPER_LANGUAGE_NAME: Record<WhisperLanguageCode, string> = {
  pt: 'portuguese',
  en: 'english',
  es: 'spanish',
  fr: 'french',
  de: 'german',
  it: 'italian',
  ja: 'japanese',
  ko: 'korean',
  zh: 'chinese',
  ru: 'russian',
};

export const LANGUAGE_OPTION_LABELS: Record<AppLocale, Record<TranscriptionLanguageOption, string>> = {
  'pt-br': {
    auto: 'Detectar automaticamente',
    pt: 'Portugues',
    en: 'Ingles',
    es: 'Espanhol',
    fr: 'Frances',
    de: 'Alemao',
    it: 'Italiano',
    ja: 'Japones',
    ko: 'Coreano',
    zh: 'Chines',
    ru: 'Russo',
  },
  en: {
    auto: 'Auto-detect',
    pt: 'Portuguese',
    en: 'English',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    it: 'Italian',
    ja: 'Japanese',
    ko: 'Korean',
    zh: 'Chinese',
    ru: 'Russian',
  },
  es: {
    auto: 'Detectar automaticamente',
    pt: 'Portugues',
    en: 'Ingles',
    es: 'Espanol',
    fr: 'Frances',
    de: 'Aleman',
    it: 'Italiano',
    ja: 'Japones',
    ko: 'Coreano',
    zh: 'Chino',
    ru: 'Ruso',
  },
  zh: {
    auto: 'Auto-detect',
    pt: 'Portuguese',
    en: 'English',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    it: 'Italian',
    ja: 'Japanese',
    ko: 'Korean',
    zh: 'Chinese',
    ru: 'Russian',
  },
};
