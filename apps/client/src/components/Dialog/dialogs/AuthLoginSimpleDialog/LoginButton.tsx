import type { FC } from 'react';
import clsx from 'clsx';
import { UserCircleIcon, UserLockIcon } from 'styles/icons';
import { styles } from './LoginButton.styles';
import { AuthLoginSimpleDialog } from 'components/Dialog/dialogs/AuthLoginSimpleDialog/AuthLoginSimpleDialog';
import { useState } from 'react';
import { useAuth } from 'providers/AuthProvider/AuthContext';
import { useToast } from 'components/Toast';

// const { user, session, isLoading, isAuthenticated, isAdmin, signOut } = useAuth();

// console.log('🔍 USER:', user);
// console.log('🔍 SESSION:', session);
// console.log('🔍 IS LOADING:', isLoading);
// console.log('🔍 IS AUTHENTICATED:', isAuthenticated);
// console.log('🔍 IS ADMIN:', isAdmin);
// console.log('🔍 SIGN OUT:', signOut);

export const LoginButton: FC = () => {
  const { user, isAuthenticated, signOut } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  // console.log('🔍 USER:', user);
  // console.log('🔍 SESSION:', session);
  // console.log('🔍 IS LOADING:', isLoading);
  // console.log('%c🔍 IS AUTHENTICATED:', 'color:yellow', isAuthenticated);
  // console.log('🔍 IS ADMIN:', isAdmin);
  // console.log('🔍 SIGN OUT:', signOut);

  const handleClick = async () => {
    if (isAuthenticated) {
      // User is logged in, show logout option
      try {
        await signOut();
        toast({
          variant: 'success',
          message: 'Successfully logged out',
        });
      } catch (error) {
        toast({
          variant: 'error',
          message: 'Failed to log out',
          subText: 'Please try again',
        });
      }
    } else {
      // User is not logged in, show login dialog
      setIsOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsOpen(false);
    toast({
      variant: 'success',
      message: 'Successfully logged in',
    });
  };

  const handleLoginError = (error: string) => {
    toast({
      variant: 'error',
      message: 'Login failed',
      subText: error,
    });
  };

  return (
    <>
      <div className="button-box">
        <button
          css={styles}
          className={clsx('btn', isAuthenticated ? 'logged-in' : 'logged-out')}
          onClick={handleClick}
          aria-label={isAuthenticated ? 'Log out' : 'Log in'}
          title={isAuthenticated ? 'Log out' : 'Log in'}
        >
          {isAuthenticated ? <UserLockIcon /> : <UserCircleIcon />}
        </button>
      </div>
      <AuthLoginSimpleDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={handleLoginSuccess}
        onError={handleLoginError}
      />
    </>
  );
};
