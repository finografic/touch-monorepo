import { useEffect } from 'react';
import type { AppConfigProviderProps } from './AppConfigContext.types';
import { AppConfigContext as AppConfig, DISPLAY_NAME, useAppConfig } from './AppConfigContext';
import { useTranslation } from 'react-i18next';

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

  useEffect(() => {
    console.log('%c __LANG__', 'color:cyan', i18n);
    const currentI18nLanguage = i18n.language; // 'es-ES', normally
    const fullLocale = getFullLocaleFromSimpleCode(currentI18nLanguage); // NOTE: is 'es-ES', but failsafe
    setCurrentLanguage(fullLocale);

    // NOTE: tnitialize theme from localStorage
    const storedTheme = localStorage.getItem('touch-app-theme') as 'light' | 'dark';
    if (storedTheme && (storedTheme === 'light' || storedTheme === 'dark')) {
      setTheme(storedTheme);
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
  }, [i18n, setCurrentLanguage, setTheme]);

  return null;
};

export const AppConfigProvider = ({ initialValue, children }: AppConfigProviderProps) => {
  return (
    <AppConfig.Provider initialValue={initialValue}>
      <LanguageSync />
      {children}
    </AppConfig.Provider>
  );
};

AppConfigProvider.displayName = `${DISPLAY_NAME}Provider`;

export { getFullLocaleFromSimpleCode, getSimpleCodeFromLocale };
