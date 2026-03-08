import type * as v from 'valibot';

import type { createUiLabelsSchema } from 'admin/utils/translations-ui.schema';

export interface SupportedLanguage {
  isoCode: string;
  displayName: string;
  nativeName: string;
}

export interface UiLabelItem {
  key: string;
  values: Record<string, string>;
}

export interface UiLabelTranslationsSection {
  key: string;
  title: string;
  description: string;
  items: UiLabelItem[];
}

export type UiLabelsFormData = v.InferOutput<ReturnType<typeof createUiLabelsSchema>>;
