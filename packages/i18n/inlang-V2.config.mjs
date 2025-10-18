import { missingTranslation } from '@inlang/lint-rule-missing-translation';

/**
 * Inlang (ParaglideJS) configuration for gradual migration from i18next
 *
 * Strategy:
 * - Existing i18next JSON files: src/translations/app/*.json
 * - New TypeScript messages: src/messages/app/*.ts (your custom implementation)
 * - Generated ParaglideJS functions: ../../config/generated/i18n/messages
 */
export default {
  'referenceLanguage': 'en-GB',
  'languages': ['en-GB', 'es-ES'],

  // Optional lint rules (great for CI)
  'lint': [missingTranslation()],

  'modules': [
    // JSON plugin reads from existing i18next translations (locally installed)
    '@inlang/plugin-json',
    // M function matcher for message extraction (locally installed)
    '@inlang/plugin-m-function-matcher',
  ],

  // JSON plugin configuration - points to existing i18next translations
  'plugin.inlang.json': {
    pathPattern: './src/translations/app/{language}.json',
  },
};
