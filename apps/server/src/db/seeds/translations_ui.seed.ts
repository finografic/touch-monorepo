import { db } from '../db.adapter';
import { translations_ui } from '../schemas';
import { flattenTranslationsForSeed } from './utils/flatten-translations';

/**
 * Flattened UI translations from packages/i18n/src/translations/ui/*.json
 *
 * Structure:
 * - Keys use dot notation (e.g., "ui.buttons.add", "ui.tables.headers.name")
 * - Translations are stored as JSON object keyed by language code
 *
 * Generated from:
 * - packages/i18n/src/translations/ui/es-ES.json
 * - packages/i18n/src/translations/ui/en-GB.json
 * - packages/i18n/src/translations/ui/ca-ES.json
 */
const translationsData = flattenTranslationsForSeed('ui');

export async function seed() {
  console.log('Seeding translations_ui...');

  try {
    // Check if translations already exist
    const existing = await db.select().from(translations_ui).limit(1);
    if (existing.length > 0) {
      console.log('✓ UI translations already seeded, skipping...');
      return;
    }

    // Insert all translation entries
    const insertedTranslations = await db
      .insert(translations_ui)
      .values(
        translationsData.map((item) => ({
          key: item.key,
          translations: item.translations,
          isActive: true,
        })),
      )
      .returning();

    console.log('✅ UI translations seed completed successfully!');
    console.log(`   Inserted ${insertedTranslations.length} translation entries`);
    return insertedTranslations;
  } catch (error) {
    console.error('❌ Error seeding UI translations:', error);
    throw error;
  }
}
