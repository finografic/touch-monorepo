import { db } from '../db';
import { user } from '../db/schemas';
import { eq } from 'drizzle-orm';

async function updateAdminUser() {
  try {
    // Update the admin user to have admin role
    const result = await db.update(user).set({ role: 'admin' }).where(eq(user.email, 'admin@example.com'));

    console.log('Admin user updated successfully');

    // Verify the update
    const adminUser = await db.select().from(user).where(eq(user.email, 'admin@example.com')).limit(1);

    console.log('Admin user:', adminUser[0]);
  } catch (error) {
    console.error('Error updating admin user:', error);
  }
}

updateAdminUser();
