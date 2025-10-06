import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from 'providers/AuthProvider';
import { AdminPage } from '../pages/AdminPages/AdminPage';
import { AdminBasicPage } from '../pages/AdminPages/AdminBasicPage';
import { getAdminEntryByPath } from '../config/routes/admin.routes.selectors';

interface AdminRouteWrapperProps {
  /** The protected page component to render when authenticated */
  children: React.ReactNode;
}

/**
 * Generic Conditional Admin Page Wrapper
 *
 * Wraps protected admin pages and handles authentication-based rendering:
 * - Authenticated users: Renders the protected children component
 * - Non-authenticated users:
 *   - For public routes: Renders the protected children component
 *   - For protected routes: Renders AdminBasicPage (dashboard cards)
 *
 * @param children - The protected page component to render when appropriate
 */
export const AdminRouteWrapper: React.FC<AdminRouteWrapperProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // Get current route entry to check visibility
  const currentRouteEntry = getAdminEntryByPath(location.pathname);

  // Show authenticated version
  if (user && isAuthenticated) {
    return <>{children}</>;
  }

  // Handle unauthenticated users
  if (!isAuthenticated) {
    // Special case: /admin root path - show dashboard cards
    if (location.pathname === '/admin') {
      return <AdminBasicPage />;
    }

    // Check if current route is public
    if (currentRouteEntry && currentRouteEntry.visibility === 'public') {
      // Allow access to public routes (e.g., /admin/languages, /admin/sounds)
      return <>{children}</>;
    }

    // Protected route accessed by unauthenticated user - show dashboard cards
    return <AdminBasicPage />;
  }

  // Fallback (should not reach here)
  return <AdminBasicPage />;
};

/**
 * Specific wrapper for the main admin dashboard
 * Maintains backward compatibility with existing usage
 */
export const AdminDashboardWrapper: React.FC = () => {
  return (
    <AdminRouteWrapper>
      <AdminPage />
    </AdminRouteWrapper>
  );
};
