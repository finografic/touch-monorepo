import { languagesCodeToKey } from 'admin/utils/languages.utils';
import type { TranslationsApiItem, TranslationsFormItem } from '../../shared/types/translations.types';
import type { RegionLocale } from '@workspace/config/i18n.config';
import type { TranslationsModel } from 'types/models/translations.model';

/**
 * DTO for transforming UI translation items between API and UI
 */
export const TranslationsDto = {
  /**
   * API → Form (RHF)
   */
  fromApi: (item: TranslationsModel, supportedLanguages: RegionLocale[]): TranslationsFormItem => {
    const formItem: TranslationsFormItem = { id: item.id, key: item.key };

    // Copy translations into camelCase language keys
    for (const lang of supportedLanguages) {
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
  toApi: (item: TranslationsFormItem, languages: RegionLocale[]) => ({
    key: item.key,
    translations: Object.fromEntries(languages.map((lang) => [lang, item[languagesCodeToKey(lang)] ?? ''])),
  }),
};
