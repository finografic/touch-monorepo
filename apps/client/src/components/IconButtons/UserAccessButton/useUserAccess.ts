import type { FC } from 'react';
import clsx from 'clsx';
import { UserCircleIcon, UserLockIcon } from 'styles/icons';
import { styles } from './UserAccessButton.styles';
import { AuthLoginSimpleDialog } from 'components/Dialog/dialogs/AuthLoginSimpleDialog/AuthLoginSimpleDialog';
import { useCallback, useState } from 'react';
import { useAuth } from 'providers/AuthProvider/AuthContext';
import { useResetAppState } from 'hooks/useResetAppState';
import { useToast } from 'components/Toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { PATHS } from 'config/routes/paths.constants';

interface UseUserAccessProps {
  login: {
    onSuccess: () => void;
    onError: (error?: unknown) => void;
  };
  logout: {
    onSuccess: () => void;
    onError: (error?: unknown) => void;
  };
}

interface UseUserAccessReturn {
  handleLogin: () => Promise<void>;
  handleLogout: () => Promise<void>;
}

export const useUserAccess = ({ login, logout }: UseUserAccessProps): UseUserAccessReturn => {
  const { user, signOut, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const location = useLocation();

  const isAdminLocation = location.pathname.startsWith('/admin');
  const targetPath = isAdminLocation ? '/admin' : PATHS.main;

  console.log('🔍 USER:', user);
  console.log('%c🔍 IS AUTHENTICATED:', 'color:yellow', isAuthenticated);

  // NOTE: LOG-IN HANDLERS  ================================================== //

  const handleLoginSuccess = useCallback(() => {
    toast({ variant: 'success', message: 'Successfully logged in' });
    login.onSuccess?.();
  }, [toast, login.onSuccess]);

  const handleLoginError = (error: string) => {
    toast({ variant: 'error', message: 'Login failed', subText: error });
    login.onError?.(error);
  };

  const handleLogin = useCallback(async () => {
    try {
      toast({ variant: 'success', message: 'Successfully logged in' });
      handleLoginSuccess();
    } catch (error) {
      handleLoginError(error);
    }
  }, [isAdminLocation, login.onSuccess, signOut, targetPath, toast]);

  // NOTE: LOG-OUT HANDLERS  ================================================== //

  const handleLogoutSuccess = useCallback(() => {
    toast({ variant: 'success', message: 'Successfully logged out' });
    if (!isAdminLocation) {
      logout.onSuccess();
    }
  }, [toast, isAdminLocation, logout.onSuccess]);

  const handleLogoutError = useCallback(
    (error?: unknown) => {
      toast({ variant: 'error', message: 'Failed to log out', subText: 'Please try again' });
      logout.onError(error);
    },
    [toast],
  );

  const handleLogout = useCallback(async () => {
    try {
      await signOut({ onSuccess: handleLogoutSuccess, onError: handleLogoutError });
      handleLogoutSuccess();
    } catch (error) {
      handleLogoutError(error);
    }
  }, [isAdminLocation, logout.onSuccess, signOut, toast]);

  return {
    handleLogin,
    handleLogout,
  };
};
