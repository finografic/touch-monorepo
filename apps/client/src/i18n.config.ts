import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { translations } from '@workspace/i18n';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: translations.en,
      },
      es: {
        translation: translations.es,
      },
      cat: {
        translation: translations.es,
      },
    },
    supportedLngs: ['en', 'es', 'cat'], // ← Added from package config
    lng: navigator.language, // ← Added from package config
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    detection: {
      order: ['querystring', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag'], // ← Enhanced
      lookupQuerystring: 'lng',
      lookupCookie: 'i18next', // ← Added from package config
      lookupLocalStorage: 'i18nextLng',
      lookupSessionStorage: 'i18nextLng', // ← Added from package config

      caches: ['localStorage'],
      excludeCacheFor: ['cimode'], // ← Added from package config
    },
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    react: {
      useSuspense: false, // Set to true if you want to use Suspense
    },
  });

export default i18n;
