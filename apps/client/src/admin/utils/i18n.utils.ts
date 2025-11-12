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
