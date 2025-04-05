import { createRoute, z } from '@hono/zod-openapi';
import { projectSchemas } from 'db/schemas/projects.schema';
import { notFoundSchema } from 'lib/constants';
import { IdCuidParamsSchema } from 'schemas/id-cuid-params.schema';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers';
import { createErrorSchema, IdParamsSchema } from 'stoker/openapi/schemas';

const tags = ['Projects'];

export const list = createRoute({
  path: '/projects',
  method: 'get',
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(z.array(projectSchemas.select), 'The list of projects'),
  },
});

export const create = createRoute({
  path: '/projects',
  method: 'post',
  request: {
    body: jsonContentRequired(projectSchemas.insert, 'The project to create'),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(projectSchemas.select, 'The created project'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(projectSchemas.insert),
      'The validation error(s)',
    ),
  },
});

export const getOne = createRoute({
  path: '/projects/{id}',
  method: 'get',
  request: {
    params: IdCuidParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(projectSchemas.select, 'The requested project'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Project not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      'Invalid id error',
    ),
  },
});

export const patch = createRoute({
  path: '/projects/{id}',
  method: 'patch',
  request: {
    params: IdCuidParamsSchema,
    body: jsonContentRequired(projectSchemas.patch, 'The project updates'),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(projectSchemas.select, 'The updated project'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Project not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(projectSchemas.patch).or(createErrorSchema(IdParamsSchema)),
      'The validation error(s)',
    ),
  },
});

export const remove = createRoute({
  path: '/projects/{id}',
  method: 'delete',
  request: {
    params: IdCuidParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: 'Project deleted',
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Project not found'),
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
