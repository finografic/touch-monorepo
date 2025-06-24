/**
 * ISO Codes Module
 *
 * Provides access to ISO standard codes and mappings:
 * - ISO 3166-1 country codes
 * - ISO 639-1/639-2 language code mappings
 * - Utility functions for code conversion and validation
 */

// Country codes (ISO 3166-1)
export { COUNTRY_CODES } from './contry-codes.constants';

// Language mapping (ISO 639-1/639-2)
export { LANG_CODE_MAPPING } from './language-mapping.contants';

// Types
export type { ISO639_1Code, ISO639_2Code } from './iso-codes.types';

// Utility functions
export {
  get2CharCode,
  getAllSupported3CharCodes,
  getAllSupported2CharCodes,
  isSupported3CharCode,
  isSupported2CharCode,
  isValidLangCode,
  isValidLocale,
} from './iso-codes.utils';
