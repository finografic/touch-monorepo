import { initReactI18next } from "react-i18next";
import { default as i18next } from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import translations_en from "i18n/translations/en.json";
import translations_es from "i18n/translations/es.json";

const translations = {
  en: { translation: translations_en },
  es: { translation: translations_es },
};

// init i18next: for all options read: https://www.i18next.com/overview/configuration-options
// detect user language - learn more: https://github.com/i18next/i18next-browser-languageDetector

const i18n = i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    supportedLngs: ["en", "es"],
    lng: navigator.language, // lng: 'es',
    fallbackLng: "en",
    detection: {
      order: [
        "querystring",
        "localStorage",
        "sessionStorage",
        "navigator",
        "htmlTag",
      ],
      lookupQuerystring: "lng",
      lookupCookie: "i18next",
      lookupLocalStorage: "i18nextLng",
      lookupSessionStorage: "i18nextLng",
      caches: ["localStorage"],
      excludeCacheFor: ["cimode"],
    },
    interpolation: {
      escapeValue: false,
    },
    resources: translations,
  });

export default i18n;
