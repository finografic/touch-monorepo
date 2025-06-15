// Re-export from @workspace/i18n for backward compatibility
export {
  SUPPORTED_LANG_CODES,
  SUPPORTED_LOCALES,
  DEFAULT_LANG_CODE,
  DEFAULT_LOCALE,
  isValidLangCode,
  isValidLocale,
  dateFormats,
  numberFormats,
} from '@workspace/i18n';

// Type aliases for backward compatibility
export type { LangCode, RegionLocale, SupportedLocale } from '@workspace/types';
