/**
 * Language and Internationalization Types
 * 🤖 AUTO-GENERATED - DO NOT EDIT MANUALLY
 * Generated from restcountries data on 2025-07-06T17:41:48.867Z
 */

// All supported country codes (ISO 3166-1 alpha-2)
export type CCA2 = 'AD' | 'AE' | 'AF' | 'AG' | 'AI' | 'AL' | 'AM' | 'AO' | 'AQ' | 'AR' | 'AS' | 'AT' | 'AU' | 'AW' | 'AX' | 'AZ' | 'BA' | 'BB' | 'BD' | 'BE' | 'BF' | 'BG' | 'BH' | 'BI' | 'BJ' | 'BL' | 'BM' | 'BN' | 'BO' | 'BQ' | 'BR' | 'BS' | 'BT' | 'BV' | 'BW' | 'BY' | 'BZ' | 'CA' | 'CC' | 'CD' | 'CF' | 'CG' | 'CH' | 'CI' | 'CK' | 'CL' | 'CM' | 'CN' | 'CO' | 'CR' | 'CU' | 'CV' | 'CW' | 'CX' | 'CY' | 'CZ' | 'DE' | 'DJ' | 'DK' | 'DM' | 'DO' | 'DZ' | 'EC' | 'EE' | 'EG' | 'EH' | 'ER' | 'ES' | 'ET' | 'FI' | 'FJ' | 'FK' | 'FM' | 'FO' | 'FR' | 'GA' | 'GB' | 'GD' | 'GE' | 'GF' | 'GG' | 'GH' | 'GI' | 'GL' | 'GM' | 'GN' | 'GP' | 'GQ' | 'GR' | 'GS' | 'GT' | 'GU' | 'GW' | 'GY' | 'HK' | 'HM' | 'HN' | 'HR' | 'HT' | 'HU' | 'ID' | 'IE' | 'IL' | 'IM' | 'IN' | 'IO' | 'IQ' | 'IR' | 'IS' | 'IT' | 'JE' | 'JM' | 'JO' | 'JP' | 'KE' | 'KG' | 'KH' | 'KI' | 'KM' | 'KN' | 'KP' | 'KR' | 'KW' | 'KY' | 'KZ' | 'LA' | 'LB' | 'LC' | 'LI' | 'LK' | 'LR' | 'LS' | 'LT' | 'LU' | 'LV' | 'LY' | 'MA' | 'MC' | 'MD' | 'ME' | 'MF' | 'MG' | 'MH' | 'MK' | 'ML' | 'MM' | 'MN' | 'MO' | 'MP' | 'MQ' | 'MR' | 'MS' | 'MT' | 'MU' | 'MV' | 'MW' | 'MX' | 'MY' | 'MZ' | 'NA' | 'NC' | 'NE' | 'NF' | 'NG' | 'NI' | 'NL' | 'NO' | 'NP' | 'NR' | 'NU' | 'NZ' | 'OM' | 'PA' | 'PE' | 'PF' | 'PG' | 'PH' | 'PK' | 'PL' | 'PM' | 'PN' | 'PR' | 'PS' | 'PT' | 'PW' | 'PY' | 'QA' | 'RE' | 'RO' | 'RS' | 'RU' | 'RW' | 'SA' | 'SB' | 'SC' | 'SD' | 'SE' | 'SG' | 'SH' | 'SI' | 'SJ' | 'SK' | 'SL' | 'SM' | 'SN' | 'SO' | 'SR' | 'SS' | 'ST' | 'SV' | 'SX' | 'SY' | 'SZ' | 'TC' | 'TD' | 'TF' | 'TG' | 'TH' | 'TJ' | 'TK' | 'TL' | 'TM' | 'TN' | 'TO' | 'TR' | 'TT' | 'TV' | 'TW' | 'TZ' | 'UA' | 'UG' | 'UM' | 'US' | 'UY' | 'UZ' | 'VA' | 'VC' | 'VE' | 'VG' | 'VI' | 'VN' | 'VU' | 'WF' | 'WS' | 'XK' | 'YE' | 'YT' | 'ZA' | 'ZM' | 'ZW';

/**
 * Controlled mapping from 3-character language codes (ISO 639-3/restcountries)
 * to 2-character language codes (ISO 639-1/i18n standard)
 *
 * Only add languages that your application actually supports
 */
export const LANG_CODE_MAPPING = {
  'spa': 'es', // Spanish
  'eng': 'en', // English
  'cat': 'ca', // Catalan
} as const;

