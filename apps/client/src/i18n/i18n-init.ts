import { initReactI18next } from 'react-i18next';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import translations_en from 'i18n/translations/en.json';
import translations_es from 'i18n/translations/es.json';

const translations = {
  en: { translation: translations_en },
  es: { translation: translations_es },
};

const i18nConfig = {
  resources: translations,
  fallbackLng: 'en',
  supportedLngs: ['en', 'es'],
  defaultNS: 'translation',
  debug: process.env.NODE_ENV === 'development',

  detection: {
    order: ['localStorage', 'navigator', 'htmlTag'],
    lookupLocalStorage: 'i18nextLng',
    caches: ['localStorage'],
  },

  interpolation: {
    escapeValue: false,
  },

  react: {
    useSuspense: true,
  },
};

const languageDetector = new LanguageDetector();
i18next.use(languageDetector).use(initReactI18next).init(i18nConfig);

export default i18next;
