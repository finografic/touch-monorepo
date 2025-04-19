import { createRoute, z } from '@hono/zod-openapi';
import { postSchemas } from 'db/schemas/posts.schema';
import { notFoundSchema } from 'lib/constants';
import { IdCuidParamsSchema } from 'schemas/id-cuid-params.schema';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers';
import { createErrorSchema, IdParamsSchema } from 'stoker/openapi/schemas';

const tags = ['Posts'];

export const list = createRoute({
  path: '/posts',
  method: 'get',
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(z.array(postSchemas.select), 'The list of posts'),
  },
});

export const create = createRoute({
  path: '/posts',
  method: 'post',
  request: {
    body: jsonContentRequired(postSchemas.insert, 'The post to create'),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(postSchemas.select, 'The created post'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(postSchemas.insert),
      'The validation error(s)',
    ),
  },
});

export const getOne = createRoute({
  path: '/posts/{id}',
  method: 'get',
  request: {
    params: IdCuidParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(postSchemas.select, 'The requested post'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Post not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      'Invalid id error',
    ),
  },
});

export const patch = createRoute({
  path: '/posts/{id}',
  method: 'patch',
  request: {
    params: IdCuidParamsSchema,
    body: jsonContentRequired(postSchemas.patch, 'The post updates'),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(postSchemas.select, 'The updated post'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Post not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(postSchemas.patch).or(createErrorSchema(IdParamsSchema)),
      'The validation error(s)',
    ),
  },
});

export const remove = createRoute({
  path: '/posts/{id}',
  method: 'delete',
  request: {
    params: IdCuidParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: 'Post deleted',
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Post not found'),
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
