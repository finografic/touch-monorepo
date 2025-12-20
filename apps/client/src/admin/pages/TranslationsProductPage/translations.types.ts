export interface TranslationApiItem {
  id: string;
  name: string; // slug / key
  translations: Record<string, string>; // { "es-ES": "...", ... }
  [key: string]: any; // other domain fields (hasSubtypes, etc.)
}

export interface TranslationFormItem {
  id: string;
  key: string;
  [key: string]: any; // dynamic language fields: esEs, enGb, ...
}

export type SectionKey = 'drinkTypes' | 'drinkSubtypes' | 'volumes' | 'containerTypes';

export interface SectionData {
  key: SectionKey;
  title: string;
  description: string;
  items: TranslationFormItem[]; // RHF-ready form items
}

export interface GroupedSubtypes {
  drinkTypeId: string;
  drinkTypeName: string;
  subtypes: TranslationFormItem[];
}
