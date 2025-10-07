import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { translations } from '@workspace/i18n';
import { ENABLE_BROWSER_LANGUAGE_DETECTION } from 'config/app/app.config';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      'es-ES': { translation: translations['es-ES'] },
      'en-GB': { translation: translations['en-GB'] },
      'ca-ES': { translation: translations['ca-ES'] },
      // 'es': { translation: translations['es-ES'] },
      // 'en': { translation: translations['en-GB'] },
      // 'ca': { translation: translations['ca-ES'] },
    },
    lng: ENABLE_BROWSER_LANGUAGE_DETECTION ? undefined : 'es-ES',
    supportedLngs: [
      'es-ES',
      'en-GB',
      'ca-ES',
      // 'es',
      // 'en',
      // 'ca'
    ],
    fallbackLng: 'es-ES',
    debug: process.env.NODE_ENV === 'development',
    detection: {
      order: ENABLE_BROWSER_LANGUAGE_DETECTION
        ? ['querystring', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag']
        : ['querystring', 'localStorage', 'sessionStorage'],
      lookupQuerystring: 'lng',
      lookupCookie: 'i18next',
      lookupLocalStorage: 'i18nextLng',
      lookupSessionStorage: 'i18nextLng',

      // Cache-busting for development
      caches: process.env.NODE_ENV === 'development' ? [] : ['localStorage'],
      excludeCacheFor: ['cimode'],

      convertDetectedLanguage: (lng: string) => {
        if (lng.startsWith('es-ES') || lng.startsWith('es_ES')) return 'es-ES';
        if (lng.startsWith('en-GB') || lng.startsWith('en_GB')) return 'en-GB';
        if (lng.startsWith('ca-ES') || lng.startsWith('ca_ES')) return 'ca-ES';

        // if (lng.startsWith('es')) return 'es-ES';
        // if (lng.startsWith('en')) return 'en-GB';
        // if (lng.startsWith('ca')) return 'ca-ES';

        return 'es-ES';
      },
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
