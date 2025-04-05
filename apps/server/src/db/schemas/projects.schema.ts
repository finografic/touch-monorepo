import createCuid from '@bugsnag/cuid';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { user } from './auth_user.schema';

export const projects = sqliteTable('projects', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createCuid()),
  name: text('name').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

const insertProjectsSchema = createInsertSchema(projects, {
  name: (schema) => schema.name.min(1).max(500),
})
  .required({ name: true, userId: true })
  .omit({ id: true, createdAt: true, updatedAt: true });

export const projectSchemas = {
  select: createSelectSchema(projects),
  insert: insertProjectsSchema,
  patch: insertProjectsSchema.partial(),
} as const;
