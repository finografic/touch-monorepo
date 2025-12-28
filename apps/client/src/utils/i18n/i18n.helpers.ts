import type { TFunction } from 'i18next';
import type { AuthRoles } from 'admin/config/admin.routes.map';
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
 * Builds role-aware and base page translation keys.
 *
 * Example:
 *  admin.pages.languages.title
 * → admin.pages.languages_public.title
 * → admin.pages.languages.title
 */
export const resolvePageKeys = ({
  key,
  role = 'public',
}: {
  key: string;
  role?: AuthRoles;
}): { roleKey: string; baseKey: string } | null => {
  if (!key.includes('.pages.')) return null;

  const roleKey = key.replace(/\.pages\.([^.\s]+)/, `.pages.$1_${role}`);

  return {
    roleKey,
    baseKey: key,
  };
};

/**
 * Translates a page key with role-based fallback.
 * Guarantees that raw keys are never shown unless explicitly desired.
 */
export const translatePageKey = ({
  t,
  key,
  role = 'public',
}: {
  t: TFunction;
  key: string;
  role?: AuthRoles;
}): string => {
  const resolved = resolvePageKeys({ key, role });

  if (!resolved) {
    return t(key, { defaultValue: key });
  }

  const { roleKey, baseKey } = resolved;

  // Try role-specific → base → empty string fallback
  const translated = t(roleKey, { defaultValue: '' }) || t(baseKey, { defaultValue: '' });

  return translated || '';
};
