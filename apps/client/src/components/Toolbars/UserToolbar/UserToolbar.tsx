import React from 'react';
import { ThemeToggle } from 'components/IconButtons/ThemeToggle';
import { LoginButton } from 'components/IconButtons/LoginButton';
import { LanguageIcon } from 'styles/icons';
import { useAdmin } from 'providers/AdminProvider';
import { Flex } from '@radix-ui/themes';
import { styles } from './UserToolbar.styles';

export const UserToolbar: React.FC = () => {
  const { isLanguageDialogOpen, setIsLanguageDialogOpen } = useAdmin();

  return (
    <div css={styles}>
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
