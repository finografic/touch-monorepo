import type { FC } from 'react';
import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import clsx from 'clsx';
import { AuthLoginDialog } from 'components/Dialog/dialogs/AuthLoginDialog/AuthLoginDialog';
import { useToast } from 'components/Toast';
import { useAuth } from 'providers/AuthProvider/AuthContext';

import { UserCircleIcon, UserLockIcon } from 'styles/icons';
import { styles } from './LoginButton.styles';

export const LoginButton: FC = () => {
  const { user, isAuthenticated, signOut, openLoginDialog, isLoginDialogOpen } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

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
    console.log('%c CLICKED', 'color:grey', { isAuthenticated, user });
    if (isAuthenticated && user?.role === 'admin') {
      signOut();
      switch (true) {
        // case location.pathname === '/admin':
        //   return;
        case location.pathname.startsWith('/admin'):
          navigate('/admin');
          return;
        case location.pathname === '/':
        default:
          return;
      }
    }
    openLoginDialog();
  }, [isAuthenticated, openLoginDialog, handleLogout, user, location.pathname, navigate]);

  const shouldShowLoginDialog = useMemo(() => {
    return (
      isLoginDialogOpen &&
      !isAuthenticated &&
      (location.pathname.startsWith('/admin') || location.pathname === '/admin')
    );
  }, [isLoginDialogOpen, location.pathname, isAuthenticated]);

  return (
    <>
      <button
        css={styles}
        className={clsx('button', 'button-auth', isAuthenticated ? 'logged-in' : 'logged-out')}
        onClick={handleClick}
        aria-label={isAuthenticated ? 'Log out' : 'Log in'}
        title={isAuthenticated ? 'Log out' : 'Log in'}
      >
        {isAuthenticated ? <UserLockIcon /> : <UserCircleIcon />}
      </button>
      {shouldShowLoginDialog ? <AuthLoginDialog /> : null}
    </>
  );
};
