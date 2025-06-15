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
    supportedLngs: ['en', 'es', 'cat'],
    fallbackLng: 'es',
    debug: process.env.NODE_ENV === 'development',
    detection: {
      order: ['querystring', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag'],
      lookupQuerystring: 'lng',
      lookupCookie: 'i18next',
      lookupLocalStorage: 'i18nextLng',
      lookupSessionStorage: 'i18nextLng',

      caches: ['localStorage'],
      excludeCacheFor: ['cimode'],

      convertDetectedLanguage: (lng: string) => {
        if (lng.startsWith('en')) return 'en';
        if (lng.startsWith('es')) return 'es';
        if (lng.startsWith('ca')) return 'cat';
        return lng;
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
