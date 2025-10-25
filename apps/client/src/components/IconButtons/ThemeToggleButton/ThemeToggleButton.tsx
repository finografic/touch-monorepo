import type { FC } from 'react';

import clsx from 'clsx';
import { Button } from 'components/Button/Button';
import { useAppConfig } from 'providers/AppConfigProvider';

import { MoonIcon, SunIcon } from 'styles/icons';
import { styles } from './ThemeToggleButton.styles';

export const ThemeToggleButton: FC = () => {
  const { theme, toggleTheme } = useAppConfig();

  return (
    <Button
      css={styles}
      className={clsx('button theme-toggle')}
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? <MoonIcon /> : <SunIcon />}
    </Button>
  );
};
