/**
 * @workspace/i18n - Type Definitions
 *
 * This file contains all the types that are safe to use in both Node.js and browser environments.
 */

/**
 * Language configuration for a specific locale
 */
export interface LanguageConfig {
  /** ISO 639-2 (3-char) code */
  iso3: string;
  /** ISO 639-1 (2-char) code */
  iso2: string;
  /** Display name in English */
  name: string;
  /** Native name (in the language itself) */
  nativeName: string;
  /** Optional sort order */
  sortOrder?: number;
  /** Whether this is a default language */
  isDefault?: boolean;
}

/**
 * Configuration for type generation
 */
export interface TypeGenerationConfig {
  /** Where to output the generated types */
  outputPath: string;
  /** Custom language mappings (3-char to 2-char) */
  languageMapping: Record<string, string>;
  /** Supported country codes (ISO 3166-1 alpha-2) */
  supportedCountries: string[];
  /** Default country code for each language */
  defaultCountries: Record<string, string>;
}

/**
 * Main i18n configuration interface
 */
export interface I18nConfig {
  /** Supported languages configuration */
  languages: LanguageConfig[];
  /** Type generation settings */
  typeGeneration: TypeGenerationConfig;
  /** Optional custom validation rules */
  validation?: {
    /** Whether to strictly validate language codes */
    strict?: boolean;
    /** Additional allowed language codes */
    additionalCodes?: string[];
  };
}

/**
 * Language display information
 */
export interface LanguageInfo {
  id?: string;
  code: string;
  label: string;
  nativeLabel: string;
  flag: string;
  emoji?: string;
  isActive?: boolean;
  isDefault?: boolean;
  sortOrder?: number;
  countryName?: string;
  countryCode?: string;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}
