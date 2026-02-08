import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { RegionLocale } from '@workspace/i18n';

import { useGetSupportedLanguages } from 'queries/supported-languages';
import type { LanguageInfo } from 'types/models/supported-language.model';
import {
  CURRENT_LANGUAGE_STORAGE_KEY,
  LOCALE_MAPPING,
  SUPPORTED_LANGUAGES_STORAGE_KEY,
} from 'config/app/i18n.config';
import { useAppConfig } from './AppConfigContext';

const getFullLocaleFromSimpleCode = (code: string): RegionLocale =>
LOCALE_MAPPING[code as keyof typeof LOCALE_MAPPING] ||
(code as RegionLocale);


/** i18n locks supportedLngs at init; new languages require a reload to become selectable */
const hasNewLanguages = (
  fromApi: RegionLocale[],
  i18nSupportedLngs: false | readonly string[],
): boolean => {
  if (!i18nSupportedLngs || !Array.isArray(i18nSupportedLngs)) return false;
  const known = new Set(
    (i18nSupportedLngs as string[]).filter((l) => l !== 'cimode'),
  );
  return fromApi.some((code) => !known.has(code));
};

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
   * If API returned new languages not in i18n's init-time supportedLngs, reload so they become selectable
   */
  useEffect(function persistSupportedLanguages() {
    if (!languagesData || supportedLanguageCodes.length === 0) return;

    setSupportedLanguages(supportedLanguageCodes);
    setSupportedLanguagesFull(languagesData);

    localStorage.setItem(
      SUPPORTED_LANGUAGES_STORAGE_KEY,
      JSON.stringify(supportedLanguageCodes),
    );

    if (hasNewLanguages(supportedLanguageCodes, i18n.options.supportedLngs)) {
      const currentLanguage = i18n.language as string;
      const localeCode = getFullLocaleFromSimpleCode(currentLanguage);
      if (supportedLanguageCodes.includes(localeCode as RegionLocale)) {
        localStorage.setItem(CURRENT_LANGUAGE_STORAGE_KEY, localeCode);
      }
    }
  }, [
    languagesData,
    supportedLanguageCodes,
    setSupportedLanguages,
    setSupportedLanguagesFull,
    i18n.options.supportedLngs,
    i18n.language,
  ]);

  /**
   * 2️⃣ Sync context when language changes; persist current language for reload survival
   */
  useEffect(function syncContextWhenLanguage() {
    const applyLanguage = (lng: string) => {
      const full = getFullLocaleFromSimpleCode(lng);
      setCurrentLanguage(full);
      localStorage.setItem(CURRENT_LANGUAGE_STORAGE_KEY, full);
    };

    applyLanguage(i18n.language);

    i18n.on('languageChanged', applyLanguage);

    return () => {
      i18n.off('languageChanged', applyLanguage);
    };
  }, [i18n, setCurrentLanguage]);

  return null;
};
