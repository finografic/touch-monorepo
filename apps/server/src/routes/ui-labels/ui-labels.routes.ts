import { createRoute, z } from '@hono/zod-openapi';
import { notFoundSchema } from 'lib/zod.errors';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers';
import { createErrorSchema } from 'stoker/openapi/schemas';

const tags = ['UiLabels'];

// Schema for UI label data
const uiLabelItemSchema = z.object({
  key: z.string(),
  values: z.record(z.string(), z.string()), // { 'en-GB': 'value', 'es-ES': 'valor', ... }
});

const uiLabelSectionSchema = z.object({
  key: z.string(),
  items: z.array(uiLabelItemSchema),
});

const saveUiLabelsSchema = z.object({
  sections: z.array(uiLabelSectionSchema),
});

const saveResponseSchema = z.object({
  message: z.string(),
  filesUpdated: z.array(z.string()),
});

// Response schema for GET - includes sections with titles and descriptions
const uiLabelSectionWithMetadataSchema = uiLabelSectionSchema.extend({
  title: z.string(),
  description: z.string(),
});

const getUiLabelsResponseSchema = z.object({
  sections: z.array(uiLabelSectionWithMetadataSchema),
});

export const list = createRoute({
  path: '/ui-labels',
  method: 'get',
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(getUiLabelsResponseSchema, 'UI labels retrieved successfully'),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(notFoundSchema, 'Failed to load UI labels'),
  },
});

export const save = createRoute({
  path: '/ui-labels/save',
  method: 'post',
  request: {
    body: jsonContentRequired(saveUiLabelsSchema, 'UI labels data to save'),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(saveResponseSchema, 'UI labels saved successfully'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(saveUiLabelsSchema),
      'The validation error(s)',
    ),
  },
});

export type ListRoute = typeof list;
export type SaveRoute = typeof save;
