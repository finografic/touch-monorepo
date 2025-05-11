import createCuid from '@bugsnag/cuid';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

// Orders table
export const orders = sqliteTable('orders', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createCuid()),

  drinkTypeName: text('drink_type_name').notNull(), // references drink_types.name
  drinkSubtypeName: text('drink_subtype_name'), // references drink_subtypes.name (nullable)
  containerTypeName: text('container_type_name').notNull(), // references container_types.name
  volumeName: text('volume_name').notNull(), // references volumes.name

  // Add any other fields you need for orders here

  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

// Zod schema for validation
const insertOrderSchema = createInsertSchema(orders, {
  drinkTypeName: (schema) => schema.drinkTypeName.min(1).max(50),
  drinkSubtypeName: (schema) => schema.drinkSubtypeName.max(50),
  containerTypeName: (schema) => schema.containerTypeName.min(1).max(50),
  volumeName: (schema) => schema.volumeName.min(1).max(50),
})
  .required({
    drinkTypeName: true,
    containerTypeName: true,
    volumeName: true,
  })
  .omit({ id: true, createdAt: true, updatedAt: true });

export const orderSchemas = {
  select: createSelectSchema(orders),
  insert: insertOrderSchema,
  patch: insertOrderSchema.partial(),
} as const;
