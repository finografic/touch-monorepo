/**
 * DTO for transforming translations-ui items between API and UI
 * Handles parsing stringified JSON translations into objects
 */
export const TranslationsUiDto = {
  /**
   * Parse translations from API response
   * Handles both stringified JSON and already-parsed objects
   */
  parseTranslations: (translations: string | Record<string, string> | undefined): Record<string, string> => {
    if (!translations) {
      return {};
    }

    // If already an object, return as-is
    if (typeof translations === 'object' && !Array.isArray(translations)) {
      return translations;
    }

    // If it's a string, try to parse it
    if (typeof translations === 'string') {
      try {
        const parsed = JSON.parse(translations);
        return typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
      } catch (error) {
        console.warn('Failed to parse translations JSON:', error);
        return {};
      }
    }

    return {};
  },

  /**
   * Transform API entity to frontend model
   * Handles date conversion and translation parsing
   */
  fromApi: (entity: any) => {
    return {
      id: entity.id,
      key: entity.key,
      translations: TranslationsUiDto.parseTranslations(entity.translations),
      description: entity.description || null,
      isActive: Boolean(entity.is_active ?? entity.isActive),
      createdAt: entity.created_at
        ? new Date(typeof entity.created_at === 'string' ? entity.created_at : entity.created_at * 1000)
        : new Date(),
      updatedAt: entity.updated_at
        ? new Date(typeof entity.updated_at === 'string' ? entity.updated_at : entity.updated_at * 1000)
        : new Date(),
    };
  },
};

