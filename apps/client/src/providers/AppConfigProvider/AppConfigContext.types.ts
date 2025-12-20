import type { ReactNode } from 'react';

import type { CreateSettersType } from '@finografic/zustand-context-creator';
import type { Theme } from 'types/ui.types';
import type { AppConfigKeys, SETTER_PREFIX } from './AppConfigContext';
import type { RegionLocale } from '@workspace/i18n';
import type { SupportedLanguage } from 'types/models/supported-language.model';

export interface AppConfigValues {
  [AppConfigKeys.currentLanguage]: RegionLocale;
  [AppConfigKeys.supportedLanguages]: RegionLocale[];
  [AppConfigKeys.supportedLanguagesFull]: SupportedLanguage[];
  [AppConfigKeys.theme]: Theme;
  [AppConfigKeys.title]: string;
  [AppConfigKeys.isPowerEnabled]: boolean;
  [AppConfigKeys.isRelayFunctionalityEnabled]: boolean;
}

type AppConfigSetters = CreateSettersType<AppConfigValues, typeof SETTER_PREFIX>;

export type AppConfigActions = AppConfigSetters & {
  setCurrentLanguage: (languageCode: RegionLocale) => void;
  setSupportedLanguages: (supportedLanguages: RegionLocale[]) => void;
  setSupportedLanguagesFull: (supportedLanguages: SupportedLanguage[]) => void;
  setTheme: (theme: Theme) => void;
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
