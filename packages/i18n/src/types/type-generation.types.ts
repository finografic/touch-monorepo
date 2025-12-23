/**
 * Type generation configuration types
 * Used for configuring how types are generated from i18n config
 */

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
