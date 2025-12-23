import { db } from '../db.adapter';
import { translations_admin } from '../schemas';
import { flattenTranslationsForSeed } from './utils/flatten-translations';

/**
 * Flattened Admin translations from packages/i18n/translations/admin/*.json
 *
 * Structure:
 * - Keys use dot notation (e.g., "admin.title", "admin.pages.dashboard.title")
 * - Translations are stored as JSON object keyed by language code
 *
 * Generated from:
 * - packages/i18n/translations/admin/es-ES.json
 * - packages/i18n/translations/admin/en-GB.json
 * - packages/i18n/translations/admin/ca-ES.json
 */
const translationsData = flattenTranslationsForSeed('admin');

export async function seed() {
  console.log('Seeding translations_admin...');

  try {
    const existing = await db.select().from(translations_admin).limit(1);
    if (existing.length > 0) {
      console.log('✓ Admin translations already seeded, skipping...');
      return;
    }

    const insertedTranslations = await db
      .insert(translations_admin)
      .values(
        translationsData.map((item) => ({
          key: item.key,
          translations: item.translations,
          isActive: true,
        })),
      )
      .returning();

    console.log('✅ Admin translations seed completed successfully!');
    console.log(`   Inserted ${insertedTranslations.length} translation entries`);
    return insertedTranslations;
  } catch (error) {
    console.error('❌ Error seeding Admin translations:', error);
    throw error;
  }
}
