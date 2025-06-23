/**
 * Utility functions for handling dynamic translation fields
 */

// Helper function to get field name for a language
export const getLanguageFieldName = (isoCode: string) => {
  // Extract language part from locale code (e.g., 'es-ES' -> 'es', 'en-GB' -> 'en')
  const languageCode = isoCode.split('-')[0];

  // Map language codes to database column names
  const languageMap: Record<string, string> = {
    es: 'Es',
    en: 'En',
    ca: 'Ca',
    cat: 'Ca', // Handle both 'ca' and 'cat' for Catalan
  };

  const suffix = languageMap[languageCode] || languageCode.charAt(0).toUpperCase() + languageCode.slice(1);
  return `name${suffix}`;
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

  // Extract language codes from field names (e.g., nameEn -> en, nameEs -> es)
  Object.keys(firstItem).forEach((key) => {
    if (key.startsWith('name') && key !== 'name' && key.length > 4) {
      const langCode = key.slice(4).toLowerCase(); // Remove 'name' prefix and lowercase
      languageCodes.push(langCode);
    }
  });

  return languageCodes;
};
