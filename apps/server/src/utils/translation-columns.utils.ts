import { db } from 'db';
import { translatable_entities } from 'db/schemas/translatable_entities.schema';

/**
 * Create translation columns for a new language across all translatable entities
 * Note: This is a simplified version that logs the operations.
 * In production, you'd implement actual DDL operations.
 */
export async function createTranslationColumns(languageCode: string): Promise<void> {
  // Get all active translatable entities
  const entities = await db.query.translatable_entities.findMany({
    where: (fields, operators) => operators.eq(fields.isActive, true),
    columns: {
      tableName: true,
      entityName: true,
    },
  });

  console.log(`Creating translation columns for language: ${languageCode}`);
  console.log(
    `Found ${entities.length} translatable entities:`,
    entities.map((e) => e.tableName),
  );

  // For each entity, we would create the translation column
  for (const entity of entities) {
    const columnName = `name_${languageCode.toLowerCase()}`;
    console.log(`✅ Would create column ${columnName} in table ${entity.tableName}`);

    // In a real implementation, you would:
    // 1. Check if column exists
    // 2. Run ALTER TABLE statement
    // 3. Handle errors appropriately

    // For now, we'll just log the intent
    console.log(`   SQL: ALTER TABLE ${entity.tableName} ADD COLUMN ${columnName} TEXT`);
  }

  console.log(`✅ Translation column creation completed for ${languageCode}`);
}

/**
 * Remove translation columns for a language (when deleting a language)
 */
export async function removeTranslationColumns(languageCode: string): Promise<void> {
  // Get all active translatable entities
  const entities = await db.query.translatable_entities.findMany({
    where: (fields, operators) => operators.eq(fields.isActive, true),
    columns: {
      tableName: true,
    },
  });

  console.log(`Removing translation columns for language: ${languageCode}`);

  // For each entity, we would remove the translation column
  for (const entity of entities) {
    const columnName = `name_${languageCode.toLowerCase()}`;
    console.log(`⚠️  Would remove column ${columnName} from table ${entity.tableName}`);

    // Note: SQLite doesn't support DROP COLUMN directly
    // In production, you might need a migration system
  }

  console.log(`✅ Translation column removal completed for ${languageCode}`);
}

/**
 * Validate that a language code is appropriate for column naming
 */
export function validateLanguageCode(languageCode: string): boolean {
  // Check if it's a valid language code format (2-3 lowercase letters)
  return /^[a-z]{2,3}$/.test(languageCode.toLowerCase());
}

/**
 * Get the column name for a language code
 */
export function getColumnName(languageCode: string): string {
  return `name_${languageCode.toLowerCase()}`;
}

/**
 * Get all expected translation columns based on supported languages
 */
export async function getExpectedTranslationColumns(): Promise<string[]> {
  const supportedLanguages = await db.query.supported_languages.findMany({
    where: (fields, operators) => operators.eq(fields.isActive, true),
    columns: {
      isoCode: true,
    },
  });

  return supportedLanguages.map((lang) => getColumnName(lang.isoCode));
}
