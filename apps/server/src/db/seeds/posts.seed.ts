import { db } from '../db.adapter';
import { posts, user } from '../schemas';
import { seed as seedUsers } from './user.seed';

export async function seed() {
  console.log('Seeding posts...');

  try {
    // Check if posts already exist
    const existingPosts = await db.select().from(posts).limit(1);
    if (existingPosts.length > 0) {
      console.log('✓ Posts already seeded, skipping...');
      return;
    }

    // Get users (will be skipped if already exist)
    await seedUsers();

    // Get the first two users for references
    const [adminUser, regularUser] = await db.select().from(user).limit(2);
    if (!adminUser || !regularUser) {
      throw new Error('Required users not found');
    }

    const insertedPosts = await db.insert(posts).values([
      {
        name: 'Getting Started with Hono',
        cat_id: 'tutorials',
        userId: adminUser.id,
        json_meta: JSON.stringify({ tags: ['hono', 'typescript', 'api'] }),
        isActive: true,
      },
      {
        name: 'Understanding Drizzle ORM',
        cat_id: 'tutorials',
        userId: adminUser.id,
        json_meta: JSON.stringify({ tags: ['drizzle', 'database', 'orm'] }),
        isActive: true,
      },
      {
        name: 'My First Blog Post',
        cat_id: 'blog',
        userId: regularUser.id,
        json_meta: JSON.stringify({ tags: ['personal', 'introduction'] }),
        isActive: true,
      },
    ]);

    console.log('✅ Posts seed completed successfully!');
    return insertedPosts;
  } catch (error) {
    console.error('❌ Error seeding posts:', error);
    throw error;
  }
}
