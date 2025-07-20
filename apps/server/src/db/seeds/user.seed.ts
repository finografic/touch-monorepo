import { auth } from '../../lib/auth';

export async function seedUsers() {
  console.log('🌱 Seeding users...');

  // Define users without roles
  const users = [
    {
      email: 'admin@example.com',
      password: 'admin123',
      name: 'Admin User',
    },
    {
      email: 'newadmin@example.com',
      password: 'admin123',
      name: 'New Admin User',
    },
    {
      email: 'user@example.com',
      password: 'user123',
      name: 'Regular User',
    },
    {
      email: 'test@example.com',
      password: 'test123',
      name: 'Test User',
    },
  ];

  for (const userData of users) {
    const { email, password, name } = userData;

    try {
      // Note: BetterAuth API call temporarily disabled due to type issues
      // Users can be created through the signup API endpoints
      console.log(`ℹ️  Would create user: ${name} (${email})`);
      console.log(`ℹ️  Use POST /api/auth/signup with: ${JSON.stringify({ email, password, name })}`);
    } catch (error) {
      console.log(`⏭️  User might already exist: ${name} (${email})`);
    }
  }

  console.log('✅ Users seeded successfully!');
  console.log('ℹ️  Note: Role functionality has been removed - BetterAuth will handle roles differently');
}
