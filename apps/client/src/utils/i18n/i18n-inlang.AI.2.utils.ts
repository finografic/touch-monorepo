import type { AdminRouteEntry, AuthRoles } from 'admin/config/admin.routes.map';
import { snakeCase } from 'change-case';
import { m } from 'i18n/messages';

type MessageKey = keyof typeof m;
// export function getText<K extends MessageKey>(key: K): string {
//   return m[key]();
// }

// usage ✅ still gets Sherlock hover hint:
// export const label = getText('admin_dashboard_title_public');

/**
 * Resolve the current role label from auth booleans.
 * Simplified to only support 'public' and 'admin' roles.
 */
export function resolveRole(isAuthenticated: boolean, isAdmin: boolean = false): AuthRoles {
  if (isAuthenticated && isAdmin) return 'admin';
  return 'public';
}

// ======================================================================== //
// NEW: 🈂️ inlang/paraglide i18n translations !!

/**
 * Finds the best-matching translation key for a base key + element (+ role).
 * NOTE: returns the KEY, not its translation.
 */
function getMatchedKey(baseKey: string, element: string, role?: AuthRoles): string {
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

type MessageTextsParams =
  | [pageKey: string, segment: string | undefined, elements: string[], role: AuthRoles]
  | [pageKey: string, elements: string[], role: AuthRoles];

export function getMessageTexts(args: MessageTextsParams): Record<string, string> {
  // const [ pageKey, segment, elements, role ] = args
  const pageKey = args.shift() as string;
  const segment = typeof args[0] === 'string' ? (args.shift() as string) : undefined;
  const elements = (args.shift() as string[]) || ([] as string[]);
  const role = args.at(-1) === 'admin' || args.at(-1) === 'public' ? (args.pop() as AuthRoles) : undefined;

  // const [pageKey, segment, elements, role] = args;
  const base = segment ? `admin_${snakeCase(pageKey)}_${segment}` : `admin_${snakeCase(pageKey)}`;

  const result: Record<string, string> = {};

  for (const element of elements) {
    const matchedKey = getMatchedKey(base, element, role);
    const translator = m[matchedKey];

    result[element] = typeof translator === 'function' ? translator({ element, role }) : matchedKey;
  }

  return result;
}

// ======================================================================== //

export function getMessageTexts__ORIG(
  pageKey: string,
  segment: string | undefined,
  elements: string[],
  role: AuthRoles,
): Record<string, string> {
  const base = segment ? `admin_${snakeCase(pageKey)}_${segment}` : `admin_${snakeCase(pageKey)}`;

  const result: Record<string, string> = {};

  for (const element of elements) {
    const matchedKey = getMatchedKey(base, element, role);
    const translator = m[matchedKey];

    result[element] = typeof translator === 'function' ? translator({ element, role }) : matchedKey;
  }

  return result;
}
