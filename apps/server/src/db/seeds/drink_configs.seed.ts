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
        drinkTypeId: beerType.id,
        containerTypeId: plasticType.id,
        volumeId: vol33cl.id,
        defaultConsumptionTemp: beerType.default_consumption_time,
        minConsumptionTemp: beerType.default_consumption_time - 1,
        maxConsumptionTemp: beerType.default_consumption_time + 2,
        timeTableId1: '1001',
        timeTableId2: '2001',
        timeTableId3: '3001',
        isActive: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      // Beer in 50cl plastic
      {
        id: createCuid(),
        drinkTypeId: beerType.id,
        containerTypeId: plasticType.id,
        volumeId: vol50cl.id,
        defaultConsumptionTemp: beerType.default_consumption_time,
        minConsumptionTemp: beerType.default_consumption_time - 1,
        maxConsumptionTemp: beerType.default_consumption_time + 2,
        timeTableId1: '1001',
        timeTableId2: '2001',
        timeTableId3: '3001',
        isActive: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      // Beer in 33cl glass
      {
        id: createCuid(),
        drinkTypeId: beerType.id,
        containerTypeId: glassType.id,
        volumeId: vol33cl.id,
        defaultConsumptionTemp: beerType.default_consumption_time,
        minConsumptionTemp: beerType.default_consumption_time - 1,
        maxConsumptionTemp: beerType.default_consumption_time + 2,
        timeTableId1: '1001',
        timeTableId2: '2001',
        timeTableId3: '3001',
        isActive: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      // Beer in 2L metal
      {
        id: createCuid(),
        drinkTypeId: beerType.id,
        containerTypeId: metalType.id,
        volumeId: vol2L.id,
        defaultConsumptionTemp: beerType.default_consumption_time,
        minConsumptionTemp: beerType.default_consumption_time - 1,
        maxConsumptionTemp: beerType.default_consumption_time + 2,
        timeTableId1: '1001',
        timeTableId2: '2001',
        timeTableId3: '3001',
        isActive: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    console.log('✅ Drink configs seed completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding drink configs:', error);
    throw error;
  }
}
