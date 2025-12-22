import { db } from '../db.adapter';
import { translations_app } from '../schemas';
import { flattenTranslationsForSeed } from './utils/flatten-translations';

/**
 * Flattened App translations from packages/i18n/src/translations/app/*.json
 *
 * Structure:
 * - Keys use dot notation (e.g., "app.title", "app.pages.main.title")
 * - Translations are stored as JSON object keyed by language code
 *
 * Generated from:
 * - packages/i18n/src/translations/app/es-ES.json
 * - packages/i18n/src/translations/app/en-GB.json
 * - packages/i18n/src/translations/app/ca-ES.json
 */
const translationsData = flattenTranslationsForSeed('app');

export async function seed() {
  console.log('Seeding translations_app...');

  try {
    const existing = await db.select().from(translations_app).limit(1);
    if (existing.length > 0) {
      console.log('✓ App translations already seeded, skipping...');
      return;
    }

    const insertedTranslations = await db
      .insert(translations_app)
      .values(
        translationsData.map((item) => ({
          key: item.key,
          translations: item.translations,
          isActive: true,
        })),
      )
      .returning();

    console.log('✅ App translations seed completed successfully!');
    console.log(`   Inserted ${insertedTranslations.length} translation entries`);
    return insertedTranslations;
  } catch (error) {
    console.error('❌ Error seeding App translations:', error);
    throw error;
  }
}
