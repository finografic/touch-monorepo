import { useEffect } from 'react';

import { useAppConfig } from './AppConfigContext';
import type { Theme } from 'types/ui.types';

const THEME_STORAGE_KEY = 'touch-app-theme';
const DEFAULT_THEME: Theme = 'light';

const isValidTheme = (value: string | null): value is Theme => {
  return value === 'light' || value === 'dark';
};

export const AppThemeSync = () => {
  const { setTheme } = useAppConfig();

  useEffect(
    function initializeAppThemeSync() {
      // NOTE: Initialize theme from localStorage, but only if not already set by theme-init.js
      const currentDataTheme = document.documentElement.getAttribute('data-theme');
      const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);

      if (isValidTheme(storedTheme) && currentDataTheme !== storedTheme) {
        setTheme(storedTheme);
      }

      if (!currentDataTheme) {
        setTheme(DEFAULT_THEME);
      }
    },
    [setTheme],
  );

  return null;
};
