/**
 * Comprehensive country model based on RestCountries API v3.1
 * Includes all fields needed for language filtering and selection
 */
export interface CountryModel {
  // Basic identification
  name: {
    common: string;
    official: string;
    nativeName?: Record<string, { official: string; common: string }>;
  };

  // ISO codes
  cca2: string; // ISO 3166-1 alpha-2 (e.g., "US", "FR")
  cca3: string; // ISO 3166-1 alpha-3 (e.g., "USA", "FRA")
  ccn3?: string; // ISO 3166-1 numeric code

  // Languages and localization
  languages?: Record<string, string>; // Language codes to names mapping
  translations?: Record<
    string,
    {
      // Country name translations
      official: string;
      common: string;
    }
  >;

  // Geographic information
  region: string; // UN demographic region (e.g., "Europe", "Asia")
  subregion?: string; // UN demographic subregion
  continents: string[]; // List of continents
  latlng?: [number, number]; // Latitude and longitude
  area?: number; // Geographical size in km²
  landlocked?: boolean; // Whether country is landlocked
  borders?: string[]; // Border countries (cca3 codes)

  // Political status
  independent?: boolean; // ISO 3166-1 independence status
  status: string; // ISO 3166-1 assignment status
  unMember: boolean; // UN Member status

  // Population and demographics
  population: number; // Country population

  // Visual elements
  flag?: string; // Flag emoji
  flags: {
    png: string; // PNG flag URL
    svg: string; // SVG flag URL
    alt?: string; // Alt text for flag
  };
  coatOfArms?: {
    png?: string;
    svg?: string;
  };

  // Economic data
  currencies?: Record<
    string,
    {
      name: string;
      symbol?: string;
    }
  >;
  gini?: Record<string, number>; // Worldbank Gini index

  // Communication
  idd?: {
    // International dialing
    root?: string;
    suffixes?: string[];
  };
  callingCodes?: string[]; // Legacy calling codes

  // Internet and postal
  tld?: string[]; // Top level domains
  postalCode?: {
    format?: string;
    regex?: string;
  };

  // Transportation
  car?: {
    signs?: string[]; // Car distinguised signs
    side: 'left' | 'right'; // Driving side
  };

  // Cultural
  timezones?: string[]; // Timezone names
  startOfWeek?: 'monday' | 'sunday' | 'saturday';

  // Sports and organizations
  fifa?: string; // FIFA code
  cioc?: string; // International Olympic Committee code

  // Capital information
  capital?: string[];
  capitalInfo?: {
    latlng?: [number, number];
  };

  // Demographics
  demonyms?: {
    eng?: {
      f: string; // Female demonym
      m: string; // Male demonym
    };
    [key: string]:
      | {
          f: string;
          m: string;
        }
      | undefined;
  };

  // Maps
  maps?: {
    googleMaps?: string;
    openStreetMaps?: string;
  };

  // Alternative spellings
  altSpellings?: string[];
}

/**
 * Simplified country interface for basic language selection
 * Compatible with existing Country interface
 */
export interface CountryBasic {
  name: {
    common: string;
    official: string;
    nativeName?: Record<string, { official: string; common: string }>;
  };
  cca2: string;
  languages?: Record<string, string>;
  flag?: string;
  flags: { png: string; svg: string; alt?: string };
}

/**
 * Type guard to check if a country has extended properties
 */
export function isCountryModel(country: CountryBasic | CountryModel): country is CountryModel {
  return 'population' in country && 'region' in country && 'unMember' in country;
}

/**
 * Convert basic country to model with safe defaults
 */
export function toCountryModel(country: CountryBasic): CountryModel {
  if (isCountryModel(country)) {
    return country;
  }

  // Return with safe defaults for missing fields
  return {
    ...country,
    cca3: `${country.cca2}X`, // Fallback
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
}
