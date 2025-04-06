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

    // Get references to existing data
    const [beer] = await db.select().from(beverage_types).where(eq(beverage_types.name, 'Cerveza'));
    const [plastic] = await db.select().from(container_types).where(eq(container_types.name, 'plastico'));
    const [glass] = await db.select().from(container_types).where(eq(container_types.name, 'vidrio'));
    const [metal] = await db.select().from(container_types).where(eq(container_types.name, 'metal'));
    const [vol33cl] = await db.select().from(volumes).where(eq(volumes.name, '33cl'));
    const [vol50cl] = await db.select().from(volumes).where(eq(volumes.name, '50cl'));
    const [vol2L] = await db.select().from(volumes).where(eq(volumes.name, '2L'));

    if (!beer || !plastic || !glass || !metal || !vol33cl || !vol50cl || !vol2L) {
      throw new Error('Required reference data not found');
    }

    // Insert common configurations
    const insertedConfigs = await db.insert(beverage_configs).values([
      // Beer in 33cl plastic
      {
        beverageTypeId: beer.id,
        containerTypeId: plastic.id,
        volumeId: vol33cl.id,
        defaultConsumptionTemp: beer.defaultConsumptionTemp,
        minConsumptionTemp: beer.defaultConsumptionTemp - 1,
        maxConsumptionTemp: beer.defaultConsumptionTemp + 2,
        timeTableId1: '1001', // Element 1
        timeTableId2: '2001', // Elements 2-9
        timeTableId3: '3001', // Element 10
      },
      // Beer in 50cl plastic
      {
        beverageTypeId: beer.id,
        containerTypeId: plastic.id,
        volumeId: vol50cl.id,
        defaultConsumptionTemp: beer.defaultConsumptionTemp,
        minConsumptionTemp: beer.defaultConsumptionTemp - 1,
        maxConsumptionTemp: beer.defaultConsumptionTemp + 2,
        timeTableId1: '1001',
        timeTableId2: '2001',
        timeTableId3: '3001',
      },
      // Beer in 33cl glass
      {
        beverageTypeId: beer.id,
        containerTypeId: glass.id,
        volumeId: vol33cl.id,
        defaultConsumptionTemp: beer.defaultConsumptionTemp,
        minConsumptionTemp: beer.defaultConsumptionTemp - 1,
        maxConsumptionTemp: beer.defaultConsumptionTemp + 2,
        timeTableId1: '1001',
        timeTableId2: '2001',
        timeTableId3: '3001',
      },
      // Beer in 2L metal
      {
        beverageTypeId: beer.id,
        containerTypeId: metal.id,
        volumeId: vol2L.id,
        defaultConsumptionTemp: beer.defaultConsumptionTemp,
        minConsumptionTemp: beer.defaultConsumptionTemp - 1,
        maxConsumptionTemp: beer.defaultConsumptionTemp + 2,
        timeTableId1: '1001',
        timeTableId2: '2001',
        timeTableId3: '3001',
      },
    ]);

    console.log('✅ Beverage configs seed completed successfully!');
    return insertedConfigs;
  } catch (error) {
    console.error('❌ Error seeding beverage configs:', error);
    throw error;
  }
}
