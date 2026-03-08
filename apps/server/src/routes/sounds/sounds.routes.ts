import * as v from 'valibot';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { describeRoute } from 'hono-openapi';

import { json, jsonRequired } from 'lib/openapi.helpers';
import { notFoundSchema, validationErrorSchema } from 'lib/valibot.errors';

const tags = ['Sounds'];

// Sound file schema
const soundFileSchema = v.object({
  id:           v.string(),
  name:         v.string(),
  originalName: v.optional(v.string()), // Optional: original filename for new uploads
  url:          v.string(),
  type:         v.string(),
  size:         v.number(),
  uploadedAt:   v.string(),
});

// Sound settings schema
const soundSettingsSchema = v.object({
  alarm:  v.nullable(v.string()),
  finish: v.nullable(v.string()),
});

// List sound files
export const list = describeRoute({
  tags,
  description: 'List of available sound files',
  responses: {
    [HttpStatusCodes.OK]: json(v.array(soundFileSchema), 'List of available sound files'),
  },
});

// List sound files by type
export const listByType = describeRoute({
  tags,
  description: 'List sound files by type',
  responses: {
    [HttpStatusCodes.OK]: json(v.array(soundFileSchema), 'List of sound files for the specified type'),
  },
});

// Upload sound file
export const upload = describeRoute({
  tags,
  description: 'Upload sound files',
  responses: {
    [HttpStatusCodes.OK]:          json(v.array(soundFileSchema), 'Uploaded sound files'),
    [HttpStatusCodes.BAD_REQUEST]: json(validationErrorSchema, 'Upload failed'),
  },
});

// Upload sound file by type
export const uploadByType = describeRoute({
  tags,
  description: 'Upload sound files for a specific type',
  responses: {
    [HttpStatusCodes.OK]:          json(v.array(soundFileSchema), 'Uploaded sound files for the specified type'),
    [HttpStatusCodes.BAD_REQUEST]: json(validationErrorSchema, 'Upload failed'),
  },
});

// Remove sound file
export const remove = describeRoute({
  tags,
  description: 'Remove a sound file',
  responses: {
    [HttpStatusCodes.OK]:        json(v.object({ message: v.string() }), 'Sound file removed'),
    [HttpStatusCodes.NOT_FOUND]: json(notFoundSchema, 'Sound file not found'),
  },
});

// Remove sound file by type
export const removeByType = describeRoute({
  tags,
  description: 'Remove a sound file by type',
  responses: {
    [HttpStatusCodes.OK]:        json(v.object({ message: v.string() }), 'Sound file removed'),
    [HttpStatusCodes.NOT_FOUND]: json(notFoundSchema, 'Sound file not found'),
  },
});

// Get sound settings
export const getSettings = describeRoute({
  tags,
  description: 'Get current sound settings',
  responses: {
    [HttpStatusCodes.OK]: json(soundSettingsSchema, 'Current sound settings'),
  },
});

// Update sound settings
export const updateSettings = describeRoute({
  tags,
  description: 'Update sound settings',
  responses: {
    [HttpStatusCodes.OK]:                   json(soundSettingsSchema, 'Updated sound settings'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: json(validationErrorSchema, 'Validation error'),
  },
});

// Serve sound file
export const serveFile = describeRoute({
  tags,
  description: 'Serve a sound file',
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        'audio/*': {
          schema: {},
        },
      },
      description: 'Sound file content',
    },
    [HttpStatusCodes.NOT_FOUND]: json(notFoundSchema, 'File not found'),
  },
});
