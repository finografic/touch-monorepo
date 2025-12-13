export type SectionKey = 'drinkSubtypes' | 'volumes' | 'drinkTypes' | 'containerTypes';

/**
 * API shape (from backend)
 */
export interface TranslationApiItem {
  id: string;
  name: string; // slug / key
  translations: Record<string, string>; // { "es-ES": "...", ... }
  [key: string]: any; // other domain fields (hasSubtypes, etc.)
}

/**
 * UI / RHF shape
 */
export interface TranslationFormItem {
  id: string;
  name: string;
  [key: string]: any; // dynamic language fields: esEs, enGb, ...
}

export interface TranslationSectionData {
  key: SectionKey;
  title: string;
  description: string;
  items: TranslationFormItem[]; // RHF-ready form items
}
