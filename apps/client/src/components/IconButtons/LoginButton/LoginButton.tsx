import type { FC } from 'react';
import clsx from 'clsx';
import { UserCircleIcon, UserLockIcon } from 'styles/icons';
import { styles } from './LoginButton.styles';
import { AuthLoginSimpleDialog } from 'components/Dialog/dialogs/AuthLoginSimpleDialog/AuthSimpleDialog';
import { useCallback, useState } from 'react';
import { useAuth } from 'providers/AuthProvider/AuthContext';
import { useResetAppState } from 'hooks/useResetAppState';
import { useToast } from 'components/Toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { PATHS } from 'config/routes/paths.constants';

interface LoginButtonProps {
  onLoginSuccess?: () => void;
  onLogoutSuccess?: () => void;
}

export const LoginButton: FC<LoginButtonProps> = ({ onLoginSuccess, onLogoutSuccess }) => {
  const { user, isAuthenticated, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isAdminLocation = location.pathname.startsWith('/admin');
  const targetPath = isAdminLocation ? '/admin' : PATHS.main;

  console.log('🔍 USER:', user);
  console.log('%c🔍 IS AUTHENTICATED:', 'color:yellow', isAuthenticated);

  const handleLogout = useCallback(async () => {
    try {
      await signOut({
        onSuccess: () => toast({ variant: 'success', message: 'Successfully logged out' }),
        onError: () => toast({ variant: 'error', message: 'Failed to log out', subText: 'Please try again' }),
      });
    } finally {
      if (!isAdminLocation) {
        onLogoutSuccess?.();
      }
      navigate(targetPath);
    }
  }, [isAdminLocation, navigate, onLogoutSuccess, signOut, targetPath, toast]);

  const handleLoginSuccess = useCallback(() => {
    setIsOpen(false);
    toast({ variant: 'success', message: 'Successfully logged in' });
    onLoginSuccess?.();
  }, [toast, onLoginSuccess]);

  const handleLoginError = (error: string) => {
    toast({ variant: 'error', message: 'Login failed', subText: error });
  };

  const handleClick = useCallback(async () => {
    if (!isAuthenticated) {
      setIsOpen(true);
      return;
    }
    await handleLogout();
  }, [isAuthenticated, handleLogout]);

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
      <AuthLoginSimpleDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={handleLoginSuccess}
        onError={handleLoginError}
      />
    </>
  );
};
