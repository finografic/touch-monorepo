import type { DrizzleAdminConfig } from 'drizzle-admin/types';
import { db } from '@workspace/server/db';
import { orders } from '@workspace/server/db/schemas';

export const config: DrizzleAdminConfig = {
  basePath: '/admin',
  schema: {
    orders: { drizzleTable: orders },
  },
  db,
  dbDialect: 'sqlite',
};
