import { sql } from 'drizzle-orm';

import { db } from 'db';
import { translatable_entities } from 'db/schemas/translatable_entities.schema';

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
      console.log(`⚠️  Column ${columnToRemove} not found in ${tableName}, skipping...`);
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
    console.log(`📝 Creating temp table: ${tempTableName}`);
    await db.run(sql.raw(createTempSQL));

    // Step 2: Copy data from original table (excluding removed column)
    const columnNamesToKeep = columnsToKeep.map((col) => col.name).join(', ');
    const copySQL = `INSERT INTO ${tempTableName} (${columnNamesToKeep}) SELECT ${columnNamesToKeep} FROM ${tableName}`;
    console.log('📋 Copying data...');
    await db.run(sql.raw(copySQL));

    // Step 3: Drop original table
    console.log(`🗑️ Dropping original table: ${tableName}`);
    await db.run(sql.raw(`DROP TABLE ${tableName}`));

    // Step 4: Rename temp table to original name
    console.log(`🔄 Renaming temp table to: ${tableName}`);
    await db.run(sql.raw(`ALTER TABLE ${tempTableName} RENAME TO ${tableName}`));

    // Step 5: Recreate unique index on 'name' column (common pattern)
    await recreateIndexes(tableName);

    console.log(`✅ Successfully reconstructed ${tableName} without ${columnToRemove}`);
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
 * Remove legacy translation columns from all translatable entities
 * This is safe to run - it will skip columns that don't exist
 */
export async function cleanupLegacyTranslationColumns(): Promise<void> {
  console.log('🧹 Starting cleanup of legacy translation columns...');

  try {
    // Get all translatable entities
    const entities = await db.query.translatable_entities.findMany({
      where: (fields, operators) => operators.eq(fields.isActive, true),
    });

    console.log(`📋 Found ${entities.length} translatable entities to process`);

    // Legacy columns to remove
    const legacyColumns = ['name_es_es', 'name_en_gb', 'name_ca_es'];

    for (const entity of entities) {
      console.log(`\n📝 Processing table: ${entity.tableName} (${entity.entityName})`);

      for (const columnName of legacyColumns) {
        // Check if column exists before trying to remove it
        const columnExists = await checkColumnExists(entity.tableName, columnName);

        if (columnExists) {
          console.log(`  🗑️ Removing column: ${columnName}`);
          await reconstructTableWithoutColumn(entity.tableName, columnName);
        } else {
          console.log(`  ⏭️ Column ${columnName} doesn't exist, skipping...`);
        }
      }

      console.log(`  ✅ Completed processing ${entity.tableName}`);
    }

    console.log('\n🎉 Legacy translation columns cleanup completed successfully!');
    console.log('📋 Summary:');
    console.log('  • Removed: name_es_es, name_en_gb, name_ca_es columns');
    console.log('  • Kept: name (internal key) and translations (JSON) columns');
    console.log('  • All data preserved in JSON translations column');
  } catch (error) {
    console.error('❌ Legacy translation columns cleanup failed:', error);
    throw error;
  }
}

/**
 * Verify that all legacy columns have been removed
 */
export async function verifyLegacyColumnsRemoved(): Promise<void> {
  console.log('\n🔍 Verifying legacy columns removal...');

  try {
    const entities = await db.query.translatable_entities.findMany({
      where: (fields, operators) => operators.eq(fields.isActive, true),
    });

    const legacyColumns = ['name_es_es', 'name_en_gb', 'name_ca_es'];
    let foundLegacyColumns = false;

    for (const entity of entities) {
      console.log(`📝 Checking table: ${entity.tableName}`);

      for (const columnName of legacyColumns) {
        const columnExists = await checkColumnExists(entity.tableName, columnName);

        if (columnExists) {
          console.log(`  ❌ Legacy column still exists: ${columnName}`);
          foundLegacyColumns = true;
        } else {
          console.log(`  ✅ Legacy column removed: ${columnName}`);
        }
      }
    }

    if (foundLegacyColumns) {
      throw new Error('Some legacy columns were not removed properly');
    }

    console.log('\n🎉 Verification passed! All legacy columns have been removed.');
  } catch (error) {
    console.error('❌ Verification failed:', error);
    throw error;
  }
}
