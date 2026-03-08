import * as HttpStatusCodes from 'stoker/http-status-codes';
import * as v from 'valibot';

import { json, route } from 'lib/openapi.helpers';
import { notFoundSchema, validationErrorSchema } from 'lib/valibot.errors';

const tags = ['AppConfiguration'];

/** Data shape for slot_special_* config entries (is_visible, slot_number, relay_number). */
export const slotSpecialDataSchema = v.object({
  is_visible:   v.boolean(),
  slot_number:  v.pipe(v.number(), v.integer(), v.minValue(1)),
  relay_number: v.pipe(v.number(), v.integer(), v.minValue(1)),
});
export type SlotSpecialData = v.InferOutput<typeof slotSpecialDataSchema>;

const appConfigSelectSchema = v.object({
  id:        v.string(),
  name:      v.string(),
  isActive:  v.boolean(),
  data:      v.record(v.string(), v.unknown()),
  createdAt: v.optional(v.string()),
  updatedAt: v.optional(v.string()),
});

export const appConfigSchemas = {
  select: appConfigSelectSchema,
  patch: v.object({
    isActive: v.optional(v.boolean()),
    data:     v.optional(v.record(v.string(), v.unknown())),
  }),
};

// Param schema for key lookup
export const nameParamSchema = v.object({
  name: v.pipe(v.string(), v.minLength(1)),
});

export const list = route('/app-configuration', {
  tags,
  description: 'List all app configuration entries',
  responses: {
    [HttpStatusCodes.OK]: json(v.array(appConfigSelectSchema), 'List of app configuration entries'),
  },
});

export const getOne = route('/app-configuration/:id', {
  tags,
  description: 'Get a single app configuration by ID',
  responses: {
    [HttpStatusCodes.OK]:                   json(appConfigSelectSchema, 'The requested app configuration'),
    [HttpStatusCodes.NOT_FOUND]:            json(notFoundSchema, 'App configuration not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: json(validationErrorSchema, 'Invalid id error'),
  },
});

export const getByKey = route('/app-configuration/key/:name', {
  tags,
  description: 'Get an app configuration by key name',
  responses: {
    [HttpStatusCodes.OK]:        json(appConfigSelectSchema, 'The app configuration for the given key'),
    [HttpStatusCodes.NOT_FOUND]: json(notFoundSchema, 'App configuration not found'),
  },
});

export const patch = route('/app-configuration/:id', {
  tags,
  description: 'Update an app configuration',
  responses: {
    [HttpStatusCodes.OK]:                   json(appConfigSelectSchema, 'The updated app configuration'),
    [HttpStatusCodes.NOT_FOUND]:            json(notFoundSchema, 'App configuration not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: json(validationErrorSchema, 'The validation error(s)'),
  },
});
