import { db } from 'db';
import { drink_types } from 'db/schemas/drink_types.schema';
import { drink_subtypes } from 'db/schemas/drink_subtypes.schema';
import { volumes } from 'db/schemas/volumes.schema';
import { container_types } from 'db/schemas/container_types.schema';
import { eq } from 'drizzle-orm';

// Rate limiting configuration to avoid API limits
const TRANSLATION_DELAY_MS = 1000; // 1 second between translations
const BATCH_SIZE = 3; // Process records in small batches to manage memory

/**
 * Initialize new language key in all existing translations JSON
 * This should be called when a new language is added, before auto-translation
 */
export async function initializeNewLanguageInTranslations(languageCode: string): Promise<void> {
  console.log(`🔧 Initializing language key "${languageCode}" in all existing translations...`);

  try {
    // Get all translatable entities
    const entities = await db.query.translatable_entities.findMany({
      where: (fields, operators) => operators.eq(fields.isActive, true),
    });

    for (const entity of entities) {
      console.log(`📝 Initializing ${entity.tableName}...`);

      switch (entity.tableName) {
        case 'drink_types':
          await initializeDrinkTypes(languageCode);
          break;
        case 'drink_subtypes':
          await initializeDrinkSubtypes(languageCode);
          break;
        case 'volumes':
          await initializeVolumes(languageCode);
          break;
        case 'container_types':
          await initializeContainerTypes(languageCode);
          break;
        default:
          console.warn(`⚠️ Unknown table: ${entity.tableName}`);
      }
    }

    console.log(`✅ Language key "${languageCode}" initialized in all translations`);
  } catch (error) {
    console.error(`❌ Failed to initialize language key "${languageCode}":`, error);
    throw error;
  }
}

/**
 * Initialize language key in drink_types translations
 */
async function initializeDrinkTypes(languageCode: string) {
  const records = await db.query.drink_types.findMany();

  for (const record of records) {
    if (!record.translations?.[languageCode]) {
      const updatedTranslations = {
        ...(record.translations || {}),
        [languageCode]: '', // Initialize with empty string, will be populated by auto-translation
      };

      await db
        .update(drink_types)
        .set({ translations: updatedTranslations })
        .where(eq(drink_types.id, record.id));
    }
  }
  console.log(`✅ Initialized ${records.length} drink_types records`);
}

/**
 * Initialize language key in drink_subtypes translations
 */
async function initializeDrinkSubtypes(languageCode: string) {
  const records = await db.query.drink_subtypes.findMany();

  for (const record of records) {
    if (!record.translations?.[languageCode]) {
      const updatedTranslations = {
        ...(record.translations || {}),
        [languageCode]: '', // Initialize with empty string, will be populated by auto-translation
      };

      await db
        .update(drink_subtypes)
        .set({ translations: updatedTranslations })
        .where(eq(drink_subtypes.id, record.id));
    }
  }
  console.log(`✅ Initialized ${records.length} drink_subtypes records`);
}

/**
 * Initialize language key in volumes translations
 */
async function initializeVolumes(languageCode: string) {
  const records = await db.query.volumes.findMany();

  for (const record of records) {
    if (!record.translations?.[languageCode]) {
      const updatedTranslations = {
        ...(record.translations || {}),
        [languageCode]: '', // Initialize with empty string, will be populated by auto-translation
      };

      await db.update(volumes).set({ translations: updatedTranslations }).where(eq(volumes.id, record.id));
    }
  }
  console.log(`✅ Initialized ${records.length} volumes records`);
}

/**
 * Initialize language key in container_types translations
 */
async function initializeContainerTypes(languageCode: string) {
  const records = await db.query.container_types.findMany();

  for (const record of records) {
    if (!record.translations?.[languageCode]) {
      const updatedTranslations = {
        ...(record.translations || {}),
        [languageCode]: '', // Initialize with empty string, will be populated by auto-translation
      };

      await db
        .update(container_types)
        .set({ translations: updatedTranslations })
        .where(eq(container_types.id, record.id));
    }
  }
  console.log(`✅ Initialized ${records.length} container_types records`);
}

/**
 * Auto-translate existing content when a new language is added
 * Uses English (en-GB) as the source language and translates to the target language
 * Now works with JSON translations column
 */
