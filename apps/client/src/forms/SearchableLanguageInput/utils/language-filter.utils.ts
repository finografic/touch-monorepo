import { CountryDto } from 'queries/countries/country.dto';
import type { CountryBasic, CountryModel } from '../../../../../../packages/types/src/countries.types';

/**
 * Filter countries to a manageable list of ~80-100 options
 * Prioritizes major languages and eliminates obscure variants
 */
export function filterSignificantLanguages(countries: (CountryBasic | CountryModel)[]): CountryModel[] {
  // Transform all countries to CountryModel format using DTO
  const countryModels = CountryDto.toFilterableModels(countries);

  // Apply filtering logic using DTO business rules
  return countryModels.filter((country) => CountryDto.shouldIncludeInLanguageList(country));
}

/**
 * Further prioritize languages by global speaker count and practical importance
 */
export function prioritizeByLanguageImportance(countries: CountryModel[]): CountryModel[] {
  // Languages ranked by global importance (speakers + economic importance)
  const languagePriority: Record<string, number> = {
    en: 1, // English
    zh: 2, // Chinese
    hi: 3, // Hindi
    es: 4, // Spanish
    fr: 5, // French
    ar: 6, // Arabic
    bn: 7, // Bengali
    pt: 8, // Portuguese
    ru: 9, // Russian
    ur: 10, // Urdu
    id: 11, // Indonesian
    de: 12, // German
    ja: 13, // Japanese
    sw: 14, // Swahili
    mr: 15, // Marathi
    te: 16, // Telugu
    tr: 17, // Turkish
    ta: 18, // Tamil
    vi: 19, // Vietnamese
    ko: 20, // Korean
    it: 21, // Italian
    th: 22, // Thai
    gu: 23, // Gujarati
    pl: 24, // Polish
    uk: 25, // Ukrainian
  };

  return countries.sort((a, b) => {
    const aLanguages = Object.keys(a.languages || {});
    const bLanguages = Object.keys(b.languages || {});

    const aPriority = Math.min(...aLanguages.map((lang) => languagePriority[lang] || 999));
    const bPriority = Math.min(...bLanguages.map((lang) => languagePriority[lang] || 999));

    return aPriority - bPriority;
  });
}

/**
 * Main function to get curated language list
 * Combines filtering and prioritization
 */
export function getCuratedLanguageList(countries: (CountryBasic | CountryModel)[]): CountryModel[] {
  const filtered = filterSignificantLanguages(countries);
  const prioritized = prioritizeByLanguageImportance(filtered);

  // Take top 100 to keep it manageable
  return prioritized.slice(0, 100);
}
