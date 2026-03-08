import * as v from 'valibot';
import { StatusCodes as HttpStatusCodes } from 'http-status-codes';

import { modeSchemas } from 'db/schemas/modes.schema';
import { json, jsonRequired, route } from 'lib/openapi.helpers';
import { notFoundSchema, validationErrorSchema } from 'lib/valibot.errors';

const tags = ['CoolingProfiles'];

const modeStateSchema = v.object({
  id: v.string(),
  name: v.string(),
  isDefault: v.boolean(),
  isActive: v.boolean(),
});

export const list = route('/modes', {
  tags,
  description: 'The list of cooling profiles',
  responses: {
    [HttpStatusCodes.OK]: json(v.array(modeSchemas.select), 'The list of cooling profiles'),
  },
});

export const getOne = route('/modes/:id', {
  tags,
  description: 'Get a cooling profile by ID',
  responses: {
    [HttpStatusCodes.OK]: json(modeSchemas.select, 'The requested cooling profile'),
    [HttpStatusCodes.NOT_FOUND]: json(notFoundSchema, 'Cooling profile not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: json(validationErrorSchema, 'Invalid id'),
  },
});

export const create = route('/modes', {
  tags,
  description: 'Create a cooling profile',
  responses: {
    [HttpStatusCodes.OK]: json(modeSchemas.select, 'The created cooling profile'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: json(validationErrorSchema, 'The validation error(s)'),
  },
});

export const patch = route('/modes/:id', {
  tags,
  description: 'Update a cooling profile',
  responses: {
    [HttpStatusCodes.OK]: json(modeSchemas.select, 'The updated cooling profile'),
    [HttpStatusCodes.NOT_FOUND]: json(notFoundSchema, 'Cooling profile not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: json(validationErrorSchema, 'The validation error(s)'),
  },
});

export const remove = route('/modes/:id', {
  tags,
  description: 'Delete a cooling profile',
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: 'Cooling profile deleted',
    },
    [HttpStatusCodes.NOT_FOUND]: json(notFoundSchema, 'Cooling profile not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: json(validationErrorSchema, 'Invalid id'),
  },
});

export const updateActiveStates = route('/modes/active-states', {
  tags,
  description: 'Update active states for cooling profiles',
  responses: {
    [HttpStatusCodes.OK]: json(v.array(modeStateSchema), 'The updated modes'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: json(validationErrorSchema, 'The validation error(s)'),
  },
});

export const updateDefaultMode = route('/modes/default-mode', {
  tags,
  description: 'Set the default cooling profile',
  responses: {
    [HttpStatusCodes.OK]: json(v.array(modeStateSchema), 'The updated modes'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: json(validationErrorSchema, 'The validation error(s)'),
  },
});

export const activeStatesBodySchema = v.object({
  modes: v.array(v.object({
    id: v.string(),
    isActive: v.boolean(),
  })),
});

export const defaultModeBodySchema = v.object({
  modeId: v.nullable(v.string()),
});
