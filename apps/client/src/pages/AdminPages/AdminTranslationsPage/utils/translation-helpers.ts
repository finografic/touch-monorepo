/**
 * Utility functions for handling dynamic translation fields
 */

// Helper function to get field name for a language
export const getLanguageFieldName = (isoCode: string) => {
  // Convert locale code to snake_case column name
  // e.g., 'es-ES' -> 'name_es_es', 'en-GB' -> 'name_en_gb', 'ca-ES' -> 'name_ca_es'
  return `name_${isoCode.toLowerCase().replace('-', '_')}`;
};

// Helper function to compare translation items and detect changes
export const compareTranslationItems = (
  current: Record<string, any>,
  original: Record<string, any>,
  supportedLanguages: Array<{ isoCode: string }>,
): Record<string, any> => {
  const changes: Record<string, any> = {};

  // Check base name field
  if (current.name !== original.name) {
    changes.name = current.name;
  }

  // Check each language field
  supportedLanguages.forEach((lang) => {
    const fieldName = getLanguageFieldName(lang.isoCode);
    if (current[fieldName] !== original[fieldName]) {
      changes[fieldName] = current[fieldName];
    }
  });

  return changes;
};

// Helper function to ensure an item has all required language fields
export const ensureLanguageFields = (
  item: Record<string, any>,
  supportedLanguages: Array<{ isoCode: string }>,
): Record<string, any> => {
  const result = { ...item };

  // Ensure base name field exists
  if (!result.name) {
    result.name = '';
  }

  // Ensure all language fields exist
  supportedLanguages.forEach((lang) => {
    const fieldName = getLanguageFieldName(lang.isoCode);
    if (!result[fieldName]) {
      result[fieldName] = '';
    }
  });

  return result;
};

// Helper function to get all supported language codes from the current system
export const getLanguageCodesFromData = (data: any[]): string[] => {
  if (!data || data.length === 0) return [];

  const firstItem = data[0];
  const languageCodes: string[] = [];

  // Extract language codes from field names (e.g., name_es_es -> es-ES, name_en_gb -> en-GB)
  Object.keys(firstItem).forEach((key) => {
    if (key.startsWith('name_') && key !== 'name') {
      // Convert from name_es_es to es-ES format
      const parts = key.slice(5).split('_'); // Remove 'name_' prefix and split
      if (parts.length === 2) {
        const langCode = `${parts[0]}-${parts[1].toUpperCase()}`;
        languageCodes.push(langCode);
      }
    }
  });

  return languageCodes;
};
