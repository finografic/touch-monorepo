import type { AdminRouteEntry, AuthRoles } from 'admin/config/admin.routes.map';
import { snakeCase } from 'change-case';
import { m } from 'i18n/messages';
import type { TFunction } from 'i18next';

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
 * Get callout title/description for a given role and page key.
 *
 * Retrieves localized callout text (title and description) for an admin page.
 * Searches translation keys in descending specificity, falling back through
 * role-, card-, and page-level variants until a match is found.
 *
 * Order of resolution (with graceful fallbacks):
 * 1) admin.pages.{key}.card_{role}.title|description (role-specific override)
 * 2) admin.pages.{key}.title|description (defaults/source of truth)
 * 3) '' (empty string)
 *
 * @param {AuthRoles} role - The current user's role used for scoped translations.
 * @param {string} pageKey - The base page identifier (e.g. "maintenance").
 * @returns {{ title: string; description: string }} Localized title and description pair.
 */

export function getNavItemText(role: AuthRoles = 'public', pageKey: string) {
  log('getNavItemText', 'red', role, pageKey);
  const baseKey = `admin_${snakeCase(pageKey)}`;
  const prefixes = [
    // NOTE: use dashboard 'card' to avoid repetition
    `${baseKey}_card_${role}`, // most specific
    `${baseKey}_card_public`, // fallback to public card
    `${baseKey}_card`, // generic card
    `${baseKey}`, // page-level
  ];

  const prefixMatch = prefixes.find((prefix) => m[`${prefix}_title`]);

  // 🎯 if nothing matches, return defaults
  if (!prefixMatch) {
    return `⚠️ Missing translation for ${baseKey}`;
  }

  return m[`${prefixMatch}_title`]();
}

export function getCalloutText(role: AuthRoles = 'public', pageKey: string) {
  const baseKey = `admin_${snakeCase(pageKey)}`;
  const prefixes = [
    `${baseKey}_card_${role}`, // most specific
    `${baseKey}_card_public`, // fallback to public card
    `${baseKey}_card`, // generic card
    `${baseKey}`, // page-level
  ];

  // 🧠 helper to find first prefix that actually exists
  const findExistingPrefix = () => {
    for (const prefix of prefixes) {
      if (m[`${prefix}_title`] && m[`${prefix}_description`]) {
        return prefix;
      }
    }
    return undefined;
  };

  const prefixMatch = findExistingPrefix();

  // 🎯 if nothing matches, return defaults
  if (!prefixMatch) {
    return {
      title: `⚠️ Missing translation for ${baseKey}`,
      description: '',
    };
  }

  return {
    title: m[`${prefixMatch}_title`](),
    description: m[`${prefixMatch}_description`](),
  };
}
