import { languagesCodeToKey } from 'admin//utils/languages.utils';
import type { TranslationUiApiItem, TranslationUiFormItem } from '../translations.types';
import type { RegionLocale } from '@workspace/config/i18n.config';

/**
 * DTO for transforming UI translation items between API and UI
 */
export const TranslationsUiDto = {
  /**
   * API → Form (RHF)
   */
  fromApi: (item: TranslationUiApiItem, languages: string[]): TranslationUiFormItem => {
    const formItem: TranslationUiFormItem = {
      id: item.id,
      key: item.key,
      description: item.description || null,
    };

    // Copy translations into camelCase language keys
    for (const lang of languages) {
      formItem[languagesCodeToKey(lang)] = item.translations?.[lang] ?? '';
    }

    // Preserve any extra non-translation fields transparently
    Object.keys(item).forEach((key) => {
      if (key !== 'translations' && key !== 'id' && key !== 'key' && key !== 'description') {
        formItem[key] = item[key];
      }
    });

    return formItem;
  },

  /**
   * Form (RHF) → API
   */
  toApi: (item: TranslationUiFormItem, languages: RegionLocale[]) => ({
    key: item.key,
    translations: Object.fromEntries(languages.map((lang) => [lang, item[languagesCodeToKey(lang)] ?? ''])),
    description: item.description || null,
  }),
};
