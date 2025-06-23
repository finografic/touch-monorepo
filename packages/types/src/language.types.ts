/**
 * Language and Internationalization Types
 */

// Core language codes (ISO 639-1)
export type LangCode = 'en' | 'es' | 'ca';

// ISO country/region codes
export type IsoCode = 'es' | 'gb' | 'ca';

// Native language keys for flag data lookup
export type NativeLangKey = 'spa' | 'eng' | 'cat';

// Region locale format (language-REGION)
export type RegionLocale = 'es-ES' | 'en-GB' | 'ca-ES';

// Language configuration mapping interface
export interface LanguageConfig {
  iso: IsoCode;
  nativeKey: NativeLangKey;
}

// Complete language configuration map
export type LanguageConfigMap = Record<RegionLocale, LanguageConfig>;

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
