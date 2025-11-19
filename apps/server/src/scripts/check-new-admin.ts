import { eq } from 'drizzle-orm';

import { db } from '../db';
import { account, user } from '../db/schemas';

async function checkNewAdminUser() {
  try {
    // Get the new admin user
    const adminUser = await db.select().from(user).where(eq(user.email, 'newadmin@example.com')).limit(1);

    console.log('New admin user:', adminUser[0]);

    // Get the new admin user's account
    const adminAccount = await db.select().from(account).where(eq(account.userId, adminUser[0].id)).limit(1);

    console.log('New admin account:', adminAccount[0]);
  } catch (error) {
    console.error('Error checking new admin user:', error);
  }
}

checkNewAdminUser();
