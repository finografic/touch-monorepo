import type { FC } from 'react';
import { useCallback } from 'react';

import clsx from 'clsx';
import { useToast } from 'components/Toast';
import { useAuth } from 'providers/AuthProvider/AuthContext';

import { UserCircleIcon, UserLockIcon } from 'styles/icons';
import { styles } from './LoginButton.styles';

export const LoginButton: FC = () => {
  const { user, isAuthenticated, signOut, openLoginDialog } = useAuth();
  const { toast } = useToast();

  // console.log('🔍 USER:', user);
  // console.log('%c🔍 IS AUTHENTICATED:', 'color:yellow', isAuthenticated);

  const handleLogout = useCallback(async () => {
    try {
      await signOut({
        onSuccess: () => {
          toast({ variant: 'success', message: 'Successfully logged out' });
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

  const handleClick = useCallback(async () => {
    if (!isAuthenticated) {
      // Open the global login dialog (managed by AuthProvider)
      openLoginDialog();
      return;
    }
    await handleLogout();
  }, [isAuthenticated, openLoginDialog, handleLogout]);

  return (
    <button
      css={styles}
      className={clsx('button', 'button-auth', isAuthenticated ? 'logged-in' : 'logged-out')}
      onClick={handleClick}
      aria-label={isAuthenticated ? 'Log out' : 'Log in'}
      title={isAuthenticated ? 'Log out' : 'Log in'}
    >
      {isAuthenticated ? <UserLockIcon /> : <UserCircleIcon />}
    </button>
  );
};
