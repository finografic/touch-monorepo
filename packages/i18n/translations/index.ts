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
} as const;

export { translations, resources };
