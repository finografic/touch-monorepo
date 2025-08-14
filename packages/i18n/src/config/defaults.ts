import type { I18nConfig, LanguageConfig } from './types';

/**
 * Default i18n configuration
 * Projects can extend or override these defaults
 */
const DEFAULT_LANGUAGES: LanguageConfig[] = [
  {
    iso3: 'eng',
    iso2: 'en',
    name: 'English',
    nativeName: 'English',
    sortOrder: 1,
    isDefault: true,
  },
  {
    iso3: 'spa',
    iso2: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    sortOrder: 2,
  },
  {
    iso3: 'cat',
    iso2: 'ca',
    name: 'Catalan',
    nativeName: 'Català',
    sortOrder: 3,
  },
];

/**
 * Default i18n configuration
 * Provides sensible defaults that can be extended or overridden
 */
export const DEFAULT_CONFIG: I18nConfig = {
  languages: DEFAULT_LANGUAGES,
  typeGeneration: {
    outputPath: './config/generated/i18n/language.types.ts',
    languageMapping: {
      eng: 'en',
      spa: 'es',
      cat: 'ca',
    },
    supportedCountries: ['ES', 'GB', 'US'],
    defaultCountries: {
      en: 'GB',
      es: 'ES',
      ca: 'ES',
    },
  },
  validation: {
    strict: true,
  },
};
