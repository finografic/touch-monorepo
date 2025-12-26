// Import JSON files from root translations/ folder
import adminEsES from './admin/es-ES.json';
import adminEnGB from './admin/en-GB.json';
import adminCaES from './admin/ca-ES.json';

import appEsES from './app/es-ES.json';
import appEnGB from './app/en-GB.json';
import appCaES from './app/ca-ES.json';

import uiEsES from './ui/es-ES.json';
import uiEnGB from './ui/en-GB.json';
import uiCaES from './ui/ca-ES.json';

// Merge function to combine translation objects
const mergeTranslations = (...sources: any[]) => {
  return sources.reduce((acc, source) => {
    return Object.assign(acc, source);
  }, {});
};

// const translations = {
//   'es-ES': mergeTranslations(uiEsES, adminEsES, appEsES),
//   'en-GB': mergeTranslations(uiEnGB, adminEnGB, appEnGB),
//   'ca-ES': mergeTranslations(uiCaES, adminCaES, appCaES),

//   'es': mergeTranslations(uiEsES, adminEsES, appEsES),
//   'en': mergeTranslations(uiEnGB, adminEnGB, appEnGB),
//   'ca': mergeTranslations(uiCaES, adminCaES, appCaES),
// } as const;

const translations = {
  'es-ES': {
    ui: uiEsES,
    app: appEsES,
    admin: adminEsES,
  },
  'en-GB': {
    ui: uiEnGB,
    app: appEnGB,
    admin: adminEnGB,
  },
  'ca-ES': {
    ui: uiCaES,
    app: appCaES,
    admin: adminCaES,
  },
} as const;

// i18next compatible resources format
const resources = {
  'es-ES': { translation: translations['es-ES'] },
  'en-GB': { translation: translations['en-GB'] },
  'ca-ES': { translation: translations['ca-ES'] },

  'es': { translation: translations['es-ES'] },
  'en': { translation: translations['en-GB'] },
  'ca': { translation: translations['ca-ES'] },
} as const;

export { translations, resources };

export default resources;
