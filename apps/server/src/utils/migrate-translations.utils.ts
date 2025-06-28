import { db } from 'db';
import { drink_types } from 'db/schemas/drink_types.schema';
import { container_types } from 'db/schemas/container_types.schema';
import { eq } from 'drizzle-orm';

/**
 * Migrate existing translation data from individual columns to JSON format
 * This is a one-time migration utility
 */
export async function migrateTranslationsToJSON(): Promise<void> {
  console.log('🔄 Starting migration of translations to JSON format...');

  try {
    // Migrate drink_types
    await migrateDrinkTypesTranslations();

    // Migrate container_types
    await migrateContainerTypesTranslations();

    console.log('✅ Translation migration completed successfully!');
  } catch (error) {
    console.error('❌ Translation migration failed:', error);
    throw error;
  }
}

/**
 * Migrate drink_types translations
 */
async function migrateDrinkTypesTranslations(): Promise<void> {
  console.log('📝 Migrating drink_types translations...');

  const records = await db.query.drink_types.findMany();

  for (const record of records) {
    const translations: Record<string, string> = {};

    // Migrate existing translation columns to JSON
    if (record.name_es_es) translations['es-ES'] = record.name_es_es;
    if (record.name_en_gb) translations['en-GB'] = record.name_en_gb;
    if (record.name_ca_es) translations['ca-ES'] = record.name_ca_es;

    // Add any dynamic columns that exist (from recent additions)
    const recordAny = record as any;
    Object.keys(recordAny).forEach((key) => {
      if (key.startsWith('name_') && key !== 'name_es_es' && key !== 'name_en_gb' && key !== 'name_ca_es') {
        // Convert column name back to locale format: name_de_de -> de-DE
        const locale = key.replace('name_', '').replace('_', '-').toUpperCase();
        const localeFormatted = `${locale.substring(0, 2).toLowerCase()}-${locale.substring(3)}`;
        translations[localeFormatted] = recordAny[key];
      }
    });

    // Update the record with JSON translations
    await db.update(drink_types).set({ translations }).where(eq(drink_types.id, record.id));

    console.log(`  ✓ Migrated ${record.name}: ${Object.keys(translations).length} translations`);
  }
}

/**
 * Migrate container_types translations
 */
async function migrateContainerTypesTranslations(): Promise<void> {
  console.log('📝 Migrating container_types translations...');

  const records = await db.query.container_types.findMany();

  for (const record of records) {
    const translations: Record<string, string> = {};

    // Migrate existing translation columns to JSON
    if (record.name_es_es) translations['es-ES'] = record.name_es_es;
    if (record.name_en_gb) translations['en-GB'] = record.name_en_gb;
    if (record.name_ca_es) translations['ca-ES'] = record.name_ca_es;

    // Add any dynamic columns that exist (from recent additions)
    const recordAny = record as any;
    Object.keys(recordAny).forEach((key) => {
      if (key.startsWith('name_') && key !== 'name_es_es' && key !== 'name_en_gb' && key !== 'name_ca_es') {
        // Convert column name back to locale format: name_de_de -> de-DE
        const locale = key.replace('name_', '').replace('_', '-').toUpperCase();
        const localeFormatted = `${locale.substring(0, 2).toLowerCase()}-${locale.substring(3)}`;
        translations[localeFormatted] = recordAny[key];
      }
    });

    // Update the record with JSON translations
    await db.update(container_types).set({ translations }).where(eq(container_types.id, record.id));

    console.log(`  ✓ Migrated ${record.name}: ${Object.keys(translations).length} translations`);
  }
}

/**
 * Helper function to get translation for a specific language from JSON
 */
export function getTranslation(
  translations: Record<string, string>,
  languageCode: string,
  fallback?: string,
): string {
  return translations[languageCode] || fallback || '';
}

/**
 * Helper function to set translation for a specific language in JSON
 */
export function setTranslation(
  translations: Record<string, string>,
  languageCode: string,
  value: string,
): Record<string, string> {
  return {
    ...translations,
    [languageCode]: value,
  };
}
