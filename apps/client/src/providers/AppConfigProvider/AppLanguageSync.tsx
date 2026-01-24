import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { RegionLocale } from '@workspace/i18n';

import { useGetSupportedLanguages } from 'queries/supported-languages';
import type { LanguageInfo } from 'types/models/supported-language.model';
import { LOCALE_MAPPING } from 'config/app/i18n.config';
import { useAppConfig } from './AppConfigContext';

const STORAGE_KEY = 'supported-languages';

const getFullLocaleFromSimpleCode = (code: string): RegionLocale =>
  LOCALE_MAPPING[code as keyof typeof LOCALE_MAPPING] ||
  (code as RegionLocale);

export const AppLanguageSync = () => {
  const { i18n } = useTranslation();
  const {
    setCurrentLanguage,
    setSupportedLanguages,
    setSupportedLanguagesFull,
  } = useAppConfig();

  const { data: languagesData } = useGetSupportedLanguages();

  const supportedLanguageCodes = useMemo<RegionLocale[]>(() => {
    if (!languagesData) return [];
    return languagesData.map(
      (lang: LanguageInfo) => lang.isoCode as RegionLocale,
    );
  }, [languagesData]);

  /**
   * 1️⃣ Persist supported languages for NEXT BOOT
   */
  useEffect(function persistSupportedLanguages() {
    if (!languagesData || supportedLanguageCodes.length === 0) return;

    setSupportedLanguages(supportedLanguageCodes);
    setSupportedLanguagesFull(languagesData);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(supportedLanguageCodes));
  }, [languagesData, supportedLanguageCodes, setSupportedLanguages, setSupportedLanguagesFull]);

  /**
   * 2️⃣ Ensure resources reload AFTER language switch
   */
  useEffect(() => {
    const applyLanguage = async (lng: string) => {
      const full = getFullLocaleFromSimpleCode(lng);
      console.log('%c __LANG__ applying', 'color:lime', full);

      // Force backend reload for current language
      await i18n.reloadResources(full);
      setCurrentLanguage(full);
    };

    applyLanguage(i18n.language);

    i18n.on('languageChanged', applyLanguage);

    return () => {
      i18n.off('languageChanged', applyLanguage);
    };
  }, [i18n, setCurrentLanguage]);

  return null;
};
