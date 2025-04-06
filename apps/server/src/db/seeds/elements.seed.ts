import { db } from '../db.adapter';
import { elements } from '../schemas';

export async function seed() {
  console.log('Seeding elements...');

  try {
    // Check if elements already exist
    const existing = await db.select().from(elements).limit(1);
    if (existing.length > 0) {
      console.log('✓ Elements already seeded, skipping...');
      return;
    }

    // Insert all elements (1-11)
    const insertedElements = await db.insert(elements).values([
      // Element 1 (Single - Special cooling)
      {
        elementNumber: 1,
        displayName: 'Element 1',
        elementType: 1, // Single element type
        position: '1,1',
        voltage: 24,
      },
      // Elements 2-9 (Group - Standard cooling)
      {
        elementNumber: 2,
        displayName: 'Element 2',
        elementType: 2, // Group element type
        position: '1,2',
        voltage: 24,
      },
      {
        elementNumber: 3,
        displayName: 'Element 3',
        elementType: 2,
        position: '1,3',
        voltage: 24,
      },
      {
        elementNumber: 4,
        displayName: 'Element 4',
        elementType: 2,
        position: '2,1',
        voltage: 24,
      },
      {
        elementNumber: 5,
        displayName: 'Element 5',
        elementType: 2,
        position: '2,2',
        voltage: 24,
      },
      {
        elementNumber: 6,
        displayName: 'Element 6',
        elementType: 2,
        position: '2,3',
        voltage: 24,
      },
      {
        elementNumber: 7,
        displayName: 'Element 7',
        elementType: 2,
        position: '3,1',
        voltage: 24,
      },
      {
        elementNumber: 8,
        displayName: 'Element 8',
        elementType: 2,
        position: '3,2',
        voltage: 24,
      },
      {
        elementNumber: 9,
        displayName: 'Element 9',
        elementType: 2,
        position: '3,3',
        voltage: 24,
      },
      // Element 10 (Single - Fast cooling)
      {
        elementNumber: 10,
        displayName: 'Element 10',
        elementType: 1,
        position: '4,1',
        voltage: 24,
      },
      // Element 11 (Switch element)
      {
        elementNumber: 11,
        displayName: 'Switch Element',
        elementType: 3, // Switch type
        position: '4,2',
        voltage: 12,
      },
    ]);

    console.log('✅ Elements seed completed successfully!');
    return insertedElements;
  } catch (error) {
    console.error('❌ Error seeding elements:', error);
    throw error;
  }
}
