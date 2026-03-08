import { StatusCodes as HttpStatusCodes } from 'http-status-codes';
import * as v from 'valibot';

import { translationUiSchemas } from 'db/schemas/translations_ui.schema';
import { json, route } from 'lib/openapi.helpers';
import { notFoundSchema, validationErrorSchema } from 'lib/valibot.errors';

const tags = ['Translations'];

// Shared schema - all translation tables have the same structure
const translationSchema = translationUiSchemas;

// Param schemas for validators
export const namespaceParamSchema = v.object({
  namespace: v.picklist(['ui', 'app', 'admin']),
});

export const namespaceAndIdParamSchema = v.object({
  namespace: v.picklist(['ui', 'app', 'admin']),
  id:        v.string(),
});

export const list = route('/translations/:namespace', {
  tags,
  description: 'List all translations for a namespace',
  responses: {
    [HttpStatusCodes.OK]: json(
      v.array(
        v.pick(translationSchema.select, ['id', 'key', 'translations', 'isActive']),
      ),
      'List of available translations for the namespace',
    ),
  },
});

export const getOne = route('/translations/:namespace/:id', {
  tags,
  description: 'Get a single translation by namespace and ID',
  responses: {
    [HttpStatusCodes.OK]:                   json(translationSchema.select, 'The requested translation'),
    [HttpStatusCodes.NOT_FOUND]:            json(notFoundSchema, 'Translation not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: json(validationErrorSchema, 'Invalid id error'),
  },
});

export const create = route('/translations/:namespace', {
  tags,
  description: 'Create a new translation',
  responses: {
    [HttpStatusCodes.OK]:                   json(translationSchema.select, 'The created translation'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: json(validationErrorSchema, 'The validation error(s)'),
  },
});

export const patch = route('/translations/:namespace/:id', {
  tags,
  description: 'Update a translation',
  responses: {
    [HttpStatusCodes.OK]:                   json(translationSchema.select, 'The updated translation'),
    [HttpStatusCodes.NOT_FOUND]:            json(notFoundSchema, 'Translation not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: json(validationErrorSchema, 'The validation error(s)'),
  },
});

export const remove = route('/translations/:namespace/:id', {
  tags,
  description: 'Delete a translation',
  responses: {
    [HttpStatusCodes.NO_CONTENT]:           { description: 'Translation deleted' },
    [HttpStatusCodes.NOT_FOUND]:            json(notFoundSchema, 'Translation not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: json(validationErrorSchema, 'Invalid id error'),
  },
});
