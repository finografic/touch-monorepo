import type { LanguageConfigMap } from '@workspace/types';

/**
 * Language configuration mapping
 * Maps region locales to their ISO codes and native language keys
 */
export const LANGUAGE_CONFIG: LanguageConfigMap = {
  'es-ES': { iso: 'es', nativeKey: 'spa' },
  'en-GB': { iso: 'gb', nativeKey: 'eng' },
  'cat-ES': { iso: 'cat', nativeKey: 'cat' },
} as const;
