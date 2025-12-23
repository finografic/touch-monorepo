import { createStore, type StoreApi, useStore } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';

import { createSetters, createZustandContext } from '@finografic/zustand-context-creator';
import type { AppConfigStore, AppConfigValues } from './AppConfigContext.types';
import type { RegionLocale } from '@workspace/i18n';
import { DEFAULT_LANGUAGE } from 'config/app/i18n.config';
import { DEFAULT_SUPPORTED_LANGUAGES } from 'config/app/i18n.config';
import type { SupportedLanguage } from 'types/models/supported-language.model';

export const DISPLAY_NAME = 'AppConfig';
export const SETTER_PREFIX = 'AppConfig';

export enum AppConfigKeys {
  currentLanguage = 'currentLanguage',
  supportedLanguages = 'supportedLanguages',
  supportedLanguagesFull = 'supportedLanguagesFull',
  theme = 'theme',
  title = 'title',
  isPowerEnabled = 'isPowerEnabled',
  isRelayFunctionalityEnabled = 'isRelayFunctionalityEnabled',
}

export const defaultValue: AppConfigValues = {
  currentLanguage: DEFAULT_LANGUAGE, // ✅ Use full locale code as the default
  supportedLanguages: [...DEFAULT_SUPPORTED_LANGUAGES],
  supportedLanguagesFull: [], // ✅ Will be populated by AppLanguageSync
  theme: 'light', // ✅ Default theme
  title: import.meta.env.VITE_APP_TITLE,
  isPowerEnabled: false,
  isRelayFunctionalityEnabled: false, // ✅ Default to disabled - enable when relay board is connected
};

export const AppConfigContext = createZustandContext(({ initialValue }) => {
  return createStore<AppConfigStore>()(
    subscribeWithSelector(
      (set, _get): AppConfigStore => ({
        ...defaultValue,
        ...initialValue,
        actions: {
          ...createSetters({ set, defaultValue, prefix: SETTER_PREFIX }),
          setCurrentLanguage: (languageCode: RegionLocale) => {
            set({ currentLanguage: languageCode });
          },
          setSupportedLanguages: (supportedLanguages: RegionLocale[]) => {
            set({ supportedLanguages });
          },
          setSupportedLanguagesFull: (supportedLanguages: SupportedLanguage[]) => {
            set({ supportedLanguagesFull: supportedLanguages });
          },
          setTheme: (theme: 'light' | 'dark') => {
            set({ theme });
            // Update document attribute for CSS variable targeting + Persist to localStorage
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('touch-app-theme', theme);
          },
          setTogglePowerEnabled: (isPowerEnabled: boolean) => {
            set({ isPowerEnabled });
          },
          setRelayFunctionalityEnabled: (isRelayFunctionalityEnabled: boolean) => {
            set({ isRelayFunctionalityEnabled });
          },
          toggleRelayFunctionality: () => {
            set((state) => ({ isRelayFunctionalityEnabled: !state.isRelayFunctionalityEnabled }));
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
