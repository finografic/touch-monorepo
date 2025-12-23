/**
 * Flatten nested translation objects to dot notation format for database seeding
 *
 * @example
 * Input:
 * {
 *   'es-ES': { ui: { buttons: { back: 'Atrás' } } },
 *   'en-GB': { ui: { buttons: { back: 'Back' } } },
 *   'ca-ES': { ui: { buttons: { back: 'Enrere' } } }
 * }
 *
 * Output (for domain 'ui'):
 * [
 *   {
 *     key: 'ui.buttons.back',
 *     translations: {
 *       'es-ES': 'Atrás',
 *       'en-GB': 'Back',
 *       'ca-ES': 'Enrere'
 *     }
 *   }
 * ]
 */

import type { I18nTranslationsDomain } from '@workspace/i18n/types';

type TranslationsByLocale = {
  'es-ES': { ui: Record<string, any>; app: Record<string, any>; admin: Record<string, any> };
  'en-GB': { ui: Record<string, any>; app: Record<string, any>; admin: Record<string, any> };
  'ca-ES': { ui: Record<string, any>; app: Record<string, any>; admin: Record<string, any> };
};

type FlattenedTranslation = {
  key: string;
  translations: Record<string, string>;
};

/**
 * Recursively flatten a nested object to dot notation
 * @param obj - The nested object to flatten
 * @param prefix - The prefix for the key (e.g., 'ui', 'ui.buttons')
 * @returns A flat object with dot notation keys
 */
function flattenObject(obj: Record<string, any>, prefix = ''): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      // Recursively flatten nested objects
      Object.assign(result, flattenObject(value, newKey));
    } else {
      // Leaf node - store the value
      result[newKey] = typeof value === 'string' ? value : String(value);
    }
  }

  return result;
}

/**
 * Flatten translations for a specific domain across all locales
 * @param domain - The domain to flatten ('ui', 'app', or 'admin')
 * @param translations - The translations object organized by locale and domain
 * @returns Array of flattened translation entries ready for database seeding
 */
export function flattenTranslations(
  domain: I18nTranslationsDomain,
  translations: TranslationsByLocale,
): FlattenedTranslation[] {
  // Get all locale codes
  const locales = Object.keys(translations) as Array<keyof TranslationsByLocale>;

  // Flatten the domain data for each locale
  const flattenedByLocale: Record<string, Record<string, string>> = {};

  for (const locale of locales) {
    const domainData = translations[locale][domain];
    if (domainData) {
      // The JSON files have the domain as root key (e.g., { "ui": { buttons: {...} } })
      // Extract the domain data and flatten it with the domain prefix
      const dataToFlatten = domainData[domain] || domainData;
      flattenedByLocale[locale] = flattenObject(dataToFlatten, domain);
    }
  }

  // Collect all unique keys across all locales
  const i18nTranslationKeys = new Set<string>();
  for (const localeData of Object.values(flattenedByLocale)) {
    for (const key of Object.keys(localeData)) {
      i18nTranslationKeys.add(key);
    }
  }

  // Build the result array with translations from all locales
  const result: FlattenedTranslation[] = [];

  for (const key of Array.from(i18nTranslationKeys).sort()) {
    const translations: Record<string, string> = {};

    for (const locale of locales) {
      const value = flattenedByLocale[locale]?.[key];
      translations[locale] = value || '';
    }

    result.push({ key, translations });
  }

  return result;
}
