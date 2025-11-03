import type { FC } from 'react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { type DialogConfig, GenericDialog } from 'components/Dialog';
import { useToast } from 'components/Toast/ToastContext';
import { useAuth } from 'providers/AuthProvider/AuthContext';

import { KeypadLoginTabContent } from './KeypadLoginContent';

const DEFAULT_USER_EMAIL = 'user@example.com';
const DEFAULT_ADMIN_EMAIL = 'admin@example.com';
const DEFAULT_ADMIN_PASSWORD = '7878';
const DEFAULT_USER_PASSWORD = 'password123';

interface KeypadLoginDialogProps {
  children?: React.ReactNode | React.ReactElement;
}

export const KeypadLoginDialog: FC<KeypadLoginDialogProps> = () => {
  const { refreshSession, isLoginDialogOpen, closeLoginDialog, signIn, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState('admin');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isBlockingAccess = useMemo(
    () => isLoginDialogOpen && !location.pathname.startsWith('/admin') && location.pathname !== '/admin',
    [isLoginDialogOpen, location.pathname],
  );

  const handleCloseDialog = useCallback(() => {
    closeLoginDialog();
    setError('');
  }, [closeLoginDialog]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError('');

      const result = await signIn({ email: DEFAULT_ADMIN_EMAIL, password });

      if (result.success) {
        toast({ variant: 'success', message: result.message || 'Signed in successfully' });
        await refreshSession();
        await closeLoginDialog();
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

  useEffect(() => {
    if (isLoginDialogOpen) {
      setPassword('');
      setError('');
      setIsLoading(false);
      setActiveTab('admin');
    }
  }, [isLoginDialogOpen]);

  const config: DialogConfig = {
    title: '',
    size: '2',
    minWidth: '220px',
    maxWidth: '270px',
    minHeight: '500px',
    maxHeight: '540px',
    theme: {
      accentColor: 'blue',
      grayColor: 'sand',
      scaling: '100%',
    },
    tabs: [
      {
        id: 'admin',
        label: 'Admin',
        content: (
          <KeypadLoginTabContent
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
      // isOpen={isLoginDialogOpen}
      isOpen={true}
      onClose={handleCloseDialog}
      config={config}
      className="dialog-keypad"
      defaultTab={activeTab}
      onTabChange={setActiveTab}
    />
  );
};
