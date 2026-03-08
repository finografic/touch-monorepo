import * as v from 'valibot';
import * as HttpStatusCodes from 'stoker/http-status-codes';

import { volumeSchemas } from 'db/schemas/volumes.schema';
import { json, route } from 'lib/openapi.helpers';
import { notFoundSchema, validationErrorSchema } from 'lib/valibot.errors';

const tags = ['DrinkVolumes'];

export const list = route('/drink-volumes', {
  tags,
  description: 'List of available drink volumes',
  responses: {
    [HttpStatusCodes.OK]: json(
      v.array(v.pick(volumeSchemas.select, ['id', 'name', 'translations', 'valueInMl', 'sortOrder', 'coolingFactor', 'isActive'])),
      'List of available drink volumes',
    ),
  },
});

export const getOne = route('/drink-volumes/:id', {
  tags,
  description: 'Get a single drink volume by id',
  responses: {
    [HttpStatusCodes.OK]:                   json(volumeSchemas.select, 'The requested drink volume'),
    [HttpStatusCodes.NOT_FOUND]:            json(notFoundSchema, 'Drink volume not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: json(validationErrorSchema, 'Invalid id error'),
  },
});

export const create = route('/drink-volumes', {
  tags,
  description: 'Create a new drink volume',
  responses: {
    [HttpStatusCodes.OK]:                   json(volumeSchemas.select, 'The created drink volume'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: json(validationErrorSchema, 'The validation error(s)'),
  },
});

export const patch = route('/drink-volumes/:id', {
  tags,
  description: 'Update a drink volume',
  responses: {
    [HttpStatusCodes.OK]:                   json(volumeSchemas.select, 'The updated drink volume'),
    [HttpStatusCodes.NOT_FOUND]:            json(notFoundSchema, 'Drink volume not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: json(validationErrorSchema, 'The validation error(s)'),
  },
});

export const remove = route('/drink-volumes/:id', {
  tags,
  description: 'Delete a drink volume',
  responses: {
    [HttpStatusCodes.NO_CONTENT]: { description: 'Drink volume deleted' },
    [HttpStatusCodes.NOT_FOUND]:  json(notFoundSchema, 'Drink volume not found'),
  },
});
