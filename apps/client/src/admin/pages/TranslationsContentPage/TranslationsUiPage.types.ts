import type { createUiLabelsSchema } from 'admin/pages/TranslationsProductPage/translations-product.schema';
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
  namespace?: string; // 'app' | 'admin' | 'shared'
  role?: string; // For variant messages (e.g., 'admin', 'public')
}

export type UiLabelsFormData = z.infer<ReturnType<typeof createUiLabelsSchema>>;
