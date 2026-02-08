import type { RegionLocale } from '@workspace/i18n';

export const I18N_NAMESPACE = 'translations' as const;
export const I18N_TRANSLATION_DOMAINS = ['ui', 'app', 'admin'] as const;

export const ENABLE_BROWSER_LANGUAGE_DETECTION = false as const;
export const FORCE_DEFAULT_LANGUAGE: RegionLocale = 'es-ES' as const; // Updated to locale format

export const DEFAULT_LANGUAGE: RegionLocale = 'es-ES' as const; // Updated to locale format
export const DEFAULT_SUPPORTED_LANGUAGES: RegionLocale[] = ['es-ES', 'en-GB', 'ca-ES'] as const;

export const SUPPORTED_LANGUAGES_STORAGE_KEY = 'supported-languages';
export const CURRENT_LANGUAGE_STORAGE_KEY = 'current-language';

export const LOCALE_MAPPING: Record<string, RegionLocale> = {
  es: 'es-ES',
  en: 'en-GB',
  ca: 'ca-ES',
} as const;
