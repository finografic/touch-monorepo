import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { translations } from '@workspace/i18n';
import { ENABLE_BROWSER_LANGUAGE_DETECTION } from 'constants/app.config';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      // Full locale support with regional variations
      'es-ES': {
        translation: translations['es-ES'],
      },
      'en-GB': {
        translation: translations['en-GB'],
      },
      'ca-ES': {
        translation: translations['ca-ES'],
      },
      // Backward compatibility with simple codes (fallback to full locales)
      'es': {
        translation: translations['es-ES'],
      },
      'en': {
        translation: translations['en-GB'],
      },
      'ca': {
        translation: translations['ca-ES'],
      },
    },
    lng: ENABLE_BROWSER_LANGUAGE_DETECTION ? undefined : 'es-ES', // Default to full locale
    supportedLngs: [
      // Full locale codes (preferred)
      'es-ES',
      'en-GB',
      'ca-ES',
      // Simple codes for backward compatibility
      'es',
      'en',
      'ca',
    ],
    fallbackLng: 'es-ES', // Use full locale for fallback
    debug: process.env.NODE_ENV === 'development',
    detection: {
      order: ENABLE_BROWSER_LANGUAGE_DETECTION
        ? ['querystring', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag']
        : ['querystring', 'localStorage', 'sessionStorage'],
      lookupQuerystring: 'lng',
      lookupCookie: 'i18next',
      lookupLocalStorage: 'i18nextLng',
      lookupSessionStorage: 'i18nextLng',

      caches: ['localStorage'],
      excludeCacheFor: ['cimode'],

      convertDetectedLanguage: (lng: string) => {
        // Enhanced detection for regional variations
        if (lng.startsWith('es-ES') || lng.startsWith('es_ES')) return 'es-ES';
        if (lng.startsWith('en-GB') || lng.startsWith('en_GB')) return 'en-GB';
        if (lng.startsWith('ca-ES') || lng.startsWith('ca_ES')) return 'ca-ES';

        // Fallback to simple detection for other regions
        if (lng.startsWith('es')) return 'es-ES'; // Default Spanish to Spain
        if (lng.startsWith('en')) return 'en-GB'; // Default English to UK
        if (lng.startsWith('ca')) return 'ca-ES'; // Default Catalan to Spain

        return 'es-ES'; // Ultimate fallback
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
