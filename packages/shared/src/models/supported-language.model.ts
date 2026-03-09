export interface SupportedLanguageModel {
  id: string;
  isoCode: string;
  nativeName: string;
  displayName: string;
  flagCode: string | null;
  isActive: boolean;
  isDefault: boolean;
  sortOrder: number;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export type SupportedLanguage = SupportedLanguageModel;

export interface LanguageInfo {
  isoCode: string;
  displayName: string;
  nativeName: string;
  flagCode?: string | null;
}

export type LanguageCode = 'es' | 'en' | 'ca' | string;
