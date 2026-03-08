import type { SupportedLanguageModel } from '@workspace/server/models';

export type SupportedLanguage = SupportedLanguageModel;

/**
 * Simplified language info type for UI components
 * Picks only the fields needed for translation forms and language selection
 * Makes flagCode optional since it's not always needed in UI
 */
export type LanguageInfo = Pick<SupportedLanguage, 'isoCode' | 'displayName' | 'nativeName'> & {
  flagCode?: string | null;
};

/**
 * Common language code type - replaces hardcoded unions
 */
export type LanguageCode = 'es' | 'en' | 'ca' | string;
