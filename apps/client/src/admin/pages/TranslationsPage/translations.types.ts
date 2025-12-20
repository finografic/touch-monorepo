export interface TranslationUiApiItem {
  id: string;
  key: string; // dot notation key: "buttons.add", "tables.headers.name"
  translations: Record<string, string>; // { "es-ES": "...", ... }
  isActive?: boolean;
}

export interface TranslationUiFormItem {
  id: string;
  key: string; // dot notation key
  [key: string]: any; // dynamic language fields: esEs, enGb, ...
}

export type SectionKey = string; // Dynamic: 'buttons' | 'tables' | 'time' | 'app' | 'admin' | etc.

export interface SectionData {
  key: SectionKey;
  title: string;
  description: string;
  items: TranslationUiFormItem[]; // RHF-ready form items
}

// ======================================================================== //
// ======================================================================== //
