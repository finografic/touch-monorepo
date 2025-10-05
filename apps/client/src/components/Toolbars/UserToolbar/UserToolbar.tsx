import React from 'react';
import { styles } from '../../Header/Header.styles';
import { ThemeToggle } from 'components/IconButtons/ThemeToggle';
import { LoginButton } from 'components/IconButtons/LoginButton';
import { LanguageIcon } from 'styles/icons';
import { useAdmin } from 'providers/AdminProvider';

export const UserToolbar: React.FC = () => {
  const { isLanguageDialogOpen, setIsLanguageDialogOpen } = useAdmin();

  return (
    <div css={styles}>
      <div className="button-box">
        <button className="btn" onClick={() => setIsLanguageDialogOpen(!isLanguageDialogOpen)}>
          <LanguageIcon />
        </button>
      </div>
      <div className="button-box">
        <LoginButton />
      </div>
      <div className="button-box">
        <ThemeToggle />
      </div>
    </div>
  );
};
