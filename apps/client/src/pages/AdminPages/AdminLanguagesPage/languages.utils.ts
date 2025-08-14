import type { LanguageInfo } from '@workspace/i18n/config';

// Interface for the search component results (matches LanguageOption from SearchableLanguageInput)
interface LanguageOption {
  languageCode: string;
  languageName: string;
  countryName: string;
  countryCode: string;
  flagUrl: string;
  nativeName?: string;
  emoji?: string;
}

// Utility function to convert search results to LanguageInfo
export const convertSearchResultToLanguageInfo = (searchResult: LanguageOption): LanguageInfo => {
  // Convert 3-letter ISO codes to proper locale format (fra -> fr-FR)
  const convertLanguageCode = (langCode: string, countryCode: string): string => {
    const iso3to2Map: Record<string, string> = {
      fra: 'fr', // French
      eng: 'en', // English
      spa: 'es', // Spanish
      deu: 'de', // German
      ita: 'it', // Italian
      por: 'pt', // Portuguese
      nld: 'nl', // Dutch
      rus: 'ru', // Russian
      jpn: 'ja', // Japanese
      kor: 'ko', // Korean
      chi: 'zh', // Chinese
      ara: 'ar', // Arabic
      cat: 'ca', // Catalan
    };

    // If it's a 3-letter code, convert to 2-letter and add country
    if (iso3to2Map[langCode.toLowerCase()]) {
      const twoLetterCode = iso3to2Map[langCode.toLowerCase()];
      return `${twoLetterCode}-${countryCode.toUpperCase()}`;
    }

    // If it's already a 2-letter code, add country
    if (langCode.length === 2) {
      return `${langCode.toLowerCase()}-${countryCode.toUpperCase()}`;
    }

    // Fallback to original code
    return langCode;
  };

  const properLanguageCode = convertLanguageCode(searchResult.languageCode, searchResult.countryCode);

  return {
    code: properLanguageCode as any,
    label: searchResult.languageName,
    nativeLabel: searchResult.nativeName || searchResult.languageName,
    flag: searchResult.flagUrl,
    countryName: searchResult.countryName,
    countryCode: searchResult.countryCode,
    isActive: true, // New languages are active by default
    isDefault: false,
    sortOrder: 0,
  };
};
