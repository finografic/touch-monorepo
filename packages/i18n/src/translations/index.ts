// Import translations from organized structure using full locale codes
import commonEsES from './common/es-ES.json';
import appEsES from './app/es-ES.json';

import commonEnGB from './common/en-GB.json';
import appEnGB from './app/en-GB.json';

import commonCaES from './common/ca-ES.json';
import appCaES from './app/ca-ES.json';

// Merge function to combine translation objects
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const mergeTranslations = (...sources: any[]) => {
  return sources.reduce((acc, source) => {
    return Object.assign(acc, source);
  }, {});
};

// Organized translations with full locale support
export const translations = {
  // Full locale codes for better regional support
  'es-ES': mergeTranslations(commonEsES, appEsES),
  'en-GB': mergeTranslations(commonEnGB, appEnGB),
  'ca-ES': mergeTranslations(commonCaES, appCaES),

  // Backward compatibility with simple codes (fallback to full locales)
  'es': mergeTranslations(commonEsES, appEsES),
  'en': mergeTranslations(commonEnGB, appEnGB),
  'ca': mergeTranslations(commonCaES, appCaES),
} as const;

// i18next compatible resources format
const resources = {
  'es-ES': { translation: translations['es-ES'] },
  'en-GB': { translation: translations['en-GB'] },
  'ca-ES': { translation: translations['ca-ES'] },
  // Fallback resources for simple codes
  'es': { translation: translations['es-ES'] },
  'en': { translation: translations['en-GB'] },
  'ca': { translation: translations['ca-ES'] },
} as const;

export default resources;

// Re-export individual translations with new naming for backward compatibility
export {
  commonEnGB as commonEn,
  appEnGB as appEn,
  commonEsES as commonEs,
  appEsES as appEs,
  commonCaES as commonCa,
  appCaES as appCa,
};

// Export with new locale-based naming
export { commonEsES, appEsES, commonEnGB, appEnGB, commonCaES, appCaES };
