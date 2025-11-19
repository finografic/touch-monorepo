import { eq } from 'drizzle-orm';

import { db } from '../db';
import { account, user } from '../db/schemas';

async function checkAdminUser() {
  try {
    // Get the admin user
    const adminUser = await db.select().from(user).where(eq(user.email, 'admin@example.com')).limit(1);

    console.log('Admin user:', adminUser[0]);

    // Get the admin user's account
    const adminAccount = await db.select().from(account).where(eq(account.userId, adminUser[0].id)).limit(1);

    console.log('Admin account:', adminAccount[0]);
  } catch (error) {
    console.error('Error checking admin user:', error);
  }
}

checkAdminUser();
