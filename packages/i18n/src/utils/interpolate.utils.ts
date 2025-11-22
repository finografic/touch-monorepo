/**
 * Simple interpolation utility for message strings
 * Replaces {key} patterns with values from params object
 *
 * @example
 * interpolate("Hello {name}!", { name: "World" })
 * // Returns: "Hello World!"
 *
 * @example
 * interpolate("You have {count} items", { count: 5 })
 * // Returns: "You have 5 items"
 */
export function interpolate(message: string, params?: Record<string, string | number>): string {
  if (!params) return message;

  return Object.entries(params).reduce((result, [key, value]) => {
    return result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
  }, message);
}

/**
 * Simple pluralization utility
 * Uses ICU-style plural rules: zero, one, other
 *
 * @example
 * pluralize(0, { zero: 'No items', one: '1 item', other: '{count} items' }, { count: 0 })
 * // Returns: "No items"
 *
 * @example
 * pluralize(1, { one: '1 item', other: '{count} items' })
 * // Returns: "1 item"
 *
 * @example
 * pluralize(5, { one: '1 item', other: '{count} items' }, { count: 5 })
 * // Returns: "5 items"
 */
export function pluralize(
  count: number,
  forms: { zero?: string; one?: string; other: string },
  params?: Record<string, string | number>,
): string {
  let form: string;

  if (count === 0 && forms.zero) {
    form = forms.zero;
  } else if (count === 1 && forms.one) {
    form = forms.one;
  } else {
    form = forms.other;
  }

  return interpolate(form, { count, ...params });
}

/**
 * Format number with locale-specific formatting
 *
 * @example
 * formatNumber(1234.56, 'en-GB')
 * // Returns: "1,234.56"
 *
 * @example
 * formatNumber(1234.56, 'es-ES')
 * // Returns: "1.234,56"
 */
export function formatNumber(value: number, locale: string, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(locale, options).format(value);
}

/**
 * Format date with locale-specific formatting
 *
 * @example
 * formatDate(new Date(), 'en-GB')
 * // Returns: "19/10/2025"
 *
 * @example
 * formatDate(new Date(), 'es-ES', { dateStyle: 'full' })
 * // Returns: "domingo, 19 de octubre de 2025"
 */
export function formatDate(value: Date, locale: string, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat(locale, options).format(value);
}
