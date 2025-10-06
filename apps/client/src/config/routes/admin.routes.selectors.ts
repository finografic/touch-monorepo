import type { AdminRouteEntry, Visibility } from './admin.routes.map';
import { ADMIN_ENTRIES } from './admin.routes.map';

/**
 * ADMIN ENTRIES based on authentication status
 */
export function getAdminEntriesForAuth(isAuthenticated: boolean): AdminRouteEntry[] {
  return ADMIN_ENTRIES.filter((entry) => {
    switch (entry.visibility) {
      case 'public':
        return true;
      case 'authenticated':
        return isAuthenticated;
      case 'admin':
        return isAuthenticated; // (can be extended later)
      default:
        return false;
    }
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
      description: entry.cardDescription!,
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
