import { sql } from 'drizzle-orm';
import { db } from '../db.adapter';
import { pathToFileURL } from 'node:url';

// Type definitions for our test queries
interface CountResult {
  count: number;
}

interface OrdersReadableSample {
  id: string;
  drink_type: string;
  drink_subtype: string | null;
  volume: string;
  container_type: string;
  temperature_profile: string;
  default_temp_consume: number;
  is_active: number;
}

interface DrinkTypeCount {
  drink_type: string;
  count: number;
}

interface JoinIntegrityResult {
  drink_type: string;
  total_orders: number;
  volume_varieties: number;
  container_varieties: number;
}

/**
 * Test the orders_readable view to ensure Drizzle can query it properly
 */
async function testOrdersReadableView(): Promise<void> {
  console.log('🧪 Testing orders_readable view with Drizzle...');

  try {
    // Test 1: Basic count query
    console.log('\n📊 Test 1: Count all rows in view');
    const countResult = await db.run(sql`SELECT COUNT(*) as count FROM orders_readable`);
    console.log(`   ✓ View contains ${JSON.stringify(countResult)} rows`);

    // Test 2: Sample data query
    console.log('\n📋 Test 2: Sample data from view');
    const sampleData = (await db.all(sql`
      SELECT
        id,
        drink_type,
        drink_subtype,
        volume,
        container_type,
        temperature_profile,
        default_temp_consume,
        is_active
      FROM orders_readable
      LIMIT 5
    `)) as OrdersReadableSample[];
    console.log('   ✓ Sample data:');
    sampleData.forEach((row, index) => {
      console.log(
        `     ${index + 1}. ${row.drink_type} | ${row.drink_subtype || 'N/A'} | ${row.volume} | ${row.container_type} | ${row.temperature_profile}`,
      );
    });

    // Test 3: Filtering and aggregation
    console.log('\n🔍 Test 3: Filtering by drink type');
    const cervezeCount = await db.run(sql`
      SELECT COUNT(*) as count
      FROM orders_readable
      WHERE drink_type = 'cerveza'
    `);
    console.log(`   ✓ Cerveza orders: ${JSON.stringify(cervezeCount)}`);

    // Test 4: Check distinct values
    console.log('\n📈 Test 4: Distinct drink types');
    const distinctTypes = (await db.all(sql`
      SELECT DISTINCT drink_type, COUNT(*) as count
      FROM orders_readable
      GROUP BY drink_type
      ORDER BY count DESC
    `)) as DrinkTypeCount[];
    console.log('   ✓ Drink type breakdown:');
    distinctTypes.forEach((type) => {
      console.log(`     - ${type.drink_type}: ${type.count} orders`);
    });

    // Test 5: Complex join verification
    console.log('\n🔗 Test 5: Verify JOIN integrity');
    const joinTest = (await db.all(sql`
      SELECT
        drink_type,
        COUNT(*) as total_orders,
        COUNT(DISTINCT volume) as volume_varieties,
        COUNT(DISTINCT container_type) as container_varieties
      FROM orders_readable
      GROUP BY drink_type
    `)) as JoinIntegrityResult[];
    console.log('   ✓ JOIN integrity check:');
    joinTest.forEach((result) => {
      console.log(
        `     - ${result.drink_type}: ${result.total_orders} orders, ${result.volume_varieties} volumes, ${result.container_varieties} containers`,
      );
    });

    console.log('\n✅ All view tests passed! Drizzle can query the view successfully.');
  } catch (error) {
    console.error('\n❌ View test failed:', error);
    throw error;
  }
}

// CLI support - run when called directly
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  testOrdersReadableView()
    .then(() => {
      console.log('\n🎉 View testing completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 View testing failed:', error);
      process.exit(1);
    });
}
