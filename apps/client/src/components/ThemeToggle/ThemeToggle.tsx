import type { FC } from 'react';
import clsx from 'clsx';
import { MoonIcon, SunIcon } from 'styles/icons';
import { styles } from './ThemeToggle.styles';
import { useAppConfig } from 'providers/AppConfigProvider';

export const ThemeToggle: FC = () => {
  const { theme, toggleTheme } = useAppConfig();

  return (
    <div className="button-box">
      <button
        css={styles}
        className={clsx('btn theme-toggle')}
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? <MoonIcon /> : <SunIcon />}
      </button>
    </div>
  );
};
