export interface TranslationUiApiItem {
  id: string;
  key: string; // dot notation key: "buttons.add", "tables.headers.name"
  translations: Record<string, string>; // { "es-ES": "...", ... }
  description?: string | null;
  isActive?: boolean;
}

export interface TranslationUiFormItem {
  id: string;
  key: string; // dot notation key
  description?: string | null;
  [key: string]: any; // dynamic language fields: esEs, enGb, ...
}

export type SectionKey = 'all'; // For now, just one section for all UI translations

export interface SectionData {
  key: SectionKey;
  title: string;
  description: string;
  items: TranslationUiFormItem[]; // RHF-ready form items
}
