import type { FC } from 'react';
import clsx from 'clsx';
import { UserCircleIcon, UserLockIcon } from 'styles/icons';
import { styles } from './LoginButton.styles';
import { AuthLoginSimpleDialog } from 'components/Dialog/dialogs/AuthLoginSimpleDialog/AuthLoginSimpleDialog';
import { useCallback, useState } from 'react';
import { useAuth } from 'providers/AuthProvider/AuthContext';
import { useToast } from 'components/Toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { ADMIN_PATHS, PATHS } from 'config/routes/paths.constants';

export const LoginButton: FC = () => {
  const { user, isAuthenticated, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminLocation = location.pathname.startsWith('/admin');
  const [isOpen, setIsOpen] = useState(false);

  console.log('🔍 USER:', user);
  console.log('%c🔍 IS AUTHENTICATED:', 'color:yellow', isAuthenticated);

  const targetPath = isAdminLocation ? ADMIN_PATHS.DASHBOARD : PATHS.main;

  const handleLogout = useCallback(async () => {
    try {
      await signOut({
        onSuccess: () => toast({ variant: 'success', message: 'Successfully logged out' }),
        onError: () => toast({ variant: 'error', message: 'Failed to log out', subText: 'Please try again' }),
      });
    } finally {
      navigate(targetPath);
    }
  }, [navigate, signOut, targetPath, toast]);

  const handleClick = useCallback(async () => {
    if (!isAuthenticated) {
      setIsOpen(true);
      return;
    }
    await handleLogout();
  }, [isAuthenticated, handleLogout]);

  const handleLoginSuccess = () => {
    setIsOpen(false);
    toast({ variant: 'success', message: 'Successfully logged in' });
  };

  const handleLoginError = (error: string) => {
    toast({ variant: 'error', message: 'Login failed', subText: error });
  };

  return (
    <>
      <button
        css={styles}
        className={clsx('btn', 'btn-auth', isAuthenticated ? 'logged-in' : 'logged-out')}
        onClick={handleClick}
        aria-label={isAuthenticated ? 'Log out' : 'Log in'}
        title={isAuthenticated ? 'Log out' : 'Log in'}
      >
        {isAuthenticated ? <UserLockIcon /> : <UserCircleIcon />}
      </button>
      <AuthLoginSimpleDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={handleLoginSuccess}
        onError={handleLoginError}
      />
    </>
  );
};
