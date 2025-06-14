// Import translations from organized structure
import commonEn from './common/en.json';
import appEn from './app/en.json';
import dynamicEn from './dynamic/en.json';

import commonEs from './common/es.json';
import appEs from './app/es.json';
import dynamicEs from './dynamic/es.json';

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
  en: mergeTranslations(commonEn, appEn, dynamicEn),
  es: mergeTranslations(commonEs, appEs, dynamicEs),
  cat: mergeTranslations(commonCat, appCat, dynamicCat),
} as const;

// Legacy exports for backward compatibility
export const resources = {
  en: { translation: translations.en },
  es: { translation: translations.es },
  cat: { translation: translations.cat },
} as const;

export default resources;

export type SupportedLanguage = keyof typeof translations;

// Re-export individual translations for backward compatibility
export { commonEn, appEn, dynamicEn, commonEs, appEs, dynamicEs, commonCat, appCat, dynamicCat };
