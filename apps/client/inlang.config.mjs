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
    outdir: './src/i18n/messages',
    // outdir: './src/paraglide/messages',
    // ---------------------------------------------------------- //
    // Project directory for IDE integration
    // project: './project.inlang/settings.json',
    project: './project.inlang',
  },
  // JSON plugin configuration - points to existing i18next translations
  'plugin.inlang.json': {
    pathPattern: './messages/{language}.json',
  },
};
