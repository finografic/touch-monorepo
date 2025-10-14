import React from 'react';
import { useAuth } from 'providers/AuthProvider';
import { AdminDashboardPage } from '../../admin/pages/AdminDashboardPage';
import { AdminDashboardBasicPage } from '../../admin/pages/AdminDashboardBasicPage';

/**
 * Dashboard-specific wrapper for the main admin dashboard
 *
 * Handles authentication-based rendering for the /admin root route:
 * - Authenticated users: Renders AdminPage (full dashboard)
 * - Non-authenticated users: Renders AdminBasicPage (dashboard cards)
 *
 * Prevents infinite loops by being specific to the dashboard route.
 */
export const AdminDashboardWrapper: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  // Show authenticated version
  if (user && isAuthenticated) {
    return <AdminDashboardPage />;
  }

  // Show unauthenticated version (dashboard cards)
  return <AdminDashboardBasicPage />;
};
