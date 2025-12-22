/**
 * Server-side utility for flattening translations for database seeding
 *
 * This utility imports translations from @workspace/i18n and flattens them
 * into the format required by seed files.
 *
 * @example
 * import { translations } from '@workspace/i18n/translations';
 * import { flattenTranslationsForSeed } from './utils/flatten-translations';
 *
 * const translationsData = flattenTranslationsForSeed('ui', translations);
 */

import { translations } from '@workspace/i18n/translations';

type Domain = 'ui' | 'app' | 'admin';

interface FlattenedTranslation {
  key: string;
  translations: Record<string, string>;
}

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
 * @returns Array of flattened translation entries ready for database seeding
 */
export function flattenTranslationsForSeed(domain: Domain): FlattenedTranslation[] {
  // Get all locale codes
  const locales = Object.keys(translations) as Array<keyof typeof translations>;

  // Flatten the domain data for each locale
  const flattenedByLocale: Record<string, Record<string, string>> = {};

  for (const locale of locales) {
    const localeData = translations[locale];
    const domainData = localeData[domain] as Record<string, any> | undefined;
    if (domainData) {
      // The JSON files have the domain as root key (e.g., { "ui": { buttons: {...} } })
      // Extract the domain data and flatten it with the domain prefix
      const dataToFlatten = (domainData[domain] as Record<string, any>) || domainData;
      flattenedByLocale[locale] = flattenObject(dataToFlatten, domain);
    }
  }

  // Collect all unique keys across all locales
  const allKeys = new Set<string>();
  for (const localeData of Object.values(flattenedByLocale)) {
    for (const key of Object.keys(localeData)) {
      allKeys.add(key);
    }
  }

  // Build the result array with translations from all locales
  const result: FlattenedTranslation[] = [];

  for (const key of Array.from(allKeys).sort()) {
    const translationsForKey: Record<string, string> = {};

    for (const locale of locales) {
      const value = flattenedByLocale[locale]?.[key];
      translationsForKey[locale] = value || '';
    }

    result.push({
      key,
      translations: translationsForKey,
    });
  }

  return result;
}
