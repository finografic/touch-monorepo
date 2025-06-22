/**
 * Types specific to supported languages queries and mutations
 */

/**
 * Input type for creating supported languages
 */
export interface SupportedLanguageInput {
  isoCode: string;
  nativeName: string;
  displayName: string;
  flagCode?: string | null;
  isActive?: boolean;
  isDefault?: boolean;
  sortOrder?: number;
}

/**
 * Update type for patching supported languages
 */
export interface SupportedLanguageUpdate {
  isoCode?: string;
  nativeName?: string;
  displayName?: string;
  flagCode?: string | null;
  isActive?: boolean;
  isDefault?: boolean;
  sortOrder?: number;
}
