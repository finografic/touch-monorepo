import type { createUiLabelsSchema } from '../pages/TranslationsUiPage/translations-ui.schema';
import type { z } from 'zod';

export interface SupportedLanguage {
  isoCode: string;
  displayName: string;
  nativeName: string;
}

export interface UiLabelItem {
  key: string;
  values: Record<string, string>;
}

export interface UiLabelSectionData {
  key: string;
  title: string;
  description: string;
  items: UiLabelItem[];
}

export type UiLabelsFormData = z.infer<ReturnType<typeof createUiLabelsSchema>>;
