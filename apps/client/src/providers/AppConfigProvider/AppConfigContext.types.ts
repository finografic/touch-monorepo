import type { ReactNode } from 'react';

import type { CreateSettersType } from '@finografic/zustand-context-creator';
import type { Theme } from 'types/ui.types';
import type { AppConfigKeys } from './AppConfigContext';

export interface AppConfigValues {
  [AppConfigKeys.currentLanguage]: string;
  [AppConfigKeys.theme]: Theme;
  [AppConfigKeys.title]: string;
  [AppConfigKeys.isPowerEnabled]: boolean;
  [AppConfigKeys.isRelayFunctionalityEnabled]: boolean;
}

const SETTER_PREFIX = 'AppConfig';
type AppConfigSetters = CreateSettersType<AppConfigValues, typeof SETTER_PREFIX>;

export type AppConfigActions = AppConfigSetters & {
  setCurrentLanguage: (languageCode: string) => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setTogglePowerEnabled: (isPowerEnabled: boolean) => void;
  setRelayFunctionalityEnabled: (isRelayFunctionalityEnabled: boolean) => void;
  toggleRelayFunctionality: () => void;
};

export interface AppConfigStore extends AppConfigValues {
  actions: AppConfigActions;
}

export interface AppConfigProviderProps {
  initialValue?: Partial<AppConfigValues>;
  children: ReactNode;
}
