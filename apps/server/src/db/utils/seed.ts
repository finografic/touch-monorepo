import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import * as schemas from '../schemas';

// Convert URL to file path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to validate schema name
function isValidSchema(schema: string): boolean {
  return Object.keys(schemas).some(
    (key) =>
      key.toLowerCase() === `${schema}Schema` || // matches postSchema (example)
      key.toLowerCase() === schema || // matches posts (example)
      key.toLowerCase() === schema.replace(/-/g, '_'), // matches snake_case (example)
  );
}

async function seedSchema(schema: string) {
  try {
    // Validate schema name first
    if (!isValidSchema(schema)) {
      console.error(`❌ Invalid schema name: ${schema}`);
      console.log(
        `Available schemas: ${Object.keys(schemas)
          .filter((key) => !key.endsWith('Schema'))
          .join(', ')}`,
      );
      process.exit(1);
    }

    const seedFile = path.join(__dirname, '../seeds', `${schema}.seed.ts`);

    if (!fs.existsSync(seedFile)) {
      console.warn(`⚠️ No seed file found for schema: ${schema}`);
      console.log(`Expected seed file at: ${seedFile}`);
      return;
    }

    const { seed } = await import(`../seeds/${schema}.seed.ts`);
    console.log(`🌱 Seeding ${schema}...`);
    await seed();
    console.log(`✅ Seeded ${schema} successfully!`);
  } catch (error) {
    console.error(`❌ Error seeding ${schema}:`, error);
    throw error;
  }
}

// Get schema name from command line args
const schema = process.argv[2]?.toLowerCase(); // normalize to lowercase

if (!schema) {
  console.error('❌ No schema specified');
  process.exit(1);
}

seedSchema(schema).catch((error) => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});
