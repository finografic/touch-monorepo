import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Flex } from '@radix-ui/themes';
import { LoginButton } from 'components/IconButtons/LoginButton';
import { ThemeToggle } from 'components/IconButtons/ThemeToggle';
import { useAdmin } from 'providers/AdminProvider';
import { useAppConfig } from 'providers/AppConfigProvider';
import { useAuth } from 'providers/AuthProvider/AuthContext';

import type { Theme } from 'types/ui.types';

import { HomeIcon, LanguageIcon, ShieldCheckIcon } from 'styles/icons';
import { styles } from './UserToolbar.styles';

export const UserToolbar: React.FC = () => {
  const { theme } = useAppConfig();
  const { isAuthenticated } = useAuth();
  const { isLanguageDialogOpen, setIsLanguageDialogOpen } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();

  const showHomeButton = location.pathname.startsWith('/admin');
  const showAdminButton = !location.pathname.startsWith('/admin') && isAuthenticated;

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
        {(showHomeButton || showAdminButton) && (
          <div className="button-box">
            {showHomeButton && (
              <button className="button button-dialog" onClick={() => navigate('/')}>
                <HomeIcon />
              </button>
            )}
            {showAdminButton && (
              <button className="button button-dialog" onClick={() => navigate('/admin')}>
                <ShieldCheckIcon />
              </button>
            )}
          </div>
        )}
        <div className="button-box">
          <LoginButton />
        </div>
      </Flex>
    </div>
  );
};