export async function autoTranslateExistingContent(targetLanguageCode: string): Promise<void> {
  console.log(`🌐 Starting auto-translation for language: ${targetLanguageCode}`);

  const sourceLanguage = 'en-GB'; // Use English as source

  try {
    // First, initialize the language key in all existing translations
    await initializeNewLanguageInTranslations(targetLanguageCode);

    // Get all translatable entities
    const entities = await db.query.translatable_entities.findMany({
      where: (fields, operators) => operators.eq(fields.isActive, true),
    });

    console.log(`📋 Found ${entities.length} translatable entities to process`);

    for (const entity of entities) {
      console.log(`📝 Processing ${entity.tableName} with JSON translations...`);

      switch (entity.tableName) {
        case 'drink_types':
          await translateDrinkTypes(sourceLanguage, targetLanguageCode);
          break;
        case 'drink_subtypes':
          await translateDrinkSubtypes(sourceLanguage, targetLanguageCode);
          break;
        case 'volumes':
          await translateVolumes(sourceLanguage, targetLanguageCode);
          break;
        case 'container_types':
          await translateContainerTypes(sourceLanguage, targetLanguageCode);
          break;
        default:
          console.warn(`⚠️ Unknown table: ${entity.tableName}`);
      }
    }

    console.log(`✅ Auto-translation completed for ${targetLanguageCode}`);
  } catch (error) {
    console.error(`❌ Auto-translation failed for ${targetLanguageCode}:`, error);
    throw error;
  }
}

/**
 * Translate drink types using JSON translations column
 */
async function translateDrinkTypes(sourceLang: string, targetLang: string) {
  console.log(`🍺 Translating drink_types table: ${sourceLang} → ${targetLang}`);

  const records = await db.query.drink_types.findMany();
  console.log(`📊 Found ${records.length} drink type records to translate`);

  for (const record of records) {
    // Skip if translation already exists and is not null/empty
    if (record.translations?.[targetLang]) {
      console.log(`⏭️ Skipping ${record.name} - translation already exists`);
      continue;
    }

    // Get source text - prefer existing translation, fallback to name
    const sourceText = record.translations?.[sourceLang] || record.name;

    if (sourceText) {
      console.log(`🔤 Translating "${sourceText}" to ${targetLang}...`);
      const translatedText = await translateText(sourceText, targetLang);

      try {
        // Update JSON translations
        const currentTranslations = record.translations || {};
        const updatedTranslations = {
          ...currentTranslations,
          [targetLang]: translatedText,
        };

        await db
          .update(drink_types)
          .set({ translations: updatedTranslations })
          .where(eq(drink_types.id, record.id));

        console.log(`✅ ${record.name}: "${sourceText}" → "${translatedText}"`);
      } catch (updateError) {
        console.error(`❌ Failed to update ${record.name}:`, updateError);
      }

      // Rate limiting to avoid API limits
      await new Promise((resolve) => setTimeout(resolve, TRANSLATION_DELAY_MS));
    }
  }
}

/**
 * Translate drink subtypes using JSON translations column
 */
async function translateDrinkSubtypes(sourceLang: string, targetLang: string) {
  console.log(`🍺 Translating drink_subtypes table: ${sourceLang} → ${targetLang}`);

  const records = await db.query.drink_subtypes.findMany();
  console.log(`📊 Found ${records.length} drink subtype records to translate`);

  for (const record of records) {
    // Skip if translation already exists and is not null/empty
    if (record.translations?.[targetLang]) {
      console.log(`⏭️ Skipping ${record.name} - translation already exists`);
      continue;
    }

    // Get source text - prefer existing translation, fallback to name
    const sourceText = record.translations?.[sourceLang] || record.name;

    if (sourceText) {
      console.log(`🔤 Translating "${sourceText}" to ${targetLang}...`);
      const translatedText = await translateText(sourceText, targetLang);

      try {
        // Update JSON translations
        const currentTranslations = record.translations || {};
        const updatedTranslations = {
          ...currentTranslations,
          [targetLang]: translatedText,
        };

        await db
          .update(drink_subtypes)
          .set({ translations: updatedTranslations })
          .where(eq(drink_subtypes.id, record.id));

        console.log(`✅ ${record.name}: "${sourceText}" → "${translatedText}"`);
      } catch (updateError) {
        console.error(`❌ Failed to update ${record.name}:`, updateError);
      }

      // Rate limiting to avoid API limits
      await new Promise((resolve) => setTimeout(resolve, TRANSLATION_DELAY_MS));
    }
  }
}

