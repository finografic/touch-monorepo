/**
 * Utility functions for handling dynamic translation fields using JSON translations
 */

// Helper function to get field name for a language (kept for legacy compatibility)
export const getLanguageFieldName = (isoCode: string) => {
  // Convert locale code to snake_case column name
  // e.g., 'es-ES' -> 'name_es_es', 'en-GB' -> 'name_en_gb', 'ca-ES' -> 'name_ca_es'
  return `name_${isoCode.toLowerCase().replace('-', '_')}`;
};

// Helper function to compare translation items and detect changes (now works with JSON)
// Only includes fields that have actually changed - supports partial saves
export const compareTranslationItems = (
  current: Record<string, any>,
  original: Record<string, any>,
  supportedLanguages: Array<{ isoCode: string }>,
): Record<string, any> => {
  const changes: Record<string, any> = {};

  // Check base name field - only include if changed (empty strings are allowed)
  if (current.name !== original.name) {
    changes.name = current.name;
  }

  // Check translations object - compare each language
  // Only include languages that have changed (supports partial updates)
  const currentTranslations = current.translations || {};
  const originalTranslations = original.translations || {};

  const changedTranslations: Record<string, string> = {};

  supportedLanguages.forEach((lang) => {
    const currentValue = currentTranslations[lang.isoCode] ?? '';
    const originalValue = originalTranslations[lang.isoCode] ?? '';

    // Include if changed (empty strings are valid values)
    if (currentValue !== originalValue) {
      changedTranslations[lang.isoCode] = currentValue;
    }
  });

  // Only include translations object if any language changed
  if (Object.keys(changedTranslations).length > 0) {
    changes.translations = changedTranslations;
  }

  return changes;
};

// Helper function to ensure an item has all required language fields (now works with JSON)
export const ensureLanguageFields = (
  item: Record<string, any>,
  supportedLanguages: Array<{ isoCode: string }>,
): Record<string, any> => {
  const result = { ...item };

  // Ensure base name field exists
  if (!result.name) {
    result.name = '';
  }

  // Ensure translations object exists and has all language fields
  if (!result.translations) {
    result.translations = {};
  }

  const translations = { ...result.translations };
  supportedLanguages.forEach((lang) => {
    if (!translations[lang.isoCode]) {
      translations[lang.isoCode] = '';
    }
  });

  result.translations = translations;
  return result;
};

// Helper function to get all supported language codes from translations JSON
export const getLanguageCodesFromData = (data: any[]): string[] => {
  if (!data || data.length === 0) return [];

  // Look for translations in the first item
  const firstItem = data[0];
  if (!firstItem.translations || typeof firstItem.translations !== 'object') {
    return [];
  }

  // Extract language codes from translations object keys
  return Object.keys(firstItem.translations);
};

// Helper function to convert JSON translations to legacy field format for form compatibility
export const convertTranslationsToLegacyFields = (
  item: any,
  supportedLanguages: Array<{ isoCode: string }>,
): Record<string, any> => {
  const result = { ...item };
  const translations = item.translations || {};

  // Add legacy field names for each language
  supportedLanguages.forEach((lang) => {
    const fieldName = getLanguageFieldName(lang.isoCode);
    result[fieldName] = translations[lang.isoCode] || '';
  });

  return result;
};

// Helper function to convert legacy fields back to JSON translations format
// Only includes fields that are defined - supports partial data
export const convertLegacyFieldsToTranslations = (
  item: any,
  supportedLanguages: Array<{ isoCode: string }>,
): Record<string, any> => {
  const result = { ...item };
  const translations: Record<string, string> = {};

  // Extract translations from legacy field names
  // Only include fields that are defined (undefined fields are excluded for partial saves)
  supportedLanguages.forEach((lang) => {
    const fieldName = getLanguageFieldName(lang.isoCode);
    if (item[fieldName] !== undefined && item[fieldName] !== null) {
      // Include empty strings as they are valid values
      translations[lang.isoCode] = item[fieldName] || '';
    }
  });

  // Only include translations object if it has any values
  if (Object.keys(translations).length > 0) {
    result.translations = translations;
  }

  return result;
};
