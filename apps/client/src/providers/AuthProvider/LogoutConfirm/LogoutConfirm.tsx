import type { FC } from 'react';
import React, { useCallback } from 'react';

import { type DialogConfig, GenericDialog } from 'components/Dialog';

import { useAuth } from 'providers/AuthProvider/AuthContext';

import { LogoutConfirmTabContent } from './LogoutConfirmContent';

interface LogoutConfirmDialogProps {
  children?: React.ReactNode | React.ReactElement;
}

export const LogoutConfirmDialog: FC<LogoutConfirmDialogProps> = () => {
  const { isConfirmLogoutOpen, closeConfirmLogout } = useAuth();

  const handleCloseDialog = useCallback(() => {
    closeConfirmLogout(false); // User cancelled
  }, [closeConfirmLogout]);

  const handleConfirm = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      await closeConfirmLogout(true); // User confirmed
    },
    [closeConfirmLogout],
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
