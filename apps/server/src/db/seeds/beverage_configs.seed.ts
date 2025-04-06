import { db } from '../db.adapter';
import { eq } from 'drizzle-orm';
import { beverage_configs, beverage_types, container_types, volumes } from '../schemas';

export async function seed() {
  console.log('Seeding beverage_configs...');

  try {
    // Check if configs already exist
    const existing = await db.select().from(beverage_configs).limit(1);
    if (existing.length > 0) {
      console.log('✓ Beverage configs already seeded, skipping...');
      return;
    }

    // Get all required references
    const [beerType] = await db.select().from(beverage_types).where(eq(beverage_types.name, 'cerveza'));
    const [plasticType] = await db.select().from(container_types).where(eq(container_types.name, 'plastico'));
    const [glassType] = await db.select().from(container_types).where(eq(container_types.name, 'vidrio'));
    const [metalType] = await db.select().from(container_types).where(eq(container_types.name, 'metal'));
    const [vol33cl] = await db.select().from(volumes).where(eq(volumes.name, '33cl'));
    const [vol50cl] = await db.select().from(volumes).where(eq(volumes.name, '50cl'));
    const [vol2L] = await db.select().from(volumes).where(eq(volumes.name, '2L'));

    if (!beerType || !plasticType || !glassType || !metalType || !vol33cl || !vol50cl || !vol2L) {
      throw new Error('Required reference data not found');
    }

    // Insert beverage configs
    await db.insert(beverage_configs).values([
      // Beer in 33cl plastic
      {
        beverageTypeId: beerType.id,
        containerTypeId: plasticType.id,
        volumeId: vol33cl.id,
        defaultConsumptionTemp: beerType.defaultConsumptionTemp,
        minConsumptionTemp: beerType.defaultConsumptionTemp - 1,
        maxConsumptionTemp: beerType.defaultConsumptionTemp + 2,
        timeTableId1: '1001',
        timeTableId2: '2001',
        timeTableId3: '3001',
      },
      // Beer in 50cl plastic
      {
        beverageTypeId: beerType.id,
        containerTypeId: plasticType.id,
        volumeId: vol50cl.id,
        defaultConsumptionTemp: beerType.defaultConsumptionTemp,
        minConsumptionTemp: beerType.defaultConsumptionTemp - 1,
        maxConsumptionTemp: beerType.defaultConsumptionTemp + 2,
        timeTableId1: '1001',
        timeTableId2: '2001',
        timeTableId3: '3001',
      },
      // Beer in 33cl glass
      {
        beverageTypeId: beerType.id,
        containerTypeId: glassType.id,
        volumeId: vol33cl.id,
        defaultConsumptionTemp: beerType.defaultConsumptionTemp,
        minConsumptionTemp: beerType.defaultConsumptionTemp - 1,
        maxConsumptionTemp: beerType.defaultConsumptionTemp + 2,
        timeTableId1: '1001',
        timeTableId2: '2001',
        timeTableId3: '3001',
      },
      // Beer in 2L metal
      {
        beverageTypeId: beerType.id,
        containerTypeId: metalType.id,
        volumeId: vol2L.id,
        defaultConsumptionTemp: beerType.defaultConsumptionTemp,
        minConsumptionTemp: beerType.defaultConsumptionTemp - 1,
        maxConsumptionTemp: beerType.defaultConsumptionTemp + 2,
        timeTableId1: '1001',
        timeTableId2: '2001',
        timeTableId3: '3001',
      },
    ]);

    console.log('✅ Beverage configs seed completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding beverage configs:', error);
    throw error;
  }
}
