import cuid from '@bugsnag/cuid';
import { z } from '@hono/zod-openapi';

export const IdCuidParamsSchema = z.object({
  id: z
    .string()
    .openapi({
      description: 'Resource identifier (CUID)',
      example: 'clh8k6w3f0003mp5hf1qdqn8q',
    })
    .refine((val) => cuid.isCuid(val), {
      message: 'Invalid ID format - must be a valid CUID',
    }),
});

export default IdCuidParamsSchema;
