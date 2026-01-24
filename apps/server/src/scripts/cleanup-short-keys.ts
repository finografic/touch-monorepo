#!/usr/bin/env tsx

/**
 * Script to remove short language keys (es, en, ca) from translation JSON columns
 * and keep only full locale codes (es-ES, en-GB, ca-ES)
 *
 * Run with: npx tsx src/scripts/cleanup-short-keys.ts (from apps/server directory)
 */

// TODO: THIS SHOULD BE A TEMPORARY SCRIPT TO CLEAN UP THE DATABASE - NOT A PERMANENT SOLUTION
// TODO: DELME WHEN CONFIRMED POSSIBLE

import { db } from '../db/db.adapter';
import { translations_admin } from '../db/schemas/translations_admin.schema';
import { translations_app } from '../db/schemas/translations_app.schema';
import { translations_ui } from '../db/schemas/translations_ui.schema';
import { drink_types } from '../db/schemas/drink_types.schema';
import { drink_subtypes } from '../db/schemas/drink_subtypes.schema';
import { volumes } from '../db/schemas/volumes.schema';
import { container_types } from '../db/schemas/container_types.schema';
import { eq } from 'drizzle-orm';

async function removeShortLanguageKeys() {
  console.log('🧹 Starting cleanup of short language keys...');

  const shortKeys = ['es', 'en', 'ca'];
  let totalUpdated = 0;

  // Tables to clean up
  const tables = [
    { table: translations_admin, name: 'translations_admin', schema: translations_admin },
    { table: translations_app, name: 'translations_app', schema: translations_app },
    { table: translations_ui, name: 'translations_ui', schema: translations_ui },
    { table: drink_types, name: 'drink_types', schema: drink_types },
    { table: drink_subtypes, name: 'drink_subtypes', schema: drink_subtypes },
    { table: volumes, name: 'volumes', schema: volumes },
    { table: container_types, name: 'container_types', schema: container_types },
  ];

  for (const { table, name, schema } of tables) {
    console.log(`📋 Cleaning ${name} table...`);

    const records = await db.select().from(table);
    let tableUpdated = 0;

    for (const record of records) {
      const translations = (record.translations as Record<string, string>) || {};
      let hasShortKeys = false;

      // Check if any short keys exist
      for (const shortKey of shortKeys) {
        if (shortKey in translations) {
          hasShortKeys = true;
          break;
        }
      }

      if (hasShortKeys) {
        // Remove short keys
        const cleanedTranslations = { ...translations };
        for (const shortKey of shortKeys) {
          delete cleanedTranslations[shortKey];
        }

        try {
          await db
            .update(schema)
            .set({ translations: cleanedTranslations })
            .where(eq(schema.id, record.id));

          tableUpdated++;
          console.log(`✅ Cleaned ${name} record ${record.id || record.name}`);
        } catch (error) {
          console.error(`❌ Failed to clean ${name} record:`, error);
        }
      }
    }

    console.log(`📊 ${name}: ${tableUpdated} records cleaned`);
    totalUpdated += tableUpdated;
  }

  console.log(`🎉 Cleanup completed! ${totalUpdated} total records updated.`);
}

// Run the script
removeShortLanguageKeys()
  .then(() => {
    console.log('✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
