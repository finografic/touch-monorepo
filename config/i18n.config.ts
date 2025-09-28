import type { I18nConfig } from '../packages/i18n/dist/config/index';

/**
 * Touch Monorepo I18n Configuration
 */
export const config: I18nConfig = {
  languages: [
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
  ],
  typeGeneration: {
    outputPath: './config/generated/i18n',
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
    additionalCodes: [], // Add any custom codes here if needed
  },
};