/**
 * Translate volumes using JSON translations column
 */
async function translateVolumes(sourceLang: string, targetLang: string) {
  console.log(`📏 Translating volumes table: ${sourceLang} → ${targetLang}`);

  const records = await db.query.volumes.findMany();
  console.log(`📊 Found ${records.length} volume records to translate`);

  for (const record of records) {
    // Skip if translation already exists and is not null/empty
    if (record.translations?.[targetLang]) {
      console.log(`⏭️ Skipping ${record.name} - translation already exists`);
      continue;
    }

    // Get source text - prefer existing translation, fallback to name
    const sourceText = record.translations?.[sourceLang] || record.name;

    if (sourceText) {
      console.log(`🔤 Translating "${sourceText}" to ${targetLang}...`);
      const translatedText = await translateText(sourceText, targetLang);

      try {
        // Update JSON translations
        const currentTranslations = record.translations || {};
        const updatedTranslations = {
          ...currentTranslations,
          [targetLang]: translatedText,
        };

        await db.update(volumes).set({ translations: updatedTranslations }).where(eq(volumes.id, record.id));

        console.log(`✅ ${record.name}: "${sourceText}" → "${translatedText}"`);
      } catch (updateError) {
        console.error(`❌ Failed to update ${record.name}:`, updateError);
      }

      // Rate limiting to avoid API limits
      await new Promise((resolve) => setTimeout(resolve, TRANSLATION_DELAY_MS));
    }
  }
}

/**
 * Translate container types using JSON translations column
 */
async function translateContainerTypes(sourceLang: string, targetLang: string) {
  console.log(`📦 Translating container_types table: ${sourceLang} → ${targetLang}`);

  const records = await db.query.container_types.findMany();
  console.log(`📊 Found ${records.length} container type records to translate`);

  for (const record of records) {
    // Skip if translation already exists and is not null/empty
    if (record.translations?.[targetLang]) {
      console.log(`⏭️ Skipping ${record.name} - translation already exists`);
      continue;
    }

    // Get source text - prefer existing translation, fallback to name
    const sourceText = record.translations?.[sourceLang] || record.name;

    if (sourceText) {
      console.log(`🔤 Translating "${sourceText}" to ${targetLang}...`);
      const translatedText = await translateText(sourceText, targetLang);

      try {
        // Update JSON translations
        const currentTranslations = record.translations || {};
        const updatedTranslations = {
          ...currentTranslations,
          [targetLang]: translatedText,
        };

        await db
          .update(container_types)
          .set({ translations: updatedTranslations })
          .where(eq(container_types.id, record.id));

        console.log(`✅ ${record.name}: "${sourceText}" → "${translatedText}"`);
      } catch (updateError) {
        console.error(`❌ Failed to update ${record.name}:`, updateError);
      }

      // Rate limiting to avoid API limits
      await new Promise((resolve) => setTimeout(resolve, TRANSLATION_DELAY_MS));
    }
  }
}

/**
 * Translation function with multiple providers
 * 1. Simple mappings (instant)
 * 2. Google Cloud Translate (official, requires API key)
 * 3. Unofficial Google Translate (backup, unreliable)
 * 4. Fallback to marked text
 */
