import createCuid from '@bugsnag/cuid';
import * as v from 'valibot';
import { createInsertSchema, createSelectSchema } from 'drizzle-valibot';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { sqliteBooleanField } from 'lib/valibot.utils';

/**
 * App Translations Table
 *
 * Stores app-level translation strings with dot-notation keys (e.g., "app.title", "app.pages.main.title")
 * Translations are stored as JSON string in the translations column, keyed by language code (e.g., "es-ES", "en-GB", "ca-ES")
 */
export const translations_app = sqliteTable('translations_app', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createCuid()),
  key: text('key').notNull().unique(), // Dot notation key: "app.title", "app.pages.main.title", etc.
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

const insertTranslationAppSchema = v.omit(
  createInsertSchema(translations_app, {
    key:          v.pipe(v.string(), v.minLength(1), v.maxLength(255)),
    translations: v.record(v.string(), v.string()),
    isActive:     sqliteBooleanField(),
  }),
  ['id', 'createdAt', 'updatedAt'],
);

const patchTranslationAppSchema = v.partial(
  v.object({
    ...v.omit(insertTranslationAppSchema, ['translations']).entries,
    translations: v.optional(v.record(v.string(), v.string())),
    isActive:     v.optional(sqliteBooleanField()),
  }),
);

export const translationAppSchemas = {
  select: createSelectSchema(translations_app, {
    translations: v.optional(v.record(v.string(), v.string())),
  }),
  insert: insertTranslationAppSchema,
  patch:  patchTranslationAppSchema,
} as const;

export type TranslationAppModel  = v.InferOutput<typeof translationAppSchemas.select>;
export type TranslationAppInsert = v.InferOutput<typeof translationAppSchemas.insert>;
export type TranslationAppPatch  = v.InferOutput<typeof translationAppSchemas.patch>;
