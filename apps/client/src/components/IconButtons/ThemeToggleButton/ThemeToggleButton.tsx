import type { FC } from 'react';
import { MoonIcon, SunIcon } from '@finografic/icons';

import clsx from 'clsx';
import { Button } from '@finografic/design-system/components';

import { useAppConfig } from 'providers/AppConfigProvider';

import { styles } from './ThemeToggleButton.styles';

export const ThemeToggleButton: FC = () => {
  const { theme, setTheme } = useAppConfig();

  return (
    <Button
      variant="solid"
      css={styles}
      className={clsx('button theme-toggle')}
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? <MoonIcon /> : <SunIcon />}
    </Button>
  );
};
