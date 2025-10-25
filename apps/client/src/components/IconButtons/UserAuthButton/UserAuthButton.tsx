import React from 'react';

import clsx from 'clsx';
import { Button } from 'components/Button';
import { useAuth } from 'providers/AuthProvider/AuthContext';

import { UserCircleIcon, UserLockIcon } from 'styles/icons';
import { styles } from './UserAuthButton.styles';

interface UserAuthButtonProps {
  handleLogout: () => void;
}
export const UserAuthButton: React.FC<UserAuthButtonProps> = ({ handleLogout }) => {
  const { isAuthenticated, openLoginDialog } = useAuth();

  return (
    <div css={styles}>
      {isAuthenticated ? (
        <Button
          className={clsx('button', 'button-auth', 'logged-in')}
          onClick={handleLogout}
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