async function translateText(text: string, targetLanguage: string): Promise<string> {
  // Get the base language code (fr-FR -> fr, en-GB -> en)
  let baseLang = targetLanguage.split('-')[0].toLowerCase();

  // Convert 3-letter ISO codes to 2-letter codes for Google Translate
  const iso3to2Map: Record<string, string> = {
    fra: 'fr', // French
    eng: 'en', // English
    spa: 'es', // Spanish
    deu: 'de', // German
    ita: 'it', // Italian
    por: 'pt', // Portuguese
    nld: 'nl', // Dutch
    rus: 'ru', // Russian
    jpn: 'ja', // Japanese
    kor: 'ko', // Korean
    chi: 'zh', // Chinese
    ara: 'ar', // Arabic
    cat: 'ca', // Catalan
  };

  // Convert 3-letter to 2-letter if needed
  if (iso3to2Map[baseLang]) {
    const originalLang = baseLang;
    baseLang = iso3to2Map[baseLang];
    console.log(`🔄 Converted ISO 639-2 to ISO 639-1: "${originalLang}" → "${baseLang}"`);
  }

  console.log(`🔤 Final language code for translation APIs: "${baseLang}"`);

  // Simple mapping for common terms as fallback
  const simpleTranslations: Record<string, Record<string, string>> = {
    fr: {
      'Beer': 'Bière',
      'Wine': 'Vin',
      'Water': 'Eau',
      'Juice': 'Jus',
      'Soda': 'Soda',
      'Liquor': 'Liqueur',
      'Glass': 'Verre',
      'Plastic': 'Plastique',
      'Metal': 'Métal',
      '2 Liters': '2 Litres',
      '1.5 Liters': '1,5 Litres',
      '1.25 Liters': '1,25 Litres',
      'Blonde': 'Blonde',
      'Dark': 'Brune',
      'Red': 'Rouge',
      'White': 'Blanc',
      'Rosé': 'Rosé',
      'Sparkling': 'Pétillant',
    },
    de: {
      'Beer': 'Bier',
      'Wine': 'Wein',
      'Water': 'Wasser',
      'Juice': 'Saft',
      'Soda': 'Limonade',
      'Liquor': 'Likör',
      'Glass': 'Glas',
      'Plastic': 'Kunststoff',
      'Metal': 'Metall',
      '2 Liters': '2 Liter',
      '1.5 Liters': '1,5 Liter',
      '1.25 Liters': '1,25 Liter',
      'Blonde': 'Hell',
      'Dark': 'Dunkel',
      'Red': 'Rot',
      'White': 'Weiß',
      'Rosé': 'Rosé',
      'Sparkling': 'Prickelnd',
    },
    es: {
      'Beer': 'Cerveza',
      'Wine': 'Vino',
      'Water': 'Agua',
      'Juice': 'Jugo',
      'Soda': 'Refresco',
      'Liquor': 'Licor',
      'Glass': 'Vidrio',
      'Plastic': 'Plástico',
      'Metal': 'Metal',
      '2 Liters': '2 Litros',
      '1.5 Liters': '1,5 Litros',
      '1.25 Liters': '1,25 Litros',
      'Blonde': 'Rubia',
      'Dark': 'Oscura',
      'Red': 'Tinto',
      'White': 'Blanco',
      'Rosé': 'Rosado',
      'Sparkling': 'Espumoso',
    },
    it: {
      'Beer': 'Birra',
      'Wine': 'Vino',
      'Water': 'Acqua',
      'Juice': 'Succo',
      'Soda': 'Bibita',
      'Liquor': 'Liquore',
      'Glass': 'Vetro',
      'Plastic': 'Plastica',
      'Metal': 'Metallo',
      '2 Liters': '2 Litri',
      '1.5 Liters': '1,5 Litri',
      '1.25 Liters': '1,25 Litri',
      'Blonde': 'Bionda',
      'Dark': 'Scura',
      'Red': 'Rosso',
      'White': 'Bianco',
      'Rosé': 'Rosato',
      'Sparkling': 'Frizzante',
    },
  };

  // Try simple translation first (most reliable)
  // if (simpleTranslations[baseLang] && simpleTranslations[baseLang][text]) {
  //   console.log(`  📚 Simple translation: "${text}" → "${simpleTranslations[baseLang][text]}" (${baseLang})`);
  //   return simpleTranslations[baseLang][text];
  // }

  // Try Google Cloud Translate (official API with key)
  // if (process.env.GOOGLE_TRANSLATE_API_KEY) {
  //   try {
  //     const result = await translateWithGoogleCloud(text, baseLang);
  //     if (result) {
  //       console.log(`  ☁️ Google Cloud: "${text}" → "${result}" (${baseLang})`);
  //       return result;
  //     }
  //   } catch (error: any) {
  //     console.warn(`  ⚠️ Google Cloud Translate failed: ${error.message}`);
  //   }
  // }

  // Try unofficial Google Translate (backup)
  try {
    const result = await translateWithUnofficialGoogle(text, baseLang);
    if (result) {
      console.log(`  🌐 Unofficial API: "${text}" → "${result}" (${baseLang})`);
      return result;
    }
  } catch (error: any) {
    console.warn(`  ⚠️ Unofficial Google Translate failed: ${error.message}`);
  }

  // Fallback to marked original text
  console.log(`  🔄 Using fallback for "${text}"`);
  return `${text} [${targetLanguage}]`;
}

