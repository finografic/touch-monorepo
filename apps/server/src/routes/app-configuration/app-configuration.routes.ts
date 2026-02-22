import { createRoute, z } from '@hono/zod-openapi';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers';
import { createErrorSchema, IdParamsSchema } from 'stoker/openapi/schemas';

import { notFoundSchema } from 'lib/zod.errors';
import { IdCuidParamsSchema } from 'schemas/id-cuid-params.schema';

const tags = ['AppConfiguration'];

/** Data shape for slot_special_* config entries (slot_number, relay_number). */
export const slotSpecialDataSchema = z.object({
  slot_number: z.number().int().min(1),
  relay_number: z.number().int().min(1),
});
export type SlotSpecialData = z.infer<typeof slotSpecialDataSchema>;

const appConfigSelectSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  isActive: z.boolean(),
  data: z.record(z.unknown()),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const appConfigSchemas = {
  select: appConfigSelectSchema,
  patch: z.object({
    isActive: z.boolean().optional(),
    data: z.record(z.unknown()).optional(),
  }),
};

export const list = createRoute({
  path: '/app-configuration',
  method: 'get',
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(z.array(appConfigSelectSchema), 'List of app configuration entries'),
  },
});

export const getOne = createRoute({
  path: '/app-configuration/{id}',
  method: 'get',
  request: {
    params: IdCuidParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(appConfigSelectSchema, 'The requested app configuration'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'App configuration not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      'Invalid id error',
    ),
  },
});

export const getByKey = createRoute({
  path: '/app-configuration/key/{name}',
  method: 'get',
  request: {
    params: z.object({ name: z.string().min(1) }),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(appConfigSelectSchema, 'The app configuration for the given key'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'App configuration not found'),
  },
});

export const patch = createRoute({
  path: '/app-configuration/{id}',
  method: 'patch',
  request: {
    params: IdCuidParamsSchema,
    body: jsonContentRequired(appConfigSchemas.patch, 'Fields to update'),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(appConfigSelectSchema, 'The updated app configuration'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'App configuration not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(appConfigSchemas.patch).or(createErrorSchema(IdParamsSchema)),
      'The validation error(s)',
    ),
  },
});

export type ListRoute = typeof list;
export type GetOneRoute = typeof getOne;
export type GetByKeyRoute = typeof getByKey;
export type PatchRoute = typeof patch;
