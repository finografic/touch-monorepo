/* eslint-disable style/quotes */
import { confirm } from '@inquirer/prompts';
import Database from 'better-sqlite3';
import chalk from 'chalk';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { env } from '../../env.server';
import { paths } from '@fino/config/paths';
import path from 'path';

interface TableInfo {
  name: string;
}

async function main() {
  console.log('Connecting to database at:', env.DB_PATH);

  const sqlite = new Database(env.DB_PATH);
  const db = drizzle(sqlite);

  // Get project root path (3 levels up from this file)
  // const projectRoot = path.resolve(__dirname, '../../../..');

  // Check if tables exist
  const result = db.$client
    .prepare(
      `SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_drizzle_%'`,
    )
    .all() as TableInfo[];

  if (result.length > 0) {
    const shouldDrop = await confirm({
      message: chalk.yellow('⚠️  Warning: This will drop existing tables. Are you sure?'),
      default: false,
    });

    if (!shouldDrop) {
      console.log('Operation cancelled');
      process.exit(0);
    }

    console.log('Dropping existing tables...');
    for (const { name } of result) {
      db.$client.prepare(`DROP TABLE IF EXISTS "${name}"`).run();
    }
  }

  // Run migrations
  console.log('Running migrations...');
  await migrate(db, {
    migrationsFolder: path.join(paths.data.dir, 'migrations'),
  });

  console.log('✅ Migrations completed successfully!');
}

main().catch((error) => {
  console.error('❌ Error resetting database:', error);
  process.exit(1);
});

/*

NOTE: drizzle-kit migrate:
- Is a CLI tool for generating migration files
- Compares your schema with the current state
- Creates new SQL migration files
- Does NOT execute the migrations
- Is what you use to create new migration files when you change your schema

NOTE: (this script) using drizzle-orm's migrator
- Actually executes the SQL migrations on your database
- Applies migrations that haven't been run yet
- Updates the _drizzle_migrations table in your database
- Is what you use to actually update your database schema

NOTE: Typical workflow:
- Make changes to your schema files
- Run pnpm migrate to generate the migration files
- Run pnpm db:migrate to apply those migrations to your database
- The first is for applying changes, the second is for creating them.

*/
