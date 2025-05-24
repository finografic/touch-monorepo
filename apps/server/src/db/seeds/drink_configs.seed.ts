import { db } from '../db.adapter';
import { eq } from 'drizzle-orm';
import { container_types, drink_configs, drink_types, volumes } from '../schemas';
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
    // Beer in 33cl plastic
    await db.insert(drink_configs).values({
      id: createCuid(),
      drinkTypeId: beerType.id,
      containerTypeId: plasticType.id,
      volumeId: vol33cl.id,
      defaultConsumptionTemp: beerType.defaultConsumptionTemp,
      minConsumptionTemp: beerType.defaultConsumptionTemp - 1,
      maxConsumptionTemp: beerType.defaultConsumptionTemp + 2,
      timeTableId1: '1001',
      timeTableId2: '2001',
      timeTableId3: '3001',
      isActive: true,
    });

    // Beer in 50cl plastic
    await db.insert(drink_configs).values({
      id: createCuid(),
      drinkTypeId: beerType.id,
      containerTypeId: plasticType.id,
      volumeId: vol50cl.id,
      defaultConsumptionTemp: beerType.defaultConsumptionTemp,
      minConsumptionTemp: beerType.defaultConsumptionTemp - 1,
      maxConsumptionTemp: beerType.defaultConsumptionTemp + 2,
      timeTableId1: '1001',
      timeTableId2: '2001',
      timeTableId3: '3001',
      isActive: true,
    });

    // Beer in 33cl glass
    await db.insert(drink_configs).values({
      id: createCuid(),
      drinkTypeId: beerType.id,
      containerTypeId: glassType.id,
      volumeId: vol33cl.id,
      defaultConsumptionTemp: beerType.defaultConsumptionTemp,
      minConsumptionTemp: beerType.defaultConsumptionTemp - 1,
      maxConsumptionTemp: beerType.defaultConsumptionTemp + 2,
      timeTableId1: '1001',
      timeTableId2: '2001',
      timeTableId3: '3001',
      isActive: true,
    });

    // Beer in 2L metal
    await db.insert(drink_configs).values({
      id: createCuid(),
      drinkTypeId: beerType.id,
      containerTypeId: metalType.id,
      volumeId: vol2L.id,
      defaultConsumptionTemp: beerType.defaultConsumptionTemp,
      minConsumptionTemp: beerType.defaultConsumptionTemp - 1,
      maxConsumptionTemp: beerType.defaultConsumptionTemp + 2,
      timeTableId1: '1001',
      timeTableId2: '2001',
      timeTableId3: '3001',
      isActive: true,
    });

    console.log('✅ Drink configs seed completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding drink configs:', error);
    throw error;
  }
}
