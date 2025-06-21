import { orders } from '../../../../../server/src/db/schemas/orders.schema';
import { db } from '../../../../../server/src/db';
import type { DrizzleAdminConfig } from 'drizzle-admin/types';

export const config: DrizzleAdminConfig = {
  basePath: '/admin',
  schema: {
    orders: { drizzleTable: orders },
  },
  db,
  dbDialect: 'sqlite',
};
