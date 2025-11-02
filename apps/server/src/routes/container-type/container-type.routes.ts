import { createRoute, z } from '@hono/zod-openapi';
import { containerTypeSchemas } from 'db/schemas/container_types.schema';
import { notFoundSchema } from 'lib/zod.errors';
import { IdCuidParamsSchema } from 'schemas/id-cuid-params.schema';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers';
import { createErrorSchema, IdParamsSchema } from 'stoker/openapi/schemas';

const tags = ['ContainerTypes'];

export const list = createRoute({
  path: '/container-types',
  method: 'get',
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(
        containerTypeSchemas.select.pick({
          id: true,
          name: true,
          translations: true,
          thermalConductivity: true,
          isActive: true,
        }),
      ),
      'List of available container types',
    ),
  },
});

export const getOne = createRoute({
  path: '/container-types/{id}',
  method: 'get',
  request: {
    params: IdCuidParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(containerTypeSchemas.select, 'The requested container type'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Container type not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      'Invalid id error',
    ),
  },
});

export const create = createRoute({
  path: '/container-types',
  method: 'post',
  request: {
    body: jsonContentRequired(containerTypeSchemas.insert, 'The container type to create'),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(containerTypeSchemas.select, 'The created container type'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(containerTypeSchemas.insert),
      'The validation error(s)',
    ),
  },
});

export const patch = createRoute({
  path: '/container-types/{id}',
  method: 'patch',
  request: {
    params: IdCuidParamsSchema,
    body: jsonContentRequired(containerTypeSchemas.patch, 'The container type updates'),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(containerTypeSchemas.select, 'The updated container type'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Container type not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(containerTypeSchemas.patch).or(createErrorSchema(IdParamsSchema)),
      'The validation error(s)',
    ),
  },
});

export const remove = createRoute({
  path: '/container-types/{id}',
  method: 'delete',
  request: {
    params: IdCuidParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: 'Container type deleted',
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Container type not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      'Invalid id error',
    ),
  },
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type PatchRoute = typeof patch;
export type RemoveRoute = typeof remove;
