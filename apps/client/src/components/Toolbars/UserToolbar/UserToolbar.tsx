import React from 'react';
import { ThemeToggle } from 'components/IconButtons/ThemeToggle';
import { LoginButton } from 'components/IconButtons/LoginButton';
import { LanguageIcon } from 'styles/icons';
import { useAdmin } from 'providers/AdminProvider';
import { Flex } from '@radix-ui/themes';
import { styles } from './UserToolbar.styles';
import type { Theme } from 'types/ui.types';
import { useAppConfig } from 'providers/AppConfigProvider';

export const UserToolbar: React.FC = () => {
  const { theme } = useAppConfig();
  const { isLanguageDialogOpen, setIsLanguageDialogOpen } = useAdmin();

  return (
    <div css={styles} className={`theme-${theme}`}>
      <Flex gap="3" align="center">
        <div className="button-box">
          <button className="btn btn-language" onClick={() => setIsLanguageDialogOpen(!isLanguageDialogOpen)}>
            <LanguageIcon />
          </button>
        </div>
        <div className="button-box">
          <LoginButton />
        </div>
        <div className="button-box">
          <ThemeToggle />
        </div>
      </Flex>
    </div>
  );
};
