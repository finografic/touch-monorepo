import { sql } from 'drizzle-orm';
import { db } from '../db.adapter';
import { pathToFileURL } from 'node:url';

/**
 * Creates the orders_readable view with joined table data
 * This view provides human-readable names instead of foreign key IDs
 */
export async function createOrdersReadableView(): Promise<void> {
  console.log('Creating orders_readable view...');

  try {
    // Drop existing view if it exists
    await db.run(sql`DROP VIEW IF EXISTS orders_readable`);
    console.log('  ✓ Dropped existing orders_readable view (if it existed)');

    // Create the view with proper JOIN syntax
    // Note: temperature_profiles doesn't have a name column, so we join with cooling_profiles
    await db.run(sql`
      CREATE VIEW orders_readable AS
      SELECT
        o.id,
        dt.name AS drink_type,
        dst.name AS drink_subtype,
        v.name AS volume,
        ct.name AS container_type,
        cp.name AS temperature_profile,
        o.default_temp_consume,
        o.default_temp_freeze,
        o.is_active,
        o.created_at,
        o.updated_at
      FROM orders o
      JOIN drink_types dt ON o.drink_type_id = dt.id
      LEFT JOIN drink_subtypes dst ON o.drink_subtype_id = dst.id
      JOIN volumes v ON o.volume_id = v.id
      JOIN container_types ct ON o.container_type_id = ct.id
      JOIN temperature_profiles tp ON o.temperature_profile_id = tp.id
      JOIN cooling_profiles cp ON tp.cooling_profile_id = cp.id
    `);

    console.log('  ✅ Created orders_readable view successfully');

    // Verify the view was created and has data
    const viewData = await db.run(sql`SELECT COUNT(*) as count FROM orders_readable`);
    console.log(`  ✓ View contains ${JSON.stringify(viewData)} rows`);
  } catch (error) {
    console.error('  ❌ Error creating orders_readable view:', error);
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
    await createOrdersReadableView();
    // Add more view creation calls here in the future
    // await createAnotherView();

    console.log('✅ All database views created successfully');
  } catch (error) {
    console.error('❌ Error creating database views:', error);
    throw error;
  }
}

// CLI support - run when called directly (ES module version)
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  createAllViews()
    .then(() => {
      console.log('🎉 View creation completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 View creation failed:', error);
      process.exit(1);
    });
}
