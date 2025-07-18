import { createRoute, z } from '@hono/zod-openapi';
import { notFoundSchema } from 'lib/constants';
import { IdCuidParamsSchema } from 'schemas/id-cuid-params.schema';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers';
import { createErrorSchema } from 'stoker/openapi/schemas';

const tags = ['Sounds'];

// Sound file schema
const soundFileSchema = z.object({
  id: z.string(),
  name: z.string(),
  originalName: z.string().optional(), // Optional: original filename for new uploads
  url: z.string(),
  type: z.string(),
  size: z.number(),
  uploadedAt: z.string(),
});

// Sound settings schema
const soundSettingsSchema = z.object({
  tick: z.string().nullable(),
  finish: z.string().nullable(),
});

// List sound files
export const list = createRoute({
  path: '/sounds',
  method: 'get',
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(z.array(soundFileSchema), 'List of available sound files'),
  },
});

// Upload sound file
export const upload = createRoute({
  path: '/sounds/upload',
  method: 'post',
  request: {
    body: {
      content: {
        'multipart/form-data': {
          schema: z.any(), // Allow any multipart form data
        },
      },
    },
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(z.array(soundFileSchema), 'Uploaded sound files'),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      createErrorSchema(z.object({ message: z.string() })),
      'Upload failed',
    ),
  },
});

// Remove sound file
export const remove = createRoute({
  path: '/sounds/{id}',
  method: 'delete',
  request: {
    params: z.object({
      id: z.string().openapi({
        description: 'Sound file identifier (filename without extension)',
        example: 'sound-fx-ring-1752861588617-omee',
      }),
    }),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(z.object({ message: z.string() }), 'Sound file removed'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Sound file not found'),
  },
});

// Get sound settings
export const getSettings = createRoute({
  path: '/sounds/settings',
  method: 'get',
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(soundSettingsSchema, 'Current sound settings'),
  },
});

// Update sound settings
export const updateSettings = createRoute({
  path: '/sounds/settings',
  method: 'put',
  request: {
    body: jsonContentRequired(soundSettingsSchema, 'Sound settings to update'),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(soundSettingsSchema, 'Updated sound settings'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(soundSettingsSchema),
      'Validation error',
    ),
  },
});

// Serve sound file
export const serveFile = createRoute({
  path: '/sounds/files/{filename}',
  method: 'get',
  request: {
    params: z.object({
      filename: z.string(),
    }),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        'audio/*': {
          schema: z.any(),
        },
      },
      description: 'Sound file content',
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'File not found'),
  },
});

// Export route types for handlers
export type ListRoute = typeof list;
export type UploadRoute = typeof upload;
export type RemoveRoute = typeof remove;
export type GetSettingsRoute = typeof getSettings;
export type UpdateSettingsRoute = typeof updateSettings;
export type ServeFileRoute = typeof serveFile;
