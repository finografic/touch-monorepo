import { describeRoute } from 'hono-openapi';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import * as v from 'valibot';

import { containerTypeSchemas } from 'db/schemas/container_types.schema';
import { json, jsonRequired } from 'lib/openapi.helpers';
import { notFoundSchema, validationErrorSchema } from 'lib/valibot.errors';

const tags = ['ContainerTypes'];

export const list = describeRoute({
  tags,
  description: 'List of available container types',
  responses: {
    [HttpStatusCodes.OK]: json(
      v.array(
        v.pick(containerTypeSchemas.select, ['id', 'name', 'translations', 'thermalConductivity', 'isActive']),
      ),
      'List of available container types',
    ),
  },
});

export const getOne = describeRoute({
  tags,
  description: 'Get a container type by ID',
  responses: {
    [HttpStatusCodes.OK]: json(containerTypeSchemas.select, 'The requested container type'),
    [HttpStatusCodes.NOT_FOUND]: json(notFoundSchema, 'Container type not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: json(validationErrorSchema, 'Invalid id error'),
  },
});

export const create = describeRoute({
  tags,
  description: 'Create a container type',
  responses: {
    [HttpStatusCodes.OK]: json(containerTypeSchemas.select, 'The created container type'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: json(validationErrorSchema, 'The validation error(s)'),
  },
});

export const patch = describeRoute({
  tags,
  description: 'Update a container type',
  responses: {
    [HttpStatusCodes.OK]: json(containerTypeSchemas.select, 'The updated container type'),
    [HttpStatusCodes.NOT_FOUND]: json(notFoundSchema, 'Container type not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: json(validationErrorSchema, 'The validation error(s)'),
  },
});

export const remove = describeRoute({
  tags,
  description: 'Delete a container type',
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: 'Container type deleted',
    },
    [HttpStatusCodes.NOT_FOUND]: json(notFoundSchema, 'Container type not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: json(validationErrorSchema, 'Invalid id error'),
  },
});
