import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from 'providers/AuthProvider';
import { getAdminEntryByPath } from 'config/routes/admin.routes.selectors';
import { AdminBasicPage } from 'pages/AdminPages/AdminBasicPage';

interface ProtectedRouteWrapperProps {
  /** The fallback component to render when no specific role component exists */
  children: React.ReactNode;
}

/**
 * Protected Route Wrapper with Role-Based Component Selection
 *
 * Uses ADMIN_ENTRIES to determine which component to render based on user role:
 * - If user has a specific role component defined in ADMIN_ENTRIES: Renders that component
 * - If no specific role component exists: Renders children (fallback)
 * - If user is unauthenticated: Renders AdminBasicPage (dashboard cards)
 *
 * @param children - Fallback component to render when no specific role component exists
 */
export const ProtectedRouteWrapper: React.FC<ProtectedRouteWrapperProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // Get current route entry to check for role-specific components
  const currentRouteEntry = getAdminEntryByPath(location.pathname);

  // Handle unauthenticated users
  if (!isAuthenticated) {
    // Special case: /admin root path - show dashboard cards
    if (location.pathname === '/admin') {
      return <AdminBasicPage />;
    }

    // Check if current route has a public component
    if (currentRouteEntry && currentRouteEntry.element.auth) {
      // Render the auth component for unauthenticated users (public access)
      return React.createElement(currentRouteEntry.element.auth);
    }

    // No public component available - show dashboard cards
    return <AdminBasicPage />;
  }

  // Handle authenticated users
  if (isAuthenticated) {
    // Check if current route has a specific component for the user's role
    if (currentRouteEntry) {
      // For now, we'll use 'auth' role for authenticated users
      // In the future, this could be extended to check actual user roles
      const roleComponent = currentRouteEntry.element.auth;

      if (roleComponent) {
        // Render the specific role component
        return React.createElement(roleComponent);
      }
    }

    // No specific role component exists - render children (fallback)
    return <>{children}</>;
  }

  // Fallback (should not reach here)
  return <AdminBasicPage />;
};
