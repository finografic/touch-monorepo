import React, { useEffect } from 'react';
import type { AuthProviderProps } from './AuthContext.types';
import { AuthContext, DISPLAY_NAME, useAuth } from './AuthContext';

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
      <AuthInitializer>{children}</AuthInitializer>
    </AuthProvider>
  );
};
