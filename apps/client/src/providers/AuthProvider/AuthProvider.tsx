import React, { useEffect } from 'react';

import { AuthContext, DISPLAY_NAME, useAuth } from './AuthContext';
import type { AuthProviderProps } from './AuthContext.types';
import { AuthLoginDialog } from 'providers/AuthProvider/AuthLoginDialog';

export const AuthProvider = ({ children, initialValue }: AuthProviderProps) => {
  return <AuthContext.Provider initialValue={initialValue}>{children}</AuthContext.Provider>;
};

AuthProvider.displayName = `${DISPLAY_NAME}Provider`;

const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const { refreshSession } = useAuth();

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  return <>{children}</>;
};

export const AuthProviderWithInitialization = ({ children, initialValue }: AuthProviderProps) => {
  return (
    <AuthProvider initialValue={initialValue}>
      <AuthInitializer>
        {children}
        <AuthLoginDialog />
      </AuthInitializer>
    </AuthProvider>
  );
};
