import type { LanguageInfo } from '@workspace/config/i18n.config';

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
  // Can't delete if it's the default language
  if (language.isDefault) return false;

  // Can't delete if it's the only language
  if (totalLanguages <= 1) return false;

  return true;
};
