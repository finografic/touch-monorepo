import type { TFunction } from 'i18next';
import type { AdminRouteEntry, AuthRoles } from 'config/routes/admin.routes.map';

/**
 * Resolve the current role label from auth booleans.
 * If you have a richer role model, replace this with your own mapper.
 */
export function resolveRole(isAuthenticated: boolean, isAdmin: boolean = false): AuthRoles {
  if (isAuthenticated && isAdmin) return 'admin';
  if (isAuthenticated) return 'auth';
  return 'public';
}

/**
 * Get callout title/description for a given role and page key.
 *
 * Order of resolution (with graceful fallbacks):
 * 1) admin.callouts.{role}.{key}.title|description
 * 2) admin.pages.{key}.title|description (defaults/source of truth)
 * 3) '' (empty string)
 */
export function getCalloutText(
  t: TFunction,
  role: AuthRoles,
  pageKey: string,
): { title: string; description: string } {
  const title = t([`admin.callouts.${role}.${pageKey}.title`, `admin.pages.${pageKey}.title`], {
    defaultValue: '',
  });

  const description = t(
    [`admin.callouts.${role}.${pageKey}.description`, `admin.pages.${pageKey}.description`],
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

  const { title, description } = getCalloutText(t, role, entry.key);
  return { key: entry.key, title, description, path: entry.path };
}
