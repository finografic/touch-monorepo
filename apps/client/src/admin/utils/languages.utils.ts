import type { RegionLocale } from '@workspace/config/i18n.config';

import { slugify } from 'utils/string.utils';
import { camelCase } from 'utils/string-case.utils';

export const languagesCodeToKey = (code: RegionLocale) =>
  code
    .toLowerCase()
    .replace('-', ' ')
    .replace(/\s+(.)/g, (_, c) => c.toUpperCase());

/* ============================================================
   INLINE UTILS (can be extracted later)
   ============================================================ */

// slug regeneration with priority order
export const regenerateSlug = (
  values: Record<RegionLocale, string>,
  languagesPrioritized: RegionLocale[],
) => {
  for (const lang of languagesPrioritized) {
    const value = values[lang]?.trim();
    return value ? slugify(value) : '';
  }
};

export const regenerateSegment = (
  values: Record<RegionLocale, string>,
  languagesPrioritized: RegionLocale[],
) => {
  for (const lang of languagesPrioritized) {
    const value = values[lang]?.trim();
    return value ? camelCase(value) : '';
  }
};

/* ============================================================
   RHF Key Encoding/Decoding
   ============================================================ */

/**
 * Encodes a dot-notation translation key for use in RHF field paths
 * RHF uses dots for nested paths, so we replace them with a safe separator
 */
export const encodeRHFKey = (key: string): string => {
  return key.replace(/\./g, '__DOT__');
};

/**
 * Decodes an RHF-encoded key back to dot-notation
 */
export const decodeRHFKey = (encodedKey: string): string => {
  return encodedKey.replace(/__DOT__/g, '.');
};
