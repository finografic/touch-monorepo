import React from 'react';

import { Flex } from '@radix-ui/themes';
import { Button } from 'components/Button';
import { AdminToggleButton } from 'components/IconButtons/AdminToggleButton/AdminToggleButton';
import { ThemeToggleButton } from 'components/IconButtons/ThemeToggleButton/ThemeToggleButton';
import { UserAuthButton } from 'components/IconButtons/UserAuthButton/UserAuthButton';
import { useToast } from 'components/Toast';
import { useAdmin } from 'providers/AdminProvider';
import { useAppConfig } from 'providers/AppConfigProvider';
import { useAuth } from 'providers/AuthProvider/AuthContext';

import type { Theme } from 'types/ui.types';

import { LanguageIcon } from 'styles/icons';
import { styles } from './UserToolbar.styles';

export const UserToolbar: React.FC = () => {
  const { theme } = useAppConfig();
  const { isLanguageDialogOpen, setIsLanguageDialogOpen } = useAdmin();
  const { signOut } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    const result = await signOut();
    if (result.success) {
      toast({ variant: 'success', message: result.message as string });
    } else {
      toast({ variant: 'error', message: result.error as string, subText: 'Please try again' });
    }
  };

  return (
    <div css={styles} className={`theme-${theme}`}>
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
          <UserAuthButton handleLogout={handleLogout} />
        </div>
      </Flex>
    </div>
  );
};
