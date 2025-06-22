import { db } from '../db.adapter';
import { translatable_entities } from '../schemas';

export async function seed() {
  console.log('Seeding translatable_entities...');

  try {
    // Check if entities already exist
    const existing = await db.select().from(translatable_entities).limit(1);
    if (existing.length > 0) {
      console.log('✓ Translatable entities already seeded, skipping...');
      return;
    }

    // Insert current translatable entities (tables that have name_* columns)
    const insertedEntities = await db
      .insert(translatable_entities)
      .values([
        {
          tableName: 'drink_types',
          entityName: 'Drink Types',
          description: 'Main drink categories (cerveza, vino, cava, licor, etc.)',
          isActive: true,
          sortOrder: 1,
        },
        {
          tableName: 'drink_subtypes',
          entityName: 'Drink Subtypes',
          description: 'Drink subcategories (rubia, negra, tinto, blanco, etc.)',
          isActive: true,
          sortOrder: 2,
        },
        {
          tableName: 'container_types',
          entityName: 'Container Types',
          description: 'Container materials (plastic, glass, metal)',
          isActive: true,
          sortOrder: 3,
        },
        {
          tableName: 'volumes',
          entityName: 'Volumes',
          description: 'Container volumes and sizes',
          isActive: true,
          sortOrder: 4,
        },
      ])
      .returning();

    console.log('✅ Translatable entities seed completed successfully!');
    console.log(`   Inserted ${insertedEntities.length} entities`);
    return insertedEntities;
  } catch (error) {
    console.error('❌ Error seeding translatable entities:', error);
    throw error;
  }
}
