import type { AdminRouteEntry, AuthRoles } from './admin.routes.map';
import { ADMIN_ENTRIES } from './admin.routes.map';

/**
 * ADMIN ENTRIES based on authentication status
 * Uses element.public and element.auth to determine if route should be visible
 */
export function getAdminEntriesForAuth(isAuthenticated: boolean): AdminRouteEntry[] {
  return ADMIN_ENTRIES.filter((entry) => {
    // If user is authenticated, show all routes
    if (isAuthenticated) {
      return true;
    }

    // If user is not authenticated, only show routes that have a public component
    return entry.element.public !== null;
  });
}

/**
 * NAVIGATION ITEMS for the admin navbar
 */
export function getAdminNavItems(isAuthenticated: boolean) {
  return getAdminEntriesForAuth(isAuthenticated)
    .filter((entry) => entry.showInNav)
    .map((entry) => ({
      key: entry.key,
      label: entry.navLabel!,
      icon: entry.navIcon!,
      path: entry.path,
    }));
}

/**
 * DASHBOARD CARDS for the admin dashboard
 */
export function getAdminDashboardCards(isAuthenticated: boolean) {
  return getAdminEntriesForAuth(isAuthenticated)
    .filter((entry) => entry.showOnDashboard)
    .map((entry) => ({
      key: entry.key,
      title: entry.cardTitle!,
      description: isAuthenticated
        ? entry.cardDescription!.auth || entry.cardDescription!.admin
        : entry.cardDescription!.public,
      color: entry.cardColor!,
      path: entry.path,
      icon: entry.navIcon!,
    }));
}

/**
 * Get admin route entry by path for route protection logic
 */
export function getAdminEntryByPath(path: string): AdminRouteEntry | undefined {
  return ADMIN_ENTRIES.find((entry) => entry.path === path);
}
