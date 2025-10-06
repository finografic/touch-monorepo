import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from 'providers/AuthProvider';
import { AdminBasicPage } from 'pages/AdminPages/AdminBasicPage';
import { getAdminEntryByPath } from 'config/routes/admin.routes.selectors';

export const ProtectedAdminRoutes: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // Get the admin route entry for the current path
  const currentRouteEntry = getAdminEntryByPath(location.pathname);

  // If user is authenticated, always allow access to all routes
  if (user && isAuthenticated) {
    return <Outlet />;
  }

  // Handle unauthenticated users
  if (!isAuthenticated) {
    // Special case: /admin root path - let AdminPageWrapper handle it
    if (location.pathname === '/admin') {
      return <Outlet />;
    }

    // Check if current route is public (has public component)
    if (currentRouteEntry && currentRouteEntry.element.public) {
      // Allow access to public routes (e.g., /admin/languages, /admin/sounds)
      return <Outlet />;
    }

    // Protected route accessed by unauthenticated user - redirect to /admin
    // This fixes Bug 1: URL mismatch for protected routes
    return <Navigate to="/admin" replace />;
  }

  // Fallback (should not reach here)
  return <AdminBasicPage />;
};
