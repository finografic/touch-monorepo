import { resolver } from 'hono-openapi';
import type * as v from 'valibot';

type AnyValibotSchema = v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>;

/** Equivalent of stoker's jsonContent() */
export const json = (schema: AnyValibotSchema, description: string) => ({
  description,
  content: {
    'application/json': { schema: resolver(schema) },
  },
});

/** Equivalent of stoker's jsonContentRequired() — marks body as required in OpenAPI spec */
export const jsonRequired = (schema: AnyValibotSchema, description: string) => ({
  ...json(schema, description),
  required: true,
});
