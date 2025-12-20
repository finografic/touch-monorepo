import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppConfig } from './AppConfigContext';
import type { RegionLocale } from '@workspace/i18n';
import { LOCALE_MAPPING } from 'config/app/i18n.config';

const getFullLocaleFromSimpleCode = (simpleCode: string): RegionLocale => {
  return LOCALE_MAPPING[simpleCode as keyof typeof LOCALE_MAPPING] || (simpleCode as RegionLocale);
};

export const AppLanguageSync = () => {
  const { i18n } = useTranslation();
  const { setCurrentLanguage } = useAppConfig();

  useEffect(
    function initializeLanguageSync() {
      console.log('%c __LANG__', 'color:cyan', i18n);
      const currentI18nLanguage = i18n.language; // 'es-ES', normally
      const fullLocale = getFullLocaleFromSimpleCode(currentI18nLanguage); // NOTE: is 'es-ES', but failsafe
      setCurrentLanguage(fullLocale);

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
    [i18n, setCurrentLanguage],
  );

  return null;
};
