/**
 * Language and Internationalization Types
 */

// Core language codes (ISO 639-1) - 2-3 letter codes
export type LangCode = string;

// ISO country/region codes (ISO 3166-1 alpha-2/3)
export type IsoCode = string;

// Native language keys for flag data lookup (ISO 639-3 or custom)
export type NativeLangKey = string;

// Region locale format (language-REGION) - Template literal for any valid locale
export type RegionLocale = `${string}-${Uppercase<string>}`;

// Language configuration mapping interface
export interface LanguageConfig {
  iso: IsoCode;
  nativeKey: NativeLangKey;
}

// Complete language configuration map - dynamic record
export type LanguageConfigMap = Record<string, LanguageConfig>;

// Language display information
export interface LanguageInfo {
  code: RegionLocale;
  label: string;
  nativeLabel: string;
  flag: string;
}

// Props for language-related components
export interface LanguageSelectorProps {
  onLanguageChange?: (languageCode: RegionLocale) => void;
}

// Extends native Intl types where applicable
export type SupportedLocale = RegionLocale;
export type LocaleOptions = Intl.DateTimeFormatOptions;
export type NumberFormatOptions = Intl.NumberFormatOptions;
