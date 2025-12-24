import { languagesCodeToKey } from 'admin/utils/languages.utils';
import type { RegionLocale } from '@workspace/config/i18n.config';

/**
 * Check if a translation item is empty (all language fields are empty)
 */
export const isItemEmpty = (item: { [key: string]: any }, languageKeys: string[]): boolean => {
  return languageKeys.every((key) => !item[key]?.trim());
};

/**
 * Convert supported language codes to camelCase keys for form fields
 * Example: ['es-ES', 'en-GB'] → ['esEs', 'enGb']
 */
export const getLanguageKeys = (supportedLanguages: RegionLocale[]): string[] => {
  return supportedLanguages.map(languagesCodeToKey);
};

