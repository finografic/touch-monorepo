import { db } from 'db';
import { translatable_entities } from 'db/schemas/translatable_entities.schema';
import { sql } from 'drizzle-orm';
import { autoTranslateExistingContent } from './auto-translate.utils';

/**
 * Check if a column exists in a table (SQLite specific)
 */
async function checkColumnExists(tableName: string, columnName: string): Promise<boolean> {
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
 * FAST operation - only creates columns, no translation
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

  console.log(`🔧 Creating translation columns for language: ${languageCode}`);
  console.log(
    `📋 Found ${entities.length} translatable entities:`,
    entities.map((e) => e.tableName),
  );

  // For each entity, create the translation column
  for (const entity of entities) {
    const columnName = `name_${languageCode.toLowerCase().replace('-', '_')}`;

    try {
      // Check if column already exists
      const columnExists = await checkColumnExists(entity.tableName, columnName);

      if (columnExists) {
        console.log(`⚠️  Column ${columnName} already exists in ${entity.tableName}, skipping`);
        continue;
      }

      // Execute table reconstruction with proper column ordering
      await reconstructTableWithNewLanguageColumn(entity.tableName, columnName);

      console.log(`✅ Created column ${columnName} in table ${entity.tableName} with proper ordering`);
    } catch (error) {
      console.error(`❌ Failed to create column ${columnName} in ${entity.tableName}:`, error);
      // Don't throw - continue with other tables
    }
  }

  console.log(`🎉 Translation column creation completed for ${languageCode}`);
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
 * Uses table reconstruction approach since SQLite doesn't support DROP COLUMN
 */
export async function removeTranslationColumns(languageCode: string): Promise<void> {
  // Get all active translatable entities
  const entities = await db.query.translatable_entities.findMany({
    where: (fields, operators) => operators.eq(fields.isActive, true),
    columns: {
      tableName: true,
      entityName: true,
    },
  });

  const columnName = `name_${languageCode.toLowerCase().replace('-', '_')}`;
  console.log(`🗑️ Removing translation columns for language: ${languageCode}`);
  console.log(
    `📋 Found ${entities.length} translatable entities:`,
    entities.map((e) => e.tableName),
  );

  // For each entity, remove the translation column
  for (const entity of entities) {
    try {
      // Check if column exists
      const columnExists = await checkColumnExists(entity.tableName, columnName);

      if (!columnExists) {
        console.log(`⚠️  Column ${columnName} doesn't exist in ${entity.tableName}, skipping`);
        continue;
      }

      // Execute table reconstruction without the column to be removed
      await reconstructTableWithoutColumn(entity.tableName, columnName);

      console.log(`✅ Removed column ${columnName} from table ${entity.tableName}`);
    } catch (error) {
      console.error(`❌ Failed to remove column ${columnName} from ${entity.tableName}:`, error);
      // Don't throw - continue with other tables
    }
  }

  console.log(`🎉 Translation column removal completed for ${languageCode}`);
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
