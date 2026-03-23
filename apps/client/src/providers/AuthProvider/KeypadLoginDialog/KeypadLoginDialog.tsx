import type { FC } from 'react';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sleep } from '@workspace/core';

import { type DialogConfig, GenericDialog } from 'components/Dialog';
import { useToast } from 'components/Toast/ToastContext';

import { useAuth } from 'providers/AuthProvider/AuthContext';

import { KeypadLoginTabContent } from './KeypadLoginContent';

const DEFAULT_USER_EMAIL = 'user@example.com';
const DEFAULT_ADMIN_EMAIL = 'admin@example.com';
const DEFAULT_ADMIN_PASSWORD = '8787';
const DEFAULT_USER_PASSWORD = 'password123';

interface KeypadLoginDialogProps {
  children?: React.ReactNode | React.ReactElement;
}

export const KeypadLoginDialog: FC<KeypadLoginDialogProps> = () => {
  const { refreshSession, isLoginDialogOpen, closeLoginDialog, signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState('admin');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
        if (location.pathname.startsWith('/admin')) {
          // navigate('/admin');
          await sleep(500);
        } else {
          // navigate('/');
        }

        navigate('/admin');
        await closeLoginDialog();
      } else {
        const errorMessage = String(result.error || 'Failed to log in');
        setError(errorMessage);
      }

      setIsLoading(false);
    },
    [signIn, toast, closeLoginDialog, navigate, password],
  );

  const handleOnChange = useCallback(
    (value: string) => {
      setPassword(value);
      setError('');
    },
    [closeLoginDialog],
  );

  useEffect(
    function initializeInputField() {
      if (isLoginDialogOpen) {
        setPassword('');
        setError('');
        setIsLoading(false);
        setActiveTab('admin');
      }
    },
    [isLoginDialogOpen],
  );

  const config: DialogConfig = {
    title: '',
    size: 'sm',
    minWidth: '220px',
    maxWidth: '300px',
    minHeight: '500px',
    maxHeight: '540px',
    tabs: [
      {
        id: 'admin',
        label: 'Admin',
        content: (
          <KeypadLoginTabContent
            password={password}
            onPasswordChange={handleOnChange}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
            isDialogOpen={isLoginDialogOpen}
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
      className="dialog-keypad"
      defaultTab={activeTab}
      onTabChange={setActiveTab}
    />
  );
};
