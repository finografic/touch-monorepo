/**
 * Helper functions for working with JSON translations
 */

export interface TranslatedRecord {
  id: string;
  name: string;
  translations: Record<string, string>;
  [key: string]: any;
}

/**
 * Get the best translation for a record based on language preference
 * Falls back to name field if no translation is found
 */
export function getBestTranslation(
  record: TranslatedRecord,
  preferredLanguage: string,
  fallbackLanguages: string[] = ['en-GB', 'es-ES'],
): string {
  // First try the preferred language
  if (record.translations[preferredLanguage]) {
    return record.translations[preferredLanguage];
  }

  // Try fallback languages in order
  for (const fallback of fallbackLanguages) {
    if (record.translations[fallback]) {
      return record.translations[fallback];
    }
  }

  // Final fallback to the name field
  return record.name;
}

/**
 * Add a translation to a record's translations object
 */
export function addTranslation(
  currentTranslations: Record<string, string>,
  languageCode: string,
  translation: string,
): Record<string, string> {
  return {
    ...currentTranslations,
    [languageCode]: translation,
  };
}

/**
 * Remove a translation from a record's translations object
 */
export function removeTranslation(
  currentTranslations: Record<string, string>,
  languageCode: string,
): Record<string, string> {
  const { [languageCode]: removed, ...remaining } = currentTranslations;
  return remaining;
}

/**
 * Get all available languages for a record
 */
export function getAvailableLanguages(record: TranslatedRecord): string[] {
  return Object.keys(record.translations);
}

/**
 * Format a record for API response with a specific language
 * This adds a 'displayName' field with the best translation
 */
export function formatRecordWithTranslation<T extends TranslatedRecord>(
  record: T,
  preferredLanguage: string,
  fallbackLanguages?: string[],
): T & { displayName: string } {
  return {
    ...record,
    displayName: getBestTranslation(record, preferredLanguage, fallbackLanguages),
  };
}

/**
 * Format multiple records for API response with translations
 */
export function formatRecordsWithTranslations<T extends TranslatedRecord>(
  records: T[],
  preferredLanguage: string,
  fallbackLanguages?: string[],
): (T & { displayName: string })[] {
  return records.map((record) => formatRecordWithTranslation(record, preferredLanguage, fallbackLanguages));
}
