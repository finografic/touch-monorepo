import * as v from 'valibot';
import * as HttpStatusCodes from 'stoker/http-status-codes';

import { temperatureProfileSchemas } from 'db/schemas/temperature_profiles.schema';
import { json, jsonRequired, route } from 'lib/openapi.helpers';
import { notFoundSchema, validationErrorSchema } from 'lib/valibot.errors';

const tags = ['TemperatureProfile'];

export const list = route('/temperature-profiles', {
  tags,
  description: 'List of available temperature profiles',
  responses: {
    [HttpStatusCodes.OK]: json(
      v.array(temperatureProfileSchemas.select),
      'List of available temperature profiles',
    ),
  },
});

export const getOne = route('/temperature-profiles/:id', {
  tags,
  description: 'Get a single temperature profile by id',
  responses: {
    [HttpStatusCodes.OK]:                   json(temperatureProfileSchemas.select, 'The requested temperature profile'),
    [HttpStatusCodes.NOT_FOUND]:            json(notFoundSchema, 'Temperature profile not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: json(validationErrorSchema, 'Invalid id error'),
  },
});

export const create = route('/temperature-profiles', {
  tags,
  description: 'Create a new temperature profile',
  responses: {
    [HttpStatusCodes.OK]:                   json(temperatureProfileSchemas.select, 'The created temperature profile'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: json(validationErrorSchema, 'The validation error(s)'),
  },
});

export const patch = route('/temperature-profiles/:id', {
  tags,
  description: 'Update a temperature profile',
  responses: {
    [HttpStatusCodes.OK]:                   json(temperatureProfileSchemas.select, 'The updated temperature profile'),
    [HttpStatusCodes.NOT_FOUND]:            json(notFoundSchema, 'Temperature profile not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: json(validationErrorSchema, 'The validation error(s)'),
  },
});

export const remove = route('/temperature-profiles/:id', {
  tags,
  description: 'Delete a temperature profile',
  responses: {
    [HttpStatusCodes.NO_CONTENT]: { description: 'Temperature profile deleted' },
    [HttpStatusCodes.NOT_FOUND]:  json(notFoundSchema, 'Temperature profile not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: json(validationErrorSchema, 'Invalid id error'),
  },
});
