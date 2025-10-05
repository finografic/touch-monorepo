import { createStore, type StoreApi, useStore } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import { createSetters, createZustandContext } from 'utils/zustand';
import type { AppConfigStore, AppConfigValues } from './AppConfigContext.types';
import { subscribeWithSelector } from 'zustand/middleware';

export const DISPLAY_NAME = 'AppConfig';
export const SETTER_PREFIX = 'AppConfig';

export enum AppConfigKeys {
  currentLanguage = 'currentLanguage',
  theme = 'theme',
  title = 'title',
}

export const defaultValue: AppConfigValues = {
  currentLanguage: 'es-ES', // ✅ Use full locale code as the default
  theme: 'light', // ✅ Default theme
  title: import.meta.env.VITE_APP_TITLE,
};

export const AppConfigContext = createZustandContext(({ initialValue }) => {
  return createStore<AppConfigStore>()(
    subscribeWithSelector(
      (set, _get): AppConfigStore => ({
        ...defaultValue,
        ...initialValue,
        actions: {
          ...createSetters({ set, defaultValue, prefix: SETTER_PREFIX }),
          setCurrentLanguage: (languageCode: string) => {
            // Store the full locale code in AppConfigProvider (e.g., 'es-ES', 'en-GB')
            // This preserves regional information for currency, formatting, flags, etc.
            set({ currentLanguage: languageCode });

            // Note: i18n.changeLanguage() should be called separately by the component
            // to update i18next with the simple code (e.g., 'es', 'en')
          },
          setTheme: (theme: 'light' | 'dark') => {
            set({ theme });
            // Update document attribute for CSS variable targeting
            document.documentElement.setAttribute('data-theme', theme);
            // Persist to localStorage
            localStorage.setItem('touch-app-theme', theme);
          },
          toggleTheme: () => {
            set((state) => {
              const newTheme = state.theme === 'light' ? 'dark' : 'light';
              // Update document attribute for CSS variable targeting
              document.documentElement.setAttribute('data-theme', newTheme);
              // Persist to localStorage
              localStorage.setItem('touch-app-theme', newTheme);
              return { theme: newTheme };
            });
          },
        },
      }),
    ),
  );
});

type AppConfigReturn = Omit<AppConfigStore, 'actions'> & AppConfigStore['actions'];

export const useAppConfig = (): AppConfigReturn => {
  const store = AppConfigContext.useContext();
  if (!store) {
    throw new Error(`use${SETTER_PREFIX} must be used within a ${DISPLAY_NAME}Provider`);
  }

  return useStore<StoreApi<AppConfigStore>, AppConfigReturn>(
    store,
    useShallow(({ actions, ...state }) => ({
      ...state,
      ...actions,
    })),
  );
};
