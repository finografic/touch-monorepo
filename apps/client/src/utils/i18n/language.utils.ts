// import type { LanguageInfo } from '@workspace/config/i18n.config';
import type { LanguageInfo } from '@workspace/i18n/types';

/**
 * Utility to check if a language is the default
 */
export const isDefaultLanguage = (language: LanguageInfo): boolean => {
  return language.isDefault === true;
};

/**
 * Utility to check if a language can be deleted
 */
export const canDeleteLanguage = (language: LanguageInfo, totalLanguages: number): boolean => {
  if (language.isDefault) return false;

  if (totalLanguages <= 1) return false;

  return true;
};