// Extract types from the controlled mapping
export type LangCode3 = keyof typeof LANG_CODE_MAPPING; // "spa" | "eng" | "cat"
export type LangCode2 = typeof LANG_CODE_MAPPING[LangCode3]; // "es" | "en" | "ca"

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
  return isSupportedLangCode2(lang) && (country.toUpperCase() as any) in ({'AD': true, 'AE': true, 'AF': true, 'AG': true, 'AI': true, 'AL': true, 'AM': true, 'AO': true, 'AQ': true, 'AR': true, 'AS': true, 'AT': true, 'AU': true, 'AW': true, 'AX': true, 'AZ': true, 'BA': true, 'BB': true, 'BD': true, 'BE': true, 'BF': true, 'BG': true, 'BH': true, 'BI': true, 'BJ': true, 'BL': true, 'BM': true, 'BN': true, 'BO': true, 'BQ': true, 'BR': true, 'BS': true, 'BT': true, 'BV': true, 'BW': true, 'BY': true, 'BZ': true, 'CA': true, 'CC': true, 'CD': true, 'CF': true, 'CG': true, 'CH': true, 'CI': true, 'CK': true, 'CL': true, 'CM': true, 'CN': true, 'CO': true, 'CR': true, 'CU': true, 'CV': true, 'CW': true, 'CX': true, 'CY': true, 'CZ': true, 'DE': true, 'DJ': true, 'DK': true, 'DM': true, 'DO': true, 'DZ': true, 'EC': true, 'EE': true, 'EG': true, 'EH': true, 'ER': true, 'ES': true, 'ET': true, 'FI': true, 'FJ': true, 'FK': true, 'FM': true, 'FO': true, 'FR': true, 'GA': true, 'GB': true, 'GD': true, 'GE': true, 'GF': true, 'GG': true, 'GH': true, 'GI': true, 'GL': true, 'GM': true, 'GN': true, 'GP': true, 'GQ': true, 'GR': true, 'GS': true, 'GT': true, 'GU': true, 'GW': true, 'GY': true, 'HK': true, 'HM': true, 'HN': true, 'HR': true, 'HT': true, 'HU': true, 'ID': true, 'IE': true, 'IL': true, 'IM': true, 'IN': true, 'IO': true, 'IQ': true, 'IR': true, 'IS': true, 'IT': true, 'JE': true, 'JM': true, 'JO': true, 'JP': true, 'KE': true, 'KG': true, 'KH': true, 'KI': true, 'KM': true, 'KN': true, 'KP': true, 'KR': true, 'KW': true, 'KY': true, 'KZ': true, 'LA': true, 'LB': true, 'LC': true, 'LI': true, 'LK': true, 'LR': true, 'LS': true, 'LT': true, 'LU': true, 'LV': true, 'LY': true, 'MA': true, 'MC': true, 'MD': true, 'ME': true, 'MF': true, 'MG': true, 'MH': true, 'MK': true, 'ML': true, 'MM': true, 'MN': true, 'MO': true, 'MP': true, 'MQ': true, 'MR': true, 'MS': true, 'MT': true, 'MU': true, 'MV': true, 'MW': true, 'MX': true, 'MY': true, 'MZ': true, 'NA': true, 'NC': true, 'NE': true, 'NF': true, 'NG': true, 'NI': true, 'NL': true, 'NO': true, 'NP': true, 'NR': true, 'NU': true, 'NZ': true, 'OM': true, 'PA': true, 'PE': true, 'PF': true, 'PG': true, 'PH': true, 'PK': true, 'PL': true, 'PM': true, 'PN': true, 'PR': true, 'PS': true, 'PT': true, 'PW': true, 'PY': true, 'QA': true, 'RE': true, 'RO': true, 'RS': true, 'RU': true, 'RW': true, 'SA': true, 'SB': true, 'SC': true, 'SD': true, 'SE': true, 'SG': true, 'SH': true, 'SI': true, 'SJ': true, 'SK': true, 'SL': true, 'SM': true, 'SN': true, 'SO': true, 'SR': true, 'SS': true, 'ST': true, 'SV': true, 'SX': true, 'SY': true, 'SZ': true, 'TC': true, 'TD': true, 'TF': true, 'TG': true, 'TH': true, 'TJ': true, 'TK': true, 'TL': true, 'TM': true, 'TN': true, 'TO': true, 'TR': true, 'TT': true, 'TV': true, 'TW': true, 'TZ': true, 'UA': true, 'UG': true, 'UM': true, 'US': true, 'UY': true, 'UZ': true, 'VA': true, 'VC': true, 'VE': true, 'VG': true, 'VI': true, 'VN': true, 'VU': true, 'WF': true, 'WS': true, 'XK': true, 'YE': true, 'YT': true, 'ZA': true, 'ZM': true, 'ZW': true});
};
