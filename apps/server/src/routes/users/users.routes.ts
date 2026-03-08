import * as HttpStatusCodes from 'stoker/http-status-codes';
import * as v from 'valibot';

import { userSchemas } from 'db/schemas/auth_user.schema';
import { json, route } from 'lib/openapi.helpers';
import { notFoundSchema, validationErrorSchema } from 'lib/valibot.errors';

const tags = ['Users'];

export const list = route('/users', {
  tags,
  description: 'List all users',
  responses: {
    [HttpStatusCodes.OK]: json(v.array(userSchemas.select), 'The list of users'),
  },
});

export const getOne = route('/users/:id', {
  tags,
  description: 'Get a single user by ID',
  responses: {
    [HttpStatusCodes.OK]:                   json(userSchemas.select, 'The requested user'),
    [HttpStatusCodes.NOT_FOUND]:            json(notFoundSchema, 'User not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: json(validationErrorSchema, 'Invalid id error'),
  },
});

export const patch = route('/users/:id', {
  tags,
  description: 'Update a user',
  responses: {
    [HttpStatusCodes.OK]:                   json(userSchemas.select, 'The updated user'),
    [HttpStatusCodes.NOT_FOUND]:            json(notFoundSchema, 'User not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: json(validationErrorSchema, 'The validation error(s)'),
  },
});

export const remove = route('/users/:id', {
  tags,
  description: 'Delete a user',
  responses: {
    [HttpStatusCodes.NO_CONTENT]:           { description: 'User deleted' },
    [HttpStatusCodes.NOT_FOUND]:            json(notFoundSchema, 'User not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: json(validationErrorSchema, 'Invalid id error'),
  },
});
