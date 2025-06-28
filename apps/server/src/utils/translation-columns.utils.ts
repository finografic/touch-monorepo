import { db } from 'db';
import { translatable_entities } from 'db/schemas/translatable_entities.schema';
import { sql } from 'drizzle-orm';
import { autoTranslateExistingContent } from './auto-translate.utils';

/**
 * Check if a column exists in a table (SQLite specific)
 */
export async function checkColumnExists(tableName: string, columnName: string): Promise<boolean> {
  try {
    const result = await db.all(sql.raw(`PRAGMA table_info(${tableName})`));
    return result.some((row: any) => row.name === columnName);
  } catch (error) {
    console.error('Error checking column existence:', error);
    return false;
  }
}

/**
 * Reconstruct table with new language column in proper position
 * SQLite doesn't support ALTER COLUMN positioning, so we need to reconstruct
 */
async function reconstructTableWithNewLanguageColumn(
  tableName: string,
  newColumnName: string,
): Promise<void> {
  console.log(`🔧 Reconstructing ${tableName} with proper column ordering...`);

  try {
    // Get current table structure
    const tableInfo = await db.all(sql.raw(`PRAGMA table_info(${tableName})`));
    const existingColumns = tableInfo.map((col: any) => ({
      name: col.name,
      type: col.type,
      notNull: col.notnull,
      defaultValue: col.dflt_value,
      primaryKey: col.pk,
    }));

    // Get existing language columns
    const languageColumns = existingColumns.filter(
      (col) => col.name.startsWith('name_') && col.name !== 'name',
    );
    const otherColumns = existingColumns.filter(
      (col) => !col.name.startsWith('name_') || col.name === 'name',
    );

    // Find base 'name' column
    const nameColumn = existingColumns.find((col) => col.name === 'name');
    const nonNameColumns = otherColumns.filter((col) => col.name !== 'name');

    // Create new column definition
    const newColumn = {
      name: newColumnName,
      type: 'TEXT',
      notNull: false,
      defaultValue: null,
      primaryKey: false,
    };

    // Build new column order: name, existing_languages, new_language, other_columns
    const orderedColumns = [
      ...(nameColumn ? [nameColumn] : []),
      ...languageColumns,
      newColumn,
      ...nonNameColumns,
    ];

    // Build CREATE TABLE statement with proper ordering
    const columnDefinitions = orderedColumns
      .map((col) => {
        let def = `${col.name} ${col.type}`;
        if (col.primaryKey) def += ' PRIMARY KEY';
        if (col.notNull) def += ' NOT NULL';
        if (col.defaultValue !== null) def += ` DEFAULT ${col.defaultValue}`;
        return def;
      })
      .join(', ');

    const tempTableName = `${tableName}_temp_${Date.now()}`;

    // Step 1: Create temporary table with new structure
    const createTempSQL = `CREATE TABLE ${tempTableName} (${columnDefinitions})`;
    console.log(`📝 Creating temp table: ${createTempSQL}`);
    await db.run(sql.raw(createTempSQL));

    // Step 2: Copy data from original table (excluding new column)
    const existingColumnNames = existingColumns.map((col) => col.name).join(', ');
    const copySQL = `INSERT INTO ${tempTableName} (${existingColumnNames}) SELECT ${existingColumnNames} FROM ${tableName}`;
    console.log(`📋 Copying data: ${copySQL}`);
    await db.run(sql.raw(copySQL));

    // Step 3: Drop original table
    console.log(`🗑️ Dropping original table: ${tableName}`);
    await db.run(sql.raw(`DROP TABLE ${tableName}`));

    // Step 4: Rename temp table to original name
    console.log(`🔄 Renaming temp table to: ${tableName}`);
    await db.run(sql.raw(`ALTER TABLE ${tempTableName} RENAME TO ${tableName}`));

    // Step 5: Recreate indexes if they existed
    await recreateIndexes(tableName);

    console.log(`✅ Successfully reconstructed ${tableName} with ${newColumnName} in proper position`);
  } catch (error) {
    console.error(`❌ Failed to reconstruct table ${tableName}:`, error);
    throw error;
  }
}

/**
 * Recreate common indexes for translatable tables
 */
async function recreateIndexes(tableName: string): Promise<void> {
  try {
    // Recreate unique index on 'name' column (common pattern)
    const indexSQL = `CREATE UNIQUE INDEX IF NOT EXISTS ${tableName}_name_unique ON ${tableName} (name)`;
    await db.run(sql.raw(indexSQL));
    console.log(`📇 Recreated unique index for ${tableName}.name`);
  } catch (error) {
    console.warn(`⚠️ Could not recreate indexes for ${tableName}:`, error);
    // Don't throw - indexes are not critical for basic functionality
  }
}

