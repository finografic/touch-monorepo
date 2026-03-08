import createCuid from '@bugsnag/cuid';
import * as v from 'valibot';
import { createInsertSchema, createSelectSchema } from 'drizzle-valibot';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { sqliteBooleanField } from '../../lib/valibot.utils';

// Supported languages table - single source of truth for language configuration
export const supported_languages = sqliteTable('supported_languages', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createCuid()),
  isoCode: text('iso_code').notNull().unique(), // 'en', 'es', 'ca', 'de'
  nativeName: text('native_name').notNull(), // 'English', 'Español', 'Català'
  displayName: text('display_name').notNull(), // For admin interface display
  flagCode: text('flag_code'), // 'US', 'ES', 'CAT', 'DE' (for flag icons)
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  isDefault: integer('is_default', { mode: 'boolean' }).notNull().default(false),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

const insertSupportedLanguageSchema = v.omit(
  createInsertSchema(supported_languages, {
    isoCode:     v.pipe(v.string(), v.minLength(2), v.maxLength(5), v.regex(/^[a-z]{2,3}(-[A-Z]{2})?$/)),
    nativeName:  v.pipe(v.string(), v.minLength(1), v.maxLength(50)),
    displayName: v.pipe(v.string(), v.minLength(1), v.maxLength(50)),
    flagCode:    v.pipe(v.string(), v.minLength(2), v.maxLength(5)),
    sortOrder:   v.pipe(v.number(), v.integer(), v.minValue(0), v.maxValue(999)),
    isActive:    sqliteBooleanField(),
    isDefault:   sqliteBooleanField(),
  }),
  ['id', 'createdAt', 'updatedAt'],
);

export const supportedLanguageSchemas = {
  select: createSelectSchema(supported_languages),
  insert: insertSupportedLanguageSchema,
  patch: v.partial(
    v.object({
      ...insertSupportedLanguageSchema.entries,
      isActive:  v.optional(sqliteBooleanField()),
      isDefault: v.optional(sqliteBooleanField()),
    }),
  ),
} as const;

export type SupportedLanguageModel  = v.InferOutput<typeof supportedLanguageSchemas.select>;
export type SupportedLanguageInsert = v.InferOutput<typeof supportedLanguageSchemas.insert>;
export type SupportedLanguagePatch  = v.InferOutput<typeof supportedLanguageSchemas.patch>;
