import createCuid from '@bugsnag/cuid';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { sqliteBooleanField } from 'lib/zod.utils';

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

// Zod schema for validation
const insertTranslationAdminSchema = createInsertSchema(translations_admin, {
  key: (schema) => schema.key.min(1).max(255),
  translations: (schema) => schema.translations,
  isActive: () => sqliteBooleanField(),
})
  .required({
    key: true,
    translations: true,
  })
  .omit({ id: true, createdAt: true, updatedAt: true });

// Create patch schema
const patchTranslationAdminSchema = insertTranslationAdminSchema.partial().extend({
  translations: createSelectSchema(translations_admin).shape.translations.optional(),
  isActive: sqliteBooleanField().optional(),
});

export const translationAdminSchemas = {
  select: createSelectSchema(translations_admin, {
    translations: (schema) => schema.translations.optional(),
  }),
  insert: insertTranslationAdminSchema,
  patch: patchTranslationAdminSchema,
} as const;
