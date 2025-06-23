import type { LangCode } from '@workspace/types';

interface LocalizedEntity {
  name?: string;
  nameEn?: string;
  nameEs?: string;
  nameCa?: string;
}

/**
 * Gets the localized name for an entity based on the current language
 */
export const getLocalizedName = (entity: LocalizedEntity, currentLanguage: LangCode): string => {
  if (!entity) return '';

  switch (currentLanguage) {
    case 'en':
      return entity.nameEn || entity.name || '';
    case 'es':
      return entity.nameEs || entity.name || '';
    case 'cat':
      return entity.nameCa || entity.name || '';
    default:
      return entity.name || '';
  }
};

/**
 * Gets the appropriate label key for the current language
 */
export const getLabelKey = (currentLanguage: LangCode): keyof LocalizedEntity => {
  switch (currentLanguage) {
    case 'en':
      return 'nameEn';
    case 'es':
      return 'nameEs';
    case 'cat':
      return 'nameCa';
    default:
      return 'name';
  }
};
