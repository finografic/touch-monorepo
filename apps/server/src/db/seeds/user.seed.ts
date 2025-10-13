import { db } from 'db';
import { auth } from 'lib/auth';
import { user } from '../schemas';

export async function seed() {
  console.log('Seeding user...');

  try {
    // Check if users already exist
    const existingUsers = await db.select().from(user).limit(1);
    if (existingUsers.length > 0) {
      console.log('✓ User table already seeded, skipping...');
      return existingUsers;
    }

    // Use better-auth's API to create users
    for (const userData of [
      {
        email: 'admin@example.com',
        password: 'password123',
        name: 'Admin User',
        role: 'admin',
      },
      {
        email: 'user@example.com',
        password: 'password123',
        name: 'Regular User',
        role: 'user',
      },
      {
        email: 'guest@example.com',
        password: 'password123',
        name: 'Guest User',
      },
    ]) {
      await (auth.api.signUpEmail as any)({ body: userData });
    }

    console.log('✅ User and auth accounts seeded successfully!');
    return existingUsers;
  } catch (error) {
    console.error('❌ Error seeding user:', error);
    throw error;
  }
}
