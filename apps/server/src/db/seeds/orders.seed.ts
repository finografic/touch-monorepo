import { db } from '../db.adapter';
import { container_types, drink_subtypes, drink_types, orders, volumes } from '../schemas';

function generateTableCode(prefix: string, index: number): string {
  return `${prefix}${String(index).padStart(3, '0')}`;
}

function getRandomSample<T>(arr: T[], n: number): T[] {
  const result = [];
  const used = new Set<number>();
  while (result.length < n && used.size < arr.length) {
    const idx = Math.floor(Math.random() * arr.length);
    if (!used.has(idx)) {
      used.add(idx);
      result.push(arr[idx]);
    }
  }
  return result;
}

export async function seed() {
  console.log('Seeding orders...');

  try {
    // Check if orders already exist
    const existing = await db.select().from(orders).limit(1);
    if (existing.length > 0) {
      console.log('✓ Orders already seeded, skipping...');
      return;
    }

    // Fetch all reference data
    const drinkTypes = await db.select().from(drink_types);
    const subtypes = await db.select().from(drink_subtypes);
    const allVolumes = await db.select().from(volumes);
    const allContainers = await db.select().from(container_types);

    const orderRows = [];
    let orderIndex = 1;

    for (const type of drinkTypes) {
      const typeSubtypes = subtypes.filter((s) => s.drinkTypeId === type.id);
      if (typeSubtypes.length === 0) {
        // No subtypes: create 2 entries
        for (let i = 0; i < 2; i++) {
          const volumes = getRandomSample(allVolumes, 3);
          const containers = getRandomSample(allContainers, 2);
          for (const volume of volumes) {
            for (const container of containers) {
              orderRows.push({
                drinkTypeName: type.name,
                drinkSubtypeName: null,
                containerTypeName: container.name,
                volumeName: volume.name,
                tableA: generateTableCode('A', orderIndex),
                tableB: generateTableCode('B', orderIndex),
                tableC: generateTableCode('C', orderIndex),
              });
              orderIndex++;
            }
          }
        }
      } else {
        // Has subtypes: for each subtype, create 4 entries
        for (const subtype of typeSubtypes) {
          for (let i = 0; i < 4; i++) {
            const volumes = getRandomSample(allVolumes, 3);
            const containers = getRandomSample(allContainers, 2);
            for (const volume of volumes) {
              for (const container of containers) {
                orderRows.push({
                  drinkTypeName: type.name,
                  drinkSubtypeName: subtype.name,
                  containerTypeName: container.name,
                  volumeName: volume.name,
                  tableA: generateTableCode('A', orderIndex),
                  tableB: generateTableCode('B', orderIndex),
                  tableC: generateTableCode('C', orderIndex),
                });
                orderIndex++;
              }
            }
          }
        }
      }
    }

    await db.insert(orders).values(orderRows);
    console.log(`✅ Inserted ${orderRows.length} orders!`);
    return orderRows;
  } catch (error) {
    console.error('❌ Error seeding orders:', error);
    throw error;
  }
}
