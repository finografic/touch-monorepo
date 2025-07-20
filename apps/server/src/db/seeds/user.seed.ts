import { db } from 'db';
import { auth } from '../../lib/auth';
import { user } from '../schemas';
import { eq } from 'drizzle-orm';

export async function seed() {
  console.log('Seeding users...');

  try {
    // Check if users already exist
    const existingUsers = await db.select().from(user).limit(1);
    if (existingUsers.length > 0) {
      console.log('✓ User table already seeded, skipping...');
      return existingUsers;
    }

    // Define users with their roles
    const usersToCreate = [
      {
        email: 'newadmin@example.com',
        password: 'admin123',
        name: 'New Admin User',
        role: 'admin' as const,
      },
      {
        email: 'admin@example.com',
        password: 'password123',
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

    // Use better-auth's API to create users
    for (const userData of usersToCreate) {
      const { email, password, name, role } = userData;

      // Create user with BetterAuth
      await auth.api.signUpEmail({
        body: { email, password, name },
      });

      // Update user role after creation
      await db.update(user).set({ role }).where(eq(user.email, email));

      console.log(`✅ Created user: ${name} (${email}) with role: ${role}`);
    }

    console.log('✅ All users seeded successfully!');

    // Return the created users for verification
    const createdUsers = await db.select().from(user);
    return createdUsers;
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  }
}
