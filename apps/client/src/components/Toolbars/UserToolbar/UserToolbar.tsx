import React from 'react';
import { ThemeToggle } from 'components/IconButtons/ThemeToggle';
import { LoginButton } from 'components/IconButtons/LoginButton';
import { HomeIcon, LanguageIcon, ShieldCheckIcon } from 'styles/icons';
import { useAdmin } from 'providers/AdminProvider';
import { Flex } from '@radix-ui/themes';
import { styles } from './UserToolbar.styles';
import type { Theme } from 'types/ui.types';
import { useAppConfig } from 'providers/AppConfigProvider';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from 'providers/AuthProvider/AuthContext';

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
            {location.pathname.startsWith('/admin') && isAuthenticated && (
              <button className="button button-dialog" onClick={() => navigate('/')}>
                <HomeIcon />
              </button>
            )}
            {!location.pathname.startsWith('/admin') && !isAuthenticated && (
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
