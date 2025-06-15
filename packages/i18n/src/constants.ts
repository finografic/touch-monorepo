import type { LangCode, RegionLocale, LanguageConfigMap } from '@workspace/types';

// Supported language codes (ISO 639-1)
export const SUPPORTED_LANG_CODES: readonly LangCode[] = ['en', 'es', 'cat'] as const;

// Supported region locales
export const SUPPORTED_LOCALES: readonly RegionLocale[] = ['en-GB', 'es-ES', 'cat-ES'] as const;

// Default settings
export const DEFAULT_LANG_CODE: LangCode = 'es';
export const DEFAULT_LOCALE: RegionLocale = 'es-ES';

// Validation functions
export function isValidLangCode(code: string): code is LangCode {
  return SUPPORTED_LANG_CODES.includes(code as LangCode);
}

export function isValidLocale(locale: string): locale is RegionLocale {
  return SUPPORTED_LOCALES.includes(locale as RegionLocale);
}

// Format configurations using our language types
export const dateFormats = {
  short: {
    en: {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    },
    es: {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    },
    cat: {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    },
  },
  long: {
    en: {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    },
    es: {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    },
    cat: {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    },
  },
} as const;

export const numberFormats = {
  currency: {
    en: {
      style: 'currency',
      currency: 'GBP', // UK pounds for en-GB
    },
    es: {
      style: 'currency',
      currency: 'EUR', // Euros for es-ES
    },
    cat: {
      style: 'currency',
      currency: 'EUR', // Euros for cat-ES
    },
  },
  decimal: {
    en: {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
    es: {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
    cat: {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  },
} as const;

// Language configuration mapping - available for reuse across apps
export const LANGUAGE_CONFIG: LanguageConfigMap = {
  'es-ES': { iso: 'es', nativeKey: 'spa' },
  'en-GB': { iso: 'gb', nativeKey: 'eng' },
  'cat-ES': { iso: 'cat', nativeKey: 'cat' },
} as const;
