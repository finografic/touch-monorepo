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

  // Get the admin route entry for the current path
  const currentRouteEntry = getAdminEntryByPath(location.pathname);

  // ======================================================================== //

  if (location.pathname === '/admin') {
    return <Outlet />;
  }

  if (user && isAuthenticated) {
    if (currentRouteEntry && currentRouteEntry.element.admin) {
      return <currentRouteEntry.element.admin />;
    }

    if (currentRouteEntry && currentRouteEntry.element.public) {
      return <currentRouteEntry.element.public />;
    }

    return <Navigate to="/admin" />;
  }

  // Handle unauthenticated users
  if (!isAuthenticated) {
    if (currentRouteEntry && currentRouteEntry.element.public) {
      return <currentRouteEntry.element.public />;
    }

    return <Navigate to="/admin" />;
  }

  // Fallback (should not reach here)
  return <UnauthorizedPage />;
};
