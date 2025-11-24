import type { AdminRouteEntry, AuthRoles } from 'admin/config/admin.routes.map';
// import { snakeCase } from 'change-case';
import { m } from 'i18n/messages';
import snakeCase from 'lodash/snakeCase';

function getMatchedKey__V2(baseKey: string, element: string, role?: AuthRoles): string {
  // 1.a 🏆 Try first to get by element directly (with selectors)
  if (typeof m[baseKey] === 'function' && role) {
    return role ? m[baseKey]({ element, role }) : m[baseKey]({ element });
  }

  // 1.b 🏆 Try first to get by element directly (with selectors)
  if (typeof m[baseKey] === 'function') {
    return m[baseKey]({ element });
  }
}
type MessageKey = keyof typeof m;
// export function getText<K extends MessageKey>(key: K): string {
//   return m[key]();
// }

// ======================================================================== //

/**
 * Builds and checks candidate message keys in priority order, returning
 * the first match that exists in `namespaces`.
 *
 * @param namespaces  Record<string, any>   // your inlang project namespaces
 * @param segments    string[]              // ordered highest → lowest priority segments
 * @param element     string | undefined    // optional element selector
 * @param role        string | undefined    // optional role selector
 */
export function getMatchedKey(
  namespaces: Record<string, any>,
  segments: string[],
  element?: string,
  role?: string,
): string | undefined {
  const candidates: string[] = [];

  for (const segment of segments) {
    // Core naming
    const base = segment;

    // Prefer most specific variants → least specific

    if (element && role) candidates.push(`${base}_${element}_${role}`);

    if (element) candidates.push(`${base}_${element}`);

    if (role) candidates.push(`${base}_${role}`);

    // Finally: bare base
    candidates.push(base);
  }

  // Find the first matching key
  return candidates.find((key) => namespaces[key] !== undefined);
}

// ======================================================================== //
// NEW: 🈂️ inlang/paraglide i18n translations !!

/**
 * Finds the best-matching translation key for a base key + element (+ role).
 * NOTE: returns the KEY, not its translation.
 */
function getMatchedKey__V1(baseKey: string, element: string, role?: AuthRoles): string {
  // 1. Prefer selector-style function lookups
  if (typeof m[baseKey] === 'function') {
    try {
      const resultKey = role ? m[baseKey]({ element, role }) : m[baseKey]({ element });

      // m[baseKey](...) returns a key (string)
      if (typeof resultKey === 'string') return resultKey;
    } catch {
      // silently fall through to fallback resolution
    }
  }

  // 2. Fallback to key-pattern matching
  const matchedKey = [
    `${baseKey}_${role}_${element}`,
    `${baseKey}_${element}_${role}`,
    `${baseKey}_public_${element}`,
    `${baseKey}_${element}_public`,
    `${baseKey}_${element}`,
    baseKey,
  ].find((key) => m[key]);

  if (matchedKey) return matchedKey;

  console.warn(`⚠️ Missing translation for ${baseKey} (${element})`);
  return `${baseKey}_${element}`;
}

// ======================================================================== //

export function getMessageText(
  namespaces: Record<string, any>,
  segments: string[],
  element?: string,
  role?: string,
) {
  const matched = getMatchedKey(namespaces, segments, element, role);
  if (!matched) {
    console.warn('Missing translation for:', { segments, element, role });
    return segments[0];
  }

  const fn = namespaces[matched];
  return typeof fn === 'function' ? fn({ element, role }) : fn;
}

export function getMessageText__V1(
  segments: string[],
  elements: string[],
  role: AuthRoles,
): Record<string, string> {
  const base = segments.map(snakeCase).join('_');

  const result: Record<string, string> = {};

  for (const element of elements) {
    const matchedKey = getMatchedKey__V1(base, element, role);
    const translator = m[matchedKey];

    result[element] = typeof translator === 'function' ? translator({ element, role }) : matchedKey;
  }

  return result;
}

/*
export function getNavItemText(pageKey: string, role: AuthRoles = 'public') {
  // selector-based first
  const baseKey = `admin_${snakeCase(pageKey)}`;
  if (typeof m[baseKey] === 'function') {
    const t = m[baseKey]({ element: 'title', role });
    if (typeof t === 'string') return t;
  }

  // now use card segment
  return getMessageTexts(['admin', pageKey, 'card'], ['title'], role).title;
}
  */
