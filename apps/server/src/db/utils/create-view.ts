import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sql } from 'drizzle-orm';
import { db } from '../db.adapter';

// Convert URL to file path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to validate view name
function isValidView(viewName: string): boolean {
  const viewsDir = path.join(__dirname, '../views');
  const sqlFile = path.join(viewsDir, `${viewName}.sql`);
  return fs.existsSync(sqlFile);
}

/**
 * Creates a specific view from SQL file
 */
async function createView(viewName: string): Promise<void> {
  try {
    // Validate view name first
    if (!isValidView(viewName)) {
      console.error(`❌ Invalid view name: ${viewName}`);

      // List available views
      const viewsDir = path.join(__dirname, '../views');
      if (fs.existsSync(viewsDir)) {
        const availableViews = fs
          .readdirSync(viewsDir)
          .filter((file) => file.endsWith('.sql'))
          .map((file) => file.replace('.sql', ''));
        console.log(`Available views: ${availableViews.join(', ')}`);
      }
      process.exit(1);
    }

    const sqlFile = path.join(__dirname, '../views', `${viewName}.sql`);

    if (!fs.existsSync(sqlFile)) {
      console.warn(`⚠️ No SQL file found for view: ${viewName}`);
      console.log(`Expected SQL file at: ${sqlFile}`);
      return;
    }

    const sqlContent = fs.readFileSync(sqlFile, 'utf-8');

    console.log(`🔧 Creating view: ${viewName}...`);

    // Drop existing view if it exists
    await db.run(sql.raw(`DROP VIEW IF EXISTS ${viewName};`));
    console.log(`  ✓ Dropped existing ${viewName} view (if it existed)`);

    // Create the view
    await db.run(sql.raw(sqlContent));
    console.log(`  ✅ Created ${viewName} view successfully`);

    // Verify the view was created
    const viewData = await db.run(sql.raw(`SELECT COUNT(*) as count FROM ${viewName}`));
    console.log(`  ✓ View contains ${JSON.stringify(viewData)} rows`);
  } catch (error) {
    console.error(`❌ Error creating view ${viewName}:`, error);
    throw error;
  }
}

/**
 * Creates all database views
 * Add more view creation functions here as needed
 */
export async function createAllViews(): Promise<void> {
  console.log('🔧 Creating all database views...');

  try {
    const viewsDir = path.join(__dirname, '../views');
    if (!fs.existsSync(viewsDir)) {
      console.warn('⚠️ Views directory not found');
      return;
    }

    const viewFiles = fs
      .readdirSync(viewsDir)
      .filter((file) => file.endsWith('.sql'))
      .map((file) => file.replace('.sql', ''));

    for (const viewName of viewFiles) {
      await createView(viewName);
    }

    console.log('✅ All database views created successfully');
  } catch (error) {
    console.error('❌ Error creating database views:', error);
    throw error;
  }
}

// Get view name from command line args
const viewName = process.argv[2]?.toLowerCase(); // normalize to lowercase

if (viewName === 'all') {
  // Create all views
  createAllViews()
    .then(() => {
      console.log('🎉 All views created successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 View creation failed:', error);
      process.exit(1);
    });
} else if (viewName) {
  // Create specific view
  createView(viewName)
    .then(() => {
      console.log(`🎉 View ${viewName} created successfully!`);
      process.exit(0);
    })
    .catch((error) => {
      console.error(`💥 View ${viewName} creation failed:`, error);
      process.exit(1);
    });
} else {
  console.error('❌ No view specified');
  console.log('Usage: node create-view.js <view-name> | all');
  process.exit(1);
}
