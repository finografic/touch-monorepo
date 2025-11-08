import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { getAdminEntryByPath } from 'admin/config/admin.routes.selectors';
import { UnauthorizedPage } from 'pages/UnauthorizedPage/UnauthorizedPage';

import { useAuth } from 'providers/AuthProvider';

/**
 * Protected Admin Routes - Role-based access control
 *
 * Logic:
 * 1. /admin dashboard - always allow (renders Outlet)
 * 2. Routes with matching config - render based on role (admin > public > redirect)
 * 3. Routes without config - redirect to dashboard
 * 4. Prevents navigation loops by redirecting to dashboard
 */
export const ProtectedRoutesByRole: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // Special case: Dashboard index route always renders (via Outlet)
  if (location.pathname === '/admin') {
    return <Outlet />;
  }

  // Get route configuration from ADMIN_ENTRIES
  const routeConfig = getAdminEntryByPath(location.pathname);

  // No route config found - redirect to dashboard to avoid loops
  if (!routeConfig) {
    return <Navigate to="/admin" replace />;
  }

  // Determine user's role
  const userRole = isAuthenticated && user?.role === 'admin' ? 'admin' : 'public';

  // Get the component for this role
  const ComponentForRole = routeConfig.element[userRole];

  // If component exists for user's role, render it
  if (ComponentForRole) {
    return <ComponentForRole />;
  }

  // No component for this role - route is protected
  // Redirect to dashboard instead of showing error (better UX)
  return <Navigate to="/admin" replace />;
};
