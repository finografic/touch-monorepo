import type { AuthRoles } from 'admin/config/admin.routes.map';
import type { TFunction } from 'i18next';

import { I18N_TRANSLATION_DOMAINS } from 'config/app/i18n.config';

interface ResolvePageTranslationKeyParams {
  key: string;
  role?: AuthRoles;
}

interface GetAdminNavItemTextParams {
  t: TFunction;
  key: string;
  role?: AuthRoles;
}

/**
 * Returns a role-aware admin navigation label.
 *
 * Resolution order:
 * 1. pages.{key}_{role}.title
 * 2. pages.{key}.title
 * 3. key (last-resort fallback)
 */
export const getAdminNavItemText = ({ t, key, role = 'public' }: GetAdminNavItemTextParams): string => {
  const roleKey = `pages.${key}_${role}.title`;
  const baseKey = `pages.${key}.title`;

  return t(roleKey, {
    defaultValue: t(baseKey, {
      defaultValue: key,
    }),
  });
};

/**
 * Checks if a string is a valid translation key
 * Valid translation keys:
 * 1. Use dot notation with two or more segments (e.g., "app.pages.title")
 * 2. First segment must be a valid domain (ui, app, admin)
 *
 * @param key - The string to check
 * @returns true if the string is a valid translation key, false otherwise
 *
 * @example
 * isTranslationKey('app.pages.title') // true
 * isTranslationKey('ui.buttons.save') // true
 * isTranslationKey('admin.pages.dashboard') // true
 * isTranslationKey('invalid.key') // false (invalid domain)
 * isTranslationKey('app') // false (only one segment)
 * isTranslationKey('not-a-key') // false (no dots)
 */
export const isTranslationKey = (key: string): boolean => {
  if (!key || typeof key !== 'string') return false;

  // Check if it has dot notation with at least 2 segments
  const segments = key.split('.');
  if (segments.length < 2) return false;

  // Check if first segment is a valid domain
  const firstSegment = segments[0];
  return (I18N_TRANSLATION_DOMAINS as readonly string[]).includes(firstSegment);
};

/**
 * Resolves translation keys for "pages" nodes with role-based fallback logic.
 * Specifically handles keys in the format: {domain}.pages.{pageKey}.{field}
 *
 * Returns keys in priority order for use with i18next's t() function.
 * Priority order:
 * 1. If role is provided: {domain}.pages.{pageKey}_{role}.{field}
 * 2. Base key: {domain}.pages.{pageKey}.{field}
 * 3. If role is 'public' and _public version doesn't exist, base key is used
 *
 * @param params - Object containing the key and optional role
 * @param params.key - The translation key (e.g., "admin.pages.dashboard.title")
 * @param params.role - Optional role ('public' | 'admin'), defaults to 'public'
 * @returns Object with primaryKey and fallbackKey, or null if key format is invalid
 *
 * @example
 * resolvePageTranslationKey({ key: 'admin.pages.dashboard.title', role: 'public' })
 * // Returns: { primaryKey: 'admin.pages.dashboard_public.title', fallbackKey: 'admin.pages.dashboard.title' }
 *
 * resolvePageTranslationKey({ key: 'admin.pages.mode.title', role: 'admin' })
 * // Returns: { primaryKey: 'admin.pages.mode_admin.title', fallbackKey: 'admin.pages.mode.title' }
 *
 * // Usage with t():
 * const { primaryKey, fallbackKey } = resolvePageTranslationKey({ key, role });
 * const translated = t(primaryKey, { defaultValue: t(fallbackKey, { defaultValue: key }) });
 */
export const resolvePageTranslationKey = ({
  key,
  role = 'public',
}: ResolvePageTranslationKeyParams): { primaryKey: string; fallbackKey: string } | null => {
  if (!key || typeof key !== 'string') return null;

  // Must be a valid translation key
  if (!isTranslationKey(key)) return null;

  const segments = key.split('.');

  // Must have format: {domain}.pages.{pageKey}.{...rest}
  if (segments.length < 3 || segments[1] !== 'pages') return null;

  const domain = segments[0];
  const pageKey = segments[2];
  const rest = segments.slice(3).join('.');

  // Build the role-specific key (primary)
  const roleKey = rest ? `${pageKey}_${role}.${rest}` : `${pageKey}_${role}`;
  const primaryKey = `${domain}.pages.${roleKey}`;

  // Build the base key (fallback)
  const fallbackKey = rest ? `${domain}.pages.${pageKey}.${rest}` : `${domain}.pages.${pageKey}`;

  return { primaryKey, fallbackKey };
};

/**
 * Translates a page translation key with role-based fallback.
 * Uses resolvePageTranslationKey to get the keys, then translates using i18next's t() function.
 * Keeps key resolution and translation logic separate.
 *
 * @param params - Object containing the key, t function, and optional role
 * @param params.key - The translation key (e.g., "admin.pages.dashboard.title")
 * @param params.t - The i18next translation function
 * @param params.role - Optional role ('public' | 'admin'), defaults to 'public'
 * @returns The translated string, or the original key if translation fails
 *
 * @example
 * translatePageKey({ key: 'admin.pages.dashboard.title', t, role: 'public' })
 * // Returns translated string or 'admin.pages.dashboard.title' if not found
 */
export const translatePageKey = ({
  key,
  t,
  role = 'public',
}: ResolvePageTranslationKeyParams & { t: TFunction }): string => {
  const resolved = resolvePageTranslationKey({ key, role });

  // If key format is invalid, return original key
  if (!resolved) return key;

  // Use t() with fallback: try primaryKey first, then fallbackKey, then original key
  return t(resolved.primaryKey, {
    defaultValue: t(resolved.fallbackKey, {
      defaultValue: key,
    }),
  });
};
