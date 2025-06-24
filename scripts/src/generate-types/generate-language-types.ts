#!/usr/bin/env node

/**
 * Generate Language Types from RestCountries Data
 *
 * This script reads the restcountries JSON data and generates TypeScript types
 * for proper i18n type safety while eliminating the "cat" vs "ca" confusion.
 */

import { writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

// Configuration for supported languages
const SUPPORTED_LANGUAGES = {
  spa: { iso2: 'es', name: 'Spanish' },
  eng: { iso2: 'en', name: 'English' },
  cat: { iso2: 'ca', name: 'Catalan' }, // This will be our controlled mapping
  // Add more as needed:
  // 'fra': { iso2: 'fr', name: 'French' },
  // 'deu': { iso2: 'de', name: 'German' },
} as const;

interface RestCountriesEntry {
  cca2: string;
  languages?: Record<string, string>;
  name: {
    common: string;
    official: string;
  };
}

function generateLanguageTypes() {
  try {
    // Read the restcountries data
    // Adjust this path to match your actual data location
    const dataPath = join(process.cwd(), 'data', 'languages.data.min.json');

    let countriesData: RestCountriesEntry[];

    try {
      const rawData = readFileSync(dataPath, 'utf-8');
      countriesData = JSON.parse(rawData);
    } catch (_error) {
      console.warn('Could not read restcountries data, using fallback approach');
      // Fallback: generate from your existing cca2 constants
      countriesData = generateFallbackData();
    }

    // Extract all unique CCA2 codes
    const cca2Codes = [...new Set(countriesData.map((country) => country.cca2.toUpperCase()))].sort();

    // Generate the TypeScript file content
    const typeFileContent = generateTypeFileContent(cca2Codes);

    // Write to the types file
    const outputPath = join(process.cwd(), 'packages', 'types', 'src', 'language.types.ts');
    writeFileSync(outputPath, typeFileContent, 'utf-8');

    console.log(`✅ Generated language types with ${cca2Codes.length} country codes`);
    console.log(`📝 Written to: ${outputPath}`);

    // Generate constants file for i18n package
    const constantsContent = generateConstantsContent(cca2Codes);
    const constantsPath = join(process.cwd(), 'packages', 'i18n', 'src', 'constants.generated.ts');
    writeFileSync(constantsPath, constantsContent, 'utf-8');

    console.log(`📝 Generated constants at: ${constantsPath}`);
  } catch (error) {
    console.error('❌ Error generating language types:', error);
    process.exit(1);
  }
}

function generateFallbackData(): RestCountriesEntry[] {
  // Read from your existing cca2 constants file
  const cca2Path = join(
    process.cwd(),
    'apps',
    'client',
    'src',
    'components',
    'LanguageSelector',
    'languages',
    'cca2.constants.ts',
  );

  try {
    const cca2Content = readFileSync(cca2Path, 'utf-8');
    const cca2Match = cca2Content.match(/export const cca2Codes = \[([\s\S]*?)\] as const;/);

    if (cca2Match) {
      const codes = cca2Match[1]
        .split(',')
        .map((line) => line.trim().replace(/['"]/g, ''))
        .filter((code) => code.length === 2)
        .map((code) => code.toUpperCase());

      return codes.map((code) => ({
        cca2: code,
        name: { common: code, official: code },
      }));
    }
  } catch (_error) {
    console.warn('Could not read cca2 constants, using minimal fallback');
  }

  // Minimal fallback for core countries
  return [
    { cca2: 'ES', name: { common: 'Spain', official: 'Spain' } },
    { cca2: 'GB', name: { common: 'United Kingdom', official: 'United Kingdom' } },
    { cca2: 'US', name: { common: 'United States', official: 'United States' } },
  ];
}

function generateTypeFileContent(cca2Codes: string[]): string {
  const cca2Union = cca2Codes.map((code) => `'${code}'`).join(' | ');

  return `/**
 * Language and Internationalization Types
 * 🤖 AUTO-GENERATED - DO NOT EDIT MANUALLY
 * Generated from restcountries data on ${new Date().toISOString()}
 */

// All supported country codes (ISO 3166-1 alpha-2)
export type CCA2 = ${cca2Union};

/**
 * Controlled mapping from 3-character language codes (ISO 639-3/restcountries)
 * to 2-character language codes (ISO 639-1/i18n standard)
 *
 * Only add languages that your application actually supports
 */
export const LANG_CODE_MAPPING = {
${Object.entries(SUPPORTED_LANGUAGES)
  .map(([code3, { iso2, name }]) => `  '${code3}': '${iso2}', // ${name}`)
  .join('\n')}
} as const;

// Extract types from the controlled mapping
export type LangCode3 = keyof typeof LANG_CODE_MAPPING; // ${Object.keys(SUPPORTED_LANGUAGES)
    .map((k) => `"${k}"`)
    .join(' | ')}
export type LangCode2 = typeof LANG_CODE_MAPPING[LangCode3]; // ${Object.values(SUPPORTED_LANGUAGES)
    .map((v) => `"${v.iso2}"`)
    .join(' | ')}

// Legacy alias for backward compatibility
export type LangCode = LangCode2;

// Country/region codes (ISO 3166-1 alpha-2)
export type CountryCode = CCA2;

// Full locale format: language-COUNTRY (e.g., "es-ES", "en-GB", "ca-ES")
export type RegionLocale = \`\${LangCode2}-\${CCA2}\`;

// Language configuration mapping interface
export interface LanguageConfig {
  iso: CountryCode;
  nativeKey: LangCode3;
}

// Complete language configuration map
export type LanguageConfigMap = Record<RegionLocale, LanguageConfig>;

// Language display information
export interface LanguageInfo {
  id?: string;
  code: RegionLocale;
  label: string;
  nativeLabel: string;
  flag: string;
  emoji?: string;
  isActive?: boolean;
  isDefault?: boolean;
  sortOrder?: number;
  countryName?: string;
  countryCode?: CountryCode;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

// Props for language-related components
export interface LanguageSelectorProps {
  onLanguageChange?: (languageCode: RegionLocale) => void;
}

// Utility type helpers
export type SupportedLocale = RegionLocale;
export type LocaleOptions = Intl.DateTimeFormatOptions;
export type NumberFormatOptions = Intl.NumberFormatOptions;

// Helper function to get 2-char code from 3-char code
export const getLangCode2 = (langCode3: LangCode3): LangCode2 => {
  return LANG_CODE_MAPPING[langCode3];
};

// Helper function to check if a 3-char code is supported
export const isSupportedLangCode3 = (code: string): code is LangCode3 => {
  return code in LANG_CODE_MAPPING;
};

// Helper function to check if a 2-char code is supported
export const isSupportedLangCode2 = (code: string): code is LangCode2 => {
  return Object.values(LANG_CODE_MAPPING).includes(code as LangCode2);
};

// Validate locale format
export const isValidRegionLocale = (locale: string): locale is RegionLocale => {
  const parts = locale.split('-');
  if (parts.length !== 2) return false;

  const [lang, country] = parts;
  return isSupportedLangCode2(lang) && (country.toUpperCase() as any) in ({${cca2Codes.map((c) => `'${c}': true`).join(', ')}});
};
`;
}

