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
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // Helper function to extract base path from dynamic routes
  const getBasePath = (pathname: string): string => {
    // Handle dynamic routes like /admin/items/123 or /admin/items/cmgzcttyr0001y7lwsmcow4xt -> /admin/items
    // But NOT /admin/items/new (which is a static route)
    const pathSegments = pathname.split('/');

    // Check if this looks like a dynamic route (has a segment that could be an ID)
    // We check for patterns that look like IDs: numeric, UUID-like, or long alphanumeric strings
    if (pathSegments.length >= 4 && pathSegments[3]) {
      const lastSegment = pathSegments[3];

      // Skip if it's a static route like "new"
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

  // Get the base path for route matching
  const basePath = getBasePath(location.pathname);

  // Get the admin route entry for the base path
  const currentRouteEntry = getAdminEntryByPath(basePath);

  // ======================================================================== //

  if (location.pathname === '/admin') {
    return <Outlet />;
  }

  // ======================================================================== //

  // Handle authenticated users
  if (user && isAuthenticated) {
    // Check if route is accessible for user role
    if (currentRouteEntry && currentRouteEntry.element.admin) {
      // ✅ Let React Router handle the actual route rendering
      return <Outlet />;
    }

    if (currentRouteEntry && currentRouteEntry.element.public) {
      // ✅ Let React Router handle the actual route rendering
      return <Outlet />;
    }

    return <Navigate to="/admin" />;
  }

  // Handle unauthenticated users
  if (!isAuthenticated) {
    if (currentRouteEntry && currentRouteEntry.element.public) {
      // ✅ Let React Router handle the actual route rendering
      return <Outlet />;
    }

    return <Navigate to="/admin" />;
  }

  // Fallback (should not reach here)
  return <UnauthorizedPage />;
};
