import type { RegionLocale } from '@workspace/config/i18n.config';

export type I18nDomainGroupKey = string;

export interface TranslationsApiItem {
  id: string;
  key: string;
  translations: Record<RegionLocale, string>;
  isActive?: boolean;
}

export interface TranslationsFormItem {
  id: string;
  key: string;
  [key: string]: any;
}

export interface TranslationsSection {
  group: I18nDomainGroupKey;
  title: string;
  description: string;
  items: TranslationsFormItem[];
}
