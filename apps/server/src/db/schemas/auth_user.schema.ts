import * as v from 'valibot';
import { createInsertSchema, createSelectSchema } from 'drizzle-valibot';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('auth_user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('emailVerified', { mode: 'boolean' }).notNull(),
  image: text('image'),
  role: text('role', { enum: ['public', 'user', 'admin'] })
    .notNull()
    .default('user'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
});

const insertUserSchema = v.omit(createInsertSchema(user), [
  'id',
  'emailVerified',
  'createdAt',
  'updatedAt',
]);

export const userSchemas = {
  select: createSelectSchema(user),
  patch:  v.partial(insertUserSchema),
} as const;

export type UserModel = v.InferOutput<typeof userSchemas.select>;
export type UserPatch = v.InferOutput<typeof userSchemas.patch>;
