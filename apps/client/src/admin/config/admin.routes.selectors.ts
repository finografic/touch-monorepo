import type { AdminRouteConfig, AuthRoles } from './admin.routes.map';
import { ADMIN_ROUTE_CONFIGS } from './admin.routes.map';
import type { NavItem } from 'types/nav.types';

/**
 * Get all admin entries filtered by authentication status and role
 * @param isAuthenticated - Whether the user is authenticated
 * @param role - Optional role filter (defaults to 'public')
 */
export function getAdminEntries(_isAuthenticated: boolean, role?: AuthRoles): AdminRouteConfig[] {
  const userRole = role || 'public';

  return ADMIN_ROUTE_CONFIGS.filter((entry) => {
    // If entry has a component for the user's role, include it
    return entry.element[userRole] !== null;
  });
}

/**
 * NAVIGATION ITEMS for the admin navbar
 * Handles both flat routes and grouped routes (with children)
 */
export function getAdminNavItemsByRole(role: AuthRoles = 'public'): NavItem[] {
  return ADMIN_ROUTE_CONFIGS.filter((entry) => entry.hasNav?.[role] === true).flatMap((entry) => {
    // If entry has children, create a dropdown nav item
    if (entry.children && entry.children.length > 0) {
      // Filter children that should appear in nav (if they have hasNav set)
      // For now, include all children if parent is in nav
      const childNavItems: NavItem[] = entry.children
        .filter((child) => child.path) // Only include children with paths
        .map((child) => ({
          id: child.id,
          path: child.path!,
          label: child.id, // Temporary: will be replaced with translation lookup
        }));

      // Return parent nav item with children
      return [
        {
          id: entry.id,
          path: entry.path || entry.children[0]?.path || '', // Use first child path as default
          label: entry.id, // Temporary: will be replaced with translation lookup
          icon: entry.icon,
          children: childNavItems.length > 0 ? childNavItems : undefined,
        },
      ];
    }

    // Regular flat route
    return [
      {
        id: entry.id,
        path: entry.path || '',
        label: entry.id, // Temporary: will be replaced with translation lookup
        icon: entry.icon,
      },
    ];
  });
}

/**
 * Get dashboard cards filtered by authentication status and role
 * @param isAuthenticated - Whether the user is authenticated
 * @param role - Optional user role (defaults to 'public')
 */
export function getAdminDashboardCards(isAuthenticated: boolean, role?: AuthRoles): AdminRouteConfig[] {
  const userRole = role || 'public';

  return getAdminEntries(isAuthenticated, userRole).filter((entry) => {
    // Show cards that are explicitly enabled for the user role
    return entry.hasCard?.[userRole] === true;
  });
}

/**
 * Recursively search for an admin route entry by path (including children)
 */
function findEntryByPath(entries: AdminRouteConfig[], path: string): AdminRouteConfig | undefined {
  for (const entry of entries) {
    if (entry.path === path) {
      return entry;
    }
    if (entry.children) {
      const found = findEntryByPath(entry.children, path);
      if (found) return found;
    }
  }
  return undefined;
}

/**
 * Get admin route entry by path for route protection logic
 * Now searches recursively through children
 */
export function getAdminEntryByPath(path: string): AdminRouteConfig | undefined {
  return findEntryByPath(ADMIN_ROUTE_CONFIGS, path);
}
