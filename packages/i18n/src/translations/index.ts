import enTranslations from './en.json';
import esTranslations from './es.json';

export const translations = {
  en: enTranslations,
  es: esTranslations,
} as const;

export type SupportedLanguage = keyof typeof translations;

// Helper functions
export const getTranslation = (lang: SupportedLanguage) => translations[lang];
export const getSupportedLanguages = (): SupportedLanguage[] =>
  Object.keys(translations) as SupportedLanguage[];

// Re-export individual translations
export { enTranslations, esTranslations };
