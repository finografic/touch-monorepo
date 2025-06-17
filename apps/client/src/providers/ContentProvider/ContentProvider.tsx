import type { ContentProviderProps } from './ContentContext.types';
import { ContentContext as Content, DISPLAY_NAME, useContent } from './ContentContext';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Component to sync ContentProvider language with i18n on startup
const LanguageSync = () => {
  const { i18n } = useTranslation();
  const { setCurrentLanguage } = useContent();

  useEffect(() => {
    // Sync ContentProvider with i18n's current language on startup
    const currentI18nLanguage = i18n.language;
    setCurrentLanguage(currentI18nLanguage);

    // Listen for i18n language changes and sync ContentProvider
    const handleLanguageChanged = (lng: string) => {
      setCurrentLanguage(lng);
    };

    i18n.on('languageChanged', handleLanguageChanged);

    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n, setCurrentLanguage]);

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
