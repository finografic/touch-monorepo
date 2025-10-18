import type { CountryModel } from '@workspace/core/types';

import { useQuery } from '@tanstack/react-query';

import { CountryDto } from './country.dto';

/**
 * REST Countries API response type
 * Based on https://restcountries.com/#endpoints-filter-response
 */
interface RestCountriesResponse {
  name: {
    common: string;
    official: string;
    nativeName?: Record<string, { official: string; common: string }>;
  };
  cca2: string;
  cca3: string;
  languages?: Record<string, string>;
  flag: string;
  flags: {
    png: string;
    svg: string;
    alt?: string;
  };
  population: number;
  region: string;
  continents: string[];
  independent?: boolean;
  status: string;
  unMember: boolean;
  currencies?: Record<string, { name: string; symbol?: string }>;
  timezones: string[];
  capital?: string[];
  altSpellings: string[];
}

/**
 * Query keys for countries
 */
export const countriesKeys = {
  all: ['countries'] as const,
  filtered: (fields: string[]) => ['countries', 'filtered', fields] as const,
} as const;

/**
 * Fetch countries from REST Countries API
 * https://restcountries.com/v3.1/all?fields=name,cca2,cca3,languages,flag,flags,population,region,continents,independent,status,unMember,currencies,timezones,capital,altSpellings
 */
async function fetchCountries(): Promise<CountryModel[]> {
  // Fields we need for language filtering and display
  const fields = [
    'name',
    'cca2',
    'cca3',
    'languages',
    'flag',
    'flags',
    'population',
    'region',
    'continents',
    'independent',
    'status',
    'unMember',
    'currencies',
    'timezones',
    'capital',
    'altSpellings',
  ];

  const url = `https://restcountries.com/v3.1/all?fields=${fields.join(',')}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch countries: ${response.status} ${response.statusText}`);
  }

  const data: RestCountriesResponse[] = await response.json();

  // Transform REST Countries API response to our CountryModel format
  return data.map(
    (country): CountryModel => ({
      name: {
        common: country.name.common,
        official: country.name.official,
        nativeName: country.name.nativeName || {},
      },
      cca2: country.cca2,
      cca3: country.cca3,
      languages: country.languages || {},
      flag: country.flag,
      flags: {
        png: country.flags.png,
        svg: country.flags.svg,
        alt: country.flags.alt,
      },
      population: country.population,
      region: country.region,
      continents: country.continents,
      independent: country.independent ?? true,
      status: country.status,
      unMember: country.unMember,
      currencies: country.currencies || {},
      timezones: country.timezones,
      capital: country.capital || [],
      altSpellings: country.altSpellings,
    }),
  );
}

/**
 * React Query hook to fetch countries from REST Countries API
 */
export function useGetCountries() {
  return useQuery({
    queryKey: countriesKeys.all,
    queryFn: fetchCountries,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours - country data doesn't change often
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days - keep in cache for a week
  });
}

/**
 * Hook to get filtered countries suitable for language selection
 * Uses the DTO filtering logic with useQuery's select prop for efficient transformation
 */
export function useGetFilteredCountries() {
  return useQuery({
    queryKey: countriesKeys.filtered(['filtered']),
    queryFn: fetchCountries,
    select: (countries: CountryModel[]) =>
      countries.filter((country) => CountryDto.shouldIncludeInLanguageList(country)),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours - country data doesn't change often
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days - keep in cache for a week
  });
}
