import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { I18nConfig } from '../config';

/**
 * Generate TypeScript types for i18n
 * @param config - I18n configuration
 * @param rootDir - Root directory for resolving paths
 */
export async function generateTypes(config: I18nConfig, rootDir: string): Promise<void> {
  try {
    // Generate the TypeScript file content
    const typeFileContent = generateTypeFileContent(config);
    const typesPath = join(rootDir, config.typeGeneration.outputPath);
    writeFileSync(typesPath, typeFileContent, 'utf-8');
    console.log(`✅ Generated language types at: ${typesPath}`);

    // Generate constants file
    const constantsPath = join(rootDir, 'config', 'generated', 'i18n', 'constants.generated.ts');
    const constantsContent = generateConstantsContent(config);
    writeFileSync(constantsPath, constantsContent, 'utf-8');
    console.log(`📝 Generated constants at: ${constantsPath}`);
  } catch (error) {
    console.error('❌ Error generating language types:', error);
    throw error;
  }
}

function generateTypeFileContent(config: I18nConfig): string {
  const { languageMapping, supportedCountries } = config.typeGeneration;
  const countryUnion = supportedCountries.map((code) => `'${code}'`).join(' | ');

  return `/**
 * Language and Internationalization Types
 * 🤖 AUTO-GENERATED - DO NOT EDIT MANUALLY
 * Generated on ${new Date().toISOString()}
 */

// All supported country codes (ISO 3166-1 alpha-2)
export type CCA2 = ${countryUnion};

/**
 * Controlled mapping from 3-character language codes (ISO 639-3)
 * to 2-character language codes (ISO 639-1)
 */
export const LANG_CODE_MAPPING = {
${Object.entries(languageMapping)
  .map(([code3, code2]) => {
    const lang = config.languages.find((l) => l.iso3 === code3);
    return `  '${code3}': '${code2}', // ${lang?.name || 'Unknown'}`;
  })
  .join('\n')}
} as const;

// Extract types from the controlled mapping
export type LangCode3 = keyof typeof LANG_CODE_MAPPING;
export type LangCode2 = typeof LANG_CODE_MAPPING[LangCode3];

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
  return isSupportedLangCode2(lang) && supportedCountries.includes(country.toUpperCase());
};`;
}

function generateConstantsContent(config: I18nConfig): string {
  const { languageMapping, supportedCountries, defaultCountries } = config.typeGeneration;

  return `/**
 * Generated Constants for i18n
 * 🤖 AUTO-GENERATED - DO NOT EDIT MANUALLY
 * Generated on ${new Date().toISOString()}
 */

import type { RegionLocale, LangCode2, CountryCode } from './types';

// Supported locales for the application
export const SUPPORTED_LOCALES: readonly RegionLocale[] = [
${Object.values(languageMapping)
  .flatMap((iso2) => supportedCountries.map((country) => `  '${iso2}-${country}' as RegionLocale,`))
  .join('\n')}
] as const;

// Primary locale for each language
export const PRIMARY_LOCALES: Record<LangCode2, RegionLocale> = {
${Object.entries(defaultCountries)
  .map(([iso2, country]) => `  '${iso2}': '${iso2}-${country}',`)
  .join('\n')}
} as const;

// All available country codes
export const AVAILABLE_COUNTRIES: readonly CountryCode[] = [
${supportedCountries.map((code) => `  '${code}',`).join('\n')}
] as const;`;
}
