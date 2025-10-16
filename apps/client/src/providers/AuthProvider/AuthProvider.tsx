import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AuthProviderProps } from './AuthContext.types';
import { AuthContext, DISPLAY_NAME, useAuth } from './AuthContext';
import { AuthLoginSimpleDialog } from 'components/Dialog/dialogs/AuthLoginSimpleDialog/AuthSimpleDialog';

export const AuthProvider = ({ children, initialValue }: AuthProviderProps) => {
  return <AuthContext.Provider initialValue={initialValue}>{children}</AuthContext.Provider>;
};

AuthProvider.displayName = `${DISPLAY_NAME}Provider`;

// Component that automatically initializes the session and handles global login dialog
const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const { refreshSession, isLoginDialogOpen, closeLoginDialog, signIn, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  // Handle login success: close dialog and redirect to /admin
  const handleLoginSuccess = () => {
    closeLoginDialog();
    navigate('/admin');
  };

  // Handle login error
  const handleLoginError = (error: string) => {
    console.error('Login failed:', error);
  };

  // Handle logout success: redirect to /
  useEffect(() => {
    const handleAuthChange = async () => {
      // This effect will trigger when auth state changes
      // We'll use signOut callbacks for navigation
    };

    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <>
      {children}
      {/* Global Login Dialog - triggered by route protection or manual call */}
      <AuthLoginSimpleDialog
        isOpen={isLoginDialogOpen}
        onClose={closeLoginDialog}
        onSuccess={handleLoginSuccess}
        onError={handleLoginError}
      />
    </>
  );
};

// Provider with automatic initialization
export const AuthProviderWithInitialization = ({ children, initialValue }: AuthProviderProps) => {
  return (
    <AuthProvider initialValue={initialValue}>
      <AuthInitializer>{children}</AuthInitializer>
    </AuthProvider>
  );
};
