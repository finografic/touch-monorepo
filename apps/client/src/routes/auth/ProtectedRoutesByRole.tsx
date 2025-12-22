import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { getAdminEntryByPath } from 'admin/config/admin.routes.selectors';
import { AdminRouteRenderer } from 'routes/auth/AdminRouteRenderer';

/**
 * Protected Admin Routes - Single wrapper for all admin route access control
 *
 * Handles role-based access using ADMIN_ROUTE_CONFIGS configuration:
 * - Authenticated users: Check if route is accessible for their role
 * - Unauthenticated users: Check if route has public access
 * - Fallback: Show unauthorized page
 */
export const ProtectedRoutesByRole: React.FC = () => {
  const location = useLocation();
  const entry = getAdminEntryByPath(location.pathname);

  // Route not owned by admin config (or deep nested path)
  if (!entry) {
    return <Outlet />;
  }

  return <AdminRouteRenderer entry={entry} />;
};
