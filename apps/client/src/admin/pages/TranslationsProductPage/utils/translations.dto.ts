import { languagesCodeToKey } from 'admin/utils/languages.utils';
import type { TranslationApiItem, TranslationFormItem } from '../translations.types';
import type { RegionLocale } from 'node_modules/@workspace/i18n/dist/_tsup-dts-rollup';

/**
 * DTO for transforming translation items between API and UI
 */
export const TranslationsDto = {
  /**
   * API → Form (RHF)
   */
  fromApi: (item: TranslationApiItem, languages: string[]): TranslationFormItem => {
    const formItem: TranslationFormItem = {
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
  toApi: (item: TranslationFormItem, languages: RegionLocale[]) => ({
    name: item.name,
    translations: Object.fromEntries(languages.map((lang) => [lang, item[languagesCodeToKey(lang)] ?? ''])),
  }),
};
