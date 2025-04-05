import createCuid from '@bugsnag/cuid';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { user } from './auth_user.schema';

export const posts = sqliteTable('posts', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createCuid()),
  name: text('name').notNull(),
  cat_id: text('cat_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  json_meta: text('json_meta').notNull(),

  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),

  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

const insertPostsSchema = createInsertSchema(posts, {
  name: (schema) => schema.name.min(1).max(500),
})
  .required({ name: true })
  .omit({ id: true, createdAt: true, updatedAt: true });

export const postSchemas = {
  select: createSelectSchema(posts),
  insert: insertPostsSchema,
  patch: insertPostsSchema.partial(),
} as const;
