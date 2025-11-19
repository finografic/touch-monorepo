import { createRoute, z } from '@hono/zod-openapi';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers';
import { createErrorSchema } from 'stoker/openapi/schemas';

import { modeSchemas } from 'db/schemas/modes.schema';
import { notFoundSchema } from 'lib/zod.errors';
import { IdCuidParamsSchema } from 'schemas/id-cuid-params.schema';
import { IdParamsSchema } from 'schemas/params.schema';

const tags = ['CoolingProfiles'];

export const list = createRoute({
  path: '/modes',
  method: 'get',
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(z.array(modeSchemas.select), 'The list of cooling profiles'),
  },
});

export const getOne = createRoute({
  path: '/modes/{id}',
  method: 'get',
  request: {
    params: IdCuidParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(modeSchemas.select, 'The requested cooling profile'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Cooling profile not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(IdParamsSchema), 'Invalid id'),
  },
});

export const create = createRoute({
  path: '/modes',
  method: 'post',
  request: {
    body: jsonContentRequired(modeSchemas.insert, 'The cooling profile to create'),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(modeSchemas.select, 'The created cooling profile'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(modeSchemas.insert),
      'The validation error(s)',
    ),
  },
});

export const patch = createRoute({
  path: '/modes/{id}',
  method: 'patch',
  request: {
    params: IdCuidParamsSchema,
    body: jsonContentRequired(modeSchemas.patch, 'The cooling profile updates'),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(modeSchemas.select, 'The updated cooling profile'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Cooling profile not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(modeSchemas.patch).or(createErrorSchema(IdParamsSchema)),
      'The validation error(s)',
    ),
  },
});

export const remove = createRoute({
  path: '/modes/{id}',
  method: 'delete',
  request: {
    params: IdCuidParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: 'Cooling profile deleted',
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Cooling profile not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(IdParamsSchema), 'Invalid id'),
  },
});

export const updateActiveStates = createRoute({
  path: '/modes/active-states',
  method: 'patch',
  request: {
    body: jsonContentRequired(
      z.object({
        activeModeIds: z.array(z.string()),
      }),
      'The active mode IDs to update',
    ),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          isDefault: z.boolean(),
          isActive: z.boolean(),
        }),
      ),
      'The updated modes',
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(z.object({ activeModeIds: z.array(z.string()) })),
      'The validation error(s)',
    ),
  },
});

export const updateDefaultMode = createRoute({
  path: '/modes/default-mode',
  method: 'patch',
  request: {
    body: jsonContentRequired(
      z.object({
        defaultModeId: z.string().nullable(),
      }),
      'The default mode ID to set',
    ),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          isDefault: z.boolean(),
          isActive: z.boolean(),
        }),
      ),
      'The updated modes',
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(z.object({ defaultModeId: z.string().nullable() })),
      'The validation error(s)',
    ),
  },
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type PatchRoute = typeof patch;
export type RemoveRoute = typeof remove;
export type UpdateActiveStatesRoute = typeof updateActiveStates;
export type UpdateDefaultModeRoute = typeof updateDefaultMode;
