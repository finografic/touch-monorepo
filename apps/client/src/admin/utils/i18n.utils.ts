import type { AdminRouteEntry, AuthRoles } from 'admin/config/admin.routes.map';
import type { TFunction } from 'i18next';

/**
 * Resolve the current role label from auth booleans.
 * Simplified to only support 'public' and 'admin' roles.
 */
export function resolveRole(isAuthenticated: boolean, isAdmin: boolean = false): AuthRoles {
  if (isAuthenticated && isAdmin) return 'admin';
  return 'public';
}

/**
 * Get navigation label for a given page key.
 * Uses admin.pages.{key}.title as the source of truth.
 */
export function getNavLabel(t: TFunction, pageKey: string): string {
  return t(`admin.pages.${pageKey}.title`, { defaultValue: pageKey });
}

/**
 * Get callout title/description for a given role and page key.
 *
 * Order of resolution (with graceful fallbacks):
 * 1) admin.pages.{key}.card_{role}.title|description (role-specific override)
 * 2) admin.pages.{key}.title|description (defaults/source of truth)
 * 3) '' (empty string)
 */
export function getCalloutText__V1(
  t: TFunction,
  role: AuthRoles,
  pageKey: string,
): { title: string; description: string } {
  const title = t([`admin.pages.${pageKey}.card_${role}.title`, `admin.pages.${pageKey}.title`], {
    defaultValue: '',
  });

  const description = t(
    [`admin.pages.${pageKey}.card_${role}.description`, `admin.pages.${pageKey}.description`],
    { defaultValue: '' },
  );

  return { title, description };
}

/**
 * Convenience helper: given a route entry and role, return the callout
 * content if the role has an element; otherwise return null.
 * This ensures we only generate callouts for routes the role can access.
 */
export function getCalloutForEntry(
  t: TFunction,
  role: AuthRoles,
  entry: AdminRouteEntry,
): { key: string; title: string; description: string; path: string } | null {
  const elementForRole = entry.element?.[role] ?? null;
  if (!elementForRole) return null;

  const { title, description } = getCalloutText__V1(t, role, entry.key);
  return { key: entry.key, title, description, path: entry.path };
}
