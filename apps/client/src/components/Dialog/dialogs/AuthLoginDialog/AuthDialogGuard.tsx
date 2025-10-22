import React, { type FC, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { isRouteProtected } from 'admin/config/admin.routes.selectors';
import { AuthLoginDialog } from 'components/Dialog/dialogs/AuthLoginDialog/AuthLoginDialog';
import { useAuth } from 'providers/AuthProvider/AuthContext';

interface AuthDialogGuardProps {
  children?: React.ReactNode | React.ReactElement;
}

/**
 * AuthDialogGuard - Shows login dialog when accessing protected routes
 *
 * Uses dynamic route protection based on admin.routes.map.ts configuration:
 * - Checks if current route is protected for the user's role
 * - Shows login dialog if route is blocked
 * - Allows access if route is accessible for user's role
 */
export const AuthDialogGuard: FC<AuthDialogGuardProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  const deferToLogin = useMemo(() => {
    // Special case: Always allow /admin dashboard (index route)
    if (location.pathname === '/admin') {
      return false;
    }

    // Determine user role (admin if authenticated as admin, otherwise public)
    const userRole = isAuthenticated && user?.role === 'admin' ? 'admin' : 'public';

    // Check if this route is protected for this role
    const protected_ = isRouteProtected(location.pathname, userRole);

    console.log('🔒 AuthDialogGuard:', {
      path: location.pathname,
      userRole,
      isAuthenticated,
      protected: protected_,
    });

    return protected_;
  }, [location.pathname, isAuthenticated, user?.role]);

  if (deferToLogin) {
    return <AuthLoginDialog />;
  }

  return <>{children}</>;
};