/**
 * Google Cloud Translate (official, requires API key)
 * Set GOOGLE_TRANSLATE_API_KEY environment variable
 */
async function translateWithGoogleCloud(text: string, targetLang: string): Promise<string | null> {
  if (!process.env.GOOGLE_TRANSLATE_API_KEY) {
    return null;
  }

  try {
    // Using REST API directly to avoid additional dependencies
    const url = `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: 'en',
        target: targetLang,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data?.translations?.[0]?.translatedText || null;
  } catch (error) {
    console.warn('Google Cloud Translate error:', error);
    return null;
  }
}

/**
 * Unofficial Google Translate using google-translate-api-x (alternative)
 */
async function translateWithUnofficialGoogle(text: string, targetLang: string): Promise<string | null> {
  let retries = 2; // Reduced retries since it's unreliable

  log('🌐 ==========>', 'yellow', targetLang);

  while (retries > 0) {
    try {
      // Try google-translate-api-x first (if available)
      let translate: any;
      try {
        const apiX = await import('google-translate-api-x');
        translate = apiX.translate;

        // log('🌐 api-x ==========>', 'yellow', translate);
      } catch {
        // Fallback to @vitalets/google-translate-api if google-translate-api-x is not available
        const vitalets = await import('@vitalets/google-translate-api');
        translate = vitalets.translate;
        // log('🌐 @vitalets ==========>', 'yellow', translate);
      }

      const result = await translate(text, {
        from: 'en',
        to: targetLang,
      });

      // Handle different response structures
      const translatedText = result.text || result;

      log('👉🏻 result', 'lime', result);
      log('👉🏻 translatedText', 'lime', translatedText);

      return typeof translatedText === 'string' ? translatedText : null;
    } catch (error: any) {
      retries--;

      if (error.message?.includes('Too Many Requests') || error.message?.includes('429')) {
        if (retries > 0) {
          console.warn(`  ⏳ Rate limit hit with translate API, waiting... (${retries} retries left)`);
          await new Promise((resolve) => setTimeout(resolve, 3000));
          continue;
        }
      }

      if (retries === 0) {
        console.warn(`  ⚠️ Translate API failed after retries: ${error.message}`);
        throw error;
      }

      console.warn(`  ⚠️ Translate API error: ${error.message}, retrying...`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return null;
}

/**
 * Example implementation with Google Translate
 * Uncomment and install @google-cloud/translate to use
 */
/*
import { Translate } from '@google-cloud/translate/build/src/v2';

const translate = new Translate({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE,
});

async function translateText(text: string, targetLanguage: string): Promise<string> {
  try {
    const [translation] = await translate.translate(text, {
      to: targetLanguage.split('-')[0], // Use base language code
      from: 'en',
    });
    return translation;
  } catch (error) {
    console.warn(`Translation failed for "${text}":`, error);
    return `${text} [${targetLanguage}]`; // Fallback
  }
}
*/

/**
 * Example implementation with LibreTranslate (free, self-hosted)
 * Uncomment and install libretranslate to use
 */
/*
import { translate as libreTranslate } from 'libretranslate';

async function translateText(text: string, targetLanguage: string): Promise<string> {
  try {
    const result = await libreTranslate(text, {
      from: 'en',
      to: targetLanguage.split('-')[0],
      host: process.env.LIBRETRANSLATE_HOST || 'https://libretranslate.de',
    });
    return result.translatedText;
  } catch (error) {
    console.warn(`Translation failed for "${text}":`, error);
    return `${text} [${targetLanguage}]`; // Fallback
  }
}
*/
