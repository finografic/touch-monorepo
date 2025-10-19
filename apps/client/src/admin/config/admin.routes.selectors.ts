import type { AdminRouteEntry, AuthRoles } from './admin.routes.map';
import { ADMIN_ENTRIES } from './admin.routes.map';

interface AuthRoleParams {
  isAuthenticated: boolean;
  role: AuthRoles;
}

/**
 * Get all admin entries filtered by authentication status and role
 * @param isAuthenticated - Whether the user is authenticated
 * @param role - Optional role filter (if not provided, uses auth status only)
 */
export function getAdminEntries(isAuthenticated: boolean, role?: AuthRoles): AdminRouteEntry[] {
  return ADMIN_ENTRIES.filter((entry) => {
    // If user is authenticated, show entries that have a component for their role or admin
    if (isAuthenticated) {
      const userRole = role || 'user';
      return entry.element[userRole] !== null || entry.element.admin !== null;
    }

    // If user is not authenticated, only show routes that have a public component
    return entry.element.public !== null;
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
export function getAdminNavItems(isAuthenticated: boolean) {
  return getAdminEntriesForAuth(isAuthenticated)
    .filter((entry) => (isAuthenticated ? entry.hasNav?.user || entry.hasNav?.admin : entry.hasNav?.public))
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
 * @param role - Optional user role (defaults to 'user' if authenticated, 'public' if not)
 */
export function getAdminDashboardCards(isAuthenticated: boolean, role?: AuthRoles): AdminRouteEntry[] {
  const userRole = role || (isAuthenticated ? 'user' : 'public');

  return getAdminEntries(isAuthenticated, userRole).filter((entry) => {
    // Check if this entry should show a card for this role
    return entry.hasCard?.[userRole] || (userRole === 'user' && entry.hasCard?.admin);
  });
}

/**
 * Get admin route entry by path for route protection logic
 */
export function getAdminEntryByPath(path: string): AdminRouteEntry | undefined {
  return ADMIN_ENTRIES.find((entry) => entry.path === path);
}
