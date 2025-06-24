import fs from 'node:fs';
import path from 'node:path';

// Define the structure of the ISO language data
interface ISOLanguage {
  '639-1': string;
  '639-2': string;
  '639-2/B'?: string; // Optional B variant
  'family': string;
  'name': string;
  'nativeName': string;
  'wikiUrl': string;
}

// Type for the ISO data structure
type ISOLanguages = Record<string, ISOLanguage>;

// Type for our comprehensive mapping
type ComprehensiveLanguageMapping = Record<string, string>;

/**
 * Generate comprehensive language mapping from ISO 639-1 data
 * Creates mapping from 3-character codes (ISO 639-2) to 2-character codes (ISO 639-1)
 * This enables dynamic language support in the i18n system
 */
export function generateComprehensiveLanguageMapping(): void {
  try {
    // Read the original ISO file from project root
    const isoFilePath = path.join(process.cwd(), 'iso_639-1.json');

    if (!fs.existsSync(isoFilePath)) {
      throw new Error('iso_639-1.json not found in project root');
    }

    const isoData: ISOLanguages = JSON.parse(fs.readFileSync(isoFilePath, 'utf-8'));

    // Generate comprehensive mapping
    const comprehensiveMapping: ComprehensiveLanguageMapping = {};

    // Track statistics
    let totalMappings = 0;
    let duplicateBVariants = 0;

    for (const [, langData] of Object.entries(isoData)) {
      // Primary mapping: 639-2 → 639-1
      const iso639_2 = langData['639-2'];
      const iso639_1 = langData['639-1'];

      comprehensiveMapping[iso639_2] = iso639_1;
      totalMappings++;

      // Handle B variant if it exists (some languages have both T and B codes)
      if (langData['639-2/B']) {
        const iso639_2B = langData['639-2/B'];

        // Only add B variant if it's different from the main 639-2 code
        if (iso639_2B !== iso639_2) {
          comprehensiveMapping[iso639_2B] = iso639_1;
          duplicateBVariants++;
          totalMappings++;
        }
      }
    }

    // Generate TypeScript constants file
    const tsContent = generateTypeScriptFile(comprehensiveMapping, {
      totalLanguages: Object.keys(isoData).length,
      totalMappings,
      duplicateBVariants,
    });

    // Create output directory if it doesn't exist
    const outputDir = path.join(process.cwd(), 'packages', 'i18n', 'src');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write the comprehensive mapping file
    const outputPath = path.join(outputDir, 'comprehensive-language-mapping.generated.ts');
    fs.writeFileSync(outputPath, tsContent, 'utf-8');

    console.log('🌍 COMPREHENSIVE LANGUAGE MAPPING GENERATED');
    console.log(`📄 File saved to: ${outputPath}`);
    console.log(`📊 Statistics:`);
    console.log(`   • ${Object.keys(isoData).length} ISO 639-1 languages processed`);
    console.log(`   • ${totalMappings} total mappings created`);
    console.log(`   • ${duplicateBVariants} additional B-variant mappings`);
    console.log(`   • Supports ${Object.keys(comprehensiveMapping).length} different 3-char codes`);

    // Show sample mappings
    console.log('\n🔗 Sample mappings:');
    const sampleMappings = Object.entries(comprehensiveMapping).slice(0, 10);
    sampleMappings.forEach(([code3, code2]) => {
      const langName = Object.values(isoData).find((lang) => lang['639-1'] === code2)?.name || 'Unknown';
      console.log(`   • ${code3} → ${code2} (${langName})`);
    });
  } catch (error) {
    console.error('❌ Error generating comprehensive language mapping:', error);
    process.exit(1);
  }
}

/**
 * Generate TypeScript file content with the comprehensive mapping
 */
function generateTypeScriptFile(
  mapping: ComprehensiveLanguageMapping,
  stats: { totalLanguages: number; totalMappings: number; duplicateBVariants: number },
): string {
  const timestamp = new Date().toISOString();
  const mappingEntries = Object.entries(mapping)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([code3, code2]) => `  '${code3}': '${code2}',`)
    .join('\n');

  return `/**
 * COMPREHENSIVE LANGUAGE MAPPING
 *
 * Auto-generated from ISO 639-1 standard data
 * Generated: ${timestamp}
 *
 * This mapping enables dynamic language support in the i18n system.
 * Maps 3-character language codes (ISO 639-2) to 2-character codes (ISO 639-1).
 *
 * Statistics:
 * - ${stats.totalLanguages} ISO 639-1 languages processed
 * - ${stats.totalMappings} total mappings created
 * - ${stats.duplicateBVariants} additional B-variant mappings
 *
 * Usage:
 * \`\`\`typescript
 * import { COMPREHENSIVE_LANG_CODE_MAPPING } from './comprehensive-language-mapping.generated';
 *
 * const twoCharCode = COMPREHENSIVE_LANG_CODE_MAPPING['spa']; // 'es'
 * const germanCode = COMPREHENSIVE_LANG_CODE_MAPPING['deu']; // 'de'
 * \`\`\`
 *
 * @see https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
 * @see https://en.wikipedia.org/wiki/List_of_ISO_639-2_codes
 */

// Type for 3-character language codes (ISO 639-2)
export type ISO639_2Code = keyof typeof COMPREHENSIVE_LANG_CODE_MAPPING;

// Type for 2-character language codes (ISO 639-1)
export type ISO639_1Code = typeof COMPREHENSIVE_LANG_CODE_MAPPING[ISO639_2Code];

/**
 * Comprehensive mapping from 3-character language codes to 2-character codes
 * Covers all ISO 639-1 languages plus their B-variants where applicable
 */
export const COMPREHENSIVE_LANG_CODE_MAPPING = {
${mappingEntries}
} as const;

/**
 * Get 2-character language code from 3-character code
 * @param code3 - 3-character language code (ISO 639-2)
 * @returns 2-character language code (ISO 639-1) or undefined if not found
 */
export function get2CharCode(code3: string): string | undefined {
  return COMPREHENSIVE_LANG_CODE_MAPPING[code3 as ISO639_2Code];
}

/**
 * Get all supported 3-character language codes
 * @returns Array of all supported 3-character codes
 */
export function getAllSupported3CharCodes(): ISO639_2Code[] {
  return Object.keys(COMPREHENSIVE_LANG_CODE_MAPPING) as ISO639_2Code[];
}

/**
 * Get all supported 2-character language codes
 * @returns Array of all supported 2-character codes (unique)
 */
export function getAllSupported2CharCodes(): ISO639_1Code[] {
  const codes = Object.values(COMPREHENSIVE_LANG_CODE_MAPPING);
  return [...new Set(codes)] as ISO639_1Code[];
}

/**
 * Check if a 3-character language code is supported
 * @param code3 - 3-character language code to check
 * @returns true if supported, false otherwise
 */
export function isSupported3CharCode(code3: string): code3 is ISO639_2Code {
  return code3 in COMPREHENSIVE_LANG_CODE_MAPPING;
}

/**
 * Check if a 2-character language code is supported
 * @param code2 - 2-character language code to check
 * @returns true if supported, false otherwise
 */
export function isSupported2CharCode(code2: string): code2 is ISO639_1Code {
  return Object.values(COMPREHENSIVE_LANG_CODE_MAPPING).includes(code2 as ISO639_1Code);
}
`;
}

// Run if called directly (ES module compatible)
if (import.meta.url === `file://${process.argv[1]}`) {
  generateComprehensiveLanguageMapping();
}
