/**
 * Comprehensive country model based on RestCountries API v3.1
 * Includes all fields needed for language filtering and selection
 */
export interface CountryModel {
  name: {
    common: string;
    official: string;
    nativeName?: Record<string, { official: string; common: string }>;
  };

  // ISO codes
  cca2: string; // ISO 3166-1 alpha-2 (e.g., "US", "FR")
  cca3: string; // ISO 3166-1 alpha-3 (e.g., "USA", "FRA")
  ccn3?: string; // ISO 3166-1 numeric code

  languages?: Record<string, string>; // Language codes to names mapping
  translations?: Record<
    string,
    {
      official: string;
      common: string;
    }
  >;

  // Geographic information
  region: string; // UN demographic region (e.g., "Europe", "Asia")
  subregion?: string; // UN demographic subregion
  continents: string[];
  latlng?: [number, number];
  area?: number; // Geographical size in km²
  landlocked?: boolean;
  borders?: string[]; // Border countries (cca3 codes)

  // Political status
  independent?: boolean; // ISO 3166-1 independence status
  status: string; // ISO 3166-1 assignment status
  unMember: boolean;

  population: number;

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

  currencies?: Record<
    string,
    {
      name: string;
      symbol?: string;
    }
  >;
  gini?: Record<string, number>; // Worldbank Gini index

  // Communication & International dialing
  idd?: {
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
    signs?: string[];
    side: 'left' | 'right'; // Driving side
  };

  // Cultural
  timezones?: string[];
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
      f: string;
      m: string;
    };
    [key: string]:
      | {
          f: string;
          m: string;
        }
      | undefined;
  };

  maps?: {
    googleMaps?: string;
    openStreetMaps?: string;
  };

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
