import createCuid from '@bugsnag/cuid';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { sqliteBooleanField } from '../../lib/zod.utils';

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

// Zod schemas for validation
const insertSupportedLanguageSchema = createInsertSchema(supported_languages, {
  isoCode: (schema) =>
    schema.isoCode
      .min(2)
      .max(5)
      .regex(/^[a-z]{2,3}(-[A-Z]{2})?$/),
  nativeName: (schema) => schema.nativeName.min(1).max(50),
  displayName: (schema) => schema.displayName.min(1).max(50),
  flagCode: (schema) => schema.flagCode.min(2).max(5),
  sortOrder: (schema) => schema.sortOrder.min(0).max(999),
  isActive: () => sqliteBooleanField(), // Handle boolean/integer conversion
  isDefault: () => sqliteBooleanField(), // Handle boolean/integer conversion
})
  .required({
    isoCode: true,
    nativeName: true,
    displayName: true,
  })
  .omit({ id: true, createdAt: true, updatedAt: true });

export const supportedLanguageSchemas = {
  select: createSelectSchema(supported_languages),
  insert: insertSupportedLanguageSchema,
  patch: insertSupportedLanguageSchema.partial().extend({
    isActive: sqliteBooleanField().optional(), // Handle boolean/integer conversion for PATCH
    isDefault: sqliteBooleanField().optional(), // Handle boolean/integer conversion for PATCH
  }),
} as const;
