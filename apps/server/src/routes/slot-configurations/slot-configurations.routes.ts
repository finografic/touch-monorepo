import * as HttpStatusCodes from 'stoker/http-status-codes';
import * as v from 'valibot';

import { json, route } from 'lib/openapi.helpers';
import { notFoundSchema, validationErrorSchema } from 'lib/valibot.errors';

const tags = ['SlotConfigurations'];

export const slotConfigSchemas = {
  select: v.object({
    id:          v.string(),
    slotNumber:  v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(16)),
    slotType:    v.picklist(['A', 'B', 'C']),
    isActive:    v.boolean(),
    relayNumber: v.nullable(v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(16))),
    createdAt:   v.optional(v.string()),
    updatedAt:   v.optional(v.string()),
  }),
  insert: v.object({
    slotNumber:  v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(16)),
    slotType:    v.picklist(['A', 'B', 'C']),
    isActive:    v.boolean(),
    relayNumber: v.optional(v.nullable(v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(16)))),
  }),
  patch: v.object({
    slotType:    v.optional(v.picklist(['A', 'B', 'C'])),
    isActive:    v.optional(v.boolean()),
    relayNumber: v.optional(v.nullable(v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(16)))),
  }),
};

export const list = route('/slot-configurations', {
  tags,
  description: 'List all slot configurations',
  responses: {
    [HttpStatusCodes.OK]: json(v.array(slotConfigSchemas.select), 'List of slot configurations'),
  },
});

export const getOne = route('/slot-configurations/:id', {
  tags,
  description: 'Get a single slot configuration by ID',
  responses: {
    [HttpStatusCodes.OK]:                   json(slotConfigSchemas.select, 'The requested slot configuration'),
    [HttpStatusCodes.NOT_FOUND]:            json(notFoundSchema, 'Slot configuration not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: json(validationErrorSchema, 'Invalid id error'),
  },
});

export const create = route('/slot-configurations', {
  tags,
  description: 'Create a new slot configuration',
  responses: {
    [HttpStatusCodes.OK]:                   json(slotConfigSchemas.select, 'The created slot configuration'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: json(validationErrorSchema, 'The validation error(s)'),
  },
});

export const patch = route('/slot-configurations/:id', {
  tags,
  description: 'Update a slot configuration',
  responses: {
    [HttpStatusCodes.OK]:                   json(slotConfigSchemas.select, 'The updated slot configuration'),
    [HttpStatusCodes.NOT_FOUND]:            json(notFoundSchema, 'Slot configuration not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: json(validationErrorSchema, 'The validation error(s)'),
  },
});

export const remove = route('/slot-configurations/:id', {
  tags,
  description: 'Delete a slot configuration',
  responses: {
    [HttpStatusCodes.NO_CONTENT]:           { description: 'Slot configuration deleted' },
    [HttpStatusCodes.NOT_FOUND]:            json(notFoundSchema, 'Slot configuration not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: json(validationErrorSchema, 'Invalid id error'),
  },
});

export const bulkUpdate = route('/slot-configurations/bulk-update', {
  tags,
  description: 'Bulk update slot configurations',
  responses: {
    [HttpStatusCodes.OK]: json(v.array(slotConfigSchemas.select), 'Bulk updated slot configurations'),
  },
});

export const reset = route('/slot-configurations/reset', {
  tags,
  description: 'Reset slot configurations to default',
  responses: {
    [HttpStatusCodes.OK]: json(
      v.object({ success: v.boolean(), message: v.string() }),
      'Reset slot configurations to default',
    ),
  },
});

// Body schemas for validators
export const bulkUpdateBodySchema = v.object({
  configurations: v.array(slotConfigSchemas.insert),
});
