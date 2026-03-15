import React from 'react';

import clsx from 'clsx';
import { Button } from 'components/Button';

import { useAuth } from 'providers/AuthProvider/AuthContext';

import { UserCircleIcon, UserLockIcon } from '@finografic/icons';
import { styles } from './UserAuthButton.styles';

export const UserAuthButton: React.FC = () => {
  const { isAuthenticated, openLoginDialog, openConfirmLogout } = useAuth();

  return (
    <div css={styles}>
      {isAuthenticated ? (
        <Button
          className={clsx('button', 'button-auth', 'logged-in')}
          onClick={openConfirmLogout}
          aria-label="Log out"
          title="Log out"
        >
          <UserLockIcon />
        </Button>
      ) : (
        <Button
          className={clsx('button', 'button-auth', 'logged-out')}
          onClick={openLoginDialog}
          aria-label="Log in"
          title="Log in"
        >
          <UserCircleIcon />
        </Button>
      )}
    </div>
  );
};
