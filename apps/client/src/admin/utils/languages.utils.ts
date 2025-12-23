import { slugify } from 'utils/string.utils';
import type { RegionLocale } from '@workspace/config/i18n.config';
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
