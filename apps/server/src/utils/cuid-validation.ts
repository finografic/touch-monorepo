/**
 * Custom CUID validation utility
 * Since @bugsnag/cuid doesn't export isCuid, we implement our own
 */

/**
 * Check if a string is a valid CUID
 * CUID format: c[timestamp][counter][random][fingerprint]
 */
export function isCuid(str: string): boolean {
  if (typeof str !== 'string' || str.length < 7) {
    return false;
  }

  // CUID should start with 'c' (version 1) or 'd' (version 2)
  if (!str.startsWith('c') && !str.startsWith('d')) {
    return false;
  }

  // Basic length check - CUIDs are typically 25 characters
  if (str.length !== 25) {
    return false;
  }

  // Check if it contains only valid characters (base36: 0-9, a-z)
  const validChars = /^[0-9a-z]+$/;
  if (!validChars.test(str)) {
    return false;
  }

  return true;
}
