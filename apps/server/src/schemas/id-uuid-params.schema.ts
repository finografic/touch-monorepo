import { z } from '@hono/zod-openapi';

export const IdUuidParamsSchema = z.object({
  id: z
    .string()
    .openapi({
      description: 'Resource identifier (UUID)',
      example: 'c00b30ce-28da-4d7f-9e85-2fd75c1a2eba',
    })
    .uuid({
      message: 'Invalid ID format - must be a valid UUID',
    }),
});

export default IdUuidParamsSchema;
