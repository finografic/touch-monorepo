export const EMPTY_ROW_PLACEHOLDER = '--';

export const DEFAULT_SHOW_KEY_COLUMN = true; // TranslationsPage: visible by default
export const DEFAULT_SHOW_KEY_COLUMN_PRODUCT = true; // TranslationsProductPage

/** Returns true for the pages group and its role-split variants. */
export function isPagesTableGroup(group: string): boolean {
  return group === 'pages' || group === 'pages_admin' || group === 'pages_public';
}

/**
 * Returns true when every non-empty language value in the row is non-translatable:
 * - `'#'` (symbol placeholder)
 * - contains `'{{'` (i18n interpolation, not editable)
 */
export function isTranslationRowBlocked(
  item: Record<string, any>,
  languageKeys: string[],
): boolean {
  const values = languageKeys.map((k) => item[k] ?? '').filter(Boolean);
  if (values.length === 0) return false;
  return values.every((v) => {
    const stringValue = String(v);
    return stringValue === '#' || stringValue.includes('{{');
  });
}
