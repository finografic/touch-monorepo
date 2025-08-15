import { isCuid } from '@bugsnag/cuid';
import { z } from 'zod';

export const IdParamsSchema = z.object({
  id: z.string().refine((val) => isCuid(val), {
    message: 'Invalid ID format - must be a valid CUID',
  }),
});
