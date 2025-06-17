// Import translations from organized structure
import commonEs from './common/es.json';
import appEs from './app/es.json';
import dynamicEs from './dynamic/es.json';

import commonEn from './common/en.json';
import appEn from './app/en.json';
import dynamicEn from './dynamic/en.json';

import commonCat from './common/cat.json';
import appCat from './app/cat.json';
import dynamicCat from './dynamic/cat.json';

// Merge function to combine translation objects
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const mergeTranslations = (...sources: any[]) => {
  return sources.reduce((acc, source) => {
    return Object.assign(acc, source);
  }, {});
};

// Organized translations (new structure)
export const translations = {
  es: mergeTranslations(commonEs, appEs, dynamicEs),
  en: mergeTranslations(commonEn, appEn, dynamicEn),
  cat: mergeTranslations(commonCat, appCat, dynamicCat),
} as const;

// Legacy exports for backward compatibility
export const resources = {
  es: { translation: translations.es },
  en: { translation: translations.en },
  cat: { translation: translations.cat },
} as const;

export default resources;

export type SupportedLanguage = keyof typeof translations;

// Re-export individual translations for backward compatibility
export { commonEn, appEn, dynamicEn, commonEs, appEs, dynamicEs, commonCat, appCat, dynamicCat };
