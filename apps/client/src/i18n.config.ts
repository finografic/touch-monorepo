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
      es: {
        translation: translations.es,
      },
      en: {
        translation: translations.en,
      },
      ca: {
        translation: translations.ca,
      },
    },
    lng: ENABLE_BROWSER_LANGUAGE_DETECTION ? undefined : 'es', // Use simple language code for i18n
    supportedLngs: ['es', 'en', 'ca'], // i18n only understands simple language codes
    fallbackLng: 'es', // Use simple language code for fallback
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
        if (lng.startsWith('es')) return 'es';
        if (lng.startsWith('en')) return 'en';
        if (lng.startsWith('ca')) return 'ca';
        return 'es'; // Fallback to simple language code
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
