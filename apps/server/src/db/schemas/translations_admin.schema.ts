import createCuid from '@bugsnag/cuid';
import { createInsertSchema, createSelectSchema } from 'drizzle-valibot';
import * as v from 'valibot';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { sqliteBooleanField } from 'lib/valibot.utils';

/**
 * Admin Translations Table
 *
 * Stores admin panel translation strings with dot-notation keys (e.g., "admin.title", "admin.pages.dashboard.title")
 * Translations are stored as JSON string in the translations column, keyed by language code (e.g., "es-ES", "en-GB", "ca-ES")
 */
export const translations_admin = sqliteTable('translations_admin', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createCuid()),
  key: text('key').notNull().unique(), // Dot notation key: "admin.title", "admin.pages.dashboard.title", etc.
  // JSON translations column for dynamic language support
  translations: text('translations', { mode: 'json' })
    .$type<Record<string, string>>()
    .notNull()
    .default({ 'en-GB': '' }),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

const insertTranslationAdminSchema = v.omit(
  createInsertSchema(translations_admin, {
    key: v.pipe(v.string(), v.minLength(1), v.maxLength(255)),
    translations: v.record(v.string(), v.string()),
    isActive: sqliteBooleanField(),
  }),
  ['id', 'createdAt', 'updatedAt'],
);

const patchTranslationAdminSchema = v.partial(
  v.object({
    ...v.omit(insertTranslationAdminSchema, ['translations']).entries,
    translations: v.optional(v.record(v.string(), v.string())),
    isActive: v.optional(sqliteBooleanField()),
  }),
);

export const translationAdminSchemas = {
  select: createSelectSchema(translations_admin, {
    translations: v.optional(v.record(v.string(), v.string())),
  }),
  insert: insertTranslationAdminSchema,
  patch: patchTranslationAdminSchema,
} as const;

export type TranslationAdminModel = v.InferOutput<typeof translationAdminSchemas.select>;
export type TranslationAdminInsert = v.InferOutput<typeof translationAdminSchemas.insert>;
export type TranslationAdminPatch = v.InferOutput<typeof translationAdminSchemas.patch>;
