import { db } from 'db';
import { user } from '../schemas';
import { hashPassword } from 'utils/password.utils';

export async function seed() {
  console.log('Seeding users...');

  try {
    const existingUsers = await db.select().from(user).limit(1);
    if (existingUsers.length > 0) {
      console.log('✓ User table already seeded, skipping...');
      return existingUsers;
    }

    const usersToCreate = [
      {
        email: 'admin@example.com',
        password: '8787',
        name: 'Admin User',
        role: 'admin' as const,
      },
      {
        email: 'user@example.com',
        password: 'password123',
        name: 'Regular User',
        role: 'user' as const,
      },
      {
        email: 'guest@example.com',
        password: 'password123',
        name: 'Guest User',
        role: 'user' as const,
      },
    ];

    for (const userData of usersToCreate) {
      try {
        const hashedPw = await hashPassword(userData.password);
        const now = new Date();

        await db.insert(user).values({
          name: userData.name,
          email: userData.email,
          hashedPassword: hashedPw,
          emailVerified: false,
          role: userData.role,
          createdAt: now,
          updatedAt: now,
        });

        console.log(`✓ Created ${userData.role} user: ${userData.email}`);
      } catch (error) {
        console.error(`Error creating user ${userData.email}:`, error);
      }
    }

    console.log('✅ Users seeded successfully!');
    return await db.select().from(user);
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}
