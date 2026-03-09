import React, { useEffect } from 'react';

import { KeypadLoginDialog } from 'providers/AuthProvider/KeypadLoginDialog';
import { LogoutConfirmDialog } from 'providers/AuthProvider/LogoutConfirm';

import { AuthContext, DISPLAY_NAME, useAuth } from './AuthContext';
import type { AuthProviderProps } from './AuthContext.types';

export const AuthProvider = ({ children, initialValue }: AuthProviderProps) => {
  return <AuthContext.Provider initialValue={initialValue}>{children}</AuthContext.Provider>;
};

AuthProvider.displayName = `${DISPLAY_NAME}Provider`;

const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const { refreshSession } = useAuth();

  useEffect(() => {
    refreshSession();

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') refreshSession();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, [refreshSession]);

  return <>{children}</>;
};

export const AuthProviderWithInitialization = ({ children, initialValue }: AuthProviderProps) => {
  return (
    <AuthProvider initialValue={initialValue}>
      <AuthInitializer>
        {children}
        <KeypadLoginDialog />
        <LogoutConfirmDialog />
      </AuthInitializer>
    </AuthProvider>
  );
};
