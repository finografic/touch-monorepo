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

export type SaveRoute = typeof save;
