import type { AdminRouteEntry, AuthRoles } from './admin.routes.map';
import { ADMIN_ENTRIES } from './admin.routes.map';

interface AuthRoleParams {
  isAuthenticated: boolean;
  role: AuthRoles;
}

/**
 * Get all admin entries filtered by authentication status and role
 * @param isAuthenticated - Whether the user is authenticated
 * @param role - Optional role filter (defaults to 'public')
 */
export function getAdminEntries(isAuthenticated: boolean, role?: AuthRoles): AdminRouteEntry[] {
  const userRole = role || 'public';

  return ADMIN_ENTRIES.filter((entry) => {
    // If entry has a component for the user's role, include it
    return entry.element[userRole] !== null;
  });
}

/**
 * @deprecated Use getAdminEntries instead
 */
export function getAdminEntriesForAuth(isAuthenticated: boolean): AdminRouteEntry[] {
  return getAdminEntries(isAuthenticated);
}

/**
 * NAVIGATION ITEMS for the admin navbar
 */
export function getAdminNavItems(isAuthenticated: boolean, role?: AuthRoles) {
  const userRole = role || 'public';

  return getAdminEntriesForAuth(isAuthenticated)
    .filter((entry) => entry.hasNav?.[userRole] === true)
    .map((entry) => ({
      key: entry.key,
      label: entry.key, // Will be resolved from translations at render time
      icon: entry.icon!,
      path: entry.path,
    }));
}

/**
 * Get dashboard cards filtered by authentication status and role
 * @param isAuthenticated - Whether the user is authenticated
 * @param role - Optional user role (defaults to 'public')
 */
export function getAdminDashboardCards(isAuthenticated: boolean, role?: AuthRoles): AdminRouteEntry[] {
  const userRole = role || 'public';

  return getAdminEntries(isAuthenticated, userRole).filter((entry) => {
    // Show cards that are explicitly enabled for the user role
    return entry.hasCard?.[userRole] === true;
  });
}

/**
 * Get admin route entry by path for route protection logic
 */
export function getAdminEntryByPath(path: string): AdminRouteEntry | undefined {
  return ADMIN_ENTRIES.find((entry) => entry.path === path);
}
