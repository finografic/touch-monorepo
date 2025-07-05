#!/usr/bin/env tsx

import { confirm } from '@inquirer/prompts';
import chalk from 'chalk';
import {
  cleanupLegacyTranslationColumns,
  verifyLegacyColumnsRemoved,
} from '../../../apps/server/src/utils/cleanup-legacy-columns.utils';

async function main() {
  console.log(chalk.blue('\n🧹 Legacy Translation Columns Cleanup Tool\n'));

  console.log('This tool will remove legacy translation columns from your database:');
  console.log('• Tables affected: drink_types, drink_subtypes, container_types, volumes');
  console.log('• Columns to remove: name_es_es, name_en_gb, name_ca_es');
  console.log('• Data preservation: All data is already in the JSON translations column');
  console.log('• Safety: Can be safely run multiple times (skips missing columns)');

  const shouldProceed = await confirm({
    message: chalk.yellow('\n⚠️  Are you ready to remove legacy translation columns?'),
    default: false,
  });

  if (!shouldProceed) {
    console.log(chalk.gray('Operation cancelled. No changes made.'));
    process.exit(0);
  }

  try {
    console.log(chalk.blue('\n🚀 Starting cleanup process...\n'));

    // Run the cleanup
    await cleanupLegacyTranslationColumns();

    console.log(chalk.blue('\n🔍 Running verification...\n'));

    // Verify the cleanup
    await verifyLegacyColumnsRemoved();

    console.log(chalk.green('\n✅ Legacy translation columns cleanup completed successfully!'));
    console.log(chalk.gray('\nNext steps:'));
    console.log(chalk.gray('1. Update schema files to remove legacy column definitions'));
    console.log(chalk.gray('2. Update any seed files that reference these columns'));
    console.log(chalk.gray('3. Test your application thoroughly'));
  } catch (error) {
    console.error(chalk.red('\n❌ Cleanup failed:'), error);
    console.log(chalk.yellow('\n🔄 Rollback information:'));
    console.log('If you need to rollback, you can:');
    console.log('1. Restore from a database backup');
    console.log('2. Re-run the translation migration to recreate columns');
    process.exit(1);
  }
}

// Handle unhandled rejections
process.on('unhandledRejection', (error) => {
  console.error(chalk.red('Unhandled rejection:'), error);
  process.exit(1);
});

main().catch((error) => {
  console.error(chalk.red('Script failed:'), error);
  process.exit(1);
});
