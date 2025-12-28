import type { NavItem } from 'types/nav.types';
import type { AdminRouteConfig, AuthRoles } from './admin.routes.map';
import { ADMIN_ROUTE_CONFIGS } from './admin.routes.map';

/**
 * Routes accessible for a given role
 */
export const getAdminRoutesByRole = (role: AuthRoles = 'public'): AdminRouteConfig[] => {
  return ADMIN_ROUTE_CONFIGS.filter((route) => route.element[role] !== null);
};

/**
 * Navigation items for the admin navbar
 */
export const getAdminNavItemsByRole = (role: AuthRoles = 'public'): NavItem[] => {
  return ADMIN_ROUTE_CONFIGS.filter((route) => route.hasNav?.[role]).map((route) => {
    // Grouped nav item (dropdown)
    if (route.children?.length) {
      const children: NavItem[] = route.children
        .filter((child) => Boolean(child.path))
        .map((child) => ({
          id: child.id,
          path: child.path!,
          label: child.id, // translated later
        }));

      return {
        id: route.id,
        path: route.path ?? children[0]?.path ?? '',
        label: route.id, // translated later (GROUP LABEL)
        icon: route.icon,
        children,
      };
    }

    // Flat nav item
    return {
      id: route.id,
      path: route.path ?? '',
      label: route.id, // translated later
      icon: route.icon,
    };
  });
};

/**
 * Dashboard cards visible for a given role
 */
export const getAdminDashboardCards = (role: AuthRoles = 'public'): AdminRouteConfig[] => {
  return getAdminRoutesByRole(role).filter((route) => route.hasCard?.[role]);
};

/**
 * Route lookup for guards / rendering
 */
export const getAdminRouteByPath = (path: string): AdminRouteConfig | undefined => {
  return findRouteByPathRecursive(ADMIN_ROUTE_CONFIGS, path);
};

const findRouteByPathRecursive = (routes: AdminRouteConfig[], path: string): AdminRouteConfig | undefined => {
  for (const route of routes) {
    if (route.path === path) return route;

    if (route.children) {
      const match = findRouteByPathRecursive(route.children, path);
      if (match) return match;
    }
  }
  return undefined;
};
