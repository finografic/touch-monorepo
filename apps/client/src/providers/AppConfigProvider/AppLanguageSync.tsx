import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { RegionLocale } from '@workspace/i18n';

import { useGetSupportedLanguages } from 'queries/supported-languages';
import i18n from '../../i18n.config';

import type { LanguageInfo } from 'types/models/supported-language.model';
import { LOCALE_MAPPING } from 'config/app/i18n.config';
import { useAppConfig } from './AppConfigContext';

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

      // Dynamically update i18n supported languages with DB data
      const dbSupportedLngs = languagesData.map(lang => lang.isoCode);

      // Update i18n configuration with dynamic supported languages
      i18n.options.supportedLngs = dbSupportedLngs;

      // Update the language detection converter to handle new languages
      const convertDetectedLanguage = (lng: string): RegionLocale => {
        const lower = lng.toLowerCase();

        // First check if it's an exact match with DB languages
        const exactMatch = languagesData.find(lang =>
          lang.isoCode.toLowerCase() === lower ||
          lang.isoCode.split('-')[0] === lower
        );
        if (exactMatch) return exactMatch.isoCode as RegionLocale;

        // Fallback to existing logic for backwards compatibility
        if (lower.startsWith('es')) return 'es-ES';
        if (lower.startsWith('en')) return 'en-GB';
        if (lower.startsWith('ca')) return 'ca-ES';

        // Default fallback
        return languagesData[0]?.isoCode as RegionLocale || 'es-ES';
      };

      // Update the detection converter
      (i18n.options.detection as any).convertDetectedLanguage = convertDetectedLanguage;

      console.log('%c __LANG__ DYNAMIC UPDATE', 'color:orange', {
        dbSupportedLngs,
        currentI18nSupported: i18n.options.supportedLngs
      });
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
