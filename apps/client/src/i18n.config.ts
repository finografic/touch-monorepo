import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

import {
  DEFAULT_LANGUAGE,
  DEFAULT_SUPPORTED_LANGUAGES,
  ENABLE_BROWSER_LANGUAGE_DETECTION,
  I18N_NAMESPACE,
} from 'config/app/i18n.config';
import type { SupportedLanguage } from '@workspace/i18n/types';

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // namespace config
    ns: [I18N_NAMESPACE],
    defaultNS: I18N_NAMESPACE,

    // http config
    backend: {
      loadPath: '/api/i18n/translations?lng={{lng}}',
      requestOptions: process.env.NODE_ENV === 'development' ? { cache: 'no-cache' } : undefined, // NEW: V2 -- remove condition, if there are issues.
    },

    /**
     * Languages
     */
    supportedLngs: DEFAULT_SUPPORTED_LANGUAGES,
    nonExplicitSupportedLngs: false,
    detection: {
      order: ['querystring', 'localStorage', 'sessionStorage', 'navigator'],
      lookupQuerystring: 'lng',
      lookupLocalStorage: 'i18nextLng',
      lookupSessionStorage: 'i18nextLng',
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
      console.log('translations bundle loaded:', i18n.hasResourceBundle(i18n.language, 'translations'));
      console.groupEnd();
    }
  });

export default i18n;
