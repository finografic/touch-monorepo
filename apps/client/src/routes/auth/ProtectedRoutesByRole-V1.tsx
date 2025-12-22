import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { getAdminEntryByPath } from 'admin/config/admin.routes.selectors';
import { UnauthorizedPage } from 'pages/UnauthorizedPage/UnauthorizedPage';

import { useAuth } from 'providers/AuthProvider';

/**
 * Protected Admin Routes - Single wrapper for all admin route access control
 *
 * Handles role-based access using ADMIN_ENTRIES configuration:
 * - Authenticated users: Check if route is accessible for their role
 * - Unauthenticated users: Check if route has public access
 * - Fallback: Show unauthorized page
 */
export const ProtectedRoutesByRole: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const [isAuthReady, setIsAuthReady] = React.useState(false);

  // Give auth a chance to initialize on mount (for hard refresh scenario)
  React.useEffect(() => {
    // If not loading and we have determined auth state, mark as ready
    if (!isLoading) {
      // Small delay to let auth state settle
      const timer = setTimeout(() => setIsAuthReady(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const getBasePath = (pathname: string): string => {
    // Handle dynamic routes like /admin/items/123 or /admin/items/cmgzcttyr0001y7lwsmcow4xt -> /admin/items
    const pathSegments = pathname.split('/');

    // Check if this looks like a dynamic route (has a segment that could be an ID)
    // We check for patterns that look like IDs: numeric, UUID-like, or long alphanumeric strings
    if (pathSegments.length >= 4 && pathSegments[3]) {
      const lastSegment = pathSegments[3];

      if (lastSegment === 'new') {
        return pathSegments.slice(0, 3).join('/');
      }

      // Check if it's a numeric ID
      if (!Number.isNaN(Number(lastSegment))) {
        return pathSegments.slice(0, 3).join('/');
      }

      // Check if it's a UUID-like or long alphanumeric ID (like cmgzcttyr0001y7lwsmcow4xt)
      if (lastSegment.length > 10 && /^[a-z0-9]+$/i.test(lastSegment)) {
        return pathSegments.slice(0, 3).join('/');
      }
    }

    return pathname;
  };

  if (location.pathname === '/admin') {
    return <Outlet />;
  }

  // ======================================================================== //
  // Wait for auth to initialize before making decisions
  // ======================================================================== //

  if (isLoading || !isAuthReady) {
    // Wait while auth is loading OR while auth state is settling after mount
    return <Outlet />; // Let route render while auth is initializing
  }

  // ======================================================================== //

  const basePath = getBasePath(location.pathname);
  const currentRouteEntry = getAdminEntryByPath(basePath);

  // If route entry not found in config, fall back to Outlet (for nested routes, etc.)
  if (!currentRouteEntry) {
    return <Outlet />;
  }

  // ======================================================================== //
  // Authenticated users: check role-based access
  // ======================================================================== //

  if (user && isAuthenticated) {
    // User has admin access to this route - allow rendering (element from routes.tsx)
    if (currentRouteEntry.element.admin) {
      return <Outlet />;
    }

    // User can access public version of this route - allow rendering
    if (currentRouteEntry.element.public) {
      return <Outlet />;
    }

    // Route not found or user doesn't have access
    return <Navigate to="/admin" replace />;
  }

  // ======================================================================== //
  // Unauthenticated users: check public access only
  // ======================================================================== //

  if (!isAuthenticated) {
    // Public route exists - allow rendering (element from routes.tsx)
    if (currentRouteEntry.element.public) {
      return <Outlet />;
    }

    // Route requires authentication
    return <Navigate to="/admin" replace />;
  }

  // Fallback (should not reach here)
  return <UnauthorizedPage />;
};
