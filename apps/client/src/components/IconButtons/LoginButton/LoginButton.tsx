import type { FC } from 'react';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import clsx from 'clsx';
import { AuthLoginDialog } from 'components/Dialog/dialogs/AuthLoginDialog/AuthLoginDialog';
import { useToast } from 'components/Toast';
import { useAuth } from 'providers/AuthProvider/AuthContext';

import { UserCircleIcon, UserLockIcon } from 'styles/icons';
import { styles } from './LoginButton.styles';

export const LoginButton: FC = () => {
  const { isAuthenticated, signOut, openLoginDialog } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = useCallback(async () => {
    try {
      await signOut({
        onSuccess: () => {
          toast({ variant: 'success', message: 'Successfully logged out' });
          navigate('/', { replace: true });
          // signOut already handles redirect to /
        },
        onError: () => {
          toast({ variant: 'error', message: 'Failed to log out', subText: 'Please try again' });
          // signOut still redirects to / even on error
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({ variant: 'error', message: 'Failed to log out', subText: 'Please try again' });
    }
  }, [signOut, toast]);

  if (isAuthenticated) {
    return (
      <button
        css={styles}
        className={clsx('button', 'button-auth', 'logged-in')}
        onClick={handleLogout}
        aria-label="Log out"
        title="Log out"
      >
        <UserLockIcon />
      </button>
    );
  }

  return (
    <button
      css={styles}
      className={clsx('button', 'button-auth', 'logged-out')}
      onClick={openLoginDialog}
      aria-label="Log in"
      title="Log in"
    >
      <UserCircleIcon />
    </button>
  );
};
