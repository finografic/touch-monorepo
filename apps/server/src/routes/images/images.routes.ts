import * as v from 'valibot';
import { StatusCodes as HttpStatusCodes } from 'http-status-codes';

import { json, route } from 'lib/openapi.helpers';
import { notFoundSchema, validationErrorSchema } from 'lib/valibot.errors';

const tags = ['Images'];

const imageFileSchema = v.object({
  id: v.string(),
  name: v.string(),
  originalName: v.optional(v.string()),
  url: v.string(),
  type: v.string(),
  size: v.number(),
  uploadedAt: v.string(),
});

const imageSettingsSchema = v.object({
  product: v.nullable(v.string()),
  label: v.nullable(v.string()),
});

export const list = route('/images', {
  tags,
  description: 'List uploaded image files',
  responses: {
    [HttpStatusCodes.OK]: json(v.array(imageFileSchema), 'List of image files'),
  },
});

export const listByType = route('/images/:type', {
  tags,
  description: 'List image files for a category',
  responses: {
    [HttpStatusCodes.OK]: json(v.array(imageFileSchema), 'List of image files for the category'),
  },
});

export const uploadByType = route('/images/:type/upload', {
  tags,
  description: 'Upload image files for a category',
  responses: {
    [HttpStatusCodes.OK]: json(v.array(imageFileSchema), 'Uploaded image files'),
    [HttpStatusCodes.BAD_REQUEST]: json(validationErrorSchema, 'Upload failed'),
  },
});

export const remove = route('/images/:id', {
  tags,
  description: 'Remove an image file',
  responses: {
    [HttpStatusCodes.OK]: json(v.object({ message: v.string() }), 'Image removed'),
    [HttpStatusCodes.NOT_FOUND]: json(notFoundSchema, 'Image not found'),
  },
});

export const removeByType = route('/images/:type/:id', {
  tags,
  description: 'Remove an image file in a category',
  responses: {
    [HttpStatusCodes.OK]: json(v.object({ message: v.string() }), 'Image removed'),
    [HttpStatusCodes.NOT_FOUND]: json(notFoundSchema, 'Image not found'),
  },
});

export const getSettings = route('/images/settings', {
  tags,
  description: 'Get default image selections per category',
  responses: {
    [HttpStatusCodes.OK]: json(imageSettingsSchema, 'Image settings'),
  },
});

export const updateSettings = route('/images/settings', {
  tags,
  description: 'Update default image selections',
  responses: {
    [HttpStatusCodes.OK]: json(imageSettingsSchema, 'Updated image settings'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: json(validationErrorSchema, 'Validation error'),
  },
});

export const serveFile = route('/images/files/:filename', {
  tags,
  description: 'Serve a stored image file',
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        'image/*': { schema: {} },
      },
      description: 'Image bytes',
    },
    [HttpStatusCodes.NOT_FOUND]: json(notFoundSchema, 'File not found'),
  },
});
