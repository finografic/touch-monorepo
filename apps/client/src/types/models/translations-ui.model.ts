import type { ConvertKeysToCamelCase, OverridePropTypes } from '@workspace/core/types/utils';
import type { TranslationsUiEntity } from '@workspace/server/types/entities/translations-ui.entity';

import type { ModelBaseProps } from 'types/base.types';

/**
 * Frontend model for TranslationsUi - transformed from BE entity
 * Uses TS utility types to convert snake_case to camelCase
 * Overrides translations to be a parsed Record<string, string> instead of string
 */
export type TranslationsUiModel = OverridePropTypes<
  TranslationsUiCamelCase,
  ModelBaseProps & {
    translations: Record<string, string>; // Override: API returns parsed JSON object
  }
>;

type TranslationsUiCamelCase = ConvertKeysToCamelCase<TranslationsUiEntity>;
