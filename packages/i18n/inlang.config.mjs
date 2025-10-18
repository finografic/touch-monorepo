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
    // Paraglide core TS plugin (instead of JSON plugin)
    'https://cdn.jsdelivr.net/npm/@inlang/plugin-paraglide-js@2/dist/index.js',
  ],

  // Plugin configuration
  'plugin.paraglide-js': {
    // Where your TS source messages live
    sourceDirs: ['./src/messages/app'],

    // Where the generated functions go (imported by Vite / app)
    outdir: '../../config/generated/i18n/messages',

    // Optionally specify a project file for IDE integration (optional)
    project: './project.inlang',
  },
};
