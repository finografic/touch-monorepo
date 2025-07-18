import type { LetterLower, LetterUpper } from '@workspace/core/types/utils';
/**
 * Unified language interface that combines API data with country data
 * This should replace all other language interfaces throughout the app
 */
export interface LanguageInfo {
  // Core identification
  id?: string;
  // code: string; // ISO language code (e.g., 'es', 'en', 'ca')
  code: `${LetterLower}${LetterLower}` | `${LetterLower}${LetterLower}${LetterLower}`;

  // Display names
  label: string; // Display name in current locale
  nativeLabel: string; // Native name in the language itself

  // Visual representation
  flag: string; // Flag URL or data URI
  emoji?: string; // Flag emoji

  // Metadata (from API when available)
  isActive?: boolean;
  isDefault?: boolean;
  sortOrder?: number;

  // Extended info (from Country data when available)
  countryName?: string;
  countryCode?: string; // ISO country code (e.g., 'ES', 'GB')

  // Timestamps (from API when available)
  createdAt?: Date | null;
  updatedAt?: Date | null;
}
