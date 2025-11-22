import type { AdminRouteEntry, AuthRoles } from './admin.routes.map';
import { ADMIN_ENTRIES } from './admin.routes.map';

/**
 * Get all admin entries filtered by authentication status and role
 * @param isAuthenticated - Whether the user is authenticated
 * @param role - Optional role filter (defaults to 'public')
 */
export function getAdminEntries(_isAuthenticated: boolean, role?: AuthRoles): AdminRouteEntry[] {
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
export function getAdminNavItems(role: AuthRoles = 'public') {
  return ADMIN_ENTRIES.filter((entry) => entry.hasNav?.[role] === true).map((entry) => ({
    key: entry.key,
    path: entry.path,
    label: entry.key, // Will be resolved from translations at render time
    icon: entry.icon!,
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

/**
 * Check if a route requires authentication based on user role
 * @param path - The route path to check
 * @param role - The user's role (defaults to 'public' if not authenticated)
 * @returns true if the route is blocked for this role, false if accessible
 */
export function isRouteProtected(path: string, role: AuthRoles = 'public'): boolean {
  const entry = getAdminEntryByPath(path);

  if (!entry) {
    // No route config found - allow access
    return false;
  }

  // Route is protected if the user's role doesn't have a component defined
  return entry.element[role] === null;
}

/**
 * Get all admin route paths that require admin authentication
 * (paths where public: null and admin: Component)
 */
export function getProtectedAdminRoutes(): string[] {
  return ADMIN_ENTRIES.filter((entry) => entry.element.public === null && entry.element.admin !== null).map(
    (entry) => entry.path,
  );
}
