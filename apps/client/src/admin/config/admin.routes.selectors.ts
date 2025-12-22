import type { AdminRouteEntry, AuthRoles } from './admin.routes.map';
import { ADMIN_ENTRIES } from './admin.routes.map';
import type { NavItem } from 'types/nav.types';

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
 * Handles both flat routes and grouped routes (with children)
 */
export function gerAdminNavItemsByRole(role: AuthRoles = 'public'): NavItem[] {
  return ADMIN_ENTRIES.filter((entry) => entry.hasNav?.[role] === true).flatMap((entry) => {
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
export function getAdminDashboardCards(isAuthenticated: boolean, role?: AuthRoles): AdminRouteEntry[] {
  const userRole = role || 'public';

  return getAdminEntries(isAuthenticated, userRole).filter((entry) => {
    // Show cards that are explicitly enabled for the user role
    return entry.hasCard?.[userRole] === true;
  });
}

/**
 * Recursively search for an admin route entry by path (including children)
 */
function findEntryByPath(entries: AdminRouteEntry[], path: string): AdminRouteEntry | undefined {
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
export function getAdminEntryByPath(path: string): AdminRouteEntry | undefined {
  return findEntryByPath(ADMIN_ENTRIES, path);
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
 * Recursively flatten all route paths from entries and their children
 */
function flattenRoutePaths(entries: AdminRouteEntry[]): string[] {
  return entries.flatMap((entry) => {
    const paths: string[] = [];
    if (entry.path) {
      paths.push(entry.path);
    }
    if (entry.children) {
      paths.push(...flattenRoutePaths(entry.children));
    }
    return paths;
  });
}

/**
 * Get all admin route paths that require admin authentication
 * (paths where public: null and admin: Component)
 * Now searches recursively through children
 */
export function getProtectedAdminRoutes(): string[] {
  function getProtectedPaths(entries: AdminRouteEntry[]): string[] {
    return entries.flatMap((entry) => {
      const paths: string[] = [];

      // Check if this entry is protected
      if (entry.path && entry.element.public === null && entry.element.admin !== null) {
        paths.push(entry.path);
      }

      // Recursively check children
      if (entry.children) {
        paths.push(...getProtectedPaths(entry.children));
      }

      return paths;
    });
  }

  return getProtectedPaths(ADMIN_ENTRIES);
}

/**
 * Helper function to get route config with namespace and groups for TranslationsPage
 * Useful for generating routes.tsx or for programmatic route access
 */
export function getRouteConfigByPath(path: string): {
  namespace?: 'ui' | 'app' | 'admin';
  groups?: string[];
} | null {
  const entry = getAdminEntryByPath(path);
  if (!entry) return null;

  return {
    namespace: entry.namespace,
    groups: entry.groups,
  };
}
