import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppConfig } from './AppConfigContext';
import type { RegionLocale } from '@workspace/i18n';
import { LOCALE_MAPPING } from 'config/app/i18n.config';
import { useGetSupportedLanguages } from 'queries/supported-languages';
import type { LanguageInfo } from 'types/models/supported-language.model';

const getFullLocaleFromSimpleCode = (simpleCode: string): RegionLocale => {
  return LOCALE_MAPPING[simpleCode as keyof typeof LOCALE_MAPPING] || (simpleCode as RegionLocale);
};

export const AppLanguageSync = () => {
  const { i18n } = useTranslation();
  const { setCurrentLanguage, setSupportedLanguages, setSupportedLanguagesFull } = useAppConfig();

  // Fetch supported languages from database
  const { data: languagesData } = useGetSupportedLanguages();

  // Extract RegionLocale[] array from full SupportedLanguage[] objects
  const supportedLanguagesCodes = useMemo<RegionLocale[]>(() => {
    if (!languagesData) return [];
    return languagesData.map((language: LanguageInfo) => language.isoCode as RegionLocale);
  }, [languagesData]);

  // Sync supported languages to context
  useEffect(() => {
    if (languagesData && languagesData.length > 0) {
      setSupportedLanguages(supportedLanguagesCodes);
      setSupportedLanguagesFull(languagesData);
    }
  }, [languagesData, supportedLanguagesCodes, setSupportedLanguages, setSupportedLanguagesFull]);

  // Sync i18n language changes to context
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
