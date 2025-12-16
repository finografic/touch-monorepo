import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

import {
  DEFAULT_LANGUAGE,
  DEFAULT_SUPPORTED_LANGUAGES,
  ENABLE_BROWSER_LANGUAGE_DETECTION,
  type SupportedLanguage,
} from 'config/app/app.config';

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    /**
     * We use a SINGLE namespace backed by the DB
     */
    ns: ['ui'],
    defaultNS: 'ui',

    /**
     * Load translations from the backend
     */
    backend: {
      loadPath: '/api/i18n/{{ns}}?lng={{lng}}',
      requestOptions: process.env.NODE_ENV === 'development' ? { cache: 'no-cache' } : undefined, // NEW: V2 -- remove condition, if there are issues.
    },

    /**
     * Languages
     */
    supportedLngs: DEFAULT_SUPPORTED_LANGUAGES,
    nonExplicitSupportedLngs: false,
    detection: {
      order: ['querystring', 'localStorage', 'sessionStorage', 'navigator'],
      // Explicit lookup keys (LanguageDetector defaults, but good to be explicit)
      lookupQuerystring: 'lng',
      lookupLocalStorage: 'i18nextLng',
      lookupSessionStorage: 'i18nextLng',
      // Cache-busting for development (don't cache language in dev)
      caches: process.env.NODE_ENV === 'development' ? [] : ['localStorage'],
      excludeCacheFor: ['cimode'],

      convertDetectedLanguage: (lng: string): SupportedLanguage => {
        const lower = lng.toLowerCase();

        if (lower.startsWith('es')) return 'es-ES';
        if (lower.startsWith('en')) return 'en-GB';
        if (lower.startsWith('ca')) return 'ca-ES';

        return 'es-ES';
      },
    },

    lng: ENABLE_BROWSER_LANGUAGE_DETECTION ? undefined : DEFAULT_LANGUAGE,
    fallbackLng: DEFAULT_LANGUAGE,

    /**
     * Debugging
     */
    debug: process.env.NODE_ENV === 'development',

    /**
     * Interpolation
     */
    interpolation: {
      escapeValue: false,
    },

    /**
     * React settings
     */
    react: {
      useSuspense: false,
    },
  })
  .then(() => {
    if (process.env.NODE_ENV === 'development') {
      console.group('[i18n] initialized');
      console.log('language:', i18n.language);
      console.log('languages:', i18n.languages);
      console.log('namespaces:', i18n.options.ns);
      console.log('ui bundle loaded:', i18n.hasResourceBundle(i18n.language, 'ui'));
      console.groupEnd();
    }
  });

export default i18n;
