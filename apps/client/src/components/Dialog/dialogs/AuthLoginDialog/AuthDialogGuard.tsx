import React, { type FC, useMemo } from 'react';

import { AuthLoginDialog } from 'components/Dialog/dialogs/AuthLoginDialog/AuthLoginDialog';
import { useAuth } from 'providers/AuthProvider/AuthContext';

interface AuthDialogGuardProps {
  children?: React.ReactNode | React.ReactElement;
}

export const AuthDialogGuard: FC<AuthDialogGuardProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const deferToLogin = useMemo(
    () => location.pathname.includes('/admin') && !isAuthenticated,
    [location.pathname, isAuthenticated],
  );

  if (deferToLogin) {
    return <AuthLoginDialog />;
  }

  return <>{children}</>;
};
