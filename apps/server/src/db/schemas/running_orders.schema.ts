import createCuid from '@bugsnag/cuid';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { beverage_configs } from './beverage_configs.schema';
import { elements } from './elements.schema';

export const running_orders = sqliteTable('running_orders', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createCuid()),

  // Core relationships
  elementId: text('element_id')
    .notNull()
    .references(() => elements.id),
  beverageConfigId: text('beverage_config_id')
    .notNull()
    .references(() => beverage_configs.id),

  // Temperature settings for this run
  startTemp: integer('start_temp').notNull(), // Initial temperature
  targetTemp: integer('target_temp').notNull(), // Target temperature
  lastTemp: integer('last_temp'), // Last recorded temperature

  // Timing
  startedAt: integer('started_at', { mode: 'timestamp' }).notNull(),
  estimatedMinutes: integer('estimated_minutes').notNull(),
  actualMinutes: integer('actual_minutes'), // Filled when complete
  completedAt: integer('completed_at', { mode: 'timestamp' }),

  // Status
  status: text('status').notNull().default('pending'), // pending, running, completed, failed
  errorMessage: text('error_message'), // If status is 'failed'

  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

// Zod schema for validation
const insertRunningOrderSchema = createInsertSchema(running_orders, {
  startTemp: (schema) => schema.startTemp.min(-10).max(40),
  targetTemp: (schema) => schema.targetTemp.min(-10).max(40),
  lastTemp: (schema) => schema.lastTemp.min(-10).max(40).optional(),
  estimatedMinutes: (schema) => schema.estimatedMinutes.min(1).max(120),
  actualMinutes: (schema) => schema.actualMinutes.min(0).max(240).optional(),
  status: (schema) =>
    schema.status.refine((val) => ['pending', 'running', 'completed', 'failed'].includes(val), {
      message: 'Invalid status',
    }),
})
  .required({
    elementId: true,
    beverageConfigId: true,
    startTemp: true,
    targetTemp: true,
    estimatedMinutes: true,
    startedAt: true,
  })
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    completedAt: true,
    errorMessage: true,
  });

export const runningOrderSchemas = {
  select: createSelectSchema(running_orders),
  insert: insertRunningOrderSchema,
  patch: insertRunningOrderSchema.partial(),
} as const;
