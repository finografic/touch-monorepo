import { db } from '../db';
import { account, user } from '../db/schemas';
import { eq } from 'drizzle-orm';
import { auth } from '../lib/auth';

async function createNewAdmin() {
  try {
    // Create a new admin user
    const result = await auth.api.signUpEmail({
      body: {
        email: 'newadmin@example.com',
        password: 'admin123',
        name: 'New Admin User',
      },
    });

    console.log('New admin user created:', result);

    // Update the user to have admin role
    const newUser = await db.select().from(user).where(eq(user.email, 'newadmin@example.com')).limit(1);

    if (newUser[0]) {
      await db.update(user).set({ role: 'admin' }).where(eq(user.email, 'newadmin@example.com'));

      console.log('New admin user role updated');
    }
  } catch (error) {
    console.error('Error creating new admin user:', error);
  }
}

createNewAdmin();
