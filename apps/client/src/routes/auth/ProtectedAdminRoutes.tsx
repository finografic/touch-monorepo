import React from 'react';

import { Outlet, useLocation } from 'react-router-dom';

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
export const ProtectedAdminRoutes: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // Get the admin route entry for the current path
  const currentRouteEntry = getAdminEntryByPath(location.pathname);

  // Handle authenticated users
  if (user && isAuthenticated) {
    // Special case: /admin root path - always allow (handled by AdminDashboardPage)
    if (location.pathname === '/admin') {
      return <Outlet />;
    }

    // Check if route is accessible for user role
    if (currentRouteEntry) {
      const userRole = user.role || 'user';
      const hasAccess = currentRouteEntry.element[userRole] !== null;

      if (hasAccess) {
        return <Outlet />; // Allow access
      } else {
        return <UnauthorizedPage />; // Role doesn't have access
      }
    }

    // No specific config, allow access
    return <Outlet />;
  }

  // Handle unauthenticated users
  if (!isAuthenticated) {
    // Special case: /admin root path - always allow (handled by AdminDashboardPage)
    if (location.pathname === '/admin') {
      return <Outlet />;
    }

    // Check if route has public access
    if (currentRouteEntry && currentRouteEntry.element.public !== null) {
      return <Outlet />;
    }

    // No public access - show unauthorized
    return <UnauthorizedPage />;
  }

  // Fallback (should not reach here)
  return <UnauthorizedPage />;
};
