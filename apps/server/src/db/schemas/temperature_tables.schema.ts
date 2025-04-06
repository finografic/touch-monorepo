import createCuid from '@bugsnag/cuid';
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

// Main table to store the temperature table metadata
export const temperature_tables = sqliteTable('temperature_tables', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createCuid()),
  tableNumber: text('table_number').notNull().unique(), // e.g., '1001', '2001', '3001'
  description: text('description'), // Optional description of what this table is for
  elementType: integer('element_type').notNull(), // 1 = Element 1, 2 = Elements 2-9, 3 = Element 10

  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

// Table entries storing the actual temperature-time relationships
export const temperature_table_entries = sqliteTable('temperature_table_entries', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createCuid()),

  tableId: text('table_id')
    .notNull()
    .references(() => temperature_tables.id, { onDelete: 'cascade' }),

  temperature: real('temperature').notNull(), // Temperature in Celsius
  timeMinutes: real('time_minutes').notNull(), // Time in minutes (allowing decimals for precision)
  sortOrder: integer('sort_order').notNull(), // For maintaining the correct order of entries

  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

// Zod schemas for validation
const insertTemperatureTableSchema = createInsertSchema(temperature_tables, {
  tableNumber: (schema) => schema.tableNumber.min(4).max(4), // Must be exactly 4 digits
  description: (schema) => schema.description.max(500),
  elementType: (schema) => schema.elementType.min(1).max(3), // Only 1, 2, or 3 are valid
})
  .required({
    tableNumber: true,
    elementType: true,
  })
  .omit({ id: true, createdAt: true, updatedAt: true });

const insertTemperatureTableEntrySchema = createInsertSchema(temperature_table_entries, {
  temperature: (schema) => schema.temperature.min(-20).max(40), // Reasonable temperature range
  timeMinutes: (schema) => schema.timeMinutes.min(0).max(120), // Up to 2 hours
  sortOrder: (schema) => schema.sortOrder.min(0),
})
  .required({
    tableId: true,
    temperature: true,
    timeMinutes: true,
    sortOrder: true,
  })
  .omit({ id: true, createdAt: true, updatedAt: true });

export const temperatureTableSchemas = {
  select: createSelectSchema(temperature_tables),
  insert: insertTemperatureTableSchema,
  patch: insertTemperatureTableSchema.partial(),
} as const;

export const temperatureTableEntrySchemas = {
  select: createSelectSchema(temperature_table_entries),
  insert: insertTemperatureTableEntrySchema,
  patch: insertTemperatureTableEntrySchema.partial(),
} as const;
