import createCuid from '@bugsnag/cuid';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const elements = sqliteTable('elements', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createCuid()),

  elementNumber: integer('element_number').notNull().unique(), // 1-11
  displayName: text('display_name').notNull(), // Optional custom name for the element
  elementType: integer('element_type').notNull(), // 1 = Single (1,10), 2 = Group (2-9), 3 = Switch (11)
  position: text('position').notNull(), // Grid position 'x,y' format
  voltage: integer('voltage').notNull(), // 12 or 24V

  // Physical properties
  probeId: text('probe_id'), // ID of the temperature probe if attached
  lastProbeReading: integer('last_probe_reading'), // Last temperature reading
  lastProbeReadingAt: integer('last_probe_reading_at', { mode: 'timestamp' }), // When the reading was taken

  // Current state
  isInUse: integer('is_in_use', { mode: 'boolean' }).notNull().default(false),
  currentOrderId: text('current_order_id'), // Reference to running_orders if active
  remainingSeconds: integer('remaining_seconds'), // Countdown for current order

  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

// Zod schema for validation
const insertElementSchema = createInsertSchema(elements, {
  elementNumber: (schema) => schema.elementNumber.min(1).max(11),
  displayName: (schema) => schema.displayName.min(1).max(100),
  elementType: (schema) => schema.elementType.min(1).max(3),
  position: (schema) => schema.position.regex(/^\d+,\d+$/), // Format: "x,y"
  voltage: (schema) =>
    schema.voltage.refine((val) => [12, 24].includes(val), {
      message: 'Voltage must be either 12V or 24V',
    }),
  probeId: (schema) => schema.probeId.min(1).max(50).optional(),
  lastProbeReading: (schema) => schema.lastProbeReading.min(-50).max(100).optional(),
})
  .required({
    elementNumber: true,
    displayName: true,
    elementType: true,
    position: true,
    voltage: true,
  })
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    isInUse: true,
    currentOrderId: true,
    remainingSeconds: true,
    lastProbeReadingAt: true,
  });

export const elementSchemas = {
  select: createSelectSchema(elements),
  insert: insertElementSchema,
  patch: insertElementSchema.partial(),
} as const;
