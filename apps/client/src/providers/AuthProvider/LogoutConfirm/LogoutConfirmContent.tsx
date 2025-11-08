import React, { useEffect, useState } from 'react';

import { Button } from 'components/Button';
import { Input } from 'components/Input/Input';

import { useAuth } from 'providers/AuthProvider';

import { styles } from './LogoutConfirm.styles';

interface LogoutConfirmTabContentProps {
  activeTab: string;
  email: string;
  password: string;
  onPasswordChange: (password: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  error: string;
}

/**
 * Reusable tab content component for login dialog [Claude v3.5]
 */
export const LogoutConfirmTabContent: React.FC<LogoutConfirmTabContentProps> = ({
  activeTab,
  email,
  password,
  onPasswordChange,
  onSubmit,
  isLoading,
  error,
}) => {
  return (
    <div css={styles}>
      <div className="form-wrapper">
        <div className="subtitle">
          <strong>Are you sure you want to logout?</strong>
        </div>
        <form className="form" onSubmit={onSubmit}>
          <Button
            type="submit"
            disabled={isLoading}
            size="md"
            color="info"
            fullWidth
            className="submit-button"
          >
            OK
          </Button>
        </form>
      </div>
    </div>
  );
};
