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
      // In production, use absolute URL if API_URL is available
      // In development, use relative path (Vite proxy handles /api -> backend)
      loadPath:
        process.env.NODE_ENV === 'production' && typeof process.env.API_URL === 'string'
          ? `${process.env.API_URL}/i18n/translations?lng={{lng}}`
          : '/api/i18n/translations?lng={{lng}}',
      requestOptions:
        process.env.NODE_ENV === 'development'
          ? { cache: 'no-cache' }
          : {
              // In production, ensure we don't cache stale translations
              cache: 'no-cache',
            },
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
    const isDev = process.env.NODE_ENV === 'development';
    if (isDev) {
      console.group('[i18n] initialized');
      console.log('language:', i18n.language);
      console.log('languages:', i18n.languages);
      console.log('namespaces:', i18n.options.ns);
      console.log('translations bundle loaded:', i18n.hasResourceBundle(i18n.language, 'translations'));
      console.log('loadPath:', (i18n.options.backend as any)?.loadPath);
      console.groupEnd();
    } else {
      // Production logging for debugging
      const hasTranslations = i18n.hasResourceBundle(i18n.language, 'translations');
      if (!hasTranslations) {
        console.warn('[i18n] ⚠️ Translations not loaded in production!');
        console.warn('[i18n] loadPath:', (i18n.options.backend as any)?.loadPath);
        console.warn('[i18n] API_URL:', process.env.API_URL);
        console.warn('[i18n] language:', i18n.language);
      }
    }
  })
  .catch((error) => {
    console.error('[i18n] ❌ Initialization failed:', error);
  });

export default i18n;
