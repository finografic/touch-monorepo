import type { CountryBasic, CountryModel } from '@workspace/core/types';

/**
 * Data Transfer Object utilities for country data transformation
 * Handles conversion between different country data formats
 */
export const CountryDto = {
  /**
   * Check if country data has RestCountries API fields needed for filtering
   */
  hasFilteringFields(country: CountryBasic | CountryModel): country is CountryModel {
    return 'population' in country && 'region' in country && 'unMember' in country;
  },

  /**
   * Transform basic country data to full model with safe defaults
   * Used when working with limited country data that needs filtering
   */
  toFilterableModel(country: CountryBasic): CountryModel {
    if (CountryDto.hasFilteringFields(country)) {
      return country;
    }

    // Transform with sensible defaults for filtering
    return {
      ...country,
      cca3: `${country.cca2}X`, // Fallback 3-letter code
      region: 'Unknown',
      continents: [],
      independent: true,
      status: 'officially-assigned',
      unMember: true,
      population: 1000000, // Default to 1M to pass population filters
      currencies: {},
      timezones: [],
      capital: [],
      altSpellings: [],
    };
  },

  /**
   * Batch transform array of countries to filterable models
   */
  toFilterableModels(countries: (CountryBasic | CountryModel)[]): CountryModel[] {
    return countries.map((country) => CountryDto.toFilterableModel(country));
  },

  /**
   * Extract language information from country for language selection
   */
  extractLanguageInfo(country: CountryModel) {
    return {
      countryCode: country.cca2,
      countryName: country.name.common,
      languages: country.languages || {},
      population: country.population,
      region: country.region,
      flag: country.flag,
      flagUrl: country.flags.svg || country.flags.png,
    };
  },

  /**
   * Check if country should be included in curated language list
   * Encapsulates the filtering business logic
   */
  shouldIncludeInLanguageList(country: CountryModel): boolean {
    // Population filter
    if (country.population < 500_000) {
      const linguisticallyImportant = ['IS', 'MT', 'LU', 'CY', 'ME', 'MK', 'SI', 'EE', 'LV', 'LT'];
      if (!linguisticallyImportant.includes(country.cca2)) {
        return false;
      }
    }

    // UN Member filter
    if (country.unMember === false) {
      const importantTerritories = ['TW', 'HK', 'MO'];
      if (!importantTerritories.includes(country.cca2)) {
        return false;
      }
    }

    // Regional filter
    if (country.region === 'Oceania') {
      const majorOceania = ['AU', 'NZ', 'PG', 'FJ', 'NC', 'PF'];
      return majorOceania.includes(country.cca2);
    }

    return true;
  },
} as const;
