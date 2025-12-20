import { AppConfigContext as AppConfig, DISPLAY_NAME } from './AppConfigContext';
import type { AppConfigProviderProps } from './AppConfigContext.types';
import { AppLanguageSync } from './AppLanguageSync';
import { AppPowerRelaySync } from './AppPowerRelaySync';
import { AppThemeSync } from './AppThemeSync';

export const AppConfigProvider = ({ initialValue, children }: AppConfigProviderProps) => {
  return (
    <AppConfig.Provider initialValue={initialValue}>
      <AppLanguageSync />
      <AppPowerRelaySync />
      <AppThemeSync />
      {children}
    </AppConfig.Provider>
  );
};

AppConfigProvider.displayName = `${DISPLAY_NAME}Provider`;
