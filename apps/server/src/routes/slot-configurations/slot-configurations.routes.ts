import { createRoute, z } from '@hono/zod-openapi';
import { IdCuidParamsSchema } from 'schemas/id-cuid-params.schema';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers';
import { createErrorSchema, IdParamsSchema } from 'stoker/openapi/schemas';
import { notFoundSchema } from 'lib/constants';

const tags = ['SlotConfigurations'];

export const slotConfigSchemas = {
  select: z.object({
    id: z.string().cuid(),
    slotNumber: z.number().int().min(0).max(16),
    slotType: z.enum(['A', 'B', 'C']),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
  }),
  insert: z.object({
    slotNumber: z.number().int().min(0).max(16),
    slotType: z.enum(['A', 'B', 'C']),
  }),
  patch: z.object({
    slotType: z.enum(['A', 'B', 'C']).optional(),
  }),
};

export const list = createRoute({
  path: '/slot-configurations',
  method: 'get',
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(z.array(slotConfigSchemas.select), 'List of slot configurations'),
  },
});

export const getOne = createRoute({
  path: '/slot-configurations/{id}',
  method: 'get',
  request: {
    params: IdCuidParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(slotConfigSchemas.select, 'The requested slot configuration'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Slot configuration not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      'Invalid id error',
    ),
  },
});

export const create = createRoute({
  path: '/slot-configurations',
  method: 'post',
  request: {
    body: jsonContentRequired(slotConfigSchemas.insert, 'The slot configuration to create'),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(slotConfigSchemas.select, 'The created slot configuration'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(slotConfigSchemas.insert),
      'The validation error(s)',
    ),
  },
});

export const patch = createRoute({
  path: '/slot-configurations/{id}',
  method: 'patch',
  request: {
    params: IdCuidParamsSchema,
    body: jsonContentRequired(slotConfigSchemas.patch, 'The slot configuration updates'),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(slotConfigSchemas.select, 'The updated slot configuration'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Slot configuration not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(slotConfigSchemas.patch).or(createErrorSchema(IdParamsSchema)),
      'The validation error(s)',
    ),
  },
});

export const remove = createRoute({
  path: '/slot-configurations/{id}',
  method: 'delete',
  request: {
    params: IdCuidParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: 'Slot configuration deleted',
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Slot configuration not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      'Invalid id error',
    ),
  },
});

// Bulk update and reset (not standard REST, but admin tools)
export const bulkUpdate = createRoute({
  path: '/slot-configurations/bulk-update',
  method: 'post',
  request: {
    body: jsonContentRequired(
      z.object({ configurations: z.array(slotConfigSchemas.insert) }),
      'Bulk slot configuration update',
    ),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(z.array(slotConfigSchemas.select), 'Bulk updated slot configurations'),
  },
});

export const reset = createRoute({
  path: '/slot-configurations/reset',
  method: 'post',
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ success: z.boolean(), message: z.string() }),
      'Reset slot configurations to default',
    ),
  },
});

export type ListRoute = typeof list;
export type GetOneRoute = typeof getOne;
export type CreateRoute = typeof create;
export type PatchRoute = typeof patch;
export type RemoveRoute = typeof remove;
export type BulkUpdateRoute = typeof bulkUpdate;
export type ResetRoute = typeof reset;
