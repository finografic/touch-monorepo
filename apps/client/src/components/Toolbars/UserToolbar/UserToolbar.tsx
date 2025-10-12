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

interface UserToolbarProps {
  onLogoutSuccess?: () => void;
}

export const UserToolbar: React.FC<UserToolbarProps> = ({ onLogoutSuccess }) => {
  const { theme } = useAppConfig();
  const { isLanguageDialogOpen, setIsLanguageDialogOpen } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div css={styles} className={`theme-${theme}`}>
      <Flex gap="3" align="center">
        <div className="button-box">
          <button
            className="button button-language"
            onClick={() => setIsLanguageDialogOpen(!isLanguageDialogOpen)}
          >
            <LanguageIcon />
          </button>
        </div>
        <div className="button-box">
          {location.pathname.startsWith('/admin') ? (
            <button className="button button-dialog" onClick={() => navigate('/')}>
              <HomeIcon />
            </button>
          ) : (
            <button className="button button-dialog" onClick={() => navigate('/admin')}>
              <ShieldCheckIcon />
            </button>
          )}
        </div>
        <div className="button-box">
          <LoginButton onLogoutSuccess={onLogoutSuccess} />
        </div>
        <div className="button-box">
          <ThemeToggle />
        </div>
      </Flex>
    </div>
  );
};
