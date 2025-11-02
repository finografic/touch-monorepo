import type { FC } from 'react';
import React, { useCallback, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { type DialogConfig, GenericDialog } from 'components/Dialog';
import { useToast } from 'components/Toast/ToastContext';
import { useAuth } from 'providers/AuthProvider/AuthContext';

import { AuthLoginTabContent } from './AuthTabContent';
import { UserLockIcon } from 'styles/icons';

const DEFAULT_USER_EMAIL = 'user@example.com';
const DEFAULT_ADMIN_EMAIL = 'admin@example.com';
const DEFAULT_PASSWORD = 'password123';

interface AuthLoginDialogProps {
  children?: React.ReactNode | React.ReactElement;
}

export const AuthLoginDialog: FC<AuthLoginDialogProps> = () => {
  const { refreshSession, isLoginDialogOpen, closeLoginDialog, signIn, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [password, setPassword] = useState(DEFAULT_PASSWORD);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('admin');

  const isBlockingAccess = useMemo(
    () => isLoginDialogOpen && !location.pathname.startsWith('/admin') && location.pathname !== '/admin',
    [isLoginDialogOpen, location.pathname],
  );

  const getCurrentEmail = (): string => {
    const email = activeTab === 'admin' ? DEFAULT_ADMIN_EMAIL : DEFAULT_USER_EMAIL;
    console.log('getCurrentEmail', { tab: activeTab, email });
    return email;
  };

  const handleCloseDialog = useCallback(() => {
    closeLoginDialog();
    setError('');
    // TODO: leave comments in for now...
    // isBlockingAccess ? navigate('/') : closeLoginDialog();
  }, [closeLoginDialog, isBlockingAccess, navigate]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError('');

      const result = await signIn({ email: getCurrentEmail(), password });

      if (result.success) {
        toast({ variant: 'success', message: result.message || 'Signed in successfully' });
        await refreshSession();
        closeLoginDialog();
        navigate('/admin');
      } else {
        const errorMessage = String(result.error || 'Failed to log in');
        setError(errorMessage);
        toast({
          variant: 'error',
          message: errorMessage,
          subText: 'Please try again',
        });
      }

      setIsLoading(false);
    },
    [signIn, toast, closeLoginDialog, navigate, password],
  );

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

  return (
    <GenericDialog
      isOpen={isLoginDialogOpen}
      onClose={handleCloseDialog}
      config={config}
      defaultTab={activeTab}
      onTabChange={setActiveTab}
    />
  );
};
