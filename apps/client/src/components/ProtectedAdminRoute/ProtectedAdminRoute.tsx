import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from 'providers/AuthProvider';
import { AdminBasicPage } from 'pages/AdminPages/AdminBasicPage';

export const ProtectedAdminRoute: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  if (user && isAuthenticated) {
    return <Outlet />; // Render nested routes when authenticated
  }

  return <AdminBasicPage />; // Fallback for unauthenticated users
};
