import { eq } from 'drizzle-orm';

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

    // Use Better Auth's signup API to create users with properly hashed passwords
    const usersToCreate = [
      {
        email: 'admin@example.com',
        password: '7878', // 4-digit PIN
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
        // Use Better Auth's signup API - this properly hashes the password
        const { email, password, name } = userData;

        // Create a mock request object for Better Auth API
        const mockRequest = new Request('http://localhost/api/auth/sign-up/email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password, name }),
        });

        // Use Better Auth's handler to process the signup
        const response = await auth.handler(mockRequest);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Signup failed for ${email}: ${errorText}`);
        }

        const result = await response.json();

        // Update user with role if needed (Better Auth creates the user, we update the role)
        if (userData.role && result.user?.id) {
          await db.update(user).set({ role: userData.role }).where(eq(user.id, result.user.id));

          console.log(`✓ Created ${userData.role} user: ${email}`);
        } else {
          console.log(`✓ Created user: ${email}`);
        }
      } catch (error) {
        console.error(`❌ Error creating user ${userData.email}:`, error);
        // Continue with other users even if one fails
      }
    }

    console.log('✅ User and auth accounts seeded successfully!');
    return existingUsers;
  } catch (error) {
    console.error('❌ Error seeding user:', error);
    throw error;
  }
}
