import type { RegionLocale } from '@workspace/config/i18n.config';
import type { ConvertKeysToCamelCase, OverridePropTypes } from '@workspace/core/types/utils';
import type { TranslationsEntity } from '@workspace/server/types/entities/translations.entity';

import type { ModelBaseProps } from 'types/base.types';

/**
 * Frontend model for TranslationsUi - transformed from BE entity
 * Uses TS utility types to convert snake_case to camelCase
 * Overrides translations to be a parsed Record<string, string> instead of string
 */
export type TranslationsModel = OverridePropTypes<
  TranslationsCamelCase,
  ModelBaseProps & {
    translations: Record<RegionLocale, string>; // Override: API returns parsed JSON object
  }
>;

type TranslationsCamelCase = ConvertKeysToCamelCase<TranslationsEntity>;
