import type { RegionLocale, LanguageConfigMap, LangCode } from '@workspace/core/types';

/**
 * Application Locale Configuration
 *
 * Defines the supported locales and primary locale mappings
 * for the application's internationalization system.
 *
 * Expanded to support ~80 common language-country combinations
 * covering major world languages and their primary regions.
 */

// Default language and locale
export const DEFAULT_LANG_CODE: LangCode = 'es';
export const DEFAULT_LOCALE: RegionLocale = 'es-ES';

// Supported locales for the application (~80 entries)
export const SUPPORTED_LOCALES = [
  // Spanish (Español)
  'es-ES',
  'es-MX',
  'es-AR',
  'es-CO',
  'es-PE',
  'es-VE',
  'es-CL',
  'es-EC',
  'es-GT',
  'es-CU',
  'es-BO',
  'es-DO',
  'es-HN',
  'es-PY',
  'es-SV',
  'es-NI',
  'es-CR',
  'es-PA',
  'es-UY',
  'es-US',

  // English
  'en-US',
  'en-GB',
  'en-CA',
  'en-AU',
  'en-NZ',
  'en-IE',
  'en-ZA',
  'en-IN',
  'en-SG',
  'en-HK',
  'en-PH',
  'en-MY',
  'en-KE',
  'en-NG',
  'en-GH',
  'en-UG',
  'en-TZ',
  'en-ZW',
  'en-BW',
  'en-JM',

  // French (Français)
  'fr-FR',
  'fr-CA',
  'fr-BE',
  'fr-CH',
  'fr-LU',
  'fr-MC',
  'fr-SN',
  'fr-CI',
  'fr-ML',
  'fr-BF',
  'fr-NE',
  'fr-TD',
  'fr-MG',
  'fr-CM',
  'fr-CD',
  'fr-MA',
  'fr-TN',
  'fr-DZ',
  'fr-HT',
  'fr-RE',

  // German (Deutsch)
  'de-DE',
  'de-AT',
  'de-CH',
  'de-LU',
  'de-LI',
  'de-BE',

  // Italian (Italiano)
  'it-IT',
  'it-CH',
  'it-SM',
  'it-VA',

  // Portuguese (Português)
  'pt-PT',
  'pt-BR',
  'pt-AO',
  'pt-MZ',
  'pt-CV',
  'pt-GW',
  'pt-ST',
  'pt-TL',

  // Dutch (Nederlands)
  'nl-NL',
  'nl-BE',
  'nl-SR',

  // Russian (Русский)
  'ru-RU',
  'ru-BY',
  'ru-KZ',
  'ru-KG',
  'ru-MD',
  'ru-UA',

  // Arabic (العربية)
  'ar-SA',
  'ar-EG',
  'ar-AE',
  'ar-JO',
  'ar-LB',
  'ar-SY',
  'ar-IQ',
  'ar-KW',
  'ar-QA',
  'ar-BH',
  'ar-OM',
  'ar-YE',
  'ar-MA',
  'ar-TN',
  'ar-DZ',
  'ar-LY',
  'ar-SD',
  'ar-PS',

  // Chinese (中文)
  'zh-CN',
  'zh-TW',
  'zh-HK',
  'zh-SG',
  'zh-MO',

  // Japanese (日本語)
  'ja-JP',

  // Korean (한국어)
  'ko-KR',
  'ko-KP',

  // Hindi (हिन्दी)
  'hi-IN',

  // Catalan (Català) - Your original languages
  'ca-ES',
  'ca-AD',
  'ca-FR',
  'ca-IT',

  // Other major languages
  'tr-TR',
  'pl-PL',
  'sv-SE',
  'no-NO',
  'da-DK',
  'fi-FI',
  'hu-HU',
  'cs-CZ',
  'sk-SK',
  'ro-RO',
  'bg-BG',
  'hr-HR',
  'sr-RS',
  'sl-SI',
  'et-EE',
  'lv-LV',
  'lt-LT',
  'el-GR',
  'he-IL',
  'th-TH',
  'vi-VN',
  'id-ID',
  'ms-MY',
  'tl-PH',
  'sw-KE',
  'am-ET',
  'yo-NG',
  'zu-ZA',
  'af-ZA',
  'is-IS',
  'mt-MT',
  'mk-MK',
  'sq-AL',
  'eu-ES',
  'gl-ES',
  'cy-GB',
] as const satisfies readonly string[];

// Primary locale for each language (expanded)
export const PRIMARY_LOCALES = {
  // Original languages
  es: 'es-ES',
  en: 'en-US', // Changed to US as more common globally
  ca: 'ca-ES',

  // Major world languages
  fr: 'fr-FR',
  de: 'de-DE',
  it: 'it-IT',
  pt: 'pt-PT',
  nl: 'nl-NL',
  ru: 'ru-RU',
  ar: 'ar-SA',
  zh: 'zh-CN',
  ja: 'ja-JP',
  ko: 'ko-KR',
  hi: 'hi-IN',
  tr: 'tr-TR',
  pl: 'pl-PL',
  sv: 'sv-SE',
  no: 'no-NO',
  da: 'da-DK',
  fi: 'fi-FI',
  hu: 'hu-HU',
  cs: 'cs-CZ',
  sk: 'sk-SK',
  ro: 'ro-RO',
  bg: 'bg-BG',
  hr: 'hr-HR',
  sr: 'sr-RS',
  sl: 'sl-SI',
  et: 'et-EE',
  lv: 'lv-LV',
  lt: 'lt-LT',
  el: 'el-GR',
  he: 'he-IL',
  th: 'th-TH',
  vi: 'vi-VN',
  id: 'id-ID',
  ms: 'ms-MY',
  tl: 'tl-PH',
  sw: 'sw-KE',
  am: 'am-ET',
  yo: 'yo-NG',
  zu: 'zu-ZA',
  af: 'af-ZA',
  is: 'is-IS',
  mt: 'mt-MT',
  mk: 'mk-MK',
  sq: 'sq-AL',
  eu: 'eu-ES',
  gl: 'gl-ES',
  cy: 'cy-GB',
} as const;

// Supported language codes (ISO 639-1) - derived from PRIMARY_LOCALES
export const SUPPORTED_LANG_CODES = Object.keys(PRIMARY_LOCALES) as readonly string[];
