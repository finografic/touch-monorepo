import type { ISO639_1Code, ISO639_2Code } from './iso-codes.types';
import { LANG_CODE_MAPPING } from './language-mapping.contants';
import { SUPPORTED_LANG_CODES, SUPPORTED_LOCALES } from '../constants/app-locales.constants';

/**
 * Get 2-character language code from 3-character code
 * @param code3 - 3-character language code (ISO 639-2)
 * @returns 2-character language code (ISO 639-1) or undefined if not found
 */
export function get2CharCode(code3: string): string | undefined {
  return LANG_CODE_MAPPING[code3 as ISO639_2Code];
}

/**
 * Get all supported 3-character language codes
 * @returns Array of all supported 3-character codes
 */
export function getAllSupported3CharCodes(): ISO639_2Code[] {
  return Object.keys(LANG_CODE_MAPPING) as ISO639_2Code[];
}

/**
 * Get all supported 2-character language codes
 * @returns Array of all supported 2-character codes (unique)
 */
export function getAllSupported2CharCodes(): ISO639_1Code[] {
  const codes = Object.values(LANG_CODE_MAPPING);
  return [...new Set(codes)] as ISO639_1Code[];
}

/**
 * Check if a 3-character language code is supported
 * @param code3 - 3-character language code to check
 * @returns true if supported, false otherwise
 */
export function isSupported3CharCode(code3: string): code3 is ISO639_2Code {
  return code3 in LANG_CODE_MAPPING;
}

/**
 * Check if a 2-character language code is supported
 * @param code2 - 2-character language code to check
 * @returns true if supported, false otherwise
 */
export function isSupported2CharCode(code2: string): code2 is ISO639_1Code {
  return Object.values(LANG_CODE_MAPPING).includes(code2 as ISO639_1Code);
}

/**
 * App-specific validation functions
 */

/**
 * Check if a language code is supported by the application
 * @param code - Language code to check
 * @returns true if supported, false otherwise
 */
export function isValidLangCode(code: string): boolean {
  return (SUPPORTED_LANG_CODES as readonly string[]).includes(code);
}

/**
 * Check if a locale is supported by the application
 * @param locale - Locale to check
 * @returns true if supported, false otherwise
 */
export function isValidLocale(locale: string): boolean {
  return (SUPPORTED_LOCALES as readonly string[]).includes(locale);
}
