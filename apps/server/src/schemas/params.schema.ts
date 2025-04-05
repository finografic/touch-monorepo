import cuid from '@bugsnag/cuid';
import { z } from 'zod';

export const IdParamsSchema = z.object({
  id: z.string().refine((val) => cuid.isCuid(val), {
    message: 'Invalid ID format - must be a valid CUID',
  }),
});
