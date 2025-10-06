import type { FC } from 'react';
import clsx from 'clsx';
import { UserCircleIcon, UserLockIcon } from 'styles/icons';
import { styles } from './LoginButton.styles';
import { AuthLoginSimpleDialog } from 'components/Dialog/dialogs/AuthLoginSimpleDialog/AuthLoginSimpleDialog';
import { useState } from 'react';
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

  const handleLogout = async () => {
    await signOut({
      onSuccess: () => {
        toast({ variant: 'success', message: 'Successfully logged out' });
      },
    });
    navigate(isAdminLocation ? ADMIN_PATHS.DASHBOARD : PATHS.main);
  };

  const handleClick = async () => {
    if (!isAuthenticated) {
      setIsOpen(true);
    } else {
      try {
        await handleLogout();
      } catch (error) {
        toast({ variant: 'error', message: 'Failed to log out', subText: 'Please try again' });
      }
    }
  };

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
