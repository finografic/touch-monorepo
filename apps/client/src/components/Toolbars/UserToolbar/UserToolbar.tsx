import React, { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Flex } from '@radix-ui/themes';
import { Button } from 'components/Button';
import { ThemeToggle } from 'components/IconButtons/ThemeToggle';
import { useAdmin } from 'providers/AdminProvider';
import { useAppConfig } from 'providers/AppConfigProvider';
import { useAuth } from 'providers/AuthProvider/AuthContext';

import type { Theme } from 'types/ui.types';

import { HomeIcon, LanguageIcon, ShieldCheckIcon, UserCircleIcon, UserLockIcon } from 'styles/icons';
import { styles } from './UserToolbar.styles';
import clsx from 'clsx';
import { useToast } from 'components/Toast';

export const UserToolbar: React.FC = () => {
  const { theme } = useAppConfig();
  const { isLanguageDialogOpen, setIsLanguageDialogOpen } = useAdmin();
  const { isAuthenticated, signOut, openLoginDialog } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const isAdminPath = location.pathname.startsWith('/admin');

  const handleLogout = useCallback(async () => {
    const result = await signOut();
    if (result.success) {
      toast({ variant: 'success', message: result.message });
    } else {
      toast({ variant: 'error', message: result.error as string, subText: 'Please try again' });
    }
  }, [signOut, toast]);

  return (
    <div css={styles} className={`theme-${theme}`}>
      <Flex gap="0" align="center">
        <div className="button-box">
          <button
            className="button button-language"
            onClick={() => setIsLanguageDialogOpen(!isLanguageDialogOpen)}
          >
            <LanguageIcon />
          </button>
        </div>

        <div className="button-box">
          <ThemeToggle />
        </div>

        <div className="button-box">
          {isAdminPath ? (
            <Button variant="ghost" className="button button-dialog" onClick={() => navigate('/')}>
              <HomeIcon />
            </Button>
          ) : (
            <Button className="button button-dialog" onClick={() => navigate('/admin')}>
              <ShieldCheckIcon />
            </Button>
          )}
        </div>

        <div className="button-box">
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
      </Flex>
    </div>
  );
};
