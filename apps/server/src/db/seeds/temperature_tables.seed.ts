import { db } from '../db.adapter';
import { temperatureTables, temperatureTableEntries } from '../schemas';

export async function seed() {
  console.log('Seeding temperature_tables...');

  try {
    // Check if temperature tables already exist
    const existing = await db.select().from(temperatureTables).limit(1);
    if (existing.length > 0) {
      console.log('✓ Temperature tables already seeded, skipping...');
      return;
    }

    // Insert the temperature tables
    const insertedTables = await db.insert(temperatureTables).values([
      {
        tableNumber: '1001',
        elementType: 1,
        description: 'Element 1 cooling table',
      },
      {
        tableNumber: '2001',
        elementType: 2,
        description: 'Elements 2-9 cooling table',
      },
      {
        tableNumber: '3001',
        elementType: 3,
        description: 'Element 10 cooling table',
      },
    ]);

    // Get all tables to reference their IDs
    const tables = await db.select().from(temperatureTables);
    const tableMap = new Map(tables.map((t) => [t.tableNumber, t.id]));

    // Insert entries for each table
    // Table 1001 (Element 1) - Slower cooling
    await db.insert(temperatureTableEntries).values([
      {
        tableId: tableMap.get('1001')!,
        temperature: 30,
        timeMinutes: 0,
        sortOrder: 1,
      },
      {
        tableId: tableMap.get('1001')!,
        temperature: 29,
        timeMinutes: 3,
        sortOrder: 2,
      },
      {
        tableId: tableMap.get('1001')!,
        temperature: 28,
        timeMinutes: 5,
        sortOrder: 3,
      },
      {
        tableId: tableMap.get('1001')!,
        temperature: 27,
        timeMinutes: 7,
        sortOrder: 4,
      },
      {
        tableId: tableMap.get('1001')!,
        temperature: 26,
        timeMinutes: 9,
        sortOrder: 5,
      },
      {
        tableId: tableMap.get('1001')!,
        temperature: 25,
        timeMinutes: 11,
        sortOrder: 6,
      },
    ]);

    // Table 2001 (Elements 2-9) - Medium cooling
    await db.insert(temperatureTableEntries).values([
      {
        tableId: tableMap.get('2001')!,
        temperature: 30,
        timeMinutes: 0,
        sortOrder: 1,
      },
      {
        tableId: tableMap.get('2001')!,
        temperature: 29,
        timeMinutes: 2,
        sortOrder: 2,
      },
      {
        tableId: tableMap.get('2001')!,
        temperature: 28,
        timeMinutes: 4,
        sortOrder: 3,
      },
      {
        tableId: tableMap.get('2001')!,
        temperature: 27,
        timeMinutes: 5.5,
        sortOrder: 4,
      },
      {
        tableId: tableMap.get('2001')!,
        temperature: 26,
        timeMinutes: 7.4,
        sortOrder: 5,
      },
      {
        tableId: tableMap.get('2001')!,
        temperature: 25,
        timeMinutes: 8,
        sortOrder: 6,
      },
    ]);

    // Table 3001 (Element 10) - Fast cooling
    await db.insert(temperatureTableEntries).values([
      {
        tableId: tableMap.get('3001')!,
        temperature: 30,
        timeMinutes: 0,
        sortOrder: 1,
      },
      {
        tableId: tableMap.get('3001')!,
        temperature: 29,
        timeMinutes: 2.3,
        sortOrder: 2,
      },
      {
        tableId: tableMap.get('3001')!,
        temperature: 28,
        timeMinutes: 4.7,
        sortOrder: 3,
      },
      {
        tableId: tableMap.get('3001')!,
        temperature: 27,
        timeMinutes: 6.2,
        sortOrder: 4,
      },
      {
        tableId: tableMap.get('3001')!,
        temperature: 26,
        timeMinutes: 8.1,
        sortOrder: 5,
      },
      {
        tableId: tableMap.get('3001')!,
        temperature: 25,
        timeMinutes: 9.6,
        sortOrder: 6,
      },
    ]);

    console.log('✅ Temperature tables seed completed successfully!');
    return insertedTables;
  } catch (error) {
    console.error('❌ Error seeding temperature tables:', error);
    throw error;
  }
}
