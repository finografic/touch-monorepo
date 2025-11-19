import type { ConvertKeysToCamelCase, OverridePropTypes } from '@workspace/core/types/utils';
import type { SupportedLanguageEntity } from '@workspace/server/types';

import type { ModelBaseProps } from 'types/base.types';

/**
 * Frontend model for SupportedLanguage - transformed from BE entity
 * Uses TS utility types to convert snake_case to camelCase
 */
export type SupportedLanguage = OverridePropTypes<
  SupportedLanguageCamelCase,
  ModelBaseProps & { flagCode?: string | null }
>;
type SupportedLanguageCamelCase = ConvertKeysToCamelCase<SupportedLanguageEntity>;

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
