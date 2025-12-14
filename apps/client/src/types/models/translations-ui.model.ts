import type { ConvertKeysToCamelCase, OverridePropTypes } from '@workspace/core/types/utils';
import type { TranslationsUiEntity } from '@workspace/server/types/entities/translations-ui.entity';

import type { ModelBaseProps } from 'types/base.types';

/**
 * Frontend model for SupportedLanguage - transformed from BE entity
 * Uses TS utility types to convert snake_case to camelCase
 */
export type TranslationsUiModel = OverridePropTypes<TranslationsUiCamelCase, ModelBaseProps>;

type TranslationsUiCamelCase = ConvertKeysToCamelCase<TranslationsUiEntity>;
