import type { CreateSettersType } from 'utils/zustand';
import type { AppConfigKeys } from './AppConfigContext';

export interface AppConfigValues {
  [AppConfigKeys.currentLanguage]: string;
  [AppConfigKeys.theme]: 'light' | 'dark';
}

const SETTER_PREFIX = 'AppConfig';
type AppConfigSetters = CreateSettersType<AppConfigValues, typeof SETTER_PREFIX>;

export type AppConfigActions = AppConfigSetters & {
  setCurrentLanguage: (languageCode: string) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
};

export interface AppConfigStore extends AppConfigValues {
  actions: AppConfigActions;
}

export interface AppConfigProviderProps {
  initialValue?: Partial<AppConfigValues>;
  children: React.ReactNode;
}
