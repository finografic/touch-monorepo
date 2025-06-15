type SupportedLanguage = 'en' | 'es' | 'cat';

interface LocalizedEntity {
  nameEn?: string;
  nameEs?: string | null;
  nameCat?: string | null;
  name?: string; // Fallback for some entities like volumes
  [key: string]: any;
}

/**
 * Gets the localized name for an entity based on the current language
 * Falls back to Spanish (default), then English, then name field if the translation doesn't exist
 */
export const getLocalizedName = (entity: LocalizedEntity, currentLanguage: SupportedLanguage): string => {
  if (!entity) return '';

  switch (currentLanguage) {
    case 'es':
      return entity.nameEs || entity.nameEn || entity.name || '';
    case 'cat':
      return entity.nameCat || entity.nameEs || entity.nameEn || entity.name || '';
    case 'en':
      return entity.nameEn || entity.nameEs || entity.name || '';
    default:
      return entity.nameEs || entity.nameEn || entity.name || '';
  }
};

/**
 * Gets the appropriate labelKey for the current language
 * Used in UI configurations
 */
export const getLabelKey = (currentLanguage: SupportedLanguage): keyof LocalizedEntity => {
  switch (currentLanguage) {
    case 'es':
      return 'nameEs';
    case 'cat':
      return 'nameCat';
    case 'en':
      return 'nameEn';
    default:
      return 'nameEs';
  }
};
