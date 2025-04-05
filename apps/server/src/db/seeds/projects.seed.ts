import { db } from 'db';
import { projects, user } from '../schemas';
import { seed as seedUsers } from './user.seed';

export async function seed() {
  console.log('Seeding projects...');

  try {
    // Check if projects already exist
    const existingProjects = await db.select().from(projects).limit(1);
    if (existingProjects.length > 0) {
      console.log('✓ Projects already seeded, skipping...');
      return;
    }

    // Get users (will be skipped if already exist)
    await seedUsers();

    // Get the first two users for references
    const [adminUser, regularUser] = await db.select().from(user).limit(2);
    if (!adminUser || !regularUser) {
      throw new Error('Required users not found');
    }

    const insertedProjects = await db.insert(projects).values([
      {
        name: 'Personal Website',
        userId: adminUser.id,
      },
      {
        name: 'Mobile App',
        userId: adminUser.id,
      },
      {
        name: 'Blog Platform',
        userId: regularUser.id,
      },
    ]);

    console.log('✅ Projects seed completed successfully!');
    console.log('Inserted projects:', insertedProjects);
  } catch (error) {
    console.error('❌ Error seeding projects:', error);
    throw error;
  }
}
