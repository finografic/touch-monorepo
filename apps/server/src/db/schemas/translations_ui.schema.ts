import createCuid from '@bugsnag/cuid';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { sqliteBooleanField } from '../../lib/zod.utils';

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
  description: text('description'), // Optional: CMS helper text for translators
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

// Zod schema for validation
const insertTranslationUiSchema = createInsertSchema(translations_ui, {
  key: (schema) => schema.key.min(1).max(255), // Reasonable key length limit
  translations: (schema) => schema.translations, // Keep as-is for JSON validation
  description: (schema) => schema.description.max(500).optional(), // Optional description
  isActive: () => sqliteBooleanField(), // Handle boolean/integer conversion
})
  .required({
    key: true,
    translations: true,
  })
  .omit({ id: true, createdAt: true, updatedAt: true });

// Create patch schema that includes translations and handles boolean fields
const patchTranslationUiSchema = insertTranslationUiSchema.partial().extend({
  translations: createSelectSchema(translations_ui).shape.translations.optional(),
  isActive: sqliteBooleanField().optional(), // Handle boolean/integer conversion for PATCH
});

export const translationUiSchemas = {
  select: createSelectSchema(translations_ui, {
    translations: (schema) => schema.translations.optional(), // Simplified schema for translations
  }),
  insert: insertTranslationUiSchema,
  patch: patchTranslationUiSchema,
} as const;

