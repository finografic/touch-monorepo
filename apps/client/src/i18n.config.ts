import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { translations } from '@workspace/i18n';
import {
  DEFAULT_LANGUAGE,
  ENABLE_BROWSER_LANGUAGE_DETECTION,
  FORCE_DEFAULT_LANGUAGE,
} from 'constants/app.config';

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
      cat: {
        translation: translations.cat,
      },
    },
    lng: ENABLE_BROWSER_LANGUAGE_DETECTION ? undefined : FORCE_DEFAULT_LANGUAGE,
    supportedLngs: ['es', 'en', 'cat'],
    fallbackLng: DEFAULT_LANGUAGE,
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
        if (lng.startsWith('ca')) return 'cat';
        return FORCE_DEFAULT_LANGUAGE;
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
