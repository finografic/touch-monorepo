import type { LangCode, RegionLocale } from '@workspace/types';

interface LocalizedEntity {
  name?: string;
  nameEn?: string;
  nameEs?: string;
  nameCa?: string;
  // Support for new full locale format
  name_en_gb?: string;
  name_es_es?: string;
  name_ca_es?: string;
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
 */
export const getLocalizedName = (
  entity: LocalizedEntity,
  currentLanguage: LangCode | RegionLocale,
): string => {
  if (!entity) return '';

  // First try to match full locale format (new database schema)
  if (currentLanguage.includes('-')) {
    const localeKey = `name_${currentLanguage.toLowerCase().replace('-', '_')}` as keyof LocalizedEntity;
    if (entity[localeKey]) return entity[localeKey] as string;
  }

  // Fallback to simple code format (legacy support)
  const simpleCode = getSimpleCode(currentLanguage);

  switch (simpleCode) {
    case 'en':
      return entity.nameEn || entity.name_en_gb || entity.name || '';
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
      return 'nameEn';
    case 'es':
      return 'nameEs';
    case 'ca':
      return 'nameCa';
    default:
      return 'name';
  }
};
