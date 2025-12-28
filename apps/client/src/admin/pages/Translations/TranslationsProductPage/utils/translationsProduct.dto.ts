import { languagesCodeToKey } from 'admin/utils/language.utils';
import type { RegionLocale } from 'node_modules/@workspace/i18n/dist/_tsup-dts-rollup';

import type { TranslationsApiItem, TranslationsFormItem } from '../translationsProduct.types';

/**
 * DTO for transforming translation items between API and UI
 */
export const TranslationsDto = {
  /**
   * API → Form (RHF)
   */
  fromApi: (item: TranslationsApiItem, languages: string[]): TranslationsFormItem => {
    const formItem: TranslationsFormItem = {
      id: item.id,
      name: item.name,
    };

    // Copy translations into camelCase language keys
    for (const lang of languages) {
      formItem[languagesCodeToKey(lang)] = item.translations?.[lang] ?? '';
    }

    // Preserve any extra non-translation fields transparently
    Object.keys(item).forEach((key) => {
      if (key !== 'translations' && key !== 'id' && key !== 'name') {
        formItem[key] = item[key];
      }
    });

    return formItem;
  },

  /**
   * Form (RHF) → API
   * (can be added later, as you said)
   */
  toApi: (item: TranslationsFormItem, languages: RegionLocale[]) => ({
    name: item.name,
    translations: Object.fromEntries(languages.map((lang) => [lang, item[languagesCodeToKey(lang)] ?? ''])),
  }),
};
