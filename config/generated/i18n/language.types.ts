/**
 * Language and Internationalization Types
 * 🤖 AUTO-GENERATED - DO NOT EDIT MANUALLY
 * Generated on 2025-12-01T14:51:14.056Z
 */
import { config } from '@workspace/config/i18n.config';

// All supported country codes (ISO 3166-1 alpha-2)
export type CCA2 = 'ES' | 'GB' | 'US';

/**
 * Controlled mapping from 3-character language codes (ISO 639-3)
 * to 2-character language codes (ISO 639-1)
 */
export const LANG_CODE_MAPPING = {
  'eng': 'en', // English
  'spa': 'es', // Spanish
  'cat': 'ca', // Catalan
} as const;

// Extract types from the controlled mapping
export type LangCode3 = keyof typeof LANG_CODE_MAPPING;
export type LangCode2 = typeof LANG_CODE_MAPPING[LangCode3];

// Legacy alias for backward compatibility
export type LangCode = LangCode2;

// Country/region codes (ISO 3166-1 alpha-2)
export type CountryCode = CCA2;

// Full locale format: language-COUNTRY (e.g., "es-ES", "en-GB", "ca-ES")
export type RegionLocale = `${LangCode2}-${CCA2}`;

// Language configuration mapping interface
export interface LanguageConfig {
  iso: CountryCode;
  nativeKey: LangCode3;
}

// Complete language configuration map
export type LanguageConfigMap = Record<RegionLocale, LanguageConfig>;

// Language display information
export interface LanguageInfo {
  id?: string;
  code: RegionLocale;
  label: string;
  nativeLabel: string;
  flag: string;
  emoji?: string;
  isActive?: boolean;
  isDefault?: boolean;
  sortOrder?: number;
  countryName?: string;
  countryCode?: CountryCode;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

// Props for language-related components
export interface LanguageSelectorProps {
  onLanguageChange?: (languageCode: RegionLocale) => void;
}

// Utility type helpers
export type SupportedLocale = RegionLocale;
export type LocaleOptions = Intl.DateTimeFormatOptions;
export type NumberFormatOptions = Intl.NumberFormatOptions;

// Helper function to get 2-char code from 3-char code
export const getLangCode2 = (langCode3: LangCode3): LangCode2 => {
  return LANG_CODE_MAPPING[langCode3];
};

// Helper function to check if a 3-char code is supported
export const isSupportedLangCode3 = (code: string): code is LangCode3 => {
  return code in LANG_CODE_MAPPING;
};

// Helper function to check if a 2-char code is supported
export const isSupportedLangCode2 = (code: string): code is LangCode2 => {
  return Object.values(LANG_CODE_MAPPING).includes(code as LangCode2);
};

// Validate locale format
export const isValidRegionLocale = (locale: string): locale is RegionLocale => {
  const parts = locale.split('-');
  if (parts.length !== 2) return false;

  const [lang, country] = parts;
  const supportedCountries = config.typeGeneration.supportedCountries;

  return isSupportedLangCode2(lang) && supportedCountries.includes(country.toUpperCase());
};