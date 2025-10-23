import React, { type FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { type DialogConfig, GenericDialog } from 'components/Dialog';
import { useAuth } from 'providers/AuthProvider/AuthContext';

import { AuthLoginTabContent } from './AuthTabContent';
import { UserIcon, UserLockIcon } from 'styles/icons';

const DEFAULT_USER_EMAIL = 'user@example.com';
const DEFAULT_ADMIN_EMAIL = 'admin@example.com';
const DEFAULT_PASSWORD = 'password123';

interface AuthLoginDialogProps {
  children?: React.ReactNode | React.ReactElement;
}

export const AuthLoginDialogV2: FC<AuthLoginDialogProps> = ({ children = <React.Fragment /> }) => {
  const { isAuthenticated, refreshSession, isLoginDialogOpen, closeLoginDialog, signIn, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [password, setPassword] = useState(DEFAULT_PASSWORD);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('admin'); // Default to admin tab

  // When called from AuthDialogGuard, this dialog blocks access to protected routes
  // We check if we're on an admin route (but not the dashboard) to determine if this is a blocking dialog
  const isBlockingAccess = useMemo(
    () => isLoginDialogOpen && !location.pathname.startsWith('/admin') && location.pathname !== '/admin',
    [isLoginDialogOpen, location.pathname],
  );

  log('isLoginDialogOpen', 'lime', { isLoginDialogOpen, isBlockingAccess });

  const getCurrentEmail = () => {
    const email = activeTab === 'admin' ? DEFAULT_ADMIN_EMAIL : DEFAULT_USER_EMAIL;
    console.log('getCurrentEmail', { tab: activeTab, email });
    return email;
  };

  // Handle login success: close dialog and redirect to /admin
  const handleLoginSuccess = () => {
    // closeLoginDialog();
    // const redirectUrl = String(location.pathname.startsWith('/admin') ? '/admin' : '/');
    // navigate(redirectUrl);
    navigate('/admin');
  };

  // Handle login error
  const handleLoginError = (error: string) => {
    console.error('Login failed:', error);
  };

  const handleCloseDialog = useCallback(() => {
    // If blocking access to a protected route, navigate home
    // Otherwise just close the dialog
    isBlockingAccess ? navigate('/') : closeLoginDialog();
  }, [closeLoginDialog, isBlockingAccess, navigate]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn(getCurrentEmail(), password);

      if (result.success) {
        // Refresh session to get updated user data with role
        await refreshSession();
        closeLoginDialog();
        handleLoginSuccess();
      } else {
        const errorMessage = result.error || 'Authentication failed';
        setError(errorMessage);
        handleLoginError(errorMessage);
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred';
      setError(errorMessage);
      handleLoginError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const config: DialogConfig = {
    title: '',
    size: '3',
    maxWidth: '400px',
    maxHeight: '60vh',
    minHeight: '280px',
    minWidth: '350px',
    theme: {
      accentColor: 'blue',
      grayColor: 'sand',
      scaling: '110%',
    },
    tabs: [
      // {
      //   id: 'user',
      //   label: 'user',
      //   icon: <UserIcon />,
      //   content: (
      //     <AuthLoginTabContent
      //       activeTab={activeTab}
      //       email={DEFAULT_USER_EMAIL}
      //       password={password}
      //       onPasswordChange={setPassword}
      //       onSubmit={handleSubmit}
      //       isLoading={isLoading}
      //       error={error}
      //     />
      //   ),
      // },
      {
        id: 'admin',
        label: 'Admin',
        icon: <UserLockIcon />,
        content: (
          <AuthLoginTabContent
            activeTab={activeTab}
            email={DEFAULT_ADMIN_EMAIL}
            password={password}
            onPasswordChange={setPassword}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
          />
        ),
      },
    ],
  };

  // When used by AuthDialogGuard to block access, always show as open
  // When used via isLoginDialogOpen (header button), show based on state
  // const shouldShowDialog = isBlockingAccess || isLoginDialogOpen;
  const shouldShowDialog = isLoginDialogOpen;

  return (
    <>
      <GenericDialog
        isOpen={shouldShowDialog}
        onClose={handleCloseDialog}
        config={config}
        defaultTab={activeTab}
        onTabChange={setActiveTab}
      />
      {/* Only render children if not blocking access */}
      {!isBlockingAccess && children}
    </>
  );
};
