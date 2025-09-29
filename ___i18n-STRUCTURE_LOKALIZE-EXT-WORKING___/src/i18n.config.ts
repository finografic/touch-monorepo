import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import translations_en from "i18n/translations/en.json";
import translations_es from "i18n/translations/es.json";

const translations = {
  "es-ES": translations_es,
  "en-GB": translations_en,
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      "es-ES": { translation: translations["es-ES"] },
      "en-GB": { translation: translations["en-GB"] },
      es: { translation: translations["es-ES"] },
      en: { translation: translations["en-GB"] },
    },
    lng: "en-GB",
    supportedLngs: ["en-GB", "en"],
    fallbackLng: "es-ES",
    debug: process.env.NODE_ENV === "development",
    detection: {
      order: ["querystring", "localStorage", "sessionStorage"],
      lookupQuerystring: "lng",
      lookupCookie: "i18next",
      lookupLocalStorage: "i18nextLng",
      lookupSessionStorage: "i18nextLng",

      caches: ["localStorage"],
      excludeCacheFor: ["cimode"],

      convertDetectedLanguage: (lng: string) => {
        if (lng.startsWith("es-ES") || lng.startsWith("es_ES")) return "es-ES";
        if (lng.startsWith("en-GB") || lng.startsWith("en_GB")) return "en-GB";

        if (lng.startsWith("es")) return "es-ES";
        if (lng.startsWith("en")) return "en-GB";

        return "en-GB";
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
