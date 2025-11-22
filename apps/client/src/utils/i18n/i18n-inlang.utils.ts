import type { AuthRoles } from 'admin/config/admin.routes.map';
import { snakeCase } from 'change-case';
import { m } from 'i18n/messages';

type MessageKey = keyof typeof m;

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

export function getNavItemText(role: AuthRoles = 'public', pageKey: string) {
  const baseKey = `admin_${snakeCase(pageKey)}`;

  // 1. 🏆 Try first to get by `title` element directly (with selectors)
  if (typeof m[baseKey] === 'function') {
    return m[baseKey]({ element: 'title', role });
  }

  // 2. 🥈 Next, cycle through prefixes, find match for existing key
  const prefixes = [
    `${baseKey}_card_${role}`,
    `${baseKey}_card_public`,
    `${baseKey}_card`,
    `${baseKey}`, // page root (no selectors)
  ];

  const prefixMatch = prefixes.find((prefix) => m[`${prefix}_title`]);

  if (prefixMatch) {
    // 🎯 Match found, return translation !!
    return m[`${prefixMatch}_title`]();
  }

  console.warn(`⚠️ Missing translation for ${baseKey}`);
  return baseKey;
}

// ======================================================================== //

export function getCalloutText(role: AuthRoles = 'public', pageKey: string) {
  const baseKey = `admin_${snakeCase(pageKey)}`;
  const prefixes = [
    `${baseKey}_card_${role}`,
    `${baseKey}_card_public`,
    `${baseKey}_card`,
    `${baseKey}`, // page root (no selectors)
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
