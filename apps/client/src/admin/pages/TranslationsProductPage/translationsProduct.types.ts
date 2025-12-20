import type { RegionLocale } from '@workspace/config/i18n.config';

export type SectionKey = 'drinkTypes' | 'drinkSubtypes' | 'volumes' | 'containerTypes';

export interface GroupedSubtypes {
  drinkTypeId: string;
  drinkTypeName: string;
  subtypes: TranslationsFormItem[];
}

export interface TranslationsApiItem {
  id: string;
  name: string;
  translations: Record<RegionLocale, string>;
  [key: string]: any;
}

export interface TranslationsFormItem {
  id: string;
  name: string;
  [key: string]: any;
}

export interface TranslationsSection {
  key: SectionKey;
  title: string;
  description: string;
  items: TranslationsFormItem[];
}
