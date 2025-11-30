import type { AuthRoles } from 'admin/config/admin.routes.map';
import { snakeCase } from 'change-case';
import { getMatchedKey } from './i18n-inlang.AI.4.utils';
import { m } from 'i18n/messages';

// ======================================================================== //
// NEW: 🈂️ inlang/paraglide i18n translations !!

/**
 * Resolve the current role label from auth booleans.
 * Simplified to only support 'public' and 'admin' roles.
 */
export function resolveRole(isAuthenticated: boolean, isAdmin: boolean = false): AuthRoles {
  if (isAuthenticated && isAdmin) return 'admin';
  return 'public';
}

/**
 * Helper function to get a single message text for a given element
 */
function getMatchedKey__LOCAL(baseKey: string, element: string, role?: AuthRoles): string {
  // 1.a 🏆 Try first to get by element directly (with selectors)
  if (typeof m[baseKey] === 'function' && role) {
    return role ? m[baseKey]({ element, role }) : m[baseKey]({ element });
  }

  // 1.b 🏆 Try first to get by element directly (with selectors)
  if (typeof m[baseKey] === 'function') {
    return m[baseKey]({ element });
  }

  // 2. 🥈 Next, cycle through prefixes, find match for existing key
  const matchedKey = [
    `${baseKey}_${role}_${element}`,
    `${baseKey}_${element}_${role}`,
    `${baseKey}_public_${element}`,
    `${baseKey}_${element}_public`,
    `${baseKey}_${element}`,
    `${baseKey}`, // page root (no selectors)
  ].find((key) => m[key]);

  if (matchedKey) {
    return matchedKey;
  }

  console.warn(`⚠️ Missing translation for ${baseKey} with element ${element}`);
  return `${baseKey}_${element}`;
}

/**
 * Get message text for a single element or root page.
 * Can be used for root searches (no element) or root + element searches.
 *
 * @param role - The current user's role used for scoped translations
 * @param pageKey - The base page identifier (e.g. "dashboard")
 * @param element - Optional element name (e.g. "title"). If omitted, searches for root page translation.
 * @returns Translation string for the element, or pageKey if not found
 *
 * @example
 * // With element
 * getMessageText('admin', 'dashboard', 'title')
 * // Returns: "Admin Dashboard"
 *
 * @example
 * // Root search (no element)
 * getMessageText('admin', 'dashboard')
 * // Returns: root translation or "admin_dashboard"
 */
export function getMessageText(pageKey: string, element?: string, role?: AuthRoles): string {
  const baseKey = `admin_${snakeCase(pageKey)}`;

  if (element) {
    const matchedKey = getMatchedKey(baseKey, element, role);
    if (m[matchedKey]) return m[matchedKey]();
  }

  if (typeof m[baseKey] === 'function') {
    return m[baseKey]({ role });
  }

  const matchedKey = [`${baseKey}_${role}`, `${baseKey}_public`, `${baseKey}`].find((key) => m[key]);

  if (matchedKey) {
    return m[matchedKey]();
  }

  return baseKey;
}

/**
 * Get message texts for multiple elements.
 * Returns an object with element names as keys and translations as values.
 *
 * @param role - The current user's role used for scoped translations
 * @param pageKey - The base page identifier (e.g. "dashboard")
 * @param elements - Array of element names (e.g. ["title", "description"])
 * @returns Object with element names as keys and translations as values
 *
 * @example
 * getMessageTexts('admin', 'dashboard', ['title', 'description'])
 * // Returns: { title: "Admin Dashboard", description: "Control panel" }
 */
export function getMessageTexts(
  pageKey: string,
  elements: string[],
  role?: AuthRoles,
): Record<string, string> {
  const baseKey = `admin_${snakeCase(pageKey)}`;
  const result: Record<string, string> = {};

  for (const element of elements) {
    result[element] = getMatchedKey(baseKey, element, role);
  }

  return result;
}
