import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from 'providers/AuthProvider';
import { AdminDashboardBasicPage } from 'admin/AdminDashboardBasicPage';
import { getAdminEntryByPath } from 'admin/config/admin.routes.selectors';

export const ProtectedAdminRoutes: React.FC = () => {
  const { user, isAuthenticated, openLoginDialog } = useAuth();
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

    // Protected route accessed by unauthenticated user - trigger login dialog
    // This will show the login dialog while keeping the URL intact
    // When user logs in, they'll be redirected to /admin and can then navigate to desired route
    useEffect(() => {
      openLoginDialog();
    }, [location.pathname]);

    // Show dashboard while login dialog is open
    return <AdminDashboardBasicPage />;
  }

  // Fallback (should not reach here)
  return <AdminDashboardBasicPage />;
};
