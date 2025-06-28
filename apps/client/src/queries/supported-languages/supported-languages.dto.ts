import type { Country } from 'components/LanguageSelector/languages/country.types';
import type { SupportedLanguage } from 'types/models/supported-language.model';
import type { LanguageInfo } from 'types/language.types';
import type { SupportedLanguageInput } from './supported-languages.types';

/**
 * DTO for transforming between API and UI language data
 */
export const LanguageDto = {
  fromApi: (supportedLang: SupportedLanguage, flagUrl?: string): LanguageInfo => ({
    id: supportedLang.id,
    code: supportedLang.isoCode as LanguageInfo['code'],
    label: supportedLang.displayName,
    nativeLabel: supportedLang.nativeName,
    flag: flagUrl || '', // Will be populated by flag utility
    isActive: supportedLang.isActive,
    isDefault: supportedLang.isDefault,
    sortOrder: supportedLang.sortOrder,
    countryCode: supportedLang.flagCode || undefined,
    createdAt: supportedLang.createdAt,
    updatedAt: supportedLang.updatedAt,
  }),

  toApi: (languageInfo: LanguageInfo): SupportedLanguageInput => ({
    isoCode: languageInfo.code,
    nativeName: languageInfo.nativeLabel,
    displayName: languageInfo.label,
    flagCode: languageInfo.countryCode || null,
    isActive: languageInfo.isActive ?? true,
    isDefault: languageInfo.isDefault ?? false,
    sortOrder: languageInfo.sortOrder ?? 0,
  }),
};

/**
 * DTO for transforming arrays of language data
 */
export const LanguagesDto = {
  fromApi: (
    supportedLangs: SupportedLanguage[],
    getFlagUrl?: (flagCode: string | null) => string,
  ): LanguageInfo[] => supportedLangs.map((lang) => LanguageDto.fromApi(lang, getFlagUrl?.(lang.flagCode))),

  toApi: (languageInfos: LanguageInfo[]): SupportedLanguageInput[] =>
    languageInfos.map((lang) => LanguageDto.toApi(lang)),
};

/**
 * Factory for creating LanguageInfo from external country data
 * This is NOT a DTO - it's a builder/factory for combining datasets
 */
export const LanguageInfoFactory = {
  /**
   * Create LanguageInfo from Country data + language selection
   */
  fromCountryData: (country: Country, languageCode: string, languageName: string): LanguageInfo => ({
    code: languageCode as LanguageInfo['code'],
    label: languageName,
    nativeLabel: country.name.nativeName?.[languageCode]?.common || languageName,
    flag: country.flags.png,
    emoji: country.flag,
    countryName: country.name.common,
    countryCode: country.cca2,
  }),
};
