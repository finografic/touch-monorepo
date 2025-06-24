import type { LANG_CODE_MAPPING } from './language-mapping.contants';

/**
 * COMPREHENSIVE LANGUAGE MAPPING
 *
 * Auto-generated from ISO 639-1 standard data
 * Generated: 2025-06-23T23:03:09.185Z
 *
 * This mapping enables dynamic language support in the i18n system.
 * Maps 3-character language codes (ISO 639-2) to 2-character codes (ISO 639-1).
 *
 * Statistics:
 * - 184 ISO 639-1 languages processed
 * - 204 total mappings created
 * - 20 additional B-variant mappings
 *
 * Usage:
 * ```typescript
 * import { LANG_CODE_MAPPING } from './comprehensive-language-mapping.generated';
 *
 * const twoCharCode = LANG_CODE_MAPPING['spa']; // 'es'
 * const germanCode = LANG_CODE_MAPPING['deu']; // 'de'
 * ```
 *
 * @see https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
 * @see https://en.wikipedia.org/wiki/List_of_ISO_639-2_codes
 */

// Type for 3-character language codes (ISO 639-2)
export type ISO639_2Code = keyof typeof LANG_CODE_MAPPING;

// Type for 2-character language codes (ISO 639-1)
export type ISO639_1Code = (typeof LANG_CODE_MAPPING)[ISO639_2Code];
