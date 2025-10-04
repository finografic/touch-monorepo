import type { RegionLocale } from '@workspace/i18n';
import type { LangCode } from '@config/i18n';

interface LocalizedEntity {
  name?: string;
  // Legacy column names (for backward compatibility)
  nameEn?: string;
  nameEs?: string;
  nameCa?: string;
  name_en_gb?: string;
  name_es_es?: string;
  name_ca_es?: string;
  // New JSON translations column
  translations?: Record<string, string>;
}

/**
 * Helper to extract simple language code from full locale
 */
const getSimpleCode = (language: string): LangCode => {
  if (language.includes('-')) {
    const simple = language.split('-')[0];
    return simple as LangCode;
  }
  // Handle direct simple codes
  return language as LangCode;
};

/**
 * Gets the localized name for an entity based on the current language
 * Supports both simple codes ('es', 'en', 'cat') and full locales ('es-ES', 'en-GB', 'ca-ES')
 * Now prioritizes the new JSON translations column
 */
export const getLocalizedName = (
  entity: LocalizedEntity,
  currentLanguage: LangCode | RegionLocale,
): string => {
  if (!entity) return '';

  // 🆕 First try the new JSON translations column
  if (entity.translations && typeof entity.translations === 'object') {
    // Try exact locale match first (e.g., 'es-ES')
    if (entity.translations[currentLanguage]) {
      return entity.translations[currentLanguage];
    }

    // Handle simple codes (e.g., 'es' -> find 'es-ES', 'en' -> find 'en-GB')
    const simpleCode = currentLanguage.includes('-') ? currentLanguage.split('-')[0] : currentLanguage; // Handle both 'es-ES' and 'es'

    const matchingKey = Object.keys(entity.translations).find((key) =>
      key.toLowerCase().startsWith(`${simpleCode.toLowerCase()}-`),
    );

    if (matchingKey && entity.translations[matchingKey]) {
      return entity.translations[matchingKey];
    }
  }

  // 🔄 Fallback to legacy column names (for backward compatibility)
  if (currentLanguage.includes('-')) {
    const localeKey = `name_${currentLanguage.toLowerCase().replace('-', '_')}` as keyof LocalizedEntity;
    if (entity[localeKey]) return entity[localeKey] as string;
  }

  const simpleCode = getSimpleCode(currentLanguage);
  switch (simpleCode) {
    case 'en':
      return entity.name || entity.name_en_gb || entity.name || '';
    case 'es':
      return entity.nameEs || entity.name_es_es || entity.name || '';
    case 'ca':
      return entity.nameCa || entity.name_ca_es || entity.name || '';
    default:
      return entity.name || '';
  }
};

/**
 * Gets the appropriate label key for the current language
 * Updated to handle both simple and full locale formats
 */
export const getLabelKey = (currentLanguage: LangCode | RegionLocale): keyof LocalizedEntity => {
  const simpleCode = getSimpleCode(currentLanguage);

  switch (simpleCode) {
    case 'en':
      return 'name';
    case 'es':
      return 'nameEs';
    case 'ca':
      return 'nameCa';
    default:
      return 'name';
  }
};
