import fs from 'node:fs';
import path from 'node:path';

// Define the structure of the original ISO language data
interface ISOLanguageOriginal {
  '639-1': string;
  '639-2': string;
  '639-2/B'?: string; // Optional B variant
  'family': string;
  'name': string;
  'nativeName': string;
  'wikiUrl': string;
}

// Define the slimmed-down structure for our needs
interface ISOLanguageSlimmed {
  '639-1': string;
  '639-2': string;
  'name': string;
  'nativeName': string;
}

// Type for the original data structure
type ISOLanguagesOriginal = Record<string, ISOLanguageOriginal>;

// Type for our slimmed-down data structure
type ISOLanguagesSlimmed = Record<string, ISOLanguageSlimmed>;

/**
 * Process the ISO 639-1 JSON file and create a slimmed-down version
 * Removes: "639-2/B", "family", "wikiUrl"
 * Keeps: "639-1", "639-2", "name", "nativeName"
 */
export function processISOLanguages(): void {
  try {
    // Read the original ISO file from project root (go up from scripts directory)
    const projectRoot = path.resolve(process.cwd(), '..');
    const isoFilePath = path.join(projectRoot, 'iso_639-1.json');

    if (!fs.existsSync(isoFilePath)) {
      throw new Error('iso_639-1.json not found in project root');
    }

    const originalData: ISOLanguagesOriginal = JSON.parse(fs.readFileSync(isoFilePath, 'utf-8'));

    // Process and slim down the data
    const slimmedData: ISOLanguagesSlimmed = {};

    for (const [langCode, langData] of Object.entries(originalData)) {
      slimmedData[langCode] = {
        '639-1': langData['639-1'],
        '639-2': langData['639-2'],
        'name': langData.name,
        'nativeName': langData.nativeName,
      };
    }

    // Create output directory if it doesn't exist
    const outputDir = path.join(process.cwd(), 'packages', 'i18n', 'src');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write the slimmed-down version
    const outputPath = path.join(outputDir, 'iso-languages-slim.json');
    fs.writeFileSync(outputPath, JSON.stringify(slimmedData, null, 2), 'utf-8');

    console.log(`✅ Processed ${Object.keys(slimmedData).length} languages`);
    console.log(`📄 Slimmed ISO languages saved to: ${outputPath}`);

    // Log some statistics
    const originalSize = fs.statSync(isoFilePath).size;
    const slimmedSize = fs.statSync(outputPath).size;
    const reduction = (((originalSize - slimmedSize) / originalSize) * 100).toFixed(1);

    console.log(`📊 File size reduced by ${reduction}% (${originalSize} → ${slimmedSize} bytes)`);
  } catch (error) {
    console.error('❌ Error processing ISO languages:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  processISOLanguages();
}
