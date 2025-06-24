/**
 * @workspace/i18n
 *
 * Internationalization package providing:
 * - ISO codes and language mappings
 * - Application locale configurations
 * - Translation resources
 * - i18n utilities and validation functions
 */

// ISO codes and mappings
export * from './iso-codes';

// Application locale configurations and constants
export * from './constants';

// Translation resources
export * from './translations';

// i18n utilities and types
export * from './utils';

// Export types for translation keys
export type {
  ButtonTranslationKey,
  UITranslationKey,
  AppTranslationKey,
  TranslationKey,
} from './types/translation-keys';
