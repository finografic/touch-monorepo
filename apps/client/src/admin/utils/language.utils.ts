import { slugify } from 'utils/string.utils';

export const languagesCodeToKey = (code: string) =>
  code
    .toLowerCase()
    .replace('-', ' ')
    .replace(/\s+(.)/g, (_, c) => c.toUpperCase());

/* ============================================================
   INLINE UTILS (can be extracted later)
   ============================================================ */

// slug regeneration with priority order
export const regenerateSlug = (values: Record<string, string>, preferredOrder: string[]) => {
  for (const lang of preferredOrder) {
    const val = values[lang];
    if (val?.trim()) {
      return slugify(val);
    }
  }
  return '';
};
