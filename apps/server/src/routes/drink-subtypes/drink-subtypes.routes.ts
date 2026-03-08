import { describeRoute } from 'hono-openapi';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import * as v from 'valibot';

import { drinkSubtypeSchemas } from 'db/schemas/drink_subtypes.schema';
import { json, jsonRequired } from 'lib/openapi.helpers';
import { notFoundSchema, validationErrorSchema } from 'lib/valibot.errors';

const tags = ['DrinkSubtypes'];

export const list = describeRoute({
  tags,
  description: 'List of drink subtypes for the specified drink type',
  responses: {
    [HttpStatusCodes.OK]: json(
      v.array(drinkSubtypeSchemas.select),
      'List of drink subtypes for the specified drink type',
    ),
    [HttpStatusCodes.NOT_FOUND]: json(notFoundSchema, 'Drink type not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: json(
      validationErrorSchema,
      'Invalid drink type ID or drink type does not support subtypes',
    ),
  },
});

export const getOne = describeRoute({
  tags,
  description: 'Get a drink subtype by ID',
  responses: {
    [HttpStatusCodes.OK]: json(drinkSubtypeSchemas.select, 'The requested drink subtype'),
    [HttpStatusCodes.NOT_FOUND]: json(notFoundSchema, 'Drink subtype not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: json(validationErrorSchema, 'Invalid parameters'),
  },
});

export const create = describeRoute({
  tags,
  description: 'Create a drink subtype',
  responses: {
    [HttpStatusCodes.OK]: json(drinkSubtypeSchemas.select, 'The created drink subtype'),
    [HttpStatusCodes.NOT_FOUND]: json(notFoundSchema, 'Drink type not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: json(validationErrorSchema, 'The validation error(s)'),
  },
});

export const patch = describeRoute({
  tags,
  description: 'Update a drink subtype',
  responses: {
    [HttpStatusCodes.OK]: json(drinkSubtypeSchemas.select, 'The updated drink subtype'),
    [HttpStatusCodes.NOT_FOUND]: json(notFoundSchema, 'Drink subtype not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: json(validationErrorSchema, 'The validation error(s)'),
  },
});

export const remove = describeRoute({
  tags,
  description: 'Delete a drink subtype',
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: 'Drink subtype deleted',
    },
    [HttpStatusCodes.NOT_FOUND]: json(notFoundSchema, 'Drink subtype not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: json(validationErrorSchema, 'Invalid parameters'),
  },
});
