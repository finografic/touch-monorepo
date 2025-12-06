import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { AppConfigContext as AppConfig, DISPLAY_NAME, useAppConfig } from './AppConfigContext';
import type { AppConfigProviderProps } from './AppConfigContext.types';
import { useGetSlotConfigurations } from 'queries/slot-configurations';
import { useToggleRelay } from 'queries/relays';

const LOCALE_MAPPING = {
  es: 'es-ES',
  en: 'en-GB',
  ca: 'ca-ES',
} as const;

// Helper function to convert simple code to full locale
const getFullLocaleFromSimpleCode = (simpleCode: string): string => {
  return LOCALE_MAPPING[simpleCode as keyof typeof LOCALE_MAPPING] || simpleCode;
};

// Helper function to convert full locale to simple code
const getSimpleCodeFromLocale = (locale: string): string => {
  return locale.includes('-') ? locale.split('-')[0] : locale;
};

const LanguageSync = () => {
  const { i18n } = useTranslation();
  const { setCurrentLanguage, setTheme } = useAppConfig();

  useEffect(
    function initializeLanguageSync() {
      console.log('%c __LANG__', 'color:cyan', i18n);
      const currentI18nLanguage = i18n.language; // 'es-ES', normally
      const fullLocale = getFullLocaleFromSimpleCode(currentI18nLanguage); // NOTE: is 'es-ES', but failsafe
      setCurrentLanguage(fullLocale);

      // NOTE: Initialize theme from localStorage, but only if not already set by theme-init.js
      const currentDataTheme = document.documentElement.getAttribute('data-theme');
      const storedTheme = localStorage.getItem('touch-app-theme') as 'light' | 'dark';

      if (storedTheme && (storedTheme === 'light' || storedTheme === 'dark')) {
        // Only call setTheme if the DOM attribute doesn't match (prevents flicker)
        if (currentDataTheme !== storedTheme) {
          setTheme(storedTheme);
        }
      } else if (!currentDataTheme) {
        // Fallback: set default theme if nothing is set
        setTheme('light');
      }

      const handleLanguageChanged = (lng: string) => {
        console.log('%c __LANG__', 'color:lime', lng);
        const fullLocale = getFullLocaleFromSimpleCode(lng);
        console.log('%c __LANG__', 'color:hotpink', currentI18nLanguage);
        setCurrentLanguage(fullLocale);
      };

      i18n.on('languageChanged', handleLanguageChanged);

      return () => {
        i18n.off('languageChanged', handleLanguageChanged);
      };
    },
    [i18n, setCurrentLanguage, setTheme],
  );

  return null;
};

// Fixed slot number that maps to the power button
const POWER_SLOT_NUMBER = 14;

const PowerRelaySync = () => {
  const { isPowerEnabled } = useAppConfig();
  const { data: slotConfigurations, isLoading } = useGetSlotConfigurations();
  const toggleRelayMutation = useToggleRelay();

  // Track previous state to avoid unnecessary API calls
  const prevPowerStateRef = useRef<boolean | null>(null);
  const hasInitializedRef = useRef(false);

  // Find slot 14 configuration to get its relay number
  const slot14Config = slotConfigurations?.find((config) => config.slotNumber === POWER_SLOT_NUMBER);
  const relayNumber = slot14Config?.relayNumber;

  useEffect(
    function syncPowerRelay() {
      // Wait for slot configurations to load
      if (isLoading || !slotConfigurations) {
        return;
      }

      // Don't do anything if relay is not assigned to slot 14
      if (!relayNumber) {
        return;
      }

      // Skip if this is the first render and state hasn't changed
      if (!hasInitializedRef.current) {
        hasInitializedRef.current = true;
        prevPowerStateRef.current = isPowerEnabled;

        // Set initial relay state based on current isPowerEnabled
        toggleRelayMutation.mutate({
          slotNumber: relayNumber,
          state: isPowerEnabled,
        });
        return;
      }

      // Only toggle if state actually changed
      if (prevPowerStateRef.current !== isPowerEnabled) {
        prevPowerStateRef.current = isPowerEnabled;

        toggleRelayMutation.mutate({
          slotNumber: relayNumber,
          state: isPowerEnabled,
        });
      }
    },
    [isPowerEnabled, relayNumber, toggleRelayMutation, isLoading, slotConfigurations],
  );

  return null;
};

export const AppConfigProvider = ({ initialValue, children }: AppConfigProviderProps) => {
  return (
    <AppConfig.Provider initialValue={initialValue}>
      <LanguageSync />
      <PowerRelaySync />
      {children}
    </AppConfig.Provider>
  );
};

AppConfigProvider.displayName = `${DISPLAY_NAME}Provider`;

export { getFullLocaleFromSimpleCode, getSimpleCodeFromLocale };
