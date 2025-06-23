// Import translations from organized structure
import commonEs from './common/es.json';
import appEs from './app/es.json';
import dynamicEs from './dynamic/es.json';

import commonEn from './common/en.json';
import appEn from './app/en.json';
import dynamicEn from './dynamic/en.json';

import commonCa from './common/ca.json';
import appCa from './app/ca.json';
import dynamicCa from './dynamic/ca.json';

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
  ca: mergeTranslations(commonCa, appCa, dynamicCa),
} as const;

// Legacy exports for backward compatibility
export const resources = {
  es: { translation: translations.es },
  en: { translation: translations.en },
  ca: { translation: translations.ca },
} as const;

export default resources;

export type SupportedLanguage = keyof typeof translations;

// Re-export individual translations for backward compatibility
export { commonEn, appEn, dynamicEn, commonEs, appEs, dynamicEs, commonCa, appCa, dynamicCa };
