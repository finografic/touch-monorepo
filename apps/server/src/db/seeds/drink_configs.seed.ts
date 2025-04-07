import { db } from '../db.adapter';
import { eq } from 'drizzle-orm';
import { drink_configs, drink_types, container_types, volumes } from '../schemas';
import createCuid from '@bugsnag/cuid';

export async function seed() {
  console.log('Seeding drink_configs...');

  try {
    // Check if configs already exist
    const existing = await db.select().from(drink_configs).limit(1);
    if (existing.length > 0) {
      console.log('✓ Drink configs already seeded, skipping...');
      return;
    }

    // Get all required references
    const [beerType] = await db.select().from(drink_types).where(eq(drink_types.name, 'cerveza'));
    const [plasticType] = await db.select().from(container_types).where(eq(container_types.name, 'plastico'));
    const [glassType] = await db.select().from(container_types).where(eq(container_types.name, 'vidrio'));
    const [metalType] = await db.select().from(container_types).where(eq(container_types.name, 'metal'));
    const [vol33cl] = await db.select().from(volumes).where(eq(volumes.name, '33cl'));
    const [vol50cl] = await db.select().from(volumes).where(eq(volumes.name, '50cl'));
    const [vol2L] = await db.select().from(volumes).where(eq(volumes.name, '2L'));

    if (!beerType || !plasticType || !glassType || !metalType || !vol33cl || !vol50cl || !vol2L) {
      throw new Error('Required reference data not found');
    }

    // Insert drink configs
    await db.insert(drink_configs).values([
      // Beer in 33cl plastic
      {
        id: createCuid(),
        drink_type_id: beerType.id,
        container_type_id: plasticType.id,
        volume_id: vol33cl.id,
        default_consumption_temp: beerType.default_consumption_time,
        min_consumption_temp: beerType.default_consumption_time - 1,
        max_consumption_temp: beerType.default_consumption_time + 2,
        time_table_id_1: '1001',
        time_table_id_2: '2001',
        time_table_id_3: '3001',
        is_active: 1,
      },
      // Beer in 50cl plastic
      {
        id: createCuid(),
        drink_type_id: beerType.id,
        container_type_id: plasticType.id,
        volume_id: vol50cl.id,
        default_consumption_temp: beerType.default_consumption_time,
        min_consumption_temp: beerType.default_consumption_time - 1,
        max_consumption_temp: beerType.default_consumption_time + 2,
        time_table_id_1: '1001',
        time_table_id_2: '2001',
        time_table_id_3: '3001',
        is_active: 1,
      },
      // Beer in 33cl glass
      {
        id: createCuid(),
        drink_type_id: beerType.id,
        container_type_id: glassType.id,
        volume_id: vol33cl.id,
        default_consumption_temp: beerType.default_consumption_time,
        min_consumption_temp: beerType.default_consumption_time - 1,
        max_consumption_temp: beerType.default_consumption_time + 2,
        time_table_id_1: '1001',
        time_table_id_2: '2001',
        time_table_id_3: '3001',
        is_active: 1,
      },
      // Beer in 2L metal
      {
        id: createCuid(),
        drink_type_id: beerType.id,
        container_type_id: metalType.id,
        volume_id: vol2L.id,
        default_consumption_temp: beerType.default_consumption_time,
        min_consumption_temp: beerType.default_consumption_time - 1,
        max_consumption_temp: beerType.default_consumption_time + 2,
        time_table_id_1: '1001',
        time_table_id_2: '2001',
        time_table_id_3: '3001',
        is_active: 1,
      },
    ]);

    console.log('✅ Drink configs seed completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding drink configs:', error);
    throw error;
  }
}
