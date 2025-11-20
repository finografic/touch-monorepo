import translations_en from 'i18n/translations/en.json';
import translations_es from 'i18n/translations/es.json';
import i18next from 'i18next';

const translations = {
  en: { translation: translations_en },
  es: { translation: translations_es },
};

// init i18next: for all options read: https://www.i18next.com/overview/configuration-options
// detect user language - learn more: https://github.com/i18next/i18next-browser-languageDetector

const i18n = i18next.init({
  debug: true,
  supportedLngs: ['es', 'en'],
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  resources: translations,
});

export default i18n;
