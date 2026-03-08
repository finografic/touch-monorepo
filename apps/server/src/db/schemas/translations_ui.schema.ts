import createCuid from '@bugsnag/cuid';
import * as v from 'valibot';
import { createInsertSchema, createSelectSchema } from 'drizzle-valibot';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { sqliteBooleanField } from 'lib/valibot.utils';

/**
 * UI Translations Table
 *
 * Stores UI translation strings with dot-notation keys (e.g., "buttons.add", "tables.headers.name")
 * Translations are stored as JSON string in the translations column, keyed by language code (e.g., "es-ES", "en-GB", "ca-ES")
 */
export const translations_ui = sqliteTable('translations_ui', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createCuid()),
  key: text('key').notNull().unique(), // Dot notation key: "buttons.add", "tables.headers.name", etc.
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

const insertTranslationUiSchema = v.omit(
  createInsertSchema(translations_ui, {
    key:          v.pipe(v.string(), v.minLength(1), v.maxLength(255)),
    translations: v.record(v.string(), v.string()),
    isActive:     sqliteBooleanField(),
  }),
  ['id', 'createdAt', 'updatedAt'],
);

const patchTranslationUiSchema = v.partial(
  v.object({
    ...v.omit(insertTranslationUiSchema, ['translations']).entries,
    translations: v.optional(v.record(v.string(), v.string())),
    isActive:     v.optional(sqliteBooleanField()),
  }),
);

export const translationUiSchemas = {
  select: createSelectSchema(translations_ui, {
    translations: v.optional(v.record(v.string(), v.string())),
  }),
  insert: insertTranslationUiSchema,
  patch:  patchTranslationUiSchema,
} as const;

export type TranslationUiModel  = v.InferOutput<typeof translationUiSchemas.select>;
export type TranslationUiInsert = v.InferOutput<typeof translationUiSchemas.insert>;
export type TranslationUiPatch  = v.InferOutput<typeof translationUiSchemas.patch>;
