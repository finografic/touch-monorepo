import React from 'react';
import { styles } from './LanguageButton.styles';
import clsx from 'clsx';
import { LanguageIcon } from 'styles/icons';
import { useAdmin } from 'providers/AdminProvider';

export const LanguageButton: React.FC = () => {
  const { isLanguageDialogOpen, setIsLanguageDialogOpen } = useAdmin();

  return (
    <div css={styles}>
      <button className="button" onClick={() => setIsLanguageDialogOpen(!isLanguageDialogOpen)}>
        <LanguageIcon />
      </button>
    </div>
  );
};
