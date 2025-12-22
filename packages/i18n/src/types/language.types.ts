/**
 * Language-related type definitions
 * Used for language configuration and display information
 */

/**
 * Language configuration for a specific locale
 */
export interface LanguageConfig {
  /** ISO 639-2 (3-char) code */
  iso3: string;
  /** ISO 639-1 (2-char) code */
  iso2: string;
  /** Display name in English */
  name: string;
  /** Native name (in the language itself) */
  nativeName: string;
  /** Optional sort order */
  sortOrder?: number;
  /** Whether this is a default language */
  isDefault?: boolean;
}

/**
 * Language display information
 * Used for UI components and language selection
 */
export interface LanguageInfo {
  id?: string;
  code: string;
  label: string;
  nativeLabel: string;
  flag: string;
  emoji?: string;
  isActive?: boolean;
  isDefault?: boolean;
  sortOrder?: number;
  countryName?: string;
  countryCode?: string;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}
