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

  if (isLoading) {
    return null; // or spinner
  }

  const role: 'public' | 'admin' = isAuthenticated ? 'admin' : 'public';
  const routeEntry = getAdminEntryByPath(location.pathname);

  if (!routeEntry) {
    return <Outlet />;
  }

  const Component = routeEntry.element[role];

  // No access at all
  if (!Component) {
    return <Navigate to="/admin" replace />;
  }

  // Render the correct component
  return <Component />;
};
