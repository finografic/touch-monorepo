import type { AuthRoles } from 'admin/config/admin.routes.map';
import { snakeCase } from 'change-case';
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
function getSingleMessageText(baseKey: string, element: string, role?: AuthRoles): string {
  // 1. 🏆 Try first to get by element directly (with selectors)
  if (typeof m[baseKey] === 'function') {
    if (role) {
      return m[baseKey]({ element, role });
    }
    return m[baseKey]({ element });
  }

  // 2. 🥈 Next, cycle through prefixes, find match for existing key
  const combinations = role
    ? [
        `${baseKey}_${role}_${element}`,
        `${baseKey}_${element}_${role}`,
        `${baseKey}_public_${element}`,
        `${baseKey}_${element}_public`,
        `${baseKey}_${element}`,
        `${baseKey}`, // page root (no selectors)
      ]
    : [
        `${baseKey}_${element}`,
        `${baseKey}`, // page root (no selectors)
      ];

  const matchedKey = combinations.find((key) => m[key]);

  if (matchedKey) {
    return m[matchedKey]();
  }

  // console.log(`%c⚠️ Missing translation for ${baseKey} with element ${element}`, 'color: grey;');
  return `${baseKey}_${element}`;
}

/**
 * Helper function to get root page translation (no element)
 */
function getRootMessageText(baseKey: string, role?: AuthRoles): string {
  // 1. 🏆 Try variant function first
  if (typeof m[baseKey] === 'function') {
    if (role) {
      return m[baseKey]({ role });
    }
    return m[baseKey]();
  }

  // 2. 🥈 Try root combinations
  const rootCombinations = role ? [`${baseKey}_${role}`, `${baseKey}_public`, `${baseKey}`] : [`${baseKey}`];

  const matchedKey = rootCombinations.find((key) => m[key]);

  if (matchedKey) {
    return m[matchedKey]();
  }

  // console.log(`%c⚠️ Missing translation for ${baseKey}`, 'color: grey;');
  return baseKey;
}

/**
 * Get message texts for elements or root page.
 * This is the ONLY method for retrieving translations.
 *
 * @param pageKey - The base page identifier (e.g. "dashboard")
 * @param elements - Array of element names. Use empty array `[]` for root search, `['title']` for single, `['title', 'description']` for multiple
 * @param role - Optional role for scoped translations (defaults to 'public')
 * @returns Object with element names as keys and translations as values. For root search with empty array, returns `{ root: "..." }`
 *
 * @example
 * // Root search (no elements)
 * getMessageTexts('dashboard', [], 'admin')
 * // Returns: { root: "Admin Dashboard" }
 *
 * @example
 * // Single element
 * getMessageTexts('dashboard', ['title'], 'admin')
 * // Returns: { title: "Admin Dashboard" }
 *
 * @example
 * // Multiple elements
 * getMessageTexts('dashboard', ['title', 'description'], 'admin')
 * // Returns: { title: "Admin Dashboard", description: "Control panel" }
 */
export function getMessageTexts(
  pageKey: string,
  elements: string[],
  role?: AuthRoles,
): string | Record<string, string> {
  if (!pageKey) {
    // If no pageKey, return empty object or elements with pageKey as fallback
    return elements.length === 0
      ? { root: pageKey || '' }
      : elements.reduce(
          (acc, elem) => {
            acc[elem] = pageKey || '';
            return acc;
          },
          {} as Record<string, string>,
        );
  }

  const baseKey = `admin_${snakeCase(pageKey)}`;

  // Root search (empty elements array)
  if (elements.length === 0) {
    // return {
    //   root: getRootMessageText(baseKey, role),
    // };
    return getRootMessageText(baseKey, role);
  }

  // Single or multiple elements
  const result: Record<string, string> = {};
  for (const element of elements) {
    result[element] = getSingleMessageText(baseKey, element, role);
  }

  return result;
}
