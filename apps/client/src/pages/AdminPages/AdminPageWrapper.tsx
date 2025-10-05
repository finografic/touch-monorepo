import React from 'react';
import { useAuth } from 'providers/AuthProvider';
import { AdminPage } from './AdminPage';
import { AdminBasicPage } from './AdminBasicPage';

/**
 * Conditional Admin Page Wrapper
 *
 * Shows different admin pages based on authentication status:
 * - Authenticated users: Full AdminPage (CMS/configurator)
 * - Non-authenticated users: AdminBasicPage (basic info)
 */
export const AdminPageWrapper: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  // Show full admin page for authenticated users
  if (user && isAuthenticated) {
    return <AdminPage />;
  }

  // Show basic admin page for non-authenticated users
  return <AdminBasicPage />;
};
