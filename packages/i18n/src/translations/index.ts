// Import JSON files from root translations/ folder
import adminEsES from '../../translations/admin/es-ES.json';
import adminEnGB from '../../translations/admin/en-GB.json';
import adminCaES from '../../translations/admin/ca-ES.json';

import appEsES from '../../translations/app/es-ES.json';
import appEnGB from '../../translations/app/en-GB.json';
import appCaES from '../../translations/app/ca-ES.json';

import uiEsES from '../../translations/ui/es-ES.json';
import uiEnGB from '../../translations/ui/en-GB.json';
import uiCaES from '../../translations/ui/ca-ES.json';

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
