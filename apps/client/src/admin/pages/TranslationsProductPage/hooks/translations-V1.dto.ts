import type { ApiItem } from '../TranslationsPage.types';
import { languagesCodeToKey } from '../utils/language.utils';

export const TranslationsDto = {
  fromApi: (item: ApiItem, languages: string[]): Record<string, any> => {
    const formItem: Record<string, any> = {
      id: item.id,
      name: item.name,
    };

    for (const lang of languages) {
      formItem[languagesCodeToKey(lang)] = item.translations?.[lang] ?? '';
    }

    return formItem;
  },
};
