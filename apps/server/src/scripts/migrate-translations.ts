#!/usr/bin/env tsx

import { migrateTranslationsToJSON } from '../utils/migrate-translations.utils';

/**
 * Migration script to convert individual translation columns to JSON format
 * Run with: npx tsx src/scripts/migrate-translations.ts
 */
async function main() {
  console.log('🚀 Starting translation migration...');

  try {
    await migrateTranslationsToJSON();
    console.log('🎉 Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  }
}

main();
