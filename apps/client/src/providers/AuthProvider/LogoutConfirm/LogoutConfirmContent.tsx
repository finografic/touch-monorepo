import React from 'react';

import { Button } from '@finografic/design-system/components';

import { styles } from './LogoutConfirm.styles';

interface LogoutConfirmTabContentProps {
  onConfirm: (e: React.FormEvent) => void;
  isLoading: boolean;
}

/**
 * Reusable tab content component for login dialog [Claude v3.5]
 */
export const LogoutConfirmTabContent: React.FC<LogoutConfirmTabContentProps> = ({ onConfirm, isLoading }) => {
  return (
    <div css={styles}>
      <div className="form-wrapper">
        <div className="subtitle">
          <strong>Are you sure you want to logout?</strong>
        </div>
        <Button
          type="button"
          onClick={onConfirm}
          disabled={isLoading}
          size="md"
          palette="info"
          fullWidth
          className="submit-button"
        >
          OK
        </Button>
      </div>
    </div>
  );
};
