import { StatusCodes as HttpStatusCodes } from 'http-status-codes';
import * as v from 'valibot';

import { drinkTypeSchemas } from 'db/schemas/drink_types.schema';
import { json, jsonRequired, route } from 'lib/openapi.helpers';
import { notFoundSchema, validationErrorSchema } from 'lib/valibot.errors';

const tags = ['DrinkTypes'];

export const list = route('/drink-types', {
  tags,
  description: 'The list of drink types',
  responses: {
    [HttpStatusCodes.OK]: json(v.array(drinkTypeSchemas.select), 'The list of drink types'),
  },
});

export const getOne = route('/drink-types/:id', {
  tags,
  description: 'Get a drink type by ID',
  responses: {
    [HttpStatusCodes.OK]: json(drinkTypeSchemas.select, 'The requested drink type'),
    [HttpStatusCodes.NOT_FOUND]: json(notFoundSchema, 'Drink type not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: json(validationErrorSchema, 'Invalid id'),
  },
});

export const create = route('/drink-types', {
  tags,
  description: 'Create a drink type',
  responses: {
    [HttpStatusCodes.OK]: json(drinkTypeSchemas.select, 'The created drink type'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: json(validationErrorSchema, 'The validation error(s)'),
  },
});

export const patch = route('/drink-types/:id', {
  tags,
  description: 'Update a drink type',
  responses: {
    [HttpStatusCodes.OK]: json(drinkTypeSchemas.select, 'The updated drink type'),
    [HttpStatusCodes.NOT_FOUND]: json(notFoundSchema, 'Drink type not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: json(validationErrorSchema, 'The validation error(s)'),
  },
});

export const remove = route('/drink-types/:id', {
  tags,
  description: 'Delete a drink type',
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: 'Drink type deleted',
    },
    [HttpStatusCodes.NOT_FOUND]: json(notFoundSchema, 'Drink type not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: json(validationErrorSchema, 'Invalid id'),
  },
});
