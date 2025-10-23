import React, { useEffect } from 'react';

import { AuthContext, DISPLAY_NAME, useAuth } from './AuthContext';
import type { AuthProviderProps } from './AuthContext.types';
import { AuthLoginDialogV2 } from 'components/Dialog/dialogs/AuthLoginDialogV2';

export const AuthProvider = ({ children, initialValue }: AuthProviderProps) => {
  return <AuthContext.Provider initialValue={initialValue}>{children}</AuthContext.Provider>;
};

AuthProvider.displayName = `${DISPLAY_NAME}Provider`;

// Component that automatically initializes the session
const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const { refreshSession } = useAuth();

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  return <>{children}</>;
};

// Provider with automatic initialization
export const AuthProviderWithInitialization = ({ children, initialValue }: AuthProviderProps) => {
  return (
    <AuthProvider initialValue={initialValue}>
      <AuthInitializer>
        {children}
        <AuthLoginDialogV2 />
      </AuthInitializer>
    </AuthProvider>
  );
};