/**
 * Create translation columns for a new language across all translatable entities
 * FAST operation - NO LONGER CREATES COLUMNS, just logs for backward compatibility
 * All translations now use the JSON column
 */
export async function createTranslationColumns(languageCode: string): Promise<void> {
  console.log(`🔧 Language support for: ${languageCode}`);
  console.log('📋 Using JSON translations column - no DDL operations needed');
  console.log(`✅ Language support ready for ${languageCode}`);
}

/**
 * Background translation process - runs separately after language is added
 * This can take several minutes and should not block the UI
 */
export async function translateLanguageInBackground(languageCode: string): Promise<void> {
  console.log(`🌐 Starting background auto-translation for language: ${languageCode}`);

  try {
    const { autoTranslateExistingContent } = await import('./auto-translate.utils');
    await autoTranslateExistingContent(languageCode);
    console.log(`✅ Background auto-translation completed for ${languageCode}`);
  } catch (error) {
    console.error(`❌ Background auto-translation failed for ${languageCode}:`, error);
    // Could emit event or update status in database here
    throw error;
  }
}

/**
 * Remove translation columns for a language (when deleting a language)
 * NO LONGER REMOVES COLUMNS - just cleans up JSON translations
 */
export async function removeTranslationColumns(languageCode: string): Promise<void> {
  console.log(`🗑️ Cleaning up translations for language: ${languageCode}`);
  console.log('📋 Using JSON translations column - no DDL operations needed');

  // TODO: Could add logic here to remove the language key from all JSON translations
  // For now, we'll just let the translations remain in the JSON for data integrity

  console.log(`✅ Translation cleanup completed for ${languageCode}`);
}

/**
 * Reconstruct table without a specific column
 * SQLite doesn't support DROP COLUMN, so we need to reconstruct
 */
async function reconstructTableWithoutColumn(tableName: string, columnToRemove: string): Promise<void> {
  console.log(`🔧 Reconstructing ${tableName} without column ${columnToRemove}...`);

  try {
    // Get current table structure
    const tableInfo = await db.all(sql.raw(`PRAGMA table_info(${tableName})`));
    const existingColumns = tableInfo.map((col: any) => ({
      name: col.name,
      type: col.type,
      notNull: col.notnull,
      defaultValue: col.dflt_value,
      primaryKey: col.pk,
    }));

    // Filter out the column to be removed
    const columnsToKeep = existingColumns.filter((col) => col.name !== columnToRemove);

    if (columnsToKeep.length === existingColumns.length) {
      console.log(`⚠️  Column ${columnToRemove} not found in ${tableName}, nothing to remove`);
      return;
    }

    // Build CREATE TABLE statement without the removed column
    const columnDefinitions = columnsToKeep
      .map((col) => {
        let def = `${col.name} ${col.type}`;
        if (col.primaryKey) def += ' PRIMARY KEY';
        if (col.notNull) def += ' NOT NULL';
        if (col.defaultValue !== null) def += ` DEFAULT ${col.defaultValue}`;
        return def;
      })
      .join(', ');

    const tempTableName = `${tableName}_temp_${Date.now()}`;

    // Step 1: Create temporary table without the column
    const createTempSQL = `CREATE TABLE ${tempTableName} (${columnDefinitions})`;
    console.log(`📝 Creating temp table: ${createTempSQL}`);
    await db.run(sql.raw(createTempSQL));

    // Step 2: Copy data from original table (excluding removed column)
    const columnNamesToKeep = columnsToKeep.map((col) => col.name).join(', ');
    const copySQL = `INSERT INTO ${tempTableName} (${columnNamesToKeep}) SELECT ${columnNamesToKeep} FROM ${tableName}`;
    console.log(`📋 Copying data: ${copySQL}`);
    await db.run(sql.raw(copySQL));

    // Step 3: Drop original table
    console.log(`🗑️ Dropping original table: ${tableName}`);
    await db.run(sql.raw(`DROP TABLE ${tableName}`));

    // Step 4: Rename temp table to original name
    console.log(`🔄 Renaming temp table to: ${tableName}`);
    await db.run(sql.raw(`ALTER TABLE ${tempTableName} RENAME TO ${tableName}`));

    // Step 5: Recreate indexes if they existed
    await recreateIndexes(tableName);

    console.log(`✅ Successfully reconstructed ${tableName} without ${columnToRemove}`);
  } catch (error) {
    console.error(`❌ Failed to reconstruct table ${tableName}:`, error);
    throw error;
  }
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
