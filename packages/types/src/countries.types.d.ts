/**
 * Comprehensive country model based on RestCountries API v3.1
 * Includes all fields needed for language filtering and selection
 */
export interface CountryModel {
    name: {
        common: string;
        official: string;
        nativeName?: Record<string, {
            official: string;
            common: string;
        }>;
    };
    cca2: string;
    cca3: string;
    ccn3?: string;
    languages?: Record<string, string>;
    translations?: Record<string, {
        official: string;
        common: string;
    }>;
    region: string;
    subregion?: string;
    continents: string[];
    latlng?: [number, number];
    area?: number;
    landlocked?: boolean;
    borders?: string[];
    independent?: boolean;
    status: string;
    unMember: boolean;
    population: number;
    flag?: string;
    flags: {
        png: string;
        svg: string;
        alt?: string;
    };
    coatOfArms?: {
        png?: string;
        svg?: string;
    };
    currencies?: Record<string, {
        name: string;
        symbol?: string;
    }>;
    gini?: Record<string, number>;
    idd?: {
        root?: string;
        suffixes?: string[];
    };
    callingCodes?: string[];
    tld?: string[];
    postalCode?: {
        format?: string;
        regex?: string;
    };
    car?: {
        signs?: string[];
        side: 'left' | 'right';
    };
    timezones?: string[];
    startOfWeek?: 'monday' | 'sunday' | 'saturday';
    fifa?: string;
    cioc?: string;
    capital?: string[];
    capitalInfo?: {
        latlng?: [number, number];
    };
    demonyms?: {
        eng?: {
            f: string;
            m: string;
        };
        [key: string]: {
            f: string;
            m: string;
        } | undefined;
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
        nativeName?: Record<string, {
            official: string;
            common: string;
        }>;
    };
    cca2: string;
    languages?: Record<string, string>;
    flag?: string;
    flags: {
        png: string;
        svg: string;
        alt?: string;
    };
}
/**
 * Type guard to check if a country has extended properties
 */
export declare function isCountryModel(country: CountryBasic | CountryModel): country is CountryModel;
/**
 * Convert basic country to model with safe defaults
 */
export declare function toCountryModel(country: CountryBasic): CountryModel;
//# sourceMappingURL=countries.types.d.ts.map