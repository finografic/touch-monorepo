import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { getAdminEntryByPath } from 'admin/config/admin.routes.selectors';
import { UnauthorizedPage } from 'pages/UnauthorizedPage/UnauthorizedPage';
import { useAuth } from 'providers/AuthProvider';

/**
 * Protected Admin Routes - Simple two-tier access control
 *
 * Access levels:
 * - Public: All routes accessible without login (unless marked admin-only)
 * - Admin: Requires admin login for admin-only routes
 *
 * Logic:
 * 1. /admin root path - always allow (shows dashboard)
 * 2. Admin-only routes (element.admin !== null, element.public === null) - require admin login
 * 3. Public routes (element.public !== null) - allow without login
 */
export const ProtectedAdminRoutes: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // Always allow /admin root path (dashboard handles its own display logic)
  if (location.pathname === '/admin') {
    return <Outlet />;
  }

  // Get the admin route entry for the current path
  const currentRouteEntry = getAdminEntryByPath(location.pathname);

  if (!currentRouteEntry) {
    // No route config found - allow access
    return <Outlet />;
  }

  // Check if this is an admin-only route
  const isAdminOnly = currentRouteEntry.element.admin !== null && currentRouteEntry.element.public === null;

  if (isAdminOnly) {
    // Admin-only route - require admin authentication
    if (isAuthenticated && user?.role === 'admin') {
      return <Outlet />;
    }
    return <UnauthorizedPage />;
  }

  // Public route - allow access
  return <Outlet />;
};
