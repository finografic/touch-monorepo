// Import translations from organized structure using full locale codes
import commonEsES from './common/es-ES.json';
import appEsES from './app/es-ES.json';
import dynamicEsES from './dynamic/es-ES.json';

import commonEnGB from './common/en-GB.json';
import appEnGB from './app/en-GB.json';
import dynamicEnGB from './dynamic/en-GB.json';

import commonCaES from './common/ca-ES.json';
import appCaES from './app/ca-ES.json';
import dynamicCaES from './dynamic/ca-ES.json';

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
  'es-ES': mergeTranslations(commonEsES, appEsES, dynamicEsES),
  'en-GB': mergeTranslations(commonEnGB, appEnGB, dynamicEnGB),
  'ca-ES': mergeTranslations(commonCaES, appCaES, dynamicCaES),

  // Backward compatibility with simple codes (fallback to full locales)
  'es': mergeTranslations(commonEsES, appEsES, dynamicEsES),
  'en': mergeTranslations(commonEnGB, appEnGB, dynamicEnGB),
  'ca': mergeTranslations(commonCaES, appCaES, dynamicCaES),
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
  dynamicEnGB as dynamicEn,
  commonEsES as commonEs,
  appEsES as appEs,
  dynamicEsES as dynamicEs,
  commonCaES as commonCa,
  appCaES as appCa,
  dynamicCaES as dynamicCa,
};

// Export with new locale-based naming
export {
  commonEsES,
  appEsES,
  dynamicEsES,
  commonEnGB,
  appEnGB,
  dynamicEnGB,
  commonCaES,
  appCaES,
  dynamicCaES,
};