function generateConstantsContent(cca2Codes: string[]): string {
  return `/**
 * Generated Constants for i18n
 * 🤖 AUTO-GENERATED - DO NOT EDIT MANUALLY
 * Generated on ${new Date().toISOString()}
 */

import type { RegionLocale, LangCode2, CountryCode } from '@touch-monorepo/types';

// Supported locales for the application
export const SUPPORTED_LOCALES: readonly RegionLocale[] = [
${Object.values(SUPPORTED_LANGUAGES)
  .flatMap(({ iso2 }) =>
    // Generate common locale combinations
    ['ES', 'GB', 'US'].map((country) => `  '${iso2}-${country}' as RegionLocale,`),
  )
  .join('\n')}
] as const;

// Primary locale for each language
export const PRIMARY_LOCALES: Record<LangCode2, RegionLocale> = {
${Object.values(SUPPORTED_LANGUAGES)
  .map(({ iso2 }) => {
    const primaryCountry = iso2 === 'es' ? 'ES' : iso2 === 'en' ? 'GB' : 'ES';
    return `  '${iso2}': '${iso2}-${primaryCountry}',`;
  })
  .join('\n')}
} as const;

// All available country codes
export const AVAILABLE_COUNTRIES: readonly CountryCode[] = [
${cca2Codes.map((code) => `  '${code}',`).join('\n')}
] as const;
`;
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  generateLanguageTypes();
}

export { generateLanguageTypes };
