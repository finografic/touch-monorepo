import type { OverridePropTypes } from '@workspace/core/types/utils';

import type { ModelBaseProps } from 'types/base.types';

/**
 * Frontend model for SupportedLanguage - transformed from BE entity
 * Uses TS utility types to convert snake_case to camelCase
 */
export type TranslationsModel = OverridePropTypes<TranslationsUiCamelCase, ModelBaseProps>;
interface TranslationsUiCamelCase {
  sections: Array<{
    key: string;
    title: string;
    description: string;
    items: Array<{ key: string; values: Record<string, string> }>;
  }>;
}

type TranslationsUiSection = Array<{
  key: string;
  items: Array<{ key: string; values: Record<string, string> }>;
}>;
