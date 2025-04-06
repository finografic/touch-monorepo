import { db } from '../db.adapter';
import { eq } from 'drizzle-orm';
import { beverageConfigs, beverageTypes, containerTypes, volumes } from '../schemas';

export async function seed() {
  console.log('Seeding beverage_configs...');

  try {
    // Check if configs already exist
    const existing = await db.select().from(beverageConfigs).limit(1);
    if (existing.length > 0) {
      console.log('✓ Beverage configs already seeded, skipping...');
      return;
    }

    // Get references to existing data
    const [beer] = await db.select().from(beverageTypes).where(eq(beverageTypes.name, 'Cerveza'));
    const [can] = await db.select().from(containerTypes).where(eq(containerTypes.name, 'Lata'));
    const [bottle] = await db.select().from(containerTypes).where(eq(containerTypes.name, 'Botella'));
    const [keg] = await db.select().from(containerTypes).where(eq(containerTypes.name, 'Barril'));
    const [vol33cl] = await db.select().from(volumes).where(eq(volumes.name, '33cl'));
    const [vol50cl] = await db.select().from(volumes).where(eq(volumes.name, '50cl'));
    const [vol2L] = await db.select().from(volumes).where(eq(volumes.name, '2L'));

    if (!beer || !can || !bottle || !keg || !vol33cl || !vol50cl || !vol2L) {
      throw new Error('Required reference data not found');
    }

    // Insert common configurations
    const insertedConfigs = await db.insert(beverageConfigs).values([
      // Beer in 33cl can
      {
        beverageTypeId: beer.id,
        containerTypeId: can.id,
        volumeId: vol33cl.id,
        defaultConsumptionTemp: beer.defaultConsumptionTemp,
        minConsumptionTemp: beer.defaultConsumptionTemp - 1,
        maxConsumptionTemp: beer.defaultConsumptionTemp + 2,
        timeTableId1: '1001', // Element 1
        timeTableId2: '2001', // Elements 2-9
        timeTableId3: '3001', // Element 10
      },
      // Beer in 50cl can
      {
        beverageTypeId: beer.id,
        containerTypeId: can.id,
        volumeId: vol50cl.id,
        defaultConsumptionTemp: beer.defaultConsumptionTemp,
        minConsumptionTemp: beer.defaultConsumptionTemp - 1,
        maxConsumptionTemp: beer.defaultConsumptionTemp + 2,
        timeTableId1: '1001',
        timeTableId2: '2001',
        timeTableId3: '3001',
      },
      // Beer in 33cl bottle
      {
        beverageTypeId: beer.id,
        containerTypeId: bottle.id,
        volumeId: vol33cl.id,
        defaultConsumptionTemp: beer.defaultConsumptionTemp,
        minConsumptionTemp: beer.defaultConsumptionTemp - 1,
        maxConsumptionTemp: beer.defaultConsumptionTemp + 2,
        timeTableId1: '1001',
        timeTableId2: '2001',
        timeTableId3: '3001',
      },
      // Beer in 2L keg
      {
        beverageTypeId: beer.id,
        containerTypeId: keg.id,
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
