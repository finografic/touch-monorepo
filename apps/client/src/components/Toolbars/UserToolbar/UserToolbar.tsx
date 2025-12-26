import { useEffect } from 'react';

import { Flex } from '@radix-ui/themes';
import { Button } from 'components/Button';
import { AdminToggleButton } from 'components/IconButtons/AdminToggleButton/AdminToggleButton';
import { ThemeToggleButton } from 'components/IconButtons/ThemeToggleButton/ThemeToggleButton';
import { UserAuthButton } from 'components/IconButtons/UserAuthButton/UserAuthButton';

import { useAdmin } from 'providers/AdminProvider';
import { useAppConfig } from 'providers/AppConfigProvider';
import { useAuth } from 'providers/AuthProvider/AuthContext';

import { clearAllAuthCookiesServer } from 'utils/auth.utils';
import { LanguageIcon } from 'styles/icons';
import { styles } from './UserToolbar.styles';
import clsx from 'clsx';
import { LanguageDialog } from 'components/Dialog/dialogs/LanguageDialog';

export const UserToolbar = ({ variant }: { variant?: 'light' | 'dark' }) => {
  const { theme } = useAppConfig();
  const { isLanguageDialogOpen, setIsLanguageDialogOpen } = useAdmin();
  const { isLoginDialogOpen } = useAuth();

  useEffect(
    function verifyAuthentication() {
      if (isLoginDialogOpen) {
        clearAllAuthCookiesServer();
      }
    },
    [isLoginDialogOpen],
  );

  return (
    <>
      <div css={styles} className={clsx('toolbar', 'toolbar-user', `theme-${variant || theme}`)}>
        <Flex gap="0" align="center">
          <div className="button-box">
            <Button
              className="button button-language"
              onClick={() => setIsLanguageDialogOpen(!isLanguageDialogOpen)}
            >
              <LanguageIcon />
            </Button>
          </div>

          <div className="button-box">
            <ThemeToggleButton />
          </div>

          <div className="button-box">
            <AdminToggleButton />
          </div>

          <div className="button-box">
            <UserAuthButton />
          </div>
        </Flex>
      </div>
      {isLanguageDialogOpen && (
        <LanguageDialog isOpen={isLanguageDialogOpen} onClose={() => setIsLanguageDialogOpen(false)} />
      )}
    </>
  );
};
