import { missingTranslation } from '@inlang/lint-rule-missing-translation';

/**
 * Inlang (Paraglide) configuration
 * Works with TypeScript message sources instead of JSON.
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
  // Plugin configuration
  'plugin.paraglide-js': {
    // Where the generated functions go (imported by Vite / app)
    outdir: '../../../config/generated/i18n/app/messages',

    // Project directory for IDE integration
    project: './project.inlang',
  },
};
