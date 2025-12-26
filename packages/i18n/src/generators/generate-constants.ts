import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { I18nConfig } from '../config';

/**
 * Generate TypeScript types for i18n
 * @param config - I18n configuration
 * @param rootDir - Root directory for resolving paths
 */
export async function generateConstants(config: I18nConfig, rootDir: string): Promise<void> {
  try {
    // Generate constants file
    const constantsContent = generateConstantsContent(config);
    const constantsPath = join(rootDir, config.typeGeneration.outputPath, 'constants.generated.ts');
    writeFileSync(constantsPath, constantsContent, 'utf-8');
    console.log(`📝 Generated constants at: ${constantsPath}`);
  } catch (error) {
    console.error('❌ Error generating language constants:', error);
    throw error;
  }
}

function generateConstantsContent(config: I18nConfig): string {
  const { languageMapping, supportedCountries, defaultCountries } = config.typeGeneration;

  return `/**
 * Generated Constants for i18n
 * 🤖 AUTO-GENERATED - DO NOT EDIT MANUALLY
 * Generated on ${new Date().toLocaleString('en-US', {
   year: 'numeric',
   month: 'short',
 })}
 */

import type { RegionLocale, LangCode2, CountryCode } from './language.types';

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
