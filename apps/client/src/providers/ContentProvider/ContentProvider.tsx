import React, { useEffect } from 'react';
import type { ContentProviderProps } from './ContentContext.types';
import { ContentContext as Content, DISPLAY_NAME, useContent } from './ContentContext';
import { useTranslation } from 'react-i18next';

// Mapping from simple i18n codes to full locale codes
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

// Component to sync ContentProvider language with i18n on startup and initialize theme
const LanguageSync = () => {
  const { i18n } = useTranslation();
  const { setCurrentLanguage, setTheme } = useContent();

  useEffect(() => {
    // On startup: Convert i18n's simple code to full locale for ContentProvider
    const currentI18nLanguage = i18n.language; // e.g., 'es'
    const fullLocale = getFullLocaleFromSimpleCode(currentI18nLanguage); // e.g., 'es-ES'
    setCurrentLanguage(fullLocale);

    // Initialize theme from localStorage
    const storedTheme = localStorage.getItem('touch-app-theme') as 'light' | 'dark';
    if (storedTheme && (storedTheme === 'light' || storedTheme === 'dark')) {
      setTheme(storedTheme);
    }

    // Listen for i18n language changes and sync ContentProvider
    const handleLanguageChanged = (lng: string) => {
      const fullLocale = getFullLocaleFromSimpleCode(lng);
      setCurrentLanguage(fullLocale);
    };

    i18n.on('languageChanged', handleLanguageChanged);

    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n, setCurrentLanguage, setTheme]);

  return null; // This component doesn't render anything
};

export const ContentProvider = ({ initialValue, children }: ContentProviderProps) => {
  return (
    <Content.Provider initialValue={initialValue}>
      <LanguageSync />
      {children}
    </Content.Provider>
  );
};

ContentProvider.displayName = `${DISPLAY_NAME}Provider`;

// Export helper functions for use in components
export { getFullLocaleFromSimpleCode, getSimpleCodeFromLocale };
