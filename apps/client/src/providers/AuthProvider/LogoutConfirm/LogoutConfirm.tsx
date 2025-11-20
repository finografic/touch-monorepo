import type { FC } from 'react';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { type DialogConfig, GenericDialog } from 'components/Dialog';
import { useToast } from 'components/Toast/ToastContext';

import { useAuth } from 'providers/AuthProvider/AuthContext';

import { PATHS } from 'config/routes';
import { LogoutConfirmTabContent } from './LogoutConfirmContent';

interface LogoutConfirmDialogProps {
  children?: React.ReactNode | React.ReactElement;
}

export const LogoutConfirmDialog: FC<LogoutConfirmDialogProps> = () => {
  const { isConfirmLogoutOpen, closeConfirmLogout, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleCloseDialog = useCallback(() => {
    closeConfirmLogout(); // User cancelled
  }, [closeConfirmLogout]);

  const handleConfirm = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      await closeConfirmLogout();

      const result = await signOut();

      if (result.success) {
        toast({ variant: 'success', message: result.message as string });
        navigate(PATHS.main, { replace: true });
      } else {
        toast({ variant: 'error', message: result.error as string, subText: 'Please try again' });
      }
    },
    [closeConfirmLogout, signOut, toast, navigate],
  );

  const config: DialogConfig = {
    title: '',
    size: '3',
    minWidth: '350px',
    maxWidth: '400px',
    minHeight: '200px',
    maxHeight: '220px',
    theme: {
      accentColor: 'blue',
      grayColor: 'sand',
      scaling: '110%',
    },
    tabs: [
      {
        id: 'confirm',
        label: 'Confirm',
        content: <LogoutConfirmTabContent onConfirm={handleConfirm} isLoading={false} />,
      },
    ],
  };

  return (
    <GenericDialog
      isOpen={isConfirmLogoutOpen}
      onClose={handleCloseDialog}
      config={config}
      defaultTab="confirm"
    />
  );
};
