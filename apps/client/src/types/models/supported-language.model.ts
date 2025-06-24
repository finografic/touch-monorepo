import type { SupportedLanguageEntity } from '@workspace/server/types';
import type { ConvertKeysToCamelCase, OverridePropTypes } from '@workspace/types/utils';
import type { ModelBaseProps } from 'types/base.types';

/**
 * Frontend model for SupportedLanguage - transformed from BE entity
 * Uses TS utility types to convert snake_case to camelCase
 */
export type SupportedLanguage = OverridePropTypes<SupportedLanguageCamelCase, ModelBaseProps>;
type SupportedLanguageCamelCase = ConvertKeysToCamelCase<SupportedLanguageEntity>;

/**
 * Common language code type - replaces hardcoded unions
 */
export type LanguageCode = 'es' | 'en' | 'ca' | string;
