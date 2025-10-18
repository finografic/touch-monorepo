import React from 'react';

import clsx from 'clsx';
import { useAdmin } from 'providers/AdminProvider';

import { LanguageIcon } from 'styles/icons';
import { styles } from './LanguageButton.styles';

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
