// Import translations from organized structure
import commonEn from './common/en.json';
import appEn from './app/en.json';
import dynamicEn from './dynamic/en.json';

// Legacy files - will be gradually moved to organized structure
import legacyEn from './en.json';
import legacyEs from './es.json';

// Merge function to combine translation objects
const mergeTranslations = (...sources: any[]) => {
  return sources.reduce((acc, source) => {
    return Object.assign(acc, source);
  }, {});
};

// Organized translations (new structure)
export const translations = {
  en: mergeTranslations(commonEn, appEn, dynamicEn),
  // TODO: Create common/app/dynamic for es and cat
  es: legacyEs, // Temporary - will be split
  cat: legacyEs, // Temporary - will be replaced with Catalan
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
export { legacyEn as enTranslations, legacyEs as esTranslations };
