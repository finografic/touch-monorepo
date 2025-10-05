import React from 'react';
import { useAuth } from 'providers/AuthProvider';
import { AdminBasicPage } from 'pages/AdminPages/AdminBasicPage';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedAdminRoute - Protects admin sub-routes
 *
 * Shows admin content only for authenticated users.
 * For non-authenticated users, shows AdminBasicPage instead of redirecting.
 */
export const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  // Show protected content for authenticated users
  if (user && isAuthenticated) {
    return <>{children}</>;
  }

  // Show basic admin page for non-authenticated users
  return <AdminBasicPage />;
};
