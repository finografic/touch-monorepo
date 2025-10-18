import clsx from 'clsx';
import type { FC } from 'react';

import { useAppConfig } from 'providers/AppConfigProvider';
import { MoonIcon, SunIcon } from 'styles/icons';

import { styles } from './ThemeToggle.styles';

export const ThemeToggle: FC = () => {
  const { theme, toggleTheme } = useAppConfig();

  return (
    <button
      css={styles}
      className={clsx('button theme-toggle')}
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? <MoonIcon /> : <SunIcon />}
    </button>
  );
};
